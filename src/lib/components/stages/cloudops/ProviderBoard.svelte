<script lang="ts">
	// Shared guided engine for the AWS, Google Cloud, and Azure lessons. Following Nim's beats,
	// nimbus.com assembles itself layer by layer and every plain idea tile flips over to show the
	// provider's real service name. A memory beat spotlights one sticky pair, another shows the
	// same idea at all three providers, and the last beat sends a visitor through the board.
	// Matching the names yourself is an optional extra on the last beat.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import ProviderLogo from '$lib/components/ProviderLogo.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from '../webguide/seq';
	import {
		LAYERS,
		PHASES,
		SERVICES,
		VISIT_PATH,
		type ProviderBoardText,
		type ProviderId,
		type SlotKey
	} from './types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow,
		provider,
		sticky = 'vm'
	}: StageProps & { provider: ProviderId; sticky?: SlotKey } = $props();
	const tx = $derived(text as ProviderBoardText);
	const services = $derived(SERVICES[provider]);
	const OTHERS: ProviderId[] = ['aws', 'gcp', 'azure'];

	// Watch first, play optional, so the board is visible from the start and Next never locks.
	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const lastStep = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, lastStep)));
	const phase = $derived(PHASES[Math.min(step, PHASES.length - 1)]);
	const onLast = $derived(beat >= tx.intro.length - 1);

	let reduce = $derived(prefersReducedMotion());

	// ---- the watch part ----
	let flipOn = $state(true);
	let lit = $state<SlotKey | null>(null);
	let visited = $state<SlotKey[]>([]);

	function walk(after?: () => void): SeqStep[] {
		return [
			[
				500,
				() => {
					lit = null;
					visited = [];
				}
			],
			...VISIT_PATH.map(
				(k): SeqStep => [
					620,
					() => {
						lit = k;
						visited = [...visited, k];
					}
				]
			),
			[
				2200,
				() => {
					lit = null;
					after?.();
				}
			]
		];
	}

	// ---- the optional matching ----
	let playing = $state(false);
	let playLayer = $state(0);
	let placed = $state<Partial<Record<SlotKey, boolean>>>({});
	let picked = $state<SlotKey | null>(null);
	let miss = $state<SlotKey | null>(null);
	let wentLive = $state(false);
	let missTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => {
		// leaving the last beat ends the game, so the story always shows the full board
		if (!onLast) untrack(() => (playing = false));
	});

	const playDone = $derived(playing && playLayer >= LAYERS.length);
	const tray = $derived.by(() => {
		if (!playing || playDone) return [];
		const ks = LAYERS[playLayer];
		// rotated by one so the tiles never line up with their slots
		return [...ks.slice(1), ks[0]].filter((k) => !placed[k]);
	});

	function startPlay() {
		playing = true;
		playLayer = 0;
		placed = {};
		picked = null;
		wentLive = false;
		peek = null;
	}
	function pick(k: SlotKey) {
		picked = picked === k ? null : k;
	}
	function drop(slot: SlotKey, li: number) {
		if (!playing || li !== playLayer || placed[slot] || !picked) return;
		if (picked !== slot) {
			miss = slot;
			onstate?.('miss');
			clearTimeout(missTimer);
			missTimer = setTimeout(() => (miss = null), 500);
			return;
		}
		placed = { ...placed, [slot]: true };
		picked = null;
		onstate?.(slot);
		if (LAYERS[playLayer].every((k) => placed[k])) playLayer += 1;
	}

	$effect(() => {
		const ph = phase;
		const still = reduce;
		const p = playing;
		const done = playDone;
		return untrack(() => {
			lit = null;
			visited = [];
			flipOn = true;
			if (p) {
				if (!done) return;
				if (still) {
					visited = [...VISIT_PATH];
					wentLive = true;
					onstate?.('live');
					return;
				}
				return runSeq(
					walk(() => {
						if (!wentLive) {
							wentLive = true;
							onstate?.('live');
						}
					})
				);
			}
			if (still) {
				if (ph.kind === 'live') visited = [...VISIT_PATH];
				return;
			}
			if (ph.kind === 'layer' || ph.kind === 'ingat')
				return runSeq(
					[
						[1000, () => (flipOn = false)],
						[3000, () => (flipOn = true)]
					],
					true
				);
			if (ph.kind === 'live') return runSeq(walk(), true);
		});
	});

	/** Whether a tile shows its service name (the back) right now. */
	function flipped(k: SlotKey, li: number): boolean {
		if (playing) return !!placed[k];
		const ph = phase;
		if (ph.kind === 'meet') return false;
		if (ph.kind === 'layer') return li < ph.layer || (li === ph.layer && flipOn);
		if (ph.kind === 'ingat') return k !== sticky || flipOn;
		return true;
	}
	function bandState(li: number): 'now' | 'later' | '' {
		if (playing) return playDone ? '' : li === playLayer ? 'now' : li > playLayer ? 'later' : '';
		const ph = phase;
		if (ph.kind === 'layer') return li === ph.layer ? 'now' : li > ph.layer ? 'later' : '';
		return '';
	}
	const spot = $derived(!playing && (phase.kind === 'ingat' || phase.kind === 'others'));

	const note = $derived.by(() => {
		if (!playing) return '';
		if (playDone) return wentLive ? tx.noteLive : '';
		if (picked) return tx.placeHint.replace('{s}', services[picked]);
		return tx.pickHint;
	});
