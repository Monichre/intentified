# HeaderSmoothScroll

## Overview

This document describes the implementation of smooth scrolling for navigation items in the Header component (`src/features/landing/header.tsx`).

## Key Modules

- `Header` (React component): Renders the navigation bar and mobile menu.
- `NavLink` (subcomponent): Handles navigation link rendering and click behavior.
- `globals.css`: Global stylesheet where `scroll-behavior: smooth` is set.

## Process & Architecture

1. **Global CSS**: Added `scroll-behavior: smooth` to `html, body` in `src/app/globals.css` to enable smooth scrolling for all anchor navigation.
2. **NavLink Component**:
   - Intercepts click events for links whose `href` starts with `#`.
   - Prevents default anchor jump.
   - Uses `document.getElementById` or `document.querySelector` to find the target section.
   - Calls `scrollIntoView({ behavior: 'smooth', block: 'start' })` for smooth scrolling.
   - Updates the URL hash using `window.history.pushState` to reflect the new section without a jump.
   - Calls the `onClick` callback (e.g., to close the mobile menu) after scrolling.
   - For non-hash links, default navigation is preserved.

## Data Flow

- `navItems` array defines the navigation sections.
- Each `NavLink` receives its `href` (e.g., `#features`), `isActive`, and optional `onClick`.
- On click, if the link is a hash, smooth scroll is triggered and the URL is updated.
- If the mobile menu is open, it closes after navigation.

## Notes

- This approach is accessible and works for both desktop and mobile navigation.
- No external libraries are required; the solution is implemented with native browser APIs and React.
- The global CSS ensures smooth scroll for any anchor navigation site-wide.
