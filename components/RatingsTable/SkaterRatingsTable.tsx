import React from 'react';
import styled from 'styled-components';

import { PlayerRatings } from '../..';
import Link from '../../components/LinkWithSeason';
import PlayerTable from '../PlayerTable';

interface Props {
  data: Array<PlayerRatings>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
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

export function calculateSkaterTPE(
  players: PlayerRatings | { [s: string]: unknown } | ArrayLike<unknown>
): number {
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
      totalTPE += SkaterTPECost[value - 5] - SkaterTPECost[9];
    } else {
      totalTPE += SkaterTPECost[value - 5];
    }
  }
  return totalTPE;
}

function PlayerRatingsTable({
  data: players,
  pagination = false,
  teamPage = false,
  searching = false,
}: Props): JSX.Element {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];
  const columnData = [
    {
      Header: 'Player Info',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: ({ name, league, id }) => [name, league, id],
          // Create cell which contains link to player
          Cell: ({ value }) => {
            return (
              <Link
                href="/[league]/player/[id]"
                as={`/${leagues[value[1]]}/player/${value[2]}`}
                passHref
              >
                <PlayerNameWrapper>{value[0]}</PlayerNameWrapper>
              </Link>
            );
          },
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
    {
      Header: 'TPE',
      columns: [
        {
          Header: 'Applied',
          accessor: 'appliedTPE',
          title: 'Applied TPE',
          sortDescFirst: true,
        },
      ],
    },
  ];

  // format data for TPE
  for (let x = 0; x < players.length; x++) {
    players[x]['appliedTPE'] = calculateSkaterTPE(players[x]);
  }

  return (
    <PlayerTable
      data={players}
      columnData={columnData}
      pagination={pagination}
      teamPage={teamPage}
      searching={searching}
    />
  );
}

export default PlayerRatingsTable;

const PlayerNameWrapper = styled.span`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.blue600};
`;
