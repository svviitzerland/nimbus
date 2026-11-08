<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let serverOnly = $state(false),
		rotated = $state(false),
		exposed = $state(false),
		checked = $state(false),
		healthy = $state(false);
	let showSource = $state(false);
	let result = $state('');
	function inspect() {
		showSource = true;
		if (!serverOnly) {
			exposed = true;
			onstate?.('exposed');
		} else onstate?.('moved');
	}
	function steal() {
		result = rotated ? '401 Unauthorized' : '200 OK';
		if (rotated) checked = true;
		onstate?.(rotated ? 'revoked' : 'stillValid');
		finish();
	}
	function visit() {
		const ok = serverOnly || !rotated;
		result = ok ? '200 OK' : '401 Unauthorized';
		if (serverOnly && rotated) healthy = true;
		onstate?.(ok ? 'works' : 'broken');
		finish();
	}
	function finish() {
		if (exposed && serverOnly && checked && healthy) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[exposed, serverOnly, checked, healthy]}>
	<div class="lab-actions">
		<button class="lab-button" onclick={inspect}>{tx.labels.inspect}</button><label
			class="lab-check"
			><input
				type="checkbox"
				bind:checked={serverOnly}
				onchange={() => onstate?.(serverOnly ? 'moved' : 'exposed')}
			/>{tx.labels.move}</label
		><button
			class="lab-button"
			disabled={rotated}
			onclick={() => {
				rotated = true;
				onstate?.('rotated');
			}}>{tx.labels.rotate}</button
		>
	</div>
	<div class="lab-grid">
		<div class="lab-card">
			<span class="lab-label">browser.js</span>
			<pre class="lab-code">{showSource
					? serverOnly
						? 'fetch("/api/weather");'
						: 'const key = "NIM_DEMO_V1";\nfetch("/weather?key=" + key);'
					: tx.labels.hidden}</pre>
		</div>
		<div class="lab-card">
			<div class="rack"><Server active={serverOnly} /><span>server.js</span></div>
			<pre class="lab-code">{serverOnly
					? 'const key = process.env.WEATHER_KEY;\n// NIM_DEMO_V' + (rotated ? '2' : '1')
					: tx.labels.noServer}</pre>
		</div>
	</div>
	<div class="lab-actions">
		<button class="lab-button" onclick={steal}>{tx.labels.stolen}</button><button
			class="lab-button primary"
			onclick={visit}>{tx.labels.visit}</button
		>
	</div>
	<output class="lab-code" aria-live="polite">{result || tx.labels.waiting}</output>
</LabBench>

<style>
	.rack {
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 12px;
		color: var(--color-muted);
	}
</style>
