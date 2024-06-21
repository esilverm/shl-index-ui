import {
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorMode,
} from '@chakra-ui/react';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useEffect, useRef } from 'react';

import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header';
import { SeasonTypeSelector } from '../../../components/SeasonTypeSelector';
import { GoalieRatingsTable } from '../../../components/tables/GoalieRatingsTable';
import { GoalieScoreTable } from '../../../components/tables/GoalieScoreTable';
import { SkaterAdvStatsTable } from '../../../components/tables/SkaterAdvStatsTable';
import { SkaterRatingsTable } from '../../../components/tables/SkaterRatingsTable';
import { SkaterScoreTable } from '../../../components/tables/SkaterScoreTable';
import { TeamLogo } from '../../../components/TeamLogo';
import { useSeasonType } from '../../../hooks/useSeasonType';
import {
  Goalie,
  GoalieInfo,
  PlayerInfo,
  PlayerWithAdvancedStats,
} from '../../../typings/api';
import { League, leagueNameToId } from '../../../utils/leagueHelpers';
import { query } from '../../../utils/query';
import { seasonTypeToApiFriendlyParam } from '../../../utils/seasonTypeHelpers';
import { GoalieRatings } from '../../api/v1/goalies/ratings/[id]';
import { SkaterRatings as PlayerRatings } from '../../api/v1/players/ratings/[id]';

const fetchPlayerType = (league: League, playerId: string) =>
  query(
    `api/v2/player/playerType?league=${leagueNameToId(
      league,
    )}&playerId=${playerId}`,
  );
const fetchPlayerName = (league: League, playerId: string) =>
  query(
    `api/v2/player/playerName?league=${leagueNameToId(
      league,
    )}&playerId=${playerId}`,
  );

