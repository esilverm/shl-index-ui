import React from 'react';
import styled from 'styled-components';
import { NextSeo } from 'next-seo';
import { GetStaticProps, GetStaticPaths } from 'next';

import Header from '../../components/Header';
import StandingsTable from '../../components/StandingsTable';

interface Props {
  league: string;
}

function LeagueHome({ league }: Props): JSX.Element {
  return (
    <React.Fragment>
      <NextSeo
        title={league.toUpperCase()}
        openGraph={{
          title: league.toUpperCase(),
        }}
      />
      <Header league={league} />
      <Container>
        <StandingsTable league={league} />
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  height: 150vh;
  width: 75%;
  margin: 60px auto;
  @media screen and (max-width: 768px) {
    width: 95%;
    padding: 0 2.5%;
  }
`;

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

export default LeagueHome;
