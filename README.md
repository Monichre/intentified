# Intentified - Intent-Driven Customer Relationship Platform

A modern intelligence-driven customer relationship platform built with Next.js and Shadcn UI components, featuring an intuitive interface for capturing, analyzing, and acting on customer intent signals to drive meaningful revenue growth.

## Product Overview

Intentified transforms how businesses understand and respond to customer intent. By collecting and analyzing real-time intent signals across multiple touchpoints, the platform helps companies:

- **Identify opportunities** based on real-time buying signals
- **Convert unknown visitors** into qualified leads using AI-driven insights
- **Optimize marketing spend** by focusing on high-intent prospects
- **Streamline workflows** with automated, intent-based actions
- **Drive revenue growth** through precision-targeted engagement

## Features

- **Intelligence-Driven UI**: Built with Shadcn UI components and Tailwind CSS
- **Intent Signal Tracking**: Capture and analyze real-time intent signals across billions of data points
- **Comprehensive Modules**: Customers, Leads, Invoices, Orders, and Reports
- **Responsive Design**: Fully responsive dashboard that works on all devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Secure Authentication**: Role-based access control with Clerk authentication
- **Supabase Integration**: Powerful database and backend services

## Screenshots

### Dashboard Views

![Dashboard Overview](public/app-screenshots/dashboard-1.png)
![Dashboard Analytics](public/app-screenshots/dashboard-2.png)
![Dashboard Customers](public/app-screenshots/dashboard-3.png)

### Landing Page

![Landing Page](public/app-screenshots/landing.png)

### Mobile Experience

<div style="display: flex; justify-content: space-between;">
  <img src="public/app-screenshots/mobile-1.png" alt="Mobile Dashboard" width="32%" />
  <img src="public/app-screenshots/mobile-2.png" alt="Mobile Analytics" width="32%" />
  <img src="public/app-screenshots/mobile-3.png" alt="Mobile Navigation" width="32%" />
</div>

## Core Capabilities

### Intent Identification

- Real-Time Signal Capture: Monitor active buying signals across touchpoints
- Competitor Insights: Identify and target prospects looking at competitors
- Anonymous Visitor Tracking: Build profiles before formal identification

### Precision Analytics

- AI-driven Insights: Transform anonymous data into actionable intelligence
- Intent Dashboard: Visual representations of customer journey and intent
- Conversion Metrics: Track how intent signals translate to revenue

### Lead Management

- Lead Scoring: Prioritize prospects based on intent strength and fit
- Automated Workflows: Trigger actions based on intent signals
- Qualification Tracking: Monitor the journey from lead to customer

### Customer Relationship Tools

- Customer Segmentation: Group customers by behavior and value
- Order and Invoice Tracking: Manage transactions in one place
- Activity Logging: Keep detailed records of all customer interactions

## Technical Architecture

Intentified follows a feature-based architecture with clear separation of concerns:

### Frontend Framework

- **Next.js 15**: Server-side rendering, API routes, and modern React features
- **React 19**: Latest React version with concurrent rendering capabilities
- **TypeScript**: Strong typing throughout the application

### UI Components

- **Shadcn UI**: Re-usable components built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: SVG icon set for consistent iconography

### Authentication & Authorization

- **Clerk**: User authentication, session management, and user metadata
- **Role-Based Access**: Protected routes based on user roles
- **Middleware**: Enforces authentication and authorization rules

### Database & Backend

- **Supabase**: PostgreSQL database with real-time capabilities
- **React Query**: Server state management, caching, and data fetching
- **Server Actions**: Form submissions and data mutations

### Data Visualization

- **Recharts**: Responsive charts and data visualization
- **TanStack Table**: Powerful, headless table library for data display

## Key Technical Features

### Intent Sequence Visualization

Custom components for visualizing customer intent:

- `IntentSequenceMultipleInputs`: Multiple data sources feeding the intent engine
- `IntentSequenceMultipleOutputs`: Intent signals driving multiple outputs
- `IntentSequenceWorkflowAnimation`: Animated intent data flows

