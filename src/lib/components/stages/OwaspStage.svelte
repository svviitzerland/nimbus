<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import type { StageProps, SecurityCatalogText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as SecurityCatalogText);
	let selected = $state(0),
		guard = $state(false),
		ran = $state(false);
	const current = $derived(tx.cases[selected]);
	const before = new SvelteSet<string>(),
		after = new SvelteSet<string>();
	const compared = $derived(tx.cases.filter((c) => before.has(c.id) && after.has(c.id)).length);
	let response = $state('');
	function run() {
		ran = true;
		response = guard ? current.after : current.before;
		(guard ? after : before).add(current.id);
		onstate?.(guard ? 'fixed' : 'exposed');
		if (tx.cases.filter((c) => before.has(c.id) && after.has(c.id)).length >= 3) oncomplete?.();
	}
	function pick() {
		guard = false;
		ran = false;
		response = '';
	}
</script>

<LabBench text={tx} done={[before.size > 0, after.size > 0, compared >= 3]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={run}>{tx.labels.run}</button><span
			class="lab-caption">{compared} / 10 {tx.labels.compared}</span
		>
	</div>
	<label class="lab-label"
		>{tx.labels.category}<select
			class="lab-input"
			aria-label={tx.labels.category}
			bind:value={selected}
			onchange={pick}
			>{#each tx.cases as item, i (item.id)}<option value={i}>{item.id} / {item.title}</option
				>{/each}</select
		></label
	>
	<div class="lab-card">
		<span class="lab-label">OWASP Top 10 (2025)</span>
		<h3>{current.title}</h3>
		<p class="lab-caption">{current.scene}</p>
		<label class="lab-check"><input type="checkbox" bind:checked={guard} />{current.control}</label>
		<pre class="lab-code">{current.request}</pre>
	</div>
	<div class="lab-card answer">
		<Server active={ran} />
		<div aria-live="polite">
			<span class="lab-label">{tx.labels.result}</span>
			<pre class="lab-code">{response || tx.labels.waiting}</pre>
			{#if ran}<p class="lab-caption">{current.explanation}</p>{/if}
		</div>
	</div>
	<div class="lab-card">
		<strong>{tx.labels.resources}</strong
		>{#each ['asvs', 'wstg', 'cheatsheet'] as resource (resource)}<p class="lab-caption">
				{tx.labels[resource]}
			</p>{/each}
	</div>
</LabBench>

<style>
	h3 {
		font: 24px var(--font-display);
		color: var(--color-ink);
		margin: 10px 0;
	}
	.answer {
		display: flex;
		gap: 18px;
		align-items: center;
	}
	.answer > div {
		min-width: 0;
		flex: 1;
	}
	strong {
		color: var(--color-ink);
	}
	@media (max-width: 440px) {
		.answer {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
