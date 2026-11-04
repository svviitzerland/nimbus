<script lang="ts">
	// Guided NAT lesson. A house with three phones on private addresses, a router at the door
	// with the one public address, and nimbus.com outside. Following the beats, a letter leaves
	// phone A, gets its sender rewritten at the door, a line appears in the translation table,
	// and the reply finds its way back. Then all three phones at once. On the last beat a
	// stranger may knock from outside (optional) and the router drops it.
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { NatText } from '$lib/chapters/network/nat/types';

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
	const tx = $derived(text as NatText);
	const LAST = $derived(tx.intro.length - 1);

	type Pt = { x: number; y: number };
	const PHONES = [
		{ n: 'A', ip: '192.168.1.10', port: 40001, at: { x: 50, y: 92 } },
		{ n: 'B', ip: '192.168.1.11', port: 40002, at: { x: 50, y: 172 } },
		{ n: 'C', ip: '192.168.1.12', port: 40003, at: { x: 50, y: 252 } }
	];
	const PUBLIC = '203.0.113.5';
	const ROUTER: Pt = { x: 178, y: 172 };
	const SERVER: Pt = { x: 294, y: 112 };
	const STRANGER: Pt = { x: 294, y: 246 };

	let still = $state(false);
	let t = $state(0);
	let peek = $state<number | null>(null);
	let knock = $state<'idle' | 'go' | 'arrive' | 'drop'>('idle');
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

	function letStrangerKnock() {
		if (knock !== 'idle') return;
		knock = 'go';
		const k = still ? 0.2 : 1;
		timers.push(
			setTimeout(() => (knock = 'arrive'), 60),
			setTimeout(() => {
				knock = 'drop';
				onstate?.('stranger');
			}, 1300 * k),
			setTimeout(() => (knock = 'idle'), 4200 * k)
		);
	}

	type Letter = { at: Pt; key: string };
	type View = {
		letters: Letter[];
		rewritten: boolean; // the letter card shows the new address
		dir: 'out' | 'back' | '';
		rows: number; // how many lines the translation table has
		hotRow: number; // which line is in focus, -1 for none
		loaded: boolean[];
		flash: boolean; // the router is rewriting right now
	};

	function phase(i: number) {
		if (i === 2 || i === 4) return still ? 3 : t % 5;
		if (i === 5) return still ? 5 : t % 6;
		return 0;
	}

	function view(i: number): View {
		const v: View = {
			letters: [],
			rewritten: false,
			dir: '',
			rows: i >= 5 ? 3 : i >= 3 ? 1 : 0,
			hotRow: i === 3 || i === 4 ? 0 : -1,
			loaded: [false, false, false],
			flash: false
		};
		const p = phase(i);
		const A = PHONES[0].at;
		if (i === 2) {
			const at = p === 0 ? A : p <= 2 ? ROUTER : SERVER;
			return { ...v, letters: [{ at, key: 'a' }], rewritten: p >= 2, dir: 'out', flash: p === 2 };
		}
		if (i === 3) return { ...v, letters: [{ at: SERVER, key: 'a' }], rewritten: true, dir: 'out' };
		if (i === 4) {
			const at = p === 0 ? SERVER : p <= 2 ? ROUTER : A;
			return {
				...v,
				letters: [{ at, key: 'a' }],
				rewritten: p >= 2,
				dir: 'back',
				flash: p === 2,
				loaded: [p >= 3, false, false]
			};
		}
		if (i === 5) {
			const where = (k: number): Pt =>
				p === 0 || p === 5 ? PHONES[k].at : p === 1 || p === 4 ? ROUTER : SERVER;
			return {
				...v,
				letters: PHONES.map((ph, k) => ({ at: where(k), key: ph.n })),
				flash: p === 1 || p === 4,
				loaded: [p === 5, p === 5, p === 5]
			};
		}
		return v;
	}

	const fill = (s: string, ip: string) => s.replace('{ip}', ip);
	const portOf = (n: number) => tx.port.replace('{n}', String(n));
</script>

