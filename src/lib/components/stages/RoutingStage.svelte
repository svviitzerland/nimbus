<script lang="ts">
	// Guided routing lesson. A packet travels by itself from your laptop, through a chain of
	// routers, to the nimbus.com server, while Nim tells the story beat by beat. Signposts stand
	// in for routing tables. The only (optional) play is knocking one signpost over on the last
	// beat to watch a packet get dropped.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import NgRouter from './netguide/NgRouter.svelte';
	import NgLaptop from './netguide/NgLaptop.svelte';
	import NgServer from './netguide/NgServer.svelte';
	import { Traveller } from './netguide/traveller.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RoutingText } from '$lib/chapters/network/routing/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RoutingText);

	onMount(() => {
		// Watch first, play optional, so the stage is visible from the start and Next never locks.
		onshow?.(true);
		oncomplete?.();
	});

	type NodeId = 'lap' | 'R1' | 'R2' | 'R3' | 'srv';
	const POS: Record<NodeId, { x: number; y: number }> = {
		lap: { x: 50, y: 50 },
		R1: { x: 50, y: 152 },
		R2: { x: 172, y: 152 },
		R3: { x: 292, y: 152 },
		srv: { x: 292, y: 258 }
	};
	const OTHER = { x: 292, y: 56 };
	const FULL: NodeId[] = ['lap', 'R1', 'R2', 'R3', 'srv'];
	const TO_ISP: NodeId[] = ['lap', 'R1', 'R2'];

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const shown = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let knocked = $state(false);
	function toggleSign() {
		knocked = !knocked;
		onstate?.(knocked ? 'knocked' : 'fixed');
	}

	// What the packet does on each step, a path to follow, whether it loops, and whether it is
	// dropped at the end of the path.
	const plan = $derived.by(() => {
		const s = shown;
		if (s === 0) return { seq: ['lap'] as NodeId[], loop: false, drop: false };
		if (s === 1) return { seq: ['lap', 'R1'] as NodeId[], loop: true, drop: false };
		if (s === 2 || s === 3) return { seq: TO_ISP, loop: false, drop: false };
		if (s === 6) return { seq: TO_ISP, loop: true, drop: false };
		if (s === last && knocked) return { seq: TO_ISP, loop: true, drop: true };
		return { seq: FULL, loop: true, drop: false };
	});

	const tr = new Traveller();
	$effect(() => {
		const { seq, loop } = plan;
		tr.play(seq.length, { loop });
		return () => tr.stop();
	});
	const at = $derived(tr.at);
	const dropped = $derived(plan.drop && tr.ended);

	const here = $derived(plan.seq[Math.min(at, plan.seq.length - 1)]);
	const pkt = $derived(POS[here]);
	const travelled = (a: NodeId, b: NodeId) => {
		const i = plan.seq.indexOf(a);
		return i >= 0 && plan.seq[i + 1] === b && i < at;
	};
	const ROADS: [NodeId, NodeId][] = [
		['lap', 'R1'],
		['R1', 'R2'],
		['R2', 'R3'],
		['R3', 'srv']
	];

	const signR2Lit = $derived(shown === 3 || shown === 4 || shown === 5);
	const signR1Lit = $derived(shown === 6);
</script>

