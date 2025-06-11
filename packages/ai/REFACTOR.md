# [Competitor Analysis Architecture](`mdc:CompetitorAnalysisStreamingArchitecture.md`)

---

## 1. **Refactor Streaming to AI SDK 5 Data Streams**

### **A. Replace all `ai/rsc` streaming with AI SDK 5 streaming primitives**

- Use `createDataStreamResponse` and `dataStream.writeData` for all streaming server actions.
- Remove all usage of `createStreamableValue` and similar legacy patterns.
- Ensure all progress, phase, and result updates are sent via `dataStream.writeData`.
- Use `dataStream.done()` to close the stream.

### **B. Example Refactor for a Streaming Handler**

**Before:**

```typescript
const stream = createStreamableValue<EnrichmentStreamUpdate>();
stream.update({ type: 'progress', ... });
stream.done();
return stream.value;
```

**After:**

```typescript
return createDataStreamResponse({
  execute: async dataStream => {
    dataStream.writeData({ type: 'progress', ... });
    dataStream.done();
  },
  onError: error => error instanceof Error ? error.message : String(error),
});
```

---

## 2. **Extend and Modularize Enrichment Services**

### **A. Modular Service Design**

- Each enrichment function (e.g., `enrichCompanySummary`, `enrichCompetitors`, `analyzeCompetitiveLandscape`) should be a named export in `enrichment.service.ts`.
- Each function should be pure, stateless, and accept all dependencies as parameters (for testability and agent use).

### **B. Example Modular Export**

```typescript
export async function enrichCompanySummary(request: EnrichmentRequest): Promise<EnrichmentResult> { ... }
export async function enrichCompetitors(request: EnrichmentRequest, summaryText?: string): Promise<EnrichmentResult> { ... }
export async function analyzeCompetitiveLandscape(request: CompetitorAnalysisRequest, onProgress?: (p: CompetitorAnalysisProgress) => void): Promise<CompetitorAnalysisResponse> { ... }
```

---

## 3. **Implement as AI Agent Tools in `@/agents/tools`**

### **A. Tool Pattern**

- Use the `tool` helper from `ai` to wrap each enrichment function as a tool.
- Define a Zod schema for each tool's parameters for type safety and validation.
- Each tool should call the corresponding service function and return the result.

### **B. Example Tool Implementation**

```typescript
import { tool } from "ai";
import { z } from "zod";
import { enrichCompanySummary } from "@/services/enrichment/enrichment.service";

export const enrichCompanySummaryTool = tool({
  description: "Enriches a company summary given a website URL.",
  parameters: z.object({
    websiteUrl: z.string().url(),
  }),
  execute: async ({ websiteUrl }) => {
    return await enrichCompanySummary({ websiteUrl });
  },
});
```

- Repeat for each enrichment/analysis function.

---

## 4. **Agent Integration**

- Import and register these tools in your agent's tool container (e.g., `@/agents/tools/root.ts`).
- This allows your AI agents to call these enrichment/analysis tools as part of their workflow.

---

## 5. **Documentation and Testing**

- Document each tool and service function (purpose, parameters, return type, usage example).
- Add or update tests to cover the new streaming and tool interfaces.

---

## 6. **Pseudocode for the Full Refactor**

**Filename:** `EnrichmentStreamingAndAgentTools_PSEUDOCODE.md`

```markdown
# Pseudocode: Enrichment Streaming and Agent Tool Refactor

## 1. Refactor Streaming Server Actions

For each streaming server action:
- Replace createStreamableValue with createDataStreamResponse.
- In the execute callback:
  - For each progress/phase/result update, call dataStream.writeData({...}).
  - On error, call dataStream.writeData({ type: 'error', error: ... }) and dataStream.done().
  - On completion, call dataStream.done().

## 2. Modularize Enrichment Service Functions

For each enrichment/analysis function:
- Export as a named async function.
- Accept all dependencies as parameters or use dependency injection.
- Return a typed result.

## 3. Implement as AI Agent Tools

For each service function:
- Create a tool in @/agents/tools.
- Use the tool helper from ai.
- Define a Zod schema for parameters.
- In execute, call the service function and return the result.

## 4. Register Tools with Agents

- Import all tools in @/agents/tools/root.ts.
- Add to the tool container for agent access.

## 5. Document and Test

- Write usage docs for each tool and service.
- Add/extend tests for streaming and tool execution.
```

