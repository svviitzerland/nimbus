<script lang="ts">
	// A guided "watch" stage for database indexes. A big grid stands for the users table, a scan
	// crawls through it square by square, then an open book shows how an index at the back finds a
	// word, the sorted email list halves itself hop by hop, and finally a race plays by itself. The
	// only optional play is changing the size of the table and watching the race again.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DbIndexText } from '$lib/chapters/web/db-index/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as DbIndexText);

	// Which scene each beat shows (eight beats, seven scenes).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 5, 6];
	const COLS = 12;
	const ROWS = 8;
	const CELLS = COLS * ROWS;
	const TARGET = 70; // the square where the email hides
	const WHERE = (TARGET + 1) / CELLS; // how far into the table it sits
	const SIZES = [1e3, 1e5, 1e6, 1e8];
	const SIZE_TOKENS = ['small', 'mid', 'big', 'huge'] as const;
	// The binary search over the eight sorted emails, the target is the last one.
	const HOPS = [
		{ lo: 0, hi: 7, mid: 3 },
		{ lo: 4, hi: 7, mid: 5 },
		{ lo: 6, hi: 7, mid: 6 },
		{ lo: 7, hi: 7, mid: 7 }
	];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let sizeIdx = $state(2);
	let t = $state(0); // ms since the scene (or the race) started

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const size = $derived(scene === 6 ? SIZES[sizeIdx] : 1e6);
	const sizeLabel = $derived(tx.sizes[scene === 6 ? sizeIdx : 2]);
	const fmt = $derived(new Intl.NumberFormat(tx.locale));

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

	// Race timing, the scan takes longer on bigger tables, the index only adds a few hops.
	const scanMs = $derived(1500 + 700 * (Math.log10(size) - 2));
	const hops = $derived(Math.ceil(Math.log2(size)));
	const HOP_MS = 70;
	const raceMs = $derived(Math.max(scanMs, hops * HOP_MS));

	// How long each self playing scene lasts before it loops.
	const period = $derived(
		scene === 1
			? TARGET * 80 + 2800
			: scene === 2
				? 6200
				: scene === 3
					? 900 + HOPS.length * 1300 + 2800
					: scene === 4 || scene === 6
						? raceMs + 3200
						: 0
	);

	// One clock, restarted whenever the scene or the table size changes.
	$effect(() => {
		void scene;
		void sizeIdx;
		const p = period;
		if (reduced || p === 0) {
			t = 1e9;
			return;
		}
		t = 0;
		const start = Date.now();
		const iv = setInterval(() => {
			t = (Date.now() - start) % p;
		}, 50);
		return () => clearInterval(iv);
	});

	// Scene 1, the scan cursor.
	const cursor = $derived(Math.min(TARGET, Math.floor(t / 80)));
	const scanFound = $derived(cursor >= TARGET);
	const scanCount = $derived(Math.round(((cursor + 1) / CELLS) * 1e6));

	// Scene 2, the book.
	const bookFound = $derived(t >= 1300);
	const bookPage = $derived(t >= 2600);
	const page = $derived(tx.bookEntries.find((e) => e.word === tx.bookWord)?.page ?? 1);

	// Scene 3, the hops through the sorted list.
	const hopAt = $derived(Math.min(HOPS.length, Math.max(0, Math.floor((t - 900) / 1300) + 1)));
	const hopNow = $derived(hopAt > 0 ? HOPS[hopAt - 1] : null);
	const hopFound = $derived(hopAt >= HOPS.length);

	// Scenes 4 to 6, the race.
	const raceT = $derived(scene === 5 ? 1e9 : t);
	const scanP = $derived(Math.min(1, raceT / scanMs));
	const scanRows = $derived(Math.round(scanP * WHERE * size));
	const hopsDone = $derived(Math.min(hops, Math.floor(raceT / HOP_MS)));

	function grow() {
		sizeIdx = (sizeIdx + 1) % SIZES.length;
		onstate?.(SIZE_TOKENS[sizeIdx]);
	}
	const fill = (s: string, n: number | string) => s.replace('{n}', String(n));
</script>

