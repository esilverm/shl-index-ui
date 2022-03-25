import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { calculateGoalieTPE } from '../../../../../components/RatingsTable/GoalieRatingsTable';
import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid, id } = req.query;

  const basePlayerData = await query(
    SQL`
  SELECT *
  FROM corrected_player_ratings
  INNER JOIN player_master
  ON corrected_player_ratings.PlayerID = player_master.PlayerID
  AND corrected_player_ratings.SeasonID = player_master.SeasonID
  AND corrected_player_ratings.LeagueID = player_master.LeagueID
  INNER JOIN team_data
  ON player_master.TeamID = team_data.TeamID
  AND corrected_player_ratings.SeasonID = team_data.SeasonID
  AND corrected_player_ratings.LeagueID = team_data.LeagueID
  WHERE corrected_player_ratings.LeagueID=${+league}
  AND corrected_player_ratings.G=20
  AND player_master.TeamID>=0
  AND corrected_player_ratings.PlayerID = ${+id}
`
      .append(
        seasonid != null
          ? SQL`
          AND corrected_player_ratings.SeasonID=${+seasonid}
        `
          : ''
      )
      .append(SQL`ORDER BY corrected_player_ratings.SeasonID DESC`)
  );

  // remove 0 season
  const filtered = basePlayerData.filter((item) => {
    return item.SeasonID !== 0;
  });

  const parsed = filtered.map((player) => {
    const tempGoalieRatings = {
      id: player.PlayerID,
      league: player.LeagueID,
      season: player.SeasonID,
      name: player['Last Name'],
      team: player.Abbr,
      position: 'G',
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
      teamPlayer: player.Teamplayer,
      leadership: player.Leadership,
      goalieStamina: player.GoalieStamina,
      professionalism: player.Professionalism,
    };

    const appliedTPE = calculateGoalieTPE(tempGoalieRatings);
    return {
      ...tempGoalieRatings,
      appliedTPE,
    };
  });

  res.status(200).json(parsed);
};
