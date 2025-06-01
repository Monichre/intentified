# TimelineProgress Refactoring Documentation

## Overview
This document outlines the refactoring of the TimelineProgress component from Material-UI (@mui/system) to Tailwind CSS v4.

## Key Changes

### 1. Dependencies
- **Removed**: `@mui/system`
- **Added**: React import (to fix linter errors)
- **Retained**: All framer-motion functionality

### 2. Component Structure
- Replaced all `Box` components with semantic HTML elements (`div`)
- Removed `component={motion.div}` prop pattern
- Used `motion.div` directly for animated elements

### 3. Style Conversions

#### Layout Styles
| MUI sx prop | Tailwind CSS |
|------------|--------------|
| `display: 'flex'` | `flex` |
| `flexDirection: 'column'` | `flex-col` |
| `gap: '8px'` | `gap-2` |
| `alignItems: 'center'` | `items-center` |
| `justifyContent: 'center'` | `justify-center` |
| `position: 'relative'` | `relative` |

#### Spacing
| MUI sx prop | Tailwind CSS |
|------------|--------------|
| `padding: '8px 12px'` | `px-3 py-2` |
| `height: '54px'` | `h-[54px]` |
| `width: '54px'` | `w-[54px]` |

#### Visual Styles
| MUI sx prop | Tailwind CSS |
|------------|--------------|
| `color: '#171717'` | `text-[#171717]` |
| `background: '#fff'` | `bg-white` |
| `background: '#e8e8e8'` | `bg-[#e8e8e8]` |
| `background: '#37401c'` | `bg-[#37401c]` |
| `border: '1px solid #e2e2e2'` | `border border-[#e2e2e2]` |
| `borderRadius: '16px'` | `rounded-2xl` |
| `fontSize: 15` | `text-[15px]` |
| `transform: 'rotate(90deg)'` | `rotate-90` |

#### Special Cases
- SVG sizing: `svg: { width: 20, height: 20 }` → `[&_svg]:w-5 [&_svg]:h-5`
- Initial width for animations: `width: '0%'` → `w-0`

## Component Architecture

### Main Components
1. **TimelineProgress**: Container component managing the timeline state
2. **TimelineItem**: Individual timeline item with badge and connecting line
3. **CircularProgress**: Animated SVG progress indicator

### Data Flow
- Actions array passed as props
- Current item state managed in TimelineProgress
- Animation callbacks trigger state updates
- Framer Motion handles all animations

## Animation System
All animations remain unchanged:
- Timeline stagger animation
- Badge color transitions
- Line progress animation
- Circular progress with checkmark
- Item entrance animations

## Benefits of Refactoring
1. **Reduced Dependencies**: No longer requires @mui/system
2. **Better Performance**: Tailwind's utility-first approach
3. **Consistent Styling**: Uses project's Tailwind configuration
4. **Smaller Bundle**: Tailwind CSS is typically smaller than MUI
5. **Easier Customization**: Direct class modifications

## Usage
```tsx
import TimelineProgress from './TimelineProgress';

const actions = [
  'Initializing process',
  'Loading resources',
  'Processing data',
  'Finalizing'
];

<TimelineProgress actions={actions} />
``` 