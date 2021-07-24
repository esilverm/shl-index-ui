import React from 'react';

import { Goalie } from '../..';
import Link from '../../components/LinkWithSeason';

import ScoreTable from '.';

interface Props {
  data: Array<Goalie>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
}

function GoalieScoreTable({
  data: players,
  pagination = false,
  teamPage = false,
  searching = false,
}: Props): JSX.Element {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];
  const columnData = [
    {
      Header: '',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: ({ name, league, id }) => [
            name,
            league,
            id,
          ],
          // Create cell which contains link to player
          Cell: ({ value }) => {
            return (
              <Link
                href="/[league]/player/[id]"
                as={`/${leagues[value[1]]}/player/${value[2]}`}
                passHref
              >
                {value[0]}
              </Link>
            );
          },
        },
        {
          Header: 'Team',
          accessor: 'team',
          title: 'Team',
        },
        {
          Header: 'GP',
          accessor: 'gamesPlayed',
          title: 'Games Played',
          sortDescFirst: true,
        },
        {
          Header: 'MP',
          accessor: 'minutes',
          title: 'Minutes Played',
          sortDescFirst: true,
        },
        {
          Header: 'W',
          accessor: 'wins',
          title: 'Wins',
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
          Header: 'SHA',
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
          Header: 'GA',
          accessor: 'goalsAgainst',
          title: 'Goals Against',
          sortDescFirst: true,
        },
        {
          Header: 'GAA',
          accessor: 'gaa',
          title: 'Goals Against Average',
          sortDescFirst: true,
        },
        {
          Header: 'SO',
          accessor: 'shutouts',
          title: 'Shutouts',
          sortDescFirst: true,
        },
        {
          Header: 'SV%',
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
      ],
    },
  ];

  return (
    <ScoreTable
      data={players}
      columnData={columnData}
      pagination={pagination}
      teamPage={teamPage}
      searching={searching}
    />
  );
}

export default GoalieScoreTable;
