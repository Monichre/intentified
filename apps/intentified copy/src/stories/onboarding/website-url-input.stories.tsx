import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { WebsiteUrlInput } from '@/components/onboarding/website-url-input';

const meta: Meta<typeof WebsiteUrlInput> = {
  title: 'Onboarding/WebsiteUrlInput',
  component: WebsiteUrlInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onChange: fn(),
    onValidUrl: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'https://example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default website URL input with placeholder text.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    value: 'https://example.com',
    placeholder: 'https://example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Website URL input with a valid URL entered.',
      },
    },
  },
};

export const InvalidUrl: Story = {
  args: {
    value: 'invalid-url',
    placeholder: 'https://example.com',
  },
  parameters: {
    docs: {
      description: {
        story: 'Website URL input showing validation error for invalid URL.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    value: 'https://example.com',
    placeholder: 'https://example.com',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled website URL input during processing.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    value: 'https://example.com',
    placeholder: 'https://example.com',
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
        <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          Analyzing website...
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Website URL input in loading state during analysis.',
      },
    },
  },
};