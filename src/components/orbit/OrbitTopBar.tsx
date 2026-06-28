'use client';

import { LuLogOut, LuMoon, LuSun } from '@paalstack/react-icons/lu';
import {
  Box,
  Button,
  HStack,
  IconButton,
  TypographyMuted,
  TypographySmall,
  useNextTheme,
} from '@paalstack/react-ui';
import { useRouter } from 'next/navigation';

import { useMounted } from '@/hooks/useMounted';
import { createClient } from '@/libs/supabase/browser';

import type { User } from '@supabase/supabase-js';

type OrbitTopBarProps = {
  user: User | null;
};

export const OrbitTopBar = ({ user }: OrbitTopBarProps) => {
  const router = useRouter();
  const { isDark, setTheme } = useNextTheme();
  const mounted = useMounted();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  return (
    <Box
      as="header"
      className="border-border bg-card flex h-16 items-center justify-between border-b px-6"
    >
      <Box />
      <HStack className="items-center gap-4">
        <TypographyMuted className="text-sm">{user?.email}</TypographyMuted>
        <IconButton
          aria-label={mounted && isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          variant="ghost"
          fontSize="sm"
          icon={mounted && isDark ? <LuSun className="size-4" /> : <LuMoon className="size-4" />}
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        />
        <Button
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          onClick={() => {
            void handleSignOut();
          }}
        >
          <LuLogOut className="mr-2 size-4" />
          <TypographySmall>Sign out</TypographySmall>
        </Button>
      </HStack>
    </Box>
  );
};
