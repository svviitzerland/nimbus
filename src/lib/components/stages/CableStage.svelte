<script module lang="ts">
	// Static map geometry, built once for all instances. Keeping the heavy ~200KB string
	// build at module scope means it runs at import, not on every navigation to this lesson.
	import cablesData from '$lib/data/cables.json';
	import landingData from '$lib/data/landing-points.json';
	import routesData from '$lib/data/routes.json';

	// equirectangular, cropped 84N..56S to match WorldMap and RegionStage
	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const fx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const fy = (lat: number) => ((84 - lat) / 140) * FLAT_H;
	const cableLines = cablesData as unknown as number[][][];
	// One combined path for every cable (each line is its own M-subpath), so the stage
	// mounts as a couple of DOM nodes instead of ~1900.
	const cableD = cableLines
		.map(
			(line) =>
				'M' + line.map(([lon, lat]) => `${fx(lon).toFixed(1)} ${fy(lat).toFixed(1)}`).join('L')
		)
		.join(' ');
	// Same cables as a geometry, projected live onto the globe (drawn only when the globe is still).
	const CABLE_GEO = { type: 'MultiLineString' as const, coordinates: cableLines };
	// All landing stations as one path of round-capped zero-length dots.
	const landingD = (landingData as unknown as number[][])
		.filter(([, lat]) => lat <= 84 && lat >= -56)
		.map(([lon, lat]) => `M${fx(lon).toFixed(1)} ${fy(lat).toFixed(1)}l0 0`)
		.join('');

	// Data routes [lon, lat] per destination, generated from the real cable graph (Dijkstra
	// between corridor guide points) by scripts/generate-cables.mjs. Pre-flattened with
	// cumulative lengths so the packet can be positioned by arc length while it animates.
	const ROUTES = routesData as unknown as Record<string, [number, number][]>;
	type RouteGeom = { flat: [number, number][]; cum: number[]; total: number };
	const routeGeom: Record<string, RouteGeom> = {};
	for (const [code, pts] of Object.entries(ROUTES)) {
		const flat = pts.map(([lon, lat]) => [fx(lon), fy(lat)] as [number, number]);
		const cum = [0];
		for (let i = 1; i < flat.length; i++) {
			cum.push(cum[i - 1] + Math.hypot(flat[i][0] - flat[i - 1][0], flat[i][1] - flat[i - 1][1]));
		}
		routeGeom[code] = { flat, cum, total: cum[cum.length - 1] || 1 };
	}
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Tween } from 'svelte/motion';
	import { cubicInOut } from 'svelte/easing';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import Globe from '../Globe.svelte';
	import LocationComparisonCard from '../LocationComparisonCard.svelte';
	import type { GlobeView } from '../Globe.svelte';
	import type { LessonText, CableText } from '$lib/chapters/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CableText);

	const users = { lon: -58.4, lat: -34.6 }; // Buenos Aires, Argentina
	const userPt: [number, number] = [fx(users.lon), fy(users.lat)];

	type Dest = { code: string; lon: number; lat: number; kind: 'near' | 'far'; dur: number };
	const dests: Dest[] = [
		{ code: 'sa-east-1', lon: -46.6, lat: -23.5, kind: 'near', dur: 1700 },
		{ code: 'eu-central-1', lon: 8.68, lat: 50.1, kind: 'far', dur: 3200 },
		{ code: 'ap-northeast-1', lon: 139.7, lat: 35.7, kind: 'far', dur: 4500 }
	];
	const kindByCode = new Map(dests.map((d) => [d.code, d.kind]));

	let selected = $state<Dest | null>(null);
	let tried = $state<string[]>([]);
	let fired = false;
	let sending = $state(false);
	let browser = $state<'idle' | 'loading' | 'loaded'>('idle');
	const t = new Tween(0, { duration: 1700, easing: cubicInOut });

	// the learner has to send to a near destination AND a far one before moving on
	const nearTested = $derived(tried.some((c) => kindByCode.get(c) === 'near'));
	const farTested = $derived(tried.some((c) => kindByCode.get(c) === 'far'));
	const compareDone = $derived(nearTested && farTested);

	const route = $derived(selected ? (routeGeom[selected.code] ?? null) : null);
	const routePath = $derived(
		route ? 'M' + route.flat.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('L') : ''
	);
	// position along the real route by arc length, so the packet hugs the cables
	function pointAt(g: RouteGeom, frac: number): [number, number] {
		const target = frac * g.total;
		let i = 1;
		while (i < g.cum.length && g.cum[i] < target) i++;
		if (i >= g.flat.length) return g.flat[g.flat.length - 1];
		const seg = g.cum[i] - g.cum[i - 1] || 1;
		const lt = (target - g.cum[i - 1]) / seg;
		const a = g.flat[i - 1];
		const b = g.flat[i];
		return [a[0] + (b[0] - a[0]) * lt, a[1] + (b[1] - a[1]) * lt];
	}
	const packet = $derived(route ? pointAt(route, t.current) : null);
	// same idea in lon/lat, so the packet can ride the route on the globe too
	function lonLatAt(code: string, frac: number): [number, number] | null {
		const g = routeGeom[code];
		const pts = ROUTES[code];
		if (!g || !pts) return null;
		const target = frac * g.total;
		let i = 1;
		while (i < g.cum.length && g.cum[i] < target) i++;
		if (i >= pts.length) return pts[pts.length - 1];
		const seg = g.cum[i] - g.cum[i - 1] || 1;
		const lt = (target - g.cum[i - 1]) / seg;
		const a = pts[i - 1];
		const b = pts[i];
		return [a[0] + (b[0] - a[0]) * lt, a[1] + (b[1] - a[1]) * lt];
	}
	const packetLL = $derived(selected ? lonLatAt(selected.code, t.current) : null);

	const phase = $derived<'idle' | 'leaving' | 'undersea' | 'arrived'>(
		!selected ? 'idle' : !sending ? 'arrived' : t.current < 0.12 ? 'leaving' : 'undersea'
	);

	async function send(d: Dest) {
		if (sending) return;
		selected = d;
		sending = true;
		browser = 'loading';
		onstate?.('leaving');
		await t.set(0, { duration: 0 });
		await t.set(0.12, { duration: d.dur * 0.12 });
		onstate?.('undersea');
		await t.set(1, { duration: d.dur * 0.88 });
		sending = false;
		browser = 'loaded';
		onstate?.(d.kind);
		if (!tried.includes(d.code)) tried = [...tried, d.code];
		// unlock only after sending to both a near and a far destination
		const near = tried.some((c) => kindByCode.get(c) === 'near');
		const far = tried.some((c) => kindByCode.get(c) === 'far');
		if (near && far && !fired) {
			fired = true;
			oncomplete?.();
		}
	}

	onDestroy(() => t.set(t.current, { duration: 0 }));
