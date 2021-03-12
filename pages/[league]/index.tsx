import React, { useState } from 'react';
import styled from 'styled-components';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';

import Header from '../../components/Header';
import StandingsTable from '../../components/StandingsTable';
import useStandings from '../../hooks/useStandings';

interface Props {
  league: string;
}

function LeagueHome({ league }: Props): JSX.Element {
  const [display, setDisplay] = useState('league');
  const { standings, isLoading } = useStandings(league, display);

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
        <DisplaySelectContainer role="tablist">
          <DisplaySelectItem
            onClick={() => setDisplay(() => 'league')}
            active={display === 'league'}
            tabIndex={0}
            role="tab"
            aria-selected={display === 'league'}
          >
            League
          </DisplaySelectItem>
          <DisplaySelectItem
            onClick={() => setDisplay(() => 'conference')}
            active={display === 'conference'}
            tabIndex={0}
            role="tab"
            aria-selected={display === 'conference'}
          >
            Conference
          </DisplaySelectItem>
          {league !== 'iihf' && league !== 'wjc' && (
            <DisplaySelectItem
              onClick={() => setDisplay(() => 'division')}
              active={display === 'division'}
              tabIndex={0}
              role="tab"
              aria-selected={display === 'division'}
            >
              Division
            </DisplaySelectItem>
          )}
        </DisplaySelectContainer>
        <StandingsTableWrapper>
          {Array.isArray(standings) &&
          standings.length > 0 &&
          'teams' in standings[0] &&
          !isLoading ? (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            standings.map((group, i) => (
              <StandingsTableContainer key={i}>
                <StandingsTable
                  data={group.teams}
                  league={league}
                  title={group.name}
                  isLoading={isLoading}
                />
              </StandingsTableContainer>
            ))
          ) : (
            <StandingsTable
              data={standings}
              league={league}
              isLoading={isLoading}
            />
          )}
        </StandingsTableWrapper>
      </Container>
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
    padding: 2.5%;
  }
`;

const DisplaySelectContainer = styled.div`
  margin: 28px auto;
  width: 95%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey500};
`;

const DisplaySelectItem = styled.div<{ active: boolean }>`
  display: inline-block;
  padding: 8px 24px;
  border: 1px solid
    ${({ theme, active }) => (active ? theme.colors.grey500 : 'transparent')};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.grey100 : 'transparent'};
  border-radius: 5px 5px 0 0;
  cursor: pointer;
  position: relative;
  border-bottom: none;
  bottom: -1px;
`;

const StandingsTableWrapper = styled.div`
  width: 95%;
  margin: auto;
`;

const StandingsTableContainer = styled.div`
  width: 100%;
  margin: 30px 0;
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
