<script lang="ts">
	// Guided: a house plan seen from above, the router in the living room sending out rings of
	// radio. Long 2.4 GHz rings pass the walls, short 5 GHz rings stop at them, and a phone shows
	// both bands on a little meter. A beat on channels shows two routers sharing a lane. On the
	// last beat the learner may tap a room to carry the phone there.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { WifiText } from '$lib/chapters/network/wifi/types';
	import Guide from '$lib/components/Guide.svelte';
	import Thing from './netguide/Thing.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as WifiText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	const last = $derived(tx.intro.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const isLast = $derived(beat >= last);
	const TRY = 6;
	const LANES = 4;

	// living room, kitchen, study, bedroom, garden
	const ROOMS = [
		{ x: 24, y: 24, w: 146, h: 98, px: 136, py: 96, walls: 0 },
		{ x: 170, y: 24, w: 154, h: 98, px: 247, py: 76, walls: 1 },
		{ x: 24, y: 122, w: 146, h: 98, px: 97, py: 178, walls: 1 },
		{ x: 170, y: 122, w: 154, h: 98, px: 247, py: 178, walls: 2 },
		{ x: 324, y: 24, w: 100, h: 196, px: 374, py: 130, walls: 3 }
	];
	const S24 = [4, 3, 3, 2, 1];
	const S5 = [4, 2, 0, 0, 0];
	const STEP_ROOM = [0, 3, 3, 3, 0, 0];
	let room = $state(3);
	const roomOf = (s: number) => (s === TRY ? room : (STEP_ROOM[s] ?? 0));

	function go(k: number) {
		if (!isLast) return;
		room = k;
		peek = null;
		const w = ROOMS[k].walls;
		onstate?.(w === 0 ? 'near' : w === 1 ? 'mid' : 'far');
	}

	// the channel beat: your router hops between lane 6 (shared) and lane 11 (its own)
	let mine = $state<6 | 11>(6);
	$effect(() => {
		if (active !== LANES) {
			mine = 6;
			return;
		}
		if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
			return;
		const id = setInterval(() => (mine = mine === 6 ? 11 : 6), 2600);
		return () => clearInterval(id);
	});
	const LANE_X: Record<number, number> = { 1: 110, 6: 220, 11: 330 };
	const hump = (cx: number) => `M ${cx - 56} 286 Q ${cx} 222 ${cx + 56} 286`;
</script>

