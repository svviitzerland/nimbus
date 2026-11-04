<script lang="ts">
	// Guided "watch" stage. A Card recipe on the left and a nimbus.com shop on the right follow
	// Nim's beats. The four cards look alike, then the empty Card appears, props flow into it and
	// finished cards drop onto the shelf one by one, the page parts get labelled, and finally the
	// Card gains a button that every copy picks up. The only optional play is taking it off again.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ComponentsText } from '$lib/chapters/web/components/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ComponentsText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const lastBeat = $derived(tx.intro.length - 1);
	const isPlay = $derived(beat >= lastBeat);

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(isPlay && peek === null);

	let userUp = $state(true);
	function toggle() {
		userUp = !userUp;
		onstate?.(userUp ? 'upgrade' : 'plain');
	}

	const money = (n: number) => tx.money.replace('{n}', String(n));
	const CW = 104;
	const CH = 116;
	const SLOTS = [
		[164, 90],
		[276, 90],
		[164, 216],
		[276, 216]
	];

	// One clock, restarted on every step.
	let t = $state(0);
	let reduced = $state(false);
	$effect(() => {
		void step;
		reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		t = 0;
		if (reduced) return;
		const start = Date.now();
		const id = setInterval(() => (t = Date.now() - start), 80);
		return () => clearInterval(id);
	});

	// The props part, one product every 1.7 s, then a rest before the loop starts again.
	const FILL = 1700;
	const fillT = $derived(step === 2 && !reduced ? t % (4 * FILL + 2000) : 1e9);
	const feeding = $derived(step === 2 && fillT < 4 * FILL ? Math.floor(fillT / FILL) : -1);
	const placed = $derived.by(() => {
		if (step === 1) return 0;
		if (step !== 2) return 4;
		return Math.min(4, Math.floor((fillT + FILL * 0.35) / FILL));
	});
	const showRecipe = $derived(step >= 1);

	// The change once part, the Card gains the button first, then each copy.
	const recipeUp = $derived(live ? userUp : step >= 5 || (step === 4 && (reduced || t >= 500)));
	function cardUp(i: number): boolean {
		if (live) return userUp;
		if (step >= 5) return true;
		if (step === 4) return reduced || t >= 1300 + i * 220;
		return false;
	}
</script>

