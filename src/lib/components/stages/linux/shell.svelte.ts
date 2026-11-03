// A small bash like shell on a simulated Ubuntu server (nimbus.com), shared by the Linux lessons.
// It knows the everyday commands (ls, cd, cat, chmod, sudo, tar, and friends), checks real
// permissions, runs shell scripts line by line, and reports every meaningful thing that happens
// as an event so each stage can tick its missions and let Nim react. A stage adds its own
// commands (apt, systemctl, nano) through `handler`.
import {
	basename,
	longDate,
	can,
	chmodSpec,
	closest,
	dir,
	dirname,
	file,
	lookup,
	modeStr,
	parts,
	resolve,
	tilde,
	type FNode,
	type Op
} from './fs';

export type Tone = 'cmd' | 'out' | 'err' | 'muted' | 'ok' | 'warn' | 'dir' | 'exe' | 'hit';
export type Seg = { text: string; tone?: Tone };
export type Ln = { tone: Tone; text: string; prompt?: string; segs?: Seg[]; pre?: boolean };

/** The muted "#" helper lines the shell prints, in the learner's language. */
export interface ShellText {
	termHint: string; // seeded before the first command
	hintUnknown: string; // after a command that does not exist
	didYouMean: string; // template with {word}
	hintMissing: string; // after a path that does not exist
	hintDenied: string; // after a permission error
}

export type Cmd = {
	name: string;
	args: string[];
	sudo: boolean;
	/** The full line after expansion, without the leading sudo. */
	line: string;
	/** True while the line runs from inside a script. */
	script: boolean;
};

export type ShellEvent =
	| { type: 'pwd' }
	| { type: 'cd'; path: string }
	| { type: 'ls'; path: string; long: boolean }
	| { type: 'read'; path: string; cmd: string; sudo: boolean }
	| { type: 'denied'; path: string; cmd: string }
	| { type: 'missing'; path: string; cmd: string }
	| { type: 'unknown'; name: string }
	| { type: 'chmod'; path: string; prev: number; mode: number }
	| { type: 'notOwner'; path: string }
	| { type: 'exec'; path: string; direct: boolean }
	| { type: 'write'; path: string; cmd: string }
	| { type: 'rm'; path: string }
	| { type: 'rmroot' };

export type ShellOpts = {
	fs: FNode;
	text: () => ShellText;
	/** Stage specific commands. Return true when the command was handled. */
	handler?: (c: Cmd, sh: LinuxShell) => boolean;
	/** Every meaningful thing that happened. Return true to skip the default Nim reaction. */
	onevent?: (e: ShellEvent) => boolean | void;
	/** Nim's generic reactions, 'error', 'missing', and 'denied'. */
	react?: (token: string) => void;
	/** Extra command names, for help, Tab completion, and "did you mean". */
	commands?: string[];
	cwd?: string;
	date?: string;
};

const BUILTINS = [
	'ls',
	'cd',
	'pwd',
	'cat',
	'less',
	'head',
	'tail',
	'grep',
	'echo',
	'mkdir',
	'touch',
	'rm',
	'cp',
	'tar',
	'chmod',
	'sudo',
	'whoami',
	'date',
	'clear',
	'help',
	'exit'
];

const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));
const padL = (s: string, n: number) => ' '.repeat(Math.max(0, n - s.length)) + s;

export class LinuxShell {
	fs = $state<FNode>(dir());
	cwd = $state('/home/nim');
	history = $state<Ln[]>([]);
	input = $state('');
	typing = $state(false);
	/** True while output is still streaming in (apt downloads, a reboot). Input waits. */
	busy = $state(false);
	/** A yes or no question waiting for an answer, like apt's "Do you want to continue?". */
	pending = $state<{ q: string; cb: (yes: boolean) => void } | null>(null);
	date = $state('2026-11-03');
	readonly user = 'nim';
	readonly host = 'nimbus';
	readonly home = '/home/nim';
	readonly groups = ['nim', 'sudo'];
	vars: Record<string, string> = {};
	prompt = $derived(this.pending ? this.pending.q : `nim@nimbus:${tilde(this.cwd, this.home)}$`);

