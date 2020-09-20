import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await use(req, res, cors);

  const { league = 0, conference, division, season: seasonid } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_data
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const search = SQL`
    SELECT *
    FROM team_data
    WHERE LeagueID=${+league}
      AND SeasonID=${season.SeasonID}
  `;

  if (!Number.isNaN(+conference)) {
    search.append(SQL` AND ConferenceID=${+conference}`);

    if (+league !== 2 && +league !== 3 && !Number.isNaN(+division)) {
      search.append(SQL` AND DivisionID=${+division}`);
    }
  }

  const teams = await query(search);

  const parsed = teams.map((team) => ({
    id: team.TeamID,
    season: team.SeasonID,
    league: team.LeagueID,
    conference: team.ConferenceID,
    division: team.DivisionID === -1 ? undefined : team.DivisionID, // If there is no division dont include it in our data
    name: `${team.Name} ${team.Nickname}`,
    abbreviation: team.Abbr,
    location:
      team.LeagueID === 2 || team.LeagueID === 3 ? team.Nickname : team.Name,
    colors: {
      primary: team.PrimaryColor,
      secondary: team.SecondaryColor,
    },
  }));

  res.status(200).json(parsed);
};
