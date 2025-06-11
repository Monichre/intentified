## ✨ Refactor Status: AI/Enrichment Platform (2024-06-09)

### Overview
This document tracks the ongoing modularization and refactor of the core AI/enrichment pipeline according to principles in `AGENTS.md`:

- Move from "God-file" orchestrators to clean, domain-driven modules
- Ensure orchestration, phase/pipeline logic, and types/schemas are split up cleanly by concern
- Expose public surface area via re-exports for API/frontend stability

---

## 🗺️ Current Workspace Architecture

### Mermaid Diagram (Domain-level Relationships)

```mermaid
graph TD
    FE_API([API / FE])
    INDEX([@repo/ai index.ts])
    ENRICHMENT_ORCH([enrichment/orchestrator])
    ANALYSIS([domains/analysis/analysis.service.ts])
    ENRICHMENT([domains/enrichment/enrichment.service.ts])
    MARKETING([domains/marketing])
    BRANDING([domains/branding])
    SCHEMAS([core/schemas/enrichment.schema.ts])
    PROMPTS([core/prompts/*])
    INTEGRATIONS([integrations/*])
    
    FE_API -->|imports| INDEX
    INDEX -->|re-exports| ENRICHMENT_ORCH
    INDEX -->|re-exports| ANALYSIS
    ENRICHMENT_ORCH -->|calls| ENRICHMENT
    ENRICHMENT_ORCH -->|calls| ANALYSIS
    ENRICHMENT_ORCH -->|calls| MARKETING
    ENRICHMENT_ORCH -->|calls| BRANDING
    ENRICHMENT -->|uses types| SCHEMAS
    ENRICHMENT -->|calls| INTEGRATIONS
    ENRICHMENT -->|uses prompts| PROMPTS
    ANALYSIS -->|uses types| SCHEMAS
    ANALYSIS -->|calls| INTEGRATIONS
    ANALYSIS -->|uses prompts| PROMPTS
    MARKETING -->|calls| INTEGRATIONS
    BRANDING -->|calls| INTEGRATIONS
```

---

### ASCII/Markdown Architecture

```
API/FE  →  index.ts  →  orchestrator.service.ts (enrichment)
                              ↓
              ┌───────────────┴───────────────┬───────────────┬───────────────┐
              ↓                               ↓               ↓               ↓
    enrichment.service.ts   analysis.service.ts   marketing/    branding/
         |                        |              ...            ...
    (phase logic)            (analysis logic)
        |                        |
    integrations/*           core/schemas/    core/prompts/
```

---

## 📂 File/Module Ownership
| Module                                 | Domain/Responsibility        |
|----------------------------------------|-----------------------------|
| domains/enrichment/orchestrator.service | Pipeline Orchestration      |
| domains/enrichment/enrichment.service   | Enrichment phase logic      |
| domains/analysis/analysis.service.ts    | Analytical routines         |
| domains/marketing/                     | Marketing/positioning       |
| domains/branding/                      | Branding enrichment         |
| core/schemas/enrichment.schema.ts       | Shared types/schemas        |
| core/prompts/                          | Prompts (PLAIN .md/.ts)     |
| integrations/                          | Adapter/3rd party glue      |

---

## 🚦 What’s Done / What’s Next

### ✔️ Done
- [x] Extracted all enrichment schemas/types to `core/schemas/enrichment.schema.ts`
- [x] Moved `analyzeCompetitiveLandscape` to `domains/analysis/analysis.service.ts`, re-exported in main index
- [x] Modularized `enrichCompany` pipeline to `domains/enrichment/orchestrator.service.ts`
- [x] Updated exports in `index.ts` for API stability
- [x] **Restored full legacy orchestration/service code in `domains/enrichment/enrichment.service.ts` for API/FE stability, pending full client migration**

### ⏳ In Progress / To Do
- [ ] **Phase Extracts:** Move remaining specialized phase logic out of `enrichment.service.ts` into domain files (esp. research, marketing, branding), after all onboarding/competitive analysis clients are migrated.
- [ ] **Research Split:** Create a `domains/research/` for distinct research/discovery/aggregation helpers.
- [ ] **Branding/Marketing Split:** Modularize any remaining branding/marketing logic into their domains.
- [ ] **Prompts:** Move all multi-line/system/LLM prompts to Markdown in `core/prompts` if any left in .ts files.
- [ ] **Adapters:** Ensure all direct API/HTTP/model calls are only in `/integrations/`, not in orchestrators/services.
- [ ] **README/Docs:** Update or add README.md per domain stating “What belongs here/what doesn’t”.
- [ ] **Tests:** Expand unit/integration tests for orchestrator (and in each service).
- [ ] **Deprecation Notices:** Mark old entrypoints as deprecated when ALL clients are migrated.
- [ ] **Double check all re-exports for API usage (e.g. apps/intentified) after every major refactor step.**

---

## 🚚 Key API Exports (Current as of this refactor)

- `enrichCompany` from `@repo/ai` (calls the full umbrella pipeline)
- `analyzeCompetitiveLandscape` from `@repo/ai` (modular competitor analysis)
- All types from `core/schemas/enrichment.schema.ts`

**Example usage:**
```ts
import { enrichCompany, analyzeCompetitiveLandscape, EnrichmentRequest } from '@repo/ai';
```

---

## 🧩 Key Next Moves
- Continue extracting phase logic: research, marketing, branding
- Move all LLM prompts out of `.ts` into `.md` prompt files for testability
- Strengthen and document all cross-domain dependencies
- Keep `/index.ts` as stable public API surface
