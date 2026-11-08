import { SvelteSet, SvelteMap } from 'svelte/reactivity';
// A small but honest Cisco IOS command line shared by the Cisco Lab stages. It models the real
// modes and prompts (nimbus>, nimbus#, nimbus(config)#, nimbus(config-if)# and friends),
// abbreviations, "?" help, Tab completion, the classic "% Invalid input" caret, do and no,
// running versus startup config, reload, and the usual show commands. Each stage gives it a
// starting config and listens to the commands that ran (onrun) to tick its missions.
import {
	MODE_SUFFIX,
	PORT_NAMES,
	buildTrees,
	closest,
	fakeHash,
	helpLines,
	intToIp,
	ipToInt,
	isConfig,
	isIp,
	levelAfter,
	maskBits,
	networkOf,
	officeRouter,
	officeSwitch,
	pad,
	parse,
	prefixMask,
	short,
	tokenize,
	aceText,
	PORT_NAMES_TCP,
	type AclAddr,
	type Cfg,
	type Dev,
	type G,
	type Iface,
	type LineCfg,
	type Mode,
	type Parsed,
	type Tok,
	type Trees
} from './ios';

export type Ln = {
	tone: 'cmd' | 'out' | 'tbl' | 'err' | 'muted' | 'ok' | 'log';
	text: string;
	prompt?: string;
};
/** The learner language lines the shell prints under IOS errors. */
export type ShellText = {
	termHint: string;
	hintInvalid: string;
	hintIncomplete: string;
	hintAmbiguous: string;
	hintUnknown: string;
	didYouMean: string; // template with {word}
	hintNeedEnable: string;
	hintNeedConfig: string;
	hintDo: string;
	hintSub: string;
	hintMask: string;
	hintWild: string;
};
export type Run = {
	id: string;
	words: string[];
	vals: string[];
	neg: boolean;
	/** The mode the command was typed in. */
	mode: Mode;
	line: string;
};
type Ask = { label: string; mask?: boolean; done: (v: string) => void };
export type Binding = { ip: string; mac: string; name: string };
export type Trans = {
	proto: string;
	inGlobal: string;
	inLocal: string;
	outLocal: string;
	outGlobal: string;
};

const SUB: Mode[] = ['if', 'range', 'line', 'dhcp', 'vlan'];
const PRIV_ONLY = ['show', 'copy', 'write', 'ping', 'clear', 'reload', 'disable'];
const noCable = (k: string, v: unknown) => (k === 'cable' ? undefined : v);
const type7 = (s: string) =>
	'08' +
	Array.from(s)
		.map((c, i) => ((c.charCodeAt(0) ^ (0x2b + i * 7)) & 0xff).toString(16).padStart(2, '0'))
		.join('')
		.toUpperCase();

export class IosShell {
	history = $state<Ln[]>([]);
	cfg = $state<Cfg>(officeRouter(1));
	mode = $state<Mode>('priv');
	/** Interfaces being configured in interface (or range) mode. */
	ifs = $state<string[]>([]);
	pool = $state('');
	vlanId = $state(0);
	lineKind = $state<'vty' | 'con'>('vty');
	input = $state('');
	typing = $state(false);
	asking = $state<Ask | null>(null);
	bindings = $state<Binding[]>([]);
	trans = $state<Trans[]>([]);
	/** ACL hit counters, keyed "list:seq" (runtime only, never part of the config). */
	hits = $state<Record<string, number>>({});
	startup = $state<string | null>(null);
	prompt = $derived(this.asking ? this.asking.label : this.cfg.hostname + MODE_SUFFIX[this.mode]);
	dirty = $derived(JSON.stringify(this.cfg, noCable) !== this.startup);
	/** Commands typed so far, for the arrow keys. */
	past: string[] = [];

	readonly dev: Dev;
	private trees: Trees;
	private started = false;
	private clock = 754;
	private timer: ReturnType<typeof setInterval> | undefined;
	private pause: ReturnType<typeof setTimeout> | undefined;
	private text: () => ShellText;
	private onrun?: (r: Run) => void;
	private intercept?: (r: Run) => boolean;
	private onerror?: (token: string) => void;

	constructor(o: {
		dev: Dev;
		cfg: Cfg;
		mode?: Mode;
		/** Treat the starting config as already saved to NVRAM. */
		saved?: boolean;
		text: () => ShellText;
		onrun?: (r: Run) => void;
		/** Handle a command yourself instead of the built in behaviour (return true). */
		intercept?: (r: Run) => boolean;
		onerror?: (token: string) => void;
	}) {
		this.dev = o.dev;
		this.trees = buildTrees(o.dev);
		this.cfg = o.cfg;
		this.mode = o.mode ?? 'priv';
		if (o.saved !== false) this.startup = JSON.stringify(o.cfg, noCable);
		this.text = o.text;
		this.onrun = o.onrun;
		this.intercept = o.intercept;
		this.onerror = o.onerror;
	}

	// ---- Output ----
	add(tone: Ln['tone'], text: string) {
		this.history = [...this.history, { tone, text }];
	}
	out = (t: string) => this.add('out', t);
	tbl = (t: string) => this.add('tbl', t);
	err = (t: string) => this.add('err', t);
	ok = (t: string) => this.add('ok', t);
	hint = (t: string) => this.add('muted', t);
	log(msg: string) {
		this.clock += 1 + (this.clock % 3);
		const mm = String(Math.floor(this.clock / 60) % 60).padStart(2, '0');
		const ss = String(this.clock % 60).padStart(2, '0');
		const ms = String((this.clock * 137) % 1000).padStart(3, '0');
		this.add('log', `*Mar  1 00:${mm}:${ss}.${ms}: ${msg}`);
	}
	private fail(token: string) {
		this.onerror?.(token);
	}
	private emit(id: string) {
		this.onrun?.({ id, words: [], vals: [], neg: false, mode: this.mode, line: '' });
	}

	/** Seed the helper line (kept in sync with the language until the first real command). */
	seed() {
		if (this.started) return;
		const h = this.text().termHint;
		if (this.history.length !== 1 || this.history[0].text !== h)
			this.history = [{ tone: 'muted', text: h }];
	}

