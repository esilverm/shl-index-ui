import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
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

  const { league = 0, season: seasonid, type: shorttype = 'rs', limit = 10, desc = true } = req.query;

  let type: string;
  if (shorttype === 'po' || shorttype === 'ps' || shorttype === 'rs') {
    type = shorttype;
  } else {
    type = 'rs';
  }

  const [season] =
    (seasonid !== undefined &&
      !Number.isNaN(seasonid) && [{ SeasonID: seasonid }]) ||
    (await query(
      SQL`
      SELECT DISTINCT SeasonID
      FROM `.append(`player_skater_stats_${type}`).append(SQL`
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `)
    ));

  const pointLeaders = await query(SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, p.\`Last Name\` AS Name, (s.G + s.A) as Points
    FROM `.append(`player_skater_stats_${type} AS s`).append(SQL`
    INNER JOIN player_master as p
      ON s.SeasonID = p.SeasonID 
      AND s.LeagueID = p.LeagueID
      AND s.PlayerID = p.PlayerID
    WHERE s.LeagueID=${+league}
    AND s.SeasonID=${season.SeasonID}
    ORDER BY Points `).append(desc ? `DESC` : `ASC`).append(`
    LIMIT ${limit}
    `));
 
  const parsed = [...pointLeaders].map((player) => ({
    id: player.PlayerID,
    name: player.Name,
    league: player.LeagueID,
    team: player.TeamID,
    season: player.SeasonID,
    points: player.Points,
  }))


  res.status(200).json(parsed);
};
