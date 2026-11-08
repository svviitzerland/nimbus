<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ThreatSpot, ThreatsText } from '$lib/chapters/security/threats/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as ThreatsText);

	// Where each spot sits on the map, in percent of the map box.
	const spots: { id: ThreatSpot; x: number; y: number }[] = [
		{ id: 'phone', x: 14, y: 12 },
		{ id: 'wifi', x: 50, y: 12 },
		{ id: 'login', x: 86, y: 12 },
		{ id: 'admin', x: 14, y: 45 },
		{ id: 'server', x: 50, y: 45 },
		{ id: 'db', x: 86, y: 45 },
		{ id: 'vendor', x: 14, y: 76 },
		{ id: 'backup', x: 86, y: 76 }
	];
	const pos = Object.fromEntries(spots.map((s) => [s.id, s])) as unknown as Record<
		ThreatSpot,
		{ x: number; y: number }
	>;
	// The wires between the parts of the shop.
	const links: [ThreatSpot, ThreatSpot][] = [
		['phone', 'wifi'],
		['wifi', 'login'],
		['login', 'server'],
		['admin', 'server'],
		['server', 'db'],
		['vendor', 'server'],
		['db', 'backup']
	];
	const NEED = 3;

	const marked = new SvelteSet<ThreatSpot>();
	let selected = $state<ThreatSpot | null>(null);
	let compared = $state(false);
	let completed = false;

	function tap(id: ThreatSpot) {
		selected = id;
		if (compared || marked.has(id)) return;
		marked.add(id);
		if (id === 'vendor') onstate?.('vendor');
		else if (id === 'backup') onstate?.('backup');
		else if (marked.size === 1) onstate?.('first');
	}

	function compare() {
		compared = true;
		const all = marked.size === spots.length;
		onstate?.(all ? 'compareAll' : 'compareSome');
		selected = all ? selected : (spots.find((s) => !marked.has(s.id))?.id ?? null);
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}

	function reset() {
		marked.clear();
		selected = null;
		compared = false;
	}

	const missed = $derived(spots.filter((s) => !marked.has(s.id)).map((s) => s.id));
</script>