<div class="wrap">
	<p class="tryrow" class:show={isLast} aria-hidden={!isLast}>{tx.tapHint}</p>

	<Guide steps={tx.steps} {active} onselect={(k) => (peek = k)}>
		{#snippet visual(s)}
			{@const r = ROOMS[roomOf(s)]}
			{@const k = roomOf(s)}
			{@const show24 = s !== 2}
			{@const show5 = s === 2 || s === 3 || s === 5 || s === TRY}
			<svg viewBox="0 0 440 304" class="art" role="img" aria-label={tx.title}>
				<defs>
					<clipPath id="wifi-five"><rect x="24" y="24" width="176" height="128" /></clipPath>
				</defs>

				<!-- the plan: garden outside, four rooms inside -->
				<rect class="garden" x="324" y="24" width="100" height="196" rx="4" />
				{#each ROOMS as rm, i (i)}
					<g
						class="room"
						class:tap={s === TRY}
						class:here={s === TRY && i === k}
						role="button"
						tabindex={s === TRY ? 0 : -1}
						aria-label={tx.rooms[i]}
						onclick={() => go(i)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								go(i);
							}
						}}
					>
						<rect class="floor" class:out={i === 4} x={rm.x} y={rm.y} width={rm.w} height={rm.h} />
					</g>
				{/each}
				<rect class="walls" x="24" y="24" width="300" height="196" rx="3" />
				<line class="walls" x1="170" y1="24" x2="170" y2="220" />
				<line class="walls" x1="24" y1="122" x2="324" y2="122" />

				<!-- the cable that leaves the house, WiFi is only the last hop -->
				<g class="out" class:hi={s === 5}>
					<line x1="78" y1="62" x2="78" y2="2" />
					<text class="outlbl" class:show={s === 5} x="88" y="13">{tx.toInternet}</text>
				</g>

				<!-- radio rings -->
				<g class="rings">
					{#if show24}
						{#each [0, 1, 2] as n (n)}
							<circle
								class="r24 ring"
								class:plain={s === 0}
								cx="78"
								cy="70"
								r="12"
								style="animation-delay: {n * 1.3}s"
							/>
						{/each}
					{/if}
					{#if show5}
						<g clip-path="url(#wifi-five)">
							{#each [0, 1, 2] as n (n)}
								<circle
									class="r5 ring"
									cx="78"
									cy="70"
									r="12"
									style="animation-delay: {n * 0.8}s"
								/>
							{/each}
						</g>
					{/if}
				</g>

				<!-- room names drawn above the cable and the rings, with a halo so neither crosses them -->
				{#each ROOMS as rm, i (i)}
					<text class="rname" class:halo={i < 4} x={rm.x + 9} y={rm.y + 17}>{tx.rooms[i]}</text>
				{/each}

				<Thing kind="router" x={78} y={74} />
				<text class="lbl halo" x="78" y="100">{tx.routerLabel}</text>

				<!-- the neighbour, on the channel beat -->
				<g class="fade" class:gone={s !== LANES}>
					<Thing kind="router" x={374} y={84} s={0.8} />
					<text class="lbl" x="374" y="108">{tx.neighbourLabel}</text>
				</g>

				<!-- the phone, it walks from room to room -->
				<g class="mover" style="transform: translate({r.px}px, {r.py}px)">
					<Thing kind="phone" s={0.85} />
				</g>

				<!-- bottom: either the signal meter or the channel lanes -->
				{#if s === LANES}
					<g class="lanes">
						<text class="lanelbl" x="40" y="244">{tx.laneLabel}</text>
						<line class="axis" x1="44" y1="286" x2="396" y2="286" />
						{#each [1, 6, 11] as ch (ch)}
							<path class="lane" d={hump(LANE_X[ch])} />
							<text class="ch" x={LANE_X[ch]} y="301">{ch}</text>
						{/each}
						<path class="hump theirs" d={hump(220)} />
						<g class="mine" style="transform: translateX({mine === 6 ? 0 : 110}px)">
							<path class="hump yours" d={hump(220)} />
						</g>
						<g class="lanetag" class:bad={mine === 6}>
							<rect x={LANE_X[mine] - 46} y="232" width="92" height="19" rx="9.5" />
							<text x={LANE_X[mine]} y="245">{mine === 6 ? tx.clashTag : tx.clearTag}</text>
						</g>
					</g>
				{:else if s !== 0}
					{@const a = S24[k]}
					{@const b = S5[k]}
					<g class="meter">
						{#each [{ name: tx.bands.b24, v: a, cls: 'b24', y: 252, dim: s === 2 }, { name: tx.bands.b5, v: b, cls: 'b5', y: 282, dim: s === 1 }] as row (row.cls)}
							<g class:dimrow={row.dim}>
								<text class="band {row.cls}" x="190" y={row.y}>{row.name}</text>
								{#each [0, 1, 2, 3] as i (i)}
									<rect
										class="bar {row.cls}"
										class:lit={i < row.v}
										x={206 + i * 10}
										y={row.y - 4 - i * 4}
										width="6"
										height={8 + i * 4}
										rx="1.5"
									/>
								{/each}
								{#if row.v === 0}
									<text class="none" x="252" y={row.y}>{tx.noSignal}</text>
								{/if}
							</g>
						{/each}
					</g>
				{/if}
			</svg>
		{/snippet}
	</Guide>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-bottom: 1rem;
		}
	}
	.tryrow {
		display: flex;
		min-height: 40px;
		align-items: center;
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.tryrow.show {
		visibility: visible;
		opacity: 1;
	}
	.art {
		width: 100%;
		max-width: 480px;
		height: auto;
		overflow: visible;
	}
	.garden {
		fill: var(--color-grass-soft);
	}
	.floor {
		fill: var(--color-card);
		transition: fill 0.25s;
	}
	.floor.out {
		fill: transparent;
	}
	.room {
		outline: none;
	}
	.room.tap {
		cursor: pointer;
	}
	.room.tap:hover .floor,
	.room.tap:focus-visible .floor,
	.room.here .floor {
		fill: var(--color-brand-soft);
	}
	.rname {
		fill: var(--color-faint);
		font-size: 11px;
		font-weight: 600;
		pointer-events: none;
	}
	.rname.halo,
	.lbl.halo {
		paint-order: stroke;
		stroke: var(--color-card);
		stroke-width: 4px;
		stroke-linejoin: round;
	}
	.walls {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 4;
		stroke-linecap: round;
		pointer-events: none;
	}
	.lbl {
		fill: var(--color-faint);
		font-size: 11px;
		font-weight: 600;
		text-anchor: middle;
		pointer-events: none;
	}
	.out line {
		stroke: var(--color-muted);
		stroke-width: 2;
		opacity: 0.5;
		transition: stroke 0.3s;
	}
	.out.hi line {
		stroke: var(--color-brand);
		stroke-width: 3;
		opacity: 1;
	}
	.outlbl {
		fill: var(--color-brand);
		font-size: 11.5px;
		font-weight: 700;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.outlbl.show {
		opacity: 1;
	}
	.rings,
	.mover,
	.fade,
	.meter,
	.lanes {
		pointer-events: none;
	}
	.ring {
		fill: none;
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
		transform-box: fill-box;
		transform-origin: center;
		opacity: 0;
	}
	.ring.r24 {
		stroke: var(--color-amber);
		animation: grow-far 3.9s linear infinite;
	}
	.ring.r24.plain {
		stroke: var(--color-muted);
	}
	.ring.r5 {
		stroke: var(--color-brand);
		stroke-width: 2.4;
		animation: grow-near 2.4s linear infinite;
	}
	@keyframes grow-far {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		100% {
			transform: scale(28);
			opacity: 0;
		}
	}
	@keyframes grow-near {
		0% {
			transform: scale(1);
			opacity: 0.9;
		}
		100% {
			transform: scale(12);
			opacity: 0;
		}
	}
	.mover {
		transition: transform 0.9s cubic-bezier(0.45, 0, 0.2, 1);
	}
	.fade {
		transition: opacity 0.5s ease;
	}
	.fade.gone {
		opacity: 0;
	}
	.band {
		font-size: 12px;
		font-weight: 700;
		text-anchor: end;
	}
	.band.b24 {
		fill: var(--color-amber);
	}
	.band.b5 {
		fill: var(--color-brand);
	}
	.bar {
		fill: var(--color-line);
		transition: fill 0.4s;
	}
	.bar.b24.lit {
		fill: var(--color-amber);
	}
	.bar.b5.lit {
		fill: var(--color-brand);
	}
	.dimrow {
		opacity: 0.35;
	}
	.none {
		fill: var(--color-danger);
		font-size: 11px;
		font-weight: 700;
	}
	.lanelbl {
		fill: var(--color-muted);
		font-size: 11.5px;
		font-weight: 700;
	}
	.axis {
		stroke: var(--color-faint);
		stroke-width: 1.4;
	}
	.lane {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.6;
	}
	.ch {
		fill: var(--color-faint);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.hump.theirs {
		fill: color-mix(in srgb, var(--color-amber) 30%, transparent);
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.hump.yours {
		fill: color-mix(in srgb, var(--color-brand) 30%, transparent);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.mine {
		transition: transform 0.9s cubic-bezier(0.45, 0, 0.2, 1);
	}
	.lanetag rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.2;
		transition: x 0.9s;
	}
	.lanetag text {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.lanetag.bad rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.lanetag.bad text {
		fill: var(--color-danger);
	}
	@media (prefers-reduced-motion: reduce) {
		.tryrow,
		.floor,
		.out line,
		.outlbl,
		.mover,
		.fade,
		.bar,
		.mine,
		.lanetag rect {
			transition: none;
		}
		.ring {
			animation: none !important;
			opacity: 0.5;
		}
		.ring.r24 {
			transform: scale(9);
		}
		.ring.r5 {
			transform: scale(5);
		}
	}
</style>
