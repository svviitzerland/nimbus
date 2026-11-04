<script lang="ts">
	// A guided DevOps lesson. Dev sits at a laptop, Ops looks after a server rack, and a brick wall
	// stands between them. Following Nim, a giant release box is thrown over the wall and breaks
	// things, then the wall comes down and small boxes roll along a belt instead. A strip at the
	// bottom shows one year of releases (one huge box, or lots of tiny ones). On the last beat the
	// learner may flip between the old way and the DevOps way.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { WhatDevopsText } from '$lib/chapters/devops/what-devops/types';
	import { prefersReducedMotion, runSeq } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as WhatDevopsText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	type Mode = 'old' | 'new';
	type Scene = 'still' | 'throw' | 'blame' | 'drop' | 'stream' | 'bugfix';
	let pick = $state<Mode | null>(null);
	const mode = $derived<Mode>(step <= 2 || (step === last && pick === 'old') ? 'old' : 'new');
	const scene = $derived<Scene>(
		step === 0
			? 'still'
			: step === 1
				? 'throw'
				: step === 2
					? 'blame'
					: step === 3
						? 'drop'
						: step === 5
							? 'bugfix'
							: mode === 'old'
								? 'blame'
								: 'stream'
	);

	// the one parcel moved by the timers (the giant box, or the tiny box with a bug)
	let px = $state(172);
	let py = $state(150);
	let ps = $state(0.6);
	let pOn = $state(false);
	let pBug = $state(false);
	let snap = $state(true);
	let led = $state<'ok' | 'warn' | 'bad'>('ok');
	let blame = $state(false);
	let note = $state('');

	function reset() {
		snap = true;
		pOn = false;
		pBug = false;
		px = 172;
		py = 150;
		ps = 0.6;
		led = 'ok';
		blame = false;
		note = '';
	}

	function play(s: Scene, still: boolean): (() => void) | undefined {
		reset();
		if (s === 'still' || s === 'drop' || s === 'stream') return;
		if (still) {
			pOn = true;
			if (s === 'bugfix') {
				px = 300;
				pBug = true;
				led = 'warn';
				note = tx.oneChange;
			} else {
				px = 300;
				ps = 1.6;
				if (s === 'blame') {
					led = 'bad';
					blame = true;
				}
			}
			return;
		}
		if (s === 'bugfix') {
			return runSeq(
				[
					[
						60,
						() => {
							reset();
							pOn = true;
							pBug = true;
						}
					],
					[300, () => (snap = false)],
					[1700, () => (px = 300)],
					[
						2400,
						() => {
							led = 'warn';
							note = tx.oneChange;
						}
					],
					[1500, () => (px = 172)],
					[
						900,
						() => {
							pBug = false;
							led = 'ok';
							note = '';
						}
					],
					[1700, () => (px = 300)],
					[2600, () => (note = tx.fixed)],
					[500, () => (pOn = false)]
				],
				true
			);
		}
		return runSeq(
			[
				[
					60,
					() => {
						reset();
						pOn = true;
					}
				],
				[300, () => (snap = false)],
				[900, () => (ps = 0.95)],
				[900, () => (ps = 1.3)],
				[1000, () => (ps = 1.6)],
				[
					1100,
					() => {
						px = 230;
						py = 34;
					}
				],
				[
					1300,
					() => {
						px = 300;
						py = 150;
					}
				],
				[
					s === 'blame' ? 3600 : 2200,
					() => {
						if (s === 'blame') {
							led = 'bad';
							blame = true;
						}
					}
				],
				[500, () => (pOn = false)]
			],
			true
		);
	}

	$effect(() => {
		const s = scene;
		const still = reduce;
		return untrack(() => play(s, still));
	});

	function choose(m: Mode) {
		pick = m;
		onstate?.(m);
	}

	const wallUp = $derived(mode === 'old' && step !== 3);
	const MONTHS = Array.from({ length: 12 }, (_, k) => k);
	const TINY = Array.from({ length: 24 }, (_, k) => k);
	const BELT = [0, 1, 2];
</script>

