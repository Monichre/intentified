I'll format this content in markdown for you. Here's the formatted version:

---
## Quick verdict

Solid v1, but it's God-classing hard: one 650-line service that does everything, synchronous loops that cost tokens & time, and prompts mixed with plumbing. Let's refactor before it calcifies.

---

### 🔑 What you nailed

| 👍 | Why it matters |
|---|---|
| Zod everywhere | Input/AI-output validation = runtime sanity. Nice. |
| Progress callbacks | Useful for UI hooks / async job logs. |
| Confidence scoring | Execs love a single KPI—even if it's heuristic. |
| Granular helper methods | At least the monster class is chunked. |

---

### 🚧 Pain points (and fixes)

| Issue | Why it hurts | Fix in a sentence |
|---|---|---|
| One mega-class | Hard to test, swap models, or parallelise. | Split into domain services: CompetitorDiscoveryService, ProfileAnalyzer, MapBuilder, RecommendationEngine. |
| Serial for ... of scraping | 8 competitors × GPT calls = minutes & 💸. | await Promise.allSettled(...) with concurrency gate (e.g. p-limit 3). |
| Prompt spaghetti inline | Impossible to unit-test or localise. | Move every prompt to /prompts/*.md (import as raw string). |
| Hard-coded model/version | Claude changes ID every few months. | Inject via constructor or DI container: new BrandPositioningService({ model: anthropic("claude-latest") }). |
| No caching | Re-analyzing same competitor burns tokens. | Store competitorProfile in Redis/Upstash keyed by name+version, 24h TTL. |
| Long prompts risk token limit | Competitor descriptions × 8 → 8-12 K tokens. | Truncate fields (str.description.slice(0,500)), or use embeddings + RAG chunk retrieval. |
| Synchronous progress % math | Numbers jump oddly if steps expand later. | Emit phases only; let UI compute percentage from an array length. |
| Custom confidence math | Looks scientific but arbitrary. | Either expose formula publicly or switch to statistical certainty (stdev of scores, data completeness). |

---

### ✂️ Tactical refactor sketch

```typescript
// packages/ai/domains/marketing/index.ts
export async function analyzeBrandPositioning(opts: Options) {
  const competitors = await competitorDiscovery.find(opts);
  const [brandProfile, competitorProfiles] = await Promise.all([
    profileAnalyzer.analyzeBrand(opts),
    profileAnalyzer.analyzeMany(competitors),
  ]);

  const dimensions = dimensionService.identify({ industry: opts.industry, profiles: competitorProfiles, brandProfile });
  const map = mapBuilder.build(dimensions, competitorProfiles, brandProfile);
  const differentiators = diffService.compute(brandProfile, competitorProfiles);
  const gaps = gapService.find(opts.industry, map, competitorProfiles);
  const recs = recoService.generate({ brandProfile, gaps, differentiators });

  return resultAssembler.assemble(/* ... */);
}
```

Each service:
- Pure function → easy Jest tests.
- Own prompt in prompts/xyz.md.
- Shared aiClient injected (Claude, GPT-4o, Llama 3—you decide).

---

### 🏎️ Low-hanging perf wins
1. Concurrency gating

```typescript
import pLimit from 'p-limit';
const limit = pLimit(3);
await Promise.all(competitors.map(c => limit(() => analyzeProfile(c))));
```

2. Retry with exponential backoff

```typescript
import retry from 'async-retry';
const profile = await retry(() => analyzeProfile(name), { retries: 3 });
```

3. Streaming chunk consumer
   - Use Anthropic's messages.stream to build diff gradually; emit progress tokens to front-end—makes a 30-sec call feel instant.

---

### 🧹 Quick code tweaks (no full rewrite)
- Make schemas const so Zod infers types:

```typescript
const PositionSchema = z.object({ ... }) as const;
export type Position = z.infer<typeof PositionSchema>;
```

- Guard env/model upfront

```typescript
if (!process.env.ANTHROPIC_API_KEY) throw new Error('No key');
```

- Move magic numbers to config

```typescript
const MAX_COMPETITORS = opts.maxCompetitors ?? 8;
```

- Use type predicates for progress

```typescript
type Phase = 'research' | 'analysis' | 'positioning' | 'complete';
onProgress?.({ phase: 'research' satisfies Phase, ... })
```

---

### 🤖 Future delegation
1. Background job: wrap analyzeBrandPositioning in Inngest/Trigger.dev; stream logs to RunPod worker.
2. LLM self-evaluation: after recommendations, run a "critique" prompt to auto-QA the output (score coherence, originality).
3. Scheduled refresh: cron every 30 days; diff new map vs old, push Slack alert if position shifts >0.2.

---

### Bottom line

Great foundation—but refactor now before it owns you. Split responsibilities, add concurrency & caching, externalise prompts, and you'll cut cost 50%, latency 3×, and dev pain 100%. 🪄
Here's a repeatable recipe to break them apart across packages/ai/ without a week-long crusade.

---

### 1. Auto-detect the worst offenders (1-min)

```bash
# at repo root
npx eslint --ext .ts packages/ai \
  --rule 'max-lines: [2, 400]' --format table
