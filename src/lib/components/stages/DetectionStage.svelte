<script lang="ts">
	// Guided "watch" stage. First a 1986 accounting printout where the 75 cent gap and the unknown
	// "hunter" account light up (Cliff Stoll's story), then the nimbus.com log window: it scrolls
	// too fast to read, freezes, and the attacker's lines light themselves up one by one (failed,
	// failed, failed, then in). On the SIEM beat each line gets its source tag and an alert drops
	// in. The only optional play, on the last beat, is tapping a line to follow its address.
	import { untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DetectionText } from '$lib/chapters/security/detection/types';
	import { sceneClock } from './shipit/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DetectionText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));
	const live = $derived(beat >= tx.intro.length - 1 && peek === null);

	let chosen = $state<string | null>(null);
	const clock = sceneClock(() => step);

	// The 1986 printout (recreated, the names other than hunter are made up).
	const PRINT = [
		'alice    cpu 0:42   billed $3.10',
		'bob      cpu 1:05   billed $4.80',
		'hunter   cpu 0:09   no billing address',
		'carol    cpu 0:31   billed $2.25'
	];
	const HUNTER = 2;

	// The nimbus.com log, one attacker hidden among normal visitors.
	const ATT = '203.0.113.7';
	type Src = 'web' | 'shop' | 'auth';
	type Row = { time: string; ip: string; msg: string; src: Src; kind: 'ok' | 'fail' | 'win' };
	const ROWS: Row[] = [
		{ time: '03:12:01', ip: '198.51.100.23', msg: 'GET /shop 200', src: 'web', kind: 'ok' },
		{ time: '03:12:02', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:02', ip: '192.0.2.14', msg: 'GET /about 200', src: 'web', kind: 'ok' },
		{ time: '03:12:03', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:03', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:04', ip: '198.51.100.80', msg: 'login failed budi', src: 'auth', kind: 'ok' },
		{ time: '03:12:04', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:05', ip: '198.51.100.80', msg: 'login ok budi', src: 'auth', kind: 'ok' },
		{ time: '03:12:05', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:06', ip: '192.0.2.14', msg: 'POST /cart 200', src: 'shop', kind: 'ok' },
		{ time: '03:12:06', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:07', ip: ATT, msg: 'login failed admin', src: 'auth', kind: 'fail' },
		{ time: '03:12:08', ip: ATT, msg: 'login ok admin', src: 'auth', kind: 'win' },
		{ time: '03:12:09', ip: '198.51.100.23', msg: 'GET /cart 200', src: 'shop', kind: 'ok' }
	];
	const ATT_ROWS = ROWS.map((r, k) => (r.ip === ATT ? k : -1)).filter((k) => k >= 0);

	// The scroll on the "too many lines" beat, a new line every 240 ms.
	const scroll = $derived(step === 2 && !clock.reduced ? Math.floor(clock.t / 240) : 0);
	const shown = $derived(step === 2 ? ROWS.map((_, k) => ROWS[(k + scroll) % ROWS.length]) : ROWS);
	const tags = $derived(step >= 4);
	const alertOn = $derived(step >= 4 && step < last ? clock.t >= 900 : step === last && !live);

	/** How a log line looks right now, 'lit', 'win', 'dim', 'pick' or plain ''. */
	function look(r: Row, k: number): string {
		if (step === 2) return '';
		if (live) {
			if (!chosen) return '';
			return r.ip === chosen ? (r.kind === 'win' ? 'win' : 'pick') : 'dim';
		}
		if (step === 3) {
			if (clock.t < 300) return '';
			const n = ATT_ROWS.indexOf(k);
			if (n < 0) return 'dim';
			const on = n < Math.floor((clock.t - 300) / 520) + 1;
			return on ? (r.kind === 'win' ? 'win' : 'lit') : '';
		}
		if (r.ip !== ATT) return 'dim';
		return r.kind === 'win' ? 'win' : 'lit';
	}

	function tap(r: Row) {
		if (!live) return;
		chosen = r.ip;
		onstate?.(r.ip === ATT ? 'found' : 'innocent');
	}
	$effect(() => {
		if (!live) untrack(() => (chosen = null));
	});
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i <= 1}
			<div class="paper" in:fade={{ duration: 250 }}>
				<div class="ptitle">{tx.printTitle}</div>
				{#each PRINT as line, k (k)}
					<div class="pline" class:bad={i === 1 && k === HUNTER && clock.t >= 700}>{line}</div>
				{/each}
				<div class="pline gap" class:hot={i === 0 && clock.t >= 800}>{tx.printGap}</div>
			</div>
			{#if i === 1}
				<ol class="trail">
					{#each tx.trail as stop, k (k)}
						{#if clock.t >= 1300 + k * 900}
							<li in:fly={{ y: 6, duration: 300 }}>{stop}</li>
						{/if}
					{/each}
				</ol>
			{/if}
		{:else}
			<div class="term" in:fade={{ duration: 250 }}>
				<div class="bar">
					<span class="dot"></span><span class="dot"></span><span class="dot"></span>
					<span class="ttl">{tx.logTitle}</span>
					{#if live && !chosen}<span class="hint">{tx.tapHint}</span>{/if}
				</div>
				{#if alertOn}
					<div class="alert" in:fly={{ y: -8, duration: 350 }}>
						{tx.alert.replace('{ip}', ATT)}
					</div>
				{/if}
				<div class="rows" class:moving={step === 2}>
					{#each shown as r, k (step === 2 ? `${scroll}-${k}` : k)}
						<button type="button" class="row {look(r, k)}" disabled={!live} onclick={() => tap(r)}>
							{#if tags}<span class="src {r.src}">{tx.sources[r.src]}</span>{/if}
							<span class="time">{r.time}</span>
							<span class="ip">{r.ip}</span>
							<span class="msg">{r.msg}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		justify-content: center;
		overflow-x: hidden;
		padding: 0 4px 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	/* the 1986 printout */
	.paper {
		position: relative;
		width: min(100%, 380px);
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		background-image: repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent 22px,
			var(--color-grass-soft) 22px,
			var(--color-grass-soft) 44px
		);
		padding: 14px 30px;
		box-shadow: 0 10px 28px rgba(22, 40, 60, 0.07);
	}
	.paper::before,
	.paper::after {
		content: '';
		position: absolute;
		top: 8px;
		bottom: 8px;
		width: 8px;
		background-image: radial-gradient(circle, var(--color-line) 3px, transparent 3.5px);
		background-size: 8px 22px;
	}
	.paper::before {
		left: 9px;
	}
	.paper::after {
		right: 9px;
	}
	.ptitle {
		margin-bottom: 4px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.pline {
		border-radius: 4px;
		padding: 0 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 22px;
		white-space: pre;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--color-ink);
		transition:
			background 0.4s,
			color 0.4s;
	}
	.pline.gap {
		font-weight: 700;
	}
	.pline.hot {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.pline.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 700;
	}
	.trail {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 6px;
		min-height: 30px;
	}
	.trail li {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	/* a small arrow head between stops (a plain bar read like a dash) */
	.trail li:not(:first-child)::before {
		content: '';
		width: 7px;
		height: 7px;
		margin: 0 4px 0 2px;
		border-top: 2px solid var(--color-brand);
		border-right: 2px solid var(--color-brand);
		transform: rotate(45deg);
	}

	/* the log window */
	.term {
		width: min(100%, 420px);
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		box-shadow: 0 10px 28px rgba(22, 40, 60, 0.07);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid var(--color-line);
		padding: 8px 12px;
	}
	.dot {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.ttl {
		margin-left: 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.hint {
		margin-left: auto;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.alert {
		background: var(--color-danger-soft);
		padding: 8px 12px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-danger);
	}
	.rows {
		padding: 6px 4px;
	}
	.row {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 8px;
		border-radius: 6px;
		padding: 0 8px;
		text-align: left;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		line-height: 20px;
		white-space: nowrap;
		color: var(--color-ink);
		transition:
			background 0.35s,
			opacity 0.35s,
			color 0.35s;
	}
	.row:disabled {
		cursor: default;
	}
	.row:not(:disabled):hover {
		background: var(--color-paper);
	}
	.moving .row {
		animation: rise 0.24s linear;
	}
	.time {
		color: var(--color-faint);
	}
	.ip {
		min-width: 13ch;
	}
	.msg {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.src {
		min-width: 5ch;
		border-radius: 999px;
		padding: 0 6px;
		font-family: var(--font-sans, inherit);
		font-size: 9.5px;
		font-weight: 800;
		line-height: 15px;
		text-align: center;
	}
	.src.web {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.src.shop {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.src.auth {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.row.dim {
		opacity: 0.35;
	}
	.row.lit,
	.row.pick {
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-weight: 700;
	}
	.row.pick {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.row.win {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 800;
	}
	@keyframes rise {
		from {
			transform: translateY(20px);
		}
		to {
			transform: translateY(0);
		}
	}
	@media (max-width: 420px) {
		.time {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.moving .row {
			animation: none;
		}
		.row,
		.pline {
			transition: none;
		}
	}
</style>
