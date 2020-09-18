const SQL = require('sql-template-strings');
const db = require('../../../../lib/db');

module.exports = async (req, res) => {
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

  const conferences = await db.query(SQL`
    SELECT * 
    FROM conferences 
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
  `);

  const parsed = conferences.map((conference) => ({
    id: conference.ConferenceID,
    leagueId: conference.LeagueID,
    name: conference.Name,
    season: conference.SeasonID,
  }));

  res.status(200).json(parsed);
};
