# RealtimeCollaboration – Refactor Pseudocode

## Goal
Convert the MUI‐styled component to a TailwindCSS + framer-motion implementation while preserving all behaviour and animation.

---

## High-Level Steps
1. **Imports**
   - Remove `@mui/system` (Box, keyframes)
   - Keep `framer-motion` for animation
   - Add React hooks & types

2. **State & Refs**
   - `containerRef` → `useRef<HTMLDivElement>(null)`
   - Mouse / cursor positions – keep existing state shape

3. **Event Handlers**
   - `handleMouseMove(e: MouseEvent<HTMLDivElement>)`
   - Compute relative positions exactly as before
   - `handleMouseEnter` / `handleMouseLeave` toggle `isHovered`

4. **Dot Component**
   - Replace CSS keyframes with `motion.div` opacity animation
   - Props: `delay`, `color`, `isRunning`
   - Tailwind classes: `w-[6px] h-[6px] rounded-full`

5. **Layout Structure**
   - **Wrapper**: `<div className="flex justify-center">` (optional outer wrapper)
   - **Interactive Area**: `<div ref={containerRef} className="relative w-[340px] h-[280px]" ...>`
     - Apply event handlers here

6. **Grid SVG Overlay**
   - Use `<div className="absolute inset-0" style={{ maskImage: 'radial-gradient(...)', WebkitMaskImage: 'radial-gradient(...)' }}>` then include `<GridSvg />`

7. **Hover Tooltip**
   - Conditionally rendered `<div>` absolutely positioned following the mouse
   - Inner bubble: Tailwind `flex gap-1 bg-[#022323] p-[6px_10px] rounded-full border border-[#20dfd6]`
   - Three `Dot` children with `color="#20dfd6"`

8. **Cursor Icons**
   - Two `<motion.div>` elements positioned & animated exactly as before
   - Inside each, `<ArrowCursorIcon />` and a label bubble (same Tailwind styles as tooltip but with grey colours)
   - Bubble display controlled via `isHovered`

9. **ArrowCursorIcon & GridSvg**
   - Keep SVGs unchanged, simply wrap in functional components within the same file

10. **Export**
    - `export default RealtimeCollaboration;`

## Tailwind Class Mapping Examples
| Original (sx)                              | Tailwind                                    |
|-------------------------------------------|---------------------------------------------|
| `width: 340`                               | `w-[340px]`                                  |
| `height: 280`                              | `h-[280px]`                                  |
| `position: 'relative'`                     | `relative`                                   |
| `display: 'flex'` + `gap: '4px'`           | `flex gap-1`                                |
| `background: '#022323'`                    | `bg-[#022323]`                               |
| `border: '1px solid #20dfd6'`              | `border border-[#20dfd6]`                   |
| `pointerEvents: 'none'`                    | `pointer-events-none` (Tailwind plugin) OR inline style |

---

## SOLID Considerations
- Component remains *Single Responsibility*: purely presentational/interactive UI.
- No stateful business logic extracted → still acceptable for UI layer.
- All props & hooks kept minimal – *Interface Segregation* maintained.

---

## Next Steps
1. Implement the refactor in `index.tsx` using the above plan.
2. Verify visual parity.
3. Document architecture & decisions in `RealtimeCollaboration.md`. 