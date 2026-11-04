<script lang="ts">
	// A guided "watch" stage. Nim narrates, and a chart of songs (tempo and energy) follows the
	// beats by itself: tagged songs appear, a new song takes the tag of its nearest neighbours
	// (supervised), then the tags fade away and three markers group the songs on their own,
	// grabbing the nearest songs and sliding to the middle until nothing moves (clustering). The
	// only optional play is on the last beat, shuffling the markers and grouping again.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { SupervisedText } from '$lib/chapters/ai/supervised/types';
	import { runSeq, type SeqStep } from './webguide/seq';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as SupervisedText);

	const LAST = 7;
	type P = [number, number]; // [tempo, energy], both 0 to 1
	// Eighteen songs, six chill (slow and calm), six dance (fast), six rock (loud).
	const SONGS: { p: P; tag: number }[] = [
		...(
			[
				[0.15, 0.2],
				[0.22, 0.3],
				[0.12, 0.35],
				[0.28, 0.18],
				[0.2, 0.12],
				[0.3, 0.32]
			] as P[]
		).map((p) => ({ p, tag: 0 })),
		...(
			[
				[0.62, 0.62],
				[0.72, 0.7],
				[0.68, 0.55],
				[0.78, 0.62],
				[0.65, 0.75],
				[0.75, 0.5]
			] as P[]
		).map((p) => ({ p, tag: 1 })),
		...(
			[
				[0.35, 0.85],
				[0.45, 0.9],
				[0.3, 0.78],
				[0.42, 0.75],
				[0.5, 0.82],
				[0.38, 0.95]
			] as P[]
		).map((p) => ({ p, tag: 2 }))
	];
	const NEW_SONGS: P[] = [
		[0.25, 0.25],
		[0.7, 0.64],
		[0.42, 0.84]
	];
	// Starting spots for the three markers. Each one settles on the same three groups.
	const STARTS: P[][] = [
		[
			[0.5, 0.45],
			[0.15, 0.6],
			[0.85, 0.3]
		],
		[
			[0.1, 0.9],
			[0.9, 0.9],
			[0.55, 0.1]
		],
		[
			[0.3, 0.55],
			[0.6, 0.3],
			[0.7, 0.95]
		]
	];
	const TAG_COLOURS = ['var(--color-brand)', 'var(--color-amber)', 'var(--color-danger)'];
	const GROUP_COLOURS = ['var(--color-grass)', 'var(--color-brand)', 'var(--color-amber)'];

	const SX = (t: number) => 40 + t * 280;
	const SY = (e: number) => 240 - e * 220;
	const dist = (a: P, b: P) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;

	/** Every frame of the clustering, from markers dropped in to nothing moving anymore. */
	function cluster(start: P[]) {
		const frames: { c: P[]; a: number[] | null }[] = [{ c: start, a: null }];
		let c = start;
		for (let round = 0; round < 10; round++) {
			const a = SONGS.map(({ p }) => {
				let best = 0;
				c.forEach((q, k) => {
					if (dist(p, q) < dist(p, c[best])) best = k;
				});
				return best;
			});
			frames.push({ c, a });
			const next = c.map((q, k) => {
				const mine = SONGS.filter((_, i) => a[i] === k);
				if (!mine.length) return q;
				return [
					mine.reduce((s, { p }) => s + p[0], 0) / mine.length,
					mine.reduce((s, { p }) => s + p[1], 0) / mine.length
				] as P;
			});
			const moved = next.some((q, k) => dist(q, c[k]) > 1e-9);
			c = next;
			if (!moved) break;
			frames.push({ c, a });
		}
		return frames;
	}
	function nearest3(p: P) {
		return SONGS.map((s, i) => ({ i, d: dist(s.p, p), tag: s.tag }))
			.sort((x, y) => x.d - y.d)
			.slice(0, 3);
	}

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let newIdx = $state(-1); // the new song on the chart right now
	let newStep = $state<'drop' | 'look' | 'tag'>('drop');
	let run = $state(0); // which starting spots the markers use
	let frame = $state(0);
	let shuffles = $state(0);

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
		run = 0;
		shuffles = 0;
	});

	const scene = $derived(peek ?? Math.min(beat, LAST));
	const frames = $derived(cluster(STARTS[run]));
	const labelled = $derived(scene <= 1);

	// Beat 2, new songs arrive one at a time and borrow the tag of their neighbours.
	$effect(() => {
		if (scene !== 1) {
			newIdx = -1;
			return;
		}
		if (reduced) {
			newIdx = 0;
			newStep = 'tag';
			return;
		}
		const steps: SeqStep[] = [];
		NEW_SONGS.forEach((_, k) => {
			steps.push(
				[1200, () => ((newIdx = k), (newStep = 'drop'))],
				[1500, () => (newStep = 'look')],
				[2400, () => (newStep = 'tag')]
			);
		});
		return runSeq(steps, true);
	});

	// Beat 4 (and the shuffle on the last beat), the markers group the songs frame by frame.
	$effect(() => {
		const sc = scene;
		const all = frames.length;
		void shuffles;
		if (sc < 3) {
			frame = 0;
			return;
		}
		const animate = sc === 3 || (sc === LAST && shuffles > 0);
		if (!animate || reduced) {
			frame = all - 1;
			return;
		}
		const steps: SeqStep[] = [[900, () => (frame = 0)]];
		for (let k = 1; k < all; k++) steps.push([1300, () => (frame = k)]);
		if (sc === 3) steps.push([2600, () => {}]);
		return runSeq(steps, sc === 3);
	});

	const current = $derived(frames[Math.min(frame, frames.length - 1)]);
	const settled = $derived(scene >= 4 && frame === frames.length - 1);

	function colourOf(i: number) {
		if (labelled) return TAG_COLOURS[SONGS[i].tag];
		if (scene >= 3 && current.a) return GROUP_COLOURS[current.a[i]];
		return 'var(--color-faint)';
	}

	const newSong = $derived(newIdx >= 0 ? NEW_SONGS[newIdx] : null);
	const near = $derived(newSong ? nearest3(newSong) : []);
	const newTag = $derived.by(() => {
		const count = [0, 0, 0];
		near.forEach((n) => (count[n.tag] += 1));
		return count.indexOf(Math.max(...count));
	});

	function shuffle() {
		run = (run + 1) % STARTS.length;
		shuffles += 1;
		onstate?.('again');
	}
