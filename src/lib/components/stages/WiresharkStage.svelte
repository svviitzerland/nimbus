<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { WiresharkText } from '$lib/chapters/network/wireshark/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as WiresharkText);

	// ---- A real looking capture of one page load (data, not copy) ----
	const LAPTOP = { ip: '192.168.1.23', mac: '3c:22:fb:9a:10:4e' };
	const ROUTER = { ip: '192.168.1.1', mac: 'a4:91:b1:0c:22:7f' };
	const SERVER_IP = '76.76.21.21';
	const CIPHER = '17 03 03 01 8f a2 9c 4e 0b 71 e3 5d c8 26 9a f0 44 b7 1e 63';

	type Kind = 'dns' | 'tcp' | 'tls' | 'data';
	type Pkt = {
		kind: Kind;
		proto: string;
		out: boolean; // sent by your laptop, or coming back to it
		peer: string; // the other end's IP
		size: number;
		info: string;
		l4: string;
		l7: string | null;
	};
	const PKTS: Pkt[] = [
		{
			kind: 'dns',
			proto: 'DNS',
			out: true,
			peer: ROUTER.ip,
			size: 72,
			info: 'Standard query A nimbus.com',
			l4: 'UDP, Src Port 52114, Dst Port 53',
			l7: 'DNS, Standard query A nimbus.com'
		},
		{
			kind: 'dns',
			proto: 'DNS',
			out: false,
			peer: ROUTER.ip,
			size: 88,
			info: 'Standard query response A 76.76.21.21',
			l4: 'UDP, Src Port 53, Dst Port 52114',
			l7: 'DNS, response nimbus.com A 76.76.21.21'
		},
		{
			kind: 'tcp',
			proto: 'TCP',
			out: true,
			peer: SERVER_IP,
			size: 78,
			info: '52116 → 443 [SYN]',
			l4: 'TCP, Src Port 52116, Dst Port 443, Flags [SYN]',
			l7: null
		},
		{
			kind: 'tcp',
			proto: 'TCP',
			out: false,
			peer: SERVER_IP,
			size: 74,
			info: '443 → 52116 [SYN, ACK]',
			l4: 'TCP, Src Port 443, Dst Port 52116, Flags [SYN, ACK]',
			l7: null
		},
		{
			kind: 'tcp',
			proto: 'TCP',
			out: true,
			peer: SERVER_IP,
			size: 66,
			info: '52116 → 443 [ACK]',
			l4: 'TCP, Src Port 52116, Dst Port 443, Flags [ACK]',
			l7: null
		},
		{
			kind: 'tls',
			proto: 'TLSv1.3',
			out: true,
			peer: SERVER_IP,
			size: 583,
			info: 'Client Hello (SNI=nimbus.com)',
			l4: 'TCP, Src Port 52116, Dst Port 443',
			l7: 'TLSv1.3, Client Hello, SNI nimbus.com'
		},
		{
			kind: 'tls',
			proto: 'TLSv1.3',
			out: false,
			peer: SERVER_IP,
			size: 1514,
			info: 'Server Hello, Certificate',
			l4: 'TCP, Src Port 443, Dst Port 52116',
			l7: 'TLSv1.3, Server Hello, Certificate nimbus.com'
		},
		{
			kind: 'data',
			proto: 'TLSv1.3',
			out: true,
			peer: SERVER_IP,
			size: 410,
			info: 'Application Data',
			l4: 'TCP, Src Port 52116, Dst Port 443',
			l7: 'TLSv1.3, Application Data (encrypted)'
		},
		{
			kind: 'data',
			proto: 'TLSv1.3',
			out: false,
			peer: SERVER_IP,
			size: 1514,
			info: 'Application Data',
			l4: 'TCP, Src Port 443, Dst Port 52116',
			l7: 'TLSv1.3, Application Data (encrypted)'
		}
	];

	// Real display filters. Note that "tcp" also matches TLS, since TLS rides on TCP.
	type Filter = 'all' | 'dns' | 'tcp' | 'tls';
	const FILTERS: Filter[] = ['all', 'dns', 'tcp', 'tls'];
	const MATCH: Record<Filter, Kind[]> = {
		all: ['dns', 'tcp', 'tls', 'data'],
		dns: ['dns'],
		tcp: ['tcp', 'tls', 'data'],
		tls: ['tls', 'data']
	};

	let count = $state(0); // how many packets have arrived so far
	let capturing = $state(false);
	let filter = $state<Filter>('all');
	let picked = $state<number | null>(null);
	const opened = new SvelteSet<Kind>();
	let done = false;

	const rows = $derived(
		PKTS.slice(0, count)
			.map((p, i) => ({ p, i }))
			.filter(({ p }) => MATCH[filter].includes(p.kind))
	);

	let timers: ReturnType<typeof setTimeout>[] = [];
	$effect(() => () => timers.forEach(clearTimeout));
	const reduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	function capture() {
		if (capturing) return;
		timers.forEach(clearTimeout);
		timers = [];
		count = 0;
		picked = null;
		capturing = true;
		const gap = reduced ? 30 : 280;
		PKTS.forEach((_, i) => timers.push(setTimeout(() => (count = i + 1), 200 + i * gap)));
		timers.push(
			setTimeout(
				() => {
					capturing = false;
					onstate?.('capture');
				},
				260 + PKTS.length * gap
			)
		);
	}

	function open(i: number) {
		picked = i;
		const k = PKTS[i].kind;
		opened.add(k);
		onstate?.(k === 'tls' ? 'hello' : k);
		if (!done && opened.has('dns') && opened.has('tcp') && opened.has('data')) {
			done = true;
			oncomplete?.();
		}
	}

	type Layer = { n: 1 | 2 | 3 | 4 | 7; line: string };
	function layersOf(i: number): Layer[] {
		const p = PKTS[i];
		const src = p.out ? LAPTOP.ip : p.peer;
		const dst = p.out ? p.peer : LAPTOP.ip;
		const smac = p.out ? LAPTOP.mac : ROUTER.mac;
		const dmac = p.out ? ROUTER.mac : LAPTOP.mac;
		const out: Layer[] = [
			{ n: 1, line: `Frame ${i + 1}, ${p.size} bytes on wire` },
			{ n: 2, line: `Ethernet II, Src ${smac}, Dst ${dmac}` },
			{ n: 3, line: `IPv4, Src ${src}, Dst ${dst}` },
			{ n: 4, line: p.l4 }
		];
		if (p.l7) out.push({ n: 7, line: p.l7 });
		return out;
	}
	const detail = $derived(picked === null ? [] : layersOf(picked));
	const pickedPkt = $derived(picked === null ? null : PKTS[picked]);

	const status = $derived(
		capturing ? tx.capturing : count ? tx.captured.replace('{n}', String(count)) : tx.idleHint
	);
