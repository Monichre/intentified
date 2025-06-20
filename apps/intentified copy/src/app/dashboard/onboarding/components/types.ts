/**
 * Type definitions for the AI-style onboarding flow
 */

export interface BusinessFormData {
  // Basic company info
  companyName: string
  companySize: string
  industry: string
  website: string
  
  // Social links
  socialLinks: {
    twitter: string
    instagram: string
    linkedin: string
    facebook: string
  }
  
  // Business goals
  goals: string[]
  
  // Competitive analysis
  competitors: Array<{ name: string; url: string }>
  
  // Keywords for targeting
  keywords: string[]
}

export interface OnboardingStep {
  id: number
  type: 'simple' | 'select' | 'multi-select' | 'array' | 'url' | 'social-links' | 'analysis'
  field: keyof BusinessFormData | string
  question: string
  placeholder?: string
  options?: Array<{ value: string; label: string; description?: string }>
  validate?: (value: any) => { isValid: boolean; errorMessage?: string }
  inputType?: 'text' | 'email' | 'url'
}


export interface OnboardingFlowProps {
  onComplete: (data: BusinessFormData) => Promise<void>
  onProgress?: (step: number, total: number) => void
  initialData?: Partial<BusinessFormData>
}