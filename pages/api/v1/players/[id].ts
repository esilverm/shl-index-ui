//@ts-nocheck
import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { id, league = 0, season: seasonid } = req.query;

  const seasonResponse =
    //@ts-ignore
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query<{ SeasonID: number }>(SQL`
    SELECT DISTINCT SeasonID
    FROM player_master
    WHERE LeagueID=${+league}
    AND PlayerID=${+id}
    AND player_master.TeamID>=0
    ORDER BY SeasonID DESC
    LIMIT 1
  `));

  if ('error' in seasonResponse) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [season] = seasonResponse;

  const basePlayerData = await query(
    SQL`
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
  AND corrected_player_ratings.G<19
  AND player_master.TeamID>=0
  AND corrected_player_ratings.PlayerID=${+id}
`
      .append(
        season.SeasonID != null
          ? SQL`AND corrected_player_ratings.SeasonID=${season.SeasonID} `
          : '',
      )
      .append(SQL`ORDER BY corrected_player_ratings.SeasonID DESC`),
  );

  const combinedPlayerData = basePlayerData.map((player) => {
    const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
      [player.G, player.LD, player.RD, player.LW, player.C, player.RW].indexOf(
        20,
      )
    ];

    return {
      ...player,
      position,
    };
  });

  // remove 0 season
  const filtered = combinedPlayerData.filter((item) => {
    return item.SeasonID !== 0;
  });

  const parsed = filtered.map((player) => {
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
