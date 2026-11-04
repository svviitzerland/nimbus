<script lang="ts">
	// A guided "watch" stage for GPUs. Two chips sit side by side with a pile of tiny sums each. The
	// CPU has four big cores, the GPU a whole field of tiny ones. Nim introduces each chip, then they
	// race by themselves on the pile, four sums at a time against everything at once. The only
	// optional play is the last beat, switching the job to a chain of steps where the CPU wins.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { GpuJobId, GpuText } from '$lib/chapters/ai/gpu/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as GpuText);

	// Which scene each beat shows (eight beats, six scenes).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 3, 4, 5];

	// The jobs. A pile of 120 sums, or a chain of 12 steps.
	const PILE = 120;
	const CHAIN = 12;
	// Timings in milliseconds. The CPU does 4 sums per round, the GPU does them all in one round.
	const CPU_ROUND = 150;
	const GPU_ROUND = 1400;
	const CPU_STEP = 220;
	const GPU_STEP = 650;
	const finishAt = (job: GpuJobId, cpu: boolean) =>
		job === 'pile'
			? cpu
				? (PILE / 4) * CPU_ROUND
				: GPU_ROUND
			: cpu
				? CHAIN * CPU_STEP
				: CHAIN * GPU_STEP;
	function doneAt(job: GpuJobId, cpu: boolean, t: number): number {
		if (t <= 0) return 0;
		if (job === 'pile')
			return cpu ? Math.min(PILE, Math.floor(t / CPU_ROUND) * 4) : t >= GPU_ROUND ? PILE : 0;
		return Math.min(CHAIN, Math.floor(t / (cpu ? CPU_STEP : GPU_STEP)));
	}

	// The chips, in a 120 by 120 box each.
	const CPU_CORES = [
		[20, 20],
		[62, 20],
		[20, 62],
		[62, 62]
	];
	const GPU_SIDE = 12;
	const GPU_CORES = Array.from({ length: GPU_SIDE * GPU_SIDE }, (_, k) => [
		19 + (k % GPU_SIDE) * 7,
		19 + Math.floor(k / GPU_SIDE) * 7
	]);
	const PINS = [28, 46, 64, 82];
	const PILE_CELLS = Array.from({ length: PILE }, (_, k) => [
		132 + (k % 12) * 13.5,
		14 + Math.floor(k / 12) * 9.5
	]);
	const CHAIN_CELLS = Array.from({ length: CHAIN }, (_, k) => 136 + k * 13.5);

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let job = $state<GpuJobId>('pile');
	let t = $state(-1); // milliseconds into the race, below zero means not started

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const activeJob = $derived<GpuJobId>(scene === 5 ? job : 'pile');
	const racing = $derived(scene >= 3);
	const total = $derived(activeJob === 'pile' ? PILE : CHAIN);

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
	});

	// The race clock. It runs, rests on the finished picture, and starts again. The remember
	// scene (and reduced motion) shows the finished race as a still frame.
	$effect(() => {
		const sc = scene;
		const j = activeJob;
		const end = Math.max(finishAt(j, true), finishAt(j, false));
		if (sc < 3) {
			t = -1;
			return;
		}
		if (sc === 4 || reduced) {
			t = end;
			return;
		}
		t = -700;
		const tick = 50;
		const iv = setInterval(() => {
			t += tick;
			if (t > end + 2800) t = -700;
		}, tick);
		return () => clearInterval(iv);
	});

	type Lane = {
		cpu: boolean;
		name: string;
		sub: string;
		nick: string;
		done: number;
		finished: boolean;
		started: boolean;
		secs: string;
	};
	const lanes = $derived.by<Lane[]>(() =>
		[true, false].map((cpu) => {
			const fin = finishAt(activeJob, cpu);
			return {
				cpu,
				name: cpu ? tx.cpuName : tx.gpuName,
				sub: cpu ? tx.cpuSub : tx.gpuSub,
				nick: cpu ? tx.cpuNick : tx.gpuNick,
				done: racing ? doneAt(activeJob, cpu, t) : 0,
				finished: racing && t >= fin,
				started: racing && t > 0,
				secs: (fin / 1000).toFixed(1)
			};
		})
	);
	const winner = $derived(finishAt(activeJob, true) < finishAt(activeJob, false));

	/** Which cores glow right now, for one lane. */
	function coreOn(l: Lane, k: number): boolean {
		if (!l.started || l.finished) return false;
		if (activeJob === 'chain') return k === 0;
		return true;
	}

	function switchJob() {
		job = job === 'pile' ? 'chain' : 'pile';
		onstate?.(job);
	}
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 5}
					<button type="button" class="try" onclick={switchJob} in:fade={{ duration: 250 }}
						>{tx.switchJob[job]}</button
					>
				{/if}
				{#if s >= 3}
					{#key activeJob}
						<p class="job" in:fade={{ duration: 300 }}>{tx.jobs[activeJob]}</p>
					{/key}
				{/if}

				{#each lanes as l (l.cpu)}
					{@const focus = s === 0 ? false : s === 1 ? l.cpu : s === 2 ? !l.cpu : true}
					<div class="lane" class:dim={!focus}>
						<div class="head">
							<span class="name">{l.name}</span>
							<span class="sub">{l.sub}</span>
							{#if s >= 3}
								<span
									class="status"
									class:win={l.finished && l.cpu === winner}
									class:done={l.finished}
								>
									{l.finished
										? tx.doneIn.replace('{s}', l.secs)
										: l.started
											? tx.working
											: tx.ready}
								</span>
							{/if}
						</div>
						<svg viewBox="0 0 300 120" class="chip-row" aria-hidden="true">
							<!-- the chip -->
							<g class="chip">
								{#each PINS as p (p)}
									<line x1={p} y1="2" x2={p} y2="10" class="pin" />
									<line x1={p} y1="110" x2={p} y2="118" class="pin" />
									<line x1="2" y1={p} x2="10" y2={p} class="pin" />
									<line x1="110" y1={p} x2="118" y2={p} class="pin" />
								{/each}
								<rect x="10" y="10" width="100" height="100" rx="12" class="body" />
								{#if l.cpu}
									{#each CPU_CORES as [x, y], k (k)}
										<rect
											{x}
											{y}
											width="38"
											height="38"
											rx="7"
											class="core big"
											class:on={coreOn(l, k)}
											class:intro={s === 1}
											style="animation-delay: {k * 350}ms"
										/>
									{/each}
								{:else}
									{#each GPU_CORES as [x, y], k (k)}
										<rect
											{x}
											{y}
											width="5.4"
											height="5.4"
											rx="1.2"
											class="core tiny"
											class:on={coreOn(l, k)}
											class:intro={s === 2}
											style="animation-delay: {((k * 37) % 23) * 70}ms"
										/>
									{/each}
								{/if}
							</g>

							<!-- the job, a pile of sums or a chain of steps -->
							{#if activeJob === 'pile'}
								{#each PILE_CELLS as [x, y], k (k)}
									<rect
										{x}
										{y}
										width="11"
										height="7.5"
										rx="2"
										class="sum"
										class:done={k < l.done}
										class:appear={s === 0}
										style="animation-delay: {k * 14}ms"
									/>
								{/each}
							{:else}
								<line
									x1={CHAIN_CELLS[0]}
									y1="60"
									x2={CHAIN_CELLS[CHAIN - 1]}
									y2="60"
									class="link"
								/>
								{#each CHAIN_CELLS as x, k (k)}
									<circle cx={x} cy="60" r="5" class="sum" class:done={k < l.done} />
								{/each}
							{/if}
						</svg>
						{#if s === 4}
							<p class="nick" in:fade={{ duration: 300, delay: l.cpu ? 0 : 400 }}>{l.nick}</p>
						{/if}
					</div>
				{/each}

				{#if s === 4}
					<p class="rule" in:fade={{ duration: 300, delay: 700 }}>{tx.rule}</p>
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
		align-items: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
	}
	.try {
		align-self: center;
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.try:hover {
		transform: translateY(-1px);
	}
	.job {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.lane {
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px 14px 8px;
		transition: opacity 0.5s;
	}
	.lane.dim {
		opacity: 0.35;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 8px;
	}
	.name {
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.sub {
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.status {
		margin-left: auto;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.status.done {
		color: var(--color-muted);
	}
	.status.win {
		color: var(--color-grass);
	}
	.chip-row {
		display: block;
		width: 100%;
		height: auto;
		margin-top: 6px;
	}
	.pin {
		stroke: var(--color-faint);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.body {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.core {
		transition: fill 0.25s;
	}
	.core.big {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.core.big.on {
		fill: var(--color-brand);
	}
	.core.tiny {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 0.6;
	}
	.core.tiny.on {
		fill: var(--color-grass);
	}
	.core.big.intro {
		animation: glow-big 1.4s ease-in-out infinite;
	}
	.core.tiny.intro {
		animation: glow-tiny 1.6s ease-in-out infinite;
	}
	@keyframes glow-big {
		0%,
		60%,
		100% {
			fill: var(--color-brand-soft);
		}
		25% {
			fill: var(--color-brand);
		}
	}
	@keyframes glow-tiny {
		0%,
		60%,
		100% {
			fill: var(--color-grass-soft);
		}
		25% {
			fill: var(--color-grass);
		}
	}

	.sum {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1;
		transition: fill 0.25s;
	}
	.sum.done {
		fill: var(--color-grass);
		stroke: var(--color-grass);
	}
	.sum.appear {
		animation: appear 0.4s ease-out both;
	}
	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.link {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.nick {
		margin: 2px 0 0;
		text-align: center;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lane,
		.core,
		.sum {
			transition: none;
		}
		.core.intro,
		.sum.appear {
			animation: none;
		}
	}
</style>
