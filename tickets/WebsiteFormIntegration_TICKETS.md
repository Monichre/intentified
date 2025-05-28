# Website Form Integration - Development Tickets

## Epic: Integrate SEO Analysis into Onboarding Flow

**Epic Description**: Integrate the sophisticated website form functionality from `website-form.tsx` into the onboarding sequence to trigger SEO analysis when users enter their website URL.

**Business Value**: Streamlines user onboarding by providing immediate value through SEO analysis, improving user engagement and product adoption.

**Dependencies**: Existing SEO analysis pipeline components and onboarding sequence infrastructure.

---

## Ticket 1: Extract Reusable Website URL Input Component

**Title**: Create WebsiteUrlInput Component from website-form.tsx

**Story Points**: 3

**Description**:
Extract the sophisticated URL input logic from `website-form.tsx` into a reusable component that can be integrated into the onboarding sequence. This component will maintain all the advanced validation, UX features, and input handling while being adaptable for different contexts.

**Acceptance Criteria**:

- [ ] Create `WebsiteUrlInput` component in `apps/intentified/src/components/onboarding/website-url-input.tsx`
- [ ] Component includes Zod schema validation for URL format
- [ ] Auto-prepends "https://" and manages cursor position correctly
- [ ] Provides real-time validation feedback with error messages
- [ ] Supports controlled component pattern with `value` and `onChange` props
- [ ] Includes `onValidUrl` callback for when a valid URL is entered
- [ ] Maintains loading states and visual feedback
- [ ] Preserves existing animations and UX from original component
- [ ] Component is fully typed with TypeScript interfaces
- [ ] Includes proper accessibility attributes

**Implementation Notes**:

- Extract URL validation logic from `website-form.tsx` lines 11-14
- Preserve the sophisticated input handling logic from lines 38-52
- Maintain the animation and visual feedback patterns
- Use the existing `CultInput` component for consistency
- Implement proper ref forwarding for cursor management

**Testing Requirements**:

- Unit tests for URL validation logic
- Tests for cursor position management
- Tests for controlled component behavior
- Visual regression tests for animations

**References**:

- [website-form.tsx](apps/intentified/src/features/pipelines/seo-digital-processing/website-form.tsx)
- [QuickStartGuide.md](apps/intentified/src/components/onboarding/QuickStartGuide.md)

---

## Ticket 2: Add SEO Analysis State Management to Onboarding Parent

**Title**: Implement SEO Analysis State in Onboarding Page Component

**Story Points**: 2

**Description**:
Add comprehensive state management for SEO analysis to the onboarding page component, including loading states, results storage, and error handling. This provides the foundation for triggering and displaying SEO analysis results.

**Acceptance Criteria**:

- [ ] Add `seoAnalysisState` state to `apps/intentified/src/app/dashboard/onboarding/page.tsx`
- [ ] State includes `status`, `results`, and `error` properties with proper typing
- [ ] Implement `triggerSeoAnalysis` function that calls `combinedUrlActions`
- [ ] Function handles loading, success, and error states appropriately
- [ ] Add proper error handling with user-friendly error messages
- [ ] Pass new state and functions to `OnboardingSequence` component
- [ ] Import required actions from SEO pipeline
- [ ] Maintain backward compatibility with existing onboarding flow
- [ ] Add proper TypeScript interfaces for all new state

**Implementation Notes**:

- Follow the exact implementation from QuickStartGuide.md Step 1
- Import `combinedUrlActions` from the correct path
- Use FormData to pass URL to the action
- Implement proper async/await error handling
- Status should be union type: `'idle' | 'loading' | 'success' | 'error'`

**Testing Requirements**:

- Unit tests for `triggerSeoAnalysis` function
- Tests for error handling scenarios
- Tests for state transitions

**References**:

- [QuickStartGuide.md](apps/intentified/src/components/onboarding/QuickStartGuide.md) - Step 1
- [onboarding-sequence.tsx](apps/intentified/src/components/onboarding/onboarding-sequence.tsx)

---

## Ticket 3: Update OnboardingSequence Props and Interface

**Title**: Extend OnboardingSequence Component with SEO Analysis Props

**Story Points**: 1

**Description**:
Update the `OnboardingSequence` component interface and imports to support SEO analysis functionality. This ticket focuses on the component contract and required imports without changing the UI.

**Acceptance Criteria**:

