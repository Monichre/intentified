import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CTA } from '@/features/landing/cta';
import { ThemeProvider } from '@/providers/theme-provider';

/**
 * The CTA (Call to Action) component is a prominent section designed to encourage users
 * to take immediate action, such as starting a free trial or scheduling a demo.
 * 
 * This component is typically placed at strategic locations on landing and product pages
 * to convert interested visitors into leads or customers.
 */
const meta = {
  title: 'Landing/CTA',
  component: CTA,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A call-to-action section with eye-catching visuals and prominent buttons designed to encourage user conversion.'
      },
    },
  },
  tags: ['autodocs'],
  
  // The component requires theme context
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof CTA>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story showing the default CTA section
export const Default: Story = {};

// CTA with dark theme
export const DarkTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="dark">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

// CTA with a custom background color for container testing
export const CustomBackground: Story = {
  decorators: [
    (Story) => (
      <div style={{ background: 'linear-gradient(to right, #f0f9ff, #e0f2fe)' }}>
        <Story />
      </div>
    ),
  ],
};

// CTA with constrained width to test responsiveness
export const ConstrainedWidth: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '600px', margin: '0 auto', border: '1px dashed #ccc' }}>
        <Story />
      </div>
    ),
  ],
};