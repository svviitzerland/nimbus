<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { DataText } from '$lib/chapters/ai/data/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DataText);

	type Label = 'cat' | 'not';
	// Every face is drawn from two numbers, and the model sees only those two numbers.
	// ear goes from floppy (0) to pointy (1), snout from short (0) to long (1).
	type Photo = { ear: number; snout: number; truth: Label; fur: number; blur?: boolean };

	// The messy training set. Photo 4 and photo 7 carry the wrong label, photo 11 is a blur.
	const TRAIN: (Photo & { start: Label })[] = [
		{ ear: 0.9, snout: 0.2, truth: 'cat', start: 'cat', fur: 0 },
		{ ear: 0.75, snout: 0.3, truth: 'cat', start: 'cat', fur: 1 },
		{ ear: 0.85, snout: 0.15, truth: 'cat', start: 'cat', fur: 2 },
		{ ear: 0.7, snout: 0.25, truth: 'cat', start: 'not', fur: 0 },
		{ ear: 0.2, snout: 0.8, truth: 'not', start: 'not', fur: 2 },
		{ ear: 0.3, snout: 0.7, truth: 'not', start: 'not', fur: 0 },
		{ ear: 0.15, snout: 0.6, truth: 'not', start: 'cat', fur: 1 },
		{ ear: 0.8, snout: 0.75, truth: 'not', start: 'not', fur: 1 },
		{ ear: 0.4, snout: 0.85, truth: 'not', start: 'not', fur: 2 },
		{ ear: 0.95, snout: 0.35, truth: 'cat', start: 'cat', fur: 1 },
		{ ear: 0.55, snout: 0.5, truth: 'cat', start: 'cat', fur: 0, blur: true },
		{ ear: 0.25, snout: 0.9, truth: 'not', start: 'not', fur: 1 }
	];

	// Six new photos the model has never seen.
	const TEST: Photo[] = [
		{ ear: 0.69, snout: 0.24, truth: 'cat', fur: 2 },
		{ ear: 0.18, snout: 0.64, truth: 'not', fur: 0 },
		{ ear: 0.5, snout: 0.62, truth: 'not', fur: 1 },
		{ ear: 0.88, snout: 0.22, truth: 'cat', fur: 1 },
		{ ear: 0.22, snout: 0.85, truth: 'not', fur: 0 },
		{ ear: 0.78, snout: 0.68, truth: 'not', fur: 2 }
	];

	let labels = $state<Label[]>(TRAIN.map((p) => p.start));
	let removed = $state<boolean[]>(TRAIN.map(() => false));
	let selected = $state<number | null>(null);
	let results = $state<{ guess: Label; from: number }[] | null>(null);
	let stale = $state(false);
	let looking = $state<number | null>(null);
	let edited = false;
	let saidLook = false;
	let saidFix = false;
	let saidToss = false;
	let completed = false;

	const kept = $derived(TRAIN.map((_, i) => i).filter((i) => !removed[i]));
	const score = $derived(results ? results.filter((r, k) => r.guess === TEST[k].truth).length : 0);

	// The whole model, nearest neighbour. Find the most alike training photo and copy its label.
	function nearest(p: Photo) {
		let best = -1;
		let bestD = Infinity;
		for (const i of kept) {
			const d = (TRAIN[i].ear - p.ear) ** 2 + (TRAIN[i].snout - p.snout) ** 2;
			if (d < bestD) {
				bestD = d;
				best = i;
			}
		}
		return best;
	}

	function train() {
		if (kept.length === 0) return;
		results = TEST.map((p) => {
			const from = nearest(p);
			return { guess: labels[from], from };
		});
		stale = false;
		looking = null;
		selected = null;
		const right = results.filter((r, k) => r.guess === TEST[k].truth).length;
		if (right === TEST.length) {
			onstate?.('clean');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		} else onstate?.(edited ? 'still' : 'messy');
	}

	function pick(i: number) {
		selected = selected === i ? null : i;
		looking = null;
	}

	function changed() {
		edited = true;
		if (results) stale = true;
		looking = null;
	}

	function swap() {
		if (selected === null) return;
		const i = selected;
		labels[i] = labels[i] === 'cat' ? 'not' : 'cat';
		changed();
		if (TRAIN[i].blur) return;
		if (labels[i] === TRAIN[i].truth) {
			if (!saidFix) onstate?.('fix');
			saidFix = true;
		} else onstate?.('oops');
	}

	function remove() {
		if (selected === null) return;
		const i = selected;
		removed[i] = true;
		selected = null;
		changed();
		if (TRAIN[i].blur) {
			if (!saidToss) onstate?.('toss');
			saidToss = true;
		} else onstate?.('toss_good');
	}

	function look(k: number) {
		if (!results || stale) return;
		looking = looking === k ? null : k;
		selected = null;
		if (looking !== null && !saidLook) {
			saidLook = true;
			onstate?.('look');
		}
	}

	function reset() {
		labels = TRAIN.map((p) => p.start);
		removed = TRAIN.map(() => false);
		selected = null;
		results = null;
		stale = false;
		looking = null;
		edited = false;
	}

	const labelName = (l: Label) => (l === 'cat' ? tx.catLabel : tx.notLabel);
	const furColor = [
		'color-mix(in srgb, var(--color-amber) 62%, var(--color-card))',
		'color-mix(in srgb, var(--color-faint) 55%, var(--color-card))',
		'color-mix(in srgb, var(--color-muted) 80%, var(--color-card))'
	];
	const chosenText = $derived.by(() => {
		if (selected === null) return '';
		const l = labelName(labels[selected]);
		return TRAIN[selected].blur
			? tx.blurChosen.replace('{label}', l)
			: tx.chosen.replace('{n}', String(selected + 1)).replace('{label}', l);
	});
