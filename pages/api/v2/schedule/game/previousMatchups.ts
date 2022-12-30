import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { convertGameRowToGame, GameRow } from '../../../v1/schedule';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { season, league, away, home, type } = req.query;

  const previousMatchups = await query<GameRow>(SQL`
    SELECT * 
    FROM slugviewer
    WHERE SeasonID=${season}
      AND LeagueID=${league}
      AND (HOME=${away} OR Away=${away})
      AND (HOME=${home} OR Away=${home})
      AND Type=${type}
    ORDER BY CAST(Date as DATE) ASC;
  `);

  if ('error' in previousMatchups) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const parsedPreviousMatchups = previousMatchups.map((game) =>
    convertGameRowToGame(game),
  );

  res.status(200).json(parsedPreviousMatchups);
};
