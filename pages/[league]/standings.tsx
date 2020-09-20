/* eslint-disable no-unused-vars */
import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import Header from '../../components/Header';

function Standings({ league }) {
  return (
    <>
      <Header league={league} activePage="standings" />
      <div>This is a placeholder</div>
    </>
  );
}

// Standings.propTypes = {
//   league: PropTypes.string.isRequired,
// };

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

export default Standings;
