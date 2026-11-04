<script lang="ts">
	// A guided "watch" stage built around the little network graph (inputs, a hidden layer, an
	// output, lines thick and coloured by weight, neurons glowing by how strongly they fire). Nim
	// narrates and the graph follows the beats by itself, signals flow, the layers light up in
	// turn, one neuron fills its gauge and fires, the umbrella days play through, and then the
	// network trains itself round by round. The only optional play is on the last beat, tapping a
	// line to tweak its weight.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { NeuralNetText } from '$lib/chapters/ai/neural-net/types';
	import { runSeq, prefersReducedMotion } from './webguide/seq';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as NeuralNetText);

	// Ten beats, nine scenes (the trained beat and the side fact share one).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8];

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

	// w1[j * 3 + i] joins input i to middle neuron j, w2[j] joins middle neuron j to the output.
	// Every neuron also has its own bar to clear (b1 and bo), so it only lights up past it.
	type Weights = { w1: number[]; w2: number[]; b1: number[]; bo: number };
	// Starting weights, tuned so the network gets 2 of 4 days right and a few rounds fix it.
	const START: Weights = {
		w1: [1, -1, 0, 2, -1, 0, 1, 1, 2],
		w2: [-2, 1, 2],
		b1: [-1, -1, -1],
		bo: -1.5
	};

	const sig = (z: number) => 1 / (1 + Math.exp(-z));
	const clamp = (v: number) => Math.max(-LIM, Math.min(LIM, v));
	function forward(W: Weights, inp: number[]) {
		const h = [0, 1, 2].map((j) =>
			sig(W.w1[j * 3] * inp[0] + W.w1[j * 3 + 1] * inp[1] + W.w1[j * 3 + 2] * inp[2] + W.b1[j])
		);
		const o = sig(h[0] * W.w2[0] + h[1] * W.w2[1] + h[2] * W.w2[2] + W.bo);
		return { h, o };
	}

	// ---- training, plain gradient descent on the four days, worked out once up front ----
	// Every round is kept so the stage can replay it slowly, line by line.
	const PATH: Weights[] = (() => {
		let W: Weights = { ...START, w1: [...START.w1], w2: [...START.w2], b1: [...START.b1] };
		const path = [W];
		const loss = () =>
			DAYS.reduce((s, d) => {
				const o = forward(W, d.x).o;
				return s - Math.log(d.t ? o : 1 - o);
			}, 0);
		const confident = () =>
			DAYS.every((d) => {
				const o = forward(W, d.x).o;
				return d.t ? o > 0.6 : o < 0.4;
			});
		let last = loss();
		for (let step = 1; step <= 600 && !confident(); step++) {
			const g1 = Array(9).fill(0);
			const g2 = [0, 0, 0];
			const gb = [0, 0, 0];
			let gbo = 0;
			for (const d of DAYS) {
				const { h, o } = forward(W, d.x);
				const dz = o - d.t; // how far off this guess is
				gbo += dz;
				for (let j = 0; j < 3; j++) {
					g2[j] += dz * h[j];
					const dh = dz * W.w2[j] * h[j] * (1 - h[j]);
					gb[j] += dh;
					for (let i = 0; i < 3; i++) g1[j * 3 + i] += dh * d.x[i];
				}
			}
			// nudge every weight a little against its gradient
			W = {
				w1: W.w1.map((w, k) => clamp(w - LR * g1[k])),
				w2: W.w2.map((w, k) => clamp(w - LR * g2[k])),
				b1: W.b1.map((b, k) => clamp(b - LR * gb[k])),
				bo: clamp(W.bo - LR * gbo)
			};
			// stuck on a flat spot (neurons saturated), so relax every weight and keep going
			if (step % 60 === 0) {
				if (last - loss() < 0.05) {
					W = {
						w1: W.w1.map((w) => w * 0.4),
						w2: W.w2.map((w) => w * 0.4),
						b1: [-0.5, -0.5, -0.5],
						bo: W.bo * 0.4
					};
				}
				last = loss();
			}
			path.push(W);
		}
		return path;
	})();
	const TRAINED = PATH[PATH.length - 1];
	const copy = (W: Weights): Weights => ({
		w1: [...W.w1],
		w2: [...W.w2],
		b1: [...W.b1],
		bo: W.bo
	});

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let x = $state([1, 1, 0]);
	let round = $state(0); // which training round is shown on the training scene
	let mine = $state<Weights>(copy(TRAINED)); // the learner's copy on the last scene
	let hl = $state(-1); // the layer in focus on the layers scene
	let pair = $state(0); // which highlighted line on the weights scene

	const sceneFromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(peek ?? sceneFromBeat);
	const W = $derived<Weights>(
		scene <= 5 ? START : scene === 6 ? PATH[round] : scene === 7 ? TRAINED : mine
	);
	const focusNeuron = $derived(scene === 3 || scene === 4 ? 2 : -1);
	const showDays = $derived(scene >= 5);

	const live = $derived(forward(W, x));
	const dayRight = $derived(DAYS.map((d) => forward(W, d.x).o > 0.5 === (d.t === 1)));
	const score = $derived(dayRight.filter(Boolean).length);
	const activeDay = $derived(DAYS.findIndex((d) => d.x.every((v, i) => v === x[i])));

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

	// ---- the signal pulse that travels left to right ----
	let flow = $state(-1); // 0..1 while a pulse is travelling, -1 when idle
	let raf = 0;
	function pulse() {
		if (reduced || typeof requestAnimationFrame === 'undefined') return;
		cancelAnimationFrame(raf);
		const t0 = performance.now();
		const run = (t: number) => {
			const p = (t - t0) / 1100;
			if (p >= 1) {
				flow = -1;
				return;
			}
			flow = p;
			raf = requestAnimationFrame(run);
		};
		raf = requestAnimationFrame(run);
	}
	$effect(() => () => {
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
	});
	function setInputs(v: number[]) {
		x = v;
		pulse();
	}

	// Each scene plays its own little loop.
	$effect(() => {
		const sc = scene;
		hl = -1;
		if (sc <= 2) {
			setInputs([1, 1, 0]);
			if (reduced) return;
			if (sc === 1) {
				return runSeq(
					[
						[1700, () => ((hl = 0), pulse())],
						[1700, () => (hl = 1)],
						[1900, () => (hl = 2)]
					],
					true
				);
			}
			if (sc === 2) {
				return runSeq(
					[
						[2400, () => (pair = 0)],
						[2400, () => (pair = 1)]
					],
					true
				);
			}
			return runSeq([[2800, () => pulse()]], true);
		}
		if (sc === 3 || sc === 4) {
			if (reduced) {
				x = [1, 1, 0];
				return;
			}
			return runSeq(
				[
					[1400, () => setInputs([0, 0, 0])],
					[1700, () => setInputs([1, 0, 0])],
					[2800, () => setInputs([1, 1, 0])]
				],
				true
			);
		}
		// the umbrella scenes walk through the four days
		const steps: [number, () => void][] = DAYS.map((d) => [
			2600,
			() => {
				setInputs([...d.x]);
			}
		]);
		if (reduced) {
			x = [...DAYS[0].x];
			return;
		}
		return runSeq(steps, true);
	});

	// Training replays round by round on its scene, then settles.
	$effect(() => {
		if (scene !== 6) return;
		if (reduced) {
			round = PATH.length - 1;
			return;
		}
		round = 0;
		const steps: [number, () => void][] = [[1200, () => (round = 0)]];
		for (let k = 1; k < PATH.length; k++) steps.push([300, () => (round = k)]);
		return runSeq(steps);
	});

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
	const weightOf = (e: Edge, w: Weights = W) => (e.layer === 0 ? w.w1[e.j * 3 + e.i] : w.w2[e.i]);
	const sourceOf = (e: Edge) => (e.layer === 0 ? x[e.i] : live.h[e.i]);
	// the two lines Nim points at on the weights scene, a strong push and a strong hold back
	const SHOWN = ['a22', 'b0'];

	function edgeOpacity(e: Edge) {
		if (scene === 2) return SHOWN[pair] === e.key ? 1 : 0.35;
		if (focusNeuron >= 0) return e.layer === 0 && e.j === focusNeuron ? 0.25 + 0.75 * x[e.i] : 0.08;
		return 0.22 + 0.78 * sourceOf(e);
	}

	function dotOf(e: Edge) {
		if (flow < 0) return null;
		if (focusNeuron >= 0 && !(e.layer === 0 && e.j === focusNeuron)) return null;
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

	// the gauge beside the focus neuron, its total and the mark it has to pass
	const GAUGE_MAX = 3;
	const total = $derived(
		focusNeuron >= 0 ? [0, 1, 2].reduce((s, i) => s + W.w1[focusNeuron * 3 + i] * x[i], 0) : 0
	);
	const mark = $derived(focusNeuron >= 0 ? -W.b1[focusNeuron] : 0);

	// ---- the optional tweak on the last scene ----
	let selected = $state<Edge | null>(null);
	let saidSelect = false;
	let saidTweak = false;
	$effect(() => {
		if (scene !== 8) selected = null;
	});
	function select(e: Edge) {
		if (scene !== 8) return;
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
		if (!selected) return;
		const val = Math.round(clamp(v) * 10) / 10;
		const before = score;
		const next = copy(mine);
		if (selected.layer === 0) next.w1[selected.j * 3 + selected.i] = val;
		else next.w2[selected.i] = val;
		mine = next;
		const after = DAYS.filter((d) => forward(next, d.x).o > 0.5 === (d.t === 1)).length;
		if (after < before) onstate?.('worse');
		else if (after > before && after === 4) onstate?.('better');
		else if (!saidTweak) {
			saidTweak = true;
			onstate?.('tweak');
		}
	}
	function reset() {
		mine = copy(TRAINED);
		selected = null;
	}
	const selectedWeight = $derived(selected ? weightOf(selected, mine) : 0);

	const fmt = (v: number) => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(1);
	const nodeFill = (a: number) =>
		`color-mix(in srgb, var(--color-brand) ${Math.round(a * 100)}%, var(--color-card))`;
	const nameOfSource = (e: Edge) =>
		e.layer === 0 ? tx.inputs[e.i] : tx.neuronName.replace('{n}', String(e.i + 1));
	const nameOfTarget = (e: Edge) =>
		e.layer === 0 ? tx.neuronName.replace('{n}', String(e.j + 1)) : tx.outputName;
	const edgeName = (e: Edge) =>
		tx.edgeLabel.replace('{a}', nameOfSource(e)).replace('{b}', nameOfTarget(e));
	const status = $derived(
		scene === 6 && round < PATH.length - 1
			? tx.training.replace('{n}', String(round))
			: scene >= 6
				? tx.trained.replace('{n}', String(PATH.length - 1))
				: ''
	);
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
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if showDays}
					<!-- the four past days, each with the right answer and whether the network gets it -->
					<div class="days">
						{#each DAYS as d, k (k)}
							<div class="day" class:active={activeDay === k} class:right={dayRight[k]}>
								<span class="dname">{tx.dayLabel.replace('{n}', String(k + 1))}</span>
								<span class="clues">
									{#each d.x as v, c (c)}{@render clue(c, v === 1, 13)}{/each}
								</span>
								<span class="ans">{d.t ? tx.answerYes : tx.answerNo}</span>
								<span class="mark" aria-hidden="true">{dayRight[k] ? '✓' : '✗'}</span>
							</div>
						{/each}
					</div>
					<p class="score" class:full={score === 4}>
						{tx.score.replace('{n}', String(score))}
						{#if status}<span class="status">{status}</span>{/if}
					</p>
				{/if}

				<div class="card">
					<svg class="net" viewBox="0 0 330 214" role="group" aria-label={tx.title}>
						<text class="cap" class:hl={hl === 0} x={IN_X} y="14">{tx.layerIn}</text>
						<text class="cap" class:hl={hl === 1} x={MID_X} y="14">{tx.layerHidden}</text>
						<text class="cap" class:hl={hl === 2} x={OUT_X} y="14">{tx.layerOut}</text>

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
								opacity={edgeOpacity(e)}
							/>
						{/each}

						<!-- the weight of the line Nim points at -->
						{#if scene === 2}
							{@const e = EDGES.find((k) => k.key === SHOWN[pair])}
							{#if e}
								{@const p = ends(e)}
								{@const w = weightOf(e)}
								<g transform="translate({(p.x1 + p.x2) / 2} {(p.y1 + p.y2) / 2 - 12})">
									<rect
										class="wtag"
										class:neg={w < 0}
										x="-16"
										y="-9"
										width="32"
										height="17"
										rx="8"
									/>
									<text class="wtext" class:neg={w < 0} y="3.5">{fmt(w)}</text>
								</g>
							{/if}
						{/if}

						<!-- the travelling signal -->
						{#each EDGES as e (e.key)}
							{@const dot = dotOf(e)}
							{#if dot}
								<circle class="dot" class:neg={!dot.pos} cx={dot.cx} cy={dot.cy} r={dot.r} />
							{/if}
						{/each}

						<!-- wide invisible hit lines, only on the last scene, so thin lines are easy to tap -->
						{#if scene === 8}
							{#each EDGES as e (e.key)}
								{@const p = ends(e)}
								<line
									class="hit"
									x1={p.x1}
									y1={p.y1}
									x2={p.x2}
									y2={p.y2}
									role="button"
									tabindex="0"
									aria-label={`${edgeName(e)}, ${tx.weightLabel} ${fmt(weightOf(e))}`}
									aria-pressed={selected?.key === e.key}
									onclick={() => select(e)}
									onkeydown={(ev) => onEdgeKey(ev, e)}
								/>
							{/each}
						{/if}

						<!-- input nodes -->
						{#each [0, 1, 2] as k (k)}
							<text class="ilabel" class:on={x[k] === 1} x={IN_X - 34} y={ROW_Y[k] + 4}
								>{tx.inputs[k]}</text
							>
							<g transform="translate({IN_X - 31} {ROW_Y[k] - 6})"
								>{@render clue(k, x[k] === 1, 12)}</g
							>
							<circle class="glow" cx={IN_X} cy={ROW_Y[k]} r={R + 6 * x[k]} opacity={0.2 * x[k]} />
							<circle
								class="node input"
								class:hl={hl === 0}
								cx={IN_X}
								cy={ROW_Y[k]}
								r={R}
								style="fill:{nodeFill(x[k] * 0.9)}"
							/>
							<text class="val" class:lit={x[k] === 1} x={IN_X} y={ROW_Y[k] + 4}>{x[k]}</text>
						{/each}

						<!-- middle neurons, glowing by how strongly they fire -->
						{#each live.h as a, j (j)}
							{@const faded = focusNeuron >= 0 && j !== focusNeuron}
							<g opacity={faded ? 0.3 : 1}>
								<circle class="glow" cx={MID_X} cy={ROW_Y[j]} r={R + 7 * a} opacity={0.22 * a} />
								<circle
									class="node"
									class:hl={hl === 1}
									cx={MID_X}
									cy={ROW_Y[j]}
									r={R}
									style="fill:{nodeFill(a)}"
								/>
							</g>
						{/each}

						<!-- the gauge beside the focus neuron, the total coming in and the mark to pass -->
						{#if focusNeuron >= 0}
							{@const gy = ROW_Y[focusNeuron]}
							{@const h = 44}
							{@const top = gy - h / 2}
							{@const fillH = (Math.max(0, Math.min(GAUGE_MAX, total)) / GAUGE_MAX) * h}
							{@const markY = top + h - (mark / GAUGE_MAX) * h}
							<g class="gauge">
								<rect class="gbox" x={MID_X + 22} y={top} width="9" height={h} rx="3" />
								<rect
									class="gfill"
									class:past={total > mark}
									x={MID_X + 22}
									y={top + h - fillH}
									width="9"
									height={fillH}
									rx="3"
								/>
								<line class="gmark" x1={MID_X + 19} y1={markY} x2={MID_X + 34} y2={markY} />
								<text class="gtext" x={MID_X + 37} y={markY + 3.5}>{tx.bar}</text>
								<text class="gtext strong" x={MID_X + 26.5} y={top + h + 13}
									>{tx.total} {total}</text
								>
							</g>
						{/if}

						<!-- the answer neuron -->
						<g opacity={focusNeuron >= 0 ? 0.3 : 1}>
							<circle
								class="glow"
								cx={OUT_X}
								cy={OUT_Y}
								r={R + 9 * live.o}
								opacity={0.25 * live.o}
							/>
							<circle
								class="node out"
								class:yes={live.o > 0.5}
								class:hl={hl === 2}
								cx={OUT_X}
								cy={OUT_Y}
								r={R + 2}
								style="fill:{nodeFill(live.o)}"
							/>
							<text class="olabel" x={OUT_X} y={OUT_Y + 36}>{tx.outputLabel}</text>
						</g>
					</svg>

					{#if showDays}
						<p class="verdict" class:yes={live.o > 0.5}>
							{live.o > 0.5 ? tx.verdictYes : tx.verdictNo}
						</p>
					{/if}
				</div>

				{#if i === 4}
					<p class="rule">{tx.rule}</p>
				{/if}

				{#if i === 8}
					<!-- the weight editor for the selected connection -->
					<div class="editor">
						{#if selected}
							<span class="ename">{edgeName(selected)}</span>
							<div class="erow">
								<button
									type="button"
									class="step"
									aria-label={tx.weaker}
									onclick={() => setWeight(selectedWeight - 0.5)}>&minus;</button
								>
								<input
									type="range"
									min={-LIM}
									max={LIM}
									step="0.1"
									value={selectedWeight}
									class:neg={selectedWeight < 0}
									aria-label={tx.weightLabel}
									oninput={(ev) => setWeight(Number((ev.currentTarget as HTMLInputElement).value))}
								/>
								<button
									type="button"
									class="step"
									aria-label={tx.stronger}
									onclick={() => setWeight(selectedWeight + 0.5)}>+</button
								>
								<span class="wval" class:neg={selectedWeight < 0}>{fmt(selectedWeight)}</span>
							</div>
						{:else}
							<span class="hint">{tx.tapHint}</span>
						{/if}
						<button type="button" class="reset" onclick={reset}>{tx.reset}</button>
					</div>
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
	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px 12px 12px;
	}

	/* day chips */
	.days {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		width: 100%;
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
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.clues {
		display: flex;
		gap: 2px;
		line-height: 0;
	}
	.ans {
		font-size: 10px;
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
	.score {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 10px;
		margin: 0;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		transition: color 0.25s ease;
	}
	.score.full {
		color: var(--color-grass);
	}
	.status {
		font-weight: 500;
		color: var(--color-faint);
	}

	/* the graph */
	.net {
		display: block;
		width: 100%;
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
		transition: fill 0.3s;
	}
	.cap.hl {
		fill: var(--color-brand);
		font-weight: 800;
	}
	.edge {
		stroke: var(--color-brand);
		stroke-linecap: round;
		transition:
			stroke 0.25s ease,
			opacity 0.35s ease,
			stroke-width 0.25s ease;
		pointer-events: none;
	}
	.edge.neg {
		stroke: var(--color-danger);
	}
	.wtag {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.wtag.neg {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.wtext {
		font-size: 10px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-brand);
	}
	.wtext.neg {
		fill: var(--color-danger);
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
		transition:
			fill 0.25s ease,
			stroke 0.3s,
			stroke-width 0.3s;
		pointer-events: none;
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
	.node.hl {
		stroke: var(--color-brand);
		stroke-opacity: 1;
		stroke-width: 3.5;
	}
	.glow {
		fill: var(--color-brand);
		pointer-events: none;
		transition:
			r 0.25s ease,
			opacity 0.25s ease;
	}
	.val {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
		pointer-events: none;
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
	.gbox {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.gfill {
		fill: var(--color-faint);
		transition:
			y 0.4s ease,
			height 0.4s ease,
			fill 0.3s;
	}
	.gfill.past {
		fill: var(--color-brand);
	}
	.gmark {
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.gtext {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-amber);
	}
	.gtext.strong {
		fill: var(--color-ink);
		text-anchor: middle;
	}

	.verdict {
		margin: 2px 0 0;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--color-muted);
		text-align: center;
	}
	.verdict.yes {
		color: var(--color-brand);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
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
		max-width: 360px;
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
	.reset {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 4px 8px;
	}
	.reset:hover {
		color: var(--color-ink);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.dname {
			font-size: 10.5px;
		}
		.ans {
			font-size: 9.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.edge,
		.glow,
		.node,
		.day,
		.mark,
		.clue,
		.cap,
		.gfill {
			transition: none;
		}
	}
</style>
