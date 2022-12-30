import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

type BoxscorePenaltiesInternal = {
  period: number;
  time: number;
  name: string;
  teamAbbr: string;
  penalty: string;
  PIM: number;
};

export type BoxscorePenalties = ReturnType<typeof parsePenaltyInfo>;

const parsePenaltyInfo = (penalty: BoxscorePenaltiesInternal) => ({
  period: penalty.period,
  time: penalty.time,
  readableTime: `${
    penalty.time / 60 < 10
      ? '0' + Math.floor(penalty.time / 60)
      : Math.floor(penalty.time / 60)
  }:${penalty.time % 60 < 10 ? '0' + (penalty.time % 60) : penalty.time % 60}`,
  teamAbbr: penalty.teamAbbr,
  player: penalty.name,
  reason: penalty.penalty,
  length: penalty.PIM,
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

  const boxscorePenaltyStats = await query<BoxscorePenaltiesInternal>(
    SQL`
    SELECT b.period, 
           b.time, 
           p.\`Last Name\` as name,
           t.Abbr as teamAbbr, 
           b.penalty, 
           b.PIM
    FROM boxscore_period_penalties_summary as b
    INNER JOIN player_master as p
    ON p.PlayerID = b.playerID 
      AND p.LeagueID = b.LeagueID 
      AND p.SeasonID = b.SeasonID
    INNER JOIN team_data as t
    ON t.TeamID = b.teamID 
      AND t.LeagueID = b.LeagueID
      AND t.SeasonID = b.SeasonID
    WHERE b.gameID = ${gameid} AND b.LeagueID = ${league}
    `,
  );

  if ('error' in boxscorePenaltyStats) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  res.status(200).json(boxscorePenaltyStats.map(parsePenaltyInfo));
};
