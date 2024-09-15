import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export interface STHSPlayoffsSeries {
  team1: PlayoffTeam;
  team2: PlayoffTeam;
  team1Wins: number;
  team2Wins: number;
  leagueID: number;
  seasonID: number;
  roundID: number;
  conferenceID: number;
}

export interface PlayoffTeam {
  id?: number;
  wins?: number;
  name?: string;
  nickname?: string;
  abbr?: string;
  conference?: number;
  division?: number;
}

export type PlayoffsRound = Array<STHSPlayoffsSeries>;

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid } = req.query;


  let season: { SeasonID: number };

  if (seasonid && !Number.isNaN(+seasonid)) {
    season = { SeasonID: +seasonid };
  } else {
    const result = await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_records
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `);

    if (Array.isArray(result) && result.length > 0) {
      season = result[0] as { SeasonID: number };
    } else {
      res.status(404).json({ error: 'Season not found' });
      return;
    }
  }
  const playoffs = (await query(
    SQL`
    SELECT  po.team1, po.team2, po.LeagueID, po.SeasonID, po.team1Wins, po.team2Wins, po.roundID, 
            td1.Name as team1_Name, td1.Nickname as team1_Nickname, td1.Abbr as team1_Abbr, 
            td1.ConferenceID as team1_Conference, td1.DivisionID as team1_Division, 
            td2.Name as team2_Name, td2.Nickname as team2_Nickname, td2.Abbr as team2_Abbr, 
            td2.ConferenceID as team2_Conference, td2.DivisionID as team2_Division
    FROM sths_playoffs as po
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
    `,
  )) as Array<any>;

  const parsed = playoffs.reduce((res, { roundID, ...matchup }) => {
    if (roundID in res) {
      return {
        ...res,
        [roundID]: [
          ...res[roundID],
          {
            roundID,
            league: matchup.LeagueID,
            season: matchup.SeasonID,
            team1: {
              id: matchup.team1,
              wins: matchup.team1Wins,
              name: matchup.team1_Name,
              nickname: matchup.team1_Nickname,
              abbr: matchup.team1_Abbr,
              conference: matchup.team1_Conference,
              division: matchup.team1_Division,
            },
            team2: {
              id: matchup.team2,
              wins: matchup.team2Wins,
              name: matchup.team2_Name,
              nickname: matchup.team2_Nickname,
              abbr: matchup.team2_Abbr,
              conference: matchup.team2_Conference,
              division: matchup.team2_Division,
            },
          },
        ],
      };
    }
    return {
      ...res,
      [roundID]: [
        {
          roundID,
          league: matchup.LeagueID,
          season: matchup.SeasonID,
          team1: {
            id: matchup.team1,
            wins: matchup.team1Wins,
            name: matchup.team1_Name,
            nickname: matchup.team1_Nickname,
            abbr: matchup.team1_Abbr,
            conference: matchup.team1_Conference,
            division: matchup.team1_Division,
          },
          team2: {
            id: matchup.team2,
            wins: matchup.team2Wins,
            name: matchup.team2_Name,
            nickname: matchup.team2_Nickname,
            abbr: matchup.team2_Abbr,
            conference: matchup.team2_Conference,
            division: matchup.team2_Division,
          },
        },
      ],
    };
  }, {} as Record<number, STHSPlayoffsSeries[]>);

  const parsedByRounds = Object.keys(parsed)
    .sort((a, b) => +a - +b)
    .map((key) => parsed[+key]);

  res.status(200).json(parsedByRounds);
};
