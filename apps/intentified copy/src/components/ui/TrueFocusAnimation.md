# TrueFocus Animation Component Updates

## Overview
The `TrueFocus` component has been updated to properly handle animation sequences with optional active indices.

## Key Changes

### Animation Behavior
- **Always Animated**: The animation sequence now runs continuously regardless of the `activeIndices` prop
- **Flexible Sequencing**: 
  - When `activeIndices` is provided: Cycles through only those specific indices
  - When `activeIndices` is not provided: Cycles through all words sequentially

### Implementation Details

1. **State Management**
   - Renamed `currentIndex` to `currentSequenceIndex` for clarity
   - Added `getCurrentWordIndex()` helper function to determine which word to highlight

2. **Animation Logic**
   ```typescript
   const getCurrentWordIndex = () => {
     if (activeIndices && activeIndices.length > 0) {
       // Cycle through the activeIndices
       return activeIndices[currentSequenceIndex % activeIndices.length];
     }
     // Cycle through all words
     return currentSequenceIndex % words.length;
   };
   ```

3. **TypeScript Fixes**
   - Fixed CSS custom properties type errors by using `CustomCSSProperties` type
   - Applied proper type casting to style objects

### Usage Examples

```tsx
// Animate through all words
<TrueFocus 
  sentence="Build amazing products faster"
  blurAmount={3}
/>

// Animate only through specific words (indices 0, 2, 3)
<TrueFocus 
  sentence="Build amazing products faster"
  activeIndices={[0, 2, 3]}
  blurAmount={3}
/>

// Manual mode (no animation)
<TrueFocus 
  sentence="Build amazing products faster"
  manualMode={true}
  blurAmount={3}
/>
```

## Benefits
- More flexible animation control
- Cleaner code structure
- Better TypeScript type safety
- Consistent animation behavior