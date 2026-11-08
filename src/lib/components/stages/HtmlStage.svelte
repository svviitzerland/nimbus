<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';

	import { tick, onDestroy, untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { HtmlText, HtmlMissionId } from '$lib/chapters/web/html/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as HtmlText);

	// The editor starts with plain text only, so the preview shows it squashed into one line.
	let code = $state(untrack(() => tx.starter));
	let lastStarter = untrack(() => tx.starter);
	// Follow a language switch while the learner has not touched the starter text yet.
	$effect(() => {
		const s = tx.starter;
		if (s === lastStarter) return;
		if (code === lastStarter) code = s;
		lastStarter = s;
	});

	let ta = $state<HTMLTextAreaElement | null>(null);
	let hl = $state<HTMLPreElement | null>(null);

	// ---- Chips: insert a snippet at the cursor, or wrap the selected text in the tag ----
	type ChipId = 'h1' | 'p' | 'button' | 'img' | 'a';
	const CHIPS: ChipId[] = ['h1', 'p', 'button', 'img', 'a'];
	const NIM_SRC = 'nim.png';

	function snippetFor(c: ChipId): { open: string; inner: string; close: string } {
		const s = tx.snippets;
		if (c === 'img') return { open: `<img src="${NIM_SRC}" alt="`, inner: s.alt, close: '">' };
		if (c === 'a') return { open: '<a href="/blog">', inner: s.link, close: '</a>' };
		const inner = c === 'h1' ? s.heading : c === 'p' ? s.paragraph : s.button;
		return { open: `<${c}>`, inner, close: `</${c}>` };
	}

	// Until the learner has put the cursor somewhere, chips add to the end of the page.
	let touched = false;

	async function insert(c: ChipId) {
		const el = ta;
		const start = el && touched ? el.selectionStart : code.length;
		const end = el && touched ? el.selectionEnd : code.length;
		const sn = snippetFor(c);
		const selected = code.slice(start, end);
		const wrap = c !== 'img' && selected.trim().length > 0 && !selected.includes('\n');

		let before = code.slice(0, start);
		let after = code.slice(end);
		let inner = wrap ? selected : sn.inner;
		if (!wrap) {
			// Drop a fresh snippet on its own line so the code stays tidy.
			if (before.length && !before.endsWith('\n')) before += '\n';
			if (after.length && !after.startsWith('\n')) after = '\n' + after;
		}
		code = before + sn.open + inner + sn.close + after;
		const selStart = before.length + sn.open.length;
		const selEnd = selStart + inner.length;
		await tick();
		if (el) {
			touched = true;
			el.focus();
			el.setSelectionRange(
				wrap ? selEnd + sn.close.length : selStart,
				wrap ? selEnd + sn.close.length : selEnd
			);
		}
	}

	function resetCode() {
		code = tx.starter;
		touched = false;
	}

	// ---- Mission checks: simple and forgiving, case insensitive, any order ----
	function stripTags(s: string) {
		return s.replace(/<[^>]*>/g, '').trim();
	}
	function hasPair(src: string, tag: string) {
		const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi');
		for (const m of src.matchAll(re)) if (stripTags(m[1]).length > 0) return true;
		return false;
	}
	const clean = $derived(code.replace(/<!--[\s\S]*?(-->|$)/g, ''));
	const done = $derived<Record<HtmlMissionId, boolean>>({
		heading: hasPair(clean, 'h1'),
		paragraph: hasPair(clean, 'p'),
		button: hasPair(clean, 'button'),
		image: /<img\b[^>]*\bsrc\s*=\s*["']?[^"'\s>]+/i.test(clean)
	});
	const hasLink = $derived(/<a\b[^>]*\bhref\s*=/i.test(clean) && hasPair(clean, 'a'));
	const ORDER: HtmlMissionId[] = ['heading', 'paragraph', 'button', 'image'];
	const current = $derived(ORDER.find((m) => !done[m]));
	const allDone = $derived(ORDER.every((m) => done[m]));

	const reported = new SvelteSet<string>();
	let finished = false;
	$effect(() => {
		const d = done;
		const fresh = ORDER.filter((m) => d[m] && !reported.has(m));
		const linkFresh = hasLink && !reported.has('link');
		if (!fresh.length && !linkFresh) {
			if (ORDER.every((m) => d[m]) && !finished) finish();
			return;
		}
		fresh.forEach((m) => reported.add(m));
		if (linkFresh) reported.add('link');
		if (ORDER.every((m) => d[m]) && !finished) {
			finish();
			return;
		}
		if (fresh.length) onstate?.(fresh[fresh.length - 1]);
		else onstate?.('link');
	});
	function finish() {
		finished = true;
		onstate?.('done');
		oncomplete?.();
	}

	// ---- Common mistake: a tag opened but never closed (checked after a short pause) ----
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
	let timer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		const src = clean;
		clearTimeout(timer);
		// Closing the tag clears the hint right away, a new mistake waits for a pause in typing.
		untrack(() => {
			if (unclosed && !findUnclosed(src)) {
				unclosed = null;
				lastHinted = null;
			}
		});
		timer = setTimeout(() => {
			const u = findUnclosed(src);
			unclosed = u;
			if (u && u !== lastHinted) {
				lastHinted = u;
				onstate?.('unclosed');
			}
			if (!u) lastHinted = null;
		}, 1300);
	});
	onDestroy(() => clearTimeout(timer));
	const hintText = $derived(
		unclosed
			? tx.unclosedHint.replace('{open}', `<${unclosed}>`).replace('{close}', `</${unclosed}>`)
			: ''
	);

	// ---- Highlighting: tokens rendered as plain text spans, never as raw HTML ----
	type Tok = { k: 'txt' | 'pun' | 'tag' | 'att' | 'str'; v: string };
	function tokenize(src: string): Tok[] {
		const out: Tok[] = [];
		const tagRe = /<\/?[a-zA-Z][a-zA-Z0-9]*[^<>]*>?/g;
		let last = 0;
		for (const m of src.matchAll(tagRe)) {
			const i = m.index ?? 0;
			if (i > last) out.push({ k: 'txt', v: src.slice(last, i) });
			const raw = m[0];
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
		// A trailing space keeps the last empty line tall enough to match the textarea.
		out.push({ k: 'txt', v: ' ' });
		return out;
	}
	const tokens = $derived(tokenize(code));
	function syncScroll() {
		if (hl && ta) {
			hl.scrollTop = ta.scrollTop;
			hl.scrollLeft = ta.scrollLeft;
		}
	}

	// ---- Preview: a sandboxed iframe (no scripts, no outside requests) ----
	const NIM_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80"><path d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z" fill="#2e6fe0"/><circle cx="50" cy="44" r="5" fill="#fff"/><circle cx="72" cy="44" r="5" fill="#fff"/><circle cx="51" cy="45" r="2.4" fill="#16212b"/><circle cx="73" cy="45" r="2.4" fill="#16212b"/><path d="M53 56q8 6 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`;
	const NIM_DATA = `data:image/svg+xml,${encodeURIComponent(NIM_SVG)}`;
	const BASE_CSS = [
		'html{background:#fff;color:#16212b}',
		'body{margin:12px;font:14px/1.45 system-ui,sans-serif;overflow-wrap:anywhere}',
		'h1{font-size:1.6em;margin:.2em 0 .4em}',
		'p{margin:.4em 0 .8em}',
		'img{max-width:100%;height:auto;max-height:90px;display:block;margin:.4em 0}',
		'a{color:#2e6fe0;pointer-events:none}',
		'button{font:inherit;padding:4px 12px;margin:.2em 0}'
	].join('');
	const srcdoc = $derived.by(() => {
		const body = code
			.replace(/<\/?(meta|base|link|script|iframe|object|embed)\b[^>]*>/gi, '')
			.replace(/(<img\b[^>]*\bsrc\s*=\s*)(["']?)nim\.png\2/gi, `$1"${NIM_DATA}"`);
		return (
			'<!doctype html><html><head><meta charset="utf-8">' +
			`<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'">` +
			`<style>${BASE_CSS}</style></head><body>${body}</body></html>`
		);
	});
</script>

<div class="wrap">
	<div class="missions" aria-label={tx.missionsLabel}>
		<p class="cap">{tx.missionsLabel}</p>
		<ul>
			{#each ORDER as m (m)}
				<li class:ok={done[m]} class:cur={current === m}>
					<span class="dot" aria-hidden="true">
						{#if done[m]}
							<svg viewBox="0 0 16 16"
								><path
									d="M3.5 8.5l3 3 6-6.5"
									fill="none"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
						{/if}
					</span>
					<span>{tx.missions[m]}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="chips" role="group" aria-label={tx.chipsLabel}>
		{#each CHIPS as c (c)}
			<button
				type="button"
				class="chip"
				class:want={(current === 'heading' && c === 'h1') ||
					(current === 'paragraph' && c === 'p') ||
					(current === 'button' && c === 'button') ||
					(current === 'image' && c === 'img')}
				onmousedown={(e) => e.preventDefault()}
				onclick={() => insert(c)}>&lt;{c}&gt;</button
			>
		{/each}
	</div>

	<div class="work">
		<div class="pane editor">
			<div class="bar">
				<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
				<span class="fname">{tx.editorLabel}</span>
				<button type="button" class="reset" onclick={resetCode}>{tx.reset}</button>
			</div>
			<div class="code">
				<pre class="hl" bind:this={hl} aria-hidden="true">{#each tokens as t, i (i)}<span
							class={t.k}>{t.v}</span
						>{/each}</pre>
				<textarea
					bind:this={ta}
					bind:value={code}
					onscroll={syncScroll}
					onfocus={() => (touched = true)}
					spellcheck="false"
					autocapitalize="off"
					autocomplete="off"
					aria-label={tx.editorLabel}
				></textarea>
			</div>
			{#if hintText}
				<p class="hint" role="status">{hintText}</p>
			{/if}
		</div>

		<div class="pane browser">
			<div class="addr">
				<span class="led" class:on={allDone}></span>
				<span class="url">{tx.previewLabel}</span>
			</div>
			<iframe title={tx.previewLabel} sandbox="" {srcdoc}></iframe>
		</div>
	</div>

	{#if allDone}
		<p class="win" role="status">{tx.allDone}</p>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 720px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}

	/* ---- Missions ---- */
	.missions {
		width: 100%;
		max-width: 520px;
	}
	.cap {
		margin: 0 0 6px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.missions ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.missions li {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		padding: 6px 9px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		line-height: 1.3;
		transition:
			border-color 0.25s ease,
			background 0.25s ease,
			color 0.25s ease;
	}
	.missions li.cur {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.missions li.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.dot {
		flex: none;
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
	}
	.cur .dot {
		border-color: var(--color-brand);
	}
	.ok .dot {
		border-color: var(--color-grass);
		background: var(--color-grass);
		color: #fff;
	}
	.dot svg {
		width: 11px;
		height: 11px;
	}

	/* ---- Tag chips ---- */
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 600;
		padding: 6px 11px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-brand);
		transition:
			transform 0.15s ease,
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chip:hover {
		border-color: var(--color-brand);
	}
	.chip:active {
		transform: scale(0.95);
	}
	.chip.want {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		animation: nudge 1.8s ease-in-out infinite;
	}
	@keyframes nudge {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.18);
		}
	}

	/* ---- Editor and preview: stacked on phones, side by side when there is room ---- */
	.work {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		width: 100%;
		max-width: 420px;
	}
	@media (min-width: 768px) {
		.work {
			grid-template-columns: 1fr 1fr;
			max-width: 720px;
		}
	}
	.pane {
		min-width: 0;
		display: flex;
		flex-direction: column;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.bar,
	.addr {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 10px;
		border-bottom: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
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
	.reset {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		padding: 2px 6px;
		border-radius: 6px;
	}
	.reset:hover {
		color: var(--color-ink);
		background: var(--color-paper);
	}

	.code {
		position: relative;
		height: 150px;
		background: var(--color-paper);
	}
	@media (min-width: 768px) {
		.code {
			height: 210px;
		}
	}
	.hl,
	textarea {
		position: absolute;
		inset: 0;
		margin: 0;
		padding: 10px 12px;
		border: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		line-height: 1.55;
		tab-size: 2;
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
		background: transparent;
		color: transparent;
		caret-color: var(--color-ink);
		outline: none;
	}
	textarea::selection {
		background: rgba(46, 111, 224, 0.25);
	}
	.hl .pun {
		color: var(--color-faint);
	}
	.hl .tag {
		color: var(--color-brand);
		font-weight: 600;
	}
	.hl .att {
		color: var(--color-amber);
	}
	.hl .str {
		color: var(--color-grass);
	}

	.hint {
		margin: 0;
		padding: 7px 11px;
		border-top: 1px solid var(--color-line);
		background: var(--color-amber-soft);
		color: var(--color-ink);
		font-size: 12px;
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
		padding: 3px 10px;
		border-radius: 999px;
		background: var(--color-paper);
		color: var(--color-ink);
		font-weight: 600;
	}
	iframe {
		display: block;
		width: 100%;
		height: 170px;
		border: 0;
		background: #fff;
	}
	@media (min-width: 768px) {
		iframe {
			flex: 1;
			height: auto;
			min-height: 210px;
		}
	}

	.win {
		margin: 0;
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 12.5px;
		font-weight: 700;
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.missions li,
		.led {
			transition: none;
		}
		.chip.want {
			animation: none;
		}
	}
</style>
