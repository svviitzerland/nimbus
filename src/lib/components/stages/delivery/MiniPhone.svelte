<script lang="ts">
	/** The shared Browser (phone) actor, shrunk for network diagrams, with a caption. */
	import Browser from '$lib/components/Browser.svelte';

	let {
		label = '',
		phase = 'idle'
	}: { label?: string; phase?: 'idle' | 'loading' | 'loaded' | 'offline' } = $props();
</script>

<div class="mp">
	<div class="frame">
		<div class="inner"><Browser {phase} /></div>
	</div>
	{#if label}<b class="lbl">{label}</b>{/if}
</div>

<style>
	.mp {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		line-height: 1.1;
	}
	.frame {
		position: relative;
		width: 40px;
		height: 62px;
	}
	/* keep the phone at its natural width, then scale the whole thing down */
	.inner {
		position: absolute;
		top: 0;
		left: 50%;
		width: 158px;
		transform: translateX(-50%) scale(0.25);
		transform-origin: top center;
	}
	.lbl {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
		white-space: nowrap;
	}
	@media (min-width: 768px) {
		.lbl {
			font-size: 11.5px;
		}
	}
</style>
