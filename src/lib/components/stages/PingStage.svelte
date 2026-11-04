<script lang="ts">
	// Guided ping and traceroute lesson. Above, the road from your laptop to nimbus.com, below, a
	// terminal. While Nim tells the story the stage types ping and then traceroute by itself and
	// the road lights up. On the last beat the terminal is the learner's, for one optional try.
	import { onMount, untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { PingText } from '$lib/chapters/network/ping/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as PingText);

	const STEP_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6];
	const last = $derived(beat >= tx.intro.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const beatStep = $derived(last ? 6 : STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)]);
	const step = $derived(peek ?? beatStep);

	// ---- The road (real looking addresses and times, not copy) ----
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
	const NODE_X = (i: number) => 22 + i * 59.33; // 0 is your laptop, 1..6 the hops

	let revealed = $state(0); // hops traceroute has reached
	let pinging = $state(false);

	// ---- Terminal ----
	type Ln = { tone: 'cmd' | 'out' | 'ok' | 'err' | 'muted'; text: string; mark?: 'time' | 'stars' };
	let lines = $state<Ln[]>([]);
	let typing = $state<string | null>(null); // the command being typed by the stage
	let input = $state('');
	let busy = $state(false);
	let inputEl = $state<HTMLInputElement | null>(null);
	let bodyEl = $state<HTMLDivElement | null>(null);
	const PROMPT = 'nim@laptop ~ %';

	let reducedCache: boolean | null = null;
	const isReduced = () =>
		(reducedCache ??=
			typeof window !== 'undefined' &&
			(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false));
	let timers: ReturnType<typeof setTimeout>[] = [];
	function stop() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, isReduced() ? 0 : ms));

	type Out = Ln & { gap: number; then?: () => void };
	function pingOut(ip: string, name: string, base: number, ttl: number, jitter: boolean): Out[] {
		const fixed = [0.1, -0.3, 0.4, -0.1];
		const times = fixed.map((d) =>
			jitter ? Math.round((base + (Math.random() - 0.5) * 1.4) * 10) / 10 : base + d
		);
		const out: Out[] = [{ tone: 'out', text: `PING ${name} (${ip}): 56 data bytes`, gap: 200 }];
		times.forEach((ms, i) =>
			out.push({
				tone: 'ok',
				text: `64 bytes from ${ip}: icmp_seq=${i} ttl=${ttl} time=${ms.toFixed(1)} ms`,
				gap: i === 0 ? 500 : 750,
				mark: 'time'
			})
		);
		const min = Math.min(...times).toFixed(1);
		const max = Math.max(...times).toFixed(1);
		const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
		out.push({ tone: 'out', text: '4 packets transmitted, 4 received, 0% packet loss', gap: 300 });
		out.push({ tone: 'out', text: `round trip min/avg/max = ${min}/${avg}/${max} ms`, gap: 80 });
		return out;
	}
	function traceOut(): Out[] {
		const out: Out[] = [
			{ tone: 'out', text: `traceroute to nimbus.com (${SERVER_IP}), 30 hops max`, gap: 200 }
		];
		HOPS.forEach((h, i) =>
			out.push({
				tone: h.ip ? 'ok' : 'err',
				text: h.ip ? ` ${i + 1}  ${h.ip}  ${h.ms.toFixed(1)} ms` : ` ${i + 1}  * * *`,
				gap: h.ip ? 650 : 1200,
				mark: h.ip ? undefined : 'stars',
				then: () => (revealed = i + 1)
			})
		);
		out.push({ tone: 'muted', text: tx.hintStars, gap: 150 });
		return out;
	}

	// Print lines one by one, like a command waiting for each reply.
	function stream(out: Out[], end?: () => void) {
		busy = true;
		let at = 0;
		for (const o of out) {
			at += o.gap;
			later(at, () => {
				lines.push({ tone: o.tone, text: o.text, mark: o.mark });
				o.then?.();
			});
		}
		later(at + 80, () => {
			busy = false;
			end?.();
		});
	}

	// The stage types a command by itself, then runs it.
	function autoType(cmd: string, run: () => void) {
		if (isReduced()) {
			lines.push({ tone: 'cmd', text: cmd });
			run();
			return;
		}
		busy = true;
		typing = '';
		[...cmd].forEach((_, n) => later(400 + n * 55, () => (typing = cmd.slice(0, n + 1))));
		later(400 + cmd.length * 55 + 350, () => {
			typing = null;
			lines.push({ tone: 'cmd', text: cmd });
			run();
		});
	}

	// ---- The guided demo follows the beats ----
	type Block = 'none' | 'ping' | 'trace' | 'play';
	const block = $derived<Block>(
		last ? 'play' : beatStep === 0 ? 'none' : beatStep <= 3 ? 'ping' : 'trace'
	);
	let shownBlock: Block | null = null;
	$effect(() => {
		const b = block;
		if (b === shownBlock) return;
		shownBlock = b;
		untrack(() => playBlock(b));
	});
	function playBlock(b: Block) {
		stop();
		busy = false;
		typing = null;
		pinging = false;
		if (b === 'none') {
			lines = [{ tone: 'muted', text: tx.demoHint }];
			revealed = 0;
		} else if (b === 'ping') {
			lines = [];
			revealed = 0;
			autoType('ping -c 4 nimbus.com', () => {
				pinging = true;
				stream(pingOut(SERVER_IP, 'nimbus.com', 24, 52, false));
			});
		} else if (b === 'trace') {
			lines = [];
			revealed = 0;
			autoType('traceroute nimbus.com', () => stream(traceOut()));
		} else {
			lines = [{ tone: 'muted', text: tx.termHint }];
			revealed = HOPS.length;
		}
	}
	$effect(() => {
		void lines.length;
		void typing;
		if (bodyEl) bodyEl.scrollTop = bodyEl.scrollHeight;
	});

	// ---- The learner's optional try ----
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

	function run(raw: string) {
		const line = raw.trim();
		if (!line) return;
		lines.push({ tone: 'cmd', text: line });
		const words = line.split(/\s+/);
		const cmd = words[0].toLowerCase();
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
			lines = [];
			return;
		}
		if (cmd !== 'ping' && cmd !== 'traceroute' && cmd !== 'tracert') {
			lines.push({ tone: 'err', text: `zsh: command not found: ${words[0]}` });
			const near = ['ping', 'traceroute', 'tracert'].find((k) => lev(cmd, k) <= 2);
			lines.push({
				tone: 'muted',
				text: near ? tx.didYouMean.replace('{word}', near) : tx.hintUnknownCmd
			});
			onstate?.('error');
			return;
		}
		if (!host) {
			lines.push({ tone: 'err', text: `usage: ${cmd} <host>` });
			lines.push({ tone: 'muted', text: tx.hintNeedHost });
			onstate?.('error');
			return;
		}
		const t = resolve(host);
		if (t === 'unknown') {
			lines.push({ tone: 'err', text: `${cmd}: cannot resolve ${host}: Unknown host` });
			if (lev(host.toLowerCase(), 'nimbus.com') <= 3)
				lines.push({ tone: 'muted', text: tx.didYouMean.replace('{word}', 'nimbus.com') });
			onstate?.('unknown');
			return;
		}
		if (cmd === 'ping') {
			if (t === 'silent') {
				const out: Out[] = [
					{ tone: 'out', text: `PING ${host} (${host}): 56 data bytes`, gap: 150 }
				];
				for (let i = 0; i < 3; i++)
					out.push({ tone: 'err', text: `Request timeout for icmp_seq ${i}`, gap: 800 });
				out.push({ tone: 'muted', text: tx.hintTimeout, gap: 150 });
				return stream(out);
			}
			const server = t === 'server';
			pinging = server;
			stream(
				pingOut(
					server ? SERVER_IP : ROUTER_IP,
					server ? 'nimbus.com' : ROUTER_IP,
					server ? 24 : 1.9,
					server ? 52 : 64,
					true
				),
				() => {
					pinging = false;
					onstate?.(server ? 'ping' : 'pingRouter');
				}
			);
			return;
		}
		if (t !== 'server') {
			const out: Out[] = [
				{ tone: 'out', text: `traceroute to ${host} (${host}), 30 hops max`, gap: 150 }
			];
			if (t === 'router') out.push({ tone: 'ok', text: ` 1  ${ROUTER_IP}  1.9 ms`, gap: 500 });
			else {
				out.push({ tone: 'ok', text: ` 1  ${ROUTER_IP}  1.9 ms`, gap: 500 });
				out.push({ tone: 'err', text: ' 2  * * *', gap: 1000 });
				out.push({ tone: 'muted', text: tx.hintTimeout, gap: 100 });
			}
			return stream(out);
		}
		revealed = 0;
		stream(traceOut(), () => onstate?.('trace'));
	}

	function submit(e: Event) {
		e.preventDefault();
		if (!last || busy) return;
		const v = input;
		input = '';
		run(v);
	}
	function suggest(cmd: string) {
		if (!last || busy) return;
		input = '';
		run(cmd);
		inputEl?.focus();
	}

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
		return stop;
	});

	const showHops = $derived(step >= 3);
	// node 0 is your laptop and always lit, the server lights while ping gets replies
	const lit = (i: number) =>
		i === 0 || i <= revealed || (i === HOPS.length && (block === 'ping' || pinging));
	const marked = (l: Ln) => (l.mark === 'time' && step === 2) || (l.mark === 'stars' && step === 5);
