<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { DevicesText, DevicePart } from '$lib/chapters/network/devices/types';
	import DeviceIcon from './netbasics/DeviceIcon.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DevicesText);

	const PARTS: DevicePart[] = ['modem', 'router', 'switch', 'ap'];
	const PULL_TOKEN: Record<DevicePart, string> = {
		modem: 'noModem',
		router: 'noRouter',
		switch: 'noSwitch',
		ap: 'noAp'
	};

	// The office floor plan, in board units (100 wide, 118 tall).
	const H = 118;
	const POS = {
		net: { x: 50, y: 6 },
		modem: { x: 50, y: 25 },
		router: { x: 50, y: 44 },
		switch: { x: 50, y: 63 },
		pc1: { x: 14, y: 92 },
		pc2: { x: 38, y: 92 },
		ap: { x: 74, y: 84 },
		phone: { x: 74, y: 109 }
	};
	const BUS = 75; // where the switch cables split sideways

	let placed = $state<Record<DevicePart, boolean>>({
		modem: false,
		router: false,
		switch: false,
		ap: false
	});
	let picked = $state<DevicePart | null>(null);
	let shake = $state<DevicePart | null>(null);
	let pulled = $state<DevicePart | null>(null);
	let builtOnce = false;
	let pulledOnce = false;
	let completed = false;

	const tray = $derived(PARTS.filter((p) => !placed[p]));
	const allIn = $derived(PARTS.every((p) => placed[p]));

	// What actually works, given which boxes are in.
	const internetOk = $derived(placed.modem && placed.router);
	type Status = 'online' | 'local' | 'offline';
	const pcStatus = $derived<Status>(!placed.switch ? 'offline' : internetOk ? 'online' : 'local');
	const phoneStatus = $derived<Status>(
		!placed.switch || !placed.ap ? 'offline' : internetOk ? 'online' : 'local'
	);
	type Wire = 'live' | 'local' | 'gone';
	const w = (present: boolean, live: boolean): Wire =>
		!present ? 'gone' : live ? 'live' : 'local';
	const wires = $derived({
		netModem: w(placed.modem, true),
		modemRouter: w(placed.modem && placed.router, true),
		routerSwitch: w(placed.router && placed.switch, placed.modem),
		pcs: w(placed.switch, internetOk),
		ap: w(placed.switch && placed.ap, internetOk)
	});

	function pick(p: DevicePart) {
		picked = picked === p ? null : p;
	}

	function tapSlot(slot: DevicePart) {
		if (placed[slot]) {
			// Pull a box out to see what breaks.
			const wasFull = allIn;
			placed[slot] = false;
			pulled = slot;
			picked = null;
			if (wasFull && builtOnce) {
				onstate?.(PULL_TOKEN[slot]);
				pulledOnce = true;
				if (!completed) {
					completed = true;
					oncomplete?.();
				}
			}
			return;
		}
		if (!picked) return;
		if (picked !== slot) {
			shake = slot;
			setTimeout(() => (shake = null), 450);
			onstate?.('wrong');
			return;
		}
		placed[slot] = true;
		picked = null;
		pulled = null;
		if (PARTS.every((p) => placed[p])) {
			onstate?.(builtOnce ? 'fixed' : 'built');
			builtOnce = true;
		} else if (!pulledOnce) {
			onstate?.(slot);
		}
	}

	const note = $derived(
		picked
			? tx.placeHint.replace('{name}', tx.parts[picked].name)
			: allIn
				? tx.builtNote
				: pulled && builtOnce
					? tx.brokenNote.replace('{name}', tx.parts[pulled].name)
					: tx.pickHint
	);

	const top = (y: number) => `${(y / H) * 100}%`;
</script>

