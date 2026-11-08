<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let email = $state('nim');
	let serverValidation = $state(false);
	let form: HTMLFormElement;
	let clientRejected = $state(false),
		bypassed = $state(false),
		serverRejected = $state(false);
	let result = $state('');
	function invalid() {
		clientRejected = true;
		onstate?.('client');
		if (clientRejected && bypassed && serverRejected) oncomplete?.();
	}
	function send(direct = false) {
		if (!direct && !form.reportValidity()) {
			invalid();
			return;
		}
		const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		if (serverValidation && !valid) {
			result = '422 Unprocessable Content';
			serverRejected = true;
			onstate?.('server');
		} else {
			result = '201 Created';
			if (!valid) {
				bypassed = true;
				onstate?.('bypassed');
			} else onstate?.('valid');
		}
		if (clientRejected && bypassed && serverRejected) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[clientRejected, bypassed, serverRejected]}>
	<form
		bind:this={form}
		class="lab-card"
		onsubmit={(e) => {
			e.preventDefault();
			send();
		}}
	>
		<label class="lab-label"
			>{tx.labels.email}<input
				class="lab-input"
				type="email"
				required
				bind:value={email}
				oninvalid={invalid}
				autocomplete="off"
			/></label
		>
		<p class="lab-caption">{tx.labels.sample}</p>
		<button class="lab-button primary" type="submit">{tx.labels.submit}</button>
	</form>
	<div class="lab-actions">
		<button class="lab-button" onclick={() => send(true)}>{tx.labels.direct}</button><label
			class="lab-check"
			><input type="checkbox" bind:checked={serverValidation} />{tx.labels.validate}</label
		>
	</div>
	<div class="lab-card server">
		<Server active={result.startsWith('201')} />
		<div aria-live="polite">
			<span class="lab-label">nimbus.com</span>
			<pre class="lab-code">{result || tx.labels.waiting}</pre>
		</div>
	</div>
	<pre
		class="lab-code">{`POST /signup HTTP/1.1\nHost: nimbus.com\nContent-Type: application/json\n\n${JSON.stringify({ email })}`}</pre>
</LabBench>

<style>
	.server {
		display: flex;
		align-items: center;
		gap: 18px;
	}
	.server > div {
		flex: 1;
		min-width: 0;
	}
</style>
