# Intentified-Platform Redesign – Implementation Plan

This document describes a phased roadmap to redesign **intentified-platform**, transforming the current prototype-style monorepo into a production-grade customer-intent & marketing-optimization SaaS.

---

## 0. Guiding Principles

| Principle | Why it matters |
|-----------|----------------|
| **Modularity first** | Preserve the mono-repo but swap ad-hoc boundaries for clear domain-driven packages. |
| **Server-first UX**  | Prefer RSC & Server Actions to minimize JS shipped to client. |
| **Performance as a feature** | Budget <100 ms P95 API latency and <1 s LCP for core journeys. |
| **Secure by default** | Centralise auth, secrets, rate-limit, observability. |
| **DX parity** | Dev environments should spin-up with `bun x turbo dev` in <2 min. |

---

## 1. Current State (quick recap)

| Layer | Observations |
|-------|--------------|
| **Apps** | `apps/api`, `apps/app`, `apps/web`, `apps/docs`, etc. Many share common infra but duplicate config. |
| **Packages** | Good separation (`auth`, `db`, `design-system`, …) yet some cross-dependencies (e.g. `packages/ai` imports `apps/app` type). |
| **Data** | Prisma models live only in `packages/db/src/prisma`; Redis & Supabase wrapped but not consistently used. |
| **Feature sprawl** | Four AI pipelines surface as prototypes inside `/features/pipelines`; onboarding, SEO, analytics each half-complete. |
| **Infra** | Deployed to Vercel; Trigger.dev used for tasks but no formal staging pipeline; env var sprawl in `turbo.json` globalEnv. |

---

## 2. Phase Roadmap Overview

| Phase | Duration* | Outputs |
|-------|-----------|---------|
| P0 ‑ Foundation Hardening | Week 1-2 | Repo hygiene, CI/CD baseline, test coverage gates. |
| P1 ‑ Architecture Modernization | Week 3-6 | New domain-oriented packages, data-layer refactor, shared config extraction. |
| P2 ‑ User-Experience Redesign | Week 7-10 | New navigation & dashboard IA, onboarding wizard v2, responsive design audit. |
| P3 ‑ Feature Consolidation | Week 11-14 | Merge prototype pipelines into **Intent Hub**, deprecate redundant routes. |
| P4 ‑ Performance & Observability | Week 15-18 | Edge-cache layer, cold-start fixes, Sentry + OpenTelemetry full coverage. |
| P5 ‑ Infrastructure & Roll-out | Week 19-22 | Blue-green deploys, data migration scripts, staged customer rollout. |

\*One-week sprint cadence assumed; adjust to team velocity.

---

## 3. Detailed Workstreams

### P0 – Foundation Hardening (Week 1-2)

| Task | Owner | Notes |
|------|-------|-------|
| Adopt **Biome** across repo for lint/format on pre-push | DX | Already present; enforce via GitHub Actions. |
| Add **Vitest** coverage gate ≥ 80 % packages | QA | Configure in `turbo test`. |
| Setup **Preview Envs** on PR (Vercel) | DevOps | Feature flags via env-vars. |

### P1 – Architecture Modernization (Week 3-6)

1. **Domain Packages**
   * Create `packages/core-intent` (customer/intent models, services).
   * Create `packages/workflows` (Trigger.dev jobs, queues).
   * Migrate business logic from `apps/api/app/research/*` into these packages.

2. **Database Refactor**
   * Break monolithic `schema.prisma` into logical schemas using Prisma’s **multiple schema** feature (e.g. `intent`, `seo`, `billing`).
   * Introduce migrations via `prisma migrate`, forbid `db push` in CI.

3. **Shared Next.js Config**
   * Move duplicate `next.config.ts` into `packages/next-config` and consume via `withIntentifiedConfig()` helper.

4. **Strict Type-Boundary**
   * Enable `verbatimModuleSyntax`, `exactOptionalPropertyTypes`.
   * Use **zod** schemas exported from packages for runtime validation.

5. **Rate-Limit & Auth Middleware**
   * Centralise in `packages/rate-limit` and `packages/auth`.
   * Apply to all `apps/api` route handlers through `composeMiddlewares()` helper.

### P2 – User Experience Redesign (Week 7-10)

1. **Information Architecture**
   * Replace `/features/pipelines` playground with **Intent Hub** main nav:
     ```
     ├── Dashboard
     ├── Signals  (real-time intent feed)
     ├── Insights  (AI summaries)
     ├── SEO       (site audits)
     └── Settings
     ```
   * Update routing under `apps/app/app/(authenticated)` accordingly.

