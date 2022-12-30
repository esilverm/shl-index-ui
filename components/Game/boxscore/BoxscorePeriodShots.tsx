import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useMemo } from 'react';

import { BoxscoreSummary } from '../../../pages/api/v2/schedule/game/boxscore/summary';
import { GamePreviewData } from '../../../pages/api/v2/schedule/game/preview';
import { query } from '../../../utils/query';

import { periods } from './shared';

export const BoxscorePeriodShots = ({
  gameData,
}: {
  gameData: GamePreviewData | undefined;
}) => {
  const { data } = useQuery<BoxscoreSummary>({
    queryKey: [
      `gameBoxscoreSummary`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `/api/v2/schedule/game/boxscore/summary?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const shotsByPeriod = useMemo(
    () =>
      data?.periodByPeriodStats.flatMap((period, i) => {
        if (
          period.away.shots === undefined ||
          period.home.shots === undefined ||
          (i === 3 && !gameData?.game.overtime)
        )
          return [];
        return {
          homeShots: period.home.shots,
          awayShots: period.away.shots,
        };
      }),
    [data?.periodByPeriodStats, gameData?.game.overtime],
  );

  if (!gameData || !shotsByPeriod) {
    return (
      <div className="flex h-10 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-1 ml-4 text-sm font-medium text-grey700">
        Shots on Goal
      </div>
      <div className="flex w-full flex-col bg-grey100">
        <div className="flex w-full border-b border-b-grey500 bg-grey300 p-2.5 font-mont text-sm text-grey700">
          <div className="w-1/2">Period</div>
          <div className="flex-1">{gameData.teams.away.abbr}</div>
          <div className="flex-1">{gameData.teams.home.abbr}</div>
        </div>
        <div className="divide-y divide-grey500">
          {shotsByPeriod.map(({ awayShots, homeShots }, i) => (
            <div
              key={periods[i]}
              className={classnames(
                'flex w-full items-center py-6 px-2.5 font-mont',
              )}
            >
              <div className="w-1/2">{periods[i]}</div>
              <div className="flex-1">{awayShots}</div>
              <div className="flex-1">{homeShots}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
