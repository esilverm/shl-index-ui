import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';

import useLeaders from '../../hooks/useLeaders';

interface Props {
  league: string;
  playerType: string;
  stat: string;
}

const Leaderboard = ({ league, playerType, stat }: Props): JSX.Element => {
  const { leaders, isLoading } = useLeaders(league, playerType, stat, null);

  const columnData = [
    {
      Header: (leaders && leaders[0]?.statName) || 'Stat',
      id: 'leaders_table_info',
      columns: [
        {
          Header: '#',
          id: 'row',
          accessor: (_row, i) => i + 1,
        },
        {
          Header: 'Player Name',
          id: 'leader-table-player',
          accessor: ({ name, team }) => `${name} (${team.abbr})`,
        },
        {
          Header: 'GP',
          accessor: 'gamesPlayed',
          title: 'Games Played',
          sortDescFirst: true,
        },
        {
          Header: (leaders && leaders[0]?.statNameAbbr) || 'Stat',
          accessor: 'stat',
        },
      ],
    },
  ];

  const data = useMemo(
    () =>
      isLoading
        ? Array(10).fill({
            id: 0,
            league: 0,
            name: '',
            season: 0,
            stat: 0,
            statName: '',
            statNameAbbr: '',
            team: {
              abbr: '',
              id: 0,
              name: '',
              nickname: '',
            },
          })
        : leaders,
    [isLoading, leaders]
  );

  const columns = useMemo(
    () =>
      isLoading
        ? columnData.map((column) => ({
            ...column,
            Cell: <Skeleton height={18} width="80%" />,
          }))
        : columnData,
    [isLoading]
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
};

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
  width: 100%;'
`;

const TableHeader = styled.thead`
  position: relative;

  tr {
    display: table-row;
  }

  tr:first-child th:first-child {
    font-size: large;
  }

  th {
    font-weight: 600;
    position: relative;
    background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);
    background-repeat: no-repeat;
    background-position: center right;
    background-color: rgb(222, 222, 222);
    font-size: 8pt;
    padding: 4px 12px 4px 0px;
    border: 1px solid #ccc;

    &.sorted--asc {
      background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);
    }

    &.sorted--desc {
      background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);
      background-color: #8dbdd8;
    }
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
    border-width: 0 1px 1px 1px;
    border-color: #a1a1a1;
    min-width: 20px;

    font-size: 8pt;
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

export default Leaderboard;
