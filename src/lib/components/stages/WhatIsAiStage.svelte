<script lang="ts">
	// A guided "watch" stage. Nim narrates, and a picture of nested circles fills in by itself:
	// first a calculator waits outside (a normal program), then Turing asks his famous question,
	// then the circles appear one by one (AI, machine learning, deep learning, generative AI) and
	// an everyday example drops into each. The only optional play is on the last beat, tapping an
	// example to light up its circle.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { AiRing, AiThingId, WhatIsAiText } from '$lib/chapters/ai/what-is-ai/types';

	import type { StageProps } from '$lib/chapters/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as WhatIsAiText);

	const LAST = 8;
	type Ring = { id: AiRing; cy: number; r: number; color: string; from: number };
	// Circles share the same bottom edge, so each one leaves a band on top for its name and example.
	const RINGS: Ring[] = [
		{ id: 'ai', cy: 185, r: 170, color: 'var(--color-ink)', from: 2 },
		{ id: 'ml', cy: 227, r: 128, color: 'var(--color-brand)', from: 3 },
		{ id: 'dl', cy: 267, r: 88, color: 'var(--color-grass)', from: 5 },
		{ id: 'gen', cy: 299, r: 56, color: 'var(--color-amber)', from: 6 }
	];
	const LABEL_Y: Record<AiRing, number> = { ai: 40, ml: 118, dl: 194, gen: 266 };
	type Thing = { id: AiThingId; x: number; y: number; ring: AiRing | null; from: number };
	const THINGS: Thing[] = [
		{ id: 'calc', x: 38, y: 38, ring: null, from: 0 },
		{ id: 'chess', x: 180, y: 64, ring: 'ai', from: 2 },
		{ id: 'spam', x: 180, y: 144, ring: 'ml', from: 3 },
		{ id: 'face', x: 180, y: 214, ring: 'dl', from: 5 },
		{ id: 'chat', x: 158, y: 296, ring: 'gen', from: 6 },
		{ id: 'image', x: 202, y: 296, ring: 'gen', from: 6 }
	];
	// Which circle each beat puts in focus (null means none, 'all' means every circle).
	const FOCUS: (AiRing | null | 'all')[] = [
		null,
		null,
		'ai',
		'ml',
		'ml',
		'dl',
		'gen',
		'all',
		'all'
	];

	let peek = $state<number | null>(null);
	let picked = $state<AiThingId | null>(null);
	let reduced = $state(false);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
		picked = null;
	});

	const scene = $derived(peek ?? Math.min(beat, LAST));
	const pickedRing = $derived(picked ? (THINGS.find((t) => t.id === picked)?.ring ?? null) : null);
	const focus = $derived(scene === LAST && picked ? (pickedRing ?? 'none') : FOCUS[scene]);

	function ringState(r: Ring): 'hidden' | 'ghost' | 'on' | 'dim' | 'plain' {
		// before AI has a name, the big circle is only a faint outline of "the picture"
		if (r.id === 'ai' && scene === 0) return 'ghost';
		if (scene < r.from) return 'hidden';
		if (focus === 'all' || focus === null) return 'plain';
		return focus === r.id ? 'on' : 'dim';
	}

	function pick(id: AiThingId) {
		if (scene !== LAST) return;
		picked = id;
		onstate?.(id);
	}
	function key(e: KeyboardEvent, id: AiThingId) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			pick(id);
		}
	}
</script>

