import { Checkbox, Spinner } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import { groupBy, isEmpty } from 'lodash';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useCallback, useMemo } from 'react';

import { Select } from '../../components/common/Select';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { ScheduleDay } from '../../components/schedule/ScheduleDay';
import { SeasonTypeSelector } from '../../components/SeasonTypeSelector';
import { useRouterPageState } from '../../hooks/useRouterPageState';
import { useSeason } from '../../hooks/useSeason';
import { useSeasonType } from '../../hooks/useSeasonType';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { Game } from '../api/v1/schedule';
import { TeamInfo } from '../api/v1/teams';

const getTeamsListData = async (league: League, season: number | undefined) => {
  const seasonParam = season ? `&season=${season}` : '';
  return query(`api/v1/teams?league=${leagueNameToId(league)}${seasonParam}`);
};

export default ({ league }: { league: League }) => {
  const { type } = useSeasonType();
  const { season } = useSeason();

  const {
    selectedTeam: currentSelectedTeam,
    unplayedOnly,
    setRouterPageState,
  } = useRouterPageState<{
    selectedTeam: string;
    unplayedOnly: 'false' | 'true';
  }>({
    keys: ['selectedTeam', 'unplayedOnly'],
    initialState: {
      selectedTeam: '-1',
      unplayedOnly: 'false',
    },
  });

  const selectedTeam = parseInt(currentSelectedTeam);

  const { data: teamList } = useQuery<TeamInfo[]>({
    queryKey: ['teams', league, season],
    queryFn: () => getTeamsListData(league, season),
  });

  const { data } = useQuery<Game[]>({
    queryKey: ['schedule', league, season, type],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';

      return query(
        `api/v1/schedule?league=${leagueNameToId(
          league,
        )}&type=${type}${seasonParam}`,
      );
    },
  });

  const { teamSelectorList, teamSelectorMap } = useMemo(() => {
    if (!teamList) {
      return {
        teamSelectorList: null,
        teamSelectorMap: null,
      };
    }

    const selectorList = (
      teamList
        ?.map((team) => [team.id, team.name])
        .concat([[-1, 'All Teams']]) as [number, string][]
    ).sort((a, b) => a[1].localeCompare(b[1]));

    return {
      teamSelectorList: selectorList.map((team) => team[0]),
      teamSelectorMap: new Map<number, string>(selectorList),
    };
  }, [teamList]);

  const onTeamSelection = useCallback(
    (team: number) => {
      setRouterPageState('selectedTeam', team);
    },
    [setRouterPageState],
  );

  const gamesByDate = useMemo(() => {
    return groupBy(
      data
        ?.filter((game) => unplayedOnly === 'false' || !game.played)
        .filter(
          (game) =>
            selectedTeam === -1 ||
            game.awayTeam === selectedTeam ||
            game.homeTeam === selectedTeam,
        ),
      (game) => game.date,
    );
  }, [data, selectedTeam, unplayedOnly]);

  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} Schedule`}
        openGraph={{
          title: `${league.toUpperCase()} Schedule`,
        }}
      />
      <Header league={league} activePage="schedule" />
      <div className="m-auto w-full bg-grey100 py-10 lg:w-3/4 lg:p-[2.5%]">
        {!teamList || !teamSelectorList || !teamSelectorMap || !data ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-2 md:mr-8 md:flex-row md:justify-end md:space-y-0 md:space-x-2">
              <SeasonTypeSelector className="!h-7 w-48" />
              <Select<number>
                options={teamSelectorList}
                selectedOption={selectedTeam}
                onSelection={onTeamSelection}
                optionsMap={teamSelectorMap}
                className="!h-7 w-56"
              />
              <Checkbox
                isChecked={unplayedOnly === 'true'}
                onChange={() =>
                  setRouterPageState(
                    'unplayedOnly',
                    unplayedOnly === 'true' ? 'false' : 'true',
                  )
                }
              >
                Hide Played Games
              </Checkbox>
            </div>
            <div className="mx-auto mb-10 flex w-11/12 flex-wrap justify-evenly">
              {isEmpty(gamesByDate) && (
                <div className="mt-8 text-3xl font-bold">No games found</div>
              )}
              {Object.entries(gamesByDate)
                .sort((a, b) => {
                  const aDate = new Date(a[0]);
                  const bDate = new Date(b[0]);
                  console.log(
                    'times.',
                    aDate,
                    bDate,
                    aDate.getTime(),
                    bDate.getTime(),
                  );
                  return aDate.getTime() - bDate.getTime();
                })
                .map(([date, games]) => (
                  <ScheduleDay
                    key={date}
                    league={league}
                    date={date}
                    games={games}
                    teamData={teamList}
                  />
                ))}
            </div>
          </>
        )}
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

  return {
    props: {
      league,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
