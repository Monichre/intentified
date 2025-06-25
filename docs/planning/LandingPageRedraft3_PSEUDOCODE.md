# Landing Page Redraft 3 - Pseudocode

## Overview
Implementation of all site audit recommendations (except redirect fixes) to transform Intentified into a conversion-optimized, authority-building landing page.

## Component Structure

```
LandingPageRedraft3
├── SEO Meta Tags (for head)
├── Sticky CTA Button (fixed position)
├── Exit Intent Modal
├── Hero Section
│   ├── Authority Headline (H1)
│   ├── Sub-copy with stats
│   ├── Email Capture Form (progressive profiling)
│   ├── Dashboard Visual (animated/static based on motion preference)
│   ├── Logo Bar (customer logos)
│   └── Micro-copy (trust indicators)
├── Problem Statement Section
│   └── Pain point: "80% of ad spend..."
├── Three-Step Explainer
│   ├── Card 1: Capture Signals
│   ├── Card 2: AI Score
│   └── Card 3: Push to CRM
├── Proof Section (above fold)
│   ├── Stat Cards
│   ├── Real-time Counter
│   └── Case Study Preview
├── Credibility Layer
│   ├── Trust Badges (GDPR, SOC-2, CCPA)
│   ├── Mini Case Study (GymTech)
│   └── Authority Link ("What Are Intent Signals?")
├── Interactive Demo Section
│   └── Live DataTable Demo
├── FAQ Accordion
│   ├── Pricing
│   ├── Compliance
│   ├── Data Sources
│   └── Integration Effort
├── Content Hub Section
│   ├── Pillar Page Link
│   └── Resource Downloads
└── Chat Widget (conditional)
```

## State Management

```
state = {
  email: string
  emailError: string | null
  isEmailVerified: boolean
  showExitModal: boolean
  showProgressiveProfile: boolean
  userRole: string | null
  budget: string | null
  realTimeCount: number
  isSubmitting: boolean
  prefersReducedMotion: boolean
  hasScrolled: boolean
  faqOpenItems: Set<string>
}
```

## Key Functions

```
validateEmail(email) {
  // Real-time email validation
  // Integration with email verification service
  return { isValid, error }
}

handleEmailSubmit(email) {
  // Progressive profiling step 1
  // Validate email
  // Show step 2 form (role/budget)
  // Track conversion event
}

handleExitIntent() {
  // Detect mouse leaving viewport
  // Show modal with lead magnet
  // Track abandonment recovery
}

updateRealTimeCounter() {
  // Simulate or fetch real intent events
  // Update counter every few seconds
  // Format with thousands separator
}

trackScrollAnimations() {
  // Intersection Observer for one-time animations
  // Respect prefers-reduced-motion
  // Add animation classes on visibility
}
```

## Styling Approach

```
// Dark theme with specified contrast
backgroundColor: #0D0D0D
textColor: #E5E5E5

// Typography
baseFont: text-base lg:text-lg
lineHeight: leading-relaxed
maxWidth: max-w-prose (for paragraphs)

// Cards
backdropBlur: backdrop-blur-md
borderStroke: border-2 border-white/10
glowEffect: shadow-[0_0_20px_rgba(255,255,255,0.1)]

// Animations
scrollTrigger: opacity-0 -> opacity-100, translateY(20px) -> translateY(0)
duration: 500ms
easing: ease-out
```

## Performance Optimizations

```
// Image optimization
- Use next/image for all images
- Serve WebP/AVIF formats
- Lazy load below-fold images
- Explicit width/height to prevent CLS

// Animation performance
- Use CSS transforms only
- Hardware acceleration with will-change
- Debounce scroll handlers
- One-time trigger for animations

// Bundle optimization
- Dynamic imports for heavy components
- Tree-shake unused UI components
- Minimize third-party scripts
```

## Accessibility Checklist

```
- Semantic HTML structure (header, main, section, article)
- Single H1, logical heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators (2px solid accent, 2px offset)
- Alt text for all images
- Color contrast WCAG AA compliant
- Reduced motion support
```

## SEO Implementation

```
// Meta tags
title: "Intentified - Turn Real-Time Intent Signals into 3× More B2C Sales"
description: "Transform consumer intent data into qualified leads with 3.2× higher conversion rates. Real-time signals, AI scoring, CRM integration."

// Structured data
- Organization schema
- FAQ schema for accordion
- HowTo schema for three-step process

// Open Graph
og:title, og:description, og:image (1200x630)
twitter:card = "summary_large_image"
```

## Progressive Enhancement

```
1. Core HTML/CSS loads first
2. JavaScript enhances interactivity
3. Animations load after initial render
4. Third-party scripts load last
5. Chat widget loads on demand
``` 