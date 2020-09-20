import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type Data = Array<{
  id: number;
  name: string;
  abbreviation: string;
}>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> => {
  await use(req, res, cors);
  const leagues: Array<{
    LeagueID: number;
    Name: string;
    Abbr: string;
  }> = await query(SQL`
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
