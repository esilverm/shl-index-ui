import React from 'react';
import styled from 'styled-components';
import LinkWithSeason from '../LinkWithSeason';
import { Matchup } from '../../pages/api/v1/schedule/game/[gameId]';
import { FlexColumn, FlexRow, SectionTitle } from './common';

interface Props {
  gameData: Matchup;
  Sprites: {
    [index: string]: React.ComponentClass<any>;
  };
  league: string;
}

const TeamsBlock = ({ league, gameData, Sprites }: Props): JSX.Element => {
  const { awayScore, homeScore, played, overtime, shootout } = gameData.game;
  const final = `Final${shootout ? ' (SO)' : overtime ? ' (OT)' : ''}`;

  return (
    <TeamsPreview>
      <FlexColumn>
        <GameDate>
          <SectionTitle>{gameData.game.date}</SectionTitle>
          {!!played && <FinalLabel>{final}</FinalLabel>}
        </GameDate>
        <ResponsiveFlex>
          <TeamData>
            <TeamLogo>
              <Sprites.Away />
            </TeamLogo>
            <TeamInfo>
              <LinkWithSeason
                href="/[league]/team/[teamid]"
                as={`/${league}/team/${gameData.game.awayTeam}`}
                passHref
              >
                <TeamName>
                  {`${gameData.teams.away.name} ${gameData.teams.away.nickname}`}
                </TeamName>
              </LinkWithSeason>
              <TeamRecord>{gameData.teamStats.away.record}</TeamRecord>
            </TeamInfo>
            {!!played && (
              <Score lost={awayScore < homeScore}>{awayScore}</Score>
            )}
          </TeamData>
          <TeamData>
            {!!played && (
              <Score lost={homeScore < awayScore}>{homeScore}</Score>
            )}
            <TeamInfo>
            <LinkWithSeason
                href="/[league]/team/[teamid]"
                as={`/${league}/team/${gameData.game.homeTeam}`}
                passHref
              >
              <TeamName home>
                {`${gameData.teams.home.name} ${gameData.teams.home.nickname}`}
              </TeamName>
              </LinkWithSeason>
              <TeamRecord home>{gameData.teamStats.home.record}</TeamRecord>
            </TeamInfo>
            <TeamLogo>
              <Sprites.Home />
            </TeamLogo>
          </TeamData>
        </ResponsiveFlex>
      </FlexColumn>
    </TeamsPreview>
  );
};

const TeamsPreview = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.grey100};
  padding: 0 15px 15px 15px;
`;

const ResponsiveFlex = styled(FlexRow)`
  @media screen and (max-width: 670px) {
    flex-direction: column;
  }
`;

const TeamData = styled.div`
  display: flex;
  flex-direction: row;
  width: 45%;

  @media screen and (max-width: 670px) {
    width: 100%;
  }
`;

const Score = styled.div<{
  lost?: boolean;
}>`
  font-family: Montserrat, sans-serif;
  font-size: 32px;
  font-weight: 600;
  ${({ lost, theme }) => lost && `color: ${theme.colors.grey500};`}

  @media screen and (max-width: 670px) {
    order: 3;
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

const FinalLabel = styled.div`
  margin-left: auto;
`;

const TeamInfo = styled(FlexColumn)`
  @media screen and (max-width: 670px) {
    text-align: left;
    order: 2;
  }
`;

const TeamName = styled.span<{
  home?: boolean;
}>`
  text-align: ${({ home }) => (home ? 'right' : 'left')};
  padding: 0 10px;
  font-weight: 600;
  cursor: pointer;

  @media screen and (max-width: 670px) {
    text-align: left;
    order: 2;
  }
`;

const TeamRecord = styled.span<{
  home?: boolean;
}>`
  font-family: Montserrat, sans-serif;
  font-size: 14px;
  text-align: ${({ home }) => (home ? 'right' : 'left')};
  padding: 0 10px;
  color: ${({ theme }) => theme.colors.grey600};

  @media screen and (max-width: 670px) {
    text-align: left;
    order: 2;
  }
`;

const TeamLogo = styled.div`
  width: 50px;
  height: 50px;

  @media screen and (max-width: 670px) {
    text-align: left;
    order: 1;
  }
`;

export default TeamsBlock;
