<script lang="ts">
	// A guided "watch" stage. Nim narrates, and a small spreadsheet of cat photos follows the
	// beats by itself: the photos arrive, the labels get written, one wrong label is pointed out,
	// then every kind of mess is flagged and cleaned away (fix the label, drop the blurry photo
	// and the copy, fill the empty label). The only optional play is on the last beat, messing the
	// sheet up again and watching it clean itself.
	import { flip } from 'svelte/animate';
	import { fade, slide } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DataProblem, DataText } from '$lib/chapters/ai/data/types';
	import { runSeq } from './webguide/seq';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as DataText);

	const LAST = 9;
	type Pic = 'cat' | 'dog' | 'blurry';
	type Row = {
		id: number;
		pic: Pic;
		tone: number;
		label: 'cat' | 'not' | 'none';
		problem?: DataProblem;
	};
	const ROWS: Row[] = [
		{ id: 1, pic: 'cat', tone: 0, label: 'cat' },
		{ id: 2, pic: 'dog', tone: 0, label: 'cat', problem: 'wrong' },
		{ id: 3, pic: 'cat', tone: 1, label: 'cat' },
		{ id: 4, pic: 'blurry', tone: 2, label: 'cat', problem: 'blurry' },
		{ id: 5, pic: 'cat', tone: 0, label: 'cat', problem: 'copy' },
		{ id: 6, pic: 'dog', tone: 1, label: 'not' },
		{ id: 7, pic: 'cat', tone: 2, label: 'none', problem: 'missing' }
	];
	const TONES = ['var(--color-amber)', 'var(--color-faint)', 'var(--color-muted)'];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let rowsShown = $state(ROWS.length);
	let labelsShown = $state(ROWS.length);
	let playPhase = $state(7);
	let messy = $state(false);
	let cleanRun = $state(0); // bumps each time the learner asks for a clean up

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
		messy = false;
		playPhase = 7;
		cleanRun = 0;
	});

	const scene = $derived(peek ?? Math.min(beat, LAST));
	// How far the cleaning has come, 0 (photos arriving) to 7 (all clean).
	const phase = $derived(scene <= 7 ? scene : scene === 8 ? 7 : playPhase);

	// The photos arrive one by one on the first beat, the labels get written on the second.
	$effect(() => {
		const sc = scene;
		if (reduced || (sc !== 0 && sc !== 1)) {
			rowsShown = ROWS.length;
			labelsShown = ROWS.length;
			return;
		}
		if (sc === 0) {
			rowsShown = 0;
			labelsShown = 0;
		} else {
			rowsShown = ROWS.length;
			labelsShown = 0;
		}
		const t = setInterval(() => {
			if (sc === 0) rowsShown += 1;
			else labelsShown += 1;
			if ((sc === 0 ? rowsShown : labelsShown) >= ROWS.length) clearInterval(t);
		}, 520);
		return () => clearInterval(t);
	});

	const rows = $derived(
		ROWS.slice(0, rowsShown).filter(
			(r) => phase < 6 || (r.problem !== 'blurry' && r.problem !== 'copy')
		)
	);

	function labelOf(r: Row, index: number): 'cat' | 'not' | 'none' {
		if (phase === 0) return 'none';
		if (phase === 1 && index >= labelsShown) return 'none';
		if (r.problem === 'wrong' && phase >= 5) return 'not';
		if (r.problem === 'missing' && phase >= 6) return 'cat';
		return r.label;
	}
	function flagOf(r: Row): DataProblem | null {
		if (!r.problem) return null;
		if (phase === 2 || phase === 3) return r.problem === 'wrong' ? 'wrong' : null;
		if (phase === 4) return r.problem;
		if (phase === 5) return r.problem === 'wrong' ? null : r.problem;
		return null;
	}
	function fixed(r: Row) {
		return (r.problem === 'wrong' && phase >= 5) || (r.problem === 'missing' && phase >= 6);
	}

	// The optional toggle, mess it up or let it clean itself step by step.
	$effect(() => {
		if (scene !== LAST || cleanRun === 0) return;
		return runSeq(
			reduced
				? [[0, () => (playPhase = 7)]]
				: [
						[900, () => (playPhase = 4)],
						[1400, () => (playPhase = 5)],
						[1500, () => (playPhase = 6)],
						[0, () => (playPhase = 7)]
					]
		);
	});
	function toggle() {
		if (messy) {
			messy = false;
			cleanRun += 1;
			onstate?.('clean');
		} else {
			messy = true;
			cleanRun = 0;
			playPhase = 4;
			onstate?.('messy');
		}
	}
</script>

