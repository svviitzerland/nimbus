<script lang="ts">
	// Guided centralized logging lesson. Twenty web servers sit on top, a central log in the
	// middle, and a log viewer below. Following the beats, one server writes its diary, a login
	// hops slowly from server to server, then every line flows into the central log, a server
	// vanishes but its lines stay, and a search for "error" finds web-14 by itself. On the last
	// beat the learner may tap a search word.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { LogQuery, LogsText } from '$lib/chapters/devops/logs/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as LogsText);

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

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	// ---- the log lines (real log output, so it stays in English in both languages) ----
	type Line = { i: number; time: string; srv: number; level: string; msg: string; hay: string };
	const N = 60;
	const PATHS = ['/', '/cart', '/product/12', '/search', '/login', '/about'];
	const SPECIAL: Record<number, [number, string, string]> = {
		12: [9, 'ERROR', 'image resize failed'],
		20: [6, 'WARN', 'slow /search 1300ms'],
		33: [14, 'WARN', 'slow /checkout payment 2900ms'],
		36: [14, 'WARN', 'slow /checkout payment 4800ms'],
		39: [14, 'ERROR', '/checkout payment timeout 30s'],
		41: [14, 'ERROR', '/checkout payment timeout 30s']
	};
	const BAD = 39;
	const pad = (n: number) => String(n).padStart(2, '0');
	function clock(i: number) {
		const s = 13 * 3600 + 58 * 60 + 30 + i * 4;
		return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
	}
	const POOL: Line[] = Array.from({ length: N }, (_, i) => {
		const sp = SPECIAL[i];
		let srv = ((i * 7) % 20) + 1;
		if (!sp && srv === 14) srv = 15;
		const [s, level, msg] = sp ?? [
			srv,
			'INFO',
			i % 9 === 4
				? `GET /checkout 200 ${180 + ((i * 37) % 200)}ms`
				: `GET ${PATHS[i % PATHS.length]} 200 ${20 + ((i * 53) % 90)}ms`
		];
		const time = clock(i);
		const name = `web-${pad(s)}`;
		return { i, time, srv: s, level, msg, hay: `${time} ${name} ${level} ${msg}`.toLowerCase() };
	});
	/** The diary of web-01 alone, for the very first beat. */
	const SOLO: Line[] = POOL.filter((l) => l.level === 'INFO').map((l) => ({ ...l, srv: 1 }));
	const ROWS = 7;
	const GONE = 7;

	// ---- what the picture shows ----
	let off = $state(0); // where the live stream window starts
	let hop = $state(0); // the server being logged in to, one by one
	let query = $state('');
	let pick = $state<LogQuery | null>(null);
	let runId = $state(0);

	const typing = (word: string, done?: () => void): SeqStep[] => [
		[500, () => (query = '')],
		...[...word].map((_, k): SeqStep => [260, () => (query = word.slice(0, k + 1))]),
		[10, () => done?.()]
	];

	function play(s: number, p: LogQuery | null, still: boolean): (() => void) | undefined {
		off = 0;
		hop = 0;
		query = '';
		if (s === 0) {
			if (still) return;
			return runSeq([[1100, () => (off += 1)]], true);
		}
		if (s === 1) {
			if (still) {
				hop = 2;
				return;
			}
			return runSeq([[1300, () => (hop = (hop + 1) % 20)]], true);
		}
		if (s === 2 || (s === last && !p)) {
			if (still) {
				off = 30;
				return;
			}
			off = 20;
			return runSeq([[900, () => (off = (off + 1) % N)]], true);
		}
		if (s === 3) return;
		if (s === 4) {
			if (still) {
				query = 'error';
				return;
			}
			return runSeq([...typing('error'), [3600, () => {}]], true);
		}
		if (s === last && p) {
			if (still) {
				query = p;
				onstate?.(p);
				return;
			}
			return runSeq(typing(p, () => onstate?.(p)));
		}
		query = 'error';
	}

	$effect(() => {
		const s = step;
		const p = s === last ? pick : null;
		const still = reduce;
		void runId;
		return untrack(() => play(s, p, still));
	});

	function search(q: LogQuery) {
		pick = q;
		peek = null;
		runId += 1;
	}

	const solo = $derived(step === 0);
	const hopping = $derived(step === 1);
	const central = $derived(step >= 2);
	const flowing = $derived(central && !reduce);
	const gone = $derived(step === 3);
	const found = $derived(
		(step >= 5 && step < last) || (step === last && pick === 'error' && query === 'error')
	);

	const rows = $derived.by((): Line[] => {
		if (solo) return Array.from({ length: ROWS }, (_, k) => SOLO[(off + k) % SOLO.length]);
		if (hopping) return POOL.filter((l) => l.srv === hop + 1).slice(0, ROWS);
		if (query) return POOL.filter((l) => l.hay.includes(query)).slice(0, ROWS);
		if (gone) {
			const first = POOL.findIndex((l) => l.srv === GONE);
			return POOL.slice(Math.max(0, first - 1), Math.max(0, first - 1) + ROWS);
		}
		return Array.from({ length: ROWS }, (_, k) => POOL[(off + k) % N]);
	});

	const title = $derived(
		solo
			? tx.serverLog.replace('{s}', 'web-01')
			: hopping
				? tx.serverLog.replace('{s}', `web-${pad(hop + 1)}`)
				: tx.allLog
	);

	// ---- geometry ----
	const col = (n: number) => 14 + ((n - 1) % 10) * 44;
	const row = (n: number) => (n <= 10 ? 22 : 54);
