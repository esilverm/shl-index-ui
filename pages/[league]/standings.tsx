import React, { useState } from 'react';
import styled from 'styled-components';
import { GetStaticProps, GetStaticPaths } from 'next';
import { NextSeo } from 'next-seo';

import Header from '../../components/Header';
import StandingsTable from '../../components/StandingsTable';

interface Props {
  league: string;
}

function Standings({ league }: Props): JSX.Element {
  const [display, setDisplay] = useState('league');

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
          <DisplaySelectItem onClick={() => setDisplay(() => 'division')}>
            Division
          </DisplaySelectItem>
        </DisplaySelectContainer>
        <StandingsTable league={league} display={display} />
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  width: 65%;
  padding: 1px 2.5% 40px 2.5%;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.colors.grey100};

  @media screen and (max-width: 1024px) {
    width: 95%;
    padding: 2.5%;
  }
`;

const DisplaySelectContainer = styled.div`
  margin: 40px 0;
  width: 100%;
  height: 80px;
  border: 1px solid black;
`;

const DisplaySelectItem = styled.div`
  color: blue;
  text-decoration: underline;
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
