import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_records
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const preseason = await query(
    SQL`
    SELECT 
        ROW_NUMBER() OVER (PARTITION BY ps.TeamID AND ps.SeasonID AND ps.LeagueID ORDER BY ps.PTS DESC, ps.Wins DESC) as Position,
        ps.TeamID,
        ps.SeasonID,
        ps.LeagueID,
        ps.GP,
        ps.Wins,
        ps.Losses,
        ps.OTL,
        ps.PTS,
        ps.GF,
        ps.GA,
        ps.SOL,
        ps.SOW,
        td.Name,
        td.Nickname,
        td.Abbr
    FROM
        preseason_standings AS ps
        INNER JOIN
            team_data AS td ON ps.TeamID = td.TeamID
            AND ps.SeasonID = td.SeasonID
            AND ps.LeagueID = td.LeagueID
    WHERE ps.LeagueID=${+league}
    AND ps.SeasonID=${season.SeasonID}
  `
  );

  const parsed = preseason.map((team) => ({
    position: team.Position,
    id: team.TeamID,
    name: `${team.Name} ${team.Nickname}`,
    location:
      team.LeagueID === 2 || team.LeagueID === 3 ? team.Nickname : team.Name,
    abbreviation: team.Abbr,
    gp: team.GP,
    wins: team.Wins,
    losses: team.Losses,
    OTL: team.OTL,
    points: team.PTS,
    winPercentage: (team.PTS / (Math.max(team.GP, 1) * 2)).toFixed(3),
    ROW: team.Wins - team.SOW,
    goalsFor: team.GF,
    goalsAgainst: team.GA,
    goalDiff: team.GF - team.GA,
    home: {
      wins: team.HomeWins,
      losses: team.HomeLosses,
      OTL: team.HomeOTL,
    },
    away: {
      wins: team.AwayWins,
      losses: team.AwayLosses,
      OTL: team.AwayOTL,
    },
    shootout: {
      wins: team.SOW,
      losses: team.SOL,
    },
  }));

  res.status(200).json(parsed);
};
