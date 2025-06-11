# Competitor Analysis Integration

## Overview

The competitor analysis feature is now fully integrated with the enrichment service's `analyzeCompetitiveLandscape` function. This provides a real-time streaming interface for comprehensive competitive intelligence gathering using the Vercel AI SDK UI's streaming primitives.

## Architecture

### Data Flow

```
1. User Input (CompetitorAnalysisFlow)
   ↓
2. Server Action (streamCompetitorAnalysis)
   ↓
3. Enrichment Service (analyzeCompetitiveLandscape)
   ↓
4. Stream Progress & Results (Vercel AI SDK Streamables)
   ↓
5. UI Updates (useCompetitorAnalysisStream hook)
```

### Key Components

#### 1. **Server Action** (`apps/intentified/src/app/actions/stream-competitor-analysis.ts`)
- Creates a Vercel AI SDK streamable value
- Instantiates the enrichment service
- Calls `analyzeCompetitiveLandscape` with progress callbacks
- Streams progress updates and final results using `streamableValue`

#### 2. **React Hook** (`apps/intentified/src/hooks/use-competitor-analysis-stream.ts`)
- Uses normalized `StreamState` interface for type safety
- Consumes stream with `readStreamableValue` from AI SDK
- Provides `connect` method to start analysis
- Handles progress updates, results, and errors with proper typing
- Maintains message history for debugging

#### 3. **UI Component** (`apps/intentified/src/components/ai-form-flow/competitor-analysis-flow.tsx`)
- Uses `MultiStepForm` for user input collection
- Integrates with the streaming hook
- Displays real-time progress during analysis
- Shows comprehensive results upon completion

#### 4. **Enrichment Service** (`packages/ai/services/enrichment/enrichment.service.ts`)
- `analyzeCompetitiveLandscape` function performs the actual analysis
- Orchestrates multiple enrichment types:
  - Basic company info
  - Company summary with screenshot
  - Competitor identification
  - Market intelligence gathering
  - Mind map generation
- Provides structured progress updates

## Data Models

### Request Structure
```typescript
interface CompetitorAnalysisRequest {
  websiteUrl: string;
  companyName?: string;
  industry?: string;
  focusAreas?: ('market-position' | 'strengths' | 'opportunities')[];
  skipScreenshot?: boolean;
}
```

### Normalized Stream State
```typescript
export type CompetitorAnalysisStreamState = StreamState<
  CompetitorAnalysisProgress,
  CompetitorAnalysisResponse,
  "progress" | "result" | "error"
>;
```

### Response Structure
```typescript
interface CompetitorAnalysisResponse {
  websiteUrl: string;
  requestId: string;
  company: {
    name: string;
    summary: string;
    positioning: string;
    screenshot?: string;
  };
  competitiveLandscape: {
    directCompetitors: Array<{
      name: string;
      url: string;
      description: string;
      strengths: string[];
    }>;
    marketPosition: {
      rank: string;
      marketShare?: string;
      growthTrend?: string;
    };
    strengths: string[];
    opportunities: string[];
  };
  insights: {
    differentiators: string[];
    recommendations: string[];
    keyTakeaways: string[];
  };
  summary: {
    totalAnalyzed: number;
    successful: number;
    failed: number;
    totalDuration: number;
  };
}
```

## Usage Examples

### 1. Basic Usage in a Component
```typescript
import { CompetitorAnalysisFlow } from "@/components/ai-form-flow/competitor-analysis-flow";

function MyComponent() {
  const handleComplete = (analysis: CompetitorAnalysisResponse) => {
    console.log("Analysis complete:", analysis);
    // Process results...
  };

  return (
    <CompetitorAnalysisFlow
      onComplete={handleComplete}
      className="max-w-2xl mx-auto"
    />
  );
}
```

