<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { GpuText } from '$lib/chapters/ai/gpu/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as GpuText);

	// Two chips. A CPU core finishes a sum in 1 tick, a GPU core is simpler and needs 4.
	const CHIPS = [
		{ cores: 8, cost: 1, cols: 4 },
		{ cores: 256, cost: 4, cols: 16 }
	];
	// The neural net job is a pile of independent sums, the recipe is a chain of steps.
	const JOBS = [
		{ total: 1024, parallel: true },
		{ total: 64, parallel: false }
	];
	const TICK_MS = 22;
	const SECONDS_PER_TICK = 0.05;

	let job = $state(0);
	let t = $state(0); // ticks since the race started
	let racing = $state(false);
	let raced = $state(false); // a race on the current job has finished
	const tried = new SvelteSet<number>();
	let saidRacing = false;
	let completed = false;

	/** Ticks a chip needs for the current job. */
	function ticksFor(chip: number, j: number) {
		const c = CHIPS[chip];
		const jb = JOBS[j];
		const workers = jb.parallel ? c.cores : 1;
		return Math.ceil(jb.total / workers) * c.cost;
	}
	const need = $derived([ticksFor(0, job), ticksFor(1, job)]);
	function doneBy(chip: number, now: number) {
		const c = CHIPS[chip];
		const jb = JOBS[job];
		const workers = jb.parallel ? c.cores : 1;
		return Math.min(jb.total, Math.floor(now / c.cost) * workers);
	}
	const done = $derived([doneBy(0, t), doneBy(1, t)]);
	const finishedLane = $derived([
		t >= need[0] && (racing || raced),
		t >= need[1] && (racing || raced)
	]);
	const winner = $derived(need[0] < need[1] ? 0 : 1);
	const ratio = $derived(Math.round(Math.max(need[0], need[1]) / Math.min(need[0], need[1])));
	// cores busy right now, a running chip lights every core it can use
	const busy = $derived(
		[0, 1].map((chip) =>
			racing && !finishedLane[chip] ? (JOBS[job].parallel ? CHIPS[chip].cores : 1) : 0
		)
	);

	let timer: ReturnType<typeof setInterval> | undefined;
	function stop() {
		clearInterval(timer);
		timer = undefined;
	}
	function pick(j: number) {
		if (racing) return;
		job = j;
		t = 0;
		raced = false;
	}
	function race() {
		if (racing) return;
		t = 0;
		raced = false;
		racing = true;
		if (!saidRacing) {
			saidRacing = true;
			onstate?.('racing');
		}
		const end = Math.max(need[0], need[1]);
		timer = setInterval(() => {
			t = Math.min(end, t + 1);
			if (t >= end) {
				stop();
				racing = false;
				raced = true;
				tried.add(job);
				if (tried.size === 2 && !completed) {
					completed = true;
					onstate?.('done');
					oncomplete?.();
				} else onstate?.(winner === 1 ? 'gpu' : 'cpu');
			}
		}, TICK_MS);
	}

	onDestroy(stop);

	const secs = (ticks: number) => (ticks * SECONDS_PER_TICK).toFixed(1);
	function laneStatus(chip: number) {
		if (finishedLane[chip]) return tx.finished.replace('{s}', secs(need[chip]));
		if (!racing && t === 0) return tx.ready;
		return tx.progress
			.replace('{n}', String(done[chip]))
			.replace('{t}', String(JOBS[job].total))
			.replace('{u}', tx.jobs[job].unit);
	}
</script>

