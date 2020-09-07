/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

import Header from '../../components/Header';

function Player({ league }) {
  return (
    <>
      <Header league={league} activePage="players" />
      <div>This is a placeholder</div>
    </>
  );
}

Player.propTypes = {
  league: PropTypes.string.isRequired,
};

export async function getStaticPaths() {
  const leagues = ['shl', 'smjhl', 'iihf', 'wjc'];

  const paths = leagues.map((league) => ({
    params: { league },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps(ctx) {
  return { props: { league: ctx.params.league } };
}

export default Player;
