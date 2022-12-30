import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { InternalPlayerRatings } from '../../../../../typings/api';
import { calculateSkaterTPE } from '../../../../../utils/playerHelpers';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type SkaterRatings = ReturnType<typeof parseSkaterRatings>;

export const parseSkaterRatings = (player: InternalPlayerRatings) => {
  const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
    [
      +player.G,
      +player.LD,
      +player.RD,
      +player.LW,
      +player.C,
      +player.RW,
    ].indexOf(20)
  ];

  const tempPlayerRatings = {
    id: player.PlayerID,
    league: player.LeagueID,
    season: player.SeasonID,
    name: player.Name,
    team: player.Abbr,
    screening: player.Screening,
    gettingOpen: player.GettingOpen,
    passing: player.Passing,
    puckhandling: player.PuckHandling,
    shootingAccuracy: player.ShootingAccuracy,
    shootingRange: player.ShootingRange,
    offensiveRead: player.OffensiveRead,
    checking: player.Checking,
    hitting: player.Hitting,
    positioning: player.Positioning,
    stickchecking: player.Stickchecking,
    shotBlocking: player.ShotBlocking,
    faceoffs: player.Faceoffs,
    defensiveRead: player.DefensiveRead,
    acceleration: player.Acceleration,
    agility: player.Agility,
    balance: player.Balance,
    speed: player.Speed,
    stamina: player.Stamina,
    strength: player.Strength,
    fighting: player.Fighting,
    aggression: player.Aggression,
    bravery: player.Bravery,
    determination: player.Determination,
    teamPlayer: player.Teamplayer,
    leadership: player.Leadership,
    temperament: player.Temperament,
    professionalism: player.Professionalism,
  };

  return {
    ...tempPlayerRatings,
    position,
    appliedTPE: calculateSkaterTPE(tempPlayerRatings),
  };
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, season: seasonid } = req.query;

  if (!id) {
    res.status(400).send('Error: Missing Query Parameters');
    return;
  }

  const basePlayerData = await query<InternalPlayerRatings>(
    SQL`
      SELECT r.*, p.\`Last Name\` as Name, t.\`Abbr\`
      FROM corrected_player_ratings as r
      INNER JOIN player_master as p
        ON r.PlayerID = p.PlayerID
          AND r.SeasonID = p.SeasonID
          AND r.LeagueID = p.LeagueID
      INNER JOIN team_data as t
        ON p.TeamID = t.TeamID
          AND r.SeasonID = t.SeasonID
          AND r.LeagueID = t.LeagueID
      WHERE r.LeagueID=${+league}
        AND r.G<19
        AND p.TeamID>=0
        AND r.PlayerID = ${+id}
        `
      .append(
        seasonid != null
          ? SQL`
                AND r.SeasonID=${+seasonid}
              `
          : '',
      )
      .append(SQL`ORDER BY r.SeasonID DESC`),
  );

  if ('error' in basePlayerData) {
    res.status(400).send('Error: Backend Error');
    return;
  }

  // remove 0 season
  const filtered = basePlayerData.filter((item) => {
    return item.SeasonID !== 0;
  });

  res.status(200).json(filtered.map(parseSkaterRatings));
};
