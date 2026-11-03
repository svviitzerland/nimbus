<script lang="ts">
	// A browser window around a sandboxed preview. Learner code only ever runs in here, never in
	// the app. `scripts` allows JavaScript, but never same origin, forms, popups, or navigation.
	let {
		label,
		srcdoc,
		scripts = false,
		led = false,
		frame = $bindable(null),
		title = ''
	}: {
		label: string;
		srcdoc: string;
		scripts?: boolean;
		led?: boolean;
		frame?: HTMLIFrameElement | null;
		title?: string;
	} = $props();
</script>

<div class="pane">
	<div class="addr">
		<span class="led" class:on={led}></span>
		<span class="url">{label}</span>
	</div>
	{#if scripts}
		<iframe bind:this={frame} title={title || label} sandbox="allow-scripts" {srcdoc}></iframe>
	{:else}
		<iframe bind:this={frame} title={title || label} sandbox="" {srcdoc}></iframe>
	{/if}
</div>

<style>
	.pane {
		min-width: 0;
		display: flex;
		flex-direction: column;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-muted);
		transition: background 0.3s;
	}
	.led.on {
		background: var(--color-grass);
	}
	.url {
		flex: 1;
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}
	iframe {
		display: block;
		width: 100%;
		height: var(--frame-h, 180px);
		border: 0;
		background: #fff;
	}
	@media (min-width: 768px) {
		iframe {
			flex: 1;
			height: auto;
			min-height: var(--frame-h-wide, 220px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.led {
			transition: none;
		}
	}
</style>
