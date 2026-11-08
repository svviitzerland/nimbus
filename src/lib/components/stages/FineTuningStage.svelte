<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { FineTuningText } from '$lib/chapters/ai/fine-tuning/types';
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
	const tx = $derived(text as FineTuningText);

	// What kind of habit each past reply teaches, by position. Language independent, so it lives here.
	type Kind = 'good' | 'rude' | 'wrong';
	const KIND: Kind[] = ['good', 'rude', 'good', 'wrong', 'good'];
	const ROUNDS = 3;

	let chosen = $state<boolean[]>(KIND.map(() => false));
	let tunedWith = $state<boolean[] | null>(null);
	let asked = $state<number | null>(null);
	let round = $state(0); // 1..3 while tuning, 0 when idle

	const count = $derived(chosen.filter(Boolean).length);
	const tuning = $derived(round > 0);
	const stale = $derived(tunedWith !== null && tunedWith.some((v, k) => v !== chosen[k]));
	const taught = $derived.by(() => {
		const set = tunedWith;
		if (!set) return null;
		return {
			rude: set.some((v, k) => v && KIND[k] === 'rude'),
			wrong: set.some((v, k) => v && KIND[k] === 'wrong')
		};
	});

	function tunedAnswer(i: number) {
		if (!taught) return '';
		const q = tx.questions[i];
		const base = taught.rude ? q.rude : q.good;
		return taught.wrong ? `${base} ${tx.wrongAdd}` : base;
	}

	let saidAsk = false;
	let saidPick = false;
	let saidBad = false;
	let saidStale = false;
	let saidCompare = false;
	let goodAt: number | null = null; // which question was showing when a clean tune finished
	let completed = false;

	function ask(i: number) {
		if (tuning) return;
		asked = i;
		if (!tunedWith && !saidAsk) {
			saidAsk = true;
			onstate?.('ask');
		} else if (taught && !taught.rude && !taught.wrong && !stale && goodAt !== i && !saidCompare) {
			saidCompare = true;
			onstate?.('compare');
		}
	}

	function toggle(k: number) {
		if (tuning) return;
		chosen = chosen.map((v, j) => (j === k ? !v : v));
		if (chosen[k]) {
			if (KIND[k] !== 'good' && !saidBad) {
				saidBad = true;
				onstate?.('pick_bad');
				return;
			}
			if (KIND[k] === 'good' && !saidPick) {
				saidPick = true;
				onstate?.('pick');
				return;
			}
		}
		if (stale && !saidStale) {
			saidStale = true;
			onstate?.('stale');
		}
	}

	let timer: ReturnType<typeof setTimeout> | undefined;
	function tune() {
		if (tuning || count === 0) return;
		round = 1;
		onstate?.('tuning');
		const next = () => {
			if (round < ROUNDS) {
				round++;
				timer = setTimeout(next, 750);
				return;
			}
			round = 0;
			tunedWith = [...chosen];
			saidStale = false;
			if (asked === null) asked = 0;
			const t = taught;
			if (t?.rude) onstate?.('tuned_rude');
			else if (t?.wrong) onstate?.('tuned_wrong');
			else {
				goodAt = asked;
				onstate?.('tuned_good');
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			}
		};
		timer = setTimeout(next, 750);
	}

	function reset() {
		clearTimeout(timer);
		round = 0;
		chosen = KIND.map(() => false);
		tunedWith = null;
		asked = null;
		goodAt = null;
		saidStale = false;
	}

	onDestroy(() => clearTimeout(timer));

	// ---- the little model picture: three frozen columns and one tuned column ----
	const COL_X = [22, 64, 106, 148];
	const ROW_Y = [14, 34, 54];
	const edges = [0, 1, 2].flatMap((c) =>
		ROW_Y.flatMap((y1) => ROW_Y.map((y2) => ({ c, x1: COL_X[c], y1, x2: COL_X[c + 1], y2 })))
	);
</script>

