import mysql from 'serverless-mysql';
import { SQLStatement } from 'sql-template-strings';

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  },
});

export const query = async <T extends unknown>(
  query: SQLStatement,
): Promise<T[] | { error: unknown }> => {
  try {
    const results: T[] = await db.query(query);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
};
