
import { config, withAnalyzer } from '@repo/next-config';
import type { NextConfig } from 'next';
import { env } from 'process'

let nextConfig: NextConfig =config



if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
