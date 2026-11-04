<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { LoadBalancerText } from '$lib/chapters/traffic/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import ServerRack from '$lib/components/Server.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as LoadBalancerText);

	type Server = { id: number; alive: boolean };
	let servers = $state<Server[]>([{ id: 1, alive: true }]);
	let loads = $state<Record<number, number>>({ 1: 0 }); // visitors currently on each server
	let hasBalancer = $state(false);
	let surge = $state(false);
	let highlightBal = $state(false);
	let done = false;

	const alive = $derived(servers.filter((s) => s.alive));
	const overloaded = $derived(alive.some((s) => (loads[s.id] ?? 0) > 11));
	const phase = $derived(
		!surge
			? 'start'
			: !hasBalancer
				? 'overload'
				: servers.some((s) => !s.alive)
					? 'done'
					: 'balanced'
	);
	const prompt = $derived(
		phase === 'start'
			? tx.promptStart
			: phase === 'overload'
				? tx.promptOverload
				: phase === 'balanced'
					? tx.promptBalanced
					: tx.promptDone
	);
	// the single action offered at this point in the simulation
	const action = $derived(
		phase === 'start'
			? { label: tx.startSale, run: startSurge }
			: phase === 'overload'
				? { label: tx.addServer, run: addServer }
				: phase === 'balanced'
					? { label: tx.killServer, run: killServer }
					: null
	);
	const statusText = $derived(overloaded ? tx.siteDown : tx.siteFast);

	function stateOf(id: number, isAlive: boolean) {
		if (!isAlive) return 'dead';
		const l = loads[id] ?? 0;
		if (l > 11) return 'full';
		if (l > 6) return 'busy';
		return 'calm';
	}
	function colorOf(st: string) {
		return st === 'full'
			? '#d3584a'
			: st === 'busy'
				? '#dd9e36'
				: st === 'dead'
					? '#cfd6dd'
					: '#3a9c64';
	}
	// Each arriving visitor is a person icon that streams down a rail onto a server.
	type Arrival = { id: number; lane: number; tid: number; routed: boolean };
	let arrivals = $state<Arrival[]>([]);
	let aid = 0;
	let tickN = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function laneOf(idx: number) {
		return ((idx + 0.5) / servers.length) * 100;
	}

	function arrive() {
		const live = servers.filter((s) => s.alive);
		if (!live.length) return;
		// the balancer sends each visitor to the emptiest server; without one they all pile on server 1
		const target = hasBalancer
			? live.reduce((a, b) => ((loads[b.id] ?? 0) < (loads[a.id] ?? 0) ? b : a))
			: live[0];
		const idx = servers.findIndex((s) => s.id === target.id);
		const id = ++aid;
		const tid = target.id;
		arrivals = [...arrivals, { id, lane: laneOf(idx), tid, routed: !hasBalancer }];
		if (hasBalancer)
			timers.push(
				setTimeout(
					() => (arrivals = arrivals.map((a) => (a.id === id ? { ...a, routed: true } : a))),
					240
				)
			);
		// when the visitor lands, it joins that server for a short while
		timers.push(
			setTimeout(
				() => {
					arrivals = arrivals.filter((a) => a.id !== id);
					const srv = servers.find((s) => s.id === tid);
					if (!srv || !srv.alive) return;
					loads = { ...loads, [tid]: (loads[tid] ?? 0) + 1 };
					// hold tuned so one server alone tips into red, while two survivors stay amber
					timers.push(
						setTimeout(() => (loads = { ...loads, [tid]: Math.max(0, (loads[tid] ?? 0) - 1) }), 900)
					);
				},
				hasBalancer ? 540 : 460
			)
		);
	}

	function startSurge() {
		surge = true;
		onstate?.('overload');
	}
	function addServer() {
		hasBalancer = true;
		servers = [
			{ id: 1, alive: true },
			{ id: 2, alive: true },
			{ id: 3, alive: true }
		];
		loads = { 1: loads[1] ?? 0, 2: 0, 3: 0 };
		highlightBal = true;
		timers.push(setTimeout(() => (highlightBal = false), 2400));
		onstate?.('balanced');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
	function killServer() {
		const live = servers.filter((s) => s.alive);
		if (live.length <= 1) return;
		const victim = live[live.length - 1].id;
		servers = servers.map((s) => (s.id === victim ? { ...s, alive: false } : s));
		loads = { ...loads, [victim]: 0 };
		onstate?.('rerouted');
	}
	function reset() {
		surge = false;
		hasBalancer = false;
		done = false;
		arrivals = [];
		servers = [{ id: 1, alive: true }];
		loads = { 1: 0 };
	}

	$effect(() => {
		const iv = setInterval(() => {
			tickN++;
			const n = surge ? 2 : tickN % 6 === 0 ? 1 : 0;
			for (let k = 0; k < n; k++) arrive();
		}, 150);
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

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- The live scene: visitors stream from the top, through the balancer, onto the servers -->
	<div class="scene">
		<div class="mech" class:wide={servers.length > 1}>
			<!-- rails: the path traffic takes, fanning from the balancer to each server -->
			<svg class="rails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#if hasBalancer}
					<line class="rail" x1="50" y1="11" x2="50" y2="33" />
					{#each servers as s, i (s.id)}
						<line class="rail" class:dead={!s.alive} x1="50" y1="33" x2={laneOf(i)} y2="60" />
					{/each}
				{:else}
					<line class="rail" x1="50" y1="11" x2="50" y2="60" />
				{/if}
			</svg>

			<!-- the crowd at the top: one visitor, then a flood. Plain icons, not a button. -->
			<div class="crowd">
				<div class="heads" class:busy={surge}>
					{#if surge}
						{#each Array(7) as _, k (k)}
							<span class="h">{@render person(13, '#c2491f')}</span>
						{/each}
					{:else}
						<span class="h">{@render person(15, '#8a949d')}</span>
					{/if}
				</div>
				<span class="crowd-label" class:busy={surge}>{surge ? tx.crowdMany : tx.crowdOne}</span>
			</div>

			<!-- the load balancer: appears with the servers, highlighted, splitting the crowd -->
			{#if hasBalancer}
				<div class="balancer" class:flash={highlightBal}>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M12 4v6m0 0L6 18m6-8 6 8"
							stroke="#2e6fe0"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<div class="bal-text">
						<span class="bal-name">{tx.balancerLabel}</span>
						<span class="bal-note">{tx.balancerNote}</span>
					</div>
				</div>
			{/if}

			<!-- the servers, each holding the visitors currently on it -->
			<div class="servers">
				{#each servers as s, i (s.id)}
					{@const st = stateOf(s.id, s.alive)}
					{@const l = loads[s.id] ?? 0}
					<div class="srv-col">
						<div class="pile">
							{#each Array(Math.min(l, 9)) as _, k (k)}
								<span class="u">{@render person(11, colorOf(st))}</span>
							{/each}
							{#if l > 9}<span class="more" style="color:{colorOf(st)}">+{l - 9}</span>{/if}
						</div>
						<div class="srv-wrap {st}" style="--c:{colorOf(st)}">
							<ServerRack slots={3} active={false} />
							{#if !s.alive}
								<span class="rx">×</span>
							{/if}
						</div>
						<span class="slabel" class:off={!s.alive}
							>{tx.serverLabel.replace('{n}', String(s.id))}</span
						>
					</div>
				{/each}
			</div>

			<!-- visitors streaming down the rails onto the servers -->
			{#each arrivals as a (a.id)}
				<span
					class="visitor"
					class:routed={a.routed}
					class:bal={hasBalancer}
					style="--lx:{a.lane}%"
				>
					{@render person(13, '#c2491f')}
				</span>
			{/each}
		</div>
	</div>

	<!-- the result of the simulation, shown as a plain status caption -->
	<div class="status" class:down={overloaded}>
		<span class="sdotpill"></span>
		{statusText}
	</div>

	<!-- guidance + the one clear action, at the bottom like the Foundation stage -->
	<div class="footer">
		<p class="prompt">{prompt}</p>
		<div class="acts">
			{#if action}
				<CallToActionButton onclick={action.run}>{action.label}</CallToActionButton>
			{/if}
			{#if surge}
				<button type="button" onclick={reset} class="reset">{tx.reset}</button>
			{/if}
		</div>
	</div>
</div>

<style>
	.scene {
		display: flex;
		justify-content: center;
	}
	.mech {
		position: relative;
		width: 250px;
		height: 256px;
		--crowd-y: 11%;
		--bal-y: 33%;
		--srv-y: 60%;
	}
	.mech.wide {
		width: 300px;
	}

	.rails {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		pointer-events: none;
	}
	.rail {
		stroke: #dcd6cb;
		stroke-width: 2;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}
	.rail.dead {
		stroke: #ece8e1;
		animation: none;
	}
	@keyframes flow {
		to {
			stroke-dashoffset: -8;
		}
	}

	/* the crowd at the top */
	.crowd {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		z-index: 5;
	}
	.heads {
		display: flex;
		justify-content: center;
		gap: 1px;
		line-height: 0;
	}
	.heads.busy {
		max-width: 110px;
		flex-wrap: wrap;
	}
	.h {
		line-height: 0;
	}
	.crowd-label {
		font-size: 10.5px;
		font-weight: 600;
		color: #8a949d;
		white-space: nowrap;
	}
	.crowd-label.busy {
		color: #c2491f;
	}

	/* the load balancer box */
	.balancer {
		position: absolute;
		top: calc(var(--bal-y) - 16px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 12px;
		border: 1.5px solid #cdddf6;
		background: #eaf1fc;
		padding: 5px 12px;
		box-shadow: 0 8px 18px rgba(46, 111, 224, 0.14);
		white-space: nowrap;
		z-index: 5;
	}
	.bal-text {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}
	.bal-name {
		font-size: 11px;
		font-weight: 700;
		color: #2e6fe0;
	}
	.bal-note {
		font-size: 8.5px;
		color: #6a93d6;
	}
	.balancer.flash {
		animation: flash 0.7s ease-in-out 3;
	}
	@keyframes flash {
		0%,
		100% {
			box-shadow: 0 8px 18px rgba(46, 111, 224, 0.14);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(46, 111, 224, 0.28);
		}
	}

	/* the servers */
	.servers {
		position: absolute;
		top: var(--srv-y);
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
		z-index: 2;
	}
	.srv-col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.pile {
		display: flex;
		flex-wrap: wrap-reverse;
		justify-content: center;
		align-items: flex-end;
		gap: 1px;
		width: 56px;
		min-height: 22px;
	}
	.u {
		line-height: 0;
	}
	.more {
		font-size: 10px;
		font-weight: 800;
		align-self: center;
	}
	.srv-wrap {
		position: relative;
		min-height: 46px;
	}
	.srv-wrap.full :global(.server) {
		animation: shake 0.4s ease-in-out infinite;
	}
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}
	.srv-wrap.dead :global(.slot) {
		display: none;
	}
	.srv-wrap.dead :global(.server) {
		opacity: 0.55;
		background: var(--color-paper);
		align-items: center;
		justify-content: center;
		min-height: 46px;
	}
	.srv-wrap .rx {
		display: none;
	}
	.srv-wrap.dead .rx {
		display: block;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: #b9c0c7;
		font-size: 18px;
		font-weight: 700;
		line-height: 1;
		z-index: 1;
	}
	.srv-wrap :global(.server) {
		width: 56px;
		gap: 4px;
		border-radius: 10px;
		padding: 7px;
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.07);
		border-width: 1.5px;
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease,
			opacity 0.3s ease;
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
	.srv-wrap.calm :global(.server),
	.srv-wrap.busy :global(.server),
	.srv-wrap.full :global(.server) {
		border-color: var(--c);
		box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 22%, transparent);
	}
	.slabel {
		font-size: 10px;
		font-weight: 600;
		color: #5e6b76;
	}
	.slabel.off {
		color: #b9c0c7;
	}

	/* a visitor falling from the crowd, then (with a balancer) routed to a server lane */
	.visitor {
		position: absolute;
		top: var(--crowd-y);
		left: 50%;
		line-height: 0;
		transform: translateX(-50%);
		z-index: 4;
		animation: fall 0.46s linear forwards;
	}
	.visitor.bal {
		animation: drop 0.24s ease-in forwards;
	}
	.visitor.bal.routed {
		animation: route 0.46s ease-out forwards;
	}
	@keyframes fall {
		from {
			top: var(--crowd-y);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		to {
			top: calc(var(--srv-y) - 16px);
			opacity: 1;
		}
	}
	@keyframes drop {
		from {
			top: var(--crowd-y);
			left: 50%;
			opacity: 0;
		}
		45% {
			opacity: 1;
		}
		to {
			top: var(--bal-y);
			left: 50%;
			opacity: 1;
		}
	}
	@keyframes route {
		from {
			top: var(--bal-y);
			left: 50%;
			opacity: 1;
		}
		to {
			top: calc(var(--srv-y) - 16px);
			left: var(--lx);
			opacity: 1;
		}
	}

	/* site status, a plain caption so it never reads as a button */
	.status {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-size: 13px;
		font-weight: 700;
		color: #2f7d54;
		transition: color 0.3s ease;
	}
	.status .sdotpill {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3a9c64;
		transition: background 0.3s ease;
	}
	.status.down {
		color: #b8392c;
	}
	.status.down .sdotpill {
		background: #d3584a;
		animation: blink 0.8s ease-in-out infinite;
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	/* guidance + action button, anchored at the bottom */
	.footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.prompt {
		max-width: 300px;
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
	.reset {
		font-size: 13px;
		font-weight: 600;
		color: #5e6b76;
		padding: 6px 8px;
	}
	.reset:hover {
		color: #16212b;
	}

	/* ---- Dark mode ---- */
	:global(.dark) .rail {
		stroke: var(--color-line);
	}
	:global(.dark) .rail.dead {
		stroke: var(--color-line);
	}
	:global(.dark) .crowd-label {
		color: var(--color-faint);
	}
	:global(.dark) .crowd-label.busy {
		color: #c2491f;
	}
	:global(.dark) .balancer {
		background: var(--color-card);
		border-color: #3a5a80;
		box-shadow: none;
	}
	:global(.dark) .bal-name {
		color: var(--color-brand);
	}
	:global(.dark) .bal-note {
		color: var(--color-muted);
	}
	:global(.dark) .srv-wrap :global(.server) {
		box-shadow: none;
	}
	:global(.dark) .srv-wrap.dead .rx {
		color: var(--color-faint);
	}
	:global(.dark) .srv-wrap :global(.slot) {
		background: #222a36;
	}
	:global(.dark) .slabel {
		color: var(--color-muted);
	}
	:global(.dark) .slabel.off {
		color: var(--color-faint);
	}
	:global(.dark) .status {
		color: var(--color-grass);
	}
	:global(.dark) .status.down {
		color: var(--color-danger);
	}
	:global(.dark) .prompt {
		color: var(--color-muted);
	}
	:global(.dark) .reset {
		color: var(--color-muted);
	}
	:global(.dark) .reset:hover {
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.visitor,
		.rack.full,
		.rail,
		.balancer.flash,
		.status.down .sdotpill {
			animation-duration: 0.01s;
		}
	}

	/* Desktop has the room, so the scene grows and spreads out. */
	@media (min-width: 768px) {
		.mech {
			width: 320px;
			height: 320px;
		}
		.mech.wide {
			width: 430px;
		}
		.crowd-label {
			font-size: 12px;
		}
		.bal-name {
			font-size: 12.5px;
		}
		.bal-note {
			font-size: 9.5px;
		}
		.pile {
			width: 74px;
			min-height: 28px;
		}
		.srv-wrap :global(.server) {
			width: 74px;
			min-height: 58px;
			padding: 9px;
		}
		.srv-wrap :global(.slot) {
			height: 11px;
		}
		.srv-wrap :global(.dot) {
			width: 5px;
			height: 5px;
		}
		.slabel {
			font-size: 12px;
		}
		.prompt {
			max-width: 460px;
			font-size: 14px;
		}
	}
</style>
