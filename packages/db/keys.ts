import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string().min(1),
      DIRECT_URL: z.string().min(1).optional(),
      SUPABASE_SERVICE_ROLE_API_KEY: z.string().min(1),
      SUPABASE_URL: z.string().min(1),
      SUPABASE_ANON_KEY: z.string().min(1),
    },
    client: {},
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      SUPABASE_SERVICE_ROLE_API_KEY: process.env.SUPABASE_SERVICE_ROLE_API_KEY,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  });