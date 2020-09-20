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
  league: number;
  conference: number;
  name: string;
  season: number;
}>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, conference, season: seasonid } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM divisions
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const search = SQL`
    SELECT * 
    FROM divisions 
    WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `;

  if (!Number.isNaN(+conference)) {
    search.append(SQL` AND ConferenceID=${+conference}`);
  }

  const divisions: Array<{
    DivisionID: number;
    ConferenceID: number;
    LeagueID: number;
    Name: string;
    SeasonID: number;
  }> = await query(search);

  if (divisions.length === 0) {
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
