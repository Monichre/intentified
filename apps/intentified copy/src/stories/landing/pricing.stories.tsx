import type { Meta, StoryObj } from '@storybook/react';
import { PricingSection } from '@/features/landing/pricing';

const meta: Meta<typeof PricingSection> = {
  title: 'Landing/PricingSection',
  component: PricingSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Pricing section with multiple tiers including a highlighted popular plan.',
      },
    },
  },
};

export const DarkTheme: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Pricing section with dark background theme.',
      },
    },
  },
};