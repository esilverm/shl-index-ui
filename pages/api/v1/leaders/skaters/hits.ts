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
    position = 'all',
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

  const sbLeaders = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, t.Name as TeamName, t.Nickname as TeamNickname, t.Abbr as TeamAbbr, p.\`Last Name\` AS Name, s.HIT as Hits, s.GP
    FROM `
      .append(`player_skater_stats_${type} AS s`)
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
    INNER JOIN corrected_player_ratings as r
      ON s.SeasonID = r.SeasonID 
      AND s.LeagueID = r.LeagueID
      AND s.PlayerID = r.PlayerID `
      )
      .append(
        position === 'd'
          ? 'AND ( r.LD = 20 OR r.RD = 20 )'
          : position === 'f'
          ? 'AND NOT ( r.LD = 20 OR r.RD = 20 )'
          : ''
      )
      .append(
        SQL`
    WHERE s.LeagueID=${+league}
    AND s.SeasonID=${season.SeasonID}
    ORDER BY Hits `
      )
      .append(desc ? `DESC` : `ASC`).append(`
    LIMIT ${limit}
    `)
  );

  const parsed = [...sbLeaders].map((player) => ({
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
    stat: player.Hits,
    statName: 'Hits',
    statNameAbbr: 'HIT',
  }));

  res.status(200).json(parsed);
};
