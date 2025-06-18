

import type { NextConfig } from 'next';


const nextConfig = {
	/* config options here */
	// Prevents TypeScript errors from failing the build
	reactStrictMode: false,
	
	typescript: {

		ignoreBuildErrors: true,
	},
	// Prevents ESLint errors from failing the build
	eslint: {
		// Warning only, doesn't fail the build
		ignoreDuringBuilds: true,
	},
	// Prevents other errors from failing the build