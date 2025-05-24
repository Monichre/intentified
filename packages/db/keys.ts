import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      // Database URLs
      DATABASE_URL: z.string().min(1).url(),
      DIRECT_URL: z.string().min(1).url(),

      // Upstash Redis
      UPSTASH_REDIS_URL: z.string().min(1).url().optional(),
      UPSTASH_REDIS_TOKEN: z.string().min(1).optional(),

      // Upstash QStash
      UPSTASH_QSTASH_TOKEN: z.string().min(1).optional(),

      // Supabase
      SUPABASE_URL: z.string().min(1).url(),
      SUPABASE_ANON_KEY: z.string().min(1),
      SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

      // Document Processing Endpoints
      DOCUMENT_EXTRACT_ENDPOINT: z.string().min(1).url().optional(),
      DOCUMENT_ANALYZE_ENDPOINT: z.string().min(1).url().optional(),
      DOCUMENT_VECTORIZE_ENDPOINT: z.string().min(1).url().optional(),
    },
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
      UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
      UPSTASH_QSTASH_TOKEN: process.env.UPSTASH_QSTASH_TOKEN,
      SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      DOCUMENT_EXTRACT_ENDPOINT: process.env.DOCUMENT_EXTRACT_ENDPOINT,
      DOCUMENT_ANALYZE_ENDPOINT: process.env.DOCUMENT_ANALYZE_ENDPOINT,
      DOCUMENT_VECTORIZE_ENDPOINT: process.env.DOCUMENT_VECTORIZE_ENDPOINT,
    },
  });
