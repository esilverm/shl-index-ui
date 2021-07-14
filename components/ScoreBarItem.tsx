/* eslint-disable no-nested-ternary  */
import React from 'react';
import styled from 'styled-components';

import Link from '../components/LinkWithSeason';

// Determine prop types when actually implementing in conjunction with backend

interface Props {
  data?: {
    season: string;
    homeTeam: string;
    homeScore: number;
    awayTeam: string;
    awayScore: number;
    overtime: number;
    shootout: number;
    played: number;
  } | null;
  gameid?: string;
  isDate?: boolean;
  league: string;
  HomeIcon?: React.ComponentClass<any> | null;
  AwayIcon?: React.ComponentClass<any> | null;
}

function ScoreBarItem({
  data = null,
  gameid = '',
  isDate = false,
  league,
  HomeIcon = null,
  AwayIcon = null,
}: Props): JSX.Element {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <>
      {isDate ? (
        <Date role="presentation" aria-label="Score Bar Date">
          <span aria-label="Date">
            {months[+gameid.split('-')[1]]}</br>{gameid.split('-')[2]}
          </span>
        </Date>
      ) : (
        <Link
          href="/[league]/[season]/game/[gameid]"
          as={`/${league}/${data.season}/game/${gameid}`}
          passHref
        >
          <Game
            role="link"
            aria-label="Game Result"
            tabIndex={0}
            played={data.played === 1}
          >
            <TeamLine
              played={data.played === 1}
              winner={data.homeScore > data.awayScore}
            >
              <TeamIcon>
                {HomeIcon && <HomeIcon aria-label={data.homeTeam} />}
              </TeamIcon>
              <span className="sbi-shortname" aria-label="Home Team">
                {data.homeTeam}
              </span>
              {data.played === 1 && (
                <span className="sbi-score" aria-label="Home Score">
                  {data.homeScore}
                </span>
              )}
            </TeamLine>
            <TeamLine
              played={data.played === 1}
              winner={!(data.homeScore > data.awayScore)}
            >
              <TeamIcon>
                {AwayIcon && <AwayIcon aria-label={data.awayTeam} />}
              </TeamIcon>
              <span className="sbi-shortname" aria-label="Away Team">
                {data.awayTeam}
              </span>
              {data.played === 1 && (
                <span className="sbi-score" aria-label="Away Score">
                  {data.awayScore}
                </span>
              )}
            </TeamLine>
            <GameResultText aria-label="Game Result" played={data.played === 1}>
              {data.played === 1 ? 'FINAL' : 'SCHEDULED'}
              {data.shootout ? '/SO' : data.overtime ? '/OT' : ''}
            </GameResultText>
          </Game>
        </Link>
      )}
    </>
  );
}

const Date = styled.div`
  width: 46px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey200};
  position: relative;

  & span {
    color: ${({ theme }) => theme.colors.grey900};
    font-weight: 700;
    text-align: center;
    line-height: 1.4;
    font-size: 16px;
    width: 3ch;
    position: relative;
    top: 3px;
  }
`;

const Game = styled.div<{ played: boolean }>`
  width: 189px;
  height: 100%;
  padding-top: 23px;
  border-right: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey100};
  position: relative;

  &:hover ::after {
    cursor: pointer;
    content: '${({ played }) =>
      played ? 'See Game Results' : 'See Game Preview'}';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.85;

    background-color: ${({ theme }) => theme.colors.grey900};
    color: ${({ theme }) => theme.colors.grey100};
  }
`;

const TeamLine = styled.div<{ winner: boolean; played: boolean }>`
  width: 80%;
  margin: 5px auto;
  display: grid;
  grid-template-columns: 12% 65px 1fr;
  color: ${({ winner, played, theme }) =>
    winner || !played ? theme.colors.grey900 : theme.colors.grey600};
  & .sbi-shortname {
    font-weight: 700;
    margin-left: 10px;
    font-size: 0.9rem;
    display: inline-block;
  }

  & .sbi-score {
    font-size: 0.9rem;
    font-weight: 700;
    display: inline-block;
    font-family: Montserrat, sans-serif;
  }
`;

const TeamIcon = styled.div`
  width: 100%;
  display: inline-block;
`;

const GameResultText = styled.span<{ played: boolean }>`
  display: inline-block;
  position: absolute;
  left: ${({ played }) => (played ? '121px' : '95px')};
  width: 60px;
  text-align: center;
  top: 43px;
  font-size: 0.8rem;
`;

export default ScoreBarItem;
