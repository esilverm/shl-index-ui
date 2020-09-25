import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';

import Header from '../../components/Header';

interface Props {
  league: string;
}

function Playoffs({ league }: Props): JSX.Element {
  return (
    <React.Fragment>
      <NextSeo
        title="Playoffs"
        openGraph={{
          title: 'Playoffs',
        }}
      />
      <Header league={league} showScoreBar={false} activePage="playoffs" />
      <div>This is a placeholder</div>
    </React.Fragment>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  return { props: { league: ctx.params.league } };
};

export default Playoffs;
