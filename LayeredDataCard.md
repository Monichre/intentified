# LayeredDataCard Component

## Overview

The `LayeredDataCard` is a modern 3D data display component that expands into multiple depth layers on hover. It's designed to showcase metrics, KPIs, and key data points with beautiful animations and a sophisticated visual hierarchy.

## Features

- 🎨 **Multiple Color Schemes**: Primary, success, warning, danger, and info variants
- 📐 **Three Size Variants**: Small, medium, and large options
- 📈 **Trend Indicators**: Visual trend arrows with percentage values
- 🎭 **3D Hover Animations**: Smooth layer separation with depth
- 🌗 **Dark Mode Support**: Automatically adapts to theme
- ♿ **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- 📱 **Responsive**: Works across all device sizes

## Architecture

### Layer Structure

The component consists of 5 animated layers that create the 3D effect:

1. **Background Layer** (`translateZ: -20px`)
   - Gradient background
   - Moves furthest back on hover
   - Provides visual depth foundation

2. **Accent Layer** (`translateZ: -10px`)
   - Border and background styling
   - Medium depth positioning
   - Adds visual richness

3. **Content Layer** (`translateZ: 0px`)
   - Main content container
   - Stays at neutral depth
   - Houses all text and icons

4. **Highlight Layer** (`translateZ: 10px`)
   - Top border accent
   - Moves forward on hover
   - Creates leading edge effect

5. **Floating Dot** (`translateZ: 15px`)
   - Small accent element
   - Maximum forward depth
   - Adds subtle detail

### Animation System

- **Duration**: 0.4 seconds for smooth transitions
- **Easing**: `easeOut` for natural movement
- **Staggering**: Each layer animates with slight delays (0.05s increments)
- **Transforms**: Combines `translateZ`, `rotateX`, and `rotateY`
- **Perspective**: 1000px container perspective for 3D effect

## Props Interface

```typescript
interface LayeredDataCardProps {
  title: string;                    // Main title text
  value: string | number;           // Primary data value
  subtitle?: string;                // Optional subtitle
  icon?: LucideIcon;               // Optional icon component
  trend?: "up" | "down" | "neutral"; // Trend direction
  trendValue?: string;             // Trend percentage/value
  colorScheme?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;              // Additional CSS classes
  size?: "sm" | "md" | "lg";      // Size variant
}
```

## Usage Examples

### Basic Usage

```tsx
import { LayeredDataCard } from "@packages/design-system/components/ui";
import { Users } from "lucide-react";

<LayeredDataCard
  title="Total Users"
  value="24,356"
  subtitle="Last 30 days"
  icon={Users}
  trend="up"
  trendValue="+12.5%"
  colorScheme="primary"
/>
```

### Dashboard Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <LayeredDataCard
    title="Revenue"
    value="$189,420"
    icon={DollarSign}
    trend="up"
    trendValue="+8.2%"
    colorScheme="success"
  />
  <LayeredDataCard
    title="Conversion Rate"
    value="3.45%"
    icon={Target}
    trend="down"
    trendValue="-0.3%"
    colorScheme="warning"
  />
  // ... more cards
</div>
```

### Size Variants

```tsx
// Small variant for dense layouts
<LayeredDataCard
  title="Active Users"
  value="1,234"
  size="sm"
  colorScheme="primary"
/>

// Large variant for prominent metrics
<LayeredDataCard
  title="Total Revenue"
  value="$2.4M"
  subtitle="Annual target: $3M"
  size="lg"
  colorScheme="success"
/>
```

## Color Schemes

### Primary (Default)
- Background: Blue gradient
- Use for: General metrics, user data, primary KPIs

### Success
- Background: Green gradient  
- Use for: Revenue, growth metrics, positive indicators

### Warning
- Background: Yellow gradient
- Use for: Pending items, attention-needed metrics

### Danger  
- Background: Red gradient
- Use for: Errors, failures, negative indicators

### Info
- Background: Purple gradient
- Use for: Secondary information, notifications

## Accessibility

- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Focusable with tab navigation
- **Color Contrast**: WCAG 2.1 AA compliant color ratios
- **Reduced Motion**: Respects `prefers-reduced-motion` setting
- **Semantic Structure**: Proper heading hierarchy

## Performance Considerations

- **Hardware Acceleration**: Uses CSS transforms for GPU acceleration
- **Optimized Animations**: Minimal repaints and reflows
- **Tree Shaking**: Modular imports reduce bundle size
- **TypeScript**: Full type safety with zero runtime overhead

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **3D Transforms**: CSS `transform-style: preserve-3d` support required
- **Fallback**: Graceful degradation for older browsers

## Integration

### With Design System
```tsx
import { LayeredDataCard } from "@packages/design-system/components/ui";
```

### With Intentified App
```tsx
import { LayeredDataCard } from "@packages/design-system/components/ui";
// Use in dashboard components, analytics pages, etc.
```

### With Storybook
View all variants and interactive controls in Storybook:
- Navigate to `Components/LayeredDataCard`
- Test different props and configurations
- View in light/dark themes

## Customization

### Custom Styling
```tsx
<LayeredDataCard
  className="shadow-2xl border-2 border-blue-500"
  title="Custom Styled"
  value="100%"
  colorScheme="primary"
/>
```

### Theme Integration
The component automatically inherits from your Tailwind theme:
- Uses design tokens for colors
- Respects dark mode preferences  
- Scales with custom spacing/sizing

## Best Practices

1. **Content Guidelines**
   - Keep titles concise (1-3 words)
   - Use meaningful trend values (+12%, -5%, etc.)
   - Choose appropriate icons for context

2. **Layout Recommendations**
   - Use in grids of 2-4 columns on desktop
   - Stack vertically on mobile devices
   - Maintain consistent sizing within groups

3. **Performance Tips**
   - Limit simultaneous animations
   - Use `transform` properties for animations
   - Avoid animating layout properties

4. **Accessibility**
   - Provide meaningful titles and subtitles
   - Use color schemes that match content context
   - Test with keyboard navigation

## File Locations

- **Component**: `packages/design-system/components/ui/layered-data-card.tsx`
- **Demo**: `apps/intentified/src/components/ui/layered-data-card-demo.tsx`
- **Stories**: `apps/storybook/stories/components/LayeredDataCard.stories.tsx`
- **Test Page**: `apps/intentified/src/app/layered-cards-demo/page.tsx`

## Dependencies

- `framer-motion`: Animation library
- `lucide-react`: Icon components
- `tailwindcss`: Styling framework
- `@packages/design-system`: Design tokens and utilities 