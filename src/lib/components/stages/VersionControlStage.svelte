<!--
	Version control, from zero. One centred document you snapshot with Commit.
	Every commit drops a numbered node on a small timeline. Tap a node to look
	back at that version, so the learner feels Git keeps them all.
-->
<script lang="ts">
	import type { LessonText, VersionControlText } from '$lib/chapters/types';
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
	const tx = $derived(text as VersionControlText);

	type Commit = { n: number; msg: string };
	let commits = $state<Commit[]>([]);
	let viewing = $state<number | null>(null); // null means the newest
	let done = false;

	const max = $derived(tx.commitMsgs.length);
	const shown = $derived(viewing ?? commits.length);
	const atLatest = $derived(viewing === null || viewing === commits.length);
	const caption = $derived(shown > 0 ? commits[shown - 1].msg : tx.docLabel);

	function commit() {
		if (commits.length >= max) return;
		const n = commits.length + 1;
		commits = [...commits, { n, msg: tx.commitMsgs[n - 1] }];
		viewing = null;
		onstate?.(n === 1 ? 'firstCommit' : 'grew');
	}
	function view(n: number) {
		viewing = n;
		if (n < commits.length) {
			onstate?.('checkout');
			if (!done && commits.length >= 2) {
				done = true;
				oncomplete?.();
			}
		}
	}
	function backLatest() {
		viewing = null;
		onstate?.('latest');
	}
</script>

<div class="scene">
	<!-- the document, one centred card that grows a line per commit -->
	<div class="doc" class:past={!atLatest}>
		<div class="head">
			<span class="dot"></span>
			<span class="tab"></span>
			<span class="chip" class:live={atLatest}>
				{atLatest ? tx.latestChip : tx.viewingChip.replace('{n}', String(viewing))}
			</span>
		</div>
		<div class="body">
			{#if shown === 0}
				<span class="empty">{tx.docLabel}</span>
			{:else}
				{#each Array(shown) as _, i (i)}
					<span class="ln" class:fresh={i === shown - 1} style="width: {66 - i * 8}%"></span>
				{/each}
			{/if}
		</div>
	</div>

	<!-- the timeline, every commit kept as a numbered node -->
	{#if commits.length > 0}
		<div class="line">
			<div class="track">
				{#each commits as c (c.n)}
					<button
						type="button"
						class="node"
						class:on={shown === c.n}
						class:latest={c.n === commits.length}
						onclick={() => view(c.n)}
						aria-label={tx.snapshotLabel.replace('{n}', String(c.n))}
					>
						{c.n}
					</button>
				{/each}
			</div>
			<span class="cap">{caption}</span>
		</div>
	{/if}

	<div class="acts">
		{#if !atLatest}
			<button type="button" class="ghost" onclick={backLatest}>{tx.backLatest}</button>
		{:else}
			<CallToActionButton onclick={commit} disabled={commits.length >= max}>
				{tx.commitBtn}
			</CallToActionButton>
		{/if}
	</div>
</div>

<style>
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20px;
		width: min(92vw, 320px);
	}
	.doc {
		width: 200px;
		border-radius: 16px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.09);
		overflow: hidden;
		transition: border-color 0.25s ease;
	}
	.doc.past {
		border-color: var(--color-amber);
	}
	.head {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 10px 12px;
		background: var(--color-paper);
		border-bottom: 1px solid var(--color-line);
	}
	.dot {
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.tab {
		flex: 1;
		max-width: 60px;
		height: 7px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.chip {
		border-radius: 999px;
		padding: 2px 9px;
		font-size: 9px;
		font-weight: 700;
		white-space: nowrap;
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.chip.live {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 9px;
		min-height: 104px;
		padding: 16px 16px;
	}
	.ln {
		height: 9px;
		border-radius: 5px;
		background: var(--color-line);
	}
	.ln.fresh {
		background: var(--color-brand-soft);
		animation: pop 0.35s ease;
	}
	.empty {
		font-size: 12px;
		color: var(--color-faint);
	}
	@keyframes pop {
		from {
			transform: scaleX(0.6);
			transform-origin: left;
			opacity: 0.3;
		}
	}

	.line {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.track {
		position: relative;
		display: flex;
		align-items: center;
		gap: 26px;
	}
	.track::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 14px;
		right: 14px;
		height: 2px;
		transform: translateY(-50%);
		background: var(--color-line);
	}
	.node {
		position: relative;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-faint);
		transition:
			border-color 0.2s ease,
			color 0.2s ease,
			transform 0.12s ease;
	}
	.node:hover {
		border-color: var(--color-muted);
	}
	.node.latest {
		border-color: var(--color-grass);
		color: var(--color-grass);
	}
	.node.on {
		color: #fff;
		border-color: var(--color-amber);
		background: var(--color-amber);
	}
	.node.on.latest {
		border-color: var(--color-grass);
		background: var(--color-grass);
	}
	.node:active {
		transform: translateY(1px);
	}
	.cap {
		min-height: 1.2em;
		font-size: 12px;
		font-weight: 500;
		color: var(--color-muted);
	}

	.acts {
		display: flex;
		min-height: 46px;
		align-items: center;
		justify-content: center;
	}
	.ghost {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 11px 20px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		transition: border-color 0.2s ease;
	}
	.ghost:hover {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.ln.fresh {
			animation: none;
		}
	}
</style>
