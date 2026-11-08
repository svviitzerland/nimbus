<!--
	Version control, from zero. One centred document you snapshot with Commit.
	Every commit drops a numbered node on a small timeline. Tap a node to look
	back at that version, so the learner feels Git keeps them all. One beat
	(CMD_BEAT) swaps the document for the everyday commands, a file walking from
	your folder through the staging area into the history and up to an online place.
-->
<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { VcCommandsText } from '$lib/chapters/compute/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate,
		onshow,
		beat = 0
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
		beat?: number;
	} = $props();
	const tx = $derived(text as VcCommandsText);

	// the beat that names the everyday commands, shown with its own picture
	const CMD_BEAT = 2;
	const cmdView = $derived(beat === CMD_BEAT);
	$effect(() => {
		onshow?.(cmdView);
	});
	// the commands light up one after another, on a loop
	type Cmd = 'status' | 'add' | 'commit' | 'push' | 'pull';
	const CMDS: Cmd[] = ['status', 'add', 'commit', 'push', 'pull'];
	let k = $state(0);
	$effect(() => {
		if (!cmdView) return;
		k = 0;
		if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
			return;
		const id = setInterval(() => (k = (k + 1) % CMDS.length), 1300);
		return () => clearInterval(id);
	});
	// where the edited file sits for each lit command
	const fileAt = $derived(k === 0 ? 0 : k === 1 ? 1 : 2);

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

{#snippet cmdRow(c: Cmd, dir: 'down' | 'both')}
	<div class="crow" class:lit={CMDS[k] === c || (dir === 'both' && CMDS[k] === 'pull')}>
		<svg width="12" height="20" viewBox="0 0 12 20" aria-hidden="true" class="carr">
			{#if dir === 'both'}
				<path d="M6 2v16M2 6l4-4 4 4M2 14l4 4 4-4" />
			{:else}
				<path d="M6 2v16M2 14l4 4 4-4" />
			{/if}
		</svg>
		<code>git {c}</code><span class="hint">{tx.cmdHints[c]}</span>
		{#if dir === 'both'}<code>git pull</code><span class="hint">{tx.cmdHints.pull}</span>{/if}
	</div>
{/snippet}

{#snippet fileChip(here: boolean)}
	{#if here}<span class="fchip">index.html</span>{/if}
{/snippet}

{#if cmdView}
	<div class="cmds">
		<div class="zone" class:lit={CMDS[k] === 'status'}>
			<span class="zl">{tx.folderLabel}</span>
			<span class="zr">
				{@render fileChip(fileAt === 0)}
				{#if fileAt === 0}<span class="ch">{tx.changedTag}</span>{/if}
				{#if CMDS[k] === 'status'}<code class="stat">git status</code>{/if}
			</span>
		</div>
		{@render cmdRow('add', 'down')}
		<div class="zone" class:lit={CMDS[k] === 'add'}>
			<span class="zl">{tx.stagingLabel}</span>
			<span class="zr">{@render fileChip(fileAt === 1)}</span>
		</div>
		{@render cmdRow('commit', 'down')}
		<div class="zone" class:lit={CMDS[k] === 'commit'}>
			<span class="zl">{tx.historyLabel}</span>
			<span class="zr nodes">
				<span class="nd"></span><span class="nd"></span>
				{#if fileAt === 2}<span class="nd new"></span>{/if}
			</span>
		</div>
		{@render cmdRow('push', 'both')}
		<div class="zone" class:lit={CMDS[k] === 'push' || CMDS[k] === 'pull'}>
			<span class="zl">{tx.onlineLabel}</span>
			<span class="zr nodes">
				<span class="nd"></span><span class="nd"></span>
				{#if k >= 3}<span class="nd new"></span>{/if}
			</span>
		</div>
	</div>
{:else}
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
{/if}

<style>
	.cmds {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: min(92vw, 320px);
	}
	.zone {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		min-height: 46px;
		border-radius: 13px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
		transition: border-color 0.25s ease;
	}
	.zone.lit {
		border-color: var(--color-brand);
	}
	.zl {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.zr {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.fchip {
		border-radius: 6px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 2px 7px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-ink);
		animation: pop 0.35s ease;
	}
	.ch {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.stat {
		border-radius: 6px;
		background: var(--color-brand-soft);
		padding: 2px 6px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.nodes {
		gap: 5px;
	}
	.nd {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.nd.new {
		background: var(--color-grass);
		animation: pop 0.35s ease;
	}
	.crow {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 5px 0 5px 18px;
		opacity: 0.55;
		transition: opacity 0.25s ease;
	}
	.crow.lit {
		opacity: 1;
	}
	.carr path {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.crow.lit .carr path {
		stroke: var(--color-brand);
	}
	.crow code {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.crow.lit code {
		color: var(--color-brand);
	}
	.hint {
		margin-right: 6px;
		font-size: 10.5px;
		color: var(--color-faint);
	}

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
