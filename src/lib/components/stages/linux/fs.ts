// A tiny in memory Linux file system shared by the Linux lessons. Pure data and helpers, no
// browser APIs, so it is safe to run on the server.

export type FNode = {
	kind: 'dir' | 'file';
	owner: string;
	group: string;
	/** Permission bits, e.g. 0o755. */
	mode: number;
	kids?: Record<string, FNode>;
	/** File contents, one entry per line. */
	body?: string[];
	/** Shown by ls -l. Defaults to the length of the body. */
	size?: number;
};

type Opts = Partial<Pick<FNode, 'owner' | 'group' | 'mode' | 'size'>>;

export const dir = (kids: Record<string, FNode> = {}, o: Opts = {}): FNode => ({
	kind: 'dir',
	owner: 'root',
	group: 'root',
	mode: 0o755,
	kids,
	...o
});
export const file = (body: string[] = [], o: Opts = {}): FNode => ({
	kind: 'file',
	owner: 'root',
	group: 'root',
	mode: 0o644,
	body,
	...o
});
/** A file owned by the learner (nim). */
export const mine = (body: string[] = [], o: Opts = {}): FNode =>
	file(body, { owner: 'nim', group: 'nim', ...o });
/** A folder owned by the learner (nim). */
export const myDir = (kids: Record<string, FNode> = {}, o: Opts = {}): FNode =>
	dir(kids, { owner: 'nim', group: 'nim', ...o });

/** Split an absolute path into its parts, '/var/log' becomes ['var', 'log']. */
export const parts = (abs: string) => abs.split('/').filter(Boolean);
export const join = (p: string[]) => '/' + p.join('/');

/** Turn any path the learner types into a clean absolute path. */
export function resolve(cwd: string, p: string, home: string): string {
	let raw = p;
	if (raw === '~') raw = home;
	else if (raw.startsWith('~/')) raw = home + raw.slice(1);
	const out = raw.startsWith('/') ? [] : parts(cwd);
	for (const seg of raw.split('/')) {
		if (!seg || seg === '.') continue;
		if (seg === '..') out.pop();
		else out.push(seg);
	}
	return join(out);
}

export function lookup(root: FNode, abs: string): FNode | undefined {
	let n: FNode | undefined = root;
	for (const seg of parts(abs)) {
		if (!n || n.kind !== 'dir') return undefined;
		n = n.kids?.[seg];
	}
	return n;
}

export function dirname(abs: string) {
	const p = parts(abs);
	p.pop();
	return join(p);
}
export function basename(abs: string) {
	const p = parts(abs);
	return p[p.length - 1] ?? '/';
}

/** Show a path the way bash does in the prompt, with the home folder as ~. */
export function tilde(abs: string, home: string) {
	if (abs === home) return '~';
	if (abs.startsWith(home + '/')) return '~' + abs.slice(home.length);
	return abs;
}

export function modeStr(n: FNode) {
	const bits = 'rwxrwxrwx';
	let s = n.kind === 'dir' ? 'd' : '-';
	for (let i = 0; i < 9; i++) s += n.mode & (1 << (8 - i)) ? bits[i] : '-';
	return s;
}
export const octal = (mode: number) => mode.toString(8).padStart(3, '0');

export type Op = 'r' | 'w' | 'x';
/** Can this user do this to the node? Root can do anything except run a file nobody may run. */
export function can(n: FNode, user: string, groups: string[], op: Op): boolean {
	const bit = op === 'r' ? 4 : op === 'w' ? 2 : 1;
	if (user === 'root') return op !== 'x' || n.kind === 'dir' || (n.mode & 0o111) !== 0;
	const shift = n.owner === user ? 6 : groups.includes(n.group) ? 3 : 0;
	return ((n.mode >> shift) & bit) !== 0;
}

/**
 * Apply a chmod spec to a mode. Accepts octal (755) and symbolic forms (u+x, go-w, a=r, +x,
 * u+rwx,o-r). Returns null when the spec makes no sense.
 */
export function chmodSpec(mode: number, spec: string): number | null {
	if (/^[0-7]{3,4}$/.test(spec)) return parseInt(spec.slice(-3), 8);
	let m = mode;
	for (const clause of spec.split(',')) {
		const r = /^([ugoa]*)([+\-=])([rwx]*)$/.exec(clause);
		if (!r) return null;
		const who = r[1] === '' || r[1].includes('a') ? 'ugo' : r[1];
		let bits = 0;
		for (const c of r[3]) bits |= c === 'r' ? 4 : c === 'w' ? 2 : 1;
		for (const w of who) {
			const shift = w === 'u' ? 6 : w === 'g' ? 3 : 0;
			if (r[2] === '+') m |= bits << shift;
			else if (r[2] === '-') m &= ~(bits << shift);
			else m = (m & ~(7 << shift)) | (bits << shift);
		}
	}
	return m & 0o777;
}

/** Edit distance, used for the friendly "did you mean" hints. */
export function lev(a: string, b: string) {
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
export function closest(keys: string[], w: string) {
	const limit = w.length <= 3 ? 1 : 2;
	let best = '';
	let score = limit + 1;
	for (const k of keys) {
		const v = lev(w, k);
		if (v < score) {
			score = v;
			best = k;
		}
	}
	return best;
}

// ---- Dates, kept as plain YYYY-MM-DD strings ----
const DAY_MS = 86400000;
const toMs = (d: string) => Date.parse(d + 'T09:12:00Z');
/** 0 is Sunday. */
export const weekday = (d: string) => new Date(toMs(d)).getUTCDay();
export const addDays = (d: string, n: number) =>
	new Date(toMs(d) + n * DAY_MS).toISOString().slice(0, 10);
/** Like the date command, e.g. "Tue Nov  3 09:12:00 UTC 2026". */
export function longDate(d: string) {
	const t = new Date(toMs(d));
	const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][t.getUTCDay()];
	const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
		t.getUTCMonth()
	];
	return `${day} ${mon} ${String(t.getUTCDate()).padStart(2, ' ')} 09:12:00 UTC ${t.getUTCFullYear()}`;
}
