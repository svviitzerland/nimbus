<script lang="ts">
	// Guided VLAN lesson. One office switch with five devices under it. The ports take on two
	// colours (finance blue, guests orange) as Nim talks, and packets travel by themselves to show
	// who can reach whom. The only (optional) play is painting one guest port blue on the last beat.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import NgRouter from './netguide/NgRouter.svelte';
	import NgLaptop from './netguide/NgLaptop.svelte';
	import NgServer from './netguide/NgServer.svelte';
	import { Traveller } from './netguide/traveller.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { VlanText } from '$lib/chapters/network/vlan/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as VlanText);

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

	let painted = $state(false);
	function togglePaint() {
		painted = !painted;
		onstate?.(painted ? 'joined' : 'left');
	}

	// Devices, left to right. Two finance laptops, the payroll server, two guest laptops.
	const XS = [40, 104, 168, 236, 300];
	const DEV_Y = 250;
	const PORT_Y = 128;
	const PAYROLL = 2;
	const ROUTER = { x: 168, y: 40 };
	const dev = (i: number) => ({ x: XS[i], y: DEV_Y - 26 });
	const port = (i: number) => ({ x: XS[i], y: PORT_Y });

	type Vlan = 'none' | 'fin' | 'guest';
	const split = $derived(shown >= 2);
	const vlanOf = (i: number): Vlan => {
		if (!split) return 'none';
		if (i === 3 && shown === last && painted) return 'fin';
		return i <= PAYROLL ? 'fin' : 'guest';
	};
	const TONE: Record<Vlan, string> = {
		none: 'var(--color-faint)',
		fin: 'var(--color-brand)',
		guest: 'var(--color-amber)'
	};

	type Pt = { x: number; y: number };
	const plan = $derived.by(
		(): { seq: Pt[]; from: number; outcome: 'ok' | 'leak' | 'blocked' | 'routed' } => {
			const guestToPayroll = [dev(3), port(3), port(PAYROLL), dev(PAYROLL)];
			const guestStops = [dev(3), port(3)];
			const financeToPayroll = [dev(0), port(0), port(PAYROLL), dev(PAYROLL)];
			if (shown === 0 || shown === 2) return { seq: [], from: 0, outcome: 'ok' };
			if (shown === 1) return { seq: guestToPayroll, from: 3, outcome: 'leak' };
			if (shown === 3 || shown === 7) return { seq: financeToPayroll, from: 0, outcome: 'ok' };
			if (shown === 6)
				return {
					seq: [dev(3), port(3), ROUTER, port(PAYROLL), dev(PAYROLL)],
					from: 3,
					outcome: 'routed'
				};
			if (shown === last && painted) return { seq: guestToPayroll, from: 3, outcome: 'leak' };
			return { seq: guestStops, from: 3, outcome: 'blocked' };
		}
	);

	const tr = new Traveller();
	$effect(() => {
		const { seq } = plan;
		tr.play(seq.length, { loop: true });
		return () => tr.stop();
	});
	const pkt = $derived(plan.seq.length ? plan.seq[Math.min(tr.at, plan.seq.length - 1)] : null);
	const blocked = $derived(plan.outcome === 'blocked' && tr.ended);
	const arrived = $derived(plan.outcome !== 'blocked' && tr.ended && plan.seq.length > 0);
	const atRouter = $derived(pkt === ROUTER);
	const pktTone = $derived(TONE[vlanOf(plan.from)]);
	const payrollTone = $derived(
		arrived && plan.outcome === 'leak' ? 'var(--color-danger)' : 'var(--color-grass)'
	);
</script>