<div class="stage">
	<!-- the customer questions, up top -->
	<div class="block">
		<span class="cap">{tx.questionsLabel}</span>
		<div class="chips">
			{#each tx.questions as q, i (i)}
				<button
					type="button"
					class="chip"
					class:on={asked === i}
					aria-pressed={asked === i}
					disabled={tuning}
					onclick={() => ask(i)}>{q.q}</button
				>
			{/each}
		</div>
	</div>

	<!-- the two answers side by side -->
	<div class="panes">
		<div class="pane">
			<span class="pname">{tx.generalLabel}</span>
			<p class="reply" class:empty={asked === null}>
				{asked === null ? tx.askHint : tx.questions[asked].general}
			</p>
		</div>
		<div class="pane tuned" class:bad={taught && (taught.rude || taught.wrong)}>
			<span class="pname">{tx.tunedLabel}</span>
			{#key `${asked}-${tunedWith?.join()}`}
				<p class="reply" class:empty={asked === null || !taught}>
					{#if !taught}
						{tx.notTuned}
					{:else if asked === null}
						{tx.askHint}
					{:else}
						{tunedAnswer(asked)}
					{/if}
				</p>
			{/key}
			{#if stale}<span class="stale">{tx.stale}</span>{/if}
		</div>
	</div>

	<!-- the model and the tune button -->
	<div class="train">
		<svg class="model" viewBox="0 0 170 84" aria-hidden="true">
			{#each edges as e, k (k)}
				<line
					class="edge"
					class:adapt={e.c === 2}
					class:lit={e.c === 2 && (taught !== null || tuning)}
					class:pulse={e.c === 2 && tuning}
					x1={e.x1}
					y1={e.y1}
					x2={e.x2}
					y2={e.y2}
				/>
			{/each}
			{#each COL_X as x, c (c)}
				{#each ROW_Y as y (y)}
					<circle
						class="node"
						class:adapt={c === 3}
						class:lit={c === 3 && (taught !== null || tuning)}
						cx={x}
						cy={y}
						r="6"
					/>
				{/each}
			{/each}
			<text class="mcap" x="64" y="78">{tx.frozen}</text>
			<text class="mcap amber" x="148" y="78">{tx.adapter}</text>
		</svg>
		<div class="tcol">
			<CallToActionButton onclick={tune} disabled={tuning || count === 0}>
				{tuning ? tx.tuning.replace('{n}', String(round)) : tx.tuneBtn}
			</CallToActionButton>
			<span class="count">
				{tx.setCount.replace('{n}', String(count))}
				<button type="button" class="reset" onclick={reset}>{tx.reset}</button>
			</span>
		</div>
	</div>

	<!-- past replies to choose from -->
	<div class="block">
		<span class="cap">{tx.examplesLabel}</span>
		<div class="examples">
			{#each tx.examples as ex, k (k)}
				<button
					type="button"
					class="ex"
					class:on={chosen[k]}
					aria-pressed={chosen[k]}
					disabled={tuning}
					onclick={() => toggle(k)}
				>
					<span class="box" aria-hidden="true">{chosen[k] ? '✓' : ''}</span>
					<span class="exbody">
						<span class="line"><b class="tag">{tx.qMark}</b>{ex.q}</span>
						<span class="line ans"><b class="tag">{tx.aMark}</b>{ex.a}</span>
					</span>
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-width: 460px;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		margin: 0 auto;
	}
	.block {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chip:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--color-brand) 40%, var(--color-line));
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.chip:disabled {
		opacity: 0.6;
	}

	/* answers */
	.panes {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.pane {
		display: flex;
		flex-direction: column;
		gap: 5px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 10px;
		min-height: 118px;
	}
	.pane.tuned {
		border-color: color-mix(in srgb, var(--color-amber) 55%, var(--color-line));
	}
	.pane.tuned.bad {
		border-color: color-mix(in srgb, var(--color-danger) 60%, var(--color-line));
		background: var(--color-danger-soft);
	}
	.pname {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.pane.tuned .pname {
		color: var(--color-amber);
	}
	.pane.tuned.bad .pname {
		color: var(--color-danger);
	}
	.reply {
		font-size: 11.5px;
		line-height: 1.45;
		color: var(--color-ink);
		animation: fadein 0.35s ease;
	}
	.reply.empty {
		color: var(--color-faint);
	}
	.stale {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-amber);
	}

	/* the model and tune button */
	.train {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
	}
	.model {
		width: 150px;
		height: auto;
		flex: none;
	}
	.edge {
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition: stroke 0.3s ease;
	}
	.edge.lit {
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.edge.pulse {
		animation: blink 0.75s ease-in-out infinite;
	}
	.node {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.5;
		transition:
			fill 0.3s ease,
			stroke 0.3s ease;
	}
	.node.adapt {
		stroke: color-mix(in srgb, var(--color-amber) 60%, var(--color-line));
	}
	.node.lit {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.mcap {
		font-size: 8.5px;
		font-weight: 600;
		text-anchor: middle;
		fill: var(--color-faint);
	}
	.mcap.amber {
		fill: var(--color-amber);
	}
	.tcol {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 6px;
	}
	.tcol :global(.cta) {
		padding: 10px 16px;
		font-size: 13px;
	}
	.count {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.reset {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-faint);
		padding: 2px 4px;
	}
	.reset:hover {
		color: var(--color-ink);
	}

	/* example cards */
	.examples {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 5px;
	}
	.ex {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 10px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.ex:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--color-amber) 45%, var(--color-line));
	}
	.ex.on {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.box {
		display: grid;
		flex: none;
		place-items: center;
		width: 16px;
		height: 16px;
		margin-top: 1px;
		border-radius: 5px;
		border: 1.5px solid var(--color-faint);
		font-size: 10px;
		font-weight: 800;
		color: #fff;
	}
	.ex.on .box {
		border-color: var(--color-amber);
		background: var(--color-amber);
	}
	.exbody {
		display: flex;
		min-width: 0;
		flex-direction: column;
		gap: 2px;
	}
	.line {
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--color-ink);
	}
	.line.ans {
		color: var(--color-muted);
	}
	.tag {
		display: inline-block;
		width: 14px;
		font-size: 10px;
		color: var(--color-faint);
	}

	@keyframes fadein {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
	}
	@keyframes blink {
		50% {
			stroke-opacity: 0.25;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.reply,
		.edge.pulse {
			animation: none;
		}
		.edge,
		.node,
		.chip,
		.ex {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.reply {
			font-size: 12.5px;
		}
		.pane {
			min-height: 128px;
		}
	}
</style>
