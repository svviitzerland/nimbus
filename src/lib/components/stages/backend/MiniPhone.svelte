<script lang="ts">
	import type { Snippet } from 'svelte';

	// A small phone with an address bar, the "you" actor for the backend lessons.
	let {
		url = 'nimbus.com',
		led = 'idle',
		width = 170,
		children
	}: {
		url?: string;
		led?: 'idle' | 'busy' | 'ok' | 'bad';
		width?: number;
		children?: Snippet;
	} = $props();
</script>

<div class="phone" style="width:{width}px">
	<div class="screen">
		<div class="addr">
			<span class="led {led}"></span>
			<span class="url">{url}</span>
		</div>
		<div class="body">
			{@render children?.()}
		</div>
	</div>
</div>

<style>
	.phone {
		max-width: 100%;
		border-radius: 24px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 8px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	:global(.dark) .phone {
		box-shadow: 0 10px 26px rgba(0, 0, 0, 0.25);
	}
	.screen {
		position: relative;
		border-radius: 17px;
		background: var(--color-paper);
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 6px 9px;
		background: var(--color-card);
		border-bottom: 1px solid var(--color-line);
	}
	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-faint);
		transition: background 0.3s;
	}
	.led.busy {
		background: var(--color-amber);
	}
	.led.ok {
		background: var(--color-grass);
	}
	.led.bad {
		background: var(--color-danger);
	}
	.url {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-radius: 6px;
		background: var(--color-paper);
		padding: 2px 7px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.body {
		position: relative;
		min-height: 120px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 11.5px;
		color: var(--color-ink);
	}
</style>
