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
        <h1 className="mb-16 text-center text-5xl font-extrabold tracking-widest text-primary">
          Welcome to the SHL Index
        </h1>
        <h2 className="mb-5 text-center font-mont text-4xl font-semibold tracking-widest text-secondary md:mb-0">
          Select a League
        </h2>
        <div className="flex w-full flex-wrap items-center justify-evenly">
          {leagueLinks.map(({ href, Logo }) => (
            <Link
              key={href}
              href={href}
              className="relative mx-6 my-10 inline-block aspect-square min-h-[200px] w-1/5 min-w-[200px] rounded-full bg-primary shadow-md !transition-all !duration-200 !ease-out hover:scale-105 hover:shadow-lg lg:my-20"
            >
              <Logo className="absolute left-[10%] top-[10%] size-4/5 object-contain" />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};
