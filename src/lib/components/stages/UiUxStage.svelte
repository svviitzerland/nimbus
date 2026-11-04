<script lang="ts">
	// Guided "watch" stage. One phone with the nimbus.com mug shop follows Nim's beats. First the
	// plain shop, then callouts for the UI parts, then a finger buys the mug by itself (UX), then
	// the same checkout made carelessly and made with care, a Norman door aside, and a remember
	// part. The only optional play is flipping between the careless and careful shop at the end.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { UiUxText } from '$lib/chapters/web/ui-ux/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as UiUxText);

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

	let userMessy = $state(false);
	function toggle() {
		userMessy = !userMessy;
		onstate?.(userMessy ? 'messy' : 'clear');
	}

	type Screen = 'shop' | 'messy' | 'clear' | 'door';
	const screen = $derived.by((): Screen => {
		if (step <= 2) return 'shop';
		if (step === 3) return 'messy';
		if (step === 5) return 'door';
		if (step === 6 && live && userMessy) return 'messy';
		return 'clear';
	});
	const showFlags = $derived(step === 3 || step === 4 || (step === 6 && live));
	const showTags = $derived(step === 6 && !live);

	// A clock for the finger that buys the mug on the UX part. Loops every 4.6 s.
	let t = $state(0);
	let reduced = $state(false);
	$effect(() => {
		void step;
		reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		t = 0;
		if (reduced || step !== 2) return;
		const start = Date.now();
		const id = setInterval(() => (t = (Date.now() - start) % 4600), 50);
		return () => clearInterval(id);
	});
	const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
	const fingerP = $derived(ease(t / 1200));
	const fingerX = $derived(300 - 100 * fingerP);
	const fingerY = $derived(392 - 72 * fingerP);
	const pressing = $derived(step === 2 && t >= 1200 && t < 1600);
	const bought = $derived(step === 2 && (reduced || t >= 1600) && t < 4200);
</script>

