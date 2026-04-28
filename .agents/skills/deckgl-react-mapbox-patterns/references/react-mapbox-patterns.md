# React Mapbox Patterns

Source docs: `references/upstream/deckgl-docs/get-started/using-with-react.md`, `references/upstream/deckgl-docs/get-started/using-with-map.md`, `references/upstream/deckgl-docs/developer-guide/base-maps/using-with-mapbox.md`, `references/upstream/deckgl-docs/api-reference/mapbox/mapbox-overlay.md`, `references/upstream/deckgl-docs/api-reference/mapbox/overview.md`.

## Integration Choice

| Need                                                                            | Use                                | Notes                                                                                                      |
| ------------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Deck layers under Mapbox labels, mixed with style layers, or 3D depth occlusion | `MapboxOverlay interleaved: true`  | Requires Mapbox GL JS v2.13+ with WebGL2 or v3+. Use `beforeId`; use `slot` with Mapbox v3 Standard Style. |
| Mapbox controls/plugins plus simple deck overlay                                | `MapboxOverlay interleaved: false` | Mapbox owns camera and interactions; deck renders in its own canvas above the map.                         |
| Deck owns camera/input, multiple views, custom controllers, deck widgets        | `<DeckGL>` root with `<Map>` child | Mapbox controls/plugins are not available; use `@deck.gl/widgets` instead.                                 |

## Install

```bash
npm install mapbox-gl react-map-gl @deck.gl/core @deck.gl/react @deck.gl/layers @deck.gl/mapbox
```

Add modules only as needed:

```bash
npm install @deck.gl/aggregation-layers @deck.gl/geo-layers @loaders.gl/csv
```

Import Mapbox CSS in the app entry or map component:

```ts
import 'mapbox-gl/dist/mapbox-gl.css';
```

## MapboxOverlay With React

Use this pattern for both interleaved and overlaid Mapbox-root rendering.

```tsx
import { useMemo, useCallback } from 'react';
import { Map, useControl } from 'react-map-gl/mapbox';
import { MapboxOverlay } from '@deck.gl/mapbox';
import type { MapboxOverlayProps } from '@deck.gl/mapbox';
import type { PickingInfo } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import 'mapbox-gl/dist/mapbox-gl.css';

type Place = {
	id: string;
	name: string;
	coordinates: [longitude: number, latitude: number];
	value: number;
};

function DeckGLOverlay(props: MapboxOverlayProps) {
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
	overlay.setProps(props);
	return null;
}

export function MapWithDeck({ data, mapboxToken }: { data: Place[]; mapboxToken: string }) {
	const layers = useMemo(
		() => [
			new ScatterplotLayer<Place>({
				id: 'places',
				data,
				getPosition: (d) => d.coordinates,
				getRadius: (d) => d.value,
				radiusScale: 20,
				getFillColor: [24, 144, 255, 180],
				pickable: true,
				beforeId: 'waterway-label'
			})
		],
		[data]
	);

	const getTooltip = useCallback(
		({ object }: PickingInfo<Place>) => object && `${object.name}: ${object.value}`,
		[]
	);

	return (
		<Map
			initialViewState={{ longitude: -122.4, latitude: 37.78, zoom: 11 }}
			mapStyle="mapbox://styles/mapbox/light-v11"
			mapboxAccessToken={mapboxToken}
			style={{ width: '100%', height: '100%' }}
		>
			<DeckGLOverlay interleaved layers={layers} getTooltip={getTooltip} />
		</Map>
	);
}
```

Notes:

- For overlaid mode, pass `interleaved={false}` or omit it.
- For Mapbox v3 Standard Style, replace `beforeId` with a layer `slot`, for example `slot: 'bottom'`.
- Some upstream docs snippets accidentally show `const layers: [`; use valid TypeScript such as `const layers = [` or `const layers: LayersList = [`.

## Reverse-Controlled DeckGL Root

Use this when deck.gl must own view state, controller behavior, picking, or multiple views.

```tsx
import { DeckGL } from '@deck.gl/react';
import { Map } from 'react-map-gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';
import type { MapViewState } from '@deck.gl/core';
import 'mapbox-gl/dist/mapbox-gl.css';

const INITIAL_VIEW_STATE: MapViewState = {
	longitude: -122.4,
	latitude: 37.78,
	zoom: 11,
	pitch: 0,
	bearing: 0
};

export function DeckRootMap({ mapboxToken }: { mapboxToken: string }) {
	const layers = [
		new ScatterplotLayer({
			id: 'points',
			data: [{ position: [-122.4, 37.78] }],
			getPosition: (d) => d.position,
			getRadius: 1000,
			getFillColor: [255, 80, 40, 180]
		})
	];

	return (
		<DeckGL initialViewState={INITIAL_VIEW_STATE} controller layers={layers}>
			<Map mapStyle="mapbox://styles/mapbox/light-v11" mapboxAccessToken={mapboxToken} />
		</DeckGL>
	);
}
```

## Direct Mapbox GL Lifecycle

Use only when the project already initializes `mapbox-gl` imperatively. Create the map once, add a `MapboxOverlay`, update it with `setProps`, and remove both in cleanup.

```tsx
useEffect(() => {
	if (!containerRef.current) return;

	const map = new mapboxgl.Map({
		container: containerRef.current,
		style: 'mapbox://styles/mapbox/light-v11',
		accessToken: mapboxToken,
		center: [-122.4, 37.78],
		zoom: 11
	});

	const overlay = new MapboxOverlay({ interleaved: true, layers: [] });
	map.addControl(overlay);
	mapRef.current = map;
	overlayRef.current = overlay;

	return () => {
		overlay.finalize();
		map.remove();
	};
}, [mapboxToken]);

useEffect(() => {
	overlayRef.current?.setProps({ layers });
}, [layers]);
```
