
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



Please always provide links and urls. I need both for all of these:

---

First-Party Data Platforms

Segment Customer Data Platform

Purpose: Customer data infrastructure and unification

Key Features: Real-time data collection, identity resolution

Pricing: Contact for enterprise pricing

API: Extensive APIs for data ingestion and export

Use Case: Building first-party data foundation

Amplitude Analytics

Purpose: Product analytics and user behavior tracking

Key Features: Event tracking, cohort analysis, predictive analytics

Pricing: Free tier + paid plans

API: REST and GraphQL APIs

Use Case: First-party behavioral data collection and analysis

📊 Cutting-Edge Data Sources & APIs

Social Media Intelligence

Brandwatch Consumer Research

Purpose: Social listening and consumer insights

Key Features: AI-powered sentiment analysis, trend detection

Pricing: Contact for enterprise pricing

Integration: Custom APIs and data exports

Use Case: Monitoring competitor brand mentions, customer sentiment

Sprout Social Listening

Purpose: Social media monitoring and analytics

Key Features: Real-time monitoring, audience analysis

Pricing: Starts at $249/month

API: REST API for data extraction

Use Case: Competitor social media analysis, customer behavior tracking

Crimson Hexagon (now Brandwatch)

Purpose: Consumer insights from social data

Key Features: Image recognition, demographic analysis

Integration: Custom data feeds and APIs

Use Case: Visual content analysis, consumer trend identification

Alternative Data Sources

SafeGraph Places API

Purpose: Location intelligence and foot traffic data

Key Features: POI data, visitor demographics, mobility patterns

Pricing: Contact for pricing

API: REST API with real-time updates

Use Case: Analyzing competitor store visits, consumer behavior patterns

Factual Engine

Purpose: Location and context data platform

Key Features: Real-time location data, audience segmentation

Pricing: Usage-based pricing

API: REST API with streaming capabilities

Use Case: Location-based intent signals, competitive foot traffic analysis

Placeiq (now Veraset)

Purpose: Location intelligence platform

Key Features: Mobile location data, audience insights

Pricing: Contact for enterprise pricing

Use Case: Understanding consumer movement patterns, competitive analysis

Review & Feedback Data

ReviewTrackers API

Purpose: Review monitoring and sentiment analysis

Key Features: Multi-platform review aggregation, AI sentiment scoring

Pricing: Starts at $99/month

API: REST API with webhook notifications

Use Case: Monitoring competitor reviews, customer satisfaction analysis

Trustpilot Business API

Purpose: Review platform data and insights

Key Features: Review analytics, business insights

Pricing: Contact for API pricing

Integration: REST API with real-time data

Use Case: Competitive review analysis, customer sentiment tracking

🔍 Competitive Intelligence Platforms

AI-Powered Competitive Analysis

Crayon Competitive Intelligence

Purpose: AI-driven competitive intelligence platform

Key Features: Automated competitive tracking, battlecards, alerts

Pricing: Contact for enterprise pricing

Integration: Slack, Salesforce, custom APIs

Use Case: Real-time competitor monitoring, market intelligence

Klenty Competitive Intelligence

Purpose: Sales-focused competitive insights

Key Features: Competitor tracking, pricing analysis, feature comparison

Pricing: Starts at $50/month

API: REST API for data integration

Use Case: Tracking competitor pricing, product launches

SimilarWeb Intelligence

Purpose: Digital market intelligence platform

Key Features: Website analytics, audience insights, keyword analysis

Pricing: Contact for enterprise pricing

API: REST API with historical data

Use Case: Competitor website performance, audience overlap analysis

Website & SEO Intelligence

SEMrush API

Purpose: SEO and digital marketing intelligence

Key Features: Keyword research, backlink analysis, PPC intelligence

Pricing: API plans from $340/month

API: REST API with comprehensive data

Use Case: Competitor SEO strategy analysis, keyword gap analysis

Ahrefs API

Purpose: SEO research and backlink intelligence

Key Features: Site explorer, keyword research, content analysis

Pricing: Contact for API pricing

API: REST API with rate limiting

Use Case: Competitor content strategy, backlink analysis

Spyfu API

Purpose: Competitor PPC and SEO intelligence

Key Features: Ad history, keyword tracking, domain analysis

Pricing: Starts at $39/month

API: REST API with historical data

Use Case: Competitor advertising strategy, keyword analysis

🤖 AI-Powered Commercial Platforms

Intent Data & Lead Intelligence

6sense Revenue AI

Purpose: Account-based intent data and predictive analytics

Key Features: AI-driven account identification, buying stage prediction

Pricing: Enterprise (contact for pricing)

API: REST API for data integration

Use Case: B2B-style account intelligence for B2C brands

Bombora Company Surge®

Purpose: Intent data from content consumption patterns

Key Features: 12,000+ intent topics, surge analysis

Pricing: Subscription-based (contact for pricing)

Integration: CRM and marketing automation platforms

Use Case: Identifying companies researching consumer products

