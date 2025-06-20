import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import OnboardingPage from '@/app/dashboard/onboarding/page';

const meta: Meta<typeof OnboardingPage> = {
  title: 'Dashboard/OnboardingPage',
  component: OnboardingPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock Clerk authentication for Storybook
const mockUserContext = {
  user: {
    id: 'user_123',
    fullName: 'John Doe',
    primaryEmailAddress: {
      emailAddress: 'john.doe@example.com',
    },
    update: fn().mockResolvedValue({}),
  },
  getToken: fn().mockResolvedValue('mock-token'),
};

// Decorator to provide mock authentication context
const withMockAuth = (Story: any) => {
  // In a real Storybook setup, you'd use the appropriate provider
  // For now, we'll just render the story as is
  return <Story />;
};

export const Default: Story = {
  decorators: [withMockAuth],
  parameters: {
    mockData: [
      {
        url: '/api/user',
        method: 'GET',
        status: 200,
        response: mockUserContext.user,
      },
    ],
  },
};

export const WithInitialData: Story = {
  decorators: [withMockAuth],
  parameters: {
    mockData: [
      {
        url: '/api/user',
        method: 'GET',
        status: 200,
        response: {
          ...mockUserContext.user,
          unsafeMetadata: {
            companyData: {
              name: 'Acme Corp',
              size: '51-200',
              industry: 'technology',
              website: 'https://acme.com',
            },
          },
        },
      },
    ],
  },
};