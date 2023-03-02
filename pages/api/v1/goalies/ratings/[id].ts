import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { InternalPlayerRatings } from '../../../../../typings/api';
import { calculateGoalieTPE } from '../../../../../utils/playerHelpers';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type GoalieRatings = ReturnType<typeof parseGoalieRatings>;

export const parseGoalieRatings = (player: InternalPlayerRatings) => {
  const temp = {
    id: player.PlayerID,
    league: player.LeagueID,
    season: player.SeasonID,
    name: player.Name,
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

  return {
    ...temp,
    appliedTPE: calculateGoalieTPE(temp),
  };
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid, id } = req.query;

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
      AND r.G=20
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

  res.status(200).json(filtered.map(parseGoalieRatings));
};
