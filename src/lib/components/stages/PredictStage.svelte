<script lang="ts">
	// A guided "watch" stage. Nim narrates, and the pictures follow the beats by themselves:
	// sold houses drop onto a size and price chart, a line tilts until it fits them (regression),
	// a new house reads its price off the line, then emails land in a spam zone or a safe zone
	// (classification). The memory beats show both side by side. The only optional play is on the
	// last beat, a slider for the size of the new house.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { PredictText } from '$lib/chapters/ai/predict/types';
	import { runSeq, type SeqStep } from './webguide/seq';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as PredictText);

	const LAST = 6;

	// Houses that were sold, [size in m², price].
	const HOUSES: [number, number][] = [
		[45, 330],
		[58, 450],
		[70, 520],
		[82, 610],
		[95, 640],
		[108, 780],
		[120, 800],
		[134, 930],
		[148, 1010]
	];
	// The best straight line, worked out once (least squares).
	const MX = HOUSES.reduce((a, [s]) => a + s, 0) / HOUSES.length;
	const MY = HOUSES.reduce((a, [, p]) => a + p, 0) / HOUSES.length;
	const SLOPE =
		HOUSES.reduce((a, [s, p]) => a + (s - MX) * (p - MY), 0) /
		HOUSES.reduce((a, [s]) => a + (s - MX) ** 2, 0);
	// Chart coordinates, size 40 to 160 left to right, price 200 to 1400 bottom to top.
	const PX = (size: number) => 70 + ((size - 40) / 120) * 250;
	const PY = (price: number) => 210 - ((price - 200) / 1200) * 190;
	// Email chart, links 0 to 10 left to right, exclamation marks 0 to 10 bottom to top.
	const EX = (v: number) => 70 + v * 25;
	const EY = (v: number) => 210 - v * 19;

	type Mail = [links: number, marks: number];
	const MAILS: Mail[] = [
		[1, 1],
		[2, 3.5],
		[3.5, 1.5],
		[1, 5],
		[4.5, 3],
		[7, 8],
		[8.5, 6],
		[6, 8.5],
		[9, 9],
		[8.5, 3.5]
	];
	const NEW_MAILS: Mail[] = [
		[2.5, 2],
		[7.5, 7.5],
		[3, 5.5],
		[8, 4.5]
	];
	const isSpam = ([l, m]: Mail) => l + m > 10;
	// The tilting line, as multiples of the final slope (it swings, then settles).
	const SWING = [0, 1.9, 0.4, 1.3, 0.85, 1.05, 1];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let shown = $state(HOUSES.length); // houses on the chart
	let mult = $state(1); // how far the line has tilted towards the best fit
	let landed = $state(NEW_MAILS.length); // new emails that already landed
	let size = $state(100); // the new house
	let asked = $state(false);

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
		size = 100;
		asked = false;
	});

	const scene = $derived(peek ?? Math.min(beat, LAST));

	// Beat 1, the houses drop in one by one.
	$effect(() => {
		if (scene !== 0 || reduced) {
			shown = HOUSES.length;
			return;
		}
		shown = 0;
		const t = setInterval(() => {
			shown += 1;
			if (shown >= HOUSES.length) clearInterval(t);
		}, 420);
		return () => clearInterval(t);
	});

	// Beat 2, the line swings and settles, then does it again after a pause.
	$effect(() => {
		if (scene !== 1 || reduced) {
			mult = scene === 0 ? 0 : 1;
			return;
		}
		let raf = 0;
		let start = 0;
		const SWING_MS = 4600;
		const HOLD_MS = 2600;
		const frame = (now: number) => {
			if (!start) start = now;
			const t = (now - start) % (SWING_MS + HOLD_MS);
			if (t >= SWING_MS) mult = 1;
			else {
				const pos = (t / SWING_MS) * (SWING.length - 1);
				const k = Math.floor(pos);
				const f = pos - k;
				const e = f * f * (3 - 2 * f);
				mult = SWING[k] + (SWING[k + 1] - SWING[k]) * e;
			}
			raf = requestAnimationFrame(frame);
		};
		raf = requestAnimationFrame(frame);
		return () => cancelAnimationFrame(raf);
	});

	// Beat 4, new emails drop in and land in a zone, in a gentle loop.
	$effect(() => {
		if (scene !== 3 || reduced) {
			landed = NEW_MAILS.length;
			return;
		}
		const steps: SeqStep[] = [[900, () => (landed = 0)]];
		NEW_MAILS.forEach((_, k) => steps.push([1700, () => (landed = k + 1)]));
		steps.push([2200, () => {}]);
		return runSeq(steps, true);
	});

	const lineY = (s: number) => MY + SLOPE * mult * (s - MX);
	const priceOf = (s: number) => MY + SLOPE * (s - MX);
	const fmtPrice = (p: number) => tx.price.replace('{p}', String(Math.round(p / 10) * 10));

	function onSlide() {
		if (!asked) {
			asked = true;
			onstate?.('ask');
		}
	}
