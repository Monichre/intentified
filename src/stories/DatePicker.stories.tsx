import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { addDays, subDays } from 'date-fns';
import { DatePicker } from '@/components/shared/date-picker';

/**
 * The DatePicker component provides a button that opens a calendar popover for selecting dates.
 * It's commonly used in forms, filters, and any other interface where date selection is required.
 */
const meta = {
  title: 'Components/Shared/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A date picker component with popover calendar for selecting a single date.'
      },
    },
  },
  tags: ['autodocs'],
  
  argTypes: {
    date: { 
      control: 'date',
      description: 'Currently selected date'
    },
    setDate: { 
      action: 'date changed',
      description: 'Callback function to update selected date'
    },
    fromDate: { 
      control: 'date',
      description: 'Optional minimum selectable date (dates before this will be disabled)'
    },
    id: { 
      control: 'text',
      description: 'Optional ID for the date picker input'
    },
    name: { 
      control: 'text',
      description: 'Optional name for the date picker input (useful for forms)'
    },
  },
  args: {
    setDate: (date?: Date) => console.log('Date selected:', date),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story showing the default date picker without a selected date
export const Default: Story = {
  args: {},
};

// Story with a selected date
export const WithSelectedDate: Story = {
  args: {
    date: new Date(),
  },
};

// Story with a minimum date constraint
export const WithMinimumDate: Story = {
  args: {
    fromDate: subDays(new Date(), 7), // Can't select dates more than a week ago
  },
};

// Story with form attributes
export const WithFormAttributes: Story = {
  args: {
    id: 'appointment-date',
    name: 'appointment-date',
    date: addDays(new Date(), 3),
  },
  render: (args) => (
    <form onSubmit={(e) => { e.preventDefault(); alert('Form submitted!'); }}>
      <div className="space-y-4">
        <div>
          <label htmlFor="appointment-date" className="block text-sm font-medium mb-1">
            Appointment Date
          </label>
          <DatePicker {...args} />
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  ),
};