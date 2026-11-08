<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { JsText, JsMissionId } from '$lib/chapters/web/js/types';
	import CodePane from './frontend/CodePane.svelte';
	import PreviewPane from './frontend/PreviewPane.svelte';
	import Missions from './frontend/Missions.svelte';
	import { NIM_DATA, esc, pageDoc } from './frontend/code';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as JsText);

	function starterFor(comment: string) {
		return [
			`// ${comment}`,
			'let count = 0;',
			"const button = document.querySelector('button');",
			"const cart = document.querySelector('#count');",
			'',
			"button.addEventListener('click', () => {",
			'  count = count + 1;',
			'  cart.textContent = count;',
			'});',
			''
		].join('\n');
	}

	let code = $state(untrack(() => starterFor(tx.comment)));
	let lastStarter = untrack(() => starterFor(tx.comment));
	// Follow a language switch while the learner has not touched the script yet.
	$effect(() => {
		const s = starterFor(tx.comment);
		if (s === lastStarter) return;
		if (code === lastStarter) code = s;
		lastStarter = s;
	});
	let tab = $state('js');

	// ---- The shop page. Its HTML never changes, only the script does ----
	const html = $derived(
		[
			'<div class="card">',
			`  <img src="nim.png" alt="">`,
			`  <h2>${esc(tx.page.product)}</h2>`,
			`  <p class="price">${esc(tx.page.price)}</p>`,
			`  <button>${esc(tx.page.button)}</button>`,
			`  <p class="cart">${esc(tx.page.cart)} <b id="count">0</b></p>`,
			'</div>'
		].join('\n')
	);
	const CSS = [
		'html{background:#fff;color:#16212b}',
		'body{margin:0;padding:14px;font:14px/1.45 system-ui,sans-serif}',
		'.card{max-width:240px;margin:0 auto;text-align:center}',
		'img{display:block;margin:0 auto;height:56px}',
		'h2{margin:.3em 0 0;font-size:1.15em}',
		'.price{margin:.1em 0 .7em;color:#5e6b76}',
		'button{font:inherit;font-weight:600;padding:8px 16px;border:0;border-radius:999px;background:#2e6fe0;color:#fff;cursor:pointer}',
		'button:active{transform:scale(.96)}',
		'.cart{margin:.8em 0 0;color:#5e6b76}',
		'#count{display:inline-block;min-width:1.6em;padding:1px 6px;border-radius:999px;background:#eaf1fc;color:#2e6fe0}'
	].join('');

	// The harness runs first, in its own script tag, so it keeps working even when the learner's
	// script fails. It only reports back to this stage with postMessage.
	const HARNESS =
		'<script>(function(){' +
		"var post=function(m){m.nimbus='js';parent.postMessage(m,'*')};" +
		"window.addEventListener('error',function(e){post({t:'error',msg:String(e.message||'Error'),line:e.lineno||0})});" +
		"var num=function(){var c=document.getElementById('count');var n=c?parseFloat(String(c.textContent).replace(/[^0-9.+-]/g,'')):NaN;return isNaN(n)?0:n};" +
		"document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;var before=num();setTimeout(function(){post({t:'click',delta:num()-before})},0)},true);" +
		"var log=console.log;console.log=function(){try{post({t:'log',msg:Array.prototype.map.call(arguments,String).join(' ')})}catch(x){}return log.apply(console,arguments)};" +
		"post({t:'ready'})" +
		'})();<' +
		'/script>';

	// Rebuild the preview after a short pause in typing, not on every key.
	let running = $state(untrack(() => code));
	let debounce: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		const c = code;
		clearTimeout(debounce);
		debounce = setTimeout(() => (running = c), 500);
	});
	onDestroy(() => clearTimeout(debounce));

	const hasLoop = $derived(
		/\b(while|for)\b/.test(running.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, ''))
	);
	// Everything before the learner's script sits on line 1, so script line n is page line n + 1.
	const srcdoc = $derived(
		pageDoc({
			css: CSS,
			scripts: true,
			body:
				HARNESS +
				html.replace(/\n\s*/g, '').replace('nim.png', NIM_DATA) +
				(hasLoop
					? ''
					: '<script>\n' + running.replace(/<\/script/gi, '<\\/script') + '\n<' + '/script>')
		})
	);

	// ---- Messages from the sandbox: only from our own frame, only our own shape ----
	let frame = $state<HTMLIFrameElement | null>(null);
	type Line = { kind: 'log' | 'error'; text: string };
	let lines = $state<Line[]>([]);
	let errorThisLoad = false;
	let deadSaid = false;
	let done = $state<Record<JsMissionId, boolean>>({
		count: false,
		step: false,
		broken: false,
		fixed: false
	});
	const ORDER: JsMissionId[] = ['count', 'step', 'broken', 'fixed'];
	const allDone = $derived(ORDER.every((m) => done[m]));
	let finished = false;

	function mark(m: JsMissionId) {
		if (done[m]) return;
		done[m] = true;
		if (ORDER.every((k) => done[k]) && !finished) {
			finished = true;
			onstate?.('done');
			oncomplete?.();
		} else onstate?.(m);
	}

	function onMessage(e: MessageEvent) {
		if (!frame || e.source !== frame.contentWindow) return;
		const d = e.data as {
			nimbus?: string;
			t?: string;
			msg?: string;
			line?: number;
			delta?: number;
		};
		if (!d || d.nimbus !== 'js') return;
		if (d.t === 'ready') {
			errorThisLoad = false;
			lines = [];
		} else if (d.t === 'error') {
			errorThisLoad = true;
			deadSaid = false;
			const n = (d.line ?? 0) - 1;
			const msg = String(d.msg ?? '').slice(0, 160) + (n > 0 ? ` (line ${n})` : '');
			lines = [...lines, { kind: 'error' as const, text: msg }].slice(-3);
			mark('broken');
		} else if (d.t === 'log') {
			lines = [...lines, { kind: 'log' as const, text: String(d.msg ?? '').slice(0, 160) }].slice(
				-3
			);
		} else if (d.t === 'click') {
			const delta = Number(d.delta) || 0;
			if (delta > 0 && !errorThisLoad && done.broken) mark('fixed');
			if (delta > 0) mark('count');
			if (delta >= 2) mark('step');
			if (delta === 0 && errorThisLoad && !deadSaid) {
				deadSaid = true;
				onstate?.('dead');
			}
		}
	}
	$effect(() => {
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	});

	let loopSaid = false;
	$effect(() => {
		if (hasLoop && !loopSaid) {
			loopSaid = true;
			onstate?.('loop');
		}
	});

	// ---- Shortcuts for small screens ----
	function makeTwo() {
		tab = 'js';
		code = /count\s*\+\s*\d+/.test(code)
			? code.replace(/count\s*\+\s*\d+/, 'count + 2')
			: code.replace(/count\s*\+\+/, 'count += 2');
	}
	function breakIt() {
		tab = 'js';
		const i = code.lastIndexOf('});');
		if (i >= 0) code = code.slice(0, i) + '};' + code.slice(i + 3);
		else {
			const j = code.lastIndexOf(')');
			if (j >= 0) code = code.slice(0, j) + code.slice(j + 1);
		}
	}
	function resetCode() {
		tab = 'js';
		code = starterFor(tx.comment);
	}

	const tabs = $derived([
		{ id: 'js', label: tx.jsLabel },
		{ id: 'html', label: tx.htmlLabel }
	]);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		items={ORDER.map((m) => ({ id: m, text: tx.missions[m], done: done[m] }))}
	/>

	<div class="chips" role="group" aria-label={tx.chipsLabel}>
		<button type="button" class="chip" onclick={makeTwo}>{tx.chips.step}</button>
		<button type="button" class="chip bad" onclick={breakIt}>{tx.chips.breakIt}</button>
		<button type="button" class="chip" onclick={resetCode}>{tx.chips.fix}</button>
	</div>

	<div class="work">
		{#if tab === 'js'}
			<CodePane
				bind:value={code}
				bind:tab
				{tabs}
				lang="js"
				label={tx.jsLabel}
				resetLabel={tx.reset}
				onreset={resetCode}
				hint={hasLoop ? tx.loopHint : ''}
			/>
		{:else}
			<CodePane value={html} bind:tab {tabs} lang="html" label={tx.htmlLabel} readonly />
		{/if}
		<div class="side">
			<PreviewPane bind:frame label={tx.previewLabel} {srcdoc} scripts led={allDone} />
			<div class="console" aria-live="polite">
				<p class="ctitle">{tx.consoleLabel}</p>
				{#if lines.length === 0}
					<p class="cline quiet">{tx.consoleEmpty}</p>
				{:else}
					{#each lines as l, i (i)}
						<p class="cline" class:err={l.kind === 'error'}>{l.text}</p>
					{/each}
				{/if}
			</div>
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
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		font-size: 12.5px;
		font-weight: 600;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-brand);
		transition:
			transform 0.15s ease,
			border-color 0.2s ease;
	}
	.chip:hover {
		border-color: var(--color-brand);
	}
	.chip.bad {
		color: var(--color-danger);
	}
	.chip.bad:hover {
		border-color: var(--color-danger);
	}
	.chip:active {
		transform: scale(0.95);
	}

	.work {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		width: 100%;
		max-width: 420px;
		--frame-h: 190px;
	}
	@media (min-width: 768px) {
		.work {
			grid-template-columns: 1fr 1fr;
			max-width: 720px;
		}
	}
	.side {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.console {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 7px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		min-height: 54px;
	}
	.ctitle {
		margin: 0 0 3px;
		font-family: var(--font-sans, inherit);
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.cline {
		margin: 0;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.cline.quiet {
		color: var(--color-faint);
	}
	.cline.err {
		color: var(--color-danger);
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
		.chip {
			transition: none;
		}
	}
</style>
