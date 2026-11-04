<!--
	Git versus GitHub. Commits are made by Git on your own laptop (local). Pushing
	sends them to a host like GitHub (online), and a teammate can then clone them
	down. The point: Git is the tool, GitHub is one place to keep and share it.
	One beat (SECRET_BEAT) shows the project folder instead, where .gitignore keeps
	the .env file of secrets on the laptop while the rest goes to a public repo that
	bots keep scanning for leaked keys.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { GitSecretsText } from '$lib/chapters/compute/types';
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
	const tx = $derived(text as GitSecretsText);

	// the beat about .gitignore and secrets, shown with its own picture
	const SECRET_BEAT = 2;
	const secretView = $derived(beat === SECRET_BEAT);
	$effect(() => {
		onshow?.(secretView);
	});

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

{#snippet file(name: string, kept: boolean)}
	<div class="frow" class:kept>
		<svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true">
			<path d="M1.5 1h5.5l2.5 2.5v8.5h-8Z" class="ficon" />
		</svg>
		<code>{name}</code>
	</div>
{/snippet}

{#if secretView}
	<div class="secrets">
		<div class="pcard">
			<span class="phead"><span class="chip git">{tx.gitChip}</span>{tx.folderLabel}</span>
			{@render file('index.html', false)}
			{@render file('app.js', false)}
			<div class="frow secret">
				<svg width="11" height="13" viewBox="0 0 24 24" aria-hidden="true">
					<rect x="5" y="11" width="14" height="10" rx="2" class="lk" />
					<path d="M8 11V8a4 4 0 0 1 8 0v3" class="lko" />
				</svg>
				<code>.env</code>
				<span class="snote">{tx.secretNote}</span>
				<span class="stay">{tx.ignoredTag}</span>
			</div>
			<div class="frow ign">
				<svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true">
					<path d="M1.5 1h5.5l2.5 2.5v8.5h-8Z" class="ficon" />
				</svg>
				<code>.gitignore</code>
				<span class="inside">.env</span>
			</div>
		</div>

		<div class="wire live"><span class="pkt down loop"></span></div>

		<div class="pcard host2">
			<span class="phead">
				<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
					<path
						fill="currentColor"
						d="M4 15a5 5 0 0 1 .9-9.9A6 6 0 0 1 17 6a4.5 4.5 0 0 1 1 8.9V15H4Z"
					/>
				</svg>
				{tx.remoteLabel}
				<span class="pub">{tx.publicTag}</span>
			</span>
			{@render file('index.html', false)}
			{@render file('app.js', false)}
		</div>

		<div class="bots">
			{#each [0, 1, 2] as i (i)}
				<svg
					width="22"
					height="22"
					viewBox="0 0 24 24"
					aria-hidden="true"
					class="bot"
					style="animation-delay:{i * 0.3}s"
				>
					<rect x="4" y="7" width="16" height="12" rx="3" class="bb" />
					<circle cx="9.5" cy="13" r="1.6" class="be" />
					<circle cx="14.5" cy="13" r="1.6" class="be" />
					<path d="M12 7V4" class="ba" />
					<circle cx="12" cy="3.5" r="1.3" class="be" />
				</svg>
			{/each}
			<span class="blabel">{tx.botLabel}</span>
		</div>
	</div>
{:else}
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
{/if}

<style>
	.secrets {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(92vw, 320px);
	}
	.pcard {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 5px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
	}
	.phead {
		display: flex;
		align-items: center;
		gap: 7px;
		margin-bottom: 2px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.phead .chip {
		margin-bottom: 0;
	}
	.host2 .phead {
		color: var(--color-brand);
	}
	.pub {
		margin-left: auto;
		border-radius: 999px;
		background: var(--color-danger-soft);
		padding: 1px 8px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-danger);
	}
	.frow {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 8px;
		padding: 3px 6px;
	}
	.frow code {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.ficon {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.2;
		stroke-linejoin: round;
	}
	.frow.secret {
		flex-wrap: wrap;
		background: var(--color-amber-soft);
	}
	.lk {
		fill: var(--color-amber);
	}
	.lko {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2.4;
	}
	.snote {
		font-size: 10px;
		color: var(--color-muted);
	}
	.stay {
		margin-left: auto;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.inside {
		margin-left: auto;
		border-radius: 5px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 0 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		color: var(--color-muted);
	}
	.pkt.loop {
		animation: fall 1.4s ease infinite;
	}
	.bots {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-top: 10px;
	}
	.bot {
		animation: peer 1.8s ease-in-out infinite;
	}
	.bb {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.be {
		fill: var(--color-danger);
	}
	.ba {
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.blabel {
		margin-left: 4px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-danger);
	}
	@keyframes peer {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(3px);
		}
	}

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
		.pkt.loop,
		.bot {
			animation: none;
		}
	}
</style>
