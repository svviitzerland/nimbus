<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RagDoc, RagQuestion, RagText } from '$lib/chapters/ai/rag/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as RagText);

	const DOCS: RagDoc[] = ['refund', 'pricing', 'contact', 'about'];
	const QUESTIONS: RagQuestion[] = ['refund', 'support'];
	const DAY_STEPS = [7, 14, 30];
	const START_DAYS = 14;

	/** How closely each document matches each question, as a search over embeddings would score it. */
	const SCORE: Record<RagQuestion, Record<RagDoc, number>> = {
		refund: { refund: 0.91, pricing: 0.42, contact: 0.24, about: 0.09 },
		support: { contact: 0.88, refund: 0.31, about: 0.26, pricing: 0.12 }
	};
	// A two-axis teaching index. Each query selects the corresponding coordinate.
	const vector = (d: RagDoc) => [SCORE.refund[d], SCORE.support[d]];
	const best = (q: RagQuestion) => DOCS.reduce((a, b) => (SCORE[q][b] > SCORE[q][a] ? b : a));

	let q = $state<RagQuestion>('refund');
	let useDocs = $state(false);
	let days = $state(START_DAYS);
	let asked = $state<{ q: RagQuestion; rag: boolean; days: number } | null>(null);
	let phase = $state<'idle' | 'search' | 'answer'>('idle');
	let timer: ReturnType<typeof setTimeout> | undefined;
	let didPlain = false;
	let didRag = false;
	let saidEdit = false;
	let done = false;

	$effect(() => () => clearTimeout(timer));

	const fresh = $derived(
		asked !== null && asked.q === q && asked.rag === useDocs && (!useDocs || asked.days === days)
	);
	const topDoc = $derived(asked?.rag ? best(asked.q) : null);

	const answer = $derived.by(() => {
		if (!asked) return '';
		const Q = tx.questions[asked.q];
		if (!asked.rag) return Q.plain;
		const t = asked.q === 'refund' && asked.days >= 20 ? tx.refundYes : Q.rag;
		return t.replace('{days}', String(asked.days));
	});

	function ask() {
		clearTimeout(timer);
		const snap = { q, rag: useDocs, days };
		asked = snap;
		const reduce =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (snap.rag && !reduce) {
			phase = 'search';
			timer = setTimeout(() => (phase = 'answer'), 1100);
		} else phase = 'answer';

		if (!snap.rag) {
			didPlain = true;
			onstate?.(`plain_${snap.q}`);
		} else {
			didRag = true;
			onstate?.(snap.q === 'refund' && snap.days !== START_DAYS ? 'edit_rag' : `rag_${snap.q}`);
		}
		if (didPlain && didRag && !done) {
			done = true;
			oncomplete?.();
		}
	}

	function stepDays(dir: number) {
		const i = DAY_STEPS.indexOf(days) + dir;
		if (i < 0 || i >= DAY_STEPS.length) return;
		days = DAY_STEPS[i];
		if (!saidEdit) {
			saidEdit = true;
			onstate?.('edit');
		}
	}

	const pct = (v: number) => String(Math.round(v * 100));
</script>

