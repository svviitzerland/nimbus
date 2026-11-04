<script lang="ts">
	// Guided "watch" stage. Six little nimbus.com pages sit around the scene. First they appear one
	// by one, then a pencil walks from page to page changing the mug price by hand, then one missed
	// page shows the bug. With a framework the price moves into one box in the middle, and a change
	// travels down the wires to every page at once. The only optional play is changing that price.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { WhyFrameworkText } from '$lib/chapters/web/why-framework/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as WhyFrameworkText);

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

	const W = 96;
	const H = 92;
	const POS = [
		[24, 10],
		[152, 10],
		[280, 10],
		[24, 278],
		[152, 278],
		[280, 278]
	];
	const CX = 200;
	const CY = 190;
	const MISSED = 3;
	const money = (n: number) => tx.money.replace('{n}', String(n));

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

	// The optional play, the price in the one box, with pages following a moment later.
	let userPrice = $state(9);
	let userPagePrice = $state(9);
	let userPulse = $state(0);
	let timer: ReturnType<typeof setTimeout> | undefined;
	function change() {
		userPrice = userPrice === 9 ? 12 : 9;
		userPulse += 1;
		clearTimeout(timer);
		const p = userPrice;
		timer = setTimeout(() => (userPagePrice = p), reduced ? 0 : 480);
		onstate?.('price');
	}
	$effect(() => () => clearTimeout(timer));

	// By hand, the pencil visits a page every 900 ms, then the loop rests.
	const HAND = 900;
	const handT = $derived(step === 1 && !reduced ? t % (6 * HAND + 1800) : 1e9);
	const pencilAt = $derived(Math.min(5, Math.floor(handT / HAND)));

	// The framework loop, the price flips every 2.8 s and pages follow after 0.5 s.
	const LOOP = 2800;
	const phase = $derived(step === 3 && !reduced ? Math.floor(t / LOOP) : 0);
	const storePrice = $derived(live ? userPrice : phase % 2 === 0 ? 9 : 12);
	const loopPagePrice = $derived(
		step === 3 && !reduced && t % LOOP < 500 ? (storePrice === 9 ? 12 : 9) : storePrice
	);
	const pulseKey = $derived(live ? userPulse : phase);
	const showStore = $derived(step >= 3);
	const showPulse = $derived((step === 3 && !reduced) || (live && userPulse > 0));

	function priceOf(i: number): number {
		if (step === 0) return 12;
		if (step === 1) return handT >= i * HAND + 600 ? 9 : 12;
		if (step === 2) return i === MISSED ? 12 : 9;
		if (live) return userPagePrice;
		return loopPagePrice;
	}
</script>

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 400 380"
			class="mx-auto block w-full max-w-[420px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- wires from the one place to every page -->
			{#if showStore}
				{#each POS as [x, y], i (i)}
					<line x1={CX} y1={CY} x2={x + W / 2} y2={y + H / 2} class="wire" />
				{/each}
				{#if showPulse}
					{#key pulseKey}
						{#each POS as [x, y], i (i)}
							<circle
								cx={CX}
								cy={CY}
								r="5"
								class="pulse"
								style="--dx:{x + W / 2 - CX}px;--dy:{y + H / 2 - CY}px"
							/>
						{/each}
					{/key}
				{/if}
			{/if}

			<!-- the six pages -->
			{#each POS as [x, y], i (i)}
				{@const price = priceOf(i)}
				{@const bad = step === 2 && i === MISSED}
				<g class="page" class:appear={step === 0} style="animation-delay:{i * 0.35}s">
					<rect {x} {y} width={W} height={H} rx="10" class="sheet" class:bad />
					<line x1={x} y1={y + 26} x2={x + W} y2={y + 26} class="bar" />
					<text x={x + 10} y={y + 18} class="pname">{tx.pages[i]}</text>
					<g transform="translate({x + 38} {y + 34}) scale(0.38)">
						<path
							d="M44 12c6 0 10 4 10 11s-4 11 -10 11"
							style="fill:none;stroke:var(--color-brand)"
							stroke-width="6"
						/>
						<rect
							width="46"
							height="56"
							rx="8"
							style="fill:var(--color-brand-soft);stroke:var(--color-brand)"
							stroke-width="4"
						/>
					</g>
					<text
						x={x + W / 2}
						y={y + 80}
						text-anchor="middle"
						class="price"
						class:bad
						class:sale={price === 9}
					>
						{money(price)}
					</text>
				</g>
			{/each}

			<!-- the pencil, by hand -->
			{#if step === 1}
				{@const [px, py] = POS[pencilAt]}
				<g class="pencil" style="transform:translate({px + 84}px, {py + 62}px)">
					<g transform="rotate(35)">
						<rect x="-4" y="-30" width="8" height="24" rx="1.5" style="fill:var(--color-amber)" />
						<rect x="-4" y="-34" width="8" height="5" rx="1.5" style="fill:var(--color-danger)" />
						<path d="M-4 -6L4 -6L0 3Z" style="fill:var(--color-ink)" />
					</g>
				</g>
			{/if}

			<!-- the bug note -->
			{#if step === 2}
				<g>
					<circle cx="118" cy="190" r="13" style="fill:var(--color-danger)" class="huh" />
					<text x="118" y="196" text-anchor="middle" class="q">!</text>
					<text x="140" y="195" class="bug">{tx.bugNote}</text>
				</g>
			{/if}

			<!-- the one place the price lives -->
			{#if showStore}
				<g>
					<rect x={CX - 56} y={CY - 32} width="112" height="64" rx="14" class="store" />
					<text x={CX} y={CY - 10} text-anchor="middle" class="slabel">{tx.storeLabel}</text>
					<text x={CX} y={CY + 18} text-anchor="middle" class="sprice">{money(storePrice)}</text>
				</g>
			{/if}
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" onclick={change}>
					{userPrice === 9 ? tx.raise : tx.lower}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.sheet {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.3s;
	}
	.sheet.bad {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.bar {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.pname {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.price {
		font-size: 16px;
		font-weight: 800;
		fill: var(--color-ink);
		transition: fill 0.3s;
	}
	.price.sale {
		fill: var(--color-grass);
	}
	.price.bad {
		fill: var(--color-danger);
	}
	.appear {
		animation: appear 0.6s ease-out both;
	}
	.wire {
		stroke: var(--color-brand);
		stroke-width: 2;
		opacity: 0.35;
	}
	.pulse {
		fill: var(--color-brand);
		animation: travel 0.5s ease-in forwards;
	}
	.store {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2.5;
	}
	.slabel {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.sprice {
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.pencil {
		transition: transform 0.45s ease-in-out;
	}
	.bug {
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-danger);
	}
	.q {
		font-size: 16px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.huh {
		animation: pulse 2.4s ease-in-out infinite;
		transform-origin: 118px 190px;
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
	@keyframes appear {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes travel {
		from {
			transform: translate(0, 0);
			opacity: 1;
		}
		to {
			transform: translate(var(--dx), var(--dy));
			opacity: 0;
		}
	}
	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		60% {
			transform: scale(1.12);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.appear,
		.pulse,
		.huh {
			animation: none;
		}
		.pulse {
			opacity: 0;
		}
		.pencil,
		.sheet,
		.price {
			transition: none;
		}
	}
</style>
