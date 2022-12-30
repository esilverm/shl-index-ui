import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { Player } from '../../typings/api';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { calculateTimeOnIce } from '../../utils/playerHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

import {
  calculateColumnAverageForColumnID,
  calculateColumnSumForColumnID,
  calculateTimeColumnAverageForColumnID,
  playerTableGlobalFilterFn,
} from './shared';
import { Table } from './Table';
import { SKATER_TABLE_FLAGS } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<Player>();

export const SkaterScoreTable = ({
  data,
  type = 'league',
}: {
  data: Array<Player>;
  type: 'league' | 'team' | 'player';
}) => {
  const router = useRouter();

  const columns = useMemo(
    () => [
      columnHelper.group({
        header: '',
        id: 'player-table-basic-info',
        columns: [
          ...(type !== 'player'
            ? [
                columnHelper.accessor(({ name, id }) => [name, id], {
                  header: 'Player',
                  id: 'player-table-player',
                  enableGlobalFilter: true,
                  cell: (props) => {
                    const cellValue = props.getValue();
                    return (
                      <Link
                        href={{
                          pathname: `/[league]/player/[id]`,
                          query: {
                            ...onlyIncludeSeasonAndTypeInQuery(router.query),
                            id: cellValue[1],
                          },
                        }}
                        className="inline-block w-full max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-left leading-none text-blue600 "
                      >
                        {cellValue[0]}
                      </Link>
                    );
                  },
                }),
              ]
            : [
                columnHelper.accessor('season', {
                  id: 'player-table-season',
                  header: () => (
                    <TableHeader title="Season">Season</TableHeader>
                  ),
                  footer: () => (
                    <TableHeader title="Career Totals">Career</TableHeader>
                  ),
                }),
              ]),

          columnHelper.accessor('position', {
            enableGlobalFilter: true,
            header: () => <TableHeader title="Position">Pos</TableHeader>,
          }),
          ...(type !== 'team'
            ? [
                columnHelper.accessor('team', {
                  enableGlobalFilter: false,
                  header: () => <TableHeader title="Team">Team</TableHeader>,
                }),
              ]
            : []),
        ],
      }),
      columnHelper.group({
        header: 'Scoring',
        columns: [
          columnHelper.accessor('gamesPlayed', {
            header: () => <TableHeader title="Games Played">GP</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'gamesPlayed'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('goals', {
            header: () => <TableHeader title="Goals">G</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'goals'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('assists', {
            header: () => <TableHeader title="Assists">A</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'assists'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('points', {
            header: () => <TableHeader title="Points">PTS</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'points'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('plusMinus', {
            header: () => <TableHeader title="Plus/Minus">+/-</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'plusMinus'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('pim', {
            header: () => (
              <TableHeader title="Penalties in Minutes">PIM</TableHeader>
            ),
            footer: ({ table }) => calculateColumnSumForColumnID(table, 'pim'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Goals',
        columns: [
          columnHelper.accessor(
            ({ goals, ppGoals, shGoals }) => goals - ppGoals - shGoals,
            {
              header: () => (
                <TableHeader title="Even Strength Goals">EV</TableHeader>
              ),
              footer: ({ table }) =>
                calculateColumnSumForColumnID(table, 'player-table-esGoals'),
              id: 'player-table-esGoals',
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
          columnHelper.accessor('ppGoals', {
            header: () => (
              <TableHeader title="Power Play Goals">PP</TableHeader>
            ),
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'ppGoals'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('shGoals', {
            header: () => (
              <TableHeader title="Short-Handed Goals">SH</TableHeader>
            ),
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'shGoals'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Assists',
        columns: [
          columnHelper.accessor(
            ({ assists, ppAssists, shAssists }) =>
              assists - ppAssists - shAssists,
            {
              header: () => (
                <TableHeader title="Even Strength Assists">EV</TableHeader>
              ),
              footer: ({ table }) =>
                calculateColumnSumForColumnID(table, 'player-table-esAssists'),
              id: 'player-table-esAssists',
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
          columnHelper.accessor('ppAssists', {
            header: () => (
              <TableHeader title="Power Play Assists">PP</TableHeader>
            ),
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'ppAssists'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('shAssists', {
            header: () => (
              <TableHeader title="Short-Handed Assists">SH</TableHeader>
            ),
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'shAssists'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: '',
        id: 'player-table-shot-pct',
        columns: [
          columnHelper.accessor(
            ({ goals, shotsOnGoal }) =>
              `${((goals * 100) / Math.max(shotsOnGoal, 1)).toFixed(1)}%`,
            {
              header: () => (
                <TableHeader title="Shooting Percentage">S%</TableHeader>
              ),
              footer: ({ table }) =>
                `${calculateColumnAverageForColumnID(
                  table,
                  'player-table-spct',
                ).toFixed(1)}%`,
              id: 'player-table-spct',
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
        ],
      }),
      columnHelper.group({
        header: 'Ice Time',
        columns: [
          columnHelper.accessor(({ timeOnIce }) => (timeOnIce / 60) >> 0, {
            header: () => (
              <TableHeader title="Time on Ice (in Minutes)">TOI</TableHeader>
            ),
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'player-table-toi'),
            id: 'player-table-toi',
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor(
            ({ timeOnIce, gamesPlayed }) =>
              calculateTimeOnIce(timeOnIce, gamesPlayed),
            {
              header: () => (
                <TableHeader title="Average Time on Ice">ATOI</TableHeader>
              ),
              footer: ({ table }) =>
                calculateTimeColumnAverageForColumnID(table, 'timeOnIce'),
              id: 'player-table-averagetoi',
              sortingFn: ({ original: a }, { original: b }) =>
                a.timeOnIce / a.gamesPlayed - b.timeOnIce / b.gamesPlayed,
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
          columnHelper.accessor(
            ({ ppTimeOnIce, gamesPlayed }) =>
              calculateTimeOnIce(ppTimeOnIce, gamesPlayed),
            {
              header: () => (
                <TableHeader title="Average Power Play Time on Ice">
                  PPTOI
                </TableHeader>
              ),
              footer: ({ table }) =>
                calculateTimeColumnAverageForColumnID(table, 'ppTimeOnIce'),
              id: 'player-table-pptoi',
              sortingFn: ({ original: a }, { original: b }) =>
                a.ppTimeOnIce / a.gamesPlayed - b.ppTimeOnIce / b.gamesPlayed,
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
          columnHelper.accessor(
            ({ shTimeOnIce, gamesPlayed }) =>
              calculateTimeOnIce(shTimeOnIce, gamesPlayed),
            {
              header: () => (
                <TableHeader title="Average Short-Handed Time on Ice">
                  SHTOI
                </TableHeader>
              ),
              footer: ({ table }) =>
                calculateTimeColumnAverageForColumnID(table, 'shTimeOnIce'),
              id: 'player-table-shtoi',
              sortingFn: ({ original: a }, { original: b }) =>
                a.shTimeOnIce / a.gamesPlayed - b.shTimeOnIce / b.gamesPlayed,
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
        ],
      }),
      columnHelper.group({
        header: '',
        id: 'player-table-giveaway-takeaway',
        columns: [
          columnHelper.accessor('giveaways', {
            header: () => <TableHeader title="Giveaways">GA</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'giveaways'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('takeaways', {
            header: () => <TableHeader title="Takeaways">TA</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'takeaways'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Fights',
        columns: [
          columnHelper.accessor('fightWins', {
            header: () => <TableHeader title="Fight Wins">W</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'fightWins'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('fightLosses', {
            header: () => <TableHeader title="Fight Losses">L</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'fightLosses'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Faceoffs',
        columns: [
          columnHelper.accessor(
            ({ faceoffs, faceoffWins }) =>
              faceoffs && faceoffWins ? faceoffWins : '-',
            {
              id: 'player-table-faceoff-wins',
              header: () => <TableHeader title="Faceoff Wins">W</TableHeader>,
              footer: ({ table }) =>
                calculateColumnSumForColumnID(
                  table,
                  'player-table-faceoff-wins',
                ) || '-',
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
          columnHelper.accessor(
            ({ faceoffs, faceoffWins }) =>
              faceoffs && faceoffWins ? faceoffs - faceoffWins : '-',
            {
              id: 'player-table-faceoff-losses',
              header: () => <TableHeader title="Faceoff Losses">L</TableHeader>,
              footer: ({ table }) =>
                calculateColumnSumForColumnID(
                  table,
                  'player-table-faceoff-losses',
                ) || '-',
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
          columnHelper.accessor(
            ({ faceoffs, faceoffWins }) =>
              faceoffs && faceoffWins
                ? `${((faceoffWins / faceoffs) * 100).toFixed(1)}%`
                : '-',
            {
              id: 'player-table-faceoffPct',
              header: () => (
                <TableHeader title="Faceoff Win Percent">FO%</TableHeader>
              ),
              footer: ({ table }) => {
                const value = calculateColumnAverageForColumnID(
                  table,
                  'player-table-faceoffPct',
                );
                if (isNaN(value)) return '-';
                return `${value.toFixed(1)}%`;
              },
              enableGlobalFilter: false,
              sortDescFirst: true,
            },
          ),
        ],
      }),
      columnHelper.group({
        header: '',
        id: 'player-table-misc',
        columns: [
          columnHelper.accessor(({ gwg }) => gwg ?? '-', {
            id: 'player-table-gwg',
            header: () => (
              <TableHeader title="Game Winning Goals">GWG</TableHeader>
            ),
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'player-table-gwg'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('shotsBlocked', {
            header: () => <TableHeader title="Blocks">BLK</TableHeader>,
            footer: ({ table }) =>
              calculateColumnSumForColumnID(table, 'shotsBlocked'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('hits', {
            header: () => <TableHeader title="Hits">HIT</TableHeader>,
            footer: ({ table }) => calculateColumnSumForColumnID(table, 'hits'),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Game Rating',
        columns: [
          columnHelper.accessor('gameRating', {
            header: () => (
              <TableHeader title="Overall Game Rating">GR</TableHeader>
            ),
            footer: ({ table }) =>
              Math.round(
                calculateColumnAverageForColumnID(table, 'gameRating'),
              ),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('offensiveGameRating', {
            header: () => (
              <TableHeader title="Offensive Game Rating">OGR</TableHeader>
            ),
            footer: ({ table }) =>
              Math.round(
                calculateColumnAverageForColumnID(table, 'offensiveGameRating'),
              ),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('defensiveGameRating', {
            header: () => (
              <TableHeader title="Defensive Game Rating">DGR</TableHeader>
            ),
            footer: ({ table }) =>
              Math.round(
                calculateColumnAverageForColumnID(table, 'defensiveGameRating'),
              ),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
    ],
    [router.query, type],
  );

  const initialState = useMemo((): InitialTableState => {
    switch (type) {
      case 'league':
        return {
          sorting: [{ id: 'points', desc: true }],
          pagination: {
            pageSize: 15,
          },
        };
      case 'team':
        return {
          sorting: [{ id: 'points', desc: true }],
        };
      case 'player':
        return {
          sorting: [{ id: 'player-table-season', desc: true }],
        };
      default:
        return assertUnreachable(type);
    }
  }, [type]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(type === 'league'
      ? {
          enableGlobalFilter: true,
          globalFilterFn: playerTableGlobalFilterFn,
          getFilteredRowModel: getFilteredRowModel(),
          getPaginationRowModel: getPaginationRowModel(),
        }
      : {}),
    initialState,
  });

  return (
    <Table<Player>
      table={table}
      tableBehavioralFlags={SKATER_TABLE_FLAGS({ type, data: 'scoring' })}
      label={`${type}_skater_stats`}
    />
  );
};
