<script lang="ts">
	// A guided "watch" stage. A small crowd chats with the nimbus chatbot and one GPU server
	// answers. The chatbot goes viral, the crowd and the row of rented GPU servers grow, and the
	// monthly bill shoots past the budget line. Then a cache catches the repeat questions and a
	// small model takes the easy ones, and the bill settles under budget. The only optional play,
	// on the last beat, switches the two tricks off and on.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { AiCloudText } from '$lib/chapters/ai/ai-cloud/types';
	import { sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as AiCloudText);

	type Scene = 'start' | 'gpu' | 'viral' | 'bill' | 'cache' | 'small' | 'remember' | 'try';
	const SCENES: Scene[] = ['start', 'gpu', 'viral', 'bill', 'cache', 'small', 'remember', 'try'];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];

	// Pretend prices. A big model GPU server is $2 an hour, a small model one is $0.50.
	const BIG_MONTH = 1440;
	const SMALL_MONTH = 360;
	const BUDGET = 5000;
	const SCALE = 12000; // the right end of the bill bar
	const PEOPLE = [300, 2000, 8000, 15000, 30000, 50000, 75000, 100000];

	let peek = $state<number | null>(null);
	let tricks = $state(true);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, tricks]);
	const t = $derived(clock.t);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const step = (start: number, every: number, max: number) =>
		Math.max(0, Math.min(max, Math.floor((t - start) / every)));

	/** What the picture holds right now. */
	const now = $derived.by(() => {
		if (scene === 'start' || scene === 'gpu') return { grow: 0, big: 1, small: 0, cache: false };
		if (scene === 'viral') {
			const k = step(500, 450, 7);
			return { grow: k, big: 1 + k, small: 0, cache: false };
		}
		if (scene === 'bill') return { grow: 7, big: 8, small: 0, cache: false };
		if (scene === 'cache') return { grow: 7, big: 8 - step(900, 650, 3), small: 0, cache: true };
		if (scene === 'small') {
			const k = step(600, 650, 4);
			return { grow: 7, big: 5 - k, small: Math.min(3, k), cache: true };
		}
		if (scene === 'try' && !tricks) return { grow: 7, big: 8, small: 0, cache: false };
		return { grow: 7, big: 1, small: 3, cache: true };
	});

	const heads = $derived(3 + Math.round((27 * now.grow) / 7));
	const people = $derived(PEOPLE[now.grow]);
	const bill = $derived(now.big * BIG_MONTH + now.small * SMALL_MONTH);
	const over = $derived(bill > BUDGET);
	const saved = $derived(!over && now.grow === 7);

	const money = (n: number) =>
		new Intl.NumberFormat(tx.locale, {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(n);
	const count = (n: number) => new Intl.NumberFormat(tx.locale).format(n);

	// ---- layout ----
	const crowd = $derived(
		Array.from({ length: heads }, (_, k) => ({
			x: 26 + (k % 15) * 22,
			y: k < 15 ? 18 : 44
		}))
	);
	const racks = $derived.by(() => {
		const n = now.big + now.small;
		const left = 180 - (n * 38 - 6) / 2;
		return Array.from({ length: n }, (_, k) => ({
			x: left + k * 38,
			big: k < now.big
		}));
	});
	const barW = (n: number) => (Math.min(n, SCALE) / SCALE) * 320;
	const budgetX = 20 + barW(BUDGET);

	// little messages falling from the crowd
	const flowing = $derived(!clock.reduced && scene !== 'gpu' && scene !== 'bill');
	const DROPS = [100, 180, 260];

	const LIT: Record<Scene, string[]> = {
		start: ['crowd', 'racks'],
		gpu: ['racks'],
		viral: ['crowd', 'racks', 'bill'],
		bill: ['racks', 'bill'],
		cache: ['crowd', 'cache', 'racks', 'bill'],
		small: ['racks', 'bill'],
		remember: ['cache', 'racks', 'bill'],
		try: ['crowd', 'cache', 'racks', 'bill']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	function toggle() {
		tricks = !tricks;
		onstate?.(tricks ? 'on' : 'off');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={toggle}>
				{tricks ? tx.offBtn : tx.onBtn}
			</button>
		{/if}
		<svg viewBox="0 0 360 330" class="pic" role="img" aria-label={tx.picture}>
			<!-- messages on their way -->
			{#if flowing}
				{#each DROPS as x, k (x)}
					<circle r="2.6" class="msg">
						<animateMotion
							dur="1.6s"
							begin="{k * 0.5}s"
							repeatCount="indefinite"
							path="M{x} 64 L180 156"
						/>
					</circle>
				{/each}
				{#if now.cache}
					{#each [140, 220] as x, k (x)}
						<circle r="2.6" class="msg cached">
							<animateMotion
								dur="1.8s"
								begin="{0.3 + k * 0.7}s"
								repeatCount="indefinite"
								path="M{x} 64 L180 98 L{x} 64"
							/>
						</circle>
					{/each}
				{/if}
			{/if}

			<!-- the crowd -->
			<g class="part" class:dim={!lit('crowd')}>
				{#each crowd as p, k (k)}
					<g transform="translate({p.x} {p.y})" class="person">
						<circle r="4.2" class="head" />
						<path d="M-6.5 13 Q-6.5 6 0 6 Q6.5 6 6.5 13 Z" class="body" />
					</g>
				{/each}
				<text x="180" y="78" text-anchor="middle" class="label"
					>{tx.crowd.replace('{n}', count(people))}</text
				>
			</g>

			<!-- the cache -->
			{#if now.cache}
				<g class="part pop" class:dim={!lit('cache')}>
					<rect x="144" y="94" width="72" height="28" rx="7" class="cachebox" />
					<path d="M154 102 H166 M154 108 H170 M154 114 H164" class="cachelines" />
					<text x="196" y="112" text-anchor="middle" class="cachetext">{tx.cacheLabel}</text>
				</g>
			{/if}

			<!-- the GPU servers -->
			<g class="part" class:dim={!lit('racks')}>
				<text x="180" y="146" text-anchor="middle" class="label"
					>{tx.gpus.replace('{n}', String(racks.length))}</text
				>
				{#each racks as r, k (k)}
					{@const top = r.big ? 160 : 180}
					<g class="pop">
						<rect x={r.x} y={top} width="32" height={228 - top} rx="5" class="rack" />
						<rect
							x={r.x}
							y={top}
							width="32"
							height="7"
							rx="3"
							class="strip"
							class:smallStrip={!r.big}
						/>
						{#each r.big ? [174, 188, 202, 216] : [192, 204, 216] as y (y)}
							<rect x={r.x + 5} {y} width="22" height="7" rx="2" class="unit" />
						{/each}
					</g>
				{/each}
				{#if scene === 'gpu'}
					<g class="pop">
						<rect x="204" y="184" width="70" height="20" rx="10" class="tag" />
						<text x="239" y="198" text-anchor="middle" class="tagtext"
							>{tx.hourly.replace('{cost}', money(2))}</text
						>
					</g>
				{/if}
				{#if now.small > 0 && scene !== 'remember'}
					<g class="legend">
						<rect x="92" y="236" width="9" height="9" rx="2" class="strip" />
						<text x="105" y="244" class="small">{tx.bigLabel}</text>
						<rect x="190" y="236" width="9" height="9" rx="2" class="strip smallStrip" />
						<text x="203" y="244" class="small">{tx.smallLabel}</text>
					</g>
				{/if}
				{#if scene === 'remember'}
					<text x="180" y="244" text-anchor="middle" class="memo">{tx.memo}</text>
				{/if}
			</g>

			<!-- the monthly bill -->
			<g class="part" class:dim={!lit('bill')}>
				<text x="20" y="270" class="billtitle">{tx.billTitle}</text>
				<text x="340" y="270" text-anchor="end" class="amount" class:over class:saved
					>{money(bill)}</text
				>
				<rect x="20" y="278" width="320" height="16" rx="8" class="track" />
				<rect
					x="20"
					y="278"
					width={Math.max(16, barW(bill))}
					height="16"
					rx="8"
					class="fill"
					class:over
					class:saved
				/>
				<path d="M{budgetX} 272 V300" class="budget" />
				<text x={budgetX} y="314" text-anchor="middle" class="small"
					>{tx.budgetLabel} {money(BUDGET)}</text
				>
			</g>
		</svg>
		{#if scene === 'remember'}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} {active} onselect={(i) => (peek = i)} visual={picture} />
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
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.pic {
		display: block;
		width: 100%;
		height: auto;
		max-height: 60vh;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.part {
		transition: opacity 0.4s;
	}
	.part.dim {
		opacity: 0.35;
	}
	.label {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
	}
	.small {
		fill: var(--color-muted);
		font-size: 9px;
		font-weight: 600;
	}
	.memo {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
	}
	.head {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.2;
	}
	.body {
		fill: var(--color-brand);
	}
	.msg {
		fill: var(--color-brand);
	}
	.msg.cached {
		fill: var(--color-amber);
	}
	.cachebox {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.cachelines {
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.cachetext {
		fill: var(--color-amber);
		font-size: 10px;
		font-weight: 800;
	}
	.rack {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.strip {
		fill: var(--color-brand);
	}
	.strip.smallStrip {
		fill: var(--color-grass);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.tag {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.tagtext {
		fill: var(--color-amber);
		font-size: 9.5px;
		font-weight: 800;
	}
	.billtitle {
		fill: var(--color-ink);
		font-size: 11px;
		font-weight: 700;
	}
	.amount {
		fill: var(--color-ink);
		font-size: 13px;
		font-weight: 800;
		transition: fill 0.3s;
	}
	.amount.over {
		fill: var(--color-danger);
	}
	.amount.saved {
		fill: var(--color-grass);
	}
	.track {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.fill {
		fill: var(--color-brand);
		transition:
			width 0.5s ease,
			fill 0.3s;
	}
	.fill.over {
		fill: var(--color-danger);
	}
	.fill.saved {
		fill: var(--color-grass);
	}
	.budget {
		stroke: var(--color-ink);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.pop {
		animation: pop 0.4s ease both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.fill,
		.amount {
			transition: none;
		}
		.pop {
			animation: none;
		}
	}
</style>
