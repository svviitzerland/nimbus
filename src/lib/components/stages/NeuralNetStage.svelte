<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { NeuralNetText } from '$lib/chapters/ai/neural-net/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as NeuralNetText);

	// The four past days. Inputs are cloudy, humid, rain forecast (1 yes, 0 no).
	// Rain when the forecast says so, or when it is cloudy and humid together.
	const DAYS = [
		{ x: [1, 1, 0], t: 1 },
		{ x: [1, 0, 0], t: 0 },
		{ x: [0, 0, 1], t: 1 },
		{ x: [0, 1, 0], t: 0 }
	];
	const LIM = 5; // weights stay between -5 and 5
	const LR = 1; // learning rate, how big each nudge is

	// Starting weights, tuned so the network gets 2 of 4 days right and a few nudges fix it.
	// w1[j * 3 + i] joins input i to middle neuron j, w2[j] joins middle neuron j to the output.
	const START_W1 = [1, -1, 0, 2, -1, 0, 1, 1, 2];
	const START_W2 = [-2, 1, 2];
	let w1 = $state([...START_W1]);
	let w2 = $state([...START_W2]);
	// every neuron also has its own bar to clear (a bias), so it only lights up past it
	let b1 = $state([-1, -1, -1]);
	let bo = $state(-1.5);
	let x = $state([1, 1, 0]);

	const sig = (z: number) => 1 / (1 + Math.exp(-z));
	const clamp = (v: number) => Math.max(-LIM, Math.min(LIM, v));
	function forward(inp: number[]) {
		const h = [0, 1, 2].map((j) =>
			sig(w1[j * 3] * inp[0] + w1[j * 3 + 1] * inp[1] + w1[j * 3 + 2] * inp[2] + b1[j])
		);
		const o = sig(h[0] * w2[0] + h[1] * w2[1] + h[2] * w2[2] + bo);
		return { h, o };
	}

	const live = $derived(forward(x));
	const dayOut = $derived(DAYS.map((d) => forward(d.x).o));
	const dayRight = $derived(DAYS.map((d, k) => dayOut[k] > 0.5 === (d.t === 1)));
	const score = $derived(dayRight.filter(Boolean).length);
	const activeDay = $derived(DAYS.findIndex((d) => d.x.every((v, i) => v === x[i])));

	// ---- graph geometry (SVG viewBox 330 x 214) ----
	const IN_X = 112;
	const MID_X = 205;
	const OUT_X = 295;
	const ROW_Y = [46, 106, 166];
	const OUT_Y = 106;
	const R = 15;

	type Edge = { key: string; layer: 0 | 1; i: number; j: number };
	const EDGES: Edge[] = [
		...[0, 1, 2].flatMap((j) =>
			[0, 1, 2].map((i) => ({ key: `a${i}${j}`, layer: 0 as const, i, j }))
		),
		...[0, 1, 2].map((j) => ({ key: `b${j}`, layer: 1 as const, i: j, j: 0 }))
	];
	function ends(e: Edge) {
		return e.layer === 0
			? { x1: IN_X, y1: ROW_Y[e.i], x2: MID_X, y2: ROW_Y[e.j] }
			: { x1: MID_X, y1: ROW_Y[e.i], x2: OUT_X, y2: OUT_Y };
	}
	const weightOf = (e: Edge) => (e.layer === 0 ? w1[e.j * 3 + e.i] : w2[e.i]);
	const sourceOf = (e: Edge) => (e.layer === 0 ? x[e.i] : live.h[e.i]);

	// ---- the learner's moves ----
	let selected = $state<Edge | null>(null);
	let training = $state(false);
	let steps = $state(0);
	let learnedIn = $state(0);
	let saidInput = $state(false);
	let saidSelect = false;
	let saidTweak = false;
	let saidHand = false;
	let completed = false;

	function finish() {
		if (completed) return;
		completed = true;
		oncomplete?.();
	}

	function toggleInput(i: number) {
		x = x.map((v, k) => (k === i ? 1 - v : v));
		changedInput();
	}
	function pickDay(k: number) {
		x = [...DAYS[k].x];
		changedInput();
	}
	function changedInput() {
		pulse();
		if (!saidInput) {
			saidInput = true;
			onstate?.('input');
		}
	}

	function select(e: Edge) {
		if (training) return;
		selected = selected?.key === e.key ? null : e;
		if (selected && !saidSelect) {
			saidSelect = true;
			onstate?.('select');
		}
	}
	function onEdgeKey(ev: KeyboardEvent, e: Edge) {
		if (ev.key === 'Enter' || ev.key === ' ') {
			ev.preventDefault();
			select(e);
		}
	}

	function setWeight(v: number) {
		if (!selected || training) return;
		const val = Math.round(clamp(v) * 10) / 10;
		const before = score;
		if (selected.layer === 0) {
			const idx = selected.j * 3 + selected.i;
			w1 = w1.map((w, k) => (k === idx ? val : w));
		} else {
			const idx = selected.i;
			w2 = w2.map((w, k) => (k === idx ? val : w));
		}
		const after = score;
		if (after === 4) {
			if (!saidHand && before < 4) {
				saidHand = true;
				onstate?.('hand');
			}
			finish();
		} else if (after > before) onstate?.('better');
		else if (after < before) onstate?.('worse');
		else if (!saidTweak) {
			saidTweak = true;
			onstate?.('tweak');
		}
		saidTweak = true;
	}
	const selectedWeight = $derived(selected ? weightOf(selected) : 0);

	// ---- learning by itself: plain gradient descent on the four days ----
	function loss() {
		return DAYS.reduce((s, d) => {
			const o = forward(d.x).o;
			return s - Math.log(d.t ? o : 1 - o);
		}, 0);
	}
	function confident() {
		return DAYS.every((d) => {
			const o = forward(d.x).o;
			return d.t ? o > 0.6 : o < 0.4;
		});
	}
	function gradientStep() {
		const g1 = Array(9).fill(0);
		const g2 = [0, 0, 0];
		const gb = [0, 0, 0];
		let gbo = 0;
		for (const d of DAYS) {
			const { h, o } = forward(d.x);
			const dz = o - d.t; // how far off this guess is
			gbo += dz;
			for (let j = 0; j < 3; j++) {
				g2[j] += dz * h[j];
				const dh = dz * w2[j] * h[j] * (1 - h[j]);
				gb[j] += dh;
				for (let i = 0; i < 3; i++) g1[j * 3 + i] += dh * d.x[i];
			}
		}
		// nudge every weight a little against its gradient
		w1 = w1.map((w, k) => clamp(w - LR * g1[k]));
		w2 = w2.map((w, k) => clamp(w - LR * g2[k]));
		b1 = b1.map((b, k) => clamp(b - LR * gb[k]));
		bo = clamp(bo - LR * gbo);
	}

	let timer: ReturnType<typeof setInterval> | undefined;
	function train() {
		if (training) return;
		training = true;
		selected = null;
		steps = 0;
		onstate?.('learning');
		let lastLoss = loss();
		let tick = 0;
		timer = setInterval(() => {
			tick++;
			// slow at first so you can watch the lines shift, then faster
			const n = tick < 40 ? 1 : 4;
			for (let k = 0; k < n; k++) {
				if (confident() || steps >= 2500) break;
				gradientStep();
				steps++;
				// stuck on a flat spot (neurons saturated), so relax every weight and keep going
				if (steps % 60 === 0) {
					const now = loss();
					if (lastLoss - now < 0.05) {
						w1 = w1.map((w) => w * 0.4);
						w2 = w2.map((w) => w * 0.4);
						b1 = [-0.5, -0.5, -0.5];
						bo = bo * 0.4;
					}
					lastLoss = loss();
				}
			}
			if (confident() || steps >= 2500) stopTraining();
		}, 45);
	}
	function stopTraining() {
		clearInterval(timer);
		timer = undefined;
		training = false;
		learnedIn = steps;
		if (score === 4) {
			onstate?.('trained');
			finish();
		}
	}

	function reset() {
		clearInterval(timer);
		timer = undefined;
		training = false;
		learnedIn = 0;
		steps = 0;
		selected = null;
		w1 = [...START_W1];
		w2 = [...START_W2];
		b1 = [-1, -1, -1];
		bo = -1.5;
		x = [1, 1, 0];
		saidHand = false;
	}

	// ---- the signal pulse that travels left to right when an input changes ----
	let flow = $state(-1); // 0..1 while a pulse is travelling, -1 when idle
	let raf = 0;
	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	function pulse() {
		if (reduced()) return;
		cancelAnimationFrame(raf);
		const t0 = performance.now();
		const run = (t: number) => {
			const p = (t - t0) / 900;
			if (p >= 1) {
				flow = -1;
				return;
			}
			flow = p;
			raf = requestAnimationFrame(run);
		};
		raf = requestAnimationFrame(run);
	}
	function dotOf(e: Edge) {
		if (flow < 0) return null;
		const local = e.layer === 0 ? flow * 2 : flow * 2 - 1;
		if (local < 0 || local > 1) return null;
		const strength = sourceOf(e) * Math.min(1, Math.abs(weightOf(e)) / 2);
		if (strength < 0.08) return null;
		const p = ends(e);
		return {
			cx: p.x1 + (p.x2 - p.x1) * local,
			cy: p.y1 + (p.y2 - p.y1) * local,
			r: 2 + 2 * strength,
			pos: weightOf(e) >= 0
		};
	}

	// onDestroy also runs during server rendering, where animation frames do not exist
	onDestroy(() => {
		clearInterval(timer);
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
	});

	const fmt = (v: number) => (v > 0 ? '+' : '') + v.toFixed(1);
	const nodeFill = (a: number) =>
		`color-mix(in srgb, var(--color-brand) ${Math.round(a * 100)}%, var(--color-card))`;
	const nameOfSource = (e: Edge) =>
		e.layer === 0 ? tx.inputs[e.i] : tx.neuronName.replace('{n}', String(e.i + 1));
	const nameOfTarget = (e: Edge) =>
		e.layer === 0 ? tx.neuronName.replace('{n}', String(e.j + 1)) : tx.outputName;
	const edgeName = (e: Edge) =>
		tx.edgeLabel.replace('{a}', nameOfSource(e)).replace('{b}', nameOfTarget(e));
