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

import { SkaterRatings } from '../../pages/api/v1/players/ratings/[id]';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';

import { playerTableGlobalFilterFn } from './shared';
import { Table } from './Table';
import { SKATER_TABLE_FLAGS } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<SkaterRatings>();

export const SkaterRatingsTable = ({
  data,
  type = 'league',
}: {
  data: Array<SkaterRatings>;
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
                        className="inline-block w-full max-w-[180px] truncate text-left leading-none text-blue600 "
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

          columnHelper.accessor('position', {
            header: () => <TableHeader title="Position">Pos</TableHeader>,
            enableGlobalFilter: true,
          }),
          ...(type !== 'team'
            ? [
                columnHelper.accessor('team', {
                  header: () => <TableHeader title="Team">Team</TableHeader>,
                  enableGlobalFilter: false,
                }),
              ]
            : []),
        ],
      }),
      columnHelper.group({
        header: 'Offensive',
        columns: [
          columnHelper.accessor('screening', {
            header: () => <TableHeader title="Screening">SCR</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('gettingOpen', {
            header: () => <TableHeader title="Getting Open">GTO</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('passing', {
            header: () => <TableHeader title="Passing">PAS</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('puckhandling', {
            header: () => <TableHeader title="Puck Handling">PHA</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('shootingAccuracy', {
            header: () => (
              <TableHeader title="Shooting Accuracy">SAC</TableHeader>
            ),
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('shootingRange', {
            header: () => <TableHeader title="Shooting Range">SRA</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('offensiveRead', {
            header: () => <TableHeader title="Offensive Read">OFR</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Defensive',
        columns: [
          columnHelper.accessor('checking', {
            header: () => <TableHeader title="Checking">CHE</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('hitting', {
            header: () => <TableHeader title="Hitting">HIT</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('positioning', {
            header: () => <TableHeader title="Positioning">POS</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('stickchecking', {
            header: () => <TableHeader title="Stick Checking">SCH</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('shotBlocking', {
            header: () => <TableHeader title="Shot Blocking">SBL</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('faceoffs', {
            header: () => <TableHeader title="Faceoffs">FOF</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('defensiveRead', {
            header: () => <TableHeader title="Defensive Read">DFR</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Physical',
        columns: [
          columnHelper.accessor('acceleration', {
            header: () => <TableHeader title="Acceleration">ACC</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('agility', {
            header: () => <TableHeader title="Agility">AGI</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('balance', {
            header: () => <TableHeader title="Balance">BAL</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('speed', {
            header: () => <TableHeader title="Speed">SPD</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('stamina', {
            header: () => <TableHeader title="Stamina">STA</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('strength', {
            header: () => <TableHeader title="Strength">STR</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('fighting', {
            header: () => <TableHeader title="Fighting">FIG</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
        ],
      }),
      columnHelper.group({
        header: 'Mental',
        columns: [
          columnHelper.accessor('aggression', {
            header: () => <TableHeader title="Aggression">AGR</TableHeader>,
            enableGlobalFilter: false,
            sortDescFirst: true,
          }),
          columnHelper.accessor('bravery', {
            header: () => <TableHeader title="Bravery">BRA</TableHeader>,
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
    <Table<SkaterRatings>
      table={table}
      tableBehavioralFlags={SKATER_TABLE_FLAGS({
        playerType: 'skater',
        type,
        data: 'ratings',
      })}
      label={`${type}_skater_ratings`}
    />
  );
};
