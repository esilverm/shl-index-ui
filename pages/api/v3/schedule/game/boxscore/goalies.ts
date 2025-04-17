import Cors from 'cors';
import { partition } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

type BoxscoreGoaliesInternal = {
  playerID: number;
  name: string;
  isHomeTeam: 1 | 0;
  teamID: number;
  GameRating: number;
  ShotsAgainst: number;
  GoalsAgainst: number;
  Saves: number;
  SavePct: number;
  Minutes: number;
  PIM: number;
};

export type BoxscoreGoalie = ReturnType<typeof parseGoalieInfo>;

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

const parseGoalieInfo = (goalie: BoxscoreGoaliesInternal) => ({
  name: goalie.name,
  id: goalie.playerID,
  isHomeTeam: goalie.isHomeTeam,
  teamID: goalie.teamID,
  shotsAgainst: goalie.ShotsAgainst,
  goalsAgainst: goalie.GoalsAgainst,
  saves: goalie.Saves,
  savePct: goalie.SavePct,
  pim: goalie.PIM,
  gameRating: Math.floor(goalie.GameRating),
  minutesPlayed: `${
    goalie.Minutes / 60_000 < 10
      ? '0' + Math.floor(goalie.Minutes / 60_000)
      : Math.floor(goalie.Minutes / 60_000)
  }:${
    (goalie.Minutes / 1_000) % 60 < 10
      ? '0' + Math.floor((goalie.Minutes / 1_000) % 60)
      : Math.floor((goalie.Minutes / 1_000) % 60)
  }`,
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { gameid, league } = req.query;

  if (!gameid || !league) {
    res.status(400).json({ error: 'Missing arguments' });
    return;
  }

  const boxscoreGoalieStats = await query<BoxscoreGoaliesInternal>(
    SQL`
    SELECT b.playerID, p.\`last name\` as name, 	   
          CASE WHEN s.Home = b.teamId
               THEN 1
               ELSE 0
          END as isHomeTeam,
          p.teamID, b.GameRating, b.ShotsAgainst, b.GoalsAgainst, b.Saves, b.SavePct, b.Minutes, b.PIM
    FROM boxscore_goalie_summary as b
    LEFT JOIN player_master as p
      ON p.PlayerID = b.playerID
        AND p.LeagueID = b.LeagueID
        AND p.SeasonID = b.SeasonID
    LEFT JOIN slugviewer as s
      ON s.GameID = b.gameID
      AND s.LeagueID = b.LeagueID
    WHERE b.gameID = ${gameid} AND b.LeagueID = ${league}
    `,
  );

  if ('error' in boxscoreGoalieStats) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [homeGoalies, awayGoalies] = partition(
    boxscoreGoalieStats,
    ({ isHomeTeam }) => isHomeTeam,
  );

  res.status(200).json({
    away: awayGoalies.map(parseGoalieInfo),
    home: homeGoalies.map(parseGoalieInfo),
  });
};
