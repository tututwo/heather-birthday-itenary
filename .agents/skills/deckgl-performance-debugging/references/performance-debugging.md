# Performance And Debugging

Source docs: `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/performance.md`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/debugging.md`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/testing.md`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/core/deck.md`, and `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/core/layer.md`.

## Performance Checklist

- Keep `data` references stable. Filtering, mapping, or concatenating data on every render forces expensive GPU buffer regeneration.
- Memoize transformed data with `useMemo`; do not mutate nested data and expect deck.gl to detect it.
- Use `updateTriggers` when accessor output changes but `data` should remain stable.
- Use constants instead of accessor functions when all objects share a value.
- Use scale props such as `radiusScale`, `lineWidthScale`, and `elevationScale` for cheap animation instead of recomputing per-object accessors each frame.
- Keep accessors trivial. Precompute expensive values and avoid allocating arrays inside accessors for large datasets.
- Toggle layers with `visible` instead of conditionally removing/readding frequently toggled layers.
- Chunk very large datasets into multiple layers with stable ids, or use async iterables/binary data for incremental loading.
- Avoid expensive React state updates in high-frequency callbacks such as `onHover`, `onViewStateChange`, and animation ticks.
- Recreating deck.gl layer instances with stable ids is acceptable; changing `data` identity is the expensive part.

## Common React Fixes

```tsx
const filteredData = useMemo(
	() => data.filter((d) => d.time >= minTime && d.time <= maxTime),
	[data, minTime, maxTime]
);

const layers = useMemo(
	() => [
		new ScatterplotLayer<Point>({
			id: 'points',
			data: filteredData,
			getPosition: (d) => d.coordinates,
			getRadius: (d) => d.value,
			updateTriggers: { getRadius: radiusMetric }
		})
	],
	[filteredData, radiusMetric]
);
```

For year or metric switches, prefer stable source data plus `updateTriggers`:

```tsx
new ScatterplotLayer<CensusTract>({
	id: 'tracts',
	data: tracts,
	getPosition: (d) => d.centroid,
	getRadius: (d) => Math.sqrt(d.populationsByYear[year]),
	updateTriggers: { getRadius: year }
});
```

## Blank Map Or Missing Layer

Check these before changing architecture:

- The map container has a real height and width.
- `import 'mapbox-gl/dist/mapbox-gl.css'` runs once.
- The Mapbox token is present at runtime and matches the project's bundler convention.
- The camera is near the data and coordinates are `[longitude, latitude]`, not `[latitude, longitude]`.
- Data accessors return the expected shape and numbers, not strings or `undefined`.
- Layer colors include visible alpha and dimensions are in expected units.
- The layer id is unique and stable.
- In interleaved mode, Mapbox GL JS supports WebGL2. Use Mapbox GL JS v3+ where possible.
- `beforeId` points to an existing Mapbox style layer. For Mapbox v3 Standard Style, use `slot`.
- If interleaving fails or ordering is not important, try `interleaved: false` to isolate Mapbox style-stack issues.
- Browser console has no WebGL context, shader, CORS, worker, or token errors.

## Debugging Interactions

- Set `pickable: true` on the target layer.
- Add a simple `getTooltip={({object}) => object && 'hit'}` to confirm picking.
- Increase `pickingRadius` for tiny touch targets.
- Remember that offscreen objects cannot be picked.
- In Mapbox-root mode, Mapbox handles camera interactions; deck-specific drag callbacks may not fire.

## Testing

- For app work, run the local dev server and verify in a browser. Check map tiles, deck canvas, interactions, tooltip placement, and console output.
- For significant frontend changes, capture desktop and mobile screenshots or use browser automation to ensure the canvas is nonblank and controls do not overlap.
- Unit test layer factory functions by asserting layer ids, props, `visible`, `pickable`, and accessor outputs for representative rows.
- Rendering and custom-layer tests require browser/WebGL infrastructure. Use `@deck.gl/test-utils` only when the project already has that style of visual or layer lifecycle test setup.
