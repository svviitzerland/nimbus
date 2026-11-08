<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Server from '../Server.svelte';
	import { csrfRequest } from '../labs/security-models';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let source = $state<'site' | 'outside'>('outside'),
		token = $state(false),
		strict = $state(false);
	let name = $state('Nim');
	let result = $state<ReturnType<typeof csrfRequest> | null>(null);
	let leaked = $state(false),
		blocked = $state(false),
		valid = $state(false);
	function send() {
		result = csrfRequest(source, token, strict);
		if (result.status === 200) {
			name = source === 'site' ? 'Nim Baru' : 'Intruder';
			if (source === 'outside') leaked = true;
			else if (token) valid = true;
		} else if (token && source === 'outside' && result.status === 403) blocked = true;
		onstate?.(
			result.status === 401
				? 'cookie'
				: result.status === 403
					? 'blocked'
					: source === 'site'
						? 'valid'
						: 'forged'
		);
		if (leaked && blocked && valid) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[leaked, blocked, valid]}>
	<div class="lab-actions">
		<label class="lab-label"
			>{tx.labels.source}<select class="lab-input" aria-label={tx.labels.source} bind:value={source}
				><option value="outside">{tx.labels.outside}</option><option value="site">nimbus.com</option
				></select
			></label
		><button class="lab-button primary" onclick={send}>{tx.labels.send}</button>
	</div>
	<div class="lab-card">
		<label class="lab-check"><input type="checkbox" bind:checked={token} />{tx.labels.token}</label
		><label class="lab-check"
			><input type="checkbox" bind:checked={strict} />{tx.labels.strict}</label
		>
		<p class="lab-caption">{tx.labels.cookieNote}</p>
	</div>
	<div class="lab-grid">
		<div class="lab-card">
			<span class="lab-label">{tx.labels.request}</span>
			<pre
				class="lab-code">{`POST /profile/name HTTP/1.1\nHost: nimbus.com\nCookie: ${source === 'site' || !strict ? 'session=nim_demo' : '(none)'}\nCSRF-Token: ${source === 'site' ? 'valid_demo_token' : '(missing)'}\n\nname=${source === 'site' ? 'Nim Baru' : 'Intruder'}`}</pre>
		</div>
		<div class="lab-card account">
			<Server active={result?.status === 200} /><span>{tx.labels.account}</span><strong
				>{name}</strong
			><output class="lab-code" aria-live="polite"
				>{result ? String(result.status) : tx.labels.waiting}</output
			>
		</div>
	</div>
</LabBench>

<style>
	.account {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		color: var(--color-muted);
		font-size: 13px;
	}
	.account strong {
		font: 28px var(--font-display);
		color: var(--color-ink);
	}
</style>
