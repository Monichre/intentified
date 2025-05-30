# Enrichment Service Streaming Implementation

## Overview

This document outlines the implementation of real-time streaming for the enrichment service, allowing the frontend to display accurate loading and status updates during the website analysis process.

## Architecture

### 1. Server-Sent Events (SSE) Endpoint

**File**: `/apps/api/app/research/bulk-enrichment/stream/route.ts`

- Uses Server-Sent Events for real-time communication
- Sends progress updates for each enrichment step
- Includes marketing intelligence progress tracking
- Proper error handling and stream cleanup

**Key Events**:
- `connected`: Initial connection established
- `progress`: Enrichment progress updates
- `marketing-intelligence`: Marketing campaign generation progress
- `complete`: Analysis completed with results
- `error`: Error occurred during processing

### 2. Frontend Hook

**File**: `/apps/intentified/src/hooks/use-enrichment-stream.ts`

```typescript
export interface EnrichmentProgress {
  requestId: string;
  currentStep: number;
  totalSteps: number;
  currentType: string;
  completedTypes: string[];
  isComplete: boolean;
  percentage: number;
  timestamp: string;
}

export interface MarketingIntelligenceProgress {
  step: string;
  currentStep: number;
  totalSteps: number;
  message: string;
}
```

**Features**:
- Manages SSE connection lifecycle
- Provides real-time state updates
- Handles reconnection logic
- Type-safe progress tracking
- Callback support for different event types

### 3. Progress UI Component

**File**: `/apps/intentified/src/components/enrichment-progress.tsx`

**Components**:
- `EnrichmentProgressDisplay`: Full progress card with detailed status
- `EnrichmentProgressBadge`: Compact inline progress indicator

**Features**:
- Real-time progress bars
- Step-by-step status updates
- Completed analyses visualization
- Marketing intelligence progress tracking
- Error state handling
- Smooth animations with Framer Motion

### 4. Marketing Intelligence Progress Tracking

**File**: `/packages/ai/services/enrichment/marketing-intelligence.service.ts`

Updated `generateMarketingIntelligence` function to include progress callbacks:

```typescript
onProgress?: (update: {
  step: string;
  currentStep: number;
  totalSteps: number;
  message: string;
}) => void | Promise<void>
```

**Progress Steps**:
1. Brand analysis
2. Company data extraction
3. Email template generation (10 templates)
4. Database persistence

## Integration Steps

### 1. Update Onboarding Page

```typescript
import { useEnrichmentStream } from "@/hooks/use-enrichment-stream";
import { EnrichmentProgressDisplay } from "@/components/enrichment-progress";

export default function OnboardingPage() {
  // Initialize streaming hook
  const enrichmentStream = useEnrichmentStream();
  
  // Replace existing triggerSeoAnalysis with streaming version
  const triggerSeoAnalysis = async (url: string) => {
    await enrichmentStream.connect({
      url,
      skipScreenshot: false,
      onProgress: (progress) => {
        // Handle enrichment progress
      },
      onMarketingProgress: (progress) => {
        // Handle marketing intelligence progress
      },
      onComplete: (result) => {
        // Handle completion
      },
      onError: (error) => {
        // Handle errors
      }
    });
  };
}
```

### 2. Display Progress in UI

Add the progress component where you want to show status:

```tsx
<EnrichmentProgressDisplay
  progress={enrichmentStream.state.progress}
  marketingProgress={enrichmentStream.state.marketingProgress}
  status={enrichmentStream.state.status}
  error={enrichmentStream.state.error}
/>
```

## Data Flow

1. **User triggers analysis** → Frontend calls streaming endpoint
2. **SSE connection established** → Server starts enrichment process
3. **Progress events emitted** → Frontend receives real-time updates
4. **UI updates** → Progress bars and status messages update
5. **Completion** → Results returned and stream closed

## Benefits

1. **Real-time feedback**: Users see exactly what's happening
2. **Accurate progress**: Based on actual processing steps
3. **Better UX**: No more guessing about completion time
4. **Error transparency**: Clear error messages if something fails
5. **Marketing intelligence visibility**: Users know when email templates are being generated

## Testing

1. Test with various website URLs
2. Verify progress updates are smooth
3. Test error scenarios (invalid URLs, network issues)
4. Ensure proper cleanup on component unmount
5. Test marketing intelligence progress tracking

## Next Steps

1. Add more granular progress for individual enrichment types
2. Implement progress persistence across page refreshes
3. Add estimated time remaining calculations
4. Create progress analytics for optimization
5. Add ability to cancel ongoing enrichments