2. **Onboarding 2.0**
   * Wizard pages: Connect Website → Connect Analytics → Import Contacts.
   * Track completion state in `user_profile` table; gate main app until done.

3. **Design-System Audit**
   * Run `shadcn@latest add --all --overwrite -c packages/design-system`.
   * Dark-mode parity; prepare Figma library ↔ code mapping.

4. **Accessibility & i18n**
   * Audit with Lighthouse; fix aria & color contrast.
   * Introduce `next-intl` with language sub-paths (`/[locale]`) already scaffolded in `apps/web`.

### P3 – Feature Consolidation (Week 11-14)

| Effort | Action |
|--------|--------|
| AI Agents + Prompt + Doc pipelines → **Intent Hub / Insights** module | Unify UI as tabs; expose as RSC stream for low TTI. |
| Deprecate duplicate scraping routes | Keep only generic `/api/research/scrape?provider=` handler. |
| Centralise SEO analysis logic into `packages/seo` | Move prompt & crawl util from `features/seo-digital-processing`. |
| Payment & Licensing | Finish `packages/payments` plan enforcement middleware. |
| Docs & Storybook | Auto-publish component docs to `/docs` via GitHub Pages. |

### P4 – Performance & Observability (Week 15-18)

1. **Edge & Caching**
   * Use **Vercel Edge Config + KV** for hot intent signals cache (TTL 60 s).
   * Enable ISR for SEO audit pages.

2. **Cold-start / Bundle Size**
   * Lazy import large libs (e.g. `@clerk/nextjs/dist`) only in client components.
   * Analyze with `next build --profile`; set budget <250 KB JS initial.

3. **Observability**
   * Wrap all API/router handlers with `@sentry/nextjs` + OTEL.
   * Configure dashboards (P95 latency, error rate, RUM).

4. **Load/Stress Tests**
   * Use k6 or Artillery; target 500 rps sustained, 1 % error budget.

### P5 – Infrastructure & Roll-out (Week 19-22)

1. **CI/CD Enhancements**
   * Add **turbo remote caching** (Vercel) to cut build times.
   * Introduce **branch-based db migrations** with shadow database.

2. **Blue-Green Deploy**
   * Leverage Vercel Promote; run smoke tests before traffic shift.

3. **Data Migration Scripts**
   * From legacy tables to new domain schemas, use Prisma `--create-only` for review.

4. **Monitoring & Alerting**
   * Slack alerts via Trigger.dev on SLO breach.

5. **Roll-out Plan**
   * Week 19: Internal dog-food
   * Week 20: Beta customers opt-in
   * Week 21: GA – gradually raise traffic
   * Week 22: Sunset legacy routes/components.

---

## 4. Technical Recommendations & References

| Area | Recommendation | Codebase touch-points |
|------|---------------|-----------------------|
| **Server Components** | Keep heavy AI calls on server; stream to client. | `apps/app/features/**` |
| **Tasks & Queues** | Standardise on **Trigger.dev**; wrap in `packages/workflows`. | `packages/tasks` |
| **Scraping** | Switch to headless-browser Firecrawl for dynamic sites. | `/api/research/*` |
| **Vector Store** | Replace ad-hoc Upstash Vector with pgvector extension inside main DB (simplifies infra). | `packages/db` |
| **Secrets Management** | Use Vercel Environments & `@t3-oss/env-nextjs`; remove `turbo.json` globalEnv duplication. | root config |

---

## 5. Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| **Scope creep** | Enforce sprint goals, freeze changes after design review. |
| **Breaking DB migrations** | Shadow DB tests, backups before apply. |
| **Cost spike (Edge, Firecrawl)** | Implement usage metering early; autoscale Redis tier. |
| **Team unfamiliar with RSC** | Run internal workshop; coding standards doc. |

---

## 6. Success Metrics

1. LCP ≤ 1 s on 3G for dashboard.
2. P95 API latency ≤ 100 ms.
3. Error budget < 1 % over 30 days.
4. User onboarding completion rate +30 % versus baseline.
5. Developer setup time < 5 min from `git clone` to running app.

---

### Appendix A – High-Level Gantt (Weeks)

```
P0  |██| 
P1     |████|
P2         |████|
P3             |████|
P4                 |████|
P5                     |████|
```

(Adjust as staffing changes.)

---

**Prepared by**: Product & Platform Engineering  
**Date**: 2025-06-01  
