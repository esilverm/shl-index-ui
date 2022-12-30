import { Skeleton } from '@chakra-ui/react';
import { useMemo } from 'react';

import { GamePreviewData } from '../../pages/api/v2/schedule/game/preview';
import { League } from '../../utils/leagueHelpers';

import { GamePreviewCard } from './GamePreviewCard';

export const PreviewTeamStats = ({
  league,
  previewData,
}: {
  league: League;
  previewData: GamePreviewData | undefined;
}) => {
  const perTeamGoalsFor = useMemo(() => {
    if (!previewData) return {};
    const awayGFperGame =
      previewData.teamStats.away.goalsFor /
      previewData.teamStats.away.gamesPlayed;
    const homeGFperGame =
      previewData.teamStats.home.goalsFor /
      previewData.teamStats.home.gamesPlayed;

    return {
      away: {
        total: awayGFperGame.toFixed(2).padEnd(4, '0'),
        percent: (awayGFperGame / (awayGFperGame + homeGFperGame)) * 100,
      },
      home: {
        total: homeGFperGame.toFixed(2).padEnd(4, '0'),
      },
    };
  }, [previewData]);

  const perTeamGoalsAgainst = useMemo(() => {
    if (!previewData) return {};
    const awayGAperGame =
      previewData.teamStats.away.goalsAgainst /
      previewData.teamStats.away.gamesPlayed;
    const homeGAperGame =
      previewData.teamStats.home.goalsAgainst /
      previewData.teamStats.home.gamesPlayed;

    return {
      away: {
        total: awayGAperGame.toFixed(2).padEnd(4, '0'),
        percent: (awayGAperGame / (awayGAperGame + homeGAperGame)) * 100,
      },
      home: {
        total: homeGAperGame.toFixed(2).padEnd(4, '0'),
      },
    };
  }, [previewData]);

  const titlePrefix = previewData?.game.played ? 'Seasonal ' : '';

  const awayColor = previewData?.teams.away.primaryColor;
  const homeColor = previewData?.teams.home.primaryColor;

  return (
    <GamePreviewCard
      league={league}
      title={`${titlePrefix}Team Stats`}
      awayAbbr={previewData?.teams.away.abbr}
      homeAbbr={previewData?.teams.home.abbr}
    >
      <div className="m-4 mb-1.5 flex items-center justify-between">
        <Skeleton isLoaded={!!previewData}>
          <div className="font-mont text-2xl font-semibold">
            {perTeamGoalsFor.away?.total}
          </div>
        </Skeleton>
        <span>GF/GP</span>
        <Skeleton isLoaded={!!previewData}>
          <div className="font-mont text-2xl font-semibold">
            {perTeamGoalsFor.home?.total}
          </div>
        </Skeleton>
      </div>
      <div
        className="m-4 mt-0 border-2"
        style={{
          borderImage: `
          linear-gradient(to right,
            ${awayColor} 0%,
            ${awayColor} ${perTeamGoalsFor.away?.percent}%,
            #F8F9FA ${perTeamGoalsFor.away?.percent}%,
            #F8F9FA ${(perTeamGoalsFor.away?.percent ?? 0) + 1}%,
            ${homeColor} ${(perTeamGoalsFor.away?.percent ?? 0) + 1}%,
            ${homeColor} 100%
          ) 5
        `,
        }}
      />

      <div className="m-4 mb-1.5 flex items-center justify-between">
        <Skeleton isLoaded={!!previewData}>
          <div className="w-max font-mont text-2xl font-semibold">
            {perTeamGoalsAgainst.away?.total}
          </div>
        </Skeleton>
        <span>GA/GP</span>
        <Skeleton isLoaded={!!previewData}>
          <div className="font-mont text-2xl font-semibold">
            {perTeamGoalsAgainst.home?.total}
          </div>
        </Skeleton>
      </div>
      <div
        className="m-4 mt-0 border-2"
        style={{
          borderImage: `
          linear-gradient(to right,
            ${awayColor} 0%,
            ${awayColor} ${perTeamGoalsAgainst.away?.percent}%,
            #F8F9FA ${perTeamGoalsAgainst.away?.percent}%,
            #F8F9FA ${(perTeamGoalsAgainst.away?.percent ?? 0) + 1}%,
            ${homeColor} ${(perTeamGoalsAgainst.away?.percent ?? 0) + 1}%,
            ${homeColor} 100%
          ) 5
        `,
        }}
      />
    </GamePreviewCard>
  );
};
