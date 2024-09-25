import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';
import { InternalPlayerRatings } from '../../../../../typings/api';

import { parseSkaterRatings } from './[id]';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export type SeasonType = string;

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  const { league = 0, season: seasonid } = req.query;

  const seasonResponse =
    //@ts-ignore
    (!Number.isNaN(+seasonid) && [{ SeasonID: +seasonid }]) ||
    (await query<{ SeasonID: number }>(SQL`
    SELECT DISTINCT SeasonID
    FROM conferences
    WHERE LeagueID=${+league}
    ORDER BY SeasonID DESC
    LIMIT 1
  `));

  if ('error' in seasonResponse) {
    res.status(400).send('Error: Server Error');
    return;
  }

  const [season] = seasonResponse;

  if(season.SeasonID <= 52){
    res.status(400).send('Error: no player ratings before S52')
    return;
  }

  const basePlayerData = await query<InternalPlayerRatings>(SQL`
  SELECT r.*, p.\`Last Name\` as Name, t.\`Abbr\`
  FROM corrected_player_ratings as r
  INNER JOIN player_master as p
    ON r.PlayerID = p.PlayerID
      AND r.SeasonID = p.SeasonID
      AND r.LeagueID = p.LeagueID
  INNER JOIN team_data as t
    ON p.TeamID = t.TeamID
      AND r.SeasonID = t.SeasonID
      AND r.LeagueID = t.LeagueID
  WHERE r.LeagueID=${+league}
    AND r.SeasonID=${season.SeasonID}
    AND r.G<19
    AND p.TeamID>=0
  `);

  if ('error' in basePlayerData) {
    res.status(400).send('Error: Backend Error');
    return;
  }

  res.status(200).json(basePlayerData.map(parseSkaterRatings));
};
