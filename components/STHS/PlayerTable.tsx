import React, { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';
import styled from 'styled-components';

// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
// import Link from '../../components/LinkWithSeason';
import { Player, Goalie, PlayerRatings, GoalieRatings } from '../../';

interface Columns {
  Header: string;
  id?: string;
  title?: string;
  accessor?: string | ((row: any, index: number | null) => any);
  Cell?: React.FC<{ value: any }>;
}

interface Props {
  data: Array<Player | Goalie | PlayerRatings | GoalieRatings>;
  columnData: Array<Columns>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
  sortBySeason?: boolean;
}

function PlayerTable({
  data: players,
  columnData,
  teamPage = false,
}: // isLoading
Props): JSX.Element {
  // ! add loading state
  const data = useMemo(() => players, [players]);

  // ! add loading state
  const columns = useMemo(() => {
    // handle logic with teamPage
    if (teamPage && columnData) {
      // loop through columns to find the team column and remove it from the columnData
      let i = columnData[0]['columns'].length;
      while (i--) {
        if (columnData[0]['columns'][i].Header == 'Team') {
          delete columnData[0]['columns'][i];
        }
      }
    }
    return columnData;
  }, []);

  const table = useTable({ columns, data }, useSortBy);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    table;

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
    text-align: left;
    padding: 4px;
    vertical-align: top;
    border-style: solid;
    border-width: 0 1px 1px 0;
    border-color: #a1a1a1;
    min-width: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

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

const Notice = styled.div`
  width: 100%;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  padding: 5px;
`;

export default PlayerTable;
