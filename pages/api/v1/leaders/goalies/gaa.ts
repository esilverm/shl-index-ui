import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

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
    desc = false,
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

  const gaaLeaders = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, t.Name as TeamName, t.Nickname as TeamNickname, t.Abbr as TeamAbbr, p.\`Last Name\` AS Name, s.GAA, s.GP
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
    AND s.GP >= (
      SELECT MAX(GP) FROM `
      )
      .append(`player_goalie_stats_${type}`)
      .append(
        SQL`
      WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
    ) / 5
    ORDER BY s.GAA `
      )
      .append(desc ? `DESC` : `ASC`).append(`
    LIMIT ${limit}
    `)
  );

  const parsed = [...gaaLeaders].map((player) => ({
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
    stat: player.GAA.toFixed(2),
    statName: 'Goals Against Average',
    statNameAbbr: 'GAA',
  }));

  res.status(200).json(parsed);
};
