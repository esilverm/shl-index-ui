import {
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Footer } from 'components/Footer';
import { Header } from 'components/Header';
import { SeasonTypeSelector } from 'components/SeasonTypeSelector';
import { GoalieRatingsTable } from 'components/tables/GoalieRatingsTable';
import { GoalieScoreTable } from 'components/tables/GoalieScoreTable';
import { SkaterAdvStatsTable } from 'components/tables/SkaterAdvStatsTable';
import { SkaterRatingsTable } from 'components/tables/SkaterRatingsTable';
import { SkaterScoreTable } from 'components/tables/SkaterScoreTable';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';

import { useSeason } from '../../hooks/useSeason';
import { useSeasonType } from '../../hooks/useSeasonType';
import { Goalie, PlayerWithAdvancedStats } from '../../typings/api';
import { League, leagueNameToId } from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { seasonTypeToApiFriendlyParam } from '../../utils/seasonTypeHelpers';
import { GoalieRatings } from '../api/v1/goalies/ratings/[id]';
import { SkaterRatings } from '../api/v1/players/ratings/[id]';

export default ({ league }: { league: League }) => {
  const { season } = useSeason();
  const { type } = useSeasonType();

  const { data: skaterScoring } = useQuery<PlayerWithAdvancedStats[]>({
    queryKey: ['skaterScoring', league, type, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      const seasonTypeParam = type
        ? `&type=${seasonTypeToApiFriendlyParam(type)}`
        : '';
      return query(
        `/api/v1/players/stats?league=${leagueNameToId(
          league,
        )}${seasonParam}${seasonTypeParam}`,
      );
    },
  });

  const { data: goalieScoring } = useQuery<Goalie[]>({
    queryKey: ['goalieScoring', league, type, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      const seasonTypeParam = type
        ? `&type=${seasonTypeToApiFriendlyParam(type)}`
        : '';
      return query(
        `/api/v1/goalies/stats?league=${leagueNameToId(
          league,
        )}${seasonParam}${seasonTypeParam}`,
      );
    },
  });

  const { data: skaterRatings } = useQuery<SkaterRatings[]>({
    queryKey: ['skaterRatings', league, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `/api/v1/players/ratings?league=${leagueNameToId(
          league,
        )}${seasonParam}`,
      );
    },
  });

  const { data: goalieRatings } = useQuery<GoalieRatings[]>({
    queryKey: ['goalieRatings', league, season],
    queryFn: () => {
      const seasonParam = season ? `&season=${season}` : '';
      return query(
        `/api/v1/goalies/ratings?league=${leagueNameToId(
          league,
        )}${seasonParam}`,
      );
    },
  });

  const isLoading =
    !skaterScoring || !skaterRatings || !goalieRatings || !goalieScoring;

  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} Players`}
        openGraph={{
          title: `${league.toUpperCase()} Players`,
        }}
      />
      <Header league={league} activePage="players" />
      <div className="mx-auto w-full bg-grey100 p-[2.5%] lg:w-3/4 lg:pt-px lg:pb-10">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center md:mr-8 md:flex-row md:justify-end">
              <SeasonTypeSelector className="top-7 !h-7 w-48" />
            </div>
            <h2 className="my-7 border-b border-b-grey900 py-1 text-4xl font-bold">
              Skaters
            </h2>
            <Tabs>
              <TabList>
                <Tab>Stats</Tab>
                <Tab>Advanced Stats</Tab>
                <Tab>Ratings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SkaterScoreTable data={skaterScoring} type="league" />
                </TabPanel>
                <TabPanel>
                  <SkaterAdvStatsTable data={skaterScoring} type="league" />
                </TabPanel>
                <TabPanel>
                  <SkaterRatingsTable data={skaterRatings} type="league" />
                </TabPanel>
              </TabPanels>
            </Tabs>
            <h2 className="my-7 border-b border-b-grey900 py-1 text-4xl font-bold">
              Goalies
            </h2>
            <Tabs>
              <TabList>
                <Tab>Stats</Tab>
                <Tab>Ratings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <GoalieScoreTable data={goalieScoring} type="league" />
                </TabPanel>
                <TabPanel>
                  <GoalieRatingsTable data={goalieRatings} type="league" />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: { league: ctx.params?.league } };
};
