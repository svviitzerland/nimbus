<!--
	Git versus GitHub. Commits are made by Git on your own laptop (local). Pushing
	sends them to a host like GitHub (online), and a teammate can then clone them
	down. The point: Git is the tool, GitHub is one place to keep and share it.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText, GitRemoteText } from '$lib/chapters/types';
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
	const tx = $derived(text as GitRemoteText);

	const MAX = 3;
	let local = $state(0); // commits on your laptop
	let remote = $state(0); // commits on the host
	let mate = $state(0); // commits the teammate has
	let flying = $state<'push' | 'clone' | null>(null);
	let done = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(timer));

	function commit() {
		if (local >= MAX || flying) return;
		local += 1;
		if (local === 1) onstate?.('committed');
	}
	function push() {
		if (local <= remote || flying) return;
		flying = 'push';
		timer = setTimeout(() => {
			remote = local;
			flying = null;
			onstate?.('pushed');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		}, 1100);
	}
	function clone() {
		if (remote <= mate || flying) return;
		flying = 'clone';
		timer = setTimeout(() => {
			mate = remote;
			flying = null;
			onstate?.('cloned');
		}, 1100);
	}
	function reset() {
		clearTimeout(timer);
		local = remote = mate = 0;
		flying = null;
	}
</script>

{#snippet dots(filled: number, tone: 'ink' | 'brand')}
	<span class="dots">
		{#each Array(MAX) as _, i (i)}
			<span class="d {tone}" class:on={i < filled}></span>
		{/each}
	</span>
{/snippet}

<div class="scene">
	<!-- your laptop, where Git lives and commits are made -->
	<div class="node">
		<div class="card">
			<div class="scr">
				<span class="chip git">{tx.gitChip}</span>
				<span class="bar w60"></span>
				<span class="bar w40"></span>
			</div>
		</div>
		<span class="name">{tx.laptopLabel}</span>
		{@render dots(local, 'ink')}
		<span class="state">{tx.localChip}</span>
	</div>

	<!-- push wire -->
	<div class="wire" class:live={flying === 'push'}>
		{#if flying === 'push'}<span class="pkt down"></span>{/if}
	</div>

	<!-- the host, an online place that keeps and shares the repo -->
	<div class="node">
		<div class="card host" class:filled={remote > 0}>
			<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
				<path
					fill="currentColor"
					d="M4 15a5 5 0 0 1 .9-9.9A6 6 0 0 1 17 6a4.5 4.5 0 0 1 1 8.9V15H4Z"
				/>
			</svg>
			<span class="hname">{tx.remoteLabel}</span>
		</div>
		<span class="sub">{tx.remoteSub}</span>
		{@render dots(remote, 'brand')}
		<span class="state" class:good={remote > 0}>{tx.onlineChip}</span>
	</div>

	<!-- clone wire -->
	<div class="wire" class:live={flying === 'clone'}>
		{#if flying === 'clone'}<span class="pkt down"></span>{/if}
	</div>

	<!-- a teammate, who clones the repo from the host -->
	<div class="node">
		<div class="card small">
			<div class="scr">
				<span class="bar w60"></span>
				<span class="bar w40"></span>
			</div>
		</div>
		<span class="name">{tx.mateLabel}</span>
		{@render dots(mate, 'ink')}
	</div>
</div>

<div class="acts">
	{#if mate >= MAX && local >= MAX}
		<button type="button" class="line-btn" onclick={reset}>{tx.again}</button>
	{:else}
		<button type="button" class="line-btn" onclick={commit} disabled={local >= MAX || !!flying}>
			{tx.commitBtn}
		</button>
		{#if remote < local}
			<CallToActionButton onclick={push} disabled={!!flying}>{tx.pushBtn}</CallToActionButton>
		{:else}
			<CallToActionButton onclick={clone} disabled={remote <= mate || !!flying}>
				{tx.cloneBtn}
			</CallToActionButton>
		{/if}
	{/if}
</div>

<style>
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
		width: min(92vw, 340px);
	}
	.node {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		z-index: 2;
	}
	.card {
		display: flex;
		width: 128px;
		border-radius: 12px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.09);
	}
	.card.small {
		width: 104px;
	}
	.scr {
		position: relative;
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 6px;
		padding: 12px 12px 11px;
	}
	.chip {
		align-self: flex-start;
		border-radius: 999px;
		padding: 1px 8px;
		margin-bottom: 2px;
		font-size: 8.5px;
		font-weight: 700;
	}
	.chip.git {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.bar {
		height: 7px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.w60 {
		width: 60%;
	}
	.w40 {
		width: 40%;
	}
	.host {
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 12px;
		color: var(--color-faint);
		transition: color 0.25s ease;
	}
	.host.filled {
		color: var(--color-brand);
		border-color: #cdddf6;
	}
	.hname {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.name {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.sub {
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.dots {
		display: flex;
		gap: 4px;
		margin-top: 1px;
	}
	.d {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.3s ease;
	}
	.d.ink.on {
		background: var(--color-ink);
	}
	.d.brand.on {
		background: var(--color-brand);
	}
	.state {
		font-size: 9px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.state.good {
		color: var(--color-grass);
	}

	.wire {
		position: relative;
		width: 2px;
		height: 26px;
		background: var(--color-line);
	}
	.wire.live {
		background: var(--color-brand-soft);
	}
	.pkt {
		position: absolute;
		left: 50%;
		width: 9px;
		height: 9px;
		margin-left: -4.5px;
		border-radius: 50%;
		background: var(--color-brand);
	}
	.pkt.down {
		animation: fall 1.1s ease forwards;
	}
	@keyframes fall {
		from {
			top: -4px;
		}
		to {
			top: 22px;
		}
	}

	.acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 10px;
		margin-top: 16px;
	}
	.line-btn {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			opacity 0.2s ease;
	}
	.line-btn:hover:enabled {
		border-color: var(--color-ink);
	}
	.line-btn:disabled {
		opacity: 0.45;
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt.down {
			animation-duration: 0.01s;
		}
	}
</style>
