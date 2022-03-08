import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

import Layout from '../../../components/STHS/Layout';
import useLeaders from '../../../hooks/useLeaders';

interface Props {
  league: string;
}

const leagueNames = {
  shl: 'Simulation Hockey League',
  smjhl: 'Simulation Major Junior Hockey League',
  iihf: 'International Ice Hockey Federation',
  wjc: 'World Junior Championships',
};

function LeagueHome({ league }: Props): JSX.Element {
  const { data: scheduleData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/header?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}&days=1`
  );
  const { leaders: pointLeaders, isLoading: isLoadingPL } = useLeaders(
    league,
    'skater',
    'points',
    null,
    'all',
    5
  );
  const { leaders: goalLeaders, isLoading: isLoadingGL } = useLeaders(
    league,
    'skater',
    'goals',
    null,
    'all',
    5
  );
  const { leaders: winsLeaders, isLoading: isLoadingWL } = useLeaders(
    league,
    'goalie',
    'wins',
    null,
    'all',
    5
  );

  return (
    <React.Fragment>
      <NextSeo
        title={league.toUpperCase()}
        openGraph={{
          title: league.toUpperCase(),
        }}
      />
      <Layout league={league}>
        <Container>
          <ScoresContainer>
            <SideHeader>Latest Scores</SideHeader>
            {scheduleData &&
              scheduleData[0].games.map(
                ({
                  awayScore,
                  awayTeamName,
                  date,
                  homeScore,
                  homeTeamName,
                  slug,
                }) => (
                  <ScoreBox key={slug}>
                    <div className="date">{date}</div>
                    <div className="teamScore">
                      <div>{homeTeamName}</div>
                      <div>{homeScore}</div>
                    </div>
                    <div className="teamScore">
                      <div>{awayTeamName}</div>
                      <div>{awayScore}</div>
                    </div>
                    <div className="boxscore">Boxscore</div>
                  </ScoreBox>
                )
              )}
          </ScoresContainer>
          <NewsContainer>
            <NewsHeader>{leagueNames[league]} News</NewsHeader>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Vitae
              proin sagittis nisl rhoncus mattis rhoncus urna neque. Sed libero
              enim sed faucibus turpis in eu. Sodales ut eu sem integer vitae.
              Tellus elementum sagittis vitae et leo. Eu volutpat odio facilisis
              mauris sit amet massa. Aliquam ultrices sagittis orci a
              scelerisque. Lobortis scelerisque fermentum dui faucibus. Donec
              ultrices tincidunt arcu non sodales neque sodales ut. Phasellus
              faucibus scelerisque eleifend donec pretium vulputate. Vitae
              congue eu consequat ac.
            </p>
            <p>
              Risus at ultrices mi tempus imperdiet nulla malesuada
              pellentesque. Lacus vestibulum sed arcu non odio. Urna porttitor
              rhoncus dolor purus non enim praesent. Integer malesuada nunc vel
              risus commodo viverra maecenas accumsan lacus. Consequat mauris
              nunc congue nisi vitae suscipit tellus. Bibendum neque egestas
              congue quisque egestas diam in arcu. A iaculis at erat
              pellentesque adipiscing commodo elit. Tellus pellentesque eu
              tincidunt tortor. Sem fringilla ut morbi tincidunt augue interdum
              velit euismod. Nibh tortor id aliquet lectus proin. Nunc consequat
              interdum varius sit amet mattis vulputate enim nulla. Tincidunt
              nunc pulvinar sapien et ligula ullamcorper malesuada proin.
              Tristique senectus et netus et malesuada. Sed viverra tellus in
              hac habitasse platea dictumst vestibulum rhoncus.
            </p>

            <h2>Latest Trade, Waiver, Injury & Suspension Transactions</h2>
            <p>
              [5/1/2022 7:30:12 AM] - Joe Mama was added to Hamilton Steelhawks.
            </p>
          </NewsContainer>
          <TopScorersContainer>
            <SideHeader>Top 5 Point</SideHeader>
            <LeadersBox>
              <div className="name header">Name</div>
              <div className="stat header">P</div>
              {!isLoadingPL &&
                pointLeaders.map(({ id, name, team, stat }) => (
                  <React.Fragment key={id}>
                    <div className="name">
                      {name} ({team.abbr})
                    </div>
                    <div className="stat">{stat}</div>
                  </React.Fragment>
                ))}
            </LeadersBox>
            <SideHeader>Top 5 Goal</SideHeader>
            <LeadersBox>
              <div className="name header">Name</div>
              <div className="stat header">G</div>
              {!isLoadingGL &&
                goalLeaders.map(({ id, name, team, stat }) => (
                  <React.Fragment key={id}>
                    <div className="name">
                      {name} ({team.abbr})
                    </div>
                    <div className="stat">{stat}</div>
                  </React.Fragment>
                ))}
            </LeadersBox>
            <SideHeader>Top 5 Goalies</SideHeader>
            <LeadersBox>
              <div className="name header">Name</div>
              <div className="stat header">W</div>
              {!isLoadingWL &&
                winsLeaders.map(({ id, name, team, stat }) => (
                  <React.Fragment key={id}>
                    <div className="name">
                      {name} ({team.abbr})
                    </div>
                    <div className="stat">{stat}</div>
                  </React.Fragment>
                ))}
            </LeadersBox>
          </TopScorersContainer>
        </Container>
      </Layout>
    </React.Fragment>
  );
}

const Container = styled.div`
  display: grid;
  height: auto;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(8, 1fr);
  gap: 1.5rem;
  margin: 0 auto;
  padding: 3px;
`;

const ScoresContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 7;

  @media screen and (max-width: 890px) {
    display: none;
  }
`;

const SideHeader = styled.div`
  text-align: center;
  margin: 10px;
  font-size: 1.25em;
`;

const ScoreBox = styled.div`
  border: grey 0.5px solid;
  text-indent: initial;
  border-spacing: 2px;
  width: 200px;

  & .date {
    font-weight: bold;
    text-align: center;
  }

  & .teamScore {
    display: flex;
    justify-content: space-between;
    padding-left: 5px;
    padding-right: 10px;
  }

  & .boxscore {
    cursor: pointer;
    text-align: center;
    color: #274f70;

    &:hover {
      color: black;
    }
  }
`;

const NewsContainer = styled.div`
  grid-column: 2 / 6;
  grid-row: 1 / 7;

  & p:not(:last-child) {
    display: inline-block;
    margin-top: 30px;
  }

  & p:last-child {
    margin-top: 10px;
  }

  & h2 {
    font-size: 20px;
    font-family: Georgia, Tahoma;
    font-weight: 400;
    margin-top: 20px;
    margin-left: 10px;
  }
`;

const NewsHeader = styled.div`
  font-size: 2em;
  margin: 3px;
`;

const TopScorersContainer = styled.div`
  grid-column: 7 / 9;
  grid-row: 1 / 7;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`;

const LeadersBox = styled.div`
  background-color: rgb(242, 242, 242);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(6, 21px);
  margin-bottom: 50px;

  & .name {
    grid-column: 1 / 3;
    padding: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    border: 1px solid #ddd;

    &.header {
      font-weight: bold;
    }
  }

  & .stat {
    grid-column: 3 / 4;
    border: 1px solid #ddd;
    padding: 1px;

    &.header {
      font-weight: bold;
    }
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
