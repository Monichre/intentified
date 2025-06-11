# Core: *Zero external knowledge of your domains *
 
 ├── core/                
    │   ├── llm/             # Model adapters & shared clients (OpenAI, Anthropic…)
    │   ├── schemas/         # Re-usable Zod & JSONSchema defs
    │   ├── prompts/         # Tiny, pure text prompt strings (no logic)
    │   └── utils/           # Generic helpers, never import domain code