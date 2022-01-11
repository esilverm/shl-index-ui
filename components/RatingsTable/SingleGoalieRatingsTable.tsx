import React from 'react';

import { GoalieRatings } from '../..';
import PlayerTable from '../PlayerTable';

import { calculateGoalieTPE } from './GoalieRatingsTable';

interface Props {
  data: Array<GoalieRatings>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
}

function SingleGoalieRatingsTable({
  data: players,
  pagination = false,
  teamPage = false,
  searching = false,
}: Props): JSX.Element {
  const columnData = [
    {
      Header: 'Player Info',
      id: 'player-table-basic-info',
      columns: [
        {
          Header: 'Season',
          id: 'player-table-season',
          accessor: 'season',
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
      sortBySeason={true}
    />
  );
}

export default SingleGoalieRatingsTable;
