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
      FROM team_data
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const [team] = await query(SQL`
    SELECT t.TeamID, t.LeagueID, t.SeasonID, t.Name, t.Nickname, t.Abbr, t.PrimaryColor, t.SecondaryColor, t.TextColor, t.ConferenceID, t.DivisionID, s.Wins, s.Losses, s.OTL, s.SOW, s.SOL, s.Points, s.GF, s.GA, s.PCT
      FROM team_data AS t
      INNER JOIN team_records AS s
        ON t.TeamID = s.TeamID
        AND t.SeasonID = s.SeasonID
        AND t.LeagueID = s.LeagueID
      WHERE t.LeagueID = ${+league}
      AND t.SeasonID = ${season.SeasonID}
      AND t.TeamID = ${+id}
  `);

  if (!team) {
    res.status(404).json({ error: 'Team not found' });
    return;
  }

  const parsed = {
    id: team.TeamID,
    season: team.SeasonID,
    league: team.LeagueID,
    conference: team.ConferenceID,
    division: team.DivisionID === -1 ? undefined : team.DivisionID, // If there is no division dont include it in our data
    name: `${team.Name} ${team.Nickname}`,
    abbreviation: team.Abbr,
    location:
      team.LeagueID === 2 || team.LeagueID === 3 ? team.Nickname : team.Name,
    nameDetails: {
      first: team.Name,
      second: team.Nickname,
    },
    colors: {
      primary: team.PrimaryColor,
      secondary: team.SecondaryColor,
      text: team.TextColor,
    },
    stats: {
      wins: team.Wins,
      losses: team.Losses,
      overtimeLosses: team.OTL,
      shootoutWins: team.SOW,
      shootoutLosses: team.SOL,
      points: team.Points,
      goalsFor: team.GF,
      goalsAgainst: team.GA,
      winPercent: team.PCT,
    },
  };

  res.status(200).json(parsed);
};
