<script lang="ts">
	// Guided "watch" stage. A checkout first runs the slow way (the phone spins while the
	// backend saves, emails, and makes a PDF one after another, with a stopwatch). Then the slow
	// work drops into a queue as tickets, the phone gets its answer at once, and workers below
	// take tickets one by one. At rush hour a longer line is drained by three workers.
	// The only optional play, on the last beat, is adding a worker.
	import Guide from '$lib/components/Guide.svelte';
	import SvgPhone from '$lib/components/stages/backend-guided/SvgPhone.svelte';
	import SvgRack from '$lib/components/stages/backend-guided/SvgRack.svelte';
	import { sceneClock } from '$lib/components/stages/backend-guided/clock.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { JobKind, JobsText } from '$lib/chapters/web/jobs/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as JobsText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const lastBeat = $derived(tx.intro.length - 1);
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(beat >= lastBeat && peek === null);

	let myWorkers = $state(1);
	function addWorker() {
		myWorkers = myWorkers >= 3 ? 1 : myWorkers + 1;
		onstate?.(`w${myWorkers}`);
	}

	const clock = sceneClock(() => [step, myWorkers]);
	const t = $derived(clock.t);

	const TASKS: JobKind[] = ['save', 'email', 'pdf'];
	const direct = $derived(step <= 1);
	const rush = $derived(step >= 5);
	const workers = $derived(step < 3 ? 0 : step === 7 && live ? myWorkers : rush ? 3 : 1);

	// The slow way, one loop of 8 seconds. Save until 0.6 s, email until 3.3 s, PDF until 6 s.
	const DIRECT_END = 6000;
	const directT = $derived(clock.reduced ? DIRECT_END : t % 8000);
	function directState(k: JobKind) {
		if (step === 0) return 'idle';
		const [s, e] = k === 'save' ? [0, 600] : k === 'email' ? [600, 3300] : [3300, DIRECT_END];
		return directT >= e ? 'done' : directT >= s ? 'working' : 'idle';
	}

	// The queue way. The answer goes out at 0.3 s, the tickets drop in, workers take them.
	const N = $derived(rush ? 7 : 2);
	const D = $derived(rush ? 1700 : 2200);
	const START = 1100;
	const period = $derived(
		START + Math.ceil(N / Math.max(1, workers)) * D + (workers === 0 ? 0 : 1800)
	);
	const cycle = $derived(clock.reduced || workers === 0 ? 0 : Math.floor(t / period));
	// under reduced motion, a still frame with the first round at work and the rest waiting
	const qt = $derived(
		clock.reduced ? (workers === 0 ? 1e9 : START + D / 2) : workers === 0 ? t : t % period
	);

	const jobs = $derived(
		Array.from({ length: N }, (_, i) => {
			const kind: JobKind = i % 2 === 0 ? 'email' : 'pdf';
			const arrive = 400 + i * 120;
			if (workers === 0) {
				return { kind, mode: qt >= arrive ? 'queued' : 'coming', slot: i, w: 0, p: 0 };
			}
			const round = Math.floor(i / workers);
			const s = START + round * D;
			const started = qt < START ? 0 : Math.min(N, workers * (Math.floor((qt - START) / D) + 1));
			const mode = qt < arrive ? 'coming' : qt < s ? 'queued' : qt < s + D ? 'working' : 'done';
			return {
				kind,
				mode,
				slot: i - started,
				w: i % workers,
				p: Math.min(1, Math.max(0, (qt - s) / D))
			};
		})
	);

	const answered = $derived(step === 0 ? false : direct ? directT >= DIRECT_END : qt >= 300);
	const phoneState = $derived(step === 0 ? 'idle' : answered ? 'done' : 'waiting');
	const waitedMs = $derived(direct ? Math.min(directT, DIRECT_END) : Math.min(qt, 300));
	const waited = $derived(
		tx.waited.replace('{s}', (waitedMs / 1000).toFixed(1).replace('.', tx.decimal))
	);

	const slotX = (k: number) => 132 + k * 30;
	const W_X = [134, 210, 286];
	function jobPos(j: (typeof jobs)[number]) {
		if (j.mode === 'coming') return { x: slotX(Math.max(0, j.slot)), y: 110, o: 0 };
		if (j.mode === 'queued') return { x: slotX(j.slot), y: 137, o: 1 };
		if (j.mode === 'working') return { x: W_X[j.w] + 18, y: 180, o: 1 };
		return { x: W_X[j.w] + 18, y: 160, o: 0 };
	}
</script>

