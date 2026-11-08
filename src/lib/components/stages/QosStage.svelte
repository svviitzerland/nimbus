<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { QosText } from '$lib/chapters/network/qos/types';
	import RouterBox from './delivery/RouterBox.svelte';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as QosText);
	// The line is busy from the first beat (a quiet preview), Nim only comments once it is playable.
	const live = $derived(beat >= tx.intro.length - 1);

	// A small, honest queue simulation. Every tick each flow sends packets into the router, the
	// router lets CAP packets out onto the line, and the queue holds at most SIZE packets.
	type Flow = 0 | 1 | 2; // call, game, download
	const ARRIVE: Record<Flow, number> = { 0: 1, 1: 1, 2: 3 };
	const CAP = 4; // packets per tick the 30 Mbps line can carry
	const SIZE = 10;
	const MBPS_PER_SLOT = 30 / CAP;
	const WINDOW = 8; // ticks of history behind the live readouts
	const TICK = 450;
	const COLORS = ['var(--color-brand)', 'var(--color-grass)', 'var(--color-amber)'];

	type Pkt = { f: Flow; born: number; id: number };
	let queue = $state<Pkt[]>([]);
	let qos = $state(false);
	let pri = $state<[number, number, number]>([1, 1, 1]); // 0 low, 1 normal, 2 high
	let tick = 0;
	let nextId = 0;
	// per tick history: waits of sent packets and drops, per flow
	let hist: { wait: number[][]; drop: number[]; sent: number[] }[] = [];
	let stats = $state({
		wait: [0, 0, 0],
		drop: [0, 0, 0],
		mbps: 0
	});
	let saidStutter = false;
	let completed = false;

	const prio = (f: Flow) => (qos ? pri[f] : 1);

	function shuffle<T>(a: T[]) {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	function step() {
		tick += 1;
		const q = [...queue];
		const rec = { wait: [[], [], []] as number[][], drop: [0, 0, 0], sent: [0, 0, 0] };
		// arrivals, in a random order so nobody is lucky every time
		const arrivals: Flow[] = shuffle(
			([0, 1, 2] as Flow[]).flatMap((f) => Array<Flow>(ARRIVE[f]).fill(f))
		);
		for (const f of arrivals) {
			const pkt = { f, born: tick, id: nextId++ };
			if (q.length < SIZE) {
				q.push(pkt);
				continue;
			}
			// queue full, with QoS a more important packet pushes out the newest least important one
			let victim = -1;
			if (qos) {
				for (let i = q.length - 1; i >= 0; i--)
					if (prio(q[i].f) < prio(f) && (victim < 0 || prio(q[i].f) < prio(q[victim].f)))
						victim = i;
			}
			if (victim >= 0) {
				rec.drop[q[victim].f] += 1;
				q.splice(victim, 1);
				q.push(pkt);
			} else rec.drop[f] += 1;
		}
		// departures, highest priority first, then oldest first
		const order = q
			.map((p, i) => ({ p, i }))
			.sort((a, b) => prio(b.p.f) - prio(a.p.f) || a.i - b.i);
		const out = new Set(order.slice(0, CAP).map((o) => o.p.id));
		for (const p of q)
			if (out.has(p.id)) {
				rec.wait[p.f].push(tick - p.born);
				rec.sent[p.f] += 1;
			}
		const rest = q.filter((p) => !out.has(p.id));
		queue = qos
			? rest
					.map((p, i) => ({ p, i }))
					.sort((a, b) => prio(b.p.f) - prio(a.p.f) || a.i - b.i)
					.map((o) => o.p)
			: rest;

		hist.push(rec);
		if (hist.length > WINDOW) hist.shift();
		const avg = (f: Flow) => {
			const all = hist.flatMap((h) => h.wait[f]);
			return all.length ? all.reduce((s, x) => s + x, 0) / all.length : 0;
		};
		stats = {
			wait: [avg(0), avg(1), avg(2)],
			drop: [0, 1, 2].map((f) => hist.reduce((s, h) => s + h.drop[f], 0)),
			mbps: Math.round((hist.reduce((s, h) => s + h.sent[2], 0) / hist.length) * MBPS_PER_SLOT)
		};
		if (live && !saidStutter && !qos && hist.length >= 6 && !good(0)) {
			saidStutter = true;
			onstate?.('stutter');
		}
	}

	// a flow is fine when it barely waits and loses nothing over the recent window
	const good = (f: Flow) => stats.wait[f] < 0.6 && stats.drop[f] === 0;
	const ms = (f: Flow) => Math.round(30 + stats.wait[f] * 90);

	$effect(() => {
		const id = setInterval(step, TICK);
		return () => clearInterval(id);
	});

	function toggleQos() {
		qos = !qos;
		hist = [];
		if (qos) {
			pri = [1, 1, 1];
			onstate?.('qosOn');
		} else onstate?.('qosOff');
	}

	function cycle(f: Flow) {
		const next = [...pri] as [number, number, number];
		next[f] = (next[f] + 1) % 3;
		pri = next;
		hist = [];
		judge();
	}

	/** Nim reacts to the plan right away, the live readouts catch up a tick or two later. */
	function judge() {
		const [c, g, d] = pri;
		let token = '';
		if (c === g && g === d) token = 'allSame';
		else if (d > c && d >= g) token = 'dlFirst';
		else if (c > d && g > d) token = 'fixed';
		else if (c > d) token = 'callFixed';
		if (!token) return;
		onstate?.(token);
		if ((token === 'fixed' || token === 'callFixed') && !completed) {
			completed = true;
			oncomplete?.();
		}
	}

	const status = (f: Flow) => {
		if (good(f))
			return { ok: true, label: f === 2 ? tx.speed.replace('{n}', String(stats.mbps)) : tx.smooth };
		if (f === 2) return { ok: true, label: tx.speed.replace('{n}', String(stats.mbps)) };
		return { ok: false, label: f === 0 ? tx.stutter : tx.lag };
	};
</script>

{#snippet icon(f: number)}
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		{#if f === 0}
			<rect x="3" y="6" width="12" height="12" rx="2.5" stroke={COLORS[0]} stroke-width="2" />
			<path d="m15 10 5-3v10l-5-3Z" stroke={COLORS[0]} stroke-width="2" stroke-linejoin="round" />
		{:else if f === 1}
			<rect x="2.5" y="7" width="19" height="10" rx="5" stroke={COLORS[1]} stroke-width="2" />
			<path d="M7 10v4M5 12h4" stroke={COLORS[1]} stroke-width="2" stroke-linecap="round" />
			<circle cx="16" cy="11" r="1.2" fill={COLORS[1]} />
			<circle cx="18" cy="13.5" r="1.2" fill={COLORS[1]} />
		{:else}
			<path
				d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5"
				stroke={COLORS[2]}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path d="M5 19h14" stroke={COLORS[2]} stroke-width="2" stroke-linecap="round" />
		{/if}
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<button type="button" class="switch" class:on={qos} onclick={toggleQos} aria-pressed={qos}>
		<b>{tx.qosLabel}</b>
		<span class="track"><span class="knob"></span></span>
		<span class="state">{qos ? tx.on : tx.off}</span>
	</button>

	<div class="flows">
		{#each [0, 1, 2] as f (f)}
			{@const st = status(f as Flow)}
			<div class="flow" class:bad={!st.ok}>
				<div class="fhead">{@render icon(f)}<b>{tx.flows[f]}</b></div>
				<span class="pill" class:bad={!st.ok}>{st.label}</span>
				<span class="meta">
					{#if f === 2}
						{tx.dropped.replace('{n}', String(stats.drop[2]))}
					{:else}
						{tx.delay.replace('{n}', String(ms(f as Flow)))}
						{#if stats.drop[f] > 0}<br />{tx.dropped.replace('{n}', String(stats.drop[f]))}{/if}
					{/if}
				</span>
				{#if qos}
					<button type="button" class="prio p{pri[f]}" onclick={() => cycle(f as Flow)}>
						{tx.priorityBtn.replace('{p}', tx.priorities[pri[f]])}
					</button>
				{/if}
			</div>
		{/each}
	</div>

	<div class="pipe" aria-hidden="true">
		{#each [0, 1, 2] as f (f)}<span style="background:{COLORS[f]}"></span>{/each}
	</div>

	<div class="routerrow">
		<RouterBox label={tx.routerLabel} tone={qos ? 'active' : 'warn'} />
		<div class="queue">
			<span class="qlabel">{tx.queueLabel}</span>
			<div class="slots">
				{#each Array(SIZE) as _, i (i)}
					<span class="slot">
						{#if queue[i]}
							<i style="background:{COLORS[queue[i].f]}"></i>
						{/if}
					</span>
				{/each}
			</div>
			<span class="qnote">{qos ? tx.noteOn : tx.noteOff}</span>
		</div>
	</div>

	<div class="line">
		<span class="flowline"></span>
		<b>{tx.lineLabel}</b>
	</div>
</div>

<style>
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 14px;
		font-size: 13px;
		color: var(--color-ink);
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
	}
	.track {
		position: relative;
		width: 38px;
		height: 22px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.knob {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: left 0.2s ease;
	}
	.switch.on .track {
		background: var(--color-grass);
	}
	.switch.on .knob {
		left: 19px;
	}
	.state {
		min-width: 3.2em;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
		text-align: left;
	}
	.switch.on .state {
		color: var(--color-grass);
	}

	.flows {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		width: min(94vw, 350px);
	}
	.flow {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 4px;
		text-align: center;
		transition: border-color 0.25s ease;
	}
	.flow.bad {
		border-color: color-mix(in srgb, var(--color-danger) 50%, transparent);
	}
	.fhead {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.fhead b {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.pill {
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 10.5px;
		font-weight: 800;
		padding: 2px 8px;
	}
	.pill.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		animation: wobble 0.9s ease-in-out infinite;
	}
	@keyframes wobble {
		50% {
			opacity: 0.55;
		}
	}
	.meta {
		min-height: 2.4em;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
		line-height: 1.25;
	}
	.prio {
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 4px 6px;
		font-size: 10px;
		font-weight: 700;
		animation: popin 0.25s ease;
	}
	.prio.p2 {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.prio.p0 {
		color: var(--color-faint);
	}
	@keyframes popin {
		from {
			opacity: 0;
			scale: 0.7;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}

	.pipe {
		display: flex;
		gap: 22%;
		justify-content: center;
		width: min(70vw, 240px);
	}
	.pipe span {
		width: 3px;
		height: 14px;
		border-radius: 2px;
		opacity: 0.7;
	}

	.routerrow {
		display: flex;
		align-items: center;
		gap: 12px;
		width: min(94vw, 350px);
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.queue {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
	}
	.qlabel,
	.qnote {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.qnote {
		color: var(--color-muted);
	}
	.slots {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 3px;
	}
	.slot {
		aspect-ratio: 1;
		border-radius: 4px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		overflow: hidden;
		display: flex;
	}
	.slot i {
		flex: 1;
		border-radius: 3px;
		animation: popin 0.2s ease;
	}
	.line {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.flowline {
		width: 4px;
		height: 22px;
		border-radius: 2px;
		background: linear-gradient(var(--color-brand), var(--color-line));
	}
	.line b {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	:global(.dark) .switch {
		box-shadow: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.pill.bad,
		.prio,
		.slot i {
			animation: none;
		}
		.knob,
		.track {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.flows,
		.routerrow {
			width: 460px;
		}
		.fhead b {
			font-size: 13px;
		}
		.pill {
			font-size: 12px;
		}
		.meta,
		.qlabel,
		.qnote {
			font-size: 11px;
		}
		.prio {
			font-size: 11.5px;
		}
		.line b {
			font-size: 12.5px;
		}
	}
</style>
