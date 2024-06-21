import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const ColorModeSwitcher = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <IconButton
      aria-label="Toggle theme"
      className={className}
      icon={theme === 'light' ? <SunIcon /> : <MoonIcon />}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      size="sm"
      variant="ghost"
    />
  );
};
