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
  team_shots_on: number;
  team_shots_against_on: number;
  team_shots_missed_on: number;
  team_shots_missed_against_on: number;
  team_shots_blocked_on: number;
  team_shots_blocked_against_on: number;
  team_goals_on: number;
  team_goals_against_on: number;
  team_shots_off: number;
  team_shots_against_off: number;
  team_shots_missed_off: number;
  team_shots_missed_against_off: number;
  team_shots_blocked_off: number;
  team_shots_blocked_against_off: number;
  team_goals_off: number;
  team_goals_against_off: number;
  oz_starts: number;
  nz_starts: number;
  dz_starts: number;
  team_oz_starts: number;
  team_nz_starts: number;
  team_dz_starts: number;
  sq0: number; // low danger area + blocked shot
  sq1: number; // low danger area (or DA + blocked shot)
  sq2: number; // danger area (or HDA + blocked shot) (or LDA taken off a rebound)
  sq3: number; // high danger area (or DA taken off a rebound)
  sq4: number; // higher danger area + taken off a rebound
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
  team_shots_on: skater.team_shots_on,
  team_shots_against_on: skater.team_shots_against_on,
  team_shots_missed_on: skater.team_shots_missed_on,
  team_shots_missed_against_on: skater.team_shots_missed_against_on,
  team_shots_blocked_on: skater.team_shots_blocked_on,
  team_shots_blocked_against_on: skater.team_shots_blocked_against_on,
  team_goals_on: skater.team_goals_on,
  team_goals_against_on: skater.team_goals_against_on,
  team_shots_off: skater.team_shots_off,
  team_shots_against_off: skater.team_shots_against_off,
  team_shots_missed_off: skater.team_shots_missed_off,
  team_shots_missed_against_off: skater.team_shots_missed_against_off,
  team_shots_blocked_off: skater.team_shots_blocked_off,
  team_shots_blocked_against_off: skater.team_shots_blocked_against_off,
  team_goals_off: skater.team_goals_off,
  team_goals_against_off: skater.team_goals_against_off,
  oz_starts: skater.oz_starts,
  nz_starts: skater.nz_starts,
  dz_starts: skater.dz_starts,
  team_oz_starts: skater.team_oz_starts,
  team_nz_starts: skater.team_nz_starts,
  team_dz_starts: skater.team_dz_starts,
  sq0: skater.sq0,
  sq1: skater.sq1,
  sq2: skater.sq2,
  sq3: skater.sq3,
  sq4: skater.sq4,
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
      b.SH, b.EV, b.FOW, b.FOL, b.FOPct, 
      b.team_shots_on, b.team_shots_against_on, b.team_shots_missed_on, b.team_shots_missed_against_on, b.team_shots_blocked_on,
      b.team_shots_blocked_against_on, b.team_goals_on, b.team_goal_against_on, b.team_shots_off, b.team_shots_against_off, 
      b.team_shots_missed_off, b.team_shots_missed_against_off, b.team_shots_blocked_off, b.team_shots_blocked_against_off,
      b.team_goals_off, b.team_goal_against_off, 
      b.oz_starts, b.nz_starts, b.dz_starts, b.team_oz_starts, b.team_nz_starts, b.team_dz_starts, 
      b.sq0, b.sq1, b.sq2, b.sq3, b.sq4
    FROM boxscore_skater_summary as b
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
