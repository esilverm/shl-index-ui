import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { Squash as Hamburger } from 'hamburger-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor-v2';

import { useSeason } from '../hooks/useSeason';
import Back from '../public/back.svg';
import { isSTHS, League, leagueNameToId } from '../utils/leagueHelpers';
import { query } from '../utils/query';
import { onlyIncludeSeasonAndTypeInQuery } from '../utils/routingHelpers';

import { ColorModeSwitcher } from './ColorModeSwitcher';
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

const externalLinks = [
  {
    name: 'Forums',
    href: 'https://simulationhockey.com/index.php',
  },
  {
    name: 'Portal',
    href: 'https://portal.simulationhockey.com/',
  },
  {
    name: 'Cards',
    href: 'https://cards.simulationhockey.com/',
  },
];

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
  const router = useRouter();
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
  if(isSTHS(season)){
    shouldShowScoreBar = false;
  }

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
          <div className="h-24 w-full bg-primary">
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
          'z-50 h-16 w-full bg-site-header',
        )}
        role="navigation"
        aria-label="Main"
      >
        <div className="relative mx-auto flex size-full items-center justify-between px-[5%] sm:w-11/12 sm:justify-start sm:p-0 lg:w-3/4">
          <Link href="/" className="hidden h-2/5 w-max sm:inline-block">
            <Back className="top-[5%] mx-2 h-[90%] text-grey100" />
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
              'absolute left-0 top-16 z-50 order-1 h-auto w-full flex-col bg-grey800 sm:relative sm:top-0 sm:order-3 sm:flex sm:h-full sm:w-auto sm:flex-row sm:bg-[transparent]',
            )}
          >
            <Link
              href="/"
              _hover={{ textDecoration: 'none' }}
              className="!hover:no-underline flex h-12 w-full items-center justify-center text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:hidden"
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
                    'border-l-4 border-l-grey100 pr-4 sm:border-b-4 sm:border-l-0 sm:border-b-grey100 sm:pr-[10px] sm:pt-1',
                  '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max',
                )}
                _hover={{ textDecoration: 'none' }}
                key={linkName}
              >
                {linkName}
              </Link>
            ))}
            <div
              className={classnames(!drawerVisible && 'hidden', 'sm:hidden')}
            >
              {externalLinks.map(({ name, href }) => (
                <Link
                  className={classnames(
                    '!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600',
                  )}
                  key={name}
                  href={href}
                  _hover={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  {name}
                </Link>
              ))}
            </div>
            <div className="max-md:hidden">
              <Menu>
                <MenuButton className="!hover:no-underline flex h-12 w-full items-center justify-center px-[10px] text-sm font-bold capitalize !text-grey100 hover:bg-blue600 sm:h-full sm:w-max">
                  More
                </MenuButton>
                <MenuList>
                  {externalLinks.map(({ name, href }) => (
                    <MenuItem
                      className="hover:!bg-highlighted/40 hover:!text-primary"
                      key={name}
                      as="a"
                      href={href}
                      target="_blank"
                    >
                      {name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
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
          <div className="relative order-3 mr-4 sm:ml-auto sm:mr-[2%] sm:w-auto">
            <ColorModeSwitcher className="mr-1 !text-grey100 hover:!text-grey900 md:mr-2" />
            {activePage !== 'game' &&
              router.pathname.indexOf('/player/') === -1 &&
              !seasonLoading && (
                <Select<(typeof seasonsList)[0]>
                  options={seasonsList.sort((a: number, b: number) => b - a)}
                  selectedOption={season ?? 0}
                  onSelection={setSeason}
                  optionClassName="before:content-['S'] md:before:content-['Season'] md:before:mr-1"
                  dark
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
