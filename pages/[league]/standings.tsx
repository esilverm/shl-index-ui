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

function Standings({ league }: Props): JSX.Element {
  const [display, setDisplay] = useState('league');
  const { standings, isLoading } = useStandings(league, display);

  return (
    <React.Fragment>
      <NextSeo
        title="Standings"
        openGraph={{
          title: 'Standings',
        }}
      />
      <Header league={league} activePage="standings" />
      <Container>
        <DisplaySelectContainer>
          <DisplaySelectItem onClick={() => setDisplay(() => 'league')}>
            League
          </DisplaySelectItem>
          <DisplaySelectItem onClick={() => setDisplay(() => 'conference')}>
            Conference
          </DisplaySelectItem>
          {league !== 'iihf' && league !== 'wjc' && (
            <DisplaySelectItem onClick={() => setDisplay(() => 'division')}>
              Division
            </DisplaySelectItem>
          )}
        </DisplaySelectContainer>
        {Array.isArray(standings) && 'teams' in standings[0] && !isLoading ? (
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
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 65%;
  padding: 1px 2.5% 40px 2.5%;
  margin: 0 auto;

  @media screen and (max-width: 1024px) {
    width: 95%;
    padding: 2.5%;
  }
`;

const DisplaySelectContainer = styled.div`
  margin: 25px 0;
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const DisplaySelectItem = styled.div`
  padding: 8px 32px;
  border: 1px solid ${({ theme }) => theme.colors.grey500};
  border-radius: 5px;
  cursor: pointer;
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

export default Standings;
