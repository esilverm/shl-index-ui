import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo } from 'react';

import { InternalPlayerAchievement } from '../../typings/portalApi';

import { Table } from './Table';
import { AWARD_TABLE_FLAGS } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<InternalPlayerAchievement>();

export const PlayerAwards = ({
  playerAwards,
}: {
  playerAwards: InternalPlayerAchievement[];
}) => {
  const columns = useMemo(
    () => [
      columnHelper.accessor('seasonID', {
        header: () => <TableHeader title="Season">Season</TableHeader>,
        enableGlobalFilter: true,
      }),
      columnHelper.accessor(
        (row) => {
          const result = row.isAward ? (row.won ? 'Won' : 'Nom') : '';
          return `${row.achievementName}${result ? ` - ${result}` : ''}`;
        },
        {
          id: 'awardResult',
          header: () => <TableHeader title="Award">Award</TableHeader>,
          enableGlobalFilter: true,
        },
      ),
      columnHelper.accessor('teamID', {
        header: () => <TableHeader title="Team">Team</TableHeader>, //Figure out way to put team Abbr or logo here
        enableGlobalFilter: true,
      }),
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: playerAwards,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'seasonID', desc: true }],
    },
  });

  return (
    <Table<InternalPlayerAchievement>
      table={table}
      tableBehavioralFlags={AWARD_TABLE_FLAGS()}
      label="player_awards"
    />
  );
};
