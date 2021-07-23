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
    type: longType = 'regular',
    season: seasonid,
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
      FROM `.append(`player_goalie_stats_${type}`).append(SQL`
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `)
    ));

  const goalieStats = await query(
    SQL`
    SELECT s.PlayerID, s.LeagueID, s.SeasonID, s.TeamID, p.\`Last Name\` AS Name, s.GP, s.Minutes, s.Wins, s.Losses, s.OT, s.ShotsAgainst, s.Saves, s.GoalsAgainst, s.GAA, s.Shutouts, s.SavePct, s.GameRating, team_data.Abbr, team_data.LeagueID, team_data.TeamID, team_data.SeasonID
    FROM `.append(`player_goalie_stats_${type} AS s`).append(SQL`
    INNER JOIN player_master as p
    ON s.SeasonID = p.SeasonID 
    AND s.LeagueID = p.LeagueID
    AND s.PlayerID = p.PlayerID
	INNER JOIN corrected_player_ratings as r
    ON s.SeasonID = r.SeasonID 
    AND s.LeagueID = r.LeagueID
    AND s.PlayerID = r.PlayerID
    INNER JOIN team_data
    ON p.TeamID = team_data.TeamID
    AND s.SeasonID = team_data.SeasonID
    AND s.LeagueID = team_data.LeagueID  
    WHERE s.LeagueID=${+league}
    AND s.SeasonID=${season.SeasonID}
    AND r.G=20
	AND p.TeamID>=0;
  `)
  );

  const parsed = [...goalieStats].map((player) => {
    return {
      id: player.PlayerID,
      name: player.Name,
      position: 'G',
      league: player.LeagueID,
      team: player.Abbr,
      season: player.SeasonID,
      gamesPlayed: player.GP,
      minutes: player.Minutes,
      wins: player.Wins,
      losses: player.Losses,
      ot: player.OT,
      shotsAgainst: player.ShotsAgainst,
      saves: player.Saves,
      goalsAgainst: player.GoalsAgainst,
      gaa: player.GAA.toFixed(2),
      shutouts: player.Shutouts,
      savePct: player.SavePct.toFixed(3),
      gameRating: player.GameRating,
    };
  });

  res.status(200).json(parsed);
};
