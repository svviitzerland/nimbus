<svelte:options namespace="svg" />

<script lang="ts">
	// A small server rack drawn in SVG, the recognisable "server" actor. `units` drawers, each
	// with a blinking light while `busy`.
	let {
		x = 0,
		y = 0,
		w = 110,
		units = 3,
		busy = false,
		focus = false,
		state = 'idle'
	}: {
		x?: number;
		y?: number;
		w?: number;
		units?: number;
		busy?: boolean;
		focus?: boolean;
		state?: 'idle' | 'ok' | 'bad';
	} = $props();

	const UNIT = 24;
	const h = $derived(units * (UNIT + 6) + 12);
</script>

<g transform="translate({x} {y})">
	<rect width={w} height={h} rx="9" class="case" class:focus />
	{#each Array.from({ length: units }) as _, i (i)}
		<g transform="translate(8 {8 + i * (UNIT + 6)})">
			<rect width={w - 16} height={UNIT} rx="5" class="unit" />
			<circle
				cx="12"
				cy={UNIT / 2}
				r="3.5"
				class="led {state}"
				class:blink={busy}
				style="animation-delay:{i * 0.25}s"
			/>
			{#each [0, 1, 2, 3] as k (k)}
				<line x1={w - 56 + k * 9} y1="7" x2={w - 56 + k * 9} y2={UNIT - 7} class="vent" />
			{/each}
		</g>
	{/each}
</g>

<style>
	.case {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.4s;
	}
	.case.focus {
		stroke: var(--color-brand);
		stroke-width: 3;
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-faint);
		transition: fill 0.3s;
	}
	.led.ok {
		fill: var(--color-grass);
	}
	.led.bad {
		fill: var(--color-danger);
	}
	.led.blink {
		fill: var(--color-amber);
		animation: blink 0.9s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.led.blink {
			animation: none;
		}
	}
</style>
