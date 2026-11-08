<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { WhyFrameworkText } from '$lib/chapters/web/why-framework/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as WhyFrameworkText);

	const OLD = 12;
	const NEW = 9;
	const money = (n: number) => tx.money.replace('{n}', String(n));

	let mode = $state<'hand' | 'framework'>('hand');

	// By hand, every file holds its own copy of the price.
	let prices = $state<number[]>(Array(10).fill(OLD));
	let edits = $state(0);
	let published = $state<null | number>(null); // how many were missed on the last publish

	function edit(i: number) {
		if (prices[i] === NEW) return;
		prices[i] = NEW;
		edits += 1;
		published = null;
	}
	let handPublished = false;
	function publish() {
		const missed = prices.filter((p) => p !== NEW).length;
		published = missed;
		if (missed > 0) onstate?.('missed');
		else {
			handPublished = true;
			onstate?.('handDone');
			maybeFinish();
		}
	}
	function resetHand() {
		prices = Array(10).fill(OLD);
		edits = 0;
		published = null;
	}

	// With a framework, there is one price and every page reads it.
	let price = $state(OLD);
	let fwUsed = false;
	function setPrice(n: number) {
		price = Math.max(1, Math.min(30, n));
		if (!fwUsed) {
			fwUsed = true;
			onstate?.('framework');
		}
		maybeFinish();
	}

	let finished = false;
	function maybeFinish() {
		if (finished || !handPublished || !fwUsed) return;
		finished = true;
		oncomplete?.();
	}
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="tabs" role="tablist">
		<button
			type="button"
			role="tab"
			aria-selected={mode === 'hand'}
			class:on={mode === 'hand'}
			onclick={() => (mode = 'hand')}>{tx.modes.hand}</button
		>
		<button
			type="button"
			role="tab"
			aria-selected={mode === 'framework'}
			class:on={mode === 'framework'}
			onclick={() => (mode = 'framework')}>{tx.modes.framework}</button
		>
	</div>

	<p class="hint">{mode === 'hand' ? tx.handHint : tx.frameworkHint}</p>

	{#if mode === 'hand'}
		<div class="bar">
			<span class="count">{tx.edits.replace('{n}', String(edits))}</span>
			<button type="button" class="ghost" onclick={resetHand}>{tx.reset}</button>
			<button type="button" class="pub" onclick={publish}>{tx.publish}</button>
		</div>
		{#if published !== null}
			<p class="result" class:bad={published > 0}>
				{published > 0 ? tx.publishedMissed.replace('{n}', String(published)) : tx.publishedOk}
			</p>
		{/if}
		<div class="files">
			{#each tx.places as name, i (name)}
				<button
					type="button"
					class="file"
					class:done={prices[i] === NEW}
					class:stale={published !== null && published > 0 && prices[i] !== NEW}
					onclick={() => edit(i)}
				>
					<span class="fn">{name}</span>
					<span class="sk"><i></i><i></i></span>
					<span class="pr">{money(prices[i])}</span>
				</button>
			{/each}
		</div>
	{:else}
		<div class="store">
			<span class="code"
				><span class="kw">let</span> <span class="var">{tx.priceLabel}</span>
				<span class="pun">=</span></span
			>
			<button type="button" class="st" aria-label={tx.cheaper} onclick={() => setPrice(price - 1)}>
				<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"
					><path
						d="M2.5 6h7"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/></svg
				>
			</button>
			<span class="big">{price}</span>
			<button type="button" class="st" aria-label={tx.pricier} onclick={() => setPrice(price + 1)}>
				<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"
					><path
						d="M2.5 6h7M6 2.5v7"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
					/></svg
				>
			</button>
		</div>
		<div class="files">
			{#each tx.places as name (name)}
				<div class="file linked">
					<span class="fn">{name}</span>
					<span class="sk"><i></i><i></i></span>
					{#key price}
						<span class="pr flash">{money(price)}</span>
					{/key}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.tabs {
		display: inline-flex;
		padding: 3px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.tabs button {
		padding: 6px 14px;
		border-radius: 999px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.tabs button.on {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.hint {
		margin: 0;
		max-width: min(94vw, 400px);
		text-align: center;
		font-size: 12px;
		color: var(--color-muted);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		width: min(94vw, 400px);
	}
	.count {
		flex: 1;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		padding: 7px 11px;
		font-size: 12px;
		font-weight: 600;
	}
	.pub {
		border-radius: 10px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 8px 16px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.result {
		margin: 0;
		padding: 5px 12px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 12px;
		font-weight: 700;
	}
	.result.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.files {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6px;
		width: min(94vw, 400px);
	}
	@media (min-width: 640px) {
		.files {
			grid-template-columns: repeat(5, 1fr);
			width: min(94vw, 600px);
		}
	}
	.file {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		min-width: 0;
		padding: 7px 8px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		text-align: left;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	button.file:hover {
		border-color: var(--color-brand);
	}
	.file.done {
		border-color: var(--color-grass);
	}
	.file.stale {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.file.linked {
		border-color: var(--color-brand);
	}
	.fn {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.sk {
		display: flex;
		flex-direction: column;
		gap: 3px;
		width: 100%;
	}
	.sk i {
		height: 5px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.sk i:nth-child(2) {
		width: 60%;
	}
	.pr {
		padding: 1px 7px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 12px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}
	.done .pr {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.stale .pr {
		background: var(--color-card);
		color: var(--color-danger);
	}
	.linked .pr {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.flash {
		animation: pop 0.45s ease;
	}
	@keyframes pop {
		0% {
			transform: scale(1.25);
		}
		100% {
			transform: scale(1);
		}
	}
	.store {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 14px;
		border-radius: 14px;
		border: 1px solid var(--color-brand);
		background: var(--color-card);
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
	}
	.kw {
		color: var(--color-amber);
		font-weight: 600;
	}
	.var {
		color: var(--color-brand);
		font-weight: 600;
	}
	.pun {
		color: var(--color-faint);
	}
	.st {
		display: grid;
		place-items: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
	}
	.big {
		min-width: 30px;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 20px;
		font-weight: 700;
		color: var(--color-grass);
		font-variant-numeric: tabular-nums;
	}
	@media (prefers-reduced-motion: reduce) {
		.flash {
			animation: none;
		}
		.file,
		.tabs button {
			transition: none;
		}
	}
</style>
