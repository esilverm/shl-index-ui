import React, { useMemo, useState, useEffect } from 'react';
import { useTable } from 'react-table';
import styled from 'styled-components';

interface Props {
  league: string;
  data: {
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
  };
}

function StandingsTable({ league, data }: Props): JSX.Element {
  const [isloadingAssets, setLoadingAssets] = useState<boolean>(true);
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
  }, [data]);

  if (isloadingAssets) <React.Fragment />;

  const columns = useMemo(
    () => [
      {
        Header: '',
        accessor: 'position',
      },
      {
        Header: '',
        accessor: 'abbreviation',
        Cell: ({ value, data }) => {
          const Logo = sprites[value];
          return Logo ? (
            <LogoWrapper>
              <Logo
                aria-label={`${
                  data.filter((team) => team.abbreviation === value)[0].name
                } logo`}
              />
            </LogoWrapper>
          ) : (
            <LogoWrapper />
          );
        },
      },
      {
        Header: 'Team',
        accessor: 'location',
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
        accessor: ({ goalDiff }) => {
          return `${goalDiff > 0 ? '+' : ''}${goalDiff}`;
        },
        id: 'goaldiff',
        title: 'Goal Differential',
      },
      {
        Header: 'HOME',
        accessor: ({ home }) => {
          return `${home.wins}-${home.losses}-${home.OTL}`;
        },
        id: 'homerecord',
        title: 'Home Record',
      },
      {
        Header: 'AWAY',
        accessor: ({ away }) => {
          return `${away.wins}-${away.losses}-${away.OTL}`;
        },
        id: 'awayrecord',
        title: 'Away Record',
      },
      {
        Header: 'S/O',
        accessor: ({ shootout }) => {
          return `${shootout.wins}-${shootout.losses}`;
        },
        id: 'shootout',
        title: 'Record in games decided by Shootout',
      },
    ],
    [sprites]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    // apply the table props
    <table {...getTableProps()}>
      <thead>
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
                    {...column.getHeaderProps()}
                    title={column.title}
                    key={`${i}_${column.id}`}
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
      </thead>
      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
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
                      <td {...cell.getCellProps()} key={i}>
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
      </tbody>
    </table>
  );
}

const LogoWrapper = styled.div`
  width: 30px;
  height: 30px;
`;

export default StandingsTable;
