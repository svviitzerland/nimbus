<svelte:options namespace="svg" />

<script lang="ts">
	// A home style router drawn in SVG, centred on (x, y), with its label underneath.
	let {
		x,
		y,
		label = '',
		lit = false,
		tone = 'var(--color-brand)'
	}: { x: number; y: number; label?: string; lit?: boolean; tone?: string } = $props();
</script>

<g transform="translate({x} {y})">
	<line
		x1="-14"
		y1="-11"
		x2="-18"
		y2="-25"
		stroke="var(--color-faint)"
		stroke-width="2.4"
		stroke-linecap="round"
	/>
	<line
		x1="14"
		y1="-11"
		x2="18"
		y2="-25"
		stroke="var(--color-faint)"
		stroke-width="2.4"
		stroke-linecap="round"
	/>
	<rect
		x="-25"
		y="-11"
		width="50"
		height="22"
		rx="7"
		fill="var(--color-card)"
		stroke={lit ? tone : 'var(--color-line)'}
		stroke-width={lit ? 2.4 : 1.6}
		style="transition: stroke 0.3s"
	/>
	{#each [-12, -4, 4] as cx (cx)}
		<circle
			{cx}
			cy="0"
			r="2.2"
			fill={lit ? tone : 'var(--color-faint)'}
			style="transition: fill 0.3s"
		/>
	{/each}
	<rect x="10" y="-2" width="9" height="4" rx="2" fill="var(--color-line)" />
	{#if label}
		<text y="27" text-anchor="middle" class="ng-label">{label}</text>
	{/if}
</g>

<style>
	.ng-label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
</style>
