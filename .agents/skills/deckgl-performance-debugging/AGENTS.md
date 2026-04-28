# Deck.gl Performance Debugging Quick Reference

## Blank Layer Checklist

- Container has width and height.
- Mapbox CSS is imported.
- Camera is near `[longitude, latitude]` data.
- Layer has stable `id`, visible color alpha, and expected units.
- Data accessors return numbers/arrays, not strings or `undefined`.
- `beforeId` exists, or `slot` is used for Mapbox v3 Standard Style.
- Browser console has no WebGL, shader, worker, token, or CORS errors.

## React Performance

```tsx
const filteredData = useMemo(() => data.filter((d) => d.score >= minScore), [data, minScore]);

const layers = useMemo(() => buildLayers(filteredData, onSelect), [filteredData, onSelect]);
```

## Accessor Updates

Use `updateTriggers` when the row data stays stable but an accessor depends on outside state.

```ts
new ScatterplotLayer<Row>({
	id: 'points',
	data,
	getPosition: (d) => d.coordinates,
	getRadius: (d) => d.values[year],
	updateTriggers: { getRadius: year }
});
```

## Test What You Can

- Unit-test pure layer factories.
- Browser-test visible canvas, picking, tooltip, and style-stack placement.
- Use `rg` in upstream docs for layer-specific performance notes.
