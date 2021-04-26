import React from 'react';
// import Link from '../../components/LinkWithSeason';
import RatingsTable from '.';
import { PlayerRatings } from '../..';

interface Props {
  data: Array<PlayerRatings>;
  pagination?: boolean;
  teamPage?: boolean;
}

function PlayerRatingsTable({ data: players, pagination=false, teamPage=false }: Props): JSX.Element {
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
          id: 'player-table-position',
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
      ],
    },
    {
      Header: 'Defensive',
      columns: [
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
      ],
    },
    {
      Header: 'Physical',
      columns: [
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
      ],
    },
    {
      Header: 'Mental',
      columns: [
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
      ],
    },
  ];

  return <RatingsTable data={players} columnData={columnData} pagination={pagination} teamPage={teamPage} />;
}

export default PlayerRatingsTable;
