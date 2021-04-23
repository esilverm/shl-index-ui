import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export interface PlayoffsSeries {
  league: number;
  season: number;
  team1: PlayoffTeam;
  team2: PlayoffTeam;
}

interface PlayoffTeam {
  id: number;
  wins: number;
  name: string;
  nickname: string;
  abbr: string;
}

export type PlayoffsRound = Array<PlayoffsSeries>;

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
        [startdate]: [
          ...res[startdate],
          {
            league: matchup.LeagueID,
            season: matchup.SeasonID,
            team1: {
              id: matchup.team1,
              wins: matchup.team1Wins,
              name: matchup.team1_Name,
              nickname: matchup.team1_Nickname,
              abbr: matchup.team1_Abbr,
            },
            team2: {
              id: matchup.team2,
              wins: matchup.team2Wins,
              name: matchup.team2_Name,
              nickname: matchup.team2_Nickname,
              abbr: matchup.team2_Abbr,
            },
          },
        ],
      };
    }
    return {
      ...res,
      [startdate]: [
        {
          league: matchup.LeagueID,
          season: matchup.SeasonID,
          team1: {
            id: matchup.team1,
            wins: matchup.team1Wins,
            name: matchup.team1_Name,
            nickname: matchup.team1_Nickname,
            abbr: matchup.team1_Abbr,
          },
          team2: {
            id: matchup.team2,
            wins: matchup.team2Wins,
            name: matchup.team2_Name,
            nickname: matchup.team2_Nickname,
            abbr: matchup.team2_Abbr,
          },
        },
      ],
    };
  }, {});

  const parsedByRounds = Object.keys(parsed).map((key) => {
    return parsed[key];
  });

  res.status(200).json(parsedByRounds);
};
