<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { BandwidthThroughputText } from '$lib/chapters/trafficflow/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BandwidthThroughputText);

	const RATE = 2.5; // MB/s each viewer needs to stream smoothly
	const MAXV = 4;
	const MAXBW = MAXV * RATE; // the full width of the gauge

	let viewers = $state(1);
	let bandwidth = $state(2); // capacity, in viewers worth
	let seenFull = false;
	let done = false;

	const served = $derived(Math.min(viewers, bandwidth));
	const buffering = $derived(viewers > bandwidth);
	const tp = $derived(served * RATE); // throughput, MB/s actually delivered
	const maxBw = $derived(bandwidth * RATE); // bandwidth ceiling, MB/s
	const fillPct = $derived((tp / MAXBW) * 100);
	const markerPct = $derived((maxBw / MAXBW) * 100);

	function addViewer() {
		if (viewers >= MAXV) return;
		viewers += 1;
		if (viewers > bandwidth && !seenFull) {
			seenFull = true;
			onstate?.('full');
		}
	}
	function upgrade() {
		if (!buffering) return;
		bandwidth = MAXV;
		onstate?.('fixed');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

<div class="wrap">
	<div class="head">
		<span class="dc">
			<svg viewBox="0 0 40 30" aria-hidden="true">
				<path
					d="M11 26a7 7 0 0 1 0-14 8.5 8.5 0 0 1 16.3-2.4A6.6 6.6 0 0 1 30 26z"
					fill="#eaf1fc"
					stroke="#2e6fe0"
					stroke-width="1.6"
				/>
				<path
					d="M16 19l4-3 4 3"
					stroke="#2e6fe0"
					stroke-width="1.8"
					fill="none"
					stroke-linecap="round"
				/>
			</svg>
		</span>
		<span class="hlabel">{tx.sourceLabel}</span>
	</div>

	<div class="gauge">
		<span class="tpread" class:cap={buffering}>{tx.tpLabel} <b>{tp.toFixed(1)}</b> {tx.unit}</span>
		<div class="track">
			<div class="fill" class:cap={buffering} style="width:{fillPct}%"></div>
			<div class="marker" style="left:{markerPct}%">
				<span class="mtag">{tx.bwLabel} {maxBw.toFixed(1)}</span>
			</div>
		</div>
	</div>

	<div class="viewers">
		{#each Array(viewers) as _, i (i)}
			{@const buf = i >= served}
			<div class="vplayer" class:buffer={buf}>
				<div class="thumb">
					<span class="sun"></span>
					<span class="cloud c1"></span>
					<span class="cloud c2"></span>
					<svg class="bird" viewBox="0 0 12 6" aria-hidden="true">
						<path
							d="M0 5 Q3 0 6 5 Q9 0 12 5"
							stroke="#6b7a88"
							stroke-width="1.3"
							fill="none"
							stroke-linecap="round"
						/>
					</svg>
					<span class="hill back"></span>
					<span class="hill front"></span>
					{#if buf}<div class="bufover"><span class="loader"></span></div>{/if}
				</div>
				<div class="pbar"><span class="pfill" class:load={buf}></span></div>
				<span class="cap" class:bad={buf}>{buf ? tx.buffering : tx.hd}</span>
			</div>
		{/each}
	</div>

	<div class="acts">
		<button type="button" class="line" onclick={addViewer} disabled={viewers >= MAXV}
			>{tx.addBtn}</button
		>
		<button type="button" class="cta" onclick={upgrade} disabled={!buffering}
			>{tx.upgradeBtn}</button
		>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 15px;
		width: min(94vw, 360px);
		height: 100%;
	}
	.head {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.dc {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 11px;
		border: 1.5px solid #e3ddd3;
		background: #fff;
		box-shadow: 0 5px 12px rgba(22, 40, 60, 0.06);
	}
	.dc svg {
		width: 30px;
		height: 23px;
	}
	.hlabel {
		font-size: 12px;
		font-weight: 700;
		color: #2b3640;
	}

	.gauge {
		width: 100%;
		border-radius: 14px;
		border: 1px solid #ece6dc;
		background: #fff;
		padding: 12px 13px 16px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.06);
	}
	.tpread {
		display: block;
		margin-bottom: 9px;
		font-size: 11px;
		font-weight: 700;
		color: #2f7d54;
	}
	.tpread b {
		font-size: 19px;
		font-weight: 800;
	}
	.tpread.cap {
		color: #c5871f;
	}
	.track {
		position: relative;
		height: 16px;
		border-radius: 8px;
		background: #eef1f5;
	}
	.fill {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		border-radius: 8px;
		background: #3a9c64;
		transition:
			width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1),
			background 0.3s ease;
	}
	.fill.cap {
		background: #dd9e36;
	}
	.marker {
		position: absolute;
		top: -5px;
		bottom: -5px;
		width: 0;
		border-left: 2px solid #16212b;
		transition: left 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
		z-index: 2;
	}
	.mtag {
		position: absolute;
		top: -19px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		border-radius: 999px;
		background: #16212b;
		color: #fff;
		font-size: 9px;
		font-weight: 800;
		padding: 2px 7px;
	}

	.viewers {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 11px;
		width: min(92vw, 226px);
		min-height: 62px;
	}
	.vplayer {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 104px;
	}
	.thumb {
		position: relative;
		height: 64px;
		border-radius: 9px;
		overflow: hidden;
		background: linear-gradient(165deg, #aed8f2, #d8ecf6 55%, #eaf4e0);
		border: 1.5px solid #cde6d7;
		transition: border-color 0.3s ease;
	}
	.vplayer.buffer .thumb {
		border-color: #ecd9b8;
	}
	.sun {
		position: absolute;
		top: 8px;
		right: 11px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: #ffce6e;
		box-shadow: 0 0 0 4px rgba(255, 206, 110, 0.28);
		animation: sunpulse 3s ease-in-out infinite;
	}
	@keyframes sunpulse {
		0%,
		100% {
			box-shadow: 0 0 0 4px rgba(255, 206, 110, 0.28);
		}
		50% {
			box-shadow: 0 0 0 7px rgba(255, 206, 110, 0.13);
		}
	}
	.cloud {
		position: absolute;
		left: -28px;
		width: 18px;
		height: 8px;
		border-radius: 8px;
		background: #fff;
		opacity: 0.92;
	}
	.cloud::before,
	.cloud::after {
		content: '';
		position: absolute;
		border-radius: 50%;
		background: #fff;
	}
	.cloud::before {
		width: 10px;
		height: 10px;
		top: -4px;
		left: 3px;
	}
	.cloud::after {
		width: 12px;
		height: 12px;
		top: -5px;
		left: 8px;
	}
	.c1 {
		top: 11px;
		animation: drift 8s linear infinite;
	}
	.c2 {
		top: 28px;
		transform: scale(0.72);
		animation: drift 13s linear infinite;
		animation-delay: -4s;
	}
	@keyframes drift {
		from {
			left: -28px;
		}
		to {
			left: 112px;
		}
	}
	.bird {
		position: absolute;
		left: -16px;
		top: 15px;
		width: 12px;
		height: 6px;
		animation: fly 7s linear infinite;
	}
	@keyframes fly {
		0% {
			left: -16px;
			top: 15px;
		}
		50% {
			top: 9px;
		}
		100% {
			left: 108px;
			top: 17px;
		}
	}
	.hill {
		position: absolute;
		left: -14%;
		right: -14%;
		border-radius: 50%;
	}
	.hill.back {
		bottom: -16px;
		height: 56%;
		background: #c2e2bb;
	}
	.hill.front {
		bottom: -22px;
		height: 48%;
		background: #9ccb9a;
	}
	.vplayer.buffer .sun,
	.vplayer.buffer .cloud,
	.vplayer.buffer .bird {
		animation-play-state: paused;
	}
	.bufover {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(28, 37, 48, 0.55);
	}
	.loader {
		width: 17px;
		height: 17px;
		border: 2.5px solid rgba(255, 255, 255, 0.4);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.pbar {
		height: 4px;
		border-radius: 3px;
		background: #e6e9ee;
		overflow: hidden;
	}
	.pfill {
		display: block;
		height: 100%;
		width: 60%;
		border-radius: 3px;
		background: #3a9c64;
		animation: playbar 4.5s linear infinite;
	}
	.pfill.load {
		width: 100%;
		background: linear-gradient(90deg, #f2e3c6 25%, #dd9e36 50%, #f2e3c6 75%);
		background-size: 220% 100%;
		animation: shimmer 1.1s linear infinite;
	}
	@keyframes playbar {
		0% {
			width: 18%;
		}
		100% {
			width: 94%;
		}
	}
	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
	.cap {
		font-size: 8.5px;
		font-weight: 800;
		text-align: center;
		letter-spacing: 0.02em;
		color: #2f7d54;
	}
	.cap.bad {
		color: #9a6a18;
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
	.cta:enabled:hover {
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
	.line:enabled:hover {
		border-color: #16212b;
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.5;
	}
	@media (prefers-reduced-motion: reduce) {
		.loader,
		.pfill {
			animation-duration: 0.01s;
		}
		.sun,
		.cloud,
		.bird {
			animation: none;
		}
		.fill,
		.marker {
			transition: none;
		}
	}
	/* ---- Dark mode ---- */
	:global(.dark) .dc {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .dc svg path[fill='#eaf1fc'] {
		fill: var(--color-brand-soft);
	}
	:global(.dark) .hlabel {
		color: var(--color-ink);
	}
	:global(.dark) .gauge {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .tpread {
		color: var(--color-grass);
	}
	:global(.dark) .tpread.cap {
		color: var(--color-amber);
	}
	:global(.dark) .track {
		background: #1e2835;
	}
	:global(.dark) .marker {
		border-left-color: var(--color-ink);
	}
	:global(.dark) .mtag {
		background: var(--btn-primary);
	}
	:global(.dark) .thumb {
		background: linear-gradient(165deg, #1a3048, #1a3640 55%, #1a3024);
		border-color: #1f3d28;
	}
	:global(.dark) .vplayer.buffer .thumb {
		border-color: #3d3522;
	}
	:global(.dark) .cloud {
		background: #b0b8c0;
	}
	:global(.dark) .cloud::before,
	:global(.dark) .cloud::after {
		background: #b0b8c0;
	}
	:global(.dark) .bird path {
		stroke: var(--color-muted);
	}
	:global(.dark) .hill.back {
		background: #2a4a30;
	}
	:global(.dark) .hill.front {
		background: #1f3d28;
	}
	:global(.dark) .pbar {
		background: #2c3746;
	}
	:global(.dark) .pfill.load {
		background-image: linear-gradient(90deg, #3d3522 25%, #dd9e36 50%, #3d3522 75%);
	}
	:global(.dark) .cap {
		color: var(--color-grass);
	}
	:global(.dark) .cap.bad {
		color: var(--color-amber);
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
	:global(.dark) .line:enabled:hover {
		border-color: var(--color-ink);
	}

	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 18px;
		}
		.tpread b {
			font-size: 22px;
		}
		.viewers {
			width: 290px;
		}
		.vplayer {
			width: 134px;
		}
		.thumb {
			height: 84px;
		}
		.cap {
			font-size: 9.5px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
