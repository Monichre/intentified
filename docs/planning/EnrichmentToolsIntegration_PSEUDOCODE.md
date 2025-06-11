# Enrichment Tools Integration - Pseudocode

## Overview
Convert enrichment services from `packages/ai/services/enrichment/insights.ts` into proper Vercel AI SDK UI tools that can be used both programmatically and by AI agents.

## Architecture Pattern

### Dual Interface Pattern
```typescript
// Each enrichment capability has two interfaces:
// 1. Pure service function (for direct code use)
// 2. AI SDK tool (for agent use with Zod validation)

SERVICE_FUNCTION(params) -> result
AI_TOOL({
  description: "Human-readable description for AI agent",
  parameters: ZodSchema,
  execute: async (params) -> SERVICE_FUNCTION(params)
})
```

## Implementation Steps

### Step 1: Create enrichCompanyDataTool
```typescript
DEFINE enrichmentRequestSchema AS ZodSchema:
  - websiteUrl: string (URL validation)
  - enrichmentTypes: array of specific enrichment type enums
  - options: optional configuration object

DEFINE enrichmentResponseSchema AS ZodSchema:
  - company: basic company information
  - enrichmentResults: map of enrichment type to result data
  - metadata: analysis metadata (date, confidence, etc.)

CREATE enrichCompanyDataTool:
  description: "Enrich company data using multiple data sources and AI analysis"
  parameters: enrichmentRequestSchema
  execute: async function(params):
    TRY:
      CALL enrichment.enrichCompanyData(params)
      VALIDATE result against enrichmentResponseSchema
      RETURN validated result
    CATCH error:
      LOG error details
      RETURN structured error response with metadata
```

### Step 2: Create competitiveLandscapeAnalysisTool
```typescript
DEFINE competitiveLandscapeRequestSchema AS ZodSchema:
  - companyName: string (required)
  - websiteUrl: optional URL
  - industry: optional industry specification
  - includeMetrics: boolean (default true)
  - includeMarketShare: boolean (default true)
  - includeFunding: boolean (default true)
  - maxCompetitors: number (3-20, default 10)

DEFINE competitiveLandscapeResponseSchema AS ZodSchema:
  - targetCompany: company information
  - competitors: array of competitor data with metrics
  - marketAnalysis: industry and market insights
  - positioningInsights: strategic positioning data
  - metadata: analysis metadata

CREATE competitiveLandscapeAnalysisTool:
  description: "Analyze competitive landscape with market positioning insights"
  parameters: competitiveLandscapeRequestSchema
  execute: async function(params):
    TRY:
      CALL enrichment.analyzeCompetitiveLandscape(params)
      VALIDATE result against competitiveLandscapeResponseSchema
      RETURN validated result
    CATCH error:
      LOG error details
      RETURN structured error response with empty competitors array
```

### Step 3: Create Tools Index
```typescript
CREATE packages/ai/agents/tools/index.ts:
  EXPORT enrichmentTools = [enrichCompanyDataTool, competitiveLandscapeAnalysisTool]
  EXPORT researchTools = [existing research tools]
  EXPORT allTools = [...enrichmentTools, ...researchTools]
  
  EXPORT getToolsByCategory function for dynamic tool selection
  EXPORT all type definitions for external use
```

## Error Handling Strategy

### Graceful Degradation
```typescript
FOR each tool execute function:
  TRY:
    CALL underlying service
    VALIDATE response schema
    RETURN success result
  CATCH service error:
    LOG detailed error information
    RETURN structured error response:
      - Preserve input parameters
      - Set confidence to 0
      - Include error message
      - Provide empty/default data structure
      - Maintain schema compliance
```

### Validation Strategy
```typescript
FOR each tool:
  INPUT validation: Use Zod schema to validate parameters
  OUTPUT validation: Parse response through Zod schema
  SCHEMA compliance: Ensure all responses match expected structure
  TYPE safety: Export TypeScript types for external use
```

## Usage Patterns

### Direct Service Use (Programmatic)
```typescript
// In server actions, API routes, etc.
import { enrichment } from "@/services/enrichment/insights";

const result = await enrichment.enrichCompanyData({
  websiteUrl: "https://example.com",
  enrichmentTypes: ["basic-info", "competitors"]
});
```

### Agent Tool Use (AI Consumption)
```typescript
// In AI agent definitions
import { enrichCompanyDataTool } from "@/agents/tools";

const agent = createAgent({
  tools: [enrichCompanyDataTool],
  // ... other agent config
});
```

## Benefits

### Type Safety
- Zod schemas provide runtime validation
- TypeScript types exported for compile-time checking
- Consistent error handling across all tools

### Reusability
- Same functionality available for direct code use and AI agents
- Modular design allows selective tool inclusion
- Category-based tool organization

### Maintainability
- Single source of truth for each enrichment capability
- Centralized error handling patterns
- Consistent API surface across all tools

### Discoverability
- Self-documenting through Zod schema descriptions
- Centralized tool index for easy discovery
- Category-based organization for specific use cases

## Next Steps

1. Migrate existing streaming server actions to use these tools
2. Update AI agents to consume tools instead of direct service calls
3. Implement comprehensive error logging and monitoring
4. Add unit tests for each tool's execute function
5. Create integration tests for agent tool consumption 