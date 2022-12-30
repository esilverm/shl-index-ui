//@ts-nocheck
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type TeamLines = ReturnType<typeof parseTeamLines>;

const parseTeamLines = (
  lines: any,
  players: Map<
    number,
    {
      id: number;
      name: string;
    }
  >,
) => ({
  ES: {
    '5on5': {
      L1: {
        LW: players.get(lines['ES L1 LW']),
        C: players.get(lines['ES L1 C']),
        RW: players.get(lines['ES L1 RW']),
        LD: players.get(lines['ES L1 LD']),
        RD: players.get(lines['ES L1 RD']),
      },
      L2: {
        LW: players.get(lines['ES L2 LW']),
        C: players.get(lines['ES L2 C']),
        RW: players.get(lines['ES L2 RW']),
        LD: players.get(lines['ES L2 LD']),
        RD: players.get(lines['ES L2 RD']),
      },
      L3: {
        LW: players.get(lines['ES L3 LW']),
        C: players.get(lines['ES L3 C']),
        RW: players.get(lines['ES L3 RW']),
        LD: players.get(lines['ES L3 LD']),
        RD: players.get(lines['ES L3 RD']),
      },
      L4: {
        LW: players.get(lines['ES L4 LW']),
        C: players.get(lines['ES L4 C']),
        RW: players.get(lines['ES L4 RW']),
        LD: players.get(lines['ES L4 LD']),
        RD: players.get(lines['ES L4 RD']),
      },
    },
    '4on4': {
      L1: {
        LW: players.get(lines['4on4 L1 F1']),
        C: players.get(lines['4on4 L1 F2']),
        LD: players.get(lines['4on4 L1 LD']),
        RD: players.get(lines['4on4 L1 RD']),
      },
      L2: {
        LW: players.get(lines['4on4 L2 F1']),
        C: players.get(lines['4on4 L2 F2']),
        LD: players.get(lines['4on4 L2 LD']),
        RD: players.get(lines['4on4 L2 RD']),
      },
    },
    '3on3': {
      L1: {
        C: players.get(lines['3on3 L1 F1']),
        LD: players.get(lines['3on3 L1 LD']),
        RD: players.get(lines['3on3 L1 RD']),
      },
      L2: {
        C: players.get(lines['3on3 L2 F1']),
        LD: players.get(lines['3on3 L2 LD']),
        RD: players.get(lines['3on3 L2 RD']),
      },
    },
  },
  PP: {
    '5on4': {
      L1: {
        LW: players.get(lines['PP5on4 L1 LW']),
        C: players.get(lines['PP5on4 L1 C']),
        RW: players.get(lines['PP5on4 L1 RW']),
        LD: players.get(lines['PP5on4 L1 LD']),
        RD: players.get(lines['PP5on4 L1 RD']),
      },
      L2: {
        LW: players.get(lines['PP5on4 L2 LW']),
        C: players.get(lines['PP5on4 L2 C']),
        RW: players.get(lines['PP5on4 L2 RW']),
        LD: players.get(lines['PP5on4 L2 LD']),
        RD: players.get(lines['PP5on4 L2 RD']),
      },
    },
    '5on3': {
      L1: {
        LW: players.get(lines['PP5on3 L1 LW']),
        C: players.get(lines['PP5on3 L1 C']),
        RW: players.get(lines['PP5on3 L1 RW']),
        LD: players.get(lines['PP5on3 L1 LD']),
        RD: players.get(lines['PP5on3 L1 RD']),
      },
      L2: {
        LW: players.get(lines['PP5on3 L2 LW']),
        C: players.get(lines['PP5on3 L2 C']),
        RW: players.get(lines['PP5on3 L2 RW']),
        LD: players.get(lines['PP5on3 L2 LD']),
        RD: players.get(lines['PP5on3 L2 RD']),
      },
    },
    '4on3': {
      L1: {
        LW: players.get(lines['PP4on3 L1 F1']),
        C: players.get(lines['PP4on3 L1 F2']),
        LD: players.get(lines['PP4on3 L1 LD']),
        RD: players.get(lines['PP4on3 L1 RD']),
      },
      L2: {
        LW: players.get(lines['PP4on3 L2 F1']),
        C: players.get(lines['PP4on3 L2 F2']),
        LD: players.get(lines['PP4on3 L2 LD']),
        RD: players.get(lines['PP4on3 L2 RD']),
      },
    },
  },
  PK: {
    '4on5': {
      L1: {
        LW: players.get(lines['PK4on5 L1 F1']),
        C: players.get(lines['PK4on5 L1 F2']),
        LD: players.get(lines['PK4on5 L1 LD']),
        RD: players.get(lines['PK4on5 L1 RD']),
      },
      L2: {
        LW: players.get(lines['PK4on5 L2 F1']),
        C: players.get(lines['PK4on5 L2 F2']),
        LD: players.get(lines['PK4on5 L2 LD']),
        RD: players.get(lines['PK4on5 L2 RD']),
      },
      L3: {
        LW: players.get(lines['PK4on5 L3 F1']),
        C: players.get(lines['PK4on5 L3 F2']),
        LD: players.get(lines['PK4on5 L3 LD']),
        RD: players.get(lines['PK4on5 L3 RD']),
      },
    },
    '3on5': {
      L1: {
        C: players.get(lines['PK3on5 L1 F1']),
        LD: players.get(lines['PK3on5 L1 LD']),
        RD: players.get(lines['PK3on5 L1 RD']),
      },
      L2: {
        C: players.get(lines['PK3on5 L2 F1']),
        LD: players.get(lines['PK3on5 L2 LD']),
        RD: players.get(lines['PK3on5 L2 RD']),
      },
    },
    '3on4': {
      L1: {
        C: players.get(lines['PK3on4 L1 F1']),
        LD: players.get(lines['PK3on4 L1 LD']),
        RD: players.get(lines['PK3on4 L1 RD']),
      },
      L2: {
        C: players.get(lines['PK3on4 L2 F1']),
        LD: players.get(lines['PK3on4 L2 LD']),
        RD: players.get(lines['PK3on4 L2 RD']),
      },
    },
  },
  shootout: [
    players.get(lines['Shootout 1']),
    players.get(lines['Shootout 2']),
    players.get(lines['Shootout 3']),
    players.get(lines['Shootout 4']),
    players.get(lines['Shootout 5']),
  ],
  goalies: {
    starter: players.get(lines['Goalie 1']),
    backup: players.get(lines['Goalie 2']),
  },
  extraAttackers: [
    players.get(lines['Extra Attacker 1']),
    players.get(lines['Extra Attacker 2']),
  ],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, season: seasonid } = req.query;

  if (Number.isNaN(+id)) {
    res.status(400).send('Error: Team id must be a number');
    return;
  }

  const seasonResponse =
    //@ts-ignore
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query<{ SeasonID: number }>(SQL`
    SELECT DISTINCT SeasonID
    FROM conferences
    WHERE LeagueID=${+league}
    ORDER BY SeasonID DESC
    LIMIT 1
  `));

  if ('error' in seasonResponse) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [season] = seasonResponse;

  const [lines] = await query(SQL`
    SELECT t.TeamID, t.LeagueID, t.SeasonID, 
      t.\`ES L1 LW\`, t.\`ES L1 C\`, t.\`ES L1 RW\`, t.\`ES L1 LD\`, t.\`ES L1 RD\`, 
      t.\`ES L2 LW\`, t.\`ES L2 C\`, t.\`ES L2 RW\`, t.\`ES L2 LD\`, t.\`ES L2 RD\`,
      t.\`ES L3 LW\`, t.\`ES L3 C\`, t.\`ES L3 RW\`, t.\`ES L3 LD\`, t.\`ES L3 RD\`, 
      t.\`ES L4 LW\`, t.\`ES L4 C\`, t.\`ES L4 RW\`, t.\`ES L4 LD\`, t.\`ES L4 RD\`,
      t.\`PP5on4 L1 LW\`, t.\`PP5on4 L1 C\`, t.\`PP5on4 L1 RW\`, t.\`PP5on4 L1 LD\`, t.\`PP5on4 L1 RD\`,
      t.\`PP5on4 L2 LW\`, t.\`PP5on4 L2 C\`, t.\`PP5on4 L2 RW\`, t.\`PP5on4 L2 LD\`, t.\`PP5on4 L2 RD\`,
      t.\`PP5on3 L1 LW\`, t.\`PP5on3 L1 C\`, t.\`PP5on3 L1 RW\`, t.\`PP5on3 L1 LD\`, t.\`PP5on3 L1 RD\`,
      t.\`PP5on3 L2 LW\`, t.\`PP5on3 L2 C\`, t.\`PP5on3 L2 RW\`, t.\`PP5on3 L2 LD\`, t.\`PP5on3 L2 RD\`,
      t.\`PP4on3 L1 F1\`, t.\`PP4on3 L1 F2\`, t.\`PP4on3 L1 LD\`, t.\`PP4on3 L1 RD\`,
      t.\`PP4on3 L2 F1\`, t.\`PP4on3 L2 F2\`, t.\`PP4on3 L2 LD\`, t.\`PP4on3 L2 RD\`,      
      t.\`PK4on5 L1 F1\`, t.\`PK4on5 L1 F2\`, t.\`PK4on5 L1 LD\`, t.\`PK4on5 L1 RD\`,
      t.\`PK4on5 L2 F1\`, t.\`PK4on5 L2 F2\`, t.\`PK4on5 L2 LD\`, t.\`PK4on5 L2 RD\`,
      t.\`PK4on5 L3 F1\`, t.\`PK4on5 L3 F2\`, t.\`PK4on5 L3 LD\`, t.\`PK4on5 L3 RD\`,
      t.\`PK3on5 L1 F1\`, t.\`PK3on5 L1 LD\`, t.\`PK3on5 L1 RD\`,
      t.\`PK3on5 L2 F1\`, t.\`PK3on5 L2 LD\`, t.\`PK3on5 L2 RD\`,
      t.\`PK3on4 L1 F1\`, t.\`PK3on4 L1 LD\`, t.\`PK3on4 L1 RD\`,
      t.\`PK3on4 L2 F1\`, t.\`PK3on4 L2 LD\`, t.\`PK3on4 L2 RD\`,
      t.\`4on4 L1 F1\`, t.\`4on4 L1 F2\`, t.\`4on4 L1 LD\`, t.\`4on4 L1 RD\`,
      t.\`4on4 L2 F1\`, t.\`4on4 L2 F2\`, t.\`4on4 L2 LD\`, t.\`4on4 L2 RD\`,
      t.\`3on3 L1 F1\`, t.\`3on3 L1 LD\`, t.\`3on3 L1 RD\`,
      t.\`3on3 L2 F1\`, t.\`3on3 L2 LD\`, t.\`3on3 L2 RD\`,
      t.\`Shootout 1\`, t.\`Shootout 2\`, t.\`Shootout 3\`, t.\`Shootout 4\`, t.\`Shootout 5\`,
      t.\`Goalie 1\`, t.\`Goalie 2\`, 
      t.\`Extra Attacker 1\`, t.\`Extra Attacker 2\`
      FROM team_lines AS t
      WHERE t.LeagueID = ${+league}
      AND t.SeasonID = ${season.SeasonID}
      AND t.TeamID = ${+id}
  `);

  if (!lines) {
    res.status(404).json({ error: `Lines for team with ID ${id} not found` });
    return;
  }

  const roster = await query<{ PlayerID: number; Name: string }>(SQL`
  SELECT p.PlayerID, p.\`Last Name\` as Name
  FROM player_master AS p
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID}
    AND TeamID=${+id}
  `);

  if ('error' in roster) {
    res.status(404).json({ error: `Backend Error` });
    return;
  }

  // create a js map of player id to player info
  const players = roster.reduce((acc, player) => {
    if (acc.has(player.PlayerID)) {
      return acc;
    }
    acc.set(player.PlayerID, {
      id: player.PlayerID,
      name: player.Name,
    });
    return acc;
  }, new Map<number, { id: number; name: string }>());

  res.status(200).json(parseTeamLines(lines, players));
};
