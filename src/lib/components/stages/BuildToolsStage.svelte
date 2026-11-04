<script lang="ts">
	// Guided "watch" stage. Six source files on the left, a build machine in the middle, and what
	// goes online on the right, with a download meter underneath. Following Nim's beats the files
	// first travel one by one, then the machine appears and bundles, minifies, and compresses
	// them by itself. The only optional play is switching the build tool off and on.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BuildToolsText, BuildStep } from '$lib/chapters/web/build-tools/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BuildToolsText);

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

	let off = $state(false);
	function toggle() {
		off = !off;
		onstate?.(off ? 'off' : 'on');
	}

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

	const JOBS: BuildStep[] = ['bundle', 'minify', 'compress'];
	const SRC = [
		[16, 44],
		[66, 44],
		[16, 108],
		[66, 108],
		[16, 172],
		[66, 172]
	];
	const SW = 42;
	const SH = 54;
	const MOUTH = [158, 132];

	type Out = 'none' | 'raw' | 'bundled' | 'minified' | 'compressed';
	const LOOP: Record<number, number> = { 3: 4200, 4: 3600, 5: 3200 };
	const FULL = 6000;
	const loopLen = $derived(LOOP[step] ?? (step >= 6 && !live ? FULL : 0));
	const lt = $derived(reduced || !loopLen ? 1e9 : t % loopLen);

	// Step 1, six trips, one file every 600 ms, then a rest.
	const arrived = $derived(
		step === 1 ? (reduced ? 6 : Math.min(6, Math.floor((t % 6000) / 600))) : 6
	);

	const out = $derived.by((): Out => {
		if (live) return off ? 'raw' : 'compressed';
		if (step === 0 || step === 2) return 'none';
		if (step === 1) return 'raw';
		if (step === 3) return lt >= 1700 ? 'bundled' : 'none';
		if (step === 4) return lt >= 1200 ? 'minified' : 'bundled';
		if (step === 5) return lt >= 900 ? 'compressed' : 'minified';
		return lt >= 3500 ? 'compressed' : 'none';
	});
	const lit = $derived.by((): Record<BuildStep, boolean> => {
		if (live) return { bundle: !off, minify: !off, compress: !off };
		if (step === 3) return { bundle: true, minify: false, compress: false };
		if (step === 4) return { bundle: false, minify: true, compress: false };
		if (step === 5) return { bundle: false, minify: false, compress: true };
		if (step >= 6) return { bundle: lt >= 1500, minify: lt >= 2300, compress: lt >= 3100 };
		return { bundle: false, minify: false, compress: false };
	});
	const feeding = $derived(!reduced && !live && (step === 3 || step >= 6));
	const showMachine = $derived(step >= 2);

	const meter = $derived.by(() => {
		if (step === 1 && !live) return { trips: arrived, kb: arrived * 40 };
		if (step >= 6 && !live) return { trips: 2, kb: 32 };
		if (out === 'bundled') return { trips: 2, kb: 230 };
		if (out === 'minified') return { trips: 2, kb: 110 };
		if (out === 'compressed') return { trips: 2, kb: 32 };
		return { trips: 6, kb: 240 };
	});
	const OUT_RAW = [
		[286, 44],
		[336, 44],
		[286, 108],
		[336, 108],
		[286, 172],
		[336, 172]
	];
	const OUT_BIG = [
		[282, 70],
		[338, 70]
	];
	const OUT_NAMES = ['app.js', 'app.css'];
</script>

