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
      FROM divisions
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const schedule = await query(SQL`
    SELECT *
    FROM schedules
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
  `);

  const parsed = schedule.map((game) => ({
    season: game.SeasonID,
    league: game.LeagueID,
    data: game.Data,
    home: game.Home,
    homeScore: game.HomeScore,
    away: game.Away,
    awayScore: game.AwayScore,
    type: game.Type,
    played: game.Played,
    overtime: game.Overtime,
    shootout: game.Shootout,
  }));

  res.status(200).json(parsed);
};
