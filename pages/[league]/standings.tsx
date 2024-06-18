import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo } from 'next-seo';
import { useMemo, useState } from 'react';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { DoubleBracket } from '../../components/playoffBracket/DoubleBracket';
import { SingleBracket } from '../../components/playoffBracket/SingleBracket';
import { SeasonTypeSelector } from '../../components/SeasonTypeSelector';
import { StandingsTable } from '../../components/tables/StandingsTable';
import { useSeason } from '../../hooks/useSeason';
import { useSeasonType } from '../../hooks/useSeasonType';
import {
  isMainLeague,
  League,
  leagueNameToId,
  shouldShowDivision,
} from '../../utils/leagueHelpers';
import { query } from '../../utils/query';
import { Standings, StandingsItem } from '../api/v1/standings';
import { PlayoffsRound } from '../api/v1/standings/playoffs';

const tabs = ['league', 'conference', 'division'];

export default ({ league }: { league: League }) => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const { type } = useSeasonType();
  const { season } = useSeason();

  const { data, isLoading } = useQuery<Standings | PlayoffsRound[]>({
    queryKey: ['standings', league, type, season, tabs[currentActiveTab]],
    queryFn: () => {
      const endpoint =
        type === 'Playoffs'
          ? 'standings/playoffs'
          : type === 'Pre-Season'
          ? 'standings/preseason'
          : 'standings';
      const displayParam =
        type !== 'Playoffs' ? `&display=${tabs[currentActiveTab]}` : '';
      const seasonParam = season ? `&season=${season}` : '';

      return query(
        `api/v1/${endpoint}?league=${leagueNameToId(
          league,
        )}${displayParam}${seasonParam}`,
      );
    },
  });

  const shouldShowDoublePlayoffsBracket = useMemo(
    () => data && data[0] && (data[0] as PlayoffsRound).length > 4,
    [data],
  );

  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} Standings`}
        openGraph={{
          title: `${league.toUpperCase()} Standings`,
        }}
      />
      <Header league={league} activePage="standings" />
      <div className="mx-auto w-full bg-grey100 p-[2.5%] lg:pt-px lg:pb-10 2xl:w-5/6 2xl:px-8">
        <div className="flex !h-7 items-center justify-center lg:float-right lg:inline-block ">
          <SeasonTypeSelector className="!h-7 w-48 lg:top-7" />
        </div>
        <Tabs isLazy index={currentActiveTab} onChange={setCurrentActiveTab}>
          {type === 'Playoffs' ? (
            <>
              {shouldShowDoublePlayoffsBracket && (
                <DoubleBracket
                  data={data as Exclude<Standings | PlayoffsRound[], Standings>}
                  league={league}
                  className="hidden xl:flex"
                />
              )}

              <SingleBracket
                data={data as Exclude<Standings | PlayoffsRound[], Standings>}
                league={league}
                className={classnames(
                  shouldShowDoublePlayoffsBracket && 'xl:hidden',
                )}
              />
            </>
          ) : (
            <>
              {/* If we are in playoffs don't render this */}
              <TabList className="my-7">
                <Tab>League</Tab>
                <Tab>Conference</Tab>
                {shouldShowDivision(league, season) && <Tab>Division</Tab>}
              </TabList>
              <TabPanels>
                <TabPanel>
                  {!isLoading && data && !('teams' in data[0]) && (
                    <StandingsTable
                      league={league}
                      data={data as Array<StandingsItem>}
                    />
                  )}
                </TabPanel>
                <TabPanel className="space-y-8">
                  {!isLoading &&
                    data &&
                    'teams' in data[0] &&
                    (data as Exclude<Standings[number], StandingsItem>[]).map(
                      (group) => (
                        <StandingsTable
                          data={group.teams}
                          league={league}
                          title={group.name}
                          key={group.name}
                        />
                      ),
                    )}
                </TabPanel>
                {isMainLeague(league) && (
                  <TabPanel className="space-y-8">
                    {!isLoading &&
                      data &&
                      'teams' in data[0] &&
                      (data as Exclude<Standings[number], StandingsItem>[]).map(
                        (group) => (
                          <StandingsTable
                            data={group.teams}
                            league={league}
                            title={group.name}
                            key={group.name}
                          />
                        ),
                      )}
                  </TabPanel>
                )}
              </TabPanels>
            </>
          )}
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
