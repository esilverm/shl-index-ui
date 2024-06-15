import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { Squash as Hamburger } from 'hamburger-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor-v2';

import { useSeason } from '../hooks/useSeason';
import Back from '../public/back.svg';
import { League, leagueNameToId } from '../utils/leagueHelpers';
import { query } from '../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../utils/routingHelpers';

import { Link } from './common/Link';
import { Select } from './common/Select';
import { LeagueLogo } from './LeagueLogo';
import { ScoreBar } from './scoreBar/ScoreBar';

const menuLinks = [
  'team',
  'standings',
  'leaders',
  'schedule',
  'players',
] as const;
type MenuLinks = (typeof menuLinks)[number] | 'game';

export const Header = ({
  league,
  activePage,
  daysToShow,
  shouldStickToTop,
  shouldShowScoreBar = true,
}: {
  league: League;
  activePage?: MenuLinks;
  daysToShow?: number;
  shouldShowScoreBar?: boolean;
  shouldStickToTop?: boolean;
}) => {
  const [scheduleVisible, setScheduleVisible] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const LINK_CLASSES =
    '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-secondaryText dark:!text-secondaryTextDark hover:bg-borderblue dark:hover:bg-borderblueDark sm:h-full sm:w-max';
  const { season, seasonsList, setSeason, seasonLoading } = useSeason();
  const { teamid } = router.query;

  const { data: scheduleData, isLoading: scheduleIsLoading } = useQuery({
    queryKey: ['header', league, teamid, daysToShow],
    queryFn: () =>
      query(
        `api/v1/schedule/header?league=${leagueNameToId(league)}${
          teamid ? `&team=${parseInt(teamid as string)}` : ``
        }${daysToShow ? `&days=${daysToShow}` : ``}`,
      ),
  });

  const { toggleColorMode } = useColorMode();
  const isDarkMode = useColorModeValue(false, true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;

    toggleColorMode();
    if (isClient) {
      localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
    }
  };

  return (
    <div
      className={classnames(
        (!scheduleVisible || !shouldShowScoreBar) &&
          shouldStickToTop &&
          '[&+div]:pt-16',
      )}
    >
      {shouldShowScoreBar && (
        <VisibilitySensor
          partialVisibility
          onChange={(e: boolean) => setScheduleVisible(e)}
          offset={{ top: 8 }}
        >
          <div className={'h-24 w-full bg-grey100 dark:bg-grey100Dark'}>
            <ScoreBar
              data={scheduleData}
              loading={scheduleIsLoading}
              league={league}
            />
          </div>
        </VisibilitySensor>
      )}
      <div
        className={classnames(
          (!scheduleVisible || !shouldShowScoreBar) &&
            shouldStickToTop &&
            'fixed top-0',
          'z-50 h-16 w-full bg-grey900 dark:bg-grey900Dark',
        )}
        role="navigation"
        aria-label="Main"
      >
        <div className="relative mx-auto flex h-full w-full items-center justify-between px-[5%] sm:w-11/12 sm:justify-start sm:p-0 lg:w-3/4">
          <Link href="/" className="hidden h-2/5 w-max sm:inline-block">
            <Back className="top-[5%] mx-2 h-[90%] text-grey100 dark:text-grey100TextDark" />
          </Link>
          <Link
            href={{
              pathname: '/[league]',
              query: onlyIncludeSeasonAndTypeInQuery(router.query),
            }}
            className={classnames(
              !scheduleVisible || !shouldShowScoreBar
                ? 'sm:h-full'
                : 'sm:h-[150%]',
              'order-2 m-0 h-full w-max transition-all sm:mx-2 sm:inline-block',
            )}
          >
            <LeagueLogo
              league={league}
              className={classnames(
                !scheduleVisible || !shouldShowScoreBar
                  ? 'sm:top-[2.5%]'
                  : 'sm:top-[5%]',
                'relative top-[5%] h-[90%]',
              )}
            />
          </Link>
          <div
            className={classnames(
              !drawerVisible && 'hidden',
              'absolute top-16 left-0 z-50 order-1 h-auto w-full flex-col bg-LabelHeadings dark:bg-LabelHeadingsDark sm:relative sm:top-0 sm:order-3 sm:flex sm:h-full sm:w-auto sm:flex-row sm:bg-[transparent]',
            )}
          >
            <Link
              href="/"
              _hover={{ textDecoration: 'none' }}
              className="!hover:no-underline flex h-12 w-full items-center justify-center text-sm font-bold capitalize !text-grey100 hover:bg-hyperlink dark:!text-grey100TextDark sm:hidden"
            >
              Home
            </Link>
            {menuLinks.map((linkName) => (
              <Link
                href={{
                  pathname: `/[league]/${linkName}`,
                  query: onlyIncludeSeasonAndTypeInQuery(router.query),
                }}
                className={classnames(
                  activePage === linkName &&
                    'border-l-4 border-l-grey100 pr-4 dark:border-l-offWhite sm:border-l-0 sm:border-b-4 sm:border-b-grey100 sm:pr-[10px] sm:pt-1 dark:sm:border-b-offWhite',
                  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-hyperlink dark:!text-grey100TextDark dark:hover:bg-hyperlinkDark sm:h-full sm:w-max',
                )}
                _hover={{ textDecoration: 'none' }}
                key={linkName}
              >
                {linkName}
              </Link>
            ))}
            {drawerVisible ? (
              <>
                <Link
                  href="https://www.simulationhockey.com"
                  _hover={{ textDecoration: 'none' }}
                  className={LINK_CLASSES}
                >
                  Forums
                </Link>

                <Link
                  href="https://portal.simulationhockey.com"
                  _hover={{ textDecoration: 'none' }}
                  className={LINK_CLASSES}
                >
                  Portal
                </Link>

                <Link
                  href="https://cards.simulationhockey.com"
                  _hover={{ textDecoration: 'none' }}
                  className={LINK_CLASSES}
                >
                  Cards
                </Link>
              </>
            ) : (
              <Menu>
                <MenuButton className={LINK_CLASSES}>More</MenuButton>
                <MenuList>
                  <MenuItem as="a" href="https://www.simulationhockey.com">
                    Forums
                  </MenuItem>
                  <MenuItem as="a" href="https://portal.simulationhockey.com">
                    Index
                  </MenuItem>
                  <MenuItem as="a" href="https://cards.simulationhockey.com">
                    Cards
                  </MenuItem>
                </MenuList>
              </Menu>
            )}
          </div>
          <div className="inline-block sm:hidden">
            <Hamburger
              toggled={drawerVisible}
              toggle={() =>
                setDrawerVisible((currentVisibility) => !currentVisibility)
              }
              color="#F8F9FA"
              size={24}
            />
          </div>
          <div className="relative order-3 mr-4 flex items-center sm:mr-[2%] sm:ml-auto sm:w-auto">
            <IconButton
              aria-label="Toggle Dark Mode"
              icon={
                isClient && localStorage.getItem('theme') === 'dark' ? (
                  <SunIcon />
                ) : (
                  <MoonIcon />
                )
              }
              onClick={handleToggleDarkMode}
              variant="ghost"
              color="white"
              ml={2}
            />
            {activePage !== 'game' &&
              router.pathname.indexOf('/player/') === -1 &&
              !seasonLoading && (
                <Select<(typeof seasonsList)[0]>
                  options={seasonsList.sort((a: number, b: number) => b - a)}
                  selectedOption={season ?? 0}
                  onSelection={setSeason}
                  optionClassName="before:content-['S'] sm:before:content-['Season'] sm:before:mr-1"
                  dark
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
