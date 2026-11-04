<script lang="ts">
	// Guided IPv4 and IPv6 lesson. An IPv4 address, then the pool of every IPv4 address filling
	// up by itself through the years until it runs dry, then the long IPv6 address and the IPv6
	// space where the whole IPv4 pool shrinks into one dot. The last beat offers one optional
	// button that hands an address to every grain of sand.
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { Ipv6Text } from '$lib/chapters/network/ipv6/types';

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
	const tx = $derived(text as Ipv6Text);
	const LAST = $derived(tx.intro.length - 1);

	const V4 = ['192', '168', '1', '20'];
	const V6 = ['2001', '0db8', '85a3', '0000', '0000', '8a2e', '0370', '7334'];
	const V4_SHORT = '192.168.1.20';
	const V6_SHORT = '2001:db8:85a3::7334';
	// How full the pool was, roughly, as the years went by (out of 100 squares).
	const YEARS: [number, number][] = [
		[1981, 1],
		[1990, 3],
		[1995, 8],
		[2000, 24],
		[2005, 47],
		[2008, 72],
		[2010, 92],
		[2011, 100]
	];
	const CELLS = Array.from({ length: 100 }, (_, k) => k);
	// A little heap of sand, placed by a fixed recipe so the server and browser agree.
	const GRAINS = Array.from({ length: 34 }, (_, k) => ({
		x: 262 + Math.cos(k * 2.4) * (2 + (k % 6) * 1.3),
		y: 92 + Math.sin(k * 2.4) * (2 + (k % 6) * 1.3)
	}));

	let still = $state(false);
	let t = $state(0);
	let peek = $state<number | null>(null);
	let sand = $state(false);

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
		const id = setInterval(() => (t += 1), 1300);
		return () => clearInterval(id);
	});

	const yearStep = $derived(
		still ? YEARS.length - 1 : Math.min(t % (YEARS.length + 3), YEARS.length - 1)
	);

	function filled(i: number) {
		if (i === 1) return 1;
		if (i === 2) return YEARS[yearStep][1];
		return 100;
	}

	function giveSand() {
		if (sand) return;
		sand = true;
		onstate?.('sand');
	}
</script>

