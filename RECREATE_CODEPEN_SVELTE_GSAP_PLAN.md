# Recreate the CodePen Book in Svelte 5 and GSAP

Source reference: https://codepen.io/jh3y/pen/ExPVzBY

## 1. Engineering Decision

Build this as a Svelte 5 application using DOM markup, CSS 3D transforms, and GSAP ScrollTrigger. Do not use Three.js for the first implementation.

The original pen is a CSS 3D book illusion, not a WebGL scene. Each page is an HTML element with two halves, sketch images are clickable anchors, and ScrollTrigger drives `scale`, `rotateY`, `z`, and `opacity`. Recreating that with Svelte and GSAP preserves the interaction model, keeps the page content inspectable and accessible, and avoids the extra complexity of raycasting, texture generation, and HTML overlay synchronization that a Three.js version would require.

Use Three.js only as a future enhancement if the product goal changes to physical page bending, lighting, shadows, camera movement, or textured paper geometry.

## 2. Target Outcome

The implementation is complete when the local app reproduces the CodePen behavior:

- A fixed, centered 3D book sits in the viewport while the page scrolls vertically.
- The book starts scaled down and scales to full size during the first scroll segment.
- The front cover opens, then each inner page flips in sequence, then the back cover is revealed.
- Each paper page has front/back faces, page numbers, lined-paper styling, and clickable sketch images.
- The final insert shows the bear logo, which fades in near the end of the scroll.
- All GSAP animations are scoped to the Svelte component and are cleaned up on unmount.
- The app builds without Svelte, TypeScript, or production bundle errors.

## 3. Repository Setup

The current folder has no app scaffold. Create a Vite Svelte TypeScript app in place.

```bash
npm create vite@latest . -- --template svelte-ts
npm install
npm install gsap
```

After scaffolding, keep the implementation small:

```text
src/
  app.css
  App.svelte
  lib/
    book/
      bookData.ts
      Book.svelte
      BookPage.svelte
      gsapBook.ts
```

Optional if the implementation stays simple:

- Merge `BookPage.svelte` into `Book.svelte` for v1.
- Keep `gsapBook.ts` only if animation setup grows beyond one readable function.

## 4. Data Model

Move all repeated page data out of markup. The CodePen generates the book from a `DEMOS` array and a `PAGES = 10` constant; mirror that approach in TypeScript.

Use immutable constants rather than Svelte state. These values do not need `$state` because they are not user-mutated and do not need fine-grained reactivity.

```ts
// src/lib/book/bookData.ts
export const PAGE_COUNT = 10;
export const PAGE_SCROLL_VH = 25;
export const TOTAL_SCROLL_VH = (PAGE_COUNT * 2 + 2) * PAGE_SCROLL_VH;

export type Demo = {
  name: string;
  id: string;
};

export type BookLeaf = {
  id: string;
  pageIndex: number;
  front?: SketchPage;
  back?: SketchPage;
  variant: 'front-cover' | 'paper' | 'back-cover';
};

export type SketchPage = {
  number: number;
  demo: Demo;
  href: string;
  imageSrc: string;
  imageAlt: string;
};
```

Use the original demo names and CodePen ids from the source. Build the final page model as:

- Leaf 1: front cover.
- Leaves 2-11: ten paper leaves, each containing two sketch pages.
- Leaf 12: back cover.

Implementation details:

- Use deterministic ordering for v1. The original pen shuffles the demos, but deterministic output is easier to test and debug.
- Add shuffling later only if desired, and gate it behind a stable seed so visual regression checks do not become noisy.
- Generate sketch URLs with `https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/${demo.name}-sketch.svg`.
- Generate sketch links with `https://codepen.io/jh3y/full/${demo.id}`.
- Use the final logo URL `https://assets.codepen.io/605876/bear-with-cap.svg`.

## 5. Svelte Component Design

### `App.svelte`

Keep `App.svelte` as a composition shell.

```svelte
<script lang="ts">
  import Book from './lib/book/Book.svelte';
</script>

<Book />
```

### `Book.svelte`

Responsibilities:

- Own the component root element via `bind:this`.
- Render the fixed heading text and the `.book` structure.
- Set the scroll height CSS variable from `TOTAL_SCROLL_VH`.
- Initialize GSAP in `onMount`.
- Return `ctx.revert()` from `onMount` cleanup.

Use Svelte 5 patterns:

- Use `let container: HTMLElement;` for `bind:this`.
- Do not use `$state` for constants, static arrays, or DOM refs unless they drive template updates.
- Do not use `$effect` for GSAP initialization. GSAP needs DOM availability and lifecycle cleanup, so `onMount` is the correct boundary.
- Use keyed `{#each leaves as leaf (leaf.id)}` blocks. Do not key pages by array index.
- Pass CSS custom properties with `style:--page-index={leaf.pageIndex}`.

Markup shape:

```svelte
<main
  class="book-scene"
  bind:this={container}
  style:--total-scroll-vh={TOTAL_SCROLL_VH}
>
  <h1>Scroll</h1>
  <div class="book" aria-label="Animated sketch book">
    <div class="book__spine"></div>
    {#each leaves as leaf (leaf.id)}
      <BookPage {leaf} />
    {/each}
  </div>
</main>
```

