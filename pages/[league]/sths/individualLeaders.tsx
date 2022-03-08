import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';
import styled from 'styled-components';

import Layout from '../../../components/STHS/Layout';
import Leaderboard from '../../../components/STHS/Leaderboard';

const skaterLeaderboards = [
  'goals',
  'assists',
  'shots',
  'shotpct',
  'plusminus',
  'penaltyminutes',
  'shotsblocked',
  'hits',
  'ppg',
  'shg',
  'fightswon',
];

const goalieLeaderboards = [
  'savepct',
  'gaa',
  'gsaa',
  'saves',
  'shutouts',
  'wins',
  'losses',
];

interface Props {
  league: string;
}

function Stats({ league }: Props): JSX.Element {
  return (
    <React.Fragment>
      <NextSeo
        title="Leaders"
        openGraph={{
          title: 'Leaders',
        }}
      />
      <Layout league={league} activePage="Pro League">
        <Container>
          <PageHeader>Pro Individual Leaders</PageHeader>
          <PageSizeWarning>
            Your browser screen resolution is too small for this page. Some
            information are hidden to keep the page readable.
          </PageSizeWarning>
          <SectionHeader>Players</SectionHeader>
          <LeaderBoards>
            {skaterLeaderboards.map((statId) => (
              <Leaderboard
                key={statId}
                league={league}
                playerType="skater"
                stat={statId}
                seasonType={'Regular Season'}
              />
            ))}
          </LeaderBoards>
          <SectionHeader>Goalies</SectionHeader>
          <LeaderBoards>
            {goalieLeaderboards.map((statId) => (
              <Leaderboard
                key={statId}
                league={league}
                playerType="goalie"
                stat={statId}
                seasonType={'Regular Season'}
              />
            ))}
          </LeaderBoards>
        </Container>
      </Layout>
    </React.Fragment>
  );
}

const PageHeader = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1.6em;
  padding-bottom 9px;
  padding-left: 9px;
`;

const SectionHeader = styled.div`
  font-size: 20px;
  font-family: Georgia, Tahoma;
  font-weight: 400;
  margin: 20px 10px;
`;

const PageSizeWarning = styled.div`
  display: none;
  color: #ff0000;
  font-weight: bold;
  padding: 1px 1px 1px 5px;
  text-align: center;

  @media screen and (max-width: 1060px) {
    display: block;
  }
`;

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 1px 0 40px 0;
  margin: 0 auto;

  @media screen and (max-width: 1050px) {
    width: 100%;
    padding: 2.5%;
  }
`;

const LeaderBoards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
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

export default Stats;
