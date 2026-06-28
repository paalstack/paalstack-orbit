'use client';

import { type AuthSession, type AuthUser } from '../types';

type UseAuthReturn = {
  user: AuthUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

/**
 * Placeholder authentication hook.
 *
 * Replace the body of this hook with your chosen auth provider's hook:
 * - NextAuth.js: `return useSession()`
 * - Clerk:       `return useUser()`
 * - Auth0:       `return useAuth0()`
 *
 * See src/features/auth/README.md for full integration guides.
 */
export const useAuth = (): UseAuthReturn => {
  return {
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: false,
    signIn: (_provider?: string) =>
      Promise.reject(
        new Error(
          'Authentication not configured. See src/features/auth/README.md for setup instructions.'
        )
      ),
    signOut: () =>
      Promise.reject(
        new Error(
          'Authentication not configured. See src/features/auth/README.md for setup instructions.'
        )
      ),
  };
};
