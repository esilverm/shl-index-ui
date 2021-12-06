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
