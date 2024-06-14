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

import { PlayerWithAdvancedStats } from '../../typings/api';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

import { playerTableGlobalFilterFn } from './shared';
import { Table } from './Table';
import { SKATER_TABLE_FLAGS } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<PlayerWithAdvancedStats>();

export const SkaterAdvStatsTable = ({
  data,
  type = 'league',
}: {
  data: Array<PlayerWithAdvancedStats>;
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
                    className="inline-block w-full max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap text-left leading-none text-hyperlink dark:text-hyperlinkDark "
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
      columnHelper.accessor('gamesPlayed', {
        header: () => <TableHeader title="Games Played">GP</TableHeader>,
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.PDO', {
        header: () => (
          <TableHeader title="PDO (the sum of on-ice save percentage and on-ice shooting percentage)">
            PDO
          </TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.GF60', {
        header: () => (
          <TableHeader title="Goals For per 60 Minutes">GF/60</TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.GA60', {
        header: () => (
          <TableHeader title="Goals Against per 60 Minutes">GA/60</TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.SF60', {
        header: () => (
          <TableHeader title="Shots For per 60 Minutes">SF/60</TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.SA60', {
        header: () => (
          <TableHeader title="Shots Against per 60 Minutes">SA/60</TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.CF', {
        header: () => (
          <TableHeader title="Corsi For: Shot attempts for at even strength: Shots + Blocks + Misses">
            CF
          </TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.CA', {
        header: () => (
          <TableHeader title="Corsi Against: Shot attempts against at even strength: Shots + Blocks + Misses">
            CA
          </TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor(
        ({ advancedStats }) => advancedStats.CF - advancedStats.CA,
        {
          id: 'player-adv-corsi',
          header: () => <TableHeader title="Corsi: CF - CA">C</TableHeader>,
          enableGlobalFilter: false,
          sortDescFirst: true,
        },
      ),
      columnHelper.accessor('advancedStats.CFPct', {
        header: () => (
          <TableHeader title="Corsi For %: CF / (CF + CA)">CF%</TableHeader>
        ),
        cell: (props) => `${props.getValue()}%`,
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.CFPctRel', {
        header: () => (
          <TableHeader title="Corsi For % Relative: CF% - CFOff%">
            CF% Rel
          </TableHeader>
        ),
        cell: (props) => `${props.getValue()}%`,
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.FF', {
        header: () => (
          <TableHeader title="Fenwick For: (Shots on goal For + missed shots For)">
            FF
          </TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.FA', {
        header: () => (
          <TableHeader title="Fenwick Against: (Shots on goal Against + missed shots Against)">
            FA
          </TableHeader>
        ),
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor(
        ({ advancedStats }) => advancedStats.FF - advancedStats.FA,
        {
          id: 'player-adv-fenwick',
          header: () => <TableHeader title="Fenwick: FF - FA">F</TableHeader>,
          enableGlobalFilter: false,
          sortDescFirst: true,
        },
      ),
      columnHelper.accessor('advancedStats.FFPct', {
        header: () => <TableHeader title="Fenwick For %">FF%</TableHeader>,
        cell: (props) => `${props.getValue()}%`,
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
      columnHelper.accessor('advancedStats.FFPctRel', {
        header: () => (
          <TableHeader title="Fenwick For % Relative">FF% Rel</TableHeader>
        ),
        cell: (props) => `${props.getValue()}%`,
        enableGlobalFilter: false,
        sortDescFirst: true,
      }),
    ],
    [router.query, type],
  );

  const initialState = useMemo((): InitialTableState => {
    switch (type) {
      case 'league':
        return {
          pagination: {
            pageSize: 15,
          },
        };
      case 'team':
      case 'player':
        return {};
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
    <Table<PlayerWithAdvancedStats>
      table={table}
      tableBehavioralFlags={SKATER_TABLE_FLAGS({
        playerType: 'skater',
        type,
        data: 'adv',
      })}
      label={`${type}_skater_advanced_stats`}
    />
  );
};