	// ---- Lookups the stages use ----
	iface(name: string): Iface | undefined {
		return this.cfg.ifaces.find((i) => i.name === name);
	}
	isUp(name: string) {
		const i = this.iface(name);
		return !!i && !i.shut && i.cable;
	}
	acl(id: string) {
		return this.cfg.acls.find((a) => a.id === id);
	}
	pathTo(target: 'priv' | 'config'): string[] {
		const out: string[] = [];
		const m = this.mode;
		if (m === 'user') {
			out.push('enable');
			const s = this.cfg.enableSecret ?? this.cfg.enablePassword;
			if (s) out.push(s);
			if (target === 'config') out.push('configure terminal');
		} else if (m === 'priv') {
			if (target === 'config') out.push('configure terminal');
		} else if (target === 'priv') out.push('end');
		else if (m !== 'config') out.push('exit');
		return out;
	}
	/** Hand out the next free address of the pool that serves this interface (DHCP). */
	lease(name: string, mac: string, on = 'GigabitEthernet0/1') {
		const ifc = this.iface(on);
		if (!ifc || ifc.shut || !ifc.ip || !ifc.mask) return null;
		const pool = this.cfg.pools.find(
			(p) => p.network && p.mask && networkOf(ifc.ip!, ifc.mask!) === networkOf(p.network, p.mask)
		);
		if (!pool) return null;
		const had = this.bindings.find((b) => b.mac === mac);
		if (had) return { ip: had.ip, gw: pool.gw, dns: pool.dns, mask: pool.mask! };
		const base = ipToInt(networkOf(pool.network!, pool.mask!));
		const size = 2 ** (32 - (maskBits(pool.mask!) ?? 24));
		const taken = new SvelteSet([
			...this.bindings.map((b) => b.ip),
			...this.cfg.ifaces.filter((i) => i.ip).map((i) => i.ip!)
		]);
		const excluded = (n: number) =>
			this.cfg.excluded.some(([a, b]) => n >= ipToInt(a) && n <= ipToInt(b));
		for (let n = base + 1; n < base + size - 1; n++) {
			const ip = intToIp(n);
			if (taken.has(ip) || excluded(n)) continue;
			this.bindings = [...this.bindings, { ip, mac, name }];
			return { ip, gw: pool.gw, dns: pool.dns, mask: pool.mask! };
		}
		return null;
	}
	save() {
		this.startup = JSON.stringify(this.cfg, noCable);
	}

	// ---- Input ----
	run(raw: string) {
		if (!this.started) {
			this.started = true;
			this.history = [];
		}
		if (this.asking) return this.answer(raw);
		const line = raw.trim();
		this.history = [...this.history, { tone: 'cmd', text: line, prompt: this.prompt }];
		if (!line) return;
		if (this.past.at(-1) !== line) this.past.push(line);
		if (line.endsWith('?')) return this.help(line.slice(0, -1));
		const bar = line.indexOf('|');
		if (bar > 0) return this.piped(line.slice(0, bar).trimEnd(), line.slice(bar + 1).trim(), bar);
		this.execLine(line);
	}

	private ask(label: string, done: (v: string) => void, mask = false) {
		this.asking = { label, done, mask };
	}
	private answer(raw: string) {
		const a = this.asking!;
		this.history = [
			...this.history,
			{ tone: 'cmd', text: a.mask ? '' : raw.trim(), prompt: a.label }
		];
		this.asking = null;
		a.done(raw.trim());
	}

	/** Pick the tree for this line, handling "do" (exec from config) and "no" (negate). */
	private resolve(toks: Tok[]) {
		let tree = this.trees[this.mode];
		let neg = false;
		let isDo = false;
		const first = toks[0]?.w.toLowerCase();
		if (isConfig(this.mode) && first === 'do') {
			isDo = true;
			tree = this.trees.priv;
			toks = toks.slice(1);
		} else if (isConfig(this.mode) && first === 'no') {
			neg = true;
			toks = toks.slice(1);
		}
		return { tree, toks, neg, isDo };
	}

	private help(before: string) {
		const partial = before.length && !/\s$/.test(before) ? (before.match(/\S+$/)?.[0] ?? '') : '';
		const head = partial ? before.slice(0, before.length - partial.length) : before;
		const r = this.resolve(tokenize(head));
		const lv = levelAfter(r.tree, r.toks);
		// in a sub mode, global commands work too, so help falls back to them
		const lvl =
			lv ?? (SUB.includes(this.mode) && !r.isDo ? levelAfter(this.trees.config, r.toks) : null);
		if (!lvl) {
			this.err('% Unrecognized command');
		} else if (partial) {
			const low = partial.toLowerCase();
			const hits = lvl.level.filter((g) =>
				g.p ? g.p(partial) : g.w.toLowerCase().startsWith(low)
			);
			if (!hits.length) this.err('% Unrecognized command');
			else this.out(hits.map((g) => g.w).join('  '));
		} else {
			const rows = helpLines(
				lvl.level.filter((g) => !(r.neg && g.w === 'no')),
				lvl.node
			);
			if (!rows.length) this.err('% Unrecognized command');
			for (const l of rows) this.tbl(l);
		}
		this.input = before;
	}

	/** Tab, completes the last word when only one command fits. */
	complete() {
		const v = this.input;
		if (!v || /\s$/.test(v) || this.asking) return;
		const toks = tokenize(v);
		const last = toks.pop();
		if (!last) return;
		const r = this.resolve(toks);
		const lv =
			levelAfter(r.tree, r.toks) ??
			(SUB.includes(this.mode) ? levelAfter(this.trees.config, r.toks) : null);
		if (!lv) return;
		const low = last.w.toLowerCase();
		const hits = lv.level.filter((g) => !g.p && g.w.toLowerCase().startsWith(low));
		if (hits.length !== 1) return;
		this.input = v.slice(0, last.col - 1) + hits[0].w + ' ';
	}

	private piped(cmd: string, filt: string, bar: number) {
		const [kindRaw, ...rest] = filt.split(/\s+/);
		const kinds = ['begin', 'exclude', 'include', 'section'];
		const kind = kinds.filter((k) => k.startsWith((kindRaw ?? '').toLowerCase()));
		const pat = rest.join(' ');
		if (!/^\s*(do\s+)?sh/i.test(cmd) || kind.length !== 1 || !pat) {
			this.caret(bar + 2 + (kind.length === 1 && !pat ? filt.length : 0));
			this.hint(this.text().hintInvalid);
			return this.fail('error');
		}
		const from = this.history.length;
		this.execLine(cmd);
		const outLines = this.history.slice(from);
		const keep: Ln[] = [];
		const has = (l: Ln) => l.text.includes(pat);
		if (kind[0] === 'include') keep.push(...outLines.filter(has));
		else if (kind[0] === 'exclude') keep.push(...outLines.filter((l) => !has(l)));
		else if (kind[0] === 'begin') {
			const at = outLines.findIndex(has);
			if (at >= 0) keep.push(...outLines.slice(at));
		} else {
			let inBlock = false;
			for (const l of outLines) {
				const top = !/^\s/.test(l.text);
				if (top) inBlock = has(l);
				if (inBlock || has(l)) keep.push(l);
			}
		}
		this.history = [...this.history.slice(0, from), ...keep];
	}

