<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type {
		AiEthicsCase,
		AiEthicsChoice,
		AiEthicsText
	} from '$lib/chapters/ai/ai-ethics/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as AiEthicsText);

	/** The right call for each message. Language independent, so it lives here. */
	const ANSWER: Record<AiEthicsCase, AiEthicsChoice> = {
		news: 'send',
		cv: 'clean',
		key: 'clean',
		friend: 'keep',
		art: 'clean',
		bank: 'keep'
	};
	const CHOICES: AiEthicsChoice[] = ['send', 'clean', 'keep'];

	let idx = $state(0);
	let answered = $state<AiEthicsChoice | null>(null);
	let tried = $state<AiEthicsChoice[]>([]);
	let finished = $state(false);

	const item = $derived(tx.cases[idx]);
	const isLast = $derived(idx === tx.cases.length - 1);
	const went = $derived(answered === 'send' || answered === 'clean');

	function choose(c: AiEthicsChoice) {
		if (answered || finished) return;
		if (c === ANSWER[item.id]) {
			answered = c;
			onstate?.(item.id);
		} else {
			if (!tried.includes(c)) tried = [...tried, c];
			onstate?.(`${item.id}_wrong`);
		}
	}

	function next() {
		if (!answered) return;
		if (isLast) {
			finished = true;
			onstate?.('done');
			oncomplete?.();
			return;
		}
		idx++;
		answered = null;
		tried = [];
	}

	/** Split the draft into plain and risky parts, so the risky ones can be marked. */
	function pieces(s: string, secrets: string[]) {
		const out: { t: string; risky: boolean }[] = [];
		let rest = s;
		while (rest.length) {
			let at = -1;
			let hit = '';
			for (const sec of secrets) {
				const i = rest.indexOf(sec);
				if (i >= 0 && (at < 0 || i < at)) {
					at = i;
					hit = sec;
				}
			}
			if (at < 0) {
				out.push({ t: rest, risky: false });
				break;
			}
			if (at > 0) out.push({ t: rest.slice(0, at), risky: false });
			out.push({ t: hit, risky: true });
			rest = rest.slice(at + hit.length);
		}
		return out;
	}
	const parts = $derived(pieces(item.draft, item.secrets));
</script>

