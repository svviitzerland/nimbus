<script lang="ts">
	// Shared engine for the AWS, Google Cloud, and Azure lessons. The learner builds nimbus.com
	// layer by layer, matching each real service tile to the concept it stands for, then sends a
	// visitor through the finished board. Each match emits the slot key so Nim can link it back.
	import { onDestroy } from 'svelte';
	import ProviderLogo from '$lib/components/ProviderLogo.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import { LAYERS, VISIT_PATH, type ProviderBoardText, type SlotKey } from './types';

	let {
		text,
		oncomplete,
		onstate,
		provider,
		services
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		provider: 'aws' | 'gcp' | 'azure';
		services: Record<SlotKey, string>;
	} = $props();
	const tx = $derived(text as ProviderBoardText);

	let layer = $state(0);
	let placed = $state<Partial<Record<SlotKey, boolean>>>({});
	let picked = $state<SlotKey | null>(null);
	let miss = $state<SlotKey | null>(null);
	let lit = $state<SlotKey | null>(null);
	let visited = $state<SlotKey[]>([]);
	let running = $state(false);
	let wentLive = $state(false);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	const allDone = $derived(layer >= LAYERS.length);
	// tiles of the current layer, rotated by one so they never line up with their slots
	const tray = $derived.by(() => {
		if (allDone) return [];
		const ks = LAYERS[layer];
		return [...ks.slice(1), ks[0]].filter((k) => !placed[k]);
	});

	function pick(k: SlotKey) {
		picked = picked === k ? null : k;
	}

	function drop(slot: SlotKey, li: number) {
		if (li !== layer || placed[slot] || !picked) return;
		if (picked !== slot) {
			miss = slot;
			onstate?.('miss');
			at(450, () => (miss = null));
			return;
		}
		placed = { ...placed, [slot]: true };
		picked = null;
		onstate?.(slot);
		if (LAYERS[layer].every((k) => placed[k] || k === slot)) layer += 1;
	}

	function visit() {
		if (running) return;
		running = true;
		visited = [];
		VISIT_PATH.forEach((k, i) => {
			at(380 * i, () => {
				lit = k;
				visited = [...visited, k];
			});
		});
		at(380 * VISIT_PATH.length, () => {
			lit = null;
			running = false;
			wentLive = true;
			onstate?.('live');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		});
	}

	const note = $derived.by(() => {
		if (wentLive) return tx.noteLive;
		if (allDone) return tx.noteDone;
		if (picked) return tx.placeHint.replace('{s}', services[picked]);
		return tx.pickHint;
	});

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="head">
		<ProviderLogo id={provider} size={20} />
		<b>{tx.boardTitle}</b>
		<span class="prog"
			>{tx.layerTag
				.replace('{n}', String(Math.min(layer, LAYERS.length)))
				.replace('{t}', String(LAYERS.length))}</span
		>
	</div>

	<!-- the tiles to place, up top so they stay clear of Nim -->
	<div class="tray">
		{#if allDone}
			<button type="button" class="cta" disabled={running} onclick={visit}>{tx.liveBtn}</button>
		{:else}
			<span class="tlabel">{tx.trayLabel}</span>
			<div class="tiles">
				{#each tray as k (k)}
					<button
						type="button"
						class="tile"
						class:on={picked === k}
						aria-pressed={picked === k}
						onclick={() => pick(k)}>{services[k]}</button
					>
				{/each}
			</div>
		{/if}
	</div>

	<p class="note">{note}</p>

	<!-- the board itself, from the visitor down to the ops tools -->
	<div class="board">
		<div class="you" class:lit={running && visited.length > 0}>
			<svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden="true">
				<rect
					x="1"
					y="1"
					width="12"
					height="18"
					rx="2.5"
					stroke="currentColor"
					stroke-width="1.6"
				/>
				<path d="M5.5 16h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
			</svg>
			<span>{tx.youLabel}</span>
		</div>
		{#each LAYERS as keys, li (li)}
			<div class="band" class:now={li === layer} class:later={li > layer}>
				<span class="blabel">{tx.layers[li]}</span>
				<div class="slots">
					{#each keys as k (k)}
						<button
							type="button"
							class="slot"
							class:filled={placed[k]}
							class:ready={li === layer && !!picked && !placed[k]}
							class:nope={miss === k}
							class:lit={lit === k}
							class:seen={visited.includes(k) && lit !== k}
							disabled={li !== layer || !!placed[k]}
							onclick={() => drop(k, li)}
						>
							<span class="concept">{tx.concepts[k]}</span>
							{#if placed[k]}
								<span class="svc">{services[k]}</span>
							{:else if miss === k}
								<span class="svc bad">{tx.missTag}</span>
							{:else}
								<span class="svc empty">?</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 9px;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-ink);
	}
	.head b {
		font-size: 13.5px;
	}
	.prog {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 2px 9px;
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-brand);
		font-variant-numeric: tabular-nums;
	}

	.tray {
		display: flex;
		min-height: 62px;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.tlabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.tiles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 7px;
	}
	.tile {
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 13px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.07);
		animation: pop 0.3s ease both;
		transition:
			transform 0.15s ease,
			border-color 0.15s ease;
	}
	.tile.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
		transform: translateY(-2px);
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 700;
	}
	.cta:disabled {
		opacity: 0.55;
	}
	.note {
		min-height: 1.4em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.board {
		position: relative;
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 7px;
	}
	/* one solid spine the request travels along */
	.board::before {
		content: '';
		position: absolute;
		top: 10px;
		bottom: 10px;
		left: 50%;
		width: 2px;
		background: var(--color-line);
		transform: translateX(-50%);
	}
	.you {
		position: relative;
		display: flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 10px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		transition: color 0.2s ease;
	}
	.you.lit {
		color: var(--color-brand);
		border-color: var(--color-brand);
	}
	.band {
		position: relative;
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 6px 6px 7px;
		transition: opacity 0.3s ease;
	}
	.band.now {
		border-color: color-mix(in srgb, var(--color-brand) 45%, var(--color-line));
		background: var(--color-card);
	}
	.band.later {
		opacity: 0.45;
	}
	.blabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.slots {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.slot {
		display: flex;
		width: 108px;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 4px;
		line-height: 1.2;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			box-shadow 0.2s ease;
	}
	.slot.ready {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
	}
	.slot.filled {
		border-color: color-mix(in srgb, var(--color-grass) 55%, var(--color-line));
	}
	.slot.nope {
		border-color: var(--color-danger);
		animation: shake 0.4s ease;
	}
	.slot.lit {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 18%, transparent);
	}
	.slot.seen {
		background: var(--color-grass-soft);
	}
	.concept {
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.svc {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.svc.empty {
		color: var(--color-line);
	}
	.svc.bad {
		color: var(--color-danger);
	}

	@keyframes pop {
		from {
			transform: scale(0.7);
			opacity: 0;
		}
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tile,
		.slot.nope {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 11px;
		}
		.slot {
			width: 132px;
			padding: 7px 6px;
		}
		.concept {
			font-size: 10.5px;
		}
		.svc {
			font-size: 13px;
		}
		.tile {
			font-size: 13.5px;
		}
		.note {
			font-size: 13.5px;
		}
	}
</style>
