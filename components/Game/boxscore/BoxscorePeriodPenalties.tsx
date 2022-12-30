import { Spinner, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { groupBy } from 'lodash';
import { useMemo } from 'react';

import { BoxscorePenalties } from '../../../pages/api/v2/schedule/game/boxscore/penalties';
import { GamePreviewData } from '../../../pages/api/v2/schedule/game/preview';
import { query } from '../../../utils/query';

import { Period } from './shared';

const PeriodPenaltiesColumn = ({
  gameData,
  data,
  period,
}: {
  gameData: GamePreviewData;
  data: BoxscorePenalties[];
  period: Period;
}) => (
  <>
    <div className="flex w-full border-b border-b-grey500 bg-grey300 p-2.5 font-mont text-sm text-grey700">
      <div className="w-1/5">{period}</div>
      <div className="w-1/5">Team</div>
      <div className="flex-1">Penalty</div>
    </div>
    {!data ? (
      <div className="flex w-full items-center py-6 px-2.5">No Penalties</div>
    ) : (
      <div className="divide-y divide-grey500">
        {data.map((penalty, i) => {
          const teamColor =
            penalty.teamAbbr === gameData.teams.home.abbr
              ? gameData.teams.home.primaryColor
              : gameData.teams.away.primaryColor;
          return (
            <div
              key={i}
              className={classnames(
                'flex w-full items-center py-6 px-2.5 font-mont',
              )}
            >
              <Tooltip
                label={`${penalty.time.toLocaleString()} seconds into the period`}
              >
                <div className="w-1/5">{penalty.readableTime}</div>
              </Tooltip>
              <div className="w-1/5" style={{ color: teamColor }}>
                {penalty.teamAbbr}
              </div>
              <div className="flex-1">
                {penalty.player} for {penalty.reason} ({penalty.length} minutes)
              </div>
            </div>
          );
        })}
      </div>
    )}
  </>
);

export const BoxscorePeriodPenalties = ({
  gameData,
}: {
  gameData: GamePreviewData | undefined;
}) => {
  const { data } = useQuery<BoxscorePenalties[]>({
    queryKey: [
      `gameBoxscorePenalties`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `/api/v2/schedule/game/boxscore/penalties?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const penaltiesByPeriod = useMemo(() => groupBy(data, 'period'), [data]);

  if (!gameData || !data) {
    return (
      <div className="flex h-10 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-1 ml-4 text-sm font-medium text-grey700">
        Penalties
      </div>
      <div className="flex w-full flex-col bg-grey100">
        <PeriodPenaltiesColumn
          period="1st"
          data={penaltiesByPeriod[1]}
          gameData={gameData}
        />
        <PeriodPenaltiesColumn
          period="2nd"
          data={penaltiesByPeriod[2]}
          gameData={gameData}
        />
        <PeriodPenaltiesColumn
          period="3rd"
          data={penaltiesByPeriod[3]}
          gameData={gameData}
        />
        {!!gameData.game.overtime && (
          <PeriodPenaltiesColumn
            period="OT"
            data={penaltiesByPeriod[0]}
            gameData={gameData}
          />
        )}
      </div>
    </>
  );
};
