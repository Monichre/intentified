import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedBeam } from '@/components/intent-sequence-animated-beam/animated-beam';

/**
 * The AnimatedBeam component creates an animated connection between two elements,
 * visualized as a beam with a moving gradient. It's used to show relationships or
 * data flow between components in interactive visualizations.
 */
const AnimatedBeamDemo = (props: React.ComponentProps<typeof AnimatedBeam>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative h-96 w-full border border-gray-200 rounded-md p-4 bg-gray-50"
    >
      <div 
        ref={startRef}
        className="absolute top-10 left-10 w-16 h-16 bg-white rounded-full border border-gray-300 flex items-center justify-center"
      >
        Start
      </div>
      <div 
        ref={endRef}
        className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full border border-gray-300 flex items-center justify-center"
      >
        End
      </div>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={startRef}
        toRef={endRef}
        {...props}
      />
    </div>
  );
};

const meta = {
  title: 'Components/IntentSequence/AnimatedBeam',
  component: AnimatedBeamDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An animated beam component that connects two elements with a flowing gradient effect. Used to visualize connections or data flow between components.'
      },
    },
  },
  tags: ['autodocs'],
  
  argTypes: {
    curvature: { 
      control: { type: 'number', min: -100, max: 100, step: 1 },
      description: 'Curvature of the beam path (positive bends upward, negative bends downward)',
      defaultValue: 0
    },
    reverse: { 
      control: 'boolean',
      description: 'Whether the animation flows in reverse direction',
      defaultValue: false
    },
    pathColor: { 
      control: 'color',
      description: 'Color of the static path',
      defaultValue: 'gray'
    },
    pathWidth: { 
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Width of the beam path',
      defaultValue: 2
    },
    pathOpacity: { 
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'Opacity of the static path',
      defaultValue: 0.2
    },
    gradientStartColor: { 
      control: 'color',
      description: 'Start color of the gradient animation',
      defaultValue: '#ffaa40'
    },
    gradientStopColor: { 
      control: 'color',
      description: 'End color of the gradient animation',
      defaultValue: '#9c40ff'
    },
    delay: { 
      control: { type: 'number', min: 0, max: 5, step: 0.5 },
      description: 'Delay before the animation starts (in seconds)',
      defaultValue: 0
    },
    duration: { 
      control: { type: 'number', min: 2, max: 10, step: 0.5 },
      description: 'Duration of the animation (in seconds)',
      defaultValue: 5
    },
  },
} satisfies Meta<typeof AnimatedBeamDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story showing the default animated beam
export const Default: Story = {
  args: {},
};

// Story with upward curvature
export const UpwardCurve: Story = {
  args: {
    curvature: 50,
  },
};

// Story with downward curvature
export const DownwardCurve: Story = {
  args: {
    curvature: -50,
  },
};

// Story with reverse animation
export const ReverseFlow: Story = {
  args: {
    reverse: true,
  },
};

// Story with custom colors
export const CustomColors: Story = {
  args: {
    pathColor: '#2563eb',
    pathWidth: 3,
    pathOpacity: 0.3,
    gradientStartColor: '#06b6d4',
    gradientStopColor: '#3b82f6',
  },
};

// Story with slow animation
export const SlowAnimation: Story = {
  args: {
    duration: 8,
    delay: 1,
  },
};