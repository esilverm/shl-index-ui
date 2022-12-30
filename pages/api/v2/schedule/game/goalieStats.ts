import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { seasonTypeToStatsTableSuffix } from '../../../../../utils/seasonTypeHelpers';
import { SeasonType } from '../../../v1/schedule';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type GoalieStatsInternal = {
  Name: string;
  Wins: number;
  Losses: number;
  OT: number;
  GAA: number;
  SavePct: number;
  Shutouts: number;
  TeamID: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { season, league, away, home, type } = req.query;

  if (!season || !league || !away || !home || !type) {
    res.status(400).json({ error: 'Missing arguments' });
    return;
  }

  const goalieStats = await query<GoalieStatsInternal>(
    SQL`
    SELECT p.\`Last Name\` as 'Name', gs.Wins, gs.Losses, gs.OT, gs.GAA, gs.SavePct, gs.Shutouts, gs.TeamID
    FROM `.append(
      `player_goalie_stats_${seasonTypeToStatsTableSuffix(
        type as SeasonType,
      )} as gs`,
    ).append(`
      INNER JOIN player_master as p
      ON gs.SeasonID = p.SeasonID
      AND gs.LeagueID = p.LeagueID
      AND gs.PlayerID = p.PlayerID
    WHERE gs.SeasonID=${season}
      AND gs.LeagueID=${league}
      AND (gs.TeamID=${away} OR gs.TeamID=${home})
   `),
  );

  if ('error' in goalieStats) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  res.status(200).json({
    away: goalieStats
      .filter((goalie) => goalie.TeamID === parseInt(away as string))
      .map((goalie) => ({
        name: goalie.Name,
        wins: goalie.Wins,
        losses: goalie.Losses,
        OT: goalie.OT,
        GAA: goalie.GAA,
        savePct: goalie.SavePct,
        shutouts: goalie.Shutouts,
      })),
    home: goalieStats
      .filter((goalie) => goalie.TeamID === parseInt(home as string))
      .map((goalie) => ({
        name: goalie.Name,
        wins: goalie.Wins,
        losses: goalie.Losses,
        OT: goalie.OT,
        GAA: goalie.GAA,
        savePct: goalie.SavePct,
        shutouts: goalie.Shutouts,
      })),
  });
};
