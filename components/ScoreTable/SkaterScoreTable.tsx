import React from 'react';
// import Link from 'next/link';
import ScoreTable from '.';
import { Player } from '../..';

interface Props {
  data: Array<Player>;
}

function SkaterScoreTable({ data: players }: Props): JSX.Element {
  const calculateTimeOnIce = (toi: number, gamesPlayed: number) =>
    `${toi / gamesPlayed / 60 >> 0 }:${(toi / 50 % 60 >> 0) < 10 ? '0' : ''}${toi / 50 % 60 >> 0}`;

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
          accessor: 'position'
        },
      ]
    },
    {
      Header: 'Scoring',
      columns: [
        {
          Header: 'GP',
          accessor: 'gamesPlayed',
          title: 'Games Played'
        },
        {
          Header: 'G',
          accessor: 'goals',
          title: 'Goals'
        },
        {
          Header: 'A',
          accessor: 'assists',
          title: 'Assists'
        },
        {
          Header: 'PTS',
          accessor: 'points',
          title: 'Points'
        },
        {
          Header: '+/-',
          accessor: 'plusMinus',
          title: 'Plus/Minus'
        },
        {
          Header: 'PIM',
          accessor: 'pim',
          title: 'Penalties in Minutes'
        }
      ]
    },
    {
      Header: 'Goals',
      columns: [
        {
          Header: "EV",
          id: 'player-table-evGoals',
          accessor: ({ goals, ppGoals, shGoals }) => `${goals - ppGoals - shGoals}`,
          title: 'Even Strength Goals',
        },
        {
          Header: 'PP',
          id: 'player-table-ppGoals',
          accessor: 'ppGoals',
          title: 'Power Play Goals',
        },
        {
          Header: 'SH',
          id: 'player-table-shGoals',
          accessor: 'shGoals',
          title: 'Short-Handed Goals',
        }
      ]
    },
    {
      Header: 'Assists',
      columns: [
        {
          Header: 'EV',
          id: 'player-table-evAssists',
          accessor: ({ assists, ppAssists, shAssists }) => `${assists - ppAssists - shAssists}`,
          title: 'Even Strength Assists',
        },
        {
          Header: 'PP',
          id: 'player-table-ppAssists',
          accessor: 'ppAssists',
          title: 'Power Play Assists',
        },
        {
          Header: 'SH',
          id: 'player-table-shAssists',
          accessor: 'shAssists',
          title: 'Short-Handed Assists',
        },
      ]
    },
    {
      Header: "",
      id: 'player-table-shots',
      columns: [
        {
          Header: 'S',
          accessor: 'shotsOnGoal',
          title: 'Shots On Goal'
        }
      ]
    },
    {
      Header: "",
      id: 'player-table-shot-pct',
      columns: [
        {
          Header: 'S%',
          id: 'player-table-spct',
          accessor: ({ goals, shotsOnGoal }) => `${((goals * 100) / shotsOnGoal).toFixed(1)}%`,
          title: 'Shooting Percentage'
        }
      ]
    },
    {
      Header: 'Ice Time',
      columns: [
        {
          Header: 'TOI',
          id: 'player-table-toi',
          accessor: ({ timeOnIce }) => `${(timeOnIce / 60) >> 0}`,
          title: 'Time on Ice (in Minutes)'
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'ATOI',
          id: 'player-table-averagetoi',
          accessor: ({ timeOnIce, gamesPlayed }) => calculateTimeOnIce(timeOnIce, gamesPlayed),
          title: 'Average Time on Ice'
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'PPTOI',
          id: 'player-table-pptoi',
          accessor: ({ ppTimeOnIce, gamesPlayed }) => calculateTimeOnIce(ppTimeOnIce, gamesPlayed),
          title: 'Average Power Play Time on Ice'
        },
        {
          // ! Will want to make this column sortable by time rather than string
          Header: 'SHTOI',
          id: 'player-table-shtoi',
          accessor: ({ shTimeOnIce, gamesPlayed }) => calculateTimeOnIce(shTimeOnIce, gamesPlayed),
          title: 'Average Short-Handed Time on Ice'
        }
      ]
    },
    {
      Header: '',
      id: 'player-table-giveaway-takeaway',
      columns: [
        {
          Header: 'GA',
          accessor: 'giveaways',
          title: 'Giveaways',
        },
        {
          Header: 'TA',
          accessor: 'takeaways',
          title: 'Takeaways',
        }
      ]
    },
    {
      Header: 'Fights',
      columns: [
        {
          Header: 'W',
          accessor: 'fightWins',
          title: 'Fight Wins'
        },
        {
          Header: 'L',
          accessor: 'fightLosses',
          title: 'Fight Losses'
        }
      ]
    },
    {
      Header: '',
      id: 'player-table-blocks',
      columns: [
        {
          Header: 'BLK',
          accessor: 'shotsBlocked',
          title: 'Blocks'
        }
      ]
    },
    {
      Header: '',
      id: 'player-table-hits',
      columns: [
        {
          Header: 'HIT',
          accessor: 'hits',
          title: 'Hits'
        }
      ]
    },
    {
      Header: 'Game Rating',
      columns: [
        {
          Header: 'GR',
          accessor: 'gameRating',
          title: 'Overall Game Rating'
        },
        {
          Header: 'OGR',
          accessor: 'offensiveGameRating',
          title: 'Offensive Game Rating'
        },
        {
          Header: 'DGR',
          accessor: 'devensiveGameRating',
          title: 'Defensive Game Rating'
        }
      ]
    }
  ];

  return <ScoreTable data={players} columnData={columnData} />;
}

export default SkaterScoreTable;
