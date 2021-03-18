import React from 'react';
// import Link from '../../components/LinkWithSeason';
import RatingsTable from '.';
import { GoalieRatings } from '../..';

interface Props {
  data: Array<GoalieRatings>;
}

function GoalieRatingsTable({ data: players }: Props): JSX.Element {
  const columnData = [
    {
      Header: 'Ratings',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: 'name',
          // Create cell which contains link to player
        },
        {
          Header: 'BLO',
          accessor: 'blocker',
          title: 'Blocker',
        },
        {
          Header: 'GLO',
          accessor: 'glove',
          title: 'Glove',
        },
        {
          Header: 'PAS',
          accessor: 'passing',
          title: 'Passing',
        },
        {
          Header: 'POK',
          accessor: 'pokeCheck',
          title: 'Poke Check',
        },
        {
          Header: 'POS',
          accessor: 'positioning',
          title: 'Positioning',
        },
        {
          Header: 'REB',
          accessor: 'rebound',
          title: 'Rebound',
        },
        {
          Header: 'REC',
          accessor: 'recovery',
          title: 'Recovery',
        },
        {
          Header: 'PHA',
          accessor: 'puckhandling',
          title: 'Puckhandling',
        },
        {
          Header: 'LOW',
          accessor: 'lowShots',
          title: 'Low Shots',
        },
        {
          Header: 'REF',
          accessor: 'reflexes',
          title: 'Reflexes',
        },
        {
          Header: 'SKA',
          accessor: 'skating',
          title: 'Skating',
        },
        {
          Header: 'MTO',
          accessor: 'mentalToughness',
          title: 'Mental Toughness',
        },
        {
          Header: 'GST',
          accessor: 'goalieStamina',
          title: 'Goalie Stamina',
        },
      ],
    },
  ];

  return <RatingsTable data={players} columnData={columnData} />;
}

export default GoalieRatingsTable;
