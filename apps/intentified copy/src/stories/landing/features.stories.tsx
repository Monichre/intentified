import type { Meta, StoryObj } from '@storybook/react';
import { FeaturesSection } from '@/features/landing/features';

const meta: Meta<typeof FeaturesSection> = {
  title: 'Landing/FeaturesSection',
  component: FeaturesSection,
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
        story: 'Features section showcasing the core capabilities of the Intentified platform.',
      },
    },
  },
};

export const WithDarkBackground: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        story: 'Features section with dark background theme.',
      },
    },
  },
};