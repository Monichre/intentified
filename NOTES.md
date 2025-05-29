# One-Sheet: 3rd-Party Data & Enrichment APIs

**Providers Covered:**  
Clearbit · SimilarWeb · Semrush · Clay.com · SE Ranking · Capture.page · SurferSEO

---

## API Comparison Table

| Provider      | Core Value                                                        | Typical Payload                                                      | Auth / Pricing*                                                                 | Best-Fit Use Cases                                                                                      | Integration Pointers (Next.js + TS)                                                                                                                                                                                                                                                                                                                                                 |
|---------------|-------------------------------------------------------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Clearbit**  | Firmographic & technographic enrichment for domain/email/IP       | `company.name`, `sector`, `employees`, `annual_revenue`, `tech[]`, `logoUrl`, `socials` | Bearer token. Free 50 calls/mo, paid tiers scale. 600 req/min.                   | Auto-qualifying leads, CRM autofill, company cards                                                      | ```ts<br>const res = await fetch(`https://company.clearbit.com/v2/companies/find?domain=${domain}`, { headers: { Authorization: `Bearer ${CLEARBIT_KEY}` } });<br>const data: ClearbitCompany = await res.json();<br>```<br>- Wrap in `lib/clearbit.ts`<br>- Debounce calls<br>- Handle 404s gracefully (unknowns)                                                                                 |
| **SimilarWeb**| Digital traffic, engagement, category rank for sites/apps         | `visits`, `bounceRate`, `avgVisitDuration`, `sources`, `geo[]`        | API key param. ~$200/mo starter, quotas per credit. 10 RPS cap.                  | Competitor benchmarking, TAM sizing, channel-mix analysis                                               | ```ts<br>await fetch(`https://api.similarweb.com/v1/website/${domain}/total-traffic-and-engagement/visits?api_key=${SW_KEY}&start_date=2025-01&end_date=2025-04&granularity=monthly`);<br>```<br>- Server-side only<br>- Cache 24h<br>- Use in `lib/similarweb.ts`                                                                                                                        |
| **Semrush**   | SEO/SEM keyword, backlink & SERP intelligence                    | `keywords[]`, `volume`, `cpc`, `kd`, `serp_features`, backlinks stats | Query-string `key=`. 10 req/day free; paid tiers, 20 RPS cap.                    | Keyword gaps, paid-search spend, content opportunities                                                  | - Wrap `domain_ranks` & `organic_keywords` endpoints in `lib/semrush.ts`<br>- Use `p-limit` to throttle<br>- Merge with “Market Trends” panel                                                                                                                                                |
| **Clay.com**  | Unified enrichment & workflow engine (50+ data sources)           | Normalized `company`, `contacts[]`, `social`, `tech`, `signals`       | Bearer token. Pay-per-action ($0.01–0.05). Invite-only beta API.                 | Waterfall enrichment, rapid prototyping, automated outreach triggers                                    | ```ts<br>await fetch('https://api.clay.run/actions', { method: 'POST', headers: { Authorization: `Bearer ${CLAY_KEY}` }, body: JSON.stringify({ action: 'enrichCompany', inputs: { domain } }) });<br>```<br>- Use in `lib/clay.ts`<br>- Keep vendor-specific fallbacks for prod scale                                                                                                 |
| **SE Ranking**| Rank-tracking & SEO site audit data                              | `keyword`, `position`, `serp_features`, `visibility`, backlink counts | Header `Token` or query `api_key`. Plans start ~$39/mo; 20 RPS.                  | Daily keyword monitoring, competitor SERP visibility, automated alerting                                | ```ts<br>await fetch(`https://api.seranking.com/v2/keywords/positions?project_id=${pid}&date=2025-05-28`, { headers: { 'Token': SERANKING_KEY } });<br>```<br>- Merge with Semrush for holistic SEO<br>- Use in `lib/seranking.ts`                                                                                                         |
| **Capture.page** | Full-page screenshots & previews of any URL                   | PNG/JPG (base64 or URL), meta-tags (`title`, `description`, colors`)  | `api_key` param. Pay-as-you-go (~$1/1k captures) or monthly bundles.             | Thumbnails for company cards, snapshotting landing-page changes, visual reporting                       | ```ts<br>const img = await fetch(`https://capture.page/api?url=${encodeURIComponent(url)}&size=1280x800&key=${CAPTURE_KEY}`);<br>```<br>- Store in S3<br>- CDN-cache 7d<br>- Use in `lib/capture-page.ts`                                                                                                                               |
| **SurferSEO** | Content score & SERP NLP recommendations                         | `contentScore`, `keywords[]`, `keyword.density`, top-ranking pages    | Bearer token. Business plan only; credit-based, 60 RPH.                          | Real-time content optimization, gap analysis, automated on-page audits                                  | ```ts<br>await fetch('https://api.surferseo.com/seo-audit', { method: 'POST', headers: { Authorization: `Bearer ${SURFER_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ url, keyword }) });<br>```<br>- Use in AI copywriter workflows<br>- Use in `lib/surferseo.ts`                                                |

\*Pricing as of mid-2025; check vendor docs for current details.

---

## Implementation Notes & Gotchas

1. **Server-Side Only:**  
   - Never expose API keys in client bundles.  
   - Use Next.js Route Handlers or server actions (`NEXT_RUNTIME=nodejs`).  
2. **Rate-Limiting & Backoff:**  
   - Use `p-limit` or `bottleneck` to throttle concurrent requests (concurrency 3–5).  
   - Prefer `Promise.allSettled` for batch calls to avoid cascading 429s.  
   - Fallback to cached data on 429 errors.  
3. **Caching Layer:**  
   - Use Redis or KV store.  
   - TTL: SimilarWeb & SE Ranking (24h), Clearbit/Clay (6h), SurferSEO (12h), screenshots (7d).  
4. **Schema Union:**  
   - Define a `CompanyEnrichment` interface.  
   - Normalize each API’s payload to this shape for vendor-agnostic UI code.  
5. **Waterfall & Fallback Logic:**  
   - Try: Clay → Clearbit → SimilarWeb → Semrush/SE Ranking.  
   - Log misses for later backfill.  
6. **Cost Control:**  
   - Batch keywords (Semrush, SE Ranking).  
   - Debounce screenshot calls (Capture.page).  

---

## Integration Pattern

- For each provider, create a thin wrapper in `lib/<provider>.ts`.
- Store API keys in `.env` and access via `process.env`.
- Import these wrappers in your Next.js route handlers, server actions, or background jobs.
- Always normalize to the `CompanyEnrichment` interface before returning to UI.

---

**Pro Tip:**  
Anticipate vendor outages or quota exhaustion by logging all misses and periodically backfilling from cached or alternate sources.  
Consider a plugin/strategy pattern for easy extension as new enrichment APIs emerge.