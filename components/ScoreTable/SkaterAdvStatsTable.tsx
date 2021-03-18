import React from 'react';
// import Link from '../../components/LinkWithSeason';
import ScoreTable from '.';
import { Player } from '../..';

interface Props {
  data: Array<Player>;
}

function SkaterAdvStatsTable({ data: players }: Props): JSX.Element {
  const columnData = [
    {
      Header: 'Advanced Stats',
      id: 'player-table',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: 'name',
          title: 'Player Name',
        },
        {
          Header: 'Pos',
          id: 'player-table-position',
          accessor: 'position',
          title: 'Position',
        },
        {
          Header: 'GP',
          id: 'player-table-gamesPlayed',
          accessor: 'gamesPlayed',
          title: 'Games Played',
        },
        {
          Header: 'PDO',
          id: 'player-table-pdo',
          accessor: 'advancedStats.PDO',
          title: 'PDO',
        },
        {
          Header: 'GF/60',
          id: 'player-table-gf60',
          accessor: 'advancedStats.GF60',
          title: 'Goals For per 60 Minutes',
        },
        {
          Header: 'GA/60',
          id: 'player-table-ga60',
          accessor: 'advancedStats.GA60',
          title: 'Goals Against per 60 Minutes',
        },
        {
          Header: 'SF/60',
          id: 'player-table-sf60',
          accessor: 'advancedStats.SF60',
          title: 'Shots For per 60 Minutes',
        },
        {
          Header: 'SA/60',
          id: 'player-table-sa60',
          accessor: 'advancedStats.SA60',
          title: 'Shots Against per 60 Minutes',
        },
        {
          Header: 'CF',
          id: 'player-table-cf',
          accessor: 'advancedStats.CF',
          title: 'Corsi For',
        },
        {
          Header: 'CA',
          id: 'player-table-ca',
          accessor: 'advancedStats.CA',
          title: 'Corsi Against',
        },
        {
          Header: 'CF%',
          id: 'player-table-cfpct',
          accessor: 'advancedStats.CFPct',
          title: 'Corsi For Percentage',
        },
        {
          Header: 'CF% Rel',
          id: 'player-table-cfpctrel',
          accessor: 'advancedStats.CFPctRel',
          title: 'Corsi For Percentage Relative',
        },
        {
          Header: 'FF',
          id: 'player-table-ff',
          accessor: 'advancedStats.FF',
          title: 'Fenwick For',
        },
        {
          Header: 'FA',
          id: 'player-table-fa',
          accessor: 'advancedStats.FA',
          title: 'Fenwick Against',
        },
        {
          Header: 'FF%',
          id: 'player-table-ffpct',
          accessor: 'advancedStats.FFPct',
          title: 'Fenwick For Percentage',
        },
        {
          Header: 'FF% Rel',
          id: 'player-table-ffpctrel',
          accessor: 'advancedStats.FFPctRel',
          title: 'Fenwick For Percentage Relative',
        },
      ],
    },
  ];

  return <ScoreTable data={players} columnData={columnData} />;
}

export default SkaterAdvStatsTable;
