# Simplified Competitor Analysis Flow - Pseudocode

## Overview
Transform complex multi-step competitor analysis form into a simple 3-field lead generation form with casual, deal-focused messaging.

## Core Requirements
- Collect only: name, email, company name (no industry field)
- Use casual, offer-focused messaging
- Emphasize the "deal" aspect: email for competitive analysis report
- Simple, single-step form instead of multi-step wizard

## Form Structure

```pseudocode
INTERFACE FormData {
  name: string
  email: string
  companyName: string
}

INTERFACE FormErrors {
  name?: string
  email?: string
  companyName?: string
}

STATE MANAGEMENT {
  formData: FormData = { name: "", email: "", companyName: "" }
  formErrors: FormErrors = {}
  isAnalyzing: boolean = false
  competitiveAnalysis: CompetitorAnalysisResponse | null = null
  error: string | null = null
}
```

## Validation Logic

```pseudocode
FUNCTION validateForm() -> boolean {
  errors = {}
  
  IF formData.name is empty {
    errors.name = "Name is required"
  }
  
  IF formData.email is empty {
    errors.email = "Email is required"
  } ELSE IF email format is invalid {
    errors.email = "Please enter a valid email"
  }
  
  IF formData.companyName is empty {
    errors.companyName = "Company name is required"
  }
  
  SET formErrors = errors
  RETURN errors is empty
}
```

## Form Submission Logic

```pseudocode
FUNCTION handleSubmit(event) {
  event.preventDefault()
  
  IF NOT validateForm() {
    RETURN early
  }
  
  SET isAnalyzing = true
  SET error = null
  SET competitiveAnalysis = null
  
  TRY {
    websiteUrl = generateWebsiteUrl(formData.companyName)
    
    AWAIT competitorStream.connect({
      websiteUrl: websiteUrl,
      companyName: formData.companyName,
      industry: "", // Not needed
      focusAreas: ["market-position", "strengths", "opportunities"],
      skipScreenshot: false,
      userInfo: {
        name: formData.name,
        email: formData.email
      },
      onProgress: handleProgress,
      onComplete: handleComplete,
      onError: handleError
    })
  } CATCH error {
    SET isAnalyzing = false
    SET error = error.message
  }
}
```

## Website URL Generation

```pseudocode
FUNCTION generateWebsiteUrl(companyName) -> string {
  // Basic assumption: company.com
  cleanName = companyName.toLowerCase().replace(/\s+/g, '')
  RETURN `https://${cleanName}.com`
}
```

## UI State Management

```pseudocode
FUNCTION renderForm() {
  RETURN (
    <form onSubmit={handleSubmit}>
      <input 
        name="name"
        placeholder="What should we call you?"
        value={formData.name}
        onChange={handleInputChange}
        error={formErrors.name}
      />
      
      <input 
        name="email"
        type="email"
        placeholder="your.email@company.com"
        value={formData.email}
        onChange={handleInputChange}
        error={formErrors.email}
      />
      
      <input 
        name="companyName"
        placeholder="Your awesome company"
        value={formData.companyName}
        onChange={handleInputChange}
        error={formErrors.companyName}
      />
      
      <button type="submit" disabled={isAnalyzing}>
        Get My Free Competitive Analysis 🚀
      </button>
    </form>
  )
}
```

## Screen States

```pseudocode
FUNCTION renderScreen() {
  IF isAnalyzing {
    RETURN renderLoadingScreen()
  } ELSE IF error exists {
    RETURN renderErrorScreen()
  } ELSE IF competitiveAnalysis exists {
    RETURN renderResultScreen()
  } ELSE {
    RETURN renderForm()
  }
}
```

## Loading Screen

```pseudocode
FUNCTION renderLoadingScreen() {
  RETURN (
    <div className="loading-container">
      <spinner />
      <h3>Creating your competitive analysis...</h3>
      <p>{progress.message || "Analyzing your market position..."}</p>
      
      IF progress exists {
        RENDER progress bar with percentage
      }
    </div>
  )
}
```

## Result Screen

```pseudocode
FUNCTION renderResultScreen() {
  analysis = competitiveAnalysis
  
  RETURN (
    <div className="result-container">
      <h2>🎉 Your Report is Ready!</h2>
      <p>Here's your competitive analysis for {analysis.company.name}</p>
      
      <div className="analysis-summary">
        DISPLAY colorized analysis sections:
        - Company (blue)
        - Summary (green)
        - Market Position (purple)
        - Key Opportunities (orange)
        - Competitive Advantages (teal)
        - Analysis Summary (gray)
      </div>
      
      <button onClick={resetForm}>
        Analyze Another Company
      </button>
    </div>
  )
}
```

## Error Handling

```pseudocode
FUNCTION renderErrorScreen() {
  RETURN (
    <div className="error-container">
      <h2>Oops! Something went wrong</h2>
      <p>{error}</p>
      <button onClick={clearError}>Try Again</button>
    </div>
  )
}
```

## Input Change Handler

```pseudocode
FUNCTION handleInputChange(field, value) {
  UPDATE formData[field] = value
  
  IF formErrors[field] exists {
    CLEAR formErrors[field] // Remove error when user starts typing
  }
}
```

## Reset Functions

```pseudocode
FUNCTION resetForm() {
  SET competitiveAnalysis = null
  SET formData = { name: "", email: "", companyName: "" }
}

FUNCTION clearError() {
  SET error = null
}
```

## Animation Integration

```pseudocode
ALL screens use Framer Motion:
- initial={{ opacity: 0, y: 20 }}
- animate={{ opacity: 1, y: 0 }}
- Smooth transitions between states
```

## Messaging Updates

```pseudocode
FORM MESSAGES:
- Title: "Ready for your free competitive analysis?"
- Subtitle: "Just need a few quick details and we'll get you that piping hot report."
- CTA: "Get My Free Competitive Analysis 🚀"
- Footer: "No spam, no commitments. Just a genuinely useful competitive analysis report."

PIPELINE CTA MESSAGES:
- Deal text: "We'll make you a deal: Give us your business email, we'll give you a piping hot competitive analysis report you can keep."
- Button: "Get My Free Competitive Analysis"
```

## Data Flow

```pseudocode
1. User sees pipeline with deal offer
2. User clicks CTA to open modal
3. User fills simple 3-field form
4. Form validates inputs
5. Submit triggers competitor analysis stream
6. Loading screen shows progress
7. Results screen shows colorized analysis
8. User can reset to analyze another company
```

## Error Recovery

```pseudocode
VALIDATION ERRORS:
- Show inline error messages
- Clear errors when user types
- Prevent submission until valid

ANALYSIS ERRORS:
- Show friendly error screen
- Allow retry without losing form data
- Log errors for debugging
``` 