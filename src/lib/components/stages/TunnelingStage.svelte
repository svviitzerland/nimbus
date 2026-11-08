<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import Laptop from '../Laptop.svelte';
	import type { LessonText, TunnelingText } from '$lib/chapters/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as TunnelingText);

	// the play: dial out, get a borrowed address, a friend walks in, then the lid closes
	let tunnelOn = $state(false);
	let closed = $state(false);
	let visiting = $state(false);
	let visitedOnce = $state(false);
	let failedVisit = $state(false);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const note = $derived(
		closed
			? tx.noteClosed
			: visiting || visitedOnce
				? tx.noteVisit
				: tunnelOn
					? tx.noteOn
					: tx.noteIdle
	);

	function start() {
		tunnelOn = true;
		closed = false;
		failedVisit = false;
		onstate?.('tunnel');
	}
	function visit() {
		if (visiting) return;
		if (closed) {
			failedVisit = true;
			timers.push(setTimeout(() => (failedVisit = false), 1400));
			return;
		}
		visiting = true;
		timers.push(
			setTimeout(() => {
				visiting = false;
				visitedOnce = true;
				onstate?.('visited');
				if (!done) {
					done = true;
					oncomplete?.();
				}
			}, 2200)
		);
	}
	function close() {
		closed = true;
		tunnelOn = false;
		visiting = false;
		onstate?.('closed');
	}
	function reset() {
		tunnelOn = false;
		closed = false;
		visiting = false;
		failedVisit = false;
	}

	// one pixel-space geometry feeds BOTH the dashed rails and the riding packet,
	// so they can never drift apart again
	const MOB = {
		w: 348,
		h: 268,
		tunnel: 'M 103 150 Q 110 64 174 46',
		visit: 'M 269 112 Q 256 54 174 46',
		go: 'M 269 112 Q 256 54 174 46 Q 110 64 103 150',
		back: 'M 103 150 Q 110 64 174 46 Q 256 54 269 112'
	};
	const DESK = {
		w: 470,
		h: 300,
		tunnel: 'M 112 185 Q 120 70 235 50',
		visit: 'M 372 130 Q 352 60 235 50',
		go: 'M 372 130 Q 352 60 235 50 Q 120 70 112 185',
		back: 'M 112 185 Q 120 70 235 50 Q 352 60 372 130'
	};
	let desk = $state(false);
	$effect(() => {
		const mq = matchMedia('(min-width: 768px)');
		desk = mq.matches;
		const fn = (e: MediaQueryListEvent) => (desk = e.matches);
		mq.addEventListener('change', fn);
		return () => mq.removeEventListener('change', fn);
	});
	const G = $derived(desk ? DESK : MOB);

	const friendPhase = $derived(
		visiting ? 'loading' : failedVisit ? 'offline' : visitedOnce && !closed ? 'loaded' : 'idle'
	) as 'idle' | 'loading' | 'loaded' | 'offline';

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="scene">
		<!-- rails: laptop dials OUT to the relay; the friend enters through the relay -->
		<svg class="rails" viewBox="0 0 {G.w} {G.h}" aria-hidden="true">
			<path
				class="seg tunnel"
				class:on={tunnelOn}
				class:dead={closed}
				class:busy={visiting}
				d={G.tunnel}
			/>
			<path class="seg" class:on={visiting} class:dead={closed} d={G.visit} />
		</svg>

		{#if visiting}
			<span class="pkt go" style="offset-path: path('{G.go}')"></span>
			<span class="pkt back" style="offset-path: path('{G.back}')"></span>
		{/if}
		{#if failedVisit}
			<span class="failx">×</span>
		{/if}

		<!-- relay, the third party up top -->
		<div class="relay" class:on={tunnelOn}>
			<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M7 18a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.54 1.7A4 4 0 0 1 17.5 18Z"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linejoin="round"
				/>
			</svg>
			<div class="rtext">
				<span class="rname">{tx.relayLabel}</span>
				<span class="rsub">{tx.relaySub}</span>
			</div>
			{#if tunnelOn}
				<span class="url">{tx.publicUrl}</span>
			{:else if closed}
				<span class="url dead">{tx.publicUrl}</span>
			{/if}
		</div>

		<!-- laptop, bottom left, the same laptop from the last lesson -->
		<div class="actor left">
			<Laptop phase={closed ? 'closed' : 'on'} led={tunnelOn ? 'ok' : 'off'} />
			<span class="alabel">{tx.laptopLabel}</span>
			<span class="chip">{tx.localChip}</span>
		</div>

		<!-- friend phone, bottom right, the same phone from lesson one -->
		<div class="actor right">
			<div class="shrink"><Browser phase={friendPhase} /></div>
			<span class="alabel">{tx.friendLabel}</span>
		</div>
	</div>

	<!-- tunnel status + what is happening -->
	<div class="status" class:up={tunnelOn}><i></i>{tunnelOn ? tx.tunnelOn : tx.tunnelOff}</div>
	<p class="note">{note}</p>

	<div class="acts">
		{#if !tunnelOn && !closed}
			<CallToActionButton onclick={start}>{tx.startTunnel}</CallToActionButton>
		{:else if tunnelOn}
			<CallToActionButton onclick={visit} disabled={visiting}>{tx.visit}</CallToActionButton>
			{#if visitedOnce}
				<button type="button" class="line" onclick={close}>{tx.closeLaptop}</button>
			{/if}
		{:else}
			<CallToActionButton onclick={reset}>{tx.reset}</CallToActionButton>
		{/if}
	</div>
</div>

<style>
	.scene {
		position: relative;
		width: min(92vw, 348px);
		height: 268px;
	}
	.rails {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	.seg {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: none;
		transition: stroke 0.3s ease;
	}
	.seg.on {
		stroke: #2e6fe0;
		animation: flow 0.9s linear infinite;
	}
	.seg.tunnel.on {
		stroke: #2e6fe0;
	}
	.seg.tunnel.busy {
		stroke: #3a9c64;
	}
	.seg:not(.tunnel).on {
		stroke: #3a9c64;
	}
	.seg.dead {
		stroke: #ece8e1;
		animation: none;
		stroke-dasharray: none;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -8;
		}
	}

	/* the visit packet, in via the relay, down the tunnel, and back */
	.pkt {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 2px solid #fff;
		background: #3a9c64;
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.25);
		z-index: 4;
		offset-rotate: 0deg;
	}
	.pkt.go {
		animation: ride 1.1s ease-in forwards;
	}
	.pkt.back {
		animation: ride 1.1s ease-out 1.1s forwards;
		opacity: 0;
	}
	@keyframes ride {
		0% {
			offset-distance: 0%;
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		100% {
			offset-distance: 100%;
			opacity: 1;
		}
	}
	.failx {
		position: absolute;
		top: 30%;
		right: 26%;
		font-size: 22px;
		font-weight: 800;
		color: #d3584a;
		z-index: 4;
		animation: pop 0.3s ease;
	}
	@keyframes pop {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	.relay {
		position: absolute;
		top: 4px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 12px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		color: var(--color-faint);
		padding: 6px 12px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.07);
		white-space: nowrap;
		z-index: 3;
		transition: all 0.3s ease;
	}
	.relay.on {
		border-color: #cdddf6;
		background: var(--color-brand-soft);
		color: #2e6fe0;
		box-shadow: 0 8px 18px rgba(46, 111, 224, 0.14);
	}
	.rtext {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}
	.rname {
		font-size: 11px;
		font-weight: 700;
		color: inherit;
	}
	.rsub {
		font-size: 8.5px;
		opacity: 0.75;
	}
	.url {
		position: absolute;
		bottom: -20px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #16212b;
		color: #fff;
		font-size: 9px;
		font-weight: 700;
		padding: 2px 9px;
		animation: urlpop 0.3s ease;
	}
	@keyframes urlpop {
		from {
			transform: translateX(-50%) scale(0.5);
			opacity: 0;
		}
		to {
			transform: translateX(-50%) scale(1);
			opacity: 1;
		}
	}
	.url.dead {
		background: #cfd6dd;
		text-decoration: line-through;
	}

	.actor {
		position: absolute;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		z-index: 2;
	}
	.actor.left {
		left: 7%;
	}
	.actor.right {
		right: 9%;
	}
	.alabel {
		font-size: 10px;
		font-weight: 600;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 1px 8px;
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.shrink {
		width: 96px;
		height: 152px;
		overflow: visible;
	}
	.shrink > :global(.phone) {
		max-width: none;
		transform: scale(0.6);
		transform-origin: top left;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.status i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #cfd6dd;
	}
	.status.up {
		color: #2f7d54;
	}
	.status.up i {
		background: #3a9c64;
	}
	.note {
		max-width: 320px;
		min-height: 1.5em;
		text-align: center;
		font-size: 12px;
		line-height: 1.4;
		color: #6a7681;
	}
	.acts {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.line {
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		transition: border-color 0.2s ease;
	}
	.line:hover {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.seg.on,
		.pkt {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 470px;
			height: 300px;
		}
		.shrink {
			width: 112px;
			height: 177px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.7);
		}
		.rname {
			font-size: 13px;
		}
		.rsub {
			font-size: 10px;
		}
		.url {
			font-size: 11px;
			bottom: -24px;
		}
		.alabel {
			font-size: 12px;
		}
		.chip {
			font-size: 10px;
		}
		.status {
			font-size: 14.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
	:global(.dark) .seg.dead {
		stroke: #3a4a5c;
	}
	:global(.dark) .pkt {
		border-color: #1b2533;
	}
	:global(.dark) .relay {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .relay.on {
		border-color: #2c4a6e;
		color: #7daae0;
	}
	:global(.dark) .url {
		background: #2a3748;
		color: #e0dcd4;
	}
	:global(.dark) .url.dead {
		background: #4a5560;
	}
	:global(.dark) .chip {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .status i {
		background: #6b7885;
	}
	:global(.dark) .status.up {
		color: #5bb87e;
	}
	:global(.dark) .note {
		color: #97a3ae;
	}
	:global(.dark) .line {
		border-color: #2c3746;
		background: #1b2533;
	}
</style>
