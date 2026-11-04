<svelte:options namespace="svg" />

<script lang="ts">
	// A small key drawn in SVG, centred on (x, y), pointing right. Used by the cryptography lessons.
	let {
		x,
		y,
		size = 1,
		tone = 'var(--color-amber)'
	}: { x: number; y: number; size?: number; tone?: string } = $props();
</script>

<g transform="translate({x} {y}) scale({size})">
	<circle cx="-9" cy="0" r="6.5" fill="none" stroke={tone} stroke-width="3" />
	<path
		d="M-2.5 0 H13 M8 0 V5 M12 0 V4"
		fill="none"
		stroke={tone}
		stroke-width="3"
		stroke-linecap="round"
	/>
</g>
