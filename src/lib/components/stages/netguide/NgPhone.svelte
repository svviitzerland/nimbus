<svelte:options namespace="svg" />

<script lang="ts">
	// A phone drawn in SVG, centred on (x, y). `tone` tints the screen.
	let {
		x,
		y,
		label = '',
		tone = 'var(--color-brand)'
	}: { x: number; y: number; label?: string; tone?: string } = $props();
</script>

<g transform="translate({x} {y})">
	<rect x="-13" y="-22" width="26" height="44" rx="6" fill="var(--color-ink)" />
	<rect
		x="-10.5"
		y="-18"
		width="21"
		height="34"
		rx="2.5"
		fill={tone}
		opacity="0.3"
		style="transition: fill 0.3s"
	/>
	<rect x="-4" y="18" width="8" height="1.8" rx="0.9" fill="var(--color-card)" opacity="0.5" />
	{#if label}
		<text y="35" text-anchor="middle" class="ng-label">{label}</text>
	{/if}
</g>

<style>
	.ng-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
</style>
