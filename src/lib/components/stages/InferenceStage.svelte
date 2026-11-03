<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { InferenceText } from '$lib/chapters/ai/inference/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as InferenceText);

	// ---- the model, a tiny word counting spam filter (naive Bayes) ----
	type Model = {
		spam: Map<string, number>;
		ham: Map<string, number>;
		total: { spam: number; ham: number };
		docs: { spam: number; ham: number };
		vocab: Set<string>;
	};
	const words = (s: string) => s.toLowerCase().match(/\p{L}+/gu) ?? [];

	// Training. Read every labelled email and count its words per group.
	function train(examples: { text: string; spam: boolean }[]): Model {
		const m: Model = {
			spam: new Map(),
			ham: new Map(),
			total: { spam: 0, ham: 0 },
			docs: { spam: 0, ham: 0 },
			vocab: new Set()
		};
		for (const e of examples) {
			const k = e.spam ? 'spam' : 'ham';
			m.docs[k]++;
			for (const w of words(e.text)) {
				m[k].set(w, (m[k].get(w) ?? 0) + 1);
				m.total[k]++;
				m.vocab.add(w);
			}
		}
		return m;
	}

	// Inference. Each known word nudges the score toward spam or not spam, unknown words count for nothing.
	function classify(m: Model, msg: string) {
		const v = m.vocab.size;
		let s = Math.log(m.docs.spam / m.docs.ham);
		for (const w of words(msg)) {
			if (!m.vocab.has(w)) continue;
			s += Math.log(((m.spam.get(w) ?? 0) + 1) / (m.total.spam + v));
			s -= Math.log(((m.ham.get(w) ?? 0) + 1) / (m.total.ham + v));
		}
		return s > 0;
	}

	// ---- training, played slowly with meters at a big model's real scale ----
	const DAYS = 34;
	const MILLIONS = 4.2;
	const TRAIN_MS = 5200;

	let phase = $state<'idle' | 'training' | 'ready'>('idle');
	let progress = $state(0);
	let model = $state.raw<Model | null>(null);
	let timer: ReturnType<typeof setInterval> | undefined;

	const total = $derived(tx.examples.length);
	const readingIdx = $derived(Math.min(total - 1, Math.floor(progress * total)));
	const days = $derived(Math.round(progress * DAYS));
	const cost = $derived(
		tx.costValue.replace('{n}', (progress * MILLIONS).toFixed(1).replace('.', tx.decimal))
	);

	function startTraining() {
		if (phase !== 'idle') return;
		phase = 'training';
		onstate?.('training');
		const reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		const length = reduced ? 1200 : TRAIN_MS;
		const t0 = Date.now();
		timer = setInterval(() => {
			progress = Math.min(1, (Date.now() - t0) / length);
			if (progress >= 1) {
				clearInterval(timer);
				model = train(tx.examples);
				phase = 'ready';
				onstate?.('trained');
			}
		}, 60);
	}
	onDestroy(() => clearInterval(timer));

	// ---- inference, one question at a time, then a thousand ----
	type Answer = { id: number; msg: string; spam: boolean; ms: number };
	let answers = $state<Answer[]>([]);
	let asked = $state(0);
	let draft = $state('');
	let busy = $state(false);
	let rush = $state<number | null>(null);
	let nextId = 0;
	let saidAsk = false;
	let saidTyped = false;
	let completed = false;
	let blink: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(blink));

	const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());
	const timeText = (ms: number) =>
		ms < 1 ? tx.fast : tx.ms.replace('{n}', String(Math.round(ms * 10) / 10));

	function flash() {
		busy = true;
		clearTimeout(blink);
		blink = setTimeout(() => (busy = false), 220);
	}

	function ask(msg: string, typed: boolean) {
		const clean = msg.trim().slice(0, 80);
		if (!model || !clean) return;
		const t0 = now();
		const spam = classify(model, clean);
		const ms = now() - t0;
		answers = [{ id: nextId++, msg: clean, spam, ms }, ...answers].slice(0, 3);
		asked++;
		flash();
		if (typed && !saidTyped) {
			saidTyped = true;
			onstate?.('typed');
		} else if (!saidAsk) {
			saidAsk = true;
			onstate?.('ask');
		}
	}

	function submit(e: SubmitEvent) {
		e.preventDefault();
		ask(draft, true);
		draft = '';
	}

	function sendThousand() {
		if (!model) return;
		const qs = tx.questions;
		const t0 = now();
		for (let i = 0; i < 1000; i++) classify(model, qs[i % qs.length]);
		rush = now() - t0;
		asked += 1000;
		flash();
		if (!completed) {
			completed = true;
			onstate?.('rush');
			oncomplete?.();
		}
	}