### Dashboard Layout System

- Collapsible sidebar navigation
- Breadcrumb-based navigation
- Responsive design with mobile adaptations
- Light/dark theme switching

### Data Management Features

- Filtering capabilities
- Sorting functionality
- Pagination
- Export/import tools
- Context menus for actions

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── dashboard/       # Protected dashboard routes
│   │   ├── activity-logs/
│   │   ├── customers/
│   │   ├── leads/
│   │   ├── orders/
│   │   ├── reports/
│   │   └── ...
│   ├── sign-in/         # Authentication pages
│   └── sign-up/
├── components/          # Reusable components
│   ├── ui/              # Shadcn UI components
│   ├── shared/          # Common shared components
│   └── intent-sequence/ # Intent visualization components
├── features/            # Feature-based modules
│   ├── dashboard/       # Dashboard-related features
│   │   ├── components/  # UI components specific to dashboard
│   │   └── pages/       # Page components for dashboard sections
│   └── landing/         # Landing page components
├── data/                # Static data and fixtures
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and helpers
├── providers/           # Context providers
└── utils/               # Helper utilities
```

## Tech Stack

- **Framework**: Next.js 15.x with React 19
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI with Radix UI primitives
- **Authentication**: Clerk with role-based access control
- **Database**: Supabase
- **State Management**: React Query for server state
- **Charts & Visualizations**: Recharts
- **Form Handling**: React Hook Form with Zod validation

## Authentication Setup

This project uses [Clerk](https://clerk.com) for authentication and user management. To set it up:

1. Create a Clerk account and project
2. Copy your API keys from the Clerk Dashboard
3. Create a `.env.local` file with your Clerk keys
4. Configure admin users by setting the role metadata in Clerk Dashboard

## Database Setup

This project uses [Supabase](https://supabase.com) for database and backend services:

1. Create a Supabase account and project
2. Add the required environment variables to your `.env.local` file

## Future Development Opportunities

- Advanced AI functionality for intent analysis
- Expanded integration capabilities
- Enhanced visualization and reporting tools
- Mobile application development

---

# Onboarding Flow Diagram with SEO Analysis Integration

## User Flow Overview

```mermaid
flowchart TD
    A[User lands on /dashboard/onboarding] --> B[OnboardingPage Component]
    B --> C[OnboardingSequence Component]
    C --> D[Welcome Tab]
    
    D --> E[Company Tab]
    E --> F[Goals Tab]
    F --> G[Digital Tab]
    G --> H{Website URL Valid?}
    
    H -->|No| I[Show Validation Error]
    I --> G
    
    H -->|Yes| J[Click Analyze Website]
    J --> K[triggerSeoAnalysis Function]
    K --> L[combinedUrlActions API Call]
    
    L --> M{SEO Analysis Success?}
    M -->|No| N[Show Error State]
    N --> O[Retry Button]
    O --> K
    
    M -->|Yes| P[Navigate to SEO Tab]
    P --> Q[Render SEO Results]
    Q --> R[Complete Setup Button]
    R --> S[completeOnboarding Function]
    S --> T[Update User Metadata]
    T --> U[Redirect to Dashboard]
```

## Component Architecture & State Flow

```mermaid
flowchart LR
    subgraph "OnboardingPage (/dashboard/onboarding/page.tsx)"
        A1[useState: currentStep]
        A2[useState: loading]
        A3[useState: formData]
        A4[useState: seoAnalysisState]
        A5[triggerSeoAnalysis Function]
        A6[completeOnboarding Function]
        A7[handleInputChange Function]
        A8[handleGoalChange Function]
    end
    
    subgraph "OnboardingSequence (onboarding-sequence.tsx)"
        B1[Props Interface]
        B2[Tab Navigation]
        B3[Welcome Tab]
        B4[Company Tab]
        B5[Goals Tab]
        B6[Digital Tab]
        B7[SEO Tab]
    end
    
    subgraph "WebsiteUrlInput (website-url-input.tsx)"
        C1[URL Validation]
        C2[Real-time Feedback]
        C3[Visual Indicators]
    end
    
    subgraph "SEO Pipeline Components"
        D1[SEOScoreSection]
        D2[WebVitalsSection]
        D3[OgImageSection]
        D4[AnalyzeWithAISection]
    end
    
    A1 --> B2
    A3 --> B6
    A4 --> B7
    A5 --> B6
    A6 --> B7
    B6 --> C1
    B7 --> D1
    B7 --> D2
    B7 --> D3
    B7 --> D4