</script>

{#snippet note(x: number, y: number, colour: string, delay = 0)}
	<g transform="translate({x} {y})">
		<g class="note" style="--c:{colour}; transition-delay:{delay}ms">
			<ellipse cx="-2.5" cy="4" rx="4.2" ry="3.1" transform="rotate(-20 -2.5 4)" />
			<path d="M1.2 3.5 V-8 Q5 -6.5 6 -3" class="stem" />
		</g>
	</g>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === LAST}
					<button type="button" class="act" onclick={shuffle} in:fade={{ duration: 300 }}>
						{tx.againBtn}
					</button>
				{/if}
				<div class="card">
					<div class="meta">
						<span class="badge" class:off={!labelled}>
							<svg viewBox="0 0 20 12" aria-hidden="true">
								<circle cx="5" cy="6" r="3.6" />
								<path d="M8.6 6 H18 M15 6 V9.5 M17.5 6 V8.5" />
							</svg>
							{labelled ? tx.withKey : tx.withoutKey}
						</span>
						<span class="legend">
							{#if labelled}
								{#each tx.genres as g, k (g)}
									<span class="chip" style="--c:{TAG_COLOURS[k]}"><i></i>{g}</span>
								{/each}
							{:else if settled}
								{#each [0, 1, 2] as k (k)}
									<span class="chip" style="--c:{GROUP_COLOURS[k]}" in:fade={{ duration: 300 }}>
										<i></i>{tx.groupName.replace('{n}', String(k + 1))}
									</span>
								{/each}
							{/if}
						</span>
					</div>
					<svg viewBox="0 0 340 270" class="chart" aria-hidden="true">
						<path d="M40 20 V240 H320" class="axis" />
						<text x="44" y="16" class="axis-name">{tx.yAxis}</text>
						<text x="320" y="258" class="axis-name" style="text-anchor:end">{tx.xAxis}</text>

						<!-- the lines from each song to the marker that grabbed it -->
						{#if scene >= 3 && current.a && !settled}
							{#each SONGS as s, k (k)}
								{@const q = current.c[current.a[k]]}
								<line
									x1={SX(s.p[0])}
									y1={SY(s.p[1])}
									x2={SX(q[0])}
									y2={SY(q[1])}
									class="grab"
									style="--c:{GROUP_COLOURS[current.a[k]]}"
								/>
							{/each}
						{/if}

						<!-- a new song asks its three nearest neighbours -->
						{#if newSong && newStep !== 'drop'}
							{#each near as n (n.i)}
								<line
									x1={SX(newSong[0])}
									y1={SY(newSong[1])}
									x2={SX(SONGS[n.i].p[0])}
									y2={SY(SONGS[n.i].p[1])}
									pathLength="1"
									class="ask"
									class:draw={!reduced}
								/>
							{/each}
						{/if}

						{#each SONGS as s, k (k)}
							<g class:pop={scene === 0 && !reduced} style="animation-delay:{k * 90}ms">
								{@render note(SX(s.p[0]), SY(s.p[1]), colourOf(k), scene === 2 ? k * 60 : 0)}
							</g>
						{/each}

						{#if newSong}
							{#key newIdx}
								<g class:pop={!reduced}>
									<circle cx={SX(newSong[0])} cy={SY(newSong[1])} r="14" class="halo" />
									{@render note(
										SX(newSong[0]),
										SY(newSong[1]),
										newStep === 'tag' ? TAG_COLOURS[newTag] : 'var(--color-ink)'
									)}
								</g>
							{/key}
						{/if}

						<!-- the three markers -->
						{#if scene >= 3}
							{#each current.c as q, k (k)}
								<g
									class="marker"
									style="transform: translate({SX(q[0])}px, {SY(q[1])}px); --c:{GROUP_COLOURS[k]}"
								>
									<g class:pop={frame === 0 && !reduced}>
										<circle r="13" />
										<path d="M-5 0 H5 M0 -5 V5" />
									</g>
								</g>
							{/each}
						{/if}
					</svg>
				</div>
				<p class="caption" class:rule={i === 5}>
					{#if i === 5}
						<span in:fade={{ duration: 300 }}>{tx.rule}</span>
					{:else if newSong && newStep === 'tag'}
						{#key newIdx}
							<span in:fade={{ duration: 250 }} style="color:{TAG_COLOURS[newTag]}">
								{tx.tagged.replace('{label}', tx.genres[newTag])}
							</span>
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
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px 10px 4px;
	}
	.meta {
		display: flex;
		min-height: 24px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 6px 10px;
		padding: 0 4px;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-grass);
		transition: color 0.4s;
	}
	.badge svg {
		height: 12px;
		width: 20px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.badge.off {
		color: var(--color-faint);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.chip i {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--c);
	}
	.chart {
		display: block;
		width: 100%;
		height: auto;
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

	.note ellipse {
		fill: var(--c);
		transition: fill 0.8s;
		transition-delay: inherit;
	}
	.note .stem {
		fill: none;
		stroke: var(--c);
		stroke-width: 1.6;
		stroke-linecap: round;
		transition: stroke 0.8s;
		transition-delay: inherit;
	}
	.halo {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.2;
		opacity: 0.35;
	}
	.ask {
		stroke: var(--color-ink);
		stroke-width: 1.2;
		opacity: 0.4;
	}
	.grab {
		stroke: var(--c);
		stroke-width: 1;
		opacity: 0.35;
	}
	.marker {
		transition: transform 1s cubic-bezier(0.35, 0.8, 0.3, 1);
	}
	.marker circle {
		fill: color-mix(in srgb, var(--c) 12%, transparent);
		stroke: var(--c);
		stroke-width: 2.2;
	}
	.marker path {
		stroke: var(--c);
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.pop {
		animation: pop 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(-14px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.7s ease forwards;
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
		font-weight: 700;
		color: var(--color-muted);
	}
	.caption.rule {
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.note ellipse,
		.note .stem,
		.marker,
		.badge,
		.act {
			transition: none;
		}
		.pop,
		.draw {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
