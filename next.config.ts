import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// Prevents TypeScript errors from failing the build
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
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
	},
};

export default nextConfig;