{#snippet ticket(kind: JobKind)}
	<rect width="24" height="22" rx="4" class="ticket {kind}" />
	{#if kind === 'email'}
		<rect x="5" y="6" width="14" height="10" rx="1.5" class="icon" />
		<path d="M5.5 6.5l6.5 5 6.5 -5" class="icon" />
	{:else}
		<path d="M7 4h7l4 4v10H7Z" class="icon" />
		<line x1="9.5" y1="12" x2="15.5" y2="12" class="icon" />
		<line x1="9.5" y1="15" x2="14" y2="15" class="icon" />
	{/if}
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 360 285"
			class="mx-auto block w-full max-w-[420px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- you, the phone -->
			<SvgPhone x={10} y={40} w={100} h={180} focus={step === 1}>
				<rect x="21" y="14" width="44" height="34" rx="7" class="thumb" />
				<path d="M31 38a12 11 0 0 1 24 0Z" class="capTop" />
				<rect x="27" y="37" width="32" height="4" rx="2" class="capTop" />
				<text x="43" y="64" text-anchor="middle" class="prod">{tx.product}</text>
				{#if phoneState === 'waiting'}
					<g transform="translate(43 92)">
						<circle r="11" class="spinBg" />
						<path d="M0 -11a11 11 0 0 1 11 11" class="spin" class:still={clock.reduced} />
					</g>
				{:else if phoneState === 'done'}
					<g class="fade" transform="translate(43 92)">
						<circle r="11" class="okC" />
						<path d="M-5 0l3.5 3.5 6.5 -7" class="tick" />
					</g>
				{/if}
				<text x="43" y="120" text-anchor="middle" class="status {phoneState}">
					{tx.phone[phoneState]}
				</text>
				{#if phoneState !== 'idle'}
					<text x="43" y="136" text-anchor="middle" class="watch" class:long={direct}>
						{waited}
					</text>
				{/if}
			</SvgPhone>

			<!-- the backend and its three chores -->
			<text x="166" y="30" text-anchor="middle" class="label">{tx.backendLabel}</text>
			<SvgRack x={124} y={40} w={84} units={2} busy={direct ? !answered && step === 1 : false} />
			{#each TASKS as k, i (k)}
				{@const st = direct ? directState(k) : k === 'save' ? 'done' : 'queued'}
				<g>
					<rect x="216" y={42 + i * 23} width="134" height="19" rx="5" class="task {st}" />
					<circle cx="225" cy={51.5 + i * 23} r="3.5" class="tdot {st}" />
					<text x="233" y={55 + i * 23} class="taskT">{tx.tasks[k]}</text>
					<text x="344" y={55 + i * 23} text-anchor="end" class="tag {st}">
						{st === 'queued' ? tx.queued : k === 'save' ? tx.fast : tx.slow}
					</text>
				</g>
			{/each}

			<!-- the queue tray -->
			<g class="move" style="opacity:{direct ? 0.35 : 1}">
				<text x="126" y="124" class="label left">{tx.queueLabel}</text>
				<rect x="124" y="130" width="226" height="36" rx="9" class="tray" />
			</g>

			<!-- the workers -->
			{#each W_X as x, w (w)}
				<g class="move" style="opacity:{w < workers ? 1 : 0}">
					<rect {x} y="208" width="60" height="38" rx="8" class="worker" />
					<circle cx={x + 12} cy="227" r="3.5" class="wled" />
					<line x1={x + 24} y1="221" x2={x + 48} y2="221" class="vent" />
					<line x1={x + 24} y1="227" x2={x + 48} y2="227" class="vent" />
					<line x1={x + 24} y1="233" x2={x + 48} y2="233" class="vent" />
					<text x={x + 30} y="270" text-anchor="middle" class="label">{tx.workerLabel}</text>
					{#each jobs as j, k (k)}
						{#if j.mode === 'working' && j.w === w}
							<rect {x} y="252" width={60 * j.p} height="5" rx="2.5" class="bar" />
						{/if}
					{/each}
					<rect {x} y="252" width="60" height="5" rx="2.5" class="barBg" />
				</g>
			{/each}

			<!-- the tickets -->
			{#if !direct}
				{#key cycle}
					<g>
						{#each jobs as j, k (k)}
							{@const pos = jobPos(j)}
							<g class="move" style="transform:translate({pos.x}px, {pos.y}px);opacity:{pos.o}">
								{@render ticket(j.kind)}
							</g>
						{/each}
					</g>
				{/key}
			{/if}
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" onclick={addWorker}>
					{myWorkers >= 3 ? tx.resetBtn : tx.addBtn}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.move {
		transition:
			transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.5s;
	}
	.fade {
		animation: fadeIn 0.45s ease-out;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
	}
	.label {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.thumb {
		fill: var(--color-brand-soft);
	}
	.capTop {
		fill: var(--color-brand);
	}
	.prod {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.spinBg {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 3;
	}
	.spin {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
		animation: spin 0.9s linear infinite;
	}
	.spin.still {
		animation: none;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.okC {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.status {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.status.waiting {
		fill: var(--color-amber);
	}
	.status.done {
		fill: var(--color-grass);
	}
	.watch {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-grass);
	}
	.watch.long {
		fill: var(--color-danger);
	}
	.task {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.3;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.task.working {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.task.done {
		stroke: var(--color-grass);
	}
	.task.queued {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.tdot {
		fill: var(--color-line);
	}
	.tdot.working {
		fill: var(--color-amber);
	}
	.tdot.done {
		fill: var(--color-grass);
	}
	.tdot.queued {
		fill: var(--color-brand);
	}
	.taskT {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.tag {
		font-size: 9px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.tag.queued {
		fill: var(--color-brand);
	}
	.tray {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.left {
		text-anchor: start;
	}
	.ticket {
		stroke-width: 1.8;
	}
	.ticket.email {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.ticket.pdf {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.icon {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 1.3;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.worker {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.wled {
		fill: var(--color-grass);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.barBg {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1;
	}
	.bar {
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
	@media (prefers-reduced-motion: reduce) {
		.move,
		.task {
			transition: none;
		}
		.fade,
		.spin {
			animation: none;
		}
	}
</style>