</script>

{#snippet cableOverlay(v: GlobeView)}
	<!-- the real undersea cables, the highlight of this lesson; skipped mid-spin to stay smooth -->
	{#if !v.dragging}
		{@const cd = v.path(CABLE_GEO)}
		{#if cd}<path
				d={cd}
				fill="none"
				stroke="#3f7fd6"
				stroke-width="0.45"
				stroke-linecap="round"
				stroke-linejoin="round"
				opacity="0.4"
			/>{/if}
	{/if}

	{#if selected}
		{@const d = v.path({ type: 'LineString', coordinates: ROUTES[selected.code] ?? [] })}
		{#if d}<path
				{d}
				fill="none"
				stroke="#2e6fe0"
				stroke-width="2.5"
				stroke-linecap="round"
				opacity="0.9"
			/>{/if}
	{/if}
	{#if packetLL}
		{@const pp = v.project(packetLL[0], packetLL[1])}
		{#if pp}
			<circle cx={pp[0]} cy={pp[1]} r="9" fill="#2e6fe0" opacity="0.2" />
			<circle cx={pp[0]} cy={pp[1]} r="4.5" fill="#2e6fe0" />
		{/if}
	{/if}
	{#each dests as d (d.code)}
		{@const p = v.project(d.lon, d.lat)}
		{#if p}
			<g
				class="pin"
				role="button"
				tabindex="0"
				aria-label={tx.dests[d.code]}
				onclick={v.tap(() => send(d))}
				onkeydown={(e) => e.key === 'Enter' && send(d)}
			>
				<circle cx={p[0]} cy={p[1]} r="13" fill="transparent" />
				<circle
					cx={p[0]}
					cy={p[1]}
					r="6"
					fill={selected?.code === d.code ? '#2e6fe0' : '#fff'}
					stroke="#2e6fe0"
					stroke-width="2.5"
				/>
				<text
					x={p[0]}
					y={p[1] - 11}
					text-anchor="middle"
					fill="#16212b"
					font-size="12.5"
					font-weight="600">{tx.dests[d.code]}</text
				>
			</g>
		{/if}
	{/each}
	{@const upt = v.project(users.lon, users.lat)}
	{#if upt}
		<circle cx={upt[0]} cy={upt[1]} r="12" fill="#dd9e36" opacity="0.25" class="pulse" />
		<circle cx={upt[0]} cy={upt[1]} r="6.5" fill="#16212b" />
		<text
			x={upt[0]}
			y={upt[1] + 26}
			text-anchor="middle"
			fill="#16212b"
			font-size="13"
			font-weight="700">{tx.users}</text
		>
	{/if}
{/snippet}

<!-- progress: the learner must send to a near and a far destination before moving on -->
{#snippet stepChip(label: string, done: boolean)}
	<span
		class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur transition-colors {done
			? 'border-transparent bg-grass-soft text-grass'
			: 'border-line bg-card text-faint'}"
	>
		{#if done}
			<svg
				width="11"
				height="11"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="3.4"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
			>
		{:else}
			<span class="h-1.5 w-1.5 rounded-full border border-current opacity-60"></span>
		{/if}
		{label}
	</span>
{/snippet}

{#snippet compareChips()}
	<div class="flex items-center justify-center gap-1.5">
		{@render stepChip(tx.compare.near, nearTested)}
		{@render stepChip(tx.compare.far, farTested)}
	</div>
{/snippet}

<!-- small screens: a draggable globe instead of the tiny wide map -->
<div class="h-full w-full md:hidden">
	<div
		class="relative h-full w-full overflow-hidden rounded-2xl border border-line"
		style="background: #eef4fb;"
	>
		<Globe overlay={cableOverlay} />
		<div
			class="pointer-events-none absolute top-2 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
		>
			{#if !compareDone}{@render compareChips()}{/if}
			{#if selected}
				<div
					class="rounded-full border border-line bg-card/85 px-3 py-1 text-[11px] font-semibold text-ink backdrop-blur"
				>
					{#if phase === 'leaving'}{tx.phases.leaving}{:else if phase === 'undersea'}{tx.phases
							.undersea}{:else}{tx.phases.arrived}{/if}
				</div>
			{:else if !compareDone}
				<div
					class="rounded-full border border-line bg-card/85 px-2.5 py-0.5 text-[10px] font-medium text-muted backdrop-blur"
				>
					{tx.compare.hint}
				</div>
			{/if}
		</div>
		<p
			class="pointer-events-none absolute inset-x-0 bottom-1.5 text-center text-[10px] text-faint opacity-75"
		>
			* {tx.routeNote}
		</p>
	</div>
</div>

<!-- tablet and up: the full flat cable map with the phone preview -->
<div class="hidden h-full w-full flex-col gap-4 md:flex md:flex-row">
	<!-- Map -->
	<div
		class="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-line"
		style="background: #eef4fb;"
	>
		<svg
			viewBox="0 0 {FLAT_W} {FLAT_H}"
			class="h-full w-full"
			preserveAspectRatio="xMidYMid meet"
			role="img"
			aria-label="undersea cable map"
		>
			<rect width={FLAT_W} height={FLAT_H} fill="#eef4fb" />
			<WorldMap />

			<!-- real undersea cables (one combined path) -->
			<path
				d={cableD}
				fill="none"
				stroke="#3f7fd6"
				stroke-width="0.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				opacity="0.4"
			/>

			<!-- landing stations (one combined path of dots) -->
			<path
				d={landingD}
				fill="none"
				stroke="#6f86a6"
				stroke-width="1.4"
				stroke-linecap="round"
				opacity="0.5"
			/>

			<!-- active route + travelling packet -->
			{#if routePath}
				<path
					d={routePath}
					fill="none"
					stroke="#2e6fe0"
					stroke-width="2.5"
					stroke-linecap="round"
					opacity="0.9"
				/>
			{/if}
			{#if packet}
				<circle cx={packet[0]} cy={packet[1]} r="9" fill="#2e6fe0" opacity="0.2" />
				<circle cx={packet[0]} cy={packet[1]} r="4.5" fill="#2e6fe0" />
			{/if}

			<!-- destinations -->
			{#each dests as d (d.code)}
				<g
					class="pin"
					role="button"
					tabindex="0"
					aria-label={tx.dests[d.code]}
					onclick={() => send(d)}
					onkeydown={(e) => e.key === 'Enter' && send(d)}
				>
					<circle cx={fx(d.lon)} cy={fy(d.lat)} r="12" fill="transparent" />
					<circle
						cx={fx(d.lon)}
						cy={fy(d.lat)}
						r="6"
						fill={selected?.code === d.code ? '#2e6fe0' : '#fff'}
						stroke="#2e6fe0"
						stroke-width="2.5"
					/>
					<text
						x={fx(d.lon)}
						y={fy(d.lat) - 11}
						text-anchor="middle"
						fill="#16212b"
						font-size="12.5"
						font-weight="600">{tx.dests[d.code]}</text
					>
				</g>
			{/each}

			<!-- user -->
			<circle cx={userPt[0]} cy={userPt[1]} r="12" fill="#dd9e36" opacity="0.25" class="pulse" />
			<circle cx={userPt[0]} cy={userPt[1]} r="6.5" fill="#16212b" />
			<text
				x={userPt[0]}
				y={userPt[1] + 26}
				text-anchor="middle"
				fill="#16212b"
				font-size="13"
				font-weight="700">{tx.users}</text
			>
		</svg>

		<!-- route disclaimer + attribution -->
		<p
			class="pointer-events-none absolute inset-x-0 bottom-1.5 text-center text-[10px] text-faint opacity-75"
		>
			* {tx.routeNote}
		</p>
		<p class="pointer-events-none absolute right-2 bottom-1.5 text-[10px] text-faint opacity-70">
			{tx.credit}
		</p>
	</div>

	<!-- Phone + readout (desktop only; small screens use the globe above) -->
	<div
		class="flex shrink-0 flex-row items-center justify-center gap-4 md:w-[200px] md:flex-col md:justify-center"
	>
		<Browser phase={browser} />
		<LocationComparisonCard {tx} {compareDone} {nearTested} {farTested} hintCompact={!!selected}>
			{#if selected}
				<p class="text-sm font-semibold text-ink">{tx.dests[selected.code]}</p>
				<p class="text-[11px] text-faint">{selected.code}</p>
				<p class="mt-2 text-sm font-medium text-ink">
					{#if phase === 'leaving'}{tx.phases.leaving}{:else if phase === 'undersea'}{tx.phases
							.undersea}{:else}{tx.phases.arrived}{/if}
				</p>
				{#if !sending}<p class="mt-2 text-[11px] text-faint">{tx.again}</p>{/if}
			{:else if compareDone}
				<p class="text-sm text-faint">{tx.prompt}</p>
				<p class="mt-3 text-[11px] text-faint">{tx.cablesNote}</p>
			{/if}
		</LocationComparisonCard>
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
		stroke-width: 3.5;
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
			opacity: 0.25;
		}
		50% {
			transform: scale(1.7);
			opacity: 0.05;
		}
	}
</style>
