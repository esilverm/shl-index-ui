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

import { GoalieRatings } from '../../pages/api/v1/goalies/ratings/[id]';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

import { playerTableGlobalFilterFn } from './shared';
import { Table } from './Table';
import { SKATER_TABLE_FLAGS } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<GoalieRatings>();

export const GoalieRatingsTable = ({
  data,
  type = 'league',
}: {
  data: Array<GoalieRatings>;
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
        ],
      }),
      columnHelper.group({
        header: 'Goalie',
        columns: [
          columnHelper.accessor('blocker', {
            header: () => <TableHeader title="Blocker">BLO</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('glove', {
            header: () => <TableHeader title="Glove">GLO</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('passing', {
            header: () => <TableHeader title="Passing">PAS</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('pokeCheck', {
            header: () => <TableHeader title="Poke Check">POK</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('positioning', {
            header: () => <TableHeader title="Positioning">POS</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('rebound', {
            header: () => <TableHeader title="Rebound">REB</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('recovery', {
            header: () => <TableHeader title="Recovery">REC</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('puckhandling', {
            header: () => <TableHeader title="Puckhandling">PHA</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('lowShots', {
            header: () => <TableHeader title="Low Shots">LOW</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('reflexes', {
            header: () => <TableHeader title="Reflexes">REF</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('skating', {
            header: () => <TableHeader title="Skating">SKA</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Mental',
        columns: [
          columnHelper.accessor('mentalToughness', {
            header: () => (
              <TableHeader title="Mental Toughness">MTO</TableHeader>
            ),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('goalieStamina', {
            header: () => <TableHeader title="Goalie Stamina">GST</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'TPE',
        columns: [
          columnHelper.accessor('appliedTPE', {
            header: () => (
              <TableHeader title="Applied TPE">Applied</TableHeader>
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
    <Table<GoalieRatings>
      table={table}
      tableBehavioralFlags={SKATER_TABLE_FLAGS({ type, data: 'ratings' })}
      label={`${type}_goalie_ratings`}
    />
  );
};
