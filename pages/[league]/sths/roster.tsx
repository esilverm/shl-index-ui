import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

import { Team, PlayerRatings, GoalieRatings } from '../../..';
import GoalieRatingsTable from '../../../components/STHS/GoalieRatingsTable';
import Layout from '../../../components/STHS/Layout';
import SkaterRatingsTable from '../../../components/STHS/SkaterRatingsTable';
import useGoalieRatings from '../../../hooks/useGoalieRatings';
import useRatings from '../../../hooks/useRatings';

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
    href: () => '#',
    as: () => `#`,
    text: 'Pro Team Lines',
  },
  {
    href: () => '#',
    as: () => `#`,
    text: 'Pro Team Schedule',
  },
  {
    href: () => '#',
    as: () => `#`,
    text: 'Pro Team Stats',
  },
  {
    href: () => '#',
    as: () => `#`,
    text: 'Pro Team Stats VS',
  },
  {
    href: () => '#top',
    as: () => `#top`,
    text: 'Page Top',
  },
];

function RosterPage({ league, teamlist }: Props): JSX.Element {
  const { ratings: ratings } = useRatings(league);
  const { ratings: goalieRatings } = useGoalieRatings(league);

  return (
    <React.Fragment>
      <NextSeo
        title="Roster"
        openGraph={{
          title: 'Roster',
        }}
      />
      <Layout league={league} activePage="Pro Team">
        <Container>
          <PageHeader>Pro Team Roster</PageHeader>
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

              {ratings && goalieRatings && (
                <React.Fragment>
                  <RatingsTableContainer>
                    <SkaterRatingsTable
                      data={
                        ratings.filter(
                          (p) => p.position !== 'G' && p.team == abbreviation
                        ) as Array<PlayerRatings>
                      }
                    />
                  </RatingsTableContainer>
                  <RatingsTableContainer>
                    <GoalieRatingsTable
                      data={
                        goalieRatings.filter(
                          (p) => p.position === 'G' && p.team == abbreviation
                        ) as Array<GoalieRatings>
                      }
                    />
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

export default RosterPage;
