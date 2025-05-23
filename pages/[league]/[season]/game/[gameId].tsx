import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { useSeason } from 'hooks/useSeason';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';

import { BoxscoreFinalScores } from '../../../../components/boxscore/BoxscoreFinalScores';
import { BoxscorePeriodPenalties } from '../../../../components/boxscore/BoxscorePeriodPenalties';
import { BoxscorePeriodScoring } from '../../../../components/boxscore/BoxscorePeriodScoring';
import { BoxscorePeriodShots } from '../../../../components/boxscore/BoxscorePeriodShots';
import { BoxscoreTeamRosters } from '../../../../components/boxscore/BoxscoreTeamRosters';
import { BoxscoreTeamStats } from '../../../../components/boxscore/BoxscoreTeamStats';
import { BoxscoreTeamZoneStarts } from '../../../../components/boxscore/BoxscoreTeamZoneStarts';
import { BoxscoreThreeStars } from '../../../../components/boxscore/BoxscoreThreeStars';
import { Footer } from '../../../../components/Footer';
import { GamePreview } from '../../../../components/game/GamePreview';
import { GamePreviewStandings } from '../../../../components/game/GamePreviewStandings';
import { GoalieComparison } from '../../../../components/game/GoalieComparison';
import { PreviewTeamStats } from '../../../../components/game/PreviewTeamStats';
import { PreviousMatchups } from '../../../../components/game/PreviousMatchups';
import { SkaterComparison } from '../../../../components/game/SkaterComparison';
import { Header } from '../../../../components/Header';
import { League } from '../../../../utils/leagueHelpers';
import { query } from '../../../../utils/query';
import { type GamePreviewData } from '../../../api/v2/schedule/game/preview';

const fetchShouldShowBoxscore = (gameId: string) =>
  query(`api/v1/schedule/game/shouldShowBoxscore?gameId=${gameId}`);

export default ({ gameId, league }: { gameId: string; league: League }) => {
  const { data: isBoxscore } = useQuery<{ shouldShowBoxscore: boolean }>({
    queryKey: ['shouldShowBoxscore', gameId],
    queryFn: () => fetchShouldShowBoxscore(gameId),
  });
  const { isFHM10 } = useSeason();

  const { data: gameData } = useQuery<GamePreviewData>({
    queryKey: ['gamePreview', gameId],
    queryFn: () => query(`api/v2/schedule/game/preview?gameId=${gameId}`),
  });

  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} Game`}
        openGraph={{
          title: `${league.toUpperCase()} Game`,
        }}
      />
      <Header league={league} activePage="game" />
      <div
        className={classnames(
          'mx-auto grid w-11/12 auto-rows-max grid-cols-[100%] items-start gap-2.5 py-5 lg:grid-cols-[300px_auto] xl:flex xl:justify-evenly 2xl:w-3/4',
          isBoxscore?.shouldShowBoxscore
            ? 'lg:grid-cols-[300px_auto]'
            : 'sm:grid-cols-[300px_auto] ',
        )}
      >
        {!isBoxscore?.shouldShowBoxscore ? (
          <>
            <div className="flex h-fit w-full flex-col justify-between gap-2.5 sm:w-[300px]">
              <PreviewTeamStats league={league} previewData={gameData} />
              {gameData?.game.type === 'Regular Season' && (
                <GamePreviewStandings league={league} previewData={gameData} />
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <GamePreview league={league} previewData={gameData} />
              <SkaterComparison league={league} previewData={gameData} />
              <GoalieComparison league={league} previewData={gameData} />
            </div>
            <div className="w-full sm:w-[300px]">
              <PreviousMatchups league={league} previewData={gameData} />
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-2.5 lg:col-start-2 lg:col-end-3">
              <div className="lg:hidden">
                <BoxscoreFinalScores league={league} gameData={gameData} />
              </div>
              <BoxscoreTeamStats
                league={league}
                gameData={gameData}
                isFHM10={isFHM10}
              />
              <BoxscoreTeamRosters gameData={gameData} isFHM10={isFHM10} />
            </div>
            <div className="flex w-full flex-col gap-2.5 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:w-[300px]">
              <div className="hidden lg:inline-block">
                <BoxscoreFinalScores league={league} gameData={gameData} />
              </div>
              <BoxscorePeriodScoring
                league={league}
                gameData={gameData}
                isFHM10={isFHM10}
              />
              <BoxscorePeriodPenalties gameData={gameData} />
              <BoxscorePeriodShots gameData={gameData} />
              {isFHM10 && <BoxscoreTeamZoneStarts gameData={gameData} />}
              <BoxscoreThreeStars league={league} gameData={gameData} />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient();
  const { league, gameId } = query;

  await queryClient.prefetchQuery({
    queryKey: ['shouldShowBoxscore', gameId],
    queryFn: () => fetchShouldShowBoxscore(gameId as string),
  });

  return {
    props: {
      league,
      gameId,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