---

## 7. **Why This Refactor Improves the Code**

- **Modernizes streaming**: Uses the latest, more flexible AI SDK 5 streaming protocol.
- **Improves modularity**: Each enrichment/analysis function is a standalone, testable unit.
- **Enables agent extensibility**: All enrichment/analysis logic is available as tools for AI agents.
- **Enhances maintainability**: Clear separation of concerns, type safety, and documentation.
- **Boosts testability**: Pure functions and tools are easy to mock and test.

---

## Next Steps

1. **Write and save the pseudocode as `EnrichmentStreamingAndAgentTools_PSEUDOCODE.md`.**
2. **Refactor the streaming server actions to use AI SDK 5.**
3. **Modularize and export all enrichment/analysis functions.**
4. **Implement and register tools for each function.**
5. **Document and test.**

---

**Would you like to review the pseudocode first, or proceed directly to implementation?**  
Let me know if you want to see a concrete example for a specific enrichment function/tool!

---

## modern AI/LLM codebases: **every enrichment/analysis capability should be both**

1. **A pure, type-safe service function** (for direct programmatic use in code, e.g., in server actions, API routes, or other business logic).
2. **A tool definition** (for use by AI agents, with Zod schema validation, description, and a standard `execute` interface).

This dual interface ensures:

- **Maximum reusability** (call in code, or expose to agents)
- **Type safety and validation** (via Zod schemas for tools)
- **Consistent documentation and discoverability** (tools are self-describing)
- **Easy testing and mocking** (pure functions for services, tools for agent integration tests)

---

## **Recommended Pattern**

### 1. **Service Function (Pure, Named Export)**

- Accepts typed input, returns a typed result (Promise).
- No side effects except what’s required for the operation.
- No dependency on agent/tool context.

```typescript
// packages/ai/services/enrichment/enrichment.service.ts
export async function enrichCompanySummary(request: EnrichmentRequest): Promise<EnrichmentResult> { ... }
export async function analyzeCompetitiveLandscape(request: CompetitorAnalysisRequest, onProgress?: (p: CompetitorAnalysisProgress) => void): Promise<CompetitorAnalysisResponse> { ... }
```

### 2. **Tool Definition (for Agent Use)**

- Wraps the service function.
- Exports a Zod schema for parameters.
- Provides a description for agent self-documentation.
- Implements an `execute` function that calls the service.

```typescript
// packages/ai/agents/tools/enrich-company.ts
import { tool } from "ai";
import { z } from "zod";
import { enrichCompanySummary } from "@/services/enrichment/enrichment.service";

export const enrichCompanySummaryTool = tool({
  description: "Enriches a company summary given a website URL.",
  parameters: z.object({
    websiteUrl: z.string().url(),
  }),
  execute: async ({ websiteUrl }) => {
    return await enrichCompanySummary({ websiteUrl });
  },
});
```

### 3. **Export Both for Consumption**

- **Service functions** are exported as named exports from the service module.
- **Tools** are exported as named exports from the tools module.
- **Optionally, export an array of all tools** for easy agent registration.

```typescript
// packages/ai/services/enrichment/index.ts
export * from "./enrichment.service";

// packages/ai/agents/tools/index.ts
export * from "./enrich-company";
export * from "./competitor-analysis";
// ...etc

export const enrichmentTools = [
  enrichCompanySummaryTool,
  analyzeCompetitiveLandscapeTool,
  // ...other tools
];
```

---

## **How to Use**

### **A. As a Service in Code**

```typescript
import { enrichCompanySummary } from "@repo/ai/services/enrichment";

const result = await enrichCompanySummary({ websiteUrl: "https://..." });
```

### **B. As a Tool in an Agent**

```typescript
import { enrichmentTools } from "@repo/ai/agents/tools";

agent.registerTools(enrichmentTools);
```

---

## **Summary Table**

| Use Case         | Import From                        | How to Use                        |
|------------------|------------------------------------|-----------------------------------|
| In code/service  | `@repo/ai/services/enrichment`     | `await enrichCompanySummary(...)` |
| In agent/tooling | `@repo/ai/agents/tools`            | `agent.registerTools([...])`      |

