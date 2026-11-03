<script lang="ts">
	import Server from '$lib/components/Server.svelte';
	import MiniPhone from './backend/MiniPhone.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { JobKind, JobsText } from '$lib/chapters/web/jobs/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as JobsText);

	const DUR: Record<JobKind, number> = { save: 500, email: 1800, pdf: 2400 };
	const TICK = 100;

	type Ticket = { id: number; kind: JobKind; order: number };
	type Worker = { ticket: Ticket | null; elapsed: number };

	let mode = $state<'direct' | 'queue'>('direct');
	let phone = $state<'idle' | 'waiting' | 'done'>('idle');
	let waited = $state(0);
	let serverJob = $state<{ kind: JobKind; elapsed: number } | null>(null);
	let plan: JobKind[] = [];
	let currentOrder = 0;
	let queue = $state<Ticket[]>([]);
	let workers = $state<Worker[]>([{ ticket: null, elapsed: 0 }]);
	let nextId = 0;
	let orderNo = 0;
	let rushPending = false;
	let saidWorkers = false;
	const seen = { slow: false, fast: false };
	let completed = false;

	function checkDone() {
		if (!completed && seen.slow && seen.fast) {
			completed = true;
			oncomplete?.();
		}
	}

	function setMode(m: 'direct' | 'queue') {
		if (phone === 'waiting' || m === mode) return;
		mode = m;
		phone = 'idle';
		waited = 0;
		queue = [];
		workers = workers.map(() => ({ ticket: null, elapsed: 0 }));
		rushPending = false;
	}

	function checkout() {
		if (phone === 'waiting') return;
		orderNo += 1;
		currentOrder = orderNo;
		phone = 'waiting';
		waited = 0;
		plan = mode === 'direct' ? ['email', 'pdf'] : [];
		serverJob = { kind: 'save', elapsed: 0 };
	}

	function enqueue(order: number) {
		queue = [
			...queue,
			{ id: nextId++, kind: 'email', order },
			{ id: nextId++, kind: 'pdf', order }
		];
	}

	function rush() {
		for (let i = 0; i < 5; i++) {
			orderNo += 1;
			enqueue(orderNo);
		}
		rushPending = true;
		onstate?.('rush');
	}

	function setWorkers(n: number) {
		n = Math.max(1, Math.min(3, n));
		if (n === workers.length) return;
		if (n > workers.length) {
			workers = [
				...workers,
				...Array.from({ length: n - workers.length }, () => ({ ticket: null, elapsed: 0 }))
			];
			if (!saidWorkers) {
				saidWorkers = true;
				onstate?.('workers');
			}
		} else {
			const dropped = workers.slice(n).flatMap((w) => (w.ticket ? [w.ticket] : []));
			workers = workers.slice(0, n);
			queue = [...dropped, ...queue];
		}
	}

	function tick() {
		if (phone === 'waiting') waited += TICK;

		if (serverJob) {
			serverJob.elapsed += TICK;
			if (serverJob.elapsed >= DUR[serverJob.kind]) {
				const nextKind = plan.shift();
				if (nextKind) {
					serverJob = { kind: nextKind, elapsed: 0 };
				} else {
					serverJob = null;
					phone = 'done';
					if (mode === 'queue') {
						enqueue(currentOrder);
						seen.fast = true;
						onstate?.('fast');
					} else {
						seen.slow = true;
						onstate?.('slow');
					}
					checkDone();
				}
			}
		}

		if (mode === 'queue') {
			for (const w of workers) {
				if (w.ticket) {
					w.elapsed += TICK;
					if (w.elapsed >= DUR[w.ticket.kind]) w.ticket = null;
				}
				if (!w.ticket && queue.length) {
					w.ticket = queue[0];
					w.elapsed = 0;
					queue = queue.slice(1);
				}
			}
			if (rushPending && queue.length === 0 && workers.every((w) => !w.ticket)) {
				rushPending = false;
				onstate?.('drained');
			}
		}
	}

	$effect(() => {
		const t = setInterval(tick, TICK);
		return () => clearInterval(t);
	});

	const shown = $derived(queue.slice(0, 10));
	const seconds = $derived((waited / 1000).toFixed(1));
	const led = $derived(
		phone === 'waiting' ? 'busy' : phone === 'done' ? 'ok' : ('idle' as 'idle' | 'busy' | 'ok')
	);
	function pct(kind: JobKind, elapsed: number) {
		return Math.min(100, (elapsed / DUR[kind]) * 100);
	}
</script>

