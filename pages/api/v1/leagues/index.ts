import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const leagues = await query<{
    LeagueID: number;
    Name: string;
    Abbr: string;
  }>(SQL`
    SELECT *
    FROM league_data
  `);

  if ('error' in leagues) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const parsed = leagues.map((league) => ({
    id: league.LeagueID,
    name: league.Name,
    abbreviation: league.Abbr,
  }));

  res.status(200).json(parsed);
};
