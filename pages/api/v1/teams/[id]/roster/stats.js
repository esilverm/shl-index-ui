import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../../../lib/db';
import use from '../../../../../../lib/middleware';

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (req, res) => {
  await use(req, res, cors);

  const id = parseInt(req.query.id, 10);

  if (Number.isNaN(id)) {
    res.status(400).send('Error: Team id must be a number');
    return;
  }

  const league = parseInt(req.query.league, 10) || 0;

  const type = ['po', 'ps', 'rs'].includes(req.query.type)
    ? req.query.type
    : 'rs';

  const [season] =
    (!Number.isNaN(parseInt(req.query.season, 10)) && [
      { SeasonID: parseInt(req.query.season, 10) },
    ]) ||
    (await query(
      SQL`
      SELECT DISTINCT SeasonID
      FROM `.append(`player_skater_stats_${type}`).append(SQL`
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `)
    ));

  const playerStats = await query(
    SQL`
    SELECT *
    FROM `.append(`player_skater_stats_${type}`).append(SQL`
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
      AND TeamID=${id}
  `)
  );
  const goalieStats = await query(
    SQL`
    SELECT *
    FROM `.append(`player_goalie_stats_${type}`).append(SQL`
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
      AND TeamID=${id}
  `)
  );

  const parsed = [...playerStats, ...goalieStats].map((player) => {
    if ('Wins' in player) {
      // is Goalie
      return {
        id: player.PlayerID,
        league: player.LeagueID,
        team: player.TeamID,
        season: player.SeasonID,
        gamesPlayed: player.GP,
        minutes: player.Minutes,
        wins: player.Wins,
        losses: player.Losses,
        ot: player.OT,
        shotsAgainst: player.ShotsAgainst,
        saves: player.Saves,
        goalsAgainst: player.GoalsAgainst,
        gaa: player.GAA,
        shutouts: player.Shutouts,
        savePct: player.SavePct,
        gameRating: player.GameRating,
      };
    }

    return {
      id: player.PlayerID,
      league: player.LeagueID,
      team: player.TeamID,
      season: player.SeasonID,
      gamesPlayed: player.GP,
      timeOnIce: player.TOI + player.PPTOI + player.SHTOI, // in seconds
      goals: player.G,
      assists: player.A,
      points: player.G + player.A,
      plusMinus: player.PlusMinus,
      pim: player.PIM,
      ppGoals: player.PPG,
      ppAssists: player.PPA,
      ppPoints: player.PPG + player.PPA,
      ppTimeOnIce: player.PPTOI,
      shGoals: player.SHG,
      shAssists: player.SHA,
      shPoints: player.SHG + player.SHA,
      shTimeOnIce: player.SHTOI,
      fights: player.Fights,
      fightWins: player.Fights_Won,
      fightLosses: player.Fights - player.Fights_Won,
      hits: player.HIT,
      giveaways: player.GvA,
      takeaways: player.TkA,
      shotsBlocked: player.SB,
      gameRating: player.GR,
      offensiveGameRating: player.OGR,
      devensiveGameRating: player.DGR,

      advancedStats: {
        PDO: player.PDO,
        GF60: player.GF60,
        GA60: player.GA60,
        SF60: player.SF60,
        SA60: player.SA60,
        CorsiFor: player.CF,
        CorsiAgainst: player.CA,
        CorsiForPct: player.CFPct,
        CorsiForPctRel: player.CFPctRel,
        FF: player.FF,
        FA: player.FA,
        FFPct: player.FFPct,
        FFPctRel: player.FFPctRel,
      },
    };
  });

  // sort for prettier output (also for consistency)
  parsed.sort((a, b) => a.id - b.id);

  res.status(200).json(parsed);
};
