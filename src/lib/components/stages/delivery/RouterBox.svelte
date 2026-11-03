<script lang="ts">
	/**
	 * A small home or office router (a box with two antennas and status lights), the recognisable
	 * actor the delivery batch uses for every router. `tone` colours the lights and the outline.
	 */
	let {
		label = '',
		sub = '',
		tone = 'idle',
		small = false
	}: {
		label?: string;
		sub?: string;
		tone?: 'idle' | 'active' | 'warn' | 'down';
		small?: boolean;
	} = $props();
</script>

<div class="rb" class:small>
	<div class="box {tone}">
		<span class="ant l"></span>
		<span class="ant r"></span>
		<span class="leds"><i></i><i></i><i></i></span>
	</div>
	{#if label}<b class="lbl">{label}</b>{/if}
	{#if sub}<span class="sub">{sub}</span>{/if}
</div>

<style>
	.rb {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		line-height: 1.1;
	}
	.box {
		position: relative;
		width: 46px;
		height: 20px;
		margin-top: 9px;
		border-radius: 6px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		transition:
			border-color 0.25s ease,
			box-shadow 0.25s ease;
	}
	.small .box {
		width: 38px;
		height: 17px;
	}
	.ant {
		position: absolute;
		top: -10px;
		width: 2px;
		height: 10px;
		border-radius: 2px;
		background: var(--color-faint);
	}
	.ant.l {
		left: 8px;
		transform: rotate(-12deg);
	}
	.ant.r {
		right: 8px;
		transform: rotate(12deg);
	}
	.leds {
		display: flex;
		gap: 4px;
	}
	.leds i {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-faint);
		transition: background 0.25s ease;
	}
	.active {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 16%, transparent);
	}
	.active .leds i {
		background: var(--color-grass);
	}
	.warn {
		border-color: var(--color-amber);
	}
	.warn .leds i {
		background: var(--color-amber);
	}
	.down {
		border-color: var(--color-danger);
		opacity: 0.75;
	}
	.down .leds i {
		background: var(--color-danger);
	}
	.lbl {
		font-size: 10.5px;
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
		.box {
			width: 54px;
			height: 23px;
		}
		.lbl {
			font-size: 12px;
		}
		.sub {
			font-size: 9.5px;
		}
	}
</style>
