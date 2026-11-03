// Pure helpers for the simulated RouterOS shared by the MikroTik Lab lessons (router-ip,
// router-nat, router-firewall, router-queue, router-hotspot). No browser APIs here, so it is
// safe on the server.

export type RosCmd = { kind: 'cmd'; id: string };
export type RosMenu = { kind: 'menu'; kids: Record<string, RosNode> };
export type RosNode = RosCmd | RosMenu;
export const cmd = (id: string): RosCmd => ({ kind: 'cmd', id });
export const menu = (kids: Record<string, RosNode>): RosMenu => ({ kind: 'menu', kids });

export type Arg = { k: string; v: string; col: number };
export type Word = { w: string; col: number };

// RouterOS accepts any unique prefix of a word (e.g. "/ip fire nat pr").
export function matchKey(keys: string[], w: string): string | 'ambiguous' | null {
	if (keys.includes(w)) return w;
	const hits = keys.filter((k) => k.startsWith(w));
	if (hits.length === 1) return hits[0];
	return hits.length > 1 ? 'ambiguous' : null;
}

function lev(a: string, b: string) {
	const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
	for (let j = 1; j <= b.length; j++) d[0][j] = j;
	for (let i = 1; i <= a.length; i++)
		for (let j = 1; j <= b.length; j++)
			d[i][j] = Math.min(
				d[i - 1][j] + 1,
				d[i][j - 1] + 1,
				d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
			);
	return d[a.length][b.length];
}

// A near miss (one or two typos, or a typo in an abbreviation) gets a "did you mean".
export function closest(keys: string[], w: string) {
	const limit = w.length <= 3 ? 1 : 2;
	let best = '';
	let score = limit + 1;
	for (const k of keys) {
		const v = Math.min(lev(w, k), w.length < k.length ? lev(w, k.slice(0, w.length)) : 99);
		if (v < score) {
			score = v;
			best = k;
		}
	}
	return best;
}

export const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));

export function ipToInt(ip: string) {
	return ip.split('.').reduce((a, o) => a * 256 + Number(o), 0);
}
export function intToIp(n: number) {
	return [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join('.');
}
export function isIp(v: string) {
	const r = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(v);
	return !!r && r.slice(1).every((o) => Number(o) <= 255);
}
/** "192.168.88.1/24" into its address and network, or null if it is not a valid address. */
export function parseAddr(v: string): { ip: string; prefix: number; network: string } | null {
	const [ip, p] = v.split('/');
	if (!isIp(ip)) return null;
	const prefix = p === undefined ? 32 : Number(p);
	if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return null;
	const size = 2 ** (32 - prefix);
	return { ip, prefix, network: intToIp(Math.floor(ipToInt(ip) / size) * size) };
}
/** "192.168.88.10-192.168.88.254" into numbers, or null. */
export function parseRange(v: string): { from: number; to: number } | null {
	const [a, b] = v.split('-');
	if (!isIp(a) || !isIp(b ?? '')) return null;
	const from = ipToInt(a);
	const to = ipToInt(b);
	return from <= to ? { from, to } : null;
}
/** One RouterOS rate like "10M", "512k" or "2000000", in Mbps. */
export function parseRate(v: string): number | null {
	const r = /^(\d+(?:\.\d+)?)([kKmMgG]?)$/.exec(v.trim());
	if (!r) return null;
	const n = Number(r[1]);
	const unit = r[2].toLowerCase();
	return unit === 'k' ? n / 1000 : unit === 'm' ? n : unit === 'g' ? n * 1000 : n / 1e6;
}
/** "upload/download" max-limit, e.g. "5M/10M". A single value counts for both. */
export function parseLimit(v: string): { up: number; down: number } | null {
	const [a, b] = v.split('/');
	const up = parseRate(a);
	const down = parseRate(b ?? a);
	return up === null || down === null ? null : { up, down };
}
export const fmtRate = (m: number) =>
	m >= 1 ? `${Math.round(m * 10) / 10}M` : `${Math.round(m * 1000)}k`;

/** Split a typed line into menu words and key=value arguments, keeping column numbers. */
export function tokenize(line: string): { words: Word[]; args: Arg[] } {
	const toks = line.match(/[^\s"=]+="[^"]*"|\[[^\]]*\]|\S+/g) ?? [];
	const words: Word[] = [];
	const args: Arg[] = [];
	let cur = 0;
	for (const tok of toks) {
		const at = line.indexOf(tok, cur);
		cur = at + tok.length;
		const eq = tok.indexOf('=');
		if (eq > 0 && !tok.startsWith('['))
			args.push({ k: tok.slice(0, eq), v: tok.slice(eq + 1).replace(/^"|"$/g, ''), col: at + 1 });
		else if (args.length || tok.startsWith('[')) words.push({ w: tok, col: at + 1 });
		else
			for (const part of tok.split('/'))
				if (part) words.push({ w: part, col: line.indexOf(part, at) + 1 });
	}
	return { words, args };
}

export type Mission = { label: string; done: boolean; help?: () => void };

// ---- Geometry of the shared office drawing (OfficeRig.svelte) ----
export const RIG_W = 340;
export const RIG_H = 262;
export const RY = 70; // top of the router body
export const PORTS = ['ether1', 'ether2', 'ether3', 'ether4', 'ether5'];
export const portX = (i: number) => 150 + i * 34; // left edge of a port hole
export const portC = (p: string) => portX(PORTS.indexOf(p)) + 14; // its centre
export const ISP = { x: 60, y: 31 };
export const NET = { x: 274, y: 25 }; // the far server on the internet
export const SWITCH_Y = 164;
export const LAPTOP_Y = 196; // top of a laptop screen
export const AP_X = 272;
/** Centres of the office laptops, spread under the switch (leaving room for an access point). */
export function laptopXs(n: number, withAp = false): number[] {
	const [a, b] = withAp ? [44, 196] : [52, 288];
	if (n <= 1) return [withAp ? 110 : 170];
	return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
}

export type RigLaptop = {
	name: string;
	ip?: string;
	plugged?: boolean;
	tone?: 'ok' | 'bad' | 'wait' | 'idle';
};
export type RigPacket = { x: number; y: number; label: string; tone?: 'ok' | 'bad' | 'go' };
