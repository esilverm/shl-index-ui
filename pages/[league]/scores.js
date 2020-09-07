/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/Header';

function Scores({ league }) {
  return (
    <>
      <Header league={league} showScoreBar={false} activePage="scores" />
      <div>This is a placeholder</div>
    </>
  );
}

Scores.propTypes = {
  league: PropTypes.string.isRequired,
};

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

export default Scores;
