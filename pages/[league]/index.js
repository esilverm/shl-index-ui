import React from 'react';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';

import Header from '../../components/Header';

function LeagueHome({ league }) {
  return (
    <>
      <NextSeo
        title={`${league.toUpperCase()} Home | SHL Index`}
        description="The Simulation Hockey League is a free online forums based sim league where you create your own fantasy hockey player. Join today and create your player, get drafted, sign contracts, become a GM, make trades and compete against 1,800 players from around the world."
        // canonical=""
        openGraph={{
          url: '',
          title: `${league.toUpperCase()} Home | SHL Index`,
          description:
            'The Simulation Hockey League is a free online forums based sim league where you create your own fantasy hockey player. Join today and create your player, get drafted, sign contracts, become a GM, make trades and compete against 1,800 players from around the world.',
        }}
      />
      <Header league={league} />
      <Container className="content">
        <h1>
          <em>{league}</em>
        </h1>
        <h1>
          <em>{league}</em>
        </h1>
        <h1>
          <em>{league}</em>
        </h1>
        <h1>
          <em>{league}</em>
        </h1>
        <h1>
          <em>{league}</em>
        </h1>
      </Container>
    </>
  );
}

// LeagueHome.propTypes = {
//   league: PropTypes.string.isRequired,
// };

const Container = styled.div`
  height: 150vh;
  width: 75%;
  margin: 0 auto;
`;

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

export default LeagueHome;
