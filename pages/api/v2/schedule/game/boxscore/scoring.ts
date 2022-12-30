import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

type BoxscoreScoringInternal = {
  period: number;
  time: number;
  goalscorer: number;
  goalscorerName: string;
  primaryAssist: number;
  primaryAssistName: string | null;
  secondaryAssist: number;
  secondaryAssistName: string | null;
  teamAbbr: string;
  goalType: 'ES' | 'SH' | 'PP' | 'ES, ENG';
};

export type BoxscoreScoring = ReturnType<typeof parseScoringInfo>;

const parseScoringInfo = (score: BoxscoreScoringInternal) => ({
  period: score.period,
  time: score.time,
  readableTime: `${
    score.time / 60 < 10
      ? '0' + Math.floor(score.time / 60)
      : Math.floor(score.time / 60)
  }:${score.time % 60 < 10 ? '0' + (score.time % 60) : score.time % 60}`,
  teamAbbr: score.teamAbbr,
  scorer: {
    name: score.goalscorerName,
    id: score.goalscorer,
  },
  primaryAssist:
    score.primaryAssist === 0
      ? null
      : {
          name: score.primaryAssistName,
          id: score.primaryAssist,
        },
  secondaryAssist:
    score.secondaryAssist === 0
      ? null
      : {
          name: score.secondaryAssistName,
          id: score.secondaryAssist,
        },
  goalType: score.goalType,
});

const cors = Cors({
  methods: ['GET', 'HEAD'],
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

  const boxscoreScoringStats = await query<BoxscoreScoringInternal>(
    SQL`
    SELECT b.period, b.time, 
      b.scoring_playerID as goalscorer, 
      p1.\`Last Name\` as goalscorerName,
      b.assist1_playerID as primaryAssist,
      CASE WHEN b.assist1_playerID > 0 
           THEN p2.\`Last Name\`
           ELSE null
      end as primaryAssistName,
      b.assist2_playerID as secondaryAssist,
      CASE WHEN b.assist2_playerID > 0 
           THEN p3.\`Last Name\`
           ELSE null
      end as secondaryAssistName,
      t.Abbr as teamAbbr, 
      b.goal_notes as goalType
    FROM boxscore_period_scoring_summary as b
    INNER JOIN player_master as p1
      ON p1.PlayerID = b.scoring_playerID 
        AND p1.LeagueID = b.LeagueID 
        AND p1.SeasonID = b.SeasonID
    INNER JOIN player_master as p2
      ON p2.PlayerID = b.assist1_playerID
        AND p2.LeagueID = b.LeagueID 
        AND p2.SeasonID = b.SeasonID
    INNER JOIN player_master as p3
      ON p3.PlayerID = b.assist2_playerID 
        AND p3.LeagueID = b.LeagueID 
        AND p3.SeasonID = b.SeasonID
    INNER JOIN team_data as t
      ON t.TeamID = b.teamID 
        AND t.LeagueID = b.LeagueID 
        AND t.SeasonID = b.SeasonID
    WHERE b.gameID = ${gameid} AND b.LeagueID = ${league}
    `,
  );

  if ('error' in boxscoreScoringStats) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  res.status(200).json(boxscoreScoringStats.map(parseScoringInfo));
};
