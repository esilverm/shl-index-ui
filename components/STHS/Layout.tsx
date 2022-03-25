import React, { useState } from 'react';
import styled from 'styled-components';

import Link from '../LinkWithSeason';

interface Props {
  league: string;
  activePage?: string;
  children: React.ReactNode;
}

function STHSLayout({ league, activePage, children }: Props): JSX.Element {
  const [activeMenu, setActiveMenu] = useState<string>(activePage || 'Main');

  return (
    <BodyContainer>
      <TabMenu id="top">
        <ul>
          <Link href={'/[league]/sths'} as={`/${league}/sths`} passHref>
            <li className={'home'}>{league.toUpperCase()} Home</li>
          </Link>
          <li
            onClick={() => setActiveMenu('Main')}
            onKeyDown={() => setActiveMenu('Main')}
            tabIndex={0}
            role="tab"
            aria-selected={activeMenu === 'Main'}
          >
            Main
          </li>
          <li
            onClick={() => setActiveMenu('Pro League')}
            onKeyDown={() => setActiveMenu('Pro League')}
            tabIndex={0}
            role="tab"
            aria-selected={activeMenu === 'Pro League'}
          >
            Pro League
          </li>
          <li
            onClick={() => setActiveMenu('Pro Team')}
            onKeyDown={() => setActiveMenu('Pro Team')}
            tabIndex={0}
            role="tab"
            aria-selected={activeMenu === 'Pro Team'}
          >
            Pro Team
          </li>
          <li
            onClick={() => setActiveMenu('League')}
            onKeyDown={() => setActiveMenu('League')}
            tabIndex={0}
            role="tab"
            aria-selected={activeMenu === 'League'}
          >
            League
          </li>
          <li
            onClick={() => setActiveMenu('Records')}
            onKeyDown={() => setActiveMenu('Records')}
            tabIndex={0}
            role="tab"
            aria-selected={activeMenu === 'Records'}
          >
            Records
          </li>
        </ul>
        <div>
          {activeMenu === 'Main' && (
            <TabMenu>
              <ul>
                <li>STHS Client League File</li>
                <li>Latest STHS Client</li>
                <li>Schedule</li>
              </ul>
            </TabMenu>
          )}
          {activeMenu === 'Pro League' && (
            <TabMenu>
              <ul>
                <Link
                  href={'/[league]/sths/standing'}
                  as={`/${league}/sths/standing`}
                  passHref
                >
                  <li>Standing</li>
                </Link>
                <Link
                  href={'/[league]/sths/leaders'}
                  as={`/${league}/sths/leaders`}
                  passHref
                >
                  <li>Leader</li>
                </Link>
                <Link
                  href={'/[league]/sths/individualLeaders'}
                  as={`/${league}/sths/individualLeaders`}
                  passHref
                >
                  <li>Individual Leaders</li>
                </Link>
                <li>Power Ranking</li>
              </ul>
            </TabMenu>
          )}
          {activeMenu === 'Pro Team' && (
            <TabMenu>
              <ul>
                <Link
                  href={'/[league]/sths/roster'}
                  as={`/${league}/sths/roster`}
                  passHref
                >
                  <li>Roster</li>
                </Link>
                <li>Scoring</li>
                <li>Lines</li>
                <li>Schedule</li>
                <li>Stats</li>
                <li>StatsVS</li>
              </ul>
            </TabMenu>
          )}
        </div>
      </TabMenu>
      <MainContainer>{children}</MainContainer>

      <Footer>
        &copy; {new Date().getFullYear()} -{' '}
        <span>Made with ♥︎ by the SHL Dev Team - </span>
        <a
          href="https://simulationhockey.com/index.php"
          rel="noreferrer"
          target="_blank"
        >
          Visit Forum
        </a>{' '}
        -{' '}
        <a
          href="https://simulationhockey.com/newreply.php?tid=122906"
          rel="noreferrer"
          target="_blank"
        >
          Report a Bug
        </a>{' '}
        - <a href="/api">API Docs</a>
      </Footer>
      <ScrollUp href="#top" />
    </BodyContainer>
  );
}

const BodyContainer = styled.div`
  width: 100%;
  height: auto;
  background-image: url(/bg.jpeg);
  background-repeat: repeat-x;
  background-color: white;
  font: 14px/17px 'Trebuchet MS', Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
`;

const TabMenu = styled.div`
  width: 100%;
  display: block;
  padding-top: 1em;

  & > ul {
    padding-left: 1px;

    & > li {
      text-decoration: underline;
      padding: 3px 10px;
      margin: 0 0.25em;
      display: inline-block;
      border-radius: 3px 3px 0px 0px;
      font-size: 16px;
      font-weight: 600;
      color: #4c4c4c;
      transition: all linear 0.15s;
      cursor: pointer;

      &:hover,
      &.home {
        color: black;
      }
    }
  }

  @media screen and (max-width: 820px) {
    & > ul > li {
      padding: 0px 1px;
      font-size: 12px;
    }
  }

  @media screen and (max-width: 920px) {
    & > ul > li {
      padding: 1px 2px;
      font-size: 14px;
    }
  }

  @media screen and (max-width: 1160px) & li {
    & > ul > li {
      padding: 2px 5px;
      font-size: 15px;
    }
  }
`;

const MainContainer = styled.main`
  padding: 10px 0;
  padding-top: 25px;
  width: 100%;
`;

const Footer = styled.div`
  background-image: url(/footerbg.gif);
  height: 40px;
  width: 100%;
  text-align: center;
  line-height: 40px;
  color: black;
  font-weight: bold;
  margin-top: 3rem;

  & a {
    color: #274f70;
  }
`;

const ScrollUp = styled.a`
  display: block;
  width: 40px;
  height: 40px;
  opacity: 0.3;
  position: fixed;
  bottom: 50px;
  right: 25px;
  background: url(/icon_top.png) no-repeat;
`;

export default STHSLayout;
