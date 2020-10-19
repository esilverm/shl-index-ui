import React, { useMemo } from 'react';
// import Link from 'next/link';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Goalie, Player } from '..';

interface Props {
  data: Array<Player | Goalie>;
  // isLoading: boolean;
}

function PlayerScoreTable({
  data: players,
  // isLoading
} : Props): JSX.Element {
  const columnData = [
    {
      Header: '',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: 'name',
          // Create cell which contains link to player
        },
        {
          Header: 'Pos',
          id: 'player-table-position',
          accessor: 'position'
        },
      ]
    },
    {
      Header: 'Scoring',
      columns: [
        {
          Header: 'GP',
          accessor: 'gamesPlayed',
          title: 'Games Played'
        },
        {
          Header: 'G',
          accessor: 'goals',
          title: 'Goals'
        },
        {
          Header: 'A',
          accessor: 'assists',
          title: 'Assists'
        },
        {
          Header: 'PTS',
          accessor: 'points',
          title: 'Points'
        },
        {
          Header: '+/-',
          accessor: 'plusMinus',
          title: 'Plus/Minus'
        },
        {
          Header: 'PIM',
          accessor: 'pim',
          title: 'Penalties in Minutes'
        }
      ]
    },
    {
      Header: 'Goals',
      columns: [
        {
          Header: "EV",
          id: 'player-table-evGoals',
          accessor: ({ goals, ppGoals, shGoals }) => goals - ppGoals - shGoals,
          title: 'Even Strength Goals',
        },
        {
          Header: 'PP',
          id: 'player-table-ppGoals',
          accessor: 'ppGoals',
          title: 'Power Play Goals',
        },
        {
          Header: 'SH',
          id: 'player-table-shGoals',
          accessor: 'shGoals',
          title: 'Short-Handed Goals',
        }
      ]
    },
    {
      Header: 'Assists',
      columns: [
        {
          Header: 'EV',
          id: 'player-table-evAssists',
          accessor: ({ assists, ppAssists, shAssists }) => assists - ppAssists - shAssists,
          title: 'Even Strength Assists',
        },
        {
          Header: 'PP',
          id: 'player-table-ppAssists',
          accessor: 'ppAssists',
          title: 'Power Play Assists',
        },
        {
          Header: 'SH',
          id: 'player-table-shAssists',
          accessor: 'shAssists',
          title: 'Short-Handed Assists',
        },
      ]
    },
    {
      Header: "",
      id: 'player-table-shots',
      columns: [
        {
          Header: 'S',
          accessor: 'shotsOnGoal',
          title: 'Shots On Goal'
        }
      ]
    },
    {
      Header: "",
      id: 'player-table-shot-pct',
      columns: [
        {
          Header: 'S%',
          id: 'player-table-spct',
          accessor: ({goals, shotsOnGoal}) => `${((goals * 100) / shotsOnGoal).toFixed(1)}%`,
          title: 'Shooting Percentage'
        }
      ]
    },
    {
      Header: 'Ice Time',
      columns: [
        {
          Header: 'TOI',
          id: 'player-table-toi',
          accessor: ({timeOnIce}) => (timeOnIce / 60) >> 0,
          title: 'Time on Ice (in Minutes)'
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'ATOI',
          id: 'player-table-averagetoi',
          accessor: ({timeOnIce, gamesPlayed}) => `${timeOnIce / gamesPlayed / 60 >> 0 }:${(timeOnIce / 50 % 60 >> 0) < 10 ? '0' : ''}${timeOnIce / 50 % 60 >> 0}`,
          title: 'Average Time on Ice'
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'PPTOI',
          id: 'player-table-pptoi',
          accessor: ({ppTimeOnIce, gamesPlayed}) => `${ppTimeOnIce / gamesPlayed / 60 >> 0 }:${(ppTimeOnIce / 50 % 60 >> 0) < 10 ? '0' : ''}${ppTimeOnIce / 50 % 60 >> 0}`,
          title: 'Average Power Play Time on Ice'
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'SHTOI',
          id: 'player-table-shtoi',
          accessor: ({shTimeOnIce, gamesPlayed}) => `${shTimeOnIce / gamesPlayed / 60 >> 0 }:${(shTimeOnIce / 50 % 60 >> 0) < 10 ? '0' : ''}${shTimeOnIce / 50 % 60 >> 0}`,
          title: 'Average Short-Handed Time on Ice'
        }
      ]
    },
    {
      Header: '',
      id: 'player-table-giveaway-takeaway',
      columns: [
        {
          Header: 'GA',
          accessor: 'giveaways',
          title: 'Giveaways',
        },
        {
          Header: 'TA',
          accessor: 'takeaways',
          title: 'Takeaways',
        }
      ]
    },
    {
      Header: 'Fights',
      columns: [
        {
          Header: 'W',
          accessor: 'fightWins',
          title: 'Fight Wins'
        },
        {
          Header: 'L',
          accessor: 'fightLosses',
          title: 'Fight Losses'
        }
      ]
    },
    {
      Header: '',
      id: 'player-table-blocks',
      columns: [
        {
          Header: 'BLK',
          accessor: 'shotsBlocked',
          title: 'Blocks'
        }
      ]
    },
    {
      Header: '',
      id: 'player-table-hits',
      columns: [
        {
          Header: 'HIT',
          accessor: 'hits',
          title: 'Hits'
        }
      ]
    },
    {
      Header: 'Game Rating',
      columns: [
        {
          Header: 'GR',
          accessor: 'gameRating',
          title: 'Overall Game Rating'
        },
        {
          Header: 'OGR',
          accessor: 'offensiveGameRating',
          title: 'Offensive Game Rating'
        },
        {
          Header: 'DGR',
          accessor: 'devensiveGameRating',
          title: 'Defensive Game Rating'
        }
      ]
    }
  ];

  // ! add loading state
  const data = useMemo(
    () => players,
    [players]
  );

  // ! add loading state
  const columns = useMemo(
    () => columnData, 
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups, 
    rows,
    prepareRow
  } = useTable({ columns, data}, useSortBy);

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <TableHeader>
          {
            headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {
                  headerGroup.headers.map((column, i) => (
                      <th
                        {
                          ...column.getHeaderProps(column.getSortByToggleProps())
                        }
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
                            column.render('Header')
                          }
                        </th>
                    )
                  )
                }
              </tr>
            ))
          }
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {
            rows.map((row, i) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()} key={i}>
                  {
                    row.cells.map((cell, i) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          key={i}
                          className={cell.column.isSorted ? 'sorted' : ''}
                        >
                          {
                            cell.render('Cell')
                          }
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  )
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

  &.sorted--desc::before {
    content: '^';
    position: absolute;
    top: 3px;
    left: calc(100% / 2 - 4px);
  }

  &.sorted--asc::after {
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


export default PlayerScoreTable