<div class="wrap">
	<div class="seg" role="group">
		<button
			type="button"
			class:on={mode === 'direct'}
			disabled={phone === 'waiting'}
			onclick={() => setMode('direct')}>{tx.modeDirect}</button
		>
		<button
			type="button"
			class:on={mode === 'queue'}
			disabled={phone === 'waiting'}
			onclick={() => setMode('queue')}>{tx.modeQueue}</button
		>
	</div>

	<div class="acts">
		<button type="button" class="cta" disabled={phone === 'waiting'} onclick={checkout}
			>{tx.checkout}</button
		>
		{#if mode === 'queue'}
			<button type="button" class="line" onclick={rush}>{tx.rush}</button>
			<span class="stepper">
				<span class="sl">{tx.workers}</span>
				<button
					type="button"
					aria-label="minus"
					disabled={workers.length <= 1}
					onclick={() => setWorkers(workers.length - 1)}>−</button
				>
				<b>{workers.length}</b>
				<button
					type="button"
					aria-label="plus"
					disabled={workers.length >= 3}
					onclick={() => setWorkers(workers.length + 1)}>+</button
				>
			</span>
		{/if}
	</div>

	<MiniPhone {led} width={176} url="nimbus.com/checkout">
		<div class="watch" class:slow={phone === 'waiting' && waited > 1500}>
			{tx.waited.replace('{s}', seconds)}
		</div>
		<div class="pstat" class:ok={phone === 'done'}>
			{#if phone === 'waiting'}<span class="spin" aria-hidden="true"></span>{/if}
			{phone === 'waiting' ? tx.phone.waiting : phone === 'done' ? tx.phone.done : tx.phone.idle}
		</div>
	</MiniPhone>

	<div class="card">
		<div class="head">
			<Server active={serverJob !== null} slots={2} />
			<b>{tx.serverLabel}</b>
		</div>
		{#if serverJob}
			<div class="job">
				<span>{tx.jobs[serverJob.kind]}</span>
				<span class="bar"><i style="width:{pct(serverJob.kind, serverJob.elapsed)}%"></i></span>
			</div>
		{:else}
			<span class="faint">{tx.idle}</span>
		{/if}
	</div>

	{#if mode === 'queue'}
		<div class="card">
			<span class="cap">{tx.queueLabel} ({queue.length})</span>
			<div class="lane">
				{#if queue.length === 0}
					<span class="faint">{tx.queueEmpty}</span>
				{:else}
					{#each shown as t (t.id)}
						<span class="ticket {t.kind}"
							>{tx.jobs[t.kind]}<small>{tx.orderTag.replace('{n}', String(t.order))}</small></span
						>
					{/each}
					{#if queue.length > shown.length}
						<span class="more">+{queue.length - shown.length}</span>
					{/if}
				{/if}
			</div>
		</div>

		<div class="workers">
			{#each workers as w, i (i)}
				<div class="worker" class:busy={w.ticket !== null}>
					<b>{tx.workerLabel} {i + 1}</b>
					{#if w.ticket}
						<span>{tx.jobs[w.ticket.kind]}</span>
						<span class="bar"><i style="width:{pct(w.ticket.kind, w.elapsed)}%"></i></span>
					{:else}
						<span class="faint">{tx.idle}</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		width: min(94vw, 440px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.seg {
		display: flex;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.seg button {
		border-radius: 9px;
		padding: 6px 14px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.seg button.on {
		background: var(--toggle-active);
		color: #fff;
	}
	.seg button:disabled {
		cursor: not-allowed;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.cta,
	.line {
		border-radius: 12px;
		padding: 9px 15px;
		font-size: 12.5px;
		font-weight: 600;
		transition:
			filter 0.2s ease,
			border-color 0.2s ease,
			opacity 0.2s ease;
	}
	.cta {
		background: var(--btn-primary);
		color: #fff;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.5;
	}
	.line {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	.line:hover {
		border-color: var(--color-ink);
	}
	.stepper {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 6px;
		font-size: 12px;
	}
	.sl {
		font-weight: 600;
		color: var(--color-muted);
	}
	.stepper button {
		width: 24px;
		height: 24px;
		border-radius: 8px;
		background: var(--color-paper);
		font-weight: 800;
		color: var(--color-ink);
	}
	.stepper button:disabled {
		opacity: 0.35;
	}

	.watch {
		text-align: center;
		font-variant-numeric: tabular-nums;
		font-size: 17px;
		font-weight: 800;
		color: var(--color-ink);
		transition: color 0.3s ease;
	}
	.watch.slow {
		color: var(--color-danger);
	}
	.pstat {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 8px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.pstat.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.spin {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		border: 2px solid var(--color-line);
		border-top-color: var(--color-amber);
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.card {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.head b {
		font-size: 12.5px;
	}
	.head :global(.server) {
		width: 40px;
		padding: 5px;
		gap: 4px;
		border-radius: 8px;
		box-shadow: none;
	}
	.head :global(.server .slot) {
		height: 8px;
	}
	.job {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11.5px;
		font-weight: 600;
	}
	.job span:first-child {
		flex: none;
		min-width: 110px;
	}
	.bar {
		position: relative;
		flex: 1;
		height: 7px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		overflow: hidden;
	}
	.bar i {
		position: absolute;
		inset: 0 auto 0 0;
		background: var(--color-brand);
		transition: width 0.1s linear;
	}
	.faint {
		font-size: 11px;
		color: var(--color-faint);
	}
	.cap {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.lane {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		min-height: 30px;
		align-items: center;
	}
	.ticket {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
		border-radius: 8px;
		padding: 4px 7px;
		font-size: 10px;
		font-weight: 700;
		animation: pop 0.25s ease;
	}
	.ticket small {
		font-size: 8.5px;
		font-weight: 600;
		opacity: 0.75;
	}
	.ticket.email {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.ticket.pdf {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.more {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.workers {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
		gap: 6px;
	}
	.worker {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 9px;
		font-size: 11px;
		transition: border-color 0.2s ease;
	}
	.worker.busy {
		border-color: var(--color-grass);
	}
	.worker b {
		font-size: 11px;
	}
	.worker .bar {
		flex: none;
	}
	.worker .bar i {
		background: var(--color-grass);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.7);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ticket {
			animation: none;
		}
		.spin {
			animation-duration: 2.4s;
		}
		.bar i {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
		}
		.cta,
		.line,
		.seg button {
			font-size: 13.5px;
		}
	}
</style>