```

Anything over ~400 lines is a smell → queue for surgery.

---

### 2. Slice each God-file into 4 predictable layers

| Layer | New path | What lives here |
|---|---|---|
| prompts | .../prompts/xyz.md | Only plain text – zero TS. |
| schemas | .../schemas/xyz.schema.ts | Zod defs + export type. |
| services | .../services/xyz.service.ts | Pure async fns; no SDK calls. |
| integrations / adapters | integrations/<vendor>/xyz.adapter.ts | generateObject(), HTTP, etc. |

Rule: services import adapters & schemas; never the reverse.

---

### 3. Refactor pattern (repeat per file)

```typescript
// BEFORE: in brand-positioning.ts
const prompt = `Analyze the brand positioning ...`;

// AFTER
// prompts/brand-profile.md
Analyze the brand positioning ...

// services/profile-analyzer.service.ts
import brandProfilePrompt from "../prompts/brand-profile.md";
import { profileSchema } from "../schemas/profile.schema";
import { aiClient } from "../adapters/anthropic.adapter";

export async function analyzeBrandProfile(input: BrandInput) {
  const { object } = await aiClient.generateObject({
    prompt: format(brandProfilePrompt, input),
    schema: profileSchema,
  });
  return object;
}
```

Then your orchestrator becomes tiny:

```typescript
export async function analyzeBrandPositioning(opts: Options) {
  const comps   = await competitorDiscovery(opts);
  const profiles = await Promise.all(conps.map(analyzeCompetitorProfile));
  ...
}
```

---

### 4. Concurrency & caching in one util

```typescript
// utils/with-cache.ts
import { Redis } from "ioredis";
const redis = new Redis(process.env.REDIS_URL!);

export const withCache = <T>(key: string, fn: () => Promise<T>, ttl = 86400) =>
  redis.get(key).then(JSON.parse).catch(async () => {
    const val = await fn();
    await redis.set(key, JSON.stringify(val), "EX", ttl);
    return val;
  });
