import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { Game } from '../../../v1/schedule';
import {
  TeamIdentity,
  TeamRecordRow,
  TeamStats,
} from '../../../v1/schedule/game/[gameId]';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type GamePreviewData = {
  game: Game;
  teams: {
    away: TeamIdentity;
    home: TeamIdentity;
  };
  teamStats: {
    away: TeamStats;
    home: TeamStats;
  };
};

const parseTeamRecord = (record: TeamRecordRow) => ({
  gamesPlayed: record
    ? record.Wins + record.Losses + record.OTL + record.SOL
    : 0,
  record: record
    ? `${record.Wins}-${record.Losses}-${record.OTL + record.SOL}`
    : '0-0-0',
});

type GamePreviewInternal = {
  Slug: string;
  SeasonID: number;
  LeagueID: number;
  Type: string;
  Date: string;
  Home: number;
  HomeName: string;
  HomeNickname: string;
  HomeAbbr: string;
  HomePrimaryColor: string;
  HomeWins: number;
  HomeLosses: number;
  HomeOTL: number;
  HomeSOW: number;
  HomeSOL: number;
  HomeGF: number;
  HomeGA: number;
  HomeScore: number;
  Away: number;
  AwayName: string;
  AwayNickname: string;
  AwayAbbr: string;
  AwayPrimaryColor: string;
  AwayWins: number;
  AwayLosses: number;
  AwayOTL: number;
  AwaySOW: number;
  AwaySOL: number;
  AwayGF: number;
  AwayGA: number;
  AwayScore: number;
  Overtime: number;
  Shootout: number;
  Played: number;
  GameID: number | null;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { gameId } = req.query;

  const search = SQL`
  SELECT DISTINCT s.Slug, s.SeasonID, s.LeagueID, s.Type, s.Date, s.Home, t1.Name as 'HomeName', t1.Nickname as 'HomeNickname', t1.Abbr AS 'HomeAbbr', t1.PrimaryColor AS 'HomePrimaryColor', tr1.Wins as 'HomeWins', tr1.Losses as 'HomeLosses', tr1.OTL as 'HomeOTL', tr1.SOW as 'HomeSOW', tr1.SOL as 'HomeSOL', tr1.GF as 'HomeGF', tr1.GA as 'HomeGA', s.HomeScore, s.Away, t2.Name as 'AwayName', t2.Nickname as 'AwayNickname', t2.Abbr AS 'AwayAbbr', t2.PrimaryColor AS 'AwayPrimaryColor', tr2.Wins as 'AwayWins', tr2.Losses as 'AwayLosses', tr2.OTL as 'AwayOTL', tr2.SOW as 'AwaySOW', tr2.SOL as 'AwaySOL', tr2.GF as 'AwayGF', tr2.GA as 'AwayGA', s.AwayScore, s.Overtime, s.Shootout, s.Played, s.GameID
  FROM slugviewer AS s
  INNER JOIN team_data as t1
    ON t1.TeamID = s.Home 
    AND t1.LeagueID = s.LeagueID 
    AND t1.SeasonID = s.SeasonID
  INNER JOIN team_data AS t2 
    ON t2.TeamID = s.Away 
      AND t2.LeagueID = s.LeagueID 
      AND t2.SeasonID = s.SeasonID
  INNER JOIN team_records AS tr1
    ON tr1.TeamID = s.Home
    AND tr1.LeagueID = s.LeagueID 
    AND tr1.SeasonID = s.SeasonID
  INNER JOIN team_records AS tr2
    ON tr2.TeamID = s.Away 
      AND tr2.LeagueID = s.LeagueID 
      AND tr2.SeasonID = s.SeasonID
  INNER JOIN slugviewer
  WHERE s.Slug=${gameId}
  `;

  const gamePreview = await query<GamePreviewInternal>(search);

  if ('error' in gamePreview || gamePreview.length === 0) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [game] = gamePreview;

  const { gamesPlayed: awayGamesPlayed, record: awayRecord } = parseTeamRecord({
    Wins: game.AwayWins,
    Losses: game.AwayLosses,
    OTL: game.AwayOTL,
    SOL: game.AwaySOL,
  });

  const { gamesPlayed: homeGamesPlayed, record: homeRecord } = parseTeamRecord({
    Wins: game.HomeWins,
    Losses: game.HomeLosses,
    OTL: game.HomeOTL,
    SOL: game.HomeSOL,
  });

  res.status(200).json({
    game: {
      season: game.SeasonID,
      league: game.LeagueID,
      date: game.Date,
      homeTeam: game.Home,
      homeScore: game.HomeScore,
      awayTeam: game.Away,
      awayScore: game.AwayScore,
      type: game.Type,
      played: game.Played,
      overtime: game.Overtime,
      shootout: game.Shootout,
      slug: game.Slug,
      gameid: game.GameID,
    },
    teams: {
      away: {
        name: game.AwayName,
        nickname: game.AwayNickname,
        abbr: game.AwayAbbr,
        primaryColor: game.AwayPrimaryColor,
      },
      home: {
        name: game.HomeName,
        nickname: game.HomeNickname,
        abbr: game.HomeAbbr,
        primaryColor: game.HomePrimaryColor,
      },
    },
    teamStats: {
      away: {
        gamesPlayed: awayGamesPlayed,
        goalsFor: game.AwayGF,
        goalsAgainst: game.AwayGA,
        record: awayRecord,
      },
      home: {
        gamesPlayed: homeGamesPlayed,
        goalsFor: game.HomeGF,
        goalsAgainst: game.HomeGA,
        record: homeRecord,
      },
    },
  });
};
