import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from '@/features/landing/hero';

const meta: Meta<typeof HeroSection> = {
  title: 'Landing/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
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
        story: 'The main hero section with competitor traffic hijacking messaging and lead targeting form.',
      },
    },
  },
};

export const WithoutAnimations: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Hero section with reduced animations for accessibility testing.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ '--animation-duration': '0s' } as React.CSSProperties}>
        <Story />
      </div>
    ),
  ],
};