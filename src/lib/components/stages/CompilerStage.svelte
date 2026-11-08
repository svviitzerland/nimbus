<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { CompilerText } from '$lib/chapters/basics/compiler/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CompilerText);

	// Timings in ms. Both lanes are pure functions of the clock, so they always stay in sync.
	const C_PER = 300; // compiler, translating one line
	const C_RUN = 130; // compiled code, running one line (fast, it is already 0 and 1)
	const I_READ = 380; // interpreter, translating one line
	const I_PER = 520; // interpreter, translating plus running one line

	let typo = $state(false);
	let cached = $state(false); // a clean compile already saved nimbus.exe
	let runCached = $state(false); // this run reuses that file
	let runTypo = $state(false); // this run has the typo in it
	let t = $state(0);
	let playing = $state(false);
	let started = $state(false);
	let raf: ReturnType<typeof setInterval> | undefined;
	let startAt = 0;
	const seen = new SvelteSet<string>();
	let completed = false;

	const n = $derived(tx.code.length);
	const shownCode = $derived(tx.code.map((c, i) => (typo && i === tx.typoLine ? tx.typoCode : c)));

	type Lane = {
		phase: 'idle' | 'compiling' | 'running' | 'done' | 'error';
		scanned: number; // lines translated so far
		ran: number; // lines that have run
		current: number; // line being worked on, or -1
		errLine: number;
		end: number; // ms when this lane stops
	};

	const compiled = $derived.by((): Lane => {
		if (!started) return { phase: 'idle', scanned: 0, ran: 0, current: -1, errLine: -1, end: 0 };
		if (runTypo) {
			const errT = (tx.typoLine + 1) * C_PER;
			if (t < errT)
				return {
					phase: 'compiling',
					scanned: Math.floor(t / C_PER),
					ran: 0,
					current: Math.floor(t / C_PER),
					errLine: -1,
					end: errT
				};
			return {
				phase: 'error',
				scanned: tx.typoLine,
				ran: 0,
				current: -1,
				errLine: tx.typoLine,
				end: errT
			};
		}
		const compileEnd = runCached ? 0 : n * C_PER;
		const end = compileEnd + n * C_RUN;
		if (t < compileEnd)
			return {
				phase: 'compiling',
				scanned: Math.floor(t / C_PER),
				ran: 0,
				current: Math.floor(t / C_PER),
				errLine: -1,
				end
			};
		if (t < end) {
			const ran = Math.floor((t - compileEnd) / C_RUN);
			return { phase: 'running', scanned: n, ran, current: ran, errLine: -1, end };
		}
		return { phase: 'done', scanned: n, ran: n, current: -1, errLine: -1, end };
	});

	const interp = $derived.by((): Lane => {
		if (!started) return { phase: 'idle', scanned: 0, ran: 0, current: -1, errLine: -1, end: 0 };
		const stopLine = runTypo ? tx.typoLine : -1;
		const end = runTypo ? stopLine * I_PER + I_READ : n * I_PER;
		if (t >= end) {
			return runTypo
				? { phase: 'error', scanned: stopLine, ran: stopLine, current: -1, errLine: stopLine, end }
				: { phase: 'done', scanned: n, ran: n, current: -1, errLine: -1, end };
		}
		const line = Math.floor(t / I_PER);
		const reading = t - line * I_PER < I_READ;
		return {
			phase: 'running',
			scanned: reading ? line : line + 1,
			ran: line,
			current: line,
			errLine: -1,
			end
		};
	});

	function stopClock() {
		if (raf) clearInterval(raf);
		raf = undefined;
	}

	function run() {
		if (playing) return;
		stopClock();
		runTypo = typo;
		runCached = cached && !typo;
		started = true;
		playing = true;
		t = 0;
		startAt = Date.now();
		raf = setInterval(() => {
			t = Date.now() - startAt;
			const total = Math.max(compiled.end, interp.end);
			if (t >= total + 150) {
				t = total + 150;
				stopClock();
				finish();
			}
		}, 40);
	}

	function finish() {
		playing = false;
		const token = runTypo ? 'typo' : runCached ? 'rerun' : 'race';
		if (!runTypo) cached = true;
		seen.add(token);
		onstate?.(token);
		if (!completed && seen.has('race') && seen.has('typo')) {
			completed = true;
			oncomplete?.();
		}
	}

	function toggleTypo() {
		if (playing) return;
		typo = !typo;
		// Changing the code means the saved translation is out of date.
		cached = false;
		started = false;
		t = 0;
	}

	const secs = (ms: number) => (Math.min(ms, t) / 1000).toFixed(1);
	const lineOut = (upTo: number) => tx.output.slice(0, upTo).filter((o): o is string => o !== null);

	function cStatus(l: Lane) {
		if (l.phase === 'idle') return tx.noteIdle;
		if (l.phase === 'compiling') return tx.compiling;
		if (l.phase === 'error') return tx.errCompile.replace('{n}', String(l.errLine + 1));
		if (l.phase === 'running') return runCached ? tx.reused : tx.ready;
		return tx.finishedIn.replace('{s}', secs(l.end));
	}
	function iStatus(l: Lane) {
		if (l.phase === 'idle') return tx.noteIdle;
		if (l.phase === 'error') return tx.errInterp.replace('{n}', String(l.errLine + 1));
		if (l.phase === 'running') return tx.readingLine.replace('{n}', String(l.current + 1));
		return tx.finishedIn.replace('{s}', secs(l.end));
	}

	onDestroy(stopClock);
