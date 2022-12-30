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

  const { league = 0, season: seasonid } = req.query;

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

  const conferences = await query<{
    ConferenceID: number;
    LeagueID: number;
    Name: string;
    SeasonID: number;
  }>(SQL`
    SELECT * 
    FROM conferences 
    WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `);

  if ('error' in conferences || !conferences) {
    res
      .status(404)
      .send('Error 404: Could not find conference for given parameters.');
    return;
  }

  const parsed = conferences.map((conference) => ({
    id: conference.ConferenceID,
    league: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  }));

  res.status(200).json(parsed);
};
