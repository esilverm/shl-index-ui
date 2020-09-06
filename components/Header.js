import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import VisibilitySensor from 'react-visibility-sensor';

import ScoreBar from './ScoreBar';

function HeaderBar({ league, showScoreBar = true }) {
  const [scheduleVisible, setScheduleVisible] = useState(true);

  const list = [
    { type: 'date', season: '55', gameid: '1010' },
    {
      type: 'game',
      season: '55',
      gameid: '210100005',
      homeScore: 1,
      awayScore: 0,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210100302',
      homeScore: 0,
      awayScore: 2,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210100607',
      homeScore: 3,
      awayScore: 9,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210100908',
      homeScore: 6,
      awayScore: 1,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210101413',
      homeScore: 6,
      awayScore: 3,
      ot: 0,
      shootout: 0,
    },
    { type: 'date', season: '55', gameid: '1011' },
    {
      type: 'game',
      season: '55',
      gameid: '210110401',
      homeScore: 2,
      awayScore: 5,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210110511',
      homeScore: 5,
      awayScore: 1,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210111312',
      homeScore: 5,
      awayScore: 1,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210111406',
      homeScore: 6,
      awayScore: 1,
      ot: 0,
      shootout: 0,
    },
    { type: 'date', season: '55', gameid: '1012' },
    {
      type: 'game',
      season: '55',
      gameid: '210120703',
      homeScore: 1,
      awayScore: 2,
      ot: 1,
      shootout: 1,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210120800',
      homeScore: 1,
      awayScore: 5,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210120911',
      homeScore: 4,
      awayScore: 0,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210121502',
      homeScore: 4,
      awayScore: 1,
      ot: 0,
      shootout: 0,
    },
    {
      type: 'game',
      season: '55',
      gameid: '210120007',
      homeScore: 1,
      awayScore: 0,
      ot: 1,
      shootout: 0,
    },
  ];

  return (
    <header>
      {showScoreBar && (
        <VisibilitySensor
          partialVisibility
          onChange={(e) => setScheduleVisible(e)}
          offset={{ top: 8 }}
        >
          <ScoreBar data={list} league={league} />
        </VisibilitySensor>
      )}
      <HeaderNav
        sticky={!scheduleVisible || !showScoreBar}
        role="navigation"
        aria-label="Main"
      >
        <Container>
          <Link href="/[league]" as={`/${league}`} passHref tabIndex={0} >
            <Logo
              scheduleNotVisible={!scheduleVisible || !showScoreBar}
              role="link"
              tabIndex={0}
            >
              <picture>
                <source
                  srcSet={require(`../public/league_logos/${encodeURI(
                    league.toUpperCase()
                  )}.png?webp`)}
                  type="image/webp"
                />
                <source
                  srcSet={require(`../public/league_logos/${encodeURI(
                    league.toUpperCase()
                  )}.png`)}
                  type="image/png"
                />
                <img
                  src={require(`../public/league_logos/${encodeURI(
                    league.toUpperCase()
                  )}.png`)}
                  alt="SHL Logo"
                  height="90%"
                />
              </picture>
            </Logo>
          </Link>
        </Container>
      </HeaderNav>
    </header>
  );
}

const HeaderNav = styled.div`
  ${({ sticky }) =>
    sticky
      ? ` 
  position: fixed;
  top: 0px;

  & + .content {
    padding-top: 64px;
  }
  `
      : ''}

  width: 100%;
  height: 64px;
  background-color: ${({ theme }) => theme.colors.grey900};
`;

const Container = styled.div`
  width: 75%;
  height: 100%;
  margin: 0 auto;

  @media screen and (max-width: 768px) {
    width: 90%;
  }
`;

const Logo = styled.div`
  transition: all 200ms;
  height: ${({ scheduleNotVisible }) => (scheduleNotVisible ? `100%` : `150%`)};
  width: max-content;
  margin-left: 2%;

  & img {
    position: relative;
    top: ${({ scheduleNotVisible }) => (scheduleNotVisible ? `5%` : `-10%`)};
    object-fit: contain;
    border-radius: 5px;
    transition: all 200ms ease-out;
    cursor: pointer;
  }
`;

HeaderBar.propTypes = {
  league: PropTypes.string.isRequired,
  showScoreBar: PropTypes.bool,
};

HeaderBar.defaultProps = {
  showScoreBar: true,
};

export default HeaderBar;
