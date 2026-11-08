<script lang="ts">
	import LabBench from '../labs/LabBench.svelte';
	import Browser from '../Browser.svelte';
	import Server from '../Server.svelte';
	import MiniLaptop from './delivery/MiniLaptop.svelte';
	import type { StageProps, ExperimentText } from '$lib/chapters/types';
	let { text, onstate, oncomplete }: StageProps = $props();
	const tx = $derived(text as ExperimentText);
	let target = $state<'local' | 'remote'>('local');
	let table = $state<{ ip: string; mac: string }[]>([]);
	let result = $state('');
	let local = $state(false),
		remote = $state(false),
		cached = $state(false);
	function send() {
		const hop =
			target === 'local'
				? { ip: '192.168.1.20', mac: '02:00:00:00:00:20' }
				: { ip: '192.168.1.1', mac: '02:00:00:00:00:01' };
		const found = table.some((row) => row.ip === hop.ip);
		if (!found) table = [...table, hop];
		else cached = true;
		if (target === 'local') local = true;
		else remote = true;
		result = `${found ? tx.labels.cached : tx.labels.broadcast} ${hop.ip}\n${tx.labels.frame} ${hop.mac}\n${tx.labels.packet} ${target === 'local' ? '192.168.1.20' : '203.0.113.10'}`;
		onstate?.(found ? 'cached' : target);
		if (local && remote && cached) oncomplete?.();
	}
</script>

<LabBench text={tx} done={[local, remote, cached]}>
	<div class="lab-actions">
		<label class="lab-label"
			>{tx.labels.destination}<select
				aria-label={tx.labels.destination}
				class="lab-input"
				bind:value={target}
				><option value="local">{tx.labels.local}</option><option value="remote"
					>{tx.labels.remote}</option
				></select
			></label
		><button class="lab-button primary" onclick={send}>{tx.labels.send}</button>
	</div>
	<div class="lab-card topology">
		<div class="device">
			<div class="phone"><Browser phase={result ? 'loaded' : 'idle'} /></div>
			<span>192.168.1.10 /24</span><span>{tx.labels.you}</span>
		</div>
		<span class="link" aria-hidden="true">→</span>{#if target === 'remote'}<div class="router">
				<div class="ports"><i></i><i></i><i></i><i></i></div>
				<span>{tx.labels.router}</span><code>192.168.1.1</code>
			</div>
			<span class="link" aria-hidden="true">→</span>
			<div class="device">
				<Server active={!!result} /><span>nimbus.com</span>
			</div>{:else}<MiniLaptop
				label="192.168.1.20"
				sub={tx.labels.local}
				led={result ? 'ok' : 'off'}
			/>{/if}
	</div>
	<div class="lab-card">
		<span class="lab-label">{tx.labels.cache}</span>{#if !table.length}<p class="lab-caption">
				{tx.labels.empty}
			</p>{/if}{#each table as row (row.ip)}<div class="arp-row">
				<code>{row.ip}</code><code>{row.mac}</code>
			</div>{/each}
	</div>
	<pre class="lab-code" aria-live="polite">{result || tx.labels.waiting}</pre>
</LabBench>

<style>
	.topology {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		align-items: center;
		justify-content: center;
	}
	.device,
	.router {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-size: 11px;
		color: var(--color-muted);
	}
	.router {
		padding: 15px 10px;
		border: 2px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-paper);
	}
	.ports {
		display: flex;
		gap: 5px;
	}
	.ports i {
		width: 12px;
		height: 12px;
		border: 1px solid var(--color-muted);
		background: var(--color-card);
	}
	.link {
		color: var(--color-brand);
	}
	.phone {
		width: 64px;
		height: 110px;
		overflow: hidden;
	}
	.phone :global(.phone) {
		transform: scale(0.4);
		transform-origin: top left;
		max-width: none;
	}
	.arp-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 6px;
		padding: 12px 0;
		border-bottom: 1px solid var(--color-line);
		font-size: 12px;
		color: var(--color-ink);
	}
	@media (max-width: 440px) {
		.topology {
			flex-direction: column;
		}
		.link {
			transform: rotate(90deg);
		}
	}
</style>
