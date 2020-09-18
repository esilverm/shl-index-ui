import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (req, res) => {
  await use(req, res, cors);

  const league = parseInt(req.query.league, 10) || 0;

  const [season] =
    (!Number.isNaN(parseInt(req.query.season, 10)) && [
      { SeasonID: parseInt(req.query.season, 10) },
    ]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM conferences
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const conferences = await query(SQL`
    SELECT * 
    FROM conferences 
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
  `);

  if (conferences.length === 0) {
    res
      .status(404)
      .send('Error 404: Could not find conferences for given parameters.');
    return;
  }

  const parsed = conferences.map((conference) => ({
    id: conference.ConferenceID,
    leagueId: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  }));

  res.status(200).json(parsed);
};