</script>

<div class="stage">
	{#if phase !== 'ready'}
		<section class="card">
			<span class="cap">{tx.trainTitle}</span>
			{#if phase === 'idle'}
				<CallToActionButton onclick={startTraining}>{tx.trainBtn}</CallToActionButton>
			{:else}
				{@const ex = tx.examples[readingIdx]}
				<div class="bar"><span class="fill" style="transform:scaleX({progress})"></span></div>
				<p class="reading">
					{tx.reading.replace('{n}', String(readingIdx + 1)).replace('{total}', String(total))}
				</p>
				<p class="email">
					<span class="tag" class:spam={ex.spam}>{ex.spam ? tx.spamTag : tx.hamTag}</span>
					{ex.text}
				</p>
			{/if}
			<div class="meters">
				<div class="meter">
					<span>{tx.days}</span>
					<b>{tx.daysValue.replace('{n}', String(days))}</b>
				</div>
				<div class="meter">
					<span>{tx.cost}</span>
					<b>{cost}</b>
				</div>
			</div>
			<span class="sub">{tx.scaleNote}</span>
		</section>
	{:else}
		<p class="summary">
			{tx.trainedOnce
				.replace('{days}', String(DAYS))
				.replace('{cost}', tx.costValue.replace('{n}', String(MILLIONS).replace('.', tx.decimal)))}
		</p>
	{/if}

	<section class="card" class:dim={phase !== 'ready'}>
		<span class="cap">{tx.inferTitle}</span>
		<div class="duo">
			<!-- you, holding a phone full of questions -->
			<div class="phone">
				<span class="who">{tx.you}</span>
				<div class="screen">
					{#each tx.questions as q (q)}
						<button
							type="button"
							class="q"
							disabled={phase !== 'ready'}
							onclick={() => ask(q, false)}>{q}</button
						>
					{/each}
					<form class="typed" onsubmit={submit}>
						<input
							type="text"
							maxlength="80"
							bind:value={draft}
							placeholder={tx.placeholder}
							aria-label={tx.placeholder}
							disabled={phase !== 'ready'}
						/>
						<button type="submit" disabled={phase !== 'ready' || !draft.trim()}>{tx.askBtn}</button>
					</form>
				</div>
			</div>

			<!-- the server, with the frozen model file on it -->
			<div class="host">
				<Server slots={3} active={busy} />
				<span class="who">{tx.server}</span>
				{#if model}
					<div class="file">
						<b>{tx.modelFile}</b>
						<span>{tx.modelInfo.replace('{n}', String(model.vocab.size))}</span>
						<span class="ice">{tx.frozen}</span>
					</div>
				{/if}
			</div>
		</div>

		{#if phase === 'ready'}
			<p class="hint">{tx.askHint}</p>
		{/if}

		{#if answers.length}
			<ul class="answers">
				{#each answers as a (a.id)}
					<li>
						<span class="msg">{a.msg}</span>
						<span class="verdict" class:spam={a.spam}>{a.spam ? tx.spam : tx.ham}</span>
						<span class="time">{timeText(a.ms)}</span>
					</li>
				{/each}
			</ul>
		{/if}

		{#if asked > 0}
			<div class="foot">
				<span class="count">{tx.answered.replace('{n}', String(asked))}</span>
				{#if rush === null}
					<button type="button" class="rush" onclick={sendThousand}>{tx.rushBtn}</button>
				{:else}
					<b class="rushed">{tx.rushDone.replace('{time}', timeText(rush))}</b>
				{/if}
			</div>
		{/if}
	</section>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-width: 360px;
		margin: 0 auto;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 8px;
	}
	.stage :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.card {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
		transition: opacity 0.25s ease;
	}
	.card.dim {
		opacity: 0.5;
	}
	.cap {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.sub,
	.hint {
		font-size: 11px;
		color: var(--color-faint);
		text-align: center;
	}
	.bar {
		width: 100%;
		height: 10px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		width: 100%;
		border-radius: inherit;
		background: var(--color-brand);
		transform-origin: left;
	}
	.reading {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.email {
		display: flex;
		max-width: 100%;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		color: var(--color-ink);
	}
	.tag {
		flex: none;
		border-radius: 999px;
		padding: 1px 7px;
		font-size: 10px;
		font-weight: 700;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.tag.spam {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.meters {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.meter {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		background: var(--color-paper);
		padding: 6px;
	}
	.meter span {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.meter b {
		font-size: 14px;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.summary {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 4px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-brand);
		text-align: center;
	}

	.duo {
		display: flex;
		width: 100%;
		align-items: flex-start;
		justify-content: center;
		gap: 12px;
	}
	.phone {
		display: flex;
		min-width: 0;
		flex: 1;
		max-width: 210px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.who {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.screen {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
		border-radius: 18px;
		border: 2px solid var(--color-ink);
		background: var(--color-paper);
		padding: 10px 7px;
	}
	.q {
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 8px;
		font-size: 11px;
		line-height: 1.25;
		color: var(--color-ink);
		text-align: left;
		transition: border-color 0.15s ease;
	}
	.q:not(:disabled):hover {
		border-color: var(--color-brand);
	}
	.q:disabled {
		cursor: default;
	}
	.typed {
		display: flex;
		gap: 4px;
	}
	.typed input {
		min-width: 0;
		flex: 1;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 7px;
		font-size: 11px;
		color: var(--color-ink);
	}
	.typed input:focus {
		border-color: var(--color-brand);
		outline: none;
	}
	.typed button {
		border-radius: 10px;
		background: var(--color-ink);
		padding: 5px 9px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-paper);
	}
	.typed button:disabled {
		opacity: 0.4;
	}
	.host {
		display: flex;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding-top: 20px;
	}
	.file {
		display: flex;
		width: 96px;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		border: 1.5px solid var(--color-brand);
		background: var(--color-brand-soft);
		padding: 5px 4px;
		font-size: 10px;
		line-height: 1.3;
		color: var(--color-muted);
		text-align: center;
		animation: land 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.file b {
		font-size: 11px;
		color: var(--color-brand);
	}
	.ice {
		color: var(--color-faint);
	}
	@keyframes land {
		from {
			transform: translateY(-24px);
			opacity: 0;
		}
	}

	.answers {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.answers li {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		background: var(--color-paper);
		padding: 5px 8px;
		font-size: 11px;
		animation: land 0.3s ease both;
	}
	.msg {
		overflow: hidden;
		color: var(--color-ink);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.verdict {
		border-radius: 999px;
		padding: 1px 7px;
		font-weight: 700;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.verdict.spam {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.time {
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.count {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.rush {
		border-radius: 999px;
		border: 1.5px solid var(--color-brand);
		padding: 4px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.rush:hover {
		background: var(--color-brand-soft);
	}
	.rushed {
		font-size: 12.5px;
		color: var(--color-grass);
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.q {
			transition: none;
		}
		.file,
		.answers li {
			animation: none;
		}
	}
</style>
