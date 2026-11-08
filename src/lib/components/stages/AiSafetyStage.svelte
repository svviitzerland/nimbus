<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { AiSafetyDefense, AiSafetyText } from '$lib/chapters/ai/ai-safety/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as AiSafetyText);

	const FAKE = 2; // the made up sentence in the bot's answer
	const REAL: AiSafetyDefense[] = ['mark', 'strip', 'limit']; // the decoy is not one of them

	let act = $state<0 | 1>(0);

	// act one
	let tapped = $state<number[]>([]);
	const caught = $derived(tapped.includes(FAKE));
	function tapClaim(i: number) {
		if (caught || tapped.includes(i)) return;
		tapped = [...tapped, i];
		onstate?.(i === FAKE ? 'caught' : 'checked');
	}

	// act two
	let revealed = $state(false);
	let saidReveal = false;
	let on = $state<AiSafetyDefense[]>([]);
	let running = $state(false);
	let reply = $state<'none' | 'hijacked' | 'safe'>('none');
	let completed = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(timer));

	function toggleReveal() {
		revealed = !revealed;
		if (revealed && !saidReveal) {
			saidReveal = true;
			onstate?.('revealed');
		}
	}
	function toggleDefense(id: AiSafetyDefense) {
		if (running) return;
		on = on.includes(id) ? on.filter((d) => d !== id) : [...on, id];
	}
	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function run() {
		if (running) return;
		running = true;
		reply = 'none';
		timer = setTimeout(
			() => {
				running = false;
				const real = on.filter((d) => REAL.includes(d)).length;
				if (real >= 2) {
					reply = 'safe';
					onstate?.('safe');
					if (!completed) {
						completed = true;
						oncomplete?.();
					}
					return;
				}
				reply = 'hijacked';
				if (real === 1) onstate?.('onelayer');
				else if (on.includes('caps')) onstate?.('decoy');
				else onstate?.(saidReveal ? 'nodefense' : 'hijacked');
			},
			reduced() ? 0 : 900
		);
	}
</script>

