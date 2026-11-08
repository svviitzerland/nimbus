// Regenerates the Cable lesson data from TeleGeography's public Submarine Cable Map API:
//   - src/lib/data/cables.json         all cable lines (antimeridian-split for the flat map)
//   - src/lib/data/landing-points.json landing stations
//   - src/lib/data/routes.json         the data packet route to each destination
//
// Routes are CONSTRAINED: a few corridor guide points are defined per destination, and the
// path between consecutive guides is found by Dijkstra over the real cable graph, so every
// sea leg lies on actual cables. Where two guides are in different cable components (the
// Mediterranean and the Red Sea are only joined by the terrestrial crossing of Egypt), the
// leg falls back to a straight line, which represents that real land hop. Verify the result
// with: bun scripts/verify-routes.mjs
//
// Data: TeleGeography (https://www.submarinecablemap.com), shown with attribution.
//   Usage:  bun scripts/generate-cables.mjs
//
import { writeFileSync } from 'node:fs';

const CABLES = 'https://www.submarinecablemap.com/api/v3/cable/cable-geo.json';
const POINTS = 'https://www.submarinecablemap.com/api/v3/landing-point/landing-point-geo.json';
const r = (n) => Math.round(n * 100) / 100;

// Buenos Aires source and the corridor guide points per destination (keep in sync with the
// dests in CableStage.svelte). Each leg between guides is routed on real cables by Dijkstra,
// except guides flagged { land: true }, where the hop into it is a straight terrestrial line.
const SRC = [-58.4, -34.6];
const PLANS = {
	'sa-east-1': [{ at: SRC }, { at: [-46.6, -23.5] }],
	'eu-central-1': [{ at: SRC }, { at: [-38.5, -3.7] }, { at: [8.68, 50.1] }], // via Fortaleza (EllaLink)
	'ap-northeast-1': [
		{ at: SRC },
		{ at: [-38.5, -3.7] }, // Fortaleza
		{ at: [32.3, 31.3] }, // Port Said (Mediterranean)
		{ at: [32.5, 29.9], land: true }, // Suez (Red Sea): the terrestrial Egypt crossing
		{ at: [77.0, 6.0] }, // south of India
		{ at: [100.0, 2.5] }, // Strait of Malacca / Singapore
		{ at: [139.7, 35.7] } // Tokyo
	]
};