```

## Detailed Functional Call Flow

```mermaid
sequenceDiagram
    participant U as User
    participant OP as OnboardingPage
    participant OS as OnboardingSequence
    participant WUI as WebsiteUrlInput
    participant API as combinedUrlActions
    participant SC as SEO Components
    participant Clerk as Clerk User API
    
    U->>OP: Navigate to /dashboard/onboarding
    OP->>OS: Render with props
    OS->>U: Show Welcome Tab
    
    U->>OS: Navigate through tabs
    OS->>U: Show Company Tab
    U->>OP: Fill company data (handleInputChange)
    
    OS->>U: Show Goals Tab
    U->>OP: Select goals (handleGoalChange)
    
    OS->>U: Show Digital Tab
    OS->>WUI: Render WebsiteUrlInput
    U->>WUI: Enter website URL
    WUI->>WUI: Validate URL in real-time
    WUI->>OP: onChange callback
    OP->>OP: Update formData.website
    
    U->>OS: Click "Analyze Website"
    OS->>OP: triggerSeoAnalysis(formData.website)
    OP->>OP: setSeoAnalysisState({status: 'loading'})
    OP->>API: combinedUrlActions(null, formData)
    
    alt SEO Analysis Success
        API->>OP: Return SEO results
        OP->>OP: setSeoAnalysisState({status: 'success', results})
        OP->>OS: setCurrentStep('seo')
        OS->>SC: Render SEO components with results
        SC->>U: Display comprehensive SEO analysis
    else SEO Analysis Error
        API->>OP: Throw error
        OP->>OP: setSeoAnalysisState({status: 'error', error})
        OS->>U: Show error state with retry button
    end
    
    U->>OS: Click "Complete Setup"
    OS->>OP: completeOnboarding()
    OP->>OP: setLoading(true)
    OP->>Clerk: user.update() with metadata
    Clerk->>OP: Success response
    OP->>U: router.push('/dashboard')
```

## State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Idle: Component Mount
    
    state "Form Data State" as FormData {
        [*] --> Empty
        Empty --> Filling: User Input
        Filling --> Completed: All Required Fields
        Completed --> Filling: User Edits
    }
    
    state "SEO Analysis State" as SEOState {
        [*] --> Idle
        Idle --> Loading: triggerSeoAnalysis()
        Loading --> Success: API Success
        Loading --> Error: API Error
        Error --> Loading: Retry
        Success --> Loading: Re-analyze
    }
    
    state "Navigation State" as NavState {
        [*] --> Welcome
        Welcome --> Company
        Company --> Goals
        Goals --> Digital
        Digital --> SEO: SEO Analysis Success
        SEO --> Dashboard: Complete Onboarding
    }
    
    FormData --> NavState: Form Validation
    SEOState --> NavState: Analysis Complete
```

## Component Rendering Logic

