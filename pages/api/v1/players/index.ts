import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
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

  const basePlayerData = await query(SQL`
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
  AND corrected_player_ratings.G<19
  AND player_master.TeamID>=0;
`);

  const combinedPlayerData = [...basePlayerData].map((player) => {
    const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
      [player.G, player.LD, player.RD, player.LW, player.C, player.RW].indexOf(
        20
      )
    ];

    return {
      ...player,
      position,
    };
  });

  const parsed = combinedPlayerData.map((player) => {
    return {
      id: player.PlayerID,
      league: player.LeagueID,
      season: player.SeasonID,
      name: player['Last Name'],
      team: player.Abbr,
      position: player.position,
      height: player.Height,
      weight: player.Weight,
    };
  });

  res.status(200).json(parsed);
};
