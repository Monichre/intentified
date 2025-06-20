import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from '@/features/landing/hero';

const meta: Meta<typeof Hero> = {
  title: 'Landing/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};