# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Development: `npm run dev`
- Start: `npm run start`
- Lint: `npm run lint`

## Code Style Guidelines
- **TypeScript**: Use strict typing with proper interfaces/types
- **Imports**: Follow path aliases in components.json (@/components, @/lib/utils, etc.)
- **Component Structure**: Follow feature-based architecture in src/features/
- **UI Components**: Use Shadcn UI components from @/components/ui
- **Naming Conventions**: Use PascalCase for components, camelCase for functions/variables
- **CSS**: Use Tailwind with custom classes via tailwind-merge/cva
- **Error Handling**: Use try/catch with appropriate error messages
- **Formatting**: Prettier with tailwindcss plugin for consistent styling
- **ESLint Rules**: Respect the rules defined in eslint.config.mjs
- **Next.js Best Practices**: Follow App Router patterns for routing and layouts