{#snippet box(bug: boolean)}
	<rect x="-14" y="-24" width="28" height="24" rx="2.5" class="box" class:bug />
	<line x1="-14" y1="-17" x2="14" y2="-17" class="tape" class:bug />
	<line x1="0" y1="-24" x2="0" y2="-17" class="tape" class:bug />
{/snippet}

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pick" role="group" aria-label={tx.modeLabel}>
				<span class="cap">{tx.modeLabel}</span>
				<div class="chips">
					<button type="button" class="chip" class:on={mode === 'old'} onclick={() => choose('old')}
						>{tx.oldBtn}</button
					>
					<button type="button" class="chip" class:on={mode === 'new'} onclick={() => choose('new')}
						>{tx.newBtn}</button
					>
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 460 244" class="scene" role="img" aria-label="{tx.devLabel}, {tx.opsLabel}">
			<line x1="10" y1="150" x2="450" y2="150" class="ground" />

			<!-- the belt between the teams, once they work as one -->
			<g class="belt" class:on={mode === 'new' && step >= 4}>
				<rect x="158" y="150" width="176" height="7" rx="3.5" />
				{#each [0, 1, 2, 3, 4, 5] as k (k)}
					<circle cx={170 + k * 30} cy="153.5" r="2" />
				{/each}
			</g>

			<!-- Dev, an opened laptop -->
			<g class="team" class:lit={i === 0 || i === 1}>
				<rect x="30" y="58" width="110" height="72" rx="8" class="shell" />
				<rect x="37" y="65" width="96" height="58" rx="4" class="screen" />
				<rect x="45" y="75" width="44" height="5" rx="2.5" class="code brand" />
				<rect x="53" y="86" width="62" height="5" rx="2.5" class="code" />
				<rect x="53" y="97" width="40" height="5" rx="2.5" class="code" />
				<rect x="45" y="108" width="28" height="5" rx="2.5" class="code brand" />
				<path d="M20 132H150L143 142H27Z" class="base" />
			</g>

			<!-- Ops, a server rack -->
			<g class="team" class:lit={i === 0 || i === 2}>
				<rect x="345" y="40" width="90" height="110" rx="9" class="shell" />
				{#each [50, 82, 114] as y, n (y)}
					<rect x="353" {y} width="74" height="26" rx="4" class="unit" />
					<circle
						cx="365"
						cy={y + 13}
						r="3.6"
						class="led {led}"
						class:blink={led !== 'ok' && !reduce}
						style="animation-delay:{n * 0.12}s"
					/>
					<line x1="378" y1={y + 10} x2="415" y2={y + 10} class="vent" />
					<line x1="378" y1={y + 17} x2="407" y2={y + 17} class="vent" />
				{/each}
			</g>

			<!-- the wall -->
			<g class="wall" class:down={!wallUp} class:snapwall={reduce}>
				{#each [0, 1, 2, 3, 4, 5, 6, 7] as r (r)}
					<rect
						x={r % 2 ? 218 : 214}
						y={36 + r * 14}
						width={r % 2 ? 24 : 32}
						height="14"
						rx="1.5"
						class="brick"
					/>
				{/each}
			</g>

			<!-- small boxes riding the belt -->
			{#if scene === 'stream'}
				{#each BELT as k (k)}
					<g
						class="ride"
						class:still={reduce}
						style="animation-delay:{-k * 1.3}s; transform: translate({185 +
							k * 55}px, 150px) scale(0.6)"
					>
						{@render box(false)}
					</g>
				{/each}
			{/if}

			<!-- the parcel driven by the timers -->
			<g
				class="parcel"
				class:snap
				class:off={!pOn}
				style="transform: translate({px}px, {py}px) scale({ps})"
			>
				{@render box(pBug)}
				{#if ps > 1.2}
					<text y="-28" text-anchor="middle" class="box-label">{tx.bigBox}</text>
				{/if}
			</g>
			{#if note}
				<text x="290" y="118" text-anchor="middle" class="note" class:good={!pBug}>{note}</text>
			{/if}

			<!-- the blame bubbles -->
			{#if blame}
				<g class="bubble">
					<rect x="22" y="18" width="126" height="22" rx="11" />
					<text x="85" y="32.5" text-anchor="middle">{tx.blameDev}</text>
				</g>
				<g class="bubble">
					<rect x="326" y="6" width="112" height="22" rx="11" />
					<text x="382" y="20.5" text-anchor="middle">{tx.blameOps}</text>
				</g>
			{/if}

			<!-- the names, or one team once the wall is gone -->
			{#if !wallUp}
				<rect x="24" y="162" width="412" height="22" rx="11" class="band" />
				<text x="230" y="177" text-anchor="middle" class="team-name">{tx.oneTeam}</text>
			{/if}
			<text x="85" y="177" text-anchor="middle" class="label">{tx.devLabel}</text>
			<text x="390" y="177" text-anchor="middle" class="label">{tx.opsLabel}</text>

			<!-- one year of releases -->
			<g class="year" class:lit={i === 6}>
				<text x="40" y="206" class="year-cap">{tx.yearLabel}</text>
				<line x1="40" y1="232" x2="424" y2="232" class="axis" />
				{#each MONTHS as m (m)}
					<line x1={40 + m * 32} y1="229" x2={40 + m * 32} y2="235" class="tick" />
				{/each}
				{#if mode === 'old'}
					<rect x="404" y="210" width="20" height="20" rx="2.5" class="box" />
				{:else}
					{#each TINY as t (t)}
						<rect x={44 + t * 16} y="222" width="7" height="7" rx="1.5" class="box" />
					{/each}
				{/if}
			</g>
		</svg>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-brand);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover,
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}

	.ground {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.team.lit .shell {
		stroke: var(--color-brand);
	}
	.screen {
		fill: var(--color-paper);
	}
	.code {
		fill: var(--color-line);
	}
	.code.brand {
		fill: var(--color-brand);
		opacity: 0.55;
	}
	.base {
		fill: var(--color-line);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-grass);
		transition: fill 0.3s;
	}
	.led.warn {
		fill: var(--color-amber);
	}
	.led.bad {
		fill: var(--color-danger);
	}
	.led.blink {
		animation: blink 0.5s ease-in-out infinite alternate;
	}
	@keyframes blink {
		to {
			opacity: 0.35;
		}
	}

	.brick {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.2;
	}
	.wall {
		transform-origin: 230px 150px;
		transition:
			transform 1.3s cubic-bezier(0.6, 0, 0.4, 1),
			opacity 1.3s ease;
	}
	.wall.down {
		transform: scaleY(0);
		opacity: 0;
	}
	.wall.snapwall {
		transition: none;
	}

	.belt {
		opacity: 0;
		transition: opacity 0.6s;
	}
	.belt.on {
		opacity: 1;
	}
	.belt rect {
		fill: var(--color-line);
	}
	.belt circle {
		fill: var(--color-card);
	}

	.box {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.4;
	}
	.box.bug {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.tape {
		stroke: var(--color-amber);
		stroke-width: 1.4;
	}
	.tape.bug {
		stroke: var(--color-danger);
	}
	.box-label {
		font-size: 6.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.parcel {
		transition:
			transform 1.15s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.4s;
	}
	.parcel.snap {
		transition: none;
	}
	.parcel.off {
		opacity: 0;
	}
	.ride {
		animation: ride 3.9s linear infinite;
	}
	.ride.still {
		animation: none;
	}
	@keyframes ride {
		0% {
			transform: translate(170px, 150px) scale(0.6);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			transform: translate(325px, 150px) scale(0.6);
			opacity: 0;
		}
	}
	.note {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-amber);
	}
	.note.good {
		fill: var(--color-grass);
	}

	.bubble rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 1.2;
	}
	.bubble text {
		font-size: 9px;
		font-weight: 600;
		fill: var(--color-danger);
	}

	.band {
		fill: var(--color-brand-soft);
	}
	.team-name {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		fill: var(--color-brand);
	}
	.label {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}

	.year-cap {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
		transition: fill 0.3s;
	}
	.year.lit .year-cap {
		fill: var(--color-brand);
	}
	.axis {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.tick {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.shell,
		.led,
		.wall,
		.belt,
		.parcel {
			transition: none;
		}
		.led.blink,
		.ride {
			animation: none;
		}
	}
</style>
