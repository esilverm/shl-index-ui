import React, { useMemo } from 'react';
// import Link from 'next/link';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
import { Game } from '../pages/api/v1/schedule';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

interface Columns {
  Header: string;
  id?: string;
  title?: string;
  accessor: string | ((mathup) => string);
}

interface ColumnData {
  Header: string;
  id?: string;
  columns: Array<Columns>;
}

interface Props {
  games: Game[];
}

const getResult = (awayScore, homeScore, played, shootout, overtime) => {
  if (!played) return "TBD";

  const endedIn = shootout ? " (SO)" : overtime ? " (OT)" : "";
  return `${awayScore} - ${homeScore}${endedIn}`;
};

function ScheduleTable({
  games,
  // isLoading
} : Props): JSX.Element {
  const columnData: ColumnData[] = [
    {
      Header: '',
      id: 'gameday-matchups',
      columns: [
        {
          Header: 'Matchup',
          id: 'matchup',
          accessor: ({ awayTeam, homeTeam }) => `${awayTeam} @ ${homeTeam}`
        },
        {
          Header: 'Result',
          id: 'result',
          accessor: ({ awayScore, homeScore, played, shootout, overtime }) => getResult(awayScore, homeScore, played, shootout, overtime)
        }
      ]
    }
  ];

  // ! add loading state
  const data = useMemo(
    () => games, 
    []
  )

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
  } = useTable({ columns, data }, useSortBy);

  return (
    <TableContainer>
      <Table {...getTableProps()}>
        <TableHeader>
          {
            headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {
                  headerGroup.headers.map((column, i) => column.Header && (
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

export default ScheduleTable;
