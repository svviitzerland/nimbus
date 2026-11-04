<script lang="ts">
	// Guided on call lesson. A phone on the nightstand, a runbook on a clipboard, and an error
	// chart. Following the beats, errors spike at night, the phone rings and gets acknowledged,
	// the runbook ticks itself off step by step, a rollback brings the line back down, and the
	// runbook turns into a blameless post mortem. On the last beat the learner may try the
	// tempting restart and watch the errors come back.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { OnCallText } from '$lib/chapters/devops/on-call/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as OnCallText);

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

	// ---- what the picture shows ----
	type Phone = 'sleep' | 'ring' | 'acked' | 'resolved';
	let phone = $state<Phone>('sleep');
	let tnow = $state(6); // minutes after 02.50 drawn on the chart
	let ticks = $state(0); // runbook steps done
	let rolled = $state(false);
	let panicAt = $state<number | null>(null);
	let pm = $state(false);
	let pmShown = $state(0);
	let struck = $state(false);

	const SPIKE = 8;
	const RELEASE = 7;
	const ROLLBACK = 20;
	function err(m: number): number {
		if (m < SPIKE) return 0.3;
		if (panicAt !== null && m >= panicAt && m < panicAt + 2) return 4;
		if (rolled && m > ROLLBACK) return m === ROLLBACK + 1 ? 12 : 0.3;
		return 38;
	}
	const clock = (m: number) => {
		const t = 50 + Math.round(m);
		const h = t >= 60 ? '03' : '02';
		return `${h}.${String(t % 60).padStart(2, '0')}`;
	};

	function base(o: Partial<{ phone: Phone; tnow: number; ticks: number; rolled: boolean }> = {}) {
		phone = o.phone ?? 'sleep';
		tnow = o.tnow ?? 6;
		ticks = o.ticks ?? 0;
		rolled = o.rolled ?? false;
		panicAt = null;
		pm = false;
		pmShown = 0;
		struck = false;
	}
	const climb = (from: number, to: number, ms: number, each?: (m: number) => void): SeqStep[] =>
		Array.from(
			{ length: to - from + 1 },
			(_, k): SeqStep => [
				ms,
				() => {
					tnow = from + k;
					each?.(from + k);
				}
			]
		);

	// ---- the optional restart ----
	let tried = $state(false);
	let runId = $state(0);

	function play(s: number, t: boolean, still: boolean): (() => void) | undefined {
		if (s === 0) {
			base();
			return;
		}
		if (s === 1) {
			base({ tnow: 12, phone: 'ring' });
			if (still) return;
			return runSeq(
				[
					[300, () => base({ tnow: 5 })],
					...climb(6, 12, 380, (m) => {
						if (m >= 10) phone = 'ring';
					}),
					[2800, () => {}]
				],
				true
			);
		}
		if (s === 2) {
			base({ tnow: 10, phone: 'acked' });
			if (still) return;
			return runSeq(
				[
					[2400, () => (phone = 'ring')],
					[2800, () => (phone = 'acked')]
				],
				true
			);
		}
		if (s === 3) {
			base({ tnow: 11, phone: 'acked' });
			return;
		}
		if (s === 4) {
			base({ tnow: 12, phone: 'acked', ticks: 2 });
			if (still) return;
			return runSeq(
				[
					[900, () => (ticks = 0)],
					[1600, () => (ticks = 1)],
					[3400, () => (ticks = 2)]
				],
				true
			);
		}
		if (s === 5) {
			base({ tnow: 24, phone: 'resolved', ticks: 4, rolled: true });
			if (still) return;
			return runSeq(
				[
					[1200, () => base({ tnow: 12, phone: 'acked', ticks: 2 })],
					[
						400,
						() => {
							ticks = 3;
							rolled = true;
						}
					],
					...climb(13, 24, 230),
					[
						3200,
						() => {
							ticks = 4;
							phone = 'resolved';
						}
					]
				],
				true
			);
		}
		if (s === 6) {
			base({ tnow: 24, phone: 'resolved', ticks: 4, rolled: true });
			return;
		}
		if (s === 7 || s === 8) {
			base({ tnow: 24, phone: 'resolved', ticks: 4, rolled: true });
			pm = true;
			pmShown = 4;
			struck = true;
			if (still || s === 8) return;
			return runSeq(
				[
					[
						700,
						() => {
							pmShown = 0;
							struck = false;
						}
					],
					[1500, () => (pmShown = 1)],
					[900, () => (struck = true)],
					[900, () => (pmShown = 2)],
					[900, () => (pmShown = 3)],
					[3600, () => (pmShown = 4)]
				],
				true
			);
		}
		// the last beat, paused right before the rollback
		base({ tnow: 12, phone: 'acked', ticks: 2 });
		if (!t) return;
		panicAt = 13;
		if (still) {
			tnow = 19;
			onstate?.('panic');
			return;
		}
		return runSeq([...climb(13, 19, 380), [10, () => onstate?.('panic')]]);
	}

	$effect(() => {
		const s = step;
		const t = s === last && tried;
		const still = reduce;
		void runId;
		return untrack(() => play(s, t, still));
	});

	function restart() {
		tried = true;
		peek = null;
		runId += 1;
	}

	// ---- chart geometry ----
	const cx = (m: number) => 160 + (m / 30) * 270;
	const cy = (v: number) => 282 - (v / 40) * 62;
	const line = $derived(
		Array.from({ length: tnow + 1 }, (_, m) => `${cx(m).toFixed(1)},${cy(err(m)).toFixed(1)}`).join(
			' '
		)
	);
	const nowErr = $derived(err(tnow));
	const showRelease = $derived(ticks >= 2);
	const book = $derived(step >= 3);
	const spot = $derived(step === 6);
