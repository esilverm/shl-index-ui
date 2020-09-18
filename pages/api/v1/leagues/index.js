const SQL = require('sql-template-strings');
const db = require('../../../../lib/db');

module.exports = async (req, res) => {
  const leagues = await db.query(SQL`
    SELECT *
    FROM league_data
  `);

  const parsed = leagues.map((league) => ({
    id: league.LeagueId,
    name: league.Name,
    abbreviation: league.Abbr,
  }));

  res.status(200).json(parsed);
};