	private past: string[] = [];
	private recall = -1;
	private started = false;
	private depth = 0;
	private timers: ReturnType<typeof setTimeout>[] = [];
	private ticker: ReturnType<typeof setInterval> | undefined;

	constructor(private opts: ShellOpts) {
		this.fs = opts.fs;
		if (opts.cwd) this.cwd = opts.cwd;
		if (opts.date) this.date = opts.date;
	}

	// ---- Output helpers ----
	add(tone: Tone, text: string, extra: Partial<Ln> = {}) {
		this.history = [...this.history, { tone, text, ...extra }];
	}
	out = (t: string) => this.add('out', t);
	ok = (t: string) => this.add('ok', t);
	err = (t: string) => this.add('err', t);
	hint = (t: string) => this.add('muted', t);
	/** A table like line that must keep its spacing (scrolls sideways inside the terminal). */
	pre = (t: string, tone: Tone = 'out') => this.add(tone, t, { pre: true });
	segs = (s: Seg[], pre = false) =>
		this.add('out', s.map((x) => x.text).join(''), { segs: s, pre });

	/** Tell the stage what happened, and let Nim say the generic line unless it takes over. */
	fire(e: ShellEvent, token?: string) {
		const handled = this.opts.onevent?.(e);
		if (!handled && token) this.opts.react?.(token);
	}
	/** Report a mistake, with a muted hint underneath, and let Nim react. */
	fail(msg: string, hintLine?: string, token = 'error') {
		this.err(msg);
		if (hintLine) this.hint(hintLine);
		this.opts.react?.(token);
	}

	/** Seed the helper line (kept in sync with the language until the first real command). */
	seed() {
		if (this.started) return;
		const h = this.opts.text().termHint;
		if (this.history.length !== 1 || this.history[0].text !== h)
			this.history = [{ tone: 'muted', text: h }];
	}

	get commands() {
		return [...BUILTINS, ...(this.opts.commands ?? [])];
	}

	// ---- File system helpers ----
	abs(p: string) {
		return resolve(this.cwd, p, this.home);
	}
	node(p: string) {
		return lookup(this.fs, this.abs(p));
	}
	allowed(n: FNode, op: Op, sudo: boolean) {
		return can(n, sudo ? 'root' : this.user, this.groups, op);
	}
	/** Create (or replace) a file or folder at an absolute path. Returns false if the parent is missing. */
	put(abs: string, n: FNode) {
		const parent = lookup(this.fs, dirname(abs));
		if (!parent || parent.kind !== 'dir') return false;
		parent.kids = { ...parent.kids, [basename(abs)]: n };
		return true;
	}
	remove(abs: string) {
		const parent = lookup(this.fs, dirname(abs));
		if (!parent?.kids) return;
		const { [basename(abs)]: _gone, ...rest } = parent.kids;
		void _gone;
		parent.kids = rest;
	}
	sizeOf(n: FNode): number {
		if (n.kind === 'dir') return 4096;
		return n.size ?? (n.body?.length ? n.body.join('\n').length + 1 : 0);
	}

	// ---- Running a line ----
	run(raw: string) {
		if (!this.started) {
			this.started = true;
			this.history = [];
		}
		if (this.pending) {
			const p = this.pending;
			this.pending = null;
			this.add('cmd', raw.trim(), { prompt: p.q });
			p.cb(/^(y|yes|)$/i.test(raw.trim()));
			return;
		}
		const line = raw.trim();
		if (!line) {
			this.add('cmd', '', { prompt: this.prompt });
			return;
		}
		this.past = [...this.past, line].slice(-30);
		this.recall = -1;
		this.add('cmd', line, { prompt: this.prompt });
		this.exec(line, false);
	}

