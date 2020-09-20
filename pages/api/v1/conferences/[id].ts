import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, season: seasonid } = req.query;

  if (Number.isNaN(+id)) {
    res.status(400).send('Error: Conference id must be a number');
    return;
  }

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM conferences
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const [conference] = await query(SQL`
    SELECT * 
    FROM conferences 
    WHERE ConferenceID=${+id}
      AND LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `);

  if (!conference) {
    res
      .status(404)
      .send('Error 404: Could not find conference for given parameters.');
    return;
  }

  const parsed = {
    id: conference.ConferenceID,
    league: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  };

  res.status(200).json(parsed);
};
