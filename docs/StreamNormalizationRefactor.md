# Stream Interface Normalization Refactor

## Overview

This refactor normalizes the type interfaces between `useCompetitorAnalysisStream` and `useEnrichmentStream` hooks to create a consistent, reusable streaming architecture across the application.

## Architecture

### Core Generic Interface

```typescript
interface StreamState<TProgress, TResult, TMessageType extends string = string> {
  status: "idle" | "connecting" | "connected" | "processing" | "completed" | "error" | "disconnected";
  progress: TProgress | null;
  result: TResult | null; 
  error: string | null;
  messages: Array<{
    type: TMessageType;
    data: any;
    timestamp: string;
  }>;
}
```

### Specialized Implementations

#### Competitor Analysis Stream
```typescript
export type CompetitorAnalysisStreamState = StreamState<
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse,
  "progress" | "result" | "error"
>;
```

#### Enrichment Stream (with Marketing Intelligence)
```typescript
export type EnrichmentStreamState = StreamState<
  EnrichmentProgress,
  BulkEnrichmentResponse,
  "progress" | "marketing-intelligence" | "complete" | "error"
> & {
  marketingProgress: MarketingIntelligenceProgress | null;
};
```

## Key Benefits

### 1. **Type Safety**
- All progress and result values are properly typed as `T | null` (not `undefined`)
- Eliminates TypeScript errors from undefined value assignments
- Consistent message type discrimination

### 2. **Code Reusability**
- Shared `StreamState` interface reduces duplication
- Common patterns for state management across different stream types
- Consistent API surface for UI components

### 3. **Extensibility**
- Easy to add new stream types (e.g., marketing intelligence, SEO analysis)
- Generic interface supports any progress/result type combination
- Message types can be extended per stream specialization

### 4. **Maintainability**
- Centralized type definitions in `@/types/stream-types.ts`
- Single source of truth for streaming patterns
- Easier to update stream behavior across the application

## Files Modified

### Core Type Definitions
- **`apps/intentified/src/types/stream-types.ts`** - New shared type definitions
- **`apps/intentified/src/hooks/use-competitor-analysis-stream.ts`** - Refactored to use normalized types
- **`apps/intentified/src/hooks/use-enrichment-stream.ts`** - Refactored to use normalized types

### Service Layer
- **`packages/ai/services/enrichment/enrichment.service.ts`** - Updated interfaces and fixed type issues

## Breaking Changes

### State Interface Changes
- `progress` and `result` fields are now consistently `T | null` instead of `T | undefined`
- Message types are now more strictly typed with `as const` assertions
- Some function signatures updated for better type safety

### Migration Guide

**Before:**
```typescript
if (update.progress) {
  setState(prev => ({
    ...prev,
    progress: update.progress // Could be undefined
  }));
}
```

**After:**
```typescript
if (update.progress) {
  setState(prev => ({
    ...prev,
    progress: update.progress // Guaranteed to be T | null
  }));
}
```

## Stream Update Types

### Generic Pattern
```typescript
export type StreamUpdate<TProgress, TResult> =
  | { type: "progress"; progress: TProgress }
  | { type: "result"; result: TResult }
  | { type: "error"; error: string };
```

### Competitor Analysis
```typescript
export type CompetitorAnalysisStreamUpdateType = StreamUpdate<
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse
>;
```

### Enrichment Stream (Extended)
```typescript
export type EnrichmentStreamUpdateType = 
  | StreamUpdate<EnrichmentProgress, BulkEnrichmentResponse>
  | { type: "marketing"; marketingIntelligence: MarketingIntelligenceProgress };
```

## Usage Examples

### Competitor Analysis Hook
```typescript
const { state, connect, isProcessing } = useCompetitorAnalysisStream();

// Type-safe access to progress
if (state.progress) {
  const step = state.progress.currentStep; // number
  const message = state.progress.message; // string
}

// Type-safe access to results
if (state.result) {
  const competitors = state.result.competitiveLandscape.directCompetitors;
}
```

### Enrichment Hook
```typescript
const { state, connect, isProcessing } = useEnrichmentStream();

// Type-safe access to enrichment progress
if (state.progress) {
  const completed = state.progress.completedTypes; // EnrichmentType[]
}

// Type-safe access to marketing progress
if (state.marketingProgress) {
  const step = state.marketingProgress.currentStep; // number
}
```

## Future Enhancements

### 1. **Generic Stream Hook Factory**
```typescript
function createStreamHook<TRequest, TProgress, TResult>(
  streamAction: (req: TRequest) => Promise<StreamableValue>
) {
  // Return configured hook
}
```

### 2. **Stream Status Helpers**
```typescript
import { streamStatusHelpers } from "@/types/stream-types";

const isActive = streamStatusHelpers.isActive(state.status);
const hasError = streamStatusHelpers.hasError(state.status);
```

### 3. **Composable Stream Components**
```typescript
<StreamProvider hook={useCompetitorAnalysisStream}>
  <StreamProgress />
  <StreamResults />
  <StreamError />
</StreamProvider>
```

## Testing Considerations

- All hooks now have consistent interfaces for easier mocking
- Progress and result types are predictable across stream types
- Message arrays follow the same structure for testing event sequences

## Performance Optimizations

- Eliminated unnecessary re-renders from undefined value checks
- Consistent state shape reduces React reconciliation overhead
- Centralized type definitions improve TypeScript compilation

---

This normalization creates a robust foundation for streaming operations across the Intentified platform, enabling consistent user experiences and maintainable code patterns. 