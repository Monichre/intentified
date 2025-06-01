# Intentified-Platform  
### AI Funnel Onboarding & Redesigned Dashboard – Implementation Guide
_Last updated: 2025-06-01_

---

## 1. Purpose  

This document explains the new onboarding experience and dashboard refresh introduced in the 2025-06-01 redesign.  
It is intended for engineers, product managers, and DevOps working on **intentified-platform**.

---

## 2. High-Level Flow  

1. **New users** sign up via Clerk ➜ are redirected to `/onboarding`.  
2. **AI Funnel Form** collects 5 conversational steps of business information.  
3. On “Complete”, data is validated server-side and persisted to the `user` + `profile` tables, flagging `onboardingCompleted = true`.  
4. User is redirected to `/dashboard`.  
5. The refreshed **Dashboard** shows:
   • Overview metrics  
   • Tabs (Overview / Intent Hub / Analytics / Settings)  
   • **Intent Hub** embeds existing Unified Pipelines (`features/pipelines`)  

Repeat visitors:
- `onboardingCompleted` checked in `apps/app/app/(authenticated)/page.tsx`  
- Redirected straight to `/dashboard`.

---

## 3. Component Map  

| Layer | File | Responsibility |
|-------|------|----------------|
| Client UI | `components/onboarding/ai-funnel-form.tsx` | Glassmorphic, multi-step conversational form (Framer Motion). |
| Client Logic | `components/onboarding/onboarding-wrapper.tsx` | Wraps form, handles optimistic UX, calls server action. |
| Server Action | `app/actions/onboarding.ts` | Zod validation, writes DB, sets `onboardingCompleted`. |
| Route (RSC) | `app/(authenticated)/onboarding/page.tsx` | Gatekeeper: redirect logic + renders wrapper. |
| Routing Gate | `app/(authenticated)/page.tsx` | Decides `/onboarding` vs `/dashboard` after auth. |
| Dashboard | `app/(authenticated)/dashboard/page.tsx` | New layout, metrics, Tabs, integrates pipelines. |
| Sidebar | `app/(authenticated)/components/sidebar.tsx` | Updated IA (Dashboard, Intent Hub, Integrations, Settings). |
| Intent Hub Redirect | `app/(authenticated)/intent-hub/page.tsx` | Simple redirect to dashboard tab. |

---

## 4. Data Contract & DB Schema  

### 4.1 Tables / Models (Prisma)

```prisma
model User {
  id                  String   @id @default(cuid())
  email               String   @unique
  // …
  onboardingCompleted Boolean  @default(false)
  profile             Profile?
}

model Profile {
  id              String   @id @default(cuid())
  userId          String   @unique
  businessType    String
  websiteUrl      String
  marketingGoals  String[] // → uses Postgres text[]
  currentTools    String[]
  expectedOutcomes String
  user            User     @relation(fields: [userId], references: [id])
}
```

Run migration:

```
npx prisma migrate dev -n "add_onboarding_profile"
```

### 4.2 Validation Schema (shared)

`onboardingSchema` in `app/actions/onboarding.ts` – keep in sync with Prisma.

---

## 5. UI / UX Details  

### 5.1 AI Funnel Form  

Step | Field | Validation
-----|-------|-----------
1 | `businessType` | required (`Select`)
2 | `websiteUrl` | required, `url`
3 | `marketingGoals[]` | min 1 (`Checkbox`)
4 | `currentTools[]` | min 1 (`Checkbox`)
5 | `expectedOutcomes` | min length 10 (`Textarea`)

Progress indicator dots change colour & size.  
Completion screen shows `CheckCircle` and **Go to Dashboard**.

### 5.2 Dashboard Refresh  

- **Overview** widgets (Intent Signals, Conversion Rate, etc.)  
- **Recent Intent Signals** list → placeholder mocked; wire to real data service next.
- **Intent Hub** embeds `UnifiedPipelines` full-height; inherits mobile sidebar pattern.
- Tabs implemented with Shadcn `Tabs`.

---

## 6. Server Logic & Security  

1. **Server action (`updateOnboardingProfile`)** is `"use server"` and runs under Clerk auth.  
2. Uses Zod to reject malformed payloads; returns discriminated union `{ success|error }`.  
3. Profile upsert prevents duplicate rows; action sets `updatedAt`.  
4. Route handlers (`onboarding`, `dashboard`) are RSCs – no secrets in client.  
5. Rate limiting inherits global middleware; no additional changes required.

---

## 7. Environment & Deployment  

### 7.1 ENV Vars

No new secrets. Ensure existing vars (`DATABASE_URL`, Clerk, etc.) are set in **Preview** and **Production**.

### 7.2 Build & Migrate

```
bun install
turbo run build
bun prisma migrate deploy
```

### 7.3 Vercel Preview Links

- Preview PR will auto-deploy; review onboarding flow end-to-end.  
- Check ⬆️ browser console for any hydration warnings (Framer Motion SSR).  

### 7.4 Feature Flags / Roll-out

1. Deploy to staging.  
2. Enable for internal org only via Clerk role guard.  
3. Monitor Sentry + PostHog.  
4. Gradually roll to 100 % traffic.

---

## 8. Testing  

| Area | Tool | Notes |
|------|------|-------|
| Unit | Vitest | Add tests for `onboardingSchema`. |
| E2E | Playwright | Scenario: new user ➜ completes onboarding ➜ dashboard loads. |
| Accessibility | Lighthouse CI | Target score ≥ 90 for onboarding pages. |

---

## 9. Next Steps  

1. **Real Data Wiring** – connect Dashboard metrics to analytics services.  
2. **Edge Cache** – cache intent signals list in Upstash KV (TTL 60 s).  
3. **i18n** – leverage already scaffolded `/[locale]` for onboarding copy.  
4. **Mobile QA** – validate glassmorphic layers on small screens.  
5. **Docs Update** – reflect new routes in API reference (`apps/docs`).  

---

## 10. Glossary  

Term | Meaning
-----|--------
Intent Hub | Consolidated workspace for all AI pipelines.
UnifiedPipelines | Component combining Agents, Prompting, Docs & SEO pipelines.
Glassmorphic | UI style using translucent cards + backdrop blur.

---

© Intentified Engineering 2025
