import { Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { GoalieStats } from '../../pages/api/v1/schedule/game/[gameId]';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { League } from '../../utils/leagueHelpers';
import { getPlayerShortname } from '../../utils/playerHelpers';
import { query } from '../../utils/query';

import { GamePreviewCard } from './GamePreviewCard';

const sortByGamesPlayed = (goalies: GoalieStats[]): GoalieStats[] =>
  goalies.sort((a, b) =>
    a.wins + a.losses + a.OT > b.wins + b.losses + b.OT ? -1 : 1,
  );

const statLabels = {
  record: 'Record',
  GAA: 'GAA',
  savePct: 'SV%',
  shutouts: 'SO',
} as const;

const VerticalGoalieList = ({
  goalieData,
  isLoading,
}: {
  goalieData: GoalieStats[];
  isLoading: boolean;
}) => {
  return (
    <>
      {Object.values(goalieData).map((goalie, i) => (
        <React.Fragment key={`goalie_${goalie.name}_${i}`}>
          <Skeleton isLoaded={!isLoading}>
            <span className="break-words font-semibold">
              {getPlayerShortname(goalie.name)}
            </span>
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <div className="mb-3 flex w-full items-center justify-between">
              <div className="flex flex-col font-mont text-sm text-secondary">
                <span>{statLabels.record}</span>
                <span className="font-semibold text-tertiary">
                  {goalie.wins}-{goalie.losses}-{goalie.OT}
                </span>
              </div>
              {Object.keys(goalie).map((stat, i) => {
                if (!(stat in statLabels)) {
                  return null;
                }
                const currentStat = stat as keyof typeof statLabels;
                return (
                  <div
                    className="flex flex-col font-mont text-sm text-secondary"
                    key={`${stat}_${i}_${goalie.name}`}
                  >
                    <span>{statLabels[currentStat]}</span>
                    <span className="font-semibold text-tertiary">
                      {currentStat === 'savePct'
                        ? goalie[currentStat].toFixed(3).padEnd(4, '0')
                        : currentStat === 'record'
                        ? assertUnreachable(currentStat as never)
                        : goalie[currentStat]}
                    </span>
                  </div>
                );
              })}
            </div>
          </Skeleton>
        </React.Fragment>
      ))}
    </>
  );
};

export const GoalieComparison = ({
  league,
  previewData,
}: {
  league: League;
  previewData: GamePreviewData | undefined;
}) => {
  const { data, isLoading } = useQuery<{
    away: GoalieStats[];
    home: GoalieStats[];
  }>({
    queryKey: [
      `gamePreviewGoalieStats`,
      previewData?.game.league,
      previewData?.game.season,
      previewData?.game.type,
      previewData?.game.awayTeam,
      previewData?.game.homeTeam,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/goalieStats?league=${previewData?.game.league}&season=${previewData?.game.season}&type=${previewData?.game.type}&away=${previewData?.game.awayTeam}&home=${previewData?.game.homeTeam}`,
      ),
    enabled: !!previewData,
  });

  const sortedAwayGoalies = useMemo(
    () => (data?.away ? sortByGamesPlayed(data?.away) : []),
    [data?.away],
  );

  const sortedHomeGoalies = useMemo(
    () => (data?.home ? sortByGamesPlayed(data?.home) : []),
    [data?.home],
  );

  return (
    <GamePreviewCard
      title="Goaltender Comparison"
      league={league}
      awayAbbr={previewData?.teams.away.abbr}
      homeAbbr={previewData?.teams.home.abbr}
    >
      <div className="flex flex-col justify-between md:flex-row">
        <div className="hidden w-[200px] flex-col p-4 md:flex">
          <VerticalGoalieList
            goalieData={sortedAwayGoalies}
            isLoading={isLoading}
          />
        </div>
        <div className="hidden w-[200px] flex-col p-4 text-right md:flex">
          <VerticalGoalieList
            goalieData={sortedHomeGoalies}
            isLoading={isLoading}
          />
        </div>
        <div className="flex flex-col justify-center md:hidden">
          {new Array(
            Math.max(sortedAwayGoalies.length, sortedHomeGoalies.length),
          )
            .fill(0)
            .map((_, i) => {
              const awayGoalie = sortedAwayGoalies[i];
              const homeGoalie = sortedHomeGoalies[i];
              if (!awayGoalie && !homeGoalie) return null;

              return (
                <div className="flex flex-col p-2.5" key={i}>
                  <div className="flex w-full items-center justify-between break-all">
                    <div className="mt-4 flex-1 break-words font-semibold">
                      {awayGoalie && getPlayerShortname(awayGoalie?.name)}
                    </div>
                    <div className="mt-4 flex-1 break-words text-right font-semibold">
                      {homeGoalie && getPlayerShortname(homeGoalie?.name)}
                    </div>
                  </div>
                  {Object.keys(statLabels).map((stat, i) => {
                    const currentStat = stat as keyof typeof statLabels;

                    return (
                      <div
                        className="mt-2 flex w-full items-center justify-between break-all font-mont text-sm"
                        key={`${stat}_${i}`}
                      >
                        <div className="flex-1 break-words font-semibold text-grey600">
                          {awayGoalie &&
                            (currentStat === 'record'
                              ? `${awayGoalie.wins}-${awayGoalie.losses}-${awayGoalie.OT}`
                              : currentStat === 'savePct'
                              ? awayGoalie[currentStat]
                                  .toFixed(3)
                                  .padEnd(5, '0')
                              : currentStat === 'GAA'
                              ? awayGoalie[currentStat]
                                  .toFixed(2)
                                  .padEnd(4, '0')
                              : awayGoalie[currentStat])}
                        </div>
                        <span className="font-semibold text-grey800">
                          {statLabels[currentStat]}
                        </span>
                        <div className="flex-1 break-words text-right font-semibold text-grey600">
                          {homeGoalie &&
                            (currentStat === 'record'
                              ? `${homeGoalie.wins}-${homeGoalie.losses}-${homeGoalie.OT}`
                              : currentStat === 'savePct'
                              ? homeGoalie[currentStat]
                                  .toFixed(3)
                                  .padEnd(5, '0')
                              : currentStat === 'GAA'
                              ? homeGoalie[currentStat]
                                  .toFixed(2)
                                  .padEnd(4, '0')
                              : homeGoalie[currentStat])}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </div>
    </GamePreviewCard>
  );
};
