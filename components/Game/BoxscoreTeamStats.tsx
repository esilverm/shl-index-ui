import React from 'react';
import styled from 'styled-components';

import { FlexRow, SectionTitle } from './common';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const BoxscoreTeamStats = ({ league, gameData, Sprites }): JSX.Element => {
  const {
    homeShots,
    awayShots,
    homePIM,
    awayPIM,
    homeHits,
    awayHits,
    homeGA,
    awayGA,
    homeTA,
    awayTA,
    homeFOW,
    awayFOW,
    homePPG,
    homePPO,
    awayPPG,
    awayPPO,
  } = gameData.game;
  const { home, away } = gameData.teams;

  return (
    <TeamsPreview>
      <GameDate>
        <SectionTitle>{gameData.game.date}</SectionTitle>
      </GameDate>
      <FlexRow>
        <FirstColumn />
        <ColumnHeader>SOG</ColumnHeader>
        <ColumnHeader>FO%</ColumnHeader>
        <ColumnHeader>PP</ColumnHeader>
        <ColumnHeader>PIM</ColumnHeader>
        <ColumnHeader>HITS</ColumnHeader>
        <ColumnHeader>GA</ColumnHeader>
        <ColumnHeader>TA</ColumnHeader>
      </FlexRow>
      <FlexRow>
        <FirstColumn>
          <TeamLogo>
            <Sprites.Away />
          </TeamLogo>
          <TeamName>
            {league === 'iihf' || league === 'wjc' ? away.name : away.nickname}
          </TeamName>
        </FirstColumn>
        <DataColumn>{awayShots}</DataColumn>
        <DataColumn>
          {Math.round((awayFOW * 100) / (awayFOW + homeFOW))}%
        </DataColumn>
        <DataColumn>
          {awayPPG}/{awayPPO}
        </DataColumn>
        <DataColumn>{awayPIM}</DataColumn>
        <DataColumn>{awayHits}</DataColumn>
        <DataColumn>{awayGA}</DataColumn>
        <DataColumn>{awayTA}</DataColumn>
      </FlexRow>
      <FlexRow>
        <FirstColumn>
          <TeamLogo>
            <Sprites.Home />
          </TeamLogo>
          <TeamName>
            {league === 'iihf' || league === 'wjc' ? home.name : home.nickname}
          </TeamName>
        </FirstColumn>
        <DataColumn>{homeShots}</DataColumn>
        <DataColumn>
          {Math.round((homeFOW * 100) / (homeFOW + awayFOW))}%
        </DataColumn>
        <DataColumn>
          {homePPG}/{homePPO}
        </DataColumn>
        <DataColumn>{homePIM}</DataColumn>
        <DataColumn>{homeHits}</DataColumn>
        <DataColumn>{homeGA}</DataColumn>
        <DataColumn>{homeTA}</DataColumn>
      </FlexRow>
    </TeamsPreview>
  );
};

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px 15px 15px;
  margin: 5px 0;
`;

const FirstColumn = styled.div`
  display: flex;
  width: 22%;
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 0;
  flex: 1;
`;

const DataColumn = styled.div`
  font-family: Montserrat, sans-serif;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 0;
  font-weight: 600;
  font-size: 2rem;

  @media screen and (max-width: 670px) {
    font-size: 1rem;
  }
`;

const TeamLogo = styled.div`
  width: 50px;
  height: 50px;
  margin-right: 0.5rem;

  & * {
    width: inherit;
    height: inherit;
  }
`;

const TeamName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  @media screen and (max-width: 670px) {
    display: none;
  }
`;

const GameDate = styled.div`
  display: flex;
  flex-direction: row;
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  font-size: 14px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.grey300};
  margin-bottom: 10px;
  padding 10px 0;
`;

export default BoxscoreTeamStats;
