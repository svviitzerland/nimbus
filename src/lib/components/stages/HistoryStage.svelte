<script lang="ts">
	// The story of computers, told as a timeline that moves by itself with Nim's beats. Each era
	// has its machine drawn in SVG, and the eras with real people show a framed public domain photo
	// (static/images/people). Tapping a timeline dot on the last beats is an optional look back.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HistoryText } from '$lib/chapters/basics/history/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HistoryText);

	const LAST_ERA = 12;
	// beats 0 to 11 walk the eras, the memory trick and the goodbye both show "today"
	const fromBeat = $derived(Math.min(beat, LAST_ERA));
	let peek = $state<number | null>(null);
	let peekBeat = -1;
	const active = $derived(peek !== null && peekBeat === beat ? peek : fromBeat);
	const canPeek = $derived(beat >= tx.intro.length - 2);

	let reduced = $state(false);
	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof window !== 'undefined' && window.matchMedia) {
			reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	function select(i: number) {
		if (!canPeek) return;
		peek = i;
		peekBeat = beat;
		onstate?.('peek');
	}

	const steps = $derived(tx.eras.map((e) => ({ title: e.title, body: e.body, tag: e.mark })));

	// framed photos, with their real pixel sizes so the frame never jumps while loading
	type PhotoKey = keyof HistoryText['photos'];
	const FILES: Record<PhotoKey, { src: string; w: number; h: number }> = {
		babbage: { src: '/images/people/charles-babbage.jpg', w: 500, h: 782 },
		lovelace: { src: '/images/people/ada-lovelace.jpg', w: 500, h: 718 },
		turing: { src: '/images/people/alan-turing.jpg', w: 500, h: 681 },
		eniac: { src: '/images/people/eniac.jpg', w: 500, h: 382 },
		hopper: { src: '/images/people/grace-hopper.jpg', w: 500, h: 625 }
	};
	const PHOTOS: Record<number, PhotoKey[]> = {
		2: ['babbage', 'lovelace'],
		3: ['turing'],
		4: ['turing'],
		5: ['eniac'],
		7: ['hopper']
	};

	// a toothed gear outline, drawn as one polygon (no dashed strokes)
	function gear(cx: number, cy: number, r: number, teeth: number) {
		const pts: string[] = [];
		const step = (Math.PI * 2) / teeth;
		for (let k = 0; k < teeth; k++) {
			const a = k * step;
			for (const [da, rr] of [
				[0, r],
				[step * 0.15, r + 6],
				[step * 0.45, r + 6],
				[step * 0.6, r]
			] as const) {
				pts.push(
					`${(cx + Math.cos(a + da) * rr).toFixed(1)},${(cy + Math.sin(a + da) * rr).toFixed(1)}`
				);
			}
		}
		return pts.join(' ');
	}

	const TICK0 = 16;
	const GAP = 26;
	const tickX = (k: number) => TICK0 + k * GAP;
</script>

{#snippet machine(i: number)}
	<svg viewBox="0 0 260 200" class="machine" aria-hidden="true">
		{#if i === 0}
			<!-- abacus -->
			<rect x="34" y="34" width="192" height="132" rx="10" class="wood" />
			{#each [62, 86, 110, 134, 158] as y, r (y)}
				<line x1="40" y1={y} x2="220" y2={y} class="ln" />
				{#each [58, 74, 90] as x (x)}<circle cx={x} cy={y} r="8" class="bead" />{/each}
				{#each [170, 186, 202] as x, b (x)}
					<circle
						cx={x}
						cy={y}
						r="8"
						class="bead"
						class:slide={b === 0 && (r === 1 || r === 3)}
						style="animation-delay:{r * 0.9}s"
					/>
				{/each}
			{/each}
		{:else if i === 1}
			<!-- a human computer at a desk -->
			<circle cx="84" cy="66" r="17" class="skin" />
			<path d="M58 132 Q60 92 84 90 Q108 92 110 132 Z" class="bd" />
			<path d="M104 106 Q122 116 140 110" class="ln" />
			<path d="M26 132 H236 L244 150 H18 Z" class="bd" />
			<line x1="34" y1="150" x2="34" y2="186" class="ln" />
			<line x1="228" y1="150" x2="228" y2="186" class="ln" />
			<g transform="rotate(-4 186 88)">
				<rect x="142" y="40" width="88" height="88" rx="4" class="paper" />
				<text x="216" y="66" class="mono write" style="animation-delay:0s">365</text>
				<text x="216" y="84" class="mono write" style="animation-delay:0.8s">× 24</text>
				<line x1="160" y1="92" x2="218" y2="92" class="ln write" style="animation-delay:1.4s" />
				<text x="216" y="112" class="mono write" style="animation-delay:2s">8760</text>
			</g>
		{:else if i === 2}
			<!-- the Analytical Engine, gears, number columns, and a punched card -->
			<polygon points={gear(78, 92, 34, 12)} class="brass spin" />
			<circle cx="78" cy="92" r="8" class="bd" />
			<polygon points={gear(132, 60, 20, 8)} class="brass spin rev" />
			<circle cx="132" cy="60" r="5" class="bd" />
			<polygon points={gear(132, 124, 16, 7)} class="brass spin rev" />
			<circle cx="132" cy="124" r="4" class="bd" />
			{#each [0, 1, 2, 3, 4] as k (k)}
				<rect x="178" y={30 + k * 24} width="46" height="18" rx="5" class="bd" />
				<text x="201" y={43 + k * 24} class="mono mid">{(k * 3 + 1) % 10}</text>
			{/each}
			<rect x="26" y="166" width="208" height="24" rx="3" class="card-paper" />
			{#each Array.from({ length: 16 }, (_, k) => k) as k (k)}
				{#if (k * 7) % 3 !== 0}<rect
						x={34 + k * 12.4}
						y="172"
						width="5"
						height="5"
						class="hole"
					/>{/if}
				{#if (k * 5) % 4 !== 1}<rect
						x={34 + k * 12.4}
						y="180"
						width="5"
						height="5"
						class="hole"
					/>{/if}
			{/each}
		{:else if i === 3}
			<!-- Turing's machine, a tape and a head that reads and writes -->
			<line x1="4" y1="125" x2="256" y2="125" class="ln faint" />
			{#each ['1', '0', '1', '1', '0', '', '1', '0', '1'] as s, k (k)}
				<rect x={22 + k * 24} y="110" width="24" height="30" class="paper" />
				<text x={34 + k * 24} y="130" class="mono mid">{s}</text>
			{/each}
			<g class="head">
				<rect x="67" y="58" width="30" height="28" rx="6" class="brandbox" />
				<path d="M74 86 H90 L82 100 Z" class="brandfill" />
			</g>
			<rect x="60" y="156" width="140" height="26" rx="6" class="bd" />
			<text x="130" y="173" class="mono mid small">0 → 1, move →</text>
		{:else if i === 4}
			<!-- a Bombe, rows of spinning drums -->
			<rect x="40" y="26" width="180" height="150" rx="10" class="bd" />
			{#each [0, 1, 2] as row (row)}
				{#each [0, 1, 2, 3] as col (col)}
					<g class="spin" style="animation-duration:{3 + row * 1.5}s">
						<circle cx={74 + col * 38} cy={60 + row * 42} r="15" class="drum" />
						<line
							x1={74 + col * 38}
							y1={60 + row * 42}
							x2={74 + col * 38}
							y2={46 + row * 42}
							class="ln"
						/>
					</g>
				{/each}
			{/each}
			<line x1="56" y1="176" x2="56" y2="192" class="ln" />
			<line x1="204" y1="176" x2="204" y2="192" class="ln" />
		{:else if i === 5}
			<!-- ENIAC, a room of cabinets full of glowing tubes, with a person for scale -->
			<line x1="4" y1="182" x2="256" y2="182" class="ln faint" />
			{#each [0, 1, 2, 3, 4] as p (p)}
				<rect x={10 + p * 38} y="36" width="34" height="146" rx="3" class="bd" />
				{#each [0, 1, 2, 3, 4, 5, 6] as rr (rr)}
					{#each [0, 1, 2] as cc (cc)}
						<circle
							cx={19 + p * 38 + cc * 8}
							cy={50 + rr * 16}
							r="2.8"
							class="tube"
							style="animation-delay:{((p * 7 + rr * 3 + cc * 5) % 11) * 0.23}s"
						/>
					{/each}
				{/each}
			{/each}
			<path d="M44 160 Q63 176 82 160" class="cable" />
			<path d="M120 164 Q139 178 158 164" class="cable" />
			<circle cx="226" cy="98" r="9" class="skin" />
			<path d="M212 182 V126 Q212 110 226 110 Q240 110 240 126 V182 Z" class="bd" />
		{:else if i === 6}
			<!-- a vacuum tube next to a transistor, same job, much smaller -->
			<g class="faded">
				<rect x="40" y="34" width="58" height="104" rx="29" class="glass" />
				<path d="M58 118 V84 Q69 70 80 84 V118" class="ln" />
				<circle cx="69" cy="90" r="9" class="glow" />
				<rect x="44" y="136" width="50" height="18" rx="3" class="bd" />
				{#each [52, 64, 76, 88] as x (x)}<line x1={x} y1="154" x2={x} y2="172" class="ln" />{/each}
			</g>
			<line x1="112" y1="104" x2="150" y2="104" class="ln" />
			<path d="M146 98 L154 104 L146 110" class="ln" />
			<path d="M170 120 H204 V104 A17 17 0 0 0 170 104 Z" class="chipfill" />
			{#each [176, 187, 198] as x (x)}<line x1={x} y1="120" x2={x} y2="160" class="ln" />{/each}
			<circle cx="187" cy="100" r="3.5" class="switch" />
		{:else if i === 7}
			<!-- words in, numbers out, a compiler in between -->
			<rect x="10" y="56" width="92" height="84" rx="6" class="paper" />
			<text x="20" y="84" class="mono left">ADD PRICE</text>
			<text x="20" y="102" class="mono left">TO TOTAL.</text>
			<line x1="106" y1="98" x2="114" y2="98" class="ln" />
			<polygon points={gear(130, 98, 12, 8)} class="brass spin" />
			<circle cx="130" cy="98" r="4" class="bd" />
			<line x1="148" y1="98" x2="156" y2="98" class="ln" />
			<path d="M152 92 L158 98 L152 104" class="ln" />
			<rect x="160" y="56" width="92" height="84" rx="6" class="paper" />
			<text x="206" y="84" class="mono mid bits">0110 1011</text>
			<text x="206" y="102" class="mono mid bits" style="animation-delay:0.5s">1001 0010</text>
			<text x="206" y="120" class="mono mid bits" style="animation-delay:1s">0011 1100</text>
		{:else if i === 8}
			<!-- a microchip, with a zoom into its tiny transistors -->
			<line x1="118" y1="74" x2="156" y2="52" class="ln faint" />
			<line x1="118" y1="146" x2="160" y2="112" class="ln faint" />
			{#each [0, 1, 2, 3, 4, 5] as k (k)}
				<line x1={44 + k * 13} y1="66" x2={44 + k * 13} y2="58" class="ln" />
				<line x1={44 + k * 13} y1="154" x2={44 + k * 13} y2="162" class="ln" />
				<line x1="32" y1={78 + k * 13} x2="24" y2={78 + k * 13} class="ln" />
				<line x1="128" y1={78 + k * 13} x2="136" y2={78 + k * 13} class="ln" />
			{/each}
			<rect x="32" y="66" width="96" height="88" rx="6" class="chipfill" />
			<circle cx="196" cy="80" r="50" class="lens" />
			{#each Array.from({ length: 25 }, (_, k) => k) as k (k)}
				<rect
					x={164 + (k % 5) * 13.5}
					y={48 + Math.floor(k / 5) * 13.5}
					width="9"
					height="9"
					rx="2"
					class="cell"
					style="animation-delay:{((k * 7) % 25) * 0.12}s"
				/>
			{/each}
		{:else if i === 9}
			<!-- an early personal computer -->
			<rect x="56" y="22" width="148" height="104" rx="12" class="bd" />
			<rect x="70" y="34" width="120" height="78" rx="5" class="crt" />
			<text x="80" y="58" class="mono crttext">READY</text>
			<rect x="80" y="66" width="8" height="12" class="cursor" />
			<rect x="34" y="132" width="192" height="26" rx="5" class="bd" />
			<line x1="140" y1="145" x2="200" y2="145" class="ln" />
			<path d="M40 166 H220 L232 188 H28 Z" class="bd" />
			{#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as k (k)}
				<rect x={50 + k * 16.5} y="171" width="12" height="6" rx="1.5" class="key" />
			{/each}
		{:else if i === 10}
			<!-- the web, computers around the world linked together -->
			{#each [{ x: 46, y: 40 }, { x: 214, y: 40 }, { x: 130, y: 178 }] as c, k (k)}
				<line x1="130" y1="100" x2={c.x} y2={c.y} class="link" id="hx-web-{k}" />
			{/each}
			<circle cx="130" cy="100" r="44" class="globe" />
			<ellipse cx="130" cy="100" rx="18" ry="44" class="ln brandline" />
			<line x1="86" y1="100" x2="174" y2="100" class="ln brandline" />
			<path d="M92 78 Q130 70 168 78 M92 122 Q130 130 168 122" class="ln brandline" />
			{#each [{ x: 46, y: 40 }, { x: 214, y: 40 }, { x: 130, y: 178 }] as c, k (k)}
				<rect x={c.x - 22} y={c.y - 16} width="44" height="30" rx="4" class="bd" />
				<rect x={c.x - 15} y={c.y - 10} width="30" height="4" rx="2" class="brandfill" />
				<rect x={c.x - 15} y={c.y - 2} width="20" height="3" rx="1.5" class="li" />
				<rect x={c.x - 15} y={c.y + 4} width="24" height="3" rx="1.5" class="li" />
				{#if !reduced}
					<circle r="4" class="packet">
						<animateMotion
							dur="2.6s"
							repeatCount="indefinite"
							begin="{k * 0.8}s"
							path="M130 100 L{c.x} {c.y}"
						/>
					</circle>
				{/if}
			{/each}
		{:else if i === 11}
			<!-- a smartphone -->
			<rect x="92" y="14" width="76" height="172" rx="16" class="bd" />
			<rect x="99" y="30" width="62" height="140" rx="7" class="screen" />
			<rect x="120" y="20" width="20" height="4" rx="2" class="li" />
			{#each Array.from({ length: 12 }, (_, k) => k) as k (k)}
				<rect
					x={106 + (k % 3) * 18}
					y={42 + Math.floor(k / 3) * 22}
					width="13"
					height="13"
					rx="4"
					class="app a{k % 4}"
					style="animation-delay:{k * 0.25}s"
				/>
			{/each}
			<rect x="118" y="174" width="24" height="4" rx="2" class="li" />
		{:else}
			<!-- room, desk, pocket -->
			<line x1="4" y1="170" x2="256" y2="170" class="ln faint" />
			{#each [0, 1, 2, 3] as p (p)}
				<rect x={10 + p * 25} y="50" width="22" height="120" rx="2" class="bd" />
				{#each [0, 1, 2, 3, 4] as rr (rr)}
					<circle cx={21 + p * 25} cy={64 + rr * 18} r="2.4" class="tube still" />
				{/each}
			{/each}
			<rect x="128" y="112" width="56" height="40" rx="5" class="bd" />
			<rect x="134" y="118" width="44" height="28" rx="3" class="crt" />
			<rect x="122" y="154" width="68" height="16" rx="3" class="bd" />
			<rect x="212" y="138" width="18" height="32" rx="4" class="bd" />
			<rect x="214" y="142" width="14" height="22" rx="2" class="screen" />
			<text x="57" y="190" class="mono mid small">1945</text>
			<text x="156" y="190" class="mono mid small">1981</text>
			<text x="221" y="190" class="mono mid small">2007</text>
		{/if}
	</svg>
{/snippet}

{#snippet visual(i: number)}
	<div class="history">
		{#key i}
			<div class="scene" in:fade={{ duration: reduced ? 0 : 260 }}>
				<div class="draw">{@render machine(i)}</div>
				{#if PHOTOS[i]}
					<div class="photos" class:wide={PHOTOS[i][0] === 'eniac'}>
						{#each PHOTOS[i] as key, n (key)}
							<figure class="frame" style="--tilt:{n % 2 ? 2.5 : -2.5}deg">
								<img
									src={FILES[key].src}
									alt={tx.photos[key].alt}
									width={FILES[key].w}
									height={FILES[key].h}
									loading="lazy"
									decoding="async"
								/>
								<figcaption>{tx.photos[key].caption}</figcaption>
							</figure>
						{/each}
					</div>
				{/if}
			</div>
		{/key}

		<svg viewBox="0 0 344 56" class="timeline" role="group" aria-label={tx.timeline}>
			<line x1={tickX(0)} y1="38" x2={tickX(LAST_ERA)} y2="38" class="track" />
			<line x1={tickX(0)} y1="38" x2={tickX(i)} y2="38" class="progress" />
			{#each tx.eras as era, k (k)}
				{#if canPeek}
					<g
						role="button"
						tabindex="0"
						aria-label={`${era.mark}, ${era.title}`}
						class="tick tap"
						onclick={() => select(k)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								select(k);
							}
						}}
					>
						<circle cx={tickX(k)} cy="38" r="12" class="hit" />
						<circle cx={tickX(k)} cy="38" r={k === i ? 6.5 : 4} class:done={k <= i} class="dot" />
					</g>
				{:else}
					<circle cx={tickX(k)} cy="38" r={k === i ? 6.5 : 4} class:done={k <= i} class="dot" />
				{/if}
			{/each}
			<text
				x={tickX(i)}
				y="20"
				class="mark"
				text-anchor={i < 2 ? 'start' : i > LAST_ERA - 2 ? 'end' : 'middle'}
				dx={i < 2 ? -6 : i > LAST_ERA - 2 ? 6 : 0}>{tx.eras[i]?.mark}</text
			>
		</svg>
	</div>
{/snippet}

<div class="wrap">
	<Guide {steps} {active} {visual} onselect={canPeek ? select : undefined} />
</div>

<style>
	.wrap {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			align-items: center;
			padding-bottom: 1rem;
		}
	}
	.history {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.scene {
		display: flex;
		height: 220px;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 12px;
	}
	.draw {
		display: flex;
		height: 100%;
		min-width: 0;
		flex: 1 1 0;
		max-width: 290px;
		justify-content: center;
	}
	.machine {
		height: 100%;
		width: 100%;
	}
	.photos {
		display: flex;
		flex: none;
		gap: 8px;
	}
	.frame {
		margin: 0;
		width: 92px;
		transform: rotate(var(--tilt));
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		padding: 5px 5px 6px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.12);
	}
	.photos.wide .frame {
		width: 150px;
	}
	.frame img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 3px;
		filter: grayscale(0.15);
	}
	figcaption {
		margin-top: 4px;
		font-size: 9.5px;
		line-height: 1.3;
		text-align: center;
		color: var(--color-muted);
	}
	@media (max-width: 767px) {
		.scene {
			height: 190px;
			gap: 8px;
		}
		.frame {
			width: 74px;
		}
		.photos.wide .frame {
			width: 124px;
		}
	}
	.timeline {
		width: 100%;
		max-width: 360px;
		overflow: visible;
	}
	.track {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.progress {
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
		transition: all 0.5s ease;
	}
	.dot {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: r 0.3s ease;
	}
	.dot.done {
		fill: var(--color-brand);
		stroke: var(--color-brand);
	}
	.hit {
		fill: transparent;
	}
	.tap {
		cursor: pointer;
		outline: none;
	}
	.tap:focus-visible .dot,
	.tap:hover .dot {
		stroke: var(--color-brand);
		stroke-width: 3;
	}
	.mark {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-brand);
	}

	/* drawing palette */
	.ln {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.faint {
		stroke: var(--color-line);
	}
	.bd {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.card-paper {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.hole {
		fill: var(--color-muted);
	}
	.wood {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 8;
	}
	.bead {
		fill: var(--color-amber);
	}
	.skin {
		fill: var(--color-amber-soft);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.brass {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.mono {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		fill: var(--color-ink);
		text-anchor: end;
	}
	.mono.mid {
		text-anchor: middle;
	}
	.mono.left {
		text-anchor: start;
		font-size: 11px;
	}
	.mono.small {
		font-size: 10px;
		fill: var(--color-muted);
	}
	.brandbox {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.brandfill {
		fill: var(--color-brand);
	}
	.brandline {
		stroke: var(--color-brand);
		opacity: 0.6;
	}
	.drum {
		fill: var(--color-brand-soft);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.tube {
		fill: var(--color-amber);
	}
	.cable {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2;
		opacity: 0.55;
	}
	.glass {
		fill: var(--color-brand-soft);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.glow {
		fill: var(--color-amber);
		opacity: 0.7;
	}
	.faded {
		opacity: 0.55;
	}
	.chipfill {
		fill: var(--color-muted);
	}
	.switch {
		fill: var(--color-grass);
	}
	.lens {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.cell {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.crt {
		fill: #1d2a36;
	}
	.crttext {
		fill: #7fd3a0;
		text-anchor: start;
		font-size: 12px;
	}
	.cursor {
		fill: #7fd3a0;
	}
	.key {
		fill: var(--color-line);
	}
	.link {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.globe {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.li {
		fill: var(--color-line);
	}
	.packet {
		fill: var(--color-grass);
	}
	.screen {
		fill: var(--color-brand-soft);
	}
	.app.a0 {
		fill: var(--color-brand);
	}
	.app.a1 {
		fill: var(--color-grass);
	}
	.app.a2 {
		fill: var(--color-amber);
	}
	.app.a3 {
		fill: var(--color-danger);
	}

	/* calm motion, only when the learner has not asked for less */
	@media (prefers-reduced-motion: no-preference) {
		.slide {
			animation: slide 3.6s ease-in-out infinite;
		}
		.write {
			opacity: 0;
			animation: appear 4s ease infinite;
		}
		.spin {
			transform-box: fill-box;
			transform-origin: center;
			animation: spin 9s linear infinite;
		}
		.spin.rev {
			animation-direction: reverse;
			animation-duration: 6s;
		}
		.head {
			animation: head 6s ease-in-out infinite;
		}
		.tube {
			animation: blink 2.6s ease-in-out infinite;
		}
		.tube.still {
			animation: none;
		}
		.glow {
			animation: blink 1.4s ease-in-out infinite;
		}
		.switch {
			animation: blink 0.9s ease-in-out infinite;
		}
		.cell {
			animation: cell 3s ease-in-out infinite;
		}
		.bits {
			animation: appear 3.6s ease infinite;
		}
		.cursor {
			animation: blink 1.1s steps(1) infinite;
		}
		.app {
			animation: blink 3s ease-in-out infinite;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.progress,
		.dot {
			transition: none;
		}
	}
	@keyframes slide {
		0%,
		25% {
			transform: translateX(0);
		}
		45%,
		80% {
			transform: translateX(-64px);
		}
		100% {
			transform: translateX(0);
		}
	}
	@keyframes appear {
		0% {
			opacity: 0;
		}
		15%,
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes head {
		0%,
		18% {
			transform: translateX(0);
		}
		30%,
		48% {
			transform: translateX(24px);
		}
		60%,
		78% {
			transform: translateX(72px);
		}
		90%,
		100% {
			transform: translateX(0);
		}
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
	@keyframes cell {
		0%,
		100% {
			fill: var(--color-brand-soft);
		}
		50% {
			fill: var(--color-brand);
		}
	}
</style>
