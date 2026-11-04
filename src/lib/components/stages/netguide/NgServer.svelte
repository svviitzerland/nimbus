<svelte:options namespace="svg" />

<script lang="ts">
	// A small server rack drawn in SVG, centred on (x, y), with its label underneath.
	let {
		x,
		y,
		label = '',
		sub = '',
		lit = false,
		tone = 'var(--color-grass)'
	}: {
		x: number;
		y: number;
		label?: string;
		sub?: string;
		lit?: boolean;
		tone?: string;
	} = $props();
</script>

<g transform="translate({x} {y})">
	<rect
		x="-17"
		y="-22"
		width="34"
		height="44"
		rx="5"
		fill="var(--color-ink)"
		stroke={lit ? tone : 'transparent'}
		stroke-width="2.4"
		style="transition: stroke 0.3s"
	/>
	{#each [-15, -3, 9] as sy (sy)}
		<rect x="-12" y={sy} width="24" height="8" rx="2" fill="var(--color-card)" opacity="0.16" />
		<circle
			cx="8"
			cy={sy + 4}
			r="1.8"
			fill={lit ? tone : 'var(--color-faint)'}
			style="transition: fill 0.3s"
		/>
	{/each}
	{#if label}
		<text y="35" text-anchor="middle" class="ng-label">{label}</text>
	{/if}
	{#if sub}
		<text y="47" text-anchor="middle" class="ng-sub">{sub}</text>
	{/if}
</g>

<style>
	.ng-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
	.ng-sub {
		fill: var(--color-faint);
		font-size: 9.5px;
		font-family: var(--font-mono, ui-monospace, monospace);
	}
</style>
