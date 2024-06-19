import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { Game } from '../../pages/api/v1/schedule';
import { TeamInfo } from '../../pages/api/v1/teams';
import { League } from '../../utils/leagueHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

const ScheduleMatchupTeam = ({
  league,
  game,
  teamData,
  winner,
  teamType,
}: {
  league: League;
  game: Game;
  teamData: TeamInfo[];
  winner: 'home' | 'away' | 'none';
  teamType: 'Home' | 'Away';
}) => {
  const { teamId, teamScore } = useMemo(() => {
    if (teamType === 'Away') {
      return {
        teamId: game.awayTeam,
        teamScore: game.awayScore,
      };
    }
    return {
      teamId: game.homeTeam,
      teamScore: game.homeScore,
    };
  }, [game.awayScore, game.awayTeam, game.homeScore, game.homeTeam, teamType]);

  const team = useMemo(
    () => teamData.find((team) => team.id === teamId),
    [teamData, teamId],
  );
  const winNote = game.shootout ? '(SO)' : game.overtime ? '(OT)' : '';
  return (
    <div
      className={classnames(
        'flex items-center justify-between font-medium',
        winner === 'none' || winner === teamType.toLowerCase()
          ? 'text-grey900 dark:text-white'
          : 'text-grey500 dark:text-white',
      )}
    >
      <div className="flex items-center font-mont text-lg">
        <TeamLogo
          league={league}
          teamAbbreviation={team?.abbreviation}
          className="mr-1 h-6 w-6"
        />
        {team?.location} {winner === teamType.toLowerCase() && winNote}
      </div>
      <div className="flex-1 text-right font-mont text-3xl font-semibold">
        {winner === 'none' ? '-' : teamScore}
      </div>
    </div>
  );
};

export const ScheduleGameMatchup = ({
  league,
  game,
  teamData,
}: {
  league: League;
  game: Game;
  teamData: TeamInfo[];
}) => {
  const { query } = useRouter();
  const winner = game.played
    ? game.awayScore < game.homeScore
      ? 'home'
      : 'away'
    : 'none';

  return (
    <Link
      href={{
        pathname: `/[league]/${game.season}/game/[gameid]`,
        query: {
          ...onlyIncludeSeasonAndTypeInQuery(query),
          gameid: game.slug,
        },
      }}
      className="dark:!hover:bg-globalBackgroundGrey flex flex-col border-b-2 border-b-grey500 py-1 px-2.5 hover:bg-grey300 dark:border-b-globalBorderGrey"
    >
      <ScheduleMatchupTeam
        game={game}
        league={league}
        teamType="Away"
        winner={winner}
        teamData={teamData}
      />
      <ScheduleMatchupTeam
        game={game}
        league={league}
        teamType="Home"
        winner={winner}
        teamData={teamData}
      />
    </Link>
  );
};