{#snippet pic(kind: Pic, tone: number)}
	<svg viewBox="0 0 40 32" class="photo" role="img" aria-label={tx.pics[kind]}>
		{#if kind === 'blurry'}
			<defs>
				<filter id="data-blur" x="-20%" y="-20%" width="140%" height="140%">
					<feGaussianBlur stdDeviation="2.4" />
				</filter>
			</defs>
		{/if}
		<rect x="0" y="0" width="40" height="32" rx="4" class="photo-bg" />
		<g filter={kind === 'blurry' ? 'url(#data-blur)' : undefined} style="--fur:{TONES[tone]}">
			{#if kind === 'dog'}
				<ellipse cx="11" cy="15" rx="4" ry="7.5" transform="rotate(18 11 15)" class="fur dark" />
				<ellipse cx="29" cy="15" rx="4" ry="7.5" transform="rotate(-18 29 15)" class="fur dark" />
				<ellipse cx="20" cy="17" rx="8.5" ry="9" class="fur" />
				<ellipse cx="20" cy="22" rx="4.5" ry="3.5" class="snout" />
				<ellipse cx="20" cy="20.5" rx="1.8" ry="1.3" class="feature" />
				<circle cx="16.5" cy="14.5" r="1.2" class="feature" />
				<circle cx="23.5" cy="14.5" r="1.2" class="feature" />
			{:else}
				<path d="M11.5 13 L12.5 4.5 L18 10 Z" class="fur" />
				<path d="M28.5 13 L27.5 4.5 L22 10 Z" class="fur" />
				<ellipse cx="20" cy="17.5" rx="9.5" ry="8.5" class="fur" />
				<circle cx="16.3" cy="16" r="1.2" class="feature" />
				<circle cx="23.7" cy="16" r="1.2" class="feature" />
				<path d="M18.8 19.5 H21.2 L20 21 Z" class="feature" />
				<path d="M8 19 L14 20 M8 22 L14 21.3 M32 19 L26 20 M32 22 L26 21.3" class="whisker" />
			{/if}
		</g>
	</svg>
{/snippet}

{#snippet sheet()}
	<div class="sheet">
		<div class="bar">
			<svg viewBox="0 0 14 16" class="file" aria-hidden="true">
				<path d="M1 1 H9 L13 5 V15 H1 Z" />
				<path d="M4 8 H10 M4 11 H10" class="file-lines" />
			</svg>
			<span>{tx.sheetName}</span>
		</div>
		<div class="row head">
			<span class="num"></span>
			<span>{tx.colPhoto}</span>
			<span>{tx.colLabel}</span>
		</div>
		{#each rows as r (r.id)}
			{@const lab = labelOf(r, ROWS.indexOf(r))}
			{@const flag = flagOf(r)}
			<div
				class="row"
				class:flagged={flag}
				class:bad={flag === 'wrong'}
				animate:flip={{ duration: reduced ? 0 : 450 }}
				in:slide={{ duration: reduced ? 0 : 380 }}
				out:slide={{ duration: reduced ? 0 : 450 }}
			>
				<span class="num">{r.id}</span>
				<span class="cell">{@render pic(r.pic, r.tone)}</span>
				<span class="cell label-cell">
					{#if lab !== 'none'}
						{#key lab}
							<span class="label" class:fixed={fixed(r)} in:fade={{ duration: reduced ? 0 : 350 }}>
								{lab === 'cat' ? tx.cat : tx.notCat}
							</span>
						{/key}
					{/if}
					{#if flag}
						<span class="note" in:fade={{ duration: reduced ? 0 : 300 }}>
							<i></i>{tx.problems[flag]}
						</span>
					{/if}
				</span>
			</div>
		{/each}
		<p class="foot" class:clean={phase >= 7}>
			{(phase >= 7 ? tx.cleanCount : tx.count).replace('{n}', String(rows.length))}
		</p>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === LAST}
					<button type="button" class="act" onclick={toggle} in:fade={{ duration: 300 }}>
						{messy ? tx.cleanBtn : tx.messBtn}
					</button>
				{/if}
				{@render sheet()}
				{#if i === 3}
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
		max-width: 400px;
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

	/* the spreadsheet */
	.sheet {
		width: 100%;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		box-shadow: 0 10px 28px rgba(22, 40, 60, 0.07);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 12px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.file {
		height: 16px;
		width: 14px;
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.2;
		stroke-linejoin: round;
	}
	.file-lines {
		fill: none;
	}
	.row {
		position: relative;
		display: grid;
		grid-template-columns: 34px 62px minmax(0, 1fr);
		align-items: center;
		border-bottom: 1px solid var(--color-line);
		transition: background 0.4s;
	}
	.row.head {
		background: var(--color-paper);
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.row.head > span {
		padding: 5px 8px;
	}
	.row.flagged {
		background: var(--color-amber-soft);
	}
	.row.bad {
		background: var(--color-danger-soft);
	}
	.num {
		align-self: stretch;
		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid var(--color-line);
		font-size: 11px;
		font-variant-numeric: tabular-nums;
		color: var(--color-faint);
	}
	.cell {
		display: flex;
		align-items: center;
		padding: 5px 8px;
	}
	.label-cell {
		min-height: 42px;
		justify-content: space-between;
		gap: 8px;
		border-left: 1px solid var(--color-line);
	}
	.photo {
		display: block;
		height: 32px;
		width: 40px;
	}
	.photo-bg {
		fill: var(--color-brand-soft);
	}
	.fur {
		fill: var(--fur);
	}
	.fur.dark {
		filter: brightness(0.8);
	}
	.snout {
		fill: var(--color-card);
		opacity: 0.85;
	}
	.feature {
		fill: var(--color-ink);
	}
	.whisker {
		stroke: var(--color-ink);
		stroke-width: 0.6;
		opacity: 0.6;
	}
	.label {
		font-size: 13.5px;
		font-weight: 600;
		color: var(--color-ink);
		transition: color 0.4s;
	}
	.label.fixed {
		color: var(--color-grass);
	}
	.note {
		display: inline-flex;
		flex: none;
		align-items: center;
		gap: 5px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.row.bad .note {
		color: var(--color-danger);
	}
	.note i {
		height: 7px;
		width: 7px;
		border-radius: 999px;
		background: currentColor;
	}
	.foot {
		margin: 0;
		padding: 8px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition: color 0.4s;
	}
	.foot.clean {
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
	}
	@media (prefers-reduced-motion: reduce) {
		.row,
		.label,
		.foot,
		.act {
			transition: none;
		}
	}
</style>
