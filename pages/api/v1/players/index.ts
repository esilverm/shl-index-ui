import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid, type = 'statistics' } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_data
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  if (type === 'ratings') {
    const players = await query(SQL`
      SELECT * 
      FROM player_master
      WHERE LeagueID=${league}
        AND SeasonID=${season.SeasonID}
      INNER JOIN player_ratings ON player_master.PlayerID = player_ratings.PlayerID;
    `);

    const parsed = players.map(player => {
      const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
        [
          player.G,
          player.LD,
          player.RD,
          player.LW,
          player.C,
          player.RW,
        ].indexOf(20)
      ];

      const playerInfo = {
        id: player.PlayerID,
        team: player.TeamID,
        league: player.LeagueID,
        season: player.SeasonID,
        name: player['Last Name'],
        height: parseInt(player.Height, 10),
        weight: parseInt(player.Weight, 10),
        position
      };

      if (position === 'G') {
        return {
          ...playerInfo,
          ratings: {
            blocker: player.Blocker,
            glove: player.Glove,
            passing: player.GPassing,
            pokeCheck: player.GPokecheck,
            positioning: player.GPositioning,
            rebound: player.Rebound,
            recovery: player.Recovery,
            puckhandling: player.GPuckhandling,
            lowShots: player.LowShots,
            reflexes: player.Reflexes,
            skating: player.GSkating,
            mentalToughness: player.MentalToughness,
            goalieStamina: player.GoalieStamina
          }
        };
      }
      return {
        ...playerInfo,
        ratings: {
          screening: player.Screening,
          gettingOpen: player.GettingOpen,
          passing: player.Passing,
          puckhandling: player.Puckhandling,
          shootingAccuracy: player.ShootingAccuracy,
          shootingRange: player.ShootingRange,
          offensiveRead: player.OffensiveRead,
          checking: player.Checking,
          hitting: player.Hitting,
          positioning: player.Positioning,
          stickchecking: player.Stickchecking,
          shotBlocking: player.shotBlocking,
          faceoffs: player.Faceoffs,
          defensiveRead: player.DefensiveRead,
          acceleration: player.Accelerating,
          agility: player.Agility,
          balance: player.Balance,
          speed: player.Speed,
          stamina: player.Stamina,
          strength: player.Strength,
          fighting: player.Fighting,
          aggression: player.Aggression,
          bravery: player.Bravery
        }
      };
    });
    res.status(200).json(parsed);
    return;
  }

  res.status(200).json({});
};