</script>

{#snippet visual(_: number)}
	<div class="vis">
		{#if onLast}
			<div class="extra">
				{#if playing && !playDone}
					<span class="tlabel">{tx.trayLabel}</span>
					<div class="tiles">
						{#each tray as k (k)}
							<button
								type="button"
								class="pickme"
								class:on={picked === k}
								aria-pressed={picked === k}
								onclick={() => pick(k)}>{services[k]}</button
							>
						{/each}
					</div>
				{:else}
					<button type="button" class="play" onclick={startPlay}>{tx.playBtn}</button>
				{/if}
				{#if note}<p class="note">{note}</p>{/if}
			</div>
		{/if}

		<div class="head">
			<ProviderLogo id={provider} size={20} />
			<b>{tx.boardTitle}</b>
		</div>

		<div class="board">
			<div class="you" class:lit={visited.length > 0}>
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
				<div class="band {bandState(li)}">
					<span class="blabel">{tx.layers[li]}</span>
					<div class="slots">
						{#each keys as k, n (k)}
							{@const fl = flipped(k, li)}
							<button
								type="button"
								class="slot"
								class:ready={playing && li === playLayer && !!picked && !placed[k]}
								class:nope={miss === k}
								class:lit={lit === k}
								class:seen={visited.includes(k) && lit !== k}
								class:spot={spot && k === sticky}
								class:dim={spot && k !== sticky}
								tabindex={playing && li === playLayer && !placed[k] ? 0 : -1}
								aria-label="{tx.concepts[k]}{fl ? `, ${services[k]}` : ''}"
								onclick={() => drop(k, li)}
							>
								<span class="card" class:flip={fl} style="transition-delay:{n * 0.16}s">
									<span class="face front">
										<b>{miss === k ? tx.missTag : tx.concepts[k]}</b>
									</span>
									<span class="face back">
										<b>{services[k]}</b>
										<small>{tx.concepts[k]}</small>
									</span>
								</span>
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		{#if !playing && phase.kind === 'others'}
			<div class="same">
				<span class="tlabel">{tx.sameIdea.replace('{c}', tx.concepts[sticky])}</span>
				<div class="names">
					{#each OTHERS as p (p)}
						<span class="tag" class:me={p === provider}>
							<ProviderLogo id={p} size={14} />
							{SERVICES[p][sticky]}
						</span>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide
		steps={tx.steps}
		active={playing ? lastStep : step}
		onselect={(k) => {
			if (!playing) peek = k;
		}}
		{visual}
	/>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: min(100%, 440px);
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

	.extra {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.play {
		border-radius: 999px;
		background: var(--btn-primary);
		padding: 8px 18px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
	}
	.tlabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.tiles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 7px;
	}
	.pickme {
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 13px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.07);
		transition:
			transform 0.15s ease,
			border-color 0.15s ease;
	}
	.pickme.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
		transform: translateY(-2px);
	}
	.note {
		margin: 0;
		text-align: center;
		font-size: 12.5px;
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
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
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
		transition:
			opacity 0.4s ease,
			border-color 0.4s ease;
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
		width: 100%;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.slot {
		width: 31%;
		max-width: 132px;
		height: 44px;
		border-radius: 9px;
		perspective: 600px;
		transition: opacity 0.4s ease;
	}
	.slot.dim {
		opacity: 0.4;
	}
	.card {
		position: relative;
		display: block;
		height: 100%;
		width: 100%;
		transform-style: preserve-3d;
		transition: transform 0.7s cubic-bezier(0.45, 0, 0.3, 1);
	}
	.card.flip {
		transform: rotateY(180deg);
	}
	.face {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1px;
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 2px 4px;
		line-height: 1.15;
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transition:
			border-color 0.25s ease,
			background 0.25s ease,
			box-shadow 0.25s ease;
	}
	.front b {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.back {
		transform: rotateY(180deg);
		border-color: color-mix(in srgb, var(--color-grass) 50%, var(--color-line));
	}
	.back b {
		font-size: 12px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.back small {
		font-size: 9px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.slot.ready .front {
		border-color: var(--color-brand);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
	}
	.slot.nope .front {
		border-color: var(--color-danger);
	}
	.slot.nope .front b {
		color: var(--color-danger);
	}
	.slot.lit .face {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand) 18%, transparent);
	}
	.slot.seen .face {
		background: var(--color-grass-soft);
	}
	.slot.spot .face {
		border-color: var(--color-grass);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-grass) 18%, transparent);
	}

	.same {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.names {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.tag {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 11px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tag.me {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-ink);
	}

	@media (min-width: 768px) {
		.slot {
			height: 50px;
		}
		.front b {
			font-size: 12.5px;
		}
		.back b {
			font-size: 13px;
		}
		.back small {
			font-size: 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card,
		.face,
		.band,
		.slot,
		.pickme {
			transition: none;
		}
	}
</style>
