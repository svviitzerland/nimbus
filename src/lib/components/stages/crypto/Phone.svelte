<svelte:options namespace="svg" />

<script lang="ts">
	// A smartphone drawn in SVG, centred on (x, y). Whatever is passed as children is drawn on the
	// screen, in local coordinates (the screen spans x from minus 17 to 17, y from minus 28 to 28).
	import type { Snippet } from 'svelte';
	let {
		x,
		y,
		label = '',
		lit = '',
		children
	}: { x: number; y: number; label?: string; lit?: string; children?: Snippet } = $props();
</script>

<g transform="translate({x} {y})">
	<rect
		x="-22"
		y="-38"
		width="44"
		height="76"
		rx="9"
		fill="var(--color-card)"
		stroke={lit || 'var(--color-ink)'}
		stroke-width="2.4"
		style="transition: stroke 0.3s"
	/>
	<rect x="-17" y="-29" width="34" height="58" rx="3" fill="var(--color-brand-soft)" />
	<rect x="-5" y="-34.5" width="10" height="2.4" rx="1.2" fill="var(--color-line)" />
	{@render children?.()}
	{#if label}
		<text y="54" text-anchor="middle" class="cg-label">{label}</text>
	{/if}
</g>

<style>
	.cg-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
</style>