{#snippet sheet(x: number, y: number, w: number, h: number, mini: boolean)}
	<rect {x} {y} width={w} height={h} rx="5" class="sheet" />
	<path d="M{x + w - 10} {y}v10h10" class="fold" />
	{#if mini}
		{#each [0, 1, 2, 3, 4, 5, 6, 7] as k (k)}
			<rect x={x + 5} y={y + 14 + k * 6} width={w - 10} height="3" rx="1.5" class="code" />
		{/each}
	{:else}
		<rect x={x + 6} y={y + 14} width={w * 0.6} height="3.5" rx="1.75" class="code" />
		<rect x={x + 12} y={y + 22} width={w * 0.5} height="3.5" rx="1.75" class="code" />
		<rect x={x + 6} y={y + 30} width={w * 0.4} height="3.5" rx="1.75" class="code" />
		<rect x={x + 6} y={y + 40} width={w * 0.55} height="3.5" rx="1.75" class="note" />
	{/if}
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 400 330"
			class="mx-auto block w-full max-w-[440px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<text x="62" y="30" text-anchor="middle" class="lbl">{tx.srcLabel}</text>
			{#each SRC as [x, y], i (i)}
				<g
					class:feed={feeding}
					class:sending={step === 1 && i === arrived && arrived < 6}
					style="--dx:{MOUTH[0] - x - SW / 2}px;--dy:{MOUTH[1] -
						y -
						SH / 2}px;--dur:{loopLen}ms;animation-delay:{i * 120}ms"
				>
					{@render sheet(x, y, SW, SH, false)}
				</g>
			{/each}

			<!-- the build machine -->
			{#if showMachine}
				<g in:fade={{ duration: 350 }} class:asleep={live && off}>
					<rect x="150" y="80" width="100" height="116" rx="16" class="machine" />
					<rect x="142" y="116" width="12" height="32" rx="4" class="mouth" />
					<rect x="246" y="116" width="12" height="32" rx="4" class="mouth" />
					<text x="200" y="104" text-anchor="middle" class="mlabel">{tx.toolLabel}</text>
					{#each JOBS as j, k (j)}
						<circle cx={172 + k * 28} cy="140" r="9" class="lamp" class:on={lit[j]} />
						<text x={172 + k * 28} y="222" text-anchor="middle" class="job" class:on={lit[j]}>
							{tx.jobs[j]}
						</text>
					{/each}
				</g>
			{/if}

			<!-- what goes online -->
			<text x="338" y="30" text-anchor="middle" class="lbl">{tx.outLabel}</text>
			{#key out}
				<g in:fade={{ duration: 300 }}>
					{#if out === 'raw'}
						{#each OUT_RAW as [x, y], i (i)}
							{#if live || step !== 1 || i < arrived}
								<g in:fade={{ duration: 250 }}>{@render sheet(x, y, SW, SH, false)}</g>
							{/if}
						{/each}
					{:else if out !== 'none'}
						{#each OUT_BIG as [x, y], i (i)}
							<g
								class="pack"
								class:squeezed={out === 'compressed'}
								style="transform-origin:{x + 24}px {y + 36}px"
							>
								{@render sheet(x, y, 48, 72, out !== 'bundled')}
								{#if out === 'bundled'}
									<rect x={x + 6} y={y + 50} width="30" height="3.5" rx="1.75" class="note" />
									<rect x={x + 6} y={y + 58} width="22" height="3.5" rx="1.75" class="code" />
								{/if}
								{#if out === 'compressed'}
									<rect x={x - 3} y={y + 30} width="54" height="12" rx="3" class="strap" />
								{/if}
							</g>
							<text x={x + 24} y={y + 96} text-anchor="middle" class="fname">{OUT_NAMES[i]}</text>
						{/each}
					{/if}
				</g>
			{/key}

			<!-- the meter -->
			<text x="16" y="270" class="mtext">{tx.tripsTpl.replace('{n}', String(meter.trips))}</text>
			<text x="384" y="270" text-anchor="end" class="mtext">
				{tx.sizeLabel}
				{tx.kbTpl.replace('{n}', String(meter.kb))}
			</text>
			<rect x="16" y="282" width="368" height="12" rx="6" class="track" />
			<rect
				x="16"
				y="282"
				width={Math.max(6, (368 * meter.kb) / 240)}
				height="12"
				rx="6"
				class="fillbar"
				class:light={meter.kb <= 40 && step !== 1}
			/>
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={!off} onclick={toggle}>
					{off ? tx.turnOn : tx.turnOff}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.lbl {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.sheet {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.fold {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.code {
		fill: var(--color-faint);
		opacity: 0.6;
	}
	.note {
		fill: var(--color-grass);
		opacity: 0.7;
	}
	.sending {
		animation: nudge 0.6s ease-in-out infinite;
	}
	.feed {
		animation: feed var(--dur) ease-in-out infinite;
	}
	.machine {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2.5;
	}
	.mouth {
		fill: var(--color-ink);
	}
	.mlabel {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.lamp {
		fill: var(--color-line);
		transition: fill 0.3s;
	}
	.lamp.on {
		fill: var(--color-amber);
	}
	.job {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.job.on {
		fill: var(--color-amber);
	}
	.asleep {
		opacity: 0.4;
	}
	.pack {
		transition: transform 0.6s ease-in-out;
	}
	.pack.squeezed {
		transform: scale(0.62);
	}
	.strap {
		fill: var(--color-amber);
		opacity: 0.85;
	}
	.fname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.mtext {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.track {
		fill: var(--color-line);
	}
	.fillbar {
		fill: var(--color-danger);
		transition:
			width 0.6s ease-in-out,
			fill 0.6s;
	}
	.fillbar.light {
		fill: var(--color-grass);
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
	@keyframes feed {
		0% {
			transform: translate(0, 0);
			opacity: 1;
		}
		30% {
			transform: translate(var(--dx), var(--dy)) scale(0.3);
			opacity: 0;
		}
		85% {
			transform: translate(0, 0);
			opacity: 0;
		}
		100% {
			transform: translate(0, 0);
			opacity: 1;
		}
	}
	@keyframes nudge {
		0%,
		100% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.feed,
		.sending {
			animation: none;
		}
		.lamp,
		.pack,
		.fillbar {
			transition: none;
		}
	}
</style>
