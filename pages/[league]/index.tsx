import React from 'react';
import styled from 'styled-components';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';

import Header from '../../components/Header';
import Footer from '../../components/Footer';
import LiveStream from '../../components/Livestream';
import HomepageLeaders from '../../components/HomepageLeaders';
import useLeaders from '../../hooks/useLeaders';

interface Props {
  league: string;
}

function LeagueHome({ league }: Props): JSX.Element {
  const { leaders: goalLeader, isLoading: isLoadingGL } = useLeaders(
    league,
    'skater',
    'goals',
    null,
    1
  );
  const { leaders: pointLeader, isLoading: isLoadingPL } = useLeaders(
    league,
    'skater',
    'points',
    null,
    1
  );
  const { leaders: winLeader, isLoading: isLoadingWL } = useLeaders(
    league,
    'goalie',
    'wins',
    null,
    1
  );
  const { leaders: shutoutLeader, isLoading: isLoadingSL } = useLeaders(
    league,
    'goalie',
    'shutouts',
    null,
    1
  );

  let leaders = [];
  if (!isLoadingGL && !isLoadingPL && !isLoadingSL && !isLoadingWL) {
    leaders = [goalLeader[0], pointLeader[0], winLeader[0], shutoutLeader[0]];
  }

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
        <YoutubeEmbedContainer>
          <LiveStream isSHL={league === 'shl'} />
        </YoutubeEmbedContainer>
        <HomepageLeadersContainer>
          <HomepageLeaders league={league} leaders={leaders} />
        </HomepageLeadersContainer>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

const Container = styled.div`
  display: grid;
  width: 75%;
  padding: 2.5%;
  height: auto;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (min-width: 2200px) {
    height: auto;
  }

  @media screen and (max-width: 1224px) {
    width: 100%;
    padding: 2.5%;
  }

  @media screen and (max-width: 1024px) {
    display: block;
    height: auto;
  }
`;

const YoutubeEmbedContainer = styled.div`
  grid-column: 1 / 4;
  grid-row: 1 / 7;

  @media screen and (max-width: 800px) {
    width: 80%;
    grid-column: initial;
    grid-row: initial;
    margin: auto;
  }
`;

const HomepageLeadersContainer = styled.div`
  grid-column: 4 / 5;
  grid-row: 1 / 7;
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
