import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface MasterPlayer {
  PlayerID: number;
  TeamID: number;
  FranchiseID: number;
  LeagueID: number;
  SeasonID: number;
  'First Name': string;
  'Last Name': string;
  'Nick Name': string;
  Height: string;
  Weight: string;
  DOB: string;
  Birthcity: string;
  Birthstate: string;
  Nationality_One: string;
  Nationality_Two: string;
  Nationality_Three: string;
  position: string;
}

const getBasePlayerData = async (league, season) => await query(SQL`
  SELECT *
  FROM corrected_player_ratings
  INNER JOIN player_master
  ON corrected_player_ratings.PlayerID = player_master.PlayerID
  AND corrected_player_ratings.SeasonID = player_master.SeasonID
  AND corrected_player_ratings.LeagueID = player_master.LeagueID
  WHERE corrected_player_ratings.LeagueID=${+league}
  AND corrected_player_ratings.SeasonID=${season.SeasonID};
`);

const getSkaterStats = async (league, season) => await query(SQL`
  SELECT *
  FROM player_skater_stats_rs
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID};
`);

const getGoalieStats = async (league, season) => await query(SQL`
  SELECT *
  FROM player_goalie_stats_rs
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID};
`);

const getPlayerInfo = (player: MasterPlayer) => ({
  id: player.PlayerID,
  league: player.LeagueID,
  season: player.SeasonID,
  name: player['Last Name'],
  team: player.TeamID,
  position: player.position
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid, type = "full" } = req.query;
  const containsStats = type === "full" || type === "stats";
  const containsAdvStats = type === "full" || type === "advanced";
  const containsRatings = type === "full" || type === "ratings";
  let basePlayerData = [];
  let skaterStats = [];
  let goalieStats = [];

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM player_master
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const queries = [getBasePlayerData];
  if (containsStats) {
    queries.push(...[getSkaterStats, getGoalieStats]);
  } else if (containsAdvStats) {
    queries.push(getSkaterStats);
  }

  await Promise.all(queries.map(fn => fn(league, season))).then(values => {
    basePlayerData = values[0];
    if (containsStats || containsAdvStats) {
      skaterStats = values[1];
      goalieStats = values[2];
    }
  });

  const combinedPlayerData = basePlayerData.map(player => {
    const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
      [
        player.G,
        player.LD,
        player.RD,
        player.LW,
        player.C,
        player.RW,
      ].indexOf(20)
    ];

    if (position === 'G') {
      return {
        baseData: player,
        position,
        stats: goalieStats.find(goalie => goalie.PlayerID === player.PlayerID)
      };
    }
    return {
      baseData: player,
      position,
      stats: skaterStats.find(skater => skater.PlayerID === player.PlayerID)
    };
  });

  const parsed = combinedPlayerData.map(player => {
    const playerInfo = getPlayerInfo(player.baseData);

    if (player.position === 'G') {
      const stats = player.stats ? {
        gamesPlayed: player.stats.GP,
        minutes: player.stats.Minutes,
        wins: player.stats.Wins,
        losses: player.stats.Losses,
        ot: player.stats.OT,
        shotsAgainst: player.stats.ShotsAgainst,
        saves: player.stats.Saves,
        goalsAgainst: player.stats.GoalsAgainst,
        gaa: player.stats.GAA,
        shutouts: player.stats.Shutouts,
        savePct: player.stats.SavePct,
        gameRating: player.stats.GameRating
      } : {};
      const ratings = {
        blocker: player.baseData.Blocker,
        glove: player.baseData.Glove,
        passing: player.baseData.GPassing,
        pokeCheck: player.baseData.GPokecheck,
        positioning: player.baseData.GPositioning,
        rebound: player.baseData.Rebound,
        recovery: player.baseData.Recovery,
        puckhandling: player.baseData.GPuckhandling,
        lowShots: player.baseData.LowShots,
        reflexes: player.baseData.Reflexes,
        skating: player.baseData.GSkating,
        aggression: player.baseData.Aggression,
        mentalToughness: player.baseData.MentalToughness,
        determination: player.baseData.Determination,
        teamPlayer: player.baseData.TeamPlayer,
        leadership: player.baseData.Leadership,
        goalieStamina: player.baseData.GoalieStamina,
        professionalism: player.baseData.Professionalism
      };

      return {
        ...playerInfo,
        ...(containsStats && { stats }),
        ...(containsRatings && { ratings })
      };
    }

    const stats = player.stats ? {
      gamesPlayed: player.stats.GP,
      timeOnIce: player.stats.TOI + player.stats.PPTOI + player.stats.SHTOI, // in seconds
      goals: player.stats.G,
      assists: player.stats.A,
      points: player.stats.G + player.stats.A,
      plusMinus: player.stats.PlusMinus,
      pim: player.stats.PIM,
      ppGoals: player.stats.PPG,
      ppAssists: player.stats.PPA,
      ppPoints: player.stats.PPG + player.stats.PPA,
      ppTimeOnIce: player.stats.PPTOI,
      shGoals: player.stats.SHG,
      shAssists: player.stats.SHA,
      shPoints: player.stats.SHG + player.stats.SHA,
      shTimeOnIce: player.stats.SHTOI,
      fights: player.stats.Fights,
      fightWins: player.stats.Fights_Won,
      fightLosses: player.stats.Fights - player.stats.Fights_Won,
      hits: player.stats.HIT,
      giveaways: player.stats.GvA,
      takeaways: player.stats.TkA,
      shotsBlocked: player.stats.SB,
      shotsOnGoal: player.stats.SOG,
      gameRating: player.stats.GR,
      offensiveGameRating: player.stats.OGR,
      devensiveGameRating: player.stats.DGR
    } : {};
    const advancedStats = player.stats ? {
      PDO: player.stats.PDO,
      GF60: player.stats.GF60,
      GA60: player.stats.GA60,
      SF60: player.stats.SF60,
      SA60: player.stats.SA60,
      CF: player.stats.CF,
      CA: player.stats.CA,
      CFPct: player.stats.CFPct,
      CFPctRel: player.stats.CFPctRel,
      FF: player.stats.FF,
      FA: player.stats.FA,
      FFPct: player.stats.FFPct,
      FFPctRel: player.stats.FFPctRel
    } : {};
    const ratings = {
      screening: player.baseData.Screening,
      gettingOpen: player.baseData.GettingOpen,
      passing: player.baseData.Passing,
      puckhandling: player.baseData.Puckhandling,
      shootingAccuracy: player.baseData.ShootingAccuracy,
      shootingRange: player.baseData.ShootingRange,
      offensiveRead: player.baseData.OffensiveRead,
      checking: player.baseData.Checking,
      hitting: player.baseData.Hitting,
      positioning: player.baseData.Positioning,
      stickchecking: player.baseData.Stickchecking,
      shotBlocking: player.baseData.shotBlocking,
      faceoffs: player.baseData.Faceoffs,
      defensiveRead: player.baseData.DefensiveRead,
      acceleration: player.baseData.Accelerating,
      agility: player.baseData.Agility,
      balance: player.baseData.Balance,
      speed: player.baseData.Speed,
      stamina: player.baseData.Stamina,
      strength: player.baseData.Strength,
      fighting: player.baseData.Fighting,
      aggression: player.baseData.Aggression,
      bravery: player.baseData.Bravery,
      determination: player.baseData.Determination,
      teamPlayer: player.baseData.TeamPlayer,
      leadership: player.baseData.Leadership,
      temperament: player.baseData.Temperament,
      professionalism: player.baseData.Professionalism
    };

    return {
      ...playerInfo,
      ...(containsStats && { stats }),
      ...(containsAdvStats && { advancedStats }),
      ...(containsRatings && { ratings })
    };
  });

  res.status(200).json(parsed);
};
