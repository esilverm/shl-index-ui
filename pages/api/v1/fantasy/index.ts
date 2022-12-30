import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

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
  res: NextApiResponse<Array<FantasyData> | string>,
): Promise<void> => {
  await use(req, res, cors);

  const { season: seasonid, position, name } = req.query;

  const seasonResponse =
    //@ts-ignore
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query<{ SeasonID: number }>(SQL`
      SELECT DISTINCT SeasonID
      FROM conferences
      WHERE LeagueID=0
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  if ('error' in seasonResponse) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [season] = seasonResponse;

  const search =
    SQL`SELECT * FROM fantasypoints WHERE seasonID=${season.SeasonID}`
      .append(
        position != null
          ? SQL`
         AND position=${position}
        `
          : '',
      )
      .append(
        name != null
          ? SQL`
         AND name=${name}
        `
          : '',
      );

  const fantasyData = await query<{
    seasonID: number;
    position: string;
    name: string;
    fantasyPoints: number;
  }>(search);

  if ('error' in fantasyData || !fantasyData) {
    res
      .status(404)
      .send('Error 404: Could not find fantasy data for given parameters.');
    return;
  }

  const parsed = fantasyData.map((data) => ({
    seasonID: data.seasonID,
    position: data.position,
    name: data.name,
    fantasyPoints: data.fantasyPoints,
  }));

  res.status(200).json(parsed);
};
