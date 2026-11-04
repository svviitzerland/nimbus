<script lang="ts">
	// Guided: one map with a camera. The room (LAN) sits inside the head office, the head office
	// sits in the city (WAN), and the city sits among the world's networks (the internet). Each
	// beat moves the camera out one level; on the last beat the learner may fly around.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { LanWanLevel, LanWanText } from '$lib/chapters/network/lan-wan/types';
	import Guide from '$lib/components/Guide.svelte';
	import Thing from './netguide/Thing.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as LanWanText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	const last = $derived(tx.intro.length - 1);
	let peek = $state<number | null>(null);
	let picked = $state<LanWanLevel | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const isLast = $derived(beat >= last);

	const STEP_LEVEL: LanWanLevel[] = ['lan', 'lan', 'wan', 'net', 'net', 'net', 'net'];
	const levelOf = (s: number): LanWanLevel =>
		s === STEP_LEVEL.length - 1 && picked ? picked : (STEP_LEVEL[s] ?? 'net');
	const ZOOM: Record<LanWanLevel, number> = { lan: 12, wan: 3, net: 1 };
	const LEVELS: LanWanLevel[] = ['lan', 'wan', 'net'];

	function fly(l: LanWanLevel) {
		picked = l;
		peek = null;
		onstate?.(l === 'net' ? 'internet' : l);
	}

	// the city, drawn in its own 400 by 300 space
	const BRANCHES = [
		{ x: 62, y: 58 },
		{ x: 338, y: 58 },
		{ x: 62, y: 242 },
		{ x: 338, y: 242 }
	];
	// the world's networks, the first (centre) one is your company
	const NETS = [
		{ x: 200, y: 150, rx: 84, ry: 64 },
		{ x: 66, y: 44, rx: 58, ry: 26 },
		{ x: 334, y: 44, rx: 58, ry: 26 },
		{ x: 200, y: 26, rx: 50, ry: 18 },
		{ x: 62, y: 256, rx: 58, ry: 26 },
		{ x: 338, y: 256, rx: 58, ry: 26 }
	];
	const LINKS: [number, number][] = [
		[0, 1],
		[0, 2],
		[0, 4],
		[0, 5],
		[1, 3],
		[3, 2],
		[1, 4],
		[2, 5],
		[4, 5]
	];
</script>

