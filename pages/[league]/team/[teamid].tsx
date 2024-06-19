import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { partition } from 'lodash';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useEffect, useMemo, useState } from 'react';
import tinycolor from 'tinycolor2';

import { Footer } from '../../../components/Footer';
import { Header } from '../../../components/Header';
import { Lines } from '../../../components/lines/Lines';
import { SeasonTypeSelector } from '../../../components/SeasonTypeSelector';
import { GoalieRatingsTable } from '../../../components/tables/GoalieRatingsTable';
import { GoalieScoreTable } from '../../../components/tables/GoalieScoreTable';
import { SkaterAdvStatsTable } from '../../../components/tables/SkaterAdvStatsTable';
import { SkaterRatingsTable } from '../../../components/tables/SkaterRatingsTable';
import { SkaterScoreTable } from '../../../components/tables/SkaterScoreTable';
import { TeamLogo } from '../../../components/TeamLogo';
import { TeamStat } from '../../../components/teams/TeamStat';
import { useSeason } from '../../../hooks/useSeason';
import { useSeasonType } from '../../../hooks/useSeasonType';
import { Goalie, PlayerWithAdvancedStats } from '../../../typings/api';
import { League, leagueNameToId } from '../../../utils/leagueHelpers';
import { query } from '../../../utils/query';
import { seasonTypeToApiFriendlyParam } from '../../../utils/seasonTypeHelpers';
import { GoalieRatings } from '../../api/v1/goalies/ratings/[id]';
import { SkaterRatings } from '../../api/v1/players/ratings/[id]';
import { TeamInfo } from '../../api/v1/teams';
import { TeamLines } from '../../api/v1/teams/[id]/lines';
import { TeamStats } from '../../api/v1/teams/stats';

