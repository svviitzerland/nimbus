<script lang="ts">
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { geoDistance, geoInterpolate } from 'd3-geo';
	import Browser from '../Browser.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import WorldMap from '../WorldMap.svelte';
	import Globe from '../Globe.svelte';
	import LocationComparisonCard from '../LocationComparisonCard.svelte';
	import type { GlobeView } from '../Globe.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CdnText } from '$lib/chapters/traffic/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as CdnText);

	type Spot = { code: string; lon: number; lat: number };

	// nimbus.com lives in one place, Virginia, just like the story so far
	const ORIGIN: Spot = { code: 'origin', lon: -77.5, lat: 39.0 };

	// the CDN network, one dot per city. Real providers run hundreds of these.
	const EDGES: Spot[] = [
		{ code: 'seattle', lon: -122.33, lat: 47.61 },
		{ code: 'losangeles', lon: -118.24, lat: 34.05 },
		{ code: 'dallas', lon: -96.8, lat: 32.78 },
		{ code: 'miami', lon: -80.19, lat: 25.76 },
		{ code: 'newyork', lon: -74.0, lat: 40.71 },
		{ code: 'toronto', lon: -79.38, lat: 43.65 },
		{ code: 'mexicocity', lon: -99.13, lat: 19.43 },
		{ code: 'bogota', lon: -74.07, lat: 4.71 },
		{ code: 'lima', lon: -77.04, lat: -12.04 },
		{ code: 'saopaulo', lon: -46.63, lat: -23.55 },
		{ code: 'buenosaires', lon: -58.38, lat: -34.6 },
		{ code: 'santiago', lon: -70.67, lat: -33.45 },
		{ code: 'london', lon: -0.13, lat: 51.5 },
		{ code: 'paris', lon: 2.35, lat: 48.86 },
		{ code: 'frankfurt', lon: 8.68, lat: 50.11 },
		{ code: 'madrid', lon: -3.7, lat: 40.42 },
		{ code: 'milan', lon: 9.19, lat: 45.46 },
		{ code: 'stockholm', lon: 18.07, lat: 59.33 },
		{ code: 'warsaw', lon: 21.01, lat: 52.23 },
		{ code: 'johannesburg', lon: 28.05, lat: -26.2 },
		{ code: 'lagos', lon: 3.38, lat: 6.52 },
		{ code: 'nairobi', lon: 36.82, lat: -1.29 },
		{ code: 'dubai', lon: 55.27, lat: 25.2 },
		{ code: 'mumbai', lon: 72.88, lat: 19.08 },
		{ code: 'singapore', lon: 103.85, lat: 1.29 },
		{ code: 'jakarta', lon: 106.85, lat: -6.2 },
		{ code: 'bangkok', lon: 100.5, lat: 13.76 },
		{ code: 'hongkong', lon: 114.17, lat: 22.32 },
		{ code: 'tokyo', lon: 139.69, lat: 35.69 },
		{ code: 'seoul', lon: 126.98, lat: 37.57 },
		{ code: 'sydney', lon: 151.21, lat: -33.87 },
		{ code: 'auckland', lon: 174.76, lat: -36.85 }
	];

	// clickable visitors, people in cities WITHOUT their own CDN point, so the
	// delivery line from the nearest green point is always visible. Jayapura is
	// pinned to Jakarta because real traffic follows the domestic backbone.
	type Visitor = Spot & { prefer?: string };
	const VISITORS: Visitor[] = [
		{ code: 'surabaya', lon: 112.75, lat: -7.25 },
		{ code: 'jayapura', lon: 140.7, lat: -2.53, prefer: 'jakarta' },
		{ code: 'brisbane', lon: 153.03, lat: -27.47 },
		{ code: 'manchester', lon: -2.24, lat: 53.48 },
		{ code: 'riodejaneiro', lon: -43.17, lat: -22.9 },
		{ code: 'boston', lon: -71.06, lat: 42.36 }
	];

	// rough real-world round trip, distance does the talking
	function tripMs(a: Spot, b: Spot) {
		const km = geoDistance([a.lon, a.lat], [b.lon, b.lat]) * 6371;
		return Math.round(14 + km * 0.0165);
	}
	function nearestEdge(v: Visitor) {
		if (v.prefer) return EDGES.find((e) => e.code === v.prefer) ?? EDGES[0];
		return EDGES.reduce((best, e) => (tripMs(v, e) < tripMs(v, best) ? e : best));
	}

	let cdnOn = $state(false);
	let selected = $state<Visitor | null>(null);
	let served = $state<{ kind: 'origin' } | { kind: 'edge'; edge: Spot } | null>(null);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	let done = false;
	let ms = $state<number | null>(null);
	// the learner has to feel it both without and with the CDN before moving on
	let sawOrigin = $state(false);
	let sawEdge = $state(false);
	const compareDone = $derived(sawOrigin && sawEdge);
	const latency = new Tween(0, { duration: 650, easing: cubicOut });
	let loadTimer: ReturnType<typeof setTimeout> | undefined;

	function pick(v: Visitor) {
		selected = v;
		browser = 'loading';
		if (!cdnOn) {
			ms = tripMs(v, ORIGIN);
			served = { kind: 'origin' };
			sawOrigin = true;
			onstate?.('origin');
		} else {
			const edge = nearestEdge(v);
			ms = tripMs(v, edge);
			served = { kind: 'edge', edge };
			sawEdge = true;
			onstate?.('cached');
		}
		// unlock only once both states have been compared
		if (sawOrigin && sawEdge && !done) {
			done = true;
			oncomplete?.();
		}
		latency.target = ms;
		if (loadTimer) clearTimeout(loadTimer);
		loadTimer = setTimeout(() => (browser = 'loaded'), Math.min(1800, 250 + ms * 3));
	}

	function toggle() {
		cdnOn = !cdnOn;
		selected = null;
		served = null;
		ms = null;
		browser = 'idle';
		latency.target = 0;
		if (cdnOn) onstate?.('enabled');
	}

	type VKey = 'fast' | 'ok' | 'slow';
	const verdict = $derived<VKey | null>(
		ms === null ? null : ms <= 60 ? 'fast' : ms <= 170 ? 'ok' : 'slow'
	);
	const verdictText = $derived(
		verdict === 'fast' ? tx.verdictFast : verdict === 'ok' ? tx.verdictOk : tx.verdictSlow
	);
	const toneText: Record<VKey, string> = {
		fast: 'text-grass',
		ok: 'text-amber',
		slow: 'text-danger'
	};
	const toneBg: Record<VKey, string> = {
		fast: 'bg-grass-soft text-grass',
		ok: 'bg-amber-soft text-amber',
		slow: 'bg-danger-soft text-danger'
	};
	const toneHex: Record<VKey, string> = { fast: '#3a9c64', ok: '#dd9e36', slow: '#d3584a' };

	// ---- flat map projection (same crop as WorldMap, like the Region lesson) ----
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	function fx(lon: number) {
		return ((lon + 180) / 360) * FLAT_W;
	}
	function fy(lat: number) {
		return ((84 - lat) / 140) * FLAT_H;
	}
	function arc(a: Spot, b: Spot) {
		const x1 = fx(a.lon);
		const y1 = fy(a.lat);
		const x2 = fx(b.lon);
		const y2 = fy(b.lat);
		const lift = Math.max(16, Math.abs(x2 - x1) * 0.22);
		return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
	}
	// the sender draws the line, origin or the nearest green point, flowing toward the visitor
	const mainArc = $derived(
		!selected || !served
			? ''
			: served.kind === 'origin'
				? arc(ORIGIN, selected)
				: arc(served.edge, selected)
	);
	const activeEdgeCode = $derived(served?.kind === 'edge' ? served.edge.code : null);
	const ox = fx(ORIGIN.lon);
	const oy = fy(ORIGIN.lat);

	// who is sending (origin or the chosen edge), used to draw the globe delivery line
	const servedFrom = $derived<Spot | null>(
		!served ? null : served.kind === 'origin' ? ORIGIN : served.edge
	);
	// great-circle midpoint of the delivery line, where the latency tag sits on the globe
	function cdnTagPt(v: GlobeView): [number, number] | null {
		if (!selected || !servedFrom) return null;
		const m = geoInterpolate([servedFrom.lon, servedFrom.lat], [selected.lon, selected.lat])(0.5);
		return v.project(m[0], m[1]) ?? v.project(selected.lon, selected.lat);
	}
