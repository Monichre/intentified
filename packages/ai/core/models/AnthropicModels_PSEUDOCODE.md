# AnthropicModels_PSEUDOCODE.md

## Purpose
- Update the Anthropic model registry to include:
  - Claude 3.7 (enabled)
  - Sonnet-4 (enabled)
  - v0 (from Vercel AI SDK UI, enabled, provider: 'Vercel')
- Ensure extensibility, type safety, and compatibility with context7 MCP.

## Steps

1. Import the `LLModels` type from model-types.
2. Define a constant array `AnthropicModels` of type `LLModels[]`.
3. For each model, define:
   - `id`: unique string identifier (e.g., 'claude-3-7-sonnet-latest', 'sonnet-4', 'v0')
   - `name`: display name (e.g., 'Claude 3.7 Sonnet', 'Sonnet-4', 'Vercel v0')
   - `provider`: string (e.g., 'Anthropic', 'Vercel')
   - `providerId`: string (e.g., 'anthropic', 'vercel')
   - `status`: 'enabled' or 'disabled'
   - `capability`: array of strings (e.g., ['text', 'tool', 'files', 'images'])
4. Add/replace models:
   - Claude 3.7 Sonnet (enabled)
   - Sonnet-4 (enabled)
   - v0 (enabled, provider: 'Vercel', providerId: 'vercel')
5. Export the array as `AnthropicModels` using `as const` for type safety.
6. If v0 is not Anthropic, consider exporting it separately or in a unified model registry.
7. Ensure the structure is compatible with context7 MCP (modular, extensible, type-safe).

## Example Structure

```typescript
export const AnthropicModels: LLModels[] = [
  {
    id: 'claude-3-7-sonnet-latest',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    providerId: 'anthropic',
    status: 'enabled',
    capability: ['text', 'tool', 'files', 'images'],
  },
  {
    id: 'sonnet-4',
    name: 'Sonnet-4',
    provider: 'Anthropic',
    providerId: 'anthropic',
    status: 'enabled',
    capability: ['text', 'tool', 'files', 'images'],
  },
  {
    id: 'v0',
    name: 'Vercel v0',
    provider: 'Vercel',
    providerId: 'vercel',
    status: 'enabled',
    capability: ['text', 'tool', 'files', 'images'],
  },
] as const;
```

// If v0 is not Anthropic, export it in a separate file or a unified registry. 