import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { query } from '../../../../../lib/db';
import use from '../../../../../lib/middleware';

const cors = Cors({
    methods: ['GET', 'HEAD'],
});

export default async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    await use(req, res, cors);

    const {
        id,
        league = 0,
        season: seasonid
    } = req.query;

    const basePlayerData = await query(SQL`
        SELECT *
        FROM corrected_player_ratings
        INNER JOIN player_master
        ON corrected_player_ratings.PlayerID = player_master.PlayerID
        AND corrected_player_ratings.SeasonID = player_master.SeasonID
        AND corrected_player_ratings.LeagueID = player_master.LeagueID
        INNER JOIN team_data
        ON player_master.TeamID = team_data.TeamID
        AND corrected_player_ratings.SeasonID = team_data.SeasonID
        AND corrected_player_ratings.LeagueID = team_data.LeagueID
        WHERE corrected_player_ratings.LeagueID=${+league}
        AND corrected_player_ratings.G<19
        AND player_master.TeamID>=0
        AND player_master.PlayerID=${id}
        `.append(
        seasonid != null
            ? SQL`
                AND corrected_player_ratings.SeasonID=${+seasonid}
              `
            : ''
    ));

    const combinedPlayerData = basePlayerData.map((player) => {
        const position = ['G', 'LD', 'RD', 'LW', 'C', 'RW'][
            [
                +player.G,
                +player.LD,
                +player.RD,
                +player.LW,
                +player.C,
                +player.RW,
            ].indexOf(20)
        ];

        return {
            ...player,
            position,
        };
    });

    // remove 0 season
    const filtered = combinedPlayerData.filter((item) => {
        return item.SeasonID !== 0;
    });

    const parsed = filtered.map((player) => {
        return {
            id: player.PlayerID,
            league: player.LeagueID,
            season: player.SeasonID,
            name: player['Last Name'],
            team: player.Abbr,
            position: player.position,
            screening: player.Screening,
            gettingOpen: player.GettingOpen,
            passing: player.Passing,
            puckHandling: player.PuckHandling,
            shootingAccuracy: player.ShootingAccuracy,
            shootingRange: player.ShootingRange,
            offensiveRead: player.OffensiveRead,
            checking: player.Checking,
            hitting: player.Hitting,
            positioning: player.Positioning,
            stickChecking: player.Stickchecking,
            shotBlocking: player.ShotBlocking,
            faceoffs: player.Faceoffs,
            defensiveRead: player.DefensiveRead,
            acceleration: player.Acceleration,
            agility: player.Agility,
            balance: player.Balance,
            speed: player.Speed,
            stamina: player.Stamina,
            strength: player.Strength,
            fighting: player.Fighting,
            aggression: player.Aggression,
            bravery: player.Bravery,
            determination: player.Determination,
            teamPlayer: player.Teamplayer,
            leadership: player.Leadership,
            temperament: player.Temperament,
            professionalism: player.Professionalism,
        };
    });

    res.status(200).json(parsed);
};
