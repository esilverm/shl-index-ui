import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { league = null } = req.query;

  const seasons = await query<{
    LeagueID: number;
    Name: string;
    Abbr: string;
    SeasonID: number;
  }>(
    SQL`
    SELECT DISTINCT team_data.SeasonID, league_data.LeagueID, league_data.Name, league_data.Abbr
    FROM team_data
    INNER JOIN league_data
    ON league_data.LeagueID = team_data.LeagueID
	`
      .append(
        league != null
          ? SQL`
        WHERE league_data.LeagueID=${+league}
        `
          : '',
      )
      .append(SQL`ORDER BY league_data.LeagueID ASC, team_data.SeasonID ASC`),
  );

  if ('error' in seasons) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const parsed = seasons.map((season) => ({
    id: season.LeagueID,
    name: season.Name,
    abbreviation: season.Abbr,
    season: season.SeasonID,
  }));

  res.status(200).json(parsed);
};
