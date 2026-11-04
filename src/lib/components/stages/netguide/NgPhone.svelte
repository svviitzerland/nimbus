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
	<rect x="-12" y="-24" width="24" height="48" rx="6" fill="var(--color-ink)" />
	<rect
		x="-9.5"
		y="-20"
		width="19"
		height="37"
		rx="2.5"
		fill={tone}
		opacity="0.3"
		style="transition: fill 0.3s"
	/>
	<rect x="-4" y="19.6" width="8" height="1.8" rx="0.9" fill="var(--color-card)" opacity="0.5" />
	{#if label}
		<text y="37" text-anchor="middle" class="ng-label">{label}</text>
	{/if}
</g>

<style>
	.ng-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
</style>
