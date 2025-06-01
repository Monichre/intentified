# AnthropicModels.md

## Overview
This document describes the architecture and data flow for the Anthropic model registry, now updated to include:
- **Claude 3.7 Sonnet** (Anthropic, enabled)
- **Sonnet-4** (Anthropic, enabled)
- **v0** (Vercel AI SDK UI, enabled)

## Key Modules
- **anthropic.ts**: Defines the `AnthropicModels` array, exporting all available Anthropic and related models.
- **model-types.ts**: Provides the `LLModels` type for type safety and extensibility.

## Architecture
- The model registry is a constant array of objects, each conforming to the `LLModels` type.
- Each model object includes:
  - `id`: Unique string identifier
  - `name`: Human-readable model name
  - `provider`: Model provider (e.g., 'Anthropic', 'Vercel')
  - `providerId`: Provider key (e.g., 'anthropic', 'vercel')
  - `status`: 'enabled' or 'disabled'
  - `capability`: Array of supported features (e.g., ['text', 'tool', 'files', 'images'])
- The registry is exported using `as const` for maximum type safety.

## Data Flow
- Consumers import `AnthropicModels` to access available models for selection, orchestration, or display.
- The registry is designed for easy extension—new models can be added by appending to the array.
- The structure is compatible with context7 MCP, supporting modular, type-safe, and extensible model management.

## Extensibility & Unified Registry
- The v0 model from Vercel AI SDK UI is included for convenience. If more non-Anthropic models are added, consider moving to a unified model registry (e.g., `AllLLMModels`) for cross-provider orchestration.
- The current structure allows for easy migration to a unified registry by merging arrays and updating imports.

## Example Usage
```typescript
import { AnthropicModels } from './anthropic';

const enabledModels = AnthropicModels.filter(m => m.status === 'enabled');
```

## Change Log
- **2024-06-XX**: Added Claude 3.7 Sonnet, Sonnet-4, and v0 (Vercel AI SDK UI). Updated for context7 MCP compatibility. 