const R = 6371;
const toRad = (d) => (d * Math.PI) / 180;
function dist(a, b) {
	const dLat = toRad(b[1] - a[1]);
	const dLon = toRad(b[0] - a[0]);
	const la1 = toRad(a[1]);
	const la2 = toRad(b[1]);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
	return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const cableGeo = await (await fetch(CABLES)).json();

// ---- bundled cable lines (split at the antimeridian so they do not streak the flat map) ----
const lines = [];
for (const f of cableGeo.features) {
	for (const line of f.geometry.coordinates) {
		let seg = [];
		let last = null;
		for (const [lonRaw, latRaw] of line) {
			const lon = r(lonRaw);
			const lat = r(latRaw);
			if (last) {
				if (Math.abs(lon - last[0]) > 180) {
					if (seg.length > 1) lines.push(seg);
					seg = [];
				} else if (lon === last[0] && lat === last[1]) {
					continue;
				}
			}
			seg.push([lon, lat]);
			last = [lon, lat];
		}
		if (seg.length > 1) lines.push(seg);
	}
}

// ---- routing graph (built from un-split lines so trans-ocean cables stay connected) ----
const nodes = new Map();
const coords = [];
const adj = [];
function nid(lon, lat) {
	const k = lon + ',' + lat;
	let id = nodes.get(k);
	if (id === undefined) {
		id = coords.length;
		coords.push([lon, lat]);
		adj.push(new Map());
		nodes.set(k, id);
	}
	return id;
}
function edge(a, b) {
	if (a === b) return;
	const w = dist(coords[a], coords[b]);
	const e = adj[a].get(b);
	if (e === undefined || w < e) {
		adj[a].set(b, w);
		adj[b].set(a, w);
	}
}
for (const f of cableGeo.features) {
	for (const line of f.geometry.coordinates) {
		let prev = null;
		for (const [lonRaw, latRaw] of line) {
			const id = nid(r(lonRaw), r(latRaw));
			if (prev !== null && prev !== id) edge(prev, id);
			prev = id;
		}
	}
}
// snap nearby vertices across cables so the network connects at landing stations
const CELL = 0.5;
const SNAP = 45; // km
const buckets = new Map();
coords.forEach((c, i) => {
	const k = Math.floor(c[0] / CELL) + ':' + Math.floor(c[1] / CELL);
	if (!buckets.has(k)) buckets.set(k, []);
	buckets.get(k).push(i);
});
for (let i = 0; i < coords.length; i++) {
	const [lon, lat] = coords[i];
	const bx = Math.floor(lon / CELL);
	const by = Math.floor(lat / CELL);
	for (let dx = -1; dx <= 1; dx++)
		for (let dy = -1; dy <= 1; dy++) {
			const arr = buckets.get(bx + dx + ':' + (by + dy));
			if (!arr) continue;
			for (const j of arr) {
				if (j <= i) continue;
				if (dist(coords[i], coords[j]) <= SNAP) edge(i, j);
			}
		}
}

function nearest(pt, reach) {
	let best = -1;
	let bd = Infinity;
	for (let i = 0; i < coords.length; i++) {
		if (reach && !isFinite(reach[i])) continue;
		const d = dist(pt, coords[i]);
		if (d < bd) {
			bd = d;
			best = i;
		}
	}
	return best;
}

class Heap {
	constructor() {
		this.a = [];
	}
	push(x) {
		const a = this.a;
		a.push(x);
		let i = a.length - 1;
		while (i > 0) {
			const p = (i - 1) >> 1;
			if (a[p][0] <= a[i][0]) break;
			[a[p], a[i]] = [a[i], a[p]];
			i = p;
		}
	}
	pop() {
		const a = this.a;
		const top = a[0];
		const last = a.pop();
		if (a.length) {
			a[0] = last;
			let i = 0;
			for (;;) {
				const l = 2 * i + 1;
				const rr = 2 * i + 2;
				let s = i;
				if (l < a.length && a[l][0] < a[s][0]) s = l;
				if (rr < a.length && a[rr][0] < a[s][0]) s = rr;
				if (s === i) break;
				[a[s], a[i]] = [a[i], a[s]];
				i = s;
			}
		}
		return top;
	}
	get size() {
		return this.a.length;
	}
}
function dijkstra(srcId) {
	const distTo = new Float64Array(coords.length).fill(Infinity);
	const prev = new Int32Array(coords.length).fill(-1);
	distTo[srcId] = 0;
	const h = new Heap();
	h.push([0, srcId]);
	while (h.size) {
		const [d, u] = h.pop();
		if (d > distTo[u]) continue;
		for (const [v, w] of adj[u]) {
			const nd = d + w;
			if (nd < distTo[v]) {
				distTo[v] = nd;
				prev[v] = u;
				h.push([nd, v]);
			}
		}
	}
	return { distTo, prev };
}

const srcNode = nearest(SRC);
const reach = dijkstra(srcNode).distTo;

// Route through the guide points. Each guide is snapped to the nearest cable node reachable
// from the source, so cable legs always connect; a guide flagged { land: true } is reached by
// a straight line instead (a real terrestrial hop, e.g. across Egypt between Med and Red Sea).
function buildRoute(points) {
	const node = points.map((p) => nearest(p.at, reach));
	const seq = [node[0]];
	let landHops = 0;
	for (let i = 1; i < points.length; i++) {
		if (points[i].land) {
			seq.push(node[i]);
			landHops++;
			continue;
		}
		const { distTo, prev } = dijkstra(node[i - 1]);
		if (isFinite(distTo[node[i]]) && node[i] !== node[i - 1]) {
			const seg = [];
			for (let n = node[i]; n !== -1 && n !== node[i - 1]; n = prev[n]) seg.push(n);
			seg.reverse();
			seq.push(...seg);
		} else {
			seq.push(node[i]);
			landHops++;
		}
	}
	const route = [
		points[0].at.slice(),
		...seq.map((n) => coords[n]),
		points[points.length - 1].at.slice()
	];
	return { route, landHops };
}

const routes = {};
for (const [code, plan] of Object.entries(PLANS)) {
	const { route, landHops } = buildRoute(plan);
	routes[code] = route.map(([lon, lat]) => [r(lon), r(lat)]);
	console.log(`route ${code}: ${route.length} pts, ${landHops} land hop(s)`);
}

// ---- landing points ----
const pointGeo = await (await fetch(POINTS)).json();
const points = pointGeo.features
	.filter((f) => f.geometry?.type === 'Point')
	.map((f) => [r(f.geometry.coordinates[0]), r(f.geometry.coordinates[1])]);

const dir = new URL('../src/lib/data/', import.meta.url);
writeFileSync(new URL('cables.json', dir), JSON.stringify(lines));
writeFileSync(new URL('landing-points.json', dir), JSON.stringify(points));
writeFileSync(new URL('routes.json', dir), JSON.stringify(routes));
console.log(
	`cables.json: ${lines.length} lines | landing-points.json: ${points.length} points | graph: ${coords.length} nodes (reach ${reach.filter((d) => isFinite(d)).length})`
);
