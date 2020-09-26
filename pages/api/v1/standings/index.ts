import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

/**
 * * Ideas for this:
 *
 * ? Params for byConference, byDivision (if applicable) or do `display={league|conference|division}
 *
 * ! Data to provide
 * !  * Name inner join team_data on teamid
 * !  * Location inner join team_data on teamid
 * !  * Abbreviation inner join team_data on teamid
 * !  * Games Played (wins + losses + otl + sol)
 * !  * Wins
 * !  * Losses
 * !  * OT losses (OTL + SOL)
 * !  * Points
 * !  * Win% .toFixed(3)
 * !  * Regulation/Overtime Wins (wins - sow)
 * !  * Goals For
 * !  * Goals Against
 * !  * Goal Differential (gf - ga) if positive add + before and color green otherwise color red
 * !  * Home W-L-O use schedule endpoint and calculate with inner join on teamID = home
 * !  * Away W-L-O use schedule endpoint and calculate with inner join on teamID = away
 * !  * Shootout Record (sow, sol)
 * !  * L10 W-L-O use slug endpoint (probably) and calculate with inner join on teamID = home or teamID = away where played order by slug desc limit 10 not sure how to do this
 * !  * Streak (may be too complicated)
 * 
 *  SELECT Home as TeamID,
    SeasonID,
    LeagueID,
    SUM(case when HomeScore > AwayScore then 1 else 0 end) as HomeWins,
    SUM(case when HomeScore < AwayScore and Overtime = 0 then 1 else 0 end) as HomeLosses,
    SUM(case when HomeScore < AwayScore and Overtime = 1 then 1 else 0 end) as HomeOTL
    FROM schedules 
    WHERE Played=1
    GROUP BY Home, LeagueID, SeasonID
 */

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  // display = 'league'

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

  const standings = await query(SQL`
    SELECT td.Name, td.Nickname, td.Abbr, tr.TeamID, tr.ConferenceID, tr.DivisionID, tr.Wins, tr.Losses, tr.OTL, tr.SOW, tr.SOL, tr.Points, tr.GF, tr.GA, tr.PCT, h.HomeWins, h.HomeLosses, h.HomeOTL, a.AwayWins, a.AwayLosses, a.AwayOTL
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
  `);

  res.status(200).json(standings);
};
