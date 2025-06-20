import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { LeadTargetingForm } from '@/components/lead-targeting-form/LeadTargetingForm';

const meta: Meta<typeof LeadTargetingForm> = {
  title: 'Components/LeadTargetingForm',
  component: LeadTargetingForm,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Multi-section form for collecting lead targeting URLs across four intent categories: Competitor, Social, Keyword, and Website.',
      },
    },
  },
};

export const WithPrefilledData: Story = {
  args: {},
  decorators: [
    (Story) => {
      // Simulate pre-filled form data
      setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="url"]');
        if (inputs.length > 0) {
          (inputs[0] as HTMLInputElement).value = 'https://competitor1.com';
          (inputs[1] as HTMLInputElement).value = 'https://competitor2.com';
          (inputs[10] as HTMLInputElement).value = 'https://facebook.com/company';
          (inputs[20] as HTMLInputElement).value = 'https://example.com/products';
          (inputs[30] as HTMLInputElement).value = 'https://yourcompany.com';
        }
      }, 100);
      
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        story: 'Lead targeting form with some pre-filled sample data to demonstrate the form sections.',
      },
    },
  },
};

export const ScrollableView: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="max-h-[600px] overflow-y-auto">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Lead targeting form in a scrollable container to show how it handles overflow.',
      },
    },
  },
};