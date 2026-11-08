<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { EmbedWord, EmbeddingsText } from '$lib/chapters/ai/embeddings/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as EmbeddingsText);

	type Group = 'animal' | 'royal' | 'food' | 'tech';
	type Pt = { x: number; y: number };

	// ---- the map (SVG viewBox 320 x 272), the meaning area on top and the shelf below ----
	const W = 320;
	const MAP_H = 220;
	const H = 272;
	const SHELF_Y = 250;

	/** Words with a fixed home, as if a model already learned their numbers. */
	const FIXED: { id: EmbedWord; g: Group; x: number; y: number }[] = [
		{ id: 'cat', g: 'animal', x: 58, y: 50 },
		{ id: 'dog', g: 'animal', x: 104, y: 36 },
		{ id: 'rabbit', g: 'animal', x: 56, y: 92 },
		{ id: 'king', g: 'royal', x: 228, y: 40 },
		{ id: 'prince', g: 'royal', x: 272, y: 72 },
		{ id: 'palace', g: 'royal', x: 222, y: 98 },
		{ id: 'rice', g: 'food', x: 52, y: 156 },
		{ id: 'soup', g: 'food', x: 108, y: 146 },
		{ id: 'bread', g: 'food', x: 84, y: 194 },
		{ id: 'website', g: 'tech', x: 246, y: 134 },
		{ id: 'server', g: 'tech', x: 214, y: 172 },
		{ id: 'cloud', g: 'tech', x: 272, y: 194 }
	];
	/** Words the learner places, with the family they truly belong to. */
	const LOOSE: { id: EmbedWord; g: Group; x: number }[] = [
		{ id: 'queen', g: 'royal', x: 46 },
		{ id: 'nimbus', g: 'tech', x: 126 },
		{ id: 'puppy', g: 'animal', x: 206 },
		{ id: 'noodles', g: 'food', x: 278 }
	];
	const groupOf = (id: EmbedWord) =>
		(FIXED.find((f) => f.id === id) ?? LOOSE.find((l) => l.id === id))!.g;
	const isLoose = (id: EmbedWord) => LOOSE.some((l) => l.id === id);

	let pos = $state<Record<string, Pt>>(
		Object.fromEntries(LOOSE.map((l) => [l.id, { x: l.x, y: SHELF_Y }]))
	);
	let active = $state<EmbedWord | null>(null);
	let drag = $state<{ id: EmbedWord; dx: number; dy: number } | null>(null);
	const announced: EmbedWord[] = [];
	let saidSelect = false;
	let done = false;
	let svgEl: SVGSVGElement | undefined = $state();
	let keyTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => () => clearTimeout(keyTimer));

	const where = (id: EmbedWord): Pt => pos[id] ?? FIXED.find((f) => f.id === id)!;
	const onMap = (id: EmbedWord) => where(id).y < MAP_H;
	const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
	const closeness = (d: number) => Math.max(0, Math.round(100 * (1 - d / 260)));

	const allIds = $derived([...FIXED.map((f) => f.id), ...LOOSE.map((l) => l.id)]);

	/** The three closest words on the map to the active one. */
	const near = $derived.by(() => {
		if (!active || !onMap(active)) return [];
		const me = where(active);
		return allIds
			.filter((id) => id !== active && onMap(id))
			.map((id) => ({ id, d: dist(me, where(id)) }))
			.sort((a, b) => a.d - b.d)
			.slice(0, 3);
	});

	function settled(id: EmbedWord) {
		if (!onMap(id)) return false;
		const me = where(id);
		let best = FIXED[0];
		for (const f of FIXED) if (dist(me, f) < dist(me, best)) best = f;
		return best.g === groupOf(id) && dist(me, best) < 78;
	}
	const placedCount = $derived(LOOSE.filter((l) => settled(l.id)).length);

	function width(id: EmbedWord) {
		return tx.words[id].length * 6.1 + 16;
	}
	const vec = (p: Pt) => `[${(p.x / W).toFixed(2)}, ${(1 - p.y / MAP_H).toFixed(2)}]`;

	function select(id: EmbedWord) {
		active = id;
		if (!saidSelect && onMap(id)) {
			saidSelect = true;
			onstate?.('select');
		}
	}

	function check(id: EmbedWord) {
		if (!onMap(id)) return;
		if (settled(id)) {
			if (LOOSE.every((l) => settled(l.id))) {
				if (!done) {
					done = true;
					onstate?.('all');
					oncomplete?.();
				}
			} else if (!announced.includes(id)) {
				announced.push(id);
				onstate?.(id);
			}
		} else {
			onstate?.('wrong');
		}
	}

	function toSvg(e: PointerEvent): Pt {
		const m = svgEl?.getScreenCTM();
		if (!m) return { x: 0, y: 0 };
		const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
		return { x: p.x, y: p.y };
	}
	const clampPt = (p: Pt, id: EmbedWord): Pt => {
		const half = width(id) / 2;
		return {
			x: Math.max(half, Math.min(W - half, p.x)),
			y: Math.max(12, Math.min(H - 12, p.y))
		};
	};

	function down(e: PointerEvent, id: EmbedWord) {
		select(id);
		if (!isLoose(id)) return;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
		const p = toSvg(e);
		drag = { id, dx: pos[id].x - p.x, dy: pos[id].y - p.y };
	}
	function move(e: PointerEvent) {
		if (!drag) return;
		const p = toSvg(e);
		pos[drag.id] = clampPt({ x: p.x + drag.dx, y: p.y + drag.dy }, drag.id);
	}
	function up() {
		if (!drag) return;
		const id = drag.id;
		drag = null;
		check(id);
	}

	function key(e: KeyboardEvent, id: EmbedWord) {
		const steps: Record<string, Pt> = {
			ArrowLeft: { x: -8, y: 0 },
			ArrowRight: { x: 8, y: 0 },
			ArrowUp: { x: 0, y: -8 },
			ArrowDown: { x: 0, y: 8 }
		};
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			select(id);
			return;
		}
		const s = steps[e.key];
		if (!s || !isLoose(id)) return;
		e.preventDefault();
		active = id;
		// a word lifted off the shelf by keyboard jumps to the middle of the map first
		const from = onMap(id) ? pos[id] : { x: W / 2, y: MAP_H / 2 + 8 };
		pos[id] = clampPt({ x: from.x + s.x, y: from.y + s.y }, id);
		clearTimeout(keyTimer);
		keyTimer = setTimeout(() => check(id), 600);
	}
