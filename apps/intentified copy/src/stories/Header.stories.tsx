import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "@/components/header";

const meta: Meta<typeof Header> = {
  title: "Landing/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: "tablet",
    },
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};
