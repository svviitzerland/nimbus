<script lang="ts">
	// A guided "watch" stage for computer vision. A simple cat drawing turns into a grid of pixels,
	// then breaks into little coloured edge strokes by itself, then the strokes join into shapes
	// (ears, face, eyes, whiskers), and finally the last layer names it. A remember scene lays the
	// three layers side by side. The only optional play is the last beat, which swaps the drawing
	// for a fish or a house and lets the same layers take it apart again.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import { runSeq } from './webguide/seq';
	import type { StageProps } from '$lib/chapters/types';
	import type { VisionObjectId, VisionText } from '$lib/chapters/ai/vision/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as VisionText);

	// Which scene each beat shows (ten beats, eight scenes).
	const SCENE_OF_BEAT = [0, 1, 1, 2, 3, 4, 5, 6, 6, 7];
	// What the big picture shows on each scene (0 drawing, 1 pixels, 2 edges, 3 shapes, 4 thing).
	const PHASE_OF_SCENE = [0, 1, 2, 3, 4, 4, 4, 4];

	// ---- the drawings, in a 200 by 200 box ----
	type Pt = [number, number];
	type Poly = { pts: Pt[]; closed: boolean };
	type Shape = { polys: Poly[]; label: Pt; look: 'soft' | 'solid' | 'line' };
	const ring = (cx: number, cy: number, rx: number, ry: number, n: number): Poly => ({
		pts: Array.from({ length: n }, (_, k) => {
			const a = (k / n) * Math.PI * 2;
			return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
		}),
		closed: true
	});
	const box = (x1: number, y1: number, x2: number, y2: number): Poly => ({
		pts: [
			[x1, y1],
			[x2, y1],
			[x2, y2],
			[x1, y2]
		],
		closed: true
	});
	const tri = (a: Pt, b: Pt, c: Pt): Poly => ({ pts: [a, b, c], closed: true });
	const seg = (a: Pt, b: Pt): Poly => ({ pts: [a, b], closed: false });

	const DRAWINGS: Record<VisionObjectId, Shape[]> = {
		cat: [
			{
				polys: [tri([60, 82], [68, 32], [96, 66]), tri([104, 66], [132, 32], [140, 82])],
				label: [100, 26],
				look: 'soft'
			},
			{ polys: [ring(100, 114, 50, 48, 20)], label: [100, 182], look: 'soft' },
			{ polys: [ring(80, 104, 6, 6, 8), ring(120, 104, 6, 6, 8)], label: [100, 92], look: 'solid' },
			{
				polys: [
					seg([34, 118], [76, 126]),
					seg([34, 140], [76, 134]),
					seg([124, 126], [166, 118]),
					seg([124, 134], [166, 140])
				],
				label: [100, 150],
				look: 'line'
			}
		],
		fish: [
			{ polys: [ring(86, 108, 56, 32, 20)], label: [80, 158], look: 'soft' },
			{ polys: [tri([138, 108], [184, 74], [184, 142])], label: [168, 160], look: 'soft' },
			{ polys: [ring(56, 100, 6, 6, 8)], label: [56, 124], look: 'solid' },
			{ polys: [tri([74, 80], [98, 50], [110, 78])], label: [100, 40], look: 'soft' }
		],
		house: [
			{ polys: [box(52, 98, 148, 170)], label: [100, 188], look: 'soft' },
			{ polys: [tri([36, 100], [100, 40], [164, 100])], label: [100, 30], look: 'soft' },
			{ polys: [box(88, 130, 112, 170)], label: [100, 152], look: 'solid' },
			{ polys: [box(62, 112, 80, 128), box(120, 112, 138, 128)], label: [100, 122], look: 'line' }
		]
	};
	const OBJECTS: VisionObjectId[] = ['cat', 'fish', 'house'];

	const sides = (p: Poly): [Pt, Pt][] => {
		const out: [Pt, Pt][] = [];
		const n = p.pts.length;
		for (let k = 0; k < (p.closed ? n : n - 1); k++) out.push([p.pts[k], p.pts[(k + 1) % n]]);
		return out;
	};
	const pathOf = (p: Poly) =>
		`M${p.pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')}${p.closed ? ' Z' : ''}`;

	// Layer 1, the drawing broken into short strokes, each tagged by its direction.
	type Piece = { x1: number; y1: number; x2: number; y2: number; dir: 0 | 1 | 2; order: number };
	function piecesOf(shapes: Shape[]): Piece[] {
		const out: Piece[] = [];
		for (const sh of shapes)
			for (const p of sh.polys)
				for (const [a, b] of sides(p)) {
					const dx = b[0] - a[0];
					const dy = b[1] - a[1];
					const n = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 16));
					const deg = (Math.atan2(Math.abs(dy), Math.abs(dx)) * 180) / Math.PI;
					const dir = deg < 25 ? 0 : deg > 65 ? 1 : 2;
					for (let k = 0; k < n; k++) {
						out.push({
							x1: a[0] + (dx * k) / n,
							y1: a[1] + (dy * k) / n,
							x2: a[0] + (dx * (k + 1)) / n,
							y2: a[1] + (dy * (k + 1)) / n,
							dir,
							order: 0
						});
					}
				}
		// A gentle scattered order, so the strokes pop up all over the picture.
		out.forEach((p, k) => (p.order = (k * 37) % out.length));
		return out;
	}

	// The pixel grid, 20 by 20 squares of 10 units. A square is dark when a line passes through it.
	function pixelsOf(shapes: Shape[]): Pt[] {
		const segs = shapes.flatMap((sh) => sh.polys.flatMap(sides));
		const near = (px: number, py: number) =>
			segs.some(([a, b]) => {
				const dx = b[0] - a[0];
				const dy = b[1] - a[1];
				const l2 = dx * dx + dy * dy || 1;
				const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / l2));
				return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy)) < 6;
			});
		const out: Pt[] = [];
		for (let r = 0; r < 20; r++)
			for (let c = 0; c < 20; c++) if (near(c * 10 + 5, r * 10 + 5)) out.push([c * 10, r * 10]);
		return out;
	}

	const PIECES: Record<VisionObjectId, Piece[]> = {
		cat: piecesOf(DRAWINGS.cat),
		fish: piecesOf(DRAWINGS.fish),
		house: piecesOf(DRAWINGS.house)
	};
	const PIXELS: Record<VisionObjectId, Pt[]> = {
		cat: pixelsOf(DRAWINGS.cat),
		fish: pixelsOf(DRAWINGS.fish),
		house: pixelsOf(DRAWINGS.house)
	};
	const GRID = Array.from({ length: 21 }, (_, k) => k * 10);
	const DIR_CLASS = ['flat', 'upright', 'slant'];

	// ---- state ----
	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let picked = $state(0); // the drawing on the try it scene
	let tryPhase = $state(0);

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const obj = $derived<VisionObjectId>(scene === 7 ? OBJECTS[picked] : 'cat');
	const phase = $derived(scene === 7 ? tryPhase : PHASE_OF_SCENE[scene]);
	const info = $derived(tx.objects[obj]);
	const slow = $derived(reduced ? 0 : 1);
	const pieceGap = $derived(scene === 7 ? 18 : 40);

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

	// On the try it scene the new drawing walks through every layer by itself.
	$effect(() => {
		if (scene !== 7) return;
		void picked;
		if (reduced) {
			tryPhase = 4;
			return;
		}
		return runSeq([
			[1300, () => (tryPhase = 0)],
			[1800, () => (tryPhase = 1)],
			[2400, () => (tryPhase = 2)],
			[2600, () => (tryPhase = 3)],
			[0, () => (tryPhase = 4)]
		]);
	});

	function another() {
		picked = (picked + 1) % OBJECTS.length;
		onstate?.(OBJECTS[picked]);
	}
