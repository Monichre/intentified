<pre>
packages/
└── ai/
    ├── core/                # Zero external knowledge of your domains
    │   ├── llm/             # Model adapters & shared clients (OpenAI, Anthropic…)
    │   ├── schemas/         # Re-usable Zod & JSONSchema defs
    │   ├── prompts/         # Tiny, pure text prompt strings (no logic)
    │   └── utils/           # Generic helpers, never import domain code
    │
    ├── domains/             # “Business” problems, one folder per bounded context
    │   ├── competitive-analysis/
    │   │   ├── tool.ts      # Thin adapter → domain service
    │   │   ├── service.ts   # Pure logic, unit-testable
    │   │   ├── types.ts
    │   │   └── tests/
    │   └── …
    │
    ├── agents/              # Runtime glue that orchestrates tools
    │   ├── base-agent.ts
    │   ├── agent-factory.ts
    │   └── profiles/        # Declarative JSON / TS blueprints
    │
    ├── workflows/           # Multi-step pipelines (RAG, crawl-analyze-summarize…)
    │   └── restaurant-onboarding.workflow.ts
    │
    ├── infra/               # Anything that touches the outside world
    │   ├── storage/         # Pinecone, Supabase, S3, Redis …
    │   └── browser-automation/  # Playwright/Selenium stuff
    │
    └── index.ts             # Barrel exports with <10 lines, nothing else
</pre>
