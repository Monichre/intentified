import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedTestimonials } from '@/components/AnimatedTestimonials';

const sampleTestimonials = [
  {
    quote: "Intentified transformed our lead generation process. We're now capturing competitor traffic we never knew existed.",
    name: "Sarah Johnson",
    designation: "Marketing Director, TechCorp",
    src: "/avatars/avatar.png",
  },
  {
    quote: "The competitor traffic hijacking system increased our conversion rate by 300%. It's like having a secret weapon.",
    name: "Michael Chen", 
    designation: "CEO, StartupX",
    src: "/avatars/avatar.png",
  },
  {
    quote: "Finally, a platform that actually shows us who our competitors' customers are and how to reach them.",
    name: "Emily Rodriguez",
    designation: "Head of Growth, ScaleUp Co",
    src: "/avatars/avatar.png",
  },
  {
    quote: "The intent data insights are incredible. We're now targeting customers at the exact moment they're considering our competitors.",
    name: "David Thompson",
    designation: "CMO, Enterprise Solutions",
    src: "/avatars/avatar.png",
  },
];

const meta: Meta<typeof AnimatedTestimonials> = {
  title: 'Components/AnimatedTestimonials',
  component: AnimatedTestimonials,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  args: {
    testimonials: sampleTestimonials,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autoplay: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated testimonials carousel with manual navigation controls.',
      },
    },
  },
};

export const Autoplay: Story = {
  args: {
    autoplay: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated testimonials carousel with automatic progression every 5 seconds.',
      },
    },
  },
};

export const SingleTestimonial: Story = {
  args: {
    testimonials: [sampleTestimonials[0]],
    autoplay: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated testimonials with only one testimonial (navigation arrows will be hidden).',
      },
    },
  },
};

export const TwoTestimonials: Story = {
  args: {
    testimonials: sampleTestimonials.slice(0, 2),
    autoplay: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated testimonials with just two testimonials to test minimal carousel behavior.',
      },
    },
  },
};