	private caret(col: number) {
		this.add('err', ' '.repeat(this.prompt.length + col - 1) + '^');
		this.err("% Invalid input detected at '^' marker.");
	}

	private execLine(line: string) {
		const all = tokenize(line);
		const r = this.resolve(all);
		const mode = this.mode;
		if (!r.toks.length) {
			this.err('% Incomplete command.');
			this.hint(this.text().hintIncomplete);
			return this.fail('error');
		}
		let p = parse(r.tree, r.toks, line);
		if (!p.ok && SUB.includes(mode) && !r.isDo) {
			const q = parse(this.trees.config, r.toks, line);
			if (q.ok) {
				this.leaveSub();
				p = q;
			}
		}
		if (!p.ok) return this.reject(p, r.toks, r.tree, r.isDo, line);
		const run: Run = { id: p.id, words: p.words, vals: p.vals, neg: r.neg, mode, line };
		if (this.intercept?.(run)) return;
		this.exec(run);
		this.onrun?.(run);
	}

	private reject(
		p: Exclude<Parsed, { ok: true }>,
		toks: Tok[],
		tree: G[],
		isDo: boolean,
		line: string
	) {
		const t = this.text();
		if (p.kind === 'ambiguous') {
			this.err(`% Ambiguous command:  "${line.slice(0, p.col - 1 + p.tok.length)}"`);
			this.hint(t.hintAmbiguous);
			return this.fail('error');
		}
		if (p.kind === 'incomplete') {
			this.err('% Incomplete command.');
			const subHit = SUB.includes(this.mode) ? null : this.subMatch(toks);
			this.hint(subHit ? t.hintSub : t.hintIncomplete);
			return this.fail(subHit ? 'needSub' : 'error');
		}
		const first = toks[0].w;
		const exec = !isConfig(this.mode);
		if (exec && p.at === 0 && toks.length === 1) {
			if (!this.cfg.noLookup) this.out(`Translating "${first}"...domain server (255.255.255.255)`);
			this.err('% Unknown command or computer name, or unable to find computer address');
		} else this.caret(p.col);

		const inPriv = this.firstMatch(this.trees.priv, first);
		const inConfig = this.firstMatch(this.trees.config, first);
		const here = this.firstMatch(tree, first);
		if (p.at === 0 && this.mode === 'user' && inPriv) {
			this.hint(t.hintNeedEnable);
			return this.fail('needEnable');
		}
		if (p.at === 0 && exec && inConfig) {
			this.hint(t.hintNeedConfig);
			return this.fail('needConfig');
		}
		if (p.at === 0 && !exec && !isDo && PRIV_ONLY.includes(inPriv ?? '') && !here) {
			this.hint(t.hintDo);
			return this.fail('needDo');
		}
		if (/^\/\d{1,2}$/.test(p.tok) || /^\d+\.\d+\.\d+\.\d+\/\d+$/.test(p.tok)) {
			this.hint(t.hintMask);
			return this.fail('mask');
		}
		if (!SUB.includes(this.mode) && !exec && this.subMatch(toks)) {
			this.hint(t.hintSub);
			return this.fail('needSub');
		}
		const lv = levelAfter(tree, toks.slice(0, p.at));
		const near = lv
			? closest(
					lv.level.filter((g) => !g.p).map((g) => g.w.toLowerCase()),
					p.tok.toLowerCase()
				)
			: '';
		this.hint(
			near ? t.didYouMean.replace('{word}', near) : p.at === 0 ? t.hintUnknown : t.hintInvalid
		);
		this.fail('error');
	}
	private firstMatch(tree: G[], w: string) {
		const low = w.toLowerCase();
		const hits = tree.filter((g) => !g.p && g.w.toLowerCase().startsWith(low));
		const exact = hits.find((g) => g.w.toLowerCase() === low);
		return exact?.w ?? (hits.length === 1 ? hits[0].w : null);
	}
	/** Would this line make sense one level deeper (inside an interface, pool, line or vlan)? */
	private subMatch(toks: Tok[]) {
		return (['if', 'dhcp', 'line', 'vlan'] as Mode[]).some((m) => {
			const first = this.firstMatch(this.trees[m], toks[0].w);
			return (
				first &&
				!['no', 'exit', 'end'].includes(first) &&
				!this.firstMatch(this.trees.config, toks[0].w)
			);
		});
	}

	private leaveSub() {
		this.mode = 'config';
		this.ifs = [];
		this.pool = '';
		this.vlanId = 0;
	}
	private configured() {
		this.log('%SYS-5-CONFIG_I: Configured from console by console');
	}

	// ---- Typing for you ----
	private queue: string[] = [];
	private cur: string | null = null;
	private whenDone: (() => void) | null = null;
	/**
	 * Type commands out letter by letter, pressing Enter after each (instantly with reduced
	 * motion), then call `done`. Skipping ahead with flush or reset drops `done`.
	 */
	typeFor(lines: string | string[], done?: () => void) {
		this.flush();
		this.queue = Array.isArray(lines) ? [...lines] : [lines];
		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (reduced || !this.queue.length) {
			this.flush();
			done?.();
			return;
		}
		this.whenDone = done ?? null;
		this.typing = true;
		this.next();
	}
	private next = () => {
		const line = this.queue.shift();
		if (line === undefined) {
			this.typing = false;
			this.cur = null;
			const d = this.whenDone;
			this.whenDone = null;
			d?.();
			return;
		}
		this.cur = line;
		this.input = '';
		let n = 0;
		const go = () => {
			this.pause = setTimeout(() => {
				this.input = '';
				this.cur = null;
				this.run(line);
				this.pause = setTimeout(this.next, 420);
			}, 320);
		};
		if (!line.length) return go();
		this.timer = setInterval(() => {
			n += 1;
			this.input = line.slice(0, n);
			if (n >= line.length) {
				clearInterval(this.timer);
				go();
			}
		}, 42);
	};
	/** Finish whatever is being typed right now, instantly. */
	flush() {
		clearInterval(this.timer);
		clearTimeout(this.pause);
		const rest = [...(this.cur !== null ? [this.cur] : []), ...this.queue];
		this.whenDone = null;
		this.queue = [];
		this.cur = null;
		this.typing = false;
		this.input = '';
		for (const l of rest) this.run(l);
	}
	/** Start over from a fresh config (used when the learner goes back a beat). */
	reset(cfg: Cfg, mode: Mode = 'priv', saved = true) {
		clearInterval(this.timer);
		clearTimeout(this.pause);
		this.queue = [];
		this.whenDone = null;
		this.cur = null;
		this.typing = false;
		this.input = '';
		this.asking = null;
		this.cfg = cfg;
		this.mode = mode;
		this.ifs = [];
		this.pool = '';
		this.vlanId = 0;
		this.bindings = [];
		this.trans = [];
		this.hits = {};
		this.startup = saved ? JSON.stringify(cfg, noCable) : null;
		this.started = false;
		this.history = [];
		this.seed();
	}
	destroy() {
		clearInterval(this.timer);
		clearTimeout(this.pause);
	}

