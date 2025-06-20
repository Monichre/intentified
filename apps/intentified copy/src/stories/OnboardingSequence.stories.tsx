import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OnboardingSequence } from '@/components/onboarding/onboarding-sequence';

const meta: Meta<typeof OnboardingSequence> = {
  title: 'Onboarding/OnboardingSequence',
  component: OnboardingSequence,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: 'select',
      options: ['welcome', 'company', 'goals', 'digital', 'seo'],
    },
    seoAnalysisState: {
      control: 'object',
    },
  },
  args: {
    setCurrentStep: fn(),
    handleInputChange: fn(),
    handleGoalChange: fn(),
    completeOnboarding: fn(),
    triggerSeoAnalysis: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFormData = {
  companyName: '',
  companySize: '',
  industry: '',
  website: '',
  socialLinks: {
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: '',
  },
  goals: [],
};

const filledFormData = {
  companyName: 'Acme Corporation',
  companySize: '51-200',
  industry: 'technology',
  website: 'https://acme.com',
  socialLinks: {
    twitter: 'https://twitter.com/acme',
    instagram: 'https://instagram.com/acme',
    linkedin: 'https://linkedin.com/company/acme',
    facebook: 'https://facebook.com/acme',
  },
  goals: ['1', '3'],
};

export const Welcome: Story = {
  args: {
    currentStep: 'welcome',
    formData: defaultFormData,
    loading: false,
    seoAnalysisState: {
      status: 'idle',
      results: null,
      error: null,
    },
  },
};

export const Company: Story = {
  args: {
    currentStep: 'company',
    formData: defaultFormData,
    loading: false,
    seoAnalysisState: {
      status: 'idle',
      results: null,
      error: null,
    },
  },
};

export const CompanyFilled: Story = {
  args: {
    currentStep: 'company',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'idle',
      results: null,
      error: null,
    },
  },
};

export const Goals: Story = {
  args: {
    currentStep: 'goals',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'idle',
      results: null,
      error: null,
    },
  },
};

export const Digital: Story = {
  args: {
    currentStep: 'digital',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'idle',
      results: null,
      error: null,
    },
  },
};

export const DigitalLoading: Story = {
  args: {
    currentStep: 'digital',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'loading',
      results: null,
      error: null,
    },
  },
};

export const SEOAnalysis: Story = {
  args: {
    currentStep: 'seo',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'success',
      results: {
        seoFeedback: {
          score: 85,
          issues: ['Missing meta description', 'Slow loading time'],
          recommendations: ['Add meta descriptions', 'Optimize images'],
        },
        rawWebVitals: {
          lcp: 2.1,
          fid: 0.8,
          cls: 0.1,
        },
        ogImageData: {
          title: 'Acme Corporation',
          description: 'Leading technology company',
          image: 'https://acme.com/og-image.jpg',
        },
      },
      error: null,
    },
  },
};

export const SEOAnalysisLoading: Story = {
  args: {
    currentStep: 'seo',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'loading',
      results: null,
      error: null,
    },
  },
};

export const SEOAnalysisError: Story = {
  args: {
    currentStep: 'seo',
    formData: filledFormData,
    loading: false,
    seoAnalysisState: {
      status: 'error',
      results: null,
      error: 'Failed to analyze website. Please check the URL and try again.',
    },
  },
};

export const Loading: Story = {
  args: {
    currentStep: 'seo',
    formData: filledFormData,
    loading: true,
    seoAnalysisState: {
      status: 'success',
      results: {
        seoFeedback: {
          score: 85,
          issues: ['Missing meta description'],
          recommendations: ['Add meta descriptions'],
        },
      },
      error: null,
    },
  },
};