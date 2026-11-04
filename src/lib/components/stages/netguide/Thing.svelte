<svelte:options namespace="svg" />

<script module lang="ts">
	export type ThingKind =
		| 'laptop'
		| 'phone'
		| 'pc'
		| 'router'
		| 'switch'
		| 'modem'
		| 'ap'
		| 'server'
		| 'cloud';
</script>

<script lang="ts">
	// The recognisable actors of the guided network lessons, drawn as plain SVG groups centred on
	// (x, y). Colours come from the palette tokens through CSS, so dark mode just works.
	let {
		kind,
		x = 0,
		y = 0,
		s = 1,
		hi = false,
		dim = false,
		off = false
	}: {
		kind: ThingKind;
		x?: number;
		y?: number;
		s?: number;
		/** Draw the outline in the accent colour, the part in focus. */
		hi?: boolean;
		/** Fade it back, it is not the point right now. */
		dim?: boolean;
		/** Unplugged or offline, the lights go out. */
		off?: boolean;
	} = $props();
</script>

<g class="thing" class:hi class:dim class:off transform="translate({x} {y}) scale({s})">
	{#if kind === 'laptop'}
		<rect class="body" x="-19" y="-17" width="38" height="25" rx="3" />
		<rect class="screen" x="-15.5" y="-13.5" width="31" height="18" rx="1.5" />
		<path class="body" d="M-25 8 H25 L22 13 H-22 Z" />
	{:else if kind === 'phone'}
		<rect class="body" x="-10" y="-20" width="20" height="40" rx="4.5" />
		<rect class="screen" x="-7.5" y="-16" width="15" height="29" rx="1.5" />
		<circle class="detail" cx="0" cy="16.5" r="1.4" />
	{:else if kind === 'pc'}
		<rect class="body" x="-20" y="-18" width="40" height="27" rx="3" />
		<rect class="screen" x="-16.5" y="-14.5" width="33" height="20" rx="1.5" />
		<path class="body" d="M-4 9 L-6 15 H6 L4 9" />
		<line class="stroke" x1="-11" y1="15.5" x2="11" y2="15.5" />
	{:else if kind === 'router'}
		<line class="stroke" x1="-14" y1="-6" x2="-18" y2="-20" />
		<line class="stroke" x1="14" y1="-6" x2="18" y2="-20" />
		<rect class="body" x="-24" y="-7" width="48" height="16" rx="4" />
		<circle class="led" cx="-14" cy="1" r="1.8" />
		<circle class="led" cx="-8" cy="1" r="1.8" />
		<circle class="led" cx="-2" cy="1" r="1.8" />
	{:else if kind === 'switch'}
		<rect class="body" x="-28" y="-8" width="56" height="16" rx="3" />
		{#each [-21, -14, -7, 0, 7, 14] as px (px)}
			<rect class="port" x={px - 2.6} y="-2.6" width="5.2" height="5" rx="0.8" />
		{/each}
		<circle class="led" cx="22" cy="0" r="1.8" />
	{:else if kind === 'modem'}
		<rect class="body" x="-14" y="-18" width="28" height="34" rx="4" />
		<circle class="led" cx="-5" cy="-9" r="1.8" />
		<circle class="led" cx="0" cy="-9" r="1.8" />
		<circle class="led" cx="5" cy="-9" r="1.8" />
		<line class="stroke" x1="-7" y1="6" x2="7" y2="6" />
	{:else if kind === 'ap'}
		<ellipse class="body" cx="0" cy="0" rx="22" ry="8" />
		<circle class="led" cx="0" cy="0" r="2.2" />
	{:else if kind === 'server'}
		<rect class="body" x="-18" y="-26" width="36" height="52" rx="4" />
		{#each [-16, -2, 12] as py (py)}
			<rect class="slot" x="-13" y={py} width="26" height="9" rx="1.5" />
			<circle class="led" cx="8" cy={py + 4.5} r="1.6" />
		{/each}
	{:else if kind === 'cloud'}
		<path
			class="body cloud"
			d="M-26 12 C-36 12 -38 -2 -28 -5 C-28 -17 -12 -21 -6 -12 C-1 -22 18 -21 19 -7 C30 -8 34 12 22 12 Z"
		/>
	{/if}
</g>

<style>
	.thing {
		transition: opacity 0.45s ease;
	}
	.body {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.6;
		stroke-linejoin: round;
		transition: stroke 0.35s ease;
	}
	.cloud {
		fill: var(--color-brand-soft);
	}
	.stroke {
		stroke: var(--color-muted);
		stroke-width: 1.6;
		stroke-linecap: round;
		fill: none;
		transition: stroke 0.35s ease;
	}
	.screen {
		fill: var(--color-brand-soft);
		transition: fill 0.35s ease;
	}
	.detail,
	.port,
	.slot {
		fill: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
		transition: fill 0.35s ease;
	}
	.hi .body,
	.hi .stroke {
		stroke: var(--color-brand);
		stroke-width: 2.2;
	}
	.dim {
		opacity: 0.35;
	}
	.off .screen {
		fill: var(--color-line);
	}
	.off .led {
		fill: var(--color-faint);
	}
	@media (prefers-reduced-motion: reduce) {
		.thing,
		.body,
		.stroke,
		.screen,
		.led {
			transition: none;
		}
	}
</style>
