import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { Game, convertGameRowToGame, GameRow } from '..';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface TeamRow {
  TeamID: number;
  LeagueID: number;
  SeasonID: number;
  Name: string;
  Nickname: string;
  Abbr: string;
  ParentTeam1: number;
  ParentTeam2: number;
  ParentTeam3: number;
  ParentTeam4: number;
  ParentTeam5: number;
  ParentTeam6: number;
  ParentTeam7: number;
  ParentTeam8: number;
  PrimaryColor: string;
  SecondaryColor: string;
  TextColor: string;
  ConferenceID: number;
  DivisionID: number;
}

interface TeamRecordRow {
  ConferenceID: number;
  DivisionID: number;
  GA: number;
  GF: number;
  LeagueID: number;
  Losses: number;
  OTL: number;
  PCT: number;
  Points: number;
  SOL: number;
  SOW: number;
  SeasonID: number;
  TeamID: number;
  Ties: number;
  Wins: number;
}

interface TeamStats {
  gamesPlayed: number;
  goalsAgainst: number;
  goalsFor: number;
  record: string;
}

interface TeamIdentity {
  name: string;
  nickName: string;
  abbr: string;
}

export interface Matchup {
  game: Game;
  teams: {
    away: TeamIdentity;
    home: TeamIdentity;
  };
  teamStats: {
    away: TeamStats;
    home: TeamStats;
  };
  previousMatchups: Game[];
}

const parseGamesPlayed = (record: TeamRecordRow) => record ? record.Wins + record.Losses + record.OTL + record.SOL : 0;
const parseTeamRecord = (record: TeamRecordRow) => record ? `${record.Wins}-${record.Losses}-${record.OTL + record.SOL}` : '0-0-0';
const convertTeamRowToTeamIdentity = (team: TeamRow): TeamIdentity => ({
  name: team.Name,
  nickName: team.Nickname,
  abbr: team.Abbr
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { gameId } = req.query;
  const gameSearch = SQL`
    SELECT *
    FROM slugviewer
    WHERE Slug=${gameId}
  `;

  const game: Array<GameRow> = await query(gameSearch);
  if (game.length < 1) {
    return res.status(404).json(`No game found with id ${gameId}`);
  } else if (game.length > 1) {
    return res.status(500).json(`More than one game matches id ${gameId}`);
  }

  const relevantGame = game[0];
  const { SeasonID, LeagueID, Away, Home, Date } = relevantGame;

  const awayTeamSearch = SQL`
    SELECT *
    FROM team_data
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND TeamId=${Away};
  `;
  const homeTeamSearch = SQL`
    SELECT *
    FROM team_data
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND TeamId=${Home};
  `;
  const awayRecordSearch = SQL`
    SELECT *
    FROM team_records
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND TeamId=${Away};
  `;
  const homeRecordSearch = SQL`
    SELECT *
    FROM team_records
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND TeamId=${Home};
  `;
  const previousMatchupsSearch = SQL`
    SELECT *
    FROM slugviewer
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND (Home=${Away} OR Away=${Away})
      AND (Home=${Home} OR Away=${Home})
      AND CAST(Date as DATE) < ${Date}
    ORDER BY CAST(Date as DATE) DESC;
  `;

  const awayTeamData: Array<TeamRow> = await query(awayTeamSearch);
  const homeTeamData: Array<TeamRow> = await query(homeTeamSearch);
  const awayRecordData: Array<TeamRecordRow> = await query(awayRecordSearch);
  const homeRecordData: Array<TeamRecordRow> = await query(homeRecordSearch);
  const previousMatchups: Array<GameRow> = await query(previousMatchupsSearch);
  const awayStats: TeamStats = {
    gamesPlayed: parseGamesPlayed(awayRecordData[0]),
    goalsAgainst: awayRecordData[0].GA,
    goalsFor: awayRecordData[0].GF,
    record: parseTeamRecord(awayRecordData[0])
  };
  const homeStats: TeamStats = {
    gamesPlayed: parseGamesPlayed(homeRecordData[0]),
    goalsAgainst: homeRecordData[0].GA,
    goalsFor: homeRecordData[0].GF,
    record: parseTeamRecord(homeRecordData[0])
  };
  const parsedGame = convertGameRowToGame(relevantGame);
  const parsedPrevMatchups = previousMatchups.map((game) => convertGameRowToGame(game));
 
  const response: Matchup = {
    game: parsedGame,
    teams: {
      away: convertTeamRowToTeamIdentity(awayTeamData[0]),
      home: convertTeamRowToTeamIdentity(homeTeamData[0]),
    },
    teamStats: {
      away: awayStats,
      home: homeStats
    },
    previousMatchups: parsedPrevMatchups
  };

  res.status(200).json(response);
};
