# Tailwind CSS v3 to v4 Migration Guide

## Overview

Tailwind CSS v4 introduces a new CSS-first configuration approach, moving away from JavaScript/TypeScript configuration files to pure CSS configuration.

## Key Changes

### 1. Configuration Format
- **v3**: Uses `tailwind.config.js` or `tailwind.config.ts`
- **v4**: Uses CSS files with `@theme` and `@config` directives

### 2. File Structure
```
packages/design-system/styles/tailwind-v4/
├── theme.css           # Theme customizations
├── tailwind.config.css # Main configuration
└── migration-guide.md  # This file
```

### 3. Import Changes

Update your main CSS files:

**Before (v3):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**After (v4):**
```css
@import "../design-system/styles/tailwind-v4/tailwind.config.css";
```

### 4. Plugin Installation

Install v4-compatible plugins:
```bash
bun add @tailwindcss/typography@next @tailwindcss/forms@next @tailwindcss/container-queries@next
```

### 5. Build Configuration

Update your PostCSS config or build tool:

**postcss.config.js:**
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

### 6. Content Configuration

In v4, content paths are configured in your build tool rather than the config file. Update your build configuration accordingly.

## Usage Examples

### Using Custom Colors

```css
/* Using base colors */
.my-element {
  @apply bg-base-900 text-base-100;
}

/* Using theme colors */
.primary-button {
  @apply bg-primary text-primary-foreground;
}

/* Using vibrant colors */
.alert {
  @apply bg-red text-white;
}
```

### Using Custom Animations

```css
.accordion {
  animation: var(--animate-accordion-down);
}
```

### Dark Mode

The dark mode class strategy is preserved:

```html
<html class="dark">
  <!-- Dark mode styles will be applied -->
</html>
```

## Migration Steps

1. **Install Tailwind CSS v4:**
   ```bash
   bun add tailwindcss@next @tailwindcss/postcss@next
   ```

2. **Update imports in your CSS files:**
   - Replace `@tailwind` directives with the new import

3. **Remove old config files:**
   - Delete `tailwind.config.js` or `tailwind.config.ts`

4. **Update build configuration:**
   - Update PostCSS config
   - Update content paths in build tool

5. **Test your application:**
   - Verify all styles are working
   - Check dark mode functionality
   - Test responsive designs

## Benefits of v4

1. **Better Performance**: CSS-based config is faster to parse
2. **Type Safety**: CSS variables provide better IDE support
3. **Simpler Setup**: No JavaScript configuration needed
4. **Native CSS**: Leverages modern CSS features

## Common Issues

### Issue: Plugins not working
**Solution**: Ensure you're using v4-compatible versions (with `@next` tag)

### Issue: Content not being scanned
**Solution**: Configure content paths in your build tool, not in CSS

### Issue: Custom utilities not working
**Solution**: Add them in the `@layer utilities` block in your CSS

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4)
- [Migration Guide](https://tailwindcss.com/docs/v4/migration)
- [v4 Release Notes](https://tailwindcss.com/blog/tailwindcss-v4) 