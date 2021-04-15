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

  const gpLeaders = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, t.Name as TeamName, t.Nickname as TeamNickname, t.Abbr as TeamAbbr, p.\`Last Name\` AS Name, s.GP
    FROM `
      .append(`player_goalie_stats_${type} AS s`)
      .append(
        SQL`
    INNER JOIN player_master as p
      ON s.SeasonID = p.SeasonID 
      AND s.LeagueID = p.LeagueID
      AND s.PlayerID = p.PlayerID
    INNER JOIN team_data as t
      ON s.TeamID = t.TeamID
      AND s.SeasonID = t.SeasonID
      AND s.LeagueID = t.LeagueID
    WHERE s.LeagueID=${+league}
    AND s.SeasonID=${season.SeasonID}
    ORDER BY s.GP `
      )
      .append(desc ? `DESC` : `ASC`).append(`
    LIMIT ${limit}
    `)
  );

  const parsed = [...gpLeaders].map((player) => ({
    id: player.PlayerID,
    name: player.Name,
    league: player.LeagueID,
    team: {
      id: player.TeamID,
      name: player.TeamName,
      nickname: player.TeamNickname,
      abbr: player.TeamAbbr,
    },
    season: player.SeasonID,
    gamesPlayed: player.GP,
  }));

  res.status(200).json(parsed);
};
