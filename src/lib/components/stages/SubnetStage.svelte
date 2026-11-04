<script lang="ts">
	// Guided subnet lesson, built on one picture and one rule. The block 192.168.1.0 is a building
	// with 256 windows (one window, one address). The number after the slash sets the room size,
	// and the walls split or merge by themselves as the beats move the number. No binary math,
	// just the rule "bigger number, smaller room" and a small cheat sheet. The last beat lets the
	// learner nudge the number, which is optional.
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SubnetText } from '$lib/chapters/network/subnet/types';

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
	const tx = $derived(text as SubnetText);
	const LAST = $derived(tx.intro.length - 1);

	// The building, 16 by 16 windows.
	const X0 = 30;
	const Y0 = 80;
	const P = 15; // window pitch
	const W = 12; // window size
	const ADDRS = Array.from({ length: 256 }, (_, k) => k);
	const CHEAT = [32, 30, 24, 16, 8];
	const SPLIT = [24, 25, 26, 27, 28];
	const MERGE = [28, 27, 26, 25, 24];
	// Spots used on the "tiny ones" beat, a /30 room of 4 and a single /32 window.
	const R30 = [36, 37, 38, 39];
	const R32 = 170;

	let still = $state(false);
	let t = $state(0);
	let peek = $state<number | null>(null);
	let mine = $state(24); // the learner's own number on the last beat

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
		const id = setInterval(() => (t += 1), 1500);
		return () => clearInterval(id);
	});

	function prefixFor(i: number) {
		if (i === 2) return SPLIT[still ? 2 : Math.min(t % 7, 4)];
		if (i === 3) return MERGE[still ? 4 : Math.min(t % 7, 4)];
		if (i === 7) return 26;
		if (i === 8) return 25;
		if (i === LAST) return mine;
		return 24;
	}

	const sizeOf = (p: number) => 2 ** (32 - p);
	const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, tx.thousands);

	function roomsLine(p: number) {
		const size = sizeOf(p);
		const n = 256 / size;
		if (n === 1) return tx.oneRoom.replace('{size}', group(size));
		if (size === 1) return tx.roomsSingle.replace('{n}', group(n));
		return tx.rooms.replace('{n}', group(n)).replace('{size}', group(size));
	}

	function roomRects(p: number) {
		const size = sizeOf(p);
		const cols = Math.min(size, 16);
		const rows = Math.max(1, size / 16);
		return Array.from({ length: 256 / size }, (_, k) => {
			const first = k * size;
			return {
				k,
				x: X0 - 1.5 + (first % 16) * P,
				y: Y0 - 1.5 + Math.floor(first / 16) * P,
				w: cols * P,
				h: rows * P
			};
		});
	}

	function nudge(d: number) {
		const next = Math.max(24, Math.min(32, mine + d));
		if (next === mine) return;
		mine = next;
		onstate?.(next === 32 ? 'one' : d > 0 ? 'split' : 'merge');
	}

	const wx = (a: number) => X0 + (a % 16) * P;
	const wy = (a: number) => Y0 + Math.floor(a / 16) * P;
</script>

