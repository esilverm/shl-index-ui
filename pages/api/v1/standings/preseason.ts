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

  const preseason = await query(
    SQL`
    SELECT 
        ROW_NUMBER() OVER (`
      .append(
        display === 'conference'
          ? SQL` PARTITION BY td.ConferenceID`
          : +league !== 2 && +league !== 3 && display === 'division'
          ? SQL` PARTITION BY td.ConferenceID, td.DivisionID`
          : ''
      )
      .append(
        SQL` ORDER BY ps.PTS DESC, ps.Wins DESC, ps.SOW ASC) as Position, ps.LeagueID,`
      )
      .append(
        display === 'conference'
          ? SQL` c.Name AS Conference, `
          : +league !== 2 && +league !== 3 && display === 'division'
          ? SQL` d.Name AS Division, `
          : ''
      )
      .append(
        SQL`
        ps.TeamID,
        ps.SeasonID,
        ps.GP,
        ps.Wins,
        ps.Losses,
        ps.OTL,
        ps.PTS,
        ps.GF,
        ps.GA,
        ps.HomeWins,
        ps.HomeLosses,
        ps.HomeOTL,
        ps.AwayWins,
        ps.AwayLosses,
        ps.AwayOTL,
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
        `
      )
      .append(
        display === 'conference'
          ? SQL`
            INNER JOIN conferences AS c
            ON td.ConferenceID = c.ConferenceID
            AND ps.LeagueID = c.LeagueID
            AND ps.SeasonID = c.SeasonID
            `
          : +league !== 2 && +league !== 3 && display === 'division'
          ? SQL`
            INNER JOIN divisions AS d
            ON td.ConferenceID = d.ConferenceID
            AND td.DivisionID = d.DivisionID 
            AND ps.LeagueID = d.LeagueID
            AND ps.SeasonID = d.SeasonID
            `
          : ''
      ).append(SQL`
    WHERE ps.LeagueID=${+league}
    AND ps.SeasonID=${season.SeasonID}
  `)
  );

  const parsed = preseason.map((team) => ({
    position: team.Position,
    id: team.TeamID,
    name: `${team.Name} ${team.Nickname}`,
    location:
      team.LeagueID === 2 || team.LeagueID === 3 ? team.Nickname : team.Name,
    abbreviation: team.Abbr,
    conference: team.Conference,
    division: team.Division,
    gp: team.Wins + team.Losses + team.OTL + team.SOL,
    wins: team.Wins,
    losses: team.Losses,
    OTL: team.OTL + team.SOL,
    points: team.PTS,
    winPercent: (team.PTS / (Math.max(team.GP, 1) * 2)).toFixed(3),
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
