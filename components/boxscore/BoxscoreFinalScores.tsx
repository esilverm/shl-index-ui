import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';

import { BoxscoreSummary } from '../../pages/api/v2/schedule/game/boxscore/summary';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { League } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { TeamLogo } from '../TeamLogo';

const TableCell = ({
  children,
  className,
  firstColumn = false,
  isNumeric = false,
  isLoading = false,
}: {
  children?: React.ReactNode;
  className?: string;
  firstColumn?: boolean;
  isNumeric?: boolean;
  isLoading?: boolean;
}) => (
  <div
    className={classnames(
      'font-mont',
      isNumeric ? 'text-right' : !firstColumn && 'text-center',
      firstColumn ? 'w-2/5' : 'flex-1 px-1',
      className,
    )}
  >
    {!firstColumn ? (
      <Skeleton isLoaded={!isLoading}>{children}</Skeleton>
    ) : (
      children
    )}
  </div>
);

const TeamFinalScoreRow = ({
  league,
  gameData,
  data,
  isLoading,
  team,
}: {
  league: League;
  gameData: GamePreviewData | undefined;
  data: BoxscoreSummary | undefined;
  isLoading: boolean;
  team: 'away' | 'home';
}) => (
  <div
    className={classnames(
      'flex w-full items-center py-2',
      team === 'away' && 'border-b-2 border-b-grey200 dark:border-b-grey200Dark',
    )}
  >
    <TableCell firstColumn className="flex w-full items-center">
      <SkeletonCircle
        isLoaded={!!gameData}
        width={10}
        height={10}
        className="mr-1"
      >
        <TeamLogo
          league={league}
          teamAbbreviation={gameData?.teams[team].abbr}
        />
      </SkeletonCircle>
      <div className="flex flex-col">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
          {gameData?.teams[team].abbr}
        </div>
        <div className="text-xs text-grey700 dark:text-grey700Dark">
          {gameData?.teamStats[team].record}
        </div>
      </div>
    </TableCell>
    {data?.periodByPeriodStats.map((period, i) => {
      if (i === 3 && !gameData?.game.overtime) return null;
      if (i === 4 && !gameData?.game.shootout) return null;
      return (
        <TableCell isLoading={isLoading} key={i}>
          {period[team].goals}
        </TableCell>
      );
    })}
    <TableCell className="font-semibold" isLoading={isLoading}>
      {team === 'away' ? gameData?.game.awayScore : gameData?.game.homeScore}
    </TableCell>
  </div>
);

export const BoxscoreFinalScores = ({
  league,
  gameData,
}: {
  league: League;
  gameData: GamePreviewData | undefined;
}) => {
  const { data, isLoading } = useQuery<BoxscoreSummary>({
    queryKey: [
      `gameBoxscoreSummary`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/boxscore/summary?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const final = `Final${
    gameData?.game.shootout ? ' (SO)' : gameData?.game.overtime ? ' (OT)' : ''
  }`;

  return (
    <div className="flex w-full flex-col bg-grey100 px-4 pb-2 dark:bg-grey100Dark">
      <div className="flex w-full items-center border-b-2 border-b-grey300 py-2.5 font-mont text-xs dark:border-b-grey300Dark">
        <TableCell firstColumn className="w-2/5 text-sm font-semibold">
          {final}
        </TableCell>
        <TableCell>1ST</TableCell>
        <TableCell>2ND</TableCell>
        <TableCell>3RD</TableCell>
        {!!gameData?.game.overtime && <TableCell>OT</TableCell>}
        {!!gameData?.game.shootout && <TableCell>SO</TableCell>}
        <TableCell className="font-semibold">T</TableCell>
      </div>
      <TeamFinalScoreRow
        data={data}
        gameData={gameData}
        isLoading={isLoading}
        league={league}
        team="away"
      />
      <TeamFinalScoreRow
        data={data}
        gameData={gameData}
        isLoading={isLoading}
        league={league}
        team="home"
      />
    </div>
  );
};
