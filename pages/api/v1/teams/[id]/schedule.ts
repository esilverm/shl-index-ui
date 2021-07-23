import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, season: seasonid } = req.query;

  if (Number.isNaN(+id)) {
    res.status(400).send('Error: Team id must be a number');
    return;
  }

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM schedules
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `));

  const schedule = await query(SQL`
    SELECT *
    FROM schedules
    WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
      AND (Home=${+id} OR Away=${+id})
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
