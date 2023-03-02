import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type ConferenceInternal = {
  LeagueID: number;
  ConferenceID: number;
  Name: string;
  SeasonID: number;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, season: seasonid } = req.query;

  if (!id || Number.isNaN(+id)) {
    res.status(400).send('Error: Conference id must be a number');
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

  const conferenceResponse = await query<ConferenceInternal>(SQL`
    SELECT * 
    FROM conferences 
    WHERE ConferenceID=${+id}
      AND LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `);

  if ('error' in conferenceResponse || !conferenceResponse) {
    res
      .status(404)
      .send('Error 404: Could not find conference for given parameters.');
    return;
  }

  const [conference] = conferenceResponse;

  res.status(200).json({
    id: conference.ConferenceID,
    league: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  });
};
