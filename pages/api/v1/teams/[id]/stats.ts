import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { parseTeamStats, TeamStatsInternal } from '../stats';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, id, season: seasonid } = req.query;

  if (!id || Number.isNaN(+id)) {
    res.status(400).send('Error: Team id must be a number');
    return;
  }

  const seasonResponse =
    //@ts-ignore
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query<{ SeasonID: number }>(SQL`
    SELECT DISTINCT SeasonID
    FROM team_stats
    WHERE LeagueID=${+league}
    ORDER BY SeasonID DESC
    LIMIT 1
  `));

  if ('error' in seasonResponse) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [season] = seasonResponse;

  // Team stats were not provided until S66
  if (season.SeasonID < 66) {
    res.status(200).json([]);
    return;
  }

  const search = SQL`
    SELECT s.teamID, s.LeagueID, s.SeasonID, t.ConferenceID, t.DivisionID, t.Name, t.Nickname, t.Abbr, s.GP, s.G, s.GA, s.S, s.SA, s.FOPct, s.SB, s.H, s.TkA, s.GvA, s.PIMPerG, s.PPO, s.PPG, s.SHGA, s.SHO, s.PPGA, s.SHG
    FROM team_data AS t
    INNER JOIN team_stats AS s
      ON t.TeamID = s.teamID
      AND t.SeasonID = s.SeasonID
      AND t.LeagueID = s.LeagueID
    WHERE t.LeagueID=${+league}
    AND t.SeasonID=${season.SeasonID}
    AND t.TeamID=${+id}
  `;

  const teamStats = await query<TeamStatsInternal>(search);

  if ('error' in teamStats) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [currentTeamStats] = teamStats;

  res.status(200).json(parseTeamStats(currentTeamStats));
};
