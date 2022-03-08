import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';

import Link from '../../components/LinkWithSeason';

interface Props {
  league: string;
  data:
    | {
        position: number;
        id: number;
        name: string;
        location: string;
        abbreviation: string;
        division?: string;
        conference?: string;
        gp: number;
        wins: number;
        losses: number;
        OTL: number;
        points: number;
        winPercent: string;
        ROW: number;
        goalsFor: number;
        goalsAgainst: number;
        goalDiff: number;
        home: {
          wins: number;
          losses: number;
          OTL: number;
        };
        away: {
          wins: number;
          losses: number;
          OTL: number;
        };
        shootout: {
          wins: number;
          losses: number;
        };
      }
    | Array<{
        name: string;
        teams: Array<{
          position: number;
          id: number;
          name: string;
          location: string;
          abbreviation: string;
          gp: number;
          wins: number;
          losses: number;
          OTL: number;
          points: number;
          winPercent: string;
          ROW: number;
          goalsFor: number;
          goalsAgainst: number;
          goalDiff: number;
          home: {
            wins: number;
            losses: number;
            OTL: number;
          };
          away: {
            wins: number;
            losses: number;
            OTL: number;
          };
          shootout: {
            wins: number;
            losses: number;
          };
        }>;
      }>;
  isLoading: boolean;
  title?: string;
}

