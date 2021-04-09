import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export interface PlayoffsSeries {
  team1: number;
  team2: number;
  LeagueID: number;
  SeasonID: number;
  team1Wins: number;
  team2Wins: number;
  team1_Name: string;
  team1_Nickname: string;
  team1_Abbr: string;
  team2_Name: string;
  team2_Nickname: string;
  team2_Abbr: string;
}

export type PlayoffsRound = Array<PlayoffsSeries>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Array<PlayoffsRound>> => {
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

  const playoffs = await query(
    SQL`
    SELECT po.startdate, po.team1, po.team2, po.LeagueID, po.SeasonID, po.team1Wins, po.team2Wins, td1.Name as team1_Name, td1.Nickname as team1_Nickname, td1.Abbr as team1_Abbr, td2.Name as team2_Name, td2.Nickname as team2_Nickname, td2.Abbr as team2_Abbr
    FROM playofftree as po
    INNER JOIN team_data as td1
    ON po.Team1 = td1.TeamID
    AND po.LeagueID = td1.LeagueID
    AND po.SeasonID = td1.SeasonID
    INNER JOIN team_data as td2
    ON po.Team2 = td2.TeamID
    AND po.LeagueID = td2.LeagueID
    AND po.SeasonID = td2.SeasonID
      WHERE po.LeagueID=${+league}
        AND po.SeasonID=${season.SeasonID}
  `
  );

  const parsed = playoffs.reduce((res, { startdate, ...matchup }) => {
    if (startdate in res) {
      return {
        ...res,
        [startdate]: [...res[startdate], matchup],
      };
    }
    return {
      ...res,
      [startdate]: [matchup],
    };
  }, {});

  const parsedByRounds = Object.keys(parsed).map((key) => {
    return parsed[key];
  });

  res.status(200).json(parsedByRounds);
  return;
};
