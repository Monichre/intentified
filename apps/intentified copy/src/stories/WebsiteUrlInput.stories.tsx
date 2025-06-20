import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { WebsiteUrlInput } from '@/components/onboarding/website-url-input';

const meta: Meta<typeof WebsiteUrlInput> = {
  title: 'Onboarding/WebsiteUrlInput',
  component: WebsiteUrlInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onChange: fn(),
    onValidUrl: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    placeholder: 'https://example.com',
    disabled: false,
  },
};

export const WithValue: Story = {
  args: {
    value: 'https://acme.com',
    placeholder: 'https://example.com',
    disabled: false,
  },
};

export const InvalidUrl: Story = {
  args: {
    value: 'invalid-url',
    placeholder: 'https://example.com',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    value: 'https://acme.com',
    placeholder: 'https://example.com',
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    value: '',
    placeholder: 'Enter your website URL',
    disabled: false,
  },
};

export const PartialInput: Story = {
  args: {
    value: 'https://acme.',
    placeholder: 'https://example.com',
    disabled: false,
  },
};