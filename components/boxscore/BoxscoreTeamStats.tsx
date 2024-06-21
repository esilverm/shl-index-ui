import { Skeleton, SkeletonCircle } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useMemo } from 'react';

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
      firstColumn ? 'w-1/5' : 'flex-1 px-1',
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

const BoxscoreTeamStatsRow = ({
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
}) => {
  const faceoffPct = useMemo(() => {
    if (!data) return 0;

    return Math.round(
      (data.summary[team].faceoffWins * 100) /
        (data.summary.away.faceoffWins + data.summary.home.faceoffWins),
    );
  }, [data, team]);

  return (
    <div className="mb-2 flex w-full items-center text-xl font-semibold md:text-3xl">
      <TableCell firstColumn className="flex items-center text-lg">
        <SkeletonCircle
          isLoaded={!!gameData}
          width={50}
          height={50}
          className="mr-2"
        >
          <TeamLogo
            league={league}
            teamAbbreviation={gameData?.teams[team].abbr}
            className="size-full"
          />
        </SkeletonCircle>
        <div className="hidden md:inline-block">
          {gameData?.teams[team].nickname}
        </div>
      </TableCell>
      <TableCell isLoading={isLoading}>{data?.summary[team].shots}</TableCell>
      <TableCell isLoading={isLoading}>{faceoffPct}%</TableCell>
      <TableCell isLoading={isLoading}>
        {data?.summary[team].powerPlayGoals}/
        {data?.summary[team].powerPlayOpportunities}
      </TableCell>
      <TableCell isLoading={isLoading}>{data?.summary[team].pim}</TableCell>
      <TableCell isLoading={isLoading}>{data?.summary[team].hits}</TableCell>
      <TableCell isLoading={isLoading}>
        {data?.summary[team].giveaways}
      </TableCell>
      <TableCell isLoading={isLoading}>
        {data?.summary[team].takeaways}
      </TableCell>
    </div>
  );
};

export const BoxscoreTeamStats = ({
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

  return (
    <div className="flex w-full flex-col bg-primary p-4 pt-0">
      <div className="mb-2.5 flex border-b-4 border-b-grey300 py-2.5 font-mont text-sm font-semibold">
        <Skeleton isLoaded={!!gameData}>
          <span className="text-sm">{gameData?.game.date}</span>
        </Skeleton>
      </div>
      <div className="flex w-full items-center py-2.5">
        <TableCell firstColumn />
        <TableCell>SOG</TableCell>
        <TableCell>FO%</TableCell>
        <TableCell>PP</TableCell>
        <TableCell>PIM</TableCell>
        <TableCell>HITS</TableCell>
        <TableCell>GA</TableCell>
        <TableCell>TA</TableCell>
      </div>
      <BoxscoreTeamStatsRow
        league={league}
        data={data}
        isLoading={isLoading}
        gameData={gameData}
        team="away"
      />
      <BoxscoreTeamStatsRow
        league={league}
        data={data}
        isLoading={isLoading}
        gameData={gameData}
        team="home"
      />
    </div>
  );
};