export default ({
  league,
  teamdata,
}: {
  league: League;
  teamdata: TeamInfo;
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const { name, colors, nameDetails, stats, abbreviation } = teamdata;
  const { season } = useSeason();
  const { type } = useSeasonType();

  const { data } = useQuery<(PlayerWithAdvancedStats | Goalie)[]>({
    queryKey: ['teamRoster', league, season, teamdata.id, type],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      const seasonTypeParam = type
        ? `&type=${seasonTypeToApiFriendlyParam(type)}`
        : '';
      return query(
        `api/v1/teams/${teamdata.id}/roster/stats?league=${leagueNameToId(
          league,
        )}${seasonParam}${seasonTypeParam}`,
      );
    },
  });

  const { data: skaterRatings } = useQuery<SkaterRatings[]>({
    queryKey: ['skaterRatings', league, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `api/v1/players/ratings?league=${leagueNameToId(league)}${seasonParam}`,
      );
    },
  });

  const { data: goalieRatings } = useQuery<GoalieRatings[]>({
    queryKey: ['goalieRatings', league, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `api/v1/goalies/ratings?league=${leagueNameToId(league)}${seasonParam}`,
      );
    },
  });

  const { data: teamLines, isLoading: isLoadingLines } = useQuery<TeamLines>({
    queryKey: ['teamLines', league, season, teamdata.id],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `api/v1/teams/${teamdata.id}/lines?league=${leagueNameToId(
          league,
        )}${seasonParam}`,
      );
    },
  });

  const shouldShowTeamStats = !season || season >= 66;

  const { data: teamStats, isLoading: isLoadingStats } = useQuery<TeamStats>({
    queryKey: ['teamStats', league, season, teamdata.id],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `api/v1/teams/${teamdata.id}/stats?league=${leagueNameToId(
          league,
        )}${seasonParam}`,
      );
    },
    enabled: shouldShowTeamStats,
  });

  const shouldShowLinesTab = !isLoadingLines && !!teamLines;

  const teamColorIsDark = useMemo(
    () => tinycolor(colors.primary).isDark(),
    [colors.primary],
  );

  const [rosterSkaters, rosterGoalies] = useMemo(
    () =>
      partition(data, ({ position }) => position !== 'G') as [
        Exclude<NonNullable<typeof data>[number], { position: 'G' }>[],
        Extract<NonNullable<typeof data>[number], { position: 'G' }>[],
      ],
    [data],
  );

  const { teamSkaterRatings, teamGoalieRatings } = useMemo(() => {
    return {
      teamSkaterRatings:
        skaterRatings?.filter(({ team }) => team === abbreviation) ?? [],
      teamGoalieRatings:
        goalieRatings?.filter(({ team }) => team === abbreviation) ?? [],
    };
  }, [abbreviation, goalieRatings, skaterRatings]);

  // If users switch to a season that doesnt have team stats they can get stuck with an empty page
  useEffect(() => {
    if (!shouldShowLinesTab && currentTab === 1) {
      setCurrentTab(0);
    }
  }, [currentTab, shouldShowLinesTab]);

  return (
    <>
      <NextSeo
        title={name}
        additionalMetaTags={[
          { property: 'theme-color', content: colors.primary },
        ]}
        openGraph={{
          title: name,
        }}
      />
      <Header league={league} activePage="team" daysToShow={10} />
      <div
        className="flex h-[40vh] min-h-[300px] w-full flex-col items-center py-[5%] md:flex-row md:py-0 md:px-[12.5%]"
        style={{ backgroundColor: colors.primary }}
      >
        <TeamLogo
          league={league}
          teamAbbreviation={abbreviation}
          className="mx-[5%] h-3/5 drop-shadow-[0_0_1.15rem_rgba(0,_0,_0,_0.4)]"
        />
        <div className="flex h-[30%] flex-col items-center justify-between text-center md:items-start md:text-left">
          <h1
            className={classnames(
              teamColorIsDark ? 'text-grey100 dark:text-white' : 'text-grey900 dark:text-white',
              'text-4xl',
            )}
          >
            <span className="block font-mont font-normal tracking-widest">
              {nameDetails.first}
            </span>
            <span className="block font-semibold uppercase tracking-[0.15rem]">
              {nameDetails.second}
            </span>
          </h1>
          <h3
            className={classnames(
              teamColorIsDark ? 'text-grey100 dark:text-white' : 'text-grey900 dark:text-white',
              'font-mont text-lg',
            )}
          >
            <span className="mr-4">
              {stats.wins} - {stats.losses} -{' '}
              {stats.overtimeLosses + stats.shootoutLosses}
            </span>{' '}
            | <span className="mx-4">{stats.points} PTS</span> |{' '}
            <span className="ml-4">{stats.winPercent.toFixed(3)}</span>
          </h3>
        </div>
      </div>
      <div className="m-auto w-full bg-grey100 p-[2.5%] dark:bg-backgroundGrey100 lg:w-3/4 lg:p-8">
        {shouldShowTeamStats && (
          <div className="mb-6 hidden flex-col space-y-6 sm:flex">
            <h3 className="text-4xl font-bold">Current Season Stats</h3>
            <div className="flex flex-wrap">
              <TeamStat
                label="Goals For"
                statValue={teamStats?.goalsFor ?? 0}
                statHelpText={`Per GP: ${
                  teamStats
                    ? (teamStats?.goalsFor / teamStats?.gamesPlayed).toFixed(2)
                    : '0.00'
                }`}
                isLoading={isLoadingStats}
              />
              <TeamStat
                label="Goals Against"
                statValue={teamStats?.goalsAgainst ?? 0}
                statHelpText={`Per GP: ${
                  teamStats
                    ? (
                        teamStats?.goalsAgainst / teamStats?.gamesPlayed
                      ).toFixed(2)
                    : '0.00'
                }`}
                isLoading={isLoadingStats}
              />
              <TeamStat
                label="Shots For/GP"
                statValue={
                  teamStats
                    ? (teamStats?.shotsFor / teamStats?.gamesPlayed).toFixed(2)
                    : '0.00'
                }
                statHelpText={`Total: ${teamStats?.shotsFor ?? 0}`}
                isLoading={isLoadingStats}
              />
              <TeamStat
                label="Shots Against/GP"
                statValue={
                  teamStats
                    ? (
                        teamStats?.shotsAgainst / teamStats?.gamesPlayed
                      ).toFixed(2)
                    : '0.00'
                }
                statHelpText={`Total: ${teamStats?.shotsAgainst ?? 0}`}
                isLoading={isLoadingStats}
              />
              <TeamStat
                label="Power Play %"
                statValue={
                  teamStats
                    ? `${(
                        (teamStats.ppGoalsFor * 100) /
                        teamStats.ppOpportunities
                      ).toFixed(1)}
                    %`
                    : '0.0%'
                }
                statHelpText={`${teamStats?.ppGoalsFor ?? 0}/${
                  teamStats?.ppOpportunities ?? 0
                } scored on`}
                isLoading={isLoadingStats}
              />
              <TeamStat
                label="Penalty Kill %"
                statValue={
                  teamStats
                    ? `${(
                        ((teamStats.shOpportunities -
                          teamStats.ppGoalsAgainst) *
                          100) /
                        teamStats.shOpportunities
                      ).toFixed(1)}
                    %`
                    : '0.0%'
                }
                statHelpText={`${
                  teamStats
                    ? teamStats?.shOpportunities - teamStats?.ppGoalsAgainst
                    : 0
                }/${teamStats?.shOpportunities ?? 0} killed `}
                isLoading={isLoadingStats}
              />
              <TeamStat
                label="Faceoff Win %"
                statValue={`${teamStats?.faceoffPct ?? '0.0'}%`}
                isLoading={isLoadingStats}
              />
            </div>
          </div>
        )}
        <Tabs index={currentTab} onChange={setCurrentTab}>
          {shouldShowLinesTab && (
            <TabList>
              <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Roster</Tab>
              <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Lines</Tab>
            </TabList>
          )}
          <TabPanels>
            <TabPanel px={0}>
              <div className="flex !h-7 items-center justify-center lg:float-right lg:inline-block ">
                <SeasonTypeSelector className="!h-7 w-48 dark:border-white dark:text-white lg:top-2" />
              </div>
              <h2 className="my-7 border-b border-b-grey900 py-1 text-4xl font-bold dark:border-b-LabelHeadingsDark">
                Skaters
              </h2>
              <Tabs>
                <TabList>
                  <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Stats</Tab>
                  <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Advanced Stats</Tab>
                  <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Ratings</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <SkaterScoreTable data={rosterSkaters} type="team" />
                  </TabPanel>
                  <TabPanel>
                    <SkaterAdvStatsTable data={rosterSkaters} type="team" />
                  </TabPanel>
                  <TabPanel>
                    <SkaterRatingsTable data={teamSkaterRatings} type="team" />
                  </TabPanel>
                </TabPanels>
              </Tabs>
              <h2 className="my-7 border-b border-b-grey900 py-1 text-4xl font-bold dark:border-b-LabelHeadingsDark">
                Goalies
              </h2>
              <Tabs>
                <TabList>
                  <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Stats</Tab>
                  <Tab  _selected={{
            color: 'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
            borderBottomColor:
              'rgb(var(--blue600)) dark:rgb(var(--hyperlink))',
          }}>Ratings</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <GoalieScoreTable data={rosterGoalies} type="team" />
                  </TabPanel>
                  <TabPanel>
                    <GoalieRatingsTable data={teamGoalieRatings} type="team" />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </TabPanel>
            {shouldShowLinesTab && (
              <TabPanel px={0}>
                <Lines league={league} lines={teamLines} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { league, teamid, season } = ctx.query;
    const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
      typeof league === 'string' ? league : 'shl',
    );

    const teamdata = await fetch(
      `https://index.simulationhockey.com/api/v1/teams/${teamid}?league=${leagueid}${
        season ? `&season=${season}` : ``
      }`,
    ).then((res) => res.json());

    return { props: { league, teamdata } };
  } catch (error) {
    ctx.res.statusCode = 404;

    return { props: { error } };
  }
};
