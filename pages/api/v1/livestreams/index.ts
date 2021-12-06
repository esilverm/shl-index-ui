import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export interface LivestreamData {
  id: number;
  league: string;
  videoId: string;
  isLive: string;
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Array<LivestreamData> | string>
): Promise<void> => {
  await use(req, res, cors);

  const { league = null } = req.query;

  const search = SQL`SELECT * FROM youtube_data`.append(
    league != null
      ? SQL`
        WHERE league=${league}
        `
      : ''
  );

  const youtube_data: Array<{
    id: number;
    league: string;
    videoId: string;
    isLive: string;
  }> = await query(search);

  if (youtube_data.length === 0) {
    res
      .status(404)
      .send('Error 404: Could not find youtube data for given parameters.');
    return;
  }

  const parsed = youtube_data.map((data) => ({
    id: data.id,
    league: data.league,
    videoId: data.videoId,
    isLive: data.isLive,
  }));

  res.status(200).json(parsed);
};
