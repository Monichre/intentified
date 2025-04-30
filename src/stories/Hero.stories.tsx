import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Hero, BadgeLabel, CTAButton } from '@/features/landing/hero';
import { ThemeProvider } from '@/providers/theme-provider';
import { play } from './test-utils/interactions';

/**
 * The Hero component is the main banner section of the landing page.
 * It introduces the product with a compelling headline, description, 
 * and call-to-action buttons.
 */
const meta = {
  title: 'Landing/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'The main hero section of the landing page that introduces the product and encourages user action.'
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
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story showing the default hero section
export const Default: Story = {};

// Hero with dark theme
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

// Sub-component: BadgeLabel
export const BadgeLabelComponent: StoryObj<typeof BadgeLabel> = {
  name: 'BadgeLabel',
  render: () => <BadgeLabel text="New Feature" />,
  parameters: {
    docs: {
      description: {
        story: 'A small badge component used to highlight new features or announcements.'
      },
    },
  },
};

// Sub-component: CTAButton
export const CTAButtonDefault: StoryObj<typeof CTAButton> = {
  name: 'CTAButton - Default',
  render: () => <CTAButton>SIGN UP NOW</CTAButton>,
  parameters: {
    docs: {
      description: {
        story: 'The default call-to-action button style.'
      },
    },
  },
};

// Sub-component: CTAButton (outline variant)
export const CTAButtonOutline: StoryObj<typeof CTAButton> = {
  name: 'CTAButton - Outline',
  render: () => <CTAButton variant="outline">LEARN MORE</CTAButton>,
  parameters: {
    docs: {
      description: {
        story: 'The outline variant of the call-to-action button.'
      },
    },
  },
};

// Hero with mobile viewport
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Hero section as displayed on mobile devices.'
      },
    },
  },
};