import { keys as cms } from '@repo/cms/keys';
import { keys as email } from '@repo/email/keys';

import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as rateLimit } from '@repo/rate-limit/keys';

import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [
    cms(),
    core(),
    email(),
    observability(),
  
    rateLimit(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
