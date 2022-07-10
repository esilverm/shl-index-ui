import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { Game, convertGameRowToGame, GameRow } from '..';
import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface TeamRecordRow {
  Wins: number;
  Losses: number;
  OTL: number;
  SOL: number;
}

interface TeamStats {
  gamesPlayed: number;
  goalsAgainst: number;
  goalsFor: number;
  record: string;
}

interface TeamIdentity {
  name: string;
  nickname: string;
  abbr: string;
  primaryColor: string;
}

interface SkaterStats {
  name: string;
  goals: number;
  assists: number;
  plusMinus: number;
}

export interface GoalieStats {
  name: string;
  wins: number;
  losses: number;
  OT: number;
  GAA: number;
  savePct: number;
  shutouts: number;
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
  skaterStats: {
    away: Array<SkaterStats>;
    home: Array<SkaterStats>;
  };
  goalieStats: {
    away: Array<GoalieStats>;
    home: Array<GoalieStats>;
  };
  previousMatchups: Array<Game>;
}

const parseGamesPlayed = (record: TeamRecordRow) =>
  record ? record.Wins + record.Losses + record.OTL + record.SOL : 0;
const parseTeamRecord = (record: TeamRecordRow) =>
  record
    ? `${record.Wins}-${record.Losses}-${record.OTL + record.SOL}`
    : '0-0-0';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { gameId } = req.query;

  const gameSearch = SQL`
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

  const [game] = await query(gameSearch);

  const { SeasonID, LeagueID, Away, Home, Type, Played, GameID } = game;

  const awayStats: TeamStats = {
    gamesPlayed: parseGamesPlayed({
      Wins: game.AwayWins,
      Losses: game.AwayLosses,
      OTL: game.AwayOTL,
      SOL: game.AwaySOL,
    }),
    goalsFor: game.AwayGF,
    goalsAgainst: game.AwayGA,
    record: parseTeamRecord({
      Wins: game.AwayWins,
      Losses: game.AwayLosses,
      OTL: game.AwayOTL,
      SOL: game.AwaySOL,
    }),
  };

  const homeStats: TeamStats = {
    gamesPlayed: parseGamesPlayed({
      Wins: game.HomeWins,
      Losses: game.HomeLosses,
      OTL: game.HomeOTL,
      SOL: game.HomeSOL,
    }),
    goalsFor: game.HomeGF,
    goalsAgainst: game.HomeGA,
    record: parseTeamRecord({
      Wins: game.HomeWins,
      Losses: game.HomeLosses,
      OTL: game.HomeOTL,
      SOL: game.HomeSOL,
    }),
  };

  if (GameID === null || Played === 0) {
    const previousMatchupsSearch = SQL`
    SELECT *
    FROM slugviewer
    WHERE SeasonID=${SeasonID}
      AND LeagueID=${LeagueID}
      AND (Home=${Away} OR Away=${Away})
      AND (Home=${Home} OR Away=${Home})
      AND Type=${Type}
    ORDER BY CAST(Date as DATE) ASC;
    `;

    const statsTableSuffix = {
      'Pre-Season': 'ps',
      'Regular Season': 'rs',
      Playoffs: 'po',
    }[Type];

    const skaterStatsSearch = SQL`
      SELECT p.\`Last Name\` as 'Name', ss.G, ss.A, ss.PlusMinus, ss.TeamID
      FROM `.append(`player_skater_stats_${statsTableSuffix} as ss`).append(`
        INNER JOIN player_master as p
        ON ss.SeasonID = p.SeasonID
        AND ss.LeagueID = p.LeagueID
        AND ss.PlayerID = p.PlayerID
      WHERE ss.SeasonID=${SeasonID}
        AND ss.LeagueID=${LeagueID}
        AND (ss.TeamID=${Away} OR ss.TeamID=${Home})
    `);

    const goalieStatsSearch = SQL`
      SELECT p.\`Last Name\` as 'Name', gs.Wins, gs.Losses, gs.OT, gs.GAA, gs.SavePct, gs.Shutouts, gs.TeamID
      FROM `.append(`player_goalie_stats_${statsTableSuffix} as gs`).append(`
        INNER JOIN player_master as p
        ON gs.SeasonID = p.SeasonID
        AND gs.LeagueID = p.LeagueID
        AND gs.PlayerID = p.PlayerID
      WHERE gs.SeasonID=${SeasonID}
        AND gs.LeagueID=${LeagueID}
        AND (gs.TeamID=${Away} OR gs.TeamID=${Home})
    `);

    const previousMatchups: Array<GameRow> = await query(
      previousMatchupsSearch
    );
    const skaterStats = await query(skaterStatsSearch);
    const goalieStats = await query(goalieStatsSearch);

    const parsedPrevMatchups = previousMatchups.map((game) =>
      convertGameRowToGame(game)
    );

    const response: Matchup = {
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
        away: awayStats,
        home: homeStats,
      },
      skaterStats: {
        away: skaterStats
          .filter((skater) => skater.TeamID === Away)
          .map((skater) => ({
            name: skater.Name,
            goals: skater.G,
            assists: skater.A,
            plusMinus: skater.PlusMinus,
          })),
        home: skaterStats
          .filter((skater) => skater.TeamID === Home)
          .map((skater) => ({
            name: skater.Name,
            goals: skater.G,
            assists: skater.A,
            plusMinus: skater.PlusMinus,
          })),
      },
      goalieStats: {
        away: goalieStats
          .filter((goalie) => goalie.TeamID === Away)
          .map((goalie) => ({
            name: goalie.Name,
            wins: goalie.Wins,
            losses: goalie.Losses,
            OT: goalie.OT,
            GAA: goalie.GAA,
            savePct: goalie.SavePct,
            shutouts: goalie.Shutouts,
          })),
        home: goalieStats
          .filter((goalie) => goalie.TeamID === Home)
          .map((goalie) => ({
            name: goalie.Name,
            wins: goalie.Wins,
            losses: goalie.Losses,
            OT: goalie.OT,
            GAA: goalie.GAA,
            savePct: goalie.SavePct,
            shutouts: goalie.Shutouts,
          })),
      },
      previousMatchups: parsedPrevMatchups,
    };

    res.status(200).json(response);
    return;
  }

  // ? IF WE ARE HERE, WE ARE USING FHM8 BOXSCORES
  const periodScoringSummarySearch = SQL`
    CALL get_boxscore_period_scoring_summary(${gameId});
  `;
  const penaltySummarySearch = SQL`
    CALL get_boxscore_penalties(${gameId});
  `;
  const skaterStatsSummarySearch = SQL`
    CALL get_boxscore_skater_stats(${gameId});
  `;
  const goalieStatsSummarySearch = SQL`
    CALL get_boxscore_goalie_stats(${gameId});
  `;

  const gameSummarySearch = SQL`
    SELECT score_home_p1, score_home_p2, score_home_p3, score_home_OT, score_home_SO, score_away_p1, score_away_p2, score_away_p3, score_away_OT, score_away_SO, star1, star2, star3, shots_home, shots_away, PIM_home, PIM_away, hits_home, hits_away, GA_home, GA_away, TA_home, TA_away, FOW_home, FOW_away, SOG_home_p1, SOG_home_p2, SOG_home_p3, SOG_home_OT, SOG_away_p1, SOG_away_p2, SOG_away_p3, SOG_away_OT, PPG_home, PPO_home, PPG_away, PPO_away
    FROM boxscore_summary
    WHERE gameID = ${(gameId as string).substring(
      SeasonID.toString().length + 1
    )} AND seasonID = ${SeasonID} AND leagueID = ${LeagueID};
  `;

  const [periodScoringSummary] = await query(periodScoringSummarySearch);
  const [penaltySummary] = await query(penaltySummarySearch);
  const [skaterStatsSummary] = await query(skaterStatsSummarySearch);
  const [goalieStatsSummary] = await query(goalieStatsSummarySearch);
  const [gameSummary] = await query(gameSummarySearch);

  // clean and parse responses
  const parsedPeriodScoringSummary = periodScoringSummary.map((period) => ({
    period: period.period,
    time: period.time,
    readableTime: `${
      period.time / 60 < 10
        ? '0' + Math.floor(period.time / 60)
        : Math.floor(period.time / 60)
    }:${period.time % 60 < 10 ? '0' + (period.time % 60) : period.time % 60}`,
    team: {
      id: period.teamID,
      name: period.name,
      nickname: period.nickname,
      abbr: period.abbr,
      primaryColor: period.primarycolor,
    },
    scorer: {
      name: period.scoring_name,
      id: period.scoring_playerID,
    },
    primaryAssist:
      period.assist1_playerID === 0
        ? null
        : {
            name: period.assist1_name,
            id: period.assist1_playerID,
          },
    secondaryAssist:
      period.assist2_playerID === 0
        ? null
        : {
            name: period.assist2_name,
            id: period.assist2_playerID,
          },
    goalType: period.goal_notes,
  }));

  const parsedPeriodPenaltySummary = penaltySummary.map((penalty) => ({
    period: penalty.period,
    time: penalty.time,
    readableTime: `${
      penalty.time / 60 < 10
        ? '0' + Math.floor(penalty.time / 60)
        : Math.floor(penalty.time / 60)
    }:${
      penalty.time % 60 < 10 ? '0' + (penalty.time % 60) : penalty.time % 60
    }`,
    team: {
      name: penalty.name,
      nickname: penalty.nickname,
      abbr: penalty.abbr,
      primaryColor: penalty.primarycolor,
    },
    player: penalty['Last Name'],
    reason: penalty.penalty,
    length: penalty.PIM,
  }));

  const parsedPlayerStatsSummary = skaterStatsSummary.map((skater) => ({
    name: skater['last name'],
    id: skater.playerID,
    team: skater.teamId,
    goals: skater.G,
    assists: skater.A,
    plusMinus: skater.PlusMinus,
    pim: skater.PIM,
    shots: skater.SOG,
    faceoffs: skater.FOW + skater.FOL,
    faceoffWins: skater.FOW,
    hits: skater.HT,
    blocks: skater.BS,
    giveaways: skater.GV,
    takeaways: skater.TK,
    timeOnIce: `${
      skater.TOT / 60 < 10
        ? '0' + Math.floor(skater.TOT / 60)
        : Math.floor(skater.TOT / 60)
    }:${skater.TOT % 60 < 10 ? '0' + (skater.TOT % 60) : skater.TOT % 60}`,
    ppTimeOnIce: `${
      skater.PP / 60 < 10
        ? '0' + Math.floor(skater.PP / 60)
        : Math.floor(skater.PP / 60)
    }:${skater.PP % 60 < 10 ? '0' + (skater.PP % 60) : skater.PP % 60}`,
    shTimeOnIce: `${
      skater.SH / 60 < 10
        ? '0' + Math.floor(skater.SH / 60)
        : Math.floor(skater.SH / 60)
    }:${skater.SH % 60 < 10 ? '0' + (skater.SH % 60) : skater.SH % 60}`,
    shifts: skater.SHF,
    gameRating: Math.floor(skater.GR),
    offensiveGameRating: Math.floor(skater.OGR),
    defensiveGameRating: Math.floor(skater.DGR),
  }));

  const parsedGoalieStatsSummary = goalieStatsSummary.map((goalie) => ({
    name: goalie['last name'],
    id: goalie.playerID,
    team: goalie.teamID,
    shotsAgainst: goalie.ShotsAgainst,
    goalsAgainst: goalie.GoalsAgainst,
    saves: goalie.Saves,
    savePct: goalie.SavePct,
    pim: goalie.PIM,
    gameRating: Math.floor(goalie.GameRating),
    minutesPlayed: `${
      goalie.Minutes / 60_000 < 10
        ? '0' + Math.floor(goalie.Minutes / 60_000)
        : Math.floor(goalie.Minutes / 60_000)
    }:${
      (goalie.Minutes / 1_000) % 60 < 10
        ? '0' + Math.floor((goalie.Minutes / 1_000) % 60)
        : Math.floor((goalie.Minutes / 1_000) % 60)
    }`,
  }));

  const star1Stats =
    parsedPlayerStatsSummary.find(
      (player) => player.id === gameSummary.star1
    ) ||
    parsedGoalieStatsSummary.find((player) => player.id === gameSummary.star1);
  const star2Stats =
    parsedPlayerStatsSummary.find(
      (player) => player.id === gameSummary.star2
    ) ||
    parsedGoalieStatsSummary.find((player) => player.id === gameSummary.star2);
  const star3Stats =
    parsedPlayerStatsSummary.find(
      (player) => player.id === gameSummary.star3
    ) ||
    parsedGoalieStatsSummary.find((player) => player.id === gameSummary.star3);

  const response = {
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
      star1: star1Stats,
      star2: star2Stats,
      star3: star3Stats,
      homeShots: gameSummary.shots_home,
      awayShots: gameSummary.shots_away,
      homePIM: gameSummary.PIM_home,
      awayPIM: gameSummary.PIM_away,
      homeHits: gameSummary.hits_home,
      awayHits: gameSummary.hits_away,
      homeGA: gameSummary.GA_home,
      awayGA: gameSummary.GA_away,
      homeTA: gameSummary.TA_home,
      awayTA: gameSummary.TA_away,
      homeFOW: gameSummary.FOW_home,
      awayFOW: gameSummary.FOW_away,
      homePPG: gameSummary.PPG_home,
      homePPO: gameSummary.PPO_home,
      awayPPG: gameSummary.PPG_away,
      awayPPO: gameSummary.PPO_away,
    },
    periodByPeriodStats: [
      {
        home: {
          goals: gameSummary.score_home_p1,
          shots: gameSummary.SOG_home_p1,
        },
        away: {
          goals: gameSummary.score_away_p1,
          shots: gameSummary.SOG_away_p1,
        },
      },
      {
        home: {
          goals: gameSummary.score_home_p2,
          shots: gameSummary.SOG_home_p2,
        },
        away: {
          goals: gameSummary.score_away_p2,
          shots: gameSummary.SOG_away_p2,
        },
      },
      {
        home: {
          goals: gameSummary.score_home_p3,
          shots: gameSummary.SOG_home_p3,
        },
        away: {
          goals: gameSummary.score_away_p3,
          shots: gameSummary.SOG_away_p3,
        },
      },
      ...((game.Overtime && [
        {
          home: {
            goals: gameSummary.score_home_OT,
            shots: gameSummary.SOG_home_OT,
          },
          away: {
            goals: gameSummary.score_away_OT,
            shots: gameSummary.SOG_away_OT,
          },
        },
      ]) ||
        []),
      ...((game.Shootout && [
        {
          home: {
            goals: gameSummary.score_home_SO,
          },
          away: {
            goals: gameSummary.score_away_SO,
          },
        },
      ]) ||
        []),
    ],
    teams: {
      away: {
        id: game.Away,
        name: game.AwayName,
        nickname: game.AwayNickname,
        abbr: game.AwayAbbr,
        primaryColor: game.AwayPrimaryColor,
      },
      home: {
        id: game.Home,
        name: game.HomeName,
        nickname: game.HomeNickname,
        abbr: game.HomeAbbr,
        primaryColor: game.HomePrimaryColor,
      },
    },
    teamStats: {
      away: awayStats,
      home: homeStats,
    },
    boxscore: {
      scoring: parsedPeriodScoringSummary,
      penalties: parsedPeriodPenaltySummary,
      away: {
        skaters: parsedPlayerStatsSummary.filter(
          (skater) => skater.team === Away
        ),
        goalies: parsedGoalieStatsSummary.filter(
          (goalie) => goalie.team === Away
        ),
      },
      home: {
        skaters: parsedPlayerStatsSummary.filter(
          (skater) => skater.team === Home
        ),
        goalies: parsedGoalieStatsSummary.filter(
          (goalie) => goalie.team === Home
        ),
      },
    },
  };

  res.status(200).json(response);
};
