import type { Meta, StoryObj } from '@storybook/react';
import { CustomerTestimonialsSection } from '@/features/landing/customer-testimonials';

const meta: Meta<typeof CustomerTestimonialsSection> = {
  title: 'Landing/CustomerTestimonialsSection',
  component: CustomerTestimonialsSection,
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
        story: 'Customer testimonials section showcasing user feedback and success stories.',
      },
    },
  },
};