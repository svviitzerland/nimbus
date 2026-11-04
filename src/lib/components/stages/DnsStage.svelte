<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';
	import Browser from '../Browser.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DnsText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DnsText);

	let picked = $state<number | null>(null);
	let phase = $state<'idle' | 'lookup' | 'connect'>('idle');
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function pick(i: number) {
		picked = i;
		phase = 'lookup';
		browser = 'loading';
		timers.forEach(clearTimeout);
		timers = [];
		timers.push(
			setTimeout(() => {
				phase = 'connect';
				timers.push(
					setTimeout(() => {
						browser = 'loaded';
						onstate?.('resolved');
						if (!done) {
							done = true;
							oncomplete?.();
						}
					}, 900)
				);
			}, 900)
		);
	}

	const note = $derived(
		phase === 'idle'
			? tx.idleNote
			: phase === 'lookup'
				? tx.lookupNote
				: tx.connectNote.replace('{ip}', picked === null ? '' : tx.domains[picked].ip)
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="scene">
		<!-- your phone asking by name -->
		<div class="actor">
			<div class="shrink"><Browser phase={browser} /></div>
			<span class="alabel">{tx.youLabel}</span>
		</div>

		<!-- left rail: the name goes to the book, the number comes back -->
		<div class="rail">
			{#if phase === 'lookup' && picked !== null}
				<span class="chip ask">{tx.domains[picked].host}</span>
			{/if}
			{#if phase === 'connect' && picked !== null}
				<span class="chip back">{tx.domains[picked].ip}</span>
			{/if}
		</div>

		<!-- the phone book -->
		<div class="book" class:busy={phase === 'lookup'}>
			<div class="bhead">
				<b>{tx.bookTitle}</b>
				<span>{tx.bookSub}</span>
			</div>
			{#each tx.domains as d, i (d.host)}
				<div class="brow" class:hot={picked === i && phase !== 'idle'}>
					<span class="bhost">{d.host}</span>
					<span class="bip">{d.ip}</span>
				</div>
			{/each}
		</div>

		<!-- right rail: with the number known, the phone reaches the server -->
		<div class="rail right">
			{#if phase === 'connect'}<span class="pkt"></span>{/if}
		</div>

		<div class="actor">
			<div class="srv-wrap" class:on={browser === 'loaded'}>
				<Server slots={3} active={browser === 'loaded'} />
			</div>
			<span class="alabel">{tx.serverLabel}</span>
		</div>
	</div>

	<p class="note">{note}</p>

	<div class="acts">
		{#each tx.domains as d, i (d.host)}
			<CallToActionButton onclick={() => pick(i)}>{d.host}</CallToActionButton>
		{/each}
	</div>
</div>

<style>
	.scene {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		width: min(94vw, 380px);
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.alabel {
		font-size: 10px;
		font-weight: 600;
		color: #5e6b76;
		white-space: nowrap;
	}
	.shrink {
		width: 90px;
		height: 184px;
		overflow: visible;
	}
	.shrink > :global(.phone) {
		max-width: none;
		transform: scale(0.6);
		transform-origin: top left;
	}
	.rail {
		position: relative;
		flex: 1;
		min-width: 34px;
		height: 2px;
		margin-bottom: 26px;
		border-radius: 2px;
		background: #e8e2d8;
	}
	.chip {
		position: absolute;
		top: -11px;
		left: 50%;
		border-radius: 999px;
		font-size: 8px;
		font-weight: 800;
		padding: 2px 7px;
		white-space: nowrap;
		color: #fff;
	}
	.chip.ask {
		background: #16212b;
		animation: goright 0.85s ease forwards;
	}
	.chip.back {
		background: #3a9c64;
		animation: goleft 0.85s ease forwards;
	}
	@keyframes goright {
		from {
			transform: translateX(-90%);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		to {
			transform: translateX(-10%);
			opacity: 1;
		}
	}
	@keyframes goleft {
		from {
			transform: translateX(-10%);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		to {
			transform: translateX(-90%);
			opacity: 1;
		}
	}
	.book {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 142px;
		border-radius: 13px;
		border: 1.5px solid #cdddf6;
		background: #fff;
		padding: 8px;
		box-shadow: 0 8px 20px rgba(46, 111, 224, 0.1);
		margin-bottom: 26px;
		transition: box-shadow 0.3s ease;
	}
	.book.busy {
		box-shadow: 0 0 0 5px rgba(46, 111, 224, 0.14);
	}
	.bhead {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
		margin-bottom: 2px;
	}
	.bhead b {
		font-size: 11px;
		font-weight: 800;
		color: #2e6fe0;
	}
	.bhead span {
		font-size: 7.5px;
		color: #8a949d;
	}
	.brow {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
		border-radius: 7px;
		border: 1px solid #f1ede5;
		background: #faf9f6;
		padding: 3px 6px;
		transition: all 0.25s ease;
	}
	.brow.hot {
		border-color: #2e6fe0;
		background: #eaf1fc;
	}
	.bhost {
		font-size: 8px;
		font-weight: 700;
		color: #16212b;
	}
	.bip {
		font-size: 7.5px;
		font-weight: 700;
		color: #8a949d;
		font-variant-numeric: tabular-nums;
	}
	.brow.hot .bip {
		color: #2e6fe0;
	}
	.pkt {
		position: absolute;
		top: 50%;
		left: 0;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #3a9c64;
		border: 2px solid #fff;
		transform: translate(-50%, -50%);
		animation: cross 0.8s ease forwards;
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.2);
	}
	@keyframes cross {
		to {
			left: 100%;
		}
	}
	.srv-wrap.on :global(.server) {
		border-color: var(--color-grass);
	}
	.srv-wrap :global(.server) {
		width: 64px;
		gap: 4px;
		border-radius: 10px;
		padding: 7px;
		border-width: 1.5px;
	}
	.srv-wrap :global(.slot) {
		height: 9px;
		padding: 0 4px;
		border-radius: 3px;
	}
	.srv-wrap :global(.dot) {
		width: 4px;
		height: 4px;
	}
	.note {
		min-height: 1.4em;
		max-width: 320px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 16px;
	}

	/* ---- Dark mode ---- */
	:global(.dark) .alabel {
		color: var(--color-muted);
	}
	:global(.dark) .rail {
		background: var(--color-line);
	}
	:global(.dark) .chip.ask {
		background: var(--btn-primary);
	}
	:global(.dark) .book {
		background: var(--color-card);
		border-color: #3a5a80;
		box-shadow: none;
	}
	:global(.dark) .bhead b {
		color: var(--color-brand);
	}
	:global(.dark) .bhead span {
		color: var(--color-faint);
	}
	:global(.dark) .brow {
		background: var(--color-paper);
		border-color: var(--color-line);
	}
	:global(.dark) .brow.hot {
		background: var(--color-brand-soft);
		border-color: #3a5a80;
	}
	:global(.dark) .bhost {
		color: var(--color-ink);
	}
	:global(.dark) .bip {
		color: var(--color-faint);
	}
	:global(.dark) .brow.hot .bip {
		color: var(--color-brand);
	}
	:global(.dark) .pkt {
		border-color: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.chip,
		.pkt {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 560px;
			gap: 6px;
		}
		.shrink {
			width: 108px;
			height: 220px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.72);
		}
		.book {
			width: 180px;
			padding: 10px;
		}
		.bhead b {
			font-size: 13.5px;
		}
		.bhead span {
			font-size: 9.5px;
		}
		.bhost {
			font-size: 10px;
		}
		.bip {
			font-size: 9.5px;
		}
		.chip {
			font-size: 10px;
		}
		.srv-wrap :global(.server) {
			width: 84px;
		}
		.srv-wrap :global(.slot) {
			height: 13px;
		}
		.alabel {
			font-size: 12px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