### `BookPage.svelte`

Responsibilities:

- Render one physical leaf with a front half and a back half.
- Apply classes for cover variants.
- Render sketch links only when that side has sketch data.
- Render the final insert/logo only for the back cover.

Use explicit props:

```svelte
<script lang="ts">
  import type { BookLeaf } from './bookData';

  let { leaf }: { leaf: BookLeaf } = $props();
</script>
```

Class contract:

- Every physical leaf must have `.page.book__page`.
- Front cover also has `.book__cover.book__cover--front`.
- Back cover also has `.book__cover.book__cover--back`.
- Each side is `.page__half.page__half--front` or `.page__half.page__half--back`.
- The logo image must use class `.logo` because the ScrollTrigger fade targets that selector.

## 6. CSS Porting Plan

Port the Stylus to normal CSS. Keep the class names close to the original so the animation code can stay obvious.

Global CSS belongs in `src/app.css`:

```css
* {
  box-sizing: border-box;
}

:root {
  --page-count: 20;
  --page-scroll: 25;
  --underline: hsla(0, 0%, 25%, 0.4);
  --spine: hsl(0, 0%, 0%);
  --cover: hsl(0, 0%, 10%);
  --bg: hsl(0, 0%, 30%);
  --insert: hsl(0, 0%, 85%);
  --page: hsl(0, 0%, 90%);
}

html,
body,
#app {
  margin: 0;
  min-width: 100%;
  min-height: 100%;
}

body {
  overflow-x: hidden;
  background: var(--bg);
}
```

Component CSS belongs in `Book.svelte` or `BookPage.svelte`. Keep the 3D rendering rules together:

- `.book-scene` sets `min-height: calc(var(--total-scroll-vh) * 1vh)`.
- `.book` is fixed at viewport center, has `perspective: 1200px`, `transform-style: preserve-3d`, and starts at `scale(0.5)`.
- `.book__page` is positioned absolutely, uses `transform-origin: 0% 50%`, and gets z-index from `--page-index`.
- `.page` and `.page__half` use `transform-style: preserve-3d`.
- `.page__half--front` uses `backface-visibility: hidden`.
- `.page__half--back` is rotated `180deg` and translated slightly forward.
- Non-cover pages use the repeating-linear-gradient lined paper background.
- Images remain absolutely centered with `object-fit: contain`, not `object-fit: center`.

Performance constraints:

- Use `will-change: transform` on `.book` and `.book__page`.
- Use `will-change: opacity` on `.logo`.
- Do not add `will-change` broadly to every descendant.
- Animate transform and opacity only. Do not animate layout properties like width, height, top, left, margin, or padding.

## 7. GSAP and ScrollTrigger Plan

Create a dedicated setup function if it keeps `Book.svelte` cleaner.

```ts
// src/lib/book/gsapBook.ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const scrollUnit = () => window.innerHeight * 0.25;

export function setupBookAnimation(root: HTMLElement) {
  return gsap.context(() => {
    const book = root.querySelector<HTMLElement>('.book');
    const logo = root.querySelector<HTMLElement>('.logo');
    const pages = gsap.utils.toArray<HTMLElement>('.book__page');

    if (!book) return;

    gsap.to(book, {
      scale: 1,
      scrollTrigger: {
        scrub: 1,
        start: 0,
        end: () => scrollUnit(),
        invalidateOnRefresh: true
      }
    });

    if (logo) {
      gsap.to(logo, {
        autoAlpha: 1,
        scrollTrigger: {
          scrub: true,
          start: () => 13.5 * scrollUnit(),
          end: () => 14 * scrollUnit(),
          invalidateOnRefresh: true
        }
      });
    }

    pages.forEach((page, index) => {
      gsap.set(page, { z: index === 0 ? 13 : -index });

      const isBackCover = index === pages.length - 1;
      if (isBackCover) return;

      gsap.to(page, {
        rotateY: `-=${180 - index / 2}`,
        scrollTrigger: {
          scrub: 1,
          start: () => (index + 1) * scrollUnit(),
          end: () => (index + 2) * scrollUnit(),
          invalidateOnRefresh: true
        }
      });

      gsap.to(page, {
        z: index === 0 ? -13 : index,
        scrollTrigger: {
          scrub: 1,
          start: () => (index + 1) * scrollUnit(),
          end: () => (index + 1.5) * scrollUnit(),
          invalidateOnRefresh: true
        }
      });
    });
  }, root);
}
```

In `Book.svelte`:

```svelte
<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { setupBookAnimation } from './gsapBook';

  let container: HTMLElement;

  onMount(() => {
    let ctx: gsap.Context | undefined;

    tick().then(() => {
      if (!container) return;
      ctx = setupBookAnimation(container);
      ScrollTrigger.refresh();
    });

    return () => ctx?.revert();
  });
</script>
```

Important implementation notes:

