import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export interface FantasyData {
  seasonID: number;
  position: string;
  name: string;
  fantasyPoints: number;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<FantasyData> | string>
): Promise<void> => {
  await use(req, res, cors);

  const { seasonID = null} = req.query;

  const search = SQL`SELECT * FROM fantasypoints`
    .append(
      seasonID != null
        ? SQL`
        WHERE seasonID=${seasonID}
        `
        : ''
    );

  const fantasy_data: Array<{
    seasonID: number,
    position: string,
    name: string,
    fantasyPoints: number,
  }> = await query(search);

  if (fantasy_data.length === 0) {
    res
      .status(404)
      .send('Error 404: Could not find fantasy data for given parameters.');
    return;
  }

  const parsed = fantasy_data.map((data) => ({
    seasonID: data.seasonID,
    position: data.position,
    name: data.name,
    fantasyPoints: data.fantasyPoints
  }));

  res.status(200).json(parsed);
};
