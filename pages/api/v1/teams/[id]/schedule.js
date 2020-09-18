import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (req, res) => {
  await use(req, res, cors);

  const id = parseInt(req.query.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).send('Error: id must be a number');
    return;
  }

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
      AND (Home=${id} OR Away=${id})
  `);

  const parsed = schedule.map((game) => ({
    season: game.SeasonID,
    league: game.LeagueID,
    data: game.Data,
    homeTeam: game.Home,
    homeScore: game.HomeScore,
    awayTeam: game.Away,
    awayScore: game.AwayScore,
    type: game.Type,
    played: game.Played,
    overtime: game.Overtime,
    shootout: game.Shootout,
  }));

  res.status(200).json(parsed);
};
