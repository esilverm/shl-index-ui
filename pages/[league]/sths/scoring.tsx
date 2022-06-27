import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

import { Team } from '../../..';
import GoalieScoreTable from '../../../components/STHS/GoalieScoreTable';
import Layout from '../../../components/STHS/Layout';
import SkaterAdvStatsTable from '../../../components/STHS/SkaterAdvStatsTable';
import SkaterScoreTable from '../../../components/STHS/SkaterScoreTable';
import useGoalieStats from '../../../hooks/useGoalieStats';
import useSkaterStats from '../../../hooks/useSkaterStats';

interface Props {
  league: string;
  teamlist: Array<Team>;
}

const STHSTeamLinks = [
  {
    href: (name: string) => `/[league]/sths/roster#${name.replace(/[ ]/g, '')}`,
    as: (league: string, name: string) =>
      `/${league}/sths/roster#${name.replace(/[ ]/g, '')}`,
    text: 'Pro Team Roster',
  },
  {
    href: (name: string) =>
      `/[league]/sths/scoring#${name.replace(/[ ]/g, '')}`,
    as: (league: string, name: string) =>
      `/${league}/sths/scoring#${name.replace(/[ ]/g, '')}`,
    text: 'Pro Team Scoring',
  },
  {
    href: () => '',
    as: () => ``,
    text: 'Pro Team Lines',
  },
  {
    href: () => '',
    as: () => ``,
    text: 'Pro Team Schedule',
  },
  {
    href: () => '',
    as: () => ``,
    text: 'Pro Team Stats',
  },
  {
    href: () => '',
    as: () => ``,
    text: 'Pro Team Stats VS',
  },
  {
    href: () => '#top',
    as: () => `#top`,
    text: 'Page Top',
  },
];

function ScoringPage({ league, teamlist }: Props): JSX.Element {
  const { ratings: skaters } = useSkaterStats(league);
  const { ratings: goalies } = useGoalieStats(league);

  const getSkater = (team) =>
    skaters
      ? skaters
          .filter((player) => player.position !== 'G' && player.team === team)
          .sort((a, b) => b.points - a.points)
      : [];

  const getGoalie = (team) =>
    goalies
      ? goalies
          .filter((player) => player.position === 'G' && player.team === team)
          .sort((a, b) => b.wins - a.wins)
      : [];

  return (
    <React.Fragment>
      <NextSeo
        title="Scoring"
        openGraph={{
          title: 'Scoring',
        }}
      />
      <Layout league={league} activePage="Pro Team">
        <Container>
          <PageHeader>Pro Team Scoring</PageHeader>
          <PageSizeWarning>
            Your browser screen resolution is too small for this page. Some
            information are hidden to keep the page readable.
          </PageSizeWarning>
          <TeamLinkList>
            {teamlist.map(({ id, name }, i) => (
              <React.Fragment key={id}>
                <Link
                  href={`#${name.replace(/[ ]/g, '')}`}
                  passHref
                  scroll={false}
                >
                  {name}
                </Link>
                {i !== teamlist.length - 1 && <span> | </span>}
              </React.Fragment>
            ))}
          </TeamLinkList>

          {teamlist.map(({ id, name, abbreviation }) => (
            <TeamContainer id={`${name.replace(/[ ]/g, '')}`} key={id}>
              <TeamNameLink>
                <Link
                  href={`#${name.replace(/[ ]/g, '')}`}
                  passHref
                  scroll={false}
                >
                  {name}
                </Link>
              </TeamNameLink>
              <TeamLinkList isTeam>
                {STHSTeamLinks.map(({ href, as, text }, i) => (
                  <React.Fragment key={text}>
                    <span>[ </span>
                    {i !== STHSTeamLinks.length - 1 ? (
                      <Link href={href(name)} as={as(league, name)} passHref>
                        {text}
                      </Link>
                    ) : (
                      <strong>
                        <Link href={href(name)} as={as(league, name)} passHref>
                          {text}
                        </Link>
                      </strong>
                    )}

                    <span> ] </span>
                  </React.Fragment>
                ))}
              </TeamLinkList>

              {skaters && goalies && (
                <React.Fragment>
                  <RatingsTableContainer>
                    <SkaterScoreTable data={getSkater(abbreviation)} teamPage />
                  </RatingsTableContainer>
                  <RatingsTableContainer>
                    <SkaterAdvStatsTable
                      data={getSkater(abbreviation)}
                      teamPage
                    />
                  </RatingsTableContainer>
                  <RatingsTableContainer>
                    <GoalieScoreTable data={getGoalie(abbreviation)} teamPage />
                  </RatingsTableContainer>
                </React.Fragment>
              )}
            </TeamContainer>
          ))}
        </Container>
      </Layout>
    </React.Fragment>
  );
}

const Container = styled.div`
  padding: 1px 0 40px 0;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  text-align: left;
  font-weight: bold;
  font-size: 1.6em;
  padding-bottom 9px;
  padding-left: 9px;
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

const TeamLinkList = styled.div<{ isTeam?: boolean }>`
  font-size: 14px;
  a {
    color: #274f70;

    &:hover {
      color: #4c4c4c;
      text-decoration: none;
    }
  }
`;

const TeamContainer = styled.div`
  width: 100%;
  padding: 5px 0;
`;

const TeamNameLink = styled.div`
  font-size: 22px;
  font-family: Georgia, Tahoma;
  margin: 12px;
  & a {
    color: #274f70;
    &:hover {
      color: #4c4c4c;
      text-decoration: none;
    }
  }
`;

const RatingsTableContainer = styled.div`
  margin: 20px 0;
`;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { season, league: leaguename },
  } = ctx;

  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(
    typeof leaguename === 'string' ? leaguename : 'shl'
  );

  const seasonParam = season ? `&season=${season}` : '';

  const teamlist = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams?league=${leagueid}${seasonParam}`
  ).then((res) => res.json());

  return { props: { league: leaguename, teamlist } };
};

export default ScoringPage;