	// ---- Power ----
	/** Pull the plug and plug it back in, no questions asked. */
	powerCycle() {
		this.asking = null;
		this.boot();
	}
	private boot() {
		const cables = new SvelteMap(this.cfg.ifaces.map((i) => [i.name, i.cable]));
		const fresh: Cfg = this.startup
			? JSON.parse(this.startup)
			: this.dev === 'router'
				? officeRouter(0)
				: officeSwitch();
		for (const i of fresh.ifaces) i.cable = cables.get(i.name) ?? false;
		const router = this.dev === 'router';
		this.out('');
		this.out(
			`System Bootstrap, Version ${router ? '15.0(1r)M16' : '12.2(44r)SE5'}, RELEASE SOFTWARE (fc1)`
		);
		this.out('Copyright (c) 2012 by cisco Systems, Inc.');
		this.out('Self decompressing the image : ########## [OK]');
		if (!this.startup) {
			this.out('');
			this.out('         --- System Configuration Dialog ---');
			this.out('Would you like to enter the initial configuration dialog? [yes/no]: no');
		}
		this.out('');
		this.out('Press RETURN to get started!');
		this.cfg = fresh;
		this.mode = 'user';
		this.ifs = [];
		this.trans = [];
		this.hits = {};
		this.bindings = this.cfg.pools.length ? this.bindings : [];
		this.emit('reloaded');
	}

	// ---- Executing ----
	private exec(r: Run) {
		const c = this.cfg;
		const v = r.vals;
		const last = v[v.length - 1];
		switch (r.id) {
			case 'enable': {
				if (this.mode !== 'user') return;
				const s = c.enableSecret ?? c.enablePassword;
				if (!s) {
					this.mode = 'priv';
					return this.emit('enabled');
				}
				return this.ask(
					'Password:',
					(a) => {
						if (a === s) {
							this.mode = 'priv';
							this.emit('enabled');
						} else {
							this.err('% Bad secrets');
							this.fail('badSecret');
						}
					},
					true
				);
			}
			case 'disable':
				this.mode = 'user';
				return;
			case 'logout':
				this.out('');
				this.out(`${c.hostname} con0 is now available`);
				this.out('');
				this.out('Press RETURN to get started.');
				this.mode = 'user';
				return;
			case 'conf':
				this.out('Enter configuration commands, one per line.  End with CNTL/Z.');
				this.mode = 'config';
				return;
			case 'end':
				this.leaveSub();
				this.mode = 'priv';
				return this.configured();
			case 'exit':
				if (this.mode === 'config') {
					this.mode = 'priv';
					return this.configured();
				}
				return this.leaveSub();
			case 'copy':
				return this.ask('Destination filename [startup-config]?', () => {
					this.out('Building configuration...');
					this.ok('[OK]');
					this.save();
					this.emit('saved');
				});
			case 'write':
				this.out('Building configuration...');
				this.ok('[OK]');
				this.save();
				return this.emit('saved');
			case 'reload':
				return this.reload();
			case 'ping':
				return this.ping(last);
			case 'clear.nat':
				this.trans = [];
				return;
			case 'clear.acl':
				this.hits = {};
				return;
			case 'show.run':
				return this.showConfig(c, true);
			case 'show.start':
				if (!this.startup) return this.out('startup-config is not present');
				return this.showConfig(JSON.parse(this.startup), false);
			case 'show.ipib':
				return this.showIpib();
			case 'show.binding':
				return this.showBindings();
			case 'show.pool':
				return this.showPools();
			case 'show.nat':
				return this.showNat();
			case 'show.acl':
				return this.showAcls();
			case 'show.vlan':
				return this.showVlans();
			case 'show.trunk':
				return this.showTrunks();
			case 'show.ssh':
				return this.showSsh();
			case 'show.ver':
				return this.showVersion();

			// ---- global config ----
			case 'hostname':
				if (r.neg) {
					c.hostname = this.dev === 'router' ? 'Router' : 'Switch';
					return;
				}
				if (!/^[A-Za-z][A-Za-z0-9-]{0,62}$/.test(last)) {
					this.err('% Hostname contains one or more illegal characters.');
					return this.fail('error');
				}
				c.hostname = last;
				return;
			case 'if': {
				const name = this.ifName(r.words, v);
				if (r.neg) {
					this.err('% Removal of physical interfaces is not permitted');
					return this.fail('error');
				}
				this.mode = 'if';
				this.ifs = [name];
				return;
			}
			case 'range': {
				const type = r.words[2];
				const [slot, from, to0] = /^(\d+\/)(\d+)(?:-(\d+))?$/.exec(v[3])!.slice(1);
				const to = v[5] ?? to0 ?? from;
				if (+to < +from || !PORT_NAMES[this.dev].includes(type + slot + to)) {
					this.caret(r.line.lastIndexOf(to) + 1);
					return this.fail('error');
				}
				this.mode = 'range';
				this.ifs = Array.from({ length: +to - +from + 1 }, (_, i) => `${type}${slot}${+from + i}`);
				return;
			}
			case 'pool': {
				if (r.neg) {
					c.pools = c.pools.filter((p) => p.name !== last);
					return;
				}
				if (!c.pools.some((p) => p.name === last)) c.pools.push({ name: last, dns: [] });
				this.pool = last;
				this.mode = 'dhcp';
				return;
			}
			case 'excl': {
				const a = v[3];
				const b = v[4] ?? a;
				if (ipToInt(b) < ipToInt(a)) {
					this.err('% Invalid address range');
					return this.fail('error');
				}
				if (r.neg) c.excluded = c.excluded.filter(([x, y]) => !(x === a && y === b));
				else if (!c.excluded.some(([x, y]) => x === a && y === b)) c.excluded.push([a, b]);
				return;
			}
			case 'domain':
				c.domain = r.neg ? undefined : last;
				return;
			case 'lookup':
				c.noLookup = r.neg;
				return;
			case 'natrule': {
				if (r.neg) {
					c.nat = undefined;
					return;
				}
				const at = r.words.indexOf('interface');
				const name = this.ifName(r.words.slice(at + 1), v.slice(at + 1));
				c.nat = { list: v[5], iface: name, overload: r.words.includes('overload') };
				return;
			}
			case 'acl':
				return this.aclAdd(r);
			case 'acl.remark':
				return;
			case 'crypto':
				return this.crypto(r);
			case 'user': {
				const kind = r.words[2] === 'secret' ? 'secret' : 'password';
				if (r.neg) {
					c.users = c.users.filter((u) => u.name !== v[1]);
					return;
				}
				c.users = [...c.users.filter((u) => u.name !== v[1]), { name: v[1], secret: last, kind }];
				return;
			}
			case 'en.secret':
				if (r.neg) c.enableSecret = undefined;
				else {
					c.enableSecret = last;
				}
				return;
			case 'en.pass':
				if (r.neg) c.enablePassword = undefined;
				else {
					if (c.enableSecret && last === c.enableSecret)
						this.out('The enable password you have chosen is the same as your enable secret.');
					c.enablePassword = last;
				}
				return;
			case 'line.con':
			case 'line.vty':
				this.lineKind = r.id === 'line.con' ? 'con' : 'vty';
				this.mode = 'line';
				return;
			case 'vlan': {
				const id = +last;
				if (r.neg) {
					c.vlans = c.vlans.filter((x) => x.id !== id);
					return;
				}
				if (id === 1) {
					this.err('% Default VLAN 1 may not have its name changed.');
					this.mode = 'vlan';
					this.vlanId = id;
					return;
				}
				if (!c.vlans.some((x) => x.id === id))
					c.vlans.push({ id, name: `VLAN${String(id).padStart(4, '0')}` });
				this.vlanId = id;
				this.mode = 'vlan';
				return;
			}
			case 'sshver':
				c.sshVer = r.neg ? undefined : +last;
				return;
			case 'pwenc':
				c.pwEncrypt = !r.neg;
				return;

			// ---- interface ----
			case 'if.ip':
			case 'if.ipdhcp':
			case 'if.shut':
			case 'if.desc':
			case 'if.nat':
			case 'if.acg':
			case 'if.mode':
			case 'if.vlan':
				for (const n of this.ifs) {
					const i = this.iface(n);
					if (i && this.ifCmd(r, i) === false) break;
				}
				return;

			// ---- line ----
			case 'line.trans':
			case 'line.login':
			case 'line.pass':
			case 'line.acl':
				return this.lineCmd(r, this.lineKind === 'con' ? c.con : c.vty);

			// ---- dhcp pool ----
			case 'dhcp.net':
			case 'dhcp.gw':
			case 'dhcp.dns':
			case 'dhcp.domain': {
				const p = c.pools.find((x) => x.name === this.pool);
				if (!p) return;
				if (r.id === 'dhcp.net') {
					if (r.neg) {
						p.network = p.mask = undefined;
						return;
					}
					const mask = v[2].startsWith('/') ? prefixMask(+v[2].slice(1)) : v[2];
					if (maskBits(mask) === null) {
						this.err(`% Invalid mask ${v[2]}`);
						return this.fail('error');
					}
					p.network = networkOf(v[1], mask);
					p.mask = mask;
				} else if (r.id === 'dhcp.gw') p.gw = r.neg ? undefined : last;
				else if (r.id === 'dhcp.dns') p.dns = r.neg ? [] : v.slice(1);
				return;
			}
			case 'vlan.name': {
				const x = c.vlans.find((y) => y.id === this.vlanId);
				if (x) x.name = r.neg ? `VLAN${String(x.id).padStart(4, '0')}` : last;
				return;
			}
		}
	}

