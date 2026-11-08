<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	const functions = ['govern', 'identify', 'protect', 'detect', 'respond', 'recover'] as const;
	type FunctionName = (typeof functions)[number];
	let done = $state<Record<FunctionName, boolean>>({
		govern: false,
		identify: false,
		protect: false,
		detect: false,
		respond: false,
		recover: false
	});
	let incident = $state(false),
		restored = $state(false),
		message = $state('ready');
	function apply(key: FunctionName) {
		if (key === 'protect' && incident) {
			message = 'tooLate';
			onstate?.('tooLate');
			return;
		}
		if ((key === 'detect' || key === 'respond') && !incident) {
			message = 'noIncident';
			onstate?.('noIncident');
			return;
		}
		if (key === 'recover' && (!done.protect || !done.respond)) {
			message = 'notReady';
			onstate?.('notReady');
			return;
		}
		done = { ...done, [key]: true };
		if (key === 'recover') restored = true;
		message = key;
		onstate?.(key);
		if (functions.every((f) => done[f])) oncomplete?.();
	}
	function attack() {
		incident = true;
		restored = false;
		message = 'incident';
		onstate?.('incident');
	}
	function prepareScenario() {
		done = {
			govern: false,
			identify: false,
			protect: false,
			detect: false,
			respond: false,
			recover: false
		};
		incident = false;
		restored = false;
		message = 'ready';
	}
</script>

<LabBench text={tx} done={functions.map((f) => done[f])}>
	<div class="lab-actions">
		<button class="lab-button primary" disabled={incident} onclick={attack}
			>{tx.labels.incidentButton}</button
		>
		{#if incident && !done.protect}
			<button class="lab-button" onclick={prepareScenario}>{tx.labels.newScenario}</button>
		{/if}
	</div>
	<div class="functions">
		{#each functions as key (key)}<button
				class="lab-button"
				class:done={done[key]}
				onclick={() => apply(key)}
				><b>{key.toUpperCase()}</b><span>{tx.labels[key + 'Action']}</span></button
			>{/each}
	</div>
	<div class="lab-card system">
		<div><Server active={!incident || restored} /><span>nimbus.com</span></div>
		<div><Server slots={2} active={done.protect} /><span>{tx.labels.backup}</span></div>
	</div>
	<div class="lab-card" aria-live="polite">
		<strong>{tx.labels[message]}</strong>
		<p class="lab-caption">{tx.labels.owner} {done.govern ? 'Ari' : tx.labels.unknown}</p>
		<p class="lab-caption">{tx.labels.inventory} {done.identify ? '3' : tx.labels.unknown}</p>
		<p class="lab-caption">
			{tx.labels.service}
			{restored
				? tx.labels.restored
				: done.respond
					? tx.labels.isolated
					: incident
						? tx.labels.affected
						: tx.labels.running}
		</p>
	</div>
</LabBench>

<style>
	.functions {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.functions button {
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.functions b {
		font-size: 10px;
		color: var(--color-brand);
		letter-spacing: 0.05em;
	}
	.functions span {
		font-size: 13px;
	}
	.functions .done {
		border-color: var(--color-grass);
		background: color-mix(in srgb, var(--color-grass) 8%, var(--color-card));
	}
	.system {
		display: flex;
		justify-content: center;
		gap: 35px;
	}
	.system > div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		font-size: 12px;
		color: var(--color-muted);
	}
	strong {
		color: var(--color-ink);
	}
</style>