{#snippet icon(i: number, cx: number, cy: number)}
	<g transform="translate({cx} {cy})">
		{#if i === 0}
			<path d="M10 -8c5 0 8 3 8 8s-3 8 -8 8" class="ln" />
			<rect x="-14" y="-16" width="26" height="32" rx="5" class="ic" />
		{:else if i === 1}
			<path d="M-16 4a16 16 0 0 1 32 0Z" class="ic" />
			<path d="M-4 4h24" class="ln" stroke-linecap="round" />
		{:else if i === 2}
			<path
				d="M-8 -14l-12 6 4 9 6 -3v18h20v-18l6 3 4 -9 -12 -6c-1 4 -4 6 -8 6s-7 -2 -8 -6Z"
				class="ic"
			/>
		{:else}
			<rect x="-14" y="-14" width="28" height="28" rx="7" class="ic" />
			<path d="M0 -7l2 5h5l-4 3 2 5 -5 -3 -5 3 2 -5 -4 -3h5Z" class="star" />
		{/if}
	</g>
{/snippet}

{#snippet card(i: number, x: number, y: number, up: boolean)}
	{@const p = tx.products[i]}
	<rect {x} {y} width={CW} height={CH} rx="10" class="card" class:same={step === 0} />
	<rect x={x + 8} y={y + 8} width={CW - 16} height="50" rx="6" class="img" />
	{@render icon(i, x + CW / 2, y + 33)}
	<text x={x + 10} y={y + 76} class="pn">{p.name}</text>
	<text x={x + 10} y={y + 92} class="pp">{money(p.price)}</text>
	{#if up}
		<g class="pop" style="transform-origin:{x + CW / 2}px {y + 106}px">
			<rect x={x + 8} y={y + 98} width={CW - 16} height="14" rx="7" class="cta" />
			<text x={x + CW / 2} y={y + 108.5} text-anchor="middle" class="ctaT">{tx.addToCart}</text>
		</g>
	{/if}
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 400 360"
			class="mx-auto block w-full max-w-[440px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- the Card recipe -->
			{#if showRecipe}
				<g in:fade={{ duration: 300 }}>
					<text x="70" y="102" text-anchor="middle" class="file">{tx.recipeLabel}</text>
					<rect x="18" y="112" width="104" height="128" rx="10" class="recipe" />
					<rect x="26" y="120" width="88" height="50" rx="6" class="img" />
					{#if feeding >= 0}
						{#key feeding}
							<g in:fade={{ duration: 200 }}>{@render icon(feeding, 70, 145)}</g>
						{/key}
						<text x="28" y="188" class="fill">{tx.products[feeding].name}</text>
						<text x="28" y="204" class="fill">{money(tx.products[feeding].price)}</text>
					{:else}
						<text x="70" y="149" text-anchor="middle" class="blank">?</text>
						<text x="28" y="188" class="code">{'{name}'}</text>
						<text x="28" y="204" class="code">{'{price}'}</text>
					{/if}
					{#if recipeUp}
						<g class="pop" style="transform-origin:70px 222px">
							<rect x="26" y="214" width="88" height="16" rx="8" class="cta" />
							<text x="70" y="225.5" text-anchor="middle" class="ctaT">{tx.addToCart}</text>
						</g>
					{/if}
					{#if step === 2}
						<text x="70" y="270" text-anchor="middle" class="file">{tx.propsLabel}</text>
						{#if feeding >= 0}
							{#key feeding}
								<g class="drip">
									<text x="70" y="290" text-anchor="middle" class="code"
										>name="{tx.products[feeding].name}"</text
									>
									<text x="70" y="306" text-anchor="middle" class="code"
										>price={'{'}{tx.products[feeding].price}{'}'}</text
									>
								</g>
							{/key}
						{/if}
					{/if}
				</g>
			{/if}

			<!-- the shop page -->
			<rect x="144" y="16" width="248" height="334" rx="12" class="browser" />
			<line x1="144" y1="40" x2="392" y2="40" class="bar" />
			<circle cx="158" cy="28" r="3" class="dot" />
			<circle cx="168" cy="28" r="3" class="dot" />
			<circle cx="178" cy="28" r="3" class="dot" />
			<text x="192" y="32" class="url">{tx.pageLabel}</text>
			<rect
				x="156"
				y="50"
				width="224"
				height="28"
				rx="7"
				class="header"
				class:tagged={step === 3}
			/>
			<circle cx="172" cy="64" r="6" style="fill:var(--color-brand)" />
			<text x="184" y="68" class="logo">nimbus</text>
			{#if step === 3}
				<text x="372" y="68" text-anchor="end" class="tag">{tx.headerTag}</text>
			{/if}

			{#each SLOTS as [x, y], i (i)}
				{#if i < placed}
					<g class:drop={step === 2}>
						{@render card(i, x, y, cardUp(i))}
					</g>
					{#if step === 3}
						<rect x={x + CW - 40} y={y - 7} width="36" height="15" rx="7" class="tagbg" />
						<text x={x + CW - 22} y={y + 4} text-anchor="middle" class="tagS">{tx.cardTag}</text>
					{/if}
				{:else}
					<rect {x} {y} width={CW} height={CH} rx="10" class="slot" />
				{/if}
			{/each}
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" onclick={toggle}>
					{userUp ? tx.removeButton : tx.addButton}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.browser {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.bar {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.dot {
		fill: var(--color-line);
	}
	.url {
		font-size: 10px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.header {
		fill: var(--color-brand-soft);
		stroke: transparent;
		stroke-width: 2;
	}
	.header.tagged {
		stroke: var(--color-amber);
	}
	.logo {
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.tag {
		font-size: 10.5px;
		font-weight: 800;
		fill: var(--color-amber);
	}
	.tagbg {
		fill: var(--color-amber);
	}
	.tagS {
		font-size: 9.5px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.card.same {
		animation: glow 2.4s ease-in-out infinite;
	}
	.slot {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.img {
		fill: var(--color-paper);
	}
	.ic {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2.5;
		stroke-linejoin: round;
	}
	.ln {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3;
	}
	.star {
		fill: var(--color-amber);
	}
	.pn {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.pp {
		font-size: 11px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.cta {
		fill: var(--color-brand);
	}
	.ctaT {
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-card);
	}
	.recipe {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 2.5;
	}
	.file {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		fill: var(--color-muted);
	}
	.fill {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.blank {
		font-size: 20px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.pop {
		animation: pop 0.45s ease-out both;
	}
	.drop {
		animation: drop 0.5s ease-out both;
	}
	.drip {
		animation: drip 1.7s ease-in-out both;
	}
	.play {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	@keyframes glow {
		0%,
		100% {
			stroke: var(--color-line);
		}
		50% {
			stroke: var(--color-amber);
		}
	}
	@keyframes pop {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes drop {
		from {
			transform: translateY(-10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes drip {
		0% {
			transform: translateY(14px);
			opacity: 0;
		}
		20%,
		60% {
			transform: translateY(0);
			opacity: 1;
		}
		100% {
			transform: translateY(-60px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card.same,
		.pop,
		.drop,
		.drip {
			animation: none;
		}
	}
</style>