{#snippet mug(x: number, y: number, s: number)}
	<g transform="translate({x} {y}) scale({s})">
		<path
			d="M44 12c6 0 10 4 10 11s-4 11-10 11"
			style="fill:none;stroke:var(--color-brand)"
			stroke-width="5"
			stroke-linecap="round"
		/>
		<rect
			x="0"
			y="0"
			width="46"
			height="56"
			rx="8"
			style="fill:var(--color-brand-soft);stroke:var(--color-brand)"
			stroke-width="3"
		/>
		<path
			d="M13 33a6 6 0 0 1 6 -7a8 8 0 0 1 14 2a5 5 0 0 1 0 10h-18a5 5 0 0 1 -2 -5Z"
			style="fill:var(--color-card);stroke:var(--color-brand)"
			stroke-width="2"
		/>
	</g>
{/snippet}

{#snippet flag(x: number, y: number, tx2: number, label: string, side: 'l' | 'r', good: boolean)}
	<g in:fade={{ duration: 300 }}>
		<line
			x1={side === 'l' ? x + 4 : x - 4}
			y1={y - 4}
			x2={tx2}
			y2={y - 4}
			class="flagline"
			class:good
		/>
		<circle cx={tx2} cy={y - 4} r="3.5" class="flagdot" class:good />
		<text {x} {y} text-anchor={side === 'l' ? 'end' : 'start'} class="flag" class:good>{label}</text
		>
	</g>
{/snippet}

{#snippet itemRow()}
	{@render mug(140, 80, 0.42)}
	<text x="172" y="98" class="item">{tx.product}</text>
	<text x="264" y="98" text-anchor="end" class="item">{tx.price}</text>
	<line x1="140" y1="118" x2="264" y2="118" style="stroke:var(--color-line)" stroke-width="1.5" />
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="-20 0 440 400"
			class="mx-auto block w-full max-w-[460px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			{#if screen === 'door'}
				<g in:fade={{ duration: 300 }}>
					<rect x="130" y="30" width="140" height="340" rx="6" style="fill:var(--color-line)" />
					<rect
						x="142"
						y="42"
						width="116"
						height="328"
						rx="4"
						style="fill:var(--color-amber-soft);stroke:var(--color-amber)"
						stroke-width="2"
					/>
					<rect
						x="156"
						y="60"
						width="88"
						height="110"
						rx="4"
						style="fill:none;stroke:var(--color-amber)"
						stroke-width="1.5"
						opacity="0.6"
					/>
					<rect
						x="156"
						y="236"
						width="88"
						height="110"
						rx="4"
						style="fill:none;stroke:var(--color-amber)"
						stroke-width="1.5"
						opacity="0.6"
					/>
					<rect x="190" y="182" width="56" height="22" rx="4" style="fill:var(--color-card)" />
					<text x="218" y="198" text-anchor="middle" class="sign">{tx.door.sign}</text>
					<path
						d="M232 214h8v52h-8"
						class="handle"
						style="fill:none;stroke:var(--color-ink)"
						stroke-width="5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<circle cx="300" cy="120" r="16" style="fill:var(--color-danger)" class="huh" />
					<text x="300" y="126" text-anchor="middle" class="q">?</text>
					<text x="200" y="392" text-anchor="middle" class="cap">{tx.door.caption}</text>
				</g>
			{:else}
				<!-- the phone -->
				<rect x="116" y="12" width="168" height="352" rx="28" style="fill:var(--color-ink)" />
				<rect x="124" y="22" width="152" height="332" rx="21" style="fill:var(--color-card)" />
				<rect x="180" y="28" width="40" height="6" rx="3" style="fill:var(--color-line)" />
				<rect x="124" y="40" width="152" height="28" style="fill:var(--color-brand-soft)" />
				<circle cx="146" cy="54" r="5" style="fill:var(--color-brand)" />
				<text x="200" y="58" text-anchor="middle" class="site">{tx.site}</text>

				{#key screen}
					<g in:fade={{ duration: 300 }}>
						{#if screen === 'shop'}
							{#if bought}
								<g in:fade={{ duration: 250 }}>
									<circle cx="200" cy="190" r="34" style="fill:var(--color-grass-soft)" />
									<path
										d="M184 190l11 11 22 -24"
										style="fill:none;stroke:var(--color-grass)"
										stroke-width="5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<text x="200" y="256" text-anchor="middle" class="name">{tx.paid}</text>
								</g>
							{:else}
								{@render mug(176, 94, 1)}
								<text x="200" y="196" text-anchor="middle" class="name">{tx.product}</text>
								<text x="200" y="222" text-anchor="middle" class="price">{tx.price}</text>
								<rect
									x="146"
									y="300"
									width="108"
									height="38"
									rx="12"
									class="buy"
									class:press={pressing}
								/>
								<text x="200" y="324" text-anchor="middle" class="btnT">{tx.buy}</text>
							{/if}
						{:else if screen === 'messy'}
							{@render itemRow()}
							<text x="140" y="146" class="fee">{tx.messy.fee}</text>
							<text x="140" y="176" class="total">{tx.messy.total}</text>
							<rect x="146" y="272" width="108" height="32" rx="6" class="dull" />
							<text x="200" y="293" text-anchor="middle" class="dullT">{tx.messy.cancel}</text>
							<rect x="146" y="312" width="108" height="32" rx="6" class="dull" />
							<text x="200" y="333" text-anchor="middle" class="dullT">{tx.messy.next}</text>
						{:else}
							{@render itemRow()}
							<text x="140" y="146" class="free">{tx.clear.free}</text>
							<text x="140" y="176" class="total">{tx.clear.total}</text>
							<rect x="146" y="304" width="108" height="42" rx="12" class="buy" />
							<text x="200" y="330" text-anchor="middle" class="btnT">{tx.clear.pay}</text>
						{/if}
					</g>
				{/key}

				{#if step === 1}
					{@render flag(112, 58, 140, tx.uiColor, 'l', false)}
					{@render flag(112, 200, 160, tx.uiFont, 'l', false)}
					{@render flag(288, 323, 254, tx.uiButton, 'r', false)}
				{/if}

				{#if showFlags && screen === 'messy'}
					{#key step}
						<g>
							{@render flag(288, 312, 254, tx.messy.flags[0], 'r', false)}
							{@render flag(112, 337, 146, tx.messy.flags[1], 'l', false)}
							{@render flag(112, 150, 140, tx.messy.flags[2], 'l', false)}
						</g>
					{/key}
				{/if}
				{#if showFlags && screen === 'clear'}
					{#key step}
						<g>
							{@render flag(288, 330, 254, tx.clear.flags[0], 'r', true)}
							{@render flag(112, 334, 146, tx.clear.flags[1], 'l', true)}
							{@render flag(112, 180, 140, tx.clear.flags[2], 'l', true)}
						</g>
					{/key}
				{/if}

				{#if showTags}
					<g in:fade={{ duration: 300 }}>
						<circle cx="58" cy="120" r="22" style="fill:var(--color-brand-soft)" />
						<path
							d="M44 120c4 -7 9 -10 14 -10s10 3 14 10c-4 7 -9 10 -14 10s-10 -3 -14 -10Z"
							style="fill:none;stroke:var(--color-brand)"
							stroke-width="2"
						/>
						<circle cx="58" cy="120" r="4" style="fill:var(--color-brand)" />
						<text x="58" y="160" text-anchor="middle" class="tagT">{tx.lookTag}</text>
						<circle cx="342" cy="262" r="22" style="fill:var(--color-grass-soft)" />
						<path
							d="M332 262c4 4 8 7 10 7s6 -3 10 -7M335 255h0M349 255h0"
							style="fill:none;stroke:var(--color-grass)"
							stroke-width="2.5"
							stroke-linecap="round"
						/>
						<text x="342" y="302" text-anchor="middle" class="tagT good">{tx.feelTag}</text>
					</g>
				{/if}

				{#if step === 2 && !bought}
					<g class="finger" transform="translate({fingerX} {fingerY})">
						{#if pressing}
							<circle r="20" style="fill:var(--color-brand)" opacity="0.18" />
						{/if}
						<circle
							r="11"
							style="fill:var(--color-amber-soft);stroke:var(--color-amber)"
							stroke-width="2.5"
						/>
					</g>
				{/if}
			{/if}
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={userMessy} onclick={toggle}>
					{userMessy ? tx.showClear : tx.showMessy}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.site {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.name {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.price {
		font-size: 15px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.item {
		font-size: 12px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.total {
		font-size: 14px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.fee {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-danger);
		animation: popIn 3.4s ease-in-out infinite;
	}
	.free {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.buy {
		fill: var(--color-brand);
		transition: fill 0.15s;
	}
	.buy.press {
		fill: var(--color-ink);
	}
	.btnT {
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-card);
	}
	.dull {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.dullT {
		font-size: 12px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.flag {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-danger);
	}
	.flag.good {
		fill: var(--color-grass);
	}
	.flagline {
		stroke: var(--color-danger);
		stroke-width: 1.5;
		opacity: 0.6;
	}
	.flagline.good {
		stroke: var(--color-grass);
	}
	.flagdot {
		fill: var(--color-danger);
	}
	.flagdot.good {
		fill: var(--color-grass);
	}
	.tagT {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.tagT.good {
		fill: var(--color-grass);
	}
	.sign {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.08em;
		fill: var(--color-ink);
	}
	.cap {
		font-size: 12px;
		fill: var(--color-muted);
	}
	.q {
		font-size: 18px;
		font-weight: 800;
		fill: var(--color-card);
		pointer-events: none;
	}
	.huh {
		animation: pulse 2.6s ease-in-out infinite;
		transform-origin: 300px 120px;
	}
	.handle {
		animation: tug 2.6s ease-in-out infinite;
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
	.play.on {
		border-color: var(--color-grass);
		color: var(--color-grass);
	}
	@keyframes popIn {
		0%,
		25% {
			opacity: 0;
		}
		40%,
		100% {
			opacity: 1;
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
	@keyframes tug {
		0%,
		60%,
		100% {
			transform: translateX(0);
		}
		70%,
		85% {
			transform: translateX(5px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fee,
		.huh,
		.handle {
			animation: none;
		}
		.buy {
			transition: none;
		}
	}
</style>