<div class="wrap">
	<div class="tryrow" class:show={isLast} aria-hidden={!isLast}>
		<span class="trylabel">{tx.zoomLabel}</span>
		<div class="trybtns">
			{#each LEVELS as l (l)}
				<button
					type="button"
					class="try"
					class:on={isLast && levelOf(active) === l}
					disabled={!isLast}
					onclick={() => fly(l)}>{tx.levels[l]}</button
				>
			{/each}
		</div>
	</div>

	<Guide steps={tx.steps} {active} onselect={(k) => (peek = k)}>
		{#snippet visual(s)}
			{@const lvl = levelOf(s)}
			{@const z = ZOOM[lvl]}
			<svg viewBox="0 0 400 300" class="art lvl-{lvl}" role="img" aria-label={tx.title}>
				<defs>
					<clipPath id="lanwan-frame"><rect width="400" height="300" rx="18" /></clipPath>
				</defs>
				<g clip-path="url(#lanwan-frame)">
					<rect class="sky" width="400" height="300" />
					<g
						class="cam"
						style="transform: translate(200px, 150px) scale({z}) translate(-200px, -150px)"
					>
						<!-- the world: networks joined to each other -->
						<g class="world layer">
							{#each LINKS as [a, b] (`${a}-${b}`)}
								<line class="link" x1={NETS[a].x} y1={NETS[a].y} x2={NETS[b].x} y2={NETS[b].y} />
							{/each}
							{#each NETS as nt, k (k)}
								<ellipse
									class="net"
									class:mine={k === 0}
									cx={nt.x}
									cy={nt.y}
									rx={nt.rx}
									ry={nt.ry}
								/>
								{#if k > 0}
									<text class="wlbl" x={nt.x} y={nt.y + 4}>{tx.nets[k]}</text>
								{/if}
							{/each}
							<text class="wlbl mine" x="200" y="230">{tx.nets[0]}</text>
							<circle class="pkt w1" r="4" />
							<circle class="pkt w2" r="4" />
						</g>

						<!-- the city: offices linked by long rented lines -->
						<g class="city layer" transform="translate(133.333 100) scale(0.333333)">
							{#each BRANCHES as b, k (k)}
								<path class="line" d="M200 150 Q {(200 + b.x) / 2} {b.y + 30} {b.x} {b.y}" />
							{/each}
							{#each BRANCHES as b, k (k)}
								<g transform="translate({b.x} {b.y})">
									<rect class="bld" x="-34" y="-26" width="68" height="52" rx="4" />
									{#each [-18, 0, 18] as wx (wx)}
										<rect class="win" x={wx - 5} y="-14" width="10" height="9" rx="1.5" />
										<rect class="win" x={wx - 5} y="2" width="10" height="9" rx="1.5" />
									{/each}
									<text class="clbl" y="44">{tx.branchLabel.replace('{n}', String(k + 1))}</text>
								</g>
							{/each}
							<rect class="bld hq" x="150" y="112.5" width="100" height="75" rx="4" />
							<text class="clbl" x="200" y="206">{tx.hqLabel}</text>
							<circle class="pkt c1" r="5" />
							<circle class="pkt c2" r="5" />

							<!-- the room: one LAN, inside the head office -->
							<g class="room" transform="translate(150 112.5) scale(0.25)">
								<rect class="floor" x="8" y="8" width="384" height="284" rx="14" />
								{#each [[80, 72], [320, 72], [80, 228], [320, 228]] as [dx, dy] (`${dx}${dy}`)}
									<line class="cable" x1={dx} y1={dy} x2="200" y2="150" />
								{/each}
								<Thing kind="switch" x={200} y={150} s={1.6} hi={s <= 1} />
								<Thing kind="laptop" x={80} y={72} s={1.4} />
								<Thing kind="pc" x={320} y={72} s={1.4} dim={s === 0} />
								<Thing kind="laptop" x={80} y={228} s={1.4} dim={s === 0} />
								<Thing kind="pc" x={320} y={228} s={1.4} />
								<text class="rlbl" x="200" y="186">{tx.switchLabel}</text>
								<circle class="pkt r1" r="6" />
								<circle class="pkt r2" r="6" />
							</g>
						</g>
					</g>

					<!-- which level is which, shown when it is time to remember -->
					<g class="tags" class:show={s === 4}>
						<g class="tag">
							<rect x="176" y="118" width="48" height="20" rx="10" />
							<text x="200" y="132">{tx.levels.lan}</text>
						</g>
						<g class="tag">
							<rect x="176" y="68" width="48" height="20" rx="10" />
							<text x="200" y="82">{tx.levels.wan}</text>
						</g>
						<g class="tag big">
							<rect x="160" y="270" width="80" height="22" rx="11" />
							<text x="200" y="285">{tx.levels.net}</text>
						</g>
					</g>
				</g>
				<rect class="frame" width="400" height="300" rx="18" />
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
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px 12px;
		min-height: 40px;
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.tryrow.show {
		visibility: visible;
		opacity: 1;
	}
	.trylabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.trybtns {
		display: flex;
		gap: 8px;
	}
	.try {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 8px 16px;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.try:hover,
	.try.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.art {
		width: 100%;
		max-width: 460px;
		height: auto;
	}
	.sky {
		fill: var(--color-paper);
	}
	.frame {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.cam {
		transform-origin: 0 0;
		transition: transform 1.6s cubic-bezier(0.45, 0, 0.2, 1);
	}
	.cam :global(*) {
		vector-effect: non-scaling-stroke;
	}
	.layer,
	.city > *,
	.wlbl,
	.clbl,
	.rlbl,
	.pkt {
		transition: opacity 0.8s ease;
	}

	/* the world */
	.link {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.net {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.4;
	}
	.net.mine {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.wlbl {
		fill: var(--color-muted);
		font-size: 11.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.wlbl.mine {
		fill: var(--color-brand);
	}

	/* the city */
	.line {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.bld {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.4;
	}
	.bld.hq {
		fill: var(--color-paper);
		stroke: var(--color-brand);
	}
	.win {
		fill: var(--color-brand-soft);
	}
	/* a halo in the page colour, so the long lines pass behind the names instead of through them */
	.clbl {
		fill: var(--color-muted);
		font-size: 14px;
		font-weight: 600;
		text-anchor: middle;
		paint-order: stroke;
		stroke: var(--color-paper);
		stroke-width: 5px;
		stroke-linejoin: round;
	}

	/* the room */
	.floor {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.cable {
		stroke: var(--color-brand);
		stroke-width: 2;
		opacity: 0.55;
	}
	.rlbl {
		fill: var(--color-muted);
		font-size: 15px;
		font-weight: 600;
		text-anchor: middle;
	}

	/* which layer shows at which zoom */
	.lvl-lan .world,
	.lvl-lan .city > .line,
	.lvl-lan .city > g:not(.room),
	.lvl-lan .city > .bld,
	.lvl-lan .clbl {
		opacity: 0;
	}
	.lvl-wan .world,
	.lvl-wan .rlbl,
	.lvl-net .rlbl,
	.lvl-net .clbl {
		opacity: 0;
	}

	/* data moving at the level in view */
	.pkt {
		fill: var(--color-amber);
		opacity: 0;
	}
	.lvl-lan .r1 {
		animation: room-a 2.8s ease-in-out infinite;
	}
	.lvl-lan .r2 {
		animation: room-b 2.8s ease-in-out 1.4s infinite;
	}
	.lvl-wan .c1 {
		animation: city-a 3.6s ease-in-out infinite;
	}
	.lvl-wan .c2 {
		animation: city-b 3.6s ease-in-out 1.8s infinite;
	}
	.lvl-net .w1 {
		animation: world-a 6s linear infinite;
	}
	.lvl-net .w2 {
		animation: world-b 4.4s ease-in-out 1s infinite;
	}
	@keyframes room-a {
		0% {
			transform: translate(80px, 72px);
			opacity: 0;
		}
		10%,
		90% {
			opacity: 1;
		}
		50% {
			transform: translate(200px, 150px);
		}
		100% {
			transform: translate(320px, 228px);
			opacity: 0;
		}
	}
	@keyframes room-b {
		0% {
			transform: translate(320px, 72px);
			opacity: 0;
		}
		10%,
		90% {
			opacity: 1;
		}
		50% {
			transform: translate(200px, 150px);
		}
		100% {
			transform: translate(80px, 228px);
			opacity: 0;
		}
	}
	@keyframes city-a {
		0% {
			transform: translate(62px, 58px);
			opacity: 0;
		}
		10%,
		90% {
			opacity: 1;
		}
		50% {
			transform: translate(200px, 150px);
		}
		100% {
			transform: translate(338px, 242px);
			opacity: 0;
		}
	}
	@keyframes city-b {
		0% {
			transform: translate(338px, 58px);
			opacity: 0;
		}
		10%,
		90% {
			opacity: 1;
		}
		50% {
			transform: translate(200px, 150px);
		}
		100% {
			transform: translate(62px, 242px);
			opacity: 0;
		}
	}
	@keyframes world-a {
		0% {
			transform: translate(62px, 256px);
			opacity: 0;
		}
		5%,
		95% {
			opacity: 1;
		}
		25% {
			transform: translate(66px, 44px);
		}
		50% {
			transform: translate(200px, 26px);
		}
		75% {
			transform: translate(334px, 44px);
		}
		100% {
			transform: translate(338px, 256px);
			opacity: 0;
		}
	}
	@keyframes world-b {
		0% {
			transform: translate(338px, 256px);
			opacity: 0;
		}
		10%,
		90% {
			opacity: 1;
		}
		50% {
			transform: translate(200px, 150px);
		}
		100% {
			transform: translate(66px, 44px);
			opacity: 0;
		}
	}

	/* the remember tags */
	.tags {
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	.tags.show {
		opacity: 1;
	}
	.tag rect {
		fill: var(--color-grass);
	}
	.tag text {
		fill: #fff;
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	@media (prefers-reduced-motion: reduce) {
		.cam,
		.layer,
		.wlbl,
		.clbl,
		.rlbl,
		.tags,
		.tryrow {
			transition: none;
		}
		.pkt {
			animation: none !important;
			opacity: 0 !important;
		}
	}
</style>
