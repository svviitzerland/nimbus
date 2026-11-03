<script lang="ts">
	/** The shared Server rack actor, shrunk for network diagrams, with a caption. */
	import Server from '$lib/components/Server.svelte';

	let {
		label = '',
		sub = '',
		active = false,
		slots = 2
	}: { label?: string; sub?: string; active?: boolean; slots?: number } = $props();
</script>

<div class="ms" class:active>
	<Server {slots} {active} />
	{#if label}<b class="lbl">{label}</b>{/if}
	{#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
	.ms {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		line-height: 1.1;
	}
	.ms :global(.server) {
		width: 46px;
		gap: 4px;
		padding: 5px;
		border-radius: 8px;
		border-width: 1.5px;
		transition: border-color 0.25s ease;
	}
	.ms :global(.server .slot) {
		height: 8px;
		padding: 0 4px;
	}
	.ms :global(.server .dot) {
		width: 4px;
		height: 4px;
	}
	.ms.active :global(.server) {
		border-color: var(--color-grass);
	}
	.lbl {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.sub {
		font-size: 8.5px;
		font-weight: 600;
		color: var(--color-faint);
		white-space: nowrap;
	}
	@media (min-width: 768px) {
		.ms :global(.server) {
			width: 56px;
		}
		.lbl {
			font-size: 11.5px;
		}
		.sub {
			font-size: 9.5px;
		}
	}
</style>