</script>

<div class="wrap">
	<div class="top">
		<button type="button" class="cta" disabled={capturing} onclick={capture}>
			<span class="rec" class:on={capturing}></span>
			{count && !capturing ? tx.againBtn : tx.captureBtn}
		</button>
		<span class="status">{status}</span>
	</div>

	<div class="shark">
		<div class="filters">
			<span class="flabel">{tx.filterLabel}</span>
			{#each FILTERS as f (f)}
				<button
					type="button"
					class="fchip"
					class:sel={filter === f}
					aria-pressed={filter === f}
					onclick={() => (filter = f)}>{f === 'all' ? tx.filterAll : f}</button
				>
			{/each}
		</div>

		<div class="list">
			<div class="lhead" aria-hidden="true">
				<span class="c-no">{tx.colNo}</span>
				<span class="c-proto">{tx.colProto}</span>
				<span class="c-info">{tx.colInfo}</span>
			</div>
			{#each rows as { p, i } (i)}
				<button
					type="button"
					aria-pressed={picked === i}
					class="prow {p.kind}"
					class:sel={picked === i}
					onclick={() => open(i)}
				>
					<span class="c-no">{i + 1}</span>
					<span class="c-proto">{p.proto}</span>
					<span class="c-info">
						{p.info}
						<small>{p.out ? LAPTOP.ip : p.peer} → {p.out ? p.peer : LAPTOP.ip}</small>
					</span>
				</button>
			{:else}
				<div class="empty">{tx.idleHint}</div>
			{/each}
		</div>
	</div>

	<div class="detail">
		{#if pickedPkt && picked !== null}
			{#key picked}
				<p class="pnote">{tx.packetNotes[picked]}</p>
				<ol class="layers">
					{#each detail as l, j (l.n)}
						<li class="layer l{l.n}" style="animation-delay:{j * 70}ms">
							<span class="badge"
								>{tx.layerLabel.replace('{n}', String(l.n))}
								<b>{tx.layerNames[l.n]}</b></span
							>
							<code>{l.line}</code>
							{#if l.n === 7 && pickedPkt.kind === 'data'}
								<code class="cipher">{CIPHER}</code>
							{/if}
						</li>
					{/each}
				</ol>
			{/key}
		{:else}
			<p class="hint">{count ? tx.pickHint : ''}</p>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 410px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}
	.top {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.cta {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.7;
	}
	.rec {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #e06a5b;
	}
	.rec.on {
		animation: blink 0.9s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}
	.status {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.shark {
		width: 100%;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		overflow: hidden;
	}
	.filters {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 7px 9px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
	}
	.flabel {
		margin-right: 2px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.fchip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		padding: 2px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		font-weight: 700;
	}
	.fchip.sel {
		border-color: var(--color-brand);
		background: var(--color-brand);
		color: #fff;
	}
	.list {
		display: flex;
		flex-direction: column;
		min-height: 120px;
		max-height: 210px;
		overflow-y: auto;
	}
	.lhead,
	.prow {
		display: grid;
		grid-template-columns: 26px 62px 1fr;
		gap: 6px;
		align-items: start;
		padding: 4px 9px;
		text-align: left;
	}
	.lhead {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
		border-bottom: 1px solid var(--color-line);
	}
	.prow {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		line-height: 1.35;
		color: var(--color-ink);
		border-bottom: 1px solid color-mix(in srgb, var(--color-line) 60%, transparent);
		animation: arrive 0.25s ease;
		transition: box-shadow 0.15s ease;
	}
	.prow.dns {
		background: var(--color-brand-soft);
	}
	.prow.tcp {
		background: var(--color-paper);
	}
	.prow.tls,
	.prow.data {
		background: var(--color-grass-soft);
	}
	.prow.sel {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.prow.sel small {
		color: color-mix(in srgb, var(--color-paper) 70%, transparent);
	}
	.prow:hover:not(.sel) {
		box-shadow: inset 3px 0 0 var(--color-brand);
	}
	.c-no {
		font-variant-numeric: tabular-nums;
		color: inherit;
		opacity: 0.7;
	}
	.c-proto {
		font-weight: 700;
	}
	.c-info small {
		display: block;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(-3px);
		}
	}
	.empty {
		padding: 30px 10px;
		text-align: center;
		font-size: 12px;
		font-style: italic;
		color: var(--color-faint);
	}

	.detail {
		width: 100%;
		min-height: 60px;
	}
	.hint {
		margin: 6px 0 0;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.pnote {
		margin: 0 0 6px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 650;
		color: var(--color-ink);
	}
	.layers {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.layer {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-radius: 9px;
		/* each layer gets a soft tint of its colour instead of a thick side stripe */
		border: 1px solid color-mix(in srgb, var(--lc, var(--color-line)) 35%, var(--color-line));
		background: color-mix(in srgb, var(--lc, transparent) 9%, var(--color-card));
		padding: 5px 9px;
		animation: unwrap 0.3s ease both;
	}
	.layer.l1 {
		--lc: var(--color-faint);
	}
	.layer.l2 {
		--lc: var(--color-muted);
	}
	.layer.l3 {
		--lc: var(--color-amber);
	}
	.layer.l4 {
		--lc: var(--color-brand);
	}
	.layer.l7 {
		--lc: var(--color-grass);
	}
	@keyframes unwrap {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
	}
	.badge {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.badge b {
		margin-left: 3px;
		color: var(--color-ink);
	}
	.layer code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--color-muted);
		word-break: break-word;
	}
	.layer code.cipher {
		color: var(--color-danger);
		letter-spacing: 0.02em;
	}

	@media (prefers-reduced-motion: reduce) {
		.rec.on {
			animation: none;
		}
		.prow,
		.layer {
			animation-duration: 0.01s;
			animation-delay: 0s !important;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 12px;
		}
		.lhead,
		.prow {
			grid-template-columns: 30px 70px 1fr;
		}
		.prow,
		.layer code {
			font-size: 12px;
		}
		.list {
			max-height: 240px;
		}
	}
</style>