{#snippet botIcon()}
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="4" y="7" width="16" height="12" rx="4" stroke="currentColor" stroke-width="2" />
		<path d="M12 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		<circle cx="9.5" cy="13" r="1.4" fill="currentColor" />
		<circle cx="14.5" cy="13" r="1.4" fill="currentColor" />
	</svg>
{/snippet}

<div class="stage">
	<div class="tabs" role="tablist">
		{#each tx.acts as name, i (i)}
			<button
				type="button"
				role="tab"
				class="tab"
				class:on={act === i}
				aria-selected={act === i}
				disabled={i === 1 && !caught}
				onclick={() => (act = i as 0 | 1)}
			>
				<span class="num">{i + 1}</span>{name}
			</button>
		{/each}
	</div>

	{#if act === 0}
		<div class="actions">
			{#if caught}
				<CallToActionButton onclick={() => (act = 1)}>{tx.nextAct}</CallToActionButton>
			{:else}
				<p class="hint">{tx.tapHint}</p>
			{/if}
		</div>

		<div class="chat">
			<div class="msg you">
				<span class="who">{tx.you}</span>
				<p>{tx.question}</p>
			</div>
			<div class="msg bot">
				<span class="who">{@render botIcon()}{tx.bot}</span>
				<div class="claims">
					{#each tx.claims as c, i (i)}
						{@const done = tapped.includes(i)}
						<button
							type="button"
							class="claim"
							class:ok={done && i !== FAKE}
							class:fake={done && i === FAKE}
							disabled={caught && !done}
							aria-pressed={done}
							onclick={() => tapClaim(i)}
						>
							{c}
							{#if done}
								<span class="tag">{i === FAKE ? tx.fakeTag : tx.okTag}</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="doc source">
			<span class="dtitle">{tx.sourceTitle}</span>
			<ul>
				{#each tx.sourceLines as l, i (i)}
					<li class:hit={caught && i === 2}>{l}</li>
				{/each}
			</ul>
		</div>
	{:else}
		<div class="actions">
			<div class="arow">
				<CallToActionButton onclick={run} disabled={running}>
					{running ? tx.thinking : tx.runBtn}
				</CallToActionButton>
				<button type="button" class="ghost" aria-pressed={revealed} onclick={toggleReveal}>
					{revealed ? tx.hideBtn : tx.revealBtn}
				</button>
			</div>
			<div class="defs">
				<span class="cap">{tx.defensesTitle}</span>
				<div class="dgrid">
					{#each tx.defenses as d (d.id)}
						<button
							type="button"
							class="def"
							class:on={on.includes(d.id)}
							aria-pressed={on.includes(d.id)}
							disabled={running}
							onclick={() => toggleDefense(d.id)}
						>
							<span class="box" aria-hidden="true">{on.includes(d.id) ? '✓' : ''}</span>
							<span class="dtxt"><b>{d.name}</b><small>{d.sub}</small></span>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="doc file">
			<span class="dtitle">{tx.docTitle}</span>
			{#each tx.docLines as l, i (i)}
				<p>{l}</p>
			{/each}
			<p
				class="hidden"
				class:shown={revealed}
				class:stripped={revealed && on.includes('strip')}
				aria-hidden={!revealed}
			>
				{#if revealed}<span class="htag">{tx.hiddenTag}</span>{/if}{tx.docHidden}
			</p>
		</div>

		<div class="chat">
			<div class="msg you">
				<span class="who">{tx.you}</span>
				<p>{tx.task}</p>
			</div>
			{#if running}
				<div class="msg bot">
					<span class="who">{@render botIcon()}{tx.bot}</span>
					<p class="dots" aria-label={tx.thinking}><i></i><i></i><i></i></p>
				</div>
			{:else if reply !== 'none'}
				<div class="msg bot" class:bad={reply === 'hijacked'} class:good={reply === 'safe'}>
					<span class="who"
						>{@render botIcon()}{tx.bot}
						<span class="rtag">{reply === 'safe' ? tx.safeTag : tx.hijackedTag}</span></span
					>
					<p>{reply === 'safe' ? tx.safeReply : tx.hijackedReply}</p>
				</div>
			{/if}
		</div>
	{/if}
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

	/* tabs */
	.tabs {
		display: flex;
		gap: 4px;
		border-radius: 13px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.tab {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.tab.on {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.tab:disabled {
		opacity: 0.45;
	}
	.num {
		display: grid;
		place-items: center;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: var(--color-paper);
		font-size: 10px;
		font-weight: 800;
	}

	/* actions */
	.actions {
		display: flex;
		width: min(94vw, 440px);
		min-height: 44px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.actions :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.arow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.ghost {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 14px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.ghost[aria-pressed='true'] {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.hint {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.defs {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.dgrid {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
	}
	.def {
		display: flex;
		align-items: flex-start;
		gap: 7px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 9px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.def.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.box {
		display: grid;
		flex: none;
		place-items: center;
		width: 16px;
		height: 16px;
		margin-top: 1px;
		border-radius: 5px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.def.on .box {
		border-color: var(--color-brand);
	}
	.dtxt {
		display: flex;
		min-width: 0;
		flex-direction: column;
		line-height: 1.2;
	}
	.dtxt b {
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.dtxt small {
		font-size: 9.5px;
		color: var(--color-faint);
	}

	/* chat */
	.chat {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		gap: 8px;
	}
	.msg {
		display: flex;
		max-width: 88%;
		flex-direction: column;
		gap: 4px;
		border-radius: 16px;
		padding: 8px 12px 10px;
		font-size: 12.5px;
		line-height: 1.45;
		animation: rise 0.3s ease backwards;
	}
	.msg.you {
		align-self: flex-end;
		border-bottom-right-radius: 5px;
		background: var(--color-brand);
		color: #fff;
	}
	.msg.you .who {
		color: rgba(255, 255, 255, 0.75);
	}
	.msg.bot {
		align-self: flex-start;
		border: 1px solid var(--color-line);
		border-bottom-left-radius: 5px;
		background: var(--color-card);
		color: var(--color-ink);
	}
	.msg.bot.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.msg.bot.good {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.who {
		display: flex;
		align-items: center;
		gap: 5px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.rtag {
		border-radius: 999px;
		padding: 1px 7px;
		font-size: 9.5px;
		color: #fff;
		background: var(--color-danger);
	}
	.good .rtag {
		background: var(--color-grass);
	}
	.claims {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.claim {
		border-radius: 9px;
		border: 1.5px solid transparent;
		padding: 4px 6px;
		margin: 0 -6px;
		text-align: left;
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--color-ink);
		transition:
			background 0.2s ease,
			border-color 0.2s ease;
	}
	.claim:not(:disabled):not(.ok):not(.fake):hover {
		background: var(--color-paper);
		border-color: var(--color-line);
	}
	.claim:disabled {
		opacity: 0.75;
	}
	.claim.ok {
		background: var(--color-grass-soft);
	}
	.claim.fake {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.tag {
		display: inline-block;
		margin-left: 4px;
		border-radius: 999px;
		padding: 0 7px;
		font-size: 9.5px;
		font-weight: 700;
		color: #fff;
		background: var(--color-grass);
		vertical-align: 1px;
	}
	.fake .tag {
		background: var(--color-danger);
	}
	.dots {
		display: flex;
		gap: 4px;
		padding: 4px 0;
	}
	.dots i {
		width: 6px;
		height: 6px;
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
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
	}

	/* documents */
	.doc {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		gap: 5px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--color-ink);
	}
	.dtitle {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.file .dtitle {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.source ul {
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding-left: 16px;
		list-style: disc;
	}
	.source li.hit {
		font-weight: 700;
		color: var(--color-danger);
	}
	/* white text on a white page, invisible until revealed */
	.hidden {
		font-size: 8px;
		line-height: 1.3;
		color: var(--color-card);
		user-select: all;
	}
	.hidden.shown {
		border-radius: 8px;
		background: var(--color-danger-soft);
		padding: 6px 8px;
		font-size: 11.5px;
		color: var(--color-danger);
	}
	.hidden.stripped {
		text-decoration: line-through;
		opacity: 0.6;
	}
	.htag {
		display: inline-block;
		margin-right: 6px;
		border-radius: 999px;
		padding: 0 7px;
		font-size: 9.5px;
		font-weight: 700;
		color: #fff;
		background: var(--color-danger);
		text-decoration: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.msg,
		.dots i {
			animation: none;
		}
		.tab,
		.def,
		.claim {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.chat,
		.doc,
		.actions {
			width: min(94vw, 500px);
		}
		.msg,
		.claim {
			font-size: 13.5px;
		}
	}
</style>
