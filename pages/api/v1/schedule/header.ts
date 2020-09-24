import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';
import { query } from '../../../../lib/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { league = 0, days = 5, team } = req.query;

  const [season] = await query(SQL`
      SELECT DISTINCT SeasonID
      FROM slugviewer
      WHERE LeagueID=${+league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `);

  const search = SQL`
    SELECT s.Slug, s.Date, t1.Abbr as 'Home', s.HomeScore, t2.Abbr as 'Away', s.AwayScore, s.Overtime, s.Shootout, s.Played
    FROM slugviewer as s
    INNER JOIN team_data AS t1 
      ON t1.TeamID = s.Home 
        AND t1.LeagueID = s.LeagueID 
        AND t1.SeasonID = s.SeasonID
    INNER JOIN team_data AS t2 
      ON t2.TeamID = s.Away 
        AND t2.LeagueID = s.LeagueID 
        AND t2.SeasonID = s.SeasonID
    WHERE s.LeagueID=${+league}
      AND s.SeasonID=${season.SeasonID}
  `;

  if (!Number.isNaN(+team)) {
    search.append(`AND(s.Home=${+team} OR s.Away=${+team})`);
  }

  const schedule = await query(search);

  // Clean up response
  const parsed = schedule.map((game) => ({
    slug: game.Slug,
    date: game.Date,
    homeTeam: game.Home,
    homeScore: game.HomeScore,
    awayTeam: game.Away,
    awayScore: game.AwayScore,
    overtime: game.Overtime,
    shootout: game.Shootout,
    played: game.Played,
  }));

  // Simulate a GROUP BY Date
  const hash = parsed.reduce((persist, game) => {
    if (!persist[game.date]) {
      return {
        [game.date]: [game],
        ...persist,
      };
    }

    return {
      [game.date]: persist[game.date].push(game),
      ...persist,
    };
  }, {});

  const dateList = Object.keys(hash).map((date) => ({
    date,
    played: hash[date][0].played, // can assume that if one game has been played all have been for said day.
    games: hash[date],
  }));

  // Solution from here: https://stackoverflow.com/a/60688789/10382232
  dateList.sort(
    (a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf()
  );

  // get x amount of played game days and 1 game from the future.
  const playedGames = dateList.filter(({ played }) => played);
  const nextGameDay = dateList
    .filter(({ played }) => !played)
    .slice(0, playedGames.length < days ? +days - playedGames.length : 1);

  const lastGames = playedGames.slice(
    Math.max(
      playedGames.length - +days < 0
        ? playedGames.length
        : playedGames.length - +days - nextGameDay.length,
      1
    )
  );

  res.status(200).json([...lastGames, ...nextGameDay]);
};
