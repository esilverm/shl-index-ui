import React from 'react';

import { Goalie } from '../..';

import PlayerTable from './PlayerTable';

interface Props {
  data: Array<Goalie>;
  teamPage?: boolean;
  leadersPage?: boolean;
}

function GoalieScoreTable({
  data: players,
  teamPage = false,
  leadersPage = false,
}: Props): JSX.Element {
  const columnData = [
    leadersPage && {
      Header: '#',
      id: 'row',
      accessor: (_row, i) => i + 1,
    },
    {
      Header: 'Goalie Name',
      id: 'player-table-player',
      accessor: ({ name, team }) => `${name} (${team})`,
    },
    {
      Header: 'GP',
      accessor: 'gamesPlayed',
      title: 'Games Played',
      sortDescFirst: true,
    },

    {
      Header: 'W',
      accessor: 'wins',
      title: 'Wins',
      Cell: ({ value }) => <strong>{value}</strong>,
      sortDescFirst: true,
    },
    {
      Header: 'L',
      accessor: 'losses',
      title: 'Losses',
      sortDescFirst: true,
    },
    {
      Header: 'OTL',
      accessor: 'ot',
      title: 'Overtime Losses',
      sortDescFirst: true,
    },

    {
      Header: 'GAA',
      accessor: 'gaa',
      title: 'Goals Against Average',
      sortDescFirst: true,
    },
    {
      Header: 'MP',
      accessor: 'minutes',
      title: 'Minutes Played',
      sortDescFirst: true,
    },
    {
      Header: 'SO',
      accessor: 'shutouts',
      title: 'Shutouts',
      sortDescFirst: true,
    },
    {
      Header: 'GA',
      accessor: 'goalsAgainst',
      title: 'Goals Against',
      sortDescFirst: true,
    },
    {
      Header: 'SA',
      accessor: 'shotsAgainst',
      title: 'Shots Against',
      sortDescFirst: true,
    },
    {
      Header: 'SAV',
      accessor: 'saves',
      title: 'Saves',
      sortDescFirst: true,
    },
    {
      Header: 'PS%',
      accessor: 'savePct',
      title: 'Save Percentage',
      sortDescFirst: true,
    },
    {
      Header: 'GR',
      accessor: 'gameRating',
      title: 'Overall Game Rating',
      sortDescFirst: true,
    },
  ];

  return (
    <PlayerTable data={players} columnData={columnData} teamPage={teamPage} />
  );
}

export default GoalieScoreTable;
