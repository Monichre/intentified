# Ticket 06: Update Onboarding Completion Logic

**Status**: ✅ completed  
**Story Points**: 1  
**Dependencies**: Ticket 02  
**Assignee**: TBD  

## Description

Update the `completeOnboarding` function to save SEO analysis status and results to user metadata, providing valuable context for future user interactions.

## Business Value

Enables the platform to track user onboarding progress and SEO analysis completion, allowing for personalized experiences and better user support.

## Acceptance Criteria

- [ ] Update `completeOnboarding` function in onboarding page component
- [ ] Save `seoAnalysisCompleted` boolean to user metadata
- [ ] Save `seoAnalysisTimestamp` when analysis was successful
- [ ] Include `onboardingCompletedAt` timestamp
- [ ] Maintain all existing user metadata fields
- [ ] Use `unsafeMetadata` instead of `publicMetadata`
- [ ] Handle potential errors during user update
- [ ] Preserve existing redirect behavior to dashboard
- [ ] Add proper error logging

## Implementation Notes

- Follow implementation from QuickStartGuide.md Step 3
- Use Clerk's `user.update()` method
- Ensure proper error handling around user metadata update
- Maintain existing loading state management

## Technical Specifications

### Updated completeOnboarding Function

```typescript
const completeOnboarding = async () => {
  try {
    setLoading(true);

    await user?.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        onboardingCompleted: true,
        companyData: {
          name: formData.companyName,
          size: formData.companySize,
          industry: formData.industry,
          website: formData.website,
          socialLinks: formData.socialLinks,
        },
        goals: formData.goals,
        seoAnalysisCompleted: seoAnalysisState.status === 'success',
        seoAnalysisTimestamp: seoAnalysisState.status === 'success' 
          ? new Date().toISOString() 
          : null,
        onboardingCompletedAt: new Date().toISOString(),
      },
    });

    router.push("/dashboard");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    // Consider adding user-facing error handling here
  } finally {
    setLoading(false);
  }
};
```

### Metadata Structure

The following fields will be added to user metadata:

```typescript
interface OnboardingMetadata {
  onboardingCompleted: boolean;
  companyData: {
    name: string;
    size: string;
    industry: string;
    website: string;
    socialLinks: {
      twitter: string;
      instagram: string;
      linkedin: string;
      facebook: string;
    };
  };
  goals: string[];
  seoAnalysisCompleted: boolean;
  seoAnalysisTimestamp: string | null;
  onboardingCompletedAt: string;
}
```

## Testing Requirements

- Tests for metadata saving
- Tests for error scenarios
- Tests for timestamp generation
- Tests for backward compatibility
- Tests for navigation after completion

## Definition of Done

- [ ] Function saves all required metadata
- [ ] Error handling is comprehensive
- [ ] Timestamps are generated correctly
- [ ] Navigation still works as expected
- [ ] No regressions in existing functionality
- [ ] All tests pass

## References

- Implementation Guide: [QuickStartGuide.md](../apps/intentified/src/components/onboarding/QuickStartGuide.md) - Step 3
- Target File: [page.tsx](../apps/intentified/src/app/dashboard/onboarding/page.tsx)
- Clerk Documentation: User metadata management

## Risk Considerations

1. **Metadata Size**: Ensure metadata doesn't exceed Clerk limits
2. **Error Handling**: Don't block completion if metadata save fails
3. **Migration**: Handle existing users with partial metadata
4. **Privacy**: Ensure sensitive data isn't exposed in metadata

## Dependencies for Other Tickets

This ticket completes the core functionality and supports:

- Ticket 08: Add Integration and E2E Tests (testing completion flow)

## Notes

Consider adding a fallback mechanism if user metadata update fails - the user should still be able to complete onboarding and access the dashboard. The SEO analysis data can be tracked through other means if necessary.
