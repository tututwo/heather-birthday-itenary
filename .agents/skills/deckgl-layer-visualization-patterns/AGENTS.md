# Deck.gl Layer Visualization Quick Reference

## Layer Choice

| Goal             | Layer                                       |
| ---------------- | ------------------------------------------- |
| Points/circles   | `ScatterplotLayer`                          |
| Labels           | `TextLayer`                                 |
| GeoJSON features | `GeoJsonLayer`                              |
| Lines/routes     | `LineLayer` or `PathLayer`                  |
| Density          | `HeatmapLayer`, `HexagonLayer`, `GridLayer` |
| Vector tiles     | `MVTLayer`                                  |

## Typed Layer Factory

```ts
import type { LayersList, Position } from '@deck.gl/core';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';

type Row = {
	id: string;
	label: string;
	selected: boolean;
	coordinates: [longitude: number, latitude: number];
};

export function buildLayers(rows: Row[], onSelect: (id: string) => void): LayersList {
	return [
		new ScatterplotLayer<Row>({
			id: 'points',
			data: rows,
			pickable: true,
			radiusUnits: 'pixels',
			getPosition: (d): Position => d.coordinates,
			getRadius: (d) => (d.selected ? 8 : 5),
			getFillColor: (d) => (d.selected ? [15, 118, 110, 235] : [47, 91, 102, 220]),
			onClick: (info) => {
				if (!info.object) return false;
				onSelect(info.object.id);
				return true;
			},
			updateTriggers: { getRadius: rows, getFillColor: rows }
		}),
		new TextLayer<Row>({
			id: 'labels',
			data: rows.filter((d) => d.selected),
			getPosition: (d) => d.coordinates,
			getText: (d) => d.label,
			getSize: 11,
			sizeUnits: 'pixels'
		})
	];
}
```

## Rules

- Use stable explicit layer ids.
- Keep accessors cheap and typed.
- Escape HTML before returning tooltip `html`.
- Unit-test pure layer factories by calling accessors with representative rows.
