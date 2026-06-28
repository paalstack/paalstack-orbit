# Authentication

This directory contains the authentication scaffold for PaalStack Next.js Starter.

No authentication provider is pre-configured — instead, the scaffold provides clean integration points so you can plug in your preferred solution with minimal friction.

---

## Structure

```
src/features/auth/
├── README.md           ← this file
├── index.ts            ← barrel export
├── types.ts            ← AuthUser, AuthSession, AuthRole types
└── hooks/
    └── useAuth.ts      ← placeholder hook (replace with your provider's hook)
```

---

## Choosing a Provider

| Provider           | Best for                                            |
| ------------------ | --------------------------------------------------- |
| **NextAuth.js v5** | Self-hosted, flexible, supports 50+ OAuth providers |
| **Clerk**          | Fastest setup, pre-built UI, generous free tier     |
| **Auth0**          | Enterprise features, compliance (SOC2, HIPAA), B2B  |
| **AWS Cognito**    | AWS-native apps, existing AWS infrastructure        |

---

## NextAuth.js v5

```bash
pnpm add next-auth@beta
```

```ts
// src/libs/auth/index.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
});
```

```ts
// src/app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/libs/auth';
export const { GET, POST } = handlers;
```

Replace `useAuth.ts` hook:

```ts
import { useSession } from 'next-auth/react';
export const useAuth = () => {
  const { data: session, status } = useSession();
  return {
    user: session?.user ?? null,
    session,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    signIn: (provider) => signIn(provider),
    signOut: () => signOut(),
  };
};
```

---

## Clerk

```bash
pnpm add @clerk/nextjs
```

```ts
// src/app/layout.tsx — wrap with ClerkProvider
import { ClerkProvider } from '@clerk/nextjs';
<ClerkProvider>{children}</ClerkProvider>
```

```ts
// src/middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
export default clerkMiddleware();
```

Replace `useAuth.ts` hook:

```ts
import { useUser, useClerk } from '@clerk/nextjs';
export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  return {
    user: user
      ? {
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? '',
          name: user.fullName,
          avatarUrl: user.imageUrl,
          role: 'user',
        }
      : null,
    session: null,
    isAuthenticated: !!user,
    isLoading: !isLoaded,
    signIn: async () => {},
    signOut: () => signOut(),
  };
};
```

---

## Auth0

```bash
pnpm add @auth0/nextjs-auth0
```

See: https://auth0.com/docs/quickstart/webapp/nextjs

---

## AWS Cognito

Use NextAuth.js with the `CognitoProvider`:

```ts
import Cognito from 'next-auth/providers/cognito';
providers: [
  Cognito({
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
    issuer: process.env.COGNITO_ISSUER,
  }),
];
```

---

## Protecting Routes

Once a provider is configured, protect routes using Next.js Middleware:

```ts
// src/middleware.ts
import { auth } from '@/libs/auth';
export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url));
  }
});
export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
```
