// Tiny syntax highlighters and page helpers shared by the frontend lessons.
// Tokens are rendered as plain text spans by TypedCode, never as raw HTML.

export type TokKind =
	| 'txt'
	| 'pun'
	| 'tag'
	| 'att'
	| 'str'
	| 'com'
	| 'sel'
	| 'prop'
	| 'val'
	| 'kw'
	| 'num';
export type Tok = { k: TokKind; v: string };
export type CodeLang = 'html' | 'css' | 'js';

function html(src: string): Tok[] {
	const out: Tok[] = [];
	const tagRe = /<!--[\s\S]*?(-->|$)|<\/?[a-zA-Z][a-zA-Z0-9]*[^<>]*>?/g;
	let last = 0;
	for (const m of src.matchAll(tagRe)) {
		const i = m.index ?? 0;
		if (i > last) out.push({ k: 'txt', v: src.slice(last, i) });
		const raw = m[0];
		if (raw.startsWith('<!--')) {
			out.push({ k: 'com', v: raw });
			last = i + raw.length;
			continue;
		}
		const head = /^(<\/?)([a-zA-Z][a-zA-Z0-9]*)/.exec(raw);
		if (head) {
			out.push({ k: 'pun', v: head[1] });
			out.push({ k: 'tag', v: head[2] });
			const rest = raw.slice(head[0].length);
			const partRe = /(\s+)|("[^"]*"?|'[^']*'?)|(\/?>)|(=)|([^\s"'=>]+)/g;
			for (const p of rest.matchAll(partRe)) {
				if (p[1]) out.push({ k: 'txt', v: p[1] });
				else if (p[2]) out.push({ k: 'str', v: p[2] });
				else if (p[3] || p[4]) out.push({ k: 'pun', v: p[0] });
				else out.push({ k: 'att', v: p[0] });
			}
		} else out.push({ k: 'txt', v: raw });
		last = i + raw.length;
	}
	if (last < src.length) out.push({ k: 'txt', v: src.slice(last) });
	return out;
}

function css(src: string): Tok[] {
	const out: Tok[] = [];
	const re = /(\/\*[\s\S]*?(?:\*\/|$))|([{}:;])|(\s+)|([^{}:;\s/]+|\/)/g;
	let depth = 0;
	let inValue = false;
	for (const m of src.matchAll(re)) {
		const v = m[0];
		if (m[1]) out.push({ k: 'com', v });
		else if (m[3]) out.push({ k: 'txt', v });
		else if (m[2]) {
			if (v === '{') {
				depth++;
				inValue = false;
			} else if (v === '}') {
				depth = Math.max(0, depth - 1);
				inValue = false;
			} else if (v === ':' && depth > 0) inValue = true;
			else if (v === ';') inValue = false;
			// A colon outside a block belongs to a selector, like a:hover.
			out.push({ k: v === ':' && depth === 0 ? 'sel' : 'pun', v });
		} else out.push({ k: depth === 0 ? 'sel' : inValue ? 'val' : 'prop', v });
	}
	return out;
}

const KW = new Set([
	'let',
	'const',
	'var',
	'function',
	'return',
	'if',
	'else',
	'true',
	'false',
	'null',
	'undefined',
	'new',
	'this'
]);

function js(src: string): Tok[] {
	const out: Tok[] = [];
	const re =
		/(\/\/[^\n]*)|(\/\*[\s\S]*?(?:\*\/|$))|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?|`(?:[^`\\]|\\.)*`?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g;
	for (const m of src.matchAll(re)) {
		const v = m[0];
		if (m[1] || m[2]) out.push({ k: 'com', v });
		else if (m[3]) out.push({ k: 'str', v });
		else if (m[4]) out.push({ k: 'num', v });
		else if (m[5]) out.push({ k: KW.has(v) ? 'kw' : 'txt', v });
		else if (m[6]) out.push({ k: 'txt', v });
		else out.push({ k: 'pun', v });
	}
	return out;
}

export function tokenize(src: string, lang: CodeLang): Tok[] {
	const out = lang === 'css' ? css(src) : lang === 'js' ? js(src) : html(src);
	// A trailing space keeps the last empty line tall enough to match the textarea.
	out.push({ k: 'txt', v: ' ' });
	return out;
}

/** Nim as a small inline picture, so previews never need to load anything from outside. */
const NIM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><path d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z" fill="#2e6fe0"/><circle cx="50" cy="44" r="5" fill="#fff"/><circle cx="72" cy="44" r="5" fill="#fff"/><circle cx="51" cy="45" r="2.4" fill="#16212b"/><circle cx="73" cy="45" r="2.4" fill="#16212b"/><path d="M53 56q8 6 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`;
export const NIM_DATA = `data:image/svg+xml,${encodeURIComponent(NIM_SVG)}`;

/** Escape text before it goes inside a preview document. */
export function esc(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** A whole preview document. No network at all, scripts only when the caller allows them. */
export function pageDoc(opts: { css: string; body: string; head?: string; scripts?: boolean }) {
	const csp = opts.scripts
		? "default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'"
		: "default-src 'none'; img-src data:; style-src 'unsafe-inline'";
	return (
		'<!doctype html><html><head><meta charset="utf-8">' +
		`<meta http-equiv="Content-Security-Policy" content="${csp}">` +
		(opts.head ?? '') +
		`<style>${opts.css.replace(/</g, '')}</style></head><body>${opts.body}</body></html>`
	);
}
