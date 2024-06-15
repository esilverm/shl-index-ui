import { Skeleton, Spinner, Tooltip } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useRouter } from 'next/router';

import { BoxscoreGoalie } from '../../pages/api/v2/schedule/game/boxscore/goalies';
import { BoxscoreSkater } from '../../pages/api/v2/schedule/game/boxscore/skaters';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { getPlayerShortname } from '../../utils/playerHelpers';
import { query } from '../../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

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
      'py-4 font-mont',
      isNumeric ? 'text-right' : !firstColumn && 'text-center',
      firstColumn ? 'w-[140px]' : 'flex-1',
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

const TableHeader = ({
  title,
  children,
  ...props
}: {
  title?: string;
  children?: React.ReactNode;
  firstColumn?: boolean;
  className?: string;
}) => (
  <TableCell {...props}>
    <Tooltip label={title} placement="top" isDisabled={!title}>
      {children}
    </Tooltip>
  </TableCell>
);

const TeamSkaterTable = ({
  skatersData,
  isLoading,
}: {
  skatersData: BoxscoreSkater[] | undefined;
  isLoading: boolean;
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full min-w-[800px] items-center border-y border-y-grey400 bg-grey200 px-4 text-xs text-grey600 dark:border-y-grey400Dark dark:bg-grey200Dark dark:text-grey600Dark">
        <TableHeader firstColumn className="border-r border-r-grey400 dark:border-r-grey400Dark">
          Skaters
        </TableHeader>
        <TableHeader title="Game Rating">GR</TableHeader>
        <TableHeader title="Offensive Game Rating">OGR</TableHeader>
        <TableHeader title="Defensive Game Rating">DGR</TableHeader>
        <TableHeader title="Goals">G</TableHeader>
        <TableHeader title="Assists">A</TableHeader>
        <TableHeader title="Points">P</TableHeader>
        <TableHeader title="Plus/Minus">+/-</TableHeader>
        <TableHeader title="Shots on Goal">SOG</TableHeader>
        <TableHeader title="Blocked Shots">BS</TableHeader>
        <TableHeader title="Penalties in Minutes">PIM</TableHeader>
        <TableHeader title="Hits">HIT</TableHeader>
        <TableHeader title="Takeaways">TA</TableHeader>
        <TableHeader title="Giveaways">GA</TableHeader>
        <TableHeader title="Shifts">SHF</TableHeader>
        <TableHeader title="Total time on Ice" className="px-2.5">
          TOT
        </TableHeader>
        <TableHeader title="Power Play time on Ice" className="px-2.5">
          PP
        </TableHeader>
        <TableHeader title="Short-handed time on Ice" className="px-2.5">
          SH
        </TableHeader>
        <TableHeader title="Faceoff Win %">FO%</TableHeader>
      </div>
      <div className="divide-y divide-grey400 dark:divide-grey400Dark">
        {skatersData?.map((player) => (
          <div
            key={player.id}
            className="flex w-full min-w-[800px] items-center px-4 text-xs"
          >
            <TableCell
              firstColumn
              className="border-r border-r-grey400 dark:border-r-grey400Dark"
              isLoading={isLoading}
            >
              <Link
                href={{
                  pathname: `/[league]/player/[id]`,
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    id: player.id,
                  },
                }}
                className="hover:underline"
              >
                {getPlayerShortname(player.name)}
              </Link>
            </TableCell>
            <TableCell isLoading={isLoading}>{player.gameRating}</TableCell>
            <TableCell isLoading={isLoading}>
              {player.offensiveGameRating}
            </TableCell>
            <TableCell isLoading={isLoading}>
              {player.defensiveGameRating}
            </TableCell>
            <TableCell isLoading={isLoading}>{player.goals}</TableCell>
            <TableCell isLoading={isLoading}>{player.assists}</TableCell>
            <TableCell isLoading={isLoading}>
              {player.goals + player.assists}
            </TableCell>
            <TableCell isLoading={isLoading}>
              {player.plusMinus > 0 ? '+' : ''}
              {player.plusMinus}
            </TableCell>
            <TableCell isLoading={isLoading}>{player.shots}</TableCell>
            <TableCell isLoading={isLoading}>{player.blocks}</TableCell>
            <TableCell isLoading={isLoading}>{player.pim}</TableCell>
            <TableCell isLoading={isLoading}>{player.hits}</TableCell>
            <TableCell isLoading={isLoading}>{player.takeaways}</TableCell>
            <TableCell isLoading={isLoading}>{player.giveaways}</TableCell>
            <TableCell isLoading={isLoading}>{player.shifts}</TableCell>
            <TableCell isLoading={isLoading} className="px-2.5">
              {player.timeOnIce}
            </TableCell>
            <TableCell isLoading={isLoading} className="px-2.5">
              {player.ppTimeOnIce}
            </TableCell>
            <TableCell isLoading={isLoading} className="px-2.5">
              {player.shTimeOnIce}
            </TableCell>

            <TableCell isLoading={isLoading}>
              <Tooltip
                label={`${player.faceoffWins}/${player.faceoffs} Faceoffs Won`}
                isDisabled={player.faceoffs === 0}
                placement="top"
              >
                {player.faceoffs > 0
                  ? `${((player.faceoffWins * 100) / player.faceoffs).toFixed(
                      1,
                    )}%`
                  : '-'}
              </Tooltip>
            </TableCell>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamGoalieTable = ({
  goaliesData,
  isLoading,
}: {
  goaliesData: BoxscoreGoalie[] | undefined;
  isLoading: boolean;
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-10 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex w-full min-w-[800px] items-center border-y border-y-grey400 bg-grey200 px-4 text-xs text-grey600 dark:border-y-grey400Dark dark:bg-grey200Dark dark:text-grey600Dark">
        <TableHeader firstColumn className="border-r border-r-grey400 dark:border-r-grey400Dark">
          Goalies
        </TableHeader>
        <TableHeader title="Game Rating">GR</TableHeader>
        <TableHeader title="Shots Against">SA</TableHeader>
        <TableHeader title="Goals Against">GA</TableHeader>
        <TableHeader title="Saves">SV</TableHeader>
        <TableHeader title="Save %">SV%</TableHeader>
        <TableHeader title="Time on Ice" className="px-2.5">
          TOI
        </TableHeader>
        <TableHeader title="Penalties in Minutes">PIM</TableHeader>
      </div>
      {goaliesData?.map(
        (player) =>
          player.minutesPlayed !== '00:00' && (
            <div
              key={player.id}
              className="flex w-full min-w-[800px] items-center border-b border-t-grey400 px-4 text-xs dark:border-t-grey400Dark"
            >
              <TableCell
                firstColumn
                className="border-r border-r-grey400 dark:border-r-grey400Dark"
                isLoading={isLoading}
              >
                <Link
                  href={{
                    pathname: `/[league]/player/[id]`,
                    query: {
                      ...onlyIncludeSeasonAndTypeInQuery(router.query),
                      id: player.id,
                    },
                  }}
                >
                  {getPlayerShortname(player.name)}
                </Link>
              </TableCell>
              <TableCell isLoading={isLoading}>{player.gameRating}</TableCell>
              <TableCell isLoading={isLoading}>{player.shotsAgainst}</TableCell>
              <TableCell isLoading={isLoading}>{player.goalsAgainst}</TableCell>
              <TableCell isLoading={isLoading}>{player.saves}</TableCell>
              <TableCell isLoading={isLoading}>
                {player.savePct.toFixed(3)}
              </TableCell>
              <TableCell isLoading={isLoading} className="px-2.5">
                {player.minutesPlayed}
              </TableCell>
              <TableCell isLoading={isLoading}>{player.pim}</TableCell>
            </div>
          ),
      )}
    </div>
  );
};

export const BoxscoreTeamRosters = ({
  gameData,
}: {
  gameData: GamePreviewData | undefined;
}) => {
  const { data: skatersData, isLoading: isLoadingSkaters } = useQuery<{
    away: BoxscoreSkater[];
    home: BoxscoreSkater[];
  }>({
    queryKey: [
      `gameBoxscoreSkaters`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/boxscore/skaters?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const { data: goaliesData, isLoading: isLoadingGoalies } = useQuery<{
    away: BoxscoreGoalie[];
    home: BoxscoreGoalie[];
  }>({
    queryKey: [
      `gameBoxscoreGoalies`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/boxscore/goalies?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  return (
    <div className="flex w-full flex-col bg-grey100 dark:bg-grey100Dark">
      {/* AWAY */}
      <h5 className="m-4 text-xl font-bold">
        {gameData?.teams.away.name} {gameData?.teams.away.nickname}
      </h5>
      <TeamSkaterTable
        skatersData={skatersData?.away}
        isLoading={isLoadingSkaters}
      />
      <TeamGoalieTable
        goaliesData={goaliesData?.away}
        isLoading={isLoadingGoalies}
      />
      {/* HOME */}
      <h5 className="m-4 text-xl font-bold">
        {gameData?.teams.home.name} {gameData?.teams.home.nickname}
      </h5>
      <TeamSkaterTable
        skatersData={skatersData?.home}
        isLoading={isLoadingSkaters}
      />
      <TeamGoalieTable
        goaliesData={goaliesData?.home}
        isLoading={isLoadingGoalies}
      />
    </div>
  );
};
