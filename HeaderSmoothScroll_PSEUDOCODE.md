# HeaderSmoothScroll_PSEUDOCODE.md

## Goal

Implement smooth scrolling for navigation items in the Header component.

## Steps

1. Add `scroll-behavior: smooth` to the global CSS (e.g., in `globals.css` or equivalent).
2. Update the `NavLink` component:
   a. If the link is a hash link (starts with `#`), intercept the click event.
   b. Prevent the default behavior.
   c. Use `document.getElementById` or `document.querySelector` to find the target element.
   d. Use `element.scrollIntoView({ behavior: "smooth" })` to scroll smoothly.
   e. Update the URL hash using `window.history.pushState` or `window.location.hash`.
   f. If a callback (e.g., to close the mobile menu) is provided, call it after scrolling.
3. Ensure that navigation to other pages (not hash links) still works as normal.
4. Test on both desktop and mobile menu.