### 2. Direct Hook Usage
```typescript
import { useCompetitorAnalysisStream } from "@/hooks/use-competitor-analysis-stream";

function MyCustomComponent() {
  const { connect, state, isProcessing, isCompleted } = useCompetitorAnalysisStream();

  const startAnalysis = async () => {
    await connect({
      websiteUrl: "https://example.com",
      companyName: "Example Corp",
      industry: "Technology",
      onProgress: (progress) => {
        console.log(`Step ${progress.currentStep}/${progress.totalSteps}: ${progress.message}`);
      },
      onComplete: (result) => {
        console.log("Analysis complete!", result);
      },
      onError: (error) => {
        console.error("Analysis failed:", error);
      }
    });
  };

  return (
    <div>
      <button onClick={startAnalysis} disabled={isProcessing}>
        {isProcessing ? "Analyzing..." : "Start Analysis"}
      </button>
      {state.progress && (
        <p>{state.progress.message}</p>
      )}
    </div>
  );
}
```

### 3. Integration with Multi-Step Form
```typescript
<MultiStepForm
  steps={COMPETITOR_ANALYSIS_STEPS}
  mode="competitor-analysis"
  onComplete={handleComplete}
  streamHook="competitor-analysis"
  streamOptions={{
    onProgress: (progress) => console.log("Progress:", progress),
    onComplete: (result) => console.log("Complete:", result),
    onError: (error) => console.error("Error:", error),
  }}
/>
```

## Progress Tracking

The analysis provides detailed progress updates through the following stages:

1. **Initialization** - Setting up the analysis
2. **Basic Info & Website Content** - Scraping main and sub-pages
3. **Company Summary** - Understanding positioning with optional screenshot
4. **Competitor Identification** - Finding direct competitors
5. **Market Intelligence** - Gathering recent news and context
6. **Competitive Positioning** - Analyzing market position and insights

Each stage reports:
- `currentStep`: Current step number
- `totalSteps`: Total number of steps
- `currentType`: Type of enrichment being performed
- `message`: Human-readable progress message
- `isComplete`: Whether analysis is finished

## Error Handling

The integration includes comprehensive error handling at each layer:

1. **Network Errors** - Caught and reported through Vercel AI SDK streamables
2. **Analysis Errors** - Wrapped and streamed to client with type safety
3. **Parsing Errors** - Handled by `readStreamableValue` with graceful fallbacks
4. **Timeout Handling** - Via AbortController in the normalized hook interface

## Performance Considerations

- **Parallel Processing**: The enrichment service runs independent analyses in parallel where possible
- **Stream Efficiency**: Vercel AI SDK handles buffering and parsing optimally
- **Resource Cleanup**: AbortController ensures proper cleanup on unmount
- **Progress Granularity**: Balanced to provide updates without overwhelming the UI
- **Type Safety**: Normalized interfaces prevent runtime errors and improve performance

## Future Enhancements

1. **Caching**: Add result caching for repeated analyses
2. **Partial Results**: Return partial results if some enrichments fail
3. **Custom Enrichments**: Allow selection of specific enrichment types
4. **Batch Analysis**: Support analyzing multiple competitors simultaneously
5. **Export Functionality**: Add ability to export results in various formats

## Troubleshooting

### Common Issues

1. **Stream Not Connecting**
   - Check that the server action is properly deployed
   - Verify API keys are set in environment variables
   - Ensure Vercel AI SDK is properly configured

2. **Missing Data in Results**
   - Some enrichments may fail gracefully
   - Check the `summary` field for success/failure counts
   - Review server logs for specific errors
   - Verify the normalized stream state types are properly typed

3. **Slow Analysis**
   - Screenshot generation can be slow
   - Use `skipScreenshot: true` for faster results
   - Consider implementing progress caching

4. **Type Errors**
   - Ensure all stream updates use the normalized `StreamState` interface
   - Check that progress and result values are properly typed as `T | null`
   - Verify message types match the discriminated union

### Debug Mode

Enable debug logging by checking the browser console for:
- `readStreamableValue` parsing logs
- Progress update details with normalized state structure
- State transitions in the hook with proper typing
- Network requests to server actions

---

## Normalized Interface Benefits

This integration leverages the new normalized stream interface system that provides:

- **Type Safety**: All progress and result values are consistently typed as `T | null`
- **Code Reusability**: Shared `StreamState` interface across all streaming operations
- **Extensibility**: Easy to add new stream types with the same patterns
- **Maintainability**: Centralized type definitions and consistent API surface
- **Performance**: Eliminates unnecessary re-renders from undefined value checks

The competitor analysis stream is now fully compatible with other streaming operations in the application, including the enrichment stream, enabling consistent user experiences and maintainable code patterns. 