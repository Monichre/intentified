# TrustedBySection Component Pseudocode

## Purpose

Extract the 'Trusted by Industry Leaders' section from `hero.tsx` into a reusable, self-contained React component.

## Steps

1. **Component Definition**
    - Create a new file: `src/components/shared/TrustedBySection.tsx`
    - Define a functional component named `TrustedBySection`.
    - No props required (static content for now).
    - Add JSDoc for the component.
    - Export as a named export.

2. **Component Markup**
    - Return a `<div>` with `mt-16 text-center` classes.
    - Inside, render:
        - A `<p>` with `text-muted-foreground text-sm font-semibold tracking-wider uppercase` and the text 'Trusted by Industry Leaders'.
        - A `<p>` with `text-foreground mt-4 text-lg font-medium` and the text 'Target · BestBuy · Seidio · Davisco Foods International'.

3. **Usage in Hero**
    - In `src/features/landing/hero.tsx`, import `{ TrustedBySection }` from the new file.
    - Replace the original block (lines 187-194) with `<TrustedBySection />`.

4. **Documentation**
    - Create `src/components/shared/TrustedBySection.md`.
    - Document the component's purpose, usage, and data flow (static, no props).

## Notes

- If the list of companies should be dynamic in the future, refactor to accept a prop.
- Follow all code style and documentation conventions as per project guidelines.