	/** Expand $VAR, ${VAR}, and $(date ...) the way bash would before running. */
	expand(line: string) {
		return line
			.replace(/\$\(\s*date\s*\+%F\s*\)/g, this.date)
			.replace(/\$\(\s*date\s*\)/g, this.longDate())
			.replace(/\$\{(\w+)\}|\$(\w+)/g, (_m, a, b) => {
				const k = a ?? b;
				if (k === 'HOME') return this.home;
				if (k === 'USER') return this.user;
				return this.vars[k] ?? '';
			});
	}
	longDate() {
		return longDate(this.date);
	}

	exec(rawLine: string, script: boolean) {
		const trimmed = rawLine.trim();
		if (!trimmed || trimmed.startsWith('#')) return;
		const assign = /^([A-Za-z_]\w*)=(.*)$/.exec(trimmed);
		if (assign) {
			this.vars[assign[1]] = this.expand(assign[2]).replace(/^["']|["']$/g, '');
			return;
		}
		const line = this.expand(trimmed);
		const toks: string[] = [];
		for (const m of line.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)) toks.push(m[1] ?? m[2] ?? m[3]);
		let sudo = false;
		if (toks[0] === 'sudo') {
			toks.shift();
			sudo = true;
			if (!toks.length) {
				this.err('usage: sudo command');
				return;
			}
		}
		const name = toks[0];
		const args = toks.slice(1);
		const cmd: Cmd = {
			name,
			args,
			sudo,
			line: sudo ? line.replace(/^sudo\s+/, '') : line,
			script
		};
		if (this.opts.handler?.(cmd, this)) return;
		this.builtin(cmd);
	}

	private builtin(c: Cmd) {
		const { name, args, sudo } = c;
		switch (name) {
			case 'help':
				this.out(this.commands.join('  '));
				return;
			case 'clear':
				this.history = [];
				return;
			case 'whoami':
				this.out(sudo ? 'root' : this.user);
				return;
			case 'pwd':
				this.out(this.cwd);
				this.fire({ type: 'pwd' });
				return;
			case 'date':
				this.out(args[0] === '+%F' ? this.date : this.longDate());
				return;
			case 'echo':
				return this.echo(c);
			case 'ls':
				return this.ls(args, sudo);
			case 'll':
				return this.ls(['-la', ...args], sudo);
			case 'cd':
				return this.cd(args[0]);
			case 'cat':
			case 'less':
			case 'more':
			case 'head':
			case 'tail':
				return this.read(c);
			case 'grep':
				return this.grep(c);
			case 'mkdir':
				return this.mkdir(args, sudo);
			case 'touch':
				return this.touch(args, sudo);
			case 'rm':
				return this.rm(args, sudo);
			case 'cp':
				return this.cp(args, sudo);
			case 'tar':
				return this.tar(args, sudo);
			case 'chmod':
				return this.chmod(args, sudo);
			case 'bash':
			case 'sh':
				if (!args[0]) {
					this.hint(this.opts.text().termHint);
					return;
				}
				return this.script(args[0], sudo, false);
			case 'exit':
			case 'logout':
				this.out('logout');
				this.out('Connection to nimbus.com closed.');
				this.hint('$ ssh nim@nimbus.com');
				this.ok('Welcome back to nimbus (Ubuntu 24.04 LTS)');
				this.cwd = this.home;
				return;
		}
		if (name.includes('/')) return this.script(name, sudo, true);
		this.err(`${name}: command not found`);
		const near = closest(this.commands, name.toLowerCase());
		this.hint(
			near ? this.opts.text().didYouMean.replace('{word}', near) : this.opts.text().hintUnknown
		);
		this.fire({ type: 'unknown', name }, 'error');
	}

	private missing(cmd: string, shown: string, msg: string) {
		this.err(msg);
		this.hint(this.opts.text().hintMissing);
		this.fire({ type: 'missing', path: this.abs(shown), cmd }, 'missing');
	}
	private denied(cmd: string, shown: string, msg: string) {
		this.err(msg);
		this.hint(this.opts.text().hintDenied);
		this.fire({ type: 'denied', path: this.abs(shown), cmd }, 'denied');
	}

	private colored(name: string, n: FNode): Seg {
		if (n.kind === 'dir') return { text: name, tone: 'dir' };
		if (n.mode & 0o111) return { text: name, tone: 'exe' };
		return { text: name };
	}

	private ls(args: string[], sudo: boolean) {
		const flags = args.filter((a) => a.startsWith('-')).join('');
		const long = flags.includes('l');
		const all = flags.includes('a');
		const targets = args.filter((a) => !a.startsWith('-'));
		const list = targets.length ? targets : ['.'];
		list.forEach((t, i) => {
			const abs = this.abs(t);
			const n = lookup(this.fs, abs);
			if (!n) return this.missing('ls', t, `ls: cannot access '${t}': No such file or directory`);
			let rows: [string, FNode][];
			if (n.kind === 'file') rows = [[t, n]];
			else {
				if (!this.allowed(n, 'r', sudo))
					return this.denied('ls', t, `ls: cannot open directory '${t}': Permission denied`);
				rows = Object.keys(n.kids ?? {})
					.sort()
					.filter((k) => all || !k.startsWith('.'))
					.map((k) => [k, n.kids![k]] as [string, FNode]);
				if (all) rows = [['.', n], ['..', lookup(this.fs, dirname(abs)) ?? n], ...rows];
			}
			if (list.length > 1) this.out(`${t}:`);
			if (long) {
				if (n.kind === 'dir') this.out(`total ${rows.length * 4}`);
				for (const [k, f] of rows) {
					const lead = `${modeStr(f)} 1 ${pad(f.owner, 5)}${pad(f.group, 5)}${padL(String(this.sizeOf(f)), 5)} Nov  3 09:12 `;
					this.segs([{ text: lead }, this.colored(k, f)], true);
				}
			} else if (rows.length) {
				const s: Seg[] = [];
				rows.forEach(([k, f], j) => {
					if (j) s.push({ text: '  ' });
					s.push(this.colored(k, f));
				});
				this.segs(s);
			}
			if (list.length > 1 && i < list.length - 1) this.out('');
			this.fire({ type: 'ls', path: abs, long });
		});
	}

	private cd(t?: string) {
		const target = t ?? '~';
		const abs = this.abs(target === '-' ? '~' : target);
		const n = lookup(this.fs, abs);
		if (!n) return this.missing('cd', target, `-bash: cd: ${target}: No such file or directory`);
		if (n.kind !== 'dir') {
			this.err(`-bash: cd: ${target}: Not a directory`);
			this.opts.react?.('error');
			return;
		}
		if (!this.allowed(n, 'x', false))
			return this.denied('cd', target, `-bash: cd: ${target}: Permission denied`);
		this.cwd = abs;
		this.fire({ type: 'cd', path: abs });
	}

	/** Find a readable file, printing the right error otherwise. */
	private readable(cmd: string, t: string, sudo: boolean): FNode | null {
		const n = this.node(t);
		if (!n) {
			this.missing(cmd, t, `${cmd}: ${t}: No such file or directory`);
			return null;
		}
		if (n.kind === 'dir') {
			this.err(`${cmd}: ${t}: Is a directory`);
			this.opts.react?.('error');
			return null;
		}
		if (!this.allowed(n, 'r', sudo)) {
			this.denied(cmd, t, `${cmd}: ${t}: Permission denied`);
			return null;
		}
		return n;
	}

	private read(c: Cmd) {
		const files: string[] = [];
		let count = 10;
		for (let i = 0; i < c.args.length; i++) {
			const a = c.args[i];
			if (a === '-n') count = Number(c.args[++i]) || 10;
			else if (/^-\d+$/.test(a)) count = Number(a.slice(1));
			else if (!a.startsWith('-')) files.push(a);
		}
		if (!files.length) {
			this.err(`${c.name}: missing file operand`);
			this.opts.react?.('error');
			return;
		}
		for (const t of files) {
			const n = this.readable(c.name, t, c.sudo);
			if (!n) continue;
			let body = n.body ?? [];
			if (c.name === 'head') body = body.slice(0, count);
			if (c.name === 'tail') body = body.slice(-count);
			for (const l of body) this.out(l);
			this.fire({ type: 'read', path: this.abs(t), cmd: c.name, sudo: c.sudo });
		}
	}

	private grep(c: Cmd) {
		const ci = c.args.includes('-i');
		const rest = c.args.filter((a) => !a.startsWith('-'));
		const [pat, ...files] = rest;
		if (!pat || !files.length) {
			this.err('Usage: grep [OPTION]... PATTERNS [FILE]...');
			this.opts.react?.('error');
			return;
		}
		const esc = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const re = new RegExp(esc, ci ? 'gi' : 'g');
		for (const t of files) {
			const n = this.readable('grep', t, c.sudo);
			if (!n) continue;
			for (const l of n.body ?? []) {
				if (!new RegExp(esc, ci ? 'i' : '').test(l)) continue;
				const s: Seg[] = [];
				let last = 0;
				for (const m of l.matchAll(re)) {
					if (m.index! > last) s.push({ text: l.slice(last, m.index) });
					s.push({ text: m[0], tone: 'hit' });
					last = m.index! + m[0].length;
				}
				if (last < l.length) s.push({ text: l.slice(last) });
				this.segs(files.length > 1 ? [{ text: `${t}:` }, ...s] : s);
			}
			this.fire({ type: 'read', path: this.abs(t), cmd: 'grep', sudo: c.sudo });
		}
	}

	/** Can we create or replace something at this path? Prints the error if not. */
	private writable(cmd: string, t: string, sudo: boolean): string | null {
		const abs = this.abs(t);
		const parent = lookup(this.fs, dirname(abs));
		if (!parent || parent.kind !== 'dir') {
			this.missing(cmd, t, `${cmd}: cannot create '${t}': No such file or directory`);
			return null;
		}
		const existing = lookup(this.fs, abs);
		const target = existing && existing.kind === 'file' ? existing : parent;
		if (!this.allowed(target, 'w', sudo)) {
			this.denied(cmd, t, `${cmd}: cannot create '${t}': Permission denied`);
			return null;
		}
		return abs;
	}
	private owned(sudo: boolean) {
		const who = sudo ? 'root' : this.user;
		return { owner: who, group: who };
	}

	private echo(c: Cmd) {
		const at = c.args.findIndex((a) => a === '>' || a === '>>');
		if (at < 0) {
			this.out(c.args.join(' '));
			return;
		}
		const text = c.args.slice(0, at).join(' ');
		const t = c.args[at + 1];
		if (!t) {
			this.err("-bash: syntax error near unexpected token `newline'");
			return;
		}
		const abs = this.writable('echo', t, c.sudo);
		if (!abs) return;
		const old = lookup(this.fs, abs);
		if (old && c.args[at] === '>>') old.body = [...(old.body ?? []), text];
		else if (old) old.body = [text];
		else this.put(abs, file([text], this.owned(c.sudo)));
		this.fire({ type: 'write', path: abs, cmd: 'echo' });
	}

	private mkdir(args: string[], sudo: boolean) {
		const p = args.includes('-p');
		for (const t of args.filter((a) => !a.startsWith('-'))) {
			const abs = this.abs(t);
			const n = lookup(this.fs, abs);
			if (n) {
				if (!p) {
					this.err(`mkdir: cannot create directory '${t}': File exists`);
					this.opts.react?.('error');
				}
				continue;
			}
			const segs = parts(abs);
			let cur = '';
			for (let i = 0; i < segs.length; i++) {
				const parentAbs = cur || '/';
				cur += '/' + segs[i];
				if (lookup(this.fs, cur)) continue;
				const parent = lookup(this.fs, parentAbs);
				if (!parent || (i < segs.length - 1 && !p)) {
					return this.missing(
						'mkdir',
						t,
						`mkdir: cannot create directory '${t}': No such file or directory`
					);
				}
				if (!this.allowed(parent, 'w', sudo))
					return this.denied(
						'mkdir',
						t,
						`mkdir: cannot create directory '${t}': Permission denied`
					);
				this.put(cur, dir({}, this.owned(sudo)));
			}
			this.fire({ type: 'write', path: abs, cmd: 'mkdir' });
		}
	}

	private touch(args: string[], sudo: boolean) {
		for (const t of args.filter((a) => !a.startsWith('-'))) {
			if (this.node(t)) continue;
			const abs = this.writable('touch', t, sudo);
			if (!abs) continue;
			this.put(abs, file([], this.owned(sudo)));
			this.fire({ type: 'write', path: abs, cmd: 'touch' });
		}
	}

	private rm(args: string[], sudo: boolean) {
		const flags = args.filter((a) => a.startsWith('-')).join('');
		const rec = /r|R/.test(flags);
		const targets = args.filter((a) => !a.startsWith('-'));
		if (!targets.length) {
			this.err('rm: missing operand');
			return;
		}
		for (const t of targets) {
			const abs = this.abs(t);
			if (abs === '/' || t === '/*') {
				this.err("rm: it is dangerous to operate recursively on '/'");
				this.err('rm: use --no-preserve-root to override this failsafe');
				this.fire({ type: 'rmroot' }, 'error');
				return;
			}
			const n = lookup(this.fs, abs);
			if (!n) {
				if (!flags.includes('f'))
					this.missing('rm', t, `rm: cannot remove '${t}': No such file or directory`);
				continue;
			}
			if (n.kind === 'dir' && !rec) {
				this.err(`rm: cannot remove '${t}': Is a directory`);
				this.opts.react?.('error');
				continue;
			}
			const parent = lookup(this.fs, dirname(abs))!;
			if (!this.allowed(parent, 'w', sudo)) {
				this.denied('rm', t, `rm: cannot remove '${t}': Permission denied`);
				continue;
			}
			this.remove(abs);
			this.fire({ type: 'rm', path: abs });
		}
	}

	private clone(n: FNode, sudo: boolean): FNode {
		const o = this.owned(sudo);
		if (n.kind === 'file') return { ...n, ...o, body: [...(n.body ?? [])] };
		const kids: Record<string, FNode> = {};
		for (const [k, v] of Object.entries(n.kids ?? {})) kids[k] = this.clone(v, sudo);
		return { ...n, ...o, kids };
	}

	private cp(args: string[], sudo: boolean) {
		const rec = args.some((a) => /^-.*[rRa]/.test(a));
		const rest = args.filter((a) => !a.startsWith('-'));
		if (rest.length < 2) {
			this.err(
				rest.length
					? `cp: missing destination file operand after '${rest[0]}'`
					: 'cp: missing file operand'
			);
			this.opts.react?.('error');
			return;
		}
		const [src, dest] = rest;
		const n = this.node(src);
		if (!n) return this.missing('cp', src, `cp: cannot stat '${src}': No such file or directory`);
		if (n.kind === 'dir' && !rec) {
			this.err(`cp: -r not specified; omitting directory '${src}'`);
			this.opts.react?.('error');
			return;
		}
		if (!this.allowed(n, 'r', sudo))
			return this.denied('cp', src, `cp: cannot open '${src}' for reading: Permission denied`);
		const d = this.node(dest);
		const target =
			d && d.kind === 'dir' ? `${dest.replace(/\/$/, '')}/${basename(this.abs(src))}` : dest;
		const abs = this.writable('cp', target, sudo);
		if (!abs) return;
		this.put(abs, this.clone(n, sudo));
		this.fire({ type: 'write', path: abs, cmd: 'cp' });
	}

	private tar(args: string[], sudo: boolean) {
		const flags = (args[0] ?? '').replace(/^-/, '');
		if (!flags.includes('c') || !flags.includes('f')) {
			this.err("tar: You must specify one of the '-Acdtrux', '--delete' or '--test-label' options");
			this.hint('# tar -czf backup.tar.gz folder');
			this.opts.react?.('error');
			return;
		}
		const [out, ...srcs] = args.slice(1);
		if (!out || !srcs.length) {
			this.err('tar: Cowardly refusing to create an empty archive');
			this.opts.react?.('error');
			return;
		}
		let total = 0;
		let bad = false;
		const listed: string[] = [];
		const walk = (n: FNode, name: string) => {
			total += this.sizeOf(n);
			listed.push(name + (n.kind === 'dir' ? '/' : ''));
			for (const [k, v] of Object.entries(n.kids ?? {})) walk(v, `${name}/${k}`);
		};
		if (srcs.some((s) => s.startsWith('/')))
			this.out("tar: Removing leading `/' from member names");
		for (const s of srcs) {
			const n = this.node(s);
			if (!n) {
				this.err(`tar: ${s}: Cannot stat: No such file or directory`);
				bad = true;
				continue;
			}
			walk(n, s.replace(/^\//, ''));
		}
		const abs = this.abs(out);
		const parent = lookup(this.fs, dirname(abs));
		if (!parent || parent.kind !== 'dir') {
			this.err(`tar: ${out}: Cannot open: No such file or directory`);
			this.err('tar: Error is not recoverable: exiting now');
			this.hint(this.opts.text().hintMissing);
			this.fire({ type: 'missing', path: dirname(abs), cmd: 'tar' }, 'missing');
			return;
		}
		if (!this.allowed(parent, 'w', sudo))
			return this.denied('tar', out, `tar: ${out}: Cannot open: Permission denied`);
		if (flags.includes('v')) for (const l of listed) this.out(l);
		this.put(abs, file([], { ...this.owned(sudo), size: Math.max(180, Math.round(total / 3)) }));
		if (bad) {
			this.err('tar: Exiting with failure status due to previous errors');
			this.opts.react?.('missing');
		}
		this.fire({ type: 'write', path: abs, cmd: 'tar' });
	}

	private chmod(args: string[], sudo: boolean) {
		const rest = args.filter((a) => !/^-[a-zA-Z]+$/.test(a));
		const [spec, ...targets] = rest;
		if (!spec || !targets.length) {
			this.err(spec ? `chmod: missing operand after '${spec}'` : 'chmod: missing operand');
			this.hint('# chmod u+x backup.sh');
			this.opts.react?.('error');
			return;
		}
		for (const t of targets) {
			const n = this.node(t);
			if (!n) {
				this.missing('chmod', t, `chmod: cannot access '${t}': No such file or directory`);
				continue;
			}
			const mode = chmodSpec(n.mode, spec);
			if (mode === null) {
				this.err(`chmod: invalid mode: '${spec}'`);
				this.hint('# chmod u+x backup.sh');
				this.opts.react?.('error');
				return;
			}
			if (!sudo && n.owner !== this.user) {
				this.err(`chmod: changing permissions of '${t}': Operation not permitted`);
				this.hint(this.opts.text().hintDenied);
				this.fire({ type: 'notOwner', path: this.abs(t) }, 'denied');
				continue;
			}
			const prev = n.mode;
			n.mode = mode;
			this.fire({ type: 'chmod', path: this.abs(t), prev, mode });
		}
	}

	/** Run a script line by line, like bash does. `direct` means it was started as ./name. */
	script(t: string, sudo: boolean, direct: boolean) {
		const n = this.node(t);
		const shown = direct ? `-bash: ${t}` : `bash: ${t}`;
		if (!n) return this.missing('run', t, `${shown}: No such file or directory`);
		if (n.kind === 'dir') {
			this.err(`${shown}: Is a directory`);
			this.opts.react?.('error');
			return;
		}
		const okRun = direct ? this.allowed(n, 'x', sudo) : this.allowed(n, 'r', sudo);
		if (!okRun) return this.denied('run', t, `${shown}: Permission denied`);
		if (this.depth > 2) return;
		this.depth += 1;
		const keep = this.cwd;
		for (const l of n.body ?? []) this.exec(l, true);
		this.cwd = keep;
		this.depth -= 1;
		this.fire({ type: 'exec', path: this.abs(t), direct });
	}

	// ---- Time based output ----
	private get reduced() {
		return (
			typeof window !== 'undefined' &&
			!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
		);
	}
	/** Run fn after a delay (right away with reduced motion). Cleared on destroy. */
	after(ms: number, fn: () => void) {
		if (this.reduced) return fn();
		this.timers.push(setTimeout(fn, ms));
	}
	/**
	 * Stream lines in over time (numbers are pauses in ms). Input waits until it is done.
	 * With reduced motion everything appears at once.
	 */
	play(steps: (Ln | number)[], done?: () => void) {
		this.busy = true;
		const lines = [...steps];
		const next = () => {
			while (lines.length) {
				const s = lines.shift()!;
				if (typeof s === 'number') {
					if (!this.reduced) {
						this.timers.push(setTimeout(next, s));
						return;
					}
					continue;
				}
				this.history = [...this.history, s];
			}
			this.busy = false;
			done?.();
		};
		next();
	}
	/** Ask a yes or no question; the next line typed is the answer (Enter alone means yes). */
	ask(q: string, cb: (yes: boolean) => void) {
		this.pending = { q, cb };
	}

	// ---- Keyboard niceties ----
	/** Up and Down walk through earlier commands. */
	step(dir: -1 | 1) {
		if (!this.past.length) return;
		if (this.recall === -1) this.recall = this.past.length;
		this.recall = Math.min(this.past.length, Math.max(0, this.recall + dir));
		this.input = this.past[this.recall] ?? '';
	}
	/** Tab completes a command name or a path, like bash. */
	complete() {
		const v = this.input;
		const m = /(\S*)$/.exec(v)!;
		const word = m[1];
		const head = v.slice(0, v.length - word.length);
		const first = !head.trim() || head.trim() === 'sudo';
		let options: string[];
		let base = '';
		if (first && !word.includes('/')) options = this.commands.filter((c) => c.startsWith(word));
		else {
			const cut = word.lastIndexOf('/');
			base = cut >= 0 ? word.slice(0, cut + 1) : '';
			const prefix = word.slice(cut + 1);
			const d = lookup(this.fs, this.abs(base || '.'));
			options =
				d?.kind === 'dir'
					? Object.keys(d.kids ?? {})
							.filter((k) => k.startsWith(prefix))
							.map((k) => (d.kids![k].kind === 'dir' ? k + '/' : k + ' '))
					: [];
		}
		if (!options.length) return;
		let common = options[0];
		for (const o of options) while (!o.startsWith(common)) common = common.slice(0, -1);
		if (options.length === 1 && first) common = options[0] + ' ';
		if (options.length > 1) common = common.replace(/[ /]$/, '');
		this.input = head + base + common;
	}

	/** Type a command out letter by letter, then press Enter (instantly with reduced motion). */
	typeFor(line: string) {
		if (this.typing || this.busy) return;
		if (this.reduced) {
			this.input = '';
			this.run(line);
			return;
		}
		this.typing = true;
		this.input = '';
		let n = 0;
		this.ticker = setInterval(() => {
			n += 1;
			this.input = line.slice(0, n);
			if (n >= line.length) {
				clearInterval(this.ticker);
				this.timers.push(
					setTimeout(() => {
						this.input = '';
						this.typing = false;
						this.run(line);
					}, 220)
				);
			}
		}, 20);
	}

	destroy() {
		clearInterval(this.ticker);
		for (const t of this.timers) clearTimeout(t);
		this.timers = [];
	}
}
