<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Browser from '../Browser.svelte';
	import Server from '../Server.svelte';
	import { riskOutcome } from '../labs/security-models';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let exposed = $state(true),
		patched = $state(false),
		sensitive = $state(true);
	let result = $state(''),
		leaked = $state(false),
		limited = $state(false),
		blocked = $state(false);
	function probe() {
		result = riskOutcome(exposed, patched, sensitive);
		if (result.endsWith('Leak')) leaked = true;
		if (result === 'limited') limited = true;
		if (result === 'blocked') blocked = true;
		onstate?.(result);
		if (leaked && limited && blocked) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[leaked, limited, blocked]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={probe}>{tx.labels.probe}</button>
	</div>
	<div class="lab-card switches">
		<label class="lab-check"
			><input type="checkbox" bind:checked={exposed} />{tx.labels.exposed}</label
		>
		<label class="lab-check"
			><input type="checkbox" bind:checked={sensitive} />{tx.labels.sensitive}</label
		>
		<label class="lab-check"
			><input type="checkbox" bind:checked={patched} />{tx.labels.patched}</label
		>
	</div>
	<div class="lab-card actors">
		<div class="actor">
			<div class="small-phone"><Browser phase={result ? 'loaded' : 'idle'} /></div>
			<span>{tx.labels.threat}</span>
		</div>
		<span aria-hidden="true">→</span>
		<div class="actor">
			<Server active={true} /><span>nimbus.com</span><small
				>{patched ? tx.labels.fixed : tx.labels.vulnerable}</small
			>
		</div>
	</div>
	<div class="lab-card" aria-live="polite">
		<span class="lab-label">{tx.labels.asset}</span><strong
			>{sensitive ? tx.labels.private : tx.labels.public}</strong
		>
		<p class="lab-caption">{result ? tx.labels[result] : tx.labels.waiting}</p>
		{#if result.endsWith('Leak')}<pre class="lab-code">{sensitive
					? 'owner = Nim\ninvoice = 101\naddress = Nimbus Street 1'
					: 'product = Nimbus notebook\nprice = 25'}</pre>{/if}
	</div>
</LabBench>

<style>
	.actors {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 32px;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: var(--color-muted);
		font-size: 12px;
	}
	.actor small {
		max-width: 150px;
		text-align: center;
	}
	.small-phone {
		width: 64px;
		height: 105px;
		overflow: hidden;
	}
	.small-phone :global(.phone) {
		transform: scale(0.4);
		transform-origin: top left;
		max-width: none;
	}
	strong {
		display: block;
		margin-top: 10px;
		color: var(--color-ink);
	}
	.switches {
		display: grid;
		gap: 4px;
	}
</style>
