<svelte:options namespace="svg" />

<script lang="ts">
	// A simple person drawn in SVG, centred on (x, y) at the shoulders, with a label underneath.
	// `sneaky` gives them a hat and a darker coat, for the eavesdropper or attacker.
	let {
		x,
		y,
		label = '',
		sneaky = false,
		tone = 'var(--color-brand)'
	}: { x: number; y: number; label?: string; sneaky?: boolean; tone?: string } = $props();
</script>

<g transform="translate({x} {y})">
	<circle
		cx="0"
		cy="-14"
		r="9"
		fill="var(--color-amber-soft)"
		stroke="var(--color-muted)"
		stroke-width="2"
	/>
	<path
		d="M-16 20 Q-16 0 0 0 Q16 0 16 20 Z"
		fill={sneaky ? 'var(--color-ink)' : tone}
		opacity={sneaky ? 0.85 : 0.9}
	/>
	{#if sneaky}
		<path
			d="M-14 -19 H14 M-8 -19 V-27 H8 V-19"
			fill="var(--color-ink)"
			stroke="var(--color-ink)"
			stroke-width="3"
			stroke-linejoin="round"
		/>
		<rect x="-7" y="-16" width="14" height="4" rx="2" fill="var(--color-ink)" />
	{/if}
	{#if label}
		<text y="34" text-anchor="middle" class="cg-label">{label}</text>
	{/if}
</g>

<style>
	.cg-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
</style>
