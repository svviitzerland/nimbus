<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { AiCloudMode, AiCloudText } from '$lib/chapters/ai/ai-cloud/types';
	import Server from '$lib/components/Server.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as AiCloudText);

	// The simulation. Language independent, so it lives here.
	const STEPS = [100, 1000, 10000, 50000, 100000]; // people a day
	const MSGS_PER_PERSON = 5;
	const CACHE_HIT = 0.4; // share of messages that repeat a question already answered
	const EASY = 0.7; // share of questions that are easy enough for the small model
	const CAP = { big: 20000, small: 100000 }; // messages one GPU server handles in a day
	const QUALITY: Record<AiCloudMode, number> = { big: 96, small: 71, route: 94 };
	const GOOD = 90;
	const HOUR = 2; // dollars per GPU server per hour
	const MONTH = HOUR * 24 * 30;
	const BUDGET = 12000;
	const MODES: AiCloudMode[] = ['big', 'small', 'route'];

	let step = $state(0);
	let cache = $state(false);
	let mode = $state<AiCloudMode>('big');

	const users = $derived(STEPS[step]);
	const msgs = $derived(users * MSGS_PER_PERSON);
	const cached = $derived(cache ? Math.round(msgs * CACHE_HIT) : 0);
	const toModel = $derived(msgs - cached);
	// a model needs at least one server of its own, even when hardly anyone is asking
	const racks = $derived.by(() => {
		if (mode === 'big') return { big: Math.max(1, Math.ceil(toModel / CAP.big)), small: 0 };
		if (mode === 'small') return { big: 0, small: Math.max(1, Math.ceil(toModel / CAP.small)) };
		return {
			big: Math.max(1, Math.ceil((toModel * (1 - EASY)) / CAP.big)),
			small: Math.max(1, Math.ceil((toModel * EASY) / CAP.small))
		};
	});
	const gpus = $derived(racks.big + racks.small);
	const bill = $derived(gpus * MONTH);
	const over = $derived(bill > BUDGET);
	const quality = $derived(QUALITY[mode]);
	const scaleMax = 40000; // the bill meter's full width, in dollars
	const billPct = $derived(Math.min(100, (bill / scaleMax) * 100));
	const budgetPct = (BUDGET / scaleMax) * 100;

	const num = (v: number) => new Intl.NumberFormat(tx.locale).format(v);
	const usd = (v: number) =>
		new Intl.NumberFormat(tx.locale, {
			style: 'currency',
			currency: 'USD',
			maximumFractionDigits: 0
		}).format(v);

	const said = new Set<string>();
	let completed = false;
	function once(token: string) {
		if (said.has(token)) return;
		said.add(token);
		onstate?.(token);
	}
	function check(cause: string) {
		if (step === STEPS.length - 1 && !over && quality >= GOOD) {
			if (!completed) {
				completed = true;
				onstate?.('fixed');
				oncomplete?.();
			}
			return;
		}
		if (cause === 'cache' && cache) return once('cache');
		if (cause === 'mode' && mode === 'small') return onstate?.('small');
		if (cause === 'mode' && mode === 'route') return once('route');
		if (over) return once('budget');
		if (cause === 'users' && step > 0) once('grow');
	}

	function setStep(v: number) {
		step = v;
		check('users');
	}
	function toggleCache() {
		cache = !cache;
		check('cache');
	}
	function pickMode(m: AiCloudMode) {
		if (m === mode) return;
		mode = m;
		check('mode');
	}

	// one entry per rack drawn, big model first
	const rackList = $derived([
		...Array.from({ length: racks.big }, (_, i) => ({ key: `b${i}`, big: true })),
		...Array.from({ length: racks.small }, (_, i) => ({ key: `s${i}`, big: false }))
	]);
</script>

