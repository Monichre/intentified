import { authMiddleware } from '@repo/auth/middleware';
import { NextResponse } from 'next/server';
import type { NextMiddleware } from 'next/server';

export default authMiddleware(async (_auth, request) => {
  // Authentication is handled by authMiddleware
  return NextResponse.next();
}) as unknown as NextMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
