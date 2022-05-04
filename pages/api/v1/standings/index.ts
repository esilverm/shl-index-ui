import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type Standings = Array<{
  name: string;
  teams: Array<{
    position: number;
    id: number;
    name: string;
    location: string;
    abbreviation: string;
    gp: number;
    wins: number;
    losses: number;
    OTL: number;
    points: number;
    winPercent: string;
    ROW: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDiff: number;
    home: {
      wins: number;
      losses: number;
      OTL: number;
    };
    away: {
      wins: number;
      losses: number;
      OTL: number;
    };
    shootout: {
      wins: number;
      losses: number;
    };
  }>;
}>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

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

  const standings = await query(
    SQL`
    SELECT ROW_NUMBER() OVER (`
      .append(
        display === 'conference'
          ? SQL` PARTITION BY tr.ConferenceID`
          : +league !== 2 && +league !== 3 && display === 'division'
          ? SQL` PARTITION BY tr.ConferenceID, tr.DivisionID`
          : ''
      )
      .append(
        +league !== 2 && +league !== 3
          ? SQL` ORDER BY tr.Points DESC, tr.Wins - tr.SOW DESC, tr.Wins DESC, tr.GF - tr.GA DESC, tr.GF DESC) as Position, td.LeagueID,`
          : SQL` ORDER BY tr.Points DESC, tr.Wins - ((tr.Wins * 3 + tr.SOL + tr.OTL) % tr.Points) - tr.SOW DESC, tr.GF - tr.GA DESC, tr.GF DESC) as Position, td.LeagueID,`
      )
      .append(
        display === 'conference'
          ? SQL` c.Name AS Conference, `
          : +league !== 2 && +league !== 3 && display === 'division'
          ? SQL` d.Name AS Division, `
          : ''
      )
      .append(
        SQL`td.Name, td.Nickname, td.Abbr, tr.TeamID, tr.Wins, tr.Losses, tr.OTL, tr.SOW, tr.SOL, tr.Points, tr.GF, tr.GA, tr.PCT, h.HomeWins, h.HomeLosses, h.HomeOTL, a.AwayWins, a.AwayLosses, a.AwayOTL
      FROM team_records AS tr
      INNER JOIN team_data AS td
        ON tr.TeamID = td.TeamID
        AND tr.LeagueID = td.LeagueID
        AND tr.SeasonID = td.SeasonID`
      )
      .append(
        display === 'conference'
          ? SQL`
          INNER JOIN conferences AS c
          ON tr.ConferenceID = c.ConferenceID
          AND tr.LeagueID = c.LeagueID
          AND tr.SeasonID = c.SeasonID
          `
          : +league !== 2 && +league !== 3 && display === 'division'
          ? SQL`
          INNER JOIN divisions AS d
          ON tr.ConferenceID = d.ConferenceID
          AND tr.DivisionID = d.DivisionID 
          AND tr.LeagueID = d.LeagueID
          AND tr.SeasonID = d.SeasonID
          `
          : ''
      ).append(SQL`
      LEFT JOIN (
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
      LEFT JOIN (
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
    name: `${team.Name} ${team.Nickname}`,
    location:
      team.LeagueID === 2 || team.LeagueID === 3 ? team.Nickname : team.Name,
    abbreviation: team.Abbr,
    conference: team.Conference,
    division: team.Division,
    gp: team.Wins + team.Losses + team.OTL + team.SOL,
    wins:
      team.LeagueID === 2 || team.LeagueID === 3
        ? team.Wins -
          ((team.Wins * 3 + team.SOL + team.OTL) % (team.Points || 1))
        : team.Wins,
    losses: team.Losses,
    OTW:
      team.LeagueID === 2 || team.LeagueID === 3
        ? (team.Wins * 3 + team.SOL + team.OTL) % (team.Points || 1)
        : undefined,
    OTL: team.OTL + team.SOL,
    points: team.Points,
    winPercent: team.PCT === 0.999 ? (1).toFixed(3) : team.PCT.toFixed(3),
    ROW: team.Wins - team.SOW,
    goalsFor: team.GF,
    goalsAgainst: team.GA,
    goalDiff: team.GF - team.GA,
    home: {
      wins: team.HomeWins ?? 0,
      losses: team.HomeLosses ?? 0,
      OTL: team.HomeOTL ?? 0,
    },
    away: {
      wins: team.AwayWins ?? 0,
      losses: team.AwayLosses ?? 0,
      OTL: team.AwayOTL ?? 0,
    },
    shootout: {
      wins: team.SOW,
      losses: team.SOL,
    },
  }));

  // group by the division or conference

  if (display === 'conference') {
    const hash = parsed.reduce((persist, team) => {
      if (!persist[team.conference]) {
        return {
          [team.conference]: [team],
          ...persist,
        };
      }

      return {
        [team.conference]: persist[team.conference].push(team),
        ...persist,
      };
    }, {});

    const conferenceList = Object.keys(hash).map((conference) => ({
      name: conference,
      teams: hash[conference],
    }));

    if (+league === 2 || +league === 3) {
      conferenceList.reverse();
    }

    res.status(200).json(conferenceList);
    return;
  } else if (+league !== 2 && +league !== 3 && display === 'division') {
    const hash = parsed.reduce((persist, team) => {
      if (!persist[team.division]) {
        return {
          [team.division]: [team],
          ...persist,
        };
      }

      return {
        [team.division]: persist[team.division].push(team),
        ...persist,
      };
    }, {});

    const divisionList = Object.keys(hash).map((division) => ({
      name: division,
      teams: hash[division],
    }));

    res.status(200).json(divisionList);
    return;
  }

  res.status(200).json(parsed);
};
