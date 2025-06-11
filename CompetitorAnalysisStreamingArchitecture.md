# Competitor Analysis Streaming Architecture

## Overview

This document explains the streaming architecture for competitor analysis using Vercel AI SDK's RSC (React Server Components) API with `createStreamableValue`.

## Architecture Decision

We use **`createStreamableValue`** from the RSC API for the following reasons:

1. **Data Streaming**: We're streaming structured data (progress updates, results, errors), not UI components
2. **Type Safety**: Strong typing with `CompetitorAnalysisStreamUpdate` union type
3. **Separation of Concerns**: Server handles data processing, client handles UI rendering
4. **Flexibility**: Multiple UI components can consume the same data stream

## Key Components

### 1. Server Action (`competitor-analysis.ts`)

```typescript
"use server"; // REQUIRED - marks this as a server-only file

import { createStreamableValue } from "ai/rsc"; // Server-only import

export async function streamCompetitorAnalysis(
  request: CompetitorAnalysisRequest,
) {
  const stream = createStreamableValue<CompetitorAnalysisStreamUpdate>();
  
  // Process asynchronously and stream updates
  (async () => {
    // Stream progress updates
    stream.update({ type: "progress", progress: {...} });
    
    // Stream final result
    stream.update({ type: "result", result: {...} });
    
    // Close the stream
    stream.done();
  })();

  return stream.value;
}
```

### 2. Client Hook (`use-competitor-analysis-stream.ts`)

```typescript
"use client"; // REQUIRED - marks this as a client component

import { readStreamableValue } from "ai/rsc"; // Client-only import
import { streamCompetitorAnalysis } from "@/app/actions/competitor-analysis";

export function useCompetitorAnalysisStream() {
  const analyze = async (request: CompetitorAnalysisRequest) => {
    const stream = await streamCompetitorAnalysis(request);
    
    // Read stream updates on the client
    for await (const update of readStreamableValue(stream)) {
      // Handle updates
    }
  };
  
  return { analyze, /* state */ };
}
```

## Import Rules

### Server-Side Imports
- `createStreamableValue` - Server-only, creates streams
- `createStreamableUI` - Server-only, creates UI streams

### Client-Side Imports
- `readStreamableValue` - Client-only, reads data streams
- `readStreamableUI` - Client-only, reads UI streams

## Common Errors and Solutions

### Error: "createStreamableValue was not found"
**Cause**: Trying to import server-only functions in client components
**Solution**: 
1. Add `"use server"` directive to server action files
2. Only import `readStreamableValue` in client components
3. Import server actions normally (they're just async functions to the client)

### Error: "Cannot access server-side function"
**Cause**: Missing `"use server"` directive
**Solution**: Add `"use server"` at the top of server action files

## Alternative Approaches

### 1. Using `createStreamableUI`
```typescript
// Server: Stream React components
const stream = createStreamableUI();
stream.update(<ProgressBar value={25} />);
stream.done(<Results data={result} />);

// Client: Render streamed components
const streamedUI = await serverAction();
return <div>{streamedUI}</div>;
```

**When to use**: When you want server-rendered UI updates

### 2. Using Vercel AI SDK UI (`useChat`, `useCompletion`)
```typescript
// Client: Using AI SDK hooks
const { messages, isLoading } = useChat({
  api: '/api/chat',
  streamProtocol: 'data',
});
```

**When to use**: For chat interfaces and AI completions

## Best Practices

1. **Always mark server actions** with `"use server"`
2. **Separate type imports** from function imports
3. **Handle errors gracefully** in both server and client
4. **Close streams properly** with `stream.done()`
5. **Use proper loading states** in the UI
6. **Type your stream updates** with discriminated unions

## Data Flow Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Client Hook    │────▶│  Server Action   │────▶│  AI Service     │
│                 │     │                  │     │                 │
│ readStreamable  │◀────│ createStreamable │◀────│ Progress/Result │
│     Value       │     │      Value       │     │    Callbacks    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                                                    
        ▼                                                    
┌─────────────────┐                                         
│  UI Component   │                                         
│                 │                                         
│ Renders based   │                                         
│ on stream data  │                                         
└─────────────────┘                                         
```

## Example Implementation

See the following files for a complete implementation:
- Server Action: `apps/intentified/src/app/actions/competitor-analysis.ts`
- Client Hook: `apps/intentified/src/hooks/use-competitor-analysis-stream.ts`
- Example Component: `apps/intentified/src/components/competitor-analysis-example.tsx` 