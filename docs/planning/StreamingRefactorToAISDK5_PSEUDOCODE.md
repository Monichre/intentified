# Pseudocode: Streaming Refactor to AI SDK 5 Data Streams

## Overview
Refactor all streaming logic from ai/rsc patterns to AI SDK 5 data streaming primitives, implementing dual service/tool pattern for enrichment functions.

## 1. Streaming Pattern Changes

### A. Replace createStreamableValue with createDataStreamResponse

**Current Pattern (ai/rsc):**
```typescript
const stream = createStreamableValue<EnrichmentStreamUpdate>();
stream.update({ type: 'progress', phase: 'analyzing', progress: 25 });
stream.update({ type: 'result', data: result });
stream.done();
return stream.value;
```

**New Pattern (AI SDK 5):**
```typescript
return createDataStreamResponse({
  execute: async dataStream => {
    dataStream.writeData({ type: 'progress', phase: 'analyzing', progress: 25 });
    dataStream.writeData({ type: 'result', data: result });
    dataStream.done();
  },
  onError: error => error instanceof Error ? error.message : String(error),
});
```

### B. Error Handling Pattern
```typescript
// In execute callback:
try {
  // ... streaming logic
  dataStream.done();
} catch (error) {
  dataStream.writeData({ type: 'error', error: error.message });
  dataStream.done();
}
```

## 2. Service Modularization

### A. Extract Pure Service Functions
Create `packages/ai/services/enrichment/pure-services.ts`:

```typescript
// Pure, stateless functions for enrichment capabilities
export async function enrichCompanySummary(request: EnrichmentRequest): Promise<EnrichmentResult>
export async function enrichCompetitors(request: EnrichmentRequest, summaryText?: string): Promise<EnrichmentResult>
export async function enrichMindMap(request: EnrichmentRequest): Promise<EnrichmentResult>
export async function analyzeCompetitiveLandscape(request: CompetitorAnalysisRequest, onProgress?: (progress: CompetitorAnalysisProgress) => void): Promise<CompetitorAnalysisResponse>

// Helper function for wrapping results
export function wrapEnrichmentResult(data: any, type: string): EnrichmentResult
```

### B. Service Function Characteristics
- Accept all dependencies as parameters
- Return typed results
- No side effects except required operations
- Support optional progress callbacks
- Pure and testable

## 3. Tool Creation

### A. Create AI Agent Tools
For each service function, create corresponding tool in `packages/ai/agents/tools/`:

```typescript
// enrich-company-data-tool.ts
export const enrichCompanySummaryTool = tool({
  description: "Enriches company summary from website URL",
  parameters: z.object({
    websiteUrl: z.string().url(),
    // ... other parameters
  }),
  execute: async (params) => {
    return await enrichCompanySummary(params);
  },
});

// competitive-analysis-tool.ts
export const analyzeCompetitiveLandscapeTool = tool({
  description: "Analyzes competitive landscape for a company",
  parameters: z.object({
    companyName: z.string(),
    websiteUrl: z.string().url().optional(),
    // ... other parameters
  }),
  execute: async (params) => {
    return await analyzeCompetitiveLandscape(params);
  },
});
```

### B. Tool Export Pattern
```typescript
// packages/ai/agents/tools/index.ts
export * from './enrich-company-data-tool';
export * from './competitive-analysis-tool';

export const enrichmentTools = [
  enrichCompanySummaryTool,
  enrichCompetitorsTools,
  enrichMindMapTool,
  analyzeCompetitiveLandscapeTool,
];
```

## 4. Streaming Server Actions Refactor

### A. Company Enrichment Streaming
File: `apps/intentified/src/app/actions/enrichment/stream-enrich-company.ts`