---

## **Why This Pattern?**

- **DRY**: No duplicated logic—service is the source of truth, tool is a wrapper.
- **Type-safe**: Zod schemas for agent input, TypeScript for service.
- **Composable**: Add new enrichments once, expose everywhere.
- **Testable**: Pure functions are easy to test; tools can be integration tested.
- **Discoverable**: Tools array can be introspected for agent capabilities.

---

## **Next Steps**

1. **Refactor all enrichment/analysis logic to follow this pattern.**
2. **For each service, create a corresponding tool.**
3. **Export both individually and as arrays for easy consumption.**
4. **Document usage in both contexts.**

---

**Would you like a concrete example for a specific enrichment function/tool, or a template for all?**  
Let me know if you want a code template for the array export or a sample agent registration!

---

# AI SDK 5 Streaming, Enrichment Services, and Agent Tooling Architecture

## Overview

This document describes the refactor and best practices for:

- Migrating all streaming logic to the [AI SDK 5 Data Stream protocol](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data)
- Modularizing enrichment/analysis services for both direct code use and agent tool consumption
- Implementing a dual interface: every enrichment capability is available as both a pure service and an agent tool

---

## 1. AI SDK 5 Streaming: Custom Data & Annotations

### **Why?**

- Enables streaming of progress, status, and custom data alongside model responses
- Standardizes how server actions communicate with the client (e.g., for use with `useChat`)

### **Key Primitives**

- `createDataStreamResponse`: Creates a streaming response for API routes
- `dataStream.writeData`: Streams custom data objects
- `dataStream.writeMessageAnnotation`: Attaches metadata to streamed messages
- `dataStream.writeSource`: Streams custom sources (e.g., URLs)
- `dataStream.done()`: Closes the stream

### **Example: Streaming Custom Data**

```typescript
import { openai } from '@ai-sdk/openai';
import { generateId, createDataStreamResponse, streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createDataStreamResponse({
    execute: dataStream => {
      dataStream.writeData('initialized call');

      const result = streamText({
        model: openai('gpt-4o'),
        messages,
        onChunk() {
          dataStream.writeMessageAnnotation({ chunk: '123' });
        },
        onFinish() {
          dataStream.writeMessageAnnotation({
            id: generateId(),
            other: 'information',
          });
          dataStream.writeData('call completed');
        },
      });

      result.mergeIntoDataStream(dataStream);
    },
    onError: error => error instanceof Error ? error.message : String(error),
  });
}
```

### **Client Consumption**

- Use the `useChat` hook from `@ai-sdk/react` to access streamed data and annotations.
- Example:

  ```tsx
  const { data, messages } = useChat();
  ```

---

## 2. Dual Service/Tool Pattern for Enrichment & Analysis

### **Why?**

- **Reusability:** Service functions can be called directly in business logic or server actions.
- **Agent Integration:** Tools expose the same logic to LLM agents, with validation and descriptions.
- **Type Safety:** Zod schemas for agent input, TypeScript for service logic.
- **Testability:** Pure functions are easy to test; tools can be integration tested.

### **Pattern**

#### **A. Service Function (Pure, Named Export)**

```typescript
// packages/ai/services/enrichment/enrichment.service.ts
export async function enrichCompanySummary(request: EnrichmentRequest): Promise<EnrichmentResult> { ... }
export async function analyzeCompetitiveLandscape(request: CompetitorAnalysisRequest, onProgress?: (p: CompetitorAnalysisProgress) => void): Promise<CompetitorAnalysisResponse> { ... }
```

#### **B. Tool Definition (for Agent Use)**

```typescript
// packages/ai/agents/tools/enrich-company.ts
import { tool } from "ai";
import { z } from "zod";
import { enrichCompanySummary } from "@/services/enrichment/enrichment.service";

export const enrichCompanySummaryTool = tool({
  description: "Enriches a company summary given a website URL.",
  parameters: z.object({
    websiteUrl: z.string().url(),
  }),
  execute: async ({ websiteUrl }) => {
    return await enrichCompanySummary({ websiteUrl });
  },
});
```

#### **C. Export Both for Consumption**