<div class="stage">
	<div class="actions">
		{#if shown === last}
			<button type="button" class="play" class:on={painted} onclick={togglePaint}>
				{painted ? tx.unpaintBtn : tx.paintBtn}
			</button>
		{/if}
	</div>

	<Guide steps={tx.steps} active={shown} onselect={(k) => (peek = k)}>
		{#snippet visual()}
			<svg viewBox="0 0 340 320" class="scene" role="img" aria-label={tx.title}>
				<!-- the two coloured rooms, drawn softly behind the devices -->
				<g class="rooms" class:on={split}>
					<rect x="10" y="212" width="190" height="104" rx="16" class="room fin" />
					<rect x="206" y="212" width="126" height="104" rx="16" class="room guest" />
					<text x="105" y="308" text-anchor="middle" class="room-t fin">{tx.financeTag}</text>
					<text x="269" y="308" text-anchor="middle" class="room-t guest">{tx.guestTag}</text>
				</g>

				<!-- the router, only when traffic must cross between rooms -->
				{#if shown === 6}
					<g class="appear">
						<!-- the uplink starts under the router's name, so the line never crosses the text -->
						<line x1={ROUTER.x} y1={ROUTER.y + 36} x2={ROUTER.x} y2="94" class="cable" />
						<NgRouter x={ROUTER.x} y={ROUTER.y} label={tx.routerLabel} lit={atRouter} />
						{#if atRouter}
							<g class="tag ok">
								<rect x={ROUTER.x + 30} y={ROUTER.y - 10} width="58" height="18" rx="9" />
								<text x={ROUTER.x + 59} y={ROUTER.y + 3} text-anchor="middle">{tx.checkedTag}</text>
							</g>
						{/if}
					</g>
				{/if}

				<!-- cables from each port down to its device -->
				{#each XS as x, i (i)}
					<line
						x1={x}
						y1={PORT_Y + 6}
						x2={x}
						y2={DEV_Y - (i === PAYROLL ? 24 : 18)}
						class="cable"
						style="stroke: {TONE[vlanOf(i)]}; transition-delay: {split ? i * 0.22 : 0}s"
					/>
				{/each}

				<!-- the switch -->
				<rect x="18" y="94" width="304" height="50" rx="10" class="switch" />
				<text x="32" y="111" class="sw-t">{tx.switchLabel}</text>
				{#each XS as x, i (i)}
					<rect
						x={x - 9}
						y={PORT_Y - 6}
						width="18"
						height="12"
						rx="2.5"
						class="port"
						style="fill: {TONE[vlanOf(i)]}; transition-delay: {split ? i * 0.22 : 0}s"
					/>
				{/each}
				{#if blocked}
					<rect x="199" y="100" width="5" height="38" rx="2.5" class="wall" />
				{/if}

				<!-- devices -->
				{#each XS as x, i (i)}
					{#if i === PAYROLL}
						<NgServer {x} y={DEV_Y} label={tx.payrollLabel} lit={arrived} tone={payrollTone} />
					{:else}
						<NgLaptop
							{x}
							y={DEV_Y}
							tone={TONE[vlanOf(i)]}
							lit={plan.from === i && plan.seq.length > 0}
						/>
					{/if}
				{/each}

				<!-- the packet -->
				{#if pkt}
					<g
						class="packet"
						class:jump={tr.jump}
						class:gone={tr.hidden}
						style="transform: translate({pkt.x}px, {pkt.y - 14}px)"
					>
						<rect x="-9" y="-7" width="18" height="14" rx="3" style="fill: {pktTone}" />
						{#if blocked}
							<g class="tag bad">
								<rect x="-30" y="-30" width="60" height="18" rx="9" />
								<text y="-17" text-anchor="middle">{tx.blockedTag}</text>
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
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.scene {
		width: 100%;
		max-width: 400px;
		overflow: visible;
	}
	.rooms {
		opacity: 0;
		transition: opacity 0.8s 0.9s;
	}
	.rooms.on {
		opacity: 1;
	}
	.room.fin {
		fill: var(--color-brand-soft);
	}
	.room.guest {
		fill: var(--color-amber-soft);
	}
	.room-t {
		font-size: 10px;
		font-weight: 800;
	}
	.room-t.fin {
		fill: var(--color-brand);
	}
	.room-t.guest {
		fill: var(--color-amber);
	}
	.cable {
		stroke: var(--color-faint);
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke 0.5s;
	}
	.switch {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.6;
	}
	.sw-t {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
	}
	.port {
		transition: fill 0.5s;
	}
	.wall {
		fill: var(--color-danger);
	}
	.appear {
		animation: appear 0.5s ease both;
	}
	@keyframes appear {
		from {
			opacity: 0;
		}
	}
	.tag text {
		font-size: 9.5px;
		font-weight: 800;
	}
	.tag.bad rect {
		fill: var(--color-danger-soft);
	}
	.tag.bad text {
		fill: var(--color-danger);
	}
	.tag.ok rect {
		fill: var(--color-grass-soft);
	}
	.tag.ok text {
		fill: var(--color-grass);
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
	@media (prefers-reduced-motion: reduce) {
		.rooms,
		.cable,
		.port,
		.packet {
			transition: none;
		}
		.appear {
			animation: none;
		}
	}
</style>
