// Helper method to wait for middleware to execute before continuing.
// See https://nextjs.org/docs/api-routes/api-middlewares
export default (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
