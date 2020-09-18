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
    res.status(400).send('Error: Team id must be a number');
    return;
  }

  const league = parseInt(req.query.league, 10) || 0;

  const [season] =
    (!Number.isNaN(parseInt(req.query.season, 10)) && [
      { SeasonID: parseInt(req.query.season, 10) },
    ]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_data
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const roster = await query(SQL`
    SELECT *
    FROM player_master
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
      AND TeamID=${id}
  `);

  const parsed = roster.map((player) => ({
    id: player.PlayerID,
    team: player.TeamID,
    league: player.LeagueID,
    season: player.SeasonID,
    name: player['Last Name'],
    height: parseInt(player.Height, 10),
    weight: parseInt(player.Weight, 10),
    // nationality: player.Nationality_One   // Can't do this since not accurate to affiliated IIHF/WJC team. Need to connect later on.
  }));

  res.status(200).json(parsed);
};
