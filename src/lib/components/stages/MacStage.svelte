<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { MacText } from '$lib/chapters/network/mac/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as MacText);

	type Kind = 'laptop' | 'printer' | 'tv' | 'phone';
	type Dev = { key: string; kind: Kind; ip: string; mac: string; x: number; y: number };
	const YOU: Dev = {
		key: 'you',
		kind: 'laptop',
		ip: '192.168.1.10',
		mac: '3C:22:FB:1A:0B:7E',
		x: 50,
		y: 16
	};
	const OTHERS: Dev[] = [
		{ key: 'printer', kind: 'printer', ip: '192.168.1.20', mac: '00:1B:A9:4C:22:10', x: 24, y: 52 },
		{ key: 'tv', kind: 'tv', ip: '192.168.1.30', mac: 'A4:77:33:9E:51:C2', x: 76, y: 52 },
		{ key: 'phone', kind: 'phone', ip: '192.168.1.40', mac: 'F0:18:98:6D:2A:04', x: 24, y: 83 },
		{ key: 'laptop', kind: 'laptop', ip: '192.168.1.50', mac: '8C:85:90:3E:C7:11', x: 76, y: 83 }
	];
	const PRINTER = OTHERS[0];
	const GHOST_IP = '192.168.1.99';

	const known = new SvelteMap<string, string>();
	let asking = $state(''); // the IP currently being asked about
	let phase = $state<'idle' | 'shout' | 'heard' | 'reply' | 'print'>('idle');
	let note = $state('');
	let printed = $state(false);
	let flashIp = $state('');
	let timers: ReturnType<typeof setTimeout>[] = [];
	let completed = $state(false);

	const busy = $derived(phase !== 'idle');
	const owner = $derived(OTHERS.find((d) => d.ip === asking));

	function speed() {
		const r =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		return r ? 0.25 : 1;
	}
	function later(ms: number, fn: () => void) {
		timers.push(setTimeout(fn, ms * speed()));
	}

	function ask(ip: string) {
		if (busy) return;
		if (known.has(ip)) {
			flashIp = ip;
			note = tx.notes.cached;
			onstate?.('cached');
			later(1200, () => (flashIp = ''));
			return;
		}
		asking = ip;
		phase = 'shout';
		note = tx.notes.shouting;
		later(900, () => {
			phase = 'heard';
			note = OTHERS.some((d) => d.ip === ip) ? tx.notes.answered : tx.notes.nobody;
		});
		const dev = OTHERS.find((d) => d.ip === ip);
		if (!dev) {
			later(2200, () => {
				phase = 'idle';
				asking = '';
				onstate?.('nobody');
			});
			return;
		}
		later(1700, () => (phase = 'reply'));
		later(2600, () => {
			known.set(dev.ip, dev.mac);
			flashIp = dev.ip;
			phase = 'idle';
			asking = '';
			onstate?.(dev.key === 'printer' ? 'reply' : 'tv');
			later(1200, () => (flashIp = ''));
		});
	}

	function print() {
		if (busy || !known.has(PRINTER.ip)) return;
		phase = 'print';
		printed = false;
		note = tx.notes.printing;
		later(1000, () => {
			phase = 'idle';
			printed = true;
			note = tx.notes.printed;
			onstate?.('print');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		});
	}

	const shown = $derived(note || tx.notes.idle);
	const fill = (s: string, ip: string) => s.replace('{ip}', ip);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet card(d: Dev, label: string)}
	<div class="dev" class:me={d.key === 'you'} style="left:{d.x}%;top:{d.y}%">
		{#if d.key !== 'you' && asking && (phase === 'shout' || phase === 'heard' || phase === 'reply')}
			{#if phase === 'shout'}
				<span class="bub q">?</span>
			{:else if d.ip === asking}
				<span class="bub yes">{tx.itsMe}</span>
			{:else}
				<span class="bub no">{tx.notMe}</span>
			{/if}
		{/if}
		{#if d.key === 'printer' && printed}
			<span class="bub yes">{tx.printed}</span>
		{/if}
		<Device kind={d.kind} size={d.key === 'you' ? 46 : 36} />
		<span class="dname">{label}</span>
		<span class="addr"><i>{tx.ipWord}</i>{d.ip}</span>
		<span class="addr mac"><i>{tx.macWord}</i>{d.mac}</span>
	</div>
{/snippet}

<div class="wrap">
	<!-- actions up top, clear of Nim -->
	<div class="btns">
		{#if !known.has(PRINTER.ip)}
			<CallToActionButton onclick={() => ask(PRINTER.ip)} disabled={busy}>
				{fill(tx.askBtn, PRINTER.ip)}
			</CallToActionButton>
		{:else if !completed || phase === 'print'}
			<CallToActionButton onclick={print} disabled={busy}>
				{tx.printBtn}
			</CallToActionButton>
		{:else}
			<span class="more">{tx.moreLabel}</span>
			<div class="chips">
				<button type="button" class="chip" disabled={busy} onclick={() => ask('192.168.1.30')}
					>{fill(tx.askTv, '192.168.1.30')}</button
				>
				<button type="button" class="chip" disabled={busy} onclick={() => ask(GHOST_IP)}
					>{fill(tx.askNobody, GHOST_IP)}</button
				>
				<button type="button" class="chip" disabled={busy} onclick={() => ask(PRINTER.ip)}
					>{fill(tx.askTv, PRINTER.ip)}</button
				>
				<button type="button" class="chip" disabled={busy} onclick={print}>{tx.printBtn}</button>
			</div>
		{/if}
	</div>

	<div class="room">
		<span class="rlabel">{tx.roomLabel}</span>

		<!-- the broadcast, a ring that washes over the whole room -->
		{#if phase === 'shout'}
			<span class="ring" style="left:{YOU.x}%;top:{YOU.y}%"></span>
		{/if}
		{#if asking && phase !== 'reply'}
			<span class="shout">{fill(tx.shout, asking)}</span>
		{/if}

		{@render card(YOU, tx.youLabel)}
		{#each OTHERS as d (d.key)}
			{@render card(d, tx.names[d.key as keyof MacText['names']])}
		{/each}

		<!-- the answer travels back, and the print job travels to one MAC only -->
		{#if phase === 'reply' && owner}
			<span class="frame back" style="--fx:{owner.x}%;--fy:{owner.y}%;--tx:{YOU.x}%;--ty:{YOU.y}%">
				{owner.mac}
			</span>
		{/if}
		{#if phase === 'print'}
			<span
				class="frame job"
				style="--fx:{YOU.x}%;--fy:{YOU.y}%;--tx:{PRINTER.x}%;--ty:{PRINTER.y}%"
			>
				nimbus.pdf <small>{tx.frameLabel} {PRINTER.mac}</small>
			</span>
		{/if}
	</div>

	<p class="note">{shown}</p>

	<!-- what the laptop remembers -->
	<div class="table">
		<b>{tx.tableTitle}</b>
		{#if known.size === 0}
			<span class="empty">{tx.tableEmpty}</span>
		{:else}
			<div class="row head"><span>{tx.ipHead}</span><span>{tx.macHead}</span></div>
			{#each [...known] as [ip, mac] (ip)}
				<div class="row" class:flash={flashIp === ip}>
					<span>{ip}</span><span>{mac}</span>
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
		gap: 10px;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 12px;
	}
	.btns {
		display: flex;
		min-height: 46px;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.more {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		max-width: 360px;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 600;
		transition: border-color 0.2s;
	}
	.chip:enabled:hover {
		border-color: var(--color-ink);
	}
	.chip:disabled {
		opacity: 0.5;
	}

	.room {
		position: relative;
		width: min(94vw, 380px);
		height: 300px;
		overflow: hidden;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.rlabel {
		position: absolute;
		top: 8px;
		left: 12px;
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.dev {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		transform: translate(-50%, -50%);
		z-index: 2;
	}
	.dname {
		margin-top: 2px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.me .dname {
		color: var(--color-brand);
	}
	.addr {
		display: flex;
		gap: 3px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 8.5px;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.addr i {
		font-style: normal;
		font-weight: 800;
		color: var(--color-faint);
	}
	.addr.mac {
		font-size: 7.5px;
		color: var(--color-muted);
	}
	.bub {
		position: absolute;
		bottom: calc(100% + 2px);
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		padding: 2px 7px;
		font-size: 9px;
		font-weight: 800;
		white-space: nowrap;
		animation: pop 0.25s ease;
	}
	.bub.q {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.bub.yes {
		background: var(--color-grass);
		color: #fff;
	}
	.bub.no {
		background: var(--color-paper);
		color: var(--color-faint);
		border: 1px solid var(--color-line);
	}
	.ring {
		position: absolute;
		width: 760px;
		height: 760px;
		border-radius: 50%;
		border: 3px solid var(--color-amber);
		background: color-mix(in srgb, var(--color-amber) 10%, transparent);
		transform: translate(-50%, -50%) scale(0);
		animation: ring 0.9s ease-out forwards;
		pointer-events: none;
		z-index: 1;
	}
	@keyframes ring {
		from {
			transform: translate(-50%, -50%) scale(0.04);
			opacity: 1;
		}
		to {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0;
		}
	}
	.shout {
		position: absolute;
		top: 31%;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: var(--color-amber);
		color: #fff;
		padding: 4px 11px;
		font-size: 11px;
		font-weight: 800;
		white-space: nowrap;
		z-index: 3;
		animation: pop 0.25s ease;
	}
	.frame {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 8px;
		padding: 3px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		font-weight: 700;
		white-space: nowrap;
		transform: translate(-50%, -50%);
		z-index: 4;
		animation: fly 0.9s ease-in-out forwards;
		box-shadow: 0 4px 12px rgba(22, 40, 60, 0.18);
	}
	.frame small {
		font-size: 7.5px;
		font-weight: 600;
		opacity: 0.85;
	}
	.frame.back {
		background: var(--color-grass);
		color: #fff;
	}
	.frame.job {
		background: var(--color-brand);
		color: #fff;
	}
	@keyframes fly {
		from {
			left: var(--fx);
			top: var(--fy);
		}
		to {
			left: var(--tx);
			top: var(--ty);
		}
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateX(-50%) scale(0.5);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) scale(1);
		}
	}

	.note {
		min-height: 1.4em;
		max-width: 360px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.table {
		display: flex;
		width: min(94vw, 300px);
		flex-direction: column;
		gap: 3px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.table b {
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
		grid-template-columns: 1fr 1.4fr;
		gap: 8px;
		border-radius: 6px;
		padding: 2px 4px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		color: var(--color-ink);
		transition: background 0.3s;
	}
	.row.head {
		font-family: inherit;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.row.flash {
		background: var(--color-grass-soft);
	}

	@media (prefers-reduced-motion: reduce) {
		.ring,
		.bub,
		.shout {
			animation-duration: 0.01s;
		}
		.frame {
			animation-duration: 0.25s;
		}
	}
	@media (min-width: 768px) {
		.room {
			width: 480px;
			height: 320px;
		}
		.dname {
			font-size: 11.5px;
		}
		.addr {
			font-size: 10px;
		}
		.addr.mac {
			font-size: 9px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.table {
			width: 340px;
		}
	}
</style>
