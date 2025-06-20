

const nextConfig = {
	/* config options here */
	// Prevents TypeScript errors from failing the build
	reactStrictMode: false,
	transpilePackages: ['@repo/ai', '@repo/auth', '@repo/analytics', '@repo/typescript-config'],
	typescript: {

		ignoreBuildErrors: true,
	},
	// Prevents ESLint errors from failing the build
	eslint: {
		// Warning only, doesn't fail the build
		ignoreDuringBuilds: true,
	},
	// Prevents other errors from failing the build

	// Suppresses image optimization validation warnings
	images: {
		unoptimized: false,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**', // Allow all HTTPS domains for SEO analysis
			},
			{
				protocol: 'http',
				hostname: '**', // Allow all HTTP domains for SEO analysis
			},
		],
	},
	// Suppress Supabase realtime client webpack warning
	webpack: (config, { isServer }) => {
		// Suppress critical dependency warnings for Supabase realtime client
		config.ignoreWarnings = [
			(warning) => {
				return warning.message.includes('Critical dependency: the request of a dependency is an expression')
			}
		];
		
		if (!isServer) {
			config.module = {
				...config.module,
				exprContextCritical: false,
			};
		}
		return config;
	},
};

export default nextConfig;
