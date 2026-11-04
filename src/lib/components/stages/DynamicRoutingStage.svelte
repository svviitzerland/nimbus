<script lang="ts">
	// Guided dynamic routing lesson, in two short acts that follow Nim's beats.
	// Act one, a small company network loses a cable, the routers talk, and packets take a new
	// road by themselves. Act two, the Facebook outage of 4 October 2021 told as a tiny animated
	// tale, a BGP announcement leaves, the provider forgets, then it all comes back. The only
	// (optional) play is pulling the announcement on the last beat.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import NgRouter from './netguide/NgRouter.svelte';
	import NgServer from './netguide/NgServer.svelte';
	import NgPhone from './netguide/NgPhone.svelte';
	import { Traveller } from './netguide/traveller.svelte';
	import { prefersReducedMotion, timerBag } from './netguide/motion';
	import type { StageProps } from '$lib/chapters/types';
	import type { DynamicRoutingText } from '$lib/chapters/network/dynamic-routing/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DynamicRoutingText);

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const shown = $derived(Math.max(0, Math.min(peek ?? beat, last)));
	const act = $derived(shown <= 4 ? 1 : 2);

	// ---------- Act one, the company network ----------
	type R = 'A' | 'B' | 'C' | 'D' | 'E';
	const P: Record<R, { x: number; y: number }> = {
		A: { x: 52, y: 160 },
		B: { x: 170, y: 72 },
		C: { x: 130, y: 258 },
		D: { x: 244, y: 258 },
		E: { x: 290, y: 160 }
	};
	const LINKS: [R, R][] = [
		['A', 'B'],
		['B', 'E'],
		['A', 'C'],
		['C', 'D'],
		['D', 'E']
	];
	const cut = $derived(act === 1 && shown >= 1);
	const talking = $derived(shown === 2);

	// ---------- Act two, the Facebook tale ----------
	// Facebook's box spans x 198 to 336. Its edge router (GATE) is where your provider's road
	// arrives, so the road and the packet always end on something.
	const PH = { x: 40, y: 262 };
	const PROV = { x: 140, y: 262 };
	const GATE = { x: 238, y: 206 };
	const DNS = { x: 236, y: 90 };
	const FDC = { x: 302, y: 146 };

	let pulled = $state(false);
	function togglePull() {
		pulled = !pulled;
		onstate?.(pulled ? 'withdraw' : 'announce');
	}

	// Step 6 plays out in two moments, the backbone breaks, then the announcement stops.
	let withdrawnLate = $state(false);
	const bag = timerBag();
	$effect(() => {
		bag.clear();
		withdrawnLate = false;
		if (shown === 6) {
			if (prefersReducedMotion()) withdrawnLate = true;
			else bag.after(1400, () => (withdrawnLate = true));
		}
		return () => bag.clear();
	});

	const backboneDown = $derived(shown === 6 || shown === 7 || (shown === last && pulled));
	const withdrawn = $derived(
		(shown === 6 && withdrawnLate) || shown === 7 || (shown === last && pulled)
	);

	// ---------- the packet ----------
	type Pt = { x: number; y: number };
	const plan = $derived.by((): { seq: Pt[]; loop: boolean; lost: boolean } => {
		if (act === 1) {
			if (shown === 0) return { seq: [P.A, P.B, P.E], loop: true, lost: false };
			if (shown === 1) return { seq: [P.A, P.B], loop: true, lost: true };
			if (shown === 2) return { seq: [], loop: false, lost: false };
			return { seq: [P.A, P.C, P.D, P.E], loop: true, lost: false };
		}
		if (shown === 6) return { seq: [], loop: false, lost: false };
		if (withdrawn) return { seq: [PH, PROV], loop: true, lost: true };
		return { seq: [PH, PROV, GATE], loop: true, lost: false };
	});

	const tr = new Traveller();
	$effect(() => {
		const { seq, loop } = plan;
		tr.play(seq.length, { loop });
		return () => tr.stop();
	});
	const pkt = $derived(plan.seq.length ? plan.seq[Math.min(tr.at, plan.seq.length - 1)] : null);
	const lost = $derived(plan.lost && tr.ended);
	const onRoad = (a: Pt, b: Pt) => {
		const i = plan.seq.indexOf(a);
		return i >= 0 && plan.seq[i + 1] === b && i < tr.at;
	};
</script>

