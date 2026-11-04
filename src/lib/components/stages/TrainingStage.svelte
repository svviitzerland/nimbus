<script lang="ts">
	// A guided "watch" stage. Nim narrates, and a little fruit stand follows the beats by itself:
	// first a hand written rule sorts a slightly orange apple wrong, then six labelled fruits drop
	// into their baskets, rise onto a picture of colour and size, and a border draws itself between
	// them (training). After that new fruits roll in, land on one side of the border, and drop into
	// the right basket on their own (prediction). The only optional play is on the last beat,
	// sending the tricky apple from the first beat to the model.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { TrainingText } from '$lib/chapters/ai/training/types';
	import { runSeq, type SeqStep } from './webguide/seq';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as TrainingText);

	const LAST = 6;
	type Kind = 'apple' | 'orange';
	type Fruit = { kind: Kind; c: number; s: number; slot: [number, number] };
	// c is the colour (0 red, 1 orange), s is the size (0 small, 1 big).
	const EXAMPLES: Fruit[] = [
		{ kind: 'apple', c: 0.15, s: 0.3, slot: [80, 252] },
		{ kind: 'orange', c: 0.72, s: 0.62, slot: [220, 250] },
		{ kind: 'apple', c: 0.28, s: 0.2, slot: [105, 253] },
		{ kind: 'orange', c: 0.85, s: 0.78, slot: [245, 248] },
		{ kind: 'apple', c: 0.22, s: 0.42, slot: [130, 252] },
		{ kind: 'orange', c: 0.78, s: 0.55, slot: [270, 250] }
	];
	const NEW: Fruit[] = [
		{ kind: 'apple', c: 0.3, s: 0.22, slot: [92, 252] },
		{ kind: 'orange', c: 0.8, s: 0.68, slot: [232, 249] },
		{ kind: 'apple', c: 0.18, s: 0.45, slot: [118, 252] },
		{ kind: 'orange', c: 0.7, s: 0.82, slot: [258, 248] }
	];
	const TRICKY: Fruit = { kind: 'apple', c: 0.52, s: 0.2, slot: [105, 234] };

	// The picture of the two clues. Colour runs left to right, size bottom to top.
	const X = (c: number) => 60 + c * 250;
	const Y = (s: number) => 180 - s * 150;
	const R = (s: number) => 8 + s * 7;
	// The border the model ends up with, halfway between the two groups.
	const B1 = [0.14, 1] as const;
	const B2 = [0.86, 0] as const;
	const ENTRY: [number, number] = [185, 226];
	const OFF: [number, number] = [350, 226];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let dropped = $state(EXAMPLES.length); // examples in their baskets on beat 2
	let cur = $state(-1); // the new fruit on its way right now
	let step = $state<'enter' | 'roll' | 'chart' | 'basket'>('enter');
	let sorted = $state(0); // new fruits already in a basket
	let ruleStep = $state<'start' | 'mid' | 'basket'>('start');
	let tricky = $state<'off' | 'enter' | 'roll' | 'chart' | 'basket'>('off');
	let sendRun = $state(0);

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
		tricky = 'off';
		sendRun = 0;
	});

	const scene = $derived(peek ?? Math.min(beat, LAST));

	// Beat 1, the hand written rule meets the tricky apple, over and over.
	$effect(() => {
		if (scene !== 0) return;
		if (reduced) {
			ruleStep = 'basket';
			return;
		}
		return runSeq(
			[
				[300, () => (ruleStep = 'start')],
				[1500, () => (ruleStep = 'mid')],
				[3400, () => (ruleStep = 'basket')]
			],
			true
		);
	});

	// Beat 2, the labelled examples drop into their baskets one by one.
	$effect(() => {
		if (scene !== 1 || reduced) {
			dropped = EXAMPLES.length;
			return;
		}
		dropped = 0;
		const t = setInterval(() => {
			dropped += 1;
			if (dropped >= EXAMPLES.length) clearInterval(t);
		}, 650);
		return () => clearInterval(t);
	});

	// Beats 5 and 6, new fruits roll in and get sorted, in a gentle loop.
	$effect(() => {
		const sc = scene;
		if (sc < 4) {
			cur = -1;
			sorted = 0;
			return;
		}
		if (sc === LAST || reduced) {
			cur = -1;
			sorted = NEW.length;
			return;
		}
		const steps: SeqStep[] = [[200, () => ((sorted = 0), (cur = -1))]];
		NEW.forEach((_, k) => {
			steps.push(
				[700, () => ((cur = k), (step = 'enter'))],
				[1300, () => (step = 'roll')],
				[1500, () => (step = 'chart')],
				[1000, () => ((step = 'basket'), (sorted = k + 1))]
			);
		});
		steps.push([2400, () => (cur = -1)]);
		return runSeq(steps, true);
	});

	// The optional tricky apple on the last beat.
	$effect(() => {
		if (scene !== LAST || sendRun === 0) return;
		if (reduced) {
			tricky = 'basket';
			return;
		}
		return runSeq([
			[80, () => (tricky = 'enter')],
			[1200, () => (tricky = 'roll')],
			[1500, () => (tricky = 'chart')],
			[0, () => (tricky = 'basket')]
		]);
	});
	function send() {
		tricky = 'off';
		sendRun += 1;
		onstate?.('tricky');
	}

	const onChart = $derived(scene >= 3);

	type Pos = { x: number; y: number; o: number; rot: number; snap?: boolean; d?: number };
	function examplePos(f: Fruit, k: number): Pos {
		if (scene === 0) return { x: f.slot[0], y: f.slot[1] - 80, o: 0, rot: 0, snap: true };
		if (onChart)
			return {
				x: X(f.c),
				y: Y(f.s),
				o: scene >= 4 ? 0.6 : 1,
				rot: 0,
				d: scene === 3 ? k * 140 : 0
			};
		if (scene === 1 && k >= dropped) return { x: f.slot[0], y: f.slot[1] - 90, o: 0, rot: 0 };
		return { x: f.slot[0], y: f.slot[1], o: 1, rot: 0 };
	}
	function travel(f: Fruit, at: 'off' | 'enter' | 'roll' | 'chart' | 'basket'): Pos {
		if (at === 'off') return { x: OFF[0], y: OFF[1], o: 0, rot: 0, snap: true };
		if (at === 'enter') return { x: OFF[0], y: OFF[1], o: 1, rot: 0, snap: true };
		if (at === 'roll') return { x: ENTRY[0], y: ENTRY[1], o: 1, rot: -300 };
		if (at === 'chart') return { x: X(f.c), y: Y(f.s), o: 1, rot: -300 };
		return { x: f.slot[0], y: f.slot[1], o: 1, rot: -300 };
	}
	function newPos(f: Fruit, k: number): Pos {
		if (k === cur) return travel(f, step);
		if (k < sorted) return travel(f, 'basket');
		return travel(f, 'off');
	}
	function rulePos(): Pos {
		if (ruleStep === 'start') return { x: -30, y: ENTRY[1], o: 1, rot: 0, snap: true };
		if (ruleStep === 'mid') return { x: 170, y: ENTRY[1], o: 1, rot: 360 };
		return { x: 245, y: 246, o: 1, rot: 360 };
	}

	function tint(c: number) {
		return `color-mix(in srgb, var(--color-amber) ${Math.round(c * 100)}%, var(--color-danger))`;
	}
	function side(f: Fruit): Kind {
		return 0.56 * (f.c - 0.5) + 0.4 * (f.s - 0.5) < 0 ? 'apple' : 'orange';
	}

	const moving = $derived<Fruit | null>(
		scene === LAST && tricky !== 'off'
			? TRICKY
			: scene >= 4 && cur >= 0 && step !== 'enter'
				? NEW[cur]
				: null
	);
	const movingStep = $derived(scene === LAST && tricky !== 'off' ? tricky : step);
	const caption = $derived.by(() => {
		if (scene === 0) return ruleStep === 'basket' ? { t: tx.ruleWrong, kind: 'bad' } : null;
		if (scene === 2) return { t: tx.rule, kind: 'rule' };
		if (!moving || movingStep === 'enter') return null;
		if (movingStep === 'roll') return { t: tx.incoming, kind: '' };
		const label = side(moving) === 'apple' ? tx.apple : tx.orange;
		return { t: tx.guess.replace('{label}', label), kind: 'good' };
	});