</script>

{#snippet road()}
	<svg viewBox="0 0 400 100" class="w-full" role="img" aria-label={tx.title}>
		<line x1={NODE_X(0)} y1="50" x2={NODE_X(6)} y2="50" class="road" />
		{#each [0, 1, 2, 3, 4, 5, 6] as i (i)}
			{@const x = NODE_X(i)}
			{@const hop = i > 0 ? HOPS[i - 1] : null}
			{@const end = i === 0 || i === 6}
			{@const on = lit(i)}
			{@const quiet = hop !== null && hop.ip === null && i <= revealed}
			<g class="node" class:hide={!end && !showHops} transform="translate({x} 50)">
				{#if i === 0}
					<rect x="-13" y="-12" width="26" height="17" rx="2.5" class="dev" class:on />
					<path d="M-16 6 h32 l-2.5 4 h-27 z" class="dev" class:on />
				{:else if i === 6}
					<rect x="-10" y="-15" width="20" height="30" rx="3" class="rack" class:on />
					<circle cx="5" cy="-7" r="1.6" class="ledr" class:on />
					<circle cx="5" cy="1" r="1.6" class="ledr" class:on />
					<circle cx="5" cy="9" r="1.6" class="ledr" class:on />
				{:else}
					<line x1="-6" y1="-6" x2="-8" y2="-14" class="ant" />
					<line x1="6" y1="-6" x2="8" y2="-14" class="ant" />
					<rect x="-12" y="-6" width="24" height="12" rx="3" class="rt" class:on class:quiet />
				{/if}
				{#if i % 2 === 0}
					<text y="34" text-anchor="middle" class="nm"
						>{i === 0 ? tx.youLabel : tx.hops[i - 1]}</text
					>
					{#if hop && i <= revealed}<text y="45" text-anchor="middle" class="ms" class:quiet
							>{hop.ip ? `${hop.ms} ms` : '* * *'}</text
						>{/if}
				{:else}
					<text y="-30" text-anchor="middle" class="nm">{tx.hops[i - 1]}</text>
					{#if hop && i <= revealed}<text y="-19" text-anchor="middle" class="ms" class:quiet
							>{hop.ip ? `${hop.ms} ms` : '* * *'}</text
						>{/if}
				{/if}
			</g>
		{/each}
		{#if pinging}
			<g class="pkt"><circle r="5" class="pk" /></g>
		{/if}
	</svg>
{/snippet}

{#snippet scene(_: number)}
	<div class="flex w-full max-w-[460px] flex-col gap-2">
		{@render road()}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="term" onclick={() => inputEl?.focus()}>
			<div class="tbar">
				<span class="dots"><i></i><i></i><i></i></span>
				<span class="thost">Terminal</span>
			</div>
			<div class="tbody" bind:this={bodyEl}>
				{#each lines as l, i (i)}
					<div class="ln {l.tone}">
						{#if l.tone === 'cmd'}<span class="pr">{PROMPT}</span>{/if}<span class:mark={marked(l)}
							>{l.text}</span
						>
					</div>
				{/each}
				{#if typing !== null}
					<div class="ln cmd">
						<span class="pr">{PROMPT}</span>{typing}<span class="cur"></span>
					</div>
				{:else if last}
					<form class="ln cmd active" onsubmit={submit}>
						<span class="pr">{PROMPT}</span>
						<input
							class="tin"
							bind:this={inputEl}
							bind:value={input}
							readonly={busy}
							spellcheck="false"
							autocapitalize="off"
							autocomplete="off"
							aria-label={tx.inputLabel}
						/>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<div class="flex max-h-full w-full flex-col items-center gap-3 overflow-y-auto pb-28 md:pb-0">
	{#if last}
		<div class="flex flex-wrap justify-center gap-2" role="group" aria-label={tx.suggestLabel}>
			{#each ['ping nimbus.com', 'traceroute nimbus.com', 'ping 192.168.1.1'] as c (c)}
				<button type="button" class="chip" disabled={busy} onclick={() => suggest(c)}>{c}</button>
			{/each}
		</div>
	{/if}
	<Guide steps={tx.steps} active={step} onselect={(i) => (peek = i)} visual={scene} />
</div>

<style>
	svg text {
		font-family: var(--font-sans);
	}
	.road {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.node {
		transition: opacity 0.5s;
	}
	.node.hide {
		opacity: 0;
	}
	.dev {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.dev.on {
		stroke: var(--color-ink);
	}
	.rack {
		fill: var(--color-faint);
	}
	.rack.on {
		fill: var(--color-ink);
	}
	.ledr {
		fill: var(--color-card);
		opacity: 0.4;
	}
	.ledr.on {
		fill: var(--color-grass);
		opacity: 1;
	}
	.ant {
		stroke: var(--color-faint);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.rt {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.5;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.rt.on {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.rt.on.quiet {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.nm {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.ms {
		font-size: 9px;
		fill: var(--color-grass);
		font-weight: 600;
	}
	.ms.quiet {
		fill: var(--color-amber);
	}
	.pk {
		fill: var(--color-brand);
	}
	/* the echo request flies to the server and the reply flies back */
	.pkt {
		animation: echo 1.6s ease-in-out infinite;
	}
	@keyframes echo {
		0% {
			transform: translate(22px, 50px);
		}
		50% {
			transform: translate(378px, 50px);
		}
		100% {
			transform: translate(22px, 50px);
		}
	}
	.term {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.22);
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
		height: 178px;
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
	.mark {
		border-radius: 3px;
		background: rgba(224, 182, 91, 0.22);
		box-shadow: 0 0 0 2px rgba(224, 182, 91, 0.22);
	}
	.pr {
		color: #5bbd84;
		font-weight: 600;
		margin-right: 0.6ch;
	}
	.cur {
		display: inline-block;
		width: 7px;
		height: 13px;
		margin-left: 1px;
		vertical-align: -2px;
		background: #6fd39a;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
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
	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	@media (max-width: 767px) {
		.tbody {
			height: 150px;
			font-size: 10.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pkt {
			animation: none;
			transform: translate(200px, 50px);
		}
		.cur {
			animation: none;
		}
		.node,
		.rt,
		.chip {
			transition: none;
		}
	}
</style>