</script>

{#snippet face(p: Photo, size: number)}
	{@const fill = furColor[p.fur]}
	<svg
		class="face"
		class:blur={p.blur}
		width={size}
		height={size * 0.875}
		viewBox="0 0 64 56"
		aria-hidden="true"
	>
		{#if p.ear >= 0.5}
			{@const h = 6 + (p.ear - 0.5) * 26}
			<path d="M18 28 L17 {22 - h} L30 19 Z" style="fill:{fill}" class="line" />
			<path d="M46 28 L47 {22 - h} L34 19 Z" style="fill:{fill}" class="line" />
		{/if}
		<circle cx="32" cy="32" r="15" style="fill:{fill}" class="line" />
		{#if p.ear < 0.5}
			{@const l = 8 + (0.5 - p.ear) * 16}
			<ellipse
				cx="18"
				cy={26 + l * 0.6}
				rx="5"
				ry={l}
				transform="rotate(18 18 26)"
				style="fill:{fill}"
				class="line ear"
			/>
			<ellipse
				cx="46"
				cy={26 + l * 0.6}
				rx="5"
				ry={l}
				transform="rotate(-18 46 26)"
				style="fill:{fill}"
				class="line ear"
			/>
		{/if}
		<circle cx="26" cy="29" r="1.9" class="eye" />
		<circle cx="38" cy="29" r="1.9" class="eye" />
		<ellipse
			cx="32"
			cy={37 + p.snout * 3}
			rx={4.5 + p.snout * 6}
			ry={3.2 + p.snout * 5}
			class="snout"
		/>
		<ellipse cx="32" cy={34.5 + p.snout * 1.5} rx="2.4" ry="1.7" class="eye" />
	</svg>
{/snippet}

<div class="stage">
	<div class="bar">
		<div class="acts">
			<CallToActionButton onclick={train} disabled={kept.length === 0}>
				{results ? tx.retrainBtn : tx.trainBtn}
			</CallToActionButton>
			<button type="button" class="ghost" onclick={reset}>{tx.reset}</button>
		</div>
		<span class="score" class:full={score === TEST.length && !stale}>
			{results && !stale ? tx.score.replace('{n}', String(score)) : ' '}
		</span>
	</div>

	<!-- what you can do with the selected training photo -->
	<div class="editor">
		{#if selected !== null}
			<span class="ename">{chosenText}</span>
			<div class="erow">
				<button type="button" class="pill" onclick={swap}>{tx.swapBtn}</button>
				<button type="button" class="pill warn" onclick={remove}>{tx.removeBtn}</button>
			</div>
		{:else if looking !== null && results}
			<span class="ename">{tx.copied.replace('{n}', String(results[looking].from + 1))}</span>
		{:else}
			<span class="hint">{stale ? tx.stale : results ? tx.lookHint : tx.pickHint}</span>
		{/if}
	</div>

	<p class="cap">{tx.setTitle.replace('{n}', String(kept.length))}</p>
	<div class="grid">
		{#each TRAIN as p, i (i)}
			{#if !removed[i]}
				<button
					type="button"
					class="card"
					class:sel={selected === i}
					class:src={looking !== null && results?.[looking].from === i}
					aria-label="{tx.photo.replace('{n}', String(i + 1))}, {labelName(labels[i])}"
					aria-pressed={selected === i}
					onclick={() => pick(i)}
				>
					<span class="num">{i + 1}</span>
					{@render face(p, 44)}
					<span class="chip" class:cat={labels[i] === 'cat'}>{labelName(labels[i])}</span>
				</button>
			{/if}
		{/each}
	</div>

	<p class="cap">{tx.testTitle}</p>
	<div class="tests">
		{#each TEST as p, k (k)}
			{@const r = results && !stale ? results[k] : null}
			<button
				type="button"
				class="tcard"
				class:sel={looking === k}
				class:right={r && r.guess === p.truth}
				class:wrong={r && r.guess !== p.truth}
				disabled={!r}
				aria-label="{tx.newPhoto.replace('{n}', String(k + 1))}{r
					? `, ${tx.guessed} ${labelName(r.guess)}`
					: ''}"
				onclick={() => look(k)}
			>
				{@render face(p, 34)}
				<span class="chip small" class:cat={r?.guess === 'cat'}>{r ? labelName(r.guess) : '?'}</span
				>
				{#if r}
					<span class="mark" aria-hidden="true">{r.guess === p.truth ? '✓' : '✗'}</span>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding-bottom: 8px;
	}
	.bar {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.acts {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.acts :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.ghost {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 6px 8px;
	}
	.ghost:hover {
		color: var(--color-ink);
	}
	.score {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-danger);
	}
	.score.full {
		color: var(--color-grass);
	}

	.editor {
		display: flex;
		min-height: 58px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		width: 100%;
		max-width: 340px;
	}
	.ename {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
		text-align: center;
	}
	.hint {
		font-size: 12px;
		color: var(--color-faint);
		text-align: center;
	}
	.erow {
		display: flex;
		gap: 8px;
	}
	.pill {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 14px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.pill:hover {
		border-color: var(--color-brand);
	}
	.pill.warn:hover {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}

	.cap {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 6px;
		width: 100%;
		max-width: 340px;
	}
	.card,
	.tcard {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 2px 5px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.card.sel,
	.tcard.sel {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.card.src {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.num {
		position: absolute;
		top: 3px;
		left: 6px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.chip {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-radius: 999px;
		background: var(--color-paper);
		padding: 1px 7px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.chip.cat {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.chip.small {
		padding: 1px 4px;
		font-size: 8.5px;
	}

	.tests {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 5px;
		width: 100%;
		max-width: 340px;
	}
	.tcard {
		padding: 6px 1px 4px;
	}
	.tcard:disabled {
		cursor: default;
	}
	.tcard.right {
		border-color: color-mix(in srgb, var(--color-grass) 55%, var(--color-line));
	}
	.tcard.wrong {
		border-color: color-mix(in srgb, var(--color-danger) 55%, var(--color-line));
	}
	.mark {
		position: absolute;
		top: -7px;
		right: -5px;
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		font-size: 9.5px;
		font-weight: 800;
		color: #fff;
		background: var(--color-danger);
	}
	.tcard.right .mark {
		background: var(--color-grass);
	}

	.face {
		display: block;
		overflow: visible;
	}
	.face.blur {
		filter: blur(2.6px);
		opacity: 0.75;
	}
	.line {
		stroke: color-mix(in srgb, var(--color-ink) 35%, transparent);
		stroke-width: 1.2;
		stroke-linejoin: round;
	}
	.eye {
		fill: var(--color-ink);
	}
	.snout {
		fill: color-mix(in srgb, var(--color-card) 75%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.tcard {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.grid,
		.tests,
		.editor {
			max-width: 420px;
		}
		.grid {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}
</style>
