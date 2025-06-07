# AnimatedUnderline Component

## Overview

The `AnimatedUnderline` component provides a smooth underline animation that triggers on hover. It uses Framer Motion for fluid animations and state management.

## Architecture

### Key Features
- **Hover Triggered**: Animation activates when user hovers over the element
- **Smooth Transitions**: Animated scaling effect for natural motion
- **Customizable Animation**: Configurable delay and duration
- **Responsive**: Works across all devices (with touch support via hover states)

### Component Structure
```typescript
interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;      // Animation delay in seconds (default: 0)
  duration?: number;   // Animation duration in seconds (default: 0.3)
}
```

## Usage Examples

### Basic Usage
```tsx
<AnimatedUnderline>
  <span>Hover over this text to see the underline</span>
</AnimatedUnderline>
```

### With Custom Timing
```tsx
<AnimatedUnderline delay={0.1} duration={0.5}>
  <h2>Delayed animation with slower duration</h2>
</AnimatedUnderline>
```

### With Custom Styling
```tsx
<AnimatedUnderline className="text-2xl font-bold">
  <span>Styled text with animated underline</span>
</AnimatedUnderline>
```

### In Navigation
```tsx
<nav>
  <AnimatedUnderline>
    <Link href="/about">About Us</Link>
  </AnimatedUnderline>
</nav>
```

## Implementation Details

1. **Hover Detection**: Uses `onMouseEnter` and `onMouseLeave` events to track hover state

2. **Animation Curve**: Uses a custom easing function `[0.25, 0.46, 0.45, 0.94]` for a smooth, natural animation

3. **Transform Origin**: The underline scales from left to right using `origin-left` and `scaleX`

4. **Styling**: 
   - Underline uses the theme's primary color
   - 2px height for visibility
   - Cursor changes to pointer on hover

## Customization

To modify the underline appearance, you can:

1. **Change Color**: Update the `bg-primary` class to any other color
2. **Change Height**: Modify the `h-[2px]` class
3. **Change Position**: Adjust the `bottom-0` class for different vertical positioning
4. **Add Effects**: Add shadow, gradient, or other CSS effects to the motion.span
5. **Change Direction**: Use `origin-right` and reverse the scale for right-to-left animation

## Performance Considerations

- Hover state is managed locally with React state
- Animation uses GPU-accelerated transforms for smooth performance
- Minimal re-renders due to isolated state management

## Accessibility

- The underline is a visual enhancement and doesn't affect screen reader output
- Keyboard users can still access all interactive elements
- Touch device users will see the animation on tap
- Consider adding `focus-visible` styles for keyboard navigation

## Mobile Considerations

On touch devices, the hover effect will trigger on tap. For better mobile UX, consider:
- Using a tap-to-toggle approach
- Implementing touch-specific interactions
- Adding a focus state for accessibility 