<script lang="ts">
	import Server from '$lib/components/Server.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import { fingerprint } from './crypto/hash';
	import type { LessonText } from '$lib/chapters/types';
	import type { BlockchainText } from '$lib/chapters/security/blockchain/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BlockchainText);

	const N = 4;
	const ZERO = '00000000';
	const OTHERS = 4;

	// What the learner typed per block (null means untouched), and the words each block's links were
	// last computed from (null means the original chain, a snapshot after "recompute").
	const edits = $state<(string | null)[]>(Array(N).fill(null));
	let snapshot = $state<(string | null)[] | null>(null);
	let completed = false;

	const blockHash = (i: number, data: string, prev: string) => fingerprint(`${i}|${data}|${prev}`);

	// Builds the stored "previous" fingerprints from a set of words.
	function chainFrom(words: string[]) {
		const prevs: string[] = [];
		let prev = ZERO;
		for (let i = 0; i < N; i++) {
			prevs.push(prev);
			prev = blockHash(i, words[i], prev);
		}
		return { prevs, tip: prev };
	}

	const current = $derived(tx.records.map((r, i) => edits[i] ?? r));
	const base = $derived(tx.records.map((r, i) => snapshot?.[i] ?? r));
	const stored = $derived(chainFrom(base).prevs);
	const hashes = $derived(current.map((d, i) => blockHash(i, d, stored[i])));
	// The first block whose stored link no longer fits, or N when the chain is whole.
	const brokenFrom = $derived.by(() => {
		for (let i = 1; i < N; i++) if (stored[i] !== hashes[i - 1]) return i;
		return N;
	});
	const networkTip = $derived(chainFrom(tx.records).tip);
	const yourTip = $derived(hashes[N - 1]);
	const agrees = $derived(yourTip === networkTip);
	const changed = $derived(current.map((d, i) => d !== base[i]));

	function onEdit(i: number, value: string) {
		const wasBroken = brokenFrom < N;
		const wasAgreeing = agrees;
		edits[i] = value === tx.records[i] ? null : value;
		if (brokenFrom < N && !wasBroken) onstate?.('broken');
		else if (brokenFrom === N && agrees && !wasAgreeing) onstate?.('restored');
		else if (brokenFrom === N && !agrees && wasAgreeing) onstate?.('tip');
	}
	function rehash() {
		snapshot = [...current];
		onstate?.('rehash');
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}
	function sync() {
		edits.fill(null);
		snapshot = null;
		onstate?.('synced');
	}
</script>

