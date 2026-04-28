# Style Stack Patterns

## Find An Insertion Layer

For classic styles, inspect `map.getStyle().layers` after map load.

```ts
function findFirstSymbolLayerId(map: mapboxgl.Map): string | undefined {
	return map.getStyle().layers?.find((layer) => layer.type === 'symbol')?.id;
}

function findFirstLabelLayerId(map: mapboxgl.Map): string | undefined {
	return map
		.getStyle()
		.layers?.find(
			(layer) => layer.type === 'symbol' && typeof layer.layout?.['text-field'] !== 'undefined'
		)?.id;
}
```

Use the returned id as `beforeId` for deck.gl layers that should render below labels.

## Common Placements

| Goal                                 | Placement                                                     |
| ------------------------------------ | ------------------------------------------------------------- |
| Data points below all labels         | `beforeId` first text symbol layer                            |
| Data polygons below roads and labels | `beforeId` first road or label layer, depending on base style |
| Active route or selected item        | Foreground deck.gl layer after other deck.gl layers           |
| Mapbox v3 Standard style             | Use `slot: "bottom"`, `slot: "middle"`, or `slot: "top"`      |

## Interleaved Constraints

- Requires Mapbox GL JS v2.13+ with WebGL2, or Mapbox GL JS v3+.
- `beforeId` only matters when `interleaved: true`.
- With Mapbox v3 Standard Style, `slot` is more reliable than a style-layer id.
- Extensions that require shared render context should use layers in the same `beforeId` or `slot` group.

## Spacemap-Like Pattern

Use separate layers for halos, points, and labels:

1. Halo layer: not pickable, largest radius, lowest app overlay.
2. Point layer: pickable, selected styling, above halo.
3. Text layer: not pickable, only high-priority labels, above points.

For a muted data-map base, render all three above land/water and below base labels unless selected features must dominate the map.