```typescript
export async function streamEnrichCompany(request: EnrichmentRequest) {
  return createDataStreamResponse({
    execute: async dataStream => {
      try {
        // Phase 1: Company Summary
        dataStream.writeData({ type: 'phase', phase: 'Company Summary', progress: 0 });
        const summaryResult = await enrichCompanySummary(request);
        dataStream.writeData({ type: 'progress', phase: 'Company Summary', progress: 33, result: summaryResult });

        // Phase 2: Competitors
        dataStream.writeData({ type: 'phase', phase: 'Competitors', progress: 33 });
        const competitorsResult = await enrichCompetitors(request, summaryResult.data);
        dataStream.writeData({ type: 'progress', phase: 'Competitors', progress: 66, result: competitorsResult });

        // Phase 3: Mind Map
        dataStream.writeData({ type: 'phase', phase: 'Mind Map', progress: 66 });
        const mindMapResult = await enrichMindMap(request);
        dataStream.writeData({ type: 'progress', phase: 'Mind Map', progress: 100, result: mindMapResult });

        // Final result
        dataStream.writeData({ 
          type: 'complete', 
          results: {
            summary: summaryResult,
            competitors: competitorsResult,
            mindMap: mindMapResult
          }
        });
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

### B. Competitor Analysis Streaming
File: `apps/intentified/src/app/actions/ai/stream-competitor-analysis.ts`

```typescript
export async function streamCompetitorAnalysis(request: CompetitorAnalysisRequest) {
  return createDataStreamResponse({
    execute: async dataStream => {
      try {
        const result = await analyzeCompetitiveLandscape(request, (progress) => {
          dataStream.writeData({ type: 'progress', ...progress });
        });
        
        dataStream.writeData({ type: 'result', data: result });
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

## 5. API Route Updates

### A. Simplify API Routes
Remove complex SSE handling, use streaming server actions directly:

```typescript
// apps/intentified/src/app/api/intelligence/enrich/stream/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  return streamEnrichCompany(body);
}

// apps/intentified/src/app/api/intelligence/competitor-analysis/stream/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  return streamCompetitorAnalysis(body);
}
```

## 6. Client-Side Integration

### A. Update useChat Usage
```typescript
// In React components
const { data, messages, isLoading } = useChat({
  api: '/api/intelligence/enrich/stream',
});

// Access streamed data
useEffect(() => {
  if (data) {
    const latestData = data[data.length - 1];
    if (latestData.type === 'progress') {
      setProgress(latestData.progress);
    } else if (latestData.type === 'result') {
      setResult(latestData.data);
    }
  }
}, [data]);
```

## 7. Testing Strategy

### A. Service Function Tests
```typescript
// Test pure service functions
describe('enrichCompanySummary', () => {
  it('should return enriched company data', async () => {
    const result = await enrichCompanySummary({ websiteUrl: 'https://example.com' });
    expect(result).toMatchObject({ type: 'summary', data: expect.any(Object) });
  });
});
```

### B. Tool Integration Tests
```typescript
// Test tool execution
describe('enrichCompanySummaryTool', () => {
  it('should execute and return result', async () => {
    const result = await enrichCompanySummaryTool.execute({ websiteUrl: 'https://example.com' });
    expect(result).toBeDefined();
  });
});
```

### C. Streaming Tests
```typescript
// Test streaming server actions
describe('streamEnrichCompany', () => {
  it('should stream progress and results', async () => {
    const response = await streamEnrichCompany({ websiteUrl: 'https://example.com' });
    // Test streaming response
  });
});
```

## 8. Documentation Updates

### A. Service Documentation
- Document each service function's purpose, parameters, and return type
- Include usage examples for both direct calls and tool usage
- Document error handling patterns

### B. Tool Documentation
- Document tool descriptions and parameter schemas
- Include agent integration examples
- Document tool registration patterns

## 9. Migration Checklist

- [ ] Create pure service functions in `packages/ai/services/enrichment/pure-services.ts`
- [ ] Create corresponding tools in `packages/ai/agents/tools/`
- [ ] Refactor streaming server actions to use `createDataStreamResponse`
- [ ] Update API routes to use new streaming pattern
- [ ] Update client-side code to use `useChat` with data streaming
- [ ] Add comprehensive tests for services, tools, and streaming
- [ ] Update documentation
- [ ] Remove deprecated ai/rsc streaming code

## 10. Benefits of This Refactor

- **Modern Streaming**: Uses latest AI SDK 5 data streaming protocol
- **Dual Interface**: Every capability available as both service and tool
- **Type Safety**: Zod schemas for tools, TypeScript for services
- **Testability**: Pure functions are easy to test and mock
- **Modularity**: Clear separation of concerns
- **Agent Integration**: All capabilities available to AI agents
- **Maintainability**: Consistent patterns across the codebase 