import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
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
  SELECT *
  FROM team_data
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID}
    AND TeamID=${+id}
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
    },
  };

  res.status(200).json(parsed);
};
