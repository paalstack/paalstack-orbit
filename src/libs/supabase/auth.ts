import { logger } from '@paalstack/react-ui/lib';

import { createClient } from './server';

import type { User } from '@supabase/supabase-js';

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** Upsert profiles row for the auth user — required as FK target for user_id / owner_id. */
export const ensureProfile = async (supabase: SupabaseServerClient, user: User) => {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? null,
      full_name: (user.user_metadata?.full_name as string | undefined) ?? null,
      avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    },
    { onConflict: 'id' }
  );

  return error;
};

/**
 * Resolve the current session and ensure a profiles row exists.
 * Use in Server Actions and Route Handlers — never in Client Components.
 *
 * A profile upsert failure is logged but does NOT block access — auth status
 * is determined solely by `getUser()`.
 *
 * @example
 * const { supabase, user, error } = await requireAuth()
 * if (error) return NextResponse.json({ error }, { status: 401 })
 */
export const requireAuth = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: 'Unauthorized' as const };
  }

  const profileError = await ensureProfile(supabase, user);
  if (profileError) {
    logger.error('ensureProfile failed', { error: profileError });
    return { supabase, user: null, error: profileError.message };
  }

  return { supabase, user, error: null };
};
