const SQL = require('sql-template-strings');
const db = require('../../../../lib/db');

module.exports = async (req, res) => {
  const id = parseInt(req.query.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).send('Error: id must be a number');
    return;
  }

  const league = parseInt(req.query.league, 10) || 0;

  const [season] =
    parseInt(req.query.season, 10) ||
    (await db.query(SQL`
      SELECT DISTINCT SeasonID
      FROM conferences
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const [conference] = await db.query(SQL`
    SELECT * 
    FROM conferences 
    WHERE ConferenceID=${parseInt(id, 10)}
      AND LeagueID=${league}
      AND SeasonID=${season.SeasonID}
  `);

  const parsed = {
    id: conference.ConferenceID,
    leagueId: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  };

  res.status(200).json(parsed);
};
