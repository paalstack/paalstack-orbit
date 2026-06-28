import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /**
   * Server-side environment variables.
   * These are NOT exposed to the browser.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    SUPABASE_SECRET_KEY: z.string().min(1).optional(),
    SUPABASE_ACCESS_TOKEN: z.string().min(1).optional(),
    RESEND_API_KEY: z.string().min(1).optional(),
  },

  /**
   * Client-side environment variables.
   * These MUST be prefixed with NEXT_PUBLIC_ and are exposed to the browser.
   */
  client: {
    NEXT_PUBLIC_API_BASE_URL: z.url().optional(),
    NEXT_PUBLIC_APP_NAME: z.string().min(1).default('PaalStack Orbit'),
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_DEBUG_MODE: z
      .string()
      .transform((val) => val === 'true')
      .default(false),
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  },

  /**
   * Runtime environment bindings.
   * Maps each variable name to its actual value at runtime.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  },

  emptyStringAsUndefined: true,
});
