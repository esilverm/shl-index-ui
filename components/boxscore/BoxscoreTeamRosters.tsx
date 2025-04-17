import {
  Skeleton,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { SetStateAction, useState } from 'react';

import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { BoxscoreGoalie } from '../../pages/api/v3/schedule/game/boxscore/goalies';
import { BoxscoreSkater } from '../../pages/api/v3/schedule/game/boxscore/skaters';
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
      <div className="flex w-full min-w-[800px] items-center border-y border-y-table bg-boxscore-header px-4 text-xs text-boxscore-header">
        <TableHeader firstColumn className="border-r border-r-table">
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
      <div className="divide-y divide-table">
        {skatersData?.map((player) => (
          <div
            key={player.id}
            className="flex w-full min-w-[800px] items-center px-4 text-xs"
          >
            <TableCell
              firstColumn
              className="border-r border-r-table"
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
      <div className="flex w-full min-w-[800px] items-center border-y border-y-table bg-boxscore-header px-4 text-xs text-boxscore-header">
        <TableHeader firstColumn className="border-r border-r-table">
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
              className="flex w-full min-w-[800px] items-center border-b border-t-table px-4 text-xs"
            >
              <TableCell
                firstColumn
                className="border-r border-r-table"
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

const TeamShotTable = ({
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
      <div className="flex w-full min-w-[800px] items-center border-y border-y-table bg-boxscore-header px-4 text-xs text-boxscore-header">
        <TableHeader firstColumn className="border-r border-r-table">
          Skaters
        </TableHeader>
        <TableHeader title="Team Shots On (Player On Ice)">SF-On</TableHeader>
        <TableHeader title="Team Shots Against (Player On Ice)">
          SA-On
        </TableHeader>
        <TableHeader title="Shot Share % (Player On Ice)">
          Shot Share %
        </TableHeader>
        <TableHeader title="Team Shots On (Player Off Ice)">SF-Off</TableHeader>
        <TableHeader title="Team Shots Against (Player Off Ice)">
          SA-Off
        </TableHeader>
        <TableHeader title="Shot Share % (Player Off Ice)">
          Shot Share %
        </TableHeader>
        <TableHeader title="Team Goals For (Player On Ice)">GF-On</TableHeader>
        <TableHeader title="Team Goals For (Player Off Ice)">
          GF-Off
        </TableHeader>
        <TableHeader title="Team Shots Missed (Player On Ice)">
          SM-On
        </TableHeader>
        <TableHeader title="Team Shots Missed Against (Player On Ice)">
          SMA-On
        </TableHeader>
        <TableHeader title="Team Shots Blocked (Player On Ice)">
          SB-On
        </TableHeader>
        <TableHeader title="Team Shots Blocked Against (Player On Ice)">
          SBA-On
        </TableHeader>
      </div>
      <div className="divide-y divide-table">
        {skatersData?.map((player) => {
          const totalShotsOn =
            player.team_shots_on + player.team_shots_against_on;
          const totalShotsOff =
            player.team_shots_off + player.team_shots_against_off;

          return (
            <div
              key={player.id}
              className="flex w-full min-w-[800px] items-center px-4 text-xs"
            >
              <TableCell
                firstColumn
                className="border-r border-r-table"
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
              <TableCell isLoading={isLoading}>
                {player.team_shots_on}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_against_on}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {totalShotsOn > 0
                  ? `${((player.team_shots_on / totalShotsOn) * 100).toFixed(
                      1,
                    )}%`
                  : '0.0%'}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_off}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_against_off}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {totalShotsOff > 0
                  ? `${((player.team_shots_off / totalShotsOff) * 100).toFixed(
                      1,
                    )}%`
                  : '0.0%'}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_goals_on}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_goals_off}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_missed_on}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_missed_against_on}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_blocked_on}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {player.team_shots_blocked_against_on}
              </TableCell>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ZoneStartsTable = ({
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
      <div className="flex w-full min-w-[800px] items-center border-y border-y-table bg-boxscore-header px-4 text-xs text-boxscore-header">
        <TableHeader firstColumn className="border-r border-r-table">
          Skaters
        </TableHeader>
        <TableHeader title="Offensive Zone Starts">OZ</TableHeader>
        <TableHeader title="Offensive Zone Start %">OZ%</TableHeader>
        <TableHeader title="Neutral Zone Starts">NZ</TableHeader>
        <TableHeader title="Neutral Zone Start %">NZ%</TableHeader>
        <TableHeader title="Defensive Zone Starts">DZ</TableHeader>
        <TableHeader title="Defensive Zone Start %">DZ%</TableHeader>
        <TableHeader title="Total Zone Starts">Total</TableHeader>
      </div>
      <div className="divide-y divide-table">
        {skatersData?.map((player) => {
          const totalPlayerZoneStarts =
            player.oz_starts + player.nz_starts + player.dz_starts;
          return (
            <div
              key={player.id}
              className="flex w-full min-w-[800px] items-center px-4 text-xs"
            >
              <TableCell
                firstColumn
                className="border-r border-r-table"
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
              <TableCell isLoading={isLoading}>{player.oz_starts}</TableCell>
              <TableCell isLoading={isLoading}>
                {totalPlayerZoneStarts > 0
                  ? `${(
                      (player.oz_starts / totalPlayerZoneStarts) *
                      100
                    ).toFixed(1)}%`
                  : '0.0%'}
              </TableCell>
              <TableCell isLoading={isLoading}>{player.nz_starts}</TableCell>
              <TableCell isLoading={isLoading}>
                {totalPlayerZoneStarts > 0
                  ? `${(
                      (player.nz_starts / totalPlayerZoneStarts) *
                      100
                    ).toFixed(1)}%`
                  : '0.0%'}
              </TableCell>
              <TableCell isLoading={isLoading}>{player.dz_starts}</TableCell>
              <TableCell isLoading={isLoading}>
                {totalPlayerZoneStarts > 0
                  ? `${(
                      (player.dz_starts / totalPlayerZoneStarts) *
                      100
                    ).toFixed(1)}%`
                  : '0.0%'}
              </TableCell>
              <TableCell isLoading={isLoading}>
                {totalPlayerZoneStarts}
              </TableCell>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ShotQualityTable = ({
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
      <div className="flex w-full min-w-[600px] items-center border-y border-y-table bg-boxscore-header px-4 text-xs text-boxscore-header">
        <TableHeader firstColumn className="border-r border-r-table">
          Skaters
        </TableHeader>
        <TableHeader title="Shot Quality 0 (Low Danger)">SQ0</TableHeader>
        <TableHeader title="Shot Quality 1 (Low Danger)">SQ1</TableHeader>
        <TableHeader title="Shot Quality 2 (Medium Danger)">SQ2</TableHeader>
        <TableHeader title="Shot Quality 3 (High Danger)">SQ3</TableHeader>
        <TableHeader title="Shot Quality 4 (High Danger)">SQ4</TableHeader>
        <TableHeader title="Total Shots">Total</TableHeader>
      </div>
      <div className="divide-y divide-table">
        {skatersData?.map((player) => {
          const totalShots =
            player.sq0 + player.sq1 + player.sq2 + player.sq3 + player.sq4;

          return (
            <div
              key={player.id}
              className="flex w-full min-w-[600px] items-center px-4 text-xs"
            >
              <TableCell
                firstColumn
                className="border-r border-r-table"
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
              <TableCell isLoading={isLoading}>{player.sq0}</TableCell>
              <TableCell isLoading={isLoading}>{player.sq1}</TableCell>
              <TableCell isLoading={isLoading}>{player.sq2}</TableCell>
              <TableCell isLoading={isLoading}>{player.sq3}</TableCell>
              <TableCell isLoading={isLoading}>{player.sq4}</TableCell>
              <TableCell isLoading={isLoading}>{totalShots}</TableCell>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const BoxscoreTeamRosters = ({
  gameData,
  isFHM10,
}: {
  gameData: GamePreviewData | undefined;
  isFHM10: boolean;
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (index: SetStateAction<number>) => setTabIndex(index);

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
        `api/v3/schedule/game/boxscore/skaters?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
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
        `api/v3/schedule/game/boxscore/goalies?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const renderTeamSection = (team: 'away' | 'home', tabIndex: number) => {
    return (
      <>
        <h5 className="m-4 text-xl font-bold">
          {gameData?.teams[team].name} {gameData?.teams[team].nickname}
        </h5>
        {tabIndex === 0 && (
          <>
            <TeamSkaterTable
              skatersData={skatersData?.[team]}
              isLoading={isLoadingSkaters}
            />
            <TeamGoalieTable
              goaliesData={goaliesData?.[team]}
              isLoading={isLoadingGoalies}
            />
          </>
        )}
        {tabIndex === 1 && (
          <ZoneStartsTable
            skatersData={skatersData?.[team]}
            isLoading={isLoadingSkaters}
          />
        )}
        {tabIndex === 2 && (
          <TeamShotTable
            skatersData={skatersData?.[team]}
            isLoading={isLoadingSkaters}
          />
        )}
        {tabIndex === 3 && (
          <ShotQualityTable
            skatersData={skatersData?.[team]}
            isLoading={isLoadingSkaters}
          />
        )}
      </>
    );
  };

  return (
    <div className="flex w-full flex-col bg-table-row">
      <Tabs
        variant="enclosed"
        onChange={handleTabChange}
        colorScheme="blue"
        className="px-4 pt-4"
      >
        <TabList>
          <Tab>Regular</Tab>
          {isFHM10 && <Tab>Zone Starts</Tab>}
          {isFHM10 && <Tab>Team Shots</Tab>}
          {isFHM10 && <Tab>Shot Quality</Tab>}
        </TabList>
        <TabPanels>
          {/* Regular View Tab */}
          <TabPanel padding={0}>
            {renderTeamSection('away', tabIndex)}
            {renderTeamSection('home', tabIndex)}
          </TabPanel>

          {/* Zone Starts Tab */}
          <TabPanel padding={0}>
            {renderTeamSection('away', tabIndex)}
            {renderTeamSection('home', tabIndex)}
          </TabPanel>

          {/* Team Shot Tab */}
          <TabPanel padding={0}>
            {renderTeamSection('away', tabIndex)}
            {renderTeamSection('home', tabIndex)}
          </TabPanel>

          {/* Shot Quality Tab */}
          <TabPanel padding={0}>
            {renderTeamSection('away', tabIndex)}
            {renderTeamSection('home', tabIndex)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
};