<div class="wrap">
	{#if beat >= LAST}
		<div class="play" in:fade={{ duration: 200 }}>
			<button
				type="button"
				class="nudge"
				aria-label={tx.smaller}
				disabled={mine <= 24}
				onclick={() => nudge(-1)}>&minus;</button
			>
			<span class="now">/{mine}</span>
			<button
				type="button"
				class="nudge"
				aria-label={tx.bigger}
				disabled={mine >= 32}
				onclick={() => nudge(1)}>+</button
			>
		</div>
	{/if}

	<Guide steps={tx.steps} active={peek ?? beat} onselect={(k) => (peek = k)}>
		{#snippet visual(i)}
			<div class="scene">
				{#if i === 5}
					{@render campus()}
				{:else if i === 6}
					{@render cheatBig()}
				{:else}
					{@render building(i, prefixFor(i))}
					{#if i >= 1}
						{@render cheatStrip(i === 4 ? 0 : prefixFor(i))}
					{/if}
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

{#snippet building(i: number, p: number)}
	{@const size = sizeOf(p)}
	{@const tiny = i === 4}
	{@const ends = i === 7}
	<svg viewBox="0 0 300 336" class="svg" role="img" aria-label={tx.buildingLabel}>
		<!-- sign on the roof -->
		<rect x="70" y="18" width="160" height="30" rx="9" class="sign" />
		<text x="150" y="38" class="sign-t"
			>192.168.1.0{#if i >= 1 && !tiny}<tspan class="slash">/{p}</tspan>{/if}</text
		>
		<line x1="150" y1="48" x2="150" y2="60" class="post" />
		<!-- the building itself -->
		<rect x="20" y="60" width="260" height="268" rx="10" class="body" />
		<line x1="8" y1="328" x2="292" y2="328" class="ground" />

		{#each ADDRS as a (a)}
			{@const odd = Math.floor(a / size) % 2 === 1}
			{@const lit = tiny && (R30.includes(a) || a === R32)}
			{@const first = ends && a % size === 0}
			{@const last = ends && a % size === size - 1}
			<rect
				x={wx(a)}
				y={wy(a)}
				width={W}
				height={W}
				rx="2"
				class="win"
				class:odd={odd && !tiny}
				class:dim={tiny && !lit}
				class:lit
				class:first
				class:last
			/>
		{/each}

		{#if !tiny}
			{#key p}
				<g in:fade={{ duration: still ? 0 : 450 }}>
					{#each roomRects(p) as r (r.k)}
						<rect x={r.x} y={r.y} width={r.w} height={r.h} rx="3" class="wall" />
					{/each}
				</g>
			{/key}
		{:else}
			<g in:fade={{ duration: 400 }}>
				<rect
					x={wx(R30[0]) - 1.5}
					y={wy(R30[0]) - 1.5}
					width={4 * P}
					height={P}
					rx="3"
					class="wall hot"
				/>
				<rect x={wx(R32) - 1.5} y={wy(R32) - 1.5} width={P} height={P} rx="3" class="wall hot" />
				<rect x={wx(R30[3]) + 18} y={wy(R30[0]) - 3} width="38" height="18" rx="9" class="pin" />
				<text x={wx(R30[3]) + 37} y={wy(R30[0]) + 10} class="pin-t">/30</text>
				<rect x={wx(R32) + 18} y={wy(R32) - 3} width="38" height="18" rx="9" class="pin" />
				<text x={wx(R32) + 37} y={wy(R32) + 10} class="pin-t">/32</text>
			</g>
		{/if}

		{#if i === 8}
			<g in:fade={{ duration: 400 }}>
				<rect x="95" y="128" width="110" height="22" rx="11" class="pin" />
				<text x="150" y="143" class="pin-t">{tx.publicLabel}</text>
				<rect x="95" y="248" width="110" height="22" rx="11" class="pin" />
				<text x="150" y="263" class="pin-t">{tx.privateLabel}</text>
			</g>
		{/if}
	</svg>
	{#if ends}
		<div class="legend" in:fade={{ duration: 300 }}>
			<span><i class="sw first"></i>{tx.nameLabel}</span>
			<span><i class="sw last"></i>{tx.shoutLabel}</span>
		</div>
	{:else if i !== 4}
		<p class="caption">{roomsLine(p)}</p>
	{/if}
{/snippet}

{#snippet cheatStrip(p: number)}
	<div class="strip" aria-label={tx.cheatTitle}>
		{#each CHEAT as c, k (c)}
			<span class="pill" class:on={c === p || (p === 0 && (c === 30 || c === 32))}>
				<b>/{c}</b>
				<small>{tx.cheat[k].size}</small>
			</span>
		{/each}
	</div>
{/snippet}

{#snippet campus()}
	{@const more = still || t >= 1}
	<svg viewBox="0 0 300 300" class="svg" role="img" aria-label={tx.campus16}>
		{#each ADDRS as b (b)}
			{@const x = 30 + (b % 16) * 15}
			{@const y = 30 + Math.floor(b / 16) * 15}
			<g
				class="mini"
				class:ours={b === 0}
				class:hide={b !== 0 && !more}
				style="transition-delay:{(b % 16) * 25 + Math.floor(b / 16) * 25}ms"
			>
				<rect {x} y={y + 3} width="11" height="9" rx="1.5" />
				<path d="M{x} {y + 3.5} L{x + 5.5} {y} L{x + 11} {y + 3.5}" />
			</g>
		{/each}
	</svg>
	<p class="caption">{tx.campus16}</p>
	{#if still || t >= 3}
		<p class="caption soft" in:fade={{ duration: 400 }}>{tx.campus8}</p>
	{/if}
{/snippet}

{#snippet cheatBig()}
	<div class="cheat" in:fade={{ duration: 300 }}>
		<p class="cheat-title">{tx.cheatTitle}</p>
		<p class="rule">{tx.ruleLine}</p>
		{#each CHEAT as c, k (c)}
			<div class="cheat-row" class:on={c === 24}>
				<b class="mono">/{c}</b>
				<span class="bar"><i style="width:{8 + ((32 - c) / 24) * 92}%"></i></span>
				<span class="num">{tx.cheat[k].size}</span>
				<span class="note">{tx.cheat[k].note}</span>
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
		align-items: center;
		gap: 12px;
	}
	.nudge {
		display: grid;
		height: 40px;
		width: 40px;
		place-items: center;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		font-size: 20px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.06);
	}
	.nudge:disabled {
		opacity: 0.4;
	}
	.now {
		min-width: 52px;
		text-align: center;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 22px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.scene {
		display: flex;
		width: 100%;
		max-width: 400px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.svg {
		width: 100%;
		max-height: 52vh;
		height: auto;
	}
	.sign {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.sign-t {
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 14px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.slash {
		fill: var(--color-brand);
	}
	.post {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.body {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.ground {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.win {
		fill: var(--color-brand);
		opacity: 0.32;
		transition:
			fill 0.5s,
			opacity 0.5s;
	}
	.win.odd {
		fill: var(--color-grass);
	}
	.win.dim {
		opacity: 0.1;
	}
	.win.lit {
		fill: var(--color-amber);
		opacity: 0.9;
	}
	.win.first {
		fill: var(--color-grass);
		opacity: 0.95;
	}
	.win.last {
		fill: var(--color-amber);
		opacity: 0.95;
	}
	.wall {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.2;
		opacity: 0.55;
	}
	.wall.hot {
		stroke: var(--color-amber);
		stroke-width: 1.8;
		opacity: 1;
	}
	.pin {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1;
	}
	.pin-t {
		text-anchor: middle;
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.caption {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.caption.soft {
		font-weight: 500;
		color: var(--color-muted);
	}
	.legend {
		display: flex;
		gap: 16px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.sw {
		display: inline-block;
		height: 11px;
		width: 11px;
		border-radius: 3px;
	}
	.sw.first {
		background: var(--color-grass);
	}
	.sw.last {
		background: var(--color-amber);
	}
	.strip {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.pill {
		display: flex;
		min-width: 54px;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-card);
		padding: 4px 8px;
		line-height: 1.2;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.pill b {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		color: var(--color-ink);
	}
	.pill small {
		font-size: 10px;
		color: var(--color-faint);
	}
	.pill.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.mini rect,
	.mini path {
		fill: var(--color-line);
		stroke: none;
		transition: opacity 0.4s;
	}
	.mini path {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.mini.ours rect {
		fill: var(--color-brand);
	}
	.mini.ours path {
		stroke: var(--color-brand);
	}
	.mini {
		transition: opacity 0.5s;
	}
	.mini.hide {
		opacity: 0;
	}
	.cheat {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 16px 16px 10px;
	}
	.cheat-title {
		margin: 0;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.rule {
		margin: 4px 0 12px;
		font-family: var(--font-display);
		font-size: 18px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.cheat-row {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) auto;
		grid-template-areas: 'p bar num' 'p note note';
		align-items: center;
		column-gap: 10px;
		border-radius: 10px;
		padding: 6px 8px;
	}
	.cheat-row.on {
		background: var(--color-brand-soft);
	}
	.cheat-row .mono {
		grid-area: p;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 15px;
		color: var(--color-ink);
	}
	.bar {
		grid-area: bar;
		height: 8px;
		border-radius: 999px;
		background: var(--color-paper);
	}
	.bar i {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--color-brand);
		opacity: 0.7;
	}
	.num {
		grid-area: num;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.note {
		grid-area: note;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.win,
		.pill,
		.mini,
		.mini rect {
			transition: none;
		}
	}
</style>
