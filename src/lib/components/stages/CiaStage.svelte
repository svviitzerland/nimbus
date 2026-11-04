<script lang="ts">
	// Guided CIA triad. One diary sits in the middle and each beat plays one of the three bad
	// things on it by itself (an eye reads it and copies fly off, a pencil rewrites the amount,
	// the book fades away under a flood). The tale beats replay the same scene with a real
	// headline on top. On the last beat the learner may tap a letter to replay its story.
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { CiaLetter, CiaText } from '$lib/chapters/security/cia/types';
	import GuideWrap from './secbasics/GuideWrap.svelte';
	import { startGuided } from './secbasics/guided.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as CiaText);
	startGuided(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const last = $derived(tx.steps.length - 1);
	let peek = $state<number | null>(null);
	let picked = $state<CiaLetter | null>(null);
	$effect(() => {
		void beat;
		peek = null;
		picked = null;
	});
	const active = $derived(Math.max(0, Math.min(peek ?? beat, last)));
	const canPick = $derived(beat >= last);

	type Mode = 'none' | CiaLetter | 'all' | 'tools';
	const SCENES: Mode[] = ['none', 'c', 'i', 'a', 'all', 'c', 'i', 'a', 'tools', 'none'];
	const TALES: Record<number, CiaLetter> = { 5: 'c', 6: 'i', 7: 'a' };
	const LETTERS: CiaLetter[] = ['c', 'i', 'a'];
	const BX: Record<CiaLetter, number> = { c: 84, i: 180, a: 276 };

	function modeOf(s: number): Mode {
		if (s === last && picked) return picked;
		return SCENES[s] ?? 'none';
	}
	function taleOf(s: number): CiaLetter | null {
		if (s === last && picked) return picked;
		return TALES[s] ?? null;
	}

	function pick(l: CiaLetter) {
		if (!canPick) return;
		peek = null;
		picked = l;
		onstate?.(l);
	}
</script>

{#snippet badge(l: CiaLetter, mode: Mode)}
	<rect x={BX[l] - 44} y="178" width="88" height="62" rx="14" class="b-box" />
	<text x={BX[l]} y="206" class="b-letter">{l.toUpperCase()}</text>
	<text x={BX[l]} y="226" class="b-name"
		>{mode === 'tools' ? tx.tools[l] : tx.letters[l].short}</text
	>
{/snippet}

{#snippet visual(s: number)}
	{@const mode = modeOf(s)}
	{@const tale = taleOf(s)}
	<div class="vis">
		<div class="news-slot">
			{#if tale}
				{#key tale}
					<p class="news" in:fade={{ duration: 240 }}>
						<span class="news-tag">{tx.news[tale].tag}</span>
						<span class="news-head">{tx.news[tale].head}</span>
					</p>
				{/key}
			{/if}
		</div>

		{#key `${mode}${tale ?? ''}`}
			<svg viewBox="0 0 360 250" class="scene" role="img" aria-label={tx.title}>
				<!-- the flood of junk traffic, only in the Dyn story -->
				{#if mode === 'a' && tale === 'a'}
					<g class="flood">
						{#each [44, 64, 84, 104, 124, 144] as y, k (y)}
							<circle cx="-4" cy={y} r="4" class="junk" style="animation-delay:{k * 0.27}s" />
							<circle
								cx="-4"
								cy={y + 10}
								r="3"
								class="junk"
								style="animation-delay:{k * 0.27 + 0.6}s"
							/>
						{/each}
					</g>
				{/if}

				<!-- the diary -->
				<g class="book" class:gone={mode === 'a'}>
					<rect x="88" y="34" width="184" height="126" rx="9" class="cover" />
					<rect x="96" y="40" width="84" height="114" rx="5" class="page" />
					<rect x="180" y="40" width="84" height="114" rx="5" class="page" />
					<line x1="180" y1="42" x2="180" y2="152" class="spine" />
					<text x="138" y="62" class="d-title">{tx.diary.title}</text>
					{#each [78, 90, 102, 114, 126, 138] as y, k (y)}
						<rect x="106" {y} width={k % 2 ? 50 : 64} height="4" rx="2" class="scribble" />
					{/each}
					<text x="190" y="64" class="d-line">{tx.diary.line}</text>
					<text x="190" y="88" class="amount" class:good={mode === 'i'}>{tx.diary.amount}</text>
					{#if mode === 'i'}
						<text x="190" y="88" class="amount bad">{tx.diary.amountBad}</text>
					{/if}
					{#each [108, 120, 132] as y (y)}
						<rect x="190" {y} width="62" height="4" rx="2" class="scribble" />
					{/each}
				</g>

				<!-- C, an eye peeks in and copies fly away -->
				{#if mode === 'c'}
					<g transform="translate(316 74)">
						<g class="eye">
							<path d="M-24 0 Q0 -18 24 0 Q0 18 -24 0Z" class="eye-white" />
							<circle r="7" class="iris" />
							<circle r="3" class="pupil" />
						</g>
					</g>
					{#each [0, 1, 2] as k (k)}
						<g transform="translate(236 96)">
							<g class="copy" style="animation-delay:{k * 0.9}s">
								<rect x="-8" y="-10" width="16" height="20" rx="2" class="copy-page" />
								<line x1="-4" y1="-4" x2="4" y2="-4" class="copy-ln" />
								<line x1="-4" y1="1" x2="4" y2="1" class="copy-ln" />
							</g>
						</g>
					{/each}
				{/if}

				<!-- I, a pencil rewrites the amount -->
				{#if mode === 'i'}
					<g transform="translate(196 72)">
						<g class="pencil">
							<g transform="rotate(35)">
								<rect x="-4" y="-38" width="8" height="30" rx="1.5" class="pencil-body" />
								<path d="M-4 -8 L0 2 L4 -8 Z" class="pencil-tip" />
								<rect x="-4" y="-42" width="8" height="5" rx="1.5" class="pencil-end" />
							</g>
						</g>
					</g>
				{/if}

				<!-- A, a closed sign hangs over the faded book -->
				{#if mode === 'a'}
					<g class="closed">
						<rect x="140" y="84" width="80" height="26" rx="13" class="closed-pill" />
						<path d="M166 97 h28" class="closed-bar" />
					</g>
				{/if}

				<!-- the three letters -->
				{#each LETTERS as l (l)}
					{@const hit = mode === l}
					{@const on = mode === 'all' || mode === 'tools'}
					{@const dim = (mode === 'c' || mode === 'i' || mode === 'a') && !hit}
					{#if canPick && s === last}
						<g
							class="badge tap"
							class:hit
							class:dim
							role="button"
							tabindex="0"
							aria-label={tx.letters[l].name}
							onclick={() => pick(l)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									pick(l);
								}
							}}
						>
							{@render badge(l, mode)}
						</g>
					{:else}
						<g class="badge" class:hit class:on class:dim>{@render badge(l, mode)}</g>
					{/if}
				{/each}
			</svg>
		{/key}
	</div>
{/snippet}

<GuideWrap
	steps={tx.steps}
	{active}
	onselect={(k) => (peek = k)}
	{visual}
	hint={canPick ? tx.pickHint : ''}
/>

<style>
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.news-slot {
		display: flex;
		min-height: 48px;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	.news {
		margin: 0;
		max-width: 340px;
		border-left: 3px solid var(--color-danger);
		border-radius: 6px;
		background: var(--color-card);
		padding: 6px 12px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.08);
		line-height: 1.35;
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
	.scene {
		width: 100%;
		max-width: 380px;
		height: auto;
		overflow: visible;
	}

	.cover {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.page {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.spine {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.d-title {
		font-family: var(--font-display);
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.d-line {
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.scribble {
		fill: var(--color-line);
	}
	.amount {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.amount.good {
		opacity: 0;
	}
	.amount.bad {
		fill: var(--color-danger);
	}
	.book.gone {
		opacity: 0.18;
	}

	.eye-white {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.iris {
		fill: var(--color-brand);
	}
	.pupil {
		fill: var(--color-ink);
	}
	.copy {
		opacity: 0;
	}
	.copy-page {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.4;
	}
	.copy-ln {
		stroke: var(--color-danger);
		stroke-width: 1.2;
		stroke-linecap: round;
	}
	.pencil {
		transform: translateX(56px);
	}
	.pencil-body {
		fill: var(--color-amber);
	}
	.pencil-tip {
		fill: var(--color-ink);
	}
	.pencil-end {
		fill: var(--color-danger);
	}
	.closed-pill {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.closed-bar {
		stroke: var(--color-danger);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.junk {
		fill: var(--color-danger);
		opacity: 0.7;
		transform: translateX(70px);
	}

	.b-box {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.b-letter {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.b-name {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.badge.on .b-box {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.badge.on .b-letter,
	.badge.on .b-name {
		fill: var(--color-grass);
	}
	.badge.hit .b-box {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.badge.hit .b-letter,
	.badge.hit .b-name {
		fill: var(--color-danger);
	}
	.badge.dim {
		opacity: 0.45;
	}
	.badge.tap {
		cursor: pointer;
		outline: none;
	}
	.badge.tap:hover .b-box,
	.badge.tap:focus-visible .b-box {
		stroke: var(--color-brand);
		stroke-width: 3;
	}

	@media (prefers-reduced-motion: no-preference) {
		.eye {
			animation: peek 4.5s ease-in-out infinite;
		}
		.copy {
			animation: fly 2.7s ease-in infinite;
		}
		.pencil {
			animation: write 4s ease-in-out infinite;
		}
		.amount.good {
			animation: outgo 4s ease infinite;
		}
		.amount.bad {
			animation: income 4s ease infinite;
		}
		.book.gone {
			animation: vanish 4.5s ease-in-out infinite;
		}
		.closed {
			animation: income 4.5s ease-in-out infinite;
		}
		.junk {
			animation: flood 1.6s linear infinite;
		}
	}
	@keyframes peek {
		0% {
			transform: translateX(46px);
			opacity: 0;
		}
		25%,
		80% {
			transform: translateX(0);
			opacity: 1;
		}
		100% {
			transform: translateX(0);
			opacity: 0;
		}
	}
	@keyframes fly {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: translate(96px, 40px);
			opacity: 0;
		}
	}
	@keyframes write {
		0%,
		15% {
			transform: translateX(0);
		}
		55%,
		100% {
			transform: translateX(56px);
		}
	}
	@keyframes outgo {
		0%,
		40% {
			opacity: 1;
		}
		55%,
		92% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes income {
		0%,
		40% {
			opacity: 0;
		}
		55%,
		92% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes vanish {
		0%,
		20% {
			opacity: 1;
		}
		50%,
		88% {
			opacity: 0.18;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes flood {
		0% {
			transform: translateX(0);
			opacity: 0;
		}
		20% {
			opacity: 0.8;
		}
		100% {
			transform: translateX(150px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.b-box {
			transition: none;
		}
	}
</style>
