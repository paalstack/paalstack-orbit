import { type NextRequest, NextResponse } from 'next/server';

import { createClient as createMiddlewareSupabaseClient } from '@/libs/supabase/middleware';

export const proxy = async (request: NextRequest) => {
  const { supabase, supabaseResponse } = createMiddlewareSupabaseClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith('/auth');
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/workflows') ||
    pathname.startsWith('/email-templates') ||
    pathname.startsWith('/team') ||
    pathname === '/';

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
};

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
