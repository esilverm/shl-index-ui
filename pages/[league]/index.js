import React from 'react';
import { useRouter } from 'next/router';
// import styled from 'styled-components';
import { NextSeo } from 'next-seo';

function LeagueHome() {
  const router = useRouter();

  const { league } = router.query;
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
      <div id="container">
        <h1>
          <em>{league}</em>
        </h1>
      </div>
    </>
  );
}

export default LeagueHome;
