import SQL from 'sql-template-strings';
import { query } from '../../../../lib/db';

export default async (req, res) => {
  const id = parseInt(req.query.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).send('Error: id must be a number');
    return;
  }

  const league = parseInt(req.query.league, 10) || 0;
  const conference = parseInt(req.query.conference, 10) || 0;

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

  const [division] = await query(SQL`
  SELECT * 
  FROM divisions 
  WHERE LeagueID=${league}
    AND SeasonID=${season.SeasonID}
    AND DivisionID=${id}
    AND ConferenceID=${conference}
`);

  if (!division) {
    res
      .status(404)
      .send('Error 404: Could not find division for given parameters.');
    return;
  }

  const parsed = {
    id,
    leagueId: division.LeagueID,
    conferenceId: division.ConferenceID,
    name: division.Name,
    season: division.SeasonID,
  };

  res.status(200).json(parsed);
};