</script>

{#snippet fruit(f: Fruit, p: Pos)}
	<g
		class="fruit"
		class:snap={p.snap || reduced}
		style="transform: translate({p.x}px, {p.y}px); opacity:{p.o}; transition-delay:{p.d ?? 0}ms"
	>
		<g class="spin" class:snap={p.snap || reduced} style="transform: rotate({p.rot}deg)">
			{#if f.kind === 'apple'}
				{@const r = R(f.s)}
				<path
					d="M0 {-0.72 * r} C{0.6 * r} {-1.1 * r} {1.15 * r} {-0.45 * r} {0.95 * r} {0.3 *
						r} C{0.8 * r} {0.9 * r} {0.32 * r} {1.05 * r} 0 {0.86 * r} C{-0.32 * r} {1.05 *
						r} {-0.8 * r} {0.9 * r} {-0.95 * r} {0.3 * r} C{-1.15 * r} {-0.45 * r} {-0.6 *
						r} {-1.1 * r} 0 {-0.72 * r} Z"
					style="fill:{tint(f.c)}"
					class="skin"
				/>
				<path d="M0 {-0.7 * r} Q1 {-1.1 * r} 2.5 {-1.35 * r}" class="stem" />
				<path
					d="M1.5 {-1.05 * r} Q{0.5 * r} {-1.45 * r} {0.75 * r} {-1.05 * r} Q{0.35 * r} {-0.85 *
						r} 1.5 {-1.05 * r} Z"
					class="leaf"
				/>
			{:else}
				{@const r = R(f.s)}
				<circle {r} style="fill:{tint(f.c)}" class="skin" />
				<circle cx={-0.35 * r} cy={-0.3 * r} r="0.9" class="pore" />
				<circle cx={0.3 * r} cy={0.25 * r} r="0.9" class="pore" />
				<circle cx={-0.1 * r} cy={0.45 * r} r="0.9" class="pore" />
				<path
					d="M0 {-r} Q{0.35 * r} {-1.45 * r} {0.7 * r} {-1.15 * r} Q{0.3 * r} {-0.9 * r} 0 {-r} Z"
					class="leaf"
				/>
			{/if}
		</g>
	</g>
{/snippet}

