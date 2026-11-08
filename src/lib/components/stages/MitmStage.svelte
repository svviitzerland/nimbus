<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Browser from '../Browser.svelte';
	import Server from '../Server.svelte';
	import MiniLaptop from './delivery/MiniLaptop.svelte';
	import { transit } from '../labs/security-models';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let https = $state(false),
		onPath = $state(true),
		trust = $state(false);
	let result = $state<ReturnType<typeof transit> | null>(null);
	let plain = $state(false),
		blocked = $state(false),
		proxied = $state(false);
	function send() {
		result = transit(https, onPath, trust);
		if (onPath && !https) plain = true;
		if (result.reason === 'certificate') blocked = true;
		if (https && result.readable) proxied = true;
		onstate?.(
			result.reason === 'certificate'
				? 'blocked'
				: result.readable
					? https
						? 'trusted'
						: 'plain'
					: 'safe'
		);
		if (plain && blocked && proxied) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[plain, blocked, proxied]}>
	<div class="lab-actions">
		<button class="lab-button primary" onclick={send}>{tx.labels.send}</button><label
			class="lab-check"><input type="checkbox" bind:checked={https} />HTTPS</label
		><label class="lab-check"
			><input type="checkbox" bind:checked={onPath} />{tx.labels.onPath}</label
		>
	</div>
	<div class="lab-card">
		<label class="lab-check"><input type="checkbox" bind:checked={trust} />{tx.labels.trust}</label>
		<p class="lab-caption">{tx.labels.trustNote}</p>
		<code class="lab-code"
			>{https && onPath
				? 'Subject = nimbus.com\nIssuer = Nimbus Lab CA'
				: https
					? 'Subject = nimbus.com\nChain = trusted'
					: tx.labels.noCertificate}</code
		>
	</div>
	<div class="lab-card route">
		<div class="actor">
			<div class="phone">
				<Browser phase={!result ? 'idle' : result.delivered ? 'loaded' : 'offline'} />
			</div>
			<span>{tx.labels.browser}</span>
		</div>
		<span aria-hidden="true">↓</span>{#if onPath}<MiniLaptop
				label={tx.labels.middle}
				sub={result?.readable ? tx.labels.readable : tx.labels.locked}
				led={result?.readable ? 'warn' : 'off'}
			/><span aria-hidden="true">↓</span>{/if}
		<div class="actor"><Server active={!!result?.delivered} /><span>nimbus.com</span></div>
	</div>
	<div class="lab-grid" aria-live="polite">
		<div class="lab-card">
			<span class="lab-label">{tx.labels.wire}</span>
			<pre class="lab-code">{!result
					? tx.labels.waiting
					: !result.delivered
						? tx.labels.handshake
						: result.readable
							? 'GET /products/1 HTTP/1.1\nHost: nimbus.com'
							: tx.labels.ciphertext}</pre>
		</div>
		<div class="lab-card">
			<span class="lab-label">{tx.labels.page}</span>
			<p class="lab-caption">
				{!result
					? tx.labels.waiting
					: !result.delivered
						? tx.labels.blocked
						: result.modified
							? tx.labels.changed
							: tx.labels.original}
			</p>
		</div>
	</div>
</LabBench>

<style>
	.route {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.actor {
		display: flex;
		align-items: center;
		gap: 20px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.phone {
		width: 64px;
		height: 104px;
		overflow: hidden;
	}
	.phone :global(.phone) {
		transform: scale(0.4);
		transform-origin: top left;
		max-width: none;
	}
	code {
		display: block;
		white-space: pre-wrap;
	}
</style>