{#snippet slot(p: DevicePart)}
	{@const pos = POS[p]}
	<button
		type="button"
		class="slot"
		class:filled={placed[p]}
		class:target={picked !== null && !placed[p]}
		class:shake={shake === p}
		style="left:{pos.x}%; top:{top(pos.y)}"
		aria-label={placed[p] ? tx.parts[p].name : '?'}
		onclick={() => tapSlot(p)}
	>
		{#if placed[p]}
			<span class="ic"><DeviceIcon kind={p} size={26} /></span>
			<span class="nm">{tx.parts[p].name}</span>
		{:else}
			<span class="q">?</span>
		{/if}
	</button>
{/snippet}

{#snippet endpoint(kind: 'pc' | 'phone', label: string, x: number, y: number, s: Status)}
	<div class="end" style="left:{x}%; top:{top(y)}">
		<span class="ic" class:dim={s === 'offline'}><DeviceIcon {kind} size={24} /></span>
		<span class="nm">{label}</span>
		<span class="st {s}">{tx.status[s]}</span>
	</div>
{/snippet}

<div class="flex h-full w-full flex-col items-center gap-3">
	<!-- the shelf of boxes still to place -->
	<div class="tray">
		<span class="tlabel">{tx.trayLabel}</span>
		<div class="tparts">
			{#each tray as p (p)}
				<button
					type="button"
					class="part"
					class:on={picked === p}
					aria-pressed={picked === p}
					onclick={() => pick(p)}
				>
					<span class="ic"><DeviceIcon kind={p} size={22} /></span>
					<span class="ptext">
						<b>{tx.parts[p].name}</b>
						<span>{tx.parts[p].job}</span>
					</span>
				</button>
			{:else}
				<span class="empty">✓</span>
			{/each}
		</div>
	</div>

	<div class="board">
		<svg class="wires" viewBox="0 0 100 {H}" preserveAspectRatio="none" aria-hidden="true">
			<path d="M50 {POS.net.y} V{POS.modem.y}" class={wires.netModem} />
			<path d="M50 {POS.modem.y} V{POS.router.y}" class={wires.modemRouter} />
			<path d="M50 {POS.router.y} V{POS.switch.y}" class={wires.routerSwitch} />
			<path
				d="M50 {POS.switch.y} V{BUS} H{POS.pc1.x} V{POS.pc1.y} M{POS.pc2.x} {BUS} V{POS.pc2.y}"
				class={wires.pcs}
			/>
			<path d="M50 {BUS} H{POS.ap.x} V{POS.ap.y}" class={wires.ap} />
		</svg>

		<div class="end net" style="left:{POS.net.x}%; top:{top(POS.net.y)}">
			<span class="ic brand"><DeviceIcon kind="globe" size={22} /></span>
			<span class="nm">{tx.internetLabel}</span>
		</div>

		{@render slot('modem')}
		{@render slot('router')}
		{@render slot('switch')}
		{@render slot('ap')}

		<!-- radio between the access point and the phone -->
		<span
			class="radio"
			class:live={phoneStatus !== 'offline'}
			style="left:{POS.ap.x}%; top:{top((POS.ap.y + POS.phone.y) / 2 + 1)}"
			aria-hidden="true"
		>
			<svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
				<path d="M4 3a8 8 0 0 0 16 0M8.5 3a3.5 3.5 0 0 0 7 0" />
			</svg>
		</span>

		{@render endpoint('pc', tx.pcLabel.replace('{n}', '1'), POS.pc1.x, POS.pc1.y, pcStatus)}
		{@render endpoint('pc', tx.pcLabel.replace('{n}', '2'), POS.pc2.x, POS.pc2.y, pcStatus)}
		{@render endpoint('phone', tx.phoneLabel, POS.phone.x, POS.phone.y, phoneStatus)}
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.tray {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.tlabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.tparts {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 6px;
		min-height: 44px;
		width: min(94vw, 360px);
	}
	.part {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 6px 9px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}
	.part:hover {
		border-color: var(--color-ink);
	}
	.part.on {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 20%, transparent);
	}
	.ptext {
		display: flex;
		min-width: 0;
		flex-direction: column;
		line-height: 1.2;
	}
	.ptext b {
		font-size: 11.5px;
		font-weight: 800;
	}
	.ptext span {
		font-size: 9.5px;
		color: var(--color-muted);
	}
	.empty {
		grid-column: span 2;
		align-self: center;
		text-align: center;
		font-size: 18px;
		color: var(--color-grass);
	}

	.board {
		position: relative;
		width: min(82vw, 300px);
		aspect-ratio: 100 / 118;
		flex: none;
	}
	.wires {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: none;
	}
	.wires path {
		stroke-width: 2.5;
		vector-effect: non-scaling-stroke;
		stroke-linejoin: round;
		transition: stroke 0.3s ease;
	}
	.wires .live {
		stroke: var(--color-grass);
	}
	.wires .local {
		stroke: var(--color-amber);
	}
	.wires .gone {
		stroke: var(--color-line);
	}

	.slot,
	.end {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		transform: translate(-50%, -50%);
		line-height: 1.15;
	}
	.slot {
		min-width: 64px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 8px;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}
	.slot:not(.filled) {
		min-height: 44px;
		justify-content: center;
		background: var(--color-paper);
	}
	.slot.filled:hover {
		border-color: var(--color-danger);
	}
	.slot.target {
		border-color: var(--color-brand);
		animation: breathe 1.4s ease-in-out infinite;
	}
	.slot.shake {
		animation: shake 0.4s ease;
		border-color: var(--color-danger);
	}
	@keyframes breathe {
		50% {
			box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 18%, transparent);
		}
	}
	@keyframes shake {
		25% {
			transform: translate(calc(-50% - 5px), -50%);
		}
		75% {
			transform: translate(calc(-50% + 5px), -50%);
		}
	}
	.q {
		font-size: 15px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.ic {
		line-height: 0;
		color: var(--color-ink);
		transition: color 0.3s ease;
	}
	.ic.dim {
		color: var(--color-faint);
	}
	.ic.brand {
		color: var(--color-brand);
	}
	.nm {
		font-size: 10px;
		font-weight: 700;
		white-space: nowrap;
		color: var(--color-ink);
	}
	.end {
		padding: 2px 4px;
		border-radius: 10px;
		background: var(--color-paper);
	}
	.end.net .nm {
		color: var(--color-brand);
	}
	.st {
		border-radius: 999px;
		padding: 1px 7px;
		font-size: 9px;
		font-weight: 800;
		white-space: nowrap;
	}
	.st.online {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.st.local {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.st.offline {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.radio {
		position: absolute;
		line-height: 0;
		transform: translate(-50%, -50%);
		opacity: 0.25;
		transition: opacity 0.3s ease;
	}
	.radio.live {
		opacity: 1;
	}
	.radio path {
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linecap: round;
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.slot.target,
		.slot.shake {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.tparts {
			grid-template-columns: repeat(4, minmax(0, 1fr));
			width: 600px;
		}
		.empty {
			grid-column: span 4;
		}
		.board {
			width: 380px;
		}
		.nm {
			font-size: 11px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
