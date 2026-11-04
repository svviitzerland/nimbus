<script lang="ts">
	// A guided terminal lab about pipes and grep. The nimbus.com access log sits on the left as a
	// sheet of lines (404s in red, 500s in amber). On the right three small machines, cat, grep and
	// wc, light up as Nim builds the pipeline one tool at a time, with dots flowing through the pipes
	// (only the matching ones get past grep). One beat swaps the machines for a nano window. On the
	// last beat the learner counts the 500s with cat access.log | grep 500 | wc -l.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { PipesGrepText } from '$lib/chapters/linux/pipes-grep/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type Cmd, type Ln, type Seg, type ShellEvent } from './linux/shell.svelte';
	import { dir, file, mine, myDir, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as PipesGrepText);

	const SCRIPT: string[][] = [
		[],
		['cat access.log'],
		['grep 404 access.log'],
		['cat access.log | grep 404'],
		['cat access.log | grep 404 | wc -l'],
		[],
		['nano todo.txt', 'cat todo.txt'],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = 'cat access.log | grep 500 | wc -l';
	const LOG_DIR = '/var/log/nginx';

	const LOG = [
		'[09:01] 203.0.113.7 GET / 200',
		'[09:02] 198.51.100.23 GET /pricing 200',
		'[09:03] 203.0.113.41 GET /oldpromo 404',
		'[09:04] 192.0.2.15 GET /login 200',
		'[09:05] 198.51.100.8 POST /checkout 500',
		'[09:06] 203.0.113.7 GET /blog 200',
		'[09:07] 192.0.2.77 GET /favicon.png 404',
		'[09:08] 198.51.100.23 GET /about 200',
		'[09:09] 203.0.113.90 GET /admin 404',
		'[09:10] 192.0.2.15 POST /checkout 500',
		'[09:11] 198.51.100.61 GET /pricing 200',
		'[09:12] 203.0.113.12 GET /promo2025 404',
		'[09:13] 192.0.2.33 GET / 200',
		'[09:14] 198.51.100.8 GET /contact 200'
	];
	const codeOf = (l: string) => l.slice(l.lastIndexOf(' ') + 1);

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	// What the machines on the right show, set by the last command that read the log.
	type Flow = { cat: boolean; grep: boolean; wc: boolean; pat: string; out: string };
	let flow = $state<Flow | null>(null);
	let quiet = false;
	let capturing = false;
	const say = (t: string) => {
		if (!quiet && !capturing && live) onstate?.(t);
	};

	const words = (s: string) =>
		s.match(/"[^"]*"|'[^']*'|\S+/g)?.map((w) => w.replace(/^["']|["']$/g, '')) ?? [];
	const isLog = (p?: string) => !!p && /(^|\/)access\.log$/.test(p);
	const lines = (n: number) => tx.linesLabel.replace('{n}', String(n));

	function hits(l: string, pat: string, ci: boolean): Seg[] {
		const esc = pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const s: Seg[] = [];
		let last = 0;
		for (const m of l.matchAll(new RegExp(esc, ci ? 'gi' : 'g'))) {
			if (m.index! > last) s.push({ text: l.slice(last, m.index) });
			s.push({ text: m[0], tone: 'hit' });
			last = m.index! + m[0].length;
		}
		if (last < l.length) s.push({ text: l.slice(last) });
		return s;
	}

	/** Run a line with pipes. The first command runs for real, the rest filter its output. */
	function pipeline(line: string, sh: LinuxShell) {
		const parts = line.split('|').map((s) => s.trim());
		if (parts.some((p) => !p)) {
			sh.err("-bash: syntax error near unexpected token `|'");
			sh.hint(tx.hintPipe);
			say('error');
			return;
		}
		// Capture what the first command prints.
		const keep = sh.history;
		sh.history = [];
		capturing = true;
		try {
			sh.exec(parts[0], false);
		} finally {
			capturing = false;
		}
		const got: Ln[] = sh.history;
		sh.history = keep;
		const bad = got.filter((l) => l.tone === 'err' || l.tone === 'muted');
		if (bad.length) {
			sh.history = [...sh.history, ...bad];
			return;
		}
		let data = got.map((l) => l.text);
		const first = words(parts[0]);
		const fromLog = first.some((w) => isLog(w));
		let pat = '';
		let ci = false;
		let color = first[0] === 'grep';
		if (first[0] === 'grep') pat = first.find((w, k) => k > 0 && !w.startsWith('-')) ?? '';
		let counted = false;
		const used = { cat: first[0] === 'cat', grep: first[0] === 'grep', wc: false };

		for (const part of parts.slice(1)) {
			const [name, ...args] = words(part);
			const flags = args.filter((a) => a.startsWith('-')).join('');
			const rest = args.filter((a) => !a.startsWith('-'));
			color = false;
			if (name === 'grep') {
				if (!rest[0]) {
					sh.err('Usage: grep [OPTION]... PATTERNS [FILE]...');
					say('error');
					return;
				}
				pat = rest[0];
				ci = flags.includes('i');
				const re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ci ? 'i' : '');
				const inv = flags.includes('v');
				data = data.filter((l) => re.test(l) !== inv);
				if (flags.includes('c')) data = [String(data.length)];
				else color = !inv;
				used.grep = true;
			} else if (name === 'wc') {
				const n = data.length;
				if (flags.includes('l')) data = [String(n)];
				else {
					const w = data.reduce((s, l) => s + l.split(/\s+/).filter(Boolean).length, 0);
					const c = data.reduce((s, l) => s + l.length + 1, 0);
					data = [`${String(n).padStart(7)} ${String(w).padStart(7)} ${String(c).padStart(7)}`];
				}
				counted = flags.includes('l');
				used.wc = true;
			} else if (name === 'head' || name === 'tail') {
				const k = Number(/\d+/.exec(args.join(' '))?.[0] ?? 10);
				data = name === 'head' ? data.slice(0, k) : data.slice(-k);
			} else if (name === 'sort') {
				data = [...data].sort();
				if (flags.includes('r')) data.reverse();
			} else if (name === 'uniq') {
				data = data.filter((l, k) => l !== data[k - 1]);
			} else {
				sh.err(`${name}: command not found`);
				sh.hint(tx.hintPipe);
				say('error');
				return;
			}
		}

		for (const l of data) {
			if (color && pat) sh.segs(hits(l, pat, ci));
			else sh.out(l);
		}

		if (fromLog) {
			flow = {
				...used,
				pat: pat || '404',
				out: counted ? data[0] : lines(data.length)
			};
		}
		if (counted && pat === '500') say('server');
		else if (counted && pat === '404') say('counted404');
		else if (counted) say('counted');
		else if (pat && !data.length) say('noMatch');
		else if (used.grep) say('piped');
		else say('read');
	}

	function onevent(e: ShellEvent) {
		if (capturing) return true;
		if (e.type === 'read' && isLog(e.path)) {
			if (e.cmd === 'grep') {
				const pat = lastGrepPat;
				const n = LOG.filter((l) => l.includes(pat)).length;
				flow = { cat: false, grep: true, wc: false, pat, out: lines(n) };
				say('grepped');
			} else {
				flow = { cat: true, grep: false, wc: false, pat: '404', out: lines(LOG.length) };
				say('read');
			}
			return true;
		}
		return false;
	}

	let lastGrepPat = '404';

	function handler(c: Cmd, sh: LinuxShell) {
		if (c.line.includes('|')) {
			pipeline(c.line, sh);
			return true;
		}
		if (c.name === 'grep') {
			lastGrepPat = c.args.find((a) => !a.startsWith('-')) ?? '404';
			return false;
		}
		if (c.name === 'nano' || c.name === 'vi' || c.name === 'vim') {
			const t = c.args[0];
			if (!t) {
				sh.hint(tx.hintNano);
				return true;
			}
			const abs = sh.abs(t);
			const n = sh.node(t);
			if (n && !sh.allowed(n, 'w', c.sudo)) {
				sh.err(`[ Error writing ${t}: Permission denied ]`);
				sh.hint(tx.hintDenied);
				say('denied');
				return true;
			}
			if (!n && !sh.put(abs, mine([]))) {
				sh.err(`[ Directory '${t}' does not exist ]`);
				say('missing');
				return true;
			}
			const node = sh.node(t)!;
			node.body = [...(node.body ?? []), ...tx.nanoLines];
			sh.hint(tx.hintNano);
			sh.ok(`[ Wrote ${node.body.length} lines ]`);
			say('nano');
			return true;
		}
		if (c.name === 'wc') {
			const f = c.args.find((a) => !a.startsWith('-'));
			const n = f ? sh.node(f) : undefined;
			if (!f || !n || n.kind !== 'file') return false;
			sh.out(`${(n.body ?? []).length} ${f}`);
			return true;
		}
		return false;
	}

	function makeFs(): FNode {
		return dir({
			home: dir({ nim: myDir({}) }),
			var: dir({
				log: dir({
					nginx: dir({
						'access.log': file(LOG),
						'error.log': file(['[error] upstream timed out while reading /checkout'])
					})
				})
			})
		});
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: say,
		onevent,
		handler,
		commands: ['wc', 'nano', 'sort', 'uniq'],
		cwd: LOG_DIR
	});
	shell.speed = 45;

	function direct(sc: number) {
		flow = null;
		lastGrepPat = '404';
		shell.reset(makeFs(), LOG_DIR);
		quiet = true;
		shell.quick(SCRIPT.slice(0, sc).flat());
		if (sc === LAST) flow = { cat: true, grep: true, wc: true, pat: '500', out: '?' };
		quiet = false;
		shell.typeSeq(SCRIPT[sc]);
	}

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		return () => shell.destroy();
	});
	$effect(() => {
		void beat;
		peek = null;
	});
	$effect(() => {
		const sc = scene;
		untrack(() => direct(sc));
	});

	// Machines on the right, left to right.
	const BX = [112, 196, 280];
	const BW = 70;
	const BY = 66;
	const BH = 34;
	const lastOn = $derived(flow ? (flow.wc ? 2 : flow.grep ? 1 : 0) : -1);
	const matchCode = $derived(flow?.grep ? flow.pat : '');
	// Dots in a pipe, before grep any line, after grep only the matching ones.
	const DOTS = [0, 1, 2, 3];
