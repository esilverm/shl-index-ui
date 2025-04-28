import { Spinner } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { BoxscoreSkater } from 'pages/api/v3/schedule/game/boxscore/skaters';
import { useMemo } from 'react';

import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { query } from '../../utils/query';

export const BoxscoreTeamZoneStarts = ({
  gameData,
}: {
  gameData: GamePreviewData | undefined;
}) => {
  const { data: skatersData, isLoading: isLoadingSkaters } = useQuery<{
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
        `api/v3/schedule/game/boxscore/skaters?league=${gameData?.game.league}&gameid=${gameData?.game.gameid}`,
      ),
    enabled: !!gameData,
  });

  const zoneStarts = useMemo(() => {
    if (!skatersData || !skatersData.away.length || !skatersData.home.length) {
      return {
        away: { oz: 0, nz: 0, dz: 0 },
        home: { oz: 0, nz: 0, dz: 0 },
      };
    }
    const awayPlayer = skatersData.away[0];
    const homePlayer = skatersData.home[0];

    return {
      away: {
        oz: awayPlayer.team_oz_starts,
        nz: awayPlayer.team_nz_starts,
        dz: awayPlayer.team_dz_starts,
      },
      home: {
        oz: homePlayer.team_oz_starts,
        nz: homePlayer.team_nz_starts,
        dz: homePlayer.team_dz_starts,
      },
    };
  }, [skatersData]);

  if (isLoadingSkaters || !gameData) {
    return (
      <div className="flex justify-center py-6">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <div className="ml-4 mt-1 text-sm font-medium text-secondary">
        Zone Starts
      </div>
      <div className="flex w-full flex-col bg-table-row">
        <div className="flex w-full border-b border-b-table bg-boxscore-header p-2.5 font-mont text-sm text-boxscore-header">
          <div className="w-1/2">Zone</div>
          <div className="flex-1">{gameData.teams.away.abbr}</div>
          <div className="flex-1">{gameData.teams.home.abbr}</div>
        </div>
        <div className="divide-y divide-table">
          <div className="flex w-full items-center px-2.5 py-6 font-mont">
            <div className="w-1/2">Offensive</div>
            <div className="flex-1">{zoneStarts.away.oz}</div>
            <div className="flex-1">{zoneStarts.home.oz}</div>
          </div>
          <div className="flex w-full items-center px-2.5 py-6 font-mont">
            <div className="w-1/2">Neutral</div>
            <div className="flex-1">{zoneStarts.away.nz}</div>
            <div className="flex-1">{zoneStarts.home.nz}</div>
          </div>
          <div className="flex w-full items-center px-2.5 py-6 font-mont">
            <div className="w-1/2">Defensive</div>
            <div className="flex-1">{zoneStarts.away.dz}</div>
            <div className="flex-1">{zoneStarts.home.dz}</div>
          </div>
        </div>
      </div>
    </>
  );
};
