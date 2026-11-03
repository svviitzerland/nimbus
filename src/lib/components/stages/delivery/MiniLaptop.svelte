<script lang="ts">
	/** The shared Laptop actor, shrunk to fit a node in a network diagram, with a caption. */
	import Laptop from '$lib/components/Laptop.svelte';

	let {
		label = '',
		sub = '',
		led = 'off',
		tint = ''
	}: {
		label?: string;
		sub?: string;
		led?: 'ok' | 'warn' | 'down' | 'off';
		/** Optional CSS colour for a ring under the laptop (used to show VLAN membership). */
		tint?: string;
	} = $props();
</script>

<div class="ml">
	<div class="frame" style={tint ? `--tint:${tint}` : ''} class:tinted={!!tint}>
		<div class="inner"><Laptop {led} /></div>
	</div>
	{#if label}<b class="lbl">{label}</b>{/if}
	{#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
	.ml {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		line-height: 1.1;
	}
	.frame {
		position: relative;
		width: 52px;
		height: 42px;
		border-radius: 8px;
		transition: box-shadow 0.25s ease;
	}
	.frame.tinted {
		box-shadow: 0 0 0 3px var(--tint);
		background: color-mix(in srgb, var(--tint) 14%, transparent);
	}
	.inner {
		position: absolute;
		top: 2px;
		left: 50%;
		width: 132px;
		transform: translateX(-50%) scale(0.36);
		transform-origin: top center;
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
		.lbl {
			font-size: 11.5px;
		}
		.sub {
			font-size: 9.5px;
		}
	}
</style>