- [ ] Update `OnboardingSequenceProps` interface with SEO-related props
- [ ] Add `seoAnalysisState` prop with proper typing
- [ ] Add `triggerSeoAnalysis` function prop
- [ ] Import required SEO analysis components
- [ ] Import `evaluateAll` function from SEO lib
- [ ] Maintain backward compatibility with existing props
- [ ] Update component destructuring to include new props
- [ ] Add proper TypeScript types for all SEO analysis data

**Implementation Notes**:

- Follow interface updates from QuickStartGuide.md Step 2.1
- Add imports from Step 2.2
- Ensure all import paths are correct for the codebase structure
- Use proper typing for `triggerSeoAnalysis` return type (Promise<boolean>)

**Testing Requirements**:

- Type checking tests
- Prop validation tests
- Import resolution verification

**References**:

- [QuickStartGuide.md](apps/intentified/src/components/onboarding/QuickStartGuide.md) - Steps 2.1-2.2
- [onboarding-sequence.tsx](apps/intentified/src/components/onboarding/onboarding-sequence.tsx)

---

## Ticket 4: Integrate WebsiteUrlInput into Digital Onboarding Step

**Title**: Replace Simple URL Input with Advanced WebsiteUrlInput Component

**Story Points**: 2

**Description**:
Replace the basic website URL input in the Digital onboarding step with the new `WebsiteUrlInput` component, providing enhanced validation and user experience.

**Acceptance Criteria**:

- [ ] Replace simple input field in Digital tab with `WebsiteUrlInput` component
- [ ] Connect component to existing `formData.website` state
- [ ] Implement proper `handleInputChange` integration
- [ ] Add real-time validation feedback
- [ ] Update button behavior to trigger SEO analysis
- [ ] Button should be disabled for invalid URLs or during loading
- [ ] Show appropriate loading state during SEO analysis
- [ ] Maintain existing styling and layout consistency
- [ ] Handle edge cases (empty input, invalid URLs)

**Implementation Notes**:

- Use the `WebsiteUrlInput` component created in Ticket 1
- Update the Digital tab content in `onboarding-sequence.tsx`
- Follow button update pattern from QuickStartGuide.md Step 2.3
- Ensure proper integration with existing form state management
- Maintain the existing card layout and styling

**Testing Requirements**:

- Integration tests with form state
- UI tests for validation feedback
- Tests for button state management
- Accessibility tests

**References**:

- [QuickStartGuide.md](apps/intentified/src/components/onboarding/QuickStartGuide.md) - Step 2.3
- Component created in Ticket 1

**Dependencies**: Ticket 1 (WebsiteUrlInput component)

---

## Ticket 5: Implement SEO Analysis Results Display

**Title**: Build SEO Analysis Tab with Results Display and Loading States

**Story Points**: 3

**Description**:
Implement the complete SEO Analysis tab content with loading states, error handling, and results display using existing SEO pipeline components.

**Acceptance Criteria**:

- [ ] Replace empty SEO tab content with comprehensive results display
- [ ] Show loading spinner and message during analysis
- [ ] Display error states with retry functionality
- [ ] Render SEO results using existing pipeline components
- [ ] Include SEOScoreSection, WebVitalsSection, OgImageSection, and AnalyzeWithAISection
- [ ] Show appropriate message when no analysis has been run
- [ ] Add "Try Again" button for failed analyses
- [ ] Include website URL in the header when available
- [ ] Maintain proper spacing and layout consistency
- [ ] Handle all possible state combinations gracefully

**Implementation Notes**:

- Follow exact implementation from QuickStartGuide.md Step 2.4
- Use conditional rendering based on `seoAnalysisState.status`
- Import and use existing SEO pipeline components
- Ensure proper error boundary implementation
- Add proper loading indicators with good UX

**Testing Requirements**:

- Tests for all state scenarios (idle, loading, success, error)
- Tests for component rendering with different data
- Error handling tests
- Loading state tests

**References**:

- [QuickStartGuide.md](apps/intentified/src/components/onboarding/QuickStartGuide.md) - Step 2.4
- Existing SEO pipeline components

**Dependencies**: Tickets 2, 3 (SEO state management and props)

---

## Ticket 6: Update Onboarding Completion Logic

**Title**: Enhance Complete Onboarding Function with SEO Analysis Data

**Story Points**: 1

**Description**:
Update the `completeOnboarding` function to save SEO analysis status and results to user metadata, providing valuable context for future user interactions.

**Acceptance Criteria**:

