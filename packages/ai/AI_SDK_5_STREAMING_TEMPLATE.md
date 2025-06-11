# AI SDK 5 Streaming Template

This document provides a template for migrating from legacy `ai/rsc` streaming to the new AI SDK 5 `createDataStreamResponse` pattern.

## Overview

The new pattern uses:
- `createDataStreamResponse` for server-side streaming
- `dataStream.writeData()` for streaming custom data
- `dataStream.done()` to close streams
- Standard fetch + ReadableStream on the client

## Template Implementation

### 1. Server Action (AI SDK 5 Streaming)

```typescript
"use server";

import { createDataStreamResponse } from "ai";
import { yourServiceFunction } from "../services/your-service";

export async function streamYourOperation(request: YourRequest) {
  return createDataStreamResponse({
    execute: async (dataStream) => {
      try {
        // Stream initialization
        dataStream.writeData({ 
          type: 'phase', 
          phase: 'initialization',
          message: 'Starting operation...',
          timestamp: new Date().toISOString()
        });

        let finalResult: YourResponse | null = null;

        // Run your service with progress streaming
        finalResult = await yourServiceFunction(request, (progress) => {
          dataStream.writeData({ 
            type: 'progress', 
            ...progress,
            timestamp: new Date().toISOString()
          });
        });

        // Stream final result
        dataStream.writeData({ 
          type: 'result', 
          data: finalResult,
          timestamp: new Date().toISOString()
        });

        // Close the stream
        dataStream.done();

      } catch (error) {
        // Stream error and close
        dataStream.writeData({ 
          type: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        dataStream.done();
      }
    },
    onError: (error) => error instanceof Error ? error.message : String(error),
  });
}
```

### 2. Client Component (React)

```typescript
"use client";

import { useState } from "react";

export function YourStreamingClient({ request, onComplete }) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const runOperation = async () => {
    setIsRunning(true);
    setProgress([]);
    setCurrentPhase('');
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/your-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Read the stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let lines = buffer.split('\\n');
        buffer = lines.pop()!;

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const data = JSON.parse(line);
            
            switch (data.type) {
              case 'phase':
                setCurrentPhase(data.phase);
                setProgress(prev => [...prev, data.message]);
                break;
                
              case 'progress':
                if (data.message) {
                  setProgress(prev => [...prev, data.message]);
                }
                break;
                
              case 'result':
                setResult(data.data);
                onComplete?.(data.data);
                break;
                
              case 'error':
                setError(data.error);
                break;
            }
          } catch (parseError) {
            console.warn('Failed to parse stream data:', parseError);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <button onClick={runOperation} disabled={isRunning}>
        {isRunning ? 'Running...' : 'Start Operation'}
      </button>
      
      {currentPhase && <div>Phase: {currentPhase}</div>}
      
      {progress.map((msg, i) => (
        <div key={i}>{msg}</div>
      ))}
      
      {error && <div className="error">{error}</div>}
      {result && <div className="result">{JSON.stringify(result)}</div>}
    </div>
  );
}
```

### 3. API Route Integration

```typescript
// app/api/your-endpoint/route.ts
import { streamYourOperation } from "@/packages/ai/actions/stream-your-operation";

export async function POST(req: Request) {
  try {
    const request = await req.json();
    return streamYourOperation(request);
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Migration Checklist

### From Legacy `ai/rsc` Pattern:

- [ ] Replace `createStreamableValue()` with `createDataStreamResponse()`
- [ ] Replace `stream.update()` with `dataStream.writeData()`
- [ ] Replace `stream.done()` with `dataStream.done()`
- [ ] Remove `getMutableAIState` and `streamUI` if not needed
- [ ] Update client to use fetch + ReadableStream instead of AI SDK hooks

### Service Function Requirements:

- [ ] Service function must be pure and accept progress callback
- [ ] Progress callback should be optional: `onProgress?: (progress: T) => void`
- [ ] Service should return typed results
- [ ] All errors should be caught and handled gracefully

### Type Safety:

- [ ] Define stream data types as discriminated unions
- [ ] Include timestamps for debugging
- [ ] Use proper error types

## Benefits of New Pattern

1. **Better Performance**: Direct streaming without React Server Components overhead
2. **Framework Agnostic**: Works with any frontend framework
3. **Type Safety**: Full TypeScript support for streaming data
4. **Error Handling**: Standardized error streaming
5. **Debugging**: Built-in timestamps and structured data

## Example Files

See the competitive analysis implementation:
- `actions/stream-competitive-analysis.ts` - Server action
- `actions/competitive-analysis-client.tsx` - React client
- `actions/api-route-example.ts` - API route integration

## Next Steps

1. Apply this pattern to other streaming services
2. Update existing `ai/rsc` implementations
3. Add proper Zod validation for stream data types
4. Consider adding retry logic for failed streams