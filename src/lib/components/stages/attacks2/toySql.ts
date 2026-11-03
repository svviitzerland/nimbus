/**
 * A tiny pretend database for the SQL injection lesson. It never talks to a real database,
 * it only reads the WHERE part of one query with plain string logic and checks it against
 * two made up rows, so the learner can see an injection work (and then fail once fixed).
 */

export interface UserRow {
	id: number;
	name: string;
	pass: string;
}

export const USERS: UserRow[] = [
	{ id: 1, name: 'admin', pass: 's3cret!' },
	{ id: 2, name: 'nim', pass: 'cloud42' }
];

export type ToyResult =
	| { kind: 'row'; row: UserRow }
	| { kind: 'none' }
	| { kind: 'error' }
	| { kind: 'drop' };

type Tok =
	| { t: 'str'; v: string }
	| { t: 'num'; v: number }
	| { t: 'id'; v: string }
	| { t: 'op'; v: string }
	| { t: 'semi' };

type Operand = { k: 'col'; name: 'id' | 'name' | 'pass' } | { k: 'lit'; v: string | number };
type Node =
	| { k: 'or' | 'and'; a: Node; b: Node }
	| { k: 'not'; a: Node }
	| { k: 'cmp'; op: string; l: Operand; r: Operand };

function tokenize(s: string): Tok[] | null {
	const out: Tok[] = [];
	let i = 0;
	while (i < s.length) {
		const c = s[i];
		if (/\s/.test(c)) {
			i++;
			continue;
		}
		// A line comment hides everything after it.
		if ((c === '-' && s[i + 1] === '-') || c === '#') break;
		if (c === "'") {
			let j = i + 1;
			let v = '';
			for (;;) {
				if (j >= s.length) return null; // the text was never closed
				if (s[j] === "'") {
					if (s[j + 1] === "'") {
						v += "'";
						j += 2;
						continue;
					}
					break;
				}
				v += s[j];
				j++;
			}
			out.push({ t: 'str', v });
			i = j + 1;
			continue;
		}
		if (/[0-9]/.test(c)) {
			let j = i;
			while (j < s.length && /[0-9]/.test(s[j])) j++;
			out.push({ t: 'num', v: Number(s.slice(i, j)) });
			i = j;
			continue;
		}
		if (/[A-Za-z_]/.test(c)) {
			let j = i;
			while (j < s.length && /\w/.test(s[j])) j++;
			out.push({ t: 'id', v: s.slice(i, j).toLowerCase() });
			i = j;
			continue;
		}
		const two = s.slice(i, i + 2);
		if (two === '!=' || two === '<>' || two === '<=' || two === '>=') {
			out.push({ t: 'op', v: two });
			i += 2;
			continue;
		}
		if ('=<>()'.includes(c)) {
			out.push({ t: 'op', v: c });
			i++;
			continue;
		}
		if (c === ';') {
			out.push({ t: 'semi' });
			i++;
			continue;
		}
		return null;
	}
	return out;
}

class Parser {
	pos = 0;
	constructor(readonly toks: Tok[]) {}
	peek() {
		return this.toks[this.pos];
	}
	isWord(w: string) {
		const t = this.peek();
		return t?.t === 'id' && t.v === w;
	}
	isOp(o: string) {
		const t = this.peek();
		return t?.t === 'op' && t.v === o;
	}
	expr(): Node {
		let a = this.term();
		while (this.isWord('or')) {
			this.pos++;
			a = { k: 'or', a, b: this.term() };
		}
		return a;
	}
	term(): Node {
		let a = this.factor();
		while (this.isWord('and')) {
			this.pos++;
			a = { k: 'and', a, b: this.factor() };
		}
		return a;
	}
	factor(): Node {
		if (this.isWord('not')) {
			this.pos++;
			return { k: 'not', a: this.factor() };
		}
		if (this.isOp('(')) {
			this.pos++;
			const a = this.expr();
			if (!this.isOp(')')) throw new Error('paren');
			this.pos++;
			return a;
		}
		const l = this.operand();
		const t = this.peek();
		if (t?.t !== 'op' || t.v === '(' || t.v === ')') throw new Error('op');
		this.pos++;
		return { k: 'cmp', op: t.v, l, r: this.operand() };
	}
	operand(): Operand {
		const t = this.peek();
		this.pos++;
		if (t?.t === 'str' || t?.t === 'num') return { k: 'lit', v: t.v };
		if (t?.t === 'id' && (t.v === 'id' || t.v === 'name' || t.v === 'pass'))
			return { k: 'col', name: t.v };
		throw new Error('operand');
	}
}

function value(o: Operand, row: UserRow) {
	return o.k === 'col' ? row[o.name] : o.v;
}

function test(n: Node, row: UserRow): boolean {
	if (n.k !== 'cmp') {
		if (n.k === 'not') return !test(n.a, row);
		return n.k === 'or' ? test(n.a, row) || test(n.b, row) : test(n.a, row) && test(n.b, row);
	}
	const l = value(n.l, row);
	const r = value(n.r, row);
	const num = typeof l === 'number' && typeof r === 'number';
	const a = num ? l : String(l);
	const b = num ? r : String(r);
	switch (n.op) {
		case '=':
			return a === b;
		case '!=':
		case '<>':
			return a !== b;
		case '<':
			return a < b;
		case '>':
			return a > b;
		case '<=':
			return a <= b;
		default:
			return a >= b;
	}
}

/** The vulnerable way, the typed text is glued straight into the query. */
export function gluedLogin(user: string, pass: string): ToyResult {
	const toks = tokenize(`name = '${user}' AND pass = '${pass}'`);
	if (!toks) return { kind: 'error' };
	const p = new Parser(toks);
	let where: Node;
	try {
		where = p.expr();
	} catch {
		return { kind: 'error' };
	}
	const rest = toks.slice(p.pos);
	if (rest.length && rest[0].t !== 'semi') return { kind: 'error' };
	const words = rest.filter((t) => t.t === 'id').map((t) => (t as { v: string }).v);
	if (words[0] === 'drop' && words[1] === 'table') return { kind: 'drop' };
	if (words.length) return { kind: 'error' };
	const row = USERS.find((r) => test(where, r));
	return row ? { kind: 'row', row } : { kind: 'none' };
}

/** The safe way, the text is only ever compared as data. */
export function paramLogin(user: string, pass: string): ToyResult {
	const row = USERS.find((r) => r.name === user && r.pass === pass);
	return row ? { kind: 'row', row } : { kind: 'none' };
}