{#snippet basket(cx: number, label: string)}
	<g transform="translate({cx} 272)">
		<path d="M-52 -14 H52 L44 22 H-44 Z" class="basket" />
		<path d="M-49 -2 H49 M-46 10 H46" class="weave" />
		<path d="M-26 -14 L-22 22 M0 -14 V22 M26 -14 L22 22" class="weave" />
		<rect x="-55" y="-17" width="110" height="6" rx="3" class="rim" />
		<text y="40" class="basket-name">{label}</text>
	</g>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === LAST}
					<button type="button" class="act" onclick={send} in:fade={{ duration: 300 }}>
						{tx.trickyBtn}
					</button>
				{/if}
				<div class="card">
					<svg viewBox="0 0 340 320" class="stand" aria-hidden="true">
						<defs>
							<linearGradient id="training-colour" x1="0" x2="1" y1="0" y2="0">
								<stop offset="0" stop-color="var(--color-danger)" />
								<stop offset="1" stop-color="var(--color-amber)" />
							</linearGradient>
						</defs>

						{#if i === 0}
							<g in:fade={{ duration: 300 }}>
								<rect x="44" y="34" width="252" height="112" rx="12" class="note" />
								<text x="64" y="66" class="note-title">{tx.ruleTitle}</text>
								<text x="64" y="98" class="note-line">{tx.ruleLines[0]}</text>
								<text x="64" y="122" class="note-line">{tx.ruleLines[1]}</text>
							</g>
							{#if ruleStep === 'basket'}
								<g class="cross" transform="translate(292 228)" in:fade={{ duration: 250 }}>
									<circle r="11" />
									<path d="M-4.5 -4.5 L4.5 4.5 M4.5 -4.5 L-4.5 4.5" />
								</g>
							{/if}
						{/if}

						{#if onChart}
							<g in:fade={{ duration: 400 }}>
								<polygon
									points="{X(0)},{Y(0)} {X(0)},{Y(1)} {X(B1[0])},{Y(B1[1])} {X(B2[0])},{Y(B2[1])}"
									class="zone apple-zone"
									class:show={!reduced}
								/>
								<polygon
									points="{X(B1[0])},{Y(B1[1])} {X(1)},{Y(1)} {X(1)},{Y(0)} {X(B2[0])},{Y(B2[1])}"
									class="zone orange-zone"
									class:show={!reduced}
								/>
								<path d="M{X(0)} {Y(1)} V{Y(0)} H{X(1)}" class="axis" />
								<rect
									x={X(0)}
									y="186"
									width="250"
									height="5"
									rx="2.5"
									fill="url(#training-colour)"
								/>
								<text x={X(0.5)} y="206" class="axis-name">{tx.axisColour}</text>
								<circle cx="46" cy={Y(0.05)} r="3" class="size-dot" />
								<circle cx="46" cy={Y(0.9)} r="7" class="size-dot" />
								<text x="46" y={Y(0.5) + 4} class="axis-name">{tx.axisSize}</text>
								<line
									x1={X(B1[0])}
									y1={Y(B1[1])}
									x2={X(B2[0])}
									y2={Y(B2[1])}
									pathLength="1"
									class="border"
									class:draw={i === 3 && !reduced}
								/>
							</g>
						{/if}

						{@render basket(105, tx.apple)}
						{@render basket(245, tx.orange)}

						{#each EXAMPLES as f, k (k)}
							{@render fruit(f, examplePos(f, k))}
						{/each}
						{#if i >= 4}
							{#each NEW as f, k (k)}
								{@render fruit(f, newPos(f, k))}
							{/each}
						{/if}
						{#if i === 0}
							{@render fruit(TRICKY, rulePos())}
						{/if}
						{#if i === LAST && tricky !== 'off'}
							{@render fruit(TRICKY, travel(TRICKY, tricky))}
						{/if}
					</svg>
				</div>
				<p class="caption {caption?.kind ?? ''}">
					{#if caption}
						{#key caption.t}
							<span in:fade={{ duration: 250 }}>{caption.t}</span>
						{/key}
					{/if}
				</p>
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
		max-width: 420px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.act:hover {
		transform: translateY(-1px);
	}
	.card {
		width: 100%;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 8px;
	}
	.stand {
		display: block;
		width: 100%;
		height: auto;
	}

	/* fruit */
	.fruit {
		transition:
			transform 1s cubic-bezier(0.35, 0.8, 0.3, 1),
			opacity 0.5s;
	}
	.spin {
		transition: transform 1s cubic-bezier(0.35, 0.8, 0.3, 1);
	}
	.fruit.snap,
	.spin.snap {
		transition: none;
	}
	.skin {
		stroke: color-mix(in srgb, var(--color-ink) 25%, transparent);
		stroke-width: 1;
	}
	.stem {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.4;
		stroke-linecap: round;
	}
	.leaf {
		fill: var(--color-grass);
	}
	.pore {
		fill: color-mix(in srgb, var(--color-ink) 22%, transparent);
	}

	/* baskets */
	.basket {
		fill: color-mix(in srgb, var(--color-amber) 30%, var(--color-card));
		stroke: color-mix(in srgb, var(--color-amber) 70%, var(--color-ink));
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.weave {
		fill: none;
		stroke: color-mix(in srgb, var(--color-amber) 70%, var(--color-ink));
		stroke-width: 1;
		opacity: 0.45;
	}
	.rim {
		fill: color-mix(in srgb, var(--color-amber) 55%, var(--color-card));
		stroke: color-mix(in srgb, var(--color-amber) 70%, var(--color-ink));
		stroke-width: 1.2;
	}
	.basket-name {
		fill: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
	}

	/* the hand written rule */
	.note {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.2;
	}
	.note-title {
		fill: var(--color-amber);
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.note-line {
		fill: var(--color-ink);
		font-size: 14px;
		font-weight: 600;
	}
	.cross circle {
		fill: var(--color-danger);
	}
	.cross path {
		stroke: var(--color-card);
		stroke-width: 2;
		stroke-linecap: round;
	}

	/* the picture of colour and size */
	.axis {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.axis-name {
		fill: var(--color-faint);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.size-dot {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.zone {
		opacity: 1;
	}
	.zone.show {
		opacity: 0;
		animation: zone 0.8s ease forwards 1.8s;
	}
	@keyframes zone {
		to {
			opacity: 1;
		}
	}
	.apple-zone {
		fill: color-mix(in srgb, var(--color-danger) 8%, transparent);
	}
	.orange-zone {
		fill: color-mix(in srgb, var(--color-amber) 10%, transparent);
	}
	.border {
		stroke: var(--color-ink);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1s ease forwards 1.3s;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.caption {
		min-height: 20px;
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.caption.good {
		color: var(--color-brand);
	}
	.caption.bad {
		color: var(--color-danger);
	}
	.caption.rule {
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fruit,
		.spin,
		.act {
			transition: none;
		}
		.zone.show,
		.draw {
			animation: none;
			opacity: 1;
			stroke-dashoffset: 0;
		}
	}
</style>
