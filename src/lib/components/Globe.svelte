<script lang="ts">
	// Reusable draggable globe, shared by every world-map lesson on small screens where a
	// wide flat map would shrink to nothing. The parent draws its own pins/arcs through the
	// `overlay` snippet, which receives projection helpers tied to the current rotation.
	import { untrack, type Snippet } from 'svelte';
	import {
		geoOrthographic,
		geoPath,
		geoGraticule10,
		geoDistance,
		type GeoPermissibleObjects
	} from 'd3-geo';
	import landData from '$lib/data/land-110m.json';
	export type GlobeView = {
		project: (lon: number, lat: number) => [number, number] | null;
		path: (geo: GeoPermissibleObjects) => string;
		visible: (lon: number, lat: number) => boolean;
		// wrap a click handler so a drag never counts as a tap on a pin
		tap: (fn: () => void) => () => void;
		size: number;
		// true while the user is spinning the globe; overlays can skip heavy detail then
		dragging: boolean;
	};

	let {
		size = 420,
		rotate = [52, 18],
		overlay
	}: { size?: number; rotate?: [number, number]; overlay?: Snippet<[GlobeView]> } = $props();
	const land = landData as unknown as GeoPermissibleObjects;
	const graticule = geoGraticule10();

	// initial orientation only; dragging takes over from here
	let rotL = $state(untrack(() => rotate[0]));
	let rotP = $state(untrack(() => rotate[1]));
	const projection = $derived(
		geoOrthographic()
			.scale(size / 2 - 8)
			.translate([size / 2, size / 2])
			.rotate([rotL, rotP])
			.clipAngle(90)
	);
	const pathGen = $derived(geoPath(projection));
	const landPath = $derived(pathGen(land) ?? '');
	const gratPath = $derived(pathGen(graticule) ?? '');

	let suppressClick = false;
	function project(lon: number, lat: number): [number, number] | null {
		if (geoDistance([lon, lat], [-rotL, -rotP]) > Math.PI / 2) return null;
		return projection([lon, lat]) ?? null;
	}
	function visible(lon: number, lat: number) {
		return geoDistance([lon, lat], [-rotL, -rotP]) <= Math.PI / 2;
	}
	function path(geo: GeoPermissibleObjects) {
		return pathGen(geo) ?? '';
	}
	function tap(fn: () => void) {
		return () => {
			if (!suppressClick) fn();
		};
	}

	let dragging = $state(false);
	let lastX = 0;
	let lastY = 0;
	function down(e: PointerEvent) {
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		suppressClick = false;
		(e.target as Element).setPointerCapture?.(e.pointerId);
	}
	function move(e: PointerEvent) {
		if (!dragging) return;
		const dx = e.clientX - lastX;
		const dy = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;
		if (Math.abs(dx) + Math.abs(dy) > 3) suppressClick = true;
		rotL += dx * 0.45;
		rotP = Math.max(-85, Math.min(85, rotP - dy * 0.45));
	}
	function up() {
		dragging = false;
	}

	// Re-created whenever the rotation (or drag state) changes so the overlay reprojects as the globe spins.
	const view = $derived<GlobeView>({
		project,
		path,
		visible,
		tap,
		size,
		dragging,
		r: [rotL, rotP]
	} as GlobeView & {
		r: number[];
	});
</script>

<svg
	viewBox="0 0 {size} {size}"
	class="globe h-full w-full"
	class:grabbing={dragging}
	preserveAspectRatio="xMidYMid meet"
	role="img"
	aria-label="globe"
	onpointerdown={down}
	onpointermove={move}
	onpointerup={up}
	onpointerleave={up}
>
	<circle
		cx={size / 2}
		cy={size / 2}
		r={size / 2 - 8}
		fill="#bcd6ef"
		style="filter: drop-shadow(0 10px 24px rgba(22,40,60,0.14));"
	/>
	<path d={gratPath} fill="none" stroke="#a9c8e8" stroke-width="0.5" opacity="0.7" />
	<path d={landPath} fill="#eaf2fc" stroke="#cdddf0" stroke-width="0.6" />
	{@render overlay?.(view)}
</svg>

<style>
	.globe {
		cursor: grab;
		touch-action: none;
	}
	.globe.grabbing {
		cursor: grabbing;
	}
</style>
