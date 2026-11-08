<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import {
		previewFetch,
		ssrfTargets,
		type SsrfTarget,
		type FetchGuard
	} from '../labs/security-models';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let target = $state<SsrfTarget>('internal'),
		guard = $state<FetchGuard>('none');
	let result = $state<ReturnType<typeof previewFetch> | null>(null);
	let leaked = $state(false),
		redirected = $state(false),
		blocked = $state(false),
		valid = $state(false);
	function fetchPreview() {
		result = previewFetch(target, guard);
		if (result.leaked && target === 'internal') leaked = true;
		if (result.leaked && target === 'redirect' && guard === 'first') redirected = true;
		if (result.status === 403 && guard === 'every') blocked = true;
		if (!result.leaked && result.status === 200 && guard === 'every') valid = true;
		onstate?.(
			result.status === 403
				? 'blocked'
				: result.leaked
					? target === 'redirect'
						? 'redirect'
						: 'internal'
					: 'image'
		);
		if (leaked && redirected && blocked && valid) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[leaked, redirected, blocked, valid]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={fetchPreview}>{tx.labels.fetch}</button>
	</div>
	<div class="lab-grid">
		<label class="lab-card lab-label"
			>{tx.labels.target}<select class="lab-input" aria-label={tx.labels.target} bind:value={target}
				>{#each ssrfTargets as item (item)}<option value={item}>{tx.labels[item]}</option
					>{/each}</select
			></label
		><label class="lab-card lab-label"
			>{tx.labels.guard}<select class="lab-input" aria-label={tx.labels.guard} bind:value={guard}
				>{#each ['none', 'first', 'every'] as item (item)}<option value={item}
						>{tx.labels[item]}</option
					>{/each}</select
			></label
		>
	</div>
	<div class="lab-card">
		<div class="server">
			<Server active={true} />
			<div>
				<strong>{tx.labels.server}</strong>
				<p class="lab-caption">{tx.labels.access}</p>
			</div>
		</div>
		<pre
			class="lab-code">{`POST /preview HTTP/1.1\nHost: nimbus.com\n\nurl=${target === 'image' ? 'https://nimbus.com/banner.png' : target === 'internal' ? 'http://127.0.0.1/admin' : 'https://nimbus.com/redirect'}`}</pre>
	</div>
	<div class="lab-card" aria-live="polite">
		<span class="lab-label">{tx.labels.trace}</span>
		<pre class="lab-code">{result
				? result.visited.map((url, i) => `${i + 1}. GET ${url}`).join('\n') +
					(result.blocked ? '\nBLOCKED ' + result.blocked : '')
				: tx.labels.waiting}</pre>
		<p class="lab-caption">
			{!result
				? tx.labels.waiting
				: result.status === 403
					? tx.labels.blocked
					: result.leaked
						? tx.labels.leaked
						: tx.labels.rendered}
		</p>
		{#if result?.status === 200 && !result.leaked}<div class="banner">Nimbus</div>{/if}
	</div>
</LabBench>

<style>
	.server {
		display: flex;
		gap: 18px;
		align-items: center;
	}
	strong {
		color: var(--color-ink);
	}
	.banner {
		padding: 26px;
		border-radius: 15px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		font: 30px var(--font-display);
		text-align: center;
	}
</style>
