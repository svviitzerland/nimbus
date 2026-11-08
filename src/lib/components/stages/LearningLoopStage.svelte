<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { LearningLoopText } from '$lib/chapters/ai/learning-loop/types';
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
	const tx = $derived(text as LearningLoopText);

	// One weight, one valley. The error is a simple bowl with its lowest point at MIN.
	const MIN = 0.4;
	const HALF = 2; // the hill spans MIN - HALF to MIN + HALF
	const START = -1.3;
	const TOP = HALF * HALF; // the highest error on the hill
	const FAST = 12; // reaching the bottom within this many steps counts as quick
	const MAX_ROLL = 80;
	const err = (w: number) => (w - MIN) * (w - MIN);
	const slope = (w: number) => 2 * (w - MIN);

	// ---- drawing (viewBox 320 x 200) ----
	const X0 = 34;
	const XW = 272;
	const Y_BASE = 172;
	const YH = 148;
	const BALL = 9;
	const sx = (w: number) => X0 + ((w - (MIN - HALF)) / (2 * HALF)) * XW;
	const sy = (e: number) => Y_BASE - (e / TOP) * YH;
	const curve = (() => {
		const pts: string[] = [];
		for (let k = 0; k <= 80; k++) {
			const w = MIN - HALF + (k / 80) * 2 * HALF;
			pts.push(`${sx(w).toFixed(1)},${sy(err(w)).toFixed(1)}`);
		}
		return pts;
	})();
	const hillLine = `M${curve.join(' L')}`;
	const hillFill = `${hillLine} L${sx(MIN + HALF)},${Y_BASE + 8} L${sx(MIN - HALF)},${Y_BASE + 8} Z`;

	// ---- state ----
	let w = $state(START);
	let rate = $state(0.05);
	let steps = $state(0);
	let trail = $state<number[]>([START]);
	let rolling = $state(false);
	let flown = $state(false);
	let reached = $state(0); // steps it took to reach the bottom, 0 while not there yet
	let saidStep = false;
	let saidSmall = false;
	let saidZig = false;
	let saidBig = false;
	let completed = false;

	const atBottom = (v: number) => Math.abs(v - MIN) < 0.05;
	const rateTag = $derived(
		rate < 0.1
			? tx.rateTags[0]
			: rate < 0.6
				? tx.rateTags[1]
				: rate < 1
					? tx.rateTags[2]
					: tx.rateTags[3]
	);
	const rateTone = $derived(
		rate < 0.1 ? 'slow' : rate < 0.6 ? 'good' : rate < 1 ? 'bouncy' : 'wild'
	);

	// ---- the hop animation from the old spot to the new one ----
	let anim = $state<{ from: number; to: number; p: number } | null>(null);
	let raf = 0;
	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
	function hop(from: number, to: number) {
		if (typeof requestAnimationFrame === 'undefined' || reduced()) return;
		cancelAnimationFrame(raf);
		const t0 = performance.now();
		const run = (t: number) => {
			const p = Math.min(1, (t - t0) / 320);
			anim = { from, to, p };
			if (p < 1) raf = requestAnimationFrame(run);
			else anim = null;
		};
		raf = requestAnimationFrame(run);
	}

	// where the ball is drawn right now (mid hop or resting)
	const ball = $derived.by(() => {
		const r = (v: number) => {
			const c = Math.max(MIN - HALF, Math.min(MIN + HALF, v));
			return { x: sx(c), y: sy(err(c)) - BALL };
		};
		if (!anim) return r(w);
		const a = r(anim.from);
		const b = r(anim.to);
		// off the hill, the ball sails up and away past the edge
		const bx = flown && anim.to === w ? sx(w) : b.x;
		const by = flown && anim.to === w ? -20 : b.y;
		const lift = 14 + Math.abs(bx - a.x) * 0.18;
		return {
			x: a.x + (bx - a.x) * anim.p,
			y: a.y + (by - a.y) * anim.p - Math.sin(Math.PI * anim.p) * lift
		};
	});
	const hidden = $derived(flown && !anim);

	// the little arrow pointing downhill from where the ball rests
	const arrow = $derived.by(() => {
		if (flown || atBottom(w) || anim) return null;
		const x = sx(w);
		const y = sy(err(w));
		// slope on screen, then a unit vector pointing toward the valley
		const dir = w > MIN ? -1 : 1;
		const sdy = (-slope(w) * (YH / TOP)) / (XW / (2 * HALF));
		const len = Math.hypot(1, sdy);
		const ux = (dir * 1) / len;
		const uy = (dir * sdy) / len;
		const L = 34;
		return { x1: x + ux * 12, y1: y + uy * 12 - 4, x2: x + ux * L, y2: y + uy * L - 4 };
	});

	function finish() {
		if (completed) return;
		completed = true;
		oncomplete?.();
	}

	/** One gradient descent step, returns false when the ball should stop. */
	function stepOnce(): boolean {
		if (flown || reached) return false;
		const before = w;
		const next = before - rate * slope(before);
		steps++;
		w = next;
		trail = [...trail, next];
		if (Math.abs(next - MIN) > HALF) {
			flown = true;
			hop(before, next);
			onstate?.('flew');
			return false;
		}
		hop(before, next);
		if (atBottom(next)) {
			reached = steps;
			onstate?.(steps <= FAST ? 'bottom' : 'slow');
			finish();
			return false;
		}
		const crossed = before - MIN < 0 !== next - MIN < 0;
		if (err(next) >= err(before) - 1e-9) {
			if (!saidBig) {
				saidBig = true;
				onstate?.('big');
			}
		} else if (crossed && !saidZig) {
			saidZig = true;
			onstate?.('zigzag');
		} else if (rate < 0.1 && steps >= 6 && !saidSmall) {
			saidSmall = true;
			onstate?.('small');
		} else if (!saidStep) {
			saidStep = true;
			onstate?.('step');
		}
		return true;
	}

	let timer: ReturnType<typeof setInterval> | undefined;
	function stopRoll() {
		clearInterval(timer);
		timer = undefined;
		rolling = false;
	}
	function roll() {
		if (rolling || flown || reached) return;
		rolling = true;
		let n = 0;
		timer = setInterval(
			() => {
				n++;
				if (!stepOnce() || n >= MAX_ROLL) stopRoll();
			},
			reduced() ? 160 : 380
		);
	}
	function reset() {
		stopRoll();
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
		anim = null;
		w = START;
		steps = 0;
		trail = [START];
		flown = false;
		reached = 0;
	}
	// changing the step size starts a fresh walk if the old one is finished
	function setRate(v: number) {
		rate = v;
		if (flown || reached) reset();
	}

	onDestroy(() => {
		clearInterval(timer);
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
	});

	const errPct = $derived(
		Math.min(100, (err(Math.max(MIN - HALF, Math.min(MIN + HALF, w))) / TOP) * 100)
	);
	// the path of hops so far, each one an arc over the hill
	const hops = $derived.by(() => {
		const out: string[] = [];
		const pts = trail.map((v) => Math.max(MIN - HALF, Math.min(MIN + HALF, v)));
		for (let k = 1; k < pts.length; k++) {
			const ax = sx(pts[k - 1]);
			const ay = sy(err(pts[k - 1]));
			const bx = sx(pts[k]);
			const by = sy(err(pts[k]));
			const lift = 14 + Math.abs(bx - ax) * 0.18;
			out.push(`M${ax},${ay} Q${(ax + bx) / 2},${Math.min(ay, by) - lift * 2} ${bx},${by}`);
		}
		return out;
	});
	const status = $derived(
		flown
			? tx.flew
			: reached
				? tx.bottom.replace('{n}', String(reached))
				: steps === 0
					? tx.slopeHint
					: tx.steps.replace('{n}', String(steps))
	);
