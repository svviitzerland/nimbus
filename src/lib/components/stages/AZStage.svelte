<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';

	import { onDestroy } from 'svelte';
	import { geoEquirectangular, geoPath } from 'd3-geo';
	import type { Polygon, MultiPolygon, Position } from 'geojson';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import Plane from '../Plane.svelte';
	import regionShapesData from '$lib/data/region-shapes.json';
	import type { LessonText, AZText } from '$lib/chapters/types';
	const SHAPES = regionShapesData as unknown as Record<string, Polygon | MultiPolygon>;

	let {
		text,
		oncomplete,
		onstate,
		beat = 0,
		onlock,
		onshow
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
		onlock?: (v: boolean) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as AZText);

	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const wx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const wy = (lat: number) => ((84 - lat) / 140) * FLAT_H;

	type Az = { l: string; lon: number; lat: number };
	type RegionKey = 'virginia' | 'singapore';
	const REGIONS: Record<RegionKey, { code: string; lon: number; lat: number; azs: Az[] }> = {
		virginia: {
			code: 'us-east-1',
			lon: -77.5,
			lat: 39,
			azs: [
				{ l: 'a', lon: -77.43, lat: 37.54 },
				{ l: 'b', lon: -79.94, lat: 37.27 },
				{ l: 'c', lon: -78.48, lat: 38.03 },
				{ l: 'd', lon: -77.09, lat: 38.88 },
				{ l: 'e', lon: -75.98, lat: 36.85 },
				{ l: 'f', lon: -82.55, lat: 36.7 }
			]
		},
		singapore: {
			code: 'ap-southeast-1',
			lon: 103.8,
			lat: 1.35,
			azs: [
				{ l: 'a', lon: 103.7, lat: 1.33 },
				{ l: 'b', lon: 103.84, lat: 1.36 },
				{ l: 'c', lon: 103.98, lat: 1.35 }
			]
		}
	};
	const pins = (Object.keys(REGIONS) as RegionKey[]).map((k) => ({
		key: k,
		x: wx(REGIONS[k].lon),
		y: wy(REGIONS[k].lat)
	}));

	const RW = 600;
	const RH = 360;

	// Intro strike target (UAE / Bahrain area) and scattered news popup positions.
	const meX = wx(52);
	const meY = wy(25);
	const NEWS_POS = [
		{ l: 3, t: 6 },
		{ l: 29, t: 4 },
		{ l: 55, t: 5 },
		{ l: 77, t: 13 },
		{ l: 3, t: 32 },
		{ l: 78, t: 39 },
		{ l: 76, t: 63 },
		{ l: 44, t: 64 },
		{ l: 57, t: 47 }
	];

	let region = $state<RegionKey | null>(null);
	const servers = new SvelteSet<string>();
	let downAz = $state<string | null>(null);
	let strikeTo = $state<[number, number] | null>(null); // where the incoming jet is headed (region coords)
	let namedShown = false; // whether Nim has explained the AZ naming for this region visit
	let striking = $state(false);
	let strikeKey = $state(0);
	let browser = $state<'loaded' | 'offline'>('loaded');
	let fired = false;
	let t1: ReturnType<typeof setTimeout> | undefined;
	let t2: ReturnType<typeof setTimeout> | undefined;

	// intro sequence (beat 0)
	let introMissile = $state(false);
	let introBoom = $state(false);
	let showNews = $state(false);
	let introPlayed = false;
	let it0: ReturnType<typeof setTimeout> | undefined;
	let it1: ReturnType<typeof setTimeout> | undefined;
	let it2: ReturnType<typeof setTimeout> | undefined;
	let it3: ReturnType<typeof setTimeout> | undefined;
	let it4: ReturnType<typeof setTimeout> | undefined;

	const introMode = $derived(beat <= 1 && region === null);
	const inRegion = $derived(region !== null);
	const cfg = $derived(region ? REGIONS[region] : null);
	const siteDown = $derived(browser === 'offline');
	const countHere = $derived(cfg ? cfg.azs.filter((a) => servers.has(cfg.code + a.l)).length : 0);
	function geomBounds(g: Polygon | MultiPolygon): [[number, number], [number, number]] {
		let minX = 180;
		let minY = 90;
		let maxX = -180;
		let maxY = -90;
		const scan = (ring: Position[]) => {
			for (const [x, y] of ring) {
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
			}
		};
		if (g.type === 'Polygon') g.coordinates.forEach(scan);
		else g.coordinates.forEach((p) => p.forEach(scan));
		return [
			[minX, minY],
			[maxX, maxY]
		];
	}

	const detail = $derived.by(() => {
		if (!region) return null;
		const shape = SHAPES[region];
		const b = geomBounds(shape);
		const lonSpan = Math.max(((b[1][0] - b[0][0]) * Math.PI) / 180, 1e-4);
		const latSpan = Math.max(((b[1][1] - b[0][1]) * Math.PI) / 180, 1e-4);
		const scale = Math.min(RW / lonSpan, RH / latSpan) * 0.86;
		const proj = geoEquirectangular()
			.scale(scale)
			.center([(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2])
			.translate([RW / 2, RH / 2]);
		return { proj, path: geoPath(proj)(shape) ?? '' };
	});

	// Where the explosion lands (the AZ currently knocked out), in region-map coordinates.
	const victimPt = $derived.by(() => {
		if (!downAz || !cfg || !detail) return null;
		const a = cfg.azs.find((x) => cfg.code + x.l === downAz);
		return a ? detail.proj([a.lon, a.lat]) : null;
	});

	$effect(() => {
		// Any beat change returns the stage to the zoomed-out world, so going back via Nim's
		// chat (not the in-stage button) never leaves it stuck zoomed into a region.
		region = null;
		downAz = null;
		strikeTo = null;
		striking = false;
		browser = 'loaded';
		clearTimeout(t1);
		clearTimeout(t2);
		// Beats 0 and 1 are the news intro: keep the stage un-dimmed. The strike plays on
		// beat 0; the news stay up through beat 1 while Nim names the cases.
		if (beat <= 1) {
			onshow?.(true);
			if (beat === 0 && !introPlayed) {
				introPlayed = true;
				playIntro();
			} else if (beat === 1) {
				onlock?.(false);
			}
		} else {
			onshow?.(false);
			onlock?.(false);
		}
	});

	function playIntro() {
		onlock?.(true);
		// hold briefly first, so a learner who just opened the page sees the calm map
		// before a jet suddenly streaks in
		it0 = setTimeout(() => (introMissile = true), 1500); // a jet streaks in toward the data center
		it1 = setTimeout(() => {
			introMissile = false;
			introBoom = true; // then it explodes
		}, 2350);
		it2 = setTimeout(() => (introBoom = false), 3150); // and the explosion fades away
		it3 = setTimeout(() => (showNews = true), 3300);
		it4 = setTimeout(() => onlock?.(false), 6500);
	}

	function enterRegion(k: RegionKey) {
		region = k;
		downAz = null;
		strikeTo = null;
		striking = false;
		browser = 'loaded';
		namedShown = false;
		const c = REGIONS[k];
		if (!c.azs.some((a) => servers.has(c.code + a.l))) {
			servers.add(c.code + 'a');
		}
		// First Nim says which region this is and what the dots are.
		onstate?.(k);
	}
	function back() {
		if (striking) return;
		region = null;
	}
	function toggleServer(id: string) {
		if (striking) return;
		// On the first server the learner places here, Nim follows up with the AZ naming.
		if (!namedShown && region) {
			namedShown = true;
			onstate?.(region + '-name');
		}
		if (servers.has(id)) servers.delete(id);
		else servers.add(id);
	}
	function trigger() {
		if (striking || !cfg) return;
		const withServer = cfg.azs.map((a) => cfg.code + a.l).filter((id) => servers.has(id));
		if (withServer.length === 0) return;
		const victim = withServer[0];
		const va = cfg.azs.find((a) => cfg.code + a.l === victim);
		strikeTo = va && detail ? detail.proj([va.lon, va.lat]) : null; // jet flies to this AZ
		strikeKey += 1;
		striking = true;
		t1 = setTimeout(() => {
			downAz = victim;
			const survives = withServer.some((id) => id !== victim);
			browser = survives ? 'loaded' : 'offline';
			if (survives) {
				onstate?.('survived');
				if (!fired) {
					fired = true;
					oncomplete?.();
				}
			} else {
				onstate?.('down');
			}
		}, 850);
		t2 = setTimeout(() => {
			downAz = null;
			striking = false;
			browser = 'loaded';
			strikeTo = null;
		}, 3000);
	}

	onDestroy(() => {
		clearTimeout(t1);
		clearTimeout(t2);
		clearTimeout(it0);
		clearTimeout(it1);
		clearTimeout(it2);
		clearTimeout(it3);
		clearTimeout(it4);
	});
</script>

{#snippet boomBurst()}
	<g class="azboom">
		<g stroke="#ff7a1a" stroke-width="4" stroke-linecap="round">
			<line x1="10" y1="0" x2="26" y2="0" />
			<line x1="7.1" y1="7.1" x2="18.4" y2="18.4" />
			<line x1="0" y1="10" x2="0" y2="26" />
			<line x1="-7.1" y1="7.1" x2="-18.4" y2="18.4" />
			<line x1="-10" y1="0" x2="-26" y2="0" />
			<line x1="-7.1" y1="-7.1" x2="-18.4" y2="-18.4" />
			<line x1="0" y1="-10" x2="0" y2="-26" />
			<line x1="7.1" y1="-7.1" x2="18.4" y2="-18.4" />
		</g>
		<circle r="13" fill="#ff9e2c" />
		<circle r="7" fill="#ffe08a" />
	</g>
{/snippet}

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<div
		class="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-line"
		style="background:#f1f6fc;"
	>
		<!-- world view (intro strike or region pins) -->
		<div
			class="absolute inset-0 transition-all duration-500 ease-out"
			style="opacity:{inRegion ? 0 : 1}; transform:scale({inRegion ? 1.4 : 1}); {inRegion
				? 'pointer-events:none;'
				: ''}"
		>
			<svg
				viewBox="0 0 {FLAT_W} {FLAT_H}"
				class="h-full w-full"
				preserveAspectRatio="xMidYMid meet"
				role="img"
				aria-label="world map"
			>
				<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
				<WorldMap />

				{#if introMode}
					<rect x={meX - 7} y={meY - 7} width="14" height="14" rx="2.5" fill="#16212b" />
					<text
						x={meX}
						y={meY - 13}
						text-anchor="middle"
						fill="#16212b"
						font-size="12"
						font-weight="700">{tx.strikeLabel}</text
					>
					{#if introMissile}
						<g transform="translate({meX} {meY})"><g class="incoming"><Plane /></g></g>
					{/if}
					{#if introBoom}
						<g transform="translate({meX} {meY})">{@render boomBurst()}</g>
					{/if}
				{:else}
					{#each pins as p (p.key)}
						<g
							class="pin"
							role="button"
							tabindex="0"
							aria-label={tx.regions[p.key]}
							onclick={() => enterRegion(p.key)}
							onkeydown={(e) => e.key === 'Enter' && enterRegion(p.key)}
						>
							<circle cx={p.x} cy={p.y} r="13" fill="#2e6fe0" opacity="0.18" class="pulse" />
							<circle cx={p.x} cy={p.y} r="6.5" fill="#2e6fe0" stroke="#fff" stroke-width="2" />
							<text
								x={p.x}
								y={p.y - 12}
								text-anchor="middle"
								fill="#16212b"
								font-size="13"
								font-weight="700">{tx.regions[p.key]}</text
							>
						</g>
					{/each}
				{/if}
			</svg>

			{#if introMode}
				{#if showNews}
					<div class="pointer-events-none absolute inset-0">
						{#each tx.news as n, i (n.url)}
							<!-- External news URL from the curated lesson data. -->
							<!-- eslint-disable svelte/no-navigation-without-resolve -->
							<a
								class="newscard absolute"
								href={n.url}
								target="_blank"
								rel="noopener noreferrer"
								style="left:{NEWS_POS[i % NEWS_POS.length].l}%; top:{NEWS_POS[i % NEWS_POS.length]
									.t}%; animation-delay:{i * 0.45 + 0.1}s"
							>
								<p class="src">{n.src}</p>
								<p class="head">{n.head}</p>
							</a>
							<!-- eslint-enable svelte/no-navigation-without-resolve -->
						{/each}
					</div>
				{/if}
			{:else}
				<p
					class="pointer-events-none absolute inset-x-0 bottom-2 text-center text-[11px] text-faint"
				>
					{tx.worldHint}
				</p>
			{/if}
		</div>

		<!-- region close-up -->
		<div
			class="absolute inset-0 transition-all duration-500 ease-out"
			style="opacity:{inRegion ? 1 : 0}; transform:scale({inRegion ? 1 : 0.96}); {inRegion
				? ''
				: 'pointer-events:none;'}"
		>
			{#if cfg && region && detail}
				<svg
					viewBox="0 0 {RW} {RH}"
					class="h-full w-full"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label={tx.regions[region]}
				>
					<rect width={RW} height={RH} fill="#eaf2fc" />
					<path
						d={detail.path}
						fill="#cdddef"
						stroke="#4d82c9"
						stroke-width="1.4"
						stroke-linejoin="round"
						stroke-linecap="round"
					/>
					<text
						x={RW / 2}
						y={RH * 0.5}
						text-anchor="middle"
						dominant-baseline="middle"
						fill="#42587a"
						opacity="0.2"
						font-size="46"
						font-weight="800"
						letter-spacing="3"
					>
						{tx.regions[region].toUpperCase()}
					</text>
					{#each cfg.azs as a (a.l)}
						{@const azId = cfg.code + a.l}
						{@const p = detail.proj([a.lon, a.lat])}
						{@const has = servers.has(azId)}
						{@const isDown = downAz === azId}
						{#if p}
							<g
								class="pin"
								role="button"
								tabindex="0"
								aria-label={azId}
								onclick={() => toggleServer(azId)}
								onkeydown={(e) => e.key === 'Enter' && toggleServer(azId)}
							>
								<circle cx={p[0]} cy={p[1]} r="13" fill="transparent" />
								<circle
									cx={p[0]}
									cy={p[1]}
									r={isDown ? 8.5 : 7}
									fill={isDown ? '#e03131' : has ? '#2f9e44' : '#fff'}
									stroke={isDown ? '#e03131' : has ? '#2f9e44' : '#8a949d'}
									stroke-width="2.2"
								/>
								<text
									x={p[0]}
									y={p[1] - 12}
									text-anchor="middle"
									fill="#16212b"
									font-size="11"
									font-weight="600">{azId}</text
								>
								{#if isDown}
									<text
										x={p[0]}
										y={p[1] + 20}
										text-anchor="middle"
										fill="#e03131"
										font-size="10"
										font-weight="700">{tx.statusDown}</text
									>
								{/if}
							</g>
						{/if}
					{/each}
					{#key strikeKey}
						{#if strikeTo && striking && downAz === null}
							<g transform="translate({strikeTo[0]} {strikeTo[1]})"
								><g class="incoming"><Plane /></g></g
							>
						{/if}
					{/key}
					{#if victimPt}
						<g transform="translate({victimPt[0]} {victimPt[1]})">{@render boomBurst()}</g>
					{/if}
				</svg>

				<div
					class="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3"
				>
					<button
						type="button"
						onclick={back}
						class="pointer-events-auto flex items-center gap-1 rounded-full bg-card/80 px-2.5 py-1 text-[12px] font-medium text-faint backdrop-blur transition-colors hover:text-ink"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.4"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"><path d="M15 6 L9 12 L15 18" /></svg
						>
						{tx.back}
					</button>
					<span
						class="rounded-full bg-card/80 px-2.5 py-1 text-[13px] font-semibold text-ink backdrop-blur"
						>{cfg.code} ({tx.regions[region]})</span
					>
				</div>

				<div
					class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3"
				>
					<p class="text-[11px] text-faint">{tx.place}</p>
					<button
						type="button"
						onclick={trigger}
						disabled={striking || countHere === 0}
						class="pointer-events-auto shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
						style="background: var(--btn-primary);"
					>
						{tx.trigger}
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Phone + readout, desktop only. Small screens hide it so the map gets the whole space. -->
	<div
		class="hidden shrink-0 items-center justify-center gap-4 md:flex md:w-[200px] md:flex-col md:justify-center"
	>
		<Browser phase={browser} />
		<div class="w-[150px] rounded-2xl border border-line bg-card p-4 text-center md:w-full">
			{#if inRegion && cfg}
				<p class="text-lg font-bold {siteDown ? 'text-danger' : 'text-grass'}">
					{siteDown ? tx.statusDown : tx.statusUp}
				</p>
				<p class="mt-1 text-[11px] text-faint">{tx.activeZones}: {countHere}/{cfg.azs.length}</p>
			{:else}
				<p class="text-sm text-faint">{tx.worldHint}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:focus,
	.pin:focus-visible {
		outline: none;
	}
	.pin:hover circle[stroke] {
		stroke-width: 3.2;
	}
	.pulse {
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.18;
		}
		50% {
			transform: scale(1.8);
			opacity: 0.04;
		}
	}
	.incoming {
		animation: incoming 0.8s cubic-bezier(0.3, 0, 0.5, 1) forwards;
	}
	@keyframes incoming {
		0% {
			transform: translate(-230px, -180px);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		100% {
			transform: translate(0, 0);
			opacity: 1;
		}
	}
	.azboom {
		transform-box: fill-box;
		transform-origin: center;
		animation: azboom 0.7s ease-out forwards;
	}
	@keyframes azboom {
		0% {
			transform: scale(0.3);
			opacity: 1;
		}
		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}
	.newscard {
		display: block;
		width: 172px;
		max-width: 40%;
		padding: 8px 10px;
		border-radius: 12px;
		background: #ffffff;
		border: 1px solid #e7ecf2;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.16);
		text-decoration: none;
		pointer-events: auto;
		opacity: 0;
		transform: translateY(10px) scale(0.96);
		animation: news-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
		transition:
			box-shadow 0.15s,
			transform 0.15s;
	}
	.newscard:hover {
		box-shadow: 0 14px 30px rgba(22, 40, 60, 0.22);
	}
	@keyframes news-pop {
		to {
			opacity: 1;
			transform: none;
		}
	}
	.src {
		font-size: 9px;
		font-weight: 700;
		color: #2e6fe0;
	}
	.head {
		margin-top: 2px;
		font-size: 10.5px;
		font-weight: 600;
		line-height: 1.22;
		color: #16212b;
	}
</style>