</script>

<div class="stage">
	<!-- the selected word's numbers and its nearest neighbours -->
	<div class="panel" aria-live="polite">
		{#if active && onMap(active)}
			<span class="vec">
				{tx.vectorLabel.replace('{word}', tx.words[active])}
				<code>{vec(where(active))}</code>
			</span>
			<span class="ntitle">{tx.nearTitle.replace('{word}', tx.words[active])}</span>
			<div class="nlist">
				{#each near as n (n.id)}
					<span class="nb">
						<b>{tx.words[n.id]}</b>
						<small>{tx.closeness.replace('{n}', String(closeness(n.d)))}</small>
					</span>
				{/each}
			</div>
		{:else}
			<span class="hint">{tx.pickHint}</span>
		{/if}
	</div>
	<span class="count" class:full={placedCount === 4}
		>{tx.placed.replace('{n}', String(placedCount))}</span
	>

	<svg
		bind:this={svgEl}
		class="map"
		class:dragging={drag !== null}
		viewBox="0 0 {W} {H}"
		role="group"
		aria-label={tx.mapLabel}
		onpointermove={move}
		onpointerup={up}
		onpointercancel={up}
	>
		<rect class="area" x="0.75" y="0.75" width={W - 1.5} height={MAP_H - 1.5} rx="14" />
		{#each [1, 2, 3] as i (i)}
			<line class="grid" x1={(W / 4) * i} y1="8" x2={(W / 4) * i} y2={MAP_H - 8} />
		{/each}
		{#each [1, 2] as i (i)}
			<line class="grid" x1="8" y1={(MAP_H / 3) * i} x2={W - 8} y2={(MAP_H / 3) * i} />
		{/each}

		<rect class="shelf" x="0.75" y={MAP_H + 8} width={W - 1.5} height={H - MAP_H - 9} rx="12" />
		<text class="slabel" x={W / 2} y={MAP_H + 20}>{tx.shelf}</text>

		<!-- neighbour lines from the active word -->
		{#if active && onMap(active)}
			{@const me = where(active)}
			{#each near as n (n.id)}
				{@const p = where(n.id)}
				<line
					class="nline"
					x1={me.x}
					y1={me.y}
					x2={p.x}
					y2={p.y}
					opacity={0.25 + 0.75 * (closeness(n.d) / 100)}
				/>
			{/each}
		{/if}

		{#each allIds as id (id)}
			{@const p = where(id)}
			{@const w = width(id)}
			{@const loose = isLoose(id)}
			<g
				class="word"
				class:loose
				class:home={loose && settled(id)}
				class:active={active === id}
				class:lifted={drag?.id === id}
				transform="translate({p.x} {p.y})"
				role="button"
				tabindex="0"
				aria-label={tx.words[id]}
				onpointerdown={(e) => down(e, id)}
				onkeydown={(e) => key(e, id)}
			>
				<rect x={-w / 2} y="-10.5" width={w} height="21" rx="10.5" />
				<text y="3.8">{tx.words[id]}</text>
			</g>
		{/each}
	</svg>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		width: 100%;
		max-width: 360px;
		min-height: 74px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
	}
	.hint {
		font-size: 12px;
		color: var(--color-faint);
		text-align: center;
	}
	.vec {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.vec code {
		border-radius: 6px;
		background: var(--color-brand-soft);
		padding: 1px 6px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-brand);
		font-variant-numeric: tabular-nums;
	}
	.ntitle {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.nlist {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 5px;
	}
	.nb {
		display: flex;
		align-items: baseline;
		gap: 4px;
		border-radius: 999px;
		background: var(--color-paper);
		padding: 2px 9px;
	}
	.nb b {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.nb small {
		font-size: 10px;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.count {
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 1px 9px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.count.full {
		color: var(--color-grass);
		border-color: var(--color-grass);
	}

	.map {
		width: 100%;
		max-width: min(400px, 92vw);
		height: auto;
		overflow: visible;
		user-select: none;
		touch-action: none;
	}
	.area {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.grid {
		stroke: var(--color-line);
		stroke-width: 0.8;
		opacity: 0.7;
	}
	.shelf {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.slabel {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-faint);
		text-anchor: middle;
	}
	.nline {
		stroke: var(--color-brand);
		stroke-width: 1.6;
		stroke-linecap: round;
		pointer-events: none;
	}
	.word {
		cursor: pointer;
		outline: none;
	}
	.word rect {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.3;
		transition:
			fill 0.2s ease,
			stroke 0.2s ease;
	}
	.word text {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-muted);
		text-anchor: middle;
		pointer-events: none;
	}
	.word.loose {
		cursor: grab;
	}
	.word.loose rect {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.word.loose text {
		fill: var(--color-ink);
		font-weight: 700;
	}
	.word.home rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.word.active rect {
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.word.active text {
		fill: var(--color-ink);
	}
	.word.lifted {
		cursor: grabbing;
	}
	.word.lifted rect {
		filter: drop-shadow(0 4px 6px rgba(22, 40, 60, 0.18));
	}
	.word:focus-visible rect {
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.dragging .word:not(.lifted) {
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.word rect {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.panel {
			max-width: 420px;
		}
		.map {
			max-width: 480px;
		}
		.hint {
			font-size: 13px;
		}
	}
</style>
