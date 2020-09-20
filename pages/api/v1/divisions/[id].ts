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

  const { id, league = 0, conference = 0, season: seasonid } = req.query;

  if (Number.isNaN(+id)) {
    res.status(400).send('Error: Division id must be a number');
    return;
  }

  const [season] =
    (!Number.isNaN(seasonid) && [{ SeasonID: seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM divisions
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const [division] = await query(SQL`
  SELECT * 
  FROM divisions 
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID}
    AND DivisionID=${+id}
    AND ConferenceID=${+conference}
`);

  if (!division) {
    res
      .status(404)
      .send('Error 404: Could not find division for given parameters.');
    return;
  }

  const parsed = {
    id,
    league: division.LeagueID,
    conference: division.ConferenceID,
    name: division.Name,
    season: division.SeasonID,
  };

  res.status(200).json(parsed);
};
