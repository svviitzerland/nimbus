// The guided part of a MikroTik Lab lesson. Every Nim beat owns a short script of acts, a command
// the terminal types by itself with its output, or a quiet event for the office drawing. Pure
// helpers only, safe on the server.
import { closest, tokenize } from './ros';

export type Ln = {
	tone: 'cmd' | 'out' | 'tbl' | 'ok' | 'err' | 'muted';
	text: string;
	prompt?: string;
};

/**
 * One step of a beat's script. `cmd` is typed and run, `out` printed after it (a plain string is
 * table output, one starting with "#" is a muted comment), `key` tells the stage something
 * happened (so the drawing can react), and `wait` is the pause after this act.
 */
export type Act = { cmd?: string; out?: (string | Ln)[]; key?: string; wait?: number };

export const toLn = (o: string | Ln): Ln =>
	typeof o !== 'string'
		? o
		: o.startsWith('#')
			? { tone: 'muted', text: o }
			: { tone: 'tbl', text: o };

/**
 * True when a typed line is the command `want` (for example "/ip address print"). Like RouterOS,
 * every word may be shortened to a prefix ("/ip addr pr"), and the leading slash is optional.
 */
export function isCmd(line: string, want: string): boolean {
	const got = tokenize(line.trim().toLowerCase());
	const exp = tokenize(want.toLowerCase());
	if (got.args.length || got.words.length !== exp.words.length) return false;
	return exp.words.every((e, i) => e.w.startsWith(got.words[i].w));
}

/** What the terminal prints for a command the lab does not know, with a nudge to the right one. */
export function unknownLines(
	line: string,
	want: string,
	t: { hintTry: string; didYouMean: string }
): Ln[] {
	const { words } = tokenize(line.trim());
	const exp = tokenize(want).words.map((w) => w.w);
	const bad = words.find((w, i) => !exp[i] || !exp[i].startsWith(w.w.toLowerCase())) ?? words[0];
	const out: Ln[] = [
		{
			tone: 'err',
			text: bad ? `bad command name ${bad.w} (line 1 column ${bad.col})` : 'syntax error'
		}
	];
	const near = bad ? closest(exp, bad.w.toLowerCase()) : '';
	if (near && near !== bad?.w.toLowerCase())
		out.push({ tone: 'muted', text: t.didYouMean.replace('{word}', near) });
	out.push({ tone: 'muted', text: t.hintTry.replace('{cmd}', want) });
	return out;
}
