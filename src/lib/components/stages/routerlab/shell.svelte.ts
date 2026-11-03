// A tiny RouterOS command line shared by the MikroTik Lab stages. It walks a menu tree the same
// way RouterOS does (unique prefixes, "..", moving into a menu), keeps the history, types hint
// commands out for you, and can run a question by question setup wizard. Each stage supplies
// the tree and a handler that executes the commands it knows.
import {
	closest,
	matchKey,
	tokenize,
	type Arg,
	type RosMenu,
	type RosNode,
	type Word
} from './ros';

export type Ln = {
	tone: 'cmd' | 'out' | 'tbl' | 'err' | 'muted' | 'ok';
	text: string;
	prompt?: string;
};
export type ShellText = { termHint: string; hintUnknown: string; didYouMean: string };
export type Ctx = { id: string; rest: Word[]; args: Arg[] };
export type Question = {
	label: string;
	def: string;
	/** Return a "#" hint line to reject the answer and ask again, or null to accept it. */
	check?: (v: string) => string | null;
};
type Wizard = { qs: Question[]; i: number; answers: string[]; done: (a: string[]) => void };

export class RosShell {
	history = $state<Ln[]>([]);
	menu = $state<string[]>([]);
	identity = $state('nimbus');
	input = $state('');
	typing = $state(false);
	wizard = $state<Wizard | null>(null);
	prompt = $derived(
		this.wizard
			? `${this.wizard.qs[this.wizard.i].label}:`
			: `[admin@${this.identity}] ${this.menu.length ? '/' + this.menu.join(' ') : ''}>`
	);
	private started = false;
	private timer: ReturnType<typeof setInterval> | undefined;
	private pause: ReturnType<typeof setTimeout> | undefined;

	constructor(
		private root: RosMenu,
		private text: () => ShellText,
		private handler: (c: Ctx) => void,
		private onerror: (token?: string) => void
	) {}

	add(tone: Ln['tone'], text: string) {
		this.history = [...this.history, { tone, text }];
	}
	out = (t: string) => this.add('out', t);
	tbl = (t: string) => this.add('tbl', t);
	err = (t: string) => this.add('err', t);
	hint = (t: string) => this.add('muted', t);
	/** Report a mistake in the terminal and let Nim react to it. */
	fail(msg: string, hintLine?: string, token = 'error') {
		this.err(msg);
		if (hintLine) this.hint(hintLine);
		this.onerror(token);
	}

	/** Seed the helper line (kept in sync with the language until the first real command). */
	seed() {
		if (this.started) return;
		const h = this.text().termHint;
		if (this.history.length !== 1 || this.history[0].text !== h)
			this.history = [{ tone: 'muted', text: h }];
	}

	/** Read key=value arguments, accepting unique prefixes of the allowed keys. */
	readArgs(args: Arg[], allowed: string[]): Record<string, string> | null {
		const out: Record<string, string> = {};
		for (const a of args) {
			const k = matchKey(allowed, a.k.toLowerCase());
			if (!k || k === 'ambiguous') {
				this.fail(`expected end of command (line 1 column ${a.col})`);
				return null;
			}
			out[k] = a.v;
		}
		return out;
	}
	/** For commands that take nothing, complain about anything extra. */
	bare(c: Ctx) {
		const extra = c.rest[0] ?? c.args[0];
		if (!extra) return true;
		this.fail(`expected end of command (line 1 column ${extra.col})`);
		return false;
	}

	private nodeAt(path: string[]): RosMenu {
		let n: RosMenu = this.root;
		for (const p of path) {
			const k = n.kids[p];
			if (k && k.kind === 'menu') n = k;
		}
		return n;
	}

	/** Start a setup wizard, one question per line, each prefilled with its default. */
	ask(qs: Question[], done: (answers: string[]) => void) {
		this.wizard = { qs, i: 0, answers: [], done };
		this.input = qs[0].def;
	}

	private answer(raw: string) {
		const w = this.wizard!;
		const q = w.qs[w.i];
		const v = raw.trim() || q.def;
		this.history = [...this.history, { tone: 'cmd', text: v, prompt: `${q.label}:` }];
		const bad = q.check?.(v);
		if (bad) {
			this.hint(bad);
			this.onerror('wizardBad');
			this.input = q.def;
			return;
		}
		const answers = [...w.answers, v];
		if (w.i + 1 < w.qs.length) {
			this.wizard = { ...w, i: w.i + 1, answers };
			this.input = w.qs[w.i + 1].def;
		} else {
			this.wizard = null;
			this.input = '';
			w.done(answers);
		}
	}

	run(raw: string) {
		if (!this.started) {
			this.started = true;
			this.history = [];
		}
		if (this.wizard) return this.answer(raw);
		const line = raw.trim();
		if (!line) return;
		this.history = [...this.history, { tone: 'cmd', text: line, prompt: this.prompt }];

		const here = this.nodeAt(this.menu);
		if (line === '?' || line === 'help') {
			this.out(Object.keys(here.kids).join('   '));
			return;
		}
		const { words, args } = tokenize(line);
		const path = line.startsWith('/') ? [] : [...this.menu];
		let node: RosNode = this.nodeAt(path);
		let i = 0;
		for (; i < words.length; i++) {
			if (node.kind === 'cmd') break;
			const w = words[i].w.toLowerCase();
			if (w === '..') {
				path.pop();
				node = this.nodeAt(path);
				continue;
			}
			const keys = Object.keys(node.kids);
			const k = matchKey(keys, w);
			if (k === 'ambiguous')
				return this.fail(
					`ambiguous value of ${words[i].w} (line 1 column ${words[i].col})`,
					this.text().hintUnknown
				);
			if (!k) {
				const near = closest(keys, w);
				return this.fail(
					`bad command name ${words[i].w} (line 1 column ${words[i].col})`,
					near ? this.text().didYouMean.replace('{word}', near) : this.text().hintUnknown
				);
			}
			node = node.kids[k];
			if (node.kind === 'menu') path.push(k);
		}
		const rest = words.slice(i);
		if (node.kind === 'menu') {
			if (args.length || rest.length)
				return this.fail(
					`syntax error (line 1 column ${(rest[0] ?? args[0]).col})`,
					this.text().hintUnknown
				);
			this.menu = path; // just moving into a menu, like "/ip pool"
			return;
		}
		this.handler({ id: node.id, rest, args });
	}

	/** Type a command out letter by letter, then press Enter (instantly with reduced motion). */
	typeFor(line: string) {
		if (this.typing) return;
		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			this.input = '';
			this.run(line);
			return;
		}
		this.typing = true;
		this.input = '';
		let n = 0;
		this.timer = setInterval(() => {
			n += 1;
			this.input = line.slice(0, n);
			if (n >= line.length) {
				clearInterval(this.timer);
				this.pause = setTimeout(() => {
					this.input = '';
					this.typing = false;
					this.run(line);
				}, 220);
			}
		}, 20);
	}

	destroy() {
		clearInterval(this.timer);
		clearTimeout(this.pause);
	}
}