<div class="stage">
	<!-- controls up top -->
	<div class="controls">
		<label class="slider">
			<span class="cap">{tx.usersLabel}</span>
			<input
				type="range"
				min="0"
				max={STEPS.length - 1}
				step="1"
				value={step}
				aria-valuetext={tx.usersValue.replace('{n}', num(users))}
				oninput={(e) => setStep(Number((e.currentTarget as HTMLInputElement).value))}
			/>
			<span class="users">{tx.usersValue.replace('{n}', num(users))}</span>
			<span class="sub">
				{tx.msgsValue.replace('{n}', num(msgs))}{#if cache}, {tx.cachedValue.replace(
						'{n}',
						num(cached)
					)}{/if}
			</span>
		</label>

		<div class="tricks">
			<button
				type="button"
				class="switch"
				class:on={cache}
				role="switch"
				aria-checked={cache}
				onclick={toggleCache}
			>
				<span class="knob" aria-hidden="true"></span>
				<span class="stxt"><b>{tx.cacheLabel}</b><small>{tx.cacheSub}</small></span>
			</button>

			<div class="group">
				<span class="cap">{tx.modeLabel}</span>
				<div class="seg">
					{#each MODES as m (m)}
						<button
							type="button"
							class="opt"
							class:on={mode === m}
							aria-pressed={mode === m}
							onclick={() => pickMode(m)}
						>
							<b>{tx.modes[m].name}</b>
							<small>{tx.modes[m].sub}</small>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- the rented GPU servers -->
	<div class="farm">
		<div class="farmhead">
			<span class="gtitle">{tx.gpuTitle.replace('{n}', String(gpus))}</span>
			<span class="legend">
				{#if racks.big}<span class="lg big">{tx.legendBig}</span>{/if}
				{#if racks.small}<span class="lg small">{tx.legendSmall}</span>{/if}
			</span>
		</div>
		<div class="racks">
			{#each rackList as r (r.key)}
				<div class="rack" class:big={r.big}><Server slots={2} active /></div>
			{/each}
		</div>
	</div>

	<!-- the bill against the budget, and how good the answers are -->
	<div class="meters">
		<div class="meter">
			<div class="mhead">
				<span class="cap">{tx.billLabel}</span>
				<span class="amount" class:over>{usd(bill)}</span>
			</div>
			<div class="track">
				<i class="fill" class:over style="width:{billPct}%"></i>
				<span class="mark" style="left:{budgetPct}%"></span>
			</div>
			<div class="mfoot">
				<span>{tx.budgetMark.replace('{cost}', usd(BUDGET))}</span>
				<span class="state" class:over>
					{over
						? tx.overBy.replace('{cost}', usd(bill - BUDGET))
						: tx.underBy.replace('{cost}', usd(BUDGET - bill))}
				</span>
			</div>
		</div>

		<div class="meter">
			<div class="mhead">
				<span class="cap">{tx.qualityLabel}</span>
				<span class="amount" class:over={quality < GOOD}>{quality}%</span>
			</div>
			<div class="track">
				<i class="fill q" class:over={quality < GOOD} style="width:{quality}%"></i>
				<span class="mark" style="left:{GOOD}%"></span>
			</div>
			{#if quality < GOOD}
				<div class="mfoot"><span class="state over">{tx.qualityBad}</span></div>
			{/if}
		</div>

		<p class="note">
			{tx.rentNote.replace('{hour}', usd(HOUR)).replace('{month}', usd(MONTH))}
		</p>
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}
	.cap {
		font-size: 10.5px;
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--color-faint);
	}
	.controls {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.slider {
		display: flex;
		width: 100%;
		max-width: 340px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.slider input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.users {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 700;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.sub {
		font-size: 11px;
		color: var(--color-muted);
		text-align: center;
	}
	.tricks {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.group {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.switch {
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 14px 7px 8px;
		text-align: left;
		transition: border-color 0.2s ease;
	}
	.switch.on {
		border-color: var(--color-grass);
	}
	.knob {
		position: relative;
		flex: none;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s ease;
	}
	.switch.on .knob {
		background: var(--color-grass);
	}
	.switch.on .knob::after {
		transform: translateX(14px);
	}
	.stxt {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.stxt b {
		font-size: 12.5px;
		color: var(--color-ink);
	}
	.stxt small {
		font-size: 10px;
		color: var(--color-faint);
	}
	.seg {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 4px;
		width: min(92vw, 380px);
		border-radius: 13px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.opt {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
		padding: 5px 4px;
		line-height: 1.15;
		text-align: center;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.opt b {
		font-size: 12px;
	}
	.opt small {
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.opt.on {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}

	/* GPU farm */
	.farm {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		gap: 8px;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px 12px;
	}
	.farmhead {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 4px 10px;
	}
	.gtitle {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.legend {
		display: flex;
		gap: 10px;
	}
	.lg {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 10px;
		color: var(--color-muted);
	}
	.lg::before {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 2px;
		background: var(--color-brand);
	}
	.lg.big::before {
		background: var(--color-amber);
	}
	.racks {
		display: flex;
		min-height: 34px;
		flex-wrap: wrap;
		gap: 5px;
	}
	.rack {
		animation: drop 0.3s ease backwards;
	}
	.rack > :global(.server) {
		width: 24px;
		gap: 3px;
		padding: 3px;
		border-radius: 5px;
		border-color: var(--color-brand);
		box-shadow: none;
	}
	.rack.big > :global(.server) {
		border-color: var(--color-amber);
	}
	.rack > :global(.server .slot) {
		height: 6px;
		padding: 0 2px;
		border-radius: 2px;
	}
	.rack > :global(.server .dot) {
		width: 3px;
		height: 3px;
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}

	/* meters */
	.meters {
		display: flex;
		width: min(94vw, 440px);
		flex-direction: column;
		gap: 10px;
	}
	.meter {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.mhead,
	.mfoot {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.amount {
		font-size: 15px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		color: var(--color-grass);
	}
	.amount.over {
		color: var(--color-danger);
	}
	.track {
		position: relative;
		height: 10px;
		border-radius: 5px;
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 5px;
		background: var(--color-grass);
		transition:
			width 0.4s ease,
			background 0.3s ease;
	}
	.fill.over {
		background: var(--color-danger);
	}
	.mark {
		position: absolute;
		top: -3px;
		bottom: -3px;
		width: 2px;
		margin-left: -1px;
		border-radius: 1px;
		background: var(--color-ink);
	}
	.mfoot {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.state {
		font-weight: 700;
		color: var(--color-grass);
	}
	.state.over {
		color: var(--color-danger);
	}
	.note {
		font-size: 10.5px;
		color: var(--color-faint);
		text-align: center;
	}

	@media (prefers-reduced-motion: reduce) {
		.rack {
			animation: none;
		}
		.fill,
		.knob,
		.knob::after,
		.opt,
		.switch {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.tricks {
			flex-direction: row;
			align-items: flex-end;
			gap: 14px;
		}
		.controls {
			width: min(94vw, 640px);
		}
		.rack > :global(.server) {
			width: 28px;
		}
	}
</style>