{#snippet icon(id: ThreatSpot)}
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		{#if id === 'phone'}
			<rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8" />
			<path d="M11 18h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		{:else if id === 'wifi'}
			<path
				d="M3.5 9.5a12 12 0 0 1 17 0M6.5 12.8a8 8 0 0 1 11 0M9.5 16a4 4 0 0 1 5 0"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
			/>
			<circle cx="12" cy="19" r="1.3" fill="currentColor" />
		{:else if id === 'login'}
			<rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8" />
			<path d="M7 10h10M7 14h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		{:else if id === 'server'}
			<rect x="4" y="3.5" width="16" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
			<rect x="4" y="13.5" width="16" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
			<circle cx="8" cy="7" r="1.1" fill="currentColor" />
			<circle cx="8" cy="17" r="1.1" fill="currentColor" />
		{:else if id === 'db'}
			<ellipse cx="12" cy="6" rx="7" ry="2.8" stroke="currentColor" stroke-width="1.8" />
			<path
				d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8"
				stroke="currentColor"
				stroke-width="1.8"
			/>
		{:else if id === 'admin'}
			<rect x="5" y="5" width="14" height="10" rx="1.8" stroke="currentColor" stroke-width="1.8" />
			<path d="M3 18.5h18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		{:else if id === 'vendor'}
			<path
				d="M14.5 5.5a4 4 0 0 0 4.9 4.9L20 11l-9 9a2.1 2.1 0 0 1-3-3l9-9 .6.6"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		{:else}
			<rect x="4" y="6" width="16" height="12" rx="2.5" stroke="currentColor" stroke-width="1.8" />
			<circle cx="12" cy="12" r="2.6" stroke="currentColor" stroke-width="1.8" />
		{/if}
	</svg>
{/snippet}

<div class="wrap">
	<div class="btns">
		{#if !compared}
			<CallToActionButton onclick={compare} disabled={marked.size < NEED}>
				{tx.compareBtn}
			</CallToActionButton>
		{:else}
			<button type="button" class="ghost" onclick={reset}>{tx.resetBtn}</button>
		{/if}
	</div>
	<p class="hint">
		{#if compared}
			{tx.score.replace('{n}', String(marked.size)).replace('{total}', String(spots.length))}
		{:else if marked.size < NEED}
			{marked.size === 0 ? tx.tapHint : tx.compareNeed.replace('{n}', String(NEED - marked.size))}
		{:else}
			{tx.tapHint}
		{/if}
	</p>

	<!-- the shop map -->
	<div class="map">
		<svg class="wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			{#each links as [a, b] (a + b)}
				<line
					x1={pos[a].x}
					y1={pos[a].y}
					x2={pos[b].x}
					y2={pos[b].y}
					stroke="var(--color-line)"
					stroke-width="2"
					vector-effect="non-scaling-stroke"
				/>
			{/each}
		</svg>
		<span class="shopzone"><span>nimbus.com</span></span>
		{#each spots as s (s.id)}
			<button
				type="button"
				class="spot"
				class:marked={marked.has(s.id)}
				class:missed={compared && !marked.has(s.id)}
				class:sel={selected === s.id}
				style="left:{s.x}%; top:{s.y}%"
				onclick={() => tap(s.id)}
			>
				<span class="disc">
					{@render icon(s.id)}
					{#if marked.has(s.id)}<span class="badge pop">!</span>{/if}
				</span>
				<span class="sname">{tx.spots[s.id].name}</span>
			</button>
		{/each}
	</div>

	<!-- what the selected spot means -->
	<div class="panel">
		{#if selected}
			{#key selected}
				<div class="pin pop">
					<p class="ptitle">
						{tx.spots[selected].name}
						{#if compared}
							<span class="ptag" class:miss={!marked.has(selected)}
								>{marked.has(selected) ? tx.foundTag : tx.missedTag}</span
							>
						{/if}
					</p>
					<p class="line"><b>{tx.threatLabel}</b>{tx.spots[selected].threat}</p>
					{#if compared}
						<p class="line fix"><b>{tx.fixLabel}</b>{tx.spots[selected].fix}</p>
					{/if}
				</div>
			{/key}
		{/if}
		{#if compared && missed.length}
			<div class="missed">
				<span class="mlabel">{tx.missedLabel}</span>
				{#each missed as m (m)}
					<button type="button" class="mchip" onclick={() => (selected = m)}
						>{tx.spots[m].name}</button
					>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 380px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		overflow-y: auto;
	}
	.btns {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		padding: 7px 14px;
	}
	.ghost:hover {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.hint {
		min-height: 1.4em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.map {
		position: relative;
		width: 100%;
		aspect-ratio: 10 / 8;
		flex: none;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
	}
	.wires {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.shopzone {
		position: absolute;
		left: 30%;
		right: 3%;
		top: 30%;
		bottom: 30%;
		border-radius: 14px;
		background: var(--color-brand-soft);
		opacity: 0.6;
	}
	.shopzone span {
		position: absolute;
		left: 8px;
		bottom: 4px;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.spot {
		position: absolute;
		z-index: 1;
		display: flex;
		width: 76px;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		transform: translate(-50%, -20px);
	}
	.disc {
		position: relative;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s,
			transform 0.15s;
	}
	.spot:hover .disc {
		border-color: var(--color-brand);
	}
	.spot.sel .disc {
		transform: scale(1.08);
	}
	.spot.marked .disc {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.spot.missed .disc {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.badge {
		position: absolute;
		top: -4px;
		right: -4px;
		display: grid;
		place-items: center;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: var(--color-danger);
		color: #fff;
		font-size: 10px;
		font-weight: 900;
	}
	.sname {
		text-align: center;
		font-size: 9.5px;
		font-weight: 700;
		line-height: 1.15;
		color: var(--color-ink);
	}
	.panel {
		display: flex;
		width: 100%;
		min-height: 92px;
		flex-direction: column;
		gap: 6px;
	}
	.pin {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.ptitle {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.ptag {
		border-radius: 999px;
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-size: 9px;
		font-weight: 800;
		padding: 1px 7px;
	}
	.ptag.miss {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.line {
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	.line b {
		display: block;
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.line.fix b {
		color: var(--color-grass);
	}
	.missed {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
	}
	.mlabel {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.mchip {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 10px;
		font-weight: 700;
		padding: 2px 8px;
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.9);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.hint {
			font-size: 14px;
		}
		.disc {
			width: 48px;
			height: 48px;
		}
		.spot {
			transform: translate(-50%, -24px);
		}
		.sname {
			font-size: 11px;
		}
		.line {
			font-size: 12.5px;
		}
	}
</style>
