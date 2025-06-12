# Consolidated AI Form Flow Architecture

## Overview

The AI Form Flow system is a unified, modular component architecture that powers both:
1. **Full Company Enrichment** - Comprehensive 8-step onboarding for paying clients
2. **Competitive Analysis** - Quick 4-step analysis for landing page visitors

The system provides a conversational, step-by-step form experience with real-time validation, typing animations, and seamless integration with AI enrichment services.

## Architecture

### Core Components

#### 1. AIFormFlow (`/components/ai-form-flow/ai-form-flow.tsx`)
The main orchestrator component that manages:
- Step progression and state management
- Question rendering with typing animations
- Theme variants (onboarding, landing, minimal)
- Welcome screen and progress indicators
- Dynamic placeholder replacement

#### 2. FormStep (`/components/ai-form-flow/form/form-step.tsx`)
Renders different input types based on step configuration:
- **Simple/URL**: Text input fields
- **Select**: Single choice options
- **Multi-select**: Multiple choice with checkboxes
- **Social Links**: Structured social media inputs
- **Array**: Dynamic lists (competitors, keywords)

#### 3. Types (`/components/ai-form-flow/types.ts`)
TypeScript interfaces defining:
- `OnboardingStep`: Step configuration structure
- `FormFlowConfig`: Main configuration object
- `FormFlowState`: Internal state management
- `BusinessFormData`: Structured form output

### Configuration System

#### Full Enrichment Steps (8 steps)
```typescript
FULL_ENRICHMENT_STEPS = [
  companyName,    // Simple text input
  companySize,    // Select from options
  industry,       // Select from options
  goals,          // Multi-select
  website,        // URL input with analysis trigger
  socialLinks,    // Structured social inputs
  competitors,    // Dynamic array
  keywords        // Dynamic array
]
```

#### Competitor Analysis Steps (4 steps)
```typescript
COMPETITOR_ANALYSIS_STEPS = [
  companyName,    // Simple text input
  industry,       // Select from options
  website,        // URL input
  competitors     // Dynamic array
]
```

## Data Flow

### 1. Form Initialization
```
AIOnboardingFlow/CompetitorAnalysisFlow
    ↓ (config)
AIFormFlow
    ↓ (state initialization)
Welcome Screen → First Step
```

### 2. Step Progression
```
User Input → Validation → State Update
    ↓
Next Step Trigger → Typing Animation
    ↓
FormStep Render → Input Component
```

### 3. Analysis Trigger
```
Website Input → onAnalysisStart()
    ↓
Enrichment Service → Progress Updates
    ↓
Continue Form Flow
```

### 4. Completion
```
Final Step → onComplete(formData)
    ↓
Full Enrichment: enrichCompany()
Competitor Analysis: analyzeCompetitiveLandscape()
```

## Streaming Integration

### Enrichment Stream
```typescript
useEnrichmentStream → /api/enrichment/stream
    ↓
makeCompanyEnrichmentService.enrichCompany()
    ↓
Progress Updates → UI Updates
```

### Competitor Analysis Stream
```typescript
useCompetitorAnalysisStream → /api/competitor-analysis/stream
    ↓
makeCompanyEnrichmentService.analyzeCompetitiveLandscape()
    ↓
Progress Updates → UI Updates
```

## Theme System

### Variants
1. **onboarding**: Clean, professional for dashboard
2. **landing**: Bold, engaging for marketing pages
3. **minimal**: Simple, focused for embedded forms

### Customization
```typescript
theme: {
  variant: 'landing',
  animations: {
    typingSpeed: 25,      // ms per character
    transitionDuration: 0.4  // seconds
  }
}
```

## Validation System

All validators follow consistent pattern:
```typescript
(value: any) => ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}
```

Built-in validators:
- `validateCompanyName`: Min 2 characters
- `validateCompanySize`: Valid option selected
- `validateIndustry`: Valid option selected
- `validateWebsite`: Valid URL format
- `validateGoals`: At least one selected
- `validateKeywords`: At least one valid keyword

## Animation System

### Typing Animation
- Character-by-character reveal
- Blinking cursor during typing
- Configurable speed via theme

### Transitions
- Framer Motion for smooth step transitions
- Exit animations for better UX
- Progress bar animations

## Accessibility

- Full keyboard navigation
- ARIA labels on interactive elements
- Focus management between steps
- Screen reader announcements
- High contrast mode support

## Performance

- Memoized components to prevent re-renders
- Lazy loading of heavy components
- Optimistic UI updates
- Debounced validation
- Efficient state management

## Usage Examples

### Full Enrichment (Onboarding)
```typescript
<AIOnboardingFlow
  onComplete={handleEnrichment}
  onAnalysisStart={startWebsiteAnalysis}
  onProgress={updateProgressBar}
  initialData={userData}
/>
```

### Competitor Analysis (Landing)
```typescript
<CompetitorAnalysisFlow
  onComplete={handleAnalysisComplete}
  className="min-h-screen"
/>
```

## Extensibility

### Adding New Step Types
1. Add type to `StepType` enum
2. Implement rendering in `FormStep`
3. Add validation if needed
4. Update type definitions

### Custom Themes
1. Define new variant in `ThemeConfig`
2. Add classes in `getThemeClasses()`
3. Update button and input styles

### New Analysis Modes
1. Create step configuration
2. Add mode to `FormMode` type
3. Implement streaming hook
4. Create wrapper component

## Error Handling

- Validation errors shown inline
- Network errors caught and displayed
- Graceful degradation
- Retry mechanisms for failed requests

## Testing Strategy

- Unit tests for validators
- Component tests for FormStep types
- Integration tests for full flows
- E2E tests for critical paths

## Maintenance

- Centralized type definitions
- Modular component structure
- Clear separation of concerns
- Comprehensive documentation
- Version control for configurations 