<div class="wrap">
	{#if beat >= LAST}
		<div class="play" in:fade={{ duration: 200 }}>
			<button type="button" class="ask" disabled={knock !== 'idle'} onclick={letStrangerKnock}
				>{tx.strangerBtn}</button
			>
		</div>
	{/if}

	<Guide steps={tx.steps} active={peek ?? beat} onselect={(k) => (peek = k)}>
		{#snippet visual(i)}
			{@const v = view(i)}
			<div class="scene">
				{@render house(i, v)}
				{#if v.dir}
					{@render letterCard(v)}
				{/if}
				{#if v.rows > 0}
					{@render table(v)}
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

{#snippet envelope()}
	<rect x="-10" y="-7" width="20" height="14" rx="2.5" class="env" />
	<path d="M-10 -6 L0 1 L10 -6" class="env-flap" />
{/snippet}

{#snippet house(i: number, v: View)}
	{@const play = i === LAST}
	<svg viewBox="0 0 340 312" class="svg" role="img" aria-label={tx.homeLabel}>
		<!-- the house -->
		<path d="M8 66 L92 22 L176 66" class="roof" />
		<rect x="8" y="64" width="168" height="240" rx="14" class="home" class:hot={i === 1} />
		<text x="22" y="84" class="corner">{tx.homeLabel}</text>
		{#each PHONES as ph, k (ph.n)}
			<g transform="translate({ph.at.x - 17} {ph.at.y - 14})">
				<Device
					kind="phone"
					size={34}
					tone={v.loaded[k] ? 'var(--color-grass)' : 'var(--color-brand)'}
				/>
			</g>
			<text x={ph.at.x + 30} y={ph.at.y - 2} class="name">{tx.phoneLabel.replace('{n}', ph.n)}</text
			>
			<text x={ph.at.x + 30} y={ph.at.y + 11} class="ip" class:hot={i === 1}>{ph.ip}</text>
			{#if v.loaded[k]}
				<text x={ph.at.x + 30} y={ph.at.y + 24} class="ok" in:fade={{ duration: 200 }}
					>{tx.loaded}</text
				>
			{/if}
		{/each}
		{#if i === 1}
			<rect
				x="88"
				y="34"
				width="62"
				height="18"
				rx="9"
				class="chip-r"
				in:fade={{ duration: 300 }}
			/>
			<text x="119" y="47" class="chip-t">{tx.privateLabel}</text>
		{/if}

		<!-- the router in the doorway -->
		<g transform="translate({ROUTER.x - 22} {ROUTER.y - 18})">
			<Device
				kind="router"
				size={44}
				tone={v.flash ? 'var(--color-amber)' : 'var(--color-grass)'}
			/>
		</g>
		<text x={ROUTER.x} y={ROUTER.y + 30} class="name mid">{tx.routerLabel}</text>
		<text x={ROUTER.x} y={ROUTER.y + 43} class="ip mid" class:pub={i === 0}>{PUBLIC}</text>
		<text x={ROUTER.x} y={ROUTER.y + 55} class="corner mid">{tx.publicLabel}</text>
		{#if i === 6}
			<g in:fade={{ duration: 300 }}>
				<rect x={ROUTER.x - 36} y={ROUTER.y - 48} width="72" height="18" rx="9" class="chip-g" />
				<text x={ROUTER.x} y={ROUTER.y - 35} class="chip-t">{tx.frontDesk}</text>
			</g>
		{/if}
		{#if v.flash && !still}
			<circle cx={ROUTER.x} cy={ROUTER.y} r="30" class="pulse" />
		{/if}

		<!-- outside -->
		<g transform="translate({SERVER.x - 18} {SERVER.y - 24})">
			<rect width="36" height="48" rx="5" class="rack" />
			{#each [0, 1, 2] as k (k)}
				<rect x="5" y={6 + k * 14} width="26" height="9" rx="2" class="slot" />
				<circle cx="26" cy={10.5 + k * 14} r="1.6" class="led" />
			{/each}
		</g>
		<text x={SERVER.x} y={SERVER.y + 40} class="name mid">{tx.serverLabel}</text>
		{#if play}
			<g transform="translate({STRANGER.x - 24} {STRANGER.y - 20})" in:fade={{ duration: 300 }}>
				<Device kind="laptop" size={48} tone="var(--color-amber)" />
			</g>
			<text x={STRANGER.x} y={STRANGER.y + 32} class="name mid">{tx.strangerLabel}</text>
		{/if}

		<!-- letters on the move -->
		{#each v.letters as l (l.key)}
			<g class="mover" style="transform:translate({l.at.x + 14}px, {l.at.y - 26}px)">
				{@render envelope()}
			</g>
		{/each}
		{#if play && knock !== 'idle'}
			{@const at = knock === 'go' ? STRANGER : ROUTER}
			<g
				class="mover"
				class:gone={knock === 'drop'}
				style="transform:translate({at.x + 22}px, {at.y - 30}px)"
			>
				{@render envelope()}
			</g>
			{#if knock === 'drop'}
				<text x={ROUTER.x + 22} y={ROUTER.y - 46} class="bad mid" in:fade={{ duration: 200 }}
					>{tx.dropped}</text
				>
			{/if}
		{/if}
	</svg>
{/snippet}

{#snippet letterCard(v: View)}
	{@const a = PHONES[0]}
	<div class="letter" class:flash={v.flash}>
		{#if v.dir === 'out'}
			<span class:old={v.rewritten}>{fill(tx.from, a.ip)}</span>
			{#if v.rewritten}
				<span class="new" in:fade={{ duration: 250 }}>{fill(tx.from, PUBLIC)}</span>
				<span class="port" in:fade={{ duration: 250 }}>{portOf(a.port)}</span>
			{/if}
		{:else}
			<span class:old={v.rewritten}>{fill(tx.to, PUBLIC)}</span>
			<span class="port" class:old={v.rewritten}>{portOf(a.port)}</span>
			{#if v.rewritten}
				<span class="new" in:fade={{ duration: 250 }}>{fill(tx.to, a.ip)}</span>
			{/if}
		{/if}
	</div>
{/snippet}

{#snippet table(v: View)}
	<div class="table" in:fade={{ duration: 300 }}>
		<p class="t-title">{tx.tableTitle}</p>
		<div class="row head"><span>{tx.insideHead}</span><span>{tx.outsideHead}</span></div>
		{#each PHONES.slice(0, v.rows) as ph, k (ph.n)}
			<div class="row" class:hot={k === v.hotRow} in:fade={{ duration: 300 }}>
				<span>{ph.ip}</span>
				<span>{portOf(ph.port)}</span>
			</div>
		{/each}
	</div>
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
	.roof {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.home {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.5;
		transition: stroke 0.5s;
	}
	.home.hot {
		stroke: var(--color-brand);
	}
	.corner {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.name {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.mid {
		text-anchor: middle;
	}
	.ip {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9.5px;
		fill: var(--color-muted);
	}
	.ip.hot {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.ip.pub {
		fill: var(--color-grass);
		font-weight: 700;
	}
	.ok {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.bad {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-danger);
	}
	.chip-r,
	.chip-g {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.chip-g {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.chip-t {
		text-anchor: middle;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.rack {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.slot {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.pulse {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.5;
		animation: pulse 1.1s ease-out infinite;
		transform-origin: 178px 172px;
	}
	@keyframes pulse {
		from {
			transform: scale(0.6);
			opacity: 0.8;
		}
		to {
			transform: scale(1.3);
			opacity: 0;
		}
	}
	.env {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.4;
	}
	.env-flap {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.2;
	}
	.mover {
		transition:
			transform 1.1s cubic-bezier(0.45, 0, 0.2, 1),
			opacity 0.6s;
	}
	.mover.gone {
		opacity: 0.25;
	}
	.letter {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px 10px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 8px 14px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		color: var(--color-ink);
		transition: border-color 0.3s;
	}
	.letter.flash {
		border-color: var(--color-amber);
	}
	.old {
		color: var(--color-faint);
		text-decoration: line-through;
	}
	.new {
		font-weight: 700;
		color: var(--color-grass);
	}
	.port {
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 1px 8px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.table {
		width: 100%;
		max-width: 300px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 14px;
		font-size: 12px;
	}
	.t-title {
		margin: 0 0 6px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		border-radius: 6px;
		padding: 2px 4px;
		font-family: var(--font-mono, ui-monospace, monospace);
		color: var(--color-ink);
	}
	.row.hot {
		background: var(--color-amber-soft);
	}
	.row.head {
		font-family: inherit;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	@media (prefers-reduced-motion: reduce) {
		.mover,
		.home,
		.letter {
			transition: none;
		}
		.pulse {
			animation: none;
		}
	}
</style>
