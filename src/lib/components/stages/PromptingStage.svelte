<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { Ingredient, PromptingText } from '$lib/chapters/ai/prompting/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as PromptingText);

	const ORDER: Ingredient[] = ['task', 'audience', 'format', 'example'];

	let added = $state<Record<Ingredient, boolean>>({
		task: false,
		audience: false,
		format: false,
		example: false
	});
	/** What the prompt held when it was last sent, null before the first send. */
	let sent = $state<Record<Ingredient, boolean> | null>(null);
	let shown = $state(0); // how many characters of the answer are revealed so far
	let timer: ReturnType<typeof setInterval> | undefined;
	let done = false;

	$effect(() => () => clearInterval(timer));

	const promptLines = $derived([
		{ id: 'task', text: added.task ? tx.ingredients.task.line : tx.basePrompt, on: added.task },
		...ORDER.slice(1)
			.filter((k) => added[k])
			.map((k) => ({ id: k, text: tx.ingredients[k].line, on: true }))
	]);
	const changed = $derived(sent !== null && ORDER.some((k) => sent?.[k] !== added[k]));

	/** The pretend AI glues its answer together from what the prompt actually said. */
	function compose(p: Record<Ingredient, boolean>): string {
		const a = tx.answer;
		const parts = [
			p.audience ? a.openAudience : p.task ? a.openTask : a.openVague,
			p.task ? a.bodyTask : a.bodyVague
		];
		if (!p.format) parts.push(a.ramble);
		if (p.example) parts.push(a.signoff);
		parts.push(
			p.format
				? p.task
					? a.tagsOne
					: a.tagsVague.split(' ')[0]
				: p.task
					? a.tagsMany
					: a.tagsVague
		);
		return parts.join('\n');
	}

	const answer = $derived(sent ? compose(sent) : '');
	const met = $derived(sent ? ORDER.filter((k) => sent?.[k]).length : 0);

	function toggle(k: Ingredient) {
		added[k] = !added[k];
	}

	function send() {
		const snap = { ...added };
		sent = snap;
		clearInterval(timer);
		const full = compose(snap).length;
		const reduce =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) shown = full;
		else {
			shown = 0;
			timer = setInterval(() => {
				shown = Math.min(full, shown + 4);
				if (shown >= full) clearInterval(timer);
			}, 16);
		}

		const n = ORDER.filter((k) => snap[k]).length;
		if (n === 0) onstate?.('vague');
		else if (n === ORDER.length) {
			onstate?.('perfect');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		} else {
			const miss = ORDER.find((k) => !snap[k]);
			onstate?.(`miss_${miss}`);
		}
	}
</script>

<div class="stage">
	<!-- what is in your head, which the AI cannot see -->
	<div class="goal">
		<span class="gtitle">{tx.goalTitle}</span>
		<p class="gtext">{tx.goal}</p>
		<div class="wishes">
			{#each ORDER as k (k)}
				{@const st = sent ? (sent[k] ? 'ok' : 'no') : 'idle'}
				<span class="wish {st}">
					<i aria-hidden="true">{st === 'ok' ? '✓' : st === 'no' ? '✗' : ''}</i>
					{tx.wishes[k]}
				</span>
			{/each}
		</div>
	</div>

	<!-- ingredients to add to the prompt -->
	<div class="chips" role="group" aria-label={tx.addHint}>
		{#each ORDER as k (k)}
			<button
				type="button"
				class="chip"
				class:on={added[k]}
				aria-pressed={added[k]}
				onclick={() => toggle(k)}
			>
				<span class="plus" aria-hidden="true">{added[k] ? '✓' : '+'}</span>
				{tx.ingredients[k].chip}
			</button>
		{/each}
	</div>

	<!-- the prompt itself, growing as ingredients are added -->
	<div class="prompt">
		<span class="plabel">{tx.promptLabel}</span>
		<div class="lines">
			{#each promptLines as l (l.id)}
				<p class="line" class:on={l.on}>{l.text}</p>
			{/each}
		</div>
	</div>

	<div class="acts">
		<CallToActionButton onclick={send} waiting={sent !== null && !changed}
			>{tx.sendBtn}</CallToActionButton
		>
		{#if sent}
			<span class="score" class:full={met === 4}>{tx.score.replace('{n}', String(met))}</span>
		{:else}
			<span class="hint">{tx.addHint}</span>
		{/if}
	</div>

	<!-- the AI's reply -->
	{#if sent}
		<div class="reply" aria-live="polite">
			<span class="who">{tx.ai}</span>
			<p class="atext">{answer.slice(0, shown)}</p>
		</div>
	{/if}
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.goal {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: 100%;
		max-width: 360px;
		border-radius: 16px;
		border: 1.5px solid color-mix(in srgb, var(--color-amber) 45%, var(--color-line));
		background: var(--color-amber-soft);
		padding: 10px 12px;
	}
	.gtitle {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.gtext {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		text-align: center;
		line-height: 1.3;
	}
	.wishes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 4px 6px;
		width: 100%;
	}
	.wish {
		display: flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		background: var(--color-card);
		padding: 3px 9px 3px 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
		transition: color 0.25s ease;
	}
	.wish i {
		display: grid;
		place-items: center;
		flex: none;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		font-size: 9px;
		font-style: normal;
		font-weight: 800;
		color: #fff;
		transition:
			background 0.25s ease,
			border-color 0.25s ease;
	}
	.wish.ok {
		color: var(--color-ink);
	}
	.wish.ok i {
		background: var(--color-grass);
		border-color: var(--color-grass);
	}
	.wish.no i {
		background: var(--color-danger);
		border-color: var(--color-danger);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		display: flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 12px 5px 6px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chip:hover {
		border-color: color-mix(in srgb, var(--color-brand) 40%, var(--color-line));
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.plus {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-paper);
		font-size: 12px;
		color: var(--color-brand);
	}
	.chip.on .plus {
		background: var(--color-brand);
		color: #fff;
		font-size: 10px;
	}

	.prompt {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 100%;
		max-width: 360px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px 10px;
	}
	.plabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.lines {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.line {
		font-size: 12.5px;
		line-height: 1.35;
		color: var(--color-muted);
		animation: linein 0.3s ease;
	}
	.line.on {
		color: var(--color-ink);
		border-left: 2.5px solid var(--color-brand);
		padding-left: 7px;
	}
	@keyframes linein {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	.acts {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.acts :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.hint {
		font-size: 11.5px;
		color: var(--color-faint);
		text-align: center;
	}
	.score {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.score.full {
		color: var(--color-grass);
	}

	.reply {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		max-width: 360px;
		min-height: 90px;
		border-radius: 16px 16px 16px 4px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		padding: 9px 12px 10px;
	}
	.who {
		align-self: flex-start;
		border-radius: 999px;
		background: var(--color-ink);
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-paper);
	}
	.atext {
		white-space: pre-line;
		font-size: 12.5px;
		line-height: 1.4;
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.line {
			animation: none;
		}
		.wish,
		.wish i,
		.chip {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.goal,
		.prompt,
		.reply {
			max-width: 420px;
		}
		.gtext {
			font-size: 14px;
		}
		.line,
		.atext {
			font-size: 13.5px;
		}
	}
</style>
