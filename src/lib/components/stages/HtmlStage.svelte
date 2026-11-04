<script lang="ts">
	// A guided HTML lesson. The page builds itself tag by tag in the editor while the preview
	// (a sandboxed iframe) grows next to it, following Nim's beats. On the last beat the editor
	// becomes editable, so the learner may change one line and watch the page follow.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HtmlText } from '$lib/chapters/web/html/types';
	import { prefersReducedMotion } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HtmlText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	// ---- The four lines, and the beat on which each one gets its tag ----
	type Line = { open: string; inner: string; close: string; at: number };
	const lines = $derived<Line[]>([
		{ open: '<h1>', inner: tx.lines.heading, close: '</h1>', at: 2 },
		{ open: '<p>', inner: tx.lines.paragraph, close: '</p>', at: 4 },
		{ open: '<button>', inner: tx.lines.button, close: '</button>', at: 5 },
		// The picture has no plain text form, it only appears once its beat comes.
		{ open: `<img src="nim.png" alt="${tx.lines.alt}">`, inner: '', close: '', at: 6 }
	]);
	const fullCode = $derived(lines.map((l) => l.open + l.inner + l.close).join('\n'));

	// How many tag characters have been typed on the current beat.
	let typed = $state(999);
	const typingLine = $derived(lines.findIndex((l) => l.at === step));
	const tagLen = (l: Line) => l.open.length + l.close.length;
	$effect(() => {
		const k = typingLine;
		const still = reduce;
		return untrack(() => {
			if (k < 0 || still) {
				typed = 999;
				return;
			}
			typed = 0;
			const total = tagLen(lines[k]);
			const t = setInterval(() => {
				typed += 1;
				if (typed >= total) clearInterval(t);
			}, 75);
			return () => clearInterval(t);
		});
	});

	type View = { open: string; inner: string; close: string; plain: boolean; typing: boolean };
	/** What each line looks like right now (null when it is not on the page yet). */
	const view = $derived<(View | null)[]>(
		lines.map((l, k) => {
			const isImg = !l.inner;
			if (step < l.at)
				return isImg ? null : { open: '', inner: l.inner, close: '', plain: true, typing: false };
			if (step > l.at || typed >= tagLen(l))
				return { open: l.open, inner: l.inner, close: l.close, plain: false, typing: false };
			// Typing now, the opening tag first, then the closing tag.
			const o = Math.min(typed, l.open.length);
			const c = Math.max(0, typed - l.open.length);
			return {
				open: l.open.slice(0, o),
				inner: isImg && o < l.open.length ? '' : l.inner,
				close: l.close.slice(0, c),
				plain: false,
				typing: k === typingLine
			};
		})
	);
	// The preview only takes lines whose tags are complete, so half typed tags never flash.
	const watchCode = $derived(
		lines
			.map((l, k) => {
				const v = view[k];
				if (!v) return null;
				if (v.typing) return l.inner || null;
				return v.open + v.inner + v.close;
			})
			.filter((s): s is string => s !== null)
			.join('\n')
	);

	// ---- Optional editing on the last beat ----
	const editable = $derived(step === last);
	let code = $state('');
	let started = false;
	$effect(() => {
		if (!editable) return;
		untrack(() => {
			if (!started) {
				code = fullCode;
				started = true;
			}
		});
	});
	let saidEdited = false;
	function onInput() {
		if (!saidEdited && code !== fullCode) {
			saidEdited = true;
			onstate?.('edited');
		}
	}
	function resetCode() {
		code = fullCode;
	}

	const PAIRED = ['h1', 'h2', 'h3', 'p', 'button', 'a'];
	function findUnclosed(src: string): string | null {
		for (const t of PAIRED) {
			const opens = (src.match(new RegExp(`<${t}(\\s[^>]*)?>`, 'gi')) ?? []).length;
			const closes = (src.match(new RegExp(`<\\/${t}\\s*>`, 'gi')) ?? []).length;
			if (opens > closes) return t;
		}
		return null;
	}
	let unclosed = $state<string | null>(null);
	let lastHinted: string | null = null;
	$effect(() => {
		if (!editable) {
			unclosed = null;
			return;
		}
		const src = code;
		return untrack(() => {
			if (unclosed && !findUnclosed(src)) {
				unclosed = null;
				lastHinted = null;
			}
			const t = setTimeout(() => {
				const u = findUnclosed(src);
				unclosed = u;
				if (u && u !== lastHinted) {
					lastHinted = u;
					onstate?.('unclosed');
				}
				if (!u) lastHinted = null;
			}, 1300);
			return () => clearTimeout(t);
		});
	});
	const hintText = $derived(
		unclosed
			? tx.unclosedHint.replace('{open}', `<${unclosed}>`).replace('{close}', `</${unclosed}>`)
			: ''
	);

	// ---- Highlighting, tokens rendered as plain text spans, never as raw HTML ----
	type Tok = { k: 'txt' | 'pun' | 'tag' | 'att' | 'str'; v: string };
	function tokenize(src: string): Tok[] {
		const out: Tok[] = [];
		const tagRe = /<\/?[a-zA-Z][a-zA-Z0-9]*[^<>]*>?|<\/?/g;
		let lastI = 0;
		for (const m of src.matchAll(tagRe)) {
			const i = m.index ?? 0;
			if (i > lastI) out.push({ k: 'txt', v: src.slice(lastI, i) });
			const raw = m[0];
			const head = /^(<\/?)([a-zA-Z][a-zA-Z0-9]*)?/.exec(raw);
			if (head) {
				out.push({ k: 'pun', v: head[1] });
				if (head[2]) out.push({ k: 'tag', v: head[2] });
				const rest = raw.slice(head[0].length);
				const partRe = /(\s+)|("[^"]*"?|'[^']*'?)|(\/?>)|(=)|([^\s"'=>]+)/g;
				for (const p of rest.matchAll(partRe)) {
					if (p[1]) out.push({ k: 'txt', v: p[1] });
					else if (p[2]) out.push({ k: 'str', v: p[2] });
					else if (p[3] || p[4]) out.push({ k: 'pun', v: p[0] });
					else out.push({ k: 'att', v: p[0] });
				}
			} else out.push({ k: 'txt', v: raw });
			lastI = i + raw.length;
		}
		if (lastI < src.length) out.push({ k: 'txt', v: src.slice(lastI) });
		return out;
	}
	const editTokens = $derived([...tokenize(code), { k: 'txt' as const, v: ' ' }]);

	let ta = $state<HTMLTextAreaElement | null>(null);
	let hl = $state<HTMLPreElement | null>(null);
	function syncScroll() {
		if (hl && ta) {
			hl.scrollTop = ta.scrollTop;
			hl.scrollLeft = ta.scrollLeft;
		}
	}

	// ---- Preview, a sandboxed iframe (no scripts, no outside requests) ----
	const NIM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><path d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z" fill="#2e6fe0"/><circle cx="50" cy="44" r="5" fill="#fff"/><circle cx="72" cy="44" r="5" fill="#fff"/><circle cx="51" cy="45" r="2.4" fill="#16212b"/><circle cx="73" cy="45" r="2.4" fill="#16212b"/><path d="M53 56q8 6 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`;
	const NIM_DATA = `data:image/svg+xml,${encodeURIComponent(NIM_SVG)}`;
	const BASE_CSS = [
		'html{background:#fff;color:#16212b}',
		'body{margin:12px;font:14px/1.45 system-ui,sans-serif;overflow-wrap:anywhere}',
		'h1{font-size:1.6em;margin:.2em 0 .4em}',
		'p{margin:.4em 0 .8em}',
		'img{max-width:100%;height:auto;max-height:80px;display:block;margin:.5em 0}',
		'a{color:#2e6fe0;pointer-events:none}',
		'button{font:inherit;padding:4px 12px;margin:.2em 0}'
	].join('');
	const previewCode = $derived(editable ? code : watchCode);
	const srcdoc = $derived.by(() => {
		const body = previewCode
			.replace(/<\/?(meta|base|link|script|iframe|object|embed|style)\b[^>]*>/gi, '')
			.replace(/(<img\b[^>]*\bsrc\s*=\s*)(["']?)nim\.png\2/gi, `$1"${NIM_DATA}"`);
		return (
			'<!doctype html><html><head><meta charset="utf-8">' +
			`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'">` +
			`<style>${BASE_CSS}</style></head><body>${body}</body></html>`
		);
	});
</script>

{#snippet seg(s: string, cls: string)}{#each tokenize(s) as t, n (n)}<span class="{t.k} {cls}"
			>{t.v}</span
		>{/each}{/snippet}

{#snippet visual(i: number)}
	<div class="vis">
		<div class="pane editor" class:live={i === last}>
			<div class="bar">
				<span class="lights" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="fname">{tx.editorLabel}</span>
				{#if i === last}
					<span class="hintchip">{tx.editHint}</span>
					<button type="button" class="reset" onclick={resetCode}>{tx.reset}</button>
				{/if}
			</div>
			{#if i === last}
				<div class="code edit">
					<pre class="hl" bind:this={hl} aria-hidden="true">{#each editTokens as t, n (n)}<span
								class={t.k}>{t.v}</span
							>{/each}</pre>
					<textarea
						bind:this={ta}
						bind:value={code}
						oninput={onInput}
						onscroll={syncScroll}
						spellcheck="false"
						autocapitalize="off"
						autocomplete="off"
						aria-label={tx.editorLabel}
					></textarea>
				</div>
				{#if hintText}
					<p class="hint" role="status">{hintText}</p>
				{/if}
			{:else}
				<pre class="code watch" aria-label={tx.editorLabel}>{#each view as v, k (k)}{#if v}<span
								class="ln"
								class:cur={v.typing}
								class:plain={v.plain}
								>{@render seg(v.open, '')}<span class="txt">{v.inner}</span>{@render seg(
									v.close,
									i === 3 && k === 0 ? 'pulse' : ''
								)}{#if v.typing}<span class="caret"></span>{/if}</span
							>{'\n'}{/if}{/each}</pre>
			{/if}
		</div>

		<div class="pane browser" class:ring={i === 1}>
			<div class="addr">
				<span class="led" class:on={i >= 6}></span>
				<span class="url">{tx.previewLabel}</span>
			</div>
			<iframe title={tx.previewLabel} sandbox="" {srcdoc}></iframe>
		</div>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		max-width: 460px;
		flex-direction: column;
		gap: 10px;
	}
	.pane {
		display: flex;
		min-width: 0;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}
	.pane.ring,
	.editor.live {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px var(--color-brand-soft);
	}
	.bar,
	.addr {
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid var(--color-line);
		padding: 7px 10px;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.lights {
		display: inline-flex;
		gap: 4px;
	}
	.lights i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.fname {
		flex: 1;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
	}
	.hintchip {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 2px 8px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.reset {
		border-radius: 6px;
		padding: 2px 6px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.reset:hover {
		background: var(--color-paper);
		color: var(--color-ink);
	}

	.code {
		margin: 0;
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		line-height: 1.6;
		tab-size: 2;
	}
	.watch {
		min-height: 118px;
		padding: 10px 12px;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--color-ink);
	}
	.ln {
		border-radius: 4px;
		transition: background 0.3s;
	}
	.ln.cur {
		background: var(--color-brand-soft);
	}
	.ln.plain .txt {
		color: var(--color-muted);
	}
	.caret {
		display: inline-block;
		width: 1.5px;
		height: 1em;
		margin-left: 1px;
		vertical-align: -2px;
		background: var(--color-brand);
		animation: caret 0.8s steps(2) infinite;
	}
	@keyframes caret {
		50% {
			opacity: 0;
		}
	}
	.pulse {
		border-radius: 3px;
		background: var(--color-amber-soft);
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			background: transparent;
		}
	}

	.edit {
		position: relative;
		height: 140px;
	}
	.hl,
	textarea {
		position: absolute;
		inset: 0;
		margin: 0;
		border: 0;
		padding: 10px 12px;
		font: inherit;
		line-height: inherit;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		word-break: normal;
		overflow: auto;
	}
	.hl {
		pointer-events: none;
		color: var(--color-ink);
		scrollbar-width: none;
	}
	.hl::-webkit-scrollbar {
		display: none;
	}
	textarea {
		resize: none;
		outline: none;
		background: transparent;
		color: transparent;
		caret-color: var(--color-ink);
	}
	textarea::selection {
		background: rgba(46, 111, 224, 0.25);
	}
	.pun {
		color: var(--color-faint);
	}
	.tag {
		font-weight: 600;
		color: var(--color-brand);
	}
	.att {
		color: var(--color-amber);
	}
	.str {
		color: var(--color-grass);
	}
	.hint {
		margin: 0;
		border-top: 1px solid var(--color-line);
		background: var(--color-amber-soft);
		padding: 7px 11px;
		font-size: 12px;
		color: var(--color-ink);
	}

	.led {
		flex: none;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-muted);
		transition: background 0.3s;
	}
	.led.on {
		background: var(--color-grass);
	}
	.url {
		flex: 1;
		border-radius: 999px;
		background: var(--color-paper);
		padding: 3px 10px;
		font-weight: 600;
		color: var(--color-ink);
	}
	iframe {
		display: block;
		width: 100%;
		height: 200px;
		border: 0;
		background: #fff;
	}

	@media (prefers-reduced-motion: reduce) {
		.pane,
		.ln,
		.led {
			transition: none;
		}
		.caret,
		.pulse {
			animation: none;
		}
	}
</style>
