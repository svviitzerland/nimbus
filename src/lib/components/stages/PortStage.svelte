<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText, PortText } from '$lib/chapters/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as PortText);

	let active = $state('');
	const viewed = new SvelteSet<string>();
	let done = false;
	let summaryTimer: ReturnType<typeof setTimeout> | undefined;
	const current = $derived(tx.ports.find((p) => p.port === active));

	function pick(port: string) {
		active = port;
		onstate?.(port); // always show this port's own service first
		viewed.add(port);
		if (viewed.size === tx.ports.length && !done) {
			done = true;
			oncomplete?.();
			// let the last port read for a moment, then Nim gives the wrap up
			summaryTimer = setTimeout(() => onstate?.('all'), 1500);
		}
	}

	onDestroy(() => clearTimeout(summaryTimer));
</script>

<div class="wrap">
	<div class="addr">
		<span class="alabel">{tx.addrLabel}</span>
		<span class="achip">{tx.address}</span>
	</div>

	<div class="building">
		<div class="facade">
			<span></span><span></span><span></span><span></span><span></span><span></span>
		</div>
		<div class="doors">
			{#each tx.ports as p, eachIndex1271 (eachIndex1271)}
				<button
					type="button"
					class="door"
					class:open={viewed.has(p.port)}
					class:active={active === p.port}
					onclick={() => pick(p.port)}
				>
					<span class="leaf">
						{#if viewed.has(p.port)}
							<span class="svc">{p.name}</span>
						{:else}
							<span class="knob"></span>
						{/if}
					</span>
					<span class="pnum">{p.port}</span>
				</button>
			{/each}
		</div>
	</div>

	<p class="desc">
		{#if current}<span class="dport">Port {current.port}</span
			>{current.desc}{:else}{tx.tapHint}{/if}
	</p>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 13px;
		width: min(94vw, 360px);
		height: 100%;
	}
	.addr {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.alabel {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.achip {
		border-radius: 999px;
		border: 1px solid #cdddf6;
		background: var(--color-brand-soft);
		color: #2e6fe0;
		font-size: 12px;
		font-weight: 800;
		padding: 3px 12px;
	}
	.building {
		width: 100%;
		border-radius: 16px 16px 12px 12px;
		border: 1.5px solid #e6e0d6;
		background: linear-gradient(#fff, #faf7f1);
		padding: 12px 12px 14px;
		box-shadow: 0 12px 28px rgba(22, 40, 60, 0.09);
	}
	.facade {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
		margin-bottom: 12px;
	}
	.facade span {
		height: 12px;
		border-radius: 3px;
		background: #eef2f6;
		border: 1px solid #e3e8ee;
	}
	.doors {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 7px;
	}
	.door {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		cursor: pointer;
		background: none;
	}
	.leaf {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 64px;
		border-radius: 8px 8px 4px 4px;
		border: 1.5px solid #d9cfbf;
		background: #efe7d8;
		transition:
			border-color 0.2s ease,
			background 0.25s ease,
			transform 0.2s ease;
	}
	.door:hover .leaf {
		transform: translateY(-2px);
	}
	.door.open .leaf {
		border-color: #bcd6f5;
		background: #eef5ff;
	}
	.door.active .leaf {
		border-color: #2e6fe0;
		box-shadow: 0 0 0 2px rgba(46, 111, 224, 0.16);
	}
	.knob {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #b6a98f;
	}
	.svc {
		padding: 0 3px;
		text-align: center;
		font-size: 10.5px;
		font-weight: 800;
		line-height: 1.1;
		color: #2e6fe0;
		animation: pop 0.25s ease both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.pnum {
		font-size: 11px;
		font-weight: 800;
		color: #6a7681;
		font-variant-numeric: tabular-nums;
	}
	.door.open .pnum {
		color: #2b3640;
	}
	.desc {
		min-height: 2.6em;
		max-width: 320px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		line-height: 1.45;
		color: #4a5560;
	}
	.dport {
		display: inline-block;
		margin-right: 6px;
		border-radius: 6px;
		background: #16212b;
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		padding: 1px 7px;
	}
	@media (prefers-reduced-motion: reduce) {
		.svc {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 16px;
		}
		.leaf {
			height: 78px;
		}
		.pnum {
			font-size: 12.5px;
		}
		.svc {
			font-size: 12px;
		}
		.desc {
			font-size: 14px;
			max-width: 400px;
		}
	}
	:global(.dark) .achip {
		border-color: #2c4a6e;
		color: #7daae0;
	}
	:global(.dark) .building {
		border-color: #2c3746;
		background: linear-gradient(#1b2533, #141c2a);
	}
	:global(.dark) .facade span {
		background: #2c3746;
		border-color: #3a4a5c;
	}
	:global(.dark) .leaf {
		border-color: #3a4a5c;
		background: #2c3746;
	}
	:global(.dark) .door.open .leaf {
		border-color: #3a5a8e;
		background: #1a2d4a;
	}
	:global(.dark) .knob {
		background: #6b7885;
	}
	:global(.dark) .svc {
		color: #7daae0;
	}
	:global(.dark) .pnum {
		color: #97a3ae;
	}
	:global(.dark) .door.open .pnum {
		color: #e0dcd4;
	}
	:global(.dark) .desc {
		color: #97a3ae;
	}
	:global(.dark) .dport {
		background: #2a3748;
		color: #e0dcd4;
	}
</style>