```mermaid
flowchart TD
    A[OnboardingSequence Render] --> B{currentStep}
    
    B -->|welcome| C[Welcome Tab Content]
    B -->|company| D[Company Tab Content]
    B -->|goals| E[Goals Tab Content]
    B -->|digital| F[Digital Tab Content]
    B -->|seo| G[SEO Tab Content]
    
    F --> H[WebsiteUrlInput Component]
    F --> I[Social Links Inputs]
    F --> J{Button State Logic}
    
    J -->|Valid URL & Not Loading| K[Analyze Website Button]
    J -->|Invalid URL or Loading| L[Disabled Button]
    
    G --> M{seoAnalysisState.status}
    
    M -->|idle| N[Instructions Message]
    M -->|loading| O[Loading Spinner]
    M -->|error| P[Error Message + Retry]
    M -->|success| Q[SEO Results Components]
    
    Q --> R[SEOScoreSection]
    Q --> S[WebVitalsSection]
    Q --> T[OgImageSection]
    Q --> U[AnalyzeWithAISection]
```

## Data Flow Architecture

```mermaid
flowchart LR
    subgraph "User Input Layer"
        A[Form Inputs]
        B[WebsiteUrlInput]
        C[Button Clicks]
    end
    
    subgraph "State Management Layer"
        D[formData State]
        E[seoAnalysisState]
        F[currentStep State]
        G[loading State]
    end
    
    subgraph "Business Logic Layer"
        H[handleInputChange]
        I[triggerSeoAnalysis]
        J[completeOnboarding]
    end
    
    subgraph "API Layer"
        K[combinedUrlActions]
        L[Clerk User API]
    end
    
    subgraph "External Services"
        M[SEO Analysis Service]
        N[Clerk Authentication]
    end
    
    A --> H
    B --> H
    C --> I
    C --> J
    
    H --> D
    I --> E
    J --> G
    
    I --> K
    J --> L
    
    K --> M
    L --> N
    
    D --> F
    E --> F
```

## Error Handling Flow

```mermaid
flowchart TD
    A[User Action] --> B{Action Type}
    
    B -->|Form Input| C[Input Validation]
    B -->|SEO Analysis| D[API Call]
    B -->|Complete Onboarding| E[Metadata Update]
    
    C --> F{Valid Input?}
    F -->|No| G[Show Validation Error]
    F -->|Yes| H[Update State]
    
    D --> I{API Success?}
    I -->|No| J[Set Error State]
    I -->|Yes| K[Set Success State]
    
    J --> L[Show Retry Button]
    L --> D
    
    E --> M{Clerk Update Success?}
    M -->|No| N[Log Error + Continue]
    M -->|Yes| O[Redirect to Dashboard]
    
    N --> O
```

## Key Integration Points

### 1. WebsiteUrlInput Integration
- **Component**: `WebsiteUrlInput`
- **Props**: `value`, `onChange`, `disabled`
- **Validation**: Real-time URL validation with visual feedback
- **State**: Integrates with `formData.website` via `handleInputChange`

### 2. SEO Analysis Integration
- **Trigger**: `triggerSeoAnalysis` function
- **API**: `combinedUrlActions` from SEO pipeline
- **State**: `seoAnalysisState` with status tracking
- **Results**: Rendered via existing SEO pipeline components

### 3. Metadata Integration
- **Service**: Clerk User API
- **Data**: Company data, goals, SEO analysis status
- **Timing**: On onboarding completion
- **Fields**: `seoAnalysisCompleted`, `seoAnalysisTimestamp`

### 4. Navigation Flow
- **Linear Progression**: Welcome → Company → Goals → Digital → SEO
- **Conditional**: SEO tab only accessible after successful analysis
- **Completion**: Available from SEO tab after analysis

This diagram shows the complete user journey from initial page load through SEO analysis to onboarding completion, highlighting all the key components, state management, API calls, and user interactions involved in the enhanced onboarding flow.



https://www.newcopy.ai/projects/cbee2c47-e1fa-460c-87eb-9f474fa8aa85/analysis
https://capture.page/dashboard
https://docs.surferseo.com/en/articles/5700335-surfer-api-introduction
https://seranking.com/?ga=2281952&source=link
https://us.posthog.com/project/160385/wizard?hash=pekhvy0eqyzdrzs6whej9o6csw0g0bz2agv6a8cv3ckbasummtmrwmfk1h5c936y
https://buouui.com/templates