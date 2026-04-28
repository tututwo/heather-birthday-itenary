# Deck.gl React Mapbox Quick Reference

Fast reference for React + Mapbox GL JS + deck.gl integration.

## Integration Mode

| Need                                               | Pattern                               |
| -------------------------------------------------- | ------------------------------------- |
| Deck layers below labels or inside style stack     | `MapboxOverlay({interleaved: true})`  |
| Mapbox controls/plugins plus deck overlay          | `MapboxOverlay({interleaved: false})` |
| Deck owns pointer input, controller, or multi-view | `<DeckGL>` root with `<Map>` child    |

## React MapboxOverlay Pattern

```tsx
import { Map, useControl } from 'react-map-gl/mapbox';
import { MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

function DeckOverlay(props: MapboxOverlayProps) {
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
	overlay.setProps(props);
	return null;
}

export function MapView({
	layers,
	token
}: {
	layers: MapboxOverlayProps['layers'];
	token: string;
}) {
	return (
		<Map
			initialViewState={{ longitude: -122.4, latitude: 37.78, zoom: 11 }}
			mapStyle="mapbox://styles/mapbox/light-v11"
			mapboxAccessToken={token}
		>
			<DeckOverlay interleaved layers={layers} />
		</Map>
	);
}
```

## Rules

- Use `react-map-gl/mapbox`, not the MapLibre entrypoint.
- Import Mapbox CSS once.
- With `MapboxOverlay`, Mapbox owns camera and interaction state.
- Do not pass `controller`, `viewState`, or `initialViewState` to `MapboxOverlay`.
- Keep layer construction in pure helper functions so it can be unit-tested.
- Use sibling skills for style-stack placement, layer recipes, and performance debugging.