<div class="stage">
	<div class="actions">
		{#if shown === last}
			<button type="button" class="play" class:on={knocked} onclick={toggleSign}>
				{knocked ? tx.fixBtn : tx.knockBtn}
			</button>
		{/if}
	</div>

	<Guide steps={tx.steps} active={shown} onselect={(k) => (peek = k)}>
		{#snippet visual()}
			<svg viewBox="0 0 340 320" class="scene" role="img" aria-label={tx.title}>
				<!-- roads -->
				<line
					x1={POS.R2.x}
					y1={POS.R2.y}
					x2={OTHER.x}
					y2={OTHER.y}
					class="road"
					class:lit={shown === 3 && !knocked}
				/>
				{#each ROADS as [a, b] (a + b)}
					<!-- roads leaving downward start under the node's label, so no line crosses text -->
					<line
						x1={POS[a].x}
						y1={a === 'lap' || a === 'R3' ? POS[a].y + 35 : POS[a].y}
						x2={POS[b].x}
						y2={POS[b].y}
						class="road"
						class:lit={travelled(a, b)}
					/>
				{/each}

				<!-- other networks, a soft cloud -->
				<g transform="translate({OTHER.x} {OTHER.y})">
					<path
						d="M-26 10 a12 12 0 0 1 2 -23 a16 16 0 0 1 29 -6 a12 12 0 0 1 21 13 a10 10 0 0 1 0 16 Z"
						fill="var(--color-card)"
						stroke="var(--color-line)"
						stroke-width="1.6"
					/>
					<text y="-28" text-anchor="middle" class="lbl">{tx.otherLabel}</text>
				</g>

				<NgLaptop x={POS.lap.x} y={POS.lap.y} label={tx.laptopLabel} lit={here === 'lap'} />
				<NgRouter x={POS.R1.x} y={POS.R1.y} label={tx.homeRouter} lit={here === 'R1'} />
				<NgRouter x={POS.R2.x} y={POS.R2.y} label={tx.ispRouter} lit={here === 'R2'} />
				<NgRouter x={POS.R3.x} y={POS.R3.y} label={tx.nextRouter} lit={here === 'R3'} />
				<NgServer
					x={POS.srv.x}
					y={POS.srv.y}
					label={tx.serverLabel}
					sub={tx.serverSub}
					lit={here === 'srv'}
				/>

				<!-- the home router's signpost, one arm, the default route -->
				<g class="sign" class:focus={signR1Lit} transform="translate(34 210)">
					<rect x="-2" y="0" width="4" height="62" rx="2" fill="var(--color-faint)" />
					<path d="M0 30 H82 L92 40 L82 50 H0 Z" class="plank" class:hot={signR1Lit} />
					<text x="42" y="44" text-anchor="middle" class="plank-t">{tx.signDefault}</text>
				</g>

				<!-- the provider router's signpost, two arms. The tilted arm points up toward the other
				     networks and sits above the flat one, so the two never cross. -->
				<g transform="translate(156 210)">
					<g class="sign" class:fallen={knocked} class:focus={signR2Lit}>
						<rect x="-2" y="0" width="4" height="62" rx="2" fill="var(--color-faint)" />
						<g transform="rotate(-20 0 10)">
							<path d="M0 2 H58 L67 11 L58 20 H0 Z" class="plank" />
							<text x="30" y="15" text-anchor="middle" class="plank-t">{tx.signOther}</text>
						</g>
						<path d="M0 30 H74 L84 40 L74 50 H0 Z" class="plank" class:hot={signR2Lit} />
						<text x="38" y="44" text-anchor="middle" class="plank-t">{tx.signNimbus}</text>
					</g>
				</g>

				<!-- the packet, an envelope with its address -->
				<g
					class="packet"
					class:jump={tr.jump}
					class:gone={tr.hidden}
					class:dead={dropped}
					style="transform: translate({pkt.x}px, {pkt.y - 34}px)"
				>
					<rect x="-14" y="-9" width="28" height="18" rx="3" class="env" />
					<path d="M-14 -8 L0 2 L14 -8" fill="none" class="flap" />
					{#if shown === 2}
						<g class="callout">
							<rect x="18" y="-12" width="96" height="22" rx="11" />
							<text x="66" y="3" text-anchor="middle">{tx.packetTo}</text>
						</g>
					{/if}
					{#if dropped}
						<g class="drop-tag">
							<rect x="-30" y="-32" width="60" height="18" rx="9" />
							<text x="0" y="-19" text-anchor="middle">{tx.droppedTag}</text>
						</g>
					{/if}
				</g>
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
	.road {
		stroke: var(--color-line);
		stroke-width: 4;
		stroke-linecap: round;
		transition: stroke 0.4s;
	}
	.road.lit {
		stroke: var(--color-brand);
	}
	.lbl {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
	.sign {
		transform-box: fill-box;
		transform-origin: 0 100%;
		transition:
			transform 0.6s cubic-bezier(0.3, 1.4, 0.5, 1),
			opacity 0.4s;
		opacity: 0.75;
	}
	.sign.focus {
		opacity: 1;
	}
	.sign.fallen {
		transform: rotate(78deg);
		opacity: 0.45;
	}
	.plank {
		fill: var(--color-card);
		stroke: var(--color-amber);
		stroke-width: 1.6;
		transition: fill 0.3s;
	}
	.plank.hot {
		fill: var(--color-amber-soft);
	}
	.plank-t {
		fill: var(--color-ink);
		font-size: 9.5px;
		font-weight: 700;
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
	.callout rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.2;
	}
	.callout text {
		fill: var(--color-brand);
		font-size: 10px;
		font-weight: 800;
	}
	.drop-tag rect {
		fill: var(--color-danger-soft);
	}
	.drop-tag text {
		fill: var(--color-danger);
		font-size: 9.5px;
		font-weight: 800;
	}
	@media (prefers-reduced-motion: reduce) {
		.packet,
		.sign,
		.road {
			transition: none;
		}
	}
</style>
