# EnhanceOnboardingAndAnalyticsUI

## Overview
This document describes the architecture, data flow, and key modules for enhancing the onboarding and analytics/SEO reporting user interfaces using 21st_magic_component_builder/refiner patterns. The enhancements focus on:
- `@page.tsx` (Onboarding entry)
- `@onboarding-sequence.tsx` (Stepper, multi-step form)
- `@seo-score.tsx` (SEO scorecard)
- `@analytics-report-card.tsx` (Analytics summary)

## Key Improvements
- Animated cards and containers for main sections
- Animated stepper/progress bar for onboarding steps
- Animated tab transitions and underlines
- Animated input focus, validation, and feedback
- Animated addition/removal of dynamic fields (competitors, keywords)
- Animated loading, error, and success feedback
- Animated progress bars and score counters
- Animated accordion and badge transitions
- Contextual tooltips for metrics and steps
- Enhanced accessibility (ARIA, keyboard, color contrast)

## Component Architecture
- **OnboardingPage**: Wraps content in an animated card, includes animated stepper/progress bar, manages step transitions.
- **OnboardingSequence**: Implements animated tabs, animated form sections, progress bar, and animated navigation buttons. Handles dynamic field animations and feedback.
- **SEOScoreSection**: Animated card entrance, animated progress bar for score, animated detail expansion/collapse, tooltips for metrics, animated status badges.
- **AnalyticsReportCard**: Animated card and accordion, animated badges for status, progress bar for duration, animated summary metrics.

## Data Flow
- State is managed in the parent (`@page.tsx`) and passed down as props.
- Step transitions and form data updates trigger UI animations.
- SEO analysis and analytics results update state, triggering animated feedback and score updates.

## Animation Patterns
- Use Framer Motion for entrance/exit, tab transitions, detail expansion, and micro-interactions.
- Use animated progress bars and counters for scores and metrics.
- Use animated tooltips and badges for contextual feedback.

## Accessibility
- All interactive elements are keyboard accessible.
- ARIA roles are used for tabs, accordions, and tooltips.
- Color contrast is tested for all new UI elements.

## Extensibility
- New animated components can be added using the same builder/refiner patterns.
- Animation and feedback logic is modular and reusable.

## Usage
- Reference the pseudocode in `EnhanceOnboardingAndAnalyticsUI_PSEUDOCODE.md` for implementation steps.
- Use the documented patterns for future UI enhancements across the platform. 