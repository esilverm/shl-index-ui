import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

type BoxscoreSummaryInternal = {
  score_home_p1: number;
  score_home_p2: number;
  score_home_p3: number;
  score_home_OT: number;
  score_home_SO: number;
  score_away_p1: number;
  score_away_p2: number;
  score_away_p3: number;
  score_away_OT: number;
  score_away_SO: number;
  star1: number;
  star1Name: string;
  star1Team: number;
  star2: number;
  star2Name: string;
  star2Team: number;
  star3: number;
  star3Name: string;
  star3Team: number;
  shots_home: number;
  shots_away: number;
  PIM_home: number;
  PIM_away: number;
  hits_home: number;
  hits_away: number;
  GA_home: number;
  GA_away: number;
  TA_home: number;
  TA_away: number;
  FOW_home: number;
  FOW_away: number;
  SOG_home_p1: number;
  SOG_home_p2: number;
  SOG_home_p3: number;
  SOG_home_OT: number;
  SOG_away_p1: number;
  SOG_away_p2: number;
  SOG_away_p3: number;
  SOG_away_OT: number;
  PPG_home: number;
  PPO_home: number;
  PPG_away: number;
  PPO_away: number;
  sq0_home: number;
  sq1_home: number;
  sq2_home: number;
  sq3_home: number;
  sq4_home: number;
  sq0_away: number;
  sq1_away: number;
  sq2_away: number;
  sq3_away: number;
  sq4_away: number;
};

export type BoxscoreSummary = ReturnType<typeof parseSummaryInfo>;

const parseSummaryInfo = (summary: BoxscoreSummaryInternal) => ({
  summary: {
    home: {
      shots: summary.shots_home,
      pim: summary.PIM_home,
      hits: summary.hits_home,
      giveaways: summary.GA_home,
      takeaways: summary.TA_home,
      faceoffWins: summary.FOW_home,
      powerPlayGoals: summary.PPG_home,
      powerPlayOpportunities: summary.PPO_home,
      shotQualities: [
        summary.sq0_home,
        summary.sq1_home,
        summary.sq2_home,
        summary.sq3_home,
        summary.sq4_home,
      ],
    },
    away: {
      shots: summary.shots_away,
      pim: summary.PIM_away,
      hits: summary.hits_away,
      giveaways: summary.GA_away,
      takeaways: summary.TA_away,
      faceoffWins: summary.FOW_away,
      powerPlayGoals: summary.PPG_away,
      powerPlayOpportunities: summary.PPO_away,
      shotQualities: [
        summary.sq0_away,
        summary.sq1_away,
        summary.sq2_away,
        summary.sq3_away,
        summary.sq4_away,
      ],
    },
  },
  stars: {
    star1: {
      id: summary.star1,
      name: summary.star1Name,
      team: summary.star1Team,
    },
    star2: {
      id: summary.star2,
      name: summary.star2Name,
      team: summary.star2Team,
    },
    star3: {
      id: summary.star3,
      name: summary.star3Name,
      team: summary.star3Team,
    },
  },
  periodByPeriodStats: [
    {
      home: {
        goals: summary.score_home_p1,
        shots: summary.SOG_home_p1,
      },
      away: {
        goals: summary.score_away_p1,
        shots: summary.SOG_away_p1,
      },
    },
    {
      home: {
        goals: summary.score_home_p2,
        shots: summary.SOG_home_p2,
      },
      away: {
        goals: summary.score_away_p2,
        shots: summary.SOG_away_p2,
      },
    },
    {
      home: {
        goals: summary.score_home_p3,
        shots: summary.SOG_home_p3,
      },
      away: {
        goals: summary.score_away_p3,
        shots: summary.SOG_away_p3,
      },
    },
    {
      home: {
        goals: summary.score_home_OT,
        shots: summary.SOG_home_OT,
      },
      away: {
        goals: summary.score_away_OT,
        shots: summary.SOG_away_OT,
      },
    },
    {
      home: {
        goals: summary.score_home_SO,
      },
      away: {
        goals: summary.score_away_SO,
      },
    },
  ],
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

  const boxscoreSummary = await query<BoxscoreSummaryInternal>(
    SQL`
    SELECT b.score_home_p1, b.score_home_p2, b.score_home_p3, b.score_home_OT, b.score_home_SO, 
        b.score_away_p1, b.score_away_p2, b.score_away_p3, b.score_away_OT, b.score_away_SO,
        b.star1, p1.\`Last Name\` as star1Name, p1.TeamID as star1Team,
        b.star2, p2.\`Last Name\` as star2Name, p2.TeamID as star2Team,
        b.star3, p3.\`Last Name\` as star3Name, p3.TeamID as star3Team,
        b.shots_home, b.shots_away, 
        b.PIM_home, b.PIM_away,
        b.hits_home, b.hits_away, 
        b.GA_home, b.GA_away, 
        b.TA_home, b.TA_away, 
        b.FOW_home, b.FOW_away, 
        b.SOG_home_p1, b.SOG_home_p2, b.SOG_home_p3, b.SOG_home_OT, 
        b.SOG_away_p1, b.SOG_away_p2, b.SOG_away_p3, b.SOG_away_OT,
        b.PPG_home, b.PPO_home, b.PPG_away, b.PPO_away, 
        b.sq0_home, b.sq1_home, b.sq2_home, b.sq3_home, b.sq4_home, 
        b.sq0_away, b.sq1_away, b.sq2_away, b.sq3_away, b.sq4_away
    FROM boxscore_summary as b
    INNER JOIN player_master as p1
      ON p1.PlayerID = b.star1
        AND p1.LeagueID = b.LeagueID 
        AND p1.SeasonID = b.SeasonID
    INNER JOIN player_master as p2
      ON p2.PlayerID = b.star2
        AND p2.LeagueID = b.LeagueID 
        AND p2.SeasonID = b.SeasonID
    INNER JOIN player_master as p3
      ON p3.PlayerID = b.star3 
        AND p3.LeagueID = b.LeagueID 
        AND p3.SeasonID = b.SeasonID
    WHERE b.gameID = ${gameid} AND b.LeagueID = ${league}
    `,
  );

  if ('error' in boxscoreSummary || boxscoreSummary.length === 0) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [summary] = boxscoreSummary;

  res.status(200).json(parseSummaryInfo(summary));
};
