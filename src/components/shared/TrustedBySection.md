# TrustedBySection

## Purpose

`TrustedBySection` is a stateless, presentational React component that displays a list of industry leaders who trust the platform. It is designed for use in the landing page hero section, but can be reused elsewhere if needed.

## Usage

```tsx
import { TrustedBySection } from "@/components/shared/TrustedBySection";

<TrustedBySection />
```

## Architecture

- **Type:** Functional component
- **Export:** Named export
- **Props:** None (static content)
- **Location:** `src/components/shared/TrustedBySection.tsx`
- **Styling:** Tailwind CSS utility classes for layout and typography

## Data Flow

- No props or state; all content is static.
- If dynamic company names are needed in the future, refactor to accept a `companies: string[]` prop and render accordingly.

## Component Structure

- Root `<div>`: `mt-16 text-center`
- Heading `<p>`: `text-muted-foreground text-sm font-semibold tracking-wider uppercase`
- Companies `<p>`: `text-foreground mt-4 text-lg font-medium`

## Key Modules

- No dependencies except React and Tailwind CSS classes.

## Notes

- Follows project conventions for naming, export, and documentation.
- Easy to extend for dynamic content if required.
