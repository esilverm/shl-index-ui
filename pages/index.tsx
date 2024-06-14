import { NextSeo } from 'next-seo';
import React from 'react';

import { Link } from '../components/common/Link';
import IIHFLogo from '../public/league_logos/IIHF.svg';
import SHLLogo from '../public/league_logos/SHL.svg';
import SMJHLLogo from '../public/league_logos/SMJHL.svg';
import WJCLogo from '../public/league_logos/WJC.svg';

export default () => {
  const leagueLinks = React.useMemo(
    () => [
      {
        href: '/shl',
        Logo: SHLLogo,
      },
      {
        href: '/smjhl',
        Logo: SMJHLLogo,
      },
      {
        href: '/iihf',
        Logo: IIHFLogo,
      },
      {
        href: '/wjc',
        Logo: WJCLogo,
      },
    ],
    [],
  );

  return (
    <>
      <NextSeo
        title="Home"
        openGraph={{
          title: 'Home',
        }}
      />
      <div className="mx-auto mt-24 w-11/12 sm:w-4/5">
        <h1 className="mb-16 text-center text-5xl font-extrabold tracking-widest text-LabelHeadings dark:text-LabelHeadingsDark">
          Welcome to the SHL Index
        </h1>
        <h2 className="mb-5 text-center font-mont text-4xl font-semibold tracking-widest text-grey700 dark:text-grey700Dark md:mb-0">
          Select a League
        </h2>
        <div className="flex w-full flex-wrap items-center justify-evenly">
          {leagueLinks.map(({ href, Logo }) => (
            <Link
              key={href}
              href={href}
              className="relative my-10 mx-6 inline-block aspect-square min-h-[200px] w-1/5 min-w-[200px] rounded-full bg-grey100 shadow-md !transition-all !duration-200 !ease-out hover:scale-105 hover:shadow-lg dark:bg-grey100Dark lg:my-20"
            >
              <Logo className="absolute top-[10%] left-[10%] h-4/5 w-4/5 object-contain" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
