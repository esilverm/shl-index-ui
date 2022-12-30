import { NextSeo } from 'next-seo';
import type { GetStaticPaths, GetStaticProps } from 'next/types';

import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { HomepageLeaders } from '../../components/homepage/HomepageLeaders';
import { Livestream } from '../../components/LiveStream';
import { League } from '../../utils/leagueHelpers';

export default ({ league }: { league: League }) => {
  return (
    <>
      <NextSeo
        title={league.toUpperCase()}
        openGraph={{
          title: league.toUpperCase(),
        }}
      />
      <Header league={league} />
      <div className="my-0 mx-auto block h-auto w-full flex-1 grid-cols-4 grid-rows-6 gap-6 bg-grey100 p-6 lg:grid xl:w-3/4">
        <div className="col-[initial] row-[initial] m-auto w-4/5 md:col-start-1 md:col-end-4 md:row-start-1 md:row-end-7 md:m-0 md:w-full">
          <Livestream league={league} />
        </div>
        <div className="col-start-4 col-end-5 row-start-1 row-end-7 divide-y-2 divide-grey300">
          <h3 className="pb-4 text-3xl font-bold">League Leaders</h3>
          <HomepageLeaders league={league} skaterType="skater" stat="goals" />
          <HomepageLeaders league={league} skaterType="skater" stat="points" />
          <HomepageLeaders league={league} skaterType="goalie" stat="wins" />
          <HomepageLeaders
            league={league}
            skaterType="goalie"
            stat="shutouts"
          />
        </div>
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
