// Serve API Documentation
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default (req: NextApiRequest, res: NextApiResponse) => {
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
