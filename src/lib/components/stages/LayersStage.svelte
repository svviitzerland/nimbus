<script lang="ts">
	import { onDestroy } from 'svelte';
	import LayerPlay from './LayerPlay.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { LayersText } from '$lib/chapters/networking/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as LayersText);

	// One request, dressed for the trip. Beats 0..6 walk it down the stack, and the right panel grows
	// one concrete wrapper each step (the same parcel, never a new scene, so it stays continuous).
	// Beat 7 is the server unwrapping and reading it. Beat 8 recaps how the layers relate and why the
	// order holds. The last beat is the TCP versus UDP playground.
	const lastBeat = $derived(tx.intro.length - 1);
	const playground = $derived(beat >= lastBeat);
	const arrived = $derived(beat === 7);
	const recap = $derived(beat === 8);
	const railActive = $derived(beat <= 6 ? beat : -1);
	const journeyDone = $derived(beat >= 7);

	$effect(() => {
		onshow?.(true); // keep the scene visible through the whole walkthrough
	});

	// ---- the playground: send the same data over TCP and over UDP ----
	type Pkt = { n: number; x: number; state: 'wait' | 'fly' | 'in' | 'lost' };
	let mode = $state<'tcp' | 'udp' | null>(null);
	let phase = $state<'idle' | 'connecting' | 'connected'>('idle');
	let pkts = $state<Pkt[]>([]);
	let received = $state<number[]>([]);
	let sending = $state(false);
	let runId = $state(0);
	let tcpTried = $state(false);
	let udpTried = $state(false);
	let lastResult = $state<string | null>(null);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
	const clearTimers = () => {
		timers.forEach(clearTimeout);
		timers = [];
	};

	function send(m: 'tcp' | 'udp') {
		if (sending) return;
		clearTimers();
		sending = true;
		mode = m;
		runId += 1;
		received = [];
		lastResult = null;
		pkts = [1, 2, 3, 4].map((n) => ({ n, x: 0, state: 'wait' }));

		if (m === 'tcp') {
			phase = 'connecting';
			at(640, () => (phase = 'connected'));
			const base = 820;
			const stagger = 230;
			const dur = 620;
			pkts.forEach((_, i) => {
				at(base + i * stagger, () => {
					pkts[i].state = 'fly';
					pkts[i].x = 100;
				});
				at(base + i * stagger + dur, () => {
					pkts[i].state = 'in';
					received = [...received, pkts[i].n];
				});
			});
			at(base + 3 * stagger + dur + 220, () => finish('tcp'));
		} else {
			phase = 'idle';
			const stagger = 95;
			const dur = 430;
			pkts.forEach((p, i) => {
				const lost = p.n === 2;
				at(60 + i * stagger, () => {
					pkts[i].state = 'fly';
					pkts[i].x = lost ? 46 : 100;
				});
				if (lost) {
					at(60 + i * stagger + dur * 0.55, () => (pkts[i].state = 'lost'));
				} else {
					at(60 + i * stagger + dur, () => {
						pkts[i].state = 'in';
						received = [...received, pkts[i].n];
					});
				}
			});
			at(60 + 3 * stagger + dur + 220, () => finish('udp'));
		}
	}

	function finish(m: 'tcp' | 'udp') {
		sending = false;
		lastResult = m === 'tcp' ? tx.tcpUse : tx.udpUse;
		if (m === 'tcp') tcpTried = true;
		else udpTried = true;
		// Always react to the mode just sent, so the second click still explains itself instead of
		// jumping straight to the comparison. The takeaway card below appears once both are felt.
		onstate?.(m);
		if (tcpTried && udpTried && !done) {
			done = true;
			oncomplete?.();
		}
	}

	onDestroy(clearTimers);
</script>