<div class="wrap">
	{#if beat >= LAST}
		<div class="play" in:fade={{ duration: 200 }}>
			<button type="button" class="ask" disabled={sand} onclick={giveSand}>{tx.sandBtn}</button>
		</div>
	{/if}

	<Guide steps={tx.steps} active={peek ?? beat} onselect={(k) => (peek = k)}>
		{#snippet visual(i)}
			<div class="scene">
				{#if i === 0}
					{@render v4()}
				{:else if i <= 3}
					{@render pool(i)}
				{:else if i === 4}
					{@render v6()}
				{:else if i === 6}
					{@render rule()}
				{:else if i === 7}
					{@render versions()}
				{:else}
					{@render field(i)}
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

{#snippet v4()}
	<div class="addr" in:fade={{ duration: 300 }}>
		<p class="cap">{tx.v4Label}</p>
		<div class="chips">
			{#each V4 as n, k (k)}
				{#if k > 0}<span class="sep dot">.</span>{/if}
				<span class="part">
					<span class="chip">{n}</span>
					<span class="hint">{tx.partHint}</span>
				</span>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet pool(i: number)}
	{@const n = filled(i)}
	<svg viewBox="0 0 280 300" class="svg" role="img" aria-label={tx.poolLabel}>
		<text x="140" y="16" class="head">{tx.poolLabel}</text>
		<text x="140" y="32" class="sub">{tx.poolCount}</text>
		{#each CELLS as k (k)}
			<rect
				x={20 + (k % 10) * 24}
				y={46 + Math.floor(k / 10) * 24}
				width="20"
				height="20"
				rx="4"
				class="cell"
				class:on={k < n}
				class:full={n >= 100}
			/>
		{/each}
		{#if i === 2}
			<text x="140" y="294" class="year"
				>{tx.yearLabel.replace('{year}', String(YEARS[yearStep][0]))}</text
			>
		{/if}
	</svg>
	{#if i === 3}
		<div class="outside" in:fade={{ duration: 400 }}>
			{#each ['phone', 'watch', 'tv', 'laptop'] as const as k (k)}
				<span class="waiting"><Device kind={k} size={34} tone="var(--color-amber)" /></span>
			{/each}
			<span class="tag-amber">{tx.outsideLabel}</span>
		</div>
	{/if}
{/snippet}

{#snippet v6()}
	<div class="addr" in:fade={{ duration: 300 }}>
		<p class="cap">{tx.v6Label}</p>
		<div class="chips six">
			{#each V6 as g, k (k)}
				{#if k > 0 && k !== 4}<span class="sep colon">:</span>{/if}
				{#if k === 4}<span class="break"></span>{/if}
				<span class="chip hex" style="animation-delay:{k * 0.12}s" class:pop={!still}>{g}</span>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet rule()}
	<div class="rule" in:fade={{ duration: 300 }}>
		<div class="rule-row">
			<span class="badge">{tx.v4Label}</span>
			<code class="mono"
				>{#each V4_SHORT.split('') as c, k (k)}<span class:dot={c === '.'}>{c}</span>{/each}</code
			>
			<span class="hint">{tx.ruleV4}</span>
		</div>
		<div class="rule-row">
			<span class="badge six">{tx.v6Label}</span>
			<code class="mono"
				>{#each V6_SHORT.split('') as c, k (k)}<span
						class:colon={c === ':'}
						class:letter={/[a-f]/.test(c)}>{c}</span
					>{/each}</code
			>
			<span class="hint">{tx.ruleV6}</span>
		</div>
	</div>
{/snippet}

{#snippet versions()}
	<div class="versions" in:fade={{ duration: 300 }}>
		{#each [4, 5, 6] as v (v)}
			<div class="ver" class:gone={v === 5}>
				<span class="ver-n">{v}</span>
				{#if v === 5}<span class="hint">{tx.skipped}</span>{/if}
			</div>
		{/each}
	</div>
{/snippet}

{#snippet field(i: number)}
	<svg viewBox="0 0 300 280" class="svg" role="img" aria-label={tx.fieldLabel}>
		<text x="150" y="16" class="head">{tx.fieldLabel}</text>
		<text x="150" y="32" class="sub">{tx.fieldCount}</text>
		<rect x="10" y="44" width="280" height="226" rx="18" class="space" />
		{#key i}
			{#if !still && i === 5}
				<g class="shrink" style="transform-origin:60px 150px">
					{#each CELLS as k (k)}
						<rect
							x={10 + (k % 10) * 10}
							y={100 + Math.floor(k / 10) * 10}
							width="8"
							height="8"
							rx="2"
							class="cell on full"
						/>
					{/each}
				</g>
			{/if}
		{/key}
		<circle cx="60" cy="150" r="2.6" class="speck" />
		<path d="M64 154 L104 196" class="pointer" />
		<text x="108" y="206" class="label">{tx.dotLabel}</text>
		{#if sand && i === LAST}
			<g in:fade={{ duration: 500 }}>
				{#each GRAINS as g, k (k)}
					<circle cx={g.x} cy={g.y} r="0.9" class="grain" />
				{/each}
				<path d="M256 100 L222 132" class="pointer" />
				<text x="218" y="144" class="label end">{tx.sandLabel}</text>
			</g>
		{/if}
	</svg>
	{#if i === LAST}
		<div class="both" in:fade={{ duration: 300 }}>
			<Device kind="phone" size={30} />
			<div>
				<p class="both-t">{tx.bothLabel}</p>
				<p class="mono small">{V4_SHORT}</p>
				<p class="mono small">{V6_SHORT}</p>
			</div>
		</div>
	{/if}
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
		max-width: 420px;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.svg {
		width: 100%;
		height: auto;
	}
	.head {
		text-anchor: middle;
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.sub,
	.year {
		text-anchor: middle;
		font-size: 10.5px;
		fill: var(--color-muted);
	}
	.year {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.cell {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1;
		transition: fill 0.5s;
	}
	.cell.on {
		fill: var(--color-brand);
		stroke: none;
		opacity: 0.85;
	}
	.cell.on.full {
		fill: var(--color-amber);
	}
	.space {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.speck {
		fill: var(--color-amber);
	}
	.grain {
		fill: var(--color-amber);
	}
	.pointer {
		stroke: var(--color-faint);
		stroke-width: 1;
		fill: none;
	}
	.label {
		font-size: 11px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.label.end {
		text-anchor: end;
	}
	.shrink {
		animation: shrink 2.6s cubic-bezier(0.5, 0, 0.2, 1) 0.4s both;
	}
	@keyframes shrink {
		from {
			transform: scale(1);
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		to {
			transform: scale(0.03);
			opacity: 0;
		}
	}
	.addr {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 24px 0;
	}
	.cap {
		margin: 0;
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
		gap: 4px;
	}
	.chips.six {
		max-width: 340px;
	}
	.break {
		flex-basis: 100%;
		height: 4px;
	}
	.part {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.chip {
		border: 1.5px solid var(--color-brand);
		border-radius: 12px;
		background: var(--color-brand-soft);
		padding: 10px 12px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 22px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.chip.hex {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		padding: 8px 9px;
		font-size: 17px;
	}
	.pop {
		animation: pop 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
	}
	@keyframes pop {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
	}
	.sep {
		align-self: center;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 22px;
		font-weight: 800;
	}
	.sep.dot,
	.dot {
		color: var(--color-brand);
	}
	.sep.colon,
	.colon {
		color: var(--color-grass);
	}
	.letter {
		color: var(--color-grass);
		font-weight: 800;
	}
	.hint {
		font-size: 11px;
		color: var(--color-faint);
	}
	.outside {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.waiting {
		animation: wait 2.4s ease-in-out infinite;
	}
	@keyframes wait {
		50% {
			transform: translateY(-3px);
		}
	}
	.tag-amber {
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 3px 10px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.rule {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 14px;
		padding: 16px 0;
	}
	.rule-row {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 14px;
	}
	.badge {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 2px 10px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.badge.six {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.mono {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 19px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.mono.small {
		margin: 0;
		font-size: 12px;
	}
	.versions {
		display: flex;
		gap: 18px;
		padding: 40px 0;
	}
	.ver {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.ver-n {
		display: grid;
		height: 64px;
		width: 64px;
		place-items: center;
		border-radius: 999px;
		background: var(--color-brand-soft);
		font-family: var(--font-display);
		font-size: 28px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.ver.gone .ver-n {
		background: var(--color-paper);
		color: var(--color-faint);
		text-decoration: line-through;
		box-shadow: inset 0 0 0 1px var(--color-line);
	}
	.both {
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 16px;
	}
	.both-t {
		margin: 0 0 2px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.cell {
			transition: none;
		}
		.waiting,
		.pop,
		.shrink {
			animation: none;
		}
	}
</style>