</script>

{#snippet lane(kind: 'c' | 'i', l: Lane)}
	{@const info = kind === 'c' ? tx.compiler : tx.interpreter}
	<div class="lane" class:err={l.phase === 'error'} class:fin={l.phase === 'done'}>
		<div class="head">
			<div>
				<b>{info.name}</b>
				<span>{info.sub}</span>
			</div>
			<span class="clock">{started ? secs(l.end) : '0.0'} s</span>
		</div>

		{#if kind === 'c'}
			<div class="bar" aria-hidden="true">
				<i
					style="width:{runCached && !runTypo && started
						? 100
						: (Math.min(l.scanned, n) / n) * 100}%"
				></i>
			</div>
		{/if}
		<p class="status">{kind === 'c' ? cStatus(l) : iStatus(l)}</p>

		<ol class="lines">
			{#each shownCode as row, i (i)}
				{@const isErr = l.errLine === i}
				{@const tr = i < l.scanned}
				{@const ran = i < l.ran}
				{@const cur = l.current === i && (l.phase === 'running' || l.phase === 'compiling')}
				<li class:cur class:ran class:bad={isErr}>
					<span class="no">{i + 1}</span>
					<code>{row}</code>
					<span class="mark">
						{#if isErr}
							<em class="x">!</em>
						{:else if ran}
							<em class="ok">✓</em>
						{:else if tr}
							<em class="bits">01</em>
						{/if}
					</span>
				</li>
			{/each}
		</ol>

		<div class="screen">
			<span class="slabel">{tx.screenLabel}</span>
			{#if lineOut(l.ran).length}
				{#each lineOut(l.ran) as o, i (i)}
					<code>{o}</code>
				{/each}
			{:else}
				<span class="empty">{tx.waiting}</span>
			{/if}
		</div>
	</div>
{/snippet}

<div class="wrap">
	<div class="acts">
		<button type="button" class="cta" onclick={run} disabled={playing}>
			{started ? tx.runAgain : tx.run}
		</button>
		<button type="button" class="line-btn" class:on={typo} onclick={toggleTypo} disabled={playing}>
			{typo ? tx.fixTypo : tx.addTypo}
		</button>
	</div>

	<div class="lanes">
		{@render lane('c', compiled)}
		{@render lane('i', interp)}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 720px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line-btn {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 9px 16px;
		font-size: 13px;
		font-weight: 600;
	}
	.line-btn.on {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.cta:disabled,
	.line-btn:disabled {
		opacity: 0.55;
	}

	.lanes {
		display: grid;
		grid-template-columns: 1fr;
		gap: 10px;
		width: 100%;
		max-width: 400px;
	}
	@media (min-width: 768px) {
		.lanes {
			grid-template-columns: 1fr 1fr;
			max-width: 720px;
		}
	}
	.lane {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
		padding: 10px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		transition: border-color 0.3s ease;
	}
	.lane.fin {
		border-color: var(--color-grass);
	}
	.lane.err {
		border-color: var(--color-danger);
	}
	.head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 8px;
	}
	.head b {
		display: block;
		font-size: 14px;
		color: var(--color-ink);
	}
	.head span {
		font-size: 11px;
		color: var(--color-faint);
	}
	.head .clock {
		flex: none;
		padding: 2px 8px;
		border-radius: 999px;
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.bar {
		height: 6px;
		border-radius: 999px;
		background: var(--color-line);
		overflow: hidden;
	}
	.bar i {
		display: block;
		height: 100%;
		background: var(--color-brand);
		transition: width 0.12s linear;
	}
	.err .bar i {
		background: var(--color-danger);
	}
	.status {
		margin: 0;
		min-height: 1.3em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.err .status {
		color: var(--color-danger);
	}
	.fin .status {
		color: var(--color-grass);
	}
	.lines {
		margin: 0;
		padding: 4px 0;
		list-style: none;
		border-radius: 10px;
		background: var(--color-paper);
	}
	.lines li {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 1px 8px;
		font-size: 12px;
		line-height: 1.6;
		border-left: 2px solid transparent;
	}
	.lines li.cur {
		background: var(--color-brand-soft);
		border-left-color: var(--color-brand);
	}
	.lines li.bad {
		background: var(--color-danger-soft);
		border-left-color: var(--color-danger);
	}
	.no {
		flex: none;
		width: 12px;
		text-align: right;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-faint);
	}
	.lines code {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-ink);
	}
	.mark {
		flex: none;
		width: 20px;
		text-align: center;
	}
	.mark em {
		font-style: normal;
		font-size: 10.5px;
		font-weight: 800;
	}
	.mark .ok {
		color: var(--color-grass);
	}
	.mark .bits {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-brand);
	}
	.mark .x {
		color: var(--color-danger);
	}
	.screen {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-height: 64px;
		padding: 6px 10px;
		border-radius: 10px;
		background: var(--btn-primary);
		color: #e8eef5;
	}
	.slabel {
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.6;
	}
	.screen code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
	}
	.screen .empty {
		font-size: 11.5px;
		opacity: 0.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.bar i,
		.lane {
			transition: none;
		}
	}
</style>
