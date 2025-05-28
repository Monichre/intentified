One-Sheet: 3rd-Party Data & Enrichment APIs

(Clearbit · SimilarWeb · Semrush · Clay.com)

⸻


API	Core Value	Typical Payload	Auth / Pricing	Best-Fit Use Cases	Quick Integration Pointers (Next.js + TS)
Clearbit	Firmographic & technographic enrichment for a domain, email, or IP.	company.name, sector, employees, annual_revenue, tech:[], logo URL, social handles.	Bearer token → free tier (50 calls/mo) → Essentials & Enterprise tiers scale to >100 k calls. Hard rate-limit: 600 req/min per key.	• Populating company cards instantly• Auto-qualifying inbound leads• Pre-fill CRM fields.	```ts
import fetch from ‘node-fetch’;					
const res = await fetch(					
https://company.clearbit.com/v2/companies/find?domain=${domain},					
{ headers:{Authorization:Bearer ${process.env.CLEARBIT_KEY}}});					
const data: ClearbitCompany = await res.json();					
``` Create a tiny wrapper in lib/clearbit.ts and debounce calls; Clearbit returns 404 for unknowns—handle gracefully.					
SimilarWeb	Digital traffic, engagement metrics & category rank for sites or apps.	visits, bounceRate, avgVisitDuration, sources: {search, social,…}, geo: [{country, share}]	API Key header. Starter plan ≈ $200/mo for 10k credits; enterprise PUPM. Burst cap ≈ 10 rps, 24 h quota.	• Competitor benchmarking• TAM/SAM sizing via traffic• Channel mix analysis (paid vs organic).	Use server-side calls only (the key reveals allotments). Example: ```ts
await fetch(https://api.similarweb.com/v1/website/${domain}/total-traffic-and-engagement/visits?api_key=${SW_KEY}&start_date=2024-12&end_date=2025-03&granularity=monthly);					

| **Semrush** | SEO/SEM keyword, backlink & SERP intel. | `keywords[]`, `volume`, `cpc`, `kd`, `serp_features`, backlinks stats. | Query-string token (`key=`). Free 10 req/day; Guru/Business tiers scale. Hard cap 20 rps. | • Keyword gap between company & rivals<br>• Detect paid-search spend<br>• Content opportunity reports. | Wrap in `getSemrushDomainOverview(domain)` that calls the `domain_ranks` & `organic_keywords` endpoints. Chill with `p-limit` to avoid 429. Merge into your “Market Trends” panel. |
| **Clay.com** | No-code/low-code data enrichment & workflow orchestration with 50+ data sources (Clearbit, Crunchbase, LinkedIn, etc.) via one GraphQL-ish API. | Normalized records: `company`, `contacts[]`, `social`, `tech`, `signals`. | Bearer token. Pay-as-you-go ($0.01–$0.05 per “action”); bulk pricing for 100k+. | • Rapid prototyping when you don’t want to juggle multiple vendor keys.<br>• Waterfall enrichment (try Clearbit → fallback PeopleDataLabs etc.)<br>• Trigger-based outreach flows. | Clay’s beta API is invite-only—request access. Once enabled: ```ts
await fetch('https://api.clay.run/actions', {method:'POST', headers:{Authorization:`Bearer ${CLAY_KEY}`}, body:JSON.stringify({action:'enrichCompany', inputs:{domain}})});
``` For prod scale, still keep vendor-specific fallbacks so you’re not single-sourced. |

---

#### Implementation Notes & Gotchas
1. **Server-Side Only:** Never expose these keys in client bundles—use Next.js **Route Handlers** or server actions.  
2. **Rate-Limit Strategy:** `Promise.allSettled` + `p-limit` (concurrency = 3–5) prevents cascading 429s.  
3. **Caching Layer:** Redis (1-day TTL) for SimilarWeb & Semrush; shorter (1–6 h) for Clearbit/Clay as firmographics update faster.  
4. **Schema Union:** Normalize responses into a common `CompanyEnrichment` interface so UI code stays vendor-agnostic.  
5. **Fallback Logic:** Try Clay (waterfall) → Clearbit → SimilarWeb (traffic) → Semrush (SEO). Log misses for periodic backfills.  

One-Sheet: 3rd-Party Data & Enrichment APIs

(Clearbit · SimilarWeb · Semrush · Clay.com · SE Ranking · Capture.page · SurferSEO)

API	Core Value	Typical Payload	Auth / Pricing*	Best-Fit Use Cases	Quick Integration Pointers (Next.js + TS)
Clearbit	Firmographic & technographic enrichment for a domain, email, or IP.	company.name, sector, employees, annual_revenue, tech[], logo URL, socials	Bearer token. Free 50 calls/mo → Essentials & Enterprise. 600 req/min.	Auto-qualifying inbound leads, CRM autofill, company cards.	```ts
const res = await fetch(https://company.clearbit.com/v2/companies/find?domain=${domain},{headers:{Authorization:Bearer ${CLEARBIT_KEY}}});					

| **SimilarWeb** | Digital traffic & engagement metrics for sites/apps. | `visits`, `bounceRate`, `avgVisitDuration`, traffic sources, geo split | `api_key` param. ~$200/mo starter, quotas per credit. 10 RPS cap. | Competitor benchmarking, TAM sizing, channel-mix analysis. | ```ts
await fetch(`https://api.similarweb.com/v1/website/${domain}/total-traffic-and-engagement/visits?api_key=${SW_KEY}&start_date=2025-01&end_date=2025-04&granularity=monthly`);
``` Cache 24 h. |
| **Semrush** | SEO/SEM keyword, backlink & SERP intel. | `keywords[]`, `volume`, `cpc`, `kd`, backlinks stats | Query-string `key=`. 10 req/day free; paid tiers, 20 RPS cap. | Keyword gaps, paid-search spend, content opportunities. | Wrap `domain_ranks` & `organic_keywords`. Use `p-limit` to throttle. |
| **Clay.com** | Unified enrichment & workflow engine across 50+ data sources. | Normalized `company`, `contacts[]`, signals, tech | Bearer token. Pay-per-action ($0.01–0.05). | Waterfall enrichment, rapid prototyping, automated outreach triggers. | ```ts
await fetch('https://api.clay.run/actions',{method:'POST',headers:{Authorization:`Bearer ${CLAY_KEY}`},body:JSON.stringify({action:'enrichCompany',inputs:{domain}})});
``` |
| **SE Ranking** | Rank-tracking & SEO site audit data. | `keyword`, `position`, `serp_features`, visibility %, backlink counts | Header `Token` or query `api_key`. Plans start ~$39/mo; API credits tied to subscription; 20 RPS. | Daily keyword-position monitoring, competitor SERP visibility, automated alerting. | ```ts
await fetch(`https://api.seranking.com/v2/keywords/positions?project_id=${pid}&date=2025-05-28`,{headers:{'Token':SERANKING_KEY}});
``` Merge with Semrush for holistic SEO view. |
| **Capture.page** | Full-page screenshots & previews of any URL. | PNG/JPG (base64 or URL), meta-tags (`title`, `description`, colors) | `api_key` param. Pay-as-you-go (~$1 per 1k captures) or monthly bundles. | Generating thumbnails for company cards, snapshotting landing-page changes, visual reporting. | ```ts
const img = await fetch(`https://capture.page/api?url=${encodeURIComponent(url)}&size=1280x800&key=${CAPTURE_KEY}`);``` Store in S3; CDN-cache 7 d. |
| **SurferSEO** | Content score & SERP NLP recommendations. | `contentScore`, `keywords[]`, `keyword.density`, top-ranking pages | Bearer token. Business plan only; credit-based, 60 RPH. | Real-time content optimization, gap analysis before publishing, automated on-page audits. | ```ts
await fetch('https://api.surferseo.com/seo-audit', {method:'POST',headers:{Authorization:`Bearer ${SURFER_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({url,keyword})});
``` Useful inside **AI copywriter** workflows. |

\*Pricing snapshots mid-2025—check vendors for current tiers & quotas.  

---

#### Implementation Notes & Gotchas (all APIs)

1. **Server-Side Only** – keep keys in env vars (`NEXT_RUNTIME=nodejs` route handlers).  
2. **Rate-Limit & Backoff** – wrap fetches with `p-limit` / `bottleneck`; fall back to cached data on 429.  
3. **Caching Layer** – Redis or KV: SimilarWeb & SE Ranking (24 h), Clearbit/Clay (6 h), SurferSEO (12 h), screenshots (7 d).  
4. **Schema Union** – define a `CompanyEnrichment` interface; convert each API’s payload to that shape so UI remains vendor-agnostic.  
5. **Waterfall & Fallback** – e.g. Clay ➜ Clearbit ➜ SimilarWeb ➜ SE tools. Log misses for later backfill.  
6. **Cost Control** – batch keywords (Semrush, SE Ranking) and debounce screenshot calls (Capture.page).  

Drop any of these modules into your Next.js analyst pipeline by creating a thin `lib/<provider>.ts` wrapper, adding the key to `.env`, and importing the function in your route handlers or background jobs.