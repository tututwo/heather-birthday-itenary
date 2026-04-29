# Heather Birthday Itenary

A Svelte 5 and GSAP ScrollTrigger birthday itinerary book.

## What It Does

- Renders a fixed CSS 3D birthday book while the page scrolls vertically.
- Uses ScrollTrigger to scale the book, open the cover, and flip each paper leaf.
- Splits each `assets/storyboard/stop*.png` spread into left and right book pages with CSS cropping.
- Keeps storyboard data in immutable TypeScript constants instead of component state.
- Scopes all GSAP work to the Svelte component root and cleans it up on unmount.
- Provides a reduced-motion fallback gallery of the storyboard spreads.

## Development

```bash
npm install
npm run dev -- --host 127.0.0.1
```

## Validation

```bash
npm run check
npm run build
```
