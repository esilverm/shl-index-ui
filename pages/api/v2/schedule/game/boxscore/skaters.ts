import Cors from 'cors';
import { partition } from 'lodash';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

type BoxscoreSkatersInternal = {
  playerID: number;
  name: string;
  isHomeTeam: 1 | 0;
  GR: number;
  OGR: number;
  DGR: number;
  G: number;
  A: number;
  PlusMinus: number;
  SOG: number;
  MS: number;
  BS: number;
  PIM: number;
  HT: number;
  TK: number;
  GV: number;
  SHF: number;
  TOT: number;
  PP: number;
  SH: number;
  EV: number;
  FOW: number;
  FOL: number;
  FOPct: number;
};

export type BoxscoreSkater = ReturnType<typeof parseSkaterInfo>;

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

const parseSkaterInfo = (skater: BoxscoreSkatersInternal) => ({
  name: skater.name,
  id: skater.playerID,
  goals: skater.G,
  assists: skater.A,
  plusMinus: skater.PlusMinus,
  pim: skater.PIM,
  shots: skater.SOG,
  faceoffs: skater.FOW + skater.FOL,
  faceoffWins: skater.FOW,
  hits: skater.HT,
  blocks: skater.BS,
  giveaways: skater.GV,
  takeaways: skater.TK,
  timeOnIce: `${
    skater.TOT / 60 < 10
      ? '0' + Math.floor(skater.TOT / 60)
      : Math.floor(skater.TOT / 60)
  }:${skater.TOT % 60 < 10 ? '0' + (skater.TOT % 60) : skater.TOT % 60}`,
  ppTimeOnIce: `${
    skater.PP / 60 < 10
      ? '0' + Math.floor(skater.PP / 60)
      : Math.floor(skater.PP / 60)
  }:${skater.PP % 60 < 10 ? '0' + (skater.PP % 60) : skater.PP % 60}`,
  shTimeOnIce: `${
    skater.SH / 60 < 10
      ? '0' + Math.floor(skater.SH / 60)
      : Math.floor(skater.SH / 60)
  }:${skater.SH % 60 < 10 ? '0' + (skater.SH % 60) : skater.SH % 60}`,
  shifts: skater.SHF,
  gameRating: Math.floor(skater.GR),
  offensiveGameRating: Math.floor(skater.OGR),
  defensiveGameRating: Math.floor(skater.DGR),
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

  const boxscoreSkaterStats = await query<BoxscoreSkatersInternal>(
    SQL`
    SELECT b.playerID, p.\`last name\` as name, 
      CASE WHEN s.Home = b.teamId
           THEN 1
           ELSE 0
      END as isHomeTeam,
      b.GR, b.OGR, b.DGR, b.G, b.A,
      b.PlusMinus, b.SOG, b.MS, b.BS, b.PIM,
      b.HT, b.TK, b.GV, b.SHF, b.TOT, b.PP,
      b.SH, b.EV, b.FOW, b.FOL, b.FOPct
    FROM boxscore_skater_summary as b
    LEFT JOIN player_master as p
      ON p.PlayerID = b.playerID
        AND p.LeagueID = b.LeagueID
        AND p.SeasonID = b.SeasonID
    LEFT JOIN slugviewer as s
      ON s.GameID = b.gameID
    WHERE b.gameID = ${gameid} AND b.LeagueID = ${league}
    `,
  );

  if ('error' in boxscoreSkaterStats) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [homeSkaters, awaySkaters] = partition(
    boxscoreSkaterStats,
    ({ isHomeTeam }) => isHomeTeam,
  );

  res.status(200).json({
    away: awaySkaters.map(parseSkaterInfo),
    home: homeSkaters.map(parseSkaterInfo),
  });
};