<div class="stage">
	<!-- progress through the six messages -->
	<div
		class="progress"
		aria-label={tx.progress
			.replace('{n}', String(idx + 1))
			.replace('{total}', String(tx.cases.length))}
	>
		{#each tx.cases as c, i (c.id)}
			<span
				class="pip"
				class:done={i < idx || finished || (i === idx && answered)}
				class:now={i === idx}
			></span>
		{/each}
		<span class="ptext"
			>{finished
				? tx.doneNote
				: tx.progress
						.replace('{n}', String(idx + 1))
						.replace('{total}', String(tx.cases.length))}</span
		>
	</div>

	<!-- the three calls, or the way forward once the right one is made -->
	<div class="actions">
		{#if answered && !finished}
			<CallToActionButton onclick={next}>{isLast ? tx.finishBtn : tx.nextBtn}</CallToActionButton>
		{:else if !finished}
			<div class="choices">
				{#each CHOICES as c (c)}
					<button
						type="button"
						class="choice {c}"
						class:tried={tried.includes(c)}
						disabled={tried.includes(c)}
						onclick={() => choose(c)}
					>
						<span class="ic" aria-hidden="true">
							<svg
								width="15"
								height="15"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								{#if c === 'send'}
									<path d="M4 12 20 4l-6 16-3-7-7-1Z" />
								{:else if c === 'clean'}
									<path d="M4 20h16M7 16l9.5-9.5a2.1 2.1 0 0 1 3 3L10 19H7v-3Z" />
								{:else}
									<circle cx="12" cy="12" r="8" /><path d="m6.5 6.5 11 11" />
								{/if}
							</svg>
						</span>
						{tx.choices[c]}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- the message about to be sent -->
	{#key idx}
		<div class="composer" class:kept={answered === 'keep'}>
			<div class="chead">
				<span class="cap">{tx.composerLabel}</span>
				<span class="context">{item.context}</span>
			</div>
			<p class="draft" class:struck={answered === 'clean'}>
				{#each parts as p, i (i)}{#if p.risky && answered}<mark>{p.t}</mark>{:else}{p.t}{/if}{/each}
			</p>
			{#if answered === 'clean'}
				<p class="cleaned">{item.cleaned}</p>
			{/if}
			{#if answered}
				<span class="stamp {answered}"
					>{answered === 'send'
						? tx.sentTag
						: answered === 'clean'
							? tx.cleanedTag
							: tx.keptTag}</span
				>
			{/if}
		</div>
	{/key}

	<!-- where a sent message travels -->
	<ol class="journey" class:went>
		{#each tx.journey as step, i (i)}
			<li style="--i:{i}">{step}</li>
		{/each}
	</ol>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.cap {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--color-faint);
	}

	.progress {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.pip {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.25s ease;
	}
	.pip.now {
		box-shadow: 0 0 0 2px var(--color-brand-soft);
		background: var(--color-brand);
	}
	.pip.done {
		background: var(--color-grass);
	}
	.ptext {
		margin-left: 6px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}

	.actions {
		display: flex;
		min-height: 46px;
		width: min(94vw, 440px);
		align-items: center;
		justify-content: center;
	}
	.actions :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.choices {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 6px;
	}
	.choice {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: 13px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 4px;
		font-size: 11.5px;
		font-weight: 700;
		line-height: 1.2;
		text-align: center;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			transform 0.15s ease;
	}
	.choice:not(:disabled):hover {
		transform: translateY(-1px);
	}
	.ic {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 9px;
		line-height: 0;
	}
	.send .ic {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.clean .ic {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.keep .ic {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.send:not(:disabled):hover {
		border-color: var(--color-grass);
	}
	.clean:not(:disabled):hover {
		border-color: var(--color-amber);
	}
	.keep:not(:disabled):hover {
		border-color: var(--color-danger);
	}
	.choice.tried {
		opacity: 0.4;
	}

	/* composer */
	.composer {
		position: relative;
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		gap: 6px;
		border-radius: 16px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px 12px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
		animation: rise 0.35s ease backwards;
	}
	:global(.dark) .composer {
		box-shadow: none;
	}
	.composer.kept {
		background: var(--color-paper);
	}
	.chead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.context {
		border-radius: 999px;
		background: var(--color-paper);
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.draft {
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.kept .draft {
		color: var(--color-faint);
	}
	.draft mark {
		border-radius: 4px;
		background: var(--color-danger-soft);
		padding: 0 2px;
		color: var(--color-danger);
		font-weight: 600;
	}
	.draft.struck {
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.draft.struck mark {
		text-decoration: line-through;
	}
	.cleaned {
		border-radius: 10px;
		background: var(--color-grass-soft);
		padding: 7px 9px;
		font-size: 13px;
		line-height: 1.5;
		color: var(--color-ink);
		overflow-wrap: anywhere;
		animation: rise 0.35s ease backwards;
	}
	.stamp {
		align-self: flex-end;
		border-radius: 999px;
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 800;
		color: #fff;
		animation: pop 0.35s cubic-bezier(0.3, 1.5, 0.5, 1) backwards;
	}
	.stamp.send {
		background: var(--color-grass);
	}
	.stamp.clean {
		background: var(--color-amber);
	}
	.stamp.keep {
		background: var(--color-danger);
	}

	/* journey */
	.journey {
		display: grid;
		width: min(94vw, 440px);
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
	}
	.journey li {
		position: relative;
		display: grid;
		min-height: 36px;
		place-items: center;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px;
		font-size: 9.5px;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
		color: var(--color-faint);
	}
	.journey li + li::before {
		content: '';
		position: absolute;
		top: 50%;
		left: -12px;
		width: 10px;
		height: 2px;
		border-radius: 1px;
		background: var(--color-line);
	}
	.journey.went li {
		animation: light 0.4s ease forwards;
		animation-delay: calc(var(--i) * 0.25s);
	}
	@keyframes light {
		to {
			border-color: var(--color-brand);
			background: var(--color-brand-soft);
			color: var(--color-brand);
		}
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.6);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.composer,
		.cleaned,
		.stamp {
			animation: none;
		}
		.journey.went li {
			animation-duration: 0s;
			animation-delay: 0s;
		}
		.choice,
		.pip {
			transition: none;
		}
		.choice:not(:disabled):hover {
			transform: none;
		}
	}

	@media (min-width: 768px) {
		.actions,
		.composer,
		.journey {
			width: min(94vw, 500px);
		}
		.choice {
			font-size: 12.5px;
		}
		.journey li {
			font-size: 10.5px;
		}
	}
</style>
