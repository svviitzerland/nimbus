<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { Guess, LlmText } from '$lib/chapters/ai/llm/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as LlmText);

	const MAX_CHARS = 64;
	const MAX_WORDS = 18;
	const TINTS = ['brand', 'amber', 'grass'];

	// null until the learner types or picks, so the first starter follows the language
	let typed = $state<string | null>(null);
	const sentence = $derived(typed ?? tx.presets[0]);
	let temp = $state(1);
	let picks = $state(0);
	let fresh = $state(-1); // index of the token that was just added, so it can pop in
	let tempTouched = false;
	let zone: 'cold' | 'mid' | 'hot' = 'mid';
	let saidSurprise = false;
	let done = false;

	const isPunct = (w: string) => !/[\p{L}\p{N}]/u.test(w);

	/** Whole words and punctuation marks, in order. */
	const words = $derived(sentence.match(/[\p{L}\p{N}']+|[^\s\p{L}\p{N}']/gu) ?? []);

	/** Cut one word into its pieces, keeping the learner's capital letters. */
	function pieces(w: string): string[] {
		const plan = tx.splits[w.toLowerCase()];
		const lens = plan
			? plan.map((p) => p.length)
			: w.length > 8
				? Array.from({ length: Math.ceil(w.length / 4) }, () => 4)
				: [w.length];
		const out: string[] = [];
		let at = 0;
		for (const n of lens) {
			if (at >= w.length) break;
			out.push(w.slice(at, at + n));
			at += n;
		}
		if (at < w.length) out[out.length - 1] += w.slice(at);
		// a tiny leftover reads better glued to the piece before it
		if (out.length > 1 && out[out.length - 1].length < 2) out[out.length - 2] += out.pop();
		return out;
	}

	/** A stable made up number for each token, like a real vocabulary id. */
	function tokenId(t: string) {
		let h = 7;
		for (const ch of t) h = (h * 31 + (ch.codePointAt(0) ?? 0)) % 49_000;
		return h + 1000;
	}

	const groups = $derived.by(() => {
		let k = 0;
		return words.map((w) => ({
			punct: isPunct(w),
			toks: pieces(w).map((t) => ({ t, id: tokenId(t), k: k++ }))
		}));
	});
	const count = $derived(groups.reduce((n, g) => n + g.toks.length, 0));
	const wordCount = $derived(words.filter((w) => !isPunct(w)).length);
	const full = $derived(wordCount >= MAX_WORDS);

	/** The whole "model", look at the last word and read its row of guesses. */
	const guesses = $derived.by((): { tok: string; p: number }[] => {
		const last = words.at(-1);
		const key = !last ? '.' : isPunct(last) ? '.' : last.toLowerCase();
		const row: Guess[] = tx.table[key] ?? tx.fallback;
		// temperature reshapes the chances, p is proportional to weight to the power 1/T
		const raw = row.map(([tok, w]) => ({ tok, s: Math.pow(w, 1 / temp) }));
		const sum = raw.reduce((n, r) => n + r.s, 0);
		return raw.map((r) => ({ tok: r.tok, p: r.s / sum })).sort((a, b) => b.p - a.p);
	});

	function setSentence(s: string, emit: boolean) {
		typed = s.slice(0, MAX_CHARS);
		fresh = -1;
		if (emit) onstate?.('typed');
	}

	function pick() {
		if (full) return;
		const list = guesses;
		let r = Math.random();
		let idx = list.length - 1;
		for (let i = 0; i < list.length; i++) {
			r -= list[i].p;
			if (r <= 0) {
				idx = i;
				break;
			}
		}
		const tok = list[idx].tok;
		const base = sentence.trimEnd();
		const before = count;
		typed = base === '' ? tok : isPunct(tok) ? base + tok : `${base} ${tok}`;
		fresh = before;
		picks += 1;

		if (picks >= 3 && tempTouched && !done) {
			done = true;
			onstate?.('done');
			oncomplete?.();
		} else if (idx > 0 && !saidSurprise) {
			saidSurprise = true;
			onstate?.('surprise');
		} else if (picks === 1) {
			onstate?.('pick');
		}
	}

	function setTemp(v: number) {
		temp = v;
		tempTouched = true;
		const z = v <= 0.35 ? 'cold' : v >= 1.6 ? 'hot' : 'mid';
		if (z !== zone) {
			zone = z;
			if (z !== 'mid') onstate?.(z);
		}
	}

	function reset() {
		typed = null;
		temp = 1;
		zone = 'mid';
		fresh = -1;
	}

	const pct = (p: number) => (p >= 0.995 ? '99' : p < 0.005 ? '0' : String(Math.round(p * 100)));
</script>

