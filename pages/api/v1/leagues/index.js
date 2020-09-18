import SQL from 'sql-template-strings';
import { query } from '../../../../lib/db';

export default async (req, res) => {
  const leagues = await query(SQL`
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