</script>

{#snippet visual(_: number)}
	<div class="vis">
		{#if step === last}
			<button type="button" class="play" onclick={restart}>{tx.panicBtn}</button>
		{/if}

		<svg viewBox="0 0 460 300" class="scene" role="img" aria-label={tx.runbookTitle}>
			<!-- the phone -->
			<g class="phone" class:ring={phone === 'ring' && !reduce}>
				<rect x="14" y="24" width="112" height="224" rx="18" class="body" />
				<rect x="21" y="40" width="98" height="192" rx="9" class="screen" />
				<line x1="58" y1="32" x2="82" y2="32" class="notch" />
				{#if phone === 'sleep'}
					<path d="M78 70a14 14 0 1 1 -12 -16a11 11 0 0 0 12 16z" class="moon" />
					<text x="70" y="132" text-anchor="middle" class="big">{clock(tnow)}</text>
					<text x="70" y="154" text-anchor="middle" class="tiny">{tx.onCallNote}</text>
				{:else if phone === 'resolved'}
					<text x="70" y="58" text-anchor="middle" class="tiny">{clock(tnow)}</text>
					<circle cx="70" cy="112" r="20" class="okc" />
					<path d="M60 112l7 7l13 -14" class="okp" />
					<text x="70" y="152" text-anchor="middle" class="oktxt">{tx.resolvedTag}</text>
				{:else}
					<text x="70" y="58" text-anchor="middle" class="tiny">{clock(tnow)}</text>
					<rect x="27" y="68" width="86" height="72" rx="8" class="alert" />
					<text x="35" y="84" class="app">{tx.pagerApp}</text>
					<text x="35" y="104" class="atitle">{tx.alertTitle}</text>
					<text x="35" y="120" class="abody">{tx.alertBody}</text>
					<rect
						x="27"
						y="154"
						width="86"
						height="26"
						rx="13"
						class="ack"
						class:done={phone === 'acked'}
					/>
					<text x="70" y="170.5" text-anchor="middle" class="acktxt"
						>{phone === 'acked' ? tx.ackedTag : tx.ackBtn}</text
					>
				{/if}
			</g>
			{#if phone === 'ring'}
				<g class="waves" class:still={reduce}>
					<path d="M132 70q8 10 0 20" />
					<path d="M140 64q13 16 0 32" />
					<path d="M8 70q-8 10 0 20" />
				</g>
			{/if}

			<!-- the clipboard, runbook first, post mortem later -->
			<g class="board" class:faded={!book}>
				<rect x="146" y="22" width="300" height="170" rx="10" class="paper" />
				<rect x="266" y="15" width="60" height="13" rx="4" class="clip" />
				{#if !pm}
					<text x="160" y="52" class="ptitle">{tx.runbookTitle}</text>
					{#each tx.runbook as r, k (k)}
						{@const y = 74 + k * 29}
						{@const done = book && ticks > k}
						<g
							class="rrow"
							class:done
							class:next={book && ticks === k && step !== 3}
							class:spot={spot && k === 1}
						>
							<rect x="160" y={y - 10} width="12" height="12" rx="3" class="cb" />
							{#if done}<path d="M162.5 {y - 4}l3 3l5 -6" class="cbt" />{/if}
							<text x="180" y={y + 1} class="rl">{r.label}</text>
							{#if done}<text x="180" y={y + 13} class="rr">{r.result}</text>{/if}
						</g>
					{/each}
				{:else}
					<text x="160" y="52" class="ptitle">{tx.pmTitle}</text>
					{#if pmShown >= 1}
						<g class="blame">
							<text x="160" y="80" class="pl bad">{tx.blameLine}</text>
							{#if struck}
								<line
									x1="158"
									y1="76"
									x2={162 + tx.blameLine.length * 5.6}
									y2="76"
									class="strike"
								/>
							{/if}
						</g>
					{/if}
					{#each tx.pmLines as l, k (k)}
						{#if pmShown >= k + 2}
							<circle cx="164" cy={110 + k * 26 - 3.5} r="3.2" class="gdot" />
							<text x="174" y={110 + k * 26} class="pl">{l}</text>
						{/if}
					{/each}
				{/if}
			</g>

			<!-- the error chart -->
			<rect x="146" y="202" width="300" height="94" rx="10" class="paper" />
			<text x="158" y="219" class="clbl">{tx.errorsLabel}</text>
			<text x="434" y="219" text-anchor="end" class="cval" class:hot={nowErr > 5}
				>{nowErr < 1 ? '0.3' : Math.round(nowErr)}%</text
			>
			<line x1="160" y1="282" x2="430" y2="282" class="axis" />
			{#if showRelease}
				<line x1={cx(RELEASE)} y1="226" x2={cx(RELEASE)} y2="282" class="rel" class:spot />
				<text x={cx(RELEASE) - 4} y="236" text-anchor="end" class="reltxt" class:spot
					>{tx.releaseTag}</text
				>
			{/if}
			<polyline points={line} class="eline" class:hot={nowErr > 5} />
			<text x="160" y="292" text-anchor="middle" class="tlbl">02.50</text>
			<text x="430" y="292" text-anchor="middle" class="tlbl">03.20</text>
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
	.play {
		border-radius: 999px;
		background: var(--btn-primary);
		padding: 8px 18px;
		font-size: 14px;
		font-weight: 600;
		color: #fff;
	}

	/* ---- phone ---- */
	.phone {
		transform-box: fill-box;
		transform-origin: 50% 50%;
	}
	.phone.ring {
		animation: buzz 0.5s ease-in-out infinite;
	}
	@keyframes buzz {
		0%,
		60%,
		100% {
			transform: rotate(0);
		}
		15% {
			transform: rotate(-2.5deg);
		}
		30% {
			transform: rotate(2.5deg);
		}
		45% {
			transform: rotate(-1.5deg);
		}
	}
	.body {
		fill: var(--color-ink);
	}
	.screen {
		fill: var(--color-paper);
	}
	.notch {
		stroke: var(--color-muted);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.moon {
		fill: var(--color-amber);
		opacity: 0.85;
	}
	.big {
		font-size: 25px;
		font-weight: 700;
		fill: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.tiny {
		font-size: 8.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.alert {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.3;
	}
	.app {
		font-size: 8.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		fill: var(--color-danger);
	}
	.atitle {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.abody {
		font-size: 8.5px;
		fill: var(--color-muted);
	}
	.ack {
		fill: var(--color-danger);
		transition: fill 0.3s;
	}
	.ack.done {
		fill: var(--color-grass);
	}
	.acktxt {
		font-size: 9.5px;
		font-weight: 700;
		fill: #fff;
	}
	.okc {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.okp {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.oktxt {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.waves path {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2;
		stroke-linecap: round;
		animation: wave 1s ease-in-out infinite;
	}
	.waves.still path {
		animation: none;
	}
	@keyframes wave {
		50% {
			opacity: 0.2;
		}
	}

	/* ---- clipboard ---- */
	.board {
		transition: opacity 0.4s;
	}
	.board.faded {
		opacity: 0.35;
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.clip {
		fill: var(--color-muted);
	}
	.ptitle {
		font-size: 11.5px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.cb {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.3;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.rrow.done .cb {
		fill: var(--color-grass);
		stroke: var(--color-grass);
	}
	.rrow.next .cb {
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.cbt {
		fill: none;
		stroke: #fff;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.rl {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.rrow.done .rl,
	.rrow.next .rl {
		fill: var(--color-ink);
	}
	.rr {
		font-size: 9px;
		fill: var(--color-grass);
		font-weight: 600;
	}
	.rrow.spot .rl,
	.rrow.spot .rr {
		fill: var(--color-amber);
	}
	.pl {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.pl.bad {
		fill: var(--color-danger);
	}
	.strike {
		stroke: var(--color-danger);
		stroke-width: 1.6;
	}
	.gdot {
		fill: var(--color-grass);
	}

	/* ---- chart ---- */
	.clbl {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.cval {
		font-size: 13px;
		font-weight: 800;
		fill: var(--color-grass);
		font-variant-numeric: tabular-nums;
	}
	.cval.hot {
		fill: var(--color-danger);
	}
	.axis {
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.eline {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.4;
		stroke-linejoin: round;
		stroke-linecap: round;
		transition: stroke 0.3s;
	}
	.eline.hot {
		stroke: var(--color-danger);
	}
	.rel {
		stroke: var(--color-faint);
		stroke-width: 1.4;
	}
	.reltxt {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.rel.spot {
		stroke: var(--color-amber);
		stroke-width: 2.2;
	}
	.reltxt.spot {
		fill: var(--color-amber);
		font-size: 10px;
	}
	.tlbl {
		font-size: 8.5px;
		fill: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.phone.ring {
			animation: none;
		}
		.board,
		.ack,
		.cb,
		.eline {
			transition: none;
		}
	}
</style>