- Register `ScrollTrigger` once in `gsapBook.ts`, not inside a reactive component body.
- Create triggers in top-to-bottom page order, exactly as the DOM renders the leaves.
- Use `invalidateOnRefresh: true` because start/end values depend on `window.innerHeight`.
- Use `autoAlpha` for the logo fade so the logo is not interactable while hidden.
- Keep `markers: false` in committed code. Use markers only temporarily while tuning.
- Avoid nesting ScrollTriggered child tweens inside a parent timeline. This interaction is simpler and more faithful as top-level tweens.

## 8. Reduced Motion and Accessibility

This is a motion-heavy effect. Respect user motion preferences without destroying content access.

Use `gsap.matchMedia()` inside `setupBookAnimation`:

- For `(prefers-reduced-motion: reduce)`, do not create the page-turn ScrollTriggers.
- Set the book to full scale immediately.
- Set every page to a readable, non-animated final or stacked state.
- Set the logo visible immediately.

Minimum reduced-motion behavior:

```ts
const mm = gsap.matchMedia();

mm.add(
  {
    reduceMotion: '(prefers-reduced-motion: reduce)',
    fullMotion: '(prefers-reduced-motion: no-preference)'
  },
  (context) => {
    const { reduceMotion } = context.conditions;
    if (reduceMotion) {
      gsap.set(book, { scale: 1 });
      gsap.set(logo, { autoAlpha: 1 });
      return;
    }

    // Create the ScrollTriggers here.
  },
  root
);
```

Make sure cleanup reverts the matchMedia context. If `gsap.context` owns the setup, validate that both contexts revert cleanly during hot module reload. If cleanup is unclear, return a small wrapper cleanup that calls both `ctx.revert()` and `mm.revert()`.

Accessibility requirements:

- Every sketch link has meaningful image alt text, for example `"Kitkat sketch preview"`.
- Links use `target="_blank"` and `rel="noreferrer noopener"`.
- The visual `h1` can remain fixed, but it should not block pointer events.
- If this later becomes itinerary content, use real text content for important information rather than image-only pages.

## 9. Implementation Checklist

1. Scaffold the Svelte app and install GSAP.
2. Add `src/lib/book/bookData.ts` with demo constants, types, URL helpers, and leaf construction.
3. Replace the default `App.svelte` with the `Book` composition shell.
4. Build `Book.svelte` with the root scene, fixed heading, book spine, and keyed leaf rendering.
5. Build `BookPage.svelte` with front/back halves, cover variants, sketch links, page numbers, insert, and logo.
6. Port global reset and theme variables into `src/app.css`.
7. Port book/page/sticker/logo styles into component CSS.
8. Add `src/lib/book/gsapBook.ts` and implement the ScrollTrigger setup.
9. Wire `setupBookAnimation(container)` from `Book.svelte` using `onMount`, `tick`, and cleanup.
10. Add reduced-motion handling with `gsap.matchMedia()`.
11. Run Svelte validation and fix any compiler warnings.
12. Run a production build.
13. Start the dev server and visually verify the full scroll sequence.

## 10. Validation Commands

Use the Svelte MCP tool if a Svelte component produces unclear compiler output:

```bash
npx @sveltejs/mcp svelte-autofixer ./src/lib/book/Book.svelte --svelte-version 5
npx @sveltejs/mcp svelte-autofixer ./src/lib/book/BookPage.svelte --svelte-version 5
```

Standard project checks:

```bash
npm run check
npm run build
npm run dev -- --host 127.0.0.1
```

Browser verification checklist:

- At `scrollY = 0`, the book is centered and starts at half scale.
- During the first `25vh`, the book scales smoothly to full size.
- The front cover rotates open before paper pages begin flipping.
- Paper leaves flip one at a time with stable z-depth and no visible flicker.
- The back cover is not animated as a normal paper page.
- The logo fades in near the final reveal.
- Horizontal scrolling never appears.
- Sketch links are clickable throughout the interaction.
- Hot reload does not duplicate ScrollTriggers or leave stale inline styles.

## 11. Known Risks and Mitigations

Remote assets may fail or load slowly.

- Use the CodePen asset URLs for v1 fidelity.
- After the animation is verified, optionally download the SVGs into `src/lib/assets/book/` and update `bookData.ts` to import local assets.

CSS 3D can differ slightly across browsers.

- Keep the transform hierarchy close to the original.
- Test in Chromium and Safari.
- Avoid simplifying `transform-style: preserve-3d`, `backface-visibility`, and small z translations until the page flipping is visually verified.

ScrollTrigger measurements depend on viewport height.

- Use function-based `start` and `end`.
- Set `invalidateOnRefresh: true`.
- Call `ScrollTrigger.refresh()` after Svelte renders and images begin loading.

The original pen uses randomized demo order.

- Keep deterministic order for the first implementation.
- If randomization is required later, implement a seeded shuffle and record the seed.

## 12. Definition of Done

The work is done when:

- The app is a Svelte 5 TypeScript project with GSAP installed from npm.
- The visual structure matches the CodePen book closely enough that differences are deliberate, not accidental.
- All animation setup is component-scoped and cleaned up on unmount.
- Reduced-motion users get a non-animated readable state.
- `npm run check` and `npm run build` pass.
- A manual scroll test confirms every page turn and the logo reveal.
