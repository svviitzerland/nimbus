<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Browser from '../Browser.svelte';
	import Laptop from '../Laptop.svelte';
	import type { LessonText, LaptopServerText } from '$lib/chapters/types';
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
	const tx = $derived(text as LaptopServerText);

	// the story: works on home WiFi, opens to the internet, then reality bites
	let phase = $state<'idle' | 'lan' | 'public'>('idle');
	let problem = $state<'' | 'ip' | 'sleep' | 'slow'>('');
	let lanFlight = $state(false);
	let ip = $state('114.122.8.41');
	let ipFlash = $state(false);
	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const status = $derived(
		phase === 'idle'
			? { txt: tx.statusLocal, c: '#8a949d' }
			: problem === 'ip'
				? { txt: tx.statusLost, c: '#dd9e36' }
				: problem === 'sleep'
					? { txt: tx.statusDown, c: '#d3584a' }
					: problem === 'slow'
						? { txt: tx.statusSlow, c: '#dd9e36' }
						: phase === 'lan'
							? { txt: tx.statusOk, c: '#3a9c64' }
							: { txt: tx.statusOk, c: '#3a9c64' }
	);
	const note = $derived(
		phase === 'idle'
			? tx.noteIdle
			: problem === 'ip'
				? tx.noteIp
				: problem === 'sleep'
					? tx.noteSleep
					: problem === 'slow'
						? tx.noteSlow
						: phase === 'lan'
							? tx.noteLan
							: tx.notePublic
	);

	function tryLan() {
		if (lanFlight) return;
		lanFlight = true;
		timers.push(
			setTimeout(() => {
				lanFlight = false;
				phase = 'lan';
				onstate?.('lan');
			}, 900)
		);
	}
	function goPublic() {
		phase = 'public';
		problem = '';
		onstate?.('public');
	}
	function fire(p: 'ip' | 'sleep' | 'slow') {
		problem = p;
		if (p === 'ip') {
			ip = ip === '114.122.8.41' ? '36.84.219.7' : '114.122.8.41';
			ipFlash = true;
			timers.push(setTimeout(() => (ipFlash = false), 1600));
		}
		onstate?.(p);
		tried.add(p);
		if (tried.size >= 2 && !done) {
			done = true;
			oncomplete?.();
		}
	}
	function recover() {
		problem = '';
	}

	// the same phone and laptop the learner already knows, just smaller here
	const friendPhase = $derived(
		lanFlight ? 'loading' : phase === 'idle' ? 'idle' : problem === 'sleep' ? 'offline' : 'loaded'
	) as 'idle' | 'loading' | 'loaded' | 'offline';
	const laptopLed = $derived(
		phase === 'idle' ? 'off' : problem === 'ip' || problem === 'slow' ? 'warn' : 'ok'
	) as 'ok' | 'warn' | 'down' | 'off';

	// internet visitors raining onto the laptop while it is public
	type Drop = { id: number; lane: number };
	let drops = $state<Drop[]>([]);
	let did = 0;
	$effect(() => {
		if (phase !== 'public') return;
		const gap = problem === 'slow' ? 170 : 520;
		const iv = setInterval(() => {
			if (problem === 'sleep' || problem === 'ip') return;
			const d = { id: ++did, lane: 26 + Math.random() * 48 };
			drops = [...drops.slice(-10), d];
			timers.push(setTimeout(() => (drops = drops.filter((x) => x.id !== d.id)), 720));
		}, gap);
		return () => clearInterval(iv);
	});

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet person(size: number, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="8" r="4" fill={color} />
		<path d="M4 21a8 8 0 0 1 16 0Z" fill={color} />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<!-- the internet above, your home below, one line between them -->
	<div class="scene">
		<!-- internet crowd, only once the laptop goes public -->
		<div class="topzone">
			{#if phase === 'public'}
				<div class="world" class:offline={problem === 'sleep'} class:lost={problem === 'ip'}>
					<div class="heads">
						{#each Array(problem === 'slow' ? 8 : 4) as _, k (k)}
							<span class="hd"
								>{@render person(
									13,
									problem === 'ip' ? '#b9c0c7' : problem === 'slow' ? '#c2491f' : '#dd9e36'
								)}</span
							>
						{/each}
					</div>
					<span class="wlabel">{tx.worldLabel}</span>
				</div>
			{/if}
		</div>

		<!-- the line from the internet into the house -->
		<div class="downzone">
			{#if phase === 'public'}
				<span class="vline" class:dead={problem === 'sleep' || problem === 'ip'}></span>
				{#if problem === 'ip'}
					<span class="badge warn">×</span>
				{:else if problem === 'sleep'}
					<span class="badge down">×</span>
				{/if}
				{#each drops as d (d.id)}
					<span class="visitor" style="--lx:{d.lane}%"
						>{@render person(11, problem === 'slow' ? '#c2491f' : '#dd9e36')}</span
					>
				{/each}
			{/if}
		</div>

		<!-- the home, one clear card -->
		<div class="home" class:dim={problem === 'sleep'}>
			<div class="hhead">
				<span class="hname">{tx.houseLabel}</span>
				<span class="wifi">
					<svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M5 12.5a10 10 0 0 1 14 0M8 16a5.5 5.5 0 0 1 8 0"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
						<circle cx="12" cy="19.4" r="1.4" fill="currentColor" />
					</svg>
					WiFi
				</span>
			</div>
			<div class="hrow">
				<!-- friend phone, the very same phone from lesson one -->
				<div class="actor">
					<div class="shrink"><Browser phase={friendPhase} /></div>
					<span class="alabel">{tx.friendLabel}</span>
				</div>

				<!-- lan link -->
				<div class="lan">
					<div class="lanrail">
						{#if lanFlight}<span class="lanpkt"></span>{/if}
					</div>
					<span class="lanlabel">{phase !== 'idle' ? '✓ ' : ''}{tx.lanLabel}</span>
				</div>

				<!-- the laptop -->
				<div class="actor">
					<div class="lwrap" class:hot={problem === 'slow'}>
						<Laptop phase={problem === 'sleep' ? 'closed' : 'on'} led={laptopLed} />
					</div>
					<span class="alabel">{tx.laptopLabel}</span>
				</div>
			</div>
			<span class="ipchip" class:flash={ipFlash}>{tx.ipLabel} {ip}</span>
		</div>
	</div>

	<!-- consequence -->
	<div class="status" style="color:{status.c}">
		<i style="background:{status.c}"></i>{status.txt}
	</div>
	<p class="note">{note}</p>

	<!-- the one clear next action, Foundation style at the bottom -->
	<div class="acts">
		{#if phase === 'idle'}
			<CallToActionButton onclick={tryLan} disabled={lanFlight}>{tx.tryLan}</CallToActionButton>
		{:else if phase === 'lan'}
			<CallToActionButton onclick={goPublic}>{tx.goPublic}</CallToActionButton>
		{:else}
			<button
				type="button"
				class="prob"
				class:used={tried.has('ip')}
				class:on={problem === 'ip'}
				onclick={() => fire('ip')}>{tx.probIp}</button
			>
			<button
				type="button"
				class="prob"
				class:used={tried.has('sleep')}
				class:on={problem === 'sleep'}
				onclick={() => fire('sleep')}>{tx.probSleep}</button
			>
			<button
				type="button"
				class="prob"
				class:used={tried.has('slow')}
				class:on={problem === 'slow'}
				onclick={() => fire('slow')}>{tx.probSlow}</button
			>
			{#if problem}
				<button type="button" class="ghost" onclick={recover}>{tx.recover}</button>
			{/if}
		{/if}
	</div>
</div>

<style>
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(92vw, 360px);
	}
	.topzone {
		display: flex;
		min-height: 44px;
		align-items: flex-end;
		justify-content: center;
	}
	.world {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		transition: opacity 0.3s ease;
		animation: wpop 0.3s ease;
	}
	@keyframes wpop {
		from {
			transform: translateY(-4px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.world.offline,
	.world.lost {
		opacity: 0.5;
	}
	.heads {
		display: flex;
		gap: 1px;
		line-height: 0;
	}
	.hd {
		line-height: 0;
	}
	.wlabel {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
		white-space: nowrap;
	}
	.downzone {
		position: relative;
		width: 100%;
		height: 40px;
	}
	.vline {
		position: absolute;
		top: 3px;
		bottom: 3px;
		left: 50%;
		width: 0;
		border-left: 2px solid #dcb988;
		transform: translateX(-50%);
		animation: vflow 0.9s linear infinite;
	}
	@keyframes vflow {
		to {
			transform: translate(-50%, 4px);
		}
	}
	.vline.dead {
		border-left-color: #e3ded5;
		animation: none;
	}
	.badge {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid #fff;
		font-size: 13px;
		font-weight: 800;
		color: #fff;
		z-index: 2;
		animation: wpop 0.25s ease;
	}
	.badge.warn {
		background: #dd9e36;
	}
	.badge.down {
		background: #d3584a;
	}
	.visitor {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		line-height: 0;
		z-index: 1;
		animation: vfall 0.7s linear forwards;
	}
	@keyframes vfall {
		from {
			top: -8px;
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		to {
			top: 34px;
			opacity: 1;
		}
	}

	/* home, a proper card with a header */
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		border-radius: 18px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 10px 14px 12px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.07);
		transition: opacity 0.3s ease;
	}
	.home.dim {
		opacity: 0.85;
	}
	.hhead {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 8px;
	}
	.hname {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.wifi {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		background: var(--color-brand-soft);
		border: 1px solid #cdddf6;
		color: #2e6fe0;
		font-size: 9px;
		font-weight: 700;
		padding: 1px 8px;
	}
	.hrow {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.shrink {
		width: 90px;
		height: 184px;
		overflow: visible;
	}
	.shrink > :global(.phone) {
		/* the wrapper is narrower than the phone on purpose, it reserves the scaled
		   footprint, so the phone must keep its natural 150px width */
		max-width: none;
		transform: scale(0.6);
		transform-origin: top left;
	}
	.lan {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		margin-bottom: 26px;
	}
	.lanrail {
		position: relative;
		width: 46px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.lanpkt {
		position: absolute;
		top: 50%;
		left: 0;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #2e6fe0;
		border: 2px solid #fff;
		transform: translate(-50%, -50%);
		animation: lantrip 0.9s ease forwards;
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.2);
	}
	@keyframes lantrip {
		0% {
			left: 0;
		}
		50% {
			left: 100%;
		}
		100% {
			left: 0;
		}
	}
	.lanlabel {
		font-size: 9px;
		font-weight: 700;
		color: var(--color-faint);
		white-space: nowrap;
	}
	.lwrap {
		transition: transform 0.3s ease;
	}
	.lwrap.hot {
		animation: shake 0.4s ease-in-out infinite;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-1.5px);
		}
		75% {
			transform: translateX(1.5px);
		}
	}
	.ipchip {
		margin-top: 6px;
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 1px 8px;
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
		transition: all 0.3s ease;
	}
	.ipchip.flash {
		border-color: #eecac4;
		background: #fbeae7;
		color: #b8392c;
		animation: blink 0.5s ease-in-out 3;
	}
	@keyframes blink {
		50% {
			opacity: 0.4;
		}
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 700;
	}
	.status i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
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
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.prob {
		border-radius: 999px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 8px 14px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
		transition: all 0.2s ease;
	}
	.prob:hover {
		border-color: var(--color-ink);
	}
	.prob.on {
		background: var(--color-ink);
		border-color: var(--color-ink);
		color: #fff;
	}
	.prob.used:not(.on)::after {
		content: ' ✓';
		color: #3a9c64;
	}
	.ghost {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 6px 8px;
	}
	.ghost:hover {
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.visitor,
		.lwrap.hot,
		.vline,
		.lanpkt {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 470px;
		}
		.home {
			padding: 12px 22px 14px;
		}
		.hrow {
			gap: 26px;
		}
		.lanrail {
			width: 90px;
		}
		.shrink {
			width: 105px;
			height: 214px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.7);
		}
		.alabel {
			font-size: 12px;
		}
		.wlabel {
			font-size: 12px;
		}
		.hname {
			font-size: 13px;
		}
		.wifi {
			font-size: 10.5px;
		}
		.lanlabel {
			font-size: 10.5px;
		}
		.ipchip {
			font-size: 10px;
		}
		.status {
			font-size: 14.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.prob {
			font-size: 13.5px;
			padding: 9px 17px;
		}
	}
	:global(.dark) .vline {
		border-left-color: #5a4a2c;
	}
	:global(.dark) .vline.dead {
		border-left-color: #3a4a5c;
	}
	:global(.dark) .badge {
		border-color: #1b2533;
		color: #1b2533;
	}
	:global(.dark) .home {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .wifi {
		border-color: #2c4a6e;
		color: #7daae0;
	}
	:global(.dark) .lanpkt {
		border-color: #1b2533;
	}
	:global(.dark) .ipchip {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .ipchip.flash {
		border-color: #5a2a2a;
		background: #2a1a1a;
		color: #e06050;
	}
	:global(.dark) .note {
		color: #97a3ae;
	}
	:global(.dark) .prob {
		border-color: #2c3746;
		background: #1b2533;
	}
	:global(.dark) .prob.on {
		color: #1b2533;
	}
</style>