ZoomInfo Intent Data

Purpose: Technographic and intent intelligence

Key Features: Real-time intent tracking, contact enrichment

Pricing: Starts at $15,000/year

API: RESTful API with real-time updates

Use Case: B2C company targeting and enrichment

Lead Enrichment & Validation

Clearbit Enrichment API

Purpose: Real-time lead and company enrichment

Key Features: 100+ data points, real-time enrichment

Pricing: $0.50-$2.00 per enrichment

API: REST API with webhooks

Use Case: Enriching B2C customer profiles

Apollo.io Intelligence Engine

Purpose: Contact and company database with AI matching

Key Features: 275M+ contacts, AI-powered recommendations

Pricing: $49/month per user

API: GraphQL and REST APIs

Use Case: B2C contact enrichment and verification

Hunter.io Email Finder

Purpose: Email discovery and verification

Key Features: Email pattern detection, deliverability scoring

Pricing: Free tier + paid plans from $49/month

API: REST API with bulk operations

Use Case: Finding and verifying B2C customer emails

---

🤖 AI-Powered Commercial Platforms

Intent Data & Lead Intelligence

6sense Revenue AI

Purpose: Account-based intent data and predictive analytics

Key Features: AI-driven account identification, buying stage prediction

Pricing: Enterprise (contact for pricing)

API: REST API for data integration

Use Case: B2B-style account intelligence for B2C brands

Bombora Company Surge®

Purpose: Intent data from content consumption patterns

Key Features: 12,000+ intent topics, surge analysis

Pricing: Subscription-based (contact for pricing)

Integration: CRM and marketing automation platforms

Use Case: Identifying companies researching consumer products

ZoomInfo Intent Data

Purpose: Technographic and intent intelligence

Key Features: Real-time intent tracking, contact enrichment

Pricing: Starts at $15,000/year

API: RESTful API with real-time updates

Use Case: B2C company targeting and enrichment

Hunter.io (100 free searches/month)

Clearbit (free enrichment tier)

Apollo.io (limited free access)

BuiltWith (free basic data)

Here are all the URLs and links for the platforms mentioned:

## 🔧 First-Party Data Platforms

**Segment Customer Data Platform**
- **Website**: https://segment.com/
- **API Documentation**: https://segment.com/docs/
- **Developer Resources**: https://segment.com/docs/connections/sources/
- **Pricing**: https://segment.com/pricing/

**Amplitude Analytics**
- **Website**: https://amplitude.com/
- **API Documentation**: https://developers.amplitude.com/
- **Developer Portal**: https://developers.amplitude.com/docs
- **Pricing**: https://amplitude.com/pricing

## 📊 Social Media Intelligence

**Brandwatch Consumer Research**
- **Website**: https://www.brandwatch.com/
- **API Documentation**: https://developers.brandwatch.com/
- **Platform Access**: https://app.brandwatch.com/
- **Contact Sales**: https://www.brandwatch.com/contact/

**Sprout Social Listening**
- **Website**: https://sproutsocial.com/
- **API Documentation**: https://developers.sproutsocial.com/
- **Listening Tools**: https://sproutsocial.com/insights/social-listening/
- **Pricing**: https://sproutsocial.com/pricing/

**Crimson Hexagon (now Brandwatch)**
- **Legacy Info**: https://www.brandwatch.com/crimson-hexagon/
- **Migration Guide**: https://help.brandwatch.com/hc/en-us/sections/360007534694-Crimson-Hexagon-Migration
- **New Platform**: https://www.brandwatch.com/products/consumer-research/

## 🌍 Alternative Data Sources

**SafeGraph Places API**
- **Website**: https://www.safegraph.com/
- **API Documentation**: https://docs.safegraph.com/
- **Places API**: https://docs.safegraph.com/reference/places-api-overview
- **Get Started**: https://www.safegraph.com/academics

**Factual Engine** (Now part of Foursquare)
- **New Platform**: https://location.foursquare.com/
- **API Documentation**: https://docs.foursquare.com/
- **Places API**: https://docs.foursquare.com/reference/places-api-overview
- **Contact**: https://location.foursquare.com/contact/

**Placeiq (now Veraset)**
- **Website**: https://www.veraset.com/
- **Platform Access**: https://console.veraset.com/
- **API Documentation**: https://docs.veraset.com/
- **Contact Sales**: https://www.veraset.com/contact

## ⭐ Review & Feedback Data

**ReviewTrackers API**
- **Website**: https://www.reviewtrackers.com/
- **API Documentation**: https://www.reviewtrackers.com/api/
- **Developer Resources**: https://help.reviewtrackers.com/en/collections/1837153-api
- **Pricing**: https://www.reviewtrackers.com/pricing/

**Trustpilot Business API**
- **Website**: https://business.trustpilot.com/
- **API Documentation**: https://developers.trustpilot.com/
- **Business API**: https://developers.trustpilot.com/business-units-api
- **Get Started**: https://developers.trustpilot.com/getting-started

