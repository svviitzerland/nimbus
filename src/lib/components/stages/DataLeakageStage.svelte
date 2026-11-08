<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import { evaluate, trainingRows } from '../labs/evaluation';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let clean = $state(false);
	let rows = $state<ReturnType<typeof evaluate>>([]);
	let before = $state(false),
		after = $state(false);
	const correct = $derived(rows.filter((r) => r.label === r.prediction).length);
	function run() {
		rows = evaluate(clean);
		if (clean) {
			after = true;
			onstate?.('clean');
		} else {
			before = true;
			onstate?.('leak');
		}
		if (before && after) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[before, after]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={run}>{tx.labels.run}</button><label
			class="lab-check"><input type="checkbox" bind:checked={clean} />{tx.labels.clean}</label
		>
	</div>
	<div class="lab-grid">
		<div class="lab-card">
			<span class="lab-label">{tx.labels.train}</span>{#each trainingRows as row (row.id)}<p
					class="row"
				>
					<b>{row.id}</b><span>{tx.labels[row.label]}</span>
				</p>{/each}
			<p class="lab-caption">{tx.labels.model}</p>
		</div>
		<div class="lab-card" aria-live="polite">
			<span class="lab-label">{tx.labels.test}</span>{#each rows as row (row.id)}<div
					class="row"
					class:overlap={row.overlap}
				>
					<b>{row.id}</b><span>{tx.labels[row.label]} → {tx.labels[row.prediction]}</span><span
						>{row.overlap ? tx.labels.seen : tx.labels.new}</span
					>
				</div>{/each}{#if rows.length}<p class="score">
					{correct} / {rows.length}<span>{Math.round((correct / rows.length) * 100)}%</span>
				</p>{:else}<p class="lab-caption">{tx.labels.waiting}</p>{/if}
		</div>
	</div>
</LabBench>

<style>
	.row {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		flex-wrap: wrap;
		padding: 12px 0;
		margin: 0;
		border-bottom: 1px solid var(--color-line);
		font-size: 12px;
		color: var(--color-ink);
	}
	.overlap {
		color: var(--color-amber);
	}
	.score {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		font: 32px var(--font-display);
		color: var(--color-brand);
		margin: 18px 0 0;
	}
	.score span {
		font: 14px var(--font-sans);
	}
</style>
