---
name: deckgl-react-mapbox-patterns
description: Official patterns for integrating deck.gl with React and Mapbox GL JS through react-map-gl and MapboxOverlay. Use when Codex needs setup, package choices, TypeScript imports, MapboxOverlay lifecycle, interleaved vs overlaid vs reverse-controlled rendering, SSR/client-only handling, token/CSS setup, or React Mapbox deck.gl integration review.
---

# Deck.gl React Mapbox Patterns

## Core Workflow

1. Inspect the current React map stack: framework, bundler, `mapbox-gl`, `react-map-gl`, deck.gl package versions, token pattern, and whether the map is Mapbox-root or Deck-root.
2. Prefer `react-map-gl/mapbox` plus `@deck.gl/mapbox` for React + Mapbox work. Use direct `mapbox-gl` lifecycle only when the app already owns the Mapbox instance imperatively.
3. Choose one integration mode before writing code:
   - Use `MapboxOverlay` with `interleaved: true` when deck.gl layers must sit inside the Mapbox style stack, render below labels, use Mapbox v3 `slot`, or share 3D depth.
   - Use `MapboxOverlay` with `interleaved: false` when Mapbox controls/plugins should work and deck.gl can render in a separate overlay canvas.
   - Use `<DeckGL>` as the root only when deck.gl must own controllers, custom pointer input, multiple views, or deck widgets.
4. Keep deck.gl layer construction separate from React map lifecycle. Build layers in typed helper functions and pass them through `MapboxOverlay`.
5. Verify the app in a browser: map tiles load, deck canvas/layers render, picking works, style-stack placement is correct, and no WebGL/token/CSS errors appear.

## Essential Rules

- Install only modules that are used: usually `mapbox-gl`, `react-map-gl`, `@deck.gl/core`, `@deck.gl/layers`, and `@deck.gl/mapbox`; add `@deck.gl/react` only for Deck-root mode.
- Import `mapbox-gl/dist/mapbox-gl.css` once in the map component or app entry.
- Use deck.gl v9+ package-root imports and `import type` for `MapboxOverlayProps`, `MapViewState`, `PickingInfo`, and layer prop types.
- With `MapboxOverlay`, do not pass deck.gl `controller`, `viewState`, or `initialViewState`; Mapbox owns the camera.
- Store the Mapbox token through the app's existing public environment variable convention. Never hardcode tokens.
- Do not use the pure `Deck` class directly in React app components.

## References

- `references/react-mapbox-patterns.md`: install commands, integration mode decision table, and React code patterns.
- `../deckgl-mapbox-style-stack`: use for `beforeId`, Mapbox v3 `slot`, and style-layer placement.
- `../deckgl-layer-visualization-patterns`: use for layer selection, typed layer factories, picking, and tooltips.
- `../deckgl-performance-debugging`: use for blank layers, slow updates, unstable data, and WebGL/runtime debugging.

## Deep Docs Lookup

Bundled upstream Deck.gl docs live in `references/upstream/deckgl-docs`. Use `rg` there for API details before guessing, especially in:

- `developer-guide/base-maps/using-with-mapbox.md`
- `api-reference/mapbox/mapbox-overlay.md`
- `api-reference/mapbox/overview.md`
- `get-started/using-with-react.md`
- `get-started/using-with-typescript.md`
