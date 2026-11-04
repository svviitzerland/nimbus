<script lang="ts">
	// A guided "watch" stage. Nim narrates and the clinic follows the beats by itself. Twenty
	// patients line up by their risk score, a threshold line appears, the truth is revealed, and
	// then the line slides left and right on its own so caught people, false alarms and missed
	// cases change in front of you. The only optional play is dragging the line on the last beat.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { EvaluationText } from '$lib/chapters/ai/evaluation/types';
	import { runSeq, prefersReducedMotion } from './webguide/seq';
	import { tween } from './aiguide/tween';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as EvaluationText);

	// Nine beats, eight scenes (the memory beat and the side fact share one).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];

	// Twenty patients, the score the model gave each one, and the truth. Only three are really
	// sick, and one healthy person scores high (real tests are never perfect).
	const SICK = [52, 74, 91];
	const HEALTHY = [4, 9, 13, 17, 21, 26, 30, 33, 38, 42, 45, 48, 57, 61, 66, 69, 80];

	// ---- number line (SVG viewBox from y 44, 320 x 110) ----
	const L = 20;
	const R = 300;
	const AXIS = 132;
	const TOP = 60;
	const sx = (v: number) => L + (v / 100) * (R - L);

	type Patient = { score: number; sick: boolean; row: number };
	// stack people that would overlap into rows above the line
	const PATIENTS: Patient[] = (() => {
		const all = [
			...SICK.map((score) => ({ score, sick: true })),
			...HEALTHY.map((score) => ({ score, sick: false }))
		].sort((a, b) => a.score - b.score);
		const lastX: number[] = [];
		return all.map((p) => {
			const x = sx(p.score);
			let row = lastX.findIndex((lx) => x - lx >= 14);
			if (row === -1) row = lastX.length;
			lastX[row] = x;
			return { ...p, row };
		});
	})();
	const rowY = (row: number) => AXIS - 8 - row * 26;

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let target = $state(50); // where the story (or the learner) wants the line
	let th = $state(50); // where the line is drawn right now, glides toward the target
	let userTh = $state(50);

	const sceneFromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(peek ?? sceneFromBeat);
	const showLine = $derived(scene >= 1);
	const showTruth = $derived(scene >= 2);
	const showRings = $derived(scene >= 3);
	const showTally = $derived(scene >= 3);
	const showAccuracy = $derived(scene === 5 || scene === 7);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		reduced = prefersReducedMotion();
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	// Each scene places the line, some of them in a slow back and forth.
	$effect(() => {
		const sc = scene;
		if (sc <= 2) {
			target = 50;
			return;
		}
		if (sc === 4) {
			target = 48;
			return;
		}
		if (sc === 5) {
			target = 100;
			return;
		}
		if (sc === 7) {
			target = untrack(() => userTh);
			return;
		}
		if (reduced) {
			target = 50;
			return;
		}
		return runSeq(
			[
				[3200, () => (target = 22)],
				[3200, () => (target = 80)],
				[2600, () => (target = 50)]
			],
			true
		);
	});

	// The line glides to its new spot.
	$effect(() => {
		const to = target;
		const from = untrack(() => th);
		if (reduced) {
			th = to;
			return;
		}
		return tween(from, to, 1100, (v) => (th = v));
	});

	type Outcome = 'caught' | 'missed' | 'fa' | 'cleared';
	const outcome = (p: Patient, line: number): Outcome => {
		const flagged = p.score >= line;
		if (p.sick) return flagged ? 'caught' : 'missed';
		return flagged ? 'fa' : 'cleared';
	};
	const counts = $derived.by(() => {
		const c: Record<Outcome, number> = { caught: 0, missed: 0, fa: 0, cleared: 0 };
		for (const p of PATIENTS) c[outcome(p, th)]++;
		return c;
	});
	const accuracy = $derived(Math.round(((counts.caught + counts.cleared) / PATIENTS.length) * 100));
	const net = $derived(th <= 35 ? 'wide' : th >= 70 && th < 100 ? 'tight' : '');

	let lastZone = '';
	function drag(v: number) {
		userTh = v;
		target = v;
		let missed = 0;
		let fa = 0;
		for (const p of PATIENTS) {
			const o = outcome(p, v);
			if (o === 'missed') missed++;
			if (o === 'fa') fa++;
		}
		const zone = missed > 0 ? 'miss' : fa >= 8 ? 'noisy' : 'catch';
		if (zone !== lastZone) onstate?.(zone);
		lastZone = zone;
	}

	const fill = (p: Patient) => (!showTruth ? 'none' : p.sick ? 'sick' : 'well');
	const ticks = [0, 25, 50, 75, 100];
</script>

