import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

type Data = Array<{ id: number; league: number; name: string; season: number }>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM conferences
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const conferences: Array<{
    ConferenceID: number;
    LeagueID: number;
    Name: string;
    SeasonID: number;
  }> = await query(SQL`
    SELECT * 
    FROM conferences 
    WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `);

  if (conferences.length === 0) {
    res
      .status(404)
      .send('Error 404: Could not find conferences for given parameters.');
    return;
  }

  const parsed: Data = conferences.map((conference) => ({
    id: conference.ConferenceID,
    league: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  }));

  res.status(200).json(parsed);
};
