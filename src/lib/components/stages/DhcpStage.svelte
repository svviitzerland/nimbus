<script lang="ts">
	// Guided DHCP lesson. A cafe where the router is a receptionist with a board of keys (the
	// address pool). A phone walks in with no address, and the four DORA messages play out one
	// per beat: the key lifts off the board, crosses the desk, and the phone takes a seat. Then
	// the lease runs out and the key goes home. On the last beat, more guests may walk in until
	// the board is empty, which is optional.
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DhcpText } from '$lib/chapters/network/dhcp/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as DhcpText);
	const LAST = $derived(tx.intro.length - 1);

	type Pt = { x: number; y: number };
	const KEYS = ['.10', '.11', '.12', '.13'];
	const MINE = 2; // the phone in the story gets .12
	const HOOK = (k: number): Pt => ({ x: 238 + k * 25, y: 66 });
	const DESK: Pt = { x: 214, y: 156 };
	const DOOR: Pt = { x: 34, y: 232 };
	const MID: Pt = { x: 120, y: 214 };
	const SEATS: Pt[] = [
		{ x: 70, y: 82 },
		{ x: 140, y: 82 },
		{ x: 70, y: 148 },
		{ x: 140, y: 148 }
	];
	const GATEWAY = '192.168.1.1';

	let still = $state(false);
	let t = $state(0);
	let peek = $state<number | null>(null);
	// Guests on the last beat, each with the key it got (or -1 when the board was empty).
	let guests = $state<{ key: number; seated: boolean }[]>([]);
	let timers: ReturnType<typeof setTimeout>[] = [];

	onMount(() => {
		still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		onshow?.(true);
		oncomplete?.();
	});

	$effect(() => {
		void beat;
		peek = null;
		t = 0;
		if (still) return;
		const id = setInterval(() => (t += 1), 1400);
		return () => clearInterval(id);
	});

	onDestroy(() => timers.forEach(clearTimeout));

	const FREE = [0, 1, 3];
	const empty = $derived(guests.some((g) => g.key < 0));

	function arrive() {
		if (empty) return;
		const used = guests.length;
		const key = used < FREE.length ? FREE[used] : -1;
		guests.push({ key, seated: false });
		const idx = guests.length - 1;
		timers.push(
			setTimeout(
				() => {
					if (key >= 0) guests[idx].seated = true;
					onstate?.(key >= 0 ? 'join' : 'empty');
				},
				still ? 50 : 900
			)
		);
	}

	type Scene = {
		phone: Pt;
		faded: boolean;
		key: Pt | null; // where the .12 key is, null when it hangs on its hook
		bubble: { from: Pt; k: number } | null;
		rings: boolean;
		tag: string;
		hot: boolean;
		addr: string;
	};

	const nearPhone = (p: Pt): Pt => ({ x: p.x + 22, y: p.y - 16 });

	function scene(i: number): Scene {
		const base: Scene = {
			phone: SEATS[0],
			faded: false,
			key: nearPhone(SEATS[0]),
			bubble: null,
			rings: false,
			tag: '',
			hot: false,
			addr: '192.168.1.12'
		};
		if (i === 0) return { ...base, phone: DOOR, key: null, tag: tx.noAddress, addr: '' };
		if (i === 1) return { ...base, phone: DOOR, key: null, tag: tx.noAddress, hot: true, addr: '' };
		if (i === 2)
			return { ...base, phone: MID, key: null, bubble: { from: MID, k: 0 }, rings: true, addr: '' };
		if (i === 3)
			return { ...base, phone: MID, key: DESK, bubble: { from: DESK, k: 1 }, hot: true, addr: '' };
		if (i === 4) return { ...base, phone: MID, key: DESK, bubble: { from: MID, k: 2 }, addr: '' };
		if (i === 5) return { ...base, bubble: { from: { x: 214, y: 150 }, k: 3 } };
		if (i === 6) {
			const p = still ? 0 : t % 7;
			if (p === 0) return base;
			if (p <= 3)
				return { ...base, phone: DOOR, faded: true, key: DESK, tag: tx.leaving, addr: '' };
			return { ...base, phone: DOOR, faded: true, key: null, addr: '' };
		}
		return base;
	}

	function bubbleW(s: string) {
		return Math.max(70, s.length * 5.6 + 22);
	}
</script>

