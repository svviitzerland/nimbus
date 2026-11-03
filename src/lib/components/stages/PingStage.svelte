<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { PingText } from '$lib/chapters/network/ping/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as PingText);
	const live = $derived(beat >= tx.intro.length - 1);

	// ---- The road to nimbus.com (real looking addresses and times, not copy) ----
	const SERVER_IP = '76.76.21.21';
	const ROUTER_IP = '192.168.1.1';
	const HOPS: { ip: string | null; ms: number }[] = [
		{ ip: ROUTER_IP, ms: 1.9 },
		{ ip: '10.12.0.1', ms: 6.2 },
		{ ip: null, ms: 0 },
		{ ip: '103.28.54.1', ms: 9.8 },
		{ ip: '203.208.171.117', ms: 22.6 },
		{ ip: SERVER_IP, ms: 24.3 }
	];
	const LAST = HOPS.length - 1;

	let routerMs = $state<number | null>(null);
	let serverMs = $state<number | null>(null);
	let revealed = $state(0); // how many hops traceroute has shown so far
	let tracing = $state(false);

	// ---- Missions ----
	type MissionId = 'ping' | 'trace';
	const MISSIONS: { id: MissionId; cmd: string }[] = [
		{ id: 'ping', cmd: 'ping nimbus.com' },
		{ id: 'trace', cmd: 'traceroute nimbus.com' }
	];
	let done = $state<Record<MissionId, boolean>>({ ping: false, trace: false });
	const doneCount = $derived(MISSIONS.filter((m) => done[m.id]).length);
	let finished = false;
	function complete(m: MissionId) {
		if (done[m]) {
			onstate?.(m);
			return;
		}
		done[m] = true;
		if (MISSIONS.every((x) => done[x.id])) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			}
		} else onstate?.(m);
	}

	// ---- Terminal ----
	type Ln = { tone: 'cmd' | 'out' | 'ok' | 'err' | 'muted'; text: string };
	let history = $state<Ln[]>([]);
	let input = $state('');
	let busy = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	let started = false;
	const PROMPT = 'nim@laptop ~ %';

	const reduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let typer: ReturnType<typeof setInterval> | undefined;
	$effect(() => () => {
		timers.forEach(clearTimeout);
		clearInterval(typer);
	});

	const add = (tone: Ln['tone'], t: string) => (history = [...history, { tone, text: t }]);

	// Print lines one after another, like a real command waiting for each reply.
	type Step = { tone: Ln['tone']; text: string; gap: number; then?: () => void };
	function stream(steps: Step[], end?: () => void) {
		busy = true;
		let at = 0;
		for (const s of steps) {
			at += reduced ? 40 : s.gap;
			timers.push(
				setTimeout(() => {
					add(s.tone, s.text);
					s.then?.();
				}, at)
			);
		}
		timers.push(
			setTimeout(() => {
				busy = false;
				end?.();
				inputEl?.focus();
			}, at + 60)
		);
	}

	function lev(a: string, b: string) {
		const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
		for (let j = 1; j <= b.length; j++) d[0][j] = j;
		for (let i = 1; i <= a.length; i++)
			for (let j = 1; j <= b.length; j++)
				d[i][j] = Math.min(
					d[i - 1][j] + 1,
					d[i][j - 1] + 1,
					d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
				);
		return d[a.length][b.length];
	}

	type Target = 'server' | 'router' | 'silent' | 'unknown';
	function resolve(host: string): Target {
		const h = host
			.toLowerCase()
			.replace(/^https?:\/\//, '')
			.replace(/\/.*$/, '');
		if (h === 'nimbus.com' || h === 'www.nimbus.com' || h === SERVER_IP) return 'server';
		if (h === ROUTER_IP) return 'router';
		if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return 'silent';
		return 'unknown';
	}
	const jitter = (base: number) => Math.round((base + (Math.random() - 0.5) * 1.6) * 10) / 10;

	function unknownHost(cmd: string, host: string) {
		add('err', `${cmd}: cannot resolve ${host}: Unknown host`);
		const h = host.toLowerCase();
		if (lev(h, 'nimbus.com') <= 3) add('muted', tx.didYouMean.replace('{word}', 'nimbus.com'));
		onstate?.('unknown');
	}

	function doPing(host: string) {
		const t = resolve(host);
		if (t === 'unknown') return unknownHost('ping', host);
		const ip = t === 'server' ? SERVER_IP : t === 'router' ? ROUTER_IP : host;
		const name = t === 'server' ? 'nimbus.com' : ip;
		const steps: Step[] = [{ tone: 'out', text: `PING ${name} (${ip}): 56 data bytes`, gap: 120 }];
		if (t === 'silent') {
			for (let i = 0; i < 3; i++)
				steps.push({ tone: 'err', text: `Request timeout for icmp_seq ${i}`, gap: 700 });
			steps.push({
				tone: 'out',
				text: '3 packets transmitted, 0 packets received, 100.0% packet loss',
				gap: 200
			});
			steps.push({ tone: 'muted', text: tx.hintTimeout, gap: 80 });
			return stream(steps);
		}
		const base = t === 'server' ? 24 : 1.9;
		const ttl = t === 'server' ? 52 : 64;
		const times = Array.from({ length: 4 }, () => jitter(base));
		times.forEach((ms, i) =>
			steps.push({
				tone: 'ok',
				text: `64 bytes from ${ip}: icmp_seq=${i} ttl=${ttl} time=${ms.toFixed(1)} ms`,
				gap: i === 0 ? 380 : 620
			})
		);
		const min = Math.min(...times).toFixed(1);
		const max = Math.max(...times).toFixed(1);
		const avg = times.reduce((a, b) => a + b, 0) / times.length;
		steps.push({
			tone: 'out',
			text: '4 packets transmitted, 4 packets received, 0.0% packet loss',
			gap: 200
		});
		steps.push({
			tone: 'out',
			text: `round trip min/avg/max = ${min}/${avg.toFixed(1)}/${max} ms`,
			gap: 60
		});
		stream(steps, () => {
			if (t === 'server') {
				serverMs = Math.round(avg);
				complete('ping');
			} else {
				routerMs = Math.round(avg * 10) / 10;
				onstate?.('pingRouter');
			}
		});
	}

	function doTrace(cmd: string, host: string) {
		const t = resolve(host);
		if (t === 'unknown') return unknownHost(cmd, host);
		if (t !== 'server') {
			// short roads, keep them honest without drawing them
			const steps: Step[] = [
				{ tone: 'out', text: `traceroute to ${host} (${host}), 30 hops max`, gap: 120 }
			];
			if (t === 'router')
				steps.push({ tone: 'ok', text: ` 1  ${ROUTER_IP}  ${jitter(1.9)} ms`, gap: 500 });
			else {
				steps.push({ tone: 'ok', text: ` 1  ${ROUTER_IP}  ${jitter(1.9)} ms`, gap: 500 });
				steps.push({ tone: 'err', text: ' 2  * * *', gap: 900 });
				steps.push({ tone: 'muted', text: tx.hintTimeout, gap: 80 });
			}
			return stream(steps);
		}
		revealed = 0;
		tracing = true;
		const steps: Step[] = [
			{
				tone: 'out',
				text: `traceroute to nimbus.com (${SERVER_IP}), 30 hops max, 60 byte packets`,
				gap: 120
			}
		];
		HOPS.forEach((h, i) =>
			steps.push({
				tone: h.ip ? 'ok' : 'err',
				text: h.ip ? ` ${i + 1}  ${h.ip}  ${jitter(h.ms).toFixed(1)} ms` : ` ${i + 1}  * * *`,
				gap: h.ip ? 520 : 1100,
				then: () => (revealed = i + 1)
			})
		);
		steps.push({ tone: 'muted', text: tx.hintStars, gap: 120 });
		stream(steps, () => {
			tracing = false;
			if (routerMs === null) routerMs = HOPS[0].ms;
			complete('trace');
		});
	}

	function run(raw: string) {
		const line = raw.trim();
		if (!line) return;
		if (!started) {
			started = true;
			history = [];
		}
		add('cmd', line);
		const words = line.split(/\s+/);
		const cmd = words[0].toLowerCase();
		// skip flags like "-c 4" and keep the destination
		const rest: string[] = [];
		for (let i = 1; i < words.length; i++) {
			if (words[i].startsWith('-')) {
				if (/^-[cnwmt]$/.test(words[i])) i++;
				continue;
			}
			rest.push(words[i]);
		}
		const host = rest[rest.length - 1];
		if (cmd === 'clear' || cmd === 'cls') {
			history = [];
			return;
		}
		if (cmd === 'help' || cmd === '?') {
			add('out', 'ping <host>   traceroute <host>   tracert <host>   clear');
			return;
		}
		if (cmd === 'ping' || cmd === 'traceroute' || cmd === 'tracert') {
			if (!host) {
				add('err', `usage: ${cmd} <host>`);
				add('muted', tx.hintNeedHost);
				onstate?.('error');
				return;
			}
			if (cmd === 'ping') doPing(host);
			else doTrace(cmd, host);
			return;
		}
		add('err', `zsh: command not found: ${words[0]}`);
		const near = ['ping', 'traceroute', 'tracert'].find((k) => lev(cmd, k) <= 2);
		add('muted', near ? tx.didYouMean.replace('{word}', near) : tx.hintUnknownCmd);
		onstate?.('error');
	}

	function submit(e: Event) {
		e.preventDefault();
		if (!live || busy) return;
		const v = input;
		input = '';
		run(v);
	}

	function typeFor(cmd: string) {
		if (!live || busy) return;
		if (reduced) {
			input = '';
			run(cmd);
			return;
		}
		busy = true;
		input = '';
		let n = 0;
		typer = setInterval(() => {
			n += 1;
			input = cmd.slice(0, n);
			if (n >= cmd.length) {
				clearInterval(typer);
				timers.push(
					setTimeout(() => {
						input = '';
						busy = false;
						run(cmd);
					}, 220)
				);
			}
		}, 28);
	}

	// Seed a helper line (kept language synced until the first real command).
	$effect(() => {
		if (started) return;
		const h = tx.termHint;
		if (history.length === 0 || (history.length === 1 && history[0].text !== h))
			history = [{ tone: 'muted', text: h }];
	});
	$effect(() => {
		void history.length;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});

	// What each hop row shows: known once traceroute reached it (or ping did, for the ends).
	function hopState(i: number): 'hidden' | 'shown' | 'quiet' | 'next' {
		const known =
			i < revealed ||
			(i === LAST && serverMs !== null) ||
			(i === 0 && routerMs !== null && !tracing);
		if (known) return HOPS[i].ip ? 'shown' : 'quiet';
		if (tracing && i === revealed) return 'next';
		return i === LAST ? 'shown' : 'hidden';
	}
	function hopMs(i: number): string {
		if (i === LAST && serverMs !== null && revealed <= LAST)
			return tx.roundTrip.replace('{ms}', String(serverMs));
		if (i < revealed && HOPS[i].ip) return `${HOPS[i].ms} ms`;
		if (i === 0 && routerMs !== null) return `${routerMs} ms`;
		return '';
	}
</script>

<div class="wrap">
	<div class="missions">
		<div class="mhead">
			<span>{tx.missionsLabel}</span>
			<span class="count">{doneCount}/{MISSIONS.length}</span>
		</div>
		{#each MISSIONS as ms, i (ms.id)}
			<div class="mrow" class:ok={done[ms.id]}>
				<span class="box" aria-hidden="true">
					{#if done[ms.id]}<svg viewBox="0 0 16 16"
							><path
								d="M3.5 8.5l3 3 6-7"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>{/if}
				</span>
				<span class="mlabel">{tx.missions[i]}</span>
				{#if !done[ms.id]}
					<button
						type="button"
						class="chip"
						disabled={!live || busy}
						onclick={() => typeFor(ms.cmd)}
					>
						<svg viewBox="0 0 12 12" aria-hidden="true"
							><path d="M3 2l6 4-6 4z" fill="currentColor" /></svg
						>{tx.hintBtn}
					</button>
				{/if}
			</div>
		{/each}
		{#if doneCount === MISSIONS.length}<p class="mdone">{tx.doneNote}</p>{/if}
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div class="term" onclick={() => inputEl?.focus()}>
		<div class="tbar">
			<span class="dots"><i></i><i></i><i></i></span>
			<span class="thost">Terminal</span>
		</div>
		<div class="tbody" bind:this={bodyEl}>
			{#each history as l, i (i)}
				<div class="ln {l.tone}">
					{#if l.tone === 'cmd'}<span class="pr">{PROMPT}</span>{/if}{l.text}
				</div>
			{/each}
			<form class="ln cmd active" onsubmit={submit}>
				<span class="pr">{PROMPT}</span>
				<input
					class="tin"
					bind:this={inputEl}
					bind:value={input}
					readonly={busy}
					disabled={!live}
					spellcheck="false"
					autocapitalize="off"
					autocomplete="off"
					aria-label={tx.inputLabel}
				/>
			</form>
		</div>
	</div>

	<div class="route">
		<span class="rlabel">{tx.routeLabel}</span>
		<ol>
			<li class="hop shown you">
				<span class="node"></span>
				<span class="hname">{tx.youLabel}</span>
			</li>
			{#each tx.hops as hop, i (i)}
				{@const st = hopState(i)}
				<li class="hop {st}" class:server={i === LAST}>
					<span class="node"></span>
					{#if st === 'hidden' || st === 'next'}
						<span class="hname faint">{tx.hiddenHop}</span>
					{:else}
						<span class="hname"
							>{hop.name}
							<small>{hop.place}</small></span
						>
						{#if st === 'quiet'}
							<em class="quiet">{tx.quietTag}</em>
						{:else}
							<span class="hms">{hopMs(i)}</span>
						{/if}
					{/if}
				</li>
			{/each}
		</ol>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 400px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}

	/* ---- Missions (same look as the MikroTik lab) ---- */
	.missions {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 10px 6px;
	}
	.mhead {
		display: flex;
		justify-content: space-between;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
		padding: 0 2px 4px;
	}
	.count {
		font-variant-numeric: tabular-nums;
	}
	.mrow {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 28px;
		font-size: 12.5px;
		font-weight: 650;
		color: var(--color-ink);
	}
	.mrow.ok {
		color: var(--color-grass);
	}
	.box {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex: none;
		width: 16px;
		height: 16px;
		border-radius: 5px;
		border: 1.5px solid var(--color-line);
	}
	.mrow.ok .box {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.box svg {
		width: 12px;
		height: 12px;
	}
	.mlabel {
		flex: 1;
		min-width: 0;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		flex: none;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		padding: 3px 10px 3px 8px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chip svg {
		width: 9px;
		height: 9px;
		color: var(--color-brand);
	}
	.chip:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-ink);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	.mdone {
		margin: 4px 0 2px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
		text-align: center;
	}

	/* ---- Terminal ---- */
	.term {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.28);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-align: left;
		cursor: text;
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 7px 12px;
		background: #15293a;
		border-bottom: 1px solid #1d3547;
	}
	.dots {
		display: inline-flex;
		gap: 5px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.dots i:nth-child(1) {
		background: #e06a5b;
	}
	.dots i:nth-child(2) {
		background: #e0b65b;
	}
	.dots i:nth-child(3) {
		background: #5bbd84;
	}
	.thost {
		font-size: 11px;
		font-weight: 600;
		color: #8aa2b3;
	}
	.tbody {
		display: flex;
		flex-direction: column;
		gap: 2px;
		height: 170px;
		overflow: auto;
		padding: 10px 12px;
		font-size: 11px;
		line-height: 1.5;
	}
	.ln {
		color: #93a7b6;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.ln.out {
		color: #d2e2ee;
	}
	.ln.ok {
		color: #6fd39a;
	}
	.ln.cmd {
		color: #eaf1f6;
	}
	.ln.err {
		color: #ff9d92;
	}
	.ln.muted {
		color: #6b8496;
		font-style: italic;
	}
	.pr {
		color: #5bbd84;
		font-weight: 600;
		margin-right: 0.6ch;
	}
	.active {
		display: flex;
		align-items: baseline;
	}
	.tin {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		color: #eaf1f6;
		font: inherit;
		caret-color: #6fd39a;
		padding: 0;
		box-shadow: none;
	}
	.tin:focus {
		box-shadow: none;
	}

	/* ---- The road, one row per hop ---- */
	.route {
		width: 100%;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px 6px;
	}
	.rlabel {
		display: block;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
		padding-bottom: 4px;
	}
	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.hop {
		position: relative;
		display: flex;
		align-items: center;
		gap: 9px;
		min-height: 25px;
		padding-left: 2px;
		font-size: 12px;
	}
	/* the solid rail joining one hop to the next */
	.hop:not(:last-child)::after {
		content: '';
		position: absolute;
		left: 6.5px;
		top: 17px;
		bottom: -8px;
		width: 2px;
		background: var(--color-line);
	}
	.node {
		position: relative;
		z-index: 1;
		flex: none;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--color-card);
		border: 2px solid var(--color-line);
		transition:
			background 0.3s ease,
			border-color 0.3s ease;
	}
	.hop.shown .node {
		border-color: var(--color-grass);
		background: var(--color-grass);
	}
	.hop.you .node {
		border-color: var(--color-brand);
		background: var(--color-brand);
	}
	.hop.quiet .node {
		border-color: var(--color-amber);
	}
	.hop.next .node {
		border-color: var(--color-brand);
		animation: ping 0.8s ease-in-out infinite;
	}
	@keyframes ping {
		50% {
			box-shadow: 0 0 0 5px color-mix(in srgb, var(--color-brand) 25%, transparent);
		}
	}
	.hname {
		flex: 1;
		min-width: 0;
		font-weight: 650;
		color: var(--color-ink);
	}
	.hname small {
		margin-left: 4px;
		font-size: 10.5px;
		font-weight: 500;
		color: var(--color-faint);
	}
	.hname.faint {
		font-weight: 500;
		font-style: italic;
		color: var(--color-faint);
	}
	.hop.server .hname {
		color: var(--color-brand);
	}
	.hms {
		flex: none;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.quiet {
		flex: none;
		font-size: 10.5px;
		font-style: normal;
		font-weight: 700;
		color: var(--color-amber);
	}

	@media (prefers-reduced-motion: reduce) {
		.hop.next .node {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
		.mrow {
			font-size: 13px;
		}
		.tbody {
			font-size: 12.5px;
			height: 190px;
		}
		.hop {
			font-size: 13px;
		}
	}
</style>
