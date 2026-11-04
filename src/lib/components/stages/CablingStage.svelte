<script lang="ts">
	// Guided: a laptop and a server joined by two cables, copper on top and fibre below. Pulses
	// run along both by themselves; copper fades with distance and breaks past 100 metres, fibre
	// stays bright. A close up lens shows what is inside. On the last beat the learner may drag
	// the distance.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CablingText } from '$lib/chapters/network/cabling/types';
	import Guide from '$lib/components/Guide.svelte';
	import Thing from './netguide/Thing.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as CablingText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	const last = $derived(tx.intro.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const isLast = $derived(beat >= last);
	const TRY = 6;

	// the distance shown at each step, in metres; the last step follows the slider
	const STEP_DIST = [10, 10, 150, 20000, 300, 10];
	const DISTS = [10, 50, 100, 150, 300, 2000, 20000];
	let pick = $state(0);
	const distOf = (s: number) => (s === TRY ? DISTS[pick] : (STEP_DIST[s] ?? 10));
	const fmt = (d: number) => (d >= 1000 ? `${d / 1000} km` : `${d} m`);

	type Zone = 'ok' | 'fail' | 'far';
	const zoneOf = (d: number): Zone => (d <= 100 ? 'ok' : d < 2000 ? 'fail' : 'far');
	function slide(e: Event) {
		const before = zoneOf(DISTS[pick]);
		pick = Number((e.currentTarget as HTMLInputElement).value);
		peek = null;
		const now = zoneOf(DISTS[pick]);
		if (now === before) return;
		onstate?.(now === 'ok' ? 'copperOk' : now === 'fail' ? 'copperFail' : 'fibreFar');
	}

	// the cable runs from X0 to X1 on screen, whatever the distance
	const X0 = 90;
	const X1 = 354;
	const LEN = X1 - X0;
	function copperRun(d: number) {
		if (d <= 100) return { to: X1, fade: Math.max(0.3, 1 - 0.65 * (d / 100)), ok: true };
		return { to: X0 + LEN * Math.max(0.04, 100 / d), fade: 0, ok: false };
	}
</script>

