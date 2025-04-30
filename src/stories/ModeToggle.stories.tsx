import type { Meta, StoryObj } from '@storybook/react';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/providers/theme-provider';

/**
 * The ModeToggle component provides a dropdown menu to switch between light, dark, and system theme modes.
 * 
 * This component is typically used in headers or navigation elements to allow users to customize their theme preferences.
 */
const meta = {
  title: 'Components/ModeToggle',
  component: ModeToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A dropdown toggle button that allows users to switch between light, dark, and system theme modes.'
      },
    },
  },
  tags: ['autodocs'],
  
  // This component requires the ThemeProvider context to function properly
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story showing the default state of the ModeToggle
export const Default: Story = {};

// The ModeToggle with a dark background to better showcase the light/dark contrast
export const OnDarkBackground: Story = {
  decorators: [
    (Story) => (
      <div style={{ padding: '40px', background: '#1a1a1a', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
};

// The same component but with system theme preference set as default
export const SystemDefault: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div style={{ padding: '20px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};