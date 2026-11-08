<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CssText, CssMissionId } from '$lib/chapters/web/css/types';
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
	const tx = $derived(text as CssText);

	function starterFor(comment: string) {
		return [
			`/* ${comment} */`,
			'body {',
			'  background: white;',
			'  font-family: serif;',
			'}',
			'',
			'h1 {',
			'  color: black;',
			'}',
			'',
			'button {',
			'  border-radius: 0;',
			'}',
			''
		].join('\n');
	}

	let code = $state(untrack(() => starterFor(tx.starterComment)));
	let lastStarter = untrack(() => starterFor(tx.starterComment));
	// Follow a language switch while the learner has not touched the stylesheet yet.
	$effect(() => {
		const s = starterFor(tx.starterComment);
		if (s === lastStarter) return;
		if (code === lastStarter) code = s;
		lastStarter = s;
	});
	let tab = $state('css');

	// ---- The page itself, the same one the HTML lesson ended with ----
	const html = $derived(
		[
			`<img src="nim.png" alt="${esc(tx.page.alt)}">`,
			`<h1>${esc(tx.page.heading)}</h1>`,
			`<p>${esc(tx.page.paragraph)}</p>`,
			`<button>${esc(tx.page.button)}</button>`
		].join('\n')
	);
	// Roughly what a browser does with no stylesheet at all.
	const BASE = [
		'html{background:#fff;color:#000}',
		'body{margin:14px;font-size:15px;line-height:1.45;overflow-wrap:anywhere}',
		'img{display:block;max-width:100%;max-height:70px}',
		'button{font:inherit;padding:6px 14px;border:1px solid #767676;background:#efefef;color:#000}'
	].join('');
	const srcdoc = $derived(pageDoc({ css: BASE + code, body: html.replace('nim.png', NIM_DATA) }));

	// ---- Reading the stylesheet: forgiving, last value wins, like the browser ----
	type Decl = { sel: string; prop: string; value: string; raw: string };
	function parse(src: string): Decl[] {
		const out: Decl[] = [];
		const clean = src.replace(/\/\*[\s\S]*?(\*\/|$)/g, '');
		for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}?/g)) {
			const sels = m[1]
				.split(',')
				.map((s) => s.trim().toLowerCase())
				.filter(Boolean);
			for (const line of m[2].split(';')) {
				const i = line.indexOf(':');
				if (i < 0) continue;
				const prop = line.slice(0, i).trim().toLowerCase();
				const value = line
					.slice(i + 1)
					.trim()
					.replace(/\s+/g, ' ');
				if (!prop) continue;
				for (const sel of sels) out.push({ sel, prop, value, raw: line.trim() });
			}
		}
		return out;
	}
	function supports(prop: string, value: string) {
		if (!value) return false;
		if (typeof CSS === 'undefined' || typeof CSS.supports !== 'function') return true;
		return CSS.supports(prop, value);
	}
	const decls = $derived(parse(code));
	function valueOf(sels: string[], props: string[]): string {
		let v = '';
		for (const d of decls)
			if (sels.includes(d.sel) && props.includes(d.prop) && supports(d.prop, d.value))
				v = d.value.toLowerCase();
		return v;
	}
	const done = $derived.by<Record<CssMissionId, boolean>>(() => {
		const bg = valueOf(['body', 'html'], ['background', 'background-color']);
		const color = valueOf(['h1'], ['color']);
		const font = valueOf(['body', 'html', 'h1', 'p', '*'], ['font-family', 'font']);
		const radius = valueOf(['button'], ['border-radius']);
		return {
			background: !!bg && !['white', '#fff', '#ffffff', 'transparent', 'none'].includes(bg),
			color: !!color && !['black', '#000', '#000000'].includes(color),
			font: !!font && font !== 'serif',
			button: !!radius && parseFloat(radius) > 0
		};
	});
	const centered = $derived(
		decls.some((d) => d.prop === 'text-align' && d.value.toLowerCase() === 'center')
	);
	const ORDER: CssMissionId[] = ['background', 'color', 'font', 'button'];
	const current = $derived(ORDER.find((m) => !done[m]));
	const allDone = $derived(ORDER.every((m) => done[m]));

	const reported: Record<string, boolean> = {};
	let finished = false;
	$effect(() => {
		const d = done;
		const c = centered;
		const fresh = ORDER.filter((m) => d[m] && !reported[m]);
		fresh.forEach((m) => (reported[m] = true));
		if (ORDER.every((m) => d[m]) && !finished) {
			finished = true;
			onstate?.('done');
			oncomplete?.();
			return;
		}
		if (fresh.length) onstate?.(fresh[fresh.length - 1]);
		else if (c && !reported['center']) {
			reported['center'] = true;
			onstate?.('center');
		}
	});

	// ---- Typos: a line the browser does not understand, checked after a pause in typing ----
	let typo = $state('');
	let lastTypo = '';
	let timer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		const list = decls;
		clearTimeout(timer);
		untrack(() => {
			if (typo && !list.some((d) => d.raw === typo)) typo = '';
		});
		timer = setTimeout(() => {
			const bad = list.find((d) => d.value && !supports(d.prop, d.value));
			typo = bad ? bad.raw : '';
			if (bad && bad.raw !== lastTypo) {
				lastTypo = bad.raw;
				onstate?.('typo');
			}
		}, 1300);
	});
	onDestroy(() => clearTimeout(timer));
	const hint = $derived(typo ? tx.typoHint.replace('{line}', typo) : '');

	// ---- Value chips: set one line of one rule, adding it if it is missing ----
	type Chip = { sel: string; prop: string; value: string };
	const CHIPS: Record<CssMissionId, Chip[]> = {
		background: [
			{ sel: 'body', prop: 'background', value: '#eaf1fc' },
			{ sel: 'body', prop: 'background', value: '#fbf1de' },
			{ sel: 'body', prop: 'background', value: '#e7f3ec' }
		],
		color: [
			{ sel: 'h1', prop: 'color', value: '#2e6fe0' },
			{ sel: 'h1', prop: 'color', value: 'tomato' },
			{ sel: 'h1', prop: 'color', value: 'seagreen' }
		],
		font: [
			{ sel: 'body', prop: 'font-family', value: 'system-ui, sans-serif' },
			{ sel: 'body', prop: 'font-family', value: 'monospace' }
		],
		button: [
			{ sel: 'button', prop: 'border-radius', value: '999px' },
			{ sel: 'button', prop: 'border-radius', value: '8px' }
		]
	};
	const EXTRA: Chip[] = [
		{ sel: 'body', prop: 'text-align', value: 'center' },
		{ sel: 'button', prop: 'background', value: '#2e6fe0' },
		{ sel: 'button', prop: 'color', value: 'white' },
		{ sel: 'button', prop: 'padding', value: '10px 22px' }
	];
	const chips = $derived(current ? CHIPS[current] : EXTRA);

	function escRe(s: string) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	function apply(c: Chip) {
		tab = 'css';
		const ruleRe = new RegExp(`(^|\\n)(\\s*${escRe(c.sel)}\\s*\\{)([^{}]*)(\\})`);
		const m = ruleRe.exec(code);
		if (!m) {
			code = code.replace(/\s*$/, '') + `\n\n${c.sel} {\n  ${c.prop}: ${c.value};\n}\n`;
			return;
		}
		const body = m[3];
		const propRe = new RegExp(`(\\n?[ \\t]*)${escRe(c.prop)}\\s*:[^;\\n}]*;?`);
		const next = propRe.test(body)
			? body.replace(propRe, `$1${c.prop}: ${c.value};`)
			: body.replace(/\s*$/, '') + `\n  ${c.prop}: ${c.value};\n`;
		const start = m.index + m[1].length + m[2].length;
		code = code.slice(0, start) + next + code.slice(start + body.length);
	}
	function isOn(c: Chip) {
		return decls.some(
			(d) => d.sel === c.sel && d.prop === c.prop && d.value.toLowerCase() === c.value
		);
	}

	function resetCode() {
		code = starterFor(tx.starterComment);
	}
	const tabs = $derived([
		{ id: 'css', label: tx.cssLabel },
		{ id: 'html', label: tx.htmlLabel }
	]);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		items={ORDER.map((m) => ({ id: m, text: tx.missions[m], done: done[m] }))}
	/>

	<div class="try">
		<p class="cap">{allDone ? tx.extraLabel : tx.tryLabel}</p>
		<div class="chips" role="group" aria-label={allDone ? tx.extraLabel : tx.tryLabel}>
			{#each chips as c (c.sel + c.prop + c.value)}
				<button
					type="button"
					class="chip"
					class:on={isOn(c)}
					onmousedown={(e) => e.preventDefault()}
					onclick={() => apply(c)}
				>
					<span class="sel">{c.sel}</span>
					<span class="prop">{c.prop}</span>
					<span class="val">{c.value}</span>
				</button>
			{/each}
		</div>
	</div>

	<div class="work">
		{#if tab === 'css'}
			<CodePane
				bind:value={code}
				bind:tab
				{tabs}
				lang="css"
				label={tx.cssLabel}
				resetLabel={tx.reset}
				onreset={resetCode}
				{hint}
			/>
		{:else}
			<CodePane value={html} bind:tab {tabs} lang="html" label={tx.htmlLabel} readonly />
		{/if}
		<PreviewPane label={tx.previewLabel} {srcdoc} led={allDone} />
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
	.try {
		width: 100%;
		max-width: 560px;
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
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		display: inline-flex;
		align-items: baseline;
		gap: 5px;
		max-width: 100%;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		padding: 6px 11px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
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
	.chip.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.chip .sel {
		color: var(--color-brand);
		font-weight: 700;
	}
	.chip .prop {
		color: var(--color-amber);
	}
	.chip .val {
		color: var(--color-grass);
		font-weight: 600;
	}

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