```

Use inside adapters:
```typescript
return withCache(`profile:${name}`, () => aiCall());
```

---

### 5. Enforce it going forward
- ESLint rule: max-lines, no-string-literal-prompt (regex for ``` or \n).
- boundaries plugin: forbid integrations/* importing from services/*.
- Pull-request template: "Does this file exceed 400 lines? break it up."

---

### 30-Second Checklist for each new feature
1. Prompt in prompts/.
2. Schema + types in schemas/.
3. Adapter hits the LLM.
4. Service = pure logic.
5. Facade in sdk/ exposes one clean function.

Follow that loop and the "happening all over" problem disappears. 🚀

Those five files are trying to moon-land brand discovery, enrichment, sentiment, positioning, and a demo inside a single folder.
Result: 2,000+ lines of code, half-duplicated helpers, multiple prompt styles, circular imports, and zero mechanical sympathy.

Below is a ruthless plan to chop them into a maintainable, testable, non-over-engineered shape without rewriting business logic.

---

### 1. Immediate triage – cut the fat

| File | Typical line-count | Core responsibility it should keep | Stuff to rip out |
|---|---|---|---|
| brand-extractor.ts | ~150 | Only parse raw web data → structured BrandProfileDto. | Prompt strings, LLM calls, file I/O. |
| brand-sentiment.ts | ~120 | Given text → return { positive, neutral, negative } scores. | Networking, prompt building, logging. |
| brand-positioning.ts | 650 🤯 | Orchestrate competitor discovery → positioning map → recs. | Raw markdown prompts, Zod schemas, progress printing, CLI args. |
| enrichment.service.ts | ~400 | Fan-out to vendors (Clearbit, Proxycurl…) and unify. | Anything that's not vendor adapter glue. |
| example-usage.ts | — | Keep as a Jest integration test only. | All production imports. |

---

### 2. Target folder structure

```
packages/
  ai/
    core/                       # Pure, reusable
      prompts/
        brand/
          extract-profile.md
          sentiment.md
          dimensions.md
      schemas/
        brand-profile.schema.ts
        sentiment.schema.ts
    integrations/               # Talk to outside world
      anthropic/
        generate.adapter.ts
      clearbit/
        index.adapter.ts
    domains/
      marketing/
        services/
          extractor.service.ts
          sentiment.service.ts
          positioning.service.ts
        orchestrators/
          analyze-brand.ts      # stitches services together
    sdk/
      index.ts                  # public API surface for other apps
```

---

### 3. How to move each chunk (repeatable recipe)
1. Prompts → raw .md files in core/prompts/brand/.
2. Zod schemas + exported types → core/schemas/.
3. External calls (generateObject, HTTP) → adapter with caching + retries.
4. Pure transforms → service functions that only accept/return typed data.
5. Long procedural flow → orchestrator that wires services.

Example before (inside brand-positioning.ts):

```typescript
const prompt = `Identify the top 5-8 direct competitors for ...`;
const result = await generateObject({ model, schema, prompt });
```

after:

```typescript
// services/competitor-discovery.service.ts
import promptTemplate from "@/core/prompts/brand/competitor-discovery.md";
import { competitorListSchema } from "@/core/schemas/competitor.schema";
import { anthropicAdapter } from "@/integrations/anthropic";

export async function discoverCompetitors(input: CompetitorDiscoveryInput) {
  const prompt = format(promptTemplate, input);
  const { object } = await anthropicAdapter.generateObject(prompt, competitorListSchema);
  return object.competitors;
}
```

The orchestrator just does:

```typescript
export async function analyzeBrand(opts) {
  const comps   = await discoverCompetitors(opts);
  const profiles = await Promise.all(comps.map(analyzeCompetitorProfile));
  ...
}
```

---

### 4. Concurrency & cost sanity (positioning file was serial)

```typescript
import pLimit from "p-limit";
const limit = pLimit(3); // max three Anthropic calls in flight

const profiles = await Promise.allSettled(
  competitors.map(c => limit(() => analyzeCompetitorProfile(c)))
);
```

Add a withCache wrapper (Redis/Upstash) around every expensive adapter to kill duplicate token spend.

---

### 5. Enforce the new world order
- ESLint max-lines, boundaries plugin:

```javascript
// .eslintrc
"boundaries/elements": [
  { "type": "core", "pattern": "packages/ai/core" },
  { "type": "integrations", "pattern": "packages/ai/integrations" },
  { "type": "services", "pattern": "packages/ai/**/services" }
],
"boundaries/ignore": ["**/*.test.ts"]
```

- Husky pre-commit rejects files > 400 lines or prompts embedded in .ts.
- README in every folder: "What belongs here, what never belongs here."

---

### 6. Quick win script (bash) to explode giant files

```bash
mkdir -p packages/ai/domains/marketing/services
mv brand-extractor.ts packages/ai/domains/marketing/services/extractor.service.ts
mv brand-sentiment.ts packages/ai/domains/marketing/services/sentiment.service.ts
mv brand-positioning.ts packages/ai/domains/marketing/orchestrators/positioning-orchestrator.ts
mv enrichment.service.ts packages/ai/integrations/clearbit/clearbit.adapter.ts

# Then adjust imports with:
npx ts-morph renameImports --glob "packages/ai/**/*.ts" \
  --from "./brand-positioning" --to "@/domains/marketing/orchestrators/positioning-orchestrator"
```

---

### 7. Keep example-usage.ts as integration test

```typescript
test("brand positioning end-to-end", async () => {
  const result = await analyzeBrand({
    brandName: "Stripe",
    industry: "payments",
  });
  expect(result.analysis.positioningMap.dimensions.length).toBe(2);
});
```

Run daily in CI to ensure adapters + prompts didn't drift.

---

### Bottom line

Those files are over-engineered because they bundle prompts, schemas, infra, and orchestration in one pot.
Slice them by concern, add caching + concurrency, enforce with ESLint, and the chaos disappears.

If you want me to refactor one of them live, just tell me which file to start with and I'll spit out the patch. 🛠️

