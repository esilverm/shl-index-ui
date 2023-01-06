import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import classnames from 'classnames';
import { useSeasonType } from 'hooks/useSeasonType';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { StandingsItem } from '../../pages/api/v1/standings';
import { isMainLeague, League } from '../../utils/leagueHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

import { Table } from './Table';
import { STANDINGS_TABLE } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<StandingsItem>();

export const StandingsTable = ({
  league,
  data,
  title,
}: {
  league: League;
  data: Array<StandingsItem>;
  title?: string;
}) => {
  const router = useRouter();
  const { type } = useSeasonType();

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        ({ position, abbreviation, location, name, id }) => [
          position,
          abbreviation,
          location,
          name,
          id,
        ],
        {
          header: title ?? 'Team',
          id: 'team',
          cell: (props) => {
            const cellValue = props.getValue();
            return (
              <Link
                href={{
                  pathname: '/[league]/team/[id]',
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    id: cellValue[4],
                  },
                }}
                className="grid min-w-0 max-w-[240px] grid-cols-[40px_40px_1fr] items-center pr-3 md:min-w-[200px] md:pr-0"
              >
                <span className="mr-4 text-right">{cellValue[0]}</span>
                <TeamLogo
                  league={league}
                  teamAbbreviation={cellValue[1] as string}
                  aria-label={`${cellValue[3]} logo`}
                  className="h-[30px] w-[30px]"
                />
                <span className="inline text-left text-blue600 md:hidden">
                  {cellValue[1]}
                </span>
                <span className="my-0 mx-2.5 hidden min-w-max text-left text-blue600 md:inline">
                  {cellValue[2]}
                </span>
              </Link>
            );
          },
          enableSorting: false,
        },
      ),
      columnHelper.accessor('gp', {
        header: () => <TableHeader title="Games Played">GP</TableHeader>,
      }),
      columnHelper.accessor('wins', {
        header: () => <TableHeader title="Wins">W</TableHeader>,
      }),
      ...(!isMainLeague(league) && type === 'Regular Season'
        ? [
            columnHelper.accessor('OTW', {
              header: () => (
                <TableHeader title="Wins in OT/SO">W O/S</TableHeader>
              ),
            }),
          ]
        : []),
      columnHelper.accessor('losses', {
        header: () => <TableHeader title="Losses">L</TableHeader>,
      }),
      columnHelper.accessor('OTL', {
        header: () => <TableHeader title="Overtime Losses">OT</TableHeader>,
      }),
      columnHelper.accessor('points', {
        header: () => <TableHeader title="Points">PTS</TableHeader>,
      }),
      columnHelper.accessor('winPercent', {
        header: () => <TableHeader title="Points Percentage">P%</TableHeader>,
      }),
      ...(isMainLeague(league)
        ? [
            columnHelper.accessor('ROW', {
              header: () => (
                <TableHeader title="Regulation plus Overtime Wins">
                  ROW
                </TableHeader>
              ),
            }),
          ]
        : []),
      columnHelper.accessor('goalsFor', {
        header: () => <TableHeader title="Goals For">GF</TableHeader>,
      }),
      columnHelper.accessor('goalsAgainst', {
        header: () => <TableHeader title="Goals Against">GA</TableHeader>,
      }),
      columnHelper.accessor('goalDiff', {
        cell: (props) => {
          const currentValue = props.getValue();
          return (
            <span
              className={classnames(
                currentValue === 0
                  ? 'text-grey900'
                  : currentValue > 0
                  ? 'text-[#48b400]'
                  : 'text-[#d60000]',
              )}
            >
              {currentValue > 0 && '+'}
              {currentValue}
            </span>
          );
        },
        header: () => <TableHeader title="Goal Differential">DIFF</TableHeader>,
        sortingFn: 'basic',
      }),
      columnHelper.accessor(
        ({ home }) => `${home.wins}-${home.losses}-${home.OTL}`,
        {
          id: 'homerecord',
          header: () => <TableHeader title="Home Record">HOME</TableHeader>,
          sortingFn: (a, b) => {
            const aPoints = a
              .getValue<string>('homerecord')
              .split('-')
              .reduce((sum: number, val: string | number, i: number) => {
                return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
              }, 0);
            const bPoints = b
              .getValue<string>('homerecord')
              .split('-')
              .reduce((sum: number, val: string | number, i: number) => {
                return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
              }, 0);

            if (aPoints > bPoints) return -1;
            else if (aPoints < bPoints) return 1;
            return 0;
          },
        },
      ),
      columnHelper.accessor(
        ({ away }) => `${away.wins}-${away.losses}-${away.OTL}`,
        {
          id: 'awayrecord',
          header: () => <TableHeader title="Away Record">AWAY</TableHeader>,
          sortingFn: (a, b) => {
            const aPoints = a
              .getValue<string>('awayrecord')
              .split('-')
              .reduce((sum: number, val: string | number, i: number) => {
                return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
              }, 0);
            const bPoints = b
              .getValue<string>('awayrecord')
              .split('-')
              .reduce((sum: number, val: string | number, i: number) => {
                return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
              }, 0);

            if (aPoints > bPoints) return -1;
            else if (aPoints < bPoints) return 1;
            return 0;
          },
        },
      ),
      columnHelper.accessor(
        ({ shootout }) => `${shootout.wins}-${shootout.losses}`,
        {
          id: 'shootout',
          header: () => (
            <TableHeader title="Record in games decided by Shootout">
              S/O
            </TableHeader>
          ),
        },
      ),
    ],
    [league, router.query, title],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table<StandingsItem>
      table={table}
      tableBehavioralFlags={STANDINGS_TABLE}
    />
  );
};