- [ ] Update `completeOnboarding` function in onboarding page component
- [ ] Save `seoAnalysisCompleted` boolean to user metadata
- [ ] Save `seoAnalysisTimestamp` when analysis was successful
- [ ] Include `onboardingCompletedAt` timestamp
- [ ] Maintain all existing user metadata fields
- [ ] Use `unsafeMetadata` instead of `publicMetadata`
- [ ] Handle potential errors during user update
- [ ] Preserve existing redirect behavior to dashboard
- [ ] Add proper error logging

**Implementation Notes**:

- Follow implementation from QuickStartGuide.md Step 3
- Use Clerk's `user.update()` method
- Ensure proper error handling around user metadata update
- Maintain existing loading state management

**Testing Requirements**:

- Tests for metadata saving
- Tests for error scenarios
- Tests for timestamp generation

**References**:

- [QuickStartGuide.md](apps/intentified/src/components/onboarding/QuickStartGuide.md) - Step 3

**Dependencies**: Ticket 2 (SEO analysis state)

---

## Ticket 7: Add Comprehensive Error Handling and Edge Cases

**Title**: Implement Robust Error Handling for SEO Analysis Integration

**Story Points**: 2

**Description**:
Add comprehensive error handling throughout the SEO analysis integration, including network errors, invalid URLs, timeout scenarios, and graceful degradation when SEO analysis fails.

**Acceptance Criteria**:

- [ ] Add error boundaries around SEO analysis components
- [ ] Implement timeout handling for long-running analyses
- [ ] Add user-friendly error messages for different failure scenarios
- [ ] Allow users to continue onboarding even if SEO analysis fails
- [ ] Add retry mechanisms with exponential backoff
- [ ] Log errors appropriately for debugging
- [ ] Handle malformed or blocked URLs gracefully
- [ ] Provide clear feedback when analysis is unavailable
- [ ] Add fallback UI states for component failures

**Implementation Notes**:

- Use React Error Boundaries for component-level error handling
- Implement proper async error handling with try/catch
- Add specific error messages for different failure types
- Consider implementing error reporting/telemetry
- Ensure no errors block the main onboarding flow

**Testing Requirements**:

- Error scenario testing
- Network failure simulation
- Timeout handling tests
- Error boundary tests

**References**:

- [WebsiteFormIntegrationPlan.md](apps/intentified/src/components/onboarding/WebsiteFormIntegrationPlan.md)

**Dependencies**: Tickets 4, 5 (UI integration and results display)

---

## Ticket 8: Add Integration and E2E Tests

**Title**: Implement Comprehensive Testing for SEO Analysis Integration

**Story Points**: 2

**Description**:
Create comprehensive test coverage for the entire SEO analysis integration flow, including unit tests, integration tests, and end-to-end testing scenarios.

**Acceptance Criteria**:

- [ ] Add unit tests for WebsiteUrlInput component
- [ ] Add integration tests for onboarding flow with SEO analysis
- [ ] Create E2E tests for complete user journey
- [ ] Add tests for error scenarios and edge cases
- [ ] Test SEO analysis trigger and results display
- [ ] Add performance tests for analysis workflow
- [ ] Test accessibility compliance
- [ ] Add visual regression tests for UI changes
- [ ] Test mobile responsiveness

**Implementation Notes**:

- Use existing testing framework and patterns
- Mock SEO analysis API calls for consistent testing
- Test both happy path and error scenarios
- Include accessibility testing with appropriate tools
- Follow existing test file naming and organization conventions

**Testing Requirements**:

- Minimum 90% code coverage for new components
- All user interaction scenarios covered
- Error handling paths tested
- Performance within acceptable limits

**References**:

- [WebsiteFormIntegrationPlan.md](apps/intentified/src/components/onboarding/WebsiteFormIntegrationPlan.md) - Testing Strategy

**Dependencies**: All previous tickets

---

## Implementation Timeline

**Week 1**: Tickets 1, 2, 3 (Foundation)
**Week 2**: Tickets 4, 5 (UI Integration)
**Week 3**: Tickets 6, 7 (Completion and Error Handling)
**Week 4**: Ticket 8 (Testing and Polish)

## Risk Mitigation

1. **Integration Complexity**: Start with ticket 1 to validate component extraction approach
2. **SEO Pipeline Dependencies**: Verify all SEO components are accessible and functional
3. **State Management**: Carefully test state transitions to avoid race conditions
4. **User Experience**: Maintain existing onboarding flow throughout implementation

## Success Metrics

- [ ] Users can trigger SEO analysis from onboarding sequence
- [ ] SEO results display correctly in Analysis tab
- [ ] Error scenarios are handled gracefully
- [ ] Onboarding completion rate maintains or improves
- [ ] No regressions in existing onboarding functionality
