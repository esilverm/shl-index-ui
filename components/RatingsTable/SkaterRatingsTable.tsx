import React from 'react';
// import Link from '../../components/LinkWithSeason';
import RatingsTable from '.';
import { PlayerRatings } from '../..';

interface Props {
  data: Array<PlayerRatings>;
}

function PlayerRatingsTable({ data: players }: Props): JSX.Element {
  const columnData = [
    {
      Header: 'Player Info',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: 'name',
          // Create cell which contains link to player
        },
        {
          Header: 'Position',
          accessor: 'position',
          title: 'Position',
        },
        {
          Header: 'Team',
          accessor: 'team',
          title: 'Team',
        },
      ],
    },
    {
      Header: 'Offensive',
      columns: [
        {
          Header: 'SCR',
          accessor: 'screening',
          title: 'Screening',
        },
        {
          Header: 'GTO',
          accessor: 'gettingOpen',
          title: 'Getting Open',
        },
        {
          Header: 'PAS',
          accessor: 'passing',
          title: 'Passing',
        },
        {
          Header: 'PHA',
          accessor: 'puckhandling',
          title: 'Puckhandling',
        },
        {
          Header: 'SAC',
          accessor: 'shootingAccuracy',
          title: 'Shooting Accuracy',
        },
        {
          Header: 'SRA',
          accessor: 'shootingRange',
          title: 'Shooting Range',
        },
        {
          Header: 'OFR',
          accessor: 'offensiveRead',
          title: 'Offensive Read',
        },
      ],
    },
    {
      Header: 'Defensive',
      columns: [
        {
          Header: 'CHE',
          accessor: 'checking',
          title: 'Checking',
        },
        {
          Header: 'HIT',
          accessor: 'hitting',
          title: 'Hitting',
        },
        {
          Header: 'POS',
          accessor: 'positioning',
          title: 'Positioning',
        },
        {
          Header: 'SCH',
          accessor: 'stickchecking',
          title: 'Stickchecking',
        },
        {
          Header: 'SBL',
          accessor: 'shotBlocking',
          title: 'Shot Blocking',
        },
        {
          Header: 'FOF',
          accessor: 'faceoffs',
          title: 'Faceoffs',
        },
        {
          Header: 'DFR',
          accessor: 'defensiveRead',
          title: 'Defensive Read',
        },
      ],
    },
    {
      Header: 'Physical',
      columns: [
        {
          Header: 'ACC',
          accessor: 'acceleration',
          title: 'Acceleration',
        },
        {
          Header: 'AGI',
          accessor: 'agility',
          title: 'Agility',
        },
        {
          Header: 'BAL',
          accessor: 'balance',
          title: 'Balance',
        },
        {
          Header: 'SPD',
          accessor: 'speed',
          title: 'Speed',
        },
        {
          Header: 'STA',
          accessor: 'stamina',
          title: 'Stamina',
        },
        {
          Header: 'STR',
          accessor: 'strength',
          title: 'Strength',
        },
        {
          Header: 'FIG',
          accessor: 'fighting',
          title: 'Fighting',
        },
      ],
    },
    {
      Header: 'Mental',
      columns: [
        {
          Header: 'AGR',
          accessor: 'aggression',
          title: 'Aggression',
        },
        {
          Header: 'BRA',
          accessor: 'bravery',
          title: 'Bravery',
        },
      ],
    },
  ];

  return <RatingsTable data={players} columnData={columnData} />;
}

export default PlayerRatingsTable;