	private ifName(words: string[], vals: string[]) {
		const i = words.findIndex((w) => w === 'GigabitEthernet' || w === 'FastEthernet');
		return words[i] + vals[i + 1];
	}

	private ifCmd(r: Run, i: Iface): boolean | void {
		const v = r.vals;
		const last = v[v.length - 1];
		switch (r.id) {
			case 'if.ip': {
				if (r.neg) {
					i.ip = i.mask = undefined;
					i.dhcp = false;
					return;
				}
				const [ip, mask] = [v[2], v[3]];
				const bits = maskBits(mask);
				if (bits === null) {
					this.err(`% Bad mask 0x${ipToInt(mask).toString(16).toUpperCase()} for address ${ip}`);
					this.hint(this.text().hintMask);
					this.fail('mask');
					return false;
				}
				const net = networkOf(ip, mask);
				const bcast = intToIp(ipToInt(net) + 2 ** (32 - bits) - 1);
				if (bits < 31 && (ip === net || ip === bcast)) {
					this.err(`% Bad mask /${bits} for address ${ip}`);
					this.fail('error');
					return false;
				}
				const clash = this.cfg.ifaces.find(
					(o) => o !== i && o.ip && o.mask && networkOf(o.ip, o.mask) === net
				);
				if (clash) {
					this.err(`% ${net} overlaps with ${clash.name}`);
					this.fail('error');
					return false;
				}
				i.ip = ip;
				i.mask = mask;
				i.dhcp = false;
				return;
			}
			case 'if.ipdhcp':
				i.dhcp = !r.neg;
				if (!r.neg && i.name === 'GigabitEthernet0/0' && i.cable && !i.shut) {
					i.ip = '10.20.30.2';
					i.mask = '255.255.255.0';
					this.log(
						`%DHCP-6-ADDRESS_ASSIGN: Interface ${i.name} assigned DHCP address 10.20.30.2, mask 255.255.255.0, hostname ${this.cfg.hostname}`
					);
				}
				return;
			case 'if.shut': {
				const was = i.shut;
				i.shut = !r.neg;
				if (was && !i.shut) {
					if (i.cable) {
						this.log(`%LINK-3-UPDOWN: Interface ${i.name}, changed state to up`);
						this.log(
							`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${i.name}, changed state to up`
						);
					} else this.log(`%LINK-3-UPDOWN: Interface ${i.name}, changed state to down`);
				} else if (!was && i.shut) {
					this.log(`%LINK-5-CHANGED: Interface ${i.name}, changed state to administratively down`);
					if (i.cable)
						this.log(
							`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${i.name}, changed state to down`
						);
				}
				return;
			}
			case 'if.desc':
				i.desc = r.neg ? undefined : last;
				return;
			case 'if.nat':
				i.nat = r.neg ? undefined : (r.words[2] as 'inside' | 'outside');
				return;
			case 'if.acg':
				if (r.words.at(-1) === 'in') i.aclIn = r.neg ? undefined : v[2];
				else i.aclOut = r.neg ? undefined : v[2];
				return;
			case 'if.mode':
				i.swMode = r.neg ? undefined : (last as 'access' | 'trunk');
				return;
			case 'if.vlan': {
				const id = +last;
				if (r.neg) {
					i.vlan = 1;
					return;
				}
				if (id !== 1 && !this.cfg.vlans.some((x) => x.id === id)) {
					this.out(`% Access VLAN does not exist. Creating vlan ${id}`);
					this.cfg.vlans.push({ id, name: `VLAN${String(id).padStart(4, '0')}` });
				}
				i.vlan = id;
				return;
			}
		}
	}