```typescript
// packages/ai/services/enrichment/index.ts
export * from "./enrichment.service";

// packages/ai/agents/tools/index.ts
export * from "./enrich-company";
export * from "./competitor-analysis";
// ...etc

export const enrichmentTools = [
  enrichCompanySummaryTool,
  analyzeCompetitiveLandscapeTool,
  // ...other tools
];
```

---

## 3. Usage

### **A. As a Service in Code**

```typescript
import { enrichCompanySummary } from "@repo/ai/services/enrichment";
const result = await enrichCompanySummary({ websiteUrl: "https://..." });
```

### **B. As a Tool in an Agent**

```typescript
import { enrichmentTools } from "@repo/ai/agents/tools";
agent.registerTools(enrichmentTools);
```

---

## 4. Example: Streaming Competitor Analysis

**Server Action:**

```typescript
import { createDataStreamResponse } from 'ai';
import { analyzeCompetitiveLandscape } from '@/services/enrichment/enrichment.service';

export async function POST(req: Request) {
  const request = await req.json();

  return createDataStreamResponse({
    execute: async dataStream => {
      try {
        // Stream initial phase
        dataStream.writeData({ type: 'phase', phase: 'Initialization', ... });

        // Run analysis, streaming progress
        await analyzeCompetitiveLandscape(request, progress => {
          dataStream.writeData({ type: 'progress', ...progress });
        });

        // Stream final result
        dataStream.writeData({ type: 'result', ...finalResult });
        dataStream.done();
      } catch (error) {
        dataStream.writeData({ type: 'error', error: error.message });
        dataStream.done();
      }
    },
    onError: error => error instanceof Error ? error.message : String(error),
  });
}
```

---

## 5. Why This Pattern?

- **DRY:** No duplicated logic—service is the source of truth, tool is a wrapper.
- **Type-safe:** Zod schemas for agent input, TypeScript for service.
- **Composable:** Add new enrichments once, expose everywhere.
- **Testable:** Pure functions are easy to test; tools can be integration tested.
- **Discoverable:** Tools array can be introspected for agent capabilities.

---

## 6. Pseudocode for the Full Refactor

**Filename:** `EnrichmentStreamingAndAgentTools_PSEUDOCODE.md`

```markdown
# Pseudocode: Enrichment Streaming and Agent Tool Refactor

## 1. Refactor Streaming Server Actions

For each streaming server action:
- Replace createStreamableValue with createDataStreamResponse.
- In the execute callback:
  - For each progress/phase/result update, call dataStream.writeData({...}).
  - On error, call dataStream.writeData({ type: 'error', error: ... }) and dataStream.done().
  - On completion, call dataStream.done().

## 2. Modularize Enrichment Service Functions

For each enrichment/analysis function:
- Export as a named async function.
- Accept all dependencies as parameters or use dependency injection.
- Return a typed result.

## 3. Implement as AI Agent Tools

For each service function:
- Create a tool in @/agents/tools.
- Use the tool helper from ai.
- Define a Zod schema for parameters.
- In execute, call the service function and return the result.

## 4. Register Tools with Agents

- Import all tools in @/agents/tools/root.ts.
- Add to the tool container for agent access.

## 5. Document and Test

- Write usage docs for each tool and service.
- Add/extend tests for streaming and tool execution.
```

---

## 7. Reference: AI SDK UI - Streaming Custom Data

> _See full notepad for code and usage patterns for `createDataStreamResponse`, `writeData`, `writeMessageAnnotation`, and client consumption with `useChat`._

---

## 8. Summary Table

| Use Case         | Import From                        | How to Use                        |
|------------------|------------------------------------|-----------------------------------|
| In code/service  | `@repo/ai/services/enrichment`     | `await enrichCompanySummary(...)` |
| In agent/tooling | `@repo/ai/agents/tools`            | `agent.registerTools([...])`      |

---

## 9. Next Steps

1. Refactor all enrichment/analysis logic to follow this pattern.
2. For each service, create a corresponding tool.
3. Export both individually and as arrays for easy consumption.
4. Document usage in both contexts.

---

**This document should be kept up to date as new enrichment/analysis capabilities are added.**  
For further details, see the [AI SDK 5 Streaming Data documentation](https://ai-sdk.dev/docs/ai-sdk-ui/streaming-data).

---
