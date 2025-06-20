import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EventCalendar } from '@/components/event-calendar/event-calendar';
import { addDays, addHours, startOfDay } from 'date-fns';

const sampleEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    start: addHours(startOfDay(new Date()), 9),
    end: addHours(startOfDay(new Date()), 10),
    color: '#3b82f6',
    description: 'Weekly team sync meeting',
  },
  {
    id: '2', 
    title: 'Client Presentation',
    start: addHours(startOfDay(new Date()), 14),
    end: addHours(startOfDay(new Date()), 15.5),
    color: '#ef4444',
    description: 'Quarterly review with client',
  },
  {
    id: '3',
    title: 'Workshop',
    start: addHours(startOfDay(addDays(new Date(), 1)), 10),
    end: addHours(startOfDay(addDays(new Date(), 1)), 12),
    color: '#10b981',
    description: 'Design thinking workshop',
  },
  {
    id: '4',
    title: 'Conference Call',
    start: addHours(startOfDay(addDays(new Date(), 2)), 16),
    end: addHours(startOfDay(addDays(new Date(), 2)), 17),
    color: '#8b5cf6',
    description: 'International team call',
  },
];

const meta: Meta<typeof EventCalendar> = {
  title: 'Components/EventCalendar',
  component: EventCalendar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    events: sampleEvents,
    onEventCreate: fn(),
    onEventUpdate: fn(),
    onEventDelete: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const MonthView: Story = {
  args: {
    defaultView: 'month',
  },
  parameters: {
    docs: {
      description: {
        story: 'Event calendar in month view showing events across multiple days.',
      },
    },
  },
};

export const WeekView: Story = {
  args: {
    defaultView: 'week',
  },
  parameters: {
    docs: {
      description: {
        story: 'Event calendar in week view with detailed time slots.',
      },
    },
  },
};

export const DayView: Story = {
  args: {
    defaultView: 'day',
  },
  parameters: {
    docs: {
      description: {
        story: 'Event calendar in day view showing hourly time slots.',
      },
    },
  },
};

export const AgendaView: Story = {
  args: {
    defaultView: 'agenda',
  },
  parameters: {
    docs: {
      description: {
        story: 'Event calendar in agenda view showing events as a list.',
      },
    },
  },
};

export const EmptyCalendar: Story = {
  args: {
    events: [],
    defaultView: 'month',
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty event calendar ready for new events to be created.',
      },
    },
  },
};

export const DragAndDrop: Story = {
  args: {
    defaultView: 'week',
    enableDragAndDrop: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Event calendar with drag and drop functionality enabled for rescheduling events.',
      },
    },
  },
};