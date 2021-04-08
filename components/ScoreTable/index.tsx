import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// import Link from '../../components/LinkWithSeason';
import { Player, Goalie } from '../..';

interface Columns {
  Header: string;
  id?: string;
  title?: string;
  accessor: string | ((stats: Player) => string);
}

interface ColumnData {
  Header: string;
  id?: string;
  columns: Array<Columns>;
}

interface Props {
  data: Array<Player | Goalie>;
  columnData: Array<ColumnData>;
  // isLoading: boolean;
}

function ScoreTable({
  data: players,
  columnData,
}: // isLoading
Props): JSX.Element {
  // ! add loading state
  const data = useMemo(() => players, [players]);

  // ! add loading state
  const columns = useMemo(() => columnData, []);

  const initialState = useMemo(() => {
    if (players[0] && 'wins' in players[0]) {
      return { sortBy: [{ id: 'wins', desc: true }] };
    }
    return { sortBy: [{ id: 'points', desc: true }] };
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, initialState }, useSortBy);

  const hasData = rows.length > 0;

  return (
    <>
      {!hasData && <Notice>No results found</Notice>}
      {hasData && (
        <TableContainer>
          <Table {...getTableProps()}>
            <TableHeader>
              {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, i) => (
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
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </TableHeader>
            <TableBody {...getTableBodyProps()}>
              {hasData &&
                rows.map((row, i) => {
                  prepareRow(row);

                  return (
                    <tr {...row.getRowProps()} key={i}>
                      {row.cells.map((cell, i) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={i}
                            className={cell.column.isSorted ? 'sorted' : ''}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
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

const Notice = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  padding: 5px;
`;

export default ScoreTable;
