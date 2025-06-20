# RealtimeCollaboration

## Refactor Summary
The component was migrated from **MUI (`@mui/system`)** styling to **TailwindCSS** utilities while keeping **framer-motion** for all animations. All `Box` elements were replaced with semantic `div` or `motion.div` elements. Custom `keyframes` logic was substituted with framer-motion opacity animations for the dot-pulse effect, eliminating the need for the `keyframes` helper.

## Key Modules & Responsibilities
| Module | Responsibility |
|--------|----------------|
| `RealtimeCollaboration` (main) | Handles mouse tracking, cursor positioning, and conditional UI rendering. |
| `Dot` | Renders an animated circle that pulses via framer-motion. |
| `ArrowCursorIcon` | Stateless SVG for cursor graphic. |
| `GridSvg` | Background grid illustration with masking for spotlight effect. |

## Component Architecture
```
RealtimeCollaboration
├─ container (relative area)
│  ├─ GridSvg (masked overlay)
│  ├─ Tooltip (three Dot components)
│  ├─ motion.div Cursor 1
│  │   ├─ ArrowCursorIcon
│  │   └─ Label bubble (three Dot components)
│  └─ motion.div Cursor 2 (mirror of Cursor 1)
```

## Data Flow
1. Mouse events on the **container** update `mousePosition` plus both cursor transformation states.
2. Derived positions drive `motion.div` animations (`x`, `y`) in each cursor.
3. `isHovered` toggles the visibility & animation of tooltip and cursor labels.

## SOLID Principles Applied
* **SRP** – Each small function/component (Dot, ArrowCursorIcon, GridSvg) has a single concern.
* **OCP** – Visual details (colors, delays) are passed as props ⇒ easily extensible without touching internals.
* **ISP** – Consumers interact only with `RealtimeCollaboration` public interface; internal helpers are private.
* **DIP / LSP** – Not directly applicable here; component hierarchy composed via composition over inheritance.

## Tailwind Highlights
* Exact pixel measurements with arbitrary values `(w-[340px] h-[280px])`.
* Conditional utility application for hover state (`flex` ↔ `hidden`).
* Inline styles retained for complex mask-image gradients.

## Future Improvements
* Extract common SVG icons to shared directory for reuse.
* Consider a Tailwind plugin for `maskImage` to remove inline styles. 