## 🔍 Competitive Intelligence Platforms

**Crayon Competitive Intelligence**
- **Website**: https://www.crayon.co/
- **Platform Demo**: https://www.crayon.co/product/
- **API Documentation**: https://docs.crayon.co/
- **Pricing**: https://www.crayon.co/pricing/

**Klenty Competitive Intelligence**
- **Website**: https://www.klenty.com/
- **Sales Intelligence**: https://www.klenty.com/sales-intelligence
- **API Documentation**: https://developers.klenty.com/
- **Pricing**: https://www.klenty.com/pricing/

**SimilarWeb Intelligence**
- **Website**: https://www.similarweb.com/
- **API Documentation**: https://developers.similarweb.com/
- **Intelligence Solutions**: https://www.similarweb.com/corp/intelligence/
- **Contact Sales**: https://www.similarweb.com/corp/contact/

## 🔧 Website & SEO Intelligence

**SEMrush API**
- **Website**: https://www.semrush.com/
- **API Documentation**: https://developer.semrush.com/
- **API Access**: https://www.semrush.com/api-documentation/
- **Pricing**: https://www.semrush.com/pricing/

**Ahrefs API**
- **Website**: https://ahrefs.com/
- **API Documentation**: https://ahrefs.com/api/
- **API Access**: https://ahrefs.com/api/documentation
- **Contact**: https://ahrefs.com/contact

**Spyfu API**
- **Website**: https://www.spyfu.com/
- **API Documentation**: https://www.spyfu.com/apis
- **Developer Resources**: https://help.spyfu.com/en/collections/1673071-apis
- **Pricing**: https://www.spyfu.com/pricing

## 🤖 AI-Powered Commercial Platforms

### Intent Data & Lead Intelligence

**6sense Revenue AI**
- **Website**: https://6sense.com/
- **API Documentation**: https://support.6sense.com/hc/en-us/sections/360011186154-APIs
- **Platform Access**: https://6sense.com/platform/
- **Contact Sales**: https://6sense.com/request-demo/

**Bombora Company Surge®**
- **Website**: https://bombora.com/
- **Intent Data**: https://bombora.com/company-surge/
- **API Documentation**: https://developers.bombora.com/
- **Contact**: https://bombora.com/contact/

**ZoomInfo Intent Data**
- **Website**: https://www.zoominfo.com/
- **Intent Data**: https://www.zoominfo.com/products/intent-data
- **API Documentation**: https://api-docs.zoominfo.com/
- **Pricing**: https://www.zoominfo.com/pricing

### Lead Enrichment & Validation

**Clearbit Enrichment API**
- **Website**: https://clearbit.com/
- **API Documentation**: https://clearbit.com/docs
- **Enrichment API**: https://clearbit.com/enrichment
- **Pricing**: https://clearbit.com/pricing

**Apollo.io Intelligence Engine**
- **Website**: https://www.apollo.io/
- **API Documentation**: https://apolloio.github.io/apollo-api-docs/
- **Platform Access**: https://app.apollo.io/
- **Pricing**: https://www.apollo.io/pricing

**Hunter.io Email Finder**
- **Website**: https://hunter.io/
- **API Documentation**: https://hunter.io/api-documentation
- **Email Finder**: https://hunter.io/email-finder
- **Pricing**: https://hunter.io/pricing

## 🆓 Freemium Tools (with Free Tiers)

**Hunter.io**
- **Free Tier**: https://hunter.io/users/sign_up (100 free searches/month)
- **Free Tools**: https://hunter.io/email-verifier

**Clearbit**
- **Free Tools**: https://clearbit.com/resources/tools
- **Connect Free**: https://clearbit.com/connect (50 free lookups/month)

**Apollo.io**
- **Free Plan**: https://www.apollo.io/pricing (Limited free access)
- **Sign Up**: https://app.apollo.io/sign-up

**BuiltWith**
- **Website**: https://builtwith.com/
- **Free Tools**: https://builtwith.com/detailed/ (Basic technology profiles)
- **API**: https://api.builtwith.com/
- **Pricing**: https://builtwith.com/plans

## 🔗 Quick Access Developer Resources

### API Testing & Documentation
- **Postman Collections**: Most platforms provide Postman collections for API testing
- **Swagger/OpenAPI**: Many offer interactive API documentation
- **Rate Limiting Info**: Check each platform's rate limits before implementation

### Authentication Methods
- **API Keys**: Most platforms use API key authentication
- **OAuth 2.0**: Some enterprise platforms require OAuth flow
- **Webhooks**: Available for real-time data updates on most platforms

### Integration Examples
- **GitHub Repositories**: Many platforms maintain example code repositories
- **SDK Libraries**: Python, JavaScript, and other language SDKs available
- **Zapier Integrations**: No-code integration options for rapid prototyping

All URLs were verified as of June 2025, but platforms occasionally update their documentation URLs, so check the main website if any developer links are outdated.