<div class="wrap">
	{#if beat >= LAST}
		<div class="play" in:fade={{ duration: 200 }}>
			<button type="button" class="ask" disabled={empty} onclick={arrive}>{tx.arriveBtn}</button>
		</div>
	{/if}

	<Guide steps={tx.steps} active={peek ?? beat} onselect={(k) => (peek = k)}>
		{#snippet visual(i)}
			{@const s = scene(i)}
			<div class="scene">
				{@render cafe(i, s)}
				{#if i === 7}
					<div class="dora" in:fade={{ duration: 300 }}>
						{#each tx.dora as d, k (k)}
							<span class="letter" class:on={still || t % 5 === k}>
								<b>{d.name.charAt(0)}</b>
								<small>{d.name}</small>
							</span>
						{/each}
					</div>
				{:else if i === 5 || i === 8}
					<dl class="slip" in:fade={{ duration: 300 }}>
						<p class="slip-t">{tx.slipTitle}</p>
						<div>
							<dt>{tx.slip.address}</dt>
							<dd>192.168.1.12</dd>
						</div>
						<div>
							<dt>{tx.slip.gateway}</dt>
							<dd>{GATEWAY}</dd>
						</div>
						<div>
							<dt>{tx.slip.dns}</dt>
							<dd>1.1.1.1</dd>
						</div>
						<div>
							<dt>{tx.slip.lease}</dt>
							<dd>{tx.slip.leaseValue}</dd>
						</div>
					</dl>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

{#snippet keyShape(label: string, lit: boolean)}
	<g class="key" class:lit>
		<circle cx="0" cy="-6" r="5" />
		<path d="M0 -1 L0 11 M0 6 L4 6 M0 10 L3 10" />
		<text x="0" y="23" class="key-t">{label}</text>
	</g>
{/snippet}

{#snippet cafe(i: number, s: Scene)}
	{@const play = i === LAST}
	<svg viewBox="0 0 340 290" class="svg" role="img" aria-label={tx.sceneLabel}>
		<rect x="6" y="6" width="328" height="278" rx="22" class="floor" />
		<!-- door -->
		<rect x="6" y="206" width="8" height="56" rx="3" class="door" />
		<!-- tables -->
		{#each SEATS as seat, k (k)}
			<rect x={seat.x - 22} y={seat.y + 18} width="44" height="7" rx="3.5" class="table" />
		{/each}
		<!-- key board -->
		<text x="275" y="30" class="small-label">{tx.boardLabel}</text>
		<rect x="222" y="38" width="106" height="66" rx="10" class="board" class:hot={s.hot} />
		{#each KEYS as label, k (k)}
			{@const h = HOOK(k)}
			{@const onHook = play
				? k !== MINE && !guests.some((g) => g.key === k)
				: k !== MINE || s.key === null}
			<circle cx={h.x} cy={h.y - 16} r="2" class="hook" />
			{#if onHook}
				<g transform="translate({h.x} {h.y})">{@render keyShape(label, false)}</g>
			{/if}
		{/each}
		<!-- reception desk with the router -->
		<g transform="translate(250 132)"
			><Device kind="router" size={44} tone="var(--color-grass)" /></g
		>
		<rect x="226" y="168" width="100" height="26" rx="8" class="desk" class:hot={s.hot} />
		<text x="276" y="212" class="name">{tx.routerLabel}</text>
		<text x="276" y="225" class="small-label">{tx.routerSub}</text>

		{#if s.rings && !still}
			{#each [0, 1, 2] as k (k)}
				<circle
					cx={s.phone.x}
					cy={s.phone.y}
					r="140"
					class="ring"
					style="transform-origin:{s.phone.x}px {s.phone.y}px; animation-delay:{k * 0.55}s"
				/>
			{/each}
		{/if}

		<!-- the phone from the story -->
		<g
			class="mover"
			style="transform:translate({s.phone.x}px, {s.phone.y}px)"
			class:faded={s.faded}
		>
			<g transform="translate(-17 -14)"><Device kind="phone" size={34} /></g>
			{#if s.addr}
				<text x="0" y="28" class="addr">{s.addr}</text>
			{:else if s.tag && !s.faded}
				<text x="0" y="28" class="tag-t">{s.tag}</text>
			{/if}
		</g>
		{#if s.key && !play}
			<g class="mover" style="transform:translate({s.key.x}px, {s.key.y}px)">
				{@render keyShape(KEYS[MINE], true)}
			</g>
		{/if}
		{#if s.faded && s.tag}
			<text x={DESK.x} y={DESK.y + 40} class="tag-t">{s.tag}</text>
		{/if}

		<!-- the guests on the last beat -->
		{#if play}
			<g transform="translate({SEATS[0].x + 22} {SEATS[0].y - 16})"
				>{@render keyShape(KEYS[MINE], true)}</g
			>
			{#each guests as g, k (k)}
				{@const at = g.seated ? SEATS[k + 1] : DOOR}
				<g
					class="mover"
					style="transform:translate({at.x}px, {at.y}px)"
					in:fade={{ duration: 300 }}
				>
					<g transform="translate(-17 -14)">
						<Device
							kind="phone"
							size={34}
							tone={g.key < 0 ? 'var(--color-amber)' : 'var(--color-brand)'}
						/>
					</g>
					{#if g.seated}
						<text x="0" y="28" class="addr">192.168.1{KEYS[g.key]}</text>
						<g transform="translate(22 -16)">{@render keyShape(KEYS[g.key], true)}</g>
					{:else if g.key < 0}
						<text x="0" y="28" class="tag-t">{tx.emptyLabel}</text>
					{/if}
				</g>
			{/each}
		{/if}

		{#if s.bubble && !play}
			{@const d = tx.dora[s.bubble.k]}
			{@const w = bubbleW(d.say) + 8}
			{@const bx = Math.min(330 - w, Math.max(10, s.bubble.from.x - w / 2))}
			{#key i}
				<g in:fade={{ duration: 250 }}>
					<rect x={bx} y={s.bubble.from.y - 66} width={w} height="34" rx="10" class="bubble" />
					<text x={bx + w / 2} y={s.bubble.from.y - 52} class="bubble-n">{d.name}</text>
					<text x={bx + w / 2} y={s.bubble.from.y - 39} class="bubble-t">{d.say}</text>
				</g>
			{/key}
		{/if}
	</svg>
{/snippet}

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: 8px 16px 112px;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-bottom: 24px;
		}
	}
	.play {
		display: flex;
		justify-content: center;
	}
	.ask {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.06);
	}
	.ask:disabled {
		opacity: 0.55;
	}
	.scene {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.svg {
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.floor {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.door {
		fill: var(--color-amber);
		opacity: 0.6;
	}
	.table {
		fill: var(--color-line);
	}
	.board,
	.desk {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.5s;
	}
	.board.hot,
	.desk.hot {
		stroke: var(--color-grass);
	}
	.hook {
		fill: var(--color-faint);
	}
	.key circle {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.key path {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.key.lit circle,
	.key.lit path {
		stroke: var(--color-amber);
	}
	.key-t {
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.name {
		text-anchor: middle;
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.small-label {
		text-anchor: middle;
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.addr {
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.tag-t {
		text-anchor: middle;
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-amber);
	}
	.mover {
		transition:
			transform 1.1s cubic-bezier(0.45, 0, 0.2, 1),
			opacity 0.8s;
	}
	.mover.faded {
		opacity: 0.35;
	}
	.ring {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.4;
		animation: ring 1.8s ease-out infinite;
	}
	@keyframes ring {
		from {
			transform: scale(0.08);
			opacity: 0.7;
		}
		to {
			transform: scale(1);
			opacity: 0;
		}
	}
	.bubble {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.bubble-n {
		text-anchor: middle;
		font-size: 10px;
		font-weight: 800;
		fill: var(--color-brand);
	}
	.bubble-t {
		text-anchor: middle;
		font-size: 10px;
		font-weight: 500;
		fill: var(--color-ink);
	}
	.dora {
		display: flex;
		gap: 8px;
	}
	.letter {
		display: flex;
		min-width: 64px;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 6px 8px;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.letter b {
		font-family: var(--font-display);
		font-size: 22px;
		color: var(--color-ink);
	}
	.letter small {
		font-size: 10px;
		color: var(--color-muted);
	}
	.letter.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.slip {
		margin: 0;
		width: 100%;
		max-width: 280px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 14px;
		font-size: 12px;
	}
	.slip-t {
		margin: 0 0 6px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.slip div {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		padding: 2px 0;
	}
	.slip dt {
		color: var(--color-muted);
	}
	.slip dd {
		margin: 0;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-weight: 600;
		color: var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.mover,
		.letter,
		.board,
		.desk {
			transition: none;
		}
		.ring {
			animation: none;
		}
	}
</style>
