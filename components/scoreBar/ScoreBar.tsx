import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/react';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

import { League } from '../../utils/leagueHelpers';
import { onlyIncludeSeasonAndTypeInQuery } from '../../utils/routingHelpers';
import { Link } from '../common/Link';
import { TeamLogo } from '../TeamLogo';

const RightArrow = () => {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <div
      className={classnames(
        isLastItemVisible && 'cursor-default',
        'relative z-10 flex h-full w-[45px] cursor-pointer items-center justify-center shadow-[-2px_0_3px_rgba(0,0,0,0.3)]',
      )}
      onClick={() => scrollNext()}
    >
      <ChevronRightIcon
        boxSize={30}
        className={classnames(
          'transition-colors',
          isLastItemVisible
            ? '[&_path]:!fill-grey900/10 dark:[&_path]:!fill-LabelHeadingsDark/10'
            : '[&_path]:!fill-grey900 dark:[&_path]:!fill-LabelHeadingsDark',
        )}
      />
    </div>
  );
};

const LeftArrow = () => {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <div
      className={classnames(
        isFirstItemVisible && 'cursor-default',
        'relative z-10 flex h-full w-[45px] cursor-pointer items-center justify-center shadow-[2px_0_3px_rgba(0,0,0,0.3)]',
      )}
      onClick={() => scrollPrev()}
    >
      <ChevronLeftIcon
        boxSize={30}
        className={classnames(
          'transition-colors',
          isFirstItemVisible
            ? '[&_path]:!fill-grey900/10 dark:[&_path]:!fill-LabelHeadingsDark/10'
            : '[&_path]:!fill-grey900 dark:[&_path]:!fill-LabelHeadingsDark',
        )}
      />
    </div>
  );
};

const DateItem = ({ gameid }: { gameid: string }) => {
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
    <div
      role="presentation"
      aria-label="Score Bar Date"
      className="relative flex h-full w-[46px] items-center justify-center border-r border-r-grey500 bg-grey200 dark:border-r-globalBorderGrey dark:bg-globalBackgroundGrey"
    >
      <span
        aria-label="Date"
        className="relative top-[3px] text-center text-base font-bold text-grey900 dark:text-white"
      >
        {months[parseInt(gameid.split('-')[1]) - 1]}
        <br />
        {gameid.split('-')[2]}
      </span>
    </div>
  );
};

const ScoreBarItem = ({
  data,
  gameid,
  league,
}: {
  data: {
    season: string;
    homeTeam: string;
    homeScore: number;
    awayTeam: string;
    awayScore: number;
    overtime: number;
    shootout: number;
    played: number;
  };
  gameid: string;
  league: League;
}) => {
  const { query } = useRouter();
  return (
    <Link
      href={{
        pathname: `/[league]/${data.season}/game/[gameid]`,
        query: {
          ...onlyIncludeSeasonAndTypeInQuery(query),
          gameid,
        },
      }}
      className={classnames(
        'relative inline-block h-full w-full transition-all',
        'hover:after:absolute hover:after:top-0 hover:after:left-0 hover:after:flex hover:after:h-full hover:after:w-full hover:after:items-center hover:after:justify-center hover:after:bg-grey900/80 hover:after:text-grey100 hover:after:opacity-80 dark:after:bg-LabelHeadingsDark dark:hover:after:text-white',
        data.played
          ? "hover:after:content-['See_Game_Results']"
          : "hover:after:content-['See_Game_Preview']",
      )}
      _hover={{
        textDecoration: 'none',
      }}
    >
      <div
        className={classnames(
          'relative h-full w-[189px] border-r border-r-grey500 bg-grey100 pt-[23px] dark:border-r-globalBorderGrey dark:bg-backgroundGrey100',
        )}
      >
        {/* Home Team */}
        <div
          className={classnames(
            'my-[5px] mx-auto grid w-4/5 grid-cols-[12%_65px_1fr]',
            data.homeScore > data.awayScore || !data.played
              ? 'text-grey900 dark:text-white'
              : 'text-grey600 dark:text-white',
          )}
        >
          <TeamLogo
            league={league}
            teamAbbreviation={data.homeTeam}
            className="w-full"
          />
          <span className="ml-2.5 inline-block text-sm font-bold">
            {data.homeTeam}
          </span>
          {data.played === 1 && (
            <span className="inline-block font-mont text-sm font-bold">
              {data.homeScore}
            </span>
          )}
        </div>
        {/* Away Team */}
        <div
          className={classnames(
            'my-[5px] mx-auto grid w-4/5 grid-cols-[12%_65px_1fr]',
            data.awayScore > data.homeScore || !data.played
              ? 'text-grey900 dark:text-white'
              : 'text-grey600 dark:text-white',
          )}
        >
          <TeamLogo
            league={league}
            teamAbbreviation={data.awayTeam}
            className="w-full"
          />
          <span className="ml-2.5 inline-block text-sm font-bold">
            {data.awayTeam}
          </span>
          {data.played === 1 && (
            <span className="inline-block font-mont text-sm font-bold">
              {data.awayScore}
            </span>
          )}
        </div>
        <span
          className={classnames(
            'absolute top-[43px] inline-block w-[60px] whitespace-nowrap text-center text-xs',
            data.played ? 'left-[121px]' : 'left-[95px]',
          )}
        >
          {data.played === 1 ? 'FINAL' : 'SCHEDULED'}
          {data.shootout ? '/SO' : data.overtime ? '/OT' : ''}
        </span>
      </div>
    </Link>
  );
};

export const ScoreBar = ({
  data,
  loading,
  league,
}: {
  data: Array<{
    date: string;
    played: number;
    games: Array<{
      slug: string;
      date: string;
      homeTeam: string;
      homeScore: number;
      awayTeam: string;
      awayScore: number;
      overtime: number;
      shootout: number;
      played: number;
    }>;
  }>;
  loading: boolean;
  league: League;
}) => (
  <div className="h-24 w-full bg-grey100 dark:bg-backgroundGrey100 [&_.react-horizontal-scrolling-menu--inner-wrapper]:h-full">
    {loading ? (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size="xl" />
      </div>
    ) : (
      <ScrollMenu
        RightArrow={RightArrow}
        LeftArrow={LeftArrow}
        scrollContainerClassName="!h-full overflow-x-hidden"
        wrapperClassName="h-full"
      >
        {data.flatMap(({ date, games }) =>
          [<DateItem key={date} gameid={date} />].concat(
            games.map(({ slug, ...game }) => (
              <ScoreBarItem
                key={slug}
                data={{
                  season: slug.substr(0, 2),
                  ...game,
                }}
                gameid={slug}
                league={league}
              />
            )),
          ),
        )}
      </ScrollMenu>
    )}
  </div>
);
