import React from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import styled from 'styled-components';
import tinycolor from 'tinycolor2';

import Footer from '../../../components/Footer';
import { Team } from '../../..';
import Header from '../../../components/Header';
import Link from '../../../components/LinkWithSeason';

interface Props {
  league: string;
  teamlist: Array<Team>;
}

function index({ league, teamlist }: Props): JSX.Element {
  return (
    <React.Fragment>
      <NextSeo
        title="Teams"
        openGraph={{
          title: 'Teams',
        }}
      />
      <Header league={league} activePage="teams" />
      <Container>
        <TeamListContainer>
          {teamlist
            .sort((a, b) => {
              if (league === 'iihf' || league === 'wjc') {
                return a.nameDetails.second.localeCompare(b.nameDetails.second);
              }
              return a.nameDetails.first.localeCompare(b.nameDetails.first);
            })
            .map((team) => (
              <Link
                href="/[league]/team/[id]"
                as={`/${league}/team/${team.id}`}
                passHref
                key={team.id}
              >
                <TeamLink {...team.colors}>
                  <TeamLogo
                    src={require(`../../../public/team_logos/${league.toUpperCase()}/${team.location
                      .replace('.', '')
                      .replace(/white|blue/i, '')
                      .trim()
                      .split(' ')
                      .join('_')}.svg`)}
                    alt={`${team.name} logo`}
                  />
                  <TeamName bright={tinycolor(team.colors.primary).isDark()}>
                    <span className="first">{team.nameDetails.first}</span>
                    <span className="second">{team.nameDetails.second}</span>
                  </TeamName>
                </TeamLink>
              </Link>
            ))}
        </TeamListContainer>
      </Container>
      <Footer />
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 75%;
  padding: 1px 0 40px 0;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 0%;
  }
`;

const TeamListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  grid-auto-rows: 100px;
  margin-top: 20px;

  @media (min-width: 500px) {
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  }
`;

const TeamLink = styled.div<{
  primary: string;
  secondary: string;
  text: string;
}>`
  width: 90%;
  height: 90%;
  background-color: ${({ primary }) => primary};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;
`;

const TeamLogo = styled.img`
  height: 60%;
  filter: drop-shadow(0 0 1.15rem rgba(0, 0, 0, 0.4));
  margin: 0 5%;
`;

const TeamName = styled.h2<{ bright: boolean }>`
  color: ${({ bright, theme }) =>
    bright ? theme.colors.grey100 : theme.colors.grey900};

  span {
    display: block;
  }

  span.first {
    font-weight: 400;
    letter-spacing: 0.1rem;
  }

  span.second {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
  }
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

export default index;
