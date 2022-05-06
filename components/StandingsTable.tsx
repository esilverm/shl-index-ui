import React, { useMemo, useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';

import Link from '../components/LinkWithSeason';

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
        OTW?: number;
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
          OTW?: number;
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
  const [isLoadingAssets, setLoadingAssets] = useState<boolean>(true);
  const [sprites, setSprites] = useState<{
    [index: string]: React.ComponentClass<any>;
  }>({});

  useEffect(() => {
    // Dynamically import svg icons based on the league chosen
    (async () => {
      const { default: s } = await import(
        `../public/team_logos/${league.toUpperCase()}/`
      );

      setSprites(() => s);
      setLoadingAssets(() => false);
    })();
  }, [standings]);

  const columnData = [
    {
      Header: title,
      accessor: ({ position, abbreviation, location, name, id }) => [
        position,
        abbreviation,
        location,
        name,
        id,
      ],
      id: 'team',
      Cell: ({ value }) => {
        const Logo = sprites[value[1]];
        return (
          <Link
            href="/[league]/team/[id]"
            as={`/${league}/team/${value[4]}`}
            passHref
          >
            <TeamWrapper>
              <span className="position">{value[0]}</span>
              <LogoWrapper abbr={value[1]}>
                {Logo ? (
                  <Logo aria-label={`${value[3]} logo`} />
                ) : (
                  <Skeleton circle width={30} height={30} />
                )}
              </LogoWrapper>

              <span className="name">{value[2]}</span>
            </TeamWrapper>
          </Link>
        );
      },
      disableSortBy: true,
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
    ...((league === 'iihf' || league === 'wjc') &&
    standings &&
    'OTW' in standings[0]
      ? [
          {
            Header: 'W O/S',
            accessor: 'OTW',
            title: 'Wins in OT/SO',
          },
        ]
      : []),
    {
      Header: 'L',
      accessor: 'losses',
      title: 'Losses',
    },
    {
      Header: 'OT',
      accessor: 'OTL',
      title: 'Overtime Losses',
    },

    {
      Header: 'PTS',
      accessor: 'points',
      title: 'Points',
    },
    {
      Header: 'P%',
      accessor: 'winPercent',
      title: 'Points Percentage',
    },
    ...(league === 'shl' || league === 'smjhl'
      ? [
          {
            Header: 'ROW',
            accessor: 'ROW',
            title: 'Regulation plus Overtime Wins',
          },
        ]
      : []),
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
        <GoalDiff value={value}>
          {value > 0 && '+'}
          {value}
        </GoalDiff>
      ),
      title: 'Goal Differential',
      sortType: 'basic',
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
    shl: 16,
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
    [isLoading, isLoadingAssets, standings]
  );

  const columns = useMemo(
    () =>
      isLoading
        ? columnData.map((column, i) => ({
            ...column,
            Cell:
              i === 0 ? (
                <TeamSkeleton height={18} width="80%" />
              ) : (
                <Skeleton height={18} width="80%" />
              ),
          }))
        : columnData,
    [isLoading, isLoadingAssets, title]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data }, useSortBy);

  return (
    // apply the table props
    <SkeletonTheme color="#ADB5BD" highlightColor="#CED4DA">
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
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
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

                const teamName = row.cells.shift();
                return (
                  // Apply the row props
                  <tr {...row.getRowProps()} key={i}>
                    {
                      <th {...teamName.getCellProps()}>
                        {teamName.render('Cell')}
                      </th>
                    }
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
    </SkeletonTheme>
  );
}

const TableContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.grey500};
  border-top: none;
  overflow-x: auto;
  overflow-y: hidden;
  border-radius: 10px;

  tr:not(:last-child) th,
  tr:not(:last-child) td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
  }
`;

const Table = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  border-radius: inherit;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.grey900};
  color: ${({ theme }) => theme.colors.grey100};
  position: relative;

  tr {
    display: table-row;
  }

  th:first-child {
    position: sticky;
    left: 0px;
    z-index: 2;
    text-align: left;
    padding-left: 10px;
  }

  th {
    height: 50px;
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.grey900};
    position: relative;

    &.sorted--asc::before {
      content: '^';
      position: absolute;
      top: 3px;
      left: calc(100% / 2 - 4px);
    }

    &.sorted--desc::after {
      content: 'v';
      font-size: 14px;
      position: absolute;
      bottom: 3px;
      left: calc(100% / 2 - 4px);
    }
  }

  th:not(:first-child) {
    cursor: help;
    text-align: center;
  }
`;

const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.colors.grey100};
  margin: 0 auto;
  display: table-row-group;
  vertical-align: middle;
  position: relative;

  th {
    font-family: Montserrat, sans-serif;
    display: table-cell;
    text-align: left;
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.grey200};
    position: sticky;
    left: 0px;
  }

  td {
    font-family: Montserrat, Arial, Helvetica, sans-serif;
    padding: 10px;
    text-align: center;

    &.sorted {
      background-color: rgba(1, 131, 218, 0.1);
    }
  }

  tr {
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
    color: ${({ theme }) => theme.colors.blue600};
  }

  @media screen and (max-width: 768px) {
    padding-right: 50px;
    min-width: 0;
    .name {
      display: none;
    }

`;

const TeamSkeleton = styled(Skeleton)`
  margin-left: 10px;
`;

const LogoWrapper = styled.div<{ abbr: string }>`
  width: 30px;
  height: 30px;

  @media screen and (max-width: 768px) {
    &::after {
      color: ${({ theme }) => theme.colors.blue600};
      content: '${({ abbr }) => abbr}';
      position: relative;
      left: 40px;
      top: -30px;
    }
  }
`;

const GoalDiff = styled.span<{ value: number }>`
  color: ${({ value, theme }) =>
    value === 0 ? theme.colors.grey900 : value > 0 ? '#48b400' : '#d60000'};
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
