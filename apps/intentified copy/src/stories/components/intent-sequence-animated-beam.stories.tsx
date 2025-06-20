import type { Meta, StoryObj } from '@storybook/react';
import { IntentSequenceMultipleInputs } from '@/components/intent-sequence-animated-beam/IntentSequenceMultipleInputs';
import { IntentSequenceMultipleOutputs } from '@/components/intent-sequence-animated-beam/IntentSequenceMultipleOutputs';

const meta: Meta<typeof IntentSequenceMultipleInputs> = {
  title: 'Components/IntentSequenceAnimatedBeam',
  component: IntentSequenceMultipleInputs,
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

export const MultipleInputs: Story = {
  render: () => (
    <div className="h-96 w-full">
      <IntentSequenceMultipleInputs />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Animated beam diagram showing multiple input sources flowing into the Intentified platform.',
      },
    },
  },
};

export const MultipleOutputs: Story = {
  render: () => (
    <div className="h-96 w-full">
      <IntentSequenceMultipleOutputs />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Animated beam diagram showing the Intentified platform generating multiple outputs.',
      },
    },
  },
};

export const SideBySide: Story = {
  render: () => (
    <div className="flex h-96 w-full gap-8">
      <div className="flex-1">
        <h3 className="mb-4 text-center text-lg font-semibold">Input Flow</h3>
        <IntentSequenceMultipleInputs />
      </div>
      <div className="flex-1">
        <h3 className="mb-4 text-center text-lg font-semibold">Output Flow</h3>
        <IntentSequenceMultipleOutputs />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side comparison of input and output animated beam diagrams.',
      },
    },
  },
};