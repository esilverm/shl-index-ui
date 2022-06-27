import React from 'react';

import { Player } from '../..';

import PlayerTable from './PlayerTable';

interface Props {
  data: Array<Player>;
  teamPage?: boolean;
}

function SkaterAdvStatsTable({
  data: players,
  teamPage = false,
}: Props): JSX.Element {
  const columnData = [
    {
      Header: 'Player Name',
      id: 'player-table-player',

      accessor: teamPage ? 'name' : ({ name, team }) => `${name} (${team})`,
    },
    {
      Header: 'F',
      title: 'Forward',
      id: 'player-table-forward',
      accessor: ({ position }) =>
        position === 'C' || position === 'LW' || position === 'RW' ? 'X' : '',
    },
    {
      Header: 'D',
      title: 'Defense',
      id: 'player-table-defense',
      accessor: ({ position }) =>
        position === 'LD' || position === 'RD' ? 'X' : '',
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
  ];

  return (
    <PlayerTable data={players} columnData={columnData} teamPage={teamPage} />
  );
}

export default SkaterAdvStatsTable;
