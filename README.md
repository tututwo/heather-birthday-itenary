# Heather Birthday Itenary

A Svelte 5 and GSAP ScrollTrigger recreation of Jhey Tompkins' CodePen book interaction.

## What It Does

- Renders a fixed CSS 3D sketch book while the page scrolls vertically.
- Uses ScrollTrigger to scale the book, open the cover, flip each paper leaf, and reveal the final logo.
- Keeps page data in immutable TypeScript constants instead of component state.
- Scopes all GSAP work to the Svelte component root and cleans it up on unmount.
- Provides a reduced-motion fallback grid of the same sketch links.

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

The source CodePen reference is https://codepen.io/jh3y/pen/ExPVzBY.
