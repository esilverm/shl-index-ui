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

import { Goalie } from '../../typings/api';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

import {
  calculateColumnAverageForColumnID,
  calculateColumnSumForColumnID,
  playerTableGlobalFilterFn,
} from './shared';
import { Table } from './Table';
import { SKATER_TABLE_FLAGS } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<Goalie>();

export const GoalieScoreTable = ({
  data,
  type = 'league',
}: {
  data: Array<Goalie>;
  type: 'league' | 'team' | 'player';
}) => {
  const router = useRouter();

  const columns = useMemo(
    () => [
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
                    className="inline-block w-full max-w-[180px] text-ellipsis  whitespace-nowrap text-left leading-none text-blue600 dark:text-hyperlink"
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
              header: () => <TableHeader title="Season">Season</TableHeader>,
              footer: () => (
                <TableHeader title="Career Totals">Career</TableHeader>
              ),
            }),
          ]),
      ...(type !== 'team'
        ? [
            columnHelper.accessor('team', {
              enableGlobalFilter: true,
              header: () => <TableHeader title="Team">Team</TableHeader>,
            }),
          ]
        : []),
      columnHelper.accessor('gamesPlayed', {
        header: () => <TableHeader title="Games Played">GP</TableHeader>,
        footer: ({ table }) =>
          calculateColumnSumForColumnID(table, 'gamesPlayed'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('minutes', {
        header: () => <TableHeader title="Minutes Played">MP</TableHeader>,
        footer: ({ table }) => calculateColumnSumForColumnID(table, 'minutes'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('wins', {
        header: () => <TableHeader title="Wins">W</TableHeader>,
        footer: ({ table }) => calculateColumnSumForColumnID(table, 'wins'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('losses', {
        header: () => <TableHeader title="Losses">L</TableHeader>,
        footer: ({ table }) => calculateColumnSumForColumnID(table, 'losses'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('ot', {
        header: () => <TableHeader title="Overtime Losses">OTL</TableHeader>,
        footer: ({ table }) => calculateColumnSumForColumnID(table, 'ot'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('shotsAgainst', {
        header: () => <TableHeader title="Shots Against">SHA</TableHeader>,
        footer: ({ table }) =>
          calculateColumnSumForColumnID(table, 'shotsAgainst'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('saves', {
        header: () => <TableHeader title="Saves">SAV</TableHeader>,
        footer: ({ table }) => calculateColumnSumForColumnID(table, 'saves'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('goalsAgainst', {
        header: () => <TableHeader title="Goals Against">GA</TableHeader>,
        footer: ({ table }) =>
          calculateColumnSumForColumnID(table, 'goalsAgainst'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('gaa', {
        header: () => (
          <TableHeader title="Goals Against Average">GAA</TableHeader>
        ),
        footer: ({ table }) =>
          calculateColumnAverageForColumnID(table, 'gaa').toFixed(2),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('shutouts', {
        header: () => <TableHeader title="Shutouts">SO</TableHeader>,
        footer: ({ table }) => calculateColumnSumForColumnID(table, 'shutouts'),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('savePct', {
        header: () => <TableHeader title="Save Percentage">SV%</TableHeader>,
        footer: ({ table }) =>
          calculateColumnAverageForColumnID(table, 'savePct').toFixed(3),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('gameRating', {
        header: () => <TableHeader title="Overall Game Rating">GR</TableHeader>,
        footer: ({ table }) =>
          Math.round(calculateColumnAverageForColumnID(table, 'gameRating')),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
    ],
    [router.query, type],
  );

  const initialState = useMemo((): InitialTableState => {
    switch (type) {
      case 'league':
      case 'team':
        return {
          sorting: [{ id: 'wins', desc: true }],
          pagination: {
            pageSize: 15,
          },
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
    <Table<Goalie>
      table={table}
      tableBehavioralFlags={SKATER_TABLE_FLAGS({
        playerType: 'goalie',
        type,
        data: 'scoring',
      })}
      label={`${type}_goalie_stats`}
    />
  );
};
