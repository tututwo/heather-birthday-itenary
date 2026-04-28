# Spacemap-Style Point And Label Layers

Use this pattern for point datasets where selected or high-scoring items need stronger visual treatment.

## Data Shape

```ts
type MapDatum = {
	id: string;
	title: string;
	subtitle: string;
	label: string;
	selected: boolean;
	score: number;
	coordinates: [longitude: number, latitude: number];
};
```

## Layer Stack

1. Halo `ScatterplotLayer`: not pickable, translucent, larger radius.
2. Point `ScatterplotLayer`: pickable, stroke, selected styling, `onClick` returns `true`.
3. Label `TextLayer`: not pickable, filtered to selected or high-priority rows.

## Tooltip Safety

Deck.gl `getTooltip` can return `html`. Escape user or API strings before interpolation.

```ts
function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => {
		switch (character) {
			case '&':
				return '&amp;';
			case '<':
				return '&lt;';
			case '>':
				return '&gt;';
			case '"':
				return '&quot;';
			case "'":
				return '&#39;';
			default:
				return character;
		}
	});
}
```

## Testing Pattern

- Assert layer count and layer classes.
- Assert stable ids.
- Call accessor props with selected and default rows.
- Trigger `onClick` with a fake `PickingInfo` object.
- Assert tooltip returns null when `object` is missing.
