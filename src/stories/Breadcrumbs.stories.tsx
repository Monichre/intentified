import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumbs } from '@/components/breadcrumbs';

// We need to mock the useBreadcrumbs hook since it relies on Next.js routing
// and interacts with the sidebar configuration
import * as hooks from '@/hooks/use-breadcrumbs';

/**
 * The Breadcrumbs component displays a navigation breadcrumb trail based on the current route.
 * It's typically used in dashboard layouts to show the user's current location in the application.
 */
const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A navigation component that displays the current page location within a hierarchical structure.'
      },
    },
  },
  tags: ['autodocs'],
  
  argTypes: {
    homeHref: { 
      control: 'text',
      description: 'URL for the home link',
      table: {
        defaultValue: { summary: '/dashboard' }
      }
    },
    homeLabel: { 
      control: 'text',
      description: 'Label for the home link',
      table: {
        defaultValue: { summary: 'Home' }
      }
    },
    showHome: { 
      control: 'boolean',
      description: 'Whether to show the home link',
      table: {
        defaultValue: { summary: true }
      }
    },
    className: { 
      control: 'text',
      description: 'Optional CSS class name for additional styling'
    },
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story showing a simple breadcrumb trail
export const Default: Story = {
  args: {
    homeHref: '/dashboard',
    homeLabel: 'Dashboard',
    showHome: true,
  },
  // Mock the useBreadcrumbs hook to return a fixed set of breadcrumbs
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/dashboard/customers',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock the useBreadcrumbs hook to return a fixed set of breadcrumbs
      jest.spyOn(hooks, 'useBreadcrumbs').mockReturnValue([
        {
          label: 'Customers',
          href: '/dashboard/customers',
          isCurrent: true,
        },
      ]);
      
      return <Story />;
    },
  ],
};

// Breadcrumbs with multiple levels
export const MultipleLevels: Story = {
  args: {
    homeHref: '/dashboard',
    homeLabel: 'Dashboard',
    showHome: true,
  },
  decorators: [
    (Story) => {
      // Mock the useBreadcrumbs hook to return a fixed set of breadcrumbs with multiple levels
      jest.spyOn(hooks, 'useBreadcrumbs').mockReturnValue([
        {
          label: 'Customers',
          href: '/dashboard/customers',
          isCurrent: false,
        },
        {
          label: 'Details',
          href: '/dashboard/customers/details',
          isCurrent: true,
        },
      ]);
      
      return <Story />;
    },
  ],
};

// Breadcrumbs without home link
export const WithoutHome: Story = {
  args: {
    showHome: false,
  },
  decorators: [
    (Story) => {
      // Mock the useBreadcrumbs hook to return a fixed set of breadcrumbs
      jest.spyOn(hooks, 'useBreadcrumbs').mockReturnValue([
        {
          label: 'Reports',
          href: '/dashboard/reports',
          isCurrent: false,
        },
        {
          label: 'Sales',
          href: '/dashboard/reports/sales',
          isCurrent: true,
        },
      ]);
      
      return <Story />;
    },
  ],
};

// Breadcrumbs with custom styling
export const CustomStyling: Story = {
  args: {
    homeHref: '/dashboard',
    homeLabel: 'Home',
    showHome: true,
    className: 'p-4 bg-gray-100 rounded-lg',
  },
  decorators: [
    (Story) => {
      // Mock the useBreadcrumbs hook to return a fixed set of breadcrumbs
      jest.spyOn(hooks, 'useBreadcrumbs').mockReturnValue([
        {
          label: 'Settings',
          href: '/dashboard/settings',
          isCurrent: false,
        },
        {
          label: 'Profile',
          href: '/dashboard/settings/profile',
          isCurrent: true,
        },
      ]);
      
      return <Story />;
    },
  ],
};