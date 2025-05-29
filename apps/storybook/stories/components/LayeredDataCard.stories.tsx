import type {Meta, StoryObj} from '@storybook/react'
import {LayeredDataCard} from '@packages/design-system/components/ui'
import {Users, DollarSign, Target, Activity, TrendingUp} from 'lucide-react'

const meta: Meta<typeof LayeredDataCard> = {
  title: 'Components/LayeredDataCard',
  component: LayeredDataCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A 3D layered data card that expands into multiple depth layers on hover.
Perfect for displaying metrics, KPIs, and key data points with beautiful animations.

## Features
- 🎨 Multiple color schemes (primary, success, warning, danger, info)
- 📐 Three size variants (sm, md, lg)
- 📈 Trend indicators with icons and values
- 🎭 Smooth 3D hover animations
- 🌗 Dark mode support
- ♿ Accessibility compliant

## Animation Details
The card consists of 4 animated layers:
1. **Background Layer**: Gradient background that moves furthest back
2. **Accent Layer**: Border layer with medium depth
3. **Content Layer**: Main content that stays central
4. **Highlight Layer**: Top border that moves forward
5. **Floating Dot**: Small accent element with maximum depth

Each layer animates with different timing and 3D transforms on hover.
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title of the card',
    },
    value: {
      control: 'text',
      description: 'The primary value to display',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle text',
    },
    trend: {
      control: 'select',
      options: ['up', 'down', 'neutral'],
      description: 'Trend direction for the data',
    },
    trendValue: {
      control: 'text',
      description: 'Optional trend value (e.g., "+12%")',
    },
    colorScheme: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger', 'info'],
      description: 'Color scheme for the card',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the card',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof LayeredDataCard>

export const Default: Story = {
  args: {
    title: 'Total Users',
    value: '24,356',
    subtitle: 'Last 30 days',
    icon: Users,
    trend: 'up',
    trendValue: '+12.5%',
    colorScheme: 'primary',
    size: 'md',
  },
}

export const Revenue: Story = {
  args: {
    title: 'Monthly Revenue',
    value: '$189,420',
    subtitle: 'This month',
    icon: DollarSign,
    trend: 'up',
    trendValue: '+8.2%',
    colorScheme: 'success',
    size: 'md',
  },
}

export const ConversionRate: Story = {
  args: {
    title: 'Conversion Rate',
    value: '3.45%',
    subtitle: 'Average',
    icon: Target,
    trend: 'down',
    trendValue: '-0.3%',
    colorScheme: 'warning',
    size: 'md',
  },
}

export const PageViews: Story = {
  args: {
    title: 'Page Views',
    value: '156.7K',
    subtitle: 'This week',
    icon: Activity,
    trend: 'up',
    trendValue: '+22.1%',
    colorScheme: 'info',
    size: 'md',
  },
}

export const SmallSize: Story = {
  args: {
    title: 'Active Users',
    value: '1,234',
    subtitle: 'Online now',
    icon: Users,
    trend: 'up',
    trendValue: '+5%',
    colorScheme: 'primary',
    size: 'sm',
  },
}

export const LargeSize: Story = {
  args: {
    title: 'Total Revenue',
    value: '$2.4M',
    subtitle: 'Annual target: $3M',
    icon: DollarSign,
    trend: 'up',
    trendValue: '+15.8%',
    colorScheme: 'success',
    size: 'lg',
  },
}

export const NoTrend: Story = {
  args: {
    title: 'Active Projects',
    value: '42',
    subtitle: 'Currently running',
    icon: Target,
    colorScheme: 'primary',
    size: 'md',
  },
}

export const DangerScheme: Story = {
  args: {
    title: 'Failed Requests',
    value: '12',
    subtitle: 'Last 24 hours',
    icon: TrendingUp,
    trend: 'down',
    trendValue: '-5%',
    colorScheme: 'danger',
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className='flex flex-wrap gap-6 items-end'>
      <LayeredDataCard
        title='Small Card'
        value='1,234'
        subtitle='Active Users'
        icon={Users}
        trend='up'
        trendValue='+12%'
        size='sm'
        colorScheme='primary'
      />
      <LayeredDataCard
        title='Medium Card'
        value='$45,678'
        subtitle='Monthly Revenue'
        icon={DollarSign}
        trend='up'
        trendValue='+8.5%'
        size='md'
        colorScheme='success'
      />
      <LayeredDataCard
        title='Large Card'
        value='89.5%'
        subtitle='Conversion Rate'
        icon={Target}
        trend='down'
        trendValue='-2.1%'
        size='lg'
        colorScheme='warning'
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All three size variants displayed together for comparison.',
      },
    },
  },
}

export const AllColorSchemes: Story = {
  render: () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6'>
      <LayeredDataCard
        title='Primary'
        value='2,345'
        subtitle='Total Views'
        icon={Activity}
        trend='up'
        trendValue='+15%'
        colorScheme='primary'
      />
      <LayeredDataCard
        title='Success'
        value='$12,890'
        subtitle='Revenue'
        icon={DollarSign}
        trend='up'
        trendValue='+23%'
        colorScheme='success'
      />
      <LayeredDataCard
        title='Warning'
        value='156'
        subtitle='Pending Orders'
        icon={Target}
        trend='neutral'
        colorScheme='warning'
      />
      <LayeredDataCard
        title='Danger'
        value='12'
        subtitle='Failed Requests'
        icon={Users}
        trend='down'
        trendValue='-5%'
        colorScheme='danger'
      />
      <LayeredDataCard
        title='Info'
        value='4,567'
        subtitle='Email Subscribers'
        icon={Activity}
        trend='up'
        trendValue='+18%'
        colorScheme='info'
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All color schemes displayed together for comparison.',
      },
    },
  },
}
