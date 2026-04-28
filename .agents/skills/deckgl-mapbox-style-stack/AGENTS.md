# Deck.gl Mapbox Style Stack Quick Reference

## Mode

Use `MapboxOverlay` with `interleaved: true`.

```tsx
<DeckOverlay interleaved layers={layers} />
```

## Classic Styles

Use `beforeId` on each deck.gl layer.

```ts
new ScatterplotLayer({
	id: 'jobs',
	data,
	getPosition: (d) => d.coordinates,
	beforeId: 'waterway-label'
});
```

## Mapbox v3 Standard Style

Prefer `slot`.

```ts
new ScatterplotLayer({
	id: 'jobs',
	data,
	getPosition: (d) => d.coordinates,
	slot: 'middle'
});
```

## Layer Order Rules

- Below labels: insert before first symbol label layer.
- Above roads: insert after road geometry or use the appropriate Standard slot.
- Foreground selection layers should be above background/halo layers.
- Deck.gl layers using shared extensions should share the same `beforeId` or `slot`.
