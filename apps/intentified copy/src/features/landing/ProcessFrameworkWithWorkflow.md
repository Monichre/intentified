# ProcessFrameworkWithWorkflow.md

## Overview

The `ProcessFrameworkWithWorkflow` component merges the animated workflow diagram (from `workflow.tsx`) with the four-step process and speed-to-lead timeline (from `process-framework-workflow.tsx`). This creates a visually engaging, animated, and accessible process section for the landing page.

---

## Architecture

- **Section Layout:**
  - Section header (title, subtitle)
  - Animated workflow diagram (nodes + animated connections)
  - Four-step process grid (cards for each step)
  - Speed-to-lead timeline (animated logs/terminal style)
  - Call to action (badge, supporting text)

- **Component Structure:**
  - `ProcessFrameworkWithWorkflow.tsx` (main component)
    - `AnimatedWorkflowDiagram.tsx` (visualizes nodes/connections)
    - `ProcessGrid` (renders four-step process)
    - `Timeline` (renders animated logs)
    - Reuses `Card`, `Badge`, `AnimatedNumber`, etc. from design system

---

## Data Flow

- **Static Data:**
  - Process steps, timeline steps, workflow nodes, and connections are defined as static arrays/objects.
  - Data is passed as props to subcomponents for rendering and animation.

- **No external data fetching** is required for this section.

---

## Animation

- **Workflow Diagram:**
  - Connections (SVG paths) animate their drawing as the section scrolls into view (using Framer Motion's `whileInView` or Intersection Observer).
  - Node cards fade/scale in with staggered animation.
  - Diagram is responsive: horizontally scrollable on mobile, sticky/centered on desktop.

- **Process Grid:**
  - Cards animate in (fade/slide, staggered) as they enter the viewport.
  - On hover/focus, cards scale up and show a ring highlight.

- **Timeline:**
  - Log entries animate in sequence (staggered, terminal style).
  - Blinking cursor appears after the last entry.

---

## Accessibility

- All interactive elements (cards, logs) are keyboard accessible.
- ARIA labels/roles are added to the workflow diagram and timeline for screen readers.
- Animations respect `prefers-reduced-motion`.
- Layout is fully responsive and accessible on all devices.

---

## Key Modules

- `ProcessFrameworkWithWorkflow.tsx`: Main composition component.
- `AnimatedWorkflowDiagram.tsx`: Handles node/connection rendering and animation.
- `ProcessGrid`: Renders the four-step process as cards.
- `Timeline`: Renders the animated speed-to-lead log.
- Design system components: `Card`, `Badge`, `AnimatedNumber`, etc.

---

## Extensibility

- Data can be made dynamic (from CMS or API) by replacing static arrays with props or hooks.
- Animation triggers and timing can be customized via props.
- Additional steps or timeline entries can be added by extending the data arrays.

---

## Usage

Import and use `ProcessFrameworkWithWorkflow` in the landing page or any section where a visually rich, animated process explanation is needed. 