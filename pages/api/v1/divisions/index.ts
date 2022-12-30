import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

import { DivisionsInternal } from './[id]';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type Data = Array<{
  id: number;
  league: number;
  conference: number;
  name: string;
  season: number;
}>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | string>,
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, conference, season: seasonid } = req.query;

  const seasonResponse =
    //@ts-ignore
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query<{ SeasonID: number }>(SQL`
    SELECT DISTINCT SeasonID
    FROM conferences
    WHERE LeagueID=${+league}
    ORDER BY SeasonID DESC
    LIMIT 1
  `));

  if ('error' in seasonResponse) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [season] = seasonResponse;
  const search = SQL`
    SELECT * 
    FROM divisions 
    WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `;

  if (conference && !Number.isNaN(+conference)) {
    search.append(SQL` AND ConferenceID=${+conference}`);
  }

  const divisions = await query<DivisionsInternal>(search);

  if ('error' in divisions || !divisions) {
    res
      .status(404)
      .send('Error 404: Could not find divisions for given parameters.');
    return;
  }

  const parsed = divisions.map((division) => ({
    id: division.DivisionID,
    league: division.LeagueID,
    conference: division.ConferenceID,
    name: division.Name,
    season: division.SeasonID,
  }));

  res.status(200).json(parsed);
};
