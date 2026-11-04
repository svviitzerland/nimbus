<svelte:options namespace="svg" />

<script lang="ts">
	// A phone drawn in SVG, the "you" actor for the guided backend lessons. The children are
	// drawn in screen coordinates, (0, 0) is the top left corner of the screen.
	import type { Snippet } from 'svelte';

	let {
		x = 0,
		y = 0,
		w = 96,
		h = 176,
		focus = false,
		children
	}: {
		x?: number;
		y?: number;
		w?: number;
		h?: number;
		focus?: boolean;
		children?: Snippet<[number, number]>;
	} = $props();

	const sw = $derived(w - 14);
	const sh = $derived(h - 30);
</script>

<g transform="translate({x} {y})">
	<rect width={w} height={h} rx="16" class="body" class:focus />
	<rect x={w / 2 - 12} y="6" width="24" height="4" rx="2" class="notch" />
	<g transform="translate(7 16)">
		<rect width={sw} height={sh} rx="8" class="screen" />
		{@render children?.(sw, sh)}
	</g>
	<rect x={w / 2 - 14} y={h - 9} width="28" height="3" rx="1.5" class="notch" />
</g>

<style>
	.body {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.4s;
	}
	.body.focus {
		stroke: var(--color-brand);
		stroke-width: 3;
	}
	.notch {
		fill: var(--color-line);
	}
	.screen {
		fill: var(--color-paper);
	}
</style>
