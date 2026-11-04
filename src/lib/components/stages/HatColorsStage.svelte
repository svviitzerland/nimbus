<script lang="ts">
	// Guided hacker hats. Three cowboy hats hang on a rack (white, gray, black) and each beat
	// lights one and sets a small prop under it, a signed contract, a broken padlock, a crossed
	// out paper. The Mitnick story plays as a little hat walking a timeline and turning from black
	// to white. On the last beat the learner may tap a hat to hear a short story about it.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { Hat, HatColorsText } from '$lib/chapters/security/hat-colors/types';
	import GuideWrap from './secbasics/GuideWrap.svelte';
	import { startGuided } from './secbasics/guided.svelte';
	import { prefersReducedMotion, runSeq } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HatColorsText);
	startGuided(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const last = $derived(tx.steps.length - 1);
	let peek = $state<number | null>(null);
	let picked = $state<Hat | null>(null);
	$effect(() => {
		void beat;
		peek = null;
		picked = null;
	});
	const active = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	type Scene =
		| 'western'
		| 'hacker'
		| 'white'
		| 'black'
		| 'gray'
		| 'mitnick'
		| 'permission'
		| 'ingat'
		| 'bounty'
		| 'try';
	const SCENES: Scene[] = [
		'western',
		'hacker',
		'white',
		'black',
		'gray',
		'mitnick',
		'permission',
		'ingat',
		'bounty',
		'try'
	];
	const scene = $derived(SCENES[active] ?? 'western');

	const HATS: Hat[] = ['white', 'gray', 'black'];
	const HX: Record<Hat, number> = { white: 90, gray: 210, black: 330 };

	let pos = $state(2);
	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});
	$effect(() => {
		const sc = scene;
		const still = reduce;
		return untrack(() => {
			pos = 2;
			if (sc !== 'mitnick' || still) return;
			return runSeq(
				[
					[1900, () => (pos = 0)],
					[1900, () => (pos = 1)],
					[3600, () => (pos = 2)]
				],
				true
			);
		});
	});

	type Look = 'lit' | 'dim' | 'plain';
	function lookOf(h: Hat, sc: Scene): Look {
		switch (sc) {
			case 'western':
			case 'permission':
				return h === 'gray' ? 'dim' : 'lit';
			case 'white':
			case 'gray':
			case 'black':
				return h === sc ? 'lit' : 'dim';
			case 'mitnick':
				return 'dim';
			case 'ingat':
				return 'lit';
			case 'bounty':
				return h === 'white' ? 'lit' : 'dim';
			case 'try':
				return picked === h ? 'lit' : 'plain';
			default:
				return 'plain';
		}
	}
	/** Which hats get a paper under them, and whether it carries permission. */
	function papers(sc: Scene): { h: Hat; ok: boolean }[] {
		if (sc === 'white') return [{ h: 'white', ok: true }];
		if (sc === 'gray') return [{ h: 'gray', ok: false }];
		if (sc === 'permission')
			return [
				{ h: 'white', ok: true },
				{ h: 'black', ok: false }
			];
		if (sc === 'ingat')
			return [
				{ h: 'white', ok: true },
				{ h: 'gray', ok: false },
				{ h: 'black', ok: false }
			];
		return [];
	}

	function pick(h: Hat) {
		peek = null;
		picked = h;
		onstate?.(h);
	}

	const crown = (cx: number, cy: number) =>
		`M${cx - 24} ${cy + 14} C${cx - 26} ${cy - 10} ${cx - 16} ${cy - 18} ${cx - 8} ${cy - 14} Q${cx} ${cy - 6} ${cx + 8} ${cy - 14} C${cx + 16} ${cy - 18} ${cx + 26} ${cy - 10} ${cx + 24} ${cy + 14} Z`;
	const TL = [90, 210, 330];
</script>

