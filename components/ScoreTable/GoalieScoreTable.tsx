import React from 'react';
// import Link from 'next/link';
import ScoreTable from '.';
import { Goalie } from '../..';

interface Props {
  data: Array<Goalie>;
}

function GoalieScoreTable({ data: players }: Props): JSX.Element {
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
        {
          Header: 'GP',
          accessor: 'gamesPlayed',
          title: 'Games Played'
        },
        {
          Header: 'MP',
          accessor: 'minutes',
          title: 'Minutes Played'
        },
        {
          Header: 'W',
          accessor: 'wins',
          title: 'Wins'
        },
        {
          Header: 'L',
          accessor: 'losses',
          title: 'Losses'
        },
        {
          Header: 'OTL',
          accessor: 'ot',
          title: 'Overtime Losses'
        },
        {
          Header: 'SHA',
          accessor: 'shotsAgainst',
          title: 'Shots Against'
        },
        {
          Header: 'SAV',
          accessor: 'saves',
          title: 'Saves'
        },
        {
          Header: 'GA',
          accessor: 'goalsAgainst',
          title: 'Goals Against'
        },
        {
          Header: 'GAA',
          accessor: 'gaa',
          title: 'Goals Against Average'
        },
        {
          Header: 'SO',
          accessor: 'shutouts',
          title: 'Shutouts'
        },
        {
          Header: 'SV%',
          accessor: 'savePct',
          title: 'Save Percentage'
        },
        {
          Header: 'GR',
          accessor: 'gameRating',
          title: 'Overall Game Rating'
        }
      ]
    }
  ];

  return <ScoreTable data={players} columnData={columnData} />;
}

export default GoalieScoreTable;
