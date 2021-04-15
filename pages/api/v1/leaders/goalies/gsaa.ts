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

  const {
    league = 0,
    season: seasonid,
    type: longType = 'regular',
    limit = 10,
    desc = true,
  } = req.query;

  let type: string;
  if (longType === 'preseason') {
    type = 'ps';
  } else if (longType === 'playoffs') {
    type = 'po';
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

  const averageSavePct = await query(
    SQL`
    SELECT AVG(SavePct) as avg
    FROM `.append(`player_goalie_stats_${type}`).append(SQL`
    WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID}
  `)
  );

  const gsaaLeaders = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, p.\`Last Name\` AS Name, ((s.ShotsAgainst * (1 - `
      .append(averageSavePct[0].avg)
      .append(
        `)) - s.GoalsAgainst) as GSAA
    FROM `
      )
      .append(`player_goalie_stats_${type} AS s`)
      .append(
        SQL`
    INNER JOIN player_master as p
      ON s.SeasonID = p.SeasonID 
      AND s.LeagueID = p.LeagueID
      AND s.PlayerID = p.PlayerID
    WHERE s.LeagueID=${+league}
    AND s.SeasonID=${season.SeasonID}
    ORDER BY GSAA `
      )
      .append(desc ? `DESC` : `ASC`).append(`
    LIMIT ${limit}
    `)
  );

  console.log(gsaaLeaders);

  const parsed = [...gsaaLeaders].map((player) => ({
    id: player.PlayerID,
    name: player.Name,
    league: player.LeagueID,
    team: player.TeamID,
    season: player.SeasonID,
    gsaa: player.GSAA,
  }));

  res.status(200).json(parsed);
};