<div class="wrap">
	<div class="tryrow" class:show={isLast} aria-hidden={!isLast}>
		<label class="trylabel" for="cabling-dist">{tx.distLabel}</label>
		<input
			id="cabling-dist"
			type="range"
			min="0"
			max={DISTS.length - 1}
			step="1"
			value={pick}
			disabled={!isLast}
			oninput={slide}
		/>
		<span class="dist">{fmt(DISTS[pick])}</span>
	</div>

	<Guide steps={tx.steps} {active} onselect={(k) => (peek = k)}>
		{#snippet visual(s)}
			{@const d = distOf(s)}
			{@const cu = copperRun(d)}
			{@const cuFocus = s === 1 || s === 2 || s === 5}
			{@const fiFocus = s === 3}
			<svg viewBox="0 0 440 300" class="art" role="img" aria-label={tx.title}>
				<!-- the two ends -->
				<Thing kind="laptop" x={44} y={163} />
				<text class="lbl" x="44" y="196">{tx.youLabel}</text>
				<Thing kind="server" x={404} y={163} s={0.9} />
				<text class="lbl" x="404" y="204">{tx.farLabel}</text>

				<!-- copper on top -->
				<g class="cable copper" class:dim={fiFocus} class:hi={cuFocus}>
					<path class="lead" d="M64 156 C 78 156, 74 118, {X0} 118" />
					<path class="lead" d="M{X1} 118 C 370 118, 368 150, 386 150" />
					<line class="jacket" x1={X0} y1="118" x2={X1} y2="118" />
					<rect class="plug" x={X0 - 8} y="112" width="12" height="12" rx="2" />
					<rect class="plug" x={X1 - 4} y="112" width="12" height="12" rx="2" />
					<text class="name" x={X0} y="100">{tx.copper}</text>
					{#key `${d}-${s}`}
						{#each [0, 0.6, 1.2] as delay (delay)}
							<g transform="translate(0 118)">
								<rect
									class="pulse cu"
									x="-6"
									y="-3.5"
									width="12"
									height="7"
									rx="2"
									style="--from:{X0}px; --to:{cu.to}px; --fade:{cu.fade}; animation-delay:{delay}s"
								/>
							</g>
						{/each}
					{/key}
					{#if !cu.ok}
						<g class="chip bad">
							<rect x="282" y="88" width="88" height="19" rx="9.5" />
							<text x="326" y="101">{tx.brokenTag}</text>
						</g>
						<path class="cross" d="M{cu.to + 6} 112 l10 12 M{cu.to + 16} 112 l-10 12" />
					{/if}
				</g>

				<!-- fibre below -->
				<g class="cable fibre" class:dim={cuFocus} class:hi={fiFocus}>
					<path class="lead" d="M64 168 C 78 168, 74 208, {X0} 208" />
					<path class="lead" d="M{X1} 208 C 370 208, 368 176, 386 176" />
					<line class="jacket" x1={X0} y1="208" x2={X1} y2="208" />
					<line class="core" x1={X0} y1="208" x2={X1} y2="208" />
					<text class="name" x={X0} y="190">{tx.fibre}</text>
					{#key `${d}-${s}`}
						{#each [0.3, 0.9, 1.5] as delay (delay)}
							<g transform="translate(0 208)">
								<circle
									class="pulse fi"
									r="4"
									style="--from:{X0}px; --to:{X1}px; --fade:1; animation-delay:{delay}s"
								/>
							</g>
						{/each}
					{/key}
					{#if d > 100}
						<g class="chip ok">
							<rect x="290" y="178" width="72" height="19" rx="9.5" />
							<text x="326" y="191">{tx.okTag}</text>
						</g>
					{/if}
				</g>

				<!-- the distance ruler -->
				<g class="ruler">
					<line x1={X0} y1="262" x2={X1} y2="262" />
					<line x1={X0} y1="256" x2={X0} y2="268" />
					<line x1={X1} y1="256" x2={X1} y2="268" />
					<text x={X0} y="284">0</text>
					<text class="far" x={X1} y="284">{fmt(d)}</text>
					{#if d > 100}
						{@const lx = X0 + LEN * (100 / d)}
						<line class="limit" x1={lx} y1="252" x2={lx} y2="272" />
						{#if lx > X0 + 34 && lx < X1 - 40}
							<text class="limit-t" x={lx} y="284">{tx.limitTag}</text>
						{/if}
					{/if}
				</g>

				<!-- close ups -->
				<g class="lens" class:show={s === 1 || s === 5}>
					<line class="pointer" x1="222" y1="84" x2="222" y2="112" />
					<circle class="glass" cx="222" cy="50" r="34" />
					<g clip-path="url(#cabling-lens)">
						<path
							class="wire a"
							d="M186 50 C 194 36, 202 36, 210 50 S 226 64, 234 50 S 250 36, 258 50"
						/>
						<path
							class="wire b"
							d="M186 50 C 194 64, 202 64, 210 50 S 226 36, 234 50 S 250 64, 258 50"
						/>
					</g>
					<text class="cap" x="264" y="54">{tx.pairLabel}</text>
				</g>
				<g class="lens" class:show={s === 3}>
					<line class="pointer" x1="222" y1="84" x2="222" y2="202" />
					<circle class="glass" cx="222" cy="50" r="34" />
					<g clip-path="url(#cabling-lens)">
						<rect class="fcore" x="186" y="42" width="72" height="16" />
						<polyline class="ray" points="186,50 196,43 208,57 220,43 232,57 244,43 258,52" />
					</g>
					<text class="cap" x="264" y="54">{tx.glassLabel}</text>
				</g>
				<defs>
					<clipPath id="cabling-lens"><circle cx="222" cy="50" r="32" /></clipPath>
				</defs>
			</svg>
		{/snippet}
	</Guide>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-bottom: 1rem;
		}
	}
	.tryrow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 40px;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.tryrow.show {
		visibility: visible;
		opacity: 1;
	}
	.trylabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.tryrow input {
		width: min(220px, 50vw);
		accent-color: var(--color-brand);
	}
	.dist {
		min-width: 52px;
		font-family: ui-monospace, monospace;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.art {
		width: 100%;
		max-width: 470px;
		height: auto;
		overflow: visible;
	}
	.lbl {
		fill: var(--color-faint);
		font-size: 11.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.cable {
		transition: opacity 0.45s ease;
	}
	.cable.dim {
		opacity: 0.3;
	}
	.lead {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		opacity: 0.6;
	}
	.jacket {
		stroke: var(--color-line);
		stroke-width: 9;
		stroke-linecap: round;
	}
	.fibre .jacket {
		stroke-width: 6;
	}
	.core {
		stroke: var(--color-amber);
		stroke-width: 1.4;
		opacity: 0.5;
	}
	.plug {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.4;
	}
	.name {
		fill: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		transition: fill 0.3s;
	}
	.cable.hi .name {
		fill: var(--color-brand);
	}
	.pulse {
		opacity: 0;
		animation: run 1.8s linear infinite;
	}
	.pulse.cu {
		fill: var(--color-brand);
	}
	.pulse.fi {
		fill: var(--color-amber);
	}
	@keyframes run {
		0% {
			transform: translateX(var(--from));
			opacity: 0;
		}
		8% {
			opacity: 1;
		}
		100% {
			transform: translateX(var(--to));
			opacity: var(--fade);
		}
	}
	.cross {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.chip rect {
		stroke-width: 1.2;
	}
	.chip text {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.chip.bad rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.chip.bad text {
		fill: var(--color-danger);
	}
	.chip.ok rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.chip.ok text {
		fill: var(--color-grass);
	}
	.ruler line {
		stroke: var(--color-faint);
		stroke-width: 1.4;
	}
	.ruler text {
		fill: var(--color-faint);
		font-size: 11px;
		font-weight: 600;
		text-anchor: middle;
	}
	.ruler .far {
		fill: var(--color-ink);
		font-family: ui-monospace, monospace;
		font-weight: 700;
	}
	.ruler .limit {
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.ruler .limit-t {
		fill: var(--color-danger);
	}
	.lens {
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	.lens.show {
		opacity: 1;
	}
	.glass {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.6;
	}
	.pointer {
		stroke: var(--color-muted);
		stroke-width: 1.2;
		opacity: 0.6;
	}
	.wire {
		fill: none;
		stroke-width: 5;
		stroke-linecap: round;
	}
	.wire.a {
		stroke: var(--color-brand);
	}
	.wire.b {
		stroke: var(--color-amber);
	}
	.fcore {
		fill: var(--color-brand-soft);
	}
	.ray {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2.2;
		stroke-linejoin: round;
	}
	.cap {
		fill: var(--color-muted);
		font-size: 11.5px;
		font-weight: 600;
	}
	@media (prefers-reduced-motion: reduce) {
		.tryrow,
		.cable,
		.lens,
		.name {
			transition: none;
		}
		.pulse {
			animation: none;
			opacity: 0;
		}
	}
</style>
