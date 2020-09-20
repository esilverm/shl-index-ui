import React from 'react';

import Header from '../../../components/Header';

function index({ league }) {
  return (
    <>
      <Header league={league} activePage="teams" />
      <div>This is a placeholder</div>
    </>
  );
}

export const getStaticPaths = async () => {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
};

export const getStaticProps = async (ctx) => {
  return { props: { league: ctx.params.league } };
};

export default index;
