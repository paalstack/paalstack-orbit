'use client';

/**
 * useNavigation — a thin wrapper around Next.js navigation hooks.
 *
 * Provides typed helpers for common navigation patterns used in this app.
 *
 * Usage:
 *   import { useNavigation } from '@/hooks/useNavigation';
 *   const { goHome, goTo, goBack } = useNavigation();
 */

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';

export const useNavigation = () => {
  const router = useRouter();

  const goHome = () => {
    router.push(ROUTES.HOME);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const goTo = (path: any, options?: { replace?: boolean }) => {
    if (options?.replace) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      router.replace(path);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      router.push(path);
    }
  };

  const goBack = () => {
    router.back();
  };

  return { goHome, goTo, goBack, router };
};