	private lineCmd(r: Run, l: LineCfg) {
		const v = r.vals;
		if (r.id === 'line.trans') l.transport = r.neg ? undefined : v.slice(2);
		else if (r.id === 'line.login') {
			if (r.neg) l.login = undefined;
			else {
				l.login = r.words.includes('local') ? 'local' : 'line';
				if (l.login === 'line' && !l.pass)
					this.out(
						`% Login disabled on line ${this.lineKind === 'vty' ? 2 : 0}, until 'password' is set`
					);
			}
		} else if (r.id === 'line.pass') l.pass = r.neg ? undefined : v[v.length - 1];
		else if (r.id === 'line.acl') l.acl = r.neg ? undefined : v[1];
	}

	private aclAdd(r: Run) {
		const { words: w, vals: v } = r;
		const id = v[1];
		const ext = +id >= 100;
		if (r.neg) {
			this.cfg.acls = this.cfg.acls.filter((a) => a.id !== id);
			return;
		}
		if (v.length < 3) {
			this.err('% Incomplete command.');
			this.hint(this.text().hintIncomplete);
			return this.fail('error');
		}
		let i = 3;
		const addr = (): AclAddr => {
			if (w[i] === 'any') {
				i += 1;
				return { any: true };
			}
			if (w[i] === 'host') {
				i += 2;
				return { ip: v[i - 1], wild: '0.0.0.0' };
			}
			const ip = v[i];
			const wild = w[i + 1] === 'A.B.C.D' ? v[i + 1] : '0.0.0.0';
			i += w[i + 1] === 'A.B.C.D' ? 2 : 1;
			return { ip, wild };
		};
		let proto = 'ip';
		if (ext) {
			proto = v[3];
			i = 4;
		}
		const src = addr();
		const dst = ext ? addr() : undefined;
		let port: number | undefined;
		if (w[i] === 'eq') port = /^\d+$/.test(v[i + 1]) ? +v[i + 1] : PORT_NAMES_TCP[v[i + 1]];
		let acl = this.acl(id);
		if (!acl) {
			acl = { id, ext, aces: [] };
			this.cfg.acls.push(acl);
		}
		const seq = (acl.aces.at(-1)?.seq ?? 0) + 10;
		acl.aces.push({ seq, action: v[2] as 'permit' | 'deny', proto, src, dst, port });
		const wilds = [src, dst].filter((a): a is { ip: string; wild: string } => !!a && !('any' in a));
		if (wilds.some((a) => a.wild.startsWith('255.'))) {
			this.hint(this.text().hintWild);
			this.fail('wild');
		}
	}

	private crypto(r: Run) {
		const c = this.cfg;
		if (r.neg) {
			c.rsa = undefined;
			return;
		}
		if (c.hostname === 'Router') {
			this.err('% Please define a hostname other than Router.');
			return this.fail('error');
		}
		if (!c.domain) {
			this.err('% Please define a domain-name first.');
			return this.fail('noDomain');
		}
		const gen = (bits: number) => {
			this.out(`% Generating ${bits} bit RSA keys, keys will be non-exportable...`);
			this.ok(`[OK] (elapsed time was ${bits >= 2048 ? 2 : 1} seconds)`);
			const first = !c.rsa;
			c.rsa = bits;
			if (first && bits >= 768) this.log('%SSH-5-ENABLED: SSH 1.99 has been enabled');
			this.emit('keys');
		};
		this.out(`The name for the keys will be: ${c.hostname}.${c.domain}`);
		const m = r.words.indexOf('modulus');
		if (m >= 0) return gen(+r.vals[m + 1]);
		this.out('Choose the size of the key modulus in the range of 360 to 4096 for your');
		this.out('  General Purpose Keys. Choosing a key modulus greater than 512 may take');
		this.out('  a few minutes.');
		this.out('');
		const q = () =>
			this.ask('How many bits in the modulus [512]:', (a) => {
				const bits = a === '' ? 512 : Number(a);
				if (!Number.isInteger(bits) || bits < 360 || bits > 4096) {
					this.err('% Invalid key size, the range is 360 to 4096');
					return q();
				}
				gen(bits);
			});
		q();
	}

	private reload() {
		const confirm = () =>
			this.ask('Proceed with reload? [confirm]', (a) => {
				if (a === '' || /^y/i.test(a)) this.boot();
			});
		if (!this.dirty) return confirm();
		const q = () =>
			this.ask('System configuration has been modified. Save? [yes/no]:', (a) => {
				if (/^y/i.test(a)) {
					this.out('Building configuration...');
					this.ok('[OK]');
					this.save();
					this.emit('saved');
				} else if (!/^n/i.test(a)) {
					this.err("% Please answer 'yes' or 'no'.");
					return q();
				}
				confirm();
			});
		q();
	}

	private ping(target: string) {
		if (!isIp(target)) {
			this.err('% Unrecognized host or address, or protocol not running.');
			return this.fail('error');
		}
		const n = ipToInt(target);
		const own = this.cfg.ifaces.find((i) => i.ip === target && !i.shut);
		const lan = this.cfg.ifaces.find(
			(i) =>
				i.ip &&
				i.mask &&
				!i.shut &&
				i.cable &&
				networkOf(i.ip, i.mask) === networkOf(target, i.mask)
		);
		const wan = this.isUp('GigabitEthernet0/0');
		const ok =
			!!own ||
			(lan
				? this.bindings.some((b) => b.ip === target) || lan.name === 'GigabitEthernet0/0'
				: wan && n > 0);
		this.out('Type escape sequence to abort.');
		this.out(`Sending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:`);
		this.out(ok ? '!!!!!' : '.....');
		this.out(
			ok
				? 'Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms'
				: 'Success rate is 0 percent (0/5)'
		);
	}

