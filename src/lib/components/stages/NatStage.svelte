<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { NatText } from '$lib/chapters/network/nat/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as NatText);

	const PUBLIC_IP = '203.0.113.5';
	// Phones A and B pick the same inside port on purpose, the router keeps them apart outside.
	const PHONES = [
		{ name: 'A', ip: '192.168.1.10', port: 51000, x: 17 },
		{ name: 'B', ip: '192.168.1.11', port: 51000, x: 50 },
		{ name: 'C', ip: '192.168.1.12', port: 49152, x: 83 }
	];
	type Pos = { x: number; y: number };
	const ROUTER_LOW: Pos = { x: 50, y: 61 };
	const ROUTER_HIGH: Pos = { x: 50, y: 34 };
	const SERVER: Pos = { x: 50, y: 18 };
	const STRANGER: Pos = { x: 82, y: 9 };
	const nearPhone = (i: number): Pos => ({ x: Math.max(26, Math.min(74, PHONES[i].x)), y: 73 });

	type Tone = 'brand' | 'amber' | 'grass' | 'danger';
	type Pkt = {
		id: number;
		x: number;
		y: number;
		a: string;
		b: string;
		tone: Tone;
		dropped: boolean;
	};
	type Row = { phone: number; outPort: number };

	let packets = $state<Pkt[]>([]);
	let rows = $state<Row[]>([]);
	let hotRow = $state(-1);
	const busy = $state([false, false, false]);
	const loaded = $state([false, false, false]);
	let serverHit = $state(false);
	let strangerBusy = $state(false);
	let note = $state('');
	let completed = $state(false);
	let saidOut = false;
	let saidBack = false;
	let nextId = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function speed() {
		const r =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		return r ? 0.3 : 1;
	}
	const MOVE = 750;
	function later(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, ms * speed()));
	}
	function pkt(id: number) {
		return packets.find((p) => p.id === id);
	}
	function move(id: number, to: Pos) {
		const p = pkt(id);
		if (p) {
			p.x = to.x;
			p.y = to.y;
		}
	}
	function relabel(id: number, a: string, b: string, tone: Tone) {
		const p = pkt(id);
		if (p) {
			p.a = a;
			p.b = b;
			p.tone = tone;
		}
	}
	function drop(id: number) {
		packets = packets.filter((p) => p.id !== id);
	}
	const fromT = (ip: string) => tx.from.replace('{ip}', ip);
	const toT = (ip: string) => tx.to.replace('{ip}', ip);
	const portT = (n: number) => tx.port.replace('{n}', String(n));

	function send(i: number, delay = 0) {
		if (busy[i]) return;
		busy[i] = true;
		loaded[i] = false;
		const ph = PHONES[i];
		const id = ++nextId;
		let t = delay;
		later(t, () => {
			const start = nearPhone(i);
			packets.push({
				id,
				x: start.x,
				y: start.y,
				a: fromT(ph.ip),
				b: portT(ph.port),
				tone: 'brand',
				dropped: false
			});
		});
		t += 60;
		later(t, () => move(id, ROUTER_LOW));
		t += MOVE;
		later(t, () => {
			let r = rows.findIndex((x) => x.phone === i);
			if (r < 0) {
				rows.push({ phone: i, outPort: 40001 + rows.length });
				r = rows.length - 1;
			}
			hotRow = r;
			relabel(id, fromT(PUBLIC_IP), portT(rows[r].outPort), 'amber');
			note = tx.notes.rewriteOut;
			if (!saidOut) {
				saidOut = true;
				onstate?.('out');
			}
		});
		t += 500;
		later(t, () => move(id, SERVER));
		t += MOVE;
		later(t, () => {
			const r = rows.findIndex((x) => x.phone === i);
			serverHit = true;
			relabel(id, toT(PUBLIC_IP), portT(rows[r].outPort), 'grass');
			note = tx.notes.atServer;
		});
		t += 500;
		later(t, () => {
			serverHit = false;
			move(id, ROUTER_HIGH);
		});
		t += MOVE;
		later(t, () => {
			hotRow = rows.findIndex((x) => x.phone === i);
			relabel(id, toT(ph.ip), portT(ph.port), 'brand');
			note = tx.notes.rewriteBack;
		});
		t += 500;
		later(t, () => move(id, nearPhone(i)));
		t += MOVE;
		later(t, () => {
			drop(id);
			busy[i] = false;
			loaded[i] = true;
			if (loaded.every(Boolean) && !completed) {
				completed = true;
				note = tx.notes.delivered;
				onstate?.('all');
				oncomplete?.();
			} else if (!saidBack) {
				saidBack = true;
				onstate?.('back');
			}
		});
	}

	function sendAll() {
		PHONES.forEach((_, i) => send(i, i * 700));
	}

	function knock() {
		if (strangerBusy) return;
		strangerBusy = true;
		const id = ++nextId;
		packets.push({
			id,
			x: STRANGER.x,
			y: STRANGER.y,
			a: toT(PUBLIC_IP),
			b: portT(3389),
			tone: 'danger',
			dropped: false
		});
		later(60, () => move(id, ROUTER_HIGH));
		later(60 + MOVE, () => {
			const p = pkt(id);
			if (p) p.dropped = true;
			hotRow = -1;
			note = tx.notes.stranger;
			onstate?.('stranger');
		});
		later(60 + MOVE + 1400, () => {
			drop(id);
			strangerBusy = false;
		});
	}

	const shown = $derived(note || tx.notes.idle);
	const anyBusy = $derived(busy.some(Boolean));

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<!-- actions up top -->
	<div class="btns">
		<span class="olabel">{tx.openLabel}</span>
		<div class="chips">
			{#each PHONES as ph, i (ph.name)}
				<button
					type="button"
					class="chip"
					class:done={loaded[i]}
					disabled={busy[i]}
					onclick={() => send(i)}>{tx.phoneLabel.replace('{n}', ph.name)}</button
				>
			{/each}
		</div>
		<div class="ctas">
			<CallToActionButton onclick={sendAll} disabled={anyBusy}>
				{tx.allBtn}
			</CallToActionButton>
			{#if completed}
				<button type="button" class="line" onclick={knock} disabled={strangerBusy}
					>{tx.strangerBtn}</button
				>
			{/if}
		</div>
	</div>

	<div class="scene">
		<!-- the wires: phones to the router, router out to the internet -->
		<svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			{#each PHONES as ph (ph.name)}
				<line x1={ph.x} y1="82" x2="50" y2="54" />
			{/each}
			<line x1="50" y1="42" x2="50" y2="22" />
		</svg>
		<span class="zone outside">Internet</span>

		<div class="node server" class:hit={serverHit} style="left:50%;top:9%">
			<Server active={serverHit} slots={2} />
			<span class="nlabel">{tx.serverLabel}</span>
		</div>

		{#if strangerBusy}
			<div class="node stranger" style="left:{STRANGER.x}%;top:{STRANGER.y - 2}%">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="12" cy="8" r="4" fill="var(--color-danger)" />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-danger)" />
				</svg>
				<span class="nlabel">{tx.strangerLabel}</span>
			</div>
		{/if}

		<div class="node router" style="left:50%;top:48%">
			<Device kind="router" size={44} tone="var(--color-grass)" />
			<span class="nlabel">{tx.routerLabel}</span>
			<span class="pub"><i>{tx.publicLabel}</i>{PUBLIC_IP}</span>
		</div>

		{#each PHONES as ph, i (ph.name)}
			<div class="node phone" style="left:{ph.x}%;top:89%">
				{#if loaded[i]}<span class="ok">{tx.loaded}</span>{/if}
				<Device
					kind="phone"
					size={30}
					tone={loaded[i] ? 'var(--color-grass)' : 'var(--color-brand)'}
				/>
				<span class="nlabel">{tx.phoneLabel.replace('{n}', ph.name)}</span>
				<span class="priv">{ph.ip}</span>
			</div>
		{/each}

		<!-- packets on the move, their labels rewritten at the router -->
		{#each packets as p (p.id)}
			<div
				class="pkt {p.tone}"
				class:dropped={p.dropped}
				style="left:{p.x}%;top:{p.y}%;--mv:{MOVE * speed()}ms"
			>
				{#key p.a + p.b}
					<span class="plabel"><b>{p.a}</b><span>{p.b}</span></span>
				{/key}
				{#if p.dropped}<em>{tx.dropped}</em>{/if}
			</div>
		{/each}
	</div>

	<p class="note">{shown}</p>

	<!-- the router memory -->
	<div class="table">
		<b class="ttitle">{tx.tableTitle}</b>
		{#if rows.length === 0}
			<span class="empty">{tx.tableEmpty}</span>
		{:else}
			<div class="row head"><span>{tx.insideHead}</span><span>{tx.outsideHead}</span></div>
			{#each rows as r, k (r.phone)}
				<div class="row" class:hot={hotRow === k}>
					<span
						><em>{tx.phoneLabel.replace('{n}', PHONES[r.phone].name)}</em>
						{PHONES[r.phone].ip}, {portT(PHONES[r.phone].port)}</span
					>
					<span>{PUBLIC_IP}, {portT(r.outPort)}</span>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 12px;
	}
	.btns {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.olabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips,
	.ctas {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.ctas :global(.cta) {
		padding: 9px 16px;
		font-size: 13px;
	}
	.chip,
	.line {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 6px 13px;
		font-size: 12px;
		font-weight: 600;
		transition: border-color 0.2s;
	}
	.line {
		border-radius: 12px;
		padding: 9px 14px;
	}
	.chip:enabled:hover,
	.line:enabled:hover {
		border-color: var(--color-ink);
	}
	.chip:disabled,
	.line:disabled {
		opacity: 0.5;
	}
	.chip.done::after {
		content: ' ✓';
		color: var(--color-grass);
	}

	.scene {
		position: relative;
		width: min(94vw, 370px);
		height: 330px;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: linear-gradient(
			to bottom,
			var(--color-paper) 0%,
			var(--color-paper) 40%,
			var(--color-card) 40%
		);
		overflow: hidden;
	}
	.wires {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.wires line {
		stroke: var(--color-line);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
	}
	.zone {
		position: absolute;
		top: 8px;
		left: 12px;
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.node {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		transform: translate(-50%, -50%);
		z-index: 1;
	}
	.server :global(.server) {
		width: 50px;
		gap: 5px;
		padding: 6px;
		border-radius: 9px;
		transition: border-color 0.3s;
	}
	.server :global(.server .slot) {
		height: 9px;
	}
	.server.hit :global(.server) {
		border-color: var(--color-grass);
	}
	.nlabel {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.router .nlabel {
		color: var(--color-ink);
	}
	.pub,
	.priv {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		white-space: nowrap;
	}
	.pub {
		display: flex;
		gap: 4px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		padding: 1px 7px;
		font-weight: 700;
	}
	.pub i {
		font-family: inherit;
		font-style: normal;
		font-weight: 800;
		opacity: 0.8;
	}
	.priv {
		color: var(--color-brand);
	}
	.ok {
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		padding: 1px 7px;
		font-size: 8.5px;
		font-weight: 800;
		animation: pop 0.25s ease;
	}
	.pkt {
		--c: var(--color-brand);
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		transform: translate(-50%, -50%);
		border-radius: 8px;
		background: var(--c);
		color: #fff;
		padding: 3px 8px;
		box-shadow: 0 4px 12px rgba(22, 40, 60, 0.18);
		z-index: 3;
		transition:
			left var(--mv) ease-in-out,
			top var(--mv) ease-in-out,
			background 0.25s,
			opacity 0.4s;
	}
	.pkt.amber {
		--c: var(--color-amber);
	}
	.pkt.grass {
		--c: var(--color-grass);
	}
	.pkt.danger {
		--c: var(--color-danger);
	}
	.pkt.dropped {
		opacity: 0.55;
	}
	.plabel {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.2;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		white-space: nowrap;
		animation: swap 0.35s ease;
	}
	.plabel b {
		font-size: 9px;
	}
	.plabel span {
		font-size: 8.5px;
		opacity: 0.9;
	}
	.pkt em {
		margin-top: 2px;
		border-radius: 999px;
		background: #fff;
		color: var(--color-danger);
		padding: 0 6px;
		font-size: 8.5px;
		font-style: normal;
		font-weight: 800;
	}
	@keyframes swap {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.5);
		}
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.table {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		gap: 3px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.ttitle {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.empty {
		font-size: 11px;
		color: var(--color-faint);
	}
	.row {
		display: grid;
		grid-template-columns: 1.25fr 1fr;
		gap: 8px;
		border-radius: 6px;
		padding: 2px 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		color: var(--color-ink);
		transition: background 0.3s;
	}
	.row em {
		display: block;
		font-family: var(--font-sans, sans-serif);
		font-style: normal;
		font-weight: 700;
		color: var(--color-muted);
	}
	.row.head {
		font-family: inherit;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.row.hot {
		background: var(--color-amber-soft);
	}

	@media (prefers-reduced-motion: reduce) {
		.plabel,
		.ok {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 460px;
			height: 360px;
		}
		.plabel b {
			font-size: 10.5px;
		}
		.plabel span {
			font-size: 9.5px;
		}
		.nlabel {
			font-size: 11.5px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.table {
			width: 400px;
		}
		.row {
			font-size: 11px;
		}
	}
</style>