{#snippet hat(cx: number, cy: number, kind: Hat, s = 1)}
	<g transform="translate({cx} {cy}) scale({s})" class="hat {kind}">
		<path d={crown(0, 0)} class="crown" />
		<rect x="-24" y="6" width="48" height="7" rx="2" class="band" />
		<ellipse cx="0" cy="15" rx="46" ry="8" class="brim" />
	</g>
{/snippet}

{#snippet paper(cx: number, ok: boolean)}
	<g class="paper" class:ok>
		<rect x={cx - 22} y="132" width="44" height="58" rx="4" class="sheet" />
		{#each [144, 152, 160] as y (y)}
			<line x1={cx - 14} y1={y} x2={cx + 14} y2={y} class="txt" />
		{/each}
		{#if ok}
			<path d="M{cx - 14} 176 q5 -8 9 0 t9 0 t8 -2" class="sign" />
			<circle cx={cx + 18} cy="186" r="10" class="badge-ok" />
			<path d="M{cx + 13} 186 l3.5 3.5 l6.5 -7" class="mark" />
		{:else}
			<path d="M{cx - 16} 136 L{cx + 16} 186 M{cx + 16} 136 L{cx - 16} 186" class="cross" />
		{/if}
		<g class="cap" class:ok>
			<rect x={cx - 48} y="204" width="96" height="20" rx="10" />
			<text x={cx} y="218">{ok ? tx.permission : tx.noPermission}</text>
		</g>
	</g>
{/snippet}

{#snippet visual(s: number)}
	{@const sc = SCENES[s] ?? 'western'}
	<div class="vis">
		<div class="slot">
			{#if sc === 'mitnick'}
				<p class="news" in:fade={{ duration: 240 }}>
					<span class="news-tag">{tx.news.tag}</span>
					<span class="news-head">{tx.news.head}</span>
				</p>
			{:else if sc === 'try'}
				{#if picked}
					{#key picked}
						<p class="story {picked}" in:fade={{ duration: 200 }}>
							<b>{tx.stories[picked].who}</b>
							<span>{tx.stories[picked].story}</span>
						</p>
					{/key}
				{:else}
					<p class="hint">{tx.tapHint}</p>
				{/if}
			{/if}
		</div>

		<svg viewBox="0 0 420 256" class="scene" role="img" aria-label={tx.title}>
			<!-- the rack -->
			<rect x="34" y="20" width="352" height="10" rx="5" class="rack" />
			{#each HATS as h (h)}
				<line x1={HX[h]} y1="30" x2={HX[h]} y2="46" class="peg" />
			{/each}

			{#each HATS as h (h)}
				{@const look = lookOf(h, sc)}
				{#if sc === 'try'}
					<g
						class="hang tap {look}"
						role="button"
						tabindex="0"
						aria-label={tx.hats[h]}
						onclick={() => pick(h)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								pick(h);
							}
						}}
					>
						<rect x={HX[h] - 54} y="34" width="108" height="86" rx="14" class="hit" />
						{@render hat(HX[h], 58, h)}
						<text x={HX[h]} y="106" class="name">{tx.hats[h]}</text>
					</g>
				{:else}
					<g class="hang {look}">
						{@render hat(HX[h], 58, h)}
						<text x={HX[h]} y="106" class="name">{tx.hats[h]}</text>
					</g>
				{/if}
			{/each}

			<!-- the props under the hats -->
			{#each papers(sc) as p (p.h)}
				{@render paper(HX[p.h], p.ok)}
			{/each}

			{#if sc === 'western'}
				<g class="cactus">
					<path d="M204 228 V158 a6 6 0 0 1 12 0 V228 Z" />
					<path d="M204 196 h-10 a5 5 0 0 1 -5 -5 v-14 a4 4 0 0 1 8 0 v11 h7" />
					<path d="M216 186 h10 v-15 a4 4 0 0 1 8 0 v18 a5 5 0 0 1 -5 5 h-13" />
				</g>
				<line x1="150" y1="228" x2="270" y2="228" class="sand" />
			{:else if sc === 'hacker'}
				<g class="keys">
					<circle cx="210" cy="150" r="14" class="ring" />
					{#each [-28, 0, 28] as a, k (k)}
						<g transform="rotate({a} 210 164)">
							<line x1="210" y1="164" x2="210" y2="208" class="shaft" />
							<path d="M210 196 h8 M210 204 h6" class="shaft" />
							<circle cx="210" cy="170" r="6" class="bow" />
						</g>
					{/each}
				</g>
			{:else if sc === 'black'}
				<g class="broken">
					<path d="M318 160 v-12 a12 12 0 0 1 24 0" class="shackle" />
					<rect x="312" y="164" width="36" height="28" rx="5" class="lockbody" />
					<circle cx="330" cy="176" r="3.5" class="keyhole" />
				</g>
				<g class="cap">
					<rect x="282" y="204" width="96" height="20" rx="10" />
					<text x="330" y="218">{tx.noPermission}</text>
				</g>
			{:else if sc === 'gray'}
				<g class="mail">
					<rect x="246" y="150" width="44" height="30" rx="4" class="env" />
					<path d="M246 152 L268 168 L290 152" class="flap" />
				</g>
			{:else if sc === 'mitnick'}
				<line x1="60" y1="196" x2="360" y2="196" class="tl" />
				<line x1="60" y1="196" x2={TL[pos]} y2="196" class="tl-on" />
				{#each tx.timeline as t, k (k)}
					<circle cx={TL[k]} cy="196" r={k === pos ? 6 : 4} class="tick" class:on={k <= pos} />
					<text x={TL[k]} y="222" class="year">{t.year}</text>
					<text x={TL[k]} y="238" class="tl-label">{t.label}</text>
				{/each}
				<g class="walker" style="transform: translate({TL[pos]}px, 160px)">
					{@render hat(0, 0, pos === 2 ? 'white' : 'black', 0.62)}
				</g>
			{:else if sc === 'bounty'}
				<rect x="150" y="128" width="120" height="96" rx="6" class="sheet big" />
				<text x="210" y="148" class="b-title">{tx.bountyLabel}</text>
				{#each [162, 172, 182] as y (y)}
					<line x1="164" y1={y} x2="256" y2={y} class="txt" />
				{/each}
				{#each [0, 1, 2] as k (k)}
					<ellipse cx="300" cy={214 - k * 7} rx="16" ry="5" class="coin" />
				{/each}
				<path d="M164 206 q5 -8 9 0 t9 0 t8 -2" class="sign" />
			{/if}
		</svg>
	</div>
{/snippet}

<GuideWrap steps={tx.steps} {active} onselect={(k) => (peek = k)} {visual} />

<style>
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.slot {
		display: flex;
		min-height: 56px;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	.news,
	.story {
		margin: 0;
		max-width: 360px;
		border-left: 3px solid var(--color-danger);
		border-radius: 6px;
		background: var(--color-card);
		padding: 6px 12px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.08);
		line-height: 1.35;
	}
	.story {
		display: flex;
		flex-direction: column;
		gap: 2px;
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.story b {
		font-family: var(--font-display);
		font-size: 14px;
		color: var(--color-ink);
	}
	.story.white {
		border-left-color: var(--color-grass);
	}
	.story.gray {
		border-left-color: var(--color-amber);
	}
	.news-tag {
		display: block;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-danger);
	}
	.news-head {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.hint {
		margin: 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.scene {
		width: 100%;
		max-width: 420px;
		height: auto;
		overflow: visible;
	}

	.rack {
		fill: var(--color-amber);
	}
	.peg {
		stroke: var(--color-amber);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.hang {
		transition:
			opacity 0.35s,
			transform 0.35s;
	}
	.hang.dim {
		opacity: 0.32;
	}
	.hang.lit {
		transform: translateY(-4px);
	}
	.name {
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.hang.lit .name {
		fill: var(--color-ink);
		font-weight: 800;
	}
	.hit {
		fill: transparent;
		stroke: transparent;
		stroke-width: 2;
	}
	.tap {
		cursor: pointer;
		outline: none;
	}
	.tap:hover .hit,
	.tap:focus-visible .hit {
		stroke: var(--color-brand);
	}
	.tap.lit .hit {
		stroke: var(--color-brand);
		fill: color-mix(in srgb, var(--color-brand) 8%, transparent);
	}

	/* hats are real objects, so they keep their own colours in both themes */
	.hat .crown,
	.hat .brim {
		stroke: #5e6b76;
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.hat.white .crown,
	.hat.white .brim {
		fill: #f6f3ec;
	}
	.hat.gray .crown,
	.hat.gray .brim {
		fill: #9aa3ab;
	}
	.hat.black .crown,
	.hat.black .brim {
		fill: #262c33;
		stroke: #11161b;
	}
	.hat .band {
		fill: #c98a2b;
	}
	.hat.black .band {
		fill: #6b4a1f;
	}

	.sheet {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.6;
	}
	.txt {
		stroke: var(--color-line);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.sign {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.badge-ok {
		fill: var(--color-grass);
	}
	.mark {
		fill: none;
		stroke: #fff;
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.cross {
		stroke: var(--color-danger);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.cap rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.cap text {
		font-size: 10px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-danger);
	}
	.cap.ok rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.cap.ok text {
		fill: var(--color-grass);
	}
	.cactus path {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.sand {
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.ring,
	.shaft,
	.bow {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.bow {
		fill: var(--color-amber-soft);
	}
	.shackle {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.lockbody {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.keyhole {
		fill: var(--color-danger);
	}
	.env {
		fill: var(--color-card);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.flap {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.tl {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.tl-on {
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.tick {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.tick.on {
		fill: var(--color-brand);
		stroke: var(--color-brand);
	}
	.year {
		font-size: 11px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.tl-label {
		font-size: 10px;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.walker {
		transition: transform 1.1s cubic-bezier(0.45, 0, 0.3, 1);
	}
	.b-title {
		font-size: 10.5px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.coin {
		fill: var(--color-amber);
		stroke: #b47a1f;
		stroke-width: 1.4;
	}

	@media (prefers-reduced-motion: no-preference) {
		.paper,
		.broken,
		.mail,
		.keys,
		.cactus {
			animation: rise 0.5s ease both;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.hang,
		.walker {
			transition: none;
		}
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
