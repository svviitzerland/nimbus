<script lang="ts">
	// A guided "watch" stage. Nim narrates and the chart follows the beats by itself. Practice
	// houses pop in, a stiff line misses them, a gentle bend fits, then the curve keeps getting
	// wigglier until it hits every practice house. The hidden houses arrive and the curve fails
	// them. The only optional play is the bendiness slider on the last beat.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { OverfittingText } from '$lib/chapters/ai/overfitting/types';
	import { runSeq, prefersReducedMotion } from './webguide/seq';
	import { tween } from './aiguide/tween';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as OverfittingText);

	// Eight beats, seven scenes (the memory beat and the side fact share one).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 5, 6];

	// ---- chart frame (SVG viewBox 320 x 214) ----
	const L = 40;
	const R = 308;
	const T = 12;
	const B = 178;
	const X0 = 20;
	const X1 = 200;
	const Y1 = 1600;
	const sx = (v: number) => L + ((v - X0) / (X1 - X0)) * (R - L);
	const sy = (v: number) => B - (v / Y1) * (B - T);
	const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

	// Real prices level off for big houses, plus a little random noise.
	const TRAIN: [number, number][] = [
		[28, 533],
		[45, 535],
		[66, 963],
		[88, 941],
		[110, 971],
		[132, 1342],
		[155, 1194],
		[178, 1448],
		[196, 1251]
	];
	const TEST: [number, number][] = [
		[36, 504],
		[56, 805],
		[77, 897],
		[99, 1105],
		[121, 1149],
		[143, 1279],
		[166, 1262],
		[188, 1377]
	];

	// The model, a curve with `deg` bends' worth of freedom, fitted by least squares.
	const nx = (x: number) => (x - 110) / 90;
	function fit(pts: [number, number][], deg: number) {
		const n = deg + 1;
		const A = Array.from({ length: n }, () => Array<number>(n + 1).fill(0));
		for (const [x, y] of pts) {
			const p = Array.from({ length: n }, (_, i) => nx(x) ** i);
			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) A[i][j] += p[i] * p[j];
				A[i][n] += p[i] * y;
			}
		}
		for (let c = 0; c < n; c++) {
			let m = c;
			for (let r = c + 1; r < n; r++) if (Math.abs(A[r][c]) > Math.abs(A[m][c])) m = r;
			[A[c], A[m]] = [A[m], A[c]];
			for (let r = 0; r < n; r++) {
				if (r === c) continue;
				const f = A[r][c] / A[c][c];
				for (let k = c; k <= n; k++) A[r][k] -= f * A[c][k];
			}
		}
		const w = A.map((row, i) => row[n] / row[i]);
		return (x: number) => w.reduce((s, wi, i) => s + wi * nx(x) ** i, 0);
	}
	// One fitted curve per amount of freedom, 1 (a straight line) to 8 (hits all nine houses).
	const MODELS = Array.from({ length: 9 }, (_, d) => (d === 0 ? () => 0 : fit(TRAIN, d)));

	// 100 means every house hit exactly, 0 means no better than guessing the average price.
	function score(f: (x: number) => number, pts: [number, number][]) {
		const my = pts.reduce((s, p) => s + p[1], 0) / pts.length;
		let miss = 0;
		let spread = 0;
		for (const [x, y] of pts) {
			miss += (f(x) - y) ** 2;
			spread += (y - my) ** 2;
		}
		return Math.max(0, Math.round(100 * (1 - Math.sqrt(miss / spread))));
	}

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let target = $state(1); // the freedom the story (or the slider) asks for
	let dv = $state(1); // the freedom drawn right now, glides toward the target
	let userDeg = $state(2);

	const sceneFromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(peek ?? sceneFromBeat);
	const showCurve = $derived(scene >= 1);
	const showTest = $derived(scene >= 4);

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

	// Each scene asks for its own amount of freedom, some of them in a slow loop.
	$effect(() => {
		const sc = scene;
		if (sc === 0 || sc === 1) {
			target = 1;
			return;
		}
		if (sc === 2) {
			target = 2;
			return;
		}
		if (sc === 4) {
			target = 8;
			return;
		}
		if (sc === 6) {
			target = untrack(() => userDeg);
			return;
		}
		if (reduced) {
			target = 8;
			return;
		}
		if (sc === 3) {
			// two, three, ... eight, a pause on the memorised curve, then again
			const steps: [number, () => void][] = [];
			for (let d = 2; d <= 8; d++) steps.push([d === 8 ? 3200 : 850, () => (target = d)]);
			return runSeq(steps, true);
		}
		// the memory scene swings between the sweet spot and the memorised curve
		return runSeq(
			[
				[3000, () => (target = 2)],
				[3000, () => (target = 8)]
			],
			true
		);
	});

	// The drawn curve glides to the new target instead of jumping.
	$effect(() => {
		const to = target;
		const from = untrack(() => dv);
		if (reduced) {
			dv = to;
			return;
		}
		return tween(from, to, 650, (v) => (dv = v));
	});

	// The curve on screen, blended between its two neighbouring fits while it glides.
	const model = $derived.by(() => {
		const a = Math.floor(dv);
		const b = Math.min(8, a + 1);
		const t = dv - a;
		const fa = MODELS[Math.max(1, a)];
		const fb = MODELS[b];
		return (x: number) => (1 - t) * fa(x) + t * fb(x);
	});
	const trainScore = $derived(score(model, TRAIN));
	const testScore = $derived(score(model, TEST));
	const shownDeg = $derived(Math.round(dv));
	const zone = $derived<'under' | 'fit' | 'mid' | 'over'>(
		shownDeg <= 1 ? 'under' : shownDeg <= 3 ? 'fit' : shownDeg <= 6 ? 'mid' : 'over'
	);

	const curve = $derived.by(() => {
		let d = '';
		for (let x = X0; x <= X1; x += 1.5) {
			const y = clamp(model(x), -400, 2200);
			d += `${d ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
		}
		return d;
	});

	let lastZone = '';
	function slide(v: number) {
		userDeg = v;
		target = v;
		const z = v <= 1 ? 'under' : v <= 3 ? 'fit' : v <= 6 ? 'mid' : 'over';
		if (z !== 'mid' && z !== lastZone) onstate?.(z);
		if (z !== 'mid') lastZone = z;
	}

	const ticks = [50, 100, 150, 200];
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === 6}
					<div class="control">
						<input
							type="range"
							min="1"
							max="8"
							step="1"
							value={userDeg}
							aria-label={tx.bend}
							aria-valuetext={tx.verdicts[zone]}
							oninput={(e) => slide(Number((e.currentTarget as HTMLInputElement).value))}
						/>
						<div class="ends">
							<span>{tx.stiff}</span>
							<span>{tx.wiggly}</span>
						</div>
					</div>
				{/if}

				<div class="card">
					<div class="top">
						{#if showCurve}
							<span class="pill {zone}">{tx.verdicts[zone]}</span>
						{/if}
						<span class="legend">
							<span><i class="sw train"></i>{tx.legendTrain}</span>
							{#if showTest}<span><i class="sw test"></i>{tx.legendTest}</span>{/if}
						</span>
					</div>

					<svg class="chart" viewBox="0 0 320 214" role="img" aria-label={tx.chartLabel}>
						<defs>
							<clipPath id="ovf-frame">
								<rect x={L} y={T} width={R - L} height={B - T} />
							</clipPath>
						</defs>
						<line class="axisline" x1={L} y1={B} x2={R} y2={B} />
						<line class="axisline" x1={L} y1={T} x2={L} y2={B} />
						{#each ticks as t (t)}
							<text class="tick" x={sx(t)} y={B + 14}>{t}</text>
						{/each}
						<text class="axis" x={(L + R) / 2} y="210">{tx.xAxis}</text>
						<text class="axis" transform="translate(16 {(T + B) / 2}) rotate(-90)">{tx.yAxis}</text>

						<g clip-path="url(#ovf-frame)">
							{#if showTest}
								{#each TEST as [x, y] (x)}
									<line
										class="miss"
										x1={sx(x)}
										y1={sy(y)}
										x2={sx(x)}
										y2={sy(clamp(model(x), -400, 2200))}
									/>
								{/each}
							{/if}
							{#if showCurve}
								<path class="fit" class:over={zone === 'over'} d={curve} />
							{/if}
						</g>

						{#each TRAIN as [x, y], k (x)}
							<g transform="translate({sx(x)} {sy(y)})">
								<g class="house" style="animation-delay:{scene === 0 ? k * 220 : 0}ms">
									<path d="M-6 0.5 L0 -5.5 L6 0.5 V6 H-6 Z" />
								</g>
							</g>
						{/each}
						{#if showTest}
							{#each TEST as [x, y], k (x)}
								<g transform="translate({sx(x)} {sy(y)})">
									<g class="house new" style="animation-delay:{k * 120}ms">
										<path d="M-6 0.5 L0 -5.5 L6 0.5 V6 H-6 Z" />
									</g>
								</g>
							{/each}
						{/if}
					</svg>

					{#if showCurve}
						<div class="scores">
							<div class="row">
								<span class="name">{tx.trainScore}</span>
								<span class="bar"><span class="fill train" style="width:{trainScore}%"></span></span
								>
								<b class="num">{trainScore}</b>
							</div>
							<div class="row">
								<span class="name">{tx.testScore}</span>
								{#if showTest}
									<span class="bar"><span class="fill test" style="width:{testScore}%"></span></span
									>
									<b class="num test">{testScore}</b>
								{:else}
									<span class="bar"></span>
									<span class="num off">{tx.hidden}</span>
								{/if}
							</div>
						</div>
					{/if}
				</div>

				{#if i === 5}
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
		display: flex;
		width: 100%;
		max-width: 340px;
		flex-direction: column;
		gap: 2px;
	}
	.control input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.ends {
		display: flex;
		justify-content: space-between;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.card {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 12px 12px 14px;
	}
	.top {
		display: flex;
		min-height: 22px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
	}
	.pill {
		border-radius: 999px;
		padding: 2px 10px;
		font-size: 11.5px;
		font-weight: 700;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.pill.under {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.pill.fit {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pill.mid {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.pill.over {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.legend {
		display: flex;
		gap: 10px;
		margin-left: auto;
		font-size: 11px;
		color: var(--color-muted);
	}
	.legend > span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.sw {
		height: 8px;
		width: 8px;
		border-radius: 2px;
	}
	.sw.train {
		background: var(--color-brand);
	}
	.sw.test {
		background: var(--color-grass);
	}
	.chart {
		display: block;
		width: 100%;
		height: auto;
	}
	.axisline {
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.tick {
		fill: var(--color-faint);
		font-size: 10px;
		text-anchor: middle;
	}
	.axis {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.fit {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: stroke 0.4s;
	}
	.fit.over {
		stroke: var(--color-danger);
	}
	.miss {
		stroke: var(--color-danger);
		stroke-width: 1.6;
		opacity: 0.7;
	}
	.house path {
		fill: var(--color-brand);
		stroke: var(--color-card);
		stroke-width: 1;
	}
	.house {
		animation: pop 0.45s ease both;
	}
	.house.new path {
		fill: var(--color-grass);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.scores {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 0 4px;
	}
	.row {
		display: grid;
		grid-template-columns: 96px 1fr 34px;
		align-items: center;
		gap: 8px;
	}
	.name {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.bar {
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
	}
	.fill.train {
		background: var(--color-brand);
	}
	.fill.test {
		background: var(--color-grass);
	}
	.num {
		text-align: right;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		color: var(--color-brand);
	}
	.num.test {
		color: var(--color-grass);
	}
	.num.off {
		font-size: 11px;
		color: var(--color-faint);
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
		.house {
			animation: none;
		}
		.fit,
		.pill {
			transition: none;
		}
	}
</style>
