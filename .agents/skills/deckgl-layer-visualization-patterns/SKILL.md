---
name: deckgl-layer-visualization-patterns
description: Patterns for building typed deck.gl visualization layers in React Mapbox apps. Use when Codex needs layer selection, ScatterplotLayer, TextLayer, GeoJsonLayer, aggregation layers, point and label overlays, picking, safe tooltips, selection styling, data accessors, or Spacemap-like Deck.gl layer factories.
---

# Deck.gl Layer Visualization Patterns

## Core Workflow

1. Identify the data shape and visual task: points, labels, polygons, lines, density, aggregation, animation, or selection.
2. Choose the smallest deck.gl layer that fits the task. Prefer core layers before aggregation or geo layers.
3. Define typed row data and pure layer factory functions. Keep React state and Mapbox lifecycle outside layer factories.
4. Use stable ids, `[longitude, latitude]` coordinates, explicit units, and `pickable` only where needed.
5. Add focused tests for layer ids, accessor outputs, selected styling, and click/tooltip behavior.

## Layer Defaults

- Points: `ScatterplotLayer`
- Labels: `TextLayer`
- GeoJSON polygons/lines/points: `GeoJsonLayer`
- Routes/paths: `PathLayer` or `LineLayer`
- Origin-destination arcs: `ArcLayer` or `GreatCircleLayer`
- Density: `HeatmapLayer`, `HexagonLayer`, or `GridLayer`
- Vector tiles: `MVTLayer`

## References

- `references/layers-and-data.md`: layer selection, typed layer examples, picking, data loading, and tooltips.
- `references/spacemap-point-labels.md`: point, halo, and label layer factory pattern.
- Upstream docs: `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/layers/README.md`.
