<script lang="ts">
	import Laptop from '$lib/components/Laptop.svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { VpnText } from '$lib/chapters/network/vpn/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as VpnText);

	// The request itself, and where it seems to come from, are real looking data, not copy.
	const REQUEST = 'GET intranet.nimbus.com/payroll';
	const CAFE_IP = '36.80.12.4';
	const OFFICE_IP = '10.8.0.7';

	let vpn = $state(false);
	let flying = $state(false);
	let verdict = $state<'' | 'blocked' | 'ok'>('');
	let caught = $state<string[]>([]);
	let viaTunnel = $state(false);
	const seen = { blocked: false, through: false };
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function clear() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	$effect(() => () => clear());

	function noise() {
		const hex = '0123456789abcdef';
		const chunk = () =>
			Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join('');
		return Array.from({ length: 6 }, chunk).join(' ');
	}

	function toggle() {
		if (flying) return;
		vpn = !vpn;
		verdict = '';
		onstate?.(vpn ? 'on' : 'off');
	}

	function open() {
		if (flying) return;
		clear();
		verdict = '';
		caught = [];
		viaTunnel = vpn;
		flying = true;
		// halfway across the cafe WiFi, the snooper grabs whatever passes
		timers.push(
			setTimeout(() => {
				caught = viaTunnel ? [noise(), noise()] : [REQUEST, `from ${CAFE_IP}`];
			}, 550)
		);
		timers.push(
			setTimeout(() => {
				flying = false;
				verdict = viaTunnel ? 'ok' : 'blocked';
				const token = viaTunnel ? 'through' : 'blocked';
				if (viaTunnel) seen.through = true;
				else seen.blocked = true;
				onstate?.(token);
				if (!done && seen.blocked && seen.through) {
					done = true;
					oncomplete?.();
				}
			}, 1250)
		);
	}

	const note = $derived(
		verdict === 'ok'
			? tx.noteOk
			: verdict === 'blocked'
				? tx.noteBlocked
				: vpn
					? tx.noteOn
					: tx.noteIdle
	);
</script>

