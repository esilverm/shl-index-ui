import { Tooltip } from '@chakra-ui/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { TeamStats } from '../../pages/api/v1/teams/stats';
import { League } from '../../utils/leagueHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

import { Table } from './Table';
import { TEAM_STATS_TABLE } from './tableBehavioralFlags';
import { TableHeader } from './TableHeader';

const columnHelper = createColumnHelper<TeamStats>();

export const TeamStatsTable = ({
  league,
  data,
}: {
  league: League;
  data: Array<TeamStats>;
}) => {
  const router = useRouter();

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        ({ name, abbreviation, id }) => [name, abbreviation, id],
        {
          header: 'Team',
          id: 'team',
          cell: (props) => {
            const cellValue = props.getValue();
            return (
              <Link
                href={{
                  pathname: '/[league]/team/[id]',
                  query: {
                    ...onlyIncludeSeasonAndTypeInQuery(router.query),
                    id: cellValue[2],
                  },
                }}
                className="flex min-w-[75px] items-center"
              >
                <TeamLogo
                  league={league}
                  teamAbbreviation={cellValue[1] as string}
                  className="h-[30px] w-[30px]"
                />
                <span className="ml-1.5 text-left text-blue600 md:hidden">
                  {cellValue[1]}
                </span>
                <span className="my-0 mx-2.5 hidden min-w-max text-left text-blue600 md:inline">
                  {cellValue[0]}
                </span>
              </Link>
            );
          },
          enableSorting: false,
        },
      ),
      columnHelper.accessor('gamesPlayed', {
        header: () => <TableHeader title="Games Played">GP</TableHeader>,
      }),
      columnHelper.accessor('goalsFor', {
        header: () => <TableHeader title="Goals For">GF</TableHeader>,
      }),
      columnHelper.accessor('goalsAgainst', {
        header: () => <TableHeader title="Goals Against">GA</TableHeader>,
      }),
      columnHelper.accessor(
        ({ goalsFor, gamesPlayed }) => (goalsFor / gamesPlayed).toFixed(2),
        {
          id: 'GFperGP',
          header: () => (
            <TableHeader title="Goals For Per Game Played">GF/GP</TableHeader>
          ),
        },
      ),
      columnHelper.accessor(
        ({ goalsAgainst, gamesPlayed }) =>
          (goalsAgainst / gamesPlayed).toFixed(2),
        {
          id: 'GAperGP',
          header: () => (
            <TableHeader title="Goals Against Per Game Played">
              GA/GP
            </TableHeader>
          ),
        },
      ),
      columnHelper.accessor(
        ({ ppOpportunities, ppGoalsFor }) => ppGoalsFor / ppOpportunities,
        {
          id: 'PP%',
          header: () => (
            <TableHeader title="Power Play Percentage">PP%</TableHeader>
          ),
          cell: (props) => {
            const { ppOpportunities, ppGoalsFor } = props.row.original;
            return (
              <Tooltip
                label={`${ppGoalsFor}/${ppOpportunities} successful power plays`}
                placement="top"
              >
                <span>{(props.getValue() * 100).toFixed(1)}%</span>
              </Tooltip>
            );
          },
        },
      ),
      columnHelper.accessor(
        ({ shOpportunities, ppGoalsAgainst }) =>
          (shOpportunities - ppGoalsAgainst) / shOpportunities,
        {
          id: 'PK%',
          header: () => (
            <TableHeader title="Penalty Kill Percentage">PK%</TableHeader>
          ),
          cell: (props) => {
            const { shOpportunities, ppGoalsAgainst } = props.row.original;
            return (
              <Tooltip
                label={`${
                  shOpportunities - ppGoalsAgainst
                }/${shOpportunities} penalties killed`}
                placement="top"
              >
                <span>{(props.getValue() * 100).toFixed(1)}%</span>
              </Tooltip>
            );
          },
        },
      ),
      columnHelper.accessor(
        ({ shotsFor, gamesPlayed }) => (shotsFor / gamesPlayed).toFixed(2),
        {
          id: 'SFperGP',
          header: () => (
            <TableHeader title="Shots For Per Game Played">
              Shots/GP
            </TableHeader>
          ),
        },
      ),
      columnHelper.accessor(
        ({ shotsAgainst, gamesPlayed }) =>
          (shotsAgainst / gamesPlayed).toFixed(2),
        {
          id: 'SAperGP',
          header: () => (
            <TableHeader title="Shots Against Per Game Played">
              SA/GP
            </TableHeader>
          ),
        },
      ),
      columnHelper.accessor(
        ({ hits, gamesPlayed }) => (hits / gamesPlayed).toFixed(2),
        {
          id: 'HITperGP',
          header: () => (
            <TableHeader title="Hits Per Game Played">H/GP</TableHeader>
          ),
        },
      ),
      columnHelper.accessor('giveaways', {
        header: () => <TableHeader title="Giveaways">GvA</TableHeader>,
      }),
      columnHelper.accessor('takeaways', {
        header: () => <TableHeader title="Takeaways">TkA</TableHeader>,
      }),
      columnHelper.accessor('penaltyMinutesPerGame', {
        header: () => (
          <TableHeader title="Penalty Minutes Per Game">PIM/GP</TableHeader>
        ),
        cell: (props) => props.getValue().toFixed(2),
      }),
      columnHelper.accessor('shGoalsFor', {
        header: () => (
          <TableHeader title="Short Handed Goals For">SHGF</TableHeader>
        ),
      }),
      columnHelper.accessor('shGoalsAgainst', {
        header: () => (
          <TableHeader title="Short Handed Goals Against">SHGA</TableHeader>
        ),
      }),
      columnHelper.accessor('faceoffPct', {
        header: () => (
          <TableHeader title="Faceoff Win Percentage">FOW%</TableHeader>
        ),
        cell: (props) => `${props.getValue().toFixed(1)}%`,
      }),
    ],
    [league, router.query],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Table<TeamStats>
      table={table}
      tableBehavioralFlags={TEAM_STATS_TABLE}
      label={`${league}_team_stats`}
    />
  );
};