<div class="stage">
	<!-- what to ask, and whether the model gets to read the documents first -->
	<div class="controls">
		<div class="qs" role="group">
			{#each QUESTIONS as k (k)}
				<button
					type="button"
					class="qchip"
					class:on={q === k}
					aria-pressed={q === k}
					onclick={() => (q = k)}>{tx.questions[k].chip}</button
				>
			{/each}
		</div>
		<div class="row">
			<div class="seg" role="radiogroup">
				<button
					type="button"
					role="radio"
					aria-checked={!useDocs}
					class:on={!useDocs}
					onclick={() => (useDocs = false)}>{tx.modePlain}</button
				>
				<button
					type="button"
					role="radio"
					aria-checked={useDocs}
					class:on={useDocs}
					class="rag"
					onclick={() => (useDocs = true)}>{tx.modeRag}</button
				>
			</div>
			<CallToActionButton onclick={ask} waiting={fresh}>{tx.askBtn}</CallToActionButton>
		</div>
	</div>

	<!-- the chat window -->
	<div class="chat">
		<div class="bar">
			<span class="led" class:on={phase !== 'idle'}></span>
			<span class="app">{tx.appTitle}</span>
		</div>
		<div class="msgs" aria-live="polite">
			<p class="msg you">{tx.questions[asked?.q ?? q].ask}</p>
			{#if phase === 'search'}
				<p class="msg ai searching">
					<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
					{tx.searching}
				</p>
			{:else if phase === 'answer' && asked}
				<div class="msg ai" class:grounded={asked.rag} class:guess={!asked.rag}>
					<p>{answer}</p>
					<span class="tag">
						{topDoc ? tx.source.replace('{doc}', tx.docs[topDoc].title) : tx.noSource}
					</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- the nimbus.com documents, searched only in RAG mode -->
	<div class="shelf" class:hidden-docs={!useDocs}>
		<span class="stitle">{useDocs ? tx.shelfTitle : tx.unseen}</span>
		{#if useDocs}<p class="index-note">{tx.indexNote}</p>{/if}
		<div class="docs">
			{#each DOCS as d (d)}
				{@const scored = asked?.rag && phase !== 'idle' && asked.q === q && useDocs}
				<div class="doc" class:top={scored && topDoc === d}>
					<div class="dhead">
						<b>{tx.docs[d].title}</b>
						{#if scored && topDoc === d && phase === 'answer'}
							<span class="badge">{tx.attached}</span>
						{/if}
					</div>
					<p class="dbody">{tx.docs[d].body.replace('{days}', String(days))}</p>
					{#if useDocs}
						<small class="vector-label">{tx.chunkLabel}, {tx.vectorLabel}</small>
						<code class="vector">[{vector(d).join(', ')}]</code>
					{/if}
					{#if d === 'refund'}
						<div class="days" role="group" aria-label={tx.daysLabel}>
							<button
								type="button"
								aria-label={tx.fewer}
								disabled={days === DAY_STEPS[0]}
								onclick={() => stepDays(-1)}>&minus;</button
							>
							<span class="dval">{days}</span>
							<button
								type="button"
								aria-label={tx.more}
								disabled={days === DAY_STEPS[DAY_STEPS.length - 1]}
								onclick={() => stepDays(1)}>+</button
							>
						</div>
					{/if}
					{#if scored && asked}
						<div class="score">
							<span class="track"
								><span
									class="fill"
									class:win={topDoc === d}
									style="width:{SCORE[asked.q][d] * 100}%"
								></span></span
							>
							<small>{tx.match.replace('{n}', pct(SCORE[asked.q][d]))}</small>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.index-note {
		margin: 6px 0 10px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.vector-label {
		display: block;
		font-size: 9px;
		color: var(--color-muted);
	}
	.vector {
		display: block;
		margin: 3px 0;
		font-size: 11px;
		color: var(--color-brand);
	}
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		width: 100%;
		max-width: 360px;
	}
	.qs {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.qchip {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 11px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.qchip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-ink);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.row :global(.cta) {
		padding: 9px 18px;
		font-size: 13px;
	}
	.seg {
		display: flex;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.seg button {
		border-radius: 9px;
		padding: 5px 10px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.seg button.on {
		background: var(--color-paper);
		color: var(--color-ink);
	}
	.seg button.rag.on {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	/* chat window, the phone the learner is typing into */
	.chat {
		width: 100%;
		max-width: 360px;
		border-radius: 18px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.06);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 7px;
		border-bottom: 1px solid var(--color-line);
		padding: 7px 12px;
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.25s ease;
	}
	.led.on {
		background: var(--color-grass);
	}
	.app {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.msgs {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-height: 118px;
		padding: 10px 12px 12px;
	}
	.msg {
		max-width: 88%;
		border-radius: 14px;
		padding: 7px 10px;
		font-size: 12.5px;
		line-height: 1.38;
		animation: msgin 0.3s ease;
	}
	.msg.you {
		align-self: flex-end;
		border-bottom-right-radius: 4px;
		background: var(--color-brand);
		color: #fff;
	}
	.msg.ai {
		align-self: flex-start;
		border-bottom-left-radius: 4px;
		background: var(--color-paper);
		color: var(--color-ink);
		border: 1.5px solid var(--color-line);
	}
	.msg.ai.guess {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
	}
	.msg.ai.grounded {
		border-color: color-mix(in srgb, var(--color-grass) 55%, var(--color-line));
	}
	.searching {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-muted) !important;
	}
	.dots {
		display: flex;
		gap: 3px;
	}
	.dots i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-faint);
		animation: blink 1s ease-in-out infinite;
	}
	.dots i:nth-child(2) {
		animation-delay: 0.15s;
	}
	.dots i:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}
	.tag {
		display: inline-block;
		margin-top: 5px;
		border-radius: 999px;
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 700;
	}
	.guess .tag {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.grounded .tag {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	@keyframes msgin {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
	}

	/* the documents */
	.shelf {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 100%;
		max-width: 360px;
		transition: opacity 0.3s ease;
	}
	.shelf.hidden-docs .docs {
		opacity: 0.5;
	}
	.stitle {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.docs {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		width: 100%;
		transition: opacity 0.3s ease;
	}
	.doc {
		display: flex;
		flex-direction: column;
		gap: 3px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 9px;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.doc.top {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.dhead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}
	.dhead b {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.badge {
		border-radius: 999px;
		background: var(--color-grass);
		padding: 0 6px;
		font-size: 9px;
		font-weight: 700;
		color: #fff;
		animation: msgin 0.3s ease;
	}
	.dbody {
		font-size: 10px;
		line-height: 1.35;
		color: var(--color-muted);
	}
	.days {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 2px;
	}
	.days button {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 7px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.days button:disabled {
		opacity: 0.35;
	}
	.dval {
		min-width: 18px;
		font-size: 12px;
		font-weight: 800;
		color: var(--color-brand);
		text-align: center;
		font-variant-numeric: tabular-nums;
	}
	.score {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 2px;
	}
	.track {
		flex: 1;
		height: 6px;
		border-radius: 999px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--color-faint);
		animation: grow 0.9s ease backwards;
	}
	.fill.win {
		background: var(--color-grass);
	}
	@keyframes grow {
		from {
			width: 0;
		}
	}
	.score small {
		flex: none;
		font-size: 9px;
		font-weight: 700;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	:global(.dark) .chat {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.msg,
		.badge,
		.fill,
		.dots i {
			animation: none;
		}
		.doc,
		.docs,
		.led {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.controls,
		.chat,
		.shelf {
			max-width: 420px;
		}
		.msg {
			font-size: 13.5px;
		}
		.dbody {
			font-size: 11px;
		}
	}
</style>
