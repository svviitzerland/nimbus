<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { AiCardId, AiRing, WhatIsAiText } from '$lib/chapters/ai/what-is-ai/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as WhatIsAiText);

	/** Where each card truly belongs. Language independent, so it lives here. */
	const home: Record<AiCardId, AiRing> = {
		calc: 'out',
		chess: 'ai',
		spam: 'ml',
		price: 'ml',
		face: 'dl',
		chat: 'gen',
		image: 'gen'
	};

	/** Ring geometry in container width units (cqw), bottom aligned so the labels sit in each band. */
	const rings: { id: Exclude<AiRing, 'out'>; d: number; top: number }[] = [
		{ id: 'ai', d: 88, top: 14 },
		{ id: 'ml', d: 68, top: 34 },
		{ id: 'dl', d: 48, top: 54 },
		{ id: 'gen', d: 30, top: 72 }
	];

	let selected = $state<AiCardId | null>(null);
	let placed = $state<Record<AiRing, AiCardId[]>>({ out: [], ai: [], ml: [], dl: [], gen: [] });
	let flash = $state<{ ring: AiRing; ok: boolean } | null>(null);
	let flashTimer: ReturnType<typeof setTimeout> | undefined;
	let done = false;

	const placedIds = $derived(new Set(Object.values(placed).flat()));
	const tray = $derived(tx.cards.filter((c) => !placedIds.has(c.id)));
	const count = $derived(placedIds.size);
	const allDone = $derived(count === tx.cards.length);
	const nameOf = (id: AiCardId) => tx.cards.find((c) => c.id === id)?.name ?? '';

	function pick(id: AiCardId) {
		selected = selected === id ? null : id;
	}

	function blink(ring: AiRing, ok: boolean) {
		clearTimeout(flashTimer);
		flash = { ring, ok };
		flashTimer = setTimeout(() => (flash = null), ok ? 650 : 520);
	}

	function drop(ring: AiRing) {
		const id = selected;
		if (!id) return;
		if (home[id] === ring) {
			placed[ring] = [...placed[ring], id];
			selected = null;
			blink(ring, true);
			onstate?.(id);
			if (!done && placedIds.size === tx.cards.length) {
				done = true;
				oncomplete?.();
			}
		} else {
			blink(ring, false);
			onstate?.(`${id}_wrong`);
		}
	}

	function dragStart(e: DragEvent, id: AiCardId) {
		selected = id;
		e.dataTransfer?.setData('text/plain', id);
		if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
	}
	function dragOver(e: DragEvent) {
		if (selected) e.preventDefault();
	}
	function dropOn(e: DragEvent, ring: AiRing) {
		e.preventDefault();
		drop(ring);
	}
</script>

{#snippet icon(id: AiCardId)}
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="1.9"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if id === 'calc'}
			<rect x="5" y="3" width="14" height="18" rx="2.5" />
			<path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01" />
		{:else if id === 'chess'}
			<circle cx="12" cy="6" r="2.6" />
			<path d="M10 10h4l1.2 6H8.8zM7 20h10l-.8-4H7.8z" />
		{:else if id === 'spam'}
			<rect x="3" y="5" width="18" height="14" rx="2.5" />
			<path d="m3.5 7 8.5 6 8.5-6" />
		{:else if id === 'price'}
			<path d="M4 11 12 4l8 7M6 9.5V20h12V9.5M10 20v-5h4v5" />
		{:else if id === 'face'}
			<path
				d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
			/>
			<path d="M9.5 9.5v1M14.5 9.5v1M9.5 15c1.4 1 3.6 1 5 0" />
		{:else if id === 'chat'}
			<path d="M4 5h16v11H10l-4.5 3.5V16H4z" />
			<path d="M8 9h8M8 12.5h5" />
		{:else}
			<rect x="3" y="4" width="18" height="16" rx="2.5" />
			<circle cx="9" cy="9.5" r="1.6" />
			<path d="m4 18 5-5 4 4 3-3 4 4" />
		{/if}
	</svg>
{/snippet}

