import React from 'react';
import styled from 'styled-components';

import { Player } from '../..';
import Link from '../../components/LinkWithSeason';
import PlayerTable from '../PlayerTable';

interface Props {
  data: Array<Player>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
}

function SkaterAdvStatsTable({
  data: players,
  pagination = false,
  teamPage = false,
  searching = false,
}: Props): JSX.Element {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const columnData = [
    {
      Header: 'Advanced Stats',
      id: 'player-table',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          title: 'Player Name',
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
          Header: 'Pos',
          id: 'player-table-position',
          accessor: 'position',
          title: 'Position',
        },
        {
          Header: 'Team',
          accessor: 'team',
          title: 'Team',
        },
        {
          Header: 'GP',
          id: 'player-table-gamesPlayed',
          accessor: 'gamesPlayed',
          title: 'Games Played',
          sortDescFirst: true,
        },
        {
          Header: 'PDO',
          id: 'player-table-pdo',
          accessor: 'advancedStats.PDO',
          title: 'PDO',
          sortDescFirst: true,
        },
        {
          Header: 'GF/60',
          id: 'player-table-gf60',
          accessor: 'advancedStats.GF60',
          title: 'Goals For per 60 Minutes',
          sortDescFirst: true,
        },
        {
          Header: 'GA/60',
          id: 'player-table-ga60',
          accessor: 'advancedStats.GA60',
          title: 'Goals Against per 60 Minutes',
          sortDescFirst: true,
        },
        {
          Header: 'SF/60',
          id: 'player-table-sf60',
          accessor: 'advancedStats.SF60',
          title: 'Shots For per 60 Minutes',
          sortDescFirst: true,
        },
        {
          Header: 'SA/60',
          id: 'player-table-sa60',
          accessor: 'advancedStats.SA60',
          title: 'Shots Against per 60 Minutes',
          sortDescFirst: true,
        },
        {
          Header: 'CF',
          id: 'player-table-cf',
          accessor: 'advancedStats.CF',
          title: 'Corsi For',
          sortDescFirst: true,
        },
        {
          Header: 'CA',
          id: 'player-table-ca',
          accessor: 'advancedStats.CA',
          title: 'Corsi Against',
          sortDescFirst: true,
        },
        {
          Header: 'CF%',
          id: 'player-table-cfpct',
          accessor: 'advancedStats.CFPct',
          title: 'Corsi For Percentage',
          sortDescFirst: true,
        },
        {
          Header: 'CF% Rel',
          id: 'player-table-cfpctrel',
          accessor: 'advancedStats.CFPctRel',
          title: 'Corsi For Percentage Relative',
          sortType: 'basic',
          sortDescFirst: true,
        },
        {
          Header: 'FF',
          id: 'player-table-ff',
          accessor: 'advancedStats.FF',
          title: 'Fenwick For',
          sortDescFirst: true,
        },
        {
          Header: 'FA',
          id: 'player-table-fa',
          accessor: 'advancedStats.FA',
          title: 'Fenwick Against',
          sortDescFirst: true,
        },
        {
          Header: 'FF%',
          id: 'player-table-ffpct',
          accessor: 'advancedStats.FFPct',
          title: 'Fenwick For Percentage',
          sortDescFirst: true,
        },
        {
          Header: 'FF% Rel',
          id: 'player-table-ffpctrel',
          accessor: 'advancedStats.FFPctRel',
          title: 'Fenwick For Percentage Relative',
          sortType: 'basic',
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

export default SkaterAdvStatsTable;

const PlayerNameWrapper = styled.span`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.blue600};
`;
