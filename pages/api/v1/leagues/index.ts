import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await use(req, res, cors);
  const leagues = await query(SQL`
    SELECT *
    FROM league_data
  `);

  const parsed = leagues.map((league) => ({
    id: league.LeagueID,
    name: league.Name,
    abbreviation: league.Abbr,
  }));

  res.status(200).json(parsed);
};