</script>

{#snippet house(x: number, y: number, fresh = false)}
	<g transform="translate({x} {y})">
		<path d="M-6.5 1 L0 -5.5 L6.5 1 V6.5 H-6.5 Z" class="house" class:fresh />
		<rect x="-1.6" y="2" width="3.2" height="4.5" class="door" class:fresh />
	</g>
{/snippet}

{#snippet mail(x: number, y: number, kind: 'spam' | 'ham' | 'new')}
	<g transform="translate({x} {y})" class="mail {kind}">
		<rect x="-7.5" y="-5.5" width="15" height="11" rx="1.8" />
		<path d="M-7.5 -4.5 L0 1 L7.5 -4.5" />
	</g>
{/snippet}

{#snippet regression(mini: boolean, guide: 'none' | 'draw' | 'live')}
	<svg viewBox="0 0 340 250" class="chart" aria-hidden="true">
		<defs>
			<clipPath id={mini ? 'predict-plot-mini' : 'predict-plot'}>
				<rect x="64" y="14" width="262" height="202" />
			</clipPath>
		</defs>
		<path d="M70 14 V210 H324" class="axis" />
		{#if !mini}
			<text x="70" y="8" class="axis-name" style="text-anchor:middle">{tx.regY}</text>
			<text x="322" y="232" class="axis-name" style="text-anchor:end">{tx.regX}</text>
		{/if}

		{#if scene >= 1}
			<g clip-path="url(#{mini ? 'predict-plot-mini' : 'predict-plot'})">
				{#if scene === 1}
					{#each HOUSES as [s, p] (s)}
						<line x1={PX(s)} y1={PY(p)} x2={PX(s)} y2={PY(lineY(s))} class="gap" />
					{/each}
				{/if}
				<line x1={PX(30)} y1={PY(lineY(30))} x2={PX(170)} y2={PY(lineY(170))} class="fit" />
			</g>
		{/if}

		{#each HOUSES.slice(0, shown) as [s, p] (s)}
			<g class:drop={scene === 0 && !reduced}>{@render house(PX(s), PY(p))}</g>
		{/each}

		{#if guide !== 'none'}
			{@const p = priceOf(size)}
			{#key guide === 'draw' ? scene : 0}
				<g class:guides-draw={guide === 'draw' && !reduced}>
					<line x1={PX(size)} y1="210" x2={PX(size)} y2={PY(p)} pathLength="1" class="guide up" />
					<line x1={PX(size)} y1={PY(p)} x2="70" y2={PY(p)} pathLength="1" class="guide across" />
					<g class="tag">
						<rect x={mini ? 6 : 2} y={PY(p) - 11} width={mini ? 62 : 66} height="22" rx="11" />
						<text x={mini ? 37 : 35} y={PY(p) + 4}>{fmtPrice(p)}</text>
					</g>
				</g>
			{/key}
			{@render house(PX(size), 210, true)}
			{#if !mini}
				<text x={PX(size)} y="230" class="size-name">{tx.size.replace('{n}', String(size))}</text>
			{/if}
		{/if}
	</svg>
{/snippet}

{#snippet classification(mini: boolean, count: number)}
	<svg viewBox="0 0 340 250" class="chart" aria-hidden="true">
		<polygon points="{EX(0)},{EY(0)} {EX(0)},{EY(10)} {EX(10)},{EY(0)}" class="zone ham" />
		<polygon points="{EX(0)},{EY(10)} {EX(10)},{EY(10)} {EX(10)},{EY(0)}" class="zone spam" />
		<line x1={EX(0)} y1={EY(10)} x2={EX(10)} y2={EY(0)} class="border" />
		<path d="M70 14 V210 H324" class="axis" />
		{#if !mini}
			<text x="70" y="8" class="axis-name" style="text-anchor:start">{tx.clsY}</text>
			<text x="322" y="232" class="axis-name" style="text-anchor:end">{tx.clsX}</text>
		{/if}
		<!-- right of the low left mails, so no envelope sits on the name -->
		<text x={EX(4.6)} y={EY(0.4)} class="zone-name ham">{tx.ham}</text>
		<text x={EX(8.8)} y={EY(9.5)} class="zone-name spam" style="text-anchor:end">{tx.spam}</text>

		{#each MAILS as m, k (k)}
			{@render mail(EX(m[0]), EY(m[1]), isSpam(m) ? 'spam' : 'ham')}
		{/each}
		{#each NEW_MAILS.slice(0, count) as m, k (k)}
			<g class:drop={!reduced && !mini}>
				<g class="ring-new">
					<circle cx={EX(m[0])} cy={EY(m[1])} r="12" />
				</g>
				{@render mail(EX(m[0]), EY(m[1]), 'new')}
				<!-- the first new email has neighbours on its right, so its tag goes underneath -->
				<text
					x={k === 0 ? EX(m[0]) + 6 : EX(m[0]) + 16}
					y={k === 0 ? EY(m[1]) + 26 : EY(m[1]) + 4}
					style={k === 0 ? 'text-anchor:middle' : undefined}
					class="mail-tag {isSpam(m) ? 'spam' : 'ham'}"
					in:fade={{ duration: reduced ? 0 : 300, delay: reduced || mini ? 0 : 700 }}
					>{isSpam(m) ? tx.spam : tx.ham}</text
				>
			</g>
		{/each}
	</svg>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === LAST}
					<label class="slider" in:fade={{ duration: 300 }}>
						<span>{tx.slider}</span>
						<input
							type="range"
							min="45"
							max="155"
							step="5"
							bind:value={size}
							onchange={onSlide}
							aria-label={tx.slider}
						/>
					</label>
				{/if}
				{#if i === 4 || i === 5}
					<div class="pair" in:fade={{ duration: 300 }}>
						<figure>
							<div class="card">{@render regression(true, 'live')}</div>
							<figcaption>{tx.answerNumber}</figcaption>
						</figure>
						<figure>
							<div class="card">{@render classification(true, 1)}</div>
							<figcaption>{tx.answerGroup}</figcaption>
						</figure>
					</div>
					{#if i === 4}
						<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
					{/if}
				{:else if i === 3}
					<div class="card" in:fade={{ duration: 300 }}>
						{@render classification(false, landed)}
					</div>
				{:else}
					<div class="card" in:fade={{ duration: 300 }}>
						{@render regression(false, i === 2 ? 'draw' : i === LAST ? 'live' : 'none')}
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
		padding: 8px 8px 4px;
	}
	.chart {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.pair {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.pair figure {
		margin: 0;
	}
	.pair figcaption {
		margin-top: 6px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.slider {
		display: flex;
		width: 100%;
		max-width: 320px;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.slider input {
		flex: 1;
		accent-color: var(--color-brand);
	}

	.axis {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.axis-name {
		fill: var(--color-faint);
		font-size: 11px;
		font-weight: 700;
	}
	.house {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.4;
		stroke-linejoin: round;
	}
	.door {
		fill: var(--color-brand);
	}
	.house.fresh {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.door.fresh {
		fill: var(--color-amber);
	}
	.size-name {
		fill: var(--color-amber);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.drop {
		animation: drop 0.6s cubic-bezier(0.3, 1.3, 0.5, 1) both;
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-22px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.fit {
		stroke: var(--color-ink);
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.gap {
		stroke: var(--color-danger);
		stroke-width: 1.4;
		opacity: 0.55;
	}
	.guide {
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.guides-draw .guide {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.8s ease forwards;
	}
	.guides-draw .up {
		animation-delay: 0.6s;
	}
	.guides-draw .across {
		animation-delay: 1.4s;
	}
	.guides-draw .tag {
		opacity: 0;
		animation: show 0.4s ease forwards 2.2s;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes show {
		to {
			opacity: 1;
		}
	}
	.tag rect {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.4;
	}
	.tag text {
		fill: var(--color-ink);
		font-size: 11.5px;
		font-weight: 800;
		text-anchor: middle;
	}

	.zone.ham {
		fill: color-mix(in srgb, var(--color-grass) 9%, transparent);
	}
	.zone.spam {
		fill: color-mix(in srgb, var(--color-danger) 9%, transparent);
	}
	.border {
		stroke: var(--color-ink);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.zone-name {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.zone-name.ham,
	.mail-tag.ham {
		fill: var(--color-grass);
	}
	.zone-name.spam,
	.mail-tag.spam {
		fill: var(--color-danger);
	}
	.mail rect {
		stroke-width: 1.3;
	}
	.mail path {
		fill: none;
		stroke-width: 1.2;
		stroke-linejoin: round;
	}
	.mail.ham rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.mail.ham path {
		stroke: var(--color-grass);
	}
	.mail.spam rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.mail.spam path {
		stroke: var(--color-danger);
	}
	.mail.new rect {
		fill: var(--color-card);
		stroke: var(--color-ink);
	}
	.mail.new path {
		stroke: var(--color-ink);
	}
	.ring-new circle {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.mail-tag {
		font-size: 11px;
		font-weight: 800;
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
		.guides-draw .guide,
		.guides-draw .tag {
			animation: none;
			opacity: 1;
			stroke-dashoffset: 0;
		}
	}
</style>