{#snippet chip(k: number)}
	{@const c = CHIPS[k]}
	{@const rows = c.cores / c.cols}
	{@const size = 64}
	{@const pad = 8}
	{@const cell = (size - pad * 2) / c.cols}
	<svg class="chip" width="84" height="84" viewBox="-10 -10 84 84" aria-hidden="true">
		<!-- the pins around the edge make it read as a chip -->
		{#each [0, 1, 2, 3, 4, 5] as p (p)}
			<rect class="pin" x={6 + p * 9.6} y="-8" width="4" height="8" rx="1" />
			<rect class="pin" x={6 + p * 9.6} y={size} width="4" height="8" rx="1" />
			<rect class="pin" x="-8" y={6 + p * 9.6} width="8" height="4" rx="1" />
			<rect class="pin" x={size} y={6 + p * 9.6} width="8" height="4" rx="1" />
		{/each}
		<rect class="die" x="0" y="0" width={size} height={size} rx="6" />
		{#each Array.from({ length: c.cores }, (_, n) => n) as i (i)}
			{@const col = i % c.cols}
			{@const row = Math.floor(i / c.cols)}
			<rect
				class="core"
				class:busy={i < busy[k]}
				x={pad + col * cell + cell * 0.1}
				y={pad + row * ((size - pad * 2) / rows) + cell * 0.1}
				width={cell * 0.8}
				height={(size - pad * 2) / rows - cell * 0.2}
				rx={k === 0 ? 2 : 0.5}
				style="animation-delay:{((i * 37) % 9) * 60}ms"
			/>
		{/each}
	</svg>
{/snippet}

<div class="stage">
	<div class="pick">
		<span class="label">{tx.jobLabel}</span>
		<div class="jobs">
			{#each tx.jobs as jb, k (k)}
				<button
					type="button"
					class="job"
					class:on={job === k}
					aria-pressed={job === k}
					disabled={racing}
					onclick={() => pick(k)}
				>
					<span class="jname">
						{jb.name}
						{#if tried.has(k)}<span class="tick" aria-hidden="true">✓</span>{/if}
					</span>
					<span class="jsub">{jb.sub}</span>
				</button>
			{/each}
		</div>
		<CallToActionButton onclick={race} disabled={racing}>
			{racing ? tx.racing : raced ? tx.again : tx.raceBtn}
		</CallToActionButton>
		<span class="tried">{tx.triedBoth.replace('{n}', String(tried.size))}</span>
	</div>

	<div class="lanes">
		{#each [0, 1] as k (k)}
			<div class="lane" class:win={raced && winner === k}>
				{@render chip(k)}
				<div class="info">
					<div class="head">
						<span class="cname">{k === 0 ? tx.cpuName : tx.gpuName}</span>
						{#if raced && winner === k}
							<span class="badge">{tx.faster.replace('{k}', String(ratio))}</span>
						{/if}
					</div>
					<span class="csub">{k === 0 ? tx.cpuSub : tx.gpuSub}</span>
					<span class="track">
						<span
							class="fill"
							class:full={finishedLane[k]}
							style="width:{(done[k] / JOBS[job].total) * 100}%"
						></span>
					</span>
					<span class="status" aria-live="polite">{laneStatus(k)}</span>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		overflow-y: auto;
	}
	.pick {
		display: flex;
		width: 100%;
		max-width: 400px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.label {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.jobs {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.job {
		display: flex;
		flex-direction: column;
		gap: 3px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 10px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.job.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.job:disabled {
		cursor: default;
	}
	.jname {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.tick {
		color: var(--color-grass);
	}
	.jsub {
		font-size: 11px;
		line-height: 1.3;
		color: var(--color-muted);
	}
	.pick :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.tried {
		font-size: 11.5px;
		color: var(--color-faint);
	}

	.lanes {
		display: flex;
		width: 100%;
		max-width: 400px;
		flex-direction: column;
		gap: 10px;
	}
	.lane {
		display: flex;
		align-items: center;
		gap: 12px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px 8px 8px;
		transition: border-color 0.25s ease;
	}
	.lane.win {
		border-color: var(--color-grass);
	}
	.chip {
		flex: none;
	}
	.pin {
		fill: var(--color-faint);
	}
	.die {
		fill: var(--color-ink);
	}
	.core {
		fill: color-mix(in srgb, var(--color-card) 22%, var(--color-ink));
		transition: fill 0.2s ease;
	}
	.core.busy {
		fill: var(--color-amber);
		animation: work 0.5s ease-in-out infinite alternate;
	}
	@keyframes work {
		to {
			opacity: 0.55;
		}
	}
	.info {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 4px;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.cname {
		font-family: var(--font-display, inherit);
		font-size: 17px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.badge {
		border-radius: 99px;
		background: var(--color-grass-soft);
		padding: 2px 8px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.csub {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.track {
		height: 9px;
		overflow: hidden;
		border-radius: 99px;
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 99px;
		background: var(--color-brand);
	}
	.fill.full {
		background: var(--color-grass);
	}
	.status {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}

	@media (prefers-reduced-motion: reduce) {
		.core.busy {
			animation: none;
		}
		.job,
		.lane,
		.core {
			transition: none;
		}
	}
</style>
