<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { IngressEgressText } from '$lib/chapters/trafficflow/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as IngressEgressText);

	const STEP = 0.3; // dollars added to the bill per egress burst

	let dir = $state<'' | 'in' | 'out'>('');
	let flyKey = $state(0);
	let bill = $state(0);
	let bump = $state(false);
	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function act(d: 'in' | 'out') {
		dir = d;
		flyKey += 1;
		if (d === 'out') {
			bill += STEP;
			bump = true;
			timers.push(setTimeout(() => (bump = false), 420));
		}
		onstate?.(d);
		tried.add(d);
		if (tried.size === 2 && !done) {
			done = true;
			onstate?.('both');
			oncomplete?.();
		}
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="bill" class:bump>
		<span class="bcap">{tx.billLabel}</span>
		<span class="bamt">${bill.toFixed(2)}</span>
	</div>

	<div class="scene">
		<div class="actor">
			<span class="vic">
				<svg viewBox="0 0 24 24" aria-hidden="true">
					<circle cx="12" cy="8" r="4" fill="#9aa7b3" />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill="#9aa7b3" />
				</svg>
			</span>
			<span class="alabel">{tx.visitorLabel}</span>
		</div>

		<div class="lane">
			{#if dir}
				<span class="tag" class:billed={dir === 'out'}>{dir === 'in' ? tx.inTag : tx.outTag}</span>
			{/if}
			{#key flyKey}
				{#if dir}
					{#each [0, 1, 2] as i, eachIndex1701 (eachIndex1701)}
						<span class="photo {dir}" style="animation-delay:{i * 0.16}s">
							<svg viewBox="0 0 24 24" aria-hidden="true">
								<rect x="3" y="5" width="18" height="14" rx="2.5" fill="currentColor" />
								<circle cx="8.5" cy="10" r="1.7" fill="#fff" />
								<path d="M4.5 17.5 9 13l3 2.6 3.2-3.8 4.3 5.7z" fill="#fff" />
							</svg>
						</span>
					{/each}
				{/if}
			{/key}
		</div>

		<div class="actor">
			<span class="dc">
				<svg viewBox="0 0 40 30" aria-hidden="true">
					<path
						d="M11 26a7 7 0 0 1 0-14 8.5 8.5 0 0 1 16.3-2.4A6.6 6.6 0 0 1 30 26z"
						fill="#eaf1fc"
						stroke="#2e6fe0"
						stroke-width="1.6"
					/>
					<rect x="14" y="15" width="13" height="2.6" rx="1.3" fill="#2e6fe0" />
					<rect x="14" y="19.5" width="13" height="2.6" rx="1.3" fill="#2e6fe0" />
				</svg>
			</span>
			<span class="alabel">{tx.serverLabel}</span>
		</div>
	</div>

	<div class="acts">
		<button type="button" class="line" class:dim={tried.has('in')} onclick={() => act('in')}
			>{tx.pickIn}</button
		>
		<button type="button" class="cta" class:dim={tried.has('out')} onclick={() => act('out')}
			>{tx.pickOut}</button
		>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		width: min(94vw, 360px);
		height: 100%;
	}
	.bill {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		border-radius: 14px;
		border: 1.5px solid #ece6dc;
		background: #fff;
		padding: 8px 22px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
		transition:
			border-color 0.3s ease,
			transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1.4);
	}
	.bill.bump {
		border-color: #ecd9b8;
		transform: scale(1.06);
	}
	.bcap {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #8a949d;
	}
	.bamt {
		font-size: 22px;
		font-weight: 800;
		color: #2b3640;
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease;
	}
	.bill.bump .bamt {
		color: #c5871f;
	}

	.scene {
		display: flex;
		align-items: center;
		width: 100%;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		flex: none;
		width: 74px;
	}
	.vic,
	.dc {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border-radius: 14px;
		border: 1.5px solid #e3ddd3;
		background: #fff;
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.07);
	}
	.vic svg {
		width: 26px;
		height: 26px;
	}
	.dc svg {
		width: 38px;
		height: 30px;
	}
	.alabel {
		font-size: 10px;
		font-weight: 700;
		color: #5e6b76;
		text-align: center;
		line-height: 1.2;
	}
	.lane {
		position: relative;
		flex: 1;
		height: 56px;
		margin: 0 -6px;
	}
	.lane::before {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		border-top: 2px solid #e3ddd3;
	}
	.tag {
		position: absolute;
		left: 50%;
		top: -4px;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #ecf6f0;
		color: #2f7d54;
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 10px;
		white-space: nowrap;
		animation: pop 0.3s ease both;
		z-index: 2;
	}
	.tag.billed {
		background: #fbf1de;
		color: #9a6a18;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateX(-50%) scale(0.8);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) scale(1);
		}
	}
	.photo {
		position: absolute;
		top: calc(50% - 9px);
		left: 0;
		width: 19px;
		height: 19px;
		color: #3a9c64;
		filter: drop-shadow(0 3px 5px rgba(22, 40, 60, 0.16));
	}
	.photo.out {
		color: #dd9e36;
	}
	.photo svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.photo.in {
		animation: flyin 0.95s ease-in both;
	}
	.photo.out {
		animation: flyout 0.95s ease-in both;
	}
	@keyframes flyin {
		from {
			left: -10%;
			opacity: 0;
			transform: scale(0.7);
		}
		15% {
			opacity: 1;
			transform: scale(1);
		}
		85% {
			opacity: 1;
			transform: scale(1);
		}
		to {
			left: 106%;
			opacity: 0;
			transform: scale(0.7);
		}
	}
	@keyframes flyout {
		from {
			left: 106%;
			opacity: 0;
			transform: scale(0.7);
		}
		15% {
			opacity: 1;
			transform: scale(1);
		}
		85% {
			opacity: 1;
			transform: scale(1);
		}
		to {
			left: -10%;
			opacity: 0;
			transform: scale(0.7);
		}
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: #16212b;
		color: #fff;
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:hover {
		filter: brightness(1.18);
	}
	.line {
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:hover {
		border-color: #16212b;
	}
	.dim::after {
		content: ' ✓';
		color: #3a9c64;
	}
	.cta.dim::after {
		color: #8fd6ae;
	}
	@media (prefers-reduced-motion: reduce) {
		.photo {
			animation-duration: 0.01s;
		}
		.bill {
			transition: none;
		}
	}
	/* ---- Dark mode ---- */
	:global(.dark) .bill {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .bill.bump {
		border-color: #3d3522;
	}
	:global(.dark) .bcap {
		color: var(--color-faint);
	}
	:global(.dark) .bamt {
		color: var(--color-ink);
	}
	:global(.dark) .bill.bump .bamt {
		color: var(--color-amber);
	}
	:global(.dark) .vic,
	:global(.dark) .dc {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .vic svg circle,
	:global(.dark) .vic svg path {
		fill: var(--color-muted);
	}
	:global(.dark) .dc svg path[fill='#eaf1fc'] {
		fill: var(--color-brand-soft);
	}
	:global(.dark) .alabel {
		color: var(--color-muted);
	}
	:global(.dark) .lane::before {
		border-top-color: var(--color-line);
	}
	:global(.dark) .tag {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	:global(.dark) .tag.billed {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	:global(.dark) .photo {
		filter: none;
	}
	:global(.dark) .cta {
		background: var(--btn-primary);
		box-shadow: none;
	}
	:global(.dark) .line {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-ink);
	}
	:global(.dark) .line:hover {
		border-color: var(--color-ink);
	}

	@media (min-width: 768px) {
		.wrap {
			width: 440px;
		}
		.actor {
			width: 96px;
		}
		.vic,
		.dc {
			width: 60px;
			height: 60px;
		}
		.lane {
			height: 64px;
		}
		.bamt {
			font-size: 26px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
