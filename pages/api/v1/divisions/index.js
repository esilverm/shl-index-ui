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
  const conference = parseInt(req.query.conference, 10);

  const [season] =
    (!Number.isNaN(parseInt(req.query.season, 10)) && [
      { SeasonID: parseInt(req.query.season, 10) },
    ]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM divisions
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const search = SQL`
    SELECT * 
    FROM divisions 
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
  `;

  if (!Number.isNaN(conference)) {
    search.append(SQL` AND ConferenceID=${conference}`);
  }

  const divisions = await query(search);

  if (divisions.length === 0) {
    res
      .status(404)
      .send('Error 404: Could not find divisions for given parameters.');
    return;
  }

  const parsed = divisions.map((division) => ({
    id: division.DivisionID,
    leagueId: division.LeagueID,
    conferenceId: division.ConferenceID,
    name: division.Name,
    season: division.SeasonID,
  }));

  res.status(200).json(parsed);
};
