import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (req, res) => {
  await use(req, res, cors);

  const id = parseInt(req.query.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).send('Error: Conference id must be a number');
    return;
  }

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

  const [conference] = await query(SQL`
    SELECT * 
    FROM conferences 
    WHERE ConferenceID=${parseInt(id, 10)}
      AND LeagueID=${league}
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
    leagueId: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  };

  res.status(200).json(parsed);
};
