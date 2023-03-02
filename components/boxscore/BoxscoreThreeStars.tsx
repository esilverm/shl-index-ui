import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { BoxscoreGoalie } from '../../pages/api/v2/schedule/game/boxscore/goalies';
import { BoxscoreSkater } from '../../pages/api/v2/schedule/game/boxscore/skaters';
import { BoxscoreSummary } from '../../pages/api/v2/schedule/game/boxscore/summary';
import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { League } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { TeamLogo } from '../TeamLogo';

const StarRow = ({
  league,
  gameData,
  star,
  skatersData,
  goaliesData,
}: {
  league: League;
  gameData: GamePreviewData;
  star: BoxscoreSummary['stars']['star1'];
  skatersData: {
    away: BoxscoreSkater[];
    home: BoxscoreSkater[];
  };
  goaliesData: {
    away: BoxscoreGoalie[];
    home: BoxscoreGoalie[];
  };
}) => {
  const starInfo = useMemo(() => {
    const starTeam = star.team === gameData.game.homeTeam ? 'home' : 'away';

    const maybeStar1IfSkater = skatersData[starTeam].find(
      ({ id }) => id === star.id,
    );
    const maybeStar1IfGoalie = goaliesData[starTeam].find(
      ({ id }) => id === star.id,
    );

    return maybeStar1IfSkater ?? maybeStar1IfGoalie;
  }, [gameData.game.homeTeam, goaliesData, skatersData, star.id, star.team]);

  if (!starInfo) return null;

  const starTeamAbbreviation =
    star.team === gameData.game.homeTeam
      ? gameData.teams.home.abbr
      : gameData.teams.away.abbr;

  const starIsGoalie = 'shotsAgainst' in starInfo;
  return (
    <div className="flex w-full p-1">
      <TeamLogo
        league={league}
        teamAbbreviation={starTeamAbbreviation}
        className="mr-2 h-[60px] w-[60px]"
      />
      <div className="flex w-full flex-col overflow-hidden text-ellipsis whitespace-nowrap">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold">
          {star.name}
        </div>
        <div className="text-xs text-grey700">
          {starIsGoalie
            ? `SA: ${starInfo.shotsAgainst} SV%: ${starInfo.savePct.toFixed(3)}`
            : `G: ${starInfo.goals} A: ${starInfo.assists} H: ${starInfo.hits}`}
        </div>
      </div>
    </div>
  );
};

export const BoxscoreThreeStars = ({
  league,
  gameData,
}: {
  league: League;
  gameData: GamePreviewData | undefined;
}) => {
  const { data } = useQuery<BoxscoreSummary>({
    queryKey: [
      `gameBoxscoreSummary`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/boxscore/summary?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const { data: skatersData } = useQuery<{
    away: BoxscoreSkater[];
    home: BoxscoreSkater[];
  }>({
    queryKey: [
      `gameBoxscoreSkaters`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/boxscore/skaters?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const { data: goaliesData } = useQuery<{
    away: BoxscoreGoalie[];
    home: BoxscoreGoalie[];
  }>({
    queryKey: [
      `gameBoxscoreGoalies`,
      gameData?.game.league,
      gameData?.game.gameid,
    ],
    queryFn: () =>
      query(
        `api/v2/schedule/game/boxscore/goalies?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  if (!gameData || !data || !skatersData || !goaliesData) {
    return (
      <div className="flex h-10 w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-1 ml-4 text-sm font-medium text-grey700">
        Three Stars of the Game
      </div>
      <div className="flex w-full flex-col bg-grey100 font-mont">
        <StarRow
          league={league}
          gameData={gameData}
          star={data.stars.star1}
          goaliesData={goaliesData}
          skatersData={skatersData}
        />
        <StarRow
          league={league}
          gameData={gameData}
          star={data.stars.star2}
          goaliesData={goaliesData}
          skatersData={skatersData}
        />
        <StarRow
          league={league}
          gameData={gameData}
          star={data.stars.star3}
          goaliesData={goaliesData}
          skatersData={skatersData}
        />
      </div>
    </>
  );
};
