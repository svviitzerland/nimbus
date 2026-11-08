<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import { advisoryApplies } from '../labs/security-models';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let version = $state<'1.4' | '1.5'>('1.4'),
		enabled = $state(true),
		result = $state('');
	let affected = $state(false),
		mitigated = $state(false),
		fixed = $state(false);
	function scan() {
		result = advisoryApplies(version, enabled)
			? 'affected'
			: version === '1.5'
				? 'fixed'
				: 'mitigated';
		if (result === 'affected') affected = true;
		if (result === 'mitigated') mitigated = true;
		if (result === 'fixed') fixed = true;
		onstate?.(result);
		if (affected && mitigated && fixed) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[affected, mitigated, fixed]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={scan}>{tx.labels.scan}</button><label
			class="lab-label"
			>{tx.labels.version}<select
				class="lab-input"
				aria-label={tx.labels.version}
				bind:value={version}><option>1.4</option><option>1.5</option></select
			></label
		>
	</div>
	<div class="lab-card">
		<label class="lab-check"
			><input type="checkbox" bind:checked={enabled} />{tx.labels.feature}</label
		>
		<div class="server">
			<Server active={true} />
			<div>
				<strong>Nimbus Gallery {version}</strong>
				<p class="lab-caption">nimbus.com</p>
			</div>
		</div>
	</div>
	<div class="lab-card">
		<span class="lab-label">{tx.labels.advisory}</span>
		<h3>NIM_DEMO_001</h3>
		<p class="lab-caption">{tx.labels.description}</p>
		<pre
			class="lab-code">Nimbus Gallery\naffected = 1.0 through 1.4\nfixed = 1.5\nweakness = CWE-79</pre>
	</div>
	<div class="lab-card" aria-live="polite">
		<strong>{result ? tx.labels[result] : tx.labels.waiting}</strong>
		<p class="lab-caption">{result ? tx.labels[result + 'Note'] : tx.labels.compare}</p>
	</div>
	<div class="lab-grid">
		{#each ['cve', 'cwe', 'nvd', 'cvss'] as term (term)}<div class="lab-card">
				<strong>{term.toUpperCase()}</strong>
				<p class="lab-caption">{tx.labels[term]}</p>
			</div>{/each}
	</div>
</LabBench>

<style>
	.server {
		display: flex;
		align-items: center;
		gap: 20px;
		margin-top: 15px;
	}
	strong,
	h3 {
		color: var(--color-ink);
	}
	h3 {
		margin: 10px 0;
		font: 24px var(--font-display);
	}
</style>