export default ({ playerId, league }: { playerId: string; league: League }) => {
  const router = useRouter();

  const { portalView } = router.query;

  const shouldShowIndexView = !portalView;

  const { setColorMode } = useColorMode();

  useEffect(() => {
    if (
      !shouldShowIndexView &&
      portalView &&
      (portalView === 'dark' || portalView === 'light')
    ) {
      if (portalView === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      setColorMode(portalView);
    }
  }, [shouldShowIndexView, portalView, setColorMode]);

  const { type } = useSeasonType();

  const { data: playerTypeInfo } = useQuery<{
    playerType: 'skater' | 'goalie';
  }>({
    queryKey: ['playerType', league, playerId],
    queryFn: () => fetchPlayerType(league, playerId),
  });

  const { data: playerNameInfo } = useQuery<{ name: string }>({
    queryKey: ['playerName', league, playerId],
    queryFn: () => fetchPlayerName(league, playerId),
  });

  const { data: playerInfo } = useQuery<PlayerInfo[] | GoalieInfo[]>({
    queryKey: ['playerInfo', league, playerId, playerTypeInfo?.playerType],
    queryFn: () => {
      const endpoint =
        playerTypeInfo?.playerType === 'goalie' ? 'goalies' : 'players';
      return query(
        `api/v1/${endpoint}/${playerId}?league=${leagueNameToId(league)}`,
      );
    },
    enabled: !!playerTypeInfo,
  });

  const { data: playerRatings } = useQuery<PlayerRatings[] | GoalieRatings[]>({
    queryKey: ['playerRatings', league, playerId, playerTypeInfo?.playerType],
    queryFn: () => {
      const endpoint =
        playerTypeInfo?.playerType === 'goalie' ? 'goalies' : 'players';
      return query(
        `api/v1/${endpoint}/ratings/${playerId}?league=${leagueNameToId(
          league,
        )}`,
      );
    },
    enabled: !!playerTypeInfo?.playerType,
  });

  const { data: playerStats } = useQuery<PlayerWithAdvancedStats[] | Goalie[]>({
    queryKey: [
      'playerStats',
      league,
      playerId,
      type,
      playerTypeInfo?.playerType,
    ],
    queryFn: () => {
      const seasonTypeParam = type
        ? `&type=${seasonTypeToApiFriendlyParam(type)}`
        : '';
      const endpoint =
        playerTypeInfo?.playerType === 'goalie' ? 'goalies' : 'players';
      return query(
        `api/v1/${endpoint}/stats/${playerId}?league=${leagueNameToId(
          league,
        )}${seasonTypeParam}`,
      );
    },
    enabled: !!playerTypeInfo?.playerType,
  });

  const isLoading = !playerInfo || !playerRatings || !playerStats;
  const loaderRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (shouldShowIndexView) return;

    const contentHeight = isLoading
      ? loaderRef.current?.offsetHeight
      : detailsRef.current?.offsetHeight;
    parent.postMessage(contentHeight ?? 0, '*');
  }, [isLoading, shouldShowIndexView]);

  return (
    <>
      <NextSeo
        title={playerNameInfo?.name ?? 'Player'}
        openGraph={{
          title: playerNameInfo?.name ?? 'Player',
        }}
      />
      {shouldShowIndexView && <Header league={league} activePage="players" />}
      <div
        className={classnames(
          'mx-auto w-full bg-grey100',
          shouldShowIndexView && 'p-[2.5%] lg:w-3/4 lg:px-0 lg:pb-10 lg:pt-px',
        )}
      >
        {isLoading ? (
          <div className="flex size-full items-center justify-center">
            <Spinner ref={loaderRef} size="xl" />
          </div>
        ) : (
          <div
            ref={detailsRef}
            className={classnames(
              'mx-auto',
              shouldShowIndexView && 'lg:w-11/12',
            )}
          >
            <div className="flex flex-col items-center md:mr-8 md:flex-row md:justify-end">
              <SeasonTypeSelector
                className={classnames('mb-4 md:mb-0 md:ml-4', {
                  'top-7 !h-7 w-48': shouldShowIndexView,
                })}
              />
            </div>
            {shouldShowIndexView && (
              <div className="my-2.5 flex flex-col items-center justify-center space-y-5">
                <TeamLogo
                  league={league}
                  teamAbbreviation={playerInfo[0]?.team}
                  className="mt-10 size-40 md:mt-2.5"
                />
                <div className="text-3xl font-bold uppercase">
                  {playerNameInfo?.name ?? 'Player'}
                </div>
                <div className="text-center font-mont text-lg uppercase">
                  {'position' in playerInfo[0] ? playerInfo[0].position : 'G'} |{' '}
                  {Math.floor(playerInfo[0].height / 12)} ft{' '}
                  {playerInfo[0].height % 12} in | {playerInfo[0].weight} lbs
                </div>
              </div>
            )}
            <Tabs>
              <TabList>
                <Tab
                  _selected={{
                    color: 'rgb(var(--hyperlink))',
                    borderBottomColor: 'rgb(var(--hyperlink))',
                  }}
                >
                  Stats
                </Tab>
                {playerTypeInfo?.playerType === 'skater' && (
                  <Tab
                    _selected={{
                      color: 'rgb(var(--hyperlink))',
                      borderBottomColor: 'rgb(var(--hyperlink))',
                    }}
                  >
                    Adv Stats
                  </Tab>
                )}
                <Tab
                  _selected={{
                    color: 'rgb(var(--hyperlink))',
                    borderBottomColor: 'rgb(var(--hyperlink))',
                  }}
                >
                  Ratings
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {playerTypeInfo?.playerType === 'skater' && (
                    <SkaterScoreTable
                      data={
                        playerStats as Exclude<typeof playerStats, Goalie[]>
                      }
                      type="player"
                    />
                  )}
                  {playerTypeInfo?.playerType === 'goalie' && (
                    <GoalieScoreTable
                      data={
                        playerStats as Exclude<
                          typeof playerStats,
                          PlayerWithAdvancedStats[]
                        >
                      }
                      type="player"
                    />
                  )}
                </TabPanel>
                {playerTypeInfo?.playerType === 'skater' && (
                  <TabPanel>
                    <SkaterAdvStatsTable
                      data={
                        playerStats as Exclude<typeof playerStats, Goalie[]>
                      }
                      type="player"
                    />
                  </TabPanel>
                )}

                <TabPanel>
                  {playerTypeInfo?.playerType === 'skater' && (
                    <SkaterRatingsTable
                      data={
                        playerRatings as Exclude<
                          typeof playerRatings,
                          GoalieRatings[]
                        >
                      }
                      type="player"
                    />
                  )}
                  {playerTypeInfo?.playerType === 'goalie' && (
                    <GoalieRatingsTable
                      data={
                        playerRatings as Exclude<
                          typeof playerRatings,
                          PlayerRatings[]
                        >
                      }
                      type="player"
                    />
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        )}
      </div>
      {shouldShowIndexView && <Footer />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient();
  const { league, id } = query;

  await queryClient.prefetchQuery({
    queryKey: ['playerType', league, id],
    queryFn: () => fetchPlayerType(league as League, id as string),
  });

  await queryClient.prefetchQuery({
    queryKey: ['playerName', league, id],
    queryFn: () => fetchPlayerName(league as League, id as string),
  });

  return {
    props: {
      league,
      playerId: id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
