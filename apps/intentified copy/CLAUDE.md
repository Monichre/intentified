# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Build: `npm run build`
- Development: `npm run dev`
- Start: `npm run start`
- Lint: `npm run lint`
- Storybook: `npm run storybook`
- Test: `vitest run` or `vitest run --test-name=<test-name>`
- Test UI: `vitest --ui`

## Code Style Guidelines

- **TypeScript**: Use strict typing with proper interfaces/types for all components and functions
- **Imports**: Follow path aliases in components.json (@/components, @/lib/utils, etc.)
- **Component Structure**: Follow feature-based architecture in src/features/
- **UI Components**: Use Shadcn UI components from @/components/ui with Radix UI primitives
- **Naming Conventions**: PascalCase for components, camelCase for functions/variables
- **CSS**: Use Tailwind with tailwind-merge/cva for variants, prefer className composition
- **Error Handling**: Use try/catch with appropriate error messages, avoid silent failures
- **Formatting**: Prettier with tailwindcss plugin, maintain consistent indentation
- **Testing**: Use Vitest with Storybook's testing addon for component tests
- **Next.js**: Follow App Router patterns for routing and layouts, use server components where appropriate
