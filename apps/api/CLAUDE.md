# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `pnpm dev` (runs Next.js on port 3002 with Turbopack + Stripe webhook listener)
- **Build**: `pnpm build`
- **Test**: `pnpm test` (Vitest)
- **Type Check**: `pnpm typecheck`
- **Bundle Analysis**: `pnpm analyze`
- **Stripe Webhooks**: `pnpm stripe` (forwards to localhost:3002/webhooks/stripe)

## Architecture

This is the **API service** for the Intentified platform - a Next.js application that provides research endpoints and webhook handlers.

### Core Structure
- **App Router**: Uses Next.js 15 App Router with route handlers
- **Research Endpoints**: `/app/research/` contains various data enrichment APIs (Crunchbase, LinkedIn, social media scraping, etc.)
- **Webhooks**: `/app/webhooks/` handles Clerk user events and Stripe payments
- **Health Check**: `/app/health/` provides system status endpoint
- **Environment**: Centralized env validation using `@t3-oss/env-nextjs` in `env.ts`

### Key Features
- **Workspace Dependencies**: Uses monorepo packages (`@repo/*`) for shared auth, database, design system
- **Edge Runtime**: Health endpoint uses edge runtime for performance
- **Observability**: Sentry integration with instrumentation setup
- **API Timeouts**: Research endpoints use `maxDuration = 60` for long-running operations

### Request/Response Patterns
- Research endpoints expect POST requests with JSON payloads
- Standard error handling with appropriate HTTP status codes
- Most endpoints require authentication via Clerk (`@repo/auth`)
- Database operations use shared Prisma client (`@repo/db`)

### External Integrations
- **Exa API**: For web search and content discovery
- **Firecrawl**: For website scraping
- **Various Social APIs**: TikTok, Twitter, LinkedIn scraping
- **Financial Data**: Crunchbase, PitchBook integration
- **Stripe**: Payment processing webhooks