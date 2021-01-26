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
  FROM player_ratings
  WHERE LeagueID=${+league}
    AND SeasonID=${season.SeasonID}
  INNER JOIN player_master
  ON player_ratings.PlayerID = player_master.PlayerID
  AND player_ratings.SeasonID = player_master.SeasonID 
  AND player_ratings.LeagueID = player_master.LeagueID;
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

  const { league = 0, season: seasonid } = req.query;

  const [season] =
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM player_master
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const basePlayerData = await getBasePlayerData(league, season);
  const skaterStats = await getSkaterStats(league, season);
  const goalieStats = await getGoalieStats(league, season);
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
      return {
        ...playerInfo,
        stats: {
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
        },
        ratings: {
          blocker: player.Blocker,
          glove: player.Glove,
          passing: player.GPassing,
          pokeCheck: player.GPokecheck,
          positioning: player.GPositioning,
          rebound: player.Rebound,
          recovery: player.Recovery,
          puckhandling: player.GPuckhandling,
          lowShots: player.LowShots,
          reflexes: player.Reflexes,
          skating: player.GSkating,
          mentalToughness: player.MentalToughness,
          goalieStamina: player.GoalieStamina
        }
      };
    }

    return {
      ...playerInfo,
      stats: {
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
      },
      advancedStats: {
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
      },
      ratings: {
        screening: player.Screening,
        gettingOpen: player.GettingOpen,
        passing: player.Passing,
        puckhandling: player.Puckhandling,
        shootingAccuracy: player.ShootingAccuracy,
        shootingRange: player.ShootingRange,
        offensiveRead: player.OffensiveRead,
        checking: player.Checking,
        hitting: player.Hitting,
        positioning: player.Positioning,
        stickchecking: player.Stickchecking,
        shotBlocking: player.shotBlocking,
        faceoffs: player.Faceoffs,
        defensiveRead: player.DefensiveRead,
        acceleration: player.Accelerating,
        agility: player.Agility,
        balance: player.Balance,
        speed: player.Speed,
        stamina: player.Stamina,
        strength: player.Strength,
        fighting: player.Fighting,
        aggression: player.Aggression,
        bravery: player.Bravery
      }
    };
  });

  res.status(200).json(parsed);
};
