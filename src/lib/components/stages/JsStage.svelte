<script lang="ts">
	// Guided JavaScript. Nim's beats write script.js line by line, then the stage taps the shop
	// button by itself so the cart counts up, breaks one bracket to show a dead page and an error,
	// and fixes it again. The script only ever runs inside a sandboxed iframe (allow-scripts, no
	// same origin). The stage talks to it with postMessage and only trusts its own frame.
	import { onDestroy, untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { JsText } from '$lib/chapters/web/js/types';
	import Guide from '../Guide.svelte';
	import TypedCode from './frontend/TypedCode.svelte';
	import PreviewPane from './frontend/PreviewPane.svelte';
	import { NIM_DATA, esc, pageDoc } from './frontend/code';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as JsText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let view = $state(0);
	$effect(() => {
		view = beat;
	});
	const last = $derived(tx.steps.length - 1);

	// Beats where the stage taps the button by itself, and the one where a bracket is missing.
	const AUTO = [4, 6, 7];
	const BROKEN = 6;

	let add = $state(1);
	let stepSaid = false;
	function setAdd(n: number) {
		add = n;
		if (n === 2 && !stepSaid) {
			stepSaid = true;
			onstate?.('step');
		}
	}

	function jsAt(v: number) {
		if (v === 0) return `// ${tx.comment}\n`;
		const out = ['let count = 0;'];
		if (v >= 2)
			out.push(
				"const button = document.querySelector('button');",
				"const cart = document.querySelector('#count');"
			);
		if (v >= 3)
			out.push(
				'',
				"button.addEventListener('click', () => {",
				`  count = count + ${v >= last ? add : 1};`,
				'  cart.textContent = count;',
				v === BROKEN ? '};' : '});'
			);
		return out.join('\n') + '\n';
	}
	const code = $derived(jsAt(view));
	let settled = $state(untrack(() => code));

	const CSS = [
		'html{background:#fff;color:#16212b}',
		'body{margin:0;padding:14px;font:14px/1.45 system-ui,sans-serif}',
		'.card{max-width:240px;margin:0 auto;text-align:center}',
		'img{display:block;margin:0 auto;height:52px}',
		'h2{margin:.3em 0 0;font-size:1.1em}',
		'.price{margin:.1em 0 .7em;color:#5e6b76}',
		'button{font:inherit;font-weight:600;padding:8px 16px;border:0;border-radius:999px;background:#2e6fe0;color:#fff;cursor:pointer;transition:transform .15s,box-shadow .15s}',
		'button.press,button:active{transform:scale(.93);box-shadow:0 0 0 6px rgba(46,111,224,.22)}',
		'.cart{margin:.8em 0 0;color:#5e6b76}',
		'#count{display:inline-block;min-width:1.6em;padding:1px 6px;border-radius:999px;background:#eaf1fc;color:#2e6fe0;font-weight:700}'
	].join('');

	// The harness runs first, in its own script tag, so it keeps working when the lesson script
	// fails. It reports errors and clicks, and presses the button when the stage asks.
	const HARNESS =
		'<script>(function(){' +
		"var post=function(m){m.nimbus='js';parent.postMessage(m,'*')};" +
		"window.addEventListener('error',function(e){post({t:'error',msg:String(e.message||'Error')})});" +
		"document.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('button'):null;if(b)post({t:'click',trusted:e.isTrusted})},true);" +
		"window.addEventListener('message',function(e){if(e.source!==parent||!e.data||e.data.nimbus!=='tap')return;var b=document.querySelector('button');if(!b)return;b.classList.add('press');setTimeout(function(){b.classList.remove('press')},260);b.click()});" +
		"post({t:'ready'})" +
		'})();<' +
		'/script>';

	const html = $derived(
		'<div class="card">' +
			`<img src="${NIM_DATA}" alt="">` +
			`<h2>${esc(tx.page.product)}</h2>` +
			`<p class="price">${esc(tx.page.price)}</p>` +
			`<button>${esc(tx.page.button)}</button>` +
			`<p class="cart">${esc(tx.page.cart)} <b id="count">0</b></p>` +
			'</div>'
	);
	const srcdoc = $derived(
		pageDoc({
			css: CSS,
			scripts: true,
			body:
				HARNESS +
				html +
				'<script>\n' +
				settled.replace(/<\/script/gi, '<\\/script') +
				'\n<' +
				'/script>'
		})
	);

	// ---- Messages from the sandbox, only from our own frame ----
	let frame = $state<HTMLIFrameElement | null>(null);
	let error = $state('');
	let tapSaid = false;
	function onMessage(e: MessageEvent) {
		if (!frame || e.source !== frame.contentWindow) return;
		const d = e.data as { nimbus?: string; t?: string; msg?: string; trusted?: boolean };
		if (!d || d.nimbus !== 'js') return;
		if (d.t === 'ready') error = '';
		else if (d.t === 'error') error = String(d.msg ?? '').slice(0, 140);
		else if (d.t === 'click' && d.trusted && !tapSaid) {
			tapSaid = true;
			onstate?.('tap');
		}
	}
	$effect(() => {
		window.addEventListener('message', onMessage);
		return () => window.removeEventListener('message', onMessage);
	});

	// ---- Nim taps the button by itself on a few beats ----
	let auto: ReturnType<typeof setInterval> | undefined;
	$effect(() => {
		const on = AUTO.includes(view) && settled === code;
		clearInterval(auto);
		if (!on) return;
		auto = setInterval(() => {
			frame?.contentWindow?.postMessage({ nimbus: 'tap' }, '*');
		}, 1500);
		return () => clearInterval(auto);
	});
	onDestroy(() => clearInterval(auto));
</script>

<div class="h-full w-full overflow-y-auto">
	<div class="mx-auto flex w-full justify-center pb-28 md:pb-6">
		<Guide steps={tx.steps} active={view} onselect={(k) => (view = k)}>
			{#snippet visual()}
				<div class="flex w-full max-w-[460px] flex-col gap-3">
					<div class="flex flex-col">
						<div style="--frame-h:190px;--frame-h-wide:190px">
							<PreviewPane
								label={tx.previewLabel}
								{srcdoc}
								scripts
								led={view >= 3 && !error}
								bind:frame
							/>
						</div>
						<p class="console" class:bad={!!error} role="status">
							<span class="clabel">{tx.consoleLabel}</span>
							<span class="cmsg">{error || tx.consoleEmpty}</span>
						</p>
					</div>
					<TypedCode {code} lang="js" label={tx.jsLabel} onsettled={(c) => (settled = c)} />
					{#if view >= last}
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-xs font-semibold text-muted">{tx.stepLabel}</span>
							{#each [1, 2] as n (n)}
								<button
									type="button"
									class="pick"
									class:on={add === n}
									aria-pressed={add === n}
									onclick={() => setAdd(n)}>{n}</button
								>
							{/each}
						</div>
					{/if}
				</div>
			{/snippet}
		</Guide>
	</div>
</div>

<style>
	.console {
		display: flex;
		gap: 10px;
		margin: 6px 0 0;
		padding: 7px 11px;
		border-radius: 10px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		font-size: 11.5px;
		color: var(--color-muted);
		transition: background 0.3s;
	}
	.console.bad {
		background: var(--color-danger-soft);
		color: var(--color-ink);
	}
	.clabel {
		flex: none;
		font-weight: 700;
	}
	.cmsg {
		min-width: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		overflow-wrap: anywhere;
	}
	.bad .cmsg {
		color: var(--color-danger);
	}
	.pick {
		min-width: 34px;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.pick.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	@media (prefers-reduced-motion: reduce) {
		.console {
			transition: none;
		}
	}
</style>
