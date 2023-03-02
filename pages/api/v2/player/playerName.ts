import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { playerId, league } = req.query;

  const search = SQL`
  SELECT \`Last Name\` as Name
  FROM player_master
  WHERE LeagueID=${league} AND PlayerID = ${playerId}
  ORDER BY SeasonID DESC
  LIMIT 1
  `;

  const playerName = await query<{
    Name: string;
  }>(search);

  if ('error' in playerName || playerName.length === 0) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [{ Name }] = playerName;

  res.status(200).json({ name: Name });
};
