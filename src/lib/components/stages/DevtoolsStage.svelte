<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let endpoint = $state('/api/prodcut');
	let tab = $state<'network' | 'console'>('network');
	let record = $state<{ path: string; status: number } | null>(null);
	let selected = $state(false),
		failed = $state(false),
		inspected = $state(false),
		fixed = $state(false);
	function reload() {
		const ok = endpoint === '/api/products';
		record = { path: endpoint, status: ok ? 200 : 404 };
		selected = false;
		if (ok) {
			fixed = true;
			onstate?.('fixed');
		} else {
			failed = true;
			onstate?.('failed');
		}
		if (failed && inspected && fixed) oncomplete?.();
	}
	function inspect() {
		selected = true;
		inspected = true;
		onstate?.('inspected');
		if (failed && fixed) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[failed, inspected, fixed]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={reload}>{tx.labels.reload}</button><span
			class="lab-caption">nimbus.com</span
		>
	</div>
	<div class="lab-grid">
		<div class="lab-card">
			<span class="lab-label">{tx.labels.browser}</span>
			<h3>{tx.labels.shop}</h3>
			<p class="lab-caption" aria-live="polite">
				{record?.status === 200 ? tx.labels.product : tx.labels.empty}
			</p>
		</div>
		<label class="lab-label lab-card"
			>{tx.labels.source}<select
				aria-label={tx.labels.source}
				class="lab-input"
				bind:value={endpoint}><option>/api/prodcut</option><option>/api/products</option></select
			><code class="lab-code">fetch('{endpoint}')</code></label
		>
	</div>
	<div class="lab-card">
		<div class="lab-actions">
			<button class="lab-button" aria-pressed={tab === 'network'} onclick={() => (tab = 'network')}
				>Network</button
			><button class="lab-button" aria-pressed={tab === 'console'} onclick={() => (tab = 'console')}
				>Console</button
			>
		</div>
		{#if tab === 'network'}
			<p class="lab-caption">{tx.labels.inspect}</p>
			{#if record}<button class="request-row" onclick={inspect}
					><code>GET {record.path}</code><strong class:bad={record.status === 404}
						>{record.status}</strong
					></button
				>{:else}<p class="lab-caption">{tx.labels.waiting}</p>{/if}
			{#if selected && record}<pre
					class="lab-code">{`GET ${record.path} HTTP/1.1\nHost: nimbus.com\n\nHTTP/1.1 ${record.status} ${record.status === 200 ? 'OK' : 'Not Found'}\nContent-Type: application/json\n\n${record.status === 200 ? '{"products":["Nimbus notebook"]}' : '{"error":"Route not found"}'}`}</pre>{/if}
		{:else}<pre class="lab-code">{record
					? record.status === 404
						? 'GET /api/prodcut 404 (Not Found)'
						: 'Loaded 1 product'
					: tx.labels.waiting}</pre>{/if}
	</div>
</LabBench>

<style>
	h3 {
		margin: 10px 0;
		font-family: var(--font-display);
		font-size: 23px;
		color: var(--color-ink);
	}
	.request-row {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		min-height: 48px;
		padding: 10px;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		font-size: 13px;
		overflow-wrap: anywhere;
		color: var(--color-ink);
	}
	strong {
		color: var(--color-grass);
	}
	strong.bad {
		color: var(--color-danger);
	}
</style>
