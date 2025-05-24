import { authMiddleware } from '@repo/auth/middleware';
import { type NextMiddleware, NextResponse } from 'next/server';

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  matcher: ['/((?!_next/static|_next/image|ingest|favicon.ico).*)'],
};

const middleware = authMiddleware(async (_auth, request) => {
  // Authentication is handled by authMiddleware
  return NextResponse.next();
}) as unknown as NextMiddleware;

export default middleware;
