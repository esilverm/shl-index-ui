import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import VisibilitySensor from 'react-visibility-sensor';
import { HamburgerCollapse } from 'react-animated-burgers';
import { ImSearch } from 'react-icons/im';
import ScoreBar from './ScoreBar';

function HeaderBar({ league, showScoreBar = true, activePage = '' }) {
  const [scheduleVisible, setScheduleVisible] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

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
          <Link href="/[league]" as={`/${league}`} passHref>
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
          <MenuDrawer active={drawerVisible}>
            <Link href="/[league]/scores" as={`/${league}/scores`} passHref>
              <MenuItem
                active={activePage === 'scores'}
                role="link"
                tabIndex={0}
              >
                Scores
              </MenuItem>
            </Link>
            <Link href="/[league]/team" as={`/${league}/team`} passHref>
              <MenuItem
                active={activePage === 'teams'}
                role="link"
                tabIndex={0}
              >
                Teams
              </MenuItem>
            </Link>
            <Link
              href="/[league]/standings"
              as={`/${league}/standings`}
              passHref
            >
              <MenuItem
                active={activePage === 'standings'}
                role="link"
                tabIndex={0}
              >
                Standings
              </MenuItem>
            </Link>
            <Link href="/[league]/playoffs" as={`/${league}/playoffs`} passHref>
              <MenuItem
                active={activePage === 'playoffs'}
                role="link"
                tabIndex={0}
              >
                Playoffs
              </MenuItem>
            </Link>
            <Link href="/[league]/stats" as={`/${league}/stats`} passHref>
              <MenuItem
                active={activePage === 'stats'}
                role="link"
                tabIndex={0}
              >
                Stats
              </MenuItem>
            </Link>
            <Link href="/[league]/schedule" as={`/${league}/schedule`} passHref>
              <MenuItem
                active={activePage === 'schedule'}
                role="link"
                tabIndex={0}
              >
                Schedule
              </MenuItem>
            </Link>
            <Link href="/[league]/player " as={`/${league}/player`} passHref>
              <MenuItem
                active={activePage === 'players'}
                role="link"
                tabIndex={0}
              >
                Players
              </MenuItem>
            </Link>
          </MenuDrawer>
          <HamburgerIcon
            isActive={drawerVisible}
            toggleButton={() => setDrawerVisible(() => !drawerVisible)}
            barColor="#F8F9FA"
            buttonWidth={24}
          />
          <SearchIcon size={24} />
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
  display: flex;
  flex-direction: row;
  align-items: center;

  @media screen and (max-width: 768px) {
    width: 90%;
  }

  @media screen and (max-width: 670px) {
    width: 100%;
    padding: 0 5%;
    position: relative;
    justify-content: space-between;
  }
`;

const Logo = styled.div`
  transition: all 200ms;
  height: ${({ scheduleNotVisible }) => (scheduleNotVisible ? `100%` : `150%`)};
  width: max-content;
  margin: 0 1% 0 2%;

  & img {
    position: relative;
    top: ${({ scheduleNotVisible }) => (scheduleNotVisible ? `2.5%` : `5%`)};
    object-fit: contain;
    border-radius: 5px;
    transition: all 200ms ease-out;
    cursor: pointer;
  }

  @media screen and (max-width: 670px) {
    order: 2;
    height: 100%;
    margin: 0;

    & img {
      top: 2.5%;
      margin: 0;
    }
  }
`;

const MenuDrawer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: auto;

  @media screen and (max-width: 670px) {
    order: 0;
    flex-direction: column;
    position: absolute;
    background-color: ${({ theme }) => theme.colors.grey800};
    width: 100%;
    height: auto;
    top: 64px;
    left: 0;
    ${({ active }) => (active ? '' : 'display: none;')}
  }
`;

const MenuItem = styled.div`
  color: ${({ theme }) => theme.colors.grey100};
  font-size: 14px;
  font-weight: 700;
  height: 100%;
  width: max-content;
  padding: 0 10px;
  ${({ active, theme }) =>
    active
      ? `
  border-bottom: 5px solid ${theme.colors.grey100};
  padding-top: 5px;`
      : ``}
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #0183da;
  }

  @media screen and (max-width: 670px) {
    width: 100%;
    height: 50px;

    // Change look of active tab within menu on mobile devices
    ${({ active, theme }) =>
      active
        ? `
    border-bottom: none; 
    border-left: 5px solid ${theme.colors.grey100};
    padding-top: 0;
    padding-right: 15px;`
        : ``}
  }
`;

const HamburgerIcon = styled(HamburgerCollapse)`
  @media screen and (min-width: 671px) {
    display: none !important;
  }
`;

const SearchIcon = styled(ImSearch)`
  order: 3;
  color: ${({ theme }) => theme.colors.grey100};
  cursor: pointer;
  margin: 9px;

  @media screen and (min-width: 671px) {
    display: none;
  }
`;

HeaderBar.propTypes = {
  league: PropTypes.string.isRequired,
  showScoreBar: PropTypes.bool,
  activePage: PropTypes.string,
};

HeaderBar.defaultProps = {
  showScoreBar: true,
  activePage: '',
};

export default HeaderBar;