</script>

{#snippet visual(_: number)}
	<div class="vis">
		{#if step === last}
			<div class="pick">
				<span class="cap">{tx.pickLabel}</span>
				<div class="chips">
					{#each ['error', 'checkout', 'slow'] as const as k (k)}
						<button type="button" class="chip" class:on={pick === k} onclick={() => search(k)}
							>{k}</button
						>
					{/each}
				</div>
			</div>
		{/if}

		<svg
			viewBox="0 0 460 304"
			class="scene"
			role="img"
			aria-label="{tx.fleetLabel}, {tx.centralLabel}"
		>
			<text x="14" y="13" class="lbl">{tx.fleetLabel}</text>
			{#if hopping}
				<text x="446" y="13" text-anchor="end" class="hoptag"
					>{tx.loginTag.replace('{n}', String(hop + 1))}</text
				>
			{/if}

			<!-- twenty small servers -->
			{#each Array.from({ length: 20 }, (_, k) => k + 1) as n (n)}
				{@const x = col(n)}
				{@const y = row(n)}
				{@const isGone = gone && n === GONE}
				{@const isBad = found && n === 14}
				<g
					class="srv"
					class:dim={solo && n !== 1}
					class:hop={hopping && n === hop + 1}
					class:gone={isGone}
					class:bad={isBad}
				>
					<rect {x} {y} width="38" height="26" rx="5" class="box" />
					<circle cx={x + 8} cy={y + 13} r="2.6" class="led" />
					<text x={x + 25} y={y + 16.5} text-anchor="middle" class="num">{pad(n)}</text>
					{#if isGone}
						<path d="M{x + 4} {y + 4}l30 18M{x + 34} {y + 4}l-30 18" class="cross" />
					{/if}
				</g>
				{#if flowing && !isGone}
					<circle
						cx={x + 19}
						cy="86"
						r="2.4"
						class="drop"
						style="animation-delay:{((n * 0.37) % 2.2).toFixed(2)}s"
					/>
				{/if}
			{/each}
			{#if gone}
				<text x={col(GONE) + 19} y="92" text-anchor="middle" class="gonetag">{tx.goneTag}</text>
			{/if}
			{#if found}
				<text x={col(14) + 19} y="94" text-anchor="middle" class="badtag">{tx.foundTag}</text>
			{/if}

			<!-- the central log with its search box -->
			{#if central}
				<g in:fade={{ duration: 300 }}>
					<rect x="14" y="104" width="432" height="32" rx="10" class="store" />
					<text x="28" y="124" class="storelbl">{tx.centralLabel}</text>
					<rect x="150" y="110" width="286" height="20" rx="10" class="field" />
					<circle cx="164" cy="119" r="4.2" class="glass" />
					<line x1="167" y1="122" x2="171" y2="126" class="glass" />
					{#if query}
						<text x="178" y="124" class="q">{query}</text>
					{:else}
						<text x="178" y="124" class="q ph">{tx.searchPlaceholder}</text>
					{/if}
				</g>
			{/if}

			<!-- the log viewer -->
			<rect x="14" y="146" width="432" height="152" rx="10" class="viewer" />
			<text x="26" y="164" class="vtitle">{title}</text>
			{#if rows.length === 0}
				<text x="26" y="190" class="row ph">{tx.noResults}</text>
			{/if}
			{#each rows as l, k (l.i)}
				{@const y = 186 + k * 16}
				<g
					in:fade={{ duration: reduce ? 0 : 260 }}
					class="row"
					class:keep={gone && l.srv === GONE}
					class:hit={found && l.i === BAD}
				>
					<rect x="18" y={y - 11} width="424" height="15" rx="4" class="rowbg" />
					<text x="24" {y} class="t">{l.time}</text>
					<text x="80" {y} class="s">web-{pad(l.srv)}</text>
					<text x="126" {y} class="lv {l.level.toLowerCase()}">{l.level}</text>
					<text x="166" {y} class="m">{l.msg}</text>
				</g>
			{/each}
		</svg>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
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
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-brand);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover,
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}

	.lbl {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.hoptag {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-amber);
	}
	.srv {
		transition: opacity 0.4s;
	}
	.srv.dim {
		opacity: 0.18;
	}
	.srv .box {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.4;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.srv .led {
		fill: var(--color-grass);
	}
	.srv .num {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.srv.hop .box {
		stroke: var(--color-amber);
		fill: var(--color-amber-soft);
	}
	.srv.gone {
		opacity: 0.4;
	}
	.srv.gone .led {
		fill: var(--color-line);
	}
	.cross {
		stroke: var(--color-faint);
		stroke-width: 1.4;
		stroke-linecap: round;
	}
	.srv.bad .box {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.srv.bad .led {
		fill: var(--color-danger);
	}
	.gonetag,
	.badtag {
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.badtag {
		fill: var(--color-danger);
	}
	.drop {
		fill: var(--color-brand);
		opacity: 0;
		animation: drop 2.2s ease-in infinite;
	}
	@keyframes drop {
		0% {
			transform: translateY(-4px);
			opacity: 0;
		}
		25% {
			opacity: 0.9;
		}
		100% {
			transform: translateY(16px);
			opacity: 0;
		}
	}
	.store {
		fill: var(--color-brand-soft);
		stroke: color-mix(in srgb, var(--color-brand) 40%, var(--color-line));
		stroke-width: 1.4;
	}
	.storelbl {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-brand);
	}
	.field {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.glass {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.q {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.q.ph,
	.row.ph {
		font-weight: 500;
		fill: var(--color-faint);
	}
	.viewer {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.vtitle {
		font-size: 10.5px;
		font-weight: 800;
		fill: var(--color-muted);
	}
	.row text {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
	}
	.row.ph {
		font-size: 10.5px;
	}
	.rowbg {
		fill: transparent;
		transition: fill 0.3s;
	}
	.row.keep .rowbg {
		fill: var(--color-brand-soft);
	}
	.row.hit .rowbg {
		fill: var(--color-danger-soft);
	}
	.t {
		fill: var(--color-faint);
	}
	.s {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.lv {
		font-weight: 700;
		fill: var(--color-grass);
	}
	.lv.warn {
		fill: var(--color-amber);
	}
	.lv.error {
		fill: var(--color-danger);
	}
	.m {
		fill: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.drop {
			animation: none;
		}
		.srv,
		.srv .box,
		.rowbg,
		.chip {
			transition: none;
		}
	}
</style>
