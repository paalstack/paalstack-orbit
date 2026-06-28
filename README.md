# PaalStack Orbit

> CRM and workflow automation platform built on Next.js 16, Supabase, TanStack Query, and `@paalstack/react-ui`.

[![CI](https://github.com/paalamugan/paalstack-orbit/actions/workflows/ci.yml/badge.svg)](https://github.com/paalamugan/paalstack-orbit/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E)](https://supabase.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## Overview

**Orbit** is a production-grade internal CRM and workflow automation application. It provides teams with the tools to manage leads through their full lifecycle, automate follow-up workflows, track activity timelines, collaborate on team assignments, and send transactional emails — all from a single, fast dashboard.

Built on the [PaalStack Next.js Starter](https://github.com/paalamugan/paalstack-nextjs-starter) foundation, Orbit ships with strict TypeScript, server-first data fetching, Row Level Security, CI/CD pipelines, and a battle-tested testing setup out of the box.

---

## Features

- **Dashboard** — CRM performance overview with lead conversion rates, leads-by-status chart, and activity volume trends
- **Leads** — Full CRUD pipeline management with status tracking and detail views
- **Workflows** — Automation engine (`engine.ts` + `executor.ts`) for building and running multi-step workflows
- **Activities** — Timeline of all CRM interactions across leads and workflows
- **Team** — Member management with role assignments
- **Email Templates** — Reusable templates powered by [Resend](https://resend.com)
- **Auth** — Supabase Auth with login, signup, forgot-password, and password reset flows
- **Route protection** via `proxy.ts` — session-aware redirects to login or dashboard

### Infrastructure

- **Next.js 16 App Router** with Server Components, Streaming, and Route Handlers
- **React 19** — latest concurrent features and Server Actions
- **TypeScript** strict mode with zero compromises
- **Tailwind CSS v4** + `@paalstack/react-ui` design system
- **TanStack Query v5** for server state management with DevTools
- **Zustand v5** for client state with persistence and DevTools
- **Recharts** for dashboard data visualisations
- **Zod v4** + `@t3-oss/env-nextjs` for runtime environment validation
- **Axios** pre-configured with interceptors and typed responses
- **react-hook-form** + Zod resolver for form handling
- **Vitest** + React Testing Library for unit and integration tests
- **Playwright** for end-to-end browser testing
- **ESLint v9** flat config with TypeScript strict rules
- **Prettier** with Tailwind class sorting
- **Husky** + **lint-staged** + **commitlint** (Conventional Commits)
- **Supabase** — Auth, PostgreSQL, and Row Level Security
- **GitHub Actions** CI/CD with type-check, lint, test, and build

---

## Tech Stack

| Category        | Library                               |
| --------------- | ------------------------------------- |
| Framework       | Next.js 16 (App Router)               |
| UI              | React 19                              |
| Language        | TypeScript 5.6                        |
| Styling         | Tailwind CSS v4 + @paalstack/react-ui |
| Auth & Database | Supabase (Auth + PostgreSQL + RLS)    |
| Server State    | TanStack Query v5                     |
| Client State    | Zustand v5                            |
| Charts          | Recharts                              |
| Forms           | react-hook-form + Zod                 |
| Email           | Resend                                |
| HTTP Client     | Axios                                 |
| Env Validation  | @t3-oss/env-nextjs + Zod              |
| Unit Tests      | Vitest + React Testing Library        |
| E2E Tests       | Playwright                            |
| Linting         | ESLint v9 (flat config)               |
| Formatting      | Prettier                              |
| Git Hooks       | Husky + lint-staged + commitlint      |
| Package Manager | pnpm                                  |

---

## Installation

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- A [Supabase](https://supabase.com) project

### Clone and install

```bash
git clone https://github.com/paalamugan/paalstack-orbit.git
cd paalstack-orbit

pnpm install

cp .env.example .env.local
```

### Configure environment variables

Edit `.env.local`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Orbit"

# Supabase — get from https://supabase.com/dashboard/project/<id>/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

# Backend API
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com/v1
```

### Apply database migrations

```bash
# Using the Supabase CLI against your remote project
supabase db push

# Or apply individually from supabase/migrations/
```

### Run development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

All variables are validated at startup using `@t3-oss/env-nextjs` + Zod. Misconfigured deployments fail immediately with a clear error.

### Client-side (exposed to browser)

| Variable                               | Required | Default                 | Description                     |
| -------------------------------------- | -------- | ----------------------- | ------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Yes      | —                       | Supabase project URL            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes      | —                       | Supabase publishable (anon) key |
| `NEXT_PUBLIC_APP_URL`                  | No       | `http://localhost:3000` | Public app URL                  |
| `NEXT_PUBLIC_APP_NAME`                 | No       | `PaalStack`             | Application display name        |
| `NEXT_PUBLIC_API_BASE_URL`             | Yes      | —                       | Backend API base URL            |
| `NEXT_PUBLIC_DEBUG_MODE`               | No       | `false`                 | Enable verbose browser logging  |

### Server-only (never exposed to browser)

| Variable                | Required | Description                                                       |
| ----------------------- | -------- | ----------------------------------------------------------------- |
| `SUPABASE_SECRET_KEY`   | Yes      | Supabase secret key — bypasses RLS. Required for admin operations |
| `SUPABASE_ACCESS_TOKEN` | No       | Personal access token for migration scripts only                  |

> Get Supabase keys from **Project → Settings → API**. Get access token from [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens).

Add additional variables to `src/libs/env/env.ts` — they are validated automatically.

---

## Database Schema

Migrations live in `supabase/migrations/` and are applied in order:

| Migration                      | Description                               |
| ------------------------------ | ----------------------------------------- |
| `001_orbit_profiles.sql`       | User profiles (FK target for all tables)  |
| `002_orbit_leads.sql`          | Leads pipeline with status tracking       |
| `003_orbit_activities.sql`     | Activity timeline per lead / workflow     |
| `004_orbit_workflows.sql`      | Workflow definitions and step config      |
| `005_orbit_email.sql`          | Email template storage                    |
| `006_orbit_team.sql`           | Team members and role assignments         |

All tables include Row Level Security policies. Users can only access data belonging to their own workspace.

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, metadata)
│   ├── page.tsx                  # Home redirect
│   ├── loading.tsx               # Global Suspense fallback
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── (orbit)/                  # Authenticated orbit shell
│   │   ├── layout.tsx            # Sidebar + top bar layout
│   │   ├── error.tsx             # Orbit-level error boundary
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard overview
│   │   ├── leads/
│   │   │   ├── page.tsx          # Leads list
│   │   │   ├── new/page.tsx      # Create lead
│   │   │   └── [id]/page.tsx     # Lead detail
│   │   ├── workflows/
│   │   │   ├── page.tsx          # Workflows list
│   │   │   ├── new/page.tsx      # Create workflow
│   │   │   └── [id]/page.tsx     # Workflow detail
│   │   ├── team/
│   │   │   └── page.tsx          # Team members
│   │   └── email-templates/
│   │       └── page.tsx          # Email templates
│   ├── auth/                     # Public auth routes
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── callback/             # Supabase OAuth callback
│   └── api/                      # Route Handlers
│
├── actions/                      # Server Actions
│
├── apis/
│   ├── axios/                    # Axios instance with interceptors
│   └── example/                  # Example API service module
│
├── components/
│   ├── orbit/
│   │   ├── OrbitSidebar.tsx      # Main navigation sidebar
│   │   ├── OrbitTopBar.tsx       # Top navigation bar
│   │   ├── app/                  # App-level UI components
│   │   ├── activities/           # Activity timeline components
│   │   ├── dashboard/            # Charts and stat cards
│   │   ├── email/                # Email template components
│   │   ├── leads/                # Lead form, list, and detail components
│   │   ├── team/                 # Team member components
│   │   └── workflows/            # Workflow builder components
│   └── SiteHeader/               # Public site header
│
├── constants/
│   └── routes/                   # Route constant definitions
│
├── enums/                        # Shared TypeScript enums
│
├── features/
│   ├── auth/                     # Auth scaffold (login, signup, session)
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── hooks/
│   └── orbit/                    # Core CRM domain features
│       ├── activities/           # Activity hooks and queries
│       ├── dashboard/            # Dashboard stats and chart data
│       ├── email/                # Email template logic
│       ├── leads/                # Lead pipeline management
│       ├── team/                 # Team member operations
│       └── workflows/
│           ├── engine.ts         # Workflow execution engine
│           ├── executor.ts       # Step executor
│           ├── engine.test.ts    # Engine unit tests
│           └── hooks/
│
├── hooks/
│   ├── auth/                     # Auth hooks
│   ├── orbit/                    # Orbit domain hooks
│   ├── mutations/                # TanStack Query mutation hooks
│   ├── queries/                  # TanStack Query query hooks
│   ├── useAppStore/              # Zustand store hook re-export
│   ├── useMounted/               # SSR-safe mounted state
│   └── useNavigation/            # Router navigation helpers
│
├── libs/
│   ├── axios/                    # Configured Axios instance
│   ├── env/                      # @t3-oss/env-nextjs configuration
│   ├── query-client/             # QueryClient singleton
│   └── supabase/                 # Supabase client factory
│       ├── browser.ts            # createBrowserSupabaseClient() — Client Components
│       ├── server.ts             # createServerSupabaseClient() — RSC / Server Actions
│       ├── middleware.ts         # createMiddlewareSupabaseClient() — proxy.ts
│       ├── auth.ts               # requireAuth() + ensureProfile()
│       └── index.ts              # Re-exports
│
├── providers/
│   ├── query-provider.tsx
│   ├── theme-provider.tsx
│   └── index.ts                  # Combined <Providers> wrapper
│
├── schemas/                      # Zod form schemas
│
├── services/
│   └── api/                      # Business-logic service layer
│
├── stores/
│   └── app/                      # Zustand app store (persist + devtools)
│
├── styles/
│   └── globals.css               # Tailwind v4 + @paalstack/react-ui theme
│
├── test/
│   ├── setup.ts                  # Vitest setup (jest-dom, mocks)
│   ├── test-utils.tsx            # render + renderWithProviders helpers
│   └── e2e/                      # Playwright smoke tests
│
├── types/
│   └── app/                      # Shared TypeScript types
│
└── utils/
    ├── cn/                       # cn() utility (clsx + tailwind-merge)
    ├── helper/                   # General-purpose helpers
    └── logger/                   # Debug-gated logger

supabase/
└── migrations/                   # Ordered SQL migration files

proxy.ts                          # Route protection (session refresh + auth redirects)
```

---

## Development Workflow

```bash
pnpm dev          # Start development server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm analyze      # Build + open Turbopack bundle analyzer in browser
pnpm type-check   # TypeScript type checking
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier write
pnpm format:check # Prettier check
pnpm clean        # Remove .next and module caches
```

### Bundle analysis

`pnpm analyze` runs `next experimental-analyze` — the built-in Turbopack bundle analyzer. It produces an interactive treemap showing every module and its contribution to the final bundle, broken down by route.

---

## Testing

### Unit tests (Vitest + RTL)

```bash
pnpm test              # Run all unit tests
pnpm test:watch        # Watch mode
pnpm test:coverage     # Coverage report
pnpm test:ui           # Vitest UI
```

Tests live co-located with source files as `*.test.ts(x)`. Setup in `src/test/setup.ts`.

### End-to-end tests (Playwright)

```bash
pnpm test:e2e          # Run E2E tests against localhost:3000
pnpm test:e2e:ui       # Playwright UI mode
```

E2E specs live in `src/test/e2e/`. The web server is started automatically.

---

## Authentication

Orbit uses Supabase Auth. Route protection is handled by `proxy.ts`:

| Route          | Unauthenticated | Authenticated  |
| -------------- | --------------- | -------------- |
| `/`            | → `/auth/login` | → `/dashboard` |
| `/dashboard/*` | → `/auth/login` | allowed        |
| `/auth/*`      | allowed         | → `/dashboard` |

### Using Supabase clients

```ts
// Client Component
import { createBrowserSupabaseClient } from '@/libs/supabase';
const supabase = createBrowserSupabaseClient();
await supabase.auth.signInWithPassword({ email, password });

// Server Component / RSC
import { createServerSupabaseClient } from '@/libs/supabase';
const supabase = await createServerSupabaseClient();
const { data } = await supabase.from('leads').select('*');

// Server Action / Route Handler (with auth guard)
import { requireAuth } from '@/libs/supabase';
const { supabase, user, error } = await requireAuth();
if (error) return NextResponse.json({ error }, { status: 401 });
```

### `requireAuth()`

Resolves the current session and upserts a `profiles` row. Use exclusively in Server Actions and Route Handlers.

---

## Deployment

### Vercel (recommended)

The project ships with a `vercel.yml` GitHub Actions workflow:

| Trigger                  | Action                                         |
| ------------------------ | ---------------------------------------------- |
| Push to `main`           | Production deploy                              |
| PR to `main` / `develop` | Preview deploy + posts the URL as a PR comment |

#### One-time setup

```bash
# Install Vercel CLI and link the repo
pnpm add -g vercel
vercel link
```

Add three secrets to **GitHub → Settings → Secrets → Actions**:

| Secret              | Where to get it                                                |
| ------------------- | -------------------------------------------------------------- |
| `VERCEL_TOKEN`      | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID`     | `"orgId"` from `.vercel/project.json`                          |
| `VERCEL_PROJECT_ID` | `"projectId"` from `.vercel/project.json`                      |

Then set environment variables in **Vercel → Project → Settings → Environment Variables**.

### Docker

A production-ready `Dockerfile` and `docker-compose.yml` are included. `output: 'standalone'` is enabled in `next.config.ts`.

```bash
# Build and start with Docker Compose
docker compose up --build

# Build image manually
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://<id>.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_... \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://api.example.com/v1 \
  -t paalstack-orbit .

# Run container
docker run -p 3000:3000 \
  -e SUPABASE_SECRET_KEY=sb_secret_... \
  paalstack-orbit
```

`NEXT_PUBLIC_*` variables are baked into the client bundle at build time — pass them as `--build-arg`. Server-only secrets are injected at runtime and never baked into the image.

### Other platforms

- **Netlify** — use the Next.js runtime plugin
- **Railway** — connect repo, set env vars, deploy
- **Render** — Node.js environment with `pnpm build && pnpm start`

---

## CI/CD

| Workflow      | Trigger                                   | Jobs                                                    |
| ------------- | ----------------------------------------- | ------------------------------------------------------- |
| `ci.yml`      | Push to `develop`, PR to `main`/`develop` | type-check → lint → test → build                        |
| `vercel.yml`  | Push to `main`, PR to `main`/`develop`    | deploy to Vercel (production or preview)                |
| `release.yml` | Manual dispatch                           | type-check → lint → test → build → tag → GitHub Release |

---

## Coding Standards

### Commit messages

Conventional Commits enforced via commitlint:

```
feat(leads): add bulk status update action
fix(workflows): handle empty step array in executor
chore(deps): update next to v16.3
docs: update database schema section
```

### Component conventions

- Server Components by default — add `'use client'` only when needed
- Components: `component.tsx` + `index.ts` barrel
- Hooks: `hook.ts` + `index.ts` barrel
- API modules: `api.ts` + `type.ts` + `index.ts`
- Co-locate tests: `*.test.ts(x)` next to the source file

### Import order

Imports are automatically sorted by ESLint:

1. Built-in Node.js modules
2. External packages
3. Internal `@/*` aliases
4. Parent / sibling / index
5. Type-only imports

---

## PaalStack Packages

| Package                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `@paalstack/react-ui`    | Component library (Cards, Headings, Grids, etc.) |
| `@paalstack/react-hooks` | Shared React hooks                               |
| `@paalstack/react-icons` | Icon set                                         |

```tsx
import { Card, CardContent, Heading } from '@paalstack/react-ui';
```

Styles and theme tokens are imported in `src/styles/globals.css`.

---

## Best Practices

- **Server Components first** — fetch data on the server, push interactivity to Client Components
- **Validated environment** — never access `process.env` directly; use `env` from `@/libs/env`
- **Typed API layer** — all axios calls go through `@/libs/axios` with typed responses
- **Co-located tests** — tests live next to the code they test
- **Atomic commits** — one logical change per commit, Conventional Commits format
- **No `any`** — TypeScript strict mode with `no-explicit-any: error`
- **RLS everywhere** — all Supabase tables have Row Level Security policies

---

## License

MIT — see [LICENSE](./LICENSE).