</script>

<div class="stage">
	<div class="controls">
		<div class="acts">
			<CallToActionButton onclick={roll} disabled={rolling || flown || reached > 0}>
				{rolling ? tx.rolling.replace('{n}', String(steps)) : tx.rollBtn}
			</CallToActionButton>
			<button
				type="button"
				class="ghost"
				onclick={stepOnce}
				disabled={rolling || flown || reached > 0}>{tx.stepBtn}</button
			>
			<button type="button" class="reset" onclick={reset}>{tx.reset}</button>
		</div>

		<label class="rate">
			<span class="rhead">
				<span class="rlabel">{tx.rateLabel}</span>
				<span class="rtag {rateTone}">{rate.toFixed(2)} ({rateTag})</span>
			</span>
			<input
				type="range"
				min="0.02"
				max="1.2"
				step="0.01"
				value={rate}
				disabled={rolling}
				oninput={(ev) => setRate(Number((ev.currentTarget as HTMLInputElement).value))}
			/>
			<span class="ends"><span>{tx.rateLow}</span><span>{tx.rateHigh}</span></span>
		</label>
	</div>

	<svg class="hill" viewBox="0 0 320 200" role="img" aria-label={`${tx.title}, ${status}`}>
		<path class="ground" d={hillFill} />
		<path class="line" d={hillLine} />

		<!-- the bottom of the valley -->
		<line class="flagpole" x1={sx(MIN)} y1={Y_BASE} x2={sx(MIN)} y2={Y_BASE - 22} />
		<path class="flag" d="M{sx(MIN)},{Y_BASE - 22} l12,4 l-12,4 Z" />
		<text class="flagtext" x={sx(MIN)} y={Y_BASE + 20}>{tx.lowest}</text>

		<!-- every hop so far -->
		{#each hops as d, k (k)}
			<path class="hop" {d} opacity={0.15 + 0.5 * ((k + 1) / hops.length)} />
		{/each}
		{#each trail.slice(0, -1) as v, k (k)}
			{#if Math.abs(v - MIN) <= HALF}
				<circle class="mark" cx={sx(v)} cy={sy(err(v))} r="2.6" />
			{/if}
		{/each}

		{#if arrow}
			<line class="slope" x1={arrow.x1} y1={arrow.y1} x2={arrow.x2} y2={arrow.y2} />
			<circle class="slopehead" cx={arrow.x2} cy={arrow.y2} r="3.2" />
		{/if}

		{#if !hidden}
			<circle class="ball" class:home={reached > 0} cx={ball.x} cy={ball.y} r={BALL} />
			<circle class="shine" cx={ball.x - 3} cy={ball.y - 3} r="2.4" />
		{/if}

		<text class="axis" x={X0 + XW / 2} y="197">{tx.axisWeight}</text>
		<text class="axis" transform="translate(14 {Y_BASE - YH / 2}) rotate(-90)">{tx.axisError}</text>
	</svg>

	<div class="meter">
		<span class="mlabel">{tx.errorLabel}</span>
		<span class="track"><span class="fill" style="width:{flown ? 100 : errPct}%"></span></span>
		<span class="status" class:good={reached > 0} class:bad={flown}>{status}</span>
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
		gap: 12px;
		overflow-y: auto;
	}
	.controls {
		display: flex;
		width: 100%;
		max-width: 360px;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.acts :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.ghost {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 14px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.ghost:disabled {
		opacity: 0.45;
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

	.rate {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.rhead {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 12px;
	}
	.rlabel {
		font-weight: 600;
		color: var(--color-ink);
	}
	.rtag {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		transition: color 0.2s ease;
	}
	.rtag.slow {
		color: var(--color-muted);
	}
	.rtag.good {
		color: var(--color-grass);
	}
	.rtag.bouncy {
		color: var(--color-amber);
	}
	.rtag.wild {
		color: var(--color-danger);
	}
	.rate input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.ends {
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		color: var(--color-faint);
	}

	.hill {
		width: 100%;
		max-width: 380px;
		height: auto;
		overflow: visible;
		user-select: none;
	}
	.ground {
		fill: var(--color-brand-soft);
	}
	.line {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.flagpole {
		stroke: var(--color-grass);
		stroke-width: 1.5;
	}
	.flag {
		fill: var(--color-grass);
	}
	.flagtext,
	.axis {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-faint);
		text-anchor: middle;
	}
	.hop {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 1.2;
	}
	.mark {
		fill: var(--color-muted);
		opacity: 0.6;
	}
	.slope {
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.slopehead {
		fill: var(--color-amber);
	}
	.ball {
		fill: var(--color-ink);
		transition: fill 0.3s ease;
	}
	.ball.home {
		fill: var(--color-grass);
	}
	.shine {
		fill: #fff;
		opacity: 0.55;
		pointer-events: none;
	}

	.meter {
		display: grid;
		width: 100%;
		max-width: 360px;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 4px 10px;
	}
	.mlabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.track {
		height: 10px;
		overflow: hidden;
		border-radius: 99px;
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 99px;
		background: var(--color-danger);
		transition: width 0.3s ease;
	}
	.status {
		grid-column: 1 / -1;
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

	@media (prefers-reduced-motion: reduce) {
		.fill,
		.ball,
		.rtag {
			transition: none;
		}
	}
</style>
