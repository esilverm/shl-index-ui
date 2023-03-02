import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const { gameId } = req.query;

  const search = SQL`
  SELECT GameID, Played
  FROM slugviewer
  WHERE Slug=${gameId}
  `;

  const gameStatus = await query<{
    GameID: number | null;
    Played: number;
  }>(search);

  if ('error' in gameStatus || gameStatus.length === 0) {
    res.status(400).json({ error: 'Server error' });
    return;
  }

  const [{ GameID, Played }] = gameStatus;

  const shouldShowBoxscore = GameID !== null && Played === 1;

  res.status(200).json({ shouldShowBoxscore });
};