<div class="wrap">
	<div class="btns">
		{#if brokenFrom < N}
			<CallToActionButton onclick={rehash}>
				{tx.rehashBtn}
			</CallToActionButton>
		{:else if !agrees}
			<CallToActionButton onclick={sync}>
				{tx.syncBtn}
			</CallToActionButton>
		{:else}
			<p class="hint">{tx.editHint}</p>
		{/if}
	</div>

	<ol class="chain">
		{#each current as data, i (i)}
			{@const red = i >= brokenFrom}
			{#if i > 0}
				<li class="link" class:snap={i === brokenFrom} class:red aria-hidden="true">
					<svg width="18" height="22" viewBox="0 0 18 22" fill="none">
						{#if i === brokenFrom}
							<path d="M9 1v6M9 15v6" stroke-width="2.4" stroke-linecap="round" />
							<path d="M4 9.5 14 12.5" stroke-width="2.4" stroke-linecap="round" />
						{:else}
							<path d="M9 1v20" stroke-width="2.4" stroke-linecap="round" />
						{/if}
					</svg>
				</li>
			{/if}
			<li class="block" class:red class:edited={changed[i] && !red}>
				<div class="bhead">
					<span class="bname">{tx.blockLabel.replace('{n}', String(i + 1))}</span>
					{#if i === brokenFrom}
						<span class="tag bad">{tx.brokenTag}</span>
					{:else if changed[i]}
						<span class="tag warn">{tx.changedTag}</span>
					{/if}
				</div>
				<input
					class="data"
					value={data}
					maxlength="40"
					spellcheck="false"
					aria-label={tx.blockLabel.replace('{n}', String(i + 1))}
					oninput={(e) => onEdit(i, e.currentTarget.value)}
				/>
				<div class="hrow">
					<span class="hk">{tx.prevLabel}</span>
					<code class="hex" class:bad={i === brokenFrom}>{stored[i]}</code>
				</div>
				<div class="hrow">
					<span class="hk">{tx.hashLabel}</span>
					{#key hashes[i]}<code class="hex own" class:bad={red} class:warn={changed[i] && !red}
							>{hashes[i]}</code
						>{/key}
				</div>
			</li>
		{/each}
	</ol>

	<div class="net">
		<p class="nhead">{tx.networkLabel}</p>
		<div class="nodes">
			<div class="node you" class:bad={!agrees}>
				<span class="nname">{tx.yourCopy}</span>
				<code class="hex">{yourTip}</code>
				<span class="verdict">{agrees ? tx.agree : tx.disagree}</span>
			</div>
			{#each Array(OTHERS) as _, k (k)}
				<div class="node">
					<div class="mini"><Server slots={2} active /></div>
					<span class="nname">{tx.computer.replace('{n}', String(k + 1))}</span>
					<code class="hex">{networkTip}</code>
				</div>
			{/each}
		</div>
		<p class="short">{tx.shortNote}</p>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.btns {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
	}
	.btns :global(.cta) {
		padding: 10px 16px;
		font-size: 13px;
	}
	.hint {
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.chain {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		align-items: center;
	}
	.block {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 3px;
		border-radius: 12px;
		border: 1.5px solid var(--color-grass);
		background: var(--color-card);
		padding: 7px 10px;
		transition:
			border-color 0.25s,
			background 0.25s;
	}
	.block.edited {
		border-color: var(--color-amber);
	}
	.block.red {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.bhead {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.bname {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.tag {
		border-radius: 999px;
		padding: 1px 7px;
		font-size: 9px;
		font-weight: 800;
		color: #fff;
	}
	.tag.bad {
		background: var(--color-danger);
	}
	.tag.warn {
		background: var(--color-amber);
	}
	.data {
		width: 100%;
		border-radius: 7px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 3px 7px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.data:focus {
		border-color: var(--color-brand);
		outline: none;
		box-shadow: 0 0 0 2px var(--color-brand-soft);
	}
	.hrow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.hk {
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.hex {
		border-radius: 5px;
		background: var(--color-paper);
		padding: 0 5px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--color-ink);
	}
	.hex.own {
		animation: flash 0.35s ease;
	}
	.hex.warn {
		color: var(--color-amber);
	}
	.hex.bad {
		color: var(--color-danger);
	}
	@keyframes flash {
		from {
			background: var(--color-amber-soft);
		}
	}
	.link {
		display: grid;
		place-items: center;
		height: 22px;
		stroke: var(--color-grass);
	}
	.link.red {
		stroke: var(--color-danger);
	}
	.link.snap svg {
		animation: shake 0.35s ease;
	}
	@keyframes shake {
		25% {
			transform: translateX(-3px);
		}
		75% {
			transform: translateX(3px);
		}
	}

	.net {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 10px;
	}
	.nhead {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.nodes {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 4px;
	}
	.node {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		gap: 2px;
		min-width: 0;
	}
	.node .hex {
		max-width: 100%;
		overflow: hidden;
		font-size: 8.5px;
		padding: 0 3px;
	}
	.node.you {
		border-radius: 8px;
		background: var(--color-grass-soft);
		padding: 4px 2px;
	}
	.node.you.bad {
		background: var(--color-danger-soft);
	}
	.node.you.bad .hex,
	.node.you.bad .verdict {
		color: var(--color-danger);
	}
	.mini {
		display: flex;
		height: 34px;
		align-items: flex-end;
	}
	.mini > :global(.server) {
		width: 40px;
		gap: 4px;
		padding: 5px;
		border-radius: 7px;
	}
	.mini > :global(.server .slot) {
		height: 8px;
	}
	.mini > :global(.server .dot) {
		width: 4px;
		height: 4px;
	}
	.nname {
		max-width: 100%;
		text-align: center;
		font-size: 8.5px;
		font-weight: 700;
		line-height: 1.15;
		color: var(--color-muted);
	}
	.verdict {
		font-size: 8.5px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.short {
		font-size: 9.5px;
		color: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.hex.own,
		.link.snap svg {
			animation: none;
		}
		.block {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 14px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.chain,
		.net {
			width: 440px;
		}
		.data {
			font-size: 13.5px;
		}
		.hk,
		.bname {
			font-size: 11.5px;
		}
		.hex {
			font-size: 12px;
		}
		.node .hex,
		.nname,
		.verdict {
			font-size: 10px;
		}
	}
</style>