<div class="stage">
	<!-- the sentence, typed or picked from a starter -->
	<div class="top">
		<div class="presets">
			{#each tx.presets as p (p)}
				<button
					type="button"
					class="preset"
					class:on={sentence === p}
					onclick={() => setSentence(p, true)}>{p}</button
				>
			{/each}
		</div>
		<input
			class="sentence"
			type="text"
			value={sentence}
			maxlength={MAX_CHARS}
			autocomplete="off"
			spellcheck="false"
			aria-label={tx.inputLabel}
			oninput={(e) => setSentence((e.currentTarget as HTMLInputElement).value, false)}
			onchange={() => onstate?.('typed')}
		/>
	</div>

	<!-- the same sentence, cut into tokens, each with its number -->
	<p class="context-label">{tx.contextLabel}</p>
	<div class="tokens" aria-live="polite">
		{#each groups as g, gi (gi)}
			<span class="word" class:punct={g.punct}>
				{#each g.toks as t (t.k)}
					<span
						class="tok {TINTS[t.k % 3]}"
						class:outside={t.k < count - 8}
						class:fresh={t.k >= fresh && fresh >= 0}
					>
						<b>{t.t}</b>
						<small>{t.id}</small>
					</span>
				{/each}
			</span>
		{/each}
	</div>
	<p class="context-note">{tx.contextNote}</p>
	<p class="note">
		<span class="count">{tx.tokensCount.replace('{n}', String(count))}</span>
		<span>{tx.idsNote}</span>
	</p>

	<div class="acts">
		<CallToActionButton onclick={pick} disabled={full}>{tx.pickBtn}</CallToActionButton>
		<button type="button" class="reset" onclick={reset}>{tx.reset}</button>
	</div>
	{#if full}<p class="full">{tx.full}</p>{/if}

	<!-- the model's top guesses, reshaped live by the temperature -->
	<div class="card">
		<span class="ctitle">{tx.nextTitle}</span>
		<div class="bars">
			{#each guesses as g, i (g.tok)}
				<div class="row" class:top={i === 0}>
					<span class="gtok">{g.tok}</span>
					<span class="track"><span class="fill" style="width:{g.p * 100}%"></span></span>
					<span class="pct">{pct(g.p)}%</span>
				</div>
			{/each}
		</div>
		<div class="temp">
			<label for="llm-temp">{tx.tempLabel}</label>
			<div class="trow">
				<span class="end">{tx.tempCold}</span>
				<input
					id="llm-temp"
					type="range"
					min="0.2"
					max="2"
					step="0.1"
					value={temp}
					class:hot={temp >= 1.6}
					oninput={(e) => setTemp(Number((e.currentTarget as HTMLInputElement).value))}
				/>
				<span class="end">{tx.tempHot}</span>
				<span class="tval" class:hot={temp >= 1.6}>{temp.toFixed(1)}</span>
			</div>
		</div>
	</div>
</div>

<style>
	.context-label {
		color: var(--color-ink);
		font-size: 12px;
		font-weight: 650;
	}
	.context-note {
		max-width: 420px;
		text-align: center;
		color: var(--color-muted);
		font-size: 11px;
	}
	.tok.outside {
		opacity: 0.4;
		filter: grayscale(1);
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
	.top {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
		width: 100%;
		max-width: 360px;
	}
	.presets {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.preset {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 11px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}
	.preset:hover {
		color: var(--color-ink);
	}
	.preset.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-ink);
	}
	.sentence {
		width: 100%;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		text-align: center;
	}
	.sentence:focus {
		border-color: var(--color-brand);
		outline: none;
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 18%, transparent);
	}

	/* tokens */
	.tokens {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: flex-start;
		gap: 6px 7px;
		width: 100%;
		max-width: 380px;
		min-height: 40px;
	}
	.word {
		display: flex;
		gap: 2px;
	}
	.word.punct {
		margin-left: -4px;
	}
	.tok {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 8px;
		padding: 3px 7px 2px;
		line-height: 1.15;
		border: 1.5px solid transparent;
	}
	.tok b {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		white-space: pre;
	}
	.tok small {
		font-size: 8.5px;
		font-weight: 600;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.tok.brand {
		background: var(--color-brand-soft);
		border-color: color-mix(in srgb, var(--color-brand) 25%, transparent);
	}
	.tok.amber {
		background: var(--color-amber-soft);
		border-color: color-mix(in srgb, var(--color-amber) 30%, transparent);
	}
	.tok.grass {
		background: var(--color-grass-soft);
		border-color: color-mix(in srgb, var(--color-grass) 28%, transparent);
	}
	.tok.fresh {
		border-color: var(--color-ink);
		animation: pop 0.4s cubic-bezier(0.3, 1.5, 0.5, 1);
	}
	@keyframes pop {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
	}
	.note {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 4px 8px;
		max-width: 340px;
		font-size: 11px;
		color: var(--color-faint);
		text-align: center;
	}
	.count {
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 1px 8px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
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
	.reset {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 6px 8px;
	}
	.reset:hover {
		color: var(--color-ink);
	}
	.full {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-amber);
	}

	/* the guesses */
	.card {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 340px;
		border-radius: 16px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.06);
	}
	.ctitle {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
		text-align: center;
	}
	.bars {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.row {
		display: grid;
		grid-template-columns: 72px 1fr 36px;
		align-items: center;
		gap: 8px;
	}
	.gtok {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: right;
	}
	.row.top .gtok {
		color: var(--color-ink);
		font-weight: 700;
	}
	.track {
		height: 10px;
		border-radius: 999px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-brand) 55%, var(--color-card));
		transition: width 0.35s ease;
	}
	.row.top .fill {
		background: var(--color-brand);
	}
	.pct {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
		text-align: right;
	}
	.temp {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-top: 1px solid var(--color-line);
		padding-top: 8px;
	}
	.temp label {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
		text-align: center;
	}
	.trow {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.trow input {
		flex: 1;
		min-width: 0;
		accent-color: var(--color-brand);
	}
	.trow input.hot {
		accent-color: var(--color-amber);
	}
	.end {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.tval {
		width: 26px;
		flex: none;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.tval.hot {
		color: var(--color-amber);
	}
	:global(.dark) .card {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.tok.fresh {
			animation: none;
		}
		.fill,
		.preset {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.top,
		.card {
			max-width: 400px;
		}
		.tokens {
			max-width: 460px;
		}
		.tok b {
			font-size: 14.5px;
		}
		.note {
			font-size: 12px;
		}
	}
</style>
