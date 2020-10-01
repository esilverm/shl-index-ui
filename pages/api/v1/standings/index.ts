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

  // display = 'league'

  const { league = 0, season: seasonid, display: displayname } = req.query;

  let display: string;
  if (
    displayname === 'league' ||
    displayname === 'conference' ||
    displayname === 'division'
  ) {
    display = displayname;
  } else {
    display = 'league';
  }

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_records
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  // let standin/gs, parsed;SQL` PARTITION BY tr.ConferenceID`

  const standings = await query(
    SQL`
    SELECT ROW_NUMBER() OVER (`
      .append(
        display === 'conference'
          ? SQL` PARTITION BY tr.ConferenceID`
          : display === 'divison'
          ? SQL` PARTITION BY tr.ConferenceID, tr.DivisionID`
          : ''
      )
      .append(
        SQL` ORDER BY tr.PCT DESC, tr.Wins DESC, tr.SOW ASC ) as Position, td.LeagueID,`
      )
      .append(
        display === 'conference'
          ? SQL`tr.ConferenceID, `
          : display === 'divison'
          ? SQL`tr.ConferenceID, tr.DivisionID`
          : ''
      )
      .append(`td.Name, td.Nickname, td.Abbr, tr.TeamID, tr.ConferenceID, tr.DivisionID, tr.Wins, tr.Losses, tr.OTL, tr.SOW, tr.SOL, tr.Points, tr.GF, tr.GA, tr.PCT, h.HomeWins, h.HomeLosses, h.HomeOTL, a.AwayWins, a.AwayLosses, a.AwayOTL
      FROM team_records AS tr
      INNER JOIN team_data AS td
        ON tr.TeamID = td.TeamID
        AND tr.LeagueID = td.LeagueID
        AND tr.SeasonID = td.SeasonID
      INNER JOIN (
        SELECT Home AS TeamID, SeasonID, LeagueID, 
          SUM(CASE WHEN HomeScore > AwayScore THEN 1 ELSE 0 END) AS HomeWins, 
          SUM(CASE WHEN HomeScore < AwayScore AND Overtime = 0 THEN 1 ELSE 0 END) AS HomeLosses,
          SUM(CASE WHEN HomeScore < AwayScore AND Overtime = 1 THEN 1 ELSE 0 END) AS HomeOTL
        FROM schedules WHERE Played=1 AND type='Regular Season'
        GROUP BY Home, LeagueID, SeasonID
      ) AS h
        ON tr.TeamID = h.TeamID
        AND tr.LeagueID = h.LeagueID
        AND tr.SeasonID = h.SeasonID
      INNER JOIN (
        SELECT Away AS TeamID, SeasonID, LeagueID, 
          SUM(CASE WHEN AwayScore > HomeScore THEN 1 ELSE 0 END) AS AwayWins, 
            SUM(CASE WHEN AwayScore < HomeScore AND Overtime = 0 THEN 1 ELSE 0 END) AS AwayLosses,
            SUM(CASE WHEN AwayScore < HomeScore AND Overtime = 1 THEN 1 ELSE 0 END) AS AwayOTL
          FROM schedules WHERE Played=1 AND type='Regular Season'
          GROUP BY Away, LeagueID, SeasonID
        ) AS a
          ON tr.TeamID = a.TeamID
          AND tr.LeagueID = a.LeagueID
          AND tr.SeasonID = a.SeasonID
      WHERE tr.LeagueID=${+league}
        AND tr.SeasonID=${season.SeasonID}
  `)
  );

  const parsed = standings.map((team) => ({
    position: team.Position,
    id: team.TeamID,
    conference: team.ConferenceID,
    divison: team.DivisionID,
    name: `${team.Name} ${team.Nickname}`,
    location:
      team.LeagueID === 2 || team.LeagueID === 3 ? team.Nickname : team.Name,
    abbreviation: team.Abbr,
    gp: team.Wins + team.Losses + team.OTL + team.SOL,
    wins: team.Wins,
    losses: team.Losses,
    OTL: team.OTL + team.SOL,
    points: team.Points,
    winPercent: team.PCT.toFixed(3),
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