	// ---- Show ----
	private showIpib() {
		this.tbl(
			`${pad('Interface', 23)}${pad('IP-Address', 16)}OK? ${pad('Method', 7)}${pad('Status', 22)}Protocol`
		);
		const rows = [...this.cfg.ifaces];
		for (const i of rows) {
			const status = i.shut ? 'administratively down' : i.cable ? 'up' : 'down';
			const proto = !i.shut && i.cable ? 'up' : 'down';
			const method = i.dhcp ? 'DHCP' : i.ip ? 'manual' : 'unset';
			const ip = i.dhcp && !i.ip ? 'unassigned' : (i.ip ?? 'unassigned');
			this.tbl(`${pad(i.name, 23)}${pad(ip, 16)}YES ${pad(method, 7)}${pad(status, 22)}${proto}`);
		}
		if (this.dev === 'switch')
			this.tbl(
				`${pad('Vlan1', 23)}${pad('unassigned', 16)}YES ${pad('unset', 7)}${pad('administratively down', 22)}down`
			);
	}
	private showBindings() {
		this.tbl('Bindings from all pools not associated with VRF:');
		this.tbl(`${pad('IP address', 16)}${pad('Client-ID/', 22)}${pad('Lease expiration', 24)}Type`);
		this.tbl(`${pad('', 16)}Hardware address/`);
		this.tbl(`${pad('', 16)}User name`);
		for (const b of this.bindings)
			this.tbl(
				`${pad(b.ip, 16)}${pad('01' + b.mac, 22)}${pad('Nov 04 2026 09:14 AM', 24)}Automatic`
			);
	}
	private showPools() {
		for (const p of this.cfg.pools) {
			this.tbl(`Pool ${p.name} :`);
			if (!p.network || !p.mask) {
				this.tbl(' 0 subnet is currently in the pool');
				continue;
			}
			const size = 2 ** (32 - (maskBits(p.mask) ?? 24)) - 2;
			const net = ipToInt(p.network);
			const excl = this.cfg.excluded.reduce((s, [a, b]) => {
				const lo = Math.max(ipToInt(a), net + 1);
				const hi = Math.min(ipToInt(b), net + size);
				return s + Math.max(0, hi - lo + 1);
			}, 0);
			const leased = this.bindings.filter((b) => networkOf(b.ip, p.mask!) === p.network).length;
			this.tbl(` Total addresses                : ${size}`);
			this.tbl(` Leased addresses               : ${leased}`);
			this.tbl(` Excluded addresses             : ${excl}`);
			this.tbl(` ${pad('IP address range', 36)}Leased/Excluded/Total`);
			this.tbl(
				` ${pad(`${intToIp(net + 1)} - ${intToIp(net + size)}`, 36)}${leased} / ${excl} / ${size}`
			);
		}
	}
	private showNat() {
		if (!this.trans.length) return;
		this.tbl(
			`Pro ${pad('Inside global', 22)}${pad('Inside local', 22)}${pad('Outside local', 22)}Outside global`
		);
		for (const t of this.trans)
			this.tbl(
				`${pad(t.proto, 4)}${pad(t.inGlobal, 22)}${pad(t.inLocal, 22)}${pad(t.outLocal, 22)}${t.outGlobal}`
			);
	}
	private showAcls() {
		for (const a of this.cfg.acls) {
			this.tbl(`${a.ext ? 'Extended' : 'Standard'} IP access list ${a.id}`);
			for (const e of a.aces) {
				let body = aceText(e, a.ext, true);
				if (!a.ext && !('any' in e.src) && e.src.wild !== '0.0.0.0')
					body = `${e.action} ${e.src.ip}, wildcard bits ${e.src.wild}`;
				const n = this.hits[`${a.id}:${e.seq}`] ?? 0;
				this.tbl(`    ${e.seq} ${body}${n ? ` (${n} match${n === 1 ? '' : 'es'})` : ''}`);
			}
		}
	}
	private showVlans() {
		const c = this.cfg;
		this.tbl(`VLAN ${pad('Name', 33)}${pad('Status', 10)}Ports`);
		this.tbl(`---- ${'-'.repeat(32)} --------- -------------------------------`);
		const rows = [{ id: 1, name: 'default' }, ...[...c.vlans].sort((a, b) => a.id - b.id)];
		for (const vl of rows) {
			const ports = c.ifaces
				.filter((i) => i.swMode !== 'trunk' && i.vlan === vl.id)
				.map((i) => short(i.name));
			const chunks: string[] = [];
			for (let k = 0; k < ports.length; k += 4) chunks.push(ports.slice(k, k + 4).join(', '));
			this.tbl(`${pad(String(vl.id), 5)}${pad(vl.name, 33)}${pad('active', 10)}${chunks[0] ?? ''}`);
			for (const more of chunks.slice(1)) this.tbl(`${' '.repeat(48)}${more}`);
		}
		for (const [id, name] of [
			[1002, 'fddi-default'],
			[1003, 'token-ring-default'],
			[1004, 'fddinet-default'],
			[1005, 'trnet-default']
		] as const)
			this.tbl(`${pad(String(id), 5)}${pad(name, 33)}act/unsup`);
	}
	private showTrunks() {
		const trunks = this.cfg.ifaces.filter((i) => i.swMode === 'trunk' && !i.shut && i.cable);
		if (!trunks.length) return;
		const vlans = [1, ...this.cfg.vlans.map((x) => x.id).sort((a, b) => a - b)].join(',');
		this.tbl(
			`${pad('Port', 12)}${pad('Mode', 17)}${pad('Encapsulation', 15)}${pad('Status', 14)}Native vlan`
		);
		for (const t of trunks)
			this.tbl(
				`${pad(short(t.name), 12)}${pad('on', 17)}${pad('802.1q', 15)}${pad('trunking', 14)}1`
			);
		this.tbl('');
		this.tbl(`${pad('Port', 12)}Vlans allowed on trunk`);
		for (const t of trunks) this.tbl(`${pad(short(t.name), 12)}1-4094`);
		this.tbl('');
		this.tbl(`${pad('Port', 12)}Vlans allowed and active in management domain`);
		for (const t of trunks) this.tbl(`${pad(short(t.name), 12)}${vlans}`);
	}
	private showSsh() {
		const c = this.cfg;
		if (c.rsa && c.rsa >= 768 && c.domain) {
			this.tbl(`SSH Enabled - version ${c.sshVer === 2 ? '2.0' : '1.99'}`);
			this.tbl('Authentication timeout: 120 secs; Authentication retries: 3');
		} else {
			this.tbl('SSH Disabled - version 1.99');
			this.tbl('%Please create RSA keys to enable SSH (and of atleast 768 bits for SSH v2).');
		}
	}
	private showVersion() {
		const c = this.cfg;
		if (this.dev === 'router') {
			this.tbl(
				'Cisco IOS Software, C2900 Software (C2900-UNIVERSALK9-M), Version 15.7(3)M8, RELEASE SOFTWARE (fc1)'
			);
			this.tbl('Copyright (c) 1986-2021 by Cisco Systems, Inc.');
			this.tbl('');
			this.tbl(`${c.hostname} uptime is 2 hours, 14 minutes`);
			this.tbl('System image file is "flash0:c2900-universalk9-mz.SPA.157-3.M8.bin"');
			this.tbl('');
			this.tbl('Cisco CISCO2911/K9 (revision 1.0) with 491520K/32768K bytes of memory.');
			this.tbl('3 Gigabit Ethernet interfaces');
			this.tbl('255K bytes of non-volatile configuration memory.');
		} else {
			this.tbl(
				'Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE11, RELEASE SOFTWARE (fc3)'
			);
			this.tbl('Copyright (c) 1986-2017 by Cisco Systems, Inc.');
			this.tbl('');
			this.tbl(`${c.hostname} uptime is 2 hours, 14 minutes`);
			this.tbl('');
			this.tbl('cisco WS-C2960-8TC-L (PowerPC405) processor with 65536K bytes of memory.');
			this.tbl('8 FastEthernet interfaces');
			this.tbl('2 Gigabit Ethernet interfaces');
		}
		this.tbl('');
		this.tbl('Configuration register is 0x2102');
	}

