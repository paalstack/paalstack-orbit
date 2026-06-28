/**
 * Authentication type definitions.
 *
 * These are placeholder types — wire them to your chosen auth provider.
 * See README.md in this directory for integration guides.
 */

export type AuthRole = 'admin' | 'user' | 'viewer';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: AuthRole;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
  /** Unix timestamp (ms) when the session expires */
  expiresAt: number;
};
