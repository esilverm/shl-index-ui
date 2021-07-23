// Serve API Documentation
import fs from 'fs';
import path from 'path';

import { NextApiRequest, NextApiResponse } from 'next';

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  const filePath = path.resolve('./public/docs.html');
  const stat = fs.statSync(filePath);

  res.statusCode = 200;
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Content-Length': stat.size,
  });

  const readStream = fs.createReadStream(filePath);

  readStream.pipe(res);
};
