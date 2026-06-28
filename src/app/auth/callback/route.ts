import { NextResponse, type NextRequest } from 'next/server';

import { createClient as createServerSupabaseClient } from '@/libs/supabase/server';

/**
 * Supabase email verification callback.
 * Supabase redirects here after a user clicks the confirmation link in their email.
 * The `code` query param is exchanged for a session via PKCE.
 */
export const GET = async (request: NextRequest) => {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=confirmation_failed`);
};
