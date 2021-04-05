import React from 'react';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import useSWR from 'swr';
import styled from 'styled-components';

import Header from '../../../../components/Header';
import { Matchup as MatchupData } from '../../../api/v1/schedule/[gameId]';

interface Props {
  league: string;
  gameId: string;
}

function GameResults({ league, gameId }: Props): JSX.Element {
  const { data, error } = useSWR<MatchupData>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/${gameId}`
  );
  console.log(data, error);
  return (
    <React.Fragment>
      <NextSeo
        title='Game'
        openGraph={{
          title: 'Game',
        }}
      />
      <Header league={league} />
      <Container>
        <TeamStats></TeamStats>
        <Comparison>
          <Result>
            <TeamData>
              <TeamLogo></TeamLogo>
              <TeamName></TeamName>
              <TeamRecord></TeamRecord>
            </TeamData>
            <TeamData>
              <TeamLogo></TeamLogo>
              <TeamName></TeamName>
              <TeamRecord></TeamRecord>
            </TeamData>
          </Result>
        </Comparison>
        <PreviousMatchups>
          <Matchup></Matchup>
        </PreviousMatchups>
      </Container>
    </React.Fragment>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

// Left
const TeamStats = styled.div`
  display: flex;
  flex-direction: column;
`;

// Middle
const Comparison = styled.div`
  display: flex;
  flex-direction: column;
`;

const Result = styled.div`
  display: flex;
  flex-direction: row;
`;

const TeamData = styled.div`
  display: flex;
  flex-direction: row;
`;

const TeamLogo = styled.div`
  width: 50px;
  height: 50px;
`;

const TeamName = styled.span`

`;

const TeamRecord = styled.span`

`;

// Right
const PreviousMatchups = styled.div`
  display: flex;
  flex-direction: column;
`;

// Component?
const Matchup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { league, gameId } = params;
  return { props: { league, gameId } };
}

export default GameResults;
