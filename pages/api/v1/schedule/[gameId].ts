import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';
import { GameRow } from '.';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface TeamRecord {
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

interface Team {
  Abbr: string;
  Name: string;
  Nickname: string;
  PrimaryColor: string;
}

interface TeamStats {
  gamesPlayed: number;
  goalsAgainst: number;
  goalsFor: number;
  record: string;
}

export interface Matchup {
  game: GameRow;
  teams: {
    away: Team;
    home: Team;
  };
  teamStats: {
    away: TeamStats;
    home: TeamStats;
  };
  previousMatchups: GameRow[];
}

const parseGamesPlayed = (record: TeamRecord) => record ? record.Wins + record.Losses + record.OTL + record.SOL : 0;
const parseTeamRecord = (record: TeamRecord) => record ? `${record.Wins}-${record.Losses}-${record.OTL + record.SOL}` : '0-0-0';

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

  const game: GameRow[] = await query(gameSearch);
  if (game.length !== 1) {
    return res.status(404).json(`No game found with id ${gameId}`);
  }
  const activeGame = game[0];
  const { SeasonID, LeagueID, Away, Home, Date } = activeGame;

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

  const awayTeamData = await query(awayTeamSearch);
  const homeTeamData = await query(homeTeamSearch);
  const awayRecordData: TeamRecord[] = await query(awayRecordSearch);
  const homeRecordData: TeamRecord[] = await query(homeRecordSearch);
  const previousMatchups = await query(previousMatchupsSearch);
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

  const response: Matchup = {
    game: activeGame,
    teams: {
      away: awayTeamData[0],
      home: homeTeamData[0],
    },
    teamStats: {
      away: awayStats,
      home: homeStats
    },
    previousMatchups
  };

  res.status(200).json(response);
};
