'use client';

import { LuMoon, LuSun } from '@paalstack/react-icons/lu';
import { Box, IconButton, useNextTheme } from '@paalstack/react-ui';
import { useSyncExternalStore } from 'react';

const ThemeToggle = () => {
  const { isDark, setTheme } = useNextTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <IconButton
        aria-label="Toggle theme"
        variant="ghost"
        fontSize="sm"
        icon={<LuMoon className="size-4" />}
      />
    );
  }

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      fontSize="sm"
      icon={isDark ? <LuSun className="size-4" /> : <LuMoon className="size-4" />}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    />
  );
};

const SiteHeader = () => {
  return (
    <Box
      as="header"
      className="border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm"
    >
      <Box className="container flex h-14 items-center justify-end">
        <ThemeToggle />
      </Box>
    </Box>
  );
};

export { SiteHeader };
