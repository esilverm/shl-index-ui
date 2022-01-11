import React from 'react';

// import Link from '../../components/LinkWithSeason';
import { PlayerRatings } from '../..';
import PlayerTable from '../PlayerTable';

import { calculateSkaterTPE } from './SkaterRatingsTable';

interface Props {
  data: Array<PlayerRatings>;
  pagination?: boolean;
  teamPage?: boolean;
  searching?: boolean;
}

function SinglePlayerRatingsTable({
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
          accessor: ({
            screening,
            gettingOpen,
            passing,
            puckHandling,
            shootingAccuracy,
            shootingRange,
            offensiveRead,
            checking,
            hitting,
            positioning,
            stickChecking,
            shotBlocking,
            faceoffs,
            defensiveRead,
            acceleration,
            agility,
            balance,
            speed,
            stamina,
            strength,
            fighting,
            aggression,
            bravery
          }) => [
              // Stamina up front since it is different
              stamina,
              screening,
              gettingOpen,
              passing,
              puckHandling,
              shootingAccuracy,
              shootingRange,
              offensiveRead,
              checking,
              hitting,
              positioning,
              stickChecking,
              shotBlocking,
              faceoffs,
              defensiveRead,
              acceleration,
              agility,
              balance,
              speed,
              strength,
              fighting,
              aggression,
              bravery
            ],
          title: 'Applied TPE',
          // Create cell which contains link to player
          Cell: ({ value }) => {
            return (
              <>
              {calculateSkaterTPE(value)}
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

export default SinglePlayerRatingsTable;