{#snippet grid(scan: boolean)}
	<div class="card">
		<p class="label">
			<span class="mono">{tx.tableName}</span>
			<span>{tx.sizeLine.replace('{size}', sizeLabel)}</span>
		</p>
		<svg viewBox="0 0 316 212" class="grid" aria-hidden="true">
			{#each Array(CELLS) as _, i (i)}
				<rect
					x={4 + (i % COLS) * 26}
					y={4 + Math.floor(i / COLS) * 26}
					width="22"
					height="22"
					rx="4"
					class="cell"
					class:seen={scan && i < cursor}
					class:now={scan && i === cursor && !scanFound}
					class:target={i === TARGET && (!scan || scanFound)}
					class:pulse={i === TARGET && !scan && !reduced}
				/>
			{/each}
		</svg>
		<p class="foot">
			{#if scan}
				<span class:good={scanFound}
					>{fill(tx.rowsChecked, fmt.format(scanCount))}{scanFound ? `, ${tx.found}` : ''}</span
				>
			{:else}
				<span class="mono">{tx.target}</span>
				<span class="note">{tx.gridNote}</span>
			{/if}
		</p>
	</div>
{/snippet}

{#snippet book()}
	<div class="card">
		<svg viewBox="0 0 360 210" class="book" aria-hidden="true">
			<!-- cover peeking out under the pages -->
			<path d="M14 26 L180 34 L346 26 L346 196 L180 204 L14 196 Z" class="cover" />
			<path d="M20 20 Q100 12 180 26 L180 196 Q100 184 20 190 Z" class="page" />
			<path d="M340 20 Q260 12 180 26 L180 196 Q260 184 340 190 Z" class="page" />
			<line x1="180" y1="26" x2="180" y2="196" class="spine" />

			<!-- left page, the index -->
			<text x="38" y="46" class="book-title">{tx.bookTitle}</text>
			{#each tx.bookEntries as e, k (e.word)}
				{@const hit = e.word === tx.bookWord}
				<rect
					x="30"
					y={58 + k * 21}
					width="140"
					height="19"
					rx="5"
					class="hl"
					class:on={hit && bookFound}
				/>
				<text x="38" y={72 + k * 21} class="entry" class:hit={hit && bookFound}>{e.word}</text>
				<text x="162" y={72 + k * 21} class="entry num" class:hit={hit && bookFound}>{e.page}</text>
			{/each}

			<!-- right page, the page it points to -->
			<g class="right" class:open={bookPage}>
				<rect x="198" y="44" width="90" height="9" rx="4" class="bar head" />
				{#each [0, 1, 2, 3, 4, 5] as k (k)}
					<rect
						x="198"
						y={66 + k * 18}
						width={k === 5 ? 80 : 124}
						height="7"
						rx="3.5"
						class="bar"
						class:hit={k === 2 && bookPage}
					/>
				{/each}
				<text x="322" y="178" class="pnum">{bookPage ? page : ''}</text>
			</g>
			{#if bookFound}
				<path
					d="M170 {68 + 2 * 21} Q186 {90 + 2 * 21} 196 {104}"
					class="jump"
					class:show={bookPage}
				/>
			{/if}
		</svg>
		<p class="foot">
			{#if bookPage}
				<span class="good" in:fade={{ duration: 250 }}>{fill(tx.pageLabel, page)}</span>
			{:else}
				<span class="mono">{tx.bookWord}</span>
			{/if}
		</p>
	</div>
{/snippet}

{#snippet sortedList()}
	<div class="card">
		<p class="label">
			<span>{tx.sortedLabel}</span>
			<span class="mono">{hopAt > 0 ? fill(tx.hop, hopAt) : ''}</span>
		</p>
		<ol class="emails">
			{#each tx.emails as e, k (e)}
				{@const outRange = hopNow !== null && (k < hopNow.lo || k > hopNow.hi)}
				<li
					class:gone={outRange}
					class:mid={hopNow?.mid === k && !hopFound}
					class:found={hopFound && k === tx.emails.length - 1}
				>
					<span class="mono">{e}</span>
					{#if hopFound && k === tx.emails.length - 1}
						<span class="ptr" in:fade={{ duration: 250 }}
							>{fill(tx.pointsTo, fmt.format(Math.round(WHERE * 1e6)))}</span
						>
					{/if}
				</li>
			{/each}
		</ol>
	</div>
{/snippet}

{#snippet race()}
	<div class="card race">
		<p class="label">
			<span class="mono">{tx.target}</span>
			<span>{tx.sizeLine.replace('{size}', sizeLabel)}</span>
		</p>
		<div class="lane">
			<div class="lane-head">
				<b>{tx.scanLane}</b>
				<span class:good={scanP >= 1}>{fill(tx.rowsChecked, fmt.format(scanRows))}</span>
			</div>
			<div class="track"><div class="fill slow" style="width:{scanP * WHERE * 100}%"></div></div>
		</div>
		<div class="lane">
			<div class="lane-head">
				<b>{tx.indexLane}</b>
				<span class:good={hopsDone >= hops}>{fill(tx.steps, hopsDone)}</span>
			</div>
			<div class="hops">
				{#each Array(hops) as _, k (k)}
					<i class:on={k < hopsDone}></i>
				{/each}
				{#if hopsDone >= hops}
					<span class="tag" in:fade={{ duration: 200 }}>{tx.found}</span>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 6}
					<button type="button" class="try" onclick={grow}>{tx.grow}</button>
				{/if}
				{#key s === 6 ? 4 : s === 5 ? 4 : s}
					<div class="frame" in:fade={{ duration: 300 }}>
						{#if s === 0}
							{@render grid(false)}
						{:else if s === 1}
							{@render grid(true)}
						{:else if s === 2}
							{@render book()}
						{:else if s === 3}
							{@render sortedList()}
						{:else}
							{@render race()}
						{/if}
					</div>
				{/key}
				{#if s === 5}
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
		align-items: center;
		gap: 10px;
	}
	.frame {
		width: 100%;
	}
	.try {
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
	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 12px 14px;
	}
	.label {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		margin: 0 0 8px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.mono {
		font-family: var(--font-mono, ui-monospace, monospace);
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 12px;
		margin: 8px 0 0;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.note {
		color: var(--color-faint);
		font-weight: 500;
	}
	.good {
		color: var(--color-grass);
	}

	/* grid of rows */
	.grid,
	.book {
		display: block;
		width: 100%;
		height: auto;
	}
	.cell {
		fill: var(--color-paper);
		stroke: var(--color-line);
		transition: fill 0.2s;
	}
	.cell.seen {
		fill: color-mix(in srgb, var(--color-faint) 25%, var(--color-card));
	}
	.cell.now {
		fill: var(--color-amber);
	}
	.cell.target {
		fill: var(--color-grass);
		stroke: var(--color-grass);
	}
	.cell.pulse {
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.4;
		}
	}

	/* book */
	.cover {
		fill: var(--color-brand);
		opacity: 0.85;
	}
	.page {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.spine {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.book-title {
		fill: var(--color-ink);
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
	}
	.entry {
		fill: var(--color-muted);
		font-size: 12px;
	}
	.entry.num {
		text-anchor: end;
		font-variant-numeric: tabular-nums;
	}
	.entry.hit {
		fill: var(--color-ink);
		font-weight: 700;
	}
	.hl {
		fill: transparent;
		transition: fill 0.4s;
	}
	.hl.on {
		fill: var(--color-amber-soft);
	}
	.right {
		opacity: 0.35;
		transition: opacity 0.5s;
	}
	.right.open {
		opacity: 1;
	}
	.bar {
		fill: var(--color-line);
		transition: fill 0.4s;
	}
	.bar.head {
		fill: color-mix(in srgb, var(--color-faint) 45%, var(--color-card));
	}
	.bar.hit {
		fill: var(--color-amber);
	}
	.pnum {
		fill: var(--color-faint);
		font-size: 13px;
		font-weight: 700;
		text-anchor: end;
	}
	.jump {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.jump.show {
		opacity: 1;
	}

	/* sorted list */
	.emails {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.emails li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		border-radius: 9px;
		padding: 4px 10px;
		font-size: 13px;
		color: var(--color-ink);
		transition:
			opacity 0.4s,
			background 0.3s;
	}
	.emails li.gone {
		opacity: 0.22;
	}
	.emails li.mid {
		background: var(--color-amber-soft);
	}
	.emails li.found {
		background: var(--color-grass-soft);
		font-weight: 700;
	}
	.ptr {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-grass);
		text-align: right;
	}

	/* race */
	.race {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.race .label {
		margin: 0;
	}
	.lane {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.lane-head {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 13px;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.lane-head span {
		color: var(--color-muted);
		font-weight: 600;
	}
	.lane-head span.good {
		color: var(--color-grass);
	}
	.track {
		height: 12px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.fill {
		height: 100%;
		border-radius: 999px;
	}
	.fill.slow {
		background: var(--color-amber);
	}
	.hops {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
		min-height: 14px;
	}
	.hops i {
		height: 10px;
		width: 10px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.15s;
	}
	.hops i.on {
		background: var(--color-grass);
	}
	.tag {
		margin-left: 6px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 1px 9px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
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
		.emails li {
			font-size: 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cell,
		.hl,
		.right,
		.bar,
		.jump,
		.emails li,
		.hops i {
			transition: none;
		}
		.cell.pulse {
			animation: none;
		}
	}
</style>
