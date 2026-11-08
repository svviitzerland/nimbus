<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import { checkout, checkoutCases, type Comparison } from '../labs/testing';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let operator = $state<Comparison>('>');
	let results = $state<{ input: number; expected: number; actual: number }[]>([]);
	let sawFailure = $state(false),
		passed = $state(false);
	function test() {
		results = checkoutCases.map((c) => ({ ...c, actual: checkout(c.input, operator) }));
		const ok = results.every((c) => c.actual === c.expected);
		if (ok) {
			passed = true;
			onstate?.('passed');
		} else {
			sawFailure = true;
			onstate?.('failed');
		}
		if (sawFailure && passed) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[sawFailure, passed]}>
	<p class="lab-caption">{tx.labels.rule}</p>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={test}>{tx.labels.run}</button><label
			class="lab-label"
			>{tx.labels.operator}<select
				aria-label={tx.labels.operator}
				class="lab-input"
				bind:value={operator}
				><option>&gt;</option><option>&gt;=</option><option>===</option></select
			></label
		>
	</div>
	<div class="lab-card">
		<span class="lab-label">checkout.js</span>
		<pre
			class="lab-code">{`function total(amount) {\n  return amount ${operator} 100\n    ? amount - 10\n    : amount;\n}`}</pre>
	</div>
	<div class="lab-card" aria-live="polite">
		<span class="lab-label">{tx.labels.results}</span>
		{#if results.length === 0}<p class="lab-caption">{tx.labels.waiting}</p>{/if}
		{#each results as result (result.input)}<div
				class="case"
				class:pass={result.actual === result.expected}
			>
				<strong>{result.actual === result.expected ? 'PASS' : 'FAIL'}</strong><span
					>{result.input} → {result.actual}</span
				><span>{tx.labels.expected} {result.expected}</span>
			</div>{/each}
	</div>
</LabBench>

<style>
	.case {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		justify-content: space-between;
		padding: 13px 0;
		border-bottom: 1px solid var(--color-line);
		font-size: 13px;
		color: var(--color-danger);
	}
	.case.pass {
		color: var(--color-grass);
	}
</style>