function StandingsTable({
  league,
  data: standings,
  isLoading,
  title = 'Team',
}: Props): JSX.Element {
  const columnData = [
    {
      Header: 'PO',
      accessor: 'position',
      title: 'Position',
    },
    {
      Header: 'Teams',
      accessor: ({ position, abbreviation, location, name, id }) => [
        position,
        abbreviation,
        location,
        name,
        id,
      ],
      id: 'team',
      Cell: ({ value }) => {
        return (
          <Link
            href="/[league]/sths/rosters#[team]"
            as={`/${league}/sths/rosters#${value[3].replace(' ', '')}`}
            passHref
          >
            <TeamWrapper>
              <span className="name">{value[3]}</span>
            </TeamWrapper>
          </Link>
        );
      },
    },
    {
      Header: 'GP',
      accessor: 'gp',
      title: 'Games Played',
    },
    {
      Header: 'W',
      accessor: 'wins',
      title: 'Wins',
    },
    {
      Header: 'L',
      accessor: 'losses',
      title: 'Losses',
    },
    {
      Header: 'OTL',
      accessor: 'OTL',
      title: 'Overtime Losses',
    },
    {
      Header: 'P',
      accessor: 'points',
      Cell: ({ value }) => <strong>{value}</strong>,
      title: 'Points',
    },
    {
      Header: 'ROW',
      accessor: 'ROW',
      title: 'Regulation plus Overtime Wins',
    },
    {
      Header: 'GF',
      accessor: 'goalsFor',
      title: 'Goals For',
    },
    {
      Header: 'GA',
      accessor: 'goalsAgainst',
      title: 'Goals Against',
    },
    {
      Header: 'DIFF',
      accessor: 'goalDiff',
      Cell: ({ value }) => (
        <span>
          {value > 0 && '+'}
          {value}
        </span>
      ),
      title: 'Goal Differential',
      sortType: 'basic',
    },
    {
      Header: 'P%',
      accessor: 'winPercent',
      title: 'Points Percentage',
    },
    {
      Header: 'HOME',
      accessor: ({ home }) => {
        return `${home.wins}-${home.losses}-${home.OTL}`;
      },
      id: 'homerecord',
      title: 'Home Record',
      Cell: ({ value }) => <HomeAwayRecords>{value}</HomeAwayRecords>,
      sortType: (a, b) => {
        const aPoints = a.values.homerecord.split('-').reduce((sum, val, i) => {
          return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
        }, 0);
        const bPoints = b.values.homerecord.split('-').reduce((sum, val, i) => {
          return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
        }, 0);

        if (aPoints > bPoints) return -1;
        else if (aPoints < bPoints) return 1;
        return 0;
      },
    },
    {
      Header: 'AWAY',
      accessor: ({ away }) => {
        return `${away.wins}-${away.losses}-${away.OTL}`;
      },
      id: 'awayrecord',
      title: 'Away Record',
      Cell: ({ value }) => <HomeAwayRecords>{value}</HomeAwayRecords>,
      sortType: (a, b) => {
        const aPoints = a.values.awayrecord.split('-').reduce((sum, val, i) => {
          return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
        }, 0);
        const bPoints = b.values.awayrecord.split('-').reduce((sum, val, i) => {
          return sum + +val * (i === 0 ? 2 : i === 2 ? 1 : 0);
        }, 0);

        if (aPoints > bPoints) return -1;
        else if (aPoints < bPoints) return 1;
        return 0;
      },
    },
    {
      Header: 'S/O',
      accessor: ({ shootout }) => {
        return `${shootout.wins}-${shootout.losses}`;
      },
      id: 'shootout',
      title: 'Record in games decided by Shootout',
      Cell: ({ value }) => <ShootoutRecords>{value}</ShootoutRecords>,
    },
  ];

  const fakeRows = {
    shl: 20,
    smjhl: 12,
    iihf: 14,
    wjc: 8,
  };

  const data = useMemo(
    () =>
      isLoading
        ? Array(fakeRows[league]).fill({
            position: 0,
            id: 0,
            name: '',
            location: '',
            abbreviation: '',
            gp: 0,
            wins: 0,
            losses: 0,
            OTL: 0,
            points: 0,
            winPercent: '',
            ROW: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDiff: 0,
            home: { wins: 0, losses: 0, OTL: 0 },
            away: { wins: 0, losses: 0, OTL: 0 },
            shootout: { wins: 0, losses: 0 },
          })
        : standings,
    [isLoading, standings]
  );

  const columns = useMemo(
    () =>
      isLoading
        ? columnData.map((column) => ({
            ...column,
            Cell: <Skeleton height={18} width="80%" />,
          }))
        : columnData,
    [isLoading, title]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    // apply the table props
    <TableContainer>
      <Table {...getTableProps()}>
        <TableHeader>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup, i) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column, i) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      title={column.title}
                      key={`${i}_${column.id}`}
                      className={
                        column.isSorted
                          ? column.isSortedDesc
                            ? 'sorted--desc'
                            : 'sorted--asc'
                          : ''
                      }
                    >
                      {
                        // Render the header
                        column.render('Header')
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </TableHeader>
        {/* Apply the table body props */}
        <TableBody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row, i) => {
              // Prepare the row for display
              prepareRow(row);

              return (
                // Apply the row props
                <tr {...row.getRowProps()} key={i}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell, i) => {
                      // Apply the cell props
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={i}
                          className={cell.column.isSorted ? 'sorted' : ''}
                        >
                          {
                            // Render the cell contents
                            cell.render('Cell')
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableContainer = styled.div`
  font-family: arial;

  tr:not(:last-child) th,
  tr:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
  }
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
`;

const TableHeader = styled.thead`
  position: relative;

  tr {
    display: table-row;
  }

  th {
    font-weight: 400;
    position: relative;
    background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);
    background-repeat: no-repeat;
    background-position: center right;
    background-color: rgb(222, 222, 222);
    font-size: 8pt;
    padding: 4px 12px 4px 0px;
    border: 1px solid #ccc;
  }
`;

const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.colors.grey100};
  margin: 0 auto;
  display: table-row-group;
  vertical-align: middle;
  position: relative;

  td {
    text-align: center;
    padding: 4px;
    vertical-align: top;
    border-style: solid;
    border-width: 0 1px 1px 0;
    border-color: #a1a1a1;
    min-width: 20px;

    font-size: 8pt;

    &.sorted {
      background-color: rgba(1, 131, 218, 0.1);
    }
  }

  tr {
    &:nth-child(odd) {
      background-color: white;
    }

    &:nth-child(even) {
      background-color: rgb(239, 239, 239);
    }

    &:hover {
      background-color: rgba(1, 131, 218, 0.1);
    }
  }
`;

const TeamWrapper = styled.div`
  display: grid;
  grid-template-columns: 40px 40px 1fr;
  align-items: center;
  cursor: pointer;
  min-width: 200px;
  max-width: 240px;

  .position {
    text-align: right;
    margin-right: 15px;
  }

  .name {
    margin: 0 10px;
    min-width: max-content;
    color: #274f70;
    text-decoration: underline;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const HomeAwayRecords = styled.div`
  width: 100%;
  min-width: 55px;
`;

const ShootoutRecords = styled.div`
  width: 100%;
  min-width: 30px;
`;

export default StandingsTable;