</script>

{#snippet drawing(o: VisionObjectId, ph: number, animate: boolean, labels: boolean)}
	{@const sh = DRAWINGS[o]}
	<!-- the plain drawing -->
	<g class="layer" style="opacity: {ph === 0 ? 1 : 0}">
		{#each sh as s, k (k)}
			{#each s.polys as p, j (j)}
				<path d={pathOf(p)} class="art {s.look}" />
			{/each}
		{/each}
	</g>

	<!-- the pixels a computer gets -->
	<g class="layer" style="opacity: {ph === 1 ? 1 : ph === 2 ? 0.16 : 0}">
		{#each PIXELS[o] as [x, y] (`${x},${y}`)}
			<rect {x} {y} width="10" height="10" class="px" />
		{/each}
		{#if ph === 1}
			{#each GRID as g (g)}
				<line x1={g} y1="0" x2={g} y2="200" class="grid" />
				<line x1="0" y1={g} x2="200" y2={g} class="grid" />
			{/each}
		{/if}
	</g>

	<!-- layer 1, edges -->
	{#if ph === 2 || ph === 3}
		<g class="layer" class:muted={ph === 3}>
			{#each PIECES[o] as p, k (k)}
				<line
					x1={p.x1}
					y1={p.y1}
					x2={p.x2}
					y2={p.y2}
					class="piece {DIR_CLASS[p.dir]}"
					class:pop={animate && ph === 2}
					style="animation-delay: {p.order * pieceGap * slow}ms"
				/>
			{/each}
		</g>
	{/if}

	<!-- layer 2 and 3, shapes and the thing -->
	{#if ph >= 3}
		{#each sh as s, k (k)}
			<g class:pop={animate && ph === 3} style="animation-delay: {(400 + k * 650) * slow}ms">
				{#each s.polys as p, j (j)}
					<path d={pathOf(p)} class="shape" class:whole={ph === 4} />
				{/each}
				{#if labels && ph === 3}
					<text x={s.label[0]} y={s.label[1]} class="part" text-anchor="middle"
						>{tx.objects[o].parts[k]}</text
					>
				{/if}
			</g>
		{/each}
	{/if}
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 7}
					<button type="button" class="try" onclick={another} in:fade={{ duration: 250 }}
						>{tx.another}</button
					>
				{/if}

				{#if s === 5}
					<div class="ladder" in:fade={{ duration: 300 }}>
						{#each [2, 3, 4] as ph, k (ph)}
							{#if k > 0}
								<svg viewBox="0 0 12 20" class="chev" aria-hidden="true">
									<polyline points="3,4 9,10 3,16" />
								</svg>
							{/if}
							<figure>
								<svg viewBox="-20 0 240 200" class="mini" aria-hidden="true">
									{@render drawing('cat', ph, false, false)}
								</svg>
								<figcaption>{tx.layers[k]}</figcaption>
							</figure>
						{/each}
					</div>
					<p class="rule">{tx.rule}</p>
				{:else}
					<div class="frame">
						{#key `${obj}-${phase}`}
							<svg
								viewBox="-20 0 240 200"
								class="pic"
								role="img"
								aria-label={tx.panels[s].title}
								in:fade={{ duration: reduced ? 0 : 350 }}
							>
								{@render drawing(obj, phase, true, true)}
							</svg>
						{/key}
					</div>

					{#if phase === 2}
						<div class="legend" in:fade={{ duration: 300 }}>
							{#each tx.edges as name, k (k)}
								<span><i class={DIR_CLASS[k]}></i>{name}</span>
							{/each}
						</div>
					{:else if phase === 4}
						{#key obj}
							<p class="answer" in:fade={{ duration: 400 }}>
								{tx.guess.replace('{x}', info.name)}
							</p>
						{/key}
					{:else}
						<p class="spacer"></p>
					{/if}
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
		max-width: 420px;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
	}
	.try {
		align-self: center;
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.try:hover {
		transform: translateY(-1px);
	}
	.frame {
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px;
	}
	.pic {
		display: block;
		width: 100%;
		max-width: 340px;
		height: auto;
		margin: 0 auto;
	}
	.layer {
		transition: opacity 0.6s;
	}

	.art {
		stroke: var(--color-ink);
		stroke-width: 3;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.art.soft {
		fill: var(--color-amber-soft);
	}
	.art.solid {
		fill: var(--color-ink);
	}
	.art.line {
		fill: none;
	}
	.px {
		fill: var(--color-ink);
	}
	.grid {
		stroke: var(--color-line);
		stroke-width: 0.6;
	}

	.piece {
		stroke-width: 4;
		stroke-linecap: round;
	}
	.piece.flat {
		stroke: var(--color-brand);
	}
	.piece.upright {
		stroke: var(--color-grass);
	}
	.piece.slant {
		stroke: var(--color-amber);
	}
	.muted .piece {
		stroke: var(--color-line);
	}

	.shape {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.shape.whole {
		fill: var(--color-brand-soft);
	}
	.part {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
		paint-order: stroke;
		stroke: var(--color-card);
		stroke-width: 4px;
		stroke-linejoin: round;
	}

	.pop {
		animation: pop 0.45s ease-out both;
	}
	@keyframes pop {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.legend {
		display: flex;
		justify-content: center;
		gap: 16px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.legend i {
		display: inline-block;
		height: 4px;
		width: 16px;
		border-radius: 999px;
	}
	.legend i.flat {
		background: var(--color-brand);
	}
	.legend i.upright {
		background: var(--color-grass);
	}
	.legend i.slant {
		background: var(--color-amber);
	}
	.answer {
		margin: 0;
		align-self: center;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 6px 16px;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.spacer {
		margin: 0;
		min-height: 1.6em;
	}

	.ladder {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
	}
	figure {
		margin: 0;
		flex: 1;
		min-width: 0;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 6px 4px 8px;
		text-align: center;
	}
	.mini {
		display: block;
		width: 100%;
		height: auto;
	}
	figcaption {
		margin-top: 2px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chev {
		flex: none;
		width: 12px;
		height: 20px;
	}
	.chev polyline {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.rule {
		margin: 4px 0 0;
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
		.layer {
			transition: none;
		}
		.pop {
			animation: none;
		}
	}
</style>
