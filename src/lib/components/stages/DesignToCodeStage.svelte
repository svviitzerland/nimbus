<script lang="ts">
	// Guided "watch" stage. One desk scene follows Nim's beats. A Figma frame draws a button, the
	// inspect panel lights up its four numbers, a CSS file types those numbers line by line, and
	// a browser redraws the button one property at a time until it matches the design. The only
	// optional play is leaving out the padding line on the last beat.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DesignToCodeText, DesignProp } from '$lib/chapters/web/design-to-code/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DesignToCodeText);

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

	let noPad = $state(false);
	function toggle() {
		noPad = !noPad;
		onstate?.(noPad ? 'nopad' : 'pad');
	}

	const PROPS: DesignProp[] = ['color', 'radius', 'padding', 'font'];
	const VALUES: Record<DesignProp, string> = {
		color: '#2E6FE0',
		radius: '12',
		padding: '24',
		font: '16'
	};
	// Real CSS, shown as is. Line i + 1 holds PROPS[i].
	const CSS = [
		'.start {',
		'  background: #2E6FE0;',
		'  border-radius: 12px;',
		'  padding: 11px 24px;',
		'  font-size: 16px;',
		'}'
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

	// Which inspect row glows on the numbers part.
	const hiInspect = $derived(step === 1 && !reduced ? Math.floor(t / 1100) % 4 : -1);
	// How many CSS lines are typed on the typing part (loops with a pause).
	const typed = $derived(step === 2 && !reduced ? Math.min(4, Math.floor((t % 6200) / 1000)) : 4);
	// How many properties the browser has applied on the drawing part (loops with a pause).
	const applied = $derived(
		step === 3 && !reduced ? Math.min(4, Math.floor((t % 6600) / 1100)) : step >= 3 ? 4 : 0
	);
	const padOff = $derived(live && noPad);
	const hiLine = $derived(step === 2 ? typed - 1 : step === 3 ? applied - 1 : padOff ? 2 : -1);

	type Btn = { x: number; y: number; w: number; h: number; r: number; fs: number; on: boolean };
	function btn(cx: number, cy: number, has: (p: DesignProp) => boolean): Btn {
		const fs = has('font') ? 16 : 12;
		const px = has('padding') ? 24 : 3;
		const py = has('padding') ? 11 : 2;
		const w = tx.button.length * fs * 0.56 + px * 2;
		const h = fs * 1.25 + py * 2;
		return { x: cx - w / 2, y: cy - h / 2, w, h, r: has('radius') ? 12 : 0, fs, on: has('color') };
	}
	const designBtn = $derived(btn(132, 112, () => true));
	const pageBtn = $derived(
		btn(298, 318, (p) => {
			const i = PROPS.indexOf(p);
			if (i >= applied) return false;
			return !(p === 'padding' && padOff);
		})
	);
	const matches = $derived(step >= 4 && !padOff);
</script>

{#snippet button(b: Btn)}
	<rect x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} class="btn" class:on={b.on} />
	<text
		x={b.x + b.w / 2}
		y={b.y + b.h / 2 + b.fs * 0.35}
		text-anchor="middle"
		class="btnT"
		class:on={b.on}
		style="font-size:{b.fs}px">{tx.button}</text
	>
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 400 432"
			class="mx-auto block w-full max-w-[440px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- the design frame -->
			<rect
				x="8"
				y="8"
				width="384"
				height="176"
				rx="12"
				style="fill:var(--color-card);stroke:var(--color-line)"
				stroke-width="2"
			/>
			<text x="22" y="30" class="cap">{tx.designLabel}</text>
			<rect x="16" y="40" width="238" height="136" rx="8" style="fill:var(--color-paper)" />
			{#key step === 0}
				<g class:grow={step === 0} style="transform-origin:132px 112px">
					{@render button(designBtn)}
				</g>
			{/key}

			<!-- measuring marks on the numbers part -->
			{#if hiInspect === 0}
				<rect
					x={designBtn.x - 5}
					y={designBtn.y - 5}
					width={designBtn.w + 10}
					height={designBtn.h + 10}
					rx="16"
					class="mark"
				/>
			{:else if hiInspect === 1}
				<circle cx={designBtn.x + 4} cy={designBtn.y + 4} r="9" class="mark" />
			{:else if hiInspect === 2}
				<rect
					x={designBtn.x}
					y={designBtn.y + 6}
					width="22"
					height={designBtn.h - 12}
					class="padmark"
				/>
				<rect
					x={designBtn.x + designBtn.w - 22}
					y={designBtn.y + 6}
					width="22"
					height={designBtn.h - 12}
					class="padmark"
				/>
			{:else if hiInspect === 3}
				<line
					x1={designBtn.x + 24}
					y1={designBtn.y + designBtn.h + 8}
					x2={designBtn.x + designBtn.w - 24}
					y2={designBtn.y + designBtn.h + 8}
					class="mark"
				/>
			{/if}

			<!-- the inspect panel -->
			{#if step >= 1}
				<g in:fade={{ duration: 300 }}>
					<rect x="262" y="40" width="122" height="136" rx="8" style="fill:var(--color-paper)" />
					<text x="272" y="60" class="cap">{tx.specLabel}</text>
					{#each PROPS as p, i (p)}
						{@const y = 84 + i * 24}
						{@const lit = hiInspect === i || (step === 2 && typed - 1 === i)}
						<rect x="266" y={y - 14} width="114" height="20" rx="5" class="row" class:lit />
						<text x="272" {y} class="pname">{tx.props[p]}</text>
						{#if step === 5}
							<text x="376" {y} text-anchor="end" class="token">{tx.tokens[p]}</text>
						{:else}
							<text x="376" {y} text-anchor="end" class="pval">{VALUES[p]}</text>
						{/if}
					{/each}
				</g>
			{/if}

			<!-- the CSS file -->
			{#if step >= 2}
				<g in:fade={{ duration: 300 }}>
					<rect x="8" y="200" width="190" height="224" rx="12" style="fill:var(--color-ink)" />
					<text x="20" y="222" class="cap dark">{tx.codeLabel}</text>
					{#each CSS as line, i (i)}
						{@const k = i - 1}
						{@const shown = k < 0 || k >= 4 || k < typed}
						{@const struck = padOff && k === 2}
						{#if k === hiLine}
							<rect x="12" y={234 + i * 26} width="182" height="20" rx="4" class="hl" />
						{/if}
						{#if shown}
							<text x="18" y={248 + i * 26} class="code" class:struck>{line}</text>
							{#if struck}
								<line
									x1="18"
									y1={244 + i * 26}
									x2="160"
									y2={244 + i * 26}
									style="stroke:var(--color-danger)"
									stroke-width="1.5"
								/>
							{/if}
						{/if}
					{/each}
				</g>
			{/if}

			<!-- the browser -->
			{#if step >= 3}
				<g in:fade={{ duration: 300 }}>
					<rect
						x="206"
						y="200"
						width="186"
						height="224"
						rx="12"
						style="fill:var(--color-card);stroke:var(--color-line)"
						stroke-width="2"
					/>
					<line
						x1="206"
						y1="226"
						x2="392"
						y2="226"
						style="stroke:var(--color-line)"
						stroke-width="2"
					/>
					<circle cx="220" cy="213" r="3" style="fill:var(--color-line)" />
					<circle cx="230" cy="213" r="3" style="fill:var(--color-line)" />
					<circle cx="240" cy="213" r="3" style="fill:var(--color-line)" />
					<text x="254" y="217" class="url">{tx.pageLabel}</text>
					{@render button(pageBtn)}
					{#if step >= 4}
						<g in:fade={{ duration: 250 }}>
							<circle cx={298 - 52} cy="386" r="7" class:okdot={matches} class:baddot={!matches} />
							<text x={298 - 40} y="390" class="badge" class:good={matches}>
								{matches ? tx.matched : tx.mismatch}
							</text>
						</g>
					{/if}
				</g>
			{/if}
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={noPad} onclick={toggle}>
					{noPad ? tx.restorePadding : tx.skipPadding}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.cap {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.cap.dark {
		fill: var(--color-faint);
	}
	.btn {
		fill: var(--color-line);
		transition: fill 0.35s;
	}
	.btn.on {
		fill: var(--color-brand);
	}
	.btnT {
		font-weight: 700;
		fill: var(--color-ink);
		transition: fill 0.35s;
	}
	.btnT.on {
		fill: var(--color-card);
	}
	.grow {
		animation: grow 0.9s ease-out both;
	}
	.mark {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.padmark {
		fill: var(--color-amber);
		opacity: 0.45;
	}
	.row {
		fill: transparent;
		transition: fill 0.25s;
	}
	.row.lit {
		fill: var(--color-amber-soft);
	}
	.pname {
		font-size: 10px;
		fill: var(--color-muted);
	}
	.pval {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.token {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		fill: var(--color-paper);
		white-space: pre;
	}
	.code.struck {
		opacity: 0.4;
	}
	.hl {
		fill: var(--color-brand);
		opacity: 0.35;
	}
	.url {
		font-size: 10px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.badge {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-danger);
	}
	.badge.good {
		fill: var(--color-grass);
	}
	.okdot {
		fill: var(--color-grass);
	}
	.baddot {
		fill: var(--color-danger);
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
	@keyframes grow {
		from {
			transform: scale(0.3);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.grow {
			animation: none;
		}
		.btn,
		.btnT,
		.row {
			transition: none;
		}
	}
</style>