</script>

{#snippet clue(kind: number, on: boolean, size: number)}
	<svg
		class="clue"
		class:on
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		aria-hidden="true"
	>
		{#if kind === 0}
			<path
				d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18Z"
				fill="currentColor"
			/>
		{:else if kind === 1}
			<path d="M12 3c3.5 4.4 6 7.8 6 11a6 6 0 0 1-12 0c0-3.2 2.5-6.6 6-11Z" fill="currentColor" />
		{:else}
			<path
				d="M5 9a10 10 0 0 1 14 0M8 12.5a5.5 5.5 0 0 1 8 0"
				stroke="currentColor"
				stroke-width="2.2"
				stroke-linecap="round"
			/>
			<circle cx="12" cy="17" r="2.2" fill="currentColor" />
		{/if}
	</svg>
{/snippet}

<div class="stage">
	<!-- the four past days, each with the right answer and whether the network gets it -->
	<div class="days">
		{#each DAYS as d, k (k)}
			<button
				type="button"
				class="day"
				class:active={activeDay === k}
				class:right={dayRight[k]}
				onclick={() => pickDay(k)}
			>
				<span class="dname">{tx.dayLabel.replace('{n}', String(k + 1))}</span>
				<span class="clues">
					{#each d.x as v, i (i)}{@render clue(i, v === 1, 13)}{/each}
				</span>
				<span class="ans">{d.t ? tx.answerYes : tx.answerNo}</span>
				<span class="mark" aria-hidden="true">{dayRight[k] ? '✓' : '✗'}</span>
			</button>
		{/each}
	</div>

	<div class="bar">
		<span class="score" class:full={score === 4}>{tx.score.replace('{n}', String(score))}</span>
		<div class="acts">
			<CallToActionButton onclick={train} disabled={training}>
				{training
					? tx.training.replace('{n}', String(steps))
					: learnedIn
						? tx.trained.replace('{n}', String(learnedIn))
						: tx.trainBtn}
			</CallToActionButton>
			<button type="button" class="reset" onclick={reset}>{tx.reset}</button>
		</div>
	</div>

	<!-- the network itself -->
	<svg class="net" viewBox="0 0 330 214" role="group" aria-label={tx.title}>
		<text class="cap" x={IN_X} y="14">{tx.layerIn}</text>
		<text class="cap" x={MID_X} y="14">{tx.layerHidden}</text>
		<text class="cap" x={OUT_X} y="14">{tx.layerOut}</text>

		<!-- the selected connection gets a soft halo underneath -->
		{#if selected}
			{@const p = ends(selected)}
			<line
				class="halo-line"
				x1={p.x1}
				y1={p.y1}
				x2={p.x2}
				y2={p.y2}
				stroke-width={1.2 + Math.abs(selectedWeight) * 1.1 + 8}
			/>
		{/if}

		<!-- connections, thickness by weight, colour by sign, brightness by the signal on it -->
		{#each EDGES as e (e.key)}
			{@const p = ends(e)}
			{@const w = weightOf(e)}
			<line
				class="edge"
				class:neg={w < 0}
				x1={p.x1}
				y1={p.y1}
				x2={p.x2}
				y2={p.y2}
				stroke-width={1.2 + Math.abs(w) * 1.1}
				opacity={0.22 + 0.78 * sourceOf(e)}
			/>
		{/each}

		<!-- the travelling signal -->
		{#each EDGES as e (e.key)}
			{@const dot = dotOf(e)}
			{#if dot}
				<circle class="dot" class:neg={!dot.pos} cx={dot.cx} cy={dot.cy} r={dot.r} />
			{/if}
		{/each}

		<!-- wide invisible hit lines so thin connections are easy to tap -->
		{#each EDGES as e (e.key)}
			{@const p = ends(e)}
			<line
				class="hit"
				class:dis={training}
				x1={p.x1}
				y1={p.y1}
				x2={p.x2}
				y2={p.y2}
				role="button"
				tabindex={training ? -1 : 0}
				aria-label={`${edgeName(e)}, ${tx.weightLabel} ${fmt(weightOf(e))}`}
				aria-pressed={selected?.key === e.key}
				onclick={() => select(e)}
				onkeydown={(ev) => onEdgeKey(ev, e)}
			/>
		{/each}

		<!-- input nodes, tap to switch a clue on or off -->
		{#each [0, 1, 2] as i (i)}
			<g
				class="inode"
				role="switch"
				tabindex="0"
				aria-checked={x[i] === 1}
				aria-label={tx.inputs[i]}
				onclick={() => toggleInput(i)}
				onkeydown={(ev) => {
					if (ev.key === 'Enter' || ev.key === ' ') {
						ev.preventDefault();
						toggleInput(i);
					}
				}}
			>
				<text class="ilabel" class:on={x[i] === 1} x={IN_X - 34} y={ROW_Y[i] + 4}
					>{tx.inputs[i]}</text
				>
				<g transform="translate({IN_X - 31} {ROW_Y[i] - 6})">{@render clue(i, x[i] === 1, 12)}</g>
				<circle class="glow" cx={IN_X} cy={ROW_Y[i]} r={R + 6 * x[i]} opacity={0.2 * x[i]} />
				<circle
					class="node input"
					cx={IN_X}
					cy={ROW_Y[i]}
					r={R}
					style="fill:{nodeFill(x[i] * 0.9)}"
				/>
				<text class="val" class:lit={x[i] === 1} x={IN_X} y={ROW_Y[i] + 4}>{x[i]}</text>
			</g>
		{/each}

		<!-- middle neurons, glowing by how strongly they are lit -->
		{#each live.h as a, j (j)}
			<circle class="glow" cx={MID_X} cy={ROW_Y[j]} r={R + 7 * a} opacity={0.22 * a} />
			<circle class="node" cx={MID_X} cy={ROW_Y[j]} r={R} style="fill:{nodeFill(a)}" />
			<text class="val small" class:lit={a > 0.55} x={MID_X} y={ROW_Y[j] + 3.5}>{a.toFixed(2)}</text
			>
		{/each}

		<!-- the answer neuron -->
		<circle class="glow" cx={OUT_X} cy={OUT_Y} r={R + 9 * live.o} opacity={0.25 * live.o} />
		<circle
			class="node out"
			class:yes={live.o > 0.5}
			cx={OUT_X}
			cy={OUT_Y}
			r={R + 2}
			style="fill:{nodeFill(live.o)}"
		/>
		<text class="val small" class:lit={live.o > 0.55} x={OUT_X} y={OUT_Y + 3.5}
			>{live.o.toFixed(2)}</text
		>
		<text class="olabel" x={OUT_X} y={OUT_Y + 36}>{tx.outputLabel}</text>
	</svg>

	<p class="verdict" class:yes={live.o > 0.5}>
		{live.o > 0.5 ? tx.verdictYes : tx.verdictNo}
		<span class="conf">({tx.confidence.replace('{n}', String(Math.round(live.o * 100)))})</span>
	</p>

	<!-- the weight editor for the selected connection -->
	<div class="editor">
		{#if selected}
			<span class="ename">{edgeName(selected)}</span>
			<div class="erow">
				<button
					type="button"
					class="step"
					aria-label={tx.weaker}
					disabled={training}
					onclick={() => setWeight(selectedWeight - 0.5)}>&minus;</button
				>
				<input
					type="range"
					min={-LIM}
					max={LIM}
					step="0.1"
					value={selectedWeight}
					disabled={training}
					class:neg={selectedWeight < 0}
					aria-label={tx.weightLabel}
					oninput={(ev) => setWeight(Number((ev.currentTarget as HTMLInputElement).value))}
				/>
				<button
					type="button"
					class="step"
					aria-label={tx.stronger}
					disabled={training}
					onclick={() => setWeight(selectedWeight + 0.5)}>+</button
				>
				<span class="wval" class:neg={selectedWeight < 0}>{fmt(selectedWeight)}</span>
			</div>
		{:else}
			<span class="hint">{saidInput ? tx.pickHint : tx.inputHint}</span>
		{/if}
	</div>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	/* day cards */
	.days {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
		width: 100%;
		max-width: 340px;
	}
	.day {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 4px 6px;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.day.active {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.dname {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.clues {
		display: flex;
		gap: 2px;
		line-height: 0;
	}
	.ans {
		font-size: 9.5px;
		line-height: 1.15;
		color: var(--color-muted);
		text-align: center;
	}
	.mark {
		position: absolute;
		top: -7px;
		right: -5px;
		display: grid;
		place-items: center;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		font-size: 10px;
		font-weight: 800;
		color: #fff;
		background: var(--color-danger);
		transition: background 0.25s ease;
	}
	.day.right .mark {
		background: var(--color-grass);
	}
	.clue {
		color: var(--color-line);
		transition: color 0.25s ease;
	}
	.clue.on {
		color: var(--color-muted);
	}

	/* score and actions */
	.bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.score {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		transition: color 0.25s ease;
	}
	.score.full {
		color: var(--color-grass);
	}
	.acts {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.acts :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.reset {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 6px 8px;
	}
	.reset:hover {
		color: var(--color-ink);
	}

	/* the graph */
	.net {
		width: 100%;
		max-width: 360px;
		height: auto;
		overflow: visible;
		user-select: none;
	}
	.cap {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-faint);
		text-anchor: middle;
		letter-spacing: 0.02em;
	}
	.edge {
		stroke: var(--color-brand);
		stroke-linecap: round;
		transition:
			stroke 0.25s ease,
			opacity 0.25s ease;
		pointer-events: none;
	}
	.edge.neg {
		stroke: var(--color-danger);
	}
	.halo-line {
		stroke: var(--color-ink);
		stroke-opacity: 0.12;
		stroke-linecap: round;
		pointer-events: none;
	}
	.hit {
		stroke: transparent;
		stroke-width: 16;
		stroke-linecap: round;
		cursor: pointer;
		outline: none;
	}
	.hit.dis {
		cursor: default;
	}
	.hit:focus-visible {
		stroke: var(--color-ink);
		stroke-opacity: 0.1;
	}
	.dot {
		fill: var(--color-brand);
		pointer-events: none;
	}
	.dot.neg {
		fill: var(--color-danger);
	}
	.node {
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: fill 0.25s ease;
	}
	.node.input {
		stroke: var(--color-brand);
		stroke-opacity: 0.5;
	}
	.node.out {
		stroke: var(--color-faint);
		stroke-width: 2;
	}
	.node.out.yes {
		stroke: var(--color-grass);
	}
	.glow {
		fill: var(--color-brand);
		pointer-events: none;
		transition:
			r 0.25s ease,
			opacity 0.25s ease;
	}
	.inode {
		cursor: pointer;
		outline: none;
	}
	.inode:focus-visible .node {
		stroke: var(--color-ink);
		stroke-opacity: 1;
	}
	.val {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
		pointer-events: none;
	}
	.val.small {
		font-size: 8.5px;
	}
	.val.lit {
		fill: #fff;
	}
	.ilabel {
		font-size: 10.5px;
		font-weight: 600;
		text-anchor: end;
		fill: var(--color-faint);
		transition: fill 0.25s ease;
	}
	.ilabel.on {
		fill: var(--color-ink);
	}
	.olabel {
		font-size: 10.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}

	/* verdict */
	.verdict {
		font-size: 13.5px;
		font-weight: 700;
		color: var(--color-muted);
		text-align: center;
	}
	.verdict.yes {
		color: var(--color-brand);
	}
	.conf {
		font-weight: 500;
		color: var(--color-faint);
	}

	/* weight editor */
	.editor {
		display: flex;
		min-height: 52px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		width: 100%;
		max-width: 340px;
	}
	.ename {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.hint {
		font-size: 12px;
		color: var(--color-faint);
		text-align: center;
	}
	.erow {
		display: flex;
		align-items: center;
		gap: 8px;
		width: 100%;
	}
	.erow input {
		flex: 1;
		min-width: 0;
		accent-color: var(--color-brand);
	}
	.erow input.neg {
		accent-color: var(--color-danger);
	}
	.step {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		flex: none;
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		font-size: 16px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.step:disabled {
		opacity: 0.4;
	}
	.wval {
		width: 36px;
		flex: none;
		font-size: 13px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		text-align: right;
		color: var(--color-brand);
	}
	.wval.neg {
		color: var(--color-danger);
	}

	@media (prefers-reduced-motion: reduce) {
		.edge,
		.glow,
		.node,
		.day,
		.mark,
		.clue {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.net {
			max-width: 460px;
		}
		.days {
			max-width: 420px;
			gap: 10px;
		}
		.dname {
			font-size: 12px;
		}
		.ans {
			font-size: 11px;
		}
		.editor {
			max-width: 400px;
		}
	}
</style>
