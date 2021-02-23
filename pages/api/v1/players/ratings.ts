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
  AND corrected_player_ratings.SeasonID=${season.SeasonID} AND corrected_player_ratings.G<19 AND player_master.TeamID>=0;
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
  const containsRatings = type === "full" || type === "ratings";
  let basePlayerData = [];

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

  await Promise.all(queries.map(fn => fn(league, season))).then(values => {
    basePlayerData = values[0];
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

    return {
      baseData: player,
      position
    };
  });

  const parsed = combinedPlayerData.map(player => {
    const playerInfo = getPlayerInfo(player.baseData);

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
      ...ratings
    };
  });

  res.status(200).json(parsed);
};