<div class="stage">
	<div class="actions">
		{#if shown === last}
			<button type="button" class="play" class:on={pulled} onclick={togglePull}>
				{pulled ? tx.backBtn : tx.pullBtn}
			</button>
		{/if}
	</div>

	<Guide
		steps={tx.steps}
		active={shown}
		onselect={(k) => (peek = k)}
		accent={act === 2 && withdrawn ? 'var(--color-danger)' : 'var(--color-brand)'}
	>
		{#snippet visual()}
			<svg viewBox="0 0 340 320" class="scene" role="img" aria-label={tx.title}>
				{#if act === 1}
					<g class="act">
						{#each LINKS as [a, b] (a + b)}
							{@const broken = cut && a === 'B' && b === 'E'}
							<line
								x1={P[a].x}
								y1={P[a].y}
								x2={P[b].x}
								y2={P[b].y}
								class="road"
								class:lit={onRoad(P[a], P[b])}
								class:broken
							/>
							{#if broken}
								{@const mx = (P.B.x + P.E.x) / 2}
								{@const my = (P.B.y + P.E.y) / 2}
								<g transform="translate({mx} {my})">
									<circle
										r="13"
										fill="var(--color-card)"
										stroke="var(--color-danger)"
										stroke-width="2"
									/>
									<path
										d="M-5 -5 L5 5 M5 -5 L-5 5"
										stroke="var(--color-danger)"
										stroke-width="2.4"
										stroke-linecap="round"
									/>
									<text y="-19" text-anchor="middle" class="bad-t">{tx.brokenTag}</text>
								</g>
							{/if}
						{/each}

						{#if talking}
							{#each Object.keys(P) as k, n (k)}
								<circle
									cx={P[k as R].x}
									cy={P[k as R].y}
									r="16"
									class="ripple"
									style="animation-delay: {n * 0.28}s"
								/>
							{/each}
						{/if}

						{#each Object.entries(P) as [k, p] (k)}
							<NgRouter
								x={p.x}
								y={p.y}
								lit={talking || (pkt !== null && pkt.x === p.x && pkt.y === p.y)}
							/>
						{/each}
						<!-- the two named routers, labels drawn with a paper halo so a road under them
						     never runs through the letters -->
						<text x={P.A.x} y={P.A.y + 27} text-anchor="middle" class="halo-lbl"
							>{tx.officeLabel}</text
						>
						<text x={P.E.x} y={P.E.y + 27} text-anchor="middle" class="halo-lbl">{tx.dcLabel}</text>
					</g>
				{:else}
					<g class="act">
						<!-- Facebook's own network, a building of servers joined by its backbone -->
						<rect x="198" y="22" width="138" height="212" rx="16" class="fb" />
						<text x="267" y="44" text-anchor="middle" class="fb-t">{tx.fbLabel}</text>
						<line
							x1={DNS.x}
							y1={DNS.y}
							x2={FDC.x}
							y2={FDC.y}
							class="road"
							class:broken={backboneDown}
						/>
						{#if backboneDown}
							<g transform="translate({(DNS.x + FDC.x) / 2} {(DNS.y + FDC.y) / 2})">
								<circle
									r="10"
									fill="var(--color-card)"
									stroke="var(--color-danger)"
									stroke-width="2"
								/>
								<path
									d="M-4 -4 L4 4 M4 -4 L-4 4"
									stroke="var(--color-danger)"
									stroke-width="2.2"
									stroke-linecap="round"
								/>
							</g>
						{/if}
						<NgServer x={DNS.x} y={DNS.y} label={tx.dnsLabel} lit={!withdrawn} />
						<NgServer x={FDC.x} y={FDC.y} label={tx.fbDcLabel} lit={!backboneDown} />

						<!-- roads from the phone to Facebook -->
						<line
							x1={PH.x}
							y1={PH.y}
							x2={PROV.x}
							y2={PROV.y}
							class="road"
							class:lit={onRoad(PH, PROV)}
						/>
						<line
							x1={PROV.x}
							y1={PROV.y}
							x2={GATE.x}
							y2={GATE.y}
							class="road"
							class:lit={onRoad(PROV, GATE)}
							class:faded={withdrawn}
						/>

						<NgPhone
							x={PH.x}
							y={PH.y}
							label={tx.phoneLabel}
							tone={lost ? 'var(--color-danger)' : 'var(--color-brand)'}
						/>
						<NgRouter x={PROV.x} y={PROV.y} label={tx.providerLabel} lit={!withdrawn} />
						<!-- Facebook's edge router, where the road from your provider comes in -->
						<NgRouter x={GATE.x} y={GATE.y} lit={!backboneDown} />

						<!-- the provider's map card, what it learned over BGP -->
						<g transform="translate(12 148)">
							<rect width="150" height="48" rx="10" class="map" class:gone={withdrawn} />
							<text x="10" y="17" class="map-h">{tx.mapTitle}</text>
							<text x="10" y="35" class="map-row" class:gone={withdrawn}>
								{withdrawn ? tx.mapGone : tx.mapKnown}
							</text>
						</g>

						<!-- the announcement travelling out of Facebook -->
						{#if !withdrawn}
							<g class="shout" class:still={shown === 6}>
								<rect x="-58" y="-11" width="116" height="22" rx="11" />
								<text y="4" text-anchor="middle">{tx.announce}</text>
							</g>
						{/if}
					</g>
				{/if}

				{#if pkt}
					<g
						class="packet"
						class:jump={tr.jump}
						class:gone={tr.hidden}
						class:dead={lost}
						style="transform: translate({pkt.x}px, {pkt.y - 32}px)"
					>
						<rect x="-12" y="-8" width="24" height="16" rx="3" class="env" />
						<path d="M-12 -7 L0 2 L12 -7" fill="none" class="flap" />
						{#if lost}
							<g class="lost-tag">
								<rect x="-30" y="-30" width="60" height="18" rx="9" />
								<text y="-17" text-anchor="middle">{act === 1 ? tx.brokenTag : tx.lostTag}</text>
							</g>
						{/if}
					</g>
				{/if}
			</svg>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.stage {
			padding-bottom: 1.5rem;
		}
	}
	.actions {
		display: flex;
		min-height: 38px;
		justify-content: center;
	}
	.play {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 8px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.08);
	}
	.play.on {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.scene {
		width: 100%;
		max-width: 400px;
		overflow: visible;
	}
	.act {
		animation: act-in 0.5s ease both;
	}
	@keyframes act-in {
		from {
			opacity: 0;
		}
	}
	.road {
		stroke: var(--color-line);
		stroke-width: 4;
		stroke-linecap: round;
		transition:
			stroke 0.4s,
			opacity 0.4s;
	}
	.road.lit {
		stroke: var(--color-brand);
	}
	.road.broken {
		stroke: var(--color-danger);
		opacity: 0.35;
	}
	.road.faded {
		opacity: 0.3;
	}
	.bad-t {
		fill: var(--color-danger);
		font-size: 10px;
		font-weight: 800;
	}
	.ripple {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		transform-box: fill-box;
		transform-origin: center;
		animation: ripple 2.2s ease-out infinite;
	}
	@keyframes ripple {
		from {
			transform: scale(0.8);
			opacity: 0.9;
		}
		to {
			transform: scale(3.2);
			opacity: 0;
		}
	}
	.halo-lbl {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
		paint-order: stroke;
		stroke: var(--color-paper);
		stroke-width: 5px;
		stroke-linejoin: round;
	}
	.fb {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.4;
	}
	.fb-t {
		fill: var(--color-brand);
		font-size: 12px;
		font-weight: 800;
	}
	.map {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.4;
		transition: stroke 0.4s;
	}
	.map.gone {
		stroke: var(--color-danger);
	}
	.map-h {
		fill: var(--color-faint);
		font-size: 9px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.map-row {
		fill: var(--color-grass);
		font-size: 10.5px;
		font-weight: 700;
	}
	.map-row.gone {
		fill: var(--color-danger);
	}
	.shout {
		animation: shout 3.2s ease-in-out infinite;
	}
	.shout.still {
		animation: none;
		transform: translate(226px, 152px);
	}
	.shout rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.2;
	}
	.shout text {
		fill: var(--color-grass);
		font-size: 9.5px;
		font-weight: 800;
	}
	@keyframes shout {
		0% {
			transform: translate(226px, 152px);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		70% {
			transform: translate(87px, 126px);
			opacity: 1;
		}
		100% {
			transform: translate(87px, 126px);
			opacity: 0;
		}
	}
	.packet {
		transition:
			transform 0.85s cubic-bezier(0.45, 0, 0.25, 1),
			opacity 0.25s;
	}
	.packet.jump {
		transition: opacity 0.25s;
	}
	.packet.gone {
		opacity: 0;
	}
	.env {
		fill: var(--color-brand);
		transition: fill 0.3s;
	}
	.flap {
		stroke: var(--color-card);
		stroke-width: 1.6;
	}
	.packet.dead .env {
		fill: var(--color-danger);
	}
	.lost-tag rect {
		fill: var(--color-danger-soft);
	}
	.lost-tag text {
		fill: var(--color-danger);
		font-size: 9.5px;
		font-weight: 800;
	}
	@media (prefers-reduced-motion: reduce) {
		.act,
		.ripple,
		.shout {
			animation: none;
		}
		.ripple {
			opacity: 0.6;
			transform: scale(1.8);
		}
		.shout {
			transform: translate(87px, 126px);
		}
		.packet,
		.road {
			transition: none;
		}
	}
</style>
