<script lang="ts">
	// Guided brute force lesson. A guessing machine rolls through passwords by itself and races
	// two padlocks, a short password and a long one. The short lock pops open almost at once
	// while the long one keeps holding, with a plain time estimate under each. Later beats show
	// the leaked list (clever tricks fall first) and a lockout slowing the machine to a crawl.
	// The only optional play, on the last beat, is a slider for the long password's length.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BruteForceText } from '$lib/chapters/security/brute-force/types';
	import { guided } from './attacks2/guided.svelte';
	import { sceneClock } from './attacks2/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BruteForceText);

	const g = guided({
		beat: () => beat,
		last: () => tx.steps.length - 1,
		onshow: (v) => onshow?.(v),
		oncomplete: () => oncomplete?.()
	});
	const step = $derived(g.step);
	const last = $derived(tx.steps.length - 1);

	const LONG = 'kopisusupagiharicerah';
	const FAST = 1e10; // guesses a second with nothing in the way
	const SLOW = 5 / 60; // guesses a second with a lockout (five a minute)
	const LEAKED = ['123456', 'password', 'qwerty', 'iloveyou', 'P@ssw0rd'];

	let len = $state(16);
	function tokenFor(n: number) {
		return n <= 9 ? 'weak' : n <= 12 ? 'okay' : 'strong';
	}
	function slid() {
		onstate?.(tokenFor(len));
	}

	const clock = sceneClock(() => [step, len]);

	/** Seconds the machine needs, in the worst case, to try every lowercase password of length n. */
	const secs = (n: number, speed: number) => Math.pow(26, n) / speed;

	function fmt(n: number) {
		const r = n >= 100 ? Number(n.toPrecision(2)) : Math.round(n);
		return r.toLocaleString(tx.numberLocale);
	}
	function human(s: number) {
		const u = tx.units;
		const put = (tpl: string, n: number) => tpl.replace('{n}', fmt(n));
		if (s < 1) return u.instant;
		if (s < 90) return put(u.seconds, s);
		if (s < 5400) return put(u.minutes, s / 60);
		if (s < 172800) return put(u.hours, s / 3600);
		const days = s / 86400;
		if (days < 730) return put(u.days, days);
		const years = days / 365;
		if (years < 1e6) return put(u.years, years);
		if (years < 1e9) return put(u.million, years / 1e6);
		return put(u.billion, years / 1e9);
	}

	const lockout = $derived(step === 6);
	const leaked = $derived(step === 4);
	const speed = $derived(lockout ? SLOW : FAST);
	const showA = $derived(step >= 1);
	const showB = $derived(step >= 2);
	const lenB = $derived(
		step === 2 ? Math.min(16, 4 + Math.floor(clock.t / 450)) : step === last ? len : 16
	);
	const passA = $derived(leaked ? 'P@ssw0rd' : 'kopi');
	const passB = $derived(LONG.slice(0, lenB));
	const secsA = $derived(leaked ? 0 : secs(4, speed));
	const secsB = $derived(secs(lenB, speed));

	/** How far the machine got, 0 to 1. Fast cracks still take a moment so the eye can follow. */
	function progress(s: number, running: boolean) {
		if (!running) return 0;
		return Math.min(1, clock.t / Math.max(900, s * 1000));
	}
	const runA = $derived(showA && step !== 2);
	const runB = $derived(step >= 3);
	const fracA = $derived(progress(secsA, runA));
	const fracB = $derived(progress(secsB, runB));
	const crackedA = $derived(fracA >= 1);
	const crackedB = $derived(fracB >= 1);

	/** The guess on the machine's screen, rolling aaaa, aaab, aaac like an odometer. */
	const guess = $derived.by(() => {
		if (clock.reduced) return leaked ? LEAKED[4] : 'aaab';
		if (leaked) return LEAKED[Math.min(LEAKED.length - 1, Math.floor(clock.t / 180))];
		const k = Math.floor(clock.t / (lockout ? 2400 : 70));
		let s = '';
		let v = k;
		for (let n = 0; n < 4; n++) {
			s = String.fromCharCode(97 + (v % 26)) + s;
			v = Math.floor(v / 26);
		}
		return s;
	});
	const waiting = $derived(lockout && !clock.reduced && Math.floor(clock.t / 1200) % 2 === 1);

	const lanes = $derived([
		{
			y: 122,
			pass: passA,
			on: showA,
			frac: fracA,
			cracked: crackedA,
			time: human(secsA),
			list: leaked
		},
		{
			y: 202,
			pass: passB,
			on: showB,
			frac: fracB,
			cracked: crackedB,
			time: human(secsB),
			list: false
		}
	]);
	const CELL = 17;
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<label class="slider">
				<span class="cap">{tx.sliderLabel}</span>
				<span class="row">
					<input type="range" min="4" max="20" bind:value={len} onchange={slid} />
					<b>{tx.letters.replace('{n}', String(len))}</b>
				</span>
			</label>
		{/if}

		<svg viewBox="0 0 460 268" class="scene" role="img" aria-label={tx.machineLabel}>
			<!-- the guessing machine -->
			<line x1="230" y1="8" x2="230" y2="18" class="ant" />
			<circle cx="230" cy="7" r="3.5" class="antTip" class:busy={!clock.reduced && i > 0} />
			<rect x="146" y="18" width="168" height="62" rx="12" class="body" />
			<rect x="160" y="28" width="140" height="34" rx="6" class="screen" />
			{#if waiting}
				<text x="230" y="50" text-anchor="middle" class="wait">{tx.waitLabel}</text>
			{:else}
				<text x="230" y="51" text-anchor="middle" class="guess" class:list={leaked}>{guess}</text>
			{/if}
			{#if leaked}
				<!-- under the screen, between the bolts, so it never sits on the guess -->
				<text x="230" y="74" text-anchor="middle" class="listTag">{tx.listLabel}</text>
			{/if}
			<circle cx="168" cy="71" r="3" class="bolt" />
			<circle cx="292" cy="71" r="3" class="bolt" />
			{#if lockout}
				<g transform="translate(300 10)" class="lockout">
					<circle r="11" />
					<path d="M0 -5V0L4 3" />
				</g>
			{/if}
			<text x="230" y="98" text-anchor="middle" class="speed" class:slow={lockout}>
				{lockout ? tx.speedLock : tx.speedFast}
			</text>

			{#each lanes as l, n (n)}
				<g class="lane" class:hide={!l.on}>
					<!-- padlock -->
					<g transform="translate(34 {l.y + 6})" class="lock" class:open={l.cracked}>
						<path d="M-8 4V-2a8 8 0 0 1 16 0V4" class="shackle" />
						<rect x="-12" y="4" width="24" height="20" rx="4" class="lbody" />
						<circle cy="13" r="2.4" class="hole" />
					</g>
					<!-- the password, one cell per letter -->
					{#each l.pass.split('') as ch, k (k)}
						<rect x={66 + k * CELL} y={l.y} width={CELL - 2} height="22" rx="4" class="cell" />
						<text x={66 + k * CELL + (CELL - 2) / 2} y={l.y + 15} text-anchor="middle" class="ch"
							>{ch}</text
						>
					{/each}
					<!-- how far the machine got -->
					<rect x="66" y={l.y + 30} width="358" height="6" rx="3" class="track" />
					<rect
						x="66"
						y={l.y + 30}
						width={Math.max(4, 358 * l.frac)}
						height="6"
						rx="3"
						class="fill"
						class:bad={l.cracked}
					/>
					<text x="66" y={l.y + 52} class="time">{l.time}</text>
					{#if l.on && (n === 0 ? runA : runB)}
						<text x="424" y={l.y + 52} text-anchor="end" class="state" class:bad={l.cracked}>
							{l.list ? tx.onList : l.cracked ? tx.cracked : tx.holding}
						</text>
					{:else if l.on}
						<text x="424" y={l.y + 52} text-anchor="end" class="state idle">
							{tx.letters.replace('{n}', String(l.pass.length))}
						</text>
					{/if}
				</g>
			{/each}
		</svg>

		{#if i === 5}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={g.select} {visual} />
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
	.slider {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.slider .row {
		display: flex;
		align-items: center;
		gap: 10px;
		font-size: 13px;
		color: var(--color-ink);
	}
	.slider input {
		width: 200px;
		accent-color: var(--color-brand);
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.rule {
		margin: 0;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 5px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
	}

	/* ---- the machine ---- */
	.body {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.screen {
		fill: var(--color-ink);
	}
	.ant {
		stroke: var(--color-faint);
		stroke-width: 2;
	}
	.antTip {
		fill: var(--color-amber);
	}
	.antTip.busy {
		animation: blink 0.5s ease-in-out infinite alternate;
	}
	@keyframes blink {
		to {
			opacity: 0.25;
		}
	}
	.bolt {
		fill: var(--color-line);
	}
	.guess {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: 0.08em;
		fill: var(--color-paper);
	}
	.guess.list {
		fill: var(--color-amber);
	}
	.wait {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-amber);
	}
	.listTag {
		font-size: 8px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-amber);
	}
	.speed {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.speed.slow {
		fill: var(--color-grass);
	}
	.lockout circle {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.5;
	}
	.lockout path {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.8;
		stroke-linecap: round;
	}

	/* ---- the lanes ---- */
	.lane {
		transition: opacity 0.5s;
	}
	.lane.hide {
		opacity: 0;
	}
	.shackle {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 3.5;
		stroke-linecap: round;
		transition:
			transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.4),
			stroke 0.3s;
	}
	.lbody {
		fill: var(--color-grass);
		transition: fill 0.3s;
	}
	.hole {
		fill: var(--color-card);
	}
	.lock.open .shackle {
		stroke: var(--color-danger);
		transform: translate(5px, -6px) rotate(18deg);
	}
	.lock.open .lbody {
		fill: var(--color-danger);
	}
	.cell {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.ch {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.track {
		fill: var(--color-line);
	}
	.fill {
		fill: var(--color-amber);
	}
	.fill.bad {
		fill: var(--color-danger);
	}
	.time {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.state {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-grass);
	}
	.state.bad {
		fill: var(--color-danger);
	}
	.state.idle {
		fill: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.antTip.busy {
			animation: none;
		}
		.lane,
		.shackle,
		.lbody {
			transition: none;
		}
	}
</style>
