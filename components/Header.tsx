import React, { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useSWR from 'swr';
import VisibilitySensor from 'react-visibility-sensor';
import { HamburgerCollapse } from 'react-animated-burgers';
import ScoreBar from './ScoreBar';
import SeasonSelector from './SeasonSelector';

interface Props {
  league: string;
  showScoreBar?: boolean;
  activePage?: string;
  team?: number;
  days?: number;
}

const defaultProps = {
  showScoreBar: true,
  activePage: '',
};

function HeaderBar({
  league,
  showScoreBar = true,
  activePage = '',
  team = null,
  days = null,
}: Props & typeof defaultProps): JSX.Element {
  const [scheduleVisible, setScheduleVisible] = useState<boolean>(true);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const { data: scheduleData, error: scheduleError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/schedule/header?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}${typeof team === 'number' ? `&team=${team}` : ``}${
      days ? `&days=${days}` : ``
    }`
  );
  const { data: seasonsData, error: seasonsError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/leagues/seasons?league=${[
      'shl',
      'smjhl',
      'iihf',
      'wjc',
    ].indexOf(league)}${typeof team === 'number' ? `&team=${team}` : ``}${
      days ? `&days=${days}` : ``
    }`
  );

  const getSeasonsList = () => seasonsData ? seasonsData.map(leagueEntry => leagueEntry.season) : [];

  return (
    <HeaderWrapper sticky={!scheduleVisible || !showScoreBar}>
      {showScoreBar && (
        <VisibilitySensor
          partialVisibility
          onChange={(e) => setScheduleVisible(e)}
          offset={{ top: 8 }}
        >
          <ScoreBar data={scheduleData} loading={!scheduleData && !scheduleError} league={league} />
        </VisibilitySensor>
      )}
      <HeaderNav
        sticky={!scheduleVisible || !showScoreBar}
        role="navigation"
        aria-label="Main"
      >
        <Container>
        <Link href="/" as={`/`} passHref>
            <Back
              role="link"
              tabIndex={0}
              dangerouslySetInnerHTML={{
                __html: require(`../public/back.svg?include`),
              }}
            />
          </Link>
          <Link href="/[league]" as={`/${league}`} passHref>
            <Logo
              scheduleNotVisible={!scheduleVisible || !showScoreBar}
              role="link"
              tabIndex={0}
              dangerouslySetInnerHTML={{
                __html: require(`../public/league_logos/${league.toUpperCase()}.svg?include`),
              }}
            />
          </Link>
          <MenuDrawer active={drawerVisible}>
            <Link href="/" as={`/`} passHref>
              <MenuItem
                active={activePage === 'home'}
                role="link"
                tabIndex={0}
              >
                Home
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
                Leaders
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
          <SelectorWrapper>
            <SeasonSelector seasons={getSeasonsList()} loading={!seasonsData && !seasonsError} />
          </SelectorWrapper>
        </Container>
      </HeaderNav>
    </HeaderWrapper>
  );
}

HeaderBar.defaultProps = defaultProps;

const HeaderWrapper = styled.header<{ sticky: boolean }>`
  ${({ sticky }) =>
    sticky
      ? `
  & + div {
    padding-top: 64px;
  }`
      : ''}
`;

const HeaderNav = styled.div<{ sticky: boolean }>`
  ${({ sticky }) =>
    sticky
      ? ` 
  position: fixed;
  top: 0;
  `
      : ''}

  width: 100%;
  height: 64px;
  background-color: ${({ theme }) => theme.colors.grey900};
  z-index: 999;
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

const Logo = styled.div<{ scheduleNotVisible: boolean }>`
  transition: all 200ms;
  height: ${({ scheduleNotVisible }) => (scheduleNotVisible ? `100%` : `150%`)};
  width: max-content;
  margin: 0 1% 0 2%;

  & svg {
    position: relative;
    height: 90%;
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

    & svg {
      top: 5%;
      margin: 0;
    }
  }
`;

const Back = styled.div<{ scheduleNotVisible: boolean }>`
  transition: all 200ms;
  height: 40%;
  width: max-content;
  margin: 0 0.2% 0 0.2%;

  & svg {
    position: relative;
    height: 90%;
    top: 5%;
    object-fit: contain;
    border-radius: 5px;
    transition: all 200ms ease-out;
    cursor: pointer;
  }

  @media screen and (max-width: 670px) {
    display: none;
    }
  }
`;

const MenuDrawer = styled.div<{ active: boolean }>`
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
    z-index: 999;
  }
`;

const MenuItem = styled.div<{ active: boolean }>`
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
    background-color: ${({ theme }) => theme.colors.blue600};
  }

  @media screen and (max-width: 670px) {
    width: 100%;
    height: 50px;

    // Change look of active tab within menu on mobile device
    ${({ active, theme }) =>
      active
        ? `
    border-bottom: none; 
    border-left: 5px solid ${theme.colors.grey100};
    padding-top: 0;
    padding-right: 15px;
    `
        : ``}
  }
`;

const HamburgerIcon = styled(HamburgerCollapse)`
  @media screen and (min-width: 671px) {
    display: none !important;
  }
`;

const SelectorWrapper = styled.div`
  @media screen and (min-width: 671px) {
    margin: 0 2% 0 auto;
  }

  @media screen and (max-width: 670px) {
    order: 3;
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