{#snippet icon(id: AiThingId)}
	{#if id === 'calc'}
		<rect x="-10" y="-13" width="20" height="26" rx="3" class="ic" />
		<rect x="-6.5" y="-9.5" width="13" height="6" rx="1.5" class="ic-screen" />
		{#each [0, 1, 2] as row (row)}
			{#each [0, 1, 2] as col (col)}
				<rect
					x={-6.5 + col * 4.8}
					y={-0.5 + row * 4.4}
					width="3.4"
					height="3"
					rx="0.8"
					class="ic-key"
				/>
			{/each}
		{/each}
	{:else if id === 'chess'}
		<circle cx="0" cy="-7" r="4.5" class="ic" />
		<path d="M-5 7 Q-4.5 -1 0 -2.5 Q4.5 -1 5 7 Z" class="ic" />
		<rect x="-8.5" y="7" width="17" height="4.5" rx="1.5" class="ic" />
	{:else if id === 'spam'}
		<rect x="-12" y="-8" width="24" height="16" rx="2.5" class="ic" />
		<path d="M-12 -7 L0 2 L12 -7" class="ic-line" />
		<circle cx="11" cy="-8" r="5" class="ic-badge" />
		<path d="M11 -10.5 V-7.5 M11 -5.6 V-5.4" class="ic-badge-mark" />
	{:else if id === 'face'}
		<circle cx="0" cy="0" r="8.5" class="ic" />
		<circle cx="-3" cy="-2" r="1.1" class="ic-dot" />
		<circle cx="3" cy="-2" r="1.1" class="ic-dot" />
		<path d="M-3.5 3 Q0 6 3.5 3" class="ic-line" />
		<path d="M-13 -7 V-13 H-7 M7 -13 H13 V-7 M13 7 V13 H7 M-7 13 H-13 V7" class="ic-line scan" />
	{:else if id === 'chat'}
		<path d="M-12 -9 H12 V6 H-3 L-8 11 V6 H-12 Z" class="ic" />
		<circle cx="-5" cy="-1.5" r="1.3" class="ic-dot" />
		<circle cx="0" cy="-1.5" r="1.3" class="ic-dot" />
		<circle cx="5" cy="-1.5" r="1.3" class="ic-dot" />
	{:else}
		<rect x="-12" y="-9" width="24" height="18" rx="2.5" class="ic" />
		<circle cx="5.5" cy="-3.5" r="2.5" class="ic-sun" />
		<path d="M-12 9 L-4 -1 L2 5 L5 2 L12 9" class="ic-line" />
	{/if}
{/snippet}

{#snippet token(id: AiThingId)}
	<circle r="15" class="disc" />
	{@render icon(id)}
	<text y="27" class="thing-name">{tx.things[id]}</text>
{/snippet}

{#snippet circles()}
	<svg
		viewBox="0 0 360 360"
		class="rings"
		role="group"
		aria-label={RINGS.map((r) => tx.rings[r.id]).join(', ')}
	>
		{#each RINGS as r (r.id)}
			{@const st = ringState(r)}
			{#if st !== 'hidden'}
				<g class="ring {st}" style="--c:{r.color}">
					<circle cx="180" cy={r.cy} r={r.r} class="fill" />
					<circle
						cx="180"
						cy={r.cy}
						r={r.r}
						pathLength="1"
						class="edge"
						class:draw={!reduced}
						transform="rotate(90 180 {r.cy})"
					/>
					{#if st !== 'ghost'}
						<text x="180" y={LABEL_Y[r.id]} class="ring-name" in:fade={{ duration: 400 }}
							>{tx.rings[r.id]}</text
						>
					{/if}
				</g>
			{/if}
		{/each}

		{#each THINGS as t (t.id)}
			{#if scene >= t.from && scene !== 1}
				<g transform="translate({t.x} {t.y})">
					{#if scene === LAST}
						<g
							class="thing live"
							class:picked={picked === t.id}
							role="button"
							tabindex="0"
							aria-label={tx.things[t.id]}
							onclick={() => pick(t.id)}
							onkeydown={(e) => key(e, t.id)}
						>
							{@render token(t.id)}
						</g>
					{:else}
						<g class="thing" class:drop={!reduced}>{@render token(t.id)}</g>
					{/if}
				</g>
			{/if}
		{/each}
	</svg>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === 1}
					<div class="turing" in:fade={{ duration: reduced ? 0 : 300 }}>
						<figure class="frame">
							<img
								src="/images/people/alan-turing.jpg"
								alt={tx.photo.alt}
								width="500"
								height="681"
								loading="lazy"
								decoding="async"
							/>
							<figcaption>{tx.photo.caption}</figcaption>
						</figure>
						<div class="quote">
							<p class="q">{tx.quote}</p>
							<p class="by">{tx.quoteBy}</p>
						</div>
					</div>
				{:else}
					<div class="pic" in:fade={{ duration: reduced ? 0 : 300 }}>{@render circles()}</div>
					{#if i === 4}
						<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
					{:else if i === 7}
						<p class="rule" in:fade={{ duration: 300 }}>{tx.nest}</p>
					{:else if i === LAST}
						<p class="hint" in:fade={{ duration: 300 }}>{tx.tapHint}</p>
					{/if}
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 400px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.pic {
		width: 100%;
	}
	.rings {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}

	/* circles */
	.ring .fill {
		fill: color-mix(in srgb, var(--c) 7%, transparent);
		transition: fill 0.5s;
	}
	.ring .edge {
		fill: none;
		stroke: var(--c);
		stroke-width: 1.6;
		opacity: 0.55;
		transition:
			opacity 0.5s,
			stroke-width 0.5s;
	}
	.ring.on .fill {
		fill: color-mix(in srgb, var(--c) 14%, transparent);
	}
	.ring.on .edge {
		opacity: 1;
		stroke-width: 2.4;
	}
	.ring.ghost .fill {
		fill: none;
	}
	.ring.ghost .edge {
		stroke: var(--color-line);
		opacity: 1;
	}
	.ring.dim .edge {
		opacity: 0.3;
	}
	.ring-name {
		fill: var(--c);
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		transition: opacity 0.5s;
	}
	.ring.dim .ring-name {
		opacity: 0.5;
	}
	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.1s ease forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* examples */
	.thing {
		outline: none;
	}
	.thing.live {
		cursor: pointer;
	}
	.drop {
		animation: drop 0.7s cubic-bezier(0.3, 1.4, 0.5, 1) both 0.5s;
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-26px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.disc {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition:
			stroke 0.2s,
			stroke-width 0.2s;
	}
	.thing.live:hover .disc,
	.thing.live:focus-visible .disc {
		stroke: var(--color-brand);
	}
	.thing.picked .disc {
		stroke: var(--color-brand);
		stroke-width: 2.4;
	}
	.thing-name {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 600;
		text-anchor: middle;
	}
	.ic {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.ic-line {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.ic-line.scan {
		stroke: var(--color-grass);
	}
	.ic-screen {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.ic-key,
	.ic-dot {
		fill: var(--color-ink);
	}
	.ic-badge {
		fill: var(--color-danger);
	}
	.ic-badge-mark {
		stroke: var(--color-card);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.ic-sun {
		fill: var(--color-amber);
	}

	/* history beat */
	.turing {
		display: flex;
		min-height: 300px;
		align-items: center;
		justify-content: center;
		gap: 22px;
	}
	.frame {
		margin: 0;
		width: 132px;
		flex: none;
		transform: rotate(-2.5deg);
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		padding: 6px 6px 7px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.12);
	}
	.frame img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 3px;
		filter: grayscale(0.15);
	}
	figcaption {
		margin-top: 5px;
		font-size: 10px;
		line-height: 1.3;
		text-align: center;
		color: var(--color-muted);
	}
	.quote .q {
		margin: 0;
		font-family: var(--font-display);
		font-size: 26px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--color-ink);
	}
	.quote .by {
		margin: 8px 0 0;
		font-size: 13px;
		color: var(--color-muted);
	}

	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}
	.hint {
		margin: 0;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-brand);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.turing {
			min-height: 220px;
			gap: 16px;
		}
		.frame {
			width: 104px;
		}
		.quote .q {
			font-size: 21px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ring .fill,
		.ring .edge,
		.ring-name,
		.disc {
			transition: none;
		}
	}
</style>
