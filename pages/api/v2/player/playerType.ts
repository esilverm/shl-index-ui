import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { playerId, league } = req.query;

  const search = SQL`
  SELECT G
  FROM corrected_player_ratings
  WHERE LeagueID=${league} AND PlayerID = ${playerId}
  ORDER BY SeasonID DESC
  LIMIT 1
  `;

  const playerType = await query<{
    G: 20 | number;
  }>(search);

  if ('error' in playerType || playerType.length === 0) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [{ G }] = playerType;

  const playerIsGoalie = G === 20 ? 'goalie' : 'skater';

  res.status(200).json({ playerType: playerIsGoalie });
};
