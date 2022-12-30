import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { useCallback, useMemo } from 'react';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { Leaderboard } from '../../components/leaderboard/Leaderboard';
import {
  goalieLeaderboardStats,
  LeaderboardTypes,
  leaderboardTypes,
  skaterLeaderboardStats,
} from '../../components/leaderboard/shared';
import { SeasonTypeSelector } from '../../components/SeasonTypeSelector';
import { useRouterPageState } from '../../hooks/useRouterPageState';
import { League } from '../../utils/leagueHelpers';

export default ({ league }: { league: League }) => {
  const { tab, setRouterPageState } = useRouterPageState<{
    tab: LeaderboardTypes;
  }>({
    keys: ['tab'],
    initialState: {
      tab: 'Skaters',
    },
  });

  const currentActiveTab = useMemo(() => {
    return leaderboardTypes.indexOf(tab);
  }, [tab]);

  const setCurrentActiveTab = useCallback(
    (index: number) => {
      setRouterPageState('tab', leaderboardTypes[index]);
    },
    [setRouterPageState],
  );

  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} ${tab} Leaders`}
        openGraph={{
          title: `${league.toUpperCase()} ${tab} Leaders`,
        }}
      />
      <Header league={league} activePage="leaders" />
      <div className="mx-auto w-full bg-grey100 py-6 sm:px-6 lg:w-3/4 lg:py-0 lg:pt-px lg:pb-10">
        <div className="flex !h-7 items-center justify-center lg:float-right lg:inline-block ">
          <SeasonTypeSelector className="!h-7 w-48 lg:top-7" />
        </div>
        <Tabs isLazy index={currentActiveTab} onChange={setCurrentActiveTab}>
          <TabList className="mt-7">
            {leaderboardTypes.map((type) => (
              <Tab key={type}>{type}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {leaderboardTypes.map((type) => {
              if (type === 'Goalies') {
                return (
                  <TabPanel
                    key={type}
                    className="flex flex-wrap justify-center"
                  >
                    <div className="flex flex-wrap justify-center">
                      {goalieLeaderboardStats.map((stat) => (
                        <Leaderboard
                          key={stat}
                          league={league}
                          leaderboardType={{
                            playerType: type,
                            stat,
                          }}
                        />
                      ))}
                    </div>
                  </TabPanel>
                );
              }

              return (
                <TabPanel key={type}>
                  <div className="flex flex-wrap justify-center">
                    {skaterLeaderboardStats.map((stat) => (
                      <Leaderboard
                        key={stat}
                        league={league}
                        leaderboardType={{
                          playerType: type,
                          stat,
                        }}
                      />
                    ))}
                  </div>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
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
