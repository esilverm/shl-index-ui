import { Link } from '@chakra-ui/react';
import React from 'react';

export const Footer = () => (
  <footer className="flex h-16 w-full items-center justify-center bg-grey900 text-grey100 dark:text-grey100TextDark">
    <div className="font-mont text-xs">
      &copy; {new Date().getFullYear()} |{' '}
      <span className="hidden sm:inline">
        Made with ♥︎ by the SHL Dev Team |{' '}
      </span>
      <Link href="https://simulationhockey.com/index.php" isExternal>
        Visit Forum
      </Link>{' '}
      |{' '}
      <Link
        href="https://simulationhockey.com/newreply.php?tid=122906"
        isExternal
      >
        Report a Bug
      </Link>{' '}
      | <Link href="/api">API Docs</Link>
    </div>
  </footer>
);
