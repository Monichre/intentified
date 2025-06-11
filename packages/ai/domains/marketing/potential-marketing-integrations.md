
# One-Sheet: 3rd-Party Data & Enrichment APIs

**Providers:**  
Clearbit · SimilarWeb · Semrush · Clay.com · SE Ranking · Capture.page · SurferSEO

---

## API Comparison

| Provider         | Core Value                                             | Typical Payload                                                        | Auth / Pricing*                                      | Best Use Cases                                              | Integration Pointers (Next.js + TS)                                                                                                                                                                                                                      |
|------------------|-------------------------------------------------------|------------------------------------------------------------------------|------------------------------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Clearbit**     | Firmographic & technographic enrichment (domain/email/IP) | `company.name`, `sector`, `employees`, `annual_revenue`, `tech[]`, `logoUrl`, `socials` | Bearer token. 50 free/mo, paid tiers, 600 req/min.   | Lead qualification, CRM autofill, company cards              | ```ts<br>const res = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, { headers: { Authorization: `Bearer ${CLEARBIT_KEY}` } });<br>const data: ClearbitCompany = await res.json();<br>```<br>- Wrap in `lib/clearbit.ts`<br>- Debounce calls<br>- Handle 404s gracefully |
| **SimilarWeb**   | Digital traffic, engagement, category rank            | `visits`, `bounceRate`, `avgVisitDuration`, `sources`, `geo[]`         | API key param. ~$200/mo, quotas, 10 RPS cap.         | Competitor benchmarking, TAM sizing, channel-mix analysis    | ```ts<br>await fetch(`https://api.similarweb.com/v1/website/${domain}/total-traffic-and-engagement/visits?api_key=${SW_KEY}&start_date=2025-01&end_date=2025-04&granularity=monthly`);<br>```<br>- Server-side only<br>- Cache 24h<br>- Use in `lib/similarweb.ts` |
| **Semrush**      | SEO/SEM keyword, backlink & SERP intelligence         | `keywords[]`, `volume`, `cpc`, `kd`, `serp_features`, backlinks stats  | Query-string `key=`. 10 free/day, paid, 20 RPS cap.  | Keyword gaps, paid-search spend, content opportunities       | - Wrap `domain_ranks` & `organic_keywords` in `lib/semrush.ts`<br>- Use `p-limit` to throttle<br>- Merge with “Market Trends” panel                                        |
| **Clay.com**     | Unified enrichment & workflow engine (50+ sources)    | Normalized `company`, `contacts[]`, `social`, `tech`, `signals`        | Bearer token. Pay-per-action, invite-only beta.      | Waterfall enrichment, prototyping, automated outreach        | ```ts<br>await fetch('https://api.clay.run/actions', { method: 'POST', headers: { Authorization: `Bearer ${CLAY_KEY}` }, body: JSON.stringify({ action: 'enrichCompany', inputs: { domain } }) });<br>```<br>- Use in `lib/clay.ts`<br>- Keep vendor-specific fallbacks |
| **SE Ranking**   | Rank-tracking & SEO site audit                        | `keyword`, `position`, `serp_features`, `visibility`, backlink counts  | Header `Token` or query `api_key`. From ~$39/mo, 20 RPS | Daily keyword monitoring, SERP visibility, alerting          | ```ts<br>await fetch(`https://api.seranking.com/v2/keywords/positions?project_id=${pid}&date=2025-05-28`, { headers: { 'Token': SERANKING_KEY } });<br>```<br>- Merge with Semrush for holistic SEO<br>- Use in `lib/seranking.ts`                         |
| **Capture.page** | Full-page screenshots & previews                      | PNG/JPG (base64/URL), meta-tags (`title`, `description`, colors`)      | `api_key` param. ~$1/1k, or monthly bundles.         | Thumbnails, landing-page change snapshots, visual reporting  | ```ts<br>const img = await fetch(`https://capture.page/api?url=${encodeURIComponent(url)}&size=1280x800&key=${CAPTURE_KEY}`);<br>```<br>- Store in S3<br>- CDN-cache 7d<br>- Use in `lib/capture-page.ts`                                               |
| **SurferSEO**    | Content score & SERP NLP recommendations              | `contentScore`, `keywords[]`, `keyword.density`, top-ranking pages     | Bearer token. Business plan, credit-based, 60 RPH    | Real-time content optimization, gap analysis, on-page audits | ```ts<br>await fetch('https://api.surferseo.com/seo-audit', { method: 'POST', headers: { Authorization: `Bearer ${SURFER_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url, keyword }) });<br>```<br>- Use in AI copywriter workflows<br>- Use in `lib/surferseo.ts` |

\*Pricing as of mid-2025; check vendor docs for latest.

---s

## Implementation Notes

1. **Server-Side Only**
   - Never expose API keys in client bundles.
   - Use Next.js Route Handlers or server actions (`NEXT_RUNTIME=nodejs`).

2. **Rate Limiting & Backoff**
   - Use `p-limit` or `bottleneck` to throttle (concurrency 3–5).
   - Prefer `Promise.allSettled` for batch calls to avoid 429 cascades.
   - Fallback to cached data on 429 errors.

3. **Caching**
   - Use Redis or KV store.
   - TTL: SimilarWeb & SE Ranking (24h), Clearbit/Clay (6h), SurferSEO (12h), screenshots (7d).

4. **Schema Normalization**
   - Define a `CompanyEnrichment` interface.
   - Normalize all API payloads to this shape for vendor-agnostic UI.

5. **Waterfall & Fallback**
   - Try: Clay → Clearbit → SimilarWeb → Semrush/SE Ranking.
   - Log misses for later backfill.

6. **Cost Control**
   - Batch keywords (Semrush, SE Ranking).
   - Debounce screenshot calls (Capture.page).

---

## Integration Pattern

- Create a thin wrapper for each provider in `lib/<provider>.ts`.
- Store API keys in `.env` and access via `process.env`.
- Import wrappers in Next.js route handlers, server actions, or background jobs.
- Always normalize to the `CompanyEnrichment` interface before returning to UI.

---

**Pro Tip:**  
Anticipate vendor outages or quota exhaustion by logging all misses and periodically backfilling from cache or alternate sources.  
Consider a plugin/strategy pattern for easy extension as new enrichment APIs emerge.


