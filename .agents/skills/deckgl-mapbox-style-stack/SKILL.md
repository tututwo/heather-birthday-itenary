---
name: deckgl-mapbox-style-stack
description: Guidance for placing deck.gl layers inside a Mapbox GL JS style stack with MapboxOverlay. Use when Codex needs interleaved rendering, beforeId selection, Mapbox v3 Standard slot placement, layer ordering below labels or roads, style-layer lookup, or cartographic decisions about how Deck.gl overlays should sit against Mapbox base-map layers.
---

# Deck.gl Mapbox Style Stack

## Core Workflow

1. Confirm the app uses `MapboxOverlay` and needs style-stack ordering. If ordering does not matter, prefer overlaid mode from `deckgl-react-mapbox-patterns`.
2. Inspect the Mapbox style: identify label, road, water, building, and custom app layers.
3. For classic Mapbox styles, set `beforeId` on deck.gl layers to insert before an existing Mapbox style layer.
4. For Mapbox v3 Standard Style, set `slot` on deck.gl layers instead of relying only on `beforeId`.
5. Verify visually: deck layer appears above geography, below labels when intended, and does not hide critical route/user content.

## Placement Defaults

- Data overlays should usually sit above land/water/background and below labels.
- Selected objects, active routes, and user-generated foreground content should render above less-important data layers.
- Use one shared `beforeId` or `slot` for deck.gl layers that must share extension behavior such as masks or collision filtering.
- Do not add Deck.gl overlays to decorative base-map positions that compete with app data.

## References

- `references/style-stack-patterns.md`: style insertion recipes, lookup helpers, and common pitfalls.
- Upstream docs: `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/mapbox/mapbox-overlay.md`.
- Related skills: use `mapbox-cartography` for visual hierarchy and `mapbox-style-quality` for style validation.
