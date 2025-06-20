import type { Meta, StoryObj } from '@storybook/react';
import IntentifiedSignalSourcingPipeline from '@/components/intentified-signal-sourcing-pipeline';

const meta: Meta<typeof IntentifiedSignalSourcingPipeline> = {
  title: 'Components/IntentifiedSignalSourcingPipeline',
  component: IntentifiedSignalSourcingPipeline,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    autoRotate: {
      control: 'boolean',
      description: 'Enable automatic rotation of the orbital timeline',
    },
    showMetrics: {
      control: 'boolean',
      description: 'Show metrics panels on the sides',
    },
    enableInteraction: {
      control: 'boolean',
      description: 'Enable user interaction with the timeline nodes',
    },
    theme: {
      control: 'select',
      options: ['dark', 'light'],
      description: 'Color theme for the component',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the component',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autoRotate: true,
    showMetrics: true,
    enableInteraction: true,
    theme: 'dark',
    size: 'medium',
  },
};

export const WithoutMetrics: Story = {
  args: {
    autoRotate: true,
    showMetrics: false,
    enableInteraction: true,
    theme: 'dark',
    size: 'medium',
  },
};

export const StaticView: Story = {
  args: {
    autoRotate: false,
    showMetrics: true,
    enableInteraction: true,
    theme: 'dark',
    size: 'medium',
  },
};

export const NonInteractive: Story = {
  args: {
    autoRotate: true,
    showMetrics: true,
    enableInteraction: false,
    theme: 'dark',
    size: 'medium',
  },
};

export const LargeSize: Story = {
  args: {
    autoRotate: true,
    showMetrics: true,
    enableInteraction: true,
    theme: 'dark',
    size: 'large',
  },
};

export const SmallSize: Story = {
  args: {
    autoRotate: true,
    showMetrics: true,
    enableInteraction: true,
    theme: 'dark',
    size: 'small',
  },
};