</script>

{#snippet cdnTag(px: number, py: number)}
	{@const c = verdict ? toneHex[verdict] : '#5e6b76'}
	<g transform="translate({px}, {py})" pointer-events="none">
		<g class="ltag">
			<rect
				x="-45"
				y="-26"
				width="90"
				height="44"
				rx="13"
				fill="#fff"
				stroke={c}
				stroke-width="2"
			/>
			<text x="0" y="-4" text-anchor="middle" font-weight="800" font-size="19" fill={c}
				>{Math.round(latency.current)}<tspan font-size="11" font-weight="600" fill="#5e6b76">
					{tx.ms}</tspan
				></text
			>
			<text x="0" y="12" text-anchor="middle" font-size="10.5" font-weight="700" fill={c}
				>{verdictText}</text
			>
		</g>
	</g>
{/snippet}

{#snippet cdnOverlay(v: GlobeView)}
	{#if cdnOn}
		{#each VISITORS as vv (vv.code)}
			{@const ne = nearestEdge(vv)}
			{@const d = v.path({
				type: 'LineString',
				coordinates: [
					[ne.lon, ne.lat],
					[vv.lon, vv.lat]
				]
			})}
			{#if d}<path
					{d}
					fill="none"
					stroke="#3a9c64"
					stroke-width="1.3"
					stroke-dasharray="none"
					stroke-linecap="round"
					opacity="0.32"
				/>{/if}
		{/each}
	{/if}

	{#if selected && servedFrom}
		{@const d = v.path({
			type: 'LineString',
			coordinates: [
				[servedFrom.lon, servedFrom.lat],
				[selected.lon, selected.lat]
			]
		})}
		{#if d}
			{#key `${selected.code}-${cdnOn}-${activeEdgeCode}`}
				<path
					{d}
					fill="none"
					stroke={served?.kind === 'edge' ? '#3a9c64' : '#2e6fe0'}
					stroke-width="2.5"
					stroke-dasharray="none"
					stroke-linecap="round"
					class="arcflow"
				/>
			{/key}
		{/if}
	{/if}

	{#if cdnOn}
		{#each EDGES as e (e.code)}
			{@const p = v.project(e.lon, e.lat)}
			{#if p}
				{#if activeEdgeCode === e.code}<circle
						cx={p[0]}
						cy={p[1]}
						r="9.5"
						fill="none"
						stroke="#3a9c64"
						stroke-width="2"
						opacity="0.55"
					/>{/if}
				<circle cx={p[0]} cy={p[1]} r="3.6" fill="#3a9c64" stroke="#fff" stroke-width="1.4" />
			{/if}
		{/each}
	{/if}

	{@const op = v.project(ORIGIN.lon, ORIGIN.lat)}
	{#if op}
		<g pointer-events="none">
			<rect
				x={op[0] - 7}
				y={op[1] - 7}
				width="14"
				height="14"
				rx="4"
				fill="#2e6fe0"
				stroke="#fff"
				stroke-width="1.6"
			/>
			<rect x={op[0] - 3.5} y={op[1] - 3} width="7" height="1.8" rx="0.9" fill="#fff" />
			<rect x={op[0] - 3.5} y={op[1] + 0.8} width="7" height="1.8" rx="0.9" fill="#fff" />
			<text
				x={op[0]}
				y={op[1] + 24}
				text-anchor="middle"
				fill="#2e6fe0"
				font-size="11.5"
				font-weight="700">{tx.originLabel}</text
			>
		</g>
	{/if}

	{#each VISITORS as vv (vv.code)}
		{@const p = v.project(vv.lon, vv.lat)}
		{#if p}
			{@const on = selected?.code === vv.code}
			<g
				class="pin"
				role="button"
				tabindex="0"
				aria-label={tx.cities[vv.code]}
				onclick={v.tap(() => pick(vv))}
				onkeydown={(e) => e.key === 'Enter' && pick(vv)}
			>
				<circle cx={p[0]} cy={p[1]} r="20" fill="transparent" />
				{#if !on}<circle
						cx={p[0]}
						cy={p[1]}
						r="10"
						fill="#dd9e36"
						opacity="0.3"
						class="breathe"
					/>{/if}
				<g transform="translate({p[0] - 8}, {p[1] - 9}) scale(0.7)" pointer-events="none">
					<circle cx="12" cy="8" r="4" fill={on ? '#2e6fe0' : '#16212b'} />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill={on ? '#2e6fe0' : '#16212b'} />
				</g>
				<text
					x={p[0]}
					y={p[1] + 21}
					text-anchor="middle"
					fill={on ? '#16212b' : '#5e6b76'}
					font-size={on ? 11.5 : 10}
					font-weight={on ? 700 : 600}>{tx.cities[vv.code]}</text
				>
			</g>
		{/if}
	{/each}

	{#if selected && servedFrom}
		{@const m = cdnTagPt(v)}
		{#if m}{@render cdnTag(m[0], m[1])}{/if}
	{/if}
{/snippet}

<!-- progress: the learner must compare a load without the CDN and one with it -->

<!-- small screens: a draggable globe with the CDN switch floating below -->
<div class="h-full w-full md:hidden">
	<div
		class="relative h-full w-full overflow-hidden rounded-2xl border border-line"
		style="background: #f1f6fc;"
	>
		<div
			class="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-full border border-line bg-card/85 px-2.5 py-1 text-[10.5px] font-bold backdrop-blur {cdnOn
				? 'text-grass'
				: 'text-faint'}"
		>
			<span class="inline-block h-2 w-2 rounded-full {cdnOn ? 'bg-grass' : 'bg-[#cfd6dd]'}"></span>
			{cdnOn ? tx.statusOn.replace('{n}', String(EDGES.length)) : tx.statusOff}
		</div>
		<Globe overlay={cdnOverlay} />
		{#if !compareDone}
			<div
				class="pointer-events-none absolute top-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
			>
				<div class="flex items-center justify-center gap-1.5">
					<span
						class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur transition-colors {sawOrigin
							? 'border-transparent bg-grass-soft text-grass'
							: 'border-line bg-card/85 text-faint'}"
						>{#if sawOrigin}<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
							>{:else}<span class="h-1.5 w-1.5 rounded-full border border-current opacity-60"
							></span>{/if}{tx.compare.off}</span
					>
					<span
						class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur transition-colors {sawEdge
							? 'border-transparent bg-grass-soft text-grass'
							: 'border-line bg-card/85 text-faint'}"
						>{#if sawEdge}<svg
								width="11"
								height="11"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="3.4"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
							>{:else}<span class="h-1.5 w-1.5 rounded-full border border-current opacity-60"
							></span>{/if}{tx.compare.on}</span
					>
				</div>
				{#if !selected}
					<span
						class="rounded-full border border-line bg-card/85 px-2.5 py-0.5 text-[10px] font-medium text-muted backdrop-blur"
						>{tx.compare.hint}</span
					>
				{/if}
			</div>
		{/if}
		<div class="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center">
			{#if !cdnOn}
				<div class="pointer-events-auto">
					<CallToActionButton onclick={toggle}>{tx.cdnOn}</CallToActionButton>
				</div>
			{:else}
				<button
					type="button"
					onclick={toggle}
					class="pointer-events-auto rounded-xl border border-line bg-card px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:brightness-110"
				>
					{tx.cdnOff}
				</button>
			{/if}
		</div>
	</div>
</div>

<!-- tablet and up: the full flat map with the phone preview, readout, and CDN switch -->
<div class="hidden h-full w-full flex-col gap-3 md:flex md:flex-row md:gap-4">
	<!-- World map, origin + CDN points + clickable visitors -->
	<div
		class="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-line"
		style="background: #f1f6fc;"
	>
		<!-- network status -->
		<div
			class="absolute top-2 left-2 z-10 flex items-center gap-1.5 rounded-full border border-line bg-card/85 px-2.5 py-1 text-[10.5px] font-bold backdrop-blur {cdnOn
				? 'text-grass'
				: 'text-faint'}"
		>
			<span class="inline-block h-2 w-2 rounded-full {cdnOn ? 'bg-grass' : 'bg-[#cfd6dd]'}"></span>
			{cdnOn ? tx.statusOn.replace('{n}', String(EDGES.length)) : tx.statusOff}
		</div>

		<svg
			viewBox="0 0 {FLAT_W} {FLAT_H}"
			class="h-full w-full"
			preserveAspectRatio="xMidYMid meet"
			role="img"
			aria-label="map"
		>
			<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
			<WorldMap />

			<!-- the network at a glance: every person wired to their nearest green point -->
			{#if cdnOn}
				{#each VISITORS as v (v.code)}
					<path
						d={arc(nearestEdge(v), v)}
						fill="none"
						stroke="#3a9c64"
						stroke-width="1.3"
						stroke-dasharray="none"
						stroke-linecap="round"
						opacity="0.32"
					/>
				{/each}
			{/if}

			<!-- the delivery: drawn from the sender, flowing toward the visitor -->
			{#if mainArc}
				{#key `${selected?.code}-${cdnOn}-${activeEdgeCode}`}
					<path
						d={mainArc}
						fill="none"
						stroke={served?.kind === 'edge' ? '#3a9c64' : '#2e6fe0'}
						stroke-width="2.5"
						stroke-dasharray="none"
						stroke-linecap="round"
						class="arcflow"
					/>
				{/key}
			{/if}

			<!-- CDN points, the whole network appears at once -->
			{#if cdnOn}
				{#each EDGES as e, i (e.code)}
					{@const x = fx(e.lon)}
					{@const y = fy(e.lat)}
					<g class="edge" style="animation-delay:{i * 28}ms">
						{#if activeEdgeCode === e.code}
							<circle
								cx={x}
								cy={y}
								r="9.5"
								fill="none"
								stroke="#3a9c64"
								stroke-width="2"
								opacity="0.55"
							/>
						{/if}
						<circle cx={x} cy={y} r="3.6" fill="#3a9c64" stroke="#fff" stroke-width="1.4" />
					</g>
				{/each}
			{/if}

			<!-- the origin server -->
			<g pointer-events="none">
				<rect
					x={ox - 7}
					y={oy - 7}
					width="14"
					height="14"
					rx="4"
					fill="#2e6fe0"
					stroke="#fff"
					stroke-width="1.6"
				/>
				<rect x={ox - 3.5} y={oy - 3} width="7" height="1.8" rx="0.9" fill="#fff" />
				<rect x={ox - 3.5} y={oy + 0.8} width="7" height="1.8" rx="0.9" fill="#fff" />
				<text
					x={ox}
					y={oy + 24}
					text-anchor="middle"
					fill="#2e6fe0"
					font-size="11.5"
					font-weight="700">{tx.originLabel}</text
				>
			</g>

			<!-- the visitors, people you can click -->
			{#each VISITORS as v (v.code)}
				{@const x = fx(v.lon)}
				{@const y = fy(v.lat)}
				{@const on = selected?.code === v.code}
				<g
					class="pin"
					role="button"
					tabindex="0"
					aria-label={tx.cities[v.code]}
					onclick={() => pick(v)}
					onkeydown={(e) => e.key === 'Enter' && pick(v)}
				>
					<circle cx={x} cy={y} r="20" fill="transparent" />
					{#if !on}
						<circle cx={x} cy={y} r="10" fill="#dd9e36" opacity="0.3" class="breathe" />
					{/if}
					<g transform="translate({x - 8}, {y - 9}) scale(0.7)" pointer-events="none">
						<circle cx="12" cy="8" r="4" fill={on ? '#2e6fe0' : '#16212b'} />
						<path d="M4 21a8 8 0 0 1 16 0Z" fill={on ? '#2e6fe0' : '#16212b'} />
					</g>
					<text
						{x}
						y={y + 21}
						text-anchor="middle"
						fill={on ? '#16212b' : '#5e6b76'}
						font-size={on ? 11.5 : 10}
						font-weight={on ? 700 : 600}>{tx.cities[v.code]}</text
					>
				</g>
			{/each}
		</svg>

		<!-- legend -->
		<div
			class="pointer-events-none absolute bottom-2 left-2 z-10 flex items-center gap-3 rounded-full border border-line bg-card/85 px-3 py-1 text-[9.5px] font-semibold text-muted backdrop-blur"
		>
			<span class="flex items-center gap-1"
				><span class="inline-block h-2.5 w-2.5 rounded-full border-2 border-ink bg-card"
				></span>{tx.visitorsLabel}</span
			>
			<span class="flex items-center gap-1"
				><span class="inline-block h-2.5 w-2.5 rounded-[3px] bg-brand"></span>{tx.originLabel}</span
			>
			{#if cdnOn}
				<span class="flex items-center gap-1"
					><span class="inline-block h-2 w-2 rounded-full bg-grass"></span>{tx.edgeLabel}</span
				>
			{/if}
		</div>
	</div>

	<!-- phone, readout, and the CDN switch -->
	<div class="flex shrink-0 flex-col items-center justify-center gap-3 md:w-[210px]">
		<div class="flex flex-row items-center gap-4 md:flex-col md:gap-3">
			<Browser phase={browser} />
			<LocationComparisonCard
				tx={{ compare: { near: tx.compare.off, far: tx.compare.on, hint: tx.compare.hint } }}
				{compareDone}
				nearTested={sawOrigin}
				farTested={sawEdge}
				hintCompact={!!selected}
			>
				{#if selected && served && ms !== null && verdict}
					<p class="text-sm font-semibold text-ink">{tx.cities[selected.code]}</p>
					<p class="text-[10.5px] leading-snug text-faint">
						{served.kind === 'origin'
							? tx.servedOrigin
							: tx.servedEdge.replace('{city}', tx.cities[served.edge.code])}
					</p>
					<p class="mt-2 text-3xl font-bold tabular-nums {toneText[verdict]}">
						{Math.round(latency.current)}<span class="text-sm font-medium text-muted">
							{tx.ms}</span
						>
					</p>
					<span
						class="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold {toneBg[
							verdict
						]}"
					>
						{verdictText}
					</span>
					{#if served.kind === 'edge'}
						<p class="mt-1.5 text-[10px] font-semibold text-grass">{tx.hitChip}</p>
					{/if}
				{:else if compareDone}
					<p class="text-sm text-faint">{tx.readoutPrompt}</p>
				{/if}
			</LocationComparisonCard>
		</div>
		{#if !cdnOn}
			<CallToActionButton onclick={toggle}>{tx.cdnOn}</CallToActionButton>
		{:else}
			<button
				type="button"
				onclick={toggle}
				class="rounded-xl border border-line bg-card px-6 py-2.5 text-sm font-semibold text-faint transition-all hover:brightness-110"
			>
				{tx.cdnOff}
			</button>
		{/if}
	</div>
</div>

<style>
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:hover text {
		fill: #16212b;
	}
	.ltag {
		filter: drop-shadow(0 5px 12px rgba(22, 40, 60, 0.18));
		animation: tag-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes tag-in {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.breathe {
		transform-box: fill-box;
		transform-origin: center;
		animation: breathe 2s ease-in-out infinite;
	}
	@keyframes breathe {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.6);
			opacity: 0.08;
		}
	}
	.edge {
		transform-box: fill-box;
		transform-origin: center;
		animation: popin 0.4s ease backwards;
	}
	@keyframes popin {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.arcflow {
		animation:
			arcin 0.45s ease both,
			flowdash 0.8s linear infinite;
	}
	@keyframes arcin {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes flowdash {
		to {
			stroke-dashoffset: -13;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.breathe,
		.edge,
		.arcflow {
			animation-duration: 0.01s;
		}
	}
</style>
