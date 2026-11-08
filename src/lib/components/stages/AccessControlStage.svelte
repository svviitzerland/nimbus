<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import { readInvoice, rawResponse, type LabResponse } from '../labs/http';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let invoice = $state(101);
	let protectedRoute = $state(false);
	let own = $state(false),
		leaked = $state(false),
		blocked = $state(false);
	let result = $state<LabResponse | null>(null);
	let sent = $state('');
	function send() {
		sent = `GET /invoices/${invoice} HTTP/1.1\nHost: nimbus.com\nCookie: session=nim_demo`;
		result = readInvoice(invoice, protectedRoute);
		if (invoice === 101) {
			own = true;
			onstate?.('own');
		} else if (result.status === 403) {
			blocked = true;
			onstate?.('blocked');
		} else {
			leaked = true;
			onstate?.('leaked');
		}
		if (own && leaked && blocked) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[own, leaked, blocked]}>
	<div class="lab-actions">
		<label class="lab-label"
			>{tx.labels.invoice}<select
				aria-label={tx.labels.invoice}
				class="lab-input"
				bind:value={invoice}
				><option value={101}>101, Nim</option><option value={102}>102, Ari</option></select
			></label
		>
		<button class="lab-button primary" onclick={send}>{tx.labels.send}</button>
	</div>
	<div class="lab-card">
		<p class="lab-caption">{tx.labels.session}</p>
		<label class="lab-check"
			><input type="checkbox" bind:checked={protectedRoute} />{tx.labels.guard}</label
		>
		<pre class="lab-code">{protectedRoute
				? 'if (invoice.owner !== session.user) {\n  return response(403);\n}\nreturn response(200, invoice);'
				: 'return response(200, invoice);'}</pre>
	</div>
	<div class="lab-grid">
		<div class="lab-card">
			<span class="lab-label">{tx.labels.request}</span>
			<pre class="lab-code">{sent || tx.labels.waiting}</pre>
		</div>
		<div class="lab-card" aria-live="polite">
			<div class="server">
				<Server active={result?.status === 200} /><span>{tx.labels.response}</span>
			</div>
			<pre class="lab-code">{result ? rawResponse(result) : tx.labels.waiting}</pre>
		</div>
	</div>
</LabBench>

<style>
	.server {
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: 12px;
		color: var(--color-muted);
	}
</style>
