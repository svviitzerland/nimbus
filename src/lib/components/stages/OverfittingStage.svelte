<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';

	import type { LessonText } from '$lib/chapters/types';
	import type { OverfittingText } from '$lib/chapters/ai/overfitting/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as OverfittingText);

	// ---- chart frame (SVG viewBox 220 x 184), same as the regression chart ----
	const L = 30;
	const R = 212;
	const T = 10;
	const B = 150;
	const X0 = 20;
	const X1 = 200;
	const Y0 = 0;
	const Y1 = 1600;
	const sx = (v: number) => L + ((v - X0) / (X1 - X0)) * (R - L);
	const sy = (v: number) => B - ((v - Y0) / (Y1 - Y0)) * (B - T);
	const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

	// Real prices level off for big houses, plus a little random noise.
	// TRAIN is what the model studies, TEST stays hidden until you bring it in.
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

	let deg = $state(1);
	let revealed = $state(false);

	const model = $derived(fit(TRAIN, deg));
	const trainScore = $derived(score(model, TRAIN));
	const testScore = $derived(score(model, TEST));
	const zone = $derived<'under' | 'fit' | 'mid' | 'over'>(
		deg === 1 ? 'under' : deg <= 3 ? 'fit' : deg <= 6 ? 'mid' : 'over'
	);

	const curve = $derived.by(() => {
		let d = '';
		for (let x = X0; x <= X1; x += 1.5) {
			const y = clamp(model(x), -400, 2000);
			d += `${d ? 'L' : 'M'}${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`;
		}
		return d;
	});

	let said = new SvelteSet<string>();
	let completed = false;
	function say(token: string) {
		if (said.has(token)) return;
		said.add(token);
		onstate?.(token);
	}

	function setDeg(d: number) {
		deg = d;
		if (!revealed) {
			if (trainScore === 100) say('practice');
			return;
		}
		if (zone === 'mid') return;
		const next = new SvelteSet(said).add(zone);
		if (!completed && next.has('fit') && next.has('over')) {
			completed = true;
			said = next;
			onstate?.('done');
			oncomplete?.();
			return;
		}
		say(zone);
	}

	function reveal() {
		revealed = true;
		onstate?.('reveal');
	}

	const ticks = [50, 100, 150, 200];
</script>

<div class="stage">
	<div class="control">
		<input
			type="range"
			min="1"
			max="8"
			step="1"
			value={deg}
			aria-label={tx.bend}
			aria-valuetext={tx.verdicts[zone]}
			oninput={(e) => setDeg(Number((e.currentTarget as HTMLInputElement).value))}
		/>
		<div class="ends">
			<span>{tx.stiff}</span>
			<span class="pill {zone}">{tx.verdicts[zone]}</span>
			<span>{tx.wiggly}</span>
		</div>
	</div>

	<div class="scores">
		<div class="row">
			<span class="name">{tx.trainScore}</span>
			<span class="bar"><span class="fill train" style="width:{trainScore}%"></span></span>
			<b class="num">{trainScore}</b>
		</div>
		<div class="row">
			<span class="name">{tx.testScore}</span>
			{#if revealed}
				<span class="bar"><span class="fill test" style="width:{testScore}%"></span></span>
				<b class="num test">{testScore}</b>
			{:else}
				<span class="bar"></span>
				<span class="num off">{tx.hidden}</span>
			{/if}
		</div>
	</div>

	<svg class="chart" viewBox="0 0 220 184" role="img" aria-label={tx.chartLabel}>
		<defs>
			<clipPath id="ovf-frame">
				<rect x={L} y={T} width={R - L} height={B - T} />
			</clipPath>
		</defs>
		<rect x={L} y={T} width={R - L} height={B - T} class="frame" />
		{#each ticks as t (t)}
			<text class="tick" x={sx(t)} y={B + 12}>{t}</text>
		{/each}
		<text class="axis" x={(L + R) / 2} y="180">{tx.xAxis}</text>
		<text class="axis" transform="translate(12 {(T + B) / 2}) rotate(-90)">{tx.yAxis}</text>

		<g clip-path="url(#ovf-frame)">
			{#if revealed}
				{#each TEST as [x, y] (x)}
					<line
						class="miss"
						x1={sx(x)}
						y1={sy(y)}
						x2={sx(x)}
						y2={sy(clamp(model(x), -400, 2000))}
					/>
				{/each}
			{/if}
			<path class="fit" d={curve} />
		</g>

		{#each TRAIN as [x, y] (x)}
			<g transform="translate({sx(x)} {sy(y)})" class="house">
				<path d="M-5 0.5 L0 -4.5 L5 0.5 V5 H-5 Z" />
			</g>
		{/each}
		{#if revealed}
			{#each TEST as [x, y], i (x)}
				<g
					transform="translate({sx(x)} {sy(y)})"
					class="house new"
					style="animation-delay:{i * 60}ms"
				>
					<path d="M-5 0.5 L0 -4.5 L5 0.5 V5 H-5 Z" />
				</g>
			{/each}
		{/if}
	</svg>

	<div class="legend">
		<span><i class="sw train"></i>{tx.legendTrain}</span>
		<span><i class="sw test"></i>{tx.legendTest}</span>
	</div>

	{#if !revealed}
		<CallToActionButton onclick={reveal}>{tx.revealBtn}</CallToActionButton>
	{/if}
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-width: 360px;
		margin: 0 auto;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 8px;
	}
	.stage :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.control {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.control input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.ends {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 11px;
		color: var(--color-faint);
	}
	.pill {
		border-radius: 999px;
		padding: 2px 10px;
		font-size: 11.5px;
		font-weight: 700;
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

	.scores {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
	}
	.row {
		display: grid;
		grid-template-columns: 104px 1fr 72px;
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
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: inherit;
		transition: width 0.3s ease;
	}
	.fill.train {
		background: var(--color-ink);
		opacity: 0.75;
	}
	.fill.test {
		background: var(--color-brand);
	}
	.num {
		font-size: 13px;
		color: var(--color-ink);
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.num.test {
		color: var(--color-brand);
	}
	.num.off {
		font-size: 11px;
		color: var(--color-faint);
	}

	.chart {
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
	}
	.frame {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.tick {
		font-size: 8.5px;
		fill: var(--color-faint);
		text-anchor: middle;
	}
	.axis {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.fit {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.miss {
		stroke: var(--color-danger);
		stroke-width: 1.4;
		stroke-opacity: 0.7;
	}
	.house path {
		fill: var(--color-ink);
		fill-opacity: 0.75;
	}
	.house.new {
		animation: pop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.house.new path {
		fill: var(--color-card);
		fill-opacity: 1;
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	@keyframes pop {
		from {
			opacity: 0;
		}
	}
	.legend {
		display: flex;
		gap: 14px;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.sw {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}
	.sw.train {
		background: var(--color-ink);
		opacity: 0.75;
	}
	.sw.test {
		border: 1.5px solid var(--color-brand);
		background: var(--color-card);
	}

	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
		.house.new {
			animation: none;
		}
	}
</style>
