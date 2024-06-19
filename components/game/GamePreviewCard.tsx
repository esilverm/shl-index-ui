import { SkeletonCircle } from '@chakra-ui/react';

import { League } from '../../utils/leagueHelpers';
import { TeamLogo } from '../TeamLogo';

export const GamePreviewCard = ({
  title,
  league,
  awayAbbr,
  homeAbbr,
  children,
}: {
  title: string;
  league: League;
  awayAbbr: string | undefined;
  homeAbbr: string | undefined;
  children?: React.ReactNode;
}) => (
  <div className="flex flex-col bg-grey100 dark:bg-backgroundGrey100">
    <div className="mx-4 flex items-center justify-between border-b-2 border-b-grey300 py-4 font-semibold dark:border-b-globalBorderGrey">
      <SkeletonCircle isLoaded={!!awayAbbr}>
        <TeamLogo
          league={league}
          teamAbbreviation={awayAbbr}
          className="h-[25px] w-[25px]"
        />
      </SkeletonCircle>
      <span>{title}</span>
      <SkeletonCircle isLoaded={!!awayAbbr}>
        <TeamLogo
          league={league}
          teamAbbreviation={homeAbbr}
          className="h-[25px] w-[25px]"
        />
      </SkeletonCircle>
    </div>
    {children}
  </div>
);
