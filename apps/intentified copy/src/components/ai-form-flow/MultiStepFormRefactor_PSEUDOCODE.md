# Multi-Step Form Refactoring Pseudocode

## Overview
Refactor the multi-step form architecture to create a unified component that can handle both onboarding and competitor analysis flows.

## Component Hierarchy
```
MultiStepForm (Enhanced Base Component)
├── AIOnboardingFlow (Uses MultiStepForm with enrichment stream)
├── CompetitorAnalysisFlow (Uses MultiStepForm with competitor analysis stream)
└── AiOnboardTour (Simple wrapper)
```

## Enhanced MultiStepForm Component

```typescript
interface MultiStepFormProps {
  // Core configuration
  steps: OnboardingStep[]
  mode: 'onboarding' | 'competitor-analysis' | 'custom'
  
  // Callbacks
  onComplete: (formData: any) => Promise<void>
  onProgress?: (step: number, total: number) => void
  onAnalysisStart?: (website: string) => Promise<void>
  
  // Stream hook configuration
  streamHook?: 'enrichment' | 'competitor-analysis' | null
  streamOptions?: {
    onProgress?: (progress: any) => void
    onError?: (error: string) => void
    onComplete?: (result: any) => void
  }
  
  // UI configuration
  theme?: {
    variant: 'onboarding' | 'landing' | 'minimal'
    animations?: {
      typingSpeed?: number
      transitionDuration?: number
    }
  }
  
  // Initial data
  initialData?: Record<string, any>
  
  // Welcome screen
  welcomeScreen?: {
    title: string
    subtitle: string
    ctaText: string
  }
  
  className?: string
}

// Main logic flow
function MultiStepForm(props: MultiStepFormProps) {
  // State management
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(props.initialData || {})
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Initialize appropriate stream hook based on configuration
  let streamHook = null
  if (props.streamHook === 'enrichment') {
    streamHook = useEnrichmentStream()
  } else if (props.streamHook === 'competitor-analysis') {
    streamHook = useCompetitorAnalysisStream()
  }
  
  // Filter steps based on mode
  const activeSteps = props.steps.filter(step => !step.skipInMode?.includes(props.mode))
  
  // Get current step
  const currentStepData = activeSteps[currentStep - 1]
  
  // Handle step submission
  function handleStepSubmit(stepAnswer: any) {
    // Update form data
    formData[currentStepData.field] = stepAnswer
    
    // Special handling for website field
    if (currentStepData.field === 'website' && props.onAnalysisStart) {
      setIsProcessing(true)
      await props.onAnalysisStart(stepAnswer)
      setIsProcessing(false)
    }
    
    // Move to next step or complete
    if (currentStep < activeSteps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }
  
  // Handle form completion
  async function handleComplete() {
    if (streamHook && props.streamOptions) {
      // Start streaming if configured
      await streamHook.connect({
        ...formData,
        ...props.streamOptions
      })
    }
    
    // Call completion callback
    await props.onComplete(formData)
  }
  
  // Render welcome screen or form steps
  if (currentStep === 0) {
    return <WelcomeScreen {...props.welcomeScreen} onStart={() => setCurrentStep(1)} />
  }
  
  return (
    <FormContainer theme={props.theme}>
      <AnimatedQuestion text={getQuestionText(currentStepData, formData)} />
      <FormStep
        step={currentStepData}
        formData={formData}
        onSubmit={handleStepSubmit}
        isProcessing={isProcessing}
      />
      <ProgressIndicator current={currentStep} total={activeSteps.length} />
    </FormContainer>
  )
}
```

## Refactored AIOnboardingFlow

```typescript
function AIOnboardingFlow(props: AIOnboardingFlowProps) {
  return (
    <MultiStepForm
      steps={FULL_ENRICHMENT_STEPS}
      mode="onboarding"
      streamHook="enrichment"
      streamOptions={{
        onProgress: props.onProgress,
        onError: props.onError,
        onComplete: props.onComplete
      }}
      onComplete={async (formData) => {
        // Transform data to BusinessFormData format
        const businessData = transformToBusinessFormData(formData)
        await props.onComplete(businessData)
      }}
      onAnalysisStart={props.onAnalysisStart}
      theme={{
        variant: 'onboarding',
        animations: { typingSpeed: 20 }
      }}
      welcomeScreen={{
        title: "Welcome to Intentified",
        subtitle: "Let's set up your account with a quick conversation",
        ctaText: "Let's Get Started"
      }}
      initialData={props.initialData}
    />
  )
}
```

## Refactored CompetitorAnalysisFlow

```typescript
function CompetitorAnalysisFlow(props: CompetitorAnalysisFlowProps) {
  const { startStream } = useCompetitorAnalysisStream({
    onComplete: props.onComplete,
    onError: console.error
  })
  
  return (
    <MultiStepForm
      steps={COMPETITOR_ANALYSIS_STEPS}
      mode="competitor-analysis"
      onComplete={async (formData) => {
        // Start competitor analysis stream
        await startStream(
          formData.website,
          formData.companyName,
          formData.industry
        )
      }}
      theme={{
        variant: 'landing',
        animations: { typingSpeed: 25 }
      }}
      welcomeScreen={{
        title: "Competitive Analysis",
        subtitle: "Understand your market position in minutes",
        ctaText: "Start Analysis"
      }}
      initialData={{
        companyName: "",
        industry: "",
        website: "",
        competitors: [{ name: "", url: "" }]
      }}
    />
  )
}
```

## Key Refactoring Points

1. **Unified Base Component**: MultiStepForm becomes the single source of truth for all form flows
2. **Configuration-Driven**: Different flows are created by passing different configurations
3. **Stream Integration**: Optional stream hook integration for real-time updates
4. **Type Safety**: Proper TypeScript interfaces for all props and data
5. **Reusable Components**: FormStep, WelcomeScreen, ProgressIndicator remain unchanged
6. **Flexible Theming**: Theme configuration passed down to child components
7. **Mode-Based Step Filtering**: Steps can be conditionally shown based on the mode

## Migration Steps

1. Update MultiStepForm to accept generic configuration
2. Remove hardcoded steps and questions
3. Add stream hook integration
4. Update AIOnboardingFlow to use MultiStepForm
5. Update CompetitorAnalysisFlow to use MultiStepForm
6. Test all flows to ensure functionality is preserved
7. Remove redundant code from AIFormFlow if no longer needed 