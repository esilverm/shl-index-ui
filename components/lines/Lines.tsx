import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import { TeamLines } from '../../pages/api/v1/teams/[id]/lines';
import { isMainLeague, League } from '../../utils/leagueHelpers';

import { Line } from './Line';
import { LinePlayer } from './LinePlayer';

const linesDisplays = [
  'Even Strength',
  'Power Play',
  'Penalty Kill',
  'Goalies',
  'Other',
] as const;

export const Lines = ({
  league,
  lines,
}: {
  league: League;
  lines: TeamLines;
}) => {
  return (
    <Tabs>
      <TabList>
        {linesDisplays.map((name) => (
          <Tab key={name}>{name}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          {Object.entries(lines.ES).map(([lineType, group]) => (
            <Line
              key={lineType}
              type={lineType}
              lines={group}
              columns={!isMainLeague(league) ? 4 : 3}
            />
          ))}
        </TabPanel>
        <TabPanel>
          {Object.entries(lines.PP).map(([lineType, group]) => (
            <Line
              key={lineType}
              type={lineType}
              lines={group}
              columns={!isMainLeague(league) ? 4 : 3}
            />
          ))}
        </TabPanel>
        <TabPanel>
          {Object.entries(lines.PK).map(([lineType, group]) => (
            <Line
              key={lineType}
              type={lineType}
              lines={group}
              columns={!isMainLeague(league) ? 4 : 3}
            />
          ))}
        </TabPanel>
        <TabPanel>
          <div className="flex w-full items-center justify-center">
            <LinePlayer
              player={lines.goalies.starter}
              position="Starter"
              className="flex-1"
            />
            <LinePlayer
              player={lines.goalies.backup}
              position="Backup"
              className="flex-1"
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex w-full items-start justify-evenly gap-5">
            <div className="flex flex-1 flex-col items-center justify-center gap-5">
              <h3 className="text-2xl font-bold">Shootout Order</h3>
              {lines.shootout
                .filter((player) => !!player)
                .map((player, i) => (
                  <LinePlayer
                    key={i}
                    player={player}
                    position={`Shootout ${i + 1}`}
                    className="w-full"
                  />
                ))}
            </div>
            <div className="flex w-1/2 flex-col items-center justify-center gap-5">
              <h3 className="text-2xl font-bold">Extra Attackers</h3>
              {lines.extraAttackers
                .filter((player) => !!player)
                .map((player, i) => (
                  <LinePlayer
                    key={i}
                    player={player}
                    position="Extra Attacker"
                    className="w-full"
                  />
                ))}
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
