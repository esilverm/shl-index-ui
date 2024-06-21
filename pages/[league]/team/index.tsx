import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import { useEffect, useMemo, useState } from 'react';
import tinycolor from 'tinycolor2';

import { Link } from '../../../components/common/Link';
import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header';
import { TeamStatsTable } from '../../../components/tables/TeamStatsTable';
import { TeamLogo } from '../../../components/TeamLogo';
import { useSeason } from '../../../hooks/useSeason';
import {
  isMainLeague,
  League,
  leagueNameToId,
} from '../../../utils/leagueHelpers';
import { query } from '../../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../../utils/routingHelpers';
import { TeamInfo } from '../../api/v1/teams';
import { TeamStats } from '../../api/v1/teams/stats';

const getTeamsListData = async (league: League, season: number | undefined) => {
  const seasonParam = season ? `&season=${season}` : '';
  return query(`api/v1/teams?league=${leagueNameToId(league)}${seasonParam}`);
};
const getTeamsListStats = async (
  league: League,
  season: number | undefined,
) => {
  const seasonParam = season ? `&season=${season}` : '';
  return query(
    `api/v1/teams/stats?league=${leagueNameToId(league)}${seasonParam}`,
  );
};

export default ({ league }: { league: League }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const router = useRouter();
  const { season } = useSeason();

  const { data } = useQuery<TeamInfo[]>({
    queryKey: ['teams', league, season],
    queryFn: () => getTeamsListData(league, season),
  });

  const shouldShowTeamStats = !season || season >= 66;

  const { data: teamStats } = useQuery<TeamStats[]>({
    queryKey: ['teamsStats', league, season],
    queryFn: () => getTeamsListStats(league, season),
    enabled: shouldShowTeamStats,
  });

  const sortedTeams = useMemo(
    () =>
      data?.sort((a, b) => {
        if (isMainLeague(league)) {
          return a.nameDetails.first.localeCompare(b.nameDetails.first);
        }
        return a.nameDetails.second.localeCompare(b.nameDetails.second);
      }),
    [data, league],
  );

  // If users switch to a season that doesnt have team stats they can get stuck with an empty page
  useEffect(() => {
    if (!shouldShowTeamStats && currentTab === 1) {
      setCurrentTab(0);
    }
  }, [currentTab, shouldShowTeamStats]);

  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} Teams`}
        openGraph={{
          title: `${league.toUpperCase()} Teams`,
        }}
      />
      <Header league={league} activePage="team" />
      <div className="mx-auto w-full bg-grey100 pb-10 pt-px lg:w-3/4">
        <Tabs isLazy index={currentTab} onChange={setCurrentTab}>
          {shouldShowTeamStats && (
            <TabList className="mx-10 pt-8">
              <Tab>Team List</Tab>
              <Tab>Team Stats</Tab>
            </TabList>
          )}
          <TabPanels>
            <TabPanel px={0}>
              <div className="mt-5 grid auto-rows-[100px]  grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(500px,_1fr))]">
                {sortedTeams?.map((team) => (
                  <Link
                    key={team.id}
                    href={{
                      pathname: '/[league]/team/[id]',
                      query: {
                        ...onlyIncludeSeasonAndTypeInQuery(router.query),
                        id: team.id,
                      },
                    }}
                    className="m-auto flex size-[90%] items-center rounded-lg"
                    style={{ backgroundColor: team.colors.primary }}
                  >
                    <TeamLogo
                      league={league}
                      teamAbbreviation={team.abbreviation}
                      className="mx-[5%] h-3/5 drop-shadow-[0_0_1.15rem_rgba(0,_0,_0,_0.4)]"
                    />
                    <h2
                      className={classnames(
                        'text-2xl',
                        tinycolor(team.colors.primary).isDark()
                          ? 'text-grey100'
                          : 'text-grey900',
                      )}
                    >
                      <span className="block font-mont font-normal tracking-widest">
                        {team.nameDetails.first}
                      </span>
                      <span className="font-semibold uppercase tracking-[0.15rem]">
                        {team.nameDetails.second}
                      </span>
                    </h2>
                  </Link>
                ))}
              </div>
            </TabPanel>
            {shouldShowTeamStats && teamStats && (
              <TabPanel>
                <div className="mx-auto w-full md:w-11/12">
                  <TeamStatsTable data={teamStats} league={league} />
                </div>
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient();
  const { season, league } = query;

  const parsedSeason = parseInt(season as string);

  await queryClient.prefetchQuery({
    queryKey: ['teams', league, parsedSeason],
    queryFn: () => getTeamsListData(league as League, parsedSeason),
  });

  await queryClient.prefetchQuery({
    queryKey: ['teamsStats', league, parsedSeason],
    queryFn: () => getTeamsListStats(league as League, parsedSeason),
  });

  return {
    props: {
      league,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
