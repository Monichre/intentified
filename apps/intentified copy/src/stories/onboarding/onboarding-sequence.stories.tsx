import type { Meta, StoryObj } from '@storybook/react';
import { OnboardingSequence } from '@/components/onboarding/onboarding-sequence';
import { fn } from '@storybook/test';

const mockUser = {
  fullName: 'John Doe',
  primaryEmailAddress: {
    emailAddress: 'john@example.com',
  },
};

// Mock Clerk's useUser hook
const mockUseUser = () => ({ user: mockUser });

const meta: Meta<typeof OnboardingSequence> = {
  title: 'Onboarding/OnboardingSequence',
  component: OnboardingSequence,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  args: {
    currentStep: 'welcome',
    setCurrentStep: fn(),
    formData: {
      companyName: 'Acme Corp',
      companySize: '11-50',
      industry: 'technology',
      website: 'https://example.com',
      socialLinks: {
        twitter: '',
        instagram: '',
        linkedin: '',
        facebook: '',
      },
      goals: ['1'],
      competitors: [
        { name: 'Competitor 1', url: 'https://competitor1.com' }
      ],
      keywords: ['keyword 1', 'keyword 2'],
    },
    handleInputChange: fn(),
    handleGoalChange: fn(),
    completeOnboarding: fn(),
    loading: false,
    seoAnalysisState: {
      status: 'idle',
      results: null,
      error: null,
    },
    triggerSeoAnalysis: fn(),
    handleCompetitorChange: fn(),
    addCompetitor: fn(),
    removeCompetitor: fn(),
    handleSocialIntentChange: fn(),
    addSocialIntent: fn(),
    removeSocialIntent: fn(),
    handleKeywordIntentChange: fn(),
    addKeywordIntent: fn(),
    removeKeywordIntent: fn(),
  },
  decorators: [
    (Story) => {
      // Mock the useUser hook
      const originalUseUser = require('@clerk/nextjs').useUser;
      require('@clerk/nextjs').useUser = mockUseUser;
      
      return (
        <div className="min-h-screen p-4">
          <Story />
        </div>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WelcomeStep: Story = {
  args: {
    currentStep: 'welcome',
  },
  parameters: {
    docs: {
      description: {
        story: 'The welcome step introducing users to Intentified platform capabilities.',
      },
    },
  },
};

export const CompanyStep: Story = {
  args: {
    currentStep: 'company',
  },
  parameters: {
    docs: {
      description: {
        story: 'Company information collection step with form fields for company details.',
      },
    },
  },
};

export const GoalsStep: Story = {
  args: {
    currentStep: 'goals',
    formData: {
      companyName: 'Acme Corp',
      companySize: '11-50',
      industry: 'technology',
      website: 'https://example.com',
      socialLinks: {
        twitter: '',
        instagram: '',
        linkedin: '',
        facebook: '',
      },
      goals: ['1', '3'],
      competitors: [],
      keywords: [],
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Goals selection step where users choose their primary objectives.',
      },
    },
  },
};

export const DigitalStep: Story = {
  args: {
    currentStep: 'digital',
  },
  parameters: {
    docs: {
      description: {
        story: 'Digital presence step for collecting website, social links, competitors, and keywords.',
      },
    },
  },
};

export const AnalysisStep: Story = {
  args: {
    currentStep: 'seo',
    seoAnalysisState: {
      status: 'loading',
      results: null,
      error: null,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'SEO analysis step showing loading state during website analysis.',
      },
    },
  },
};

export const AnalysisSuccess: Story = {
  args: {
    currentStep: 'seo',
    seoAnalysisState: {
      status: 'success',
      results: {
        companyEnrichment: {
          basicInfo: {
            description: 'A technology company focused on customer relationship management',
            category: 'Technology',
          },
          companySummary: {
            sections: [
              {
                heading: '🎯 Main Product',
                text: 'Customer relationship management platform with intent data analytics',
              },
            ],
          },
          funding: {
            hasFunding: true,
            summary: 'Early-stage startup with seed funding',
          },
        },
        seoFeedback: {
          overallScore: 75,
          issues: [],
        },
        rawWebVitals: {
          record: {
            key: { url: 'https://example.com' },
            metrics: {
              interaction_to_next_paint: { percentiles: { p75: 150 } },
              largest_contentful_paint: { percentiles: { p75: 2000 } },
              cumulative_layout_shift: { percentiles: { p75: 0.05 } },
            },
          },
        },
        ogImageData: {
          title: 'Example Company',
          description: 'Example description',
        },
      },
      error: null,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'SEO analysis step showing successful results with company enrichment and SEO data.',
      },
    },
  },
};

export const AnalysisError: Story = {
  args: {
    currentStep: 'seo',
    seoAnalysisState: {
      status: 'error',
      results: null,
      error: 'Failed to analyze website. Please check the URL and try again.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'SEO analysis step showing error state with retry option.',
      },
    },
  },
};