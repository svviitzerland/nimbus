<svelte:options namespace="svg" />

<script lang="ts">
	// An opened laptop drawn in SVG, centred on (x, y). `tone` tints the screen.
	let {
		x,
		y,
		label = '',
		tone = 'var(--color-brand)',
		lit = false
	}: { x: number; y: number; label?: string; tone?: string; lit?: boolean } = $props();
</script>

<g transform="translate({x} {y})">
	<rect
		x="-20"
		y="-16"
		width="40"
		height="26"
		rx="3.5"
		fill="var(--color-card)"
		stroke={lit ? tone : 'var(--color-ink)'}
		stroke-width="2"
		style="transition: stroke 0.3s"
	/>
	<rect x="-16" y="-12.5" width="32" height="19" rx="1.5" fill={tone} opacity="0.22" />
	<rect x="-12" y="-8.5" width="15" height="2.6" rx="1.3" fill={tone} opacity="0.75" />
	<rect x="-12" y="-3.5" width="22" height="2.2" rx="1.1" fill={tone} opacity="0.45" />
	<path d="M-25 11 H25 L22 15 H-22 Z" fill="var(--color-ink)" />
	{#if label}
		<text y="29" text-anchor="middle" class="ng-label">{label}</text>
	{/if}
</g>

<style>
	.ng-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
</style>
