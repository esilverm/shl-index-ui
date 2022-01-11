import React from 'react';
import styled from 'styled-components';

import { GoalieRatings } from '../..';
import Link from '../../components/LinkWithSeason';
import PlayerTable from '../PlayerTable';

interface Props {
  data: Array<GoalieRatings>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
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
  15: 232
}

export function calculateGoalieTPE(columns: Array<number>): number {
  let totalTPE = 0;
  for (let x = 0; x < columns.length; x++) {
    totalTPE += GoalieTPECost[columns[x] - 5]
  }
  return totalTPE;
}

function GoalieRatingsTable({
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
          Header: 'Team',
          accessor: 'team',
          title: 'Team',
        },
      ],
    },
    {
      Header: 'Goalie',
      id: 'goalie-ratings',
      columns: [
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
      ],
    },
    {
      Header: 'Mental',
      id: 'goalie-mental',
      columns: [
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
      ],
    },
    {
      Header: 'TPE',
      columns: [
        {
          Header: 'Applied',
          accessor: ({
            blocker,
            glove,
            passing,
            pokeCheck,
            positioning,
            rebound,
            recovery,
            puckhandling,
            lowShots,
            reflexes,
            skating,
            mentalToughness,
            goalieStamina,
          }) => [
              blocker,
              glove,
              passing,
              pokeCheck,
              positioning,
              rebound,
              recovery,
              puckhandling,
              lowShots,
              reflexes,
              skating,
              mentalToughness,
              goalieStamina,
            ],
          title: 'Applied TPE',
          // Create cell which contains link to player
          Cell: ({ value }) => {
            return (
              <>
                {calculateGoalieTPE(value)}
              </>
            );
          },
          sortDescFirst: true
        }
      ]
    }
  ];

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

export default GoalieRatingsTable;

const PlayerNameWrapper = styled.span`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.blue600};
`;
