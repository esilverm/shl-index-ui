import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';
import React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

import Layout from '../../components/STHS/Layout';
import useLeaders from '../../hooks/useLeaders';

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
            <h2>Sim Schedule!</h2>
            <strong>
              By League Management on Sunday, May 22, 2021 at 14:14
            </strong>
            <br />
            <br />
            Season begins on Monday, May 23 at 10 p.m. EST to allow for updates
            and corrections. Otherwise, sim is as follows: Monday evenings at 9
            or 10 p.m. EST, Tuesday through Friday at 8 a.m. EST, Saturday and
            Sunday at 2 p.m. EST. ** This is full season sim schedule, which is
            adjustable by myself. It is determined by my work schedule*, and if
            I&#39;m unable to run the sim before going to work, I will not be
            able to until after 6 p.m. EST. I will aim for morning sims, but
            they may end up much later than expected. * Working at a credit
            union, shifts are 8:15 - 5:00 and 9:30 - 6:15. I tend to work the
            latter. My shift could change to the other for any random week. I
            will give notice.
            <br />
            <h2>I wonder</h2>
            <strong>
              By League Management on Tuesday, March 22, 2021 at 02:23
            </strong>
            <br />
            <br />
            So, does anybody read this? Hello? I guess I&#39;m probably just
            talking to myself here, but I figure it&#39;s a nice useful place to
            store things.
            <br />
            <h2>Untitled</h2>
            <strong>
              By League Management on Thursday, March 17, 2021 at 22:10
            </strong>
            <br />
            <br />
            Raven is pretty cool, I guess.
            <br />
            <h2>Latest Trade, Waiver, Injury & Suspension Transactions</h2>
            <p>
              [4/1/2022 7:30:12 AM] - Joe Mama was added to Hamilton Steelhawks.
            </p>
          </NewsContainer>
          <TopScorersContainer>
            <SideHeader>Top 5 Point</SideHeader>
            <LeadersBox>
              <div className="name header">Name</div>
              <div className="stat header">GP - P</div>
              {!isLoadingPL &&
                pointLeaders.map(({ id, name, team, stat, gamesPlayed }) => (
                  <React.Fragment key={id}>
                    <div className="name">
                      {name} ({team.abbr})
                    </div>
                    <div className="stat">
                      {gamesPlayed} - {stat}
                    </div>
                  </React.Fragment>
                ))}
            </LeadersBox>
            <SideHeader>Top 5 Goal</SideHeader>
            <LeadersBox>
              <div className="name header">Name</div>
              <div className="stat header">GP - G</div>
              {!isLoadingGL &&
                goalLeaders.map(({ id, name, team, stat, gamesPlayed }) => (
                  <React.Fragment key={id}>
                    <div className="name">
                      {name} ({team.abbr})
                    </div>
                    <div className="stat">
                      {gamesPlayed} - {stat}
                    </div>
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

  & p:last-child {
    margin-top: 10px;
  }

  & h2 {
    font-size: 20px;
    font-family: Georgia, Tahoma;
    font-weight: 400;
    margin-top: 20px;
    margin-left: 10px;
    margin-bottom: 12px;
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
