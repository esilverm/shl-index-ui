import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type TeamStatsInternal = {
  LeagueID: number;
  SeasonID: number;
  ConferenceID: number;
  DivisionID: number;
  teamID: number;
  Name: string;
  Nickname: string;
  Abbr: string;
  GP: number;
  G: number;
  GA: number;
  S: number;
  SA: number;
  FOPct: number;
  SB: number;
  H: number;
  TkA: number;
  GvA: number;
  PIMPerG: number;
  PPO: number;
  PPG: number;
  SHGA: number;
  SHO: number;
  PPGA: number;
  SHG: number;
};

export type TeamStats = ReturnType<typeof parseTeamStats>;

export const parseTeamStats = (team: TeamStatsInternal) => ({
  id: team.teamID,
  season: team.SeasonID,
  league: team.LeagueID,
  conference: team.ConferenceID,
  division: team.DivisionID === -1 ? undefined : team.DivisionID, // If there is no division dont include it in our data
  name: `${team.Name} ${team.Nickname}`,
  abbreviation: team.Abbr,
  gamesPlayed: team.GP,
  goalsFor: team.G,
  goalsAgainst: team.GA,
  shotsFor: team.S,
  shotsAgainst: team.SA,
  faceoffPct: team.FOPct,
  shotsBlocked: team.SB,
  hits: team.H,
  takeaways: team.TkA,
  giveaways: team.GvA,
  penaltyMinutesPerGame: team.PIMPerG,
  ppOpportunities: team.PPO,
  ppGoalsFor: team.PPG,
  ppGoalsAgainst: team.PPGA,
  shOpportunities: team.SHO,
  shGoalsFor: team.SHG,
  shGoalsAgainst: team.SHGA,
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, conference, division, season: seasonid } = req.query;

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
  `;

  if (!!conference && !Number.isNaN(+conference)) {
    search.append(SQL` AND t.ConferenceID=${+conference}`);

    if (
      +league !== 2 &&
      +league !== 3 &&
      !!division &&
      !Number.isNaN(+division)
    ) {
      search.append(SQL` AND t.DivisionID=${+division}`);
    }
  }

  const teamStats = await query<TeamStatsInternal>(search);

  if ('error' in teamStats) {
    res.status(400).send('Error: Server Error');
    return;
  }

  res.status(200).json(teamStats.map(parseTeamStats));
};
