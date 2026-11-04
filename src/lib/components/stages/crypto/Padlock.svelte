<svelte:options namespace="svg" />

<script lang="ts">
	// A padlock drawn in SVG, centred on (x, y). `open` lifts the shackle, and the change animates
	// (unless the learner asked for less motion). Used by the guided cryptography lessons.
	let {
		x,
		y,
		open = false,
		size = 1,
		tone = 'var(--color-brand)'
	}: { x: number; y: number; open?: boolean; size?: number; tone?: string } = $props();
</script>

<g transform="translate({x} {y}) scale({size})">
	<path
		d="M-6.5 -2 V-8 a6.5 6.5 0 0 1 13 0 V-2"
		class="shackle"
		class:open
		fill="none"
		stroke={tone}
		stroke-width="3"
		stroke-linecap="round"
	/>
	<rect x="-10.5" y="-3" width="21" height="17" rx="3.5" fill={tone} />
	<circle cx="0" cy="4" r="2.4" fill="var(--color-card)" />
	<rect x="-1" y="5" width="2" height="5" rx="1" fill="var(--color-card)" />
</g>

<style>
	.shackle {
		transition: transform 0.45s ease;
	}
	.shackle.open {
		transform: translateY(-6px);
	}
	@media (prefers-reduced-motion: reduce) {
		.shackle {
			transition: none;
		}
	}
</style>
