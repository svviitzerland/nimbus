<!--
	Not only GitHub. Git is the tool; a host is where you keep the repo online.
	GitHub, GitLab, Bitbucket, and self hosted Gitea all speak the same Git.
	Tap to compare them, then reveal why most people land on GitHub.
-->
<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { LessonText, GitHostsText } from '$lib/chapters/types';
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
	const tx = $derived(text as GitHostsText);

	// a calm monogram tint per host, no real logos
	const tint: Record<string, string> = {
		github: '#16212b',
		gitlab: '#e0692e',
		bitbucket: '#2e6fe0',
		gitea: '#3a9c64'
	};

	let selected = $state<string | null>(null);
	let explored = $state<Set<string>>(new Set());
	let whyOpen = $state(false);
	let done = false;

	const current = $derived(tx.hosts.find((h) => h.id === selected) ?? null);
	const canWhy = $derived(explored.size >= 2);

	function pick(id: string) {
		selected = id;
		if (!explored.has(id)) explored = new Set(explored).add(id);
		onstate?.(id);
	}
	function why() {
		whyOpen = true;
		onstate?.('why');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

<div class="scene">
	<span class="same">{tx.sameGitChip}</span>

	<div class="grid">
		{#each tx.hosts as h (h.id)}
			<button
				type="button"
				class="host"
				class:active={selected === h.id}
				class:seen={explored.has(h.id)}
				style="--tint: {tint[h.id] ?? 'var(--color-ink)'}"
				onclick={() => pick(h.id)}
			>
				<span class="mono">{h.name.slice(0, 1)}</span>
				<span class="hn">{h.name}</span>
			</button>
		{/each}
	</div>

	{#if current}
		<div class="detail" transition:slide={{ duration: 200 }}>
			<span class="tagline">{current.tagline}</span>
			<div class="traits">
				{#each current.traits as t (t)}
					<span class="trait">{t}</span>
				{/each}
			</div>
		</div>
	{:else}
		<span class="hint">{tx.exploreHint}</span>
	{/if}

	{#if whyOpen}
		<div class="why" transition:slide={{ duration: 220 }}>
			<span class="whylabel">{tx.whyLabel}</span>
			<ul>
				{#each tx.whyPoints as p (p)}
					<li>{@html p}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

{#if !whyOpen}
	<div class="acts">
		<CallToActionButton onclick={why} disabled={!canWhy}>{tx.whyBtn}</CallToActionButton>
	</div>
{/if}

<style>
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(92vw, 360px);
	}
	.same {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 12px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		width: 100%;
		max-width: 320px;
	}
	.host {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			transform 0.12s ease;
	}
	.host:hover {
		border-color: var(--color-muted);
	}
	.host.active {
		border-color: var(--tint);
		box-shadow: 0 0 0 2px color-mix(in srgb, var(--tint) 22%, transparent);
	}
	.host:active {
		transform: translateY(1px);
	}
	.mono {
		display: grid;
		flex: none;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: var(--tint);
		color: #fff;
		font-family: var(--font-display, serif);
		font-size: 14px;
		font-weight: 700;
	}
	.hn {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.seen .hn {
		color: var(--color-muted);
	}

	.hint {
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.detail {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		max-width: 320px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 12px 14px;
	}
	.tagline {
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--color-ink);
	}
	.traits {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.trait {
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.why {
		display: flex;
		flex-direction: column;
		gap: 7px;
		width: 100%;
		max-width: 320px;
		border-radius: 13px;
		border: 1px solid #cdddf6;
		background: var(--color-brand-soft);
		padding: 13px 15px;
	}
	.whylabel {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.why ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.why li {
		position: relative;
		padding-left: 16px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--color-ink);
	}
	.why li::before {
		content: '';
		position: absolute;
		top: 6px;
		left: 3px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-brand);
	}
	.acts {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
		margin-top: 14px;
	}
</style>
