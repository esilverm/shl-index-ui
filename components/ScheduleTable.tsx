import React, { useMemo } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useTable, usePagination } from 'react-table';
import styled from 'styled-components';

import { Team } from '..';
import { Game } from '../pages/api/v1/schedule';

interface Columns {
  Header: string;
  id?: string;
  title?: string;
  accessor: string | ((gameData) => string) | ((gameData) => JSX.Element);
}

interface ColumnData {
  Header: string;
  id?: string;
  columns: Array<Columns>;
}

interface Props {
  games: Array<Game>;
  teamlist: Array<Team>;
  isLoading: boolean;
}

function ScheduleTable({ games, teamlist, isLoading }: Props): JSX.Element {
  const getMatchup = (awayScore, homeScore, awayTeamId, homeTeamId) => {
    if (isLoading) return <Skeleton height={18} />;

    const awayTeamWon = awayScore > homeScore;
    const awayTeam = teamlist.find((team) => team.id === awayTeamId);
    const awayTeamName =
      awayTeam && awayTeam.name ? awayTeam.name : 'Away Team';
    const homeTeam = teamlist.find((team) => team.id === homeTeamId);
    const homeTeamName =
      homeTeam && homeTeam.name ? homeTeam.name : 'Home Team';

    return (
      <>
        {awayTeamWon ? <strong>{awayTeamName}</strong> : awayTeamName}
        {' @ '}
        {!awayTeamWon ? <strong>{homeTeamName}</strong> : homeTeamName}
      </>
    );
  };

  const getResult = (awayScore, homeScore, played, shootout, overtime) => {
    if (isLoading) return <Skeleton height={18} />;
    if (!played) return <span>TBD</span>;

    const endedIn = shootout ? ' (SO)' : overtime ? ' (OT)' : '';
    return <span>{`${awayScore} - ${homeScore}${endedIn}`}</span>;
  };

  const columnData: ColumnData[] = [
    {
      Header: 'schedule',
      id: 'gameday-matchups',
      columns: [
        {
          Header: 'type',
          id: 'type',
          accessor: 'type',
        },
        {
          Header: 'Matchup',
          id: 'matchup',
          accessor: ({ awayScore, homeScore, awayTeam, homeTeam }) =>
            getMatchup(awayScore, homeScore, awayTeam, homeTeam),
        },
        {
          Header: 'Result',
          id: 'result',
          accessor: ({ awayScore, homeScore, played, shootout, overtime }) =>
            getResult(awayScore, homeScore, played, shootout, overtime),
        },
      ],
    },
  ];

  const data = useMemo(
    () =>
      isLoading
        ? new Array(25).fill({
            awayScore: 0,
            homeScore: 0,
            awayTeam: '',
            homeTeam: '',
            played: 0,
            overtime: 0,
            shootout: 0,
            type: '',
          })
        : games,
    [isLoading, games]
  );

  const columns = useMemo(() => columnData, [isLoading]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        hiddenColumns: ['type'],
        pageSize: 25,
      },
    },
    usePagination
  );

  return (
    <SkeletonTheme color="#ADB5BD" highlightColor="#CED4DA">
      <Pagination>
        <button onClick={previousPage} disabled={!canPreviousPage}>
          <BsChevronLeft size="20px" aria-label="Arrow Pointing Left" />
        </button>
        <button onClick={nextPage} disabled={!canNextPage}>
          <BsChevronRight size="20px" aria-label="Arrow Pointing Right" />
        </button>
        <span>
          {'Page '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[25, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </Pagination>
      <TableContainer>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup, i) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                {headerGroup.headers.map(
                  (column, i) =>
                    column.Header !== 'schedule' && (
                      <th
                        {...column.getHeaderProps()}
                        title={column.title}
                        key={`${i}_${column.id}`}
                      >
                        {column.render('Header')}
                      </th>
                    )
                )}
              </tr>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell, i) => {
                    return (
                      <td {...cell.getCellProps()} key={i}>
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

  th {
    height: 50px;
    font-weight: 400;
    background-color: ${({ theme }) => theme.colors.grey900};
    position: relative;
    text-align: left;
    padding-left: 10px;
    padding-right: 10px;
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
    text-align: left;
  }

  tr {
    &:hover {
      background-color: rgba(1, 131, 218, 0.1);
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 5px;

  button {
    background-color: ${({ theme }) => theme.colors.grey100};
    border: 1px solid ${({ theme }) => theme.colors.grey500};
    width: 30px;
    height: 30px;
    cursor: pointer;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  button:disabled {
    cursor: default;
  }

  select {
    background-color: ${({ theme }) => theme.colors.grey100};
    border: 1px solid ${({ theme }) => theme.colors.grey500};
    height: 30px;
    margin-left: 5px;
  }
`;

export default ScheduleTable;