<div class="wrap">
	{#if !playground}
		<p class="flow">{tx.scenarioNote}</p>

		<div class="journey">
			<!-- rail: where the request is in the stack -->
			<div class="rail">
				<div class="cap-actor phone" class:lit={beat <= 6}>
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<rect
							x="6.6"
							y="1.2"
							width="10.8"
							height="21.6"
							rx="2.6"
							fill="#fff"
							stroke="#2b3640"
							stroke-width="1.7"
						/>
						<rect x="8.6" y="4.2" width="6.8" height="13.2" rx="1" fill="#dbe8fb" />
						<circle cx="12" cy="20" r="1.1" fill="#2b3640" />
					</svg>
					<span class="rlab">{tx.senderLabel}</span>
				</div>

				<div class="bands">
					{#each tx.layers as L, i (L.name)}
						<div
							class="rb"
							class:on={railActive === i}
							class:passed={(railActive >= 0 && i < railActive) || journeyDone}
						>
							<span class="rn">{tx.layers.length - i}</span>
							<span class="rname">{L.name}</span>
						</div>
					{/each}
				</div>

				<div class="rconn" class:flow={beat === 6 || beat === 7}><span></span></div>

				<div class="cap-actor server" class:lit={journeyDone}>
					<span class="rrack" aria-hidden="true"><i></i><i></i><i></i></span>
					<span class="rlab">{tx.receiverLabel}</span>
				</div>
			</div>

			<!-- panel: the parcel being wrapped, then unwrapped, then the recap -->
			<div class="panel">
				<div class="phead">
					{#if recap}
						<span class="lbadge done">✓</span>
						<span class="hname">{tx.recapTitle}</span>
					{:else if arrived}
						<span class="lbadge done">✓</span>
						<span class="hname">{tx.receiverLabel}</span>
					{:else}
						{@const L = tx.layers[railActive]}
						<span class="lbadge">Layer {tx.layers.length - railActive}</span>
						<span class="hname">{L.name}</span>
					{/if}
				</div>

				<div class="pbody">
					{#if recap}
						<div class="recap">
							<div class="rside">
								<span class="rwho phone2">{tx.senderLabel}</span>
								<span class="rarrow">↓</span>
								<span class="ratag">{tx.wrapLabel}</span>
								<span class="rseq">7 → 1</span>
							</div>
							<div class="rgap" aria-hidden="true"></div>
							<div class="rside">
								<span class="rwho server2">{tx.receiverLabel}</span>
								<span class="rarrow up">↑</span>
								<span class="ratag">{tx.unwrapLabel}</span>
								<span class="rseq">1 → 7</span>
							</div>
						</div>
					{:else}
						<LayerPlay {tx} {beat} />
					{/if}
				</div>

				<div class="pcap">
					{#if recap}
						{tx.orderNote}
					{:else if arrived}
						{tx.arriveNote}
					{:else}
						{@const L = tx.layers[railActive]}
						{L.job} <span class="capw">{L.where}</span>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="pg">
			<p class="pprompt">{tx.playPrompt}</p>

			<div class="play">
				<div class="end">
					<span class="estack" aria-hidden="true"><i></i><i></i><i></i></span>
					<span class="elabel">{tx.senderLabel}</span>
				</div>

				<div class="channel">
					{#if mode === 'tcp' && phase !== 'idle'}
						<span class="hs" class:ok={phase === 'connected'}>
							{phase === 'connected' ? tx.connectedLabel : tx.connectingLabel}
						</span>
					{/if}
					{#key runId}
						{#each pkts as p (p.n)}
							<span class="pk {p.state} {mode}" style="left:{p.x}%">
								{p.n}
								{#if p.state === 'lost'}<span class="lostt">{tx.lostLabel}</span>{/if}
							</span>
						{/each}
					{/key}
				</div>

				<div class="end">
					<span class="elabel">{tx.receiverLabel}</span>
					<span class="rcap">{tx.receivedLabel}</span>
					<div class="tally">
						{#each [1, 2, 3, 4] as n (n)}
							<span class="slot" class:got={received.includes(n)}
								>{received.includes(n) ? n : ''}</span
							>
						{/each}
					</div>
				</div>
			</div>

			<div class="btns">
				<button
					type="button"
					class="send tcp"
					class:done={tcpTried}
					disabled={sending}
					onclick={() => send('tcp')}
				>
					{tx.tcpBtn}
				</button>
				<button
					type="button"
					class="send udp"
					class:done={udpTried}
					disabled={sending}
					onclick={() => send('udp')}
				>
					{tx.udpBtn}
				</button>
			</div>

			{#if lastResult}
				<p class="use {mode}">{lastResult}</p>
			{:else}
				<p class="use hint">{tx.tryBothHint}</p>
			{/if}

			{#if tcpTried && udpTried}
				<div class="takeaway">
					<span class="tk-label">TCP vs UDP</span>
					<p>{tx.reactions.both}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(96vw, 760px);
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 11px;
	}
	.flow {
		margin: 0;
		max-width: 480px;
		text-align: center;
		font-size: 11.5px;
		line-height: 1.4;
		color: #8a949d;
	}

	/* ---- journey: rail + big panel ---- */
	.journey {
		display: flex;
		width: 100%;
		align-items: stretch;
		justify-content: center;
		gap: 12px;
	}
	.rail {
		display: flex;
		width: 50px;
		flex: none;
		flex-direction: column;
		align-items: stretch;
		gap: 5px;
	}
	.cap-actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 9px;
		border: 1px solid #e6e0d6;
		background: #fff;
		padding: 5px 4px;
		transition:
			border-color 0.25s,
			box-shadow 0.25s;
	}
	.cap-actor svg {
		width: 16px;
		height: 16px;
	}
	.phone.lit {
		border-color: #cadcf7;
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.12);
	}
	.server.lit {
		border-color: #b9e0c8;
		box-shadow: 0 0 0 3px rgba(47, 138, 87, 0.14);
	}
	.rrack {
		display: flex;
		width: 16px;
		flex-direction: column;
		gap: 2px;
	}
	.rrack i {
		height: 3px;
		border-radius: 1px;
		background: #cbd5df;
	}
	.server.lit .rrack i {
		background: #8fcfa8;
	}
	.rlab {
		font-size: 9px;
		font-weight: 800;
		color: #5b6675;
	}
	.bands {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		border-radius: 9px;
		border: 1px solid #e6e0d6;
		background: #fff;
	}
	.rb {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-bottom: 1px solid #f0ebe1;
		padding: 0 4px;
		transition: background 0.25s;
	}
	.rb:last-child {
		border-bottom: none;
	}
	.rb.on {
		background: #eef4fc;
	}
	.rb.passed {
		background: #f4faf6;
	}
	.rn {
		display: inline-flex;
		height: 16px;
		width: 16px;
		flex: none;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		background: #f1ece2;
		font-size: 9px;
		font-weight: 800;
		color: #8a949d;
	}
	.rb.on .rn {
		background: #2e6fe0;
		color: #fff;
	}
	.rb.passed .rn {
		background: #cdead9;
		color: #2f7d54;
	}
	.rname {
		display: none;
		font-size: 11px;
		font-weight: 700;
		color: #2b3640;
		white-space: nowrap;
	}
	.rconn {
		position: relative;
		height: 12px;
		width: 3px;
		align-self: center;
		border-radius: 2px;
		background: #dfe5ee;
	}
	.rconn span {
		position: absolute;
		left: 50%;
		top: 0;
		height: 6px;
		width: 6px;
		border-radius: 50%;
		background: #2e6fe0;
		transform: translate(-50%, -50%);
		opacity: 0;
	}
	.rconn.flow span {
		animation: down 0.95s linear infinite;
	}

	.panel {
		display: flex;
		min-width: 0;
		max-width: 470px;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		border-radius: 16px;
		border: 1px solid #ece6dc;
		background: #faf9f6;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.06);
	}
	.phead {
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid #eee8dd;
		background: #fff;
		padding: 9px 13px;
	}
	.lbadge {
		border-radius: 6px;
		background: #2e6fe0;
		padding: 3px 8px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.02em;
		color: #fff;
		white-space: nowrap;
	}
	.lbadge.done {
		background: #2f8a57;
	}
	.hname {
		font-family: 'Fraunces', Georgia, serif;
		font-size: 16px;
		font-weight: 600;
		color: #1f2a37;
	}
	.pbody {
		display: flex;
		flex: 1;
		min-height: 168px;
		align-items: center;
		justify-content: center;
		padding: 12px 10px;
	}
	.pcap {
		border-top: 1px solid #eee8dd;
		padding: 9px 13px;
		font-size: 12px;
		line-height: 1.45;
		color: #4a5663;
	}
	.capw {
		color: #97a1ad;
	}

	/* ---- recap: how the layers relate, both directions ---- */
	.recap {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 18px;
	}
	.rside {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.rwho {
		border-radius: 8px;
		border: 1px solid #e6e0d6;
		background: #fff;
		padding: 5px 13px;
		font-size: 12px;
		font-weight: 800;
		color: #2b3640;
	}
	.rwho.phone2 {
		border-color: #cadcf7;
	}
	.rwho.server2 {
		border-color: #b9e0c8;
	}
	.rarrow {
		font-size: 22px;
		font-weight: 900;
		line-height: 1;
		color: #2e6fe0;
	}
	.rarrow.up {
		color: #2f8a57;
	}
	.ratag {
		font-size: 11px;
		font-weight: 700;
		color: #5b6675;
	}
	.rseq {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		font-weight: 800;
		color: #9aa3ae;
	}
	.rgap {
		width: 1px;
		align-self: stretch;
		margin: 6px 2px;
		background: repeating-linear-gradient(#ded8cc 0 4px, transparent 4px 8px);
	}

	@keyframes down {
		0% {
			top: 0;
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}

	/* ---- playground ---- */
	.pg {
		display: flex;
		width: 100%;
		max-width: 380px;
		flex-direction: column;
		align-items: center;
		gap: 15px;
	}
	.pprompt {
		margin: 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: #5b6675;
	}
	.play {
		display: flex;
		width: 100%;
		align-items: stretch;
		gap: 8px;
	}
	.end {
		display: flex;
		width: 78px;
		flex: none;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 5px;
		border-radius: 11px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 9px 6px;
	}
	.estack {
		display: flex;
		width: 28px;
		flex-direction: column;
		gap: 3px;
	}
	.estack i {
		height: 5px;
		border-radius: 2px;
		background: #d9e3f3;
	}
	.elabel {
		font-size: 11px;
		font-weight: 800;
		color: #2b3640;
		text-align: center;
	}
	.rcap {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: #9aa3ae;
		text-transform: uppercase;
	}
	/* four slots in a 2 by 2 grid, so they fit inside the 78px server card */
	.tally {
		display: grid;
		grid-template-columns: repeat(2, 18px);
		gap: 4px;
	}
	.slot {
		display: inline-flex;
		height: 18px;
		width: 18px;
		align-items: center;
		justify-content: center;
		border-radius: 5px;
		border: 1px solid #e6e0d6;
		background: #f6f4ef;
		font-size: 10.5px;
		font-weight: 800;
		color: #b7bec8;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;
	}
	.slot.got {
		border-color: #b9e0c8;
		background: #eaf6ee;
		color: #2f8a57;
	}
	.channel {
		position: relative;
		flex: 1;
		min-width: 70px;
		align-self: center;
		height: 64px;
		border-radius: 11px;
		background: linear-gradient(#fbfaf7, #f4f1ea);
		border: 1px solid #ece6dc;
		overflow: hidden;
	}
	.hs {
		position: absolute;
		top: 6px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #fff4e0;
		color: #b9802a;
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 8px;
		white-space: nowrap;
		box-shadow: 0 1px 4px rgba(22, 40, 60, 0.08);
	}
	.hs.ok {
		background: #eaf6ee;
		color: #2f8a57;
	}
	.pk {
		position: absolute;
		top: 50%;
		left: 0;
		display: inline-flex;
		height: 22px;
		min-width: 22px;
		transform: translate(-50%, -50%);
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		background: #2e6fe0;
		padding: 0 5px;
		font-size: 11px;
		font-weight: 800;
		color: #fff;
		box-shadow: 0 3px 7px rgba(46, 111, 224, 0.28);
	}
	.pk.tcp {
		transition:
			left 0.62s linear,
			opacity 0.3s;
	}
	.pk.udp {
		background: #e08a2b;
		box-shadow: 0 3px 7px rgba(224, 138, 43, 0.3);
		transition:
			left 0.43s linear,
			opacity 0.3s;
	}
	.pk.wait {
		opacity: 0;
	}
	.pk.in {
		opacity: 0;
	}
	.pk.lost {
		animation: drop 0.55s ease forwards;
	}
	.lostt {
		position: absolute;
		top: -15px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 9px;
		font-weight: 800;
		color: #d3584a;
		white-space: nowrap;
	}
	@keyframes drop {
		from {
			opacity: 1;
			background: #e08a2b;
		}
		to {
			opacity: 0;
			background: #d3584a;
			transform: translate(-50%, 12px);
		}
	}
	.btns {
		display: flex;
		width: 100%;
		gap: 9px;
	}
	.send {
		flex: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 11px;
		padding: 11px 8px;
		font-size: 13px;
		font-weight: 800;
		color: #fff;
		transition:
			filter 0.15s,
			transform 0.08s,
			opacity 0.15s;
	}
	.send:enabled:hover {
		filter: brightness(1.08);
	}
	.send:enabled:active {
		transform: translateY(1px);
	}
	.send:disabled {
		opacity: 0.5;
	}
	.send.tcp {
		background: #2e6fe0;
	}
	.send.udp {
		background: #e08a2b;
	}
	.send.done {
		box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.5);
	}
	.use {
		margin: 0;
		min-height: 34px;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		line-height: 1.45;
		color: #4a5663;
	}
	.use.hint {
		color: #9aa3ae;
	}
	.use.tcp {
		color: #2563c4;
	}
	.use.udp {
		color: #bd7320;
	}
	.takeaway {
		width: 100%;
		max-width: 344px;
		border-radius: 12px;
		border: 1px solid #e6e0d6;
		background: #fff;
		padding: 11px 13px;
		text-align: left;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.06);
		animation: tk-in 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.tk-label {
		display: inline-block;
		margin-bottom: 6px;
		border-radius: 999px;
		background: #eef4fc;
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		color: #2563c4;
	}
	.takeaway p {
		margin: 0;
		font-size: 12px;
		line-height: 1.5;
		color: #4a5663;
	}
	@keyframes tk-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	:global(.dark) .flow {
		color: var(--color-faint);
	}
	:global(.dark) .cap-actor {
		border-color: var(--color-line);
		background: var(--color-card);
	}
	:global(.dark) .phone.lit {
		border-color: #cadcf7;
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.12);
	}
	:global(.dark) .server.lit {
		border-color: #b9e0c8;
		box-shadow: 0 0 0 3px rgba(47, 138, 87, 0.14);
	}
	:global(.dark) .rrack i {
		background: #4a5a6a;
	}
	:global(.dark) .server.lit .rrack i {
		background: #8fcfa8;
	}
	:global(.dark) .rlab {
		color: var(--color-muted);
	}
	:global(.dark) .bands {
		border-color: var(--color-line);
		background: var(--color-card);
	}
	:global(.dark) .rb {
		border-bottom: 1px solid var(--color-line);
	}
	:global(.dark) .rb.on {
		background: color-mix(in srgb, var(--color-brand) 18%, transparent);
	}
	:global(.dark) .rb.passed {
		background: color-mix(in srgb, var(--color-grass) 18%, transparent);
	}
	:global(.dark) .rn {
		background: var(--color-paper);
		color: var(--color-faint);
	}
	:global(.dark) .rb.on .rn {
		background: var(--color-brand);
		color: #fff;
	}
	:global(.dark) .rb.passed .rn {
		background: color-mix(in srgb, var(--color-grass) 30%, transparent);
		color: var(--color-grass);
	}
	:global(.dark) .rname {
		color: var(--color-ink);
	}
	:global(.dark) .rconn {
		background: #3a4a5a;
	}
	:global(.dark) .panel {
		border-color: var(--color-line);
		background: var(--color-paper);
		box-shadow: none;
	}
	:global(.dark) .phead {
		border-bottom: 1px solid var(--color-line);
		background: var(--color-card);
	}
	:global(.dark) .hname {
		color: var(--color-ink);
	}
	:global(.dark) .pcap {
		border-top: 1px solid var(--color-line);
		color: var(--color-muted);
	}
	:global(.dark) .capw {
		color: var(--color-faint);
	}
	:global(.dark) .rwho {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	:global(.dark) .rwho.phone2 {
		border-color: #cadcf7;
	}
	:global(.dark) .rwho.server2 {
		border-color: #b9e0c8;
	}
	:global(.dark) .rarrow {
		color: var(--color-brand);
	}
	:global(.dark) .rarrow.up {
		color: var(--color-grass);
	}
	:global(.dark) .ratag {
		color: var(--color-muted);
	}
	:global(.dark) .rseq {
		color: var(--color-faint);
	}
	:global(.dark) .rgap {
		background: repeating-linear-gradient(#5a5349 0 4px, transparent 4px 8px);
	}
	:global(.dark) .pprompt {
		color: var(--color-muted);
	}
	:global(.dark) .end {
		border-color: var(--color-line);
		background: var(--color-card);
	}
	:global(.dark) .estack i {
		background: color-mix(in srgb, var(--color-brand) 25%, transparent);
	}
	:global(.dark) .elabel {
		color: var(--color-ink);
	}
	:global(.dark) .rcap {
		color: var(--color-faint);
	}
	:global(.dark) .slot {
		border-color: var(--color-line);
		background: var(--color-paper);
		color: var(--color-faint);
	}
	:global(.dark) .slot.got {
		border-color: #1f3d28;
		background: color-mix(in srgb, var(--color-grass) 18%, transparent);
		color: var(--color-grass);
	}
	:global(.dark) .channel {
		background: linear-gradient(var(--color-card), var(--color-paper));
		border-color: var(--color-line);
	}
	:global(.dark) .hs {
		background: color-mix(in srgb, var(--color-amber) 18%, transparent);
		color: var(--color-amber);
		box-shadow: none;
	}
	:global(.dark) .hs.ok {
		background: color-mix(in srgb, var(--color-grass) 18%, transparent);
		color: var(--color-grass);
	}
	:global(.dark) .use {
		color: var(--color-muted);
	}
	:global(.dark) .use.hint {
		color: var(--color-faint);
	}
	:global(.dark) .use.tcp {
		color: var(--color-brand);
	}
	:global(.dark) .use.udp {
		color: var(--color-amber);
	}
	:global(.dark) .takeaway {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .tk-label {
		background: color-mix(in srgb, var(--color-brand) 18%, transparent);
		color: var(--color-brand);
	}
	:global(.dark) .takeaway p {
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.rconn.flow span,
		.takeaway {
			animation: none;
		}
		.pk.tcp,
		.pk.udp {
			transition: opacity 0.3s;
		}
		.pk.lost {
			animation: none;
			opacity: 0;
		}
	}
	@media (min-width: 700px) {
		.rail {
			width: 158px;
		}
		.rb {
			justify-content: flex-start;
			padding: 0 10px;
		}
		.rname {
			display: inline;
		}
		.rlab {
			font-size: 10.5px;
		}
		.cap-actor svg {
			width: 18px;
			height: 18px;
		}
		.pbody {
			min-height: 212px;
		}
		.channel {
			height: 72px;
		}
	}
</style>
