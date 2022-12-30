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

type SkaterStatsInternal = {
  Name: string;
  G: number;
  A: number;
  PlusMinus: number;
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

  const skaterStats = await query<SkaterStatsInternal>(
    SQL`
  SELECT p.\`Last Name\` as 'Name', ss.G, ss.A, ss.PlusMinus, ss.TeamID
  FROM `.append(
      `player_skater_stats_${seasonTypeToStatsTableSuffix(
        type as SeasonType,
      )} as ss`,
    ).append(`
    INNER JOIN player_master as p
    ON ss.SeasonID = p.SeasonID
    AND ss.LeagueID = p.LeagueID
    AND ss.PlayerID = p.PlayerID
  WHERE ss.SeasonID=${season}
    AND ss.LeagueID=${league}
    AND (ss.TeamID=${away} OR ss.TeamID=${home})
  `),
  );

  if ('error' in skaterStats) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  res.status(200).json({
    away: skaterStats
      .filter((skater) => skater.TeamID === parseInt(away as string))
      .map((skater) => ({
        name: skater.Name,
        goals: skater.G,
        assists: skater.A,
        plusMinus: skater.PlusMinus,
      })),
    home: skaterStats
      .filter((skater) => skater.TeamID === parseInt(home as string))
      .map((skater) => ({
        name: skater.Name,
        goals: skater.G,
        assists: skater.A,
        plusMinus: skater.PlusMinus,
      })),
  });
};
