import React from 'react';

import { Player } from '../..';

import PlayerTable from './PlayerTable';

interface Props {
  data: Array<Player>;
  teamPage?: boolean;
  leadersPage?: boolean;
}

function SkaterScoreTable({
  data: players,
  teamPage = false,
  leadersPage = false,
}: Props): JSX.Element {
  const calculateTimeOnIce = (toi: number, gamesPlayed: number) =>
    `${(toi / gamesPlayed / 60) >> 0}:${
      (toi / gamesPlayed) % 60 >> 0 < 10 ? '0' : ''
    }${(toi / gamesPlayed) % 60 >> 0}`;

  const columnData = [
    leadersPage && {
      Header: '#',
      id: 'row',
      accessor: (_row, i) => i + 1,
    },
    {
      Header: 'Player Name',
      id: 'player-table-player',
      accessor: ({ name, team }) => `${name} (${team})`,
    },
    {
      Header: 'F',
      title: 'Forward',
      id: 'player-table-forward',
      accessor: ({ position }) =>
        position === 'C' || position === 'LW' || position === 'RW' ? 'X' : '',
    },
    {
      Header: 'D',
      title: 'Defense',
      id: 'player-table-defense',
      accessor: ({ position }) =>
        position === 'LD' || position === 'RD' ? 'X' : '',
    },

    {
      Header: 'GP',
      accessor: 'gamesPlayed',
      title: 'Games Played',
      sortDescFirst: true,
    },
    {
      Header: 'G',
      accessor: 'goals',
      title: 'Goals',
      sortDescFirst: true,
    },
    {
      Header: 'A',
      accessor: 'assists',
      title: 'Assists',
      sortDescFirst: true,
    },
    {
      Header: 'PTS',
      accessor: 'points',
      title: 'Points',
      sortDescFirst: true,
      Cell: ({ value }) => <strong>{value}</strong>,
    },
    {
      Header: '+/-',
      accessor: 'plusMinus',
      title: 'Plus/Minus',
      sortType: 'basic',
      sortDescFirst: true,
    },
    {
      Header: 'PIM',
      accessor: 'pim',
      title: 'Penalties in Minutes',
      sortDescFirst: true,
    },
    {
      Header: 'HIT',
      accessor: 'hits',
      title: 'Hits',
      sortDescFirst: true,
    },
    {
      Header: 'SHT',
      accessor: 'shotsOnGoal',
      title: 'Shots On Goal',
      sortDescFirst: true,
    },
    {
      Header: 'SHT%',
      id: 'player-table-spct',
      accessor: ({ goals, shotsOnGoal }) =>
        `${((goals * 100) / Math.max(shotsOnGoal, 1)).toFixed(1)}%`,
      title: 'Shooting Percentage',
      sortDescFirst: true,
    },
    {
      Header: 'SB',
      accessor: 'shotsBlocked',
      title: 'Blocks',
      sortDescFirst: true,
    },
    {
      Header: 'MP',
      id: 'player-table-toi',
      accessor: ({ timeOnIce }) => `${(timeOnIce / 60) >> 0}`,
      title: 'Time on Ice (in Minutes)',
      sortDescFirst: true,
    },
    {
      // ! Will want to make this column sortable by time rather than string
      Header: 'AMG',
      id: 'player-table-averagetoi',
      accessor: ({ timeOnIce, gamesPlayed }) =>
        calculateTimeOnIce(timeOnIce, gamesPlayed),
      title: 'Average Time on Ice',
      sortDescFirst: true,
    },
    {
      Header: 'PPG',
      id: 'player-table-ppGoals',
      accessor: 'ppGoals',
      title: 'Power Play Goals',
      sortDescFirst: true,
    },
    {
      Header: 'PPA',
      id: 'player-table-ppAssists',
      accessor: 'ppAssists',
      title: 'Power Play Assists',
      sortDescFirst: true,
    },
    {
      Header: 'PPP',
      id: 'player-table-ppPoints',
      accessor: ({ ppGoals, ppAssists }) => `${ppGoals + ppAssists}`,
      title: 'Power Play Points',
      sortDescFirst: true,
    },
    {
      // ! Will want to make this column sortable by time rather than string
      Header: 'PPM',
      id: 'player-table-pptoi',
      accessor: ({ ppTimeOnIce, gamesPlayed }) =>
        calculateTimeOnIce(ppTimeOnIce, gamesPlayed),
      title: 'Average Power Play Time on Ice',
      sortDescFirst: true,
    },
    {
      Header: 'PKG',
      id: 'player-table-shGoals',
      accessor: 'shGoals',
      title: 'Short-Handed Goals',
      sortDescFirst: true,
    },
    {
      Header: 'PKA',
      id: 'player-table-shAssists',
      accessor: 'shAssists',
      title: 'Short-Handed Assists',
      sortDescFirst: true,
    },
    {
      Header: 'PKP',
      id: 'player-table-pkPoints',
      accessor: ({ shGoals, shAssists }) => `${shGoals + shAssists}`,
      title: 'Short-Handed Points',
      sortDescFirst: true,
    },
    {
      // ! Will want to make this column sortable by time rather than string
      Header: 'SHTOI',
      id: 'player-table-shtoi',
      accessor: ({ shTimeOnIce, gamesPlayed }) =>
        calculateTimeOnIce(shTimeOnIce, gamesPlayed),
      title: 'Average Short-Handed Time on Ice',
      sortDescFirst: true,
    },
  ].concat(
    leadersPage && [
      {
        Header: 'GA',
        accessor: 'giveaways',
        title: 'Giveaways',
        sortDescFirst: true,
      },
      {
        Header: 'TA',
        accessor: 'takeaways',
        title: 'Takeaways',
        sortDescFirst: true,
      },

      {
        Header: 'W',
        accessor: 'fightWins',
        title: 'Fight Wins',
        sortDescFirst: true,
      },
      {
        Header: 'L',
        accessor: 'fightLosses',
        title: 'Fight Losses',
        sortDescFirst: true,
      },

      {
        Header: 'GR',
        accessor: 'gameRating',
        title: 'Overall Game Rating',
        sortDescFirst: true,
      },
      {
        Header: 'OGR',
        accessor: 'offensiveGameRating',
        title: 'Offensive Game Rating',
        sortDescFirst: true,
      },
      {
        Header: 'DGR',
        accessor: 'defensiveGameRating',
        title: 'Defensive Game Rating',
        sortDescFirst: true,
      },
    ]
  );

  return (
    <PlayerTable data={players} columnData={columnData} teamPage={teamPage} />
  );
}

export default SkaterScoreTable;
