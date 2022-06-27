import React from 'react';

import { PlayerRatings } from '../..';

import PlayerTable from './PlayerTable';

interface Props {
  data: Array<PlayerRatings>;
}
const SkaterTPECost = {
  '-1': 0,
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 6,
  6: 8,
  7: 13,
  8: 18,
  9: 30,
  10: 42,
  11: 67,
  12: 97,
  13: 137,
  14: 187,
  15: 242,
};

export function calculateSkaterTPE(players: PlayerRatings): number {
  const SKIP = [
    'id',
    'appliedTPE',
    'name',
    'position',
    'league',
    'season',
    'team',
    'determination',
    'teamPlayer',
    'leadership',
    'temperament',
    'professionalism',
  ];
  let totalTPE = 0;
  for (const [key, value] of Object.entries(players)) {
    if (SKIP.indexOf(key) !== -1) continue;
    if (key === 'stamina') {
      totalTPE += SkaterTPECost[value - 5] - SkaterTPECost[7];
    } else {
      totalTPE += SkaterTPECost[value - 5];
    }
  }
  return totalTPE;
}

function PlayerRatingsTable({ data: players }: Props): JSX.Element {
  const columnData = [
    {
      Header: '#',
      id: 'row',
      accessor: (_row, i) => i + 1,
    },
    {
      Header: 'Player Name',
      id: 'player-table-player',
      accessor: 'name',
    },
    {
      Header: 'C',
      title: 'Center',
      id: 'player-table-center',
      accessor: ({ position }) => (position === 'C' ? 'X' : ''),
    },
    {
      Header: 'L',
      title: 'Left Wing',
      id: 'player-table-left-wing',
      accessor: ({ position }) => (position === 'LW' ? 'X' : ''),
    },
    {
      Header: 'R',
      title: 'Right Wing',
      id: 'player-table-right-wing',
      accessor: ({ position }) => (position === 'RW' ? 'X' : ''),
    },
    {
      Header: 'D',
      title: 'Defense',
      id: 'player-table-defense',
      accessor: ({ position }) =>
        position === 'LD' || position === 'RD' ? 'X' : '',
    },
    {
      Header: 'SCR',
      accessor: 'screening',
      title: 'Screening',
      sortDescFirst: true,
    },
    {
      Header: 'GTO',
      accessor: 'gettingOpen',
      title: 'Getting Open',
      sortDescFirst: true,
    },
    {
      Header: 'PAS',
      accessor: 'passing',
      title: 'Passing',
      sortDescFirst: true,
    },
    {
      Header: 'PHA',
      accessor: 'puckHandling',
      title: 'Puckhandling',
      sortDescFirst: true,
    },
    {
      Header: 'SAC',
      accessor: 'shootingAccuracy',
      title: 'Shooting Accuracy',
      sortDescFirst: true,
    },
    {
      Header: 'SRA',
      accessor: 'shootingRange',
      title: 'Shooting Range',
      sortDescFirst: true,
    },
    {
      Header: 'OFR',
      accessor: 'offensiveRead',
      title: 'Offensive Read',
      sortDescFirst: true,
    },
    {
      Header: 'CHE',
      accessor: 'checking',
      title: 'Checking',
      sortDescFirst: true,
    },
    {
      Header: 'HIT',
      accessor: 'hitting',
      title: 'Hitting',
      sortDescFirst: true,
    },
    {
      Header: 'POS',
      accessor: 'positioning',
      title: 'Positioning',
      sortDescFirst: true,
    },
    {
      Header: 'SCH',
      accessor: 'stickChecking',
      title: 'Stick Checking',
      sortDescFirst: true,
    },
    {
      Header: 'SBL',
      accessor: 'shotBlocking',
      title: 'Shot Blocking',
      sortDescFirst: true,
    },
    {
      Header: 'FOF',
      accessor: 'faceoffs',
      title: 'Faceoffs',
      sortDescFirst: true,
    },
    {
      Header: 'DFR',
      accessor: 'defensiveRead',
      title: 'Defensive Read',
      sortDescFirst: true,
    },
    {
      Header: 'ACC',
      accessor: 'acceleration',
      title: 'Acceleration',
      sortDescFirst: true,
    },
    {
      Header: 'AGI',
      accessor: 'agility',
      title: 'Agility',
      sortDescFirst: true,
    },
    {
      Header: 'BAL',
      accessor: 'balance',
      title: 'Balance',
      sortDescFirst: true,
    },
    {
      Header: 'SPD',
      accessor: 'speed',
      title: 'Speed',
      sortDescFirst: true,
    },
    {
      Header: 'STA',
      accessor: 'stamina',
      title: 'Stamina',
      sortDescFirst: true,
    },
    {
      Header: 'STR',
      accessor: 'strength',
      title: 'Strength',
      sortDescFirst: true,
    },
    {
      Header: 'FIG',
      accessor: 'fighting',
      title: 'Fighting',
      sortDescFirst: true,
    },

    {
      Header: 'AGR',
      accessor: 'aggression',
      title: 'Aggression',
      sortDescFirst: true,
    },
    {
      Header: 'BRA',
      accessor: 'bravery',
      title: 'Bravery',
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
    players[x]['appliedTPE'] = calculateSkaterTPE(players[x]);
  }

  return <PlayerTable data={players} columnData={columnData} />;
}

export default PlayerRatingsTable;
