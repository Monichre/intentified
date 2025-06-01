import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

/**
 * COMPONENT STORY TEMPLATE
 * 
 * This is a template for creating Storybook stories for components.
 * Replace the placeholder imports and configurations with your actual component details.
 * 
 * Usage:
 * 1. Copy this template to your story file
 * 2. Replace ComponentName with your actual component
 * 3. Update the import path
 * 4. Configure the appropriate argTypes and args
 * 5. Create variations as needed
 */

// Import your component
// import { ComponentName } from '@/components/path-to-component';

// Mock component for template purposes
const ComponentName = (props: any) => null;

const meta = {
  title: 'Category/ComponentName',
  component: ComponentName,
  parameters: {
    // Optional parameter to center the component in the Canvas
    layout: 'centered',
    // For documentation generation
    docs: {
      description: {
        component: 'Description of the component and its purpose'
      },
    },
  },
  // Generate automatic documentation
  tags: ['autodocs'],
  
  // Define control types for props
  argTypes: {
    // Example of different control types:
    // stringProp: { control: 'text', description: 'A string property' },
    // numberProp: { control: { type: 'number', min: 0, max: 100, step: 1 }, description: 'A number property' },
    // booleanProp: { control: 'boolean', description: 'A boolean property' },
    // selectProp: { 
    //   control: { type: 'select', options: ['option1', 'option2'] },
    //   description: 'A select property'
    // },
    // onClick: { action: 'clicked' },
  },
  
  // Default values for props
  args: {
    // Example default props:
    // stringProp: 'Default string',
    // numberProp: 42,
    // booleanProp: false,
    // selectProp: 'option1',
    // onClick: fn(),
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with default props
export const Default: Story = {
  args: {
    // Override default props here if needed
  },
};

// Example of a variation
export const Variant: Story = {
  args: {
    // Override default props for this variant
    // stringProp: 'Variant string',
    // booleanProp: true,
  },
};

// Example of a story with custom render function
export const CustomRender: Story = {
  render: (args) => (
    <div style={{ padding: '20px', background: '#f0f0f0' }}>
      <ComponentName {...args} />
    </div>
  ),
};

// Example of a story with context and decorators
export const WithContext: Story = {
  decorators: [
    (Story) => (
      <div style={{ margin: '3em' }}>
        <Story />
      </div>
    ),
  ],
};

// Example of a story with parameters
export const WithParameters: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

// Example of a story with play function for testing interactions
export const WithInteractions: Story = {
  play: async ({ canvasElement, step }) => {
    // Example interaction test
    // const canvas = within(canvasElement);
    // await step('Click the button', async () => {
    //   await userEvent.click(canvas.getByRole('button'));
    // });
  },
};