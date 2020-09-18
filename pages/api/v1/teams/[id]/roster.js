import SQL from 'sql-template-strings';
import Cors from 'cors';
import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

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

  const full = req.query.full === 'true';

  const league = parseInt(req.query.league, 10) || 0;

  const [season] =
    (!Number.isNaN(parseInt(req.query.season, 10)) && [
      { SeasonID: parseInt(req.query.season, 10) },
    ]) ||
    (await query(SQL`
      SELECT DISTINCT SeasonID
      FROM team_data
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
  `));

  const roster = await query(SQL`
    SELECT *
    FROM player_master
    WHERE LeagueID=${league}
      AND SeasonID=${season.SeasonID}
      AND TeamID=${id}
  `);

  // gather queries for player ratings
  if (full) {
    const playerIDs = roster.map(({ PlayerID }) => PlayerID);

    const ratings = await query(SQL`
      SELECT * 
      FROM player_ratings
      WHERE LeagueID=${league}
        AND SeasonID=${season.SeasonID}
        AND PlayerID IN (${playerIDs})
    `);

    const parsed = roster.map((player, i) => {
      const rating = ratings[i];

      const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
        [
          rating.G,
          rating.LD,
          rating.RD,
          rating.LW,
          rating.C,
          rating.RW,
        ].indexOf(20)
      ];

      const playerInfo = {
        id: player.PlayerID,
        team: player.TeamID,
        league: player.LeagueID,
        season: player.SeasonID,
        name: player['Last Name'],
        height: parseInt(player.Height, 10),
        weight: parseInt(player.Weight, 10),
        // nationality: player.Nationality_One   // Can't do this since not accurate to affiliated IIHF/WJC team. Need to connect later on.
        position,
      };

      if (position === 'G') {
        return {
          ...playerInfo,
          ratings: {
            blocker: rating.Blocker,
            glove: rating.Glove,
            passing: rating.GPassing,
            pokeCheck: rating.GPokecheck,
            positioning: rating.GPositioning,
            rebound: rating.Rebound,
            recovery: rating.Recovery,
            puckhandling: rating.GPuckhandling,
            lowShots: rating.LowShots,
            reflexes: rating.Reflexes,
            skating: rating.GSkating,
            mentalToughness: rating.MentalToughness,
            goalieStamina: rating.GoalieStamina,
          },
        };
      }
      return {
        ...playerInfo,
        ratings: {
          screening: rating.Screening,
          gettingOpen: rating.GettingOpen,
          passing: rating.Passing,
          puckhandling: rating.Puckhandling,
          shootingAccuracy: rating.ShootingAccuracy,
          shootingRange: rating.ShootingRange,
          offensiveRead: rating.OffensiveRead,
          checking: rating.Checking,
          hitting: rating.Hitting,
          positioning: rating.Positioning,
          stickchecking: rating.Stickchecking,
          shotBlocking: rating.shotBlocking,
          faceoffs: rating.Faceoffs,
          defensiveRead: rating.DefensiveRead,
          acceleration: rating.Accelerating,
          agility: rating.Agility,
          balance: rating.Balance,
          speed: rating.Speed,
          stamina: rating.Stamina,
          strength: rating.Strength,
          fighting: rating.Fighting,
          aggression: rating.Aggression,
          bravery: rating.Bravery,
        },
      };
    });
    res.status(200).json(parsed);
    return;
  }

  const parsed = roster.map((player) => ({
    id: player.PlayerID,
    team: player.TeamID,
    league: player.LeagueID,
    season: player.SeasonID,
    name: player['Last Name'],
    height: parseInt(player.Height, 10),
    weight: parseInt(player.Weight, 10),
    // nationality: player.Nationality_One   // Can't do this since not accurate to affiliated IIHF/WJC team. Need to connect later on.
  }));
  res.status(200).json(parsed);
};
