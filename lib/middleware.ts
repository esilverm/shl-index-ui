/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// Helper method to wait for middleware to execute before continuing.
// See https://nextjs.org/docs/api-routes/api-middlewares
import { NextApiRequest, NextApiResponse } from 'next';

export default (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (
    arg0: NextApiRequest,
    arg1: NextApiResponse<any>,
    arg2: (result: any) => void,
  ) => void,
) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
