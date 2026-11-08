<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import { repeatRequest, rawResponse, type LabResponse } from '../labs/http';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let intercept = $state(true);
	let captured = $state(false);
	let forwarded = $state(false);
	let pending = $state(false);
	let repeated = $state(false);
	let tab = $state<'proxy' | 'repeater'>('proxy');
	let request = $state('GET /products/1 HTTP/1.1\nHost: nimbus.com');
	let result = $state<LabResponse | null>(null);
	function capture() {
		captured = true;
		pending = true;
		tab = 'proxy';
		result = null;
		onstate?.('captured');
		if (!intercept) forward();
	}
	function forward() {
		forwarded = true;
		pending = false;
		result = repeatRequest('GET /products/1 HTTP/1.1\nHost: nimbus.com');
		onstate?.('forwarded');
		if (repeated) oncomplete?.();
	}
	function send() {
		result = repeatRequest(request);
		if (result.status === 200 && request.split(/\r?\n/)[0] === 'GET /products/2 HTTP/1.1') {
			repeated = true;
			onstate?.('changed');
			if (forwarded) oncomplete?.();
		} else onstate?.(result.status === 200 ? 'same' : 'invalid');
	}
</script>

<LabBench text={tx} done={[captured, forwarded, repeated]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={capture}>{tx.labels.open}</button>
		<label class="lab-check"
			><input type="checkbox" bind:checked={intercept} />{tx.labels.intercept}</label
		>
	</div>
	<div class="lab-card">
		<div class="lab-actions" role="group" aria-label={tx.labels.tool}>
			<button class="lab-button" aria-pressed={tab === 'proxy'} onclick={() => (tab = 'proxy')}
				>Proxy</button
			>
			<button
				class="lab-button"
				aria-pressed={tab === 'repeater'}
				onclick={() => (tab = 'repeater')}>Repeater</button
			>
		</div>
		{#if tab === 'proxy'}
			<p class="lab-caption">
				{captured ? (pending ? tx.labels.held : tx.labels.forwarded) : tx.labels.empty}
			</p>
			{#if captured}
				<pre class="lab-code">GET /products/1 HTTP/1.1&#10;Host: nimbus.com</pre>
				<div class="lab-actions">
					<button class="lab-button" disabled={!pending} onclick={forward}
						>{tx.labels.forward}</button
					>
					<button
						class="lab-button"
						onclick={() => {
							tab = 'repeater';
							result = null;
						}}>{tx.labels.repeat}</button
					>
				</div>
			{/if}
		{:else}
			<label class="lab-label"
				>{tx.labels.request}<textarea
					class="lab-input lab-code"
					rows="4"
					spellcheck="false"
					bind:value={request}
				></textarea></label
			>
			<p class="lab-caption">{tx.labels.edit}</p>
			<button class="lab-button primary" onclick={send}>{tx.labels.send}</button>
		{/if}
	</div>
	<div class="answer lab-card">
		<div class="rack"><Server active={result?.status === 200} /><span>nimbus.com</span></div>
		<div class="response" aria-live="polite">
			<span class="lab-label">{tx.labels.response}</span>{#if result}<pre
					class="lab-code">{rawResponse(result)}</pre>{:else}<p class="lab-caption">
					{tx.labels.waiting}
				</p>{/if}
		</div>
	</div>
</LabBench>

<style>
	.answer {
		display: flex;
		gap: 18px;
		align-items: center;
	}
	.rack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.response {
		min-width: 0;
		flex: 1;
	}
	@media (max-width: 420px) {
		.answer {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
