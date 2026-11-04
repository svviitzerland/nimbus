<script lang="ts">
	// A guided "watch" stage for gradient descent. One knob, one hill of wrongness, one ball. The
	// hill appears, fog rolls in so only the slope under the ball can be felt, then the ball steps
	// downhill by itself. Later beats replay the walk with tiny steps (it crawls), giant leaps (it
	// flies off) and the sweet spot (it settles). The only optional play is the last beat, which
	// switches between the three step sizes.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { LearningLoopText } from '$lib/chapters/ai/learning-loop/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as LearningLoopText);

	// Which scene each beat shows (ten beats, eight scenes).
	const SCENE_OF_BEAT = [0, 0, 1, 2, 3, 4, 5, 6, 6, 7];

	// One knob, one valley. The wrongness is a simple bowl with its lowest point at MIN.
	const MIN = 0.4;
	const HALF = 2; // the hill spans MIN minus HALF to MIN plus HALF
	const START = MIN - 1.7;
	const TOP = HALF * HALF;
	const err = (w: number) => (w - MIN) * (w - MIN);
	const slope = (w: number) => 2 * (w - MIN);

	const TINY = 0.03;
	const GOOD = 0.3;
	const BIG = 1.04;
	const RATES = [TINY, GOOD, BIG];
	const TOKENS = ['small', 'good', 'big'];

	// Drawing, viewBox 320 by 210.
	const X0 = 30;
	const XW = 270;
	const Y_BASE = 176;
	const YH = 150;
	const BALL = 9;
	const sx = (w: number) => X0 + ((w - (MIN - HALF)) / (2 * HALF)) * XW;
	const sy = (e: number) => Y_BASE - (e / TOP) * YH;
	const curve: string[] = [];
	for (let k = 0; k <= 80; k++) {
		const w = MIN - HALF + (k / 80) * 2 * HALF;
		curve.push(`${sx(w).toFixed(1)},${sy(err(w)).toFixed(1)}`);
	}
	const hillLine = `M${curve.join(' L')}`;
	const hillFill = `${hillLine} L${sx(MIN + HALF)},${Y_BASE + 30} L${sx(MIN - HALF)},${Y_BASE + 30} Z`;

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let played = $state(1); // the step size picked on the try it scene

	let w = $state(START);
	let steps = $state(0);
	let trail = $state<number[]>([]);
	let flown = $state(false);
	let moving = $state(false);
	let end = $state<'none' | 'bottom' | 'far' | 'flew'>('none');

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const foggy = $derived(scene >= 1 && scene <= 2);
	const rate = $derived(
		scene === 4 ? TINY : scene === 5 ? BIG : scene === 7 ? RATES[played] : scene >= 2 ? GOOD : 0
	);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	const MAX_STEPS = 12;
	type Next = { w: number; flew: boolean; done: 'none' | 'bottom' | 'far' | 'flew' };
	function stepFrom(cur: number, r: number, n: number): Next {
		const nw = cur - r * slope(cur);
		if (Math.abs(nw - MIN) > HALF) return { w: nw, flew: true, done: 'flew' };
		if (Math.abs(nw - MIN) < 0.03) return { w: nw, flew: false, done: 'bottom' };
		if (n >= MAX_STEPS) return { w: nw, flew: false, done: 'far' };
		return { w: nw, flew: false, done: 'none' };
	}

	function resetBall() {
		w = START;
		steps = 0;
		trail = [];
		flown = false;
		moving = false;
		end = 'none';
	}

	// The walk. On the stepping scenes the ball takes one step at a time, rests at the end, and
	// starts over from the same spot, so the picture keeps telling the same little story.
	$effect(() => {
		const r = rate;
		const still = reduced;
		resetBall();
		if (r === 0) return;
		if (still) {
			// A still frame, the walk already finished.
			let cur = START;
			const path: number[] = [];
			for (let n = 1; n <= MAX_STEPS + 2; n++) {
				const nx = stepFrom(cur, r, n);
				path.push(cur);
				cur = nx.w;
				if (nx.done !== 'none') {
					steps = n;
					flown = nx.flew;
					end = nx.done;
					break;
				}
			}
			trail = path;
			w = cur;
			return;
		}
		let t: ReturnType<typeof setTimeout>;
		const gap = r === TINY ? 650 : 950;
		const step = () => {
			const nx = stepFrom(w, r, steps + 1);
			trail = [...trail, w];
			w = nx.w;
			steps += 1;
			flown = nx.flew;
			moving = true;
			t = setTimeout(() => {
				moving = false;
				if (nx.done !== 'none') {
					end = nx.done;
					t = setTimeout(() => {
						resetBall();
						t = setTimeout(step, 900);
					}, 2600);
				} else {
					t = setTimeout(step, gap - 550);
				}
			}, 550);
		};
		t = setTimeout(step, 1100);
		return () => clearTimeout(t);
	});

	const ballX = $derived(flown ? sx(MIN + Math.sign(w - MIN) * HALF * 1.12) : sx(w));
	const ballY = $derived(flown ? -40 : sy(err(w)) - BALL);
	const errShare = $derived(flown ? 1 : Math.min(1, err(w) / TOP));

	// The little arrow that shows which way is downhill, drawn along the ground under the ball.
	const arrow = $derived.by(() => {
		const s = -Math.sign(slope(w));
		const px = sx(w);
		const py = sy(err(w));
		const vx = s * (XW / (2 * HALF));
		const vy = s * (-(YH / TOP) * slope(w));
		const len = Math.hypot(vx, vy) || 1;
		const ux = vx / len;
		const uy = vy / len;
		const L = 30;
		const tipX = px + ux * L;
		const tipY = py + uy * L;
		// arrowhead, two short wings
		const wing = (a: number) => {
			const c = Math.cos(a);
			const sn = Math.sin(a);
			const bx = -(ux * c - uy * sn) * 8;
			const by = -(ux * sn + uy * c) * 8;
			return `${(tipX + bx).toFixed(1)},${(tipY + by).toFixed(1)}`;
		};
		return {
			x1: px,
			y1: py,
			x2: tipX,
			y2: tipY,
			head: `${wing(0.5)} ${tipX.toFixed(1)},${tipY.toFixed(1)} ${wing(-0.5)}`
		};
	});
	const showArrow = $derived(
		scene >= 1 && !flown && !moving && end !== 'bottom' && Math.abs(w - MIN) > 0.05
	);

	const status = $derived.by(() => {
		if (rate === 0) return '';
		if (end === 'flew') return tx.flew;
		if (end === 'bottom') return tx.bottom.replace('{n}', String(steps));
		if (end === 'far') return tx.far.replace('{n}', String(steps));
		return steps > 0 ? tx.stepN.replace('{n}', String(steps)) : '';
	});

	function another() {
		played = (played + 1) % RATES.length;
		onstate?.(TOKENS[played]);
	}
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 7}
					<div class="try" in:fade={{ duration: 250 }}>
						<button type="button" onclick={another}>{tx.another}</button>
						<span>{tx.sizeLabel.replace('{x}', tx.sizes[played])}</span>
					</div>
				{/if}

				<svg viewBox="0 0 320 210" class="hill" role="img" aria-label={tx.panels[s].title}>
					<defs>
						<radialGradient id="ll-hole">
							<stop offset="0.45" stop-color="black" />
							<stop offset="1" stop-color="white" />
						</radialGradient>
						<mask id="ll-fog-mask">
							<rect x="0" y="0" width="320" height="210" fill="white" />
							<g class="glide" style="transform: translate({ballX}px, {ballY + BALL}px)">
								<circle r="58" fill="url(#ll-hole)" />
							</g>
						</mask>
					</defs>

					<path d={hillFill} class="ground" />
					<path d={hillLine} class="edge" />

					<!-- the flag at the least wrong spot -->
					<g transform="translate({sx(MIN)}, {Y_BASE})">
						<line x1="0" y1="0" x2="0" y2="-26" class="pole" />
						<path d="M0,-26 L14,-21 L0,-16 Z" class="flag" />
					</g>
					<text x={sx(MIN)} y="198" class="lowest" text-anchor="middle">{tx.lowest}</text>

					<text x="300" y="206" class="axis" text-anchor="end">{tx.axisKnob}</text>
					<text x="14" y="20" class="axis" transform="rotate(-90 14 20)" text-anchor="end"
						>{tx.axisError}</text
					>

					{#each trail as t, k (k)}
						<circle cx={sx(t)} cy={sy(err(t)) - BALL} r="3" class="crumb" />
					{/each}

					{#if showArrow}
						<g class="arrow" in:fade={{ duration: 300 }}>
							<line x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} />
							<polyline points={arrow.head} />
						</g>
					{/if}

					<g class="glide" style="transform: translate({ballX}px, {ballY}px)">
						<circle r={BALL} class="ball" />
						<circle r="3" cx="-3" cy="-3" class="shine" />
					</g>

					<rect
						x="0"
						y="0"
						width="320"
						height="210"
						class="fog"
						class:on={foggy}
						mask="url(#ll-fog-mask)"
					/>
				</svg>

				<div class="meter">
					<span class="meter-label">{tx.errorLabel}</span>
					<div class="track">
						<div
							class="fill"
							class:low={errShare < 0.05}
							class:high={errShare > 0.8}
							style="width: {Math.max(2, errShare * 100)}%"
						></div>
					</div>
				</div>
				<p class="status" class:good={end === 'bottom'} class:bad={end === 'flew'}>
					{status}
				</p>

				{#if s === 3}
					<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
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
		align-items: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: stretch;
		gap: 8px;
	}
	.try {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.try button {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.try button:hover {
		transform: translateY(-1px);
	}
	.try span {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.hill {
		width: 100%;
		height: auto;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
	}
	.ground {
		fill: var(--color-grass-soft);
	}
	.edge {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.pole {
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.flag {
		fill: var(--color-grass);
	}
	.lowest {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.axis {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.crumb {
		fill: var(--color-faint);
		opacity: 0.45;
	}
	.arrow line,
	.arrow polyline {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.glide {
		transition: transform 0.55s cubic-bezier(0.4, 0, 0.3, 1);
	}
	.ball {
		fill: var(--color-brand);
	}
	.shine {
		fill: white;
		opacity: 0.55;
	}
	.fog {
		fill: var(--color-paper);
		opacity: 0;
		transition: opacity 0.8s;
		pointer-events: none;
	}
	.fog.on {
		opacity: 0.9;
	}

	.meter {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 4px;
	}
	.meter-label {
		flex: none;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.track {
		flex: 1;
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-line);
	}
	.fill {
		height: 100%;
		border-radius: 999px;
		background: var(--color-amber);
		transition:
			width 0.55s,
			background 0.3s;
	}
	.fill.low {
		background: var(--color-grass);
	}
	.fill.high {
		background: var(--color-danger);
	}
	.status {
		margin: 0;
		min-height: 1.4em;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.status.good {
		color: var(--color-grass);
	}
	.status.bad {
		color: var(--color-danger);
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
		.glide,
		.fog,
		.fill {
			transition: none;
		}
	}
</style>
