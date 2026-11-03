<script lang="ts">
	import { onDestroy } from 'svelte';
	import Server from '$lib/components/Server.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { BruteForceText } from '$lib/chapters/security/brute-force/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BruteForceText);

	// The kind of list every guessing machine starts with, the most reused passwords from real leaks.
	const LEAKED = [
		'123456',
		'password',
		'12345678',
		'qwerty',
		'123456789',
		'12345',
		'1234',
		'111111',
		'1234567',
		'iloveyou',
		'admin',
		'welcome',
		'abc123',
		'password1',
		'qwerty123',
		'sayang',
		'bismillah',
		'indonesia',
		'nimbus123',
		'dragon'
	];
	const FAST = 10000; // guesses per second with nothing in the way
	const LOCK = 5 / 900; // five guesses, then a 15 minute wait
	const AGE_OF_UNIVERSE = 13.8e9; // years

	type Kind = 'lower' | 'upper' | 'digits' | 'symbols';
	type Verdict = 'leaked' | 'fast' | 'medium' | 'strong';
	type Result = {
		pass: string;
		lock: boolean;
		kinds: Kind[];
		combos: number;
		seconds: number;
		leakedAt: number; // 0 when it is not on the list
		verdict: Verdict;
	};

	let pass = $state('');
	let lockout = $state(false);
	let running = $state(false);
	let rolling = $state('');
	let result = $state<Result | null>(null);
	let history = $state<Result[]>([]);
	let gotStrong = $state(false);
	let ranLocked = $state(false);
	let completed = false;
	let roll: ReturnType<typeof setInterval> | undefined;
	let stop: ReturnType<typeof setTimeout> | undefined;

	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function clearAll() {
		if (roll) clearInterval(roll);
		if (stop) clearTimeout(stop);
		roll = undefined;
		stop = undefined;
	}

	const POOLS: Record<Kind, string> = {
		lower: 'abcdefghijklmnopqrstuvwxyz',
		upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		digits: '0123456789',
		symbols: '!@#$%&*?_+=.'
	};
	const SIZES: Record<Kind, number> = { lower: 26, upper: 26, digits: 10, symbols: 33 };

	function kindsOf(p: string): Kind[] {
		const k: Kind[] = [];
		if (/[a-z]/.test(p)) k.push('lower');
		if (/[A-Z]/.test(p)) k.push('upper');
		if (/[0-9]/.test(p)) k.push('digits');
		if (/[^a-zA-Z0-9]/.test(p)) k.push('symbols');
		return k;
	}

	function measure(p: string, lock: boolean): Result {
		const kinds = kindsOf(p);
		const size = kinds.reduce((s, k) => s + SIZES[k], 0);
		const combos = Math.pow(size, p.length);
		const leakedAt = LEAKED.indexOf(p.toLowerCase()) + 1;
		let seconds: number;
		if (leakedAt) seconds = lock ? Math.floor((leakedAt - 1) / 5) * 900 : leakedAt / FAST;
		else seconds = combos / (lock ? LOCK : FAST);
		const years = seconds / 31557600;
		const verdict: Verdict = leakedAt
			? 'leaked'
			: seconds < 86400
				? 'fast'
				: years < 100
					? 'medium'
					: 'strong';
		return { pass: p, lock, kinds, combos, seconds, leakedAt, verdict };
	}

	function run() {
		const p = pass.trim();
		if (!p || running) return;
		clearAll();
		const r = measure(p, lockout);
		running = true;
		result = null;
		let i = 0;
		const pool = r.kinds.map((k) => POOLS[k]).join('') || 'a';
		roll = setInterval(() => {
			if (r.leakedAt) {
				rolling = LEAKED[Math.min(i, r.leakedAt - 1)];
			} else {
				let s = '';
				for (let j = 0; j < p.length; j++) s += pool[Math.floor(Math.random() * pool.length)];
				rolling = s;
			}
			i++;
		}, 70);
		stop = setTimeout(
			() => {
				clearAll();
				running = false;
				rolling = r.leakedAt || r.verdict === 'fast' ? p : rolling;
				result = r;
				history = [r, ...history].slice(0, 4);
				if (r.verdict === 'strong') gotStrong = true;
				if (r.lock) ranLocked = true;
				onstate?.(r.verdict === 'leaked' && r.lock ? 'leakedLock' : r.verdict);
				if (gotStrong && ranLocked && !completed) {
					completed = true;
					oncomplete?.();
				}
			},
			reduced() ? 300 : 1600
		);
	}

	function toggleLock() {
		lockout = !lockout;
		if (lockout) onstate?.('lockOn');
	}

	function round(n: number) {
		return n < 10 ? String(Math.round(n * 10) / 10) : String(Math.round(n));
	}
	function duration(sec: number): string {
		const u = tx.units;
		if (sec < 1) return u.instant;
		if (sec < 60) return u.seconds.replace('{n}', round(sec));
		if (sec < 3600) return u.minutes.replace('{n}', round(sec / 60));
		if (sec < 86400) return u.hours.replace('{n}', round(sec / 3600));
		const days = sec / 86400;
		if (days < 365) return u.days.replace('{n}', round(days));
		const years = sec / 31557600;
		if (years < 1e6) return u.years.replace('{n}', round(years));
		if (years < 1e9) return u.million.replace('{n}', round(years / 1e6));
		if (years < AGE_OF_UNIVERSE) return u.billion.replace('{n}', round(years / 1e9));
		return u.forever;
	}
	// Big counts as a short power of ten, small ones as they are.
	function big(n: number): { m: string; e: number } {
		if (n < 1e6) return { m: String(n), e: 0 };
		const e = Math.floor(Math.log10(n));
		return { m: (n / Math.pow(10, e)).toFixed(1), e };
	}
	// How full the bar is, on a log scale from one second up to the age of the universe.
	function meter(sec: number) {
		const max = Math.log10(AGE_OF_UNIVERSE * 31557600);
		return Math.max(4, Math.min(100, (Math.log10(Math.max(sec, 1)) / max) * 100));
	}

	onDestroy(clearAll);