	/** running-config or startup-config, rendered the way IOS writes it. */
	render(c: Cfg): string[] {
		const L: string[] = [];
		const sec = (s: string) => (c.pwEncrypt ? `7 ${type7(s)}` : s);
		L.push('!', 'version ' + (this.dev === 'router' ? '15.7' : '15.0'));
		L.push('service timestamps debug datetime msec', 'service timestamps log datetime msec');
		L.push(c.pwEncrypt ? 'service password-encryption' : 'no service password-encryption', '!');
		L.push(`hostname ${c.hostname}`, '!', 'boot-start-marker', 'boot-end-marker', '!');
		if (c.enableSecret) L.push(`enable secret 9 ${fakeHash(c.enableSecret)}`);
		if (c.enablePassword) L.push(`enable password ${sec(c.enablePassword)}`);
		if (c.enableSecret || c.enablePassword) L.push('!');
		L.push('no aaa new-model', '!');
		for (const [a, b] of c.excluded)
			L.push(`ip dhcp excluded-address ${a}${b !== a ? ' ' + b : ''}`);
		if (c.excluded.length) L.push('!');
		for (const p of c.pools) {
			L.push(`ip dhcp pool ${p.name}`);
			if (p.network) L.push(` network ${p.network} ${p.mask}`);
			if (p.gw) L.push(` default-router ${p.gw}`);
			if (p.dns.length) L.push(` dns-server ${p.dns.join(' ')}`);
			L.push('!');
		}
		if (c.noLookup) L.push('no ip domain lookup');
		if (c.domain) L.push(`ip domain name ${c.domain}`);
		if (c.noLookup || c.domain) L.push('!');
		for (const u of c.users)
			L.push(
				u.kind === 'secret'
					? `username ${u.name} secret 9 ${fakeHash(u.secret)}`
					: `username ${u.name} password ${c.pwEncrypt ? sec(u.secret) : '0 ' + u.secret}`
			);
		if (c.users.length) L.push('!');
		if (c.sshVer) L.push(`ip ssh version ${c.sshVer}`, '!');
		for (const i of c.ifaces) {
			L.push(`interface ${i.name}`);
			if (i.desc) L.push(` description ${i.desc}`);
			if (this.dev === 'switch') {
				if (i.vlan !== 1 && i.swMode !== 'trunk') L.push(` switchport access vlan ${i.vlan}`);
				if (i.swMode) L.push(` switchport mode ${i.swMode}`);
			} else
				L.push(
					i.dhcp ? ' ip address dhcp' : i.ip ? ` ip address ${i.ip} ${i.mask}` : ' no ip address'
				);
			if (i.aclIn) L.push(` ip access-group ${i.aclIn} in`);
			if (i.aclOut) L.push(` ip access-group ${i.aclOut} out`);
			if (i.nat) L.push(` ip nat ${i.nat}`);
			if (i.shut) L.push(' shutdown');
			if (this.dev === 'router') L.push(' duplex auto', ' speed auto');
			L.push('!');
		}
		if (this.dev === 'switch') L.push('interface Vlan1', ' no ip address', ' shutdown', '!');
		else L.push('ip forward-protocol nd', '!', 'no ip http server', '!');
		if (c.nat)
			L.push(
				`ip nat inside source list ${c.nat.list} interface ${c.nat.iface}${c.nat.overload ? ' overload' : ''}`,
				'!'
			);
		for (const a of c.acls)
			for (const e of a.aces) L.push(`access-list ${a.id} ${aceText(e, a.ext)}`);
		if (c.acls.length) L.push('!');
		L.push('control-plane', '!');
		const line = (head: string, l: LineCfg, vty: boolean) => {
			L.push(head);
			if (l.acl) L.push(` access-class ${l.acl} in`);
			if (l.pass) L.push(` password ${sec(l.pass)}`);
			if (l.login === 'local') L.push(' login local');
			else if (l.login === 'line' || (vty && l.login === undefined && !l.transport))
				L.push(' login');
			if (l.transport) L.push(` transport input ${l.transport.join(' ')}`);
		};
		line('line con 0', c.con, false);
		if (this.dev === 'router') L.push('line aux 0');
		line('line vty 0 4', c.vty, true);
		L.push('!', 'end');
		return L;
	}
	private showConfig(c: Cfg, running: boolean) {
		const lines = this.render(c);
		const bytes = lines.reduce((s, l) => s + l.length + 1, 0);
		if (running) {
			this.tbl('Building configuration...');
			this.tbl('');
			this.tbl(`Current configuration : ${bytes} bytes`);
		} else this.tbl(`Using ${bytes} out of 262136 bytes`);
		for (const l of lines) this.tbl(l);
	}
}
