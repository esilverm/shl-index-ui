import React from 'react';

import { GoalieRatings } from '../..';

import PlayerTable from './PlayerTable';

interface Props {
  data: Array<GoalieRatings>;
}

const GoalieTPECost = {
  '-1': 0,
  0: 0,
  1: 1,
  2: 2,
  3: 4,
  4: 6,
  5: 11,
  6: 16,
  7: 24,
  8: 32,
  9: 47,
  10: 62,
  11: 87,
  12: 112,
  13: 152,
  14: 192,
  15: 232,
};

export function calculateGoalieTPE(players: GoalieRatings): number {
  const SKIP = [
    'id',
    'appliedTPE',
    'name',
    'position',
    'league',
    'season',
    'team',
    'aggression',
    'determination',
    'teamPlayer',
    'leadership',
    'professionalism',
  ];
  let totalTPE = 0;
  for (const [key, value] of Object.entries(players)) {
    if (SKIP.indexOf(key) !== -1) continue;
    totalTPE += GoalieTPECost[value - 5];
  }
  return totalTPE;
}

function GoalieRatingsTable({ data: players }: Props): JSX.Element {
  const columnData = [
    {
      Header: 'Goalie Name',
      id: 'player-table-player',
      accessor: 'name',
    },
    {
      Header: 'PO',
      id: 'player-table-position',
      accessor: 'position',
    },
    {
      Header: 'BLO',
      accessor: 'blocker',
      title: 'Blocker',
      sortDescFirst: true,
    },
    {
      Header: 'GLO',
      accessor: 'glove',
      title: 'Glove',
      sortDescFirst: true,
    },
    {
      Header: 'PAS',
      accessor: 'passing',
      title: 'Passing',
      sortDescFirst: true,
    },
    {
      Header: 'POK',
      accessor: 'pokeCheck',
      title: 'Poke Check',
      sortDescFirst: true,
    },
    {
      Header: 'POS',
      accessor: 'positioning',
      title: 'Positioning',
      sortDescFirst: true,
    },
    {
      Header: 'REB',
      accessor: 'rebound',
      title: 'Rebound',
      sortDescFirst: true,
    },
    {
      Header: 'REC',
      accessor: 'recovery',
      title: 'Recovery',
      sortDescFirst: true,
    },
    {
      Header: 'PHA',
      accessor: 'puckhandling',
      title: 'Puckhandling',
      sortDescFirst: true,
    },
    {
      Header: 'LOW',
      accessor: 'lowShots',
      title: 'Low Shots',
      sortDescFirst: true,
    },
    {
      Header: 'REF',
      accessor: 'reflexes',
      title: 'Reflexes',
      sortDescFirst: true,
    },
    {
      Header: 'SKA',
      accessor: 'skating',
      title: 'Skating',
      sortDescFirst: true,
    },

    {
      Header: 'MTO',
      accessor: 'mentalToughness',
      title: 'Mental Toughness',
      sortDescFirst: true,
    },
    {
      Header: 'GST',
      accessor: 'goalieStamina',
      title: 'Goalie Stamina',
      sortDescFirst: true,
    },

    {
      Header: 'TPE',

      accessor: 'appliedTPE',
      title: 'Applied TPE',
      sortDescFirst: true,
    },
  ];

  // format data for TPE
  for (let x = 0; x < players.length; x++) {
    players[x]['appliedTPE'] = calculateGoalieTPE(players[x]);
  }

  return <PlayerTable data={players} columnData={columnData} />;
}

export default GoalieRatingsTable;