{#snippet person(color: string)}
	<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="8" r="4" fill={color} />
		<path d="M4 21a8 8 0 0 1 16 0Z" fill={color} />
	</svg>
{/snippet}

<div class="wrap">
	<div class="controls">
		<button
			type="button"
			class="switch"
			class:on={vpn}
			role="switch"
			aria-checked={vpn}
			disabled={flying}
			onclick={toggle}
		>
			<span class="sw-label">{tx.vpnLabel}</span>
			<span class="track"><span class="knob"></span></span>
			<span class="sw-state">{vpn ? tx.onLabel : tx.offLabel}</span>
		</button>
		<button type="button" class="cta" disabled={flying} onclick={open}>{tx.openBtn}</button>
	</div>

	<div class="scene">
		<div class="row">
			<div class="end">
				<div class="lap"><Laptop led={vpn ? 'ok' : 'off'} /></div>
				<b>{tx.youLabel}</b>
				<span>{tx.youSub}</span>
			</div>

			<div class="mid">
				<div class="pathbox" class:tunnel={vpn}>
					<span class="line"></span>
					{#if flying}
						<span class="packet" class:locked={viaTunnel}>
							{#if viaTunnel}
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
									<path
										d="M8 11V8a4 4 0 0 1 8 0v3"
										stroke="currentColor"
										stroke-width="2.4"
										fill="none"
									/>
								</svg>
							{:else}
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<rect
										x="3"
										y="6"
										width="18"
										height="13"
										rx="2"
										stroke="currentColor"
										stroke-width="2.2"
									/>
									<path d="m3.5 7 8.5 6 8.5-6" stroke="currentColor" stroke-width="2.2" />
								</svg>
							{/if}
						</span>
					{/if}
				</div>
				<span class="pathlabel" class:tl={vpn}>{vpn ? tx.tunnelLabel : tx.cafeWifi}</span>
				<span class="antenna"></span>
			</div>

			<div class="end">
				<div class="srv" class:ok={verdict === 'ok'} class:no={verdict === 'blocked'}>
					<Server active={verdict === 'ok'} />
				</div>
				<b>{tx.officeLabel}</b>
				<span>{tx.officeSub}</span>
				{#if verdict}
					<em class="tag" class:no={verdict === 'blocked'}
						>{verdict === 'ok' ? tx.okTag : tx.blockedTag}</em
					>
				{/if}
			</div>
		</div>

		<div class="snoop">
			<div class="who">
				{@render person('var(--color-danger)')}
				<b>{tx.snooperLabel}</b>
			</div>
			<div class="screen" class:plain={caught.length && !viaTunnel}>
				{#if caught.length}
					{#each caught as l, i (i)}<div class="cl">{l}</div>{/each}
				{:else}
					<div class="idle">{tx.snooperIdle}</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="seen">
		<span>{tx.seenAsLabel}</span>
		<b class:inside={vpn}>{vpn ? tx.seenOffice : tx.seenCafe}</b>
		<code>{vpn ? OFFICE_IP : CAFE_IP}</code>
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		width: min(94vw, 390px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 9px 14px;
		font-size: 13px;
		font-weight: 700;
		transition: border-color 0.2s ease;
	}
	.switch.on {
		border-color: var(--color-grass);
	}
	.track {
		position: relative;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.switch.on .track {
		background: var(--color-grass);
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-card);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.2s ease;
	}
	.switch.on .knob {
		transform: translateX(14px);
	}
	.sw-state {
		min-width: 3.2em;
		text-align: left;
		font-size: 12px;
		color: var(--color-muted);
	}
	.switch.on .sw-state {
		color: var(--color-grass);
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled,
	.switch:disabled {
		opacity: 0.55;
	}

	.scene {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.row {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: start;
		width: 100%;
	}
	.end {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		width: 104px;
		text-align: center;
	}
	.end b {
		margin-top: 6px;
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.end span {
		font-size: 10px;
		color: var(--color-faint);
	}
	.lap {
		height: 76px;
		display: flex;
		align-items: flex-end;
	}
	.lap :global(.shell) {
		width: 84px;
		padding: 5px 5px 0;
	}
	.lap :global(.screen) {
		height: 52px;
	}
	.lap :global(.base) {
		width: 102px;
	}
	.srv {
		height: 76px;
		display: flex;
		align-items: flex-end;
		border-radius: 12px;
		transition: filter 0.3s ease;
	}
	.srv :global(.server) {
		width: 60px;
		padding: 7px;
		gap: 6px;
		border-radius: 10px;
		border-width: 1.5px;
		transition: border-color 0.3s ease;
	}
	.srv :global(.server .slot) {
		height: 11px;
	}
	.srv.ok :global(.server) {
		border-color: var(--color-grass);
	}
	.srv.no :global(.server) {
		border-color: var(--color-danger);
	}
	.tag {
		position: absolute;
		top: -6px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		font-size: 9.5px;
		font-style: normal;
		font-weight: 800;
		padding: 3px 9px;
		animation: pop 0.25s ease;
	}
	.tag.no {
		background: var(--color-danger);
	}
	@keyframes pop {
		from {
			transform: translateX(-50%) scale(0.5);
			opacity: 0;
		}
	}

	.mid {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 30px;
		min-width: 0;
	}
	.pathbox {
		position: relative;
		width: 100%;
		height: 22px;
		border-radius: 999px;
		border: 1.5px solid transparent;
		transition:
			background 0.3s ease,
			border-color 0.3s ease;
	}
	.pathbox.tunnel {
		background: var(--color-grass-soft);
		border-color: var(--color-grass);
	}
	.line {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 2px;
		transform: translateY(-50%);
		background: var(--color-line);
	}
	.pathbox.tunnel .line {
		background: color-mix(in srgb, var(--color-grass) 35%, transparent);
	}
	.packet {
		position: absolute;
		top: 50%;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 18px;
		margin-top: -9px;
		border-radius: 6px;
		background: var(--color-amber);
		color: #fff;
		animation: fly 1.2s ease-in-out forwards;
	}
	.packet.locked {
		background: var(--color-grass);
	}
	@keyframes fly {
		from {
			left: 0;
		}
		to {
			left: calc(100% - 22px);
		}
	}
	.pathlabel {
		margin-top: 5px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
		text-align: center;
	}
	.pathlabel.tl {
		color: var(--color-grass);
	}
	.antenna {
		width: 1.5px;
		height: 16px;
		margin-top: 4px;
		background: color-mix(in srgb, var(--color-danger) 45%, transparent);
	}

	.snoop {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		width: min(100%, 300px);
	}
	.who {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.who b {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-danger);
	}
	.screen {
		width: 100%;
		min-height: 52px;
		border-radius: 10px;
		background: #10212f;
		border: 1px solid #1d3547;
		padding: 8px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		line-height: 1.5;
		color: #6b8496;
	}
	.screen.plain {
		color: #ff9d92;
	}
	.cl {
		word-break: break-all;
		animation: fade 0.25s ease;
	}
	.idle {
		font-family: var(--font-sans);
		font-style: italic;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	.seen {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.seen b {
		color: var(--color-amber);
		font-weight: 700;
	}
	.seen b.inside {
		color: var(--color-grass);
	}
	.seen code {
		border-radius: 6px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 1px 7px;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.note {
		margin: 0;
		min-height: 1.4em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.packet,
		.tag,
		.cl {
			animation-duration: 0.01s;
		}
		.knob,
		.track {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 18px;
		}
		.end {
			width: 130px;
		}
		.end b {
			font-size: 12.5px;
		}
		.screen {
			font-size: 12.5px;
		}
		.note,
		.seen {
			font-size: 13.5px;
		}
	}
</style>