</script>

{#snippet pipe(x1: number, x2: number, filtered: boolean, plain: boolean)}
	<g class="pipe">
		<line {x1} y1={BY + BH / 2} {x2} y2={BY + BH / 2} class="pipe-line" />
		{#if !plain}
			<text x={(x1 + x2) / 2} y={BY - 6} class="bar-t">|</text>
		{/if}
		{#each DOTS as d (d)}
			<circle
				cx={x1}
				cy={BY + BH / 2}
				r="2.6"
				class="dot"
				class:red={filtered || d % 2 === 0}
				style="--d:{x2 - x1}px; animation-delay:{d * 0.35}s"
			/>
		{/each}
	</g>
{/snippet}

{#snippet art(i: number)}
	<svg viewBox="0 0 360 196" class="art-svg" aria-hidden="true">
		<!-- the log file, one bar per line -->
		<path d="M14 18 H80 L96 34 V160 H14 Z" class="doc" />
		<path d="M80 18 V34 H96" class="fold" />
		{#each LOG as l, k (k)}
			{@const code = codeOf(l)}
			{@const keep = !matchCode || code === matchCode}
			<rect
				x="22"
				y={40 + k * 8}
				width={[54, 62, 48, 58, 66, 44, 60, 52, 64, 50, 56, 46, 62, 54][k]}
				height="4"
				rx="2"
				class="ln"
				class:e404={code === '404'}
				class:e500={code === '500'}
				class:faded={!keep}
			/>
		{/each}
		<text x="55" y="178" class="label">{tx.logLabel}</text>

		{#if i === 6}
			<!-- nano, a text editor inside the terminal -->
			<g in:fade={{ duration: 300 }}>
				<rect x="112" y="22" width="238" height="140" rx="10" class="nano" />
				<rect x="112" y="22" width="238" height="20" rx="10" class="nano-bar" />
				<rect x="112" y="32" width="238" height="10" class="nano-bar" />
				<text x="231" y="36" class="nano-title">{tx.nanoTitle}</text>
				{#each tx.nanoLines as l, k (k)}
					<text x="124" y={62 + k * 16} class="nano-t">{l}</text>
				{/each}
				<rect x="124" y={53 + tx.nanoLines.length * 16} width="7" height="12" class="caret" />
				<rect x="112" y="140" width="238" height="22" rx="10" class="nano-foot" />
				<rect x="112" y="140" width="238" height="10" class="nano-foot" />
				<text x="124" y="155" class="nano-key">{tx.nanoSave}</text>
				<text x="230" y="155" class="nano-key">{tx.nanoExit}</text>
			</g>
		{:else}
			<!-- the machines, joined by pipes -->
			{#if flow}
				{#if flow.cat}
					{@render pipe(96, BX[0], false, true)}
				{:else if flow.grep}
					{@render pipe(96, BX[1], false, true)}
				{/if}
				{#if flow.cat && flow.grep}
					{@render pipe(BX[0] + BW, BX[1], false, false)}
				{/if}
				{#if flow.wc}
					{@render pipe(BX[1] + BW, BX[2], true, false)}
				{/if}
			{/if}
			{#each ['cat', 'grep', 'wc'] as m, k (m)}
				{@const on = !!flow && !!flow[m as 'cat' | 'grep' | 'wc']}
				{@const hidden = !!flow && k === 0 && !flow.cat && flow.grep}
				<g class="box" class:on class:hidden>
					<rect x={BX[k]} y={BY} width={BW} height={BH} rx="9" class="box-r" />
					<text x={BX[k] + BW / 2} y={BY + 21} class="box-t"
						>{m === 'grep' ? `grep ${flow?.pat ?? '404'}` : m === 'wc' ? 'wc -l' : 'cat'}</text
					>
				</g>
			{/each}
			{#if flow && lastOn >= 0}
				{#key flow.out + lastOn}
					<g in:fade={{ duration: 300 }}>
						<path d="M{BX[lastOn] + BW / 2} {BY + BH} V{BY + BH + 16}" class="pipe-line" />
						<rect
							x={BX[lastOn] + BW / 2 - 34}
							y={BY + BH + 16}
							width="68"
							height="30"
							rx="15"
							class="out"
							class:big={flow.wc}
						/>
						<text x={BX[lastOn] + BW / 2} y={BY + BH + 36} class="out-t" class:big={flow.wc}
							>{flow.out}</text
						>
					</g>
				{/key}
			{/if}
		{/if}
	</svg>
	{#if i === 5}
		<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
	{/if}
{/snippet}

<GuidedLab {tx} {shell} active={scene} {live} tryCmd={TRY} onselect={(i) => (peek = i)} {art} />

<style>
	.art-svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 32vh;
	}
	.doc {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.fold {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.ln {
		fill: var(--color-line);
		transition: opacity 0.4s;
	}
	.ln.e404 {
		fill: var(--color-danger);
	}
	.ln.e500 {
		fill: var(--color-amber);
	}
	.ln.faded {
		opacity: 0.25;
	}
	.label {
		fill: var(--color-muted);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.pipe-line {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.55;
	}
	.bar-t {
		fill: var(--color-brand);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 15px;
		font-weight: 700;
		text-anchor: middle;
	}
	.dot {
		fill: var(--color-faint);
		opacity: 0;
		animation: flow 1.4s linear infinite;
	}
	.dot.red {
		fill: var(--color-danger);
	}
	@keyframes flow {
		0% {
			transform: translateX(0);
			opacity: 0;
		}
		15%,
		85% {
			opacity: 1;
		}
		100% {
			transform: translateX(var(--d));
			opacity: 0;
		}
	}
	.box {
		opacity: 0.35;
		transition: opacity 0.4s;
	}
	.box.on {
		opacity: 1;
	}
	.box.hidden {
		opacity: 0;
	}
	.box-r {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.6;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.box.on .box-r {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.box-t {
		fill: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.out {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.out.big {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.out-t {
		fill: var(--color-muted);
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.out-t.big {
		fill: var(--color-grass);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 16px;
	}
	.nano {
		fill: #0f2030;
	}
	.nano-bar {
		fill: #d2e2ee;
	}
	.nano-title {
		fill: #0f2030;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
	}
	.nano-t {
		fill: #eaf1f6;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
	}
	.caret {
		fill: #6fd39a;
		animation: blink 1s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.nano-foot {
		fill: #15293a;
	}
	.nano-key {
		fill: #d2e2ee;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
	}
	.rule {
		margin: 6px 0 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
			opacity: 1;
		}
		.caret {
			animation: none;
		}
		.ln,
		.box,
		.box-r {
			transition: none;
		}
	}
</style>
