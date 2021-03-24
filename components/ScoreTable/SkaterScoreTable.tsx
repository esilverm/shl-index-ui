import React from 'react';
// import Link from '../../components/LinkWithSeason';
import ScoreTable from '.';
import { Player } from '../..';

interface Props {
  data: Array<Player>;
}

function SkaterScoreTable({ data: players }: Props): JSX.Element {
  const calculateTimeOnIce = (toi: number, gamesPlayed: number) =>
    `${(toi / gamesPlayed / 60) >> 0}:${(toi / 50) % 60 >> 0 < 10 ? '0' : ''}${
      (toi / 50) % 60 >> 0
    }`;

  const columnData = [
    {
      Header: '',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Player',
          id: 'player-table-player',
          accessor: 'name',
          // Create cell which contains link to player
        },
        {
          Header: 'Pos',
          id: 'player-table-position',
          accessor: 'position',
        },
      ],
    },
    {
      Header: 'Scoring',
      columns: [
        {
          Header: 'GP',
          accessor: 'gamesPlayed',
          title: 'Games Played',
          sortDescFirst: true
        },
        {
          Header: 'G',
          accessor: 'goals',
          title: 'Goals',
          sortDescFirst: true
        },
        {
          Header: 'A',
          accessor: 'assists',
          title: 'Assists',
          sortDescFirst: true
        },
        {
          Header: 'PTS',
          accessor: 'points',
          title: 'Points',
          sortDescFirst: true
        },
        {
          Header: '+/-',
          accessor: 'plusMinus',
          title: 'Plus/Minus',
          sortType: 'basic',
          sortDescFirst: true
        },
        {
          Header: 'PIM',
          accessor: 'pim',
          title: 'Penalties in Minutes',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: 'Goals',
      columns: [
        {
          Header: 'EV',
          id: 'player-table-evGoals',
          accessor: ({ goals, ppGoals, shGoals }) =>
            `${goals - ppGoals - shGoals}`,
          title: 'Even Strength Goals',
          sortDescFirst: true
        },
        {
          Header: 'PP',
          id: 'player-table-ppGoals',
          accessor: 'ppGoals',
          title: 'Power Play Goals',
          sortDescFirst: true
        },
        {
          Header: 'SH',
          id: 'player-table-shGoals',
          accessor: 'shGoals',
          title: 'Short-Handed Goals',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: 'Assists',
      columns: [
        {
          Header: 'EV',
          id: 'player-table-evAssists',
          accessor: ({ assists, ppAssists, shAssists }) =>
            `${assists - ppAssists - shAssists}`,
          title: 'Even Strength Assists',
          sortDescFirst: true
        },
        {
          Header: 'PP',
          id: 'player-table-ppAssists',
          accessor: 'ppAssists',
          title: 'Power Play Assists',
          sortDescFirst: true
        },
        {
          Header: 'SH',
          id: 'player-table-shAssists',
          accessor: 'shAssists',
          title: 'Short-Handed Assists',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: '',
      id: 'player-table-shots',
      columns: [
        {
          Header: 'S',
          accessor: 'shotsOnGoal',
          title: 'Shots On Goal',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: '',
      id: 'player-table-shot-pct',
      columns: [
        {
          Header: 'S%',
          id: 'player-table-spct',
          accessor: ({ goals, shotsOnGoal }) =>
            `${((goals * 100) / shotsOnGoal).toFixed(1)}%`,
          title: 'Shooting Percentage',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: 'Ice Time',
      columns: [
        {
          Header: 'TOI',
          id: 'player-table-toi',
          accessor: ({ timeOnIce }) => `${(timeOnIce / 60) >> 0}`,
          title: 'Time on Ice (in Minutes)',
          sortDescFirst: true
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'ATOI',
          id: 'player-table-averagetoi',
          accessor: ({ timeOnIce, gamesPlayed }) =>
            calculateTimeOnIce(timeOnIce, gamesPlayed),
          title: 'Average Time on Ice',
          sortDescFirst: true
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'PPTOI',
          id: 'player-table-pptoi',
          accessor: ({ ppTimeOnIce, gamesPlayed }) =>
            calculateTimeOnIce(ppTimeOnIce, gamesPlayed),
          title: 'Average Power Play Time on Ice',
          sortDescFirst: true
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'SHTOI',
          id: 'player-table-shtoi',
          accessor: ({ shTimeOnIce, gamesPlayed }) =>
            calculateTimeOnIce(shTimeOnIce, gamesPlayed),
          title: 'Average Short-Handed Time on Ice',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: '',
      id: 'player-table-giveaway-takeaway',
      columns: [
        {
          Header: 'GA',
          accessor: 'giveaways',
          title: 'Giveaways',
          sortDescFirst: true
        },
        {
          Header: 'TA',
          accessor: 'takeaways',
          title: 'Takeaways',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: 'Fights',
      columns: [
        {
          Header: 'W',
          accessor: 'fightWins',
          title: 'Fight Wins',
          sortDescFirst: true
        },
        {
          Header: 'L',
          accessor: 'fightLosses',
          title: 'Fight Losses',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: '',
      id: 'player-table-blocks',
      columns: [
        {
          Header: 'BLK',
          accessor: 'shotsBlocked',
          title: 'Blocks',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: '',
      id: 'player-table-hits',
      columns: [
        {
          Header: 'HIT',
          accessor: 'hits',
          title: 'Hits',
          sortDescFirst: true
        },
      ],
    },
    {
      Header: 'Game Rating',
      columns: [
        {
          Header: 'GR',
          accessor: 'gameRating',
          title: 'Overall Game Rating',
          sortDescFirst: true
        },
        {
          Header: 'OGR',
          accessor: 'offensiveGameRating',
          title: 'Offensive Game Rating',
          sortDescFirst: true
        },
        {
          Header: 'DGR',
          accessor: 'devensiveGameRating',
          title: 'Defensive Game Rating',
          sortDescFirst: true
        },
      ],
    },
  ];

  return <ScoreTable data={players} columnData={columnData} />;
}

export default SkaterScoreTable;
