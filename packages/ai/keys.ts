// import { createEnv } from '@t3-oss/env-nextjs';
// import { z } from 'zod';

// export const keys = () =>
//   createEnv({
//     server: {
//       OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),
//       ANTHROPIC_API_KEY: z.string().min(1).startsWith('sk-').optional(),
//       EXA_API_KEY: z.string().min(1).startsWith('sk-').optional(),
//       FIRECRAWL_API_KEY: z.string().min(1).startsWith('sk-').optional(),
//     },
//     runtimeEnv: {
//       OPENAI_API_KEY: process.env.OPENAI_API_KEY,
//       ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
//       EXA_API_KEY: process.env.EXA_API_KEY,
//       FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
//     },
//   });
