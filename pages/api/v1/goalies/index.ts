import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

interface MasterPlayer {
  PlayerID: number;
  Abbr: string;
  FranchiseID: number;
  LeagueID: number;
  SeasonID: number;
  'First Name': string;
  'Last Name': string;
  'Nick Name': string;
  Height: number;
  Weight: number;
  DOB: string;
  Birthcity: string;
  Birthstate: string;
  Nationality_One: string;
  Nationality_Two: string;
  Nationality_Three: string;
  position: string;
}

const getBasePlayerData = async (league, season) =>
  await query(SQL`
  SELECT *
  FROM corrected_player_ratings
  INNER JOIN player_master
  ON corrected_player_ratings.PlayerID = player_master.PlayerID
  AND corrected_player_ratings.SeasonID = player_master.SeasonID
  AND corrected_player_ratings.LeagueID = player_master.LeagueID
  INNER JOIN team_data
  ON player_master.TeamID = team_data.TeamID
  AND corrected_player_ratings.SeasonID = team_data.SeasonID
  AND corrected_player_ratings.LeagueID = team_data.LeagueID
  WHERE corrected_player_ratings.LeagueID=${+league}
  AND corrected_player_ratings.SeasonID=${season.SeasonID}
  AND corrected_player_ratings.G=20
  AND player_master.TeamID>=0;
`);

const getPlayerInfo = (player: MasterPlayer) => ({
  id: player.PlayerID,
  league: player.LeagueID,
  season: player.SeasonID,
  name: player['Last Name'],
  team: player.Abbr,
  position: player.position,
  height: player.Height,
  weight: player.Weight,
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid } = req.query;
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

  await Promise.all(queries.map((fn) => fn(league, season))).then((values) => {
    basePlayerData = values[0];
  });

  const combinedPlayerData = basePlayerData.map((player) => {
    const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
      [player.G, player.LD, player.RD, player.LW, player.C, player.RW].indexOf(
        20
      )
    ];

    return {
      baseData: player,
      position,
    };
  });

  const parsed = combinedPlayerData.map((player) => {
    const playerInfo = getPlayerInfo(player.baseData);

    return {
      ...playerInfo,
    };
  });

  res.status(200).json(parsed);
};
