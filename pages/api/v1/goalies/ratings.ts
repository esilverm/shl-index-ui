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

  const { league = 0, season: seasonid } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM player_master
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const basePlayerData = await query(SQL`
  SELECT *
  FROM corrected_player_ratings
  INNER JOIN player_master
  ON corrected_player_ratings.PlayerID = player_master.PlayerID
  AND corrected_player_ratings.SeasonID = player_master.SeasonID
  AND corrected_player_ratings.LeagueID = player_master.LeagueID
  WHERE corrected_player_ratings.LeagueID=${+league}
  AND corrected_player_ratings.SeasonID=${season.SeasonID} 
  AND corrected_player_ratings.G=20
  AND player_master.TeamID>=0;
`);

  const parsed = basePlayerData.map((player) => {
    return {
      id: player.PlayerID,
      league: player.LeagueID,
      season: player.SeasonID,
      name: player['Last Name'],
      team: player.TeamID,
      position: "G",
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
      aggression: player.Aggression,
      mentalToughness: player.MentalToughness,
      determination: player.Determination,
      teamPlayer: player.TeamPlayer,
      leadership: player.Leadership,
      goalieStamina: player.GoalieStamina,
      professionalism: player.Professionalism,
    };
  });

  res.status(200).json(parsed);
};