{#snippet chips(ring: AiRing)}
	<span class="chips">
		{#each placed[ring] as id (id)}
			<span class="chip" title={nameOf(id)}>{@render icon(id)}</span>
		{/each}
	</span>
{/snippet}

<div class="flex w-full flex-col items-center gap-3">
	<!-- the tray of cards to sort, kept up top and clear of Nim -->
	<div class="tray" role="group">
		{#each tray as c (c.id)}
			<button
				type="button"
				class="card"
				class:sel={selected === c.id}
				aria-pressed={selected === c.id}
				draggable="true"
				ondragstart={(e) => dragStart(e, c.id)}
				onclick={() => pick(c.id)}
			>
				<i>{@render icon(c.id)}</i>
				<span class="txt"><b>{c.name}</b><small>{c.sub}</small></span>
			</button>
		{/each}
	</div>

	<p class="hint" class:strong={allDone}>
		{#if allDone}
			{tx.doneNote}
		{:else if selected}
			{tx.ringHint.replace('{name}', nameOf(selected))}
		{:else}
			{tx.pickHint}
		{/if}
		<span class="count">{count}/{tx.cards.length}</span>
	</p>

	<!-- the nested rings, with the outside zone for things that are not AI -->
	<div class="board" class:armed={selected !== null}>
		<div class="field">
			<button
				type="button"
				class="zone out"
				class:ok={flash?.ring === 'out' && flash.ok}
				class:bad={flash?.ring === 'out' && !flash.ok}
				onclick={() => drop('out')}
				ondragover={dragOver}
				ondrop={(e) => dropOn(e, 'out')}
			>
				<span class="olabel">{tx.rings.out}</span>
				{@render chips('out')}
			</button>

			{#each rings as r, i (r.id)}
				<button
					type="button"
					class="zone ring"
					class:ok={flash?.ring === r.id && flash.ok}
					class:bad={flash?.ring === r.id && !flash.ok}
					style="--d:{r.d}cqw; --top:{r.top}cqw; --tint:{8 + i * 7}%"
					onclick={() => drop(r.id)}
					ondragover={dragOver}
					ondrop={(e) => dropOn(e, r.id)}
				>
					<span class="rlabel">{tx.rings[r.id]}</span>
					{@render chips(r.id)}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	.tray {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		width: min(94vw, 440px);
		min-height: 38px;
	}
	.card {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 10px 6px 7px;
		text-align: left;
		color: var(--color-ink);
		box-shadow: 0 4px 12px rgba(22, 40, 60, 0.06);
		cursor: grab;
		touch-action: manipulation;
		transition:
			transform 0.15s ease,
			border-color 0.2s ease,
			background 0.2s ease;
		animation: cardin 0.35s ease backwards;
	}
	.card:hover {
		border-color: color-mix(in srgb, var(--color-brand) 40%, var(--color-line));
	}
	.card.sel {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		transform: translateY(-2px);
	}
	.card i {
		display: flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		background: var(--color-paper);
		color: var(--color-brand);
		line-height: 0;
	}
	.card.sel i {
		background: var(--color-card);
	}
	.txt {
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}
	.txt b {
		font-size: 11.5px;
		font-weight: 700;
	}
	.txt small {
		font-size: 9px;
		color: var(--color-faint);
	}
	@keyframes cardin {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	.hint {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.hint.strong {
		color: var(--color-grass);
		font-weight: 700;
	}
	.count {
		flex: none;
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 1px 7px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}

	.board {
		container-type: inline-size;
		width: min(92vw, 400px, 52dvh);
	}
	.field {
		position: relative;
		width: 100cqw;
		height: 104cqw;
	}
	.zone {
		position: absolute;
		display: block;
		padding: 0;
		touch-action: manipulation;
		transition:
			box-shadow 0.25s ease,
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.out {
		inset: 0;
		border-radius: 20px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 12px 28px rgba(22, 40, 60, 0.06);
	}
	.olabel {
		position: absolute;
		top: 4cqw;
		left: 4.5cqw;
		font-size: clamp(9.5px, 3cqw, 13px);
		font-weight: 700;
		color: var(--color-faint);
	}
	.out .chips {
		top: 3cqw;
		left: auto;
		right: 4cqw;
		transform: none;
	}
	.ring {
		top: var(--top);
		left: calc((100cqw - var(--d)) / 2);
		width: var(--d);
		height: var(--d);
		border-radius: 50%;
		border: 1.5px solid color-mix(in srgb, var(--color-brand) 32%, var(--color-line));
		background: color-mix(in srgb, var(--color-brand) var(--tint), var(--color-card));
	}
	.rlabel {
		position: absolute;
		top: 4.6cqw;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-size: clamp(9px, 2.9cqw, 12.5px);
		font-weight: 700;
		color: var(--color-ink);
	}
	.chips {
		position: absolute;
		top: 10.6cqw;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 4px;
		pointer-events: none;
	}
	.chip {
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(22px, 6.6cqw, 28px);
		height: clamp(22px, 6.6cqw, 28px);
		border-radius: 50%;
		background: var(--color-card);
		border: 1.5px solid var(--color-grass);
		color: var(--color-grass);
		line-height: 0;
		box-shadow: 0 3px 8px rgba(22, 40, 60, 0.1);
		animation: pop 0.4s cubic-bezier(0.3, 1.5, 0.5, 1) backwards;
	}
	.chip :global(svg) {
		width: 62%;
		height: 62%;
	}
	@keyframes pop {
		from {
			transform: scale(0.3);
			opacity: 0;
		}
	}

	/* a card is in hand, so every zone invites a tap */
	.armed .zone {
		cursor: pointer;
	}
	.armed .zone:hover {
		border-color: var(--color-brand);
	}
	.zone.ok {
		border-color: var(--color-grass) !important;
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-grass) 25%, transparent);
	}
	.zone.bad {
		border-color: var(--color-danger) !important;
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-danger) 22%, transparent);
		animation: nudge 0.42s ease;
	}
	.out.bad {
		animation: none;
	}
	@keyframes nudge {
		25% {
			translate: -3px 0;
		}
		50% {
			translate: 3px 0;
		}
		75% {
			translate: -2px 0;
		}
	}

	:global(.dark) .card,
	:global(.dark) .out {
		box-shadow: none;
	}
	:global(.dark) .chip {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.chip,
		.zone.bad {
			animation: none;
		}
		.card.sel {
			transform: none;
		}
	}

	@media (min-width: 768px) {
		.tray {
			gap: 8px;
		}
		.card {
			padding: 7px 12px 7px 8px;
		}
		.txt b {
			font-size: 13px;
		}
		.txt small {
			font-size: 10px;
		}
		.hint {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
