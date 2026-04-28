---
name: deckgl-performance-debugging
description: Debug and optimize deck.gl performance in React Mapbox apps. Use when Codex needs to fix blank Deck.gl layers, slow rerenders, unstable data props, updateTriggers, picking problems, WebGL errors, large datasets, memory leaks, or unit/browser testing for Deck.gl layer factories and MapboxOverlay rendering.
---

# Deck.gl Performance Debugging

## Core Workflow

1. Reproduce the symptom: blank layer, misplaced layer, slow pan/zoom, slow data update, broken picking, or memory growth.
2. Check basics first: map container size, Mapbox CSS, token, camera near data, coordinate order, layer visibility, and console WebGL errors.
3. Inspect layer props: stable ids, stable data identity, cheap accessors, correct units, `pickable`, `beforeId`/`slot`, and `updateTriggers`.
4. Fix React causes: memoize transformed data, keep layer factories pure, avoid state updates in high-frequency callbacks, and do not recreate map/overlay lifecycle unnecessarily.
5. Verify with unit tests for layer factories and browser checks for visible canvas, picking, and style-stack placement.

## High-Impact Rules

- Changing `data` identity causes buffer recalculation. Memoize filters/maps.
- Use `updateTriggers` when accessor output changes while source data remains stable.
- Prefer scale props like `radiusScale` and `elevationScale` for cheap animation.
- Use `visible` for frequent toggles instead of removing/readding layers.
- Split very large datasets into chunks or vector/tile layers rather than one massive array.
- Do not update React state on every `onHover` or `onViewStateChange` frame unless throttled.

## References

- `references/performance-debugging.md`: performance checklist, blank-layer debugging, interaction debugging, and testing.
- Upstream docs: `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/performance.md`.
