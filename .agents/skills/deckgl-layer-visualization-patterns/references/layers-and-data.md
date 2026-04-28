# Layers And Data

Source docs: `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/using-layers.md`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/loading-data.md`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/developer-guide/interactivity.md`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/layers/README.md`, and layer-specific files under `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/layers`, `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/aggregation-layers`, and `../deckgl-react-mapbox-patterns/references/upstream/deckgl-docs/api-reference/geo-layers`.

## Layer Selection

| Data or goal                          | Common layer                                                   |
| ------------------------------------- | -------------------------------------------------------------- |
| Points, circles, proportional symbols | `ScatterplotLayer` from `@deck.gl/layers`                      |
| Labels                                | `TextLayer`                                                    |
| Custom marker sprites                 | `IconLayer`                                                    |
| Straight segments                     | `LineLayer`                                                    |
| Routes or polylines                   | `PathLayer`                                                    |
| Origin-destination arcs               | `ArcLayer` or `GreatCircleLayer`                               |
| GeoJSON points, lines, polygons       | `GeoJsonLayer`                                                 |
| Point density                         | `HeatmapLayer`, `HexagonLayer`, `GridLayer`, `ScreenGridLayer` |
| Vector tiles                          | `MVTLayer`                                                     |
| Raster/custom tiles                   | `TileLayer` with `BitmapLayer` sublayers                       |
| H3, S2, quadkey, geohash indexes      | matching `@deck.gl/geo-layers` layer                           |
| Animated trips                        | `TripsLayer`                                                   |
| 3D tiles or terrain                   | `Tile3DLayer`, `TerrainLayer`                                  |

## Layer Construction Rules

- Set a stable, explicit `id` for every layer.
- Treat layer instances as immutable. To update, create a new layer with the same `id` and changed props.
- Use `[longitude, latitude]` or `[longitude, latitude, altitude]` for geospatial positions.
- Prefer constant props where possible, such as `getFillColor: [255, 140, 0, 180]`.
- Use unit props deliberately: `radiusUnits`, `lineWidthUnits`, `pointRadiusUnits`, and scale props like `radiusScale` or `elevationScale`.
- Set `pickable: true` only for layers that need hover, click, or tooltip behavior.

## TypeScript Patterns

```tsx
import { ScatterplotLayer } from '@deck.gl/layers';
import type { PickingInfo } from '@deck.gl/core';

type Station = {
	name: string;
	exits: number;
	coordinates: [longitude: number, latitude: number];
};

const stationLayer = new ScatterplotLayer<Station>({
	id: 'stations',
	data: stations,
	stroked: true,
	getPosition: (d) => d.coordinates,
	getRadius: (d) => Math.sqrt(d.exits),
	radiusScale: 6,
	getFillColor: [255, 140, 0, 180],
	getLineColor: [0, 0, 0],
	pickable: true
});

const getTooltip = ({ object }: PickingInfo<Station>) =>
	object && `${object.name}: ${object.exits}`;
```

For GeoJSON, type feature properties and import `Feature`/`Geometry` from `geojson`.

```tsx
import { GeoJsonLayer } from '@deck.gl/layers';
import type { Feature, Geometry } from 'geojson';

type CountyProps = {
	name: string;
	value: number;
};

const counties = new GeoJsonLayer<CountyProps>({
	id: 'counties',
	data: countyFeatureCollection,
	filled: true,
	stroked: true,
	getFillColor: (feature: Feature<Geometry, CountyProps>) =>
		feature.properties.value > 100 ? [200, 60, 40, 180] : [60, 130, 180, 140],
	getLineColor: [255, 255, 255],
	getLineWidth: 1,
	pickable: true
});
```

## Data Loading

- `data` can be an array, iterable, promise, URL, or suitable object with `length`.
- Deck.gl can fetch JSON and images by default. Add loaders for CSV, LAS, MVT, terrain, and other formats.
- Use `loadOptions.core.fetch` for authenticated fetches.

```ts
new ScatterplotLayer({
	id: 'secure-points',
	data: '/api/points',
	loadOptions: {
		core: {
			fetch: {
				headers: { Authorization: `Bearer ${accessToken}` }
			}
		}
	},
	getPosition: (d) => d.position
});
```

```ts
import { CSVLoader } from '@loaders.gl/csv';
import { HexagonLayer } from '@deck.gl/aggregation-layers';

new HexagonLayer({
	id: 'hexes',
	data: '/data/points.tsv',
	loaders: [CSVLoader],
	loadOptions: { csv: { delimiter: '\t', dynamicTyping: true } },
	getPosition: (d) => [d.longitude, d.latitude],
	radius: 200
});
```

## Picking And Tooltips

- Enable picking per layer with `pickable: true`.
- Use `getTooltip` for simple hover labels.
- Use `onHover` or `onClick` on a layer for layer-specific behavior; return truthy to stop bubbling to deck-level handlers.
- Use deck-level `onHover`/`onClick` for global behavior across layers.
- In `MapboxOverlay`, Mapbox owns interaction handling, so drag and interaction-state callbacks are limited compared with deck-root rendering.

```tsx
new ScatterplotLayer<Station>({
	id: 'stations',
	data,
	pickable: true,
	getPosition: (d) => d.coordinates,
	onClick: (info) => {
		if (info.object) selectStation(info.object.id);
		return true;
	}
});
```

`PickingInfo` includes `picked`, `object`, `index`, `layer`, `sourceLayer`, `x`, `y`, `coordinate`, and `viewport`. Prefer `info.picked` when `object` may be absent for a layer type.
