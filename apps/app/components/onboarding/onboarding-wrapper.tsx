'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {toast} from '@repo/design-system/components/ui/use-toast'
import {AIFunnelForm} from '../../../intentified/src/components/ai-form-flow/ai-funnel-form'
import {updateOnboardingProfile} from '@/app/actions/onboarding'

// Define the form data structure
interface FormData {
  businessType: string
  websiteUrl: string
  marketingGoals: string[]
  currentTools: string[]
  expectedOutcomes: string
}

export function OnboardingWrapper() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // We can either pass the FormData directly or convert it
      const result = await updateOnboardingProfile(formData)

      if (result.success) {
        toast({
          title: 'Onboarding complete!',
          description: 'Your profile has been set up successfully.',
          variant: 'default',
        })

        // Use router for client-side navigation
        router.push('/dashboard')
        router.refresh() // Refresh to ensure server components re-render with new data
      } else {
        setError(result.error)
        toast({
          title: 'Something went wrong',
          description: result.error,
          variant: 'destructive',
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      toast({
        title: 'Submission failed',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='w-full'>
      {error && (
        <div className='mb-4 p-4 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm'>
          {error}
        </div>
      )}

      <AIFunnelForm
        onComplete={handleFormSubmit}
        className={isSubmitting ? 'opacity-70 pointer-events-none' : ''}
      />

      {isSubmitting && (
        <div className='mt-4 text-center text-sm text-muted-foreground'>
          Processing your information...
        </div>
      )}
    </div>
  )
}
