/* eslint-disable no-nested-ternary */
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Sprites from '../public/team_logos';

function ScoreBarItem({ data, gameid = '', isDate = false, league }) {
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

  const teams = [
    'Buffalo',
    'Chicago',
    'Hamilton',
    'Toronto',
    'Manhattan',
    'NewEngland',
    'TampaBay',
    'Baltimore',
    'Calgary',
    'Edmonton',
    'Minnesota',
    'Winnipeg',
    'SanFrancisco',
    'LosAngeles',
    'NewOrleans',
    'Texas',
  ];

  // eslint-disable-next-line camelcase
  const teams_short = [
    'BUF',
    'CHI',
    'HAM',
    'TOR',
    'MAN',
    'NEW',
    'TBB',
    'BAL',
    'CAL',
    'EDM',
    'MIN',
    'WPG',
    'SFP',
    'LAP',
    'NOLA',
    'TEX',
  ];

  // const League = Sprites[league.toUpperCase()];
  const League = Sprites.SHL;
  const HomeTeam = isDate ? null : League[teams[+gameid.substr(5, 2)]];
  const AwayTeam = isDate ? null : League[teams[+gameid.substr(7, 2)]];

  const winner = data.homeScore > data.awayScore;
  return (
    <>
      {isDate ? (
        <Date>
          <span>
            {months[+gameid.substr(0, 2) - 1]} {gameid.substr(2, 2)}
          </span>
        </Date>
      ) : (
        <Link
          href="/[league]/[season]/game/[gameid]"
          as={`/${league}/${data.season}/game/${gameid}`}
          passHref
        >
          <Game>
            <TeamLine winner={winner}>
              <TeamIcon>
                <HomeTeam />
              </TeamIcon>
              <span className="sbi-shortname">
                {teams_short[+gameid.substr(5, 2)]}
              </span>
              <span className="sbi-score">{data.homeScore}</span>
            </TeamLine>
            <TeamLine winner={!winner}>
              <TeamIcon>
                <AwayTeam />
              </TeamIcon>
              <span className="sbi-shortname">
                {teams_short[+gameid.substr(7, 2)]}
              </span>
              <span className="sbi-score">{data.awayScore}</span>
            </TeamLine>
            <GameResultText>
              FINAL{data.shootout ? '/SO' : data.ot ? '/OT' : ''}
            </GameResultText>
          </Game>
        </Link>
      )}
    </>
  );
}

ScoreBarItem.propTypes = {
  data: PropTypes.shape({
    season: PropTypes.string.isRequired,
    homeScore: PropTypes.number,
    awayScore: PropTypes.number,
    ot: PropTypes.number,
    shootout: PropTypes.number,
  }).isRequired,
  gameid: PropTypes.string,
  isDate: PropTypes.bool,
  league: PropTypes.string.isRequired,
};

ScoreBarItem.defaultProps = {
  gameid: '',
  isDate: false,
};

const Date = styled.div`
  width: 46px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey200};
  position: relative;
  top: -34px;
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

const Game = styled.div`
  width: 189px;
  height: 100%;
  padding-top: 23px;
  border-right: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey100};
  position: relative;

  &:hover ::after {
    cursor: pointer;
    content: 'See Game Results';
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

const TeamLine = styled.div`
  width: 80%;
  margin: 5px auto;
  display: grid;
  grid-template-columns: 12% 65px 1fr;
  color: ${({ winner, theme }) =>
    winner ? theme.colors.grey900 : theme.colors.grey600};
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
  }
`;

const TeamIcon = styled.div`
  width: 100%;
  display: inline-block;
`;

const GameResultText = styled.span`
  display: inline-block;
  position: absolute;
  left: 121px;
  width: 60px;
  text-align: center;
  top: 43px;
  font-size: 0.8rem;
`;

export default ScoreBarItem;
