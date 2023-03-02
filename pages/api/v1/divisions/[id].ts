import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type DivisionsInternal = {
  DivisionID: number;
  ConferenceID: number;
  LeagueID: number;
  Name: string;
  SeasonID: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, conference = 0, season: seasonid } = req.query;

  if (!id || Number.isNaN(+id)) {
    res.status(400).send('Error: Division id must be a number');
    return;
  }

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

  const divisionResponse = await query<DivisionsInternal>(SQL`
  SELECT * 
  FROM divisions 
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID}
    AND DivisionID=${+id}
    AND ConferenceID=${+conference}
`);

  if ('error' in divisionResponse || !divisionResponse) {
    res
      .status(404)
      .send('Error 404: Could not find division for given parameters.');
    return;
  }

  const [division] = divisionResponse;

  const parsed = {
    id,
    league: division.LeagueID,
    conference: division.ConferenceID,
    name: division.Name,
    season: division.SeasonID,
  };

  res.status(200).json(parsed);
};