{#snippet person(p: Patient, k: number)}
	{@const o = outcome(p, th)}
	<g
		transform="translate({sx(p.score)} {rowY(p.row)})"
		role="img"
		aria-label={tx.patient
			.replace('{score}', String(p.score))
			.replace('{truth}', showTruth ? (p.sick ? tx.sick : tx.healthy) : '')}
	>
		<g class="drop" style="animation-delay:{scene === 0 && !reduced ? k * 90 : 0}ms">
			{#if showRings && o !== 'cleared'}
				<circle class="ring {o}" cx="0" cy="-7" r="10" />
			{/if}
			<circle class="body {fill(p)}" cx="0" cy="-12" r="3.6" />
			<path class="body {fill(p)}" d="M-5.5 0 Q-5.5 -7 0 -7 Q5.5 -7 5.5 0 Z" />
		</g>
	</g>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === 7}
					<div class="control">
						<input
							type="range"
							min="0"
							max="100"
							step="1"
							value={userTh}
							aria-label={tx.thresholdAria}
							aria-valuetext={tx.thresholdValue.replace('{n}', String(userTh))}
							oninput={(e) => drag(Number((e.currentTarget as HTMLInputElement).value))}
						/>
					</div>
				{/if}

				<div class="card">
					<svg class="line" viewBox="0 44 320 110" role="group" aria-label={tx.chartLabel}>
						{#if showLine}
							{@const lx = sx(Math.min(100, th))}
							<rect
								class="zone"
								x={lx}
								y={TOP}
								width={Math.max(0, R + 10 - lx)}
								height={AXIS - TOP}
							/>
							<text class="zlabel" x={L - 6} y={TOP + 10} text-anchor="start">{tx.home}</text>
							{#if th < 88}
								<text class="zlabel flag" x={R + 8} y={TOP + 10} text-anchor="end"
									>{tx.flagged}</text
								>
							{/if}
						{/if}

						<line class="axisline" x1={L - 6} y1={AXIS} x2={R + 6} y2={AXIS} />
						{#each ticks as t (t)}
							<line class="tickmark" x1={sx(t)} y1={AXIS} x2={sx(t)} y2={AXIS + 4} />
							<text class="tick" x={sx(t)} y={AXIS + 15}>{t}</text>
						{/each}

						{#each PATIENTS as p, k (p.score)}
							{@render person(p, k)}
						{/each}

						{#if showLine}
							{@const lx = sx(Math.min(100, th))}
							<line class="thline" x1={lx} y1={TOP - 4} x2={lx} y2={AXIS} />
							<circle class="knob" cx={lx} cy={TOP - 4} r="4" />
						{/if}
					</svg>
					<p class="axis">{tx.axis}</p>

					{#if showTally}
						<div class="tally">
							<span class="t caught">
								<i></i>{tx.caught}
								<b
									>{tx.ofSick
										.replace('{n}', String(counts.caught))
										.replace('{total}', String(SICK.length))}</b
								>
							</span>
							<span class="t missed"><i></i>{tx.missed} <b>{counts.missed}</b></span>
							<span class="t fa"><i></i>{tx.falseAlarm} <b>{counts.fa}</b></span>
						</div>
					{/if}
					{#if showAccuracy}
						<p class="acc">{tx.accuracy.replace('{n}', String(accuracy))}</p>
					{/if}
				</div>

				{#if i === 6}
					<p class="net">{net === 'wide' ? tx.wide : net === 'tight' ? tx.tight : ' '}</p>
					<p class="rule">{tx.rule}</p>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.control {
		width: 100%;
		max-width: 360px;
	}
	.control input {
		width: 100%;
		accent-color: var(--color-amber);
	}
	.card {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 8px;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 12px 12px 14px;
	}
	.line {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.zone {
		fill: var(--color-amber-soft);
	}
	.zlabel {
		fill: var(--color-faint);
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.03em;
	}
	.zlabel.flag {
		fill: var(--color-amber);
	}
	.axisline {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.tickmark {
		stroke: var(--color-line);
	}
	.tick {
		fill: var(--color-faint);
		font-size: 10px;
		text-anchor: middle;
	}
	.thline {
		stroke: var(--color-amber);
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.knob {
		fill: var(--color-amber);
	}
	.body {
		transition: fill 0.5s;
	}
	.body.none {
		fill: var(--color-faint);
	}
	.body.well {
		fill: var(--color-muted);
		opacity: 0.7;
	}
	.body.sick {
		fill: var(--color-danger);
	}
	.ring {
		fill: none;
		stroke-width: 2;
	}
	.ring.caught {
		stroke: var(--color-grass);
	}
	.ring.fa {
		stroke: var(--color-amber);
	}
	.ring.missed {
		stroke: var(--color-danger);
		animation: beat 1.4s ease-in-out infinite;
		transform-origin: 0 -7px;
	}
	@keyframes beat {
		50% {
			opacity: 0.35;
		}
	}
	.drop {
		animation: drop 0.45s ease both;
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.axis {
		margin: 0;
		text-align: center;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.tally {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px 14px;
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.t {
		display: inline-flex;
		align-items: center;
		gap: 5px;
	}
	.t i {
		height: 10px;
		width: 10px;
		border-radius: 999px;
		border: 2px solid var(--c);
	}
	.t b {
		font-variant-numeric: tabular-nums;
		color: var(--color-ink);
	}
	.t.caught {
		--c: var(--color-grass);
	}
	.t.missed {
		--c: var(--color-danger);
	}
	.t.fa {
		--c: var(--color-amber);
	}
	.acc {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.net {
		margin: 0;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.drop,
		.ring.missed {
			animation: none;
		}
		.body {
			transition: none;
		}
	}
</style>