</script>

<div class="wrap">
	<!-- the controls, kept up top and clear of Nim -->
	<div class="controls">
		<label class="field">
			<span class="flabel">{tx.passLabel}</span>
			<input
				type="text"
				bind:value={pass}
				maxlength="24"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				placeholder={tx.passPlaceholder}
				onkeydown={(e) => e.key === 'Enter' && run()}
			/>
			<span class="hint">{tx.passHint}</span>
		</label>
		<button type="button" class="switch" role="switch" aria-checked={lockout} onclick={toggleLock}>
			<span class="knob" class:on={lockout}><i></i></span>
			<span>{tx.lockLabel}</span>
		</button>
		<CallToActionButton onclick={run} disabled={!pass.trim() || running}>
			{#snippet children()}{pass.trim() ? tx.runBtn : tx.emptyPass}{/snippet}
		</CallToActionButton>
	</div>

	<!-- the guessing machine against the pretend login -->
	<div class="duel">
		<div class="machine">
			<span class="mlabel">{tx.machineLabel}</span>
			<span class="screen" class:live={running}>{rolling || '????'}</span>
			<span class="speed">{lockout ? tx.speedLock : tx.speedFast}</span>
		</div>
		<span class="arrow" class:live={running} aria-hidden="true">
			<svg width="22" height="12" viewBox="0 0 22 12" fill="none">
				<path
					d="M1 6h18m0 0-4.5-4.5M19 6l-4.5 4.5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/>
			</svg>
		</span>
		<div class="target">
			<div class="srv"><Server slots={2} active={running} /></div>
			<span class="mlabel">{tx.targetLabel}</span>
			{#if lockout && running}
				<span class="locked">{tx.lockedTag}</span>
			{/if}
		</div>
	</div>

	{#if result}
		{@const c = big(result.combos)}
		<div class="result pop">
			{#if result.leakedAt}
				<p class="rhead bad">{tx.leakedTitle}</p>
				<p class="rsub">{tx.leakedSub.replace('{n}', String(result.leakedAt))}</p>
			{:else}
				<div class="stats">
					<span class="chip">{tx.lengthStat.replace('{n}', String(result.pass.length))}</span>
					{#each result.kinds as k (k)}
						<span class="chip soft">{tx.kinds[k]}</span>
					{/each}
				</div>
				<p class="combos">
					{#if c.e}{c.m} × 10<sup>{c.e}</sup>{:else}{c.m}{/if}
					<span>{tx.combosStat}</span>
				</p>
			{/if}
			<p class="rlabel">{tx.resultLabel}</p>
			<p class="time {result.verdict}">{duration(result.seconds)}</p>
			<span class="track"
				><span class="fill {result.verdict}" style="width:{meter(result.seconds)}%"></span></span
			>
		</div>
	{/if}

	<ul class="goals">
		{#each tx.goals as g, i (i)}
			{@const ok = i === 0 ? gotStrong : ranLocked}
			<li class:ok><span class="tick">{ok ? '✓' : ''}</span>{g}</li>
		{/each}
	</ul>

	{#if history.length}
		<div class="history">
			<p class="hlabel">{tx.historyLabel}</p>
			{#each history as h, i (i)}
				<div class="hrow">
					<span class="hpass">{h.pass}</span>
					{#if h.lock}<span class="hlock">{tx.lockShort}</span>{/if}
					<span class="htime">{duration(h.seconds)}</span>
					<span class="verdict {h.verdict}">{tx.verdicts[h.verdict]}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.controls {
		display: flex;
		width: min(92vw, 340px);
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.controls :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.field {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.flabel {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
	}
	input {
		width: 100%;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		color: var(--color-ink);
		outline: none;
		transition: border-color 0.2s;
	}
	input:focus {
		border-color: var(--color-brand);
	}
	.hint {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.switch {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 9px;
		text-align: left;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.knob {
		position: relative;
		flex: none;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.knob i {
		position: absolute;
		top: 3px;
		left: 3px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--color-card);
		transition: transform 0.2s;
	}
	.knob.on {
		background: var(--color-grass);
	}
	.knob.on i {
		transform: translateX(14px);
	}

	/* the duel */
	.duel {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		width: min(94vw, 360px);
	}
	.machine,
	.target {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.machine {
		min-width: 0;
		flex: 1;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
	}
	.mlabel {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.screen {
		width: 100%;
		overflow: hidden;
		border-radius: 8px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 5px 8px;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
	}
	.screen.live {
		color: var(--color-amber);
	}
	.speed {
		text-align: center;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.arrow {
		flex: none;
		color: var(--color-line);
		transition: color 0.2s;
	}
	.arrow.live {
		color: var(--color-danger);
	}
	.target {
		position: relative;
		width: 92px;
		flex: none;
	}
	.srv {
		width: 60px;
		height: 62px;
	}
	.srv > :global(.server) {
		transform: scale(0.7);
		transform-origin: top left;
	}
	.locked {
		position: absolute;
		top: 18px;
		border-radius: 999px;
		background: var(--color-amber);
		color: #fff;
		font-size: 8.5px;
		font-weight: 800;
		padding: 2px 7px;
		white-space: nowrap;
		animation: blink 0.6s ease-in-out infinite alternate;
	}
	@keyframes blink {
		from {
			opacity: 0.4;
		}
		to {
			opacity: 1;
		}
	}

	/* the result */
	.result {
		display: flex;
		width: min(92vw, 340px);
		flex-direction: column;
		align-items: center;
		gap: 5px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
	}
	.stats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 5px;
	}
	.chip {
		border-radius: 999px;
		background: var(--color-ink);
		color: var(--color-paper);
		font-size: 10px;
		font-weight: 800;
		padding: 2px 8px;
	}
	.chip.soft {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.combos {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: var(--font-display);
		font-size: 20px;
		color: var(--color-ink);
	}
	.combos span {
		font-family: var(--font-sans);
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.rhead {
		font-size: 14px;
		font-weight: 800;
	}
	.rsub {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.rlabel {
		margin-top: 4px;
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.time {
		text-align: center;
		font-family: var(--font-display);
		font-size: 22px;
	}
	.bad,
	.time.leaked,
	.time.fast {
		color: var(--color-danger);
	}
	.time.medium {
		color: var(--color-amber);
	}
	.time.strong {
		color: var(--color-grass);
	}
	.track {
		position: relative;
		width: 100%;
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		animation: grow 0.7s ease;
	}
	.fill.leaked,
	.fill.fast {
		background: var(--color-danger);
	}
	.fill.medium {
		background: var(--color-amber);
	}
	.fill.strong {
		background: var(--color-grass);
	}
	@keyframes grow {
		from {
			width: 0;
		}
	}

	/* goals and history */
	.goals {
		display: flex;
		width: min(92vw, 340px);
		flex-direction: column;
		gap: 4px;
	}
	.goals li {
		display: flex;
		align-items: center;
		gap: 7px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.goals li.ok {
		color: var(--color-ink);
	}
	.tick {
		display: grid;
		flex: none;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
		font-size: 9px;
		font-weight: 800;
		color: #fff;
	}
	.goals li.ok .tick {
		border-color: var(--color-grass);
		background: var(--color-grass);
	}
	.history {
		display: flex;
		width: min(92vw, 340px);
		flex-direction: column;
		gap: 4px;
	}
	.hlabel {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.hrow {
		display: flex;
		align-items: center;
		gap: 6px;
		border-top: 1px solid var(--color-line);
		padding-top: 4px;
		font-size: 11px;
	}
	.hpass {
		min-width: 0;
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-ink);
	}
	.hlock {
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 9px;
		font-weight: 800;
		padding: 1px 6px;
	}
	.htime {
		max-width: 45%;
		text-align: right;
		font-size: 10px;
		color: var(--color-faint);
	}
	.verdict {
		flex: none;
		border-radius: 999px;
		font-size: 9.5px;
		font-weight: 800;
		padding: 1px 7px;
	}
	.verdict.leaked,
	.verdict.fast {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.verdict.medium {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.verdict.strong {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop,
		.fill,
		.locked {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 16px;
		}
		.controls,
		.result,
		.goals,
		.history {
			width: 420px;
		}
		.controls :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.duel {
			width: 440px;
		}
		.switch {
			font-size: 13px;
		}
		.screen {
			font-size: 15px;
		}
		.speed {
			font-size: 11px;
		}
		.combos {
			font-size: 24px;
		}
		.time {
			font-size: 26px;
		}
		.goals li,
		.hrow {
			font-size: 12.5px;
		}
	}
</style>
