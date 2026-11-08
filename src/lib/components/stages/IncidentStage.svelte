<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type {
		IncidentStep,
		IncidentText,
		IncidentTrap
	} from '$lib/chapters/security/incident/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as IncidentText);

	type Card = IncidentStep | IncidentTrap;
	type Health = 'ok' | 'hit' | 'cut' | 'clean' | 'back';

	const ORDER: IncidentStep[] = ['check', 'contain', 'clean', 'recover', 'learn'];
	// The cards are dealt in a fixed jumble so the right order is never the reading order.
	const DECK: Card[] = ['recover', 'hide', 'contain', 'learn', 'check', 'pay', 'clean'];
	const WRONG: Record<Card, string> = {
		check: '',
		contain: 'wrongContain',
		clean: 'wrongClean',
		recover: 'wrongRecover',
		learn: 'wrongLearn',
		pay: 'pay',
		hide: 'hide'
	};
	// Malware hops to a neighbour, so it spreads outward from the first server it hit.
	const SPREAD = [2, 3, 1, 4, 0, 5];
	const TICK = 3800;

	let phase = $state<'idle' | 'live' | 'done'>('idle');
	let servers = $state<Health[]>(['ok', 'ok', 'ok', 'ok', 'ok', 'ok']);
	let plan = $state<IncidentStep[]>([]);
	let wrongs = $state(0);
	let shake = $state<Card | null>(null);
	let completed = false;
	let ticker: ReturnType<typeof setInterval> | undefined;
	let shakeTimer: ReturnType<typeof setTimeout> | undefined;

	const hits = $derived(servers.filter((s) => s !== 'ok').length);
	const damage = $derived(Math.min(100, hits * 13 + wrongs * 7));
	const seen = $derived(plan.includes('check'));
	const contained = $derived(plan.includes('contain'));

	function spreadOne() {
		if (contained) return;
		const next = SPREAD.find((i) => servers[i] === 'ok');
		if (next !== undefined) servers[next] = 'hit';
	}

	function answer() {
		phase = 'live';
		servers[SPREAD[0]] = 'hit';
		servers[SPREAD[1]] = 'hit';
		ticker = setInterval(spreadOne, TICK);
	}

	function stopTicker() {
		if (ticker) clearInterval(ticker);
		ticker = undefined;
	}

	function pick(c: Card) {
		if (phase !== 'live') return;
		const next = ORDER[plan.length];
		if (c !== next) {
			wrongs += 1;
			spreadOne();
			shake = c;
			if (shakeTimer) clearTimeout(shakeTimer);
			shakeTimer = setTimeout(() => (shake = null), 450);
			onstate?.(WRONG[c]);
			return;
		}
		plan.push(c);
		if (c === 'contain') {
			stopTicker();
			servers = servers.map((s) => (s === 'hit' ? 'cut' : s));
		} else if (c === 'clean') {
			servers = servers.map((s) => (s === 'cut' ? 'clean' : s));
		} else if (c === 'recover') {
			servers = servers.map((s) => (s === 'clean' ? 'back' : s));
		}
		if (c === 'learn') {
			phase = 'done';
			onstate?.(good ? 'doneGood' : 'doneSlow');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		} else onstate?.(c);
	}

	const good = $derived(hits <= 3 && wrongs <= 1);

	function restart() {
		stopTicker();
		phase = 'idle';
		servers = ['ok', 'ok', 'ok', 'ok', 'ok', 'ok'];
		plan = [];
		wrongs = 0;
	}

	function label(s: Health) {
		if (s === 'hit') return tx.stateHit;
		if (s === 'cut') return tx.stateCut;
		if (s === 'clean') return tx.stateClean;
		if (s === 'back') return tx.stateBack;
		return '';
	}

	onDestroy(() => {
		stopTicker();
		if (shakeTimer) clearTimeout(shakeTimer);
	});
</script>

<div class="wrap">
	<div class="alarm" class:ringing={phase === 'live' && !contained} class:calm={phase === 'done'}>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z"
				stroke="currentColor"
				stroke-width="1.9"
				stroke-linejoin="round"
			/>
			<path d="M10 20.5a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.9" />
		</svg>
		<span class="atxt">
			<b>{tx.alarmTitle}</b>
			<span>{tx.alarmSub}</span>
		</span>
	</div>

	<div class="top">
		{#if phase === 'idle'}
			<CallToActionButton onclick={answer}>
				{tx.answerBtn}
			</CallToActionButton>
		{:else if phase === 'done'}
			<p class="result" class:good>
				{(good ? tx.resultGood : tx.resultSlow).replace('{n}', String(hits))}
			</p>
			<button type="button" class="ghost" onclick={restart}>{tx.restartBtn}</button>
		{:else}
			<p class="hint">{tx.pickHint}</p>
		{/if}
	</div>

	<!-- the six nimbus.com servers, and how far the damage has gone -->
	<div class="floor">
		<div class="flabel">
			<span>{tx.serversLabel}</span>
			<span class="dmg">
				{tx.damageLabel}
				<span class="track"><span class="fill" style="width:{damage}%"></span></span>
			</span>
		</div>
		<div class="rack">
			{#each servers as s, i (i)}
				{@const known = seen || phase === 'idle'}
				<div class="unit {known ? s : 'unknown'}">
					<Server slots={2} active={s === 'ok' || s === 'back'} />
					<span class="ulabel">{known ? label(s) : '?'}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="plan">
		<span class="plabel">{tx.planLabel}</span>
		<ol>
			{#each ORDER as _, i (i)}
				<li class:filled={!!plan[i]}>
					<span class="num">{i + 1}</span>
					{plan[i] ? tx.steps[plan[i]].name : ''}
				</li>
			{/each}
		</ol>
	</div>

	<div class="deck">
		{#each DECK as c (c)}
			{@const used = plan.includes(c as IncidentStep)}
			<button
				type="button"
				class="card"
				class:used
				class:shake={shake === c}
				class:trap={c === 'pay' || c === 'hide'}
				disabled={phase !== 'live' || used}
				onclick={() => pick(c)}
			>
				<b>{tx.steps[c].name}</b>
				<span>{tx.steps[c].sub}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		overflow-y: auto;
	}
	.alarm {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 10px;
		border-radius: 14px;
		border: 1px solid color-mix(in srgb, var(--color-danger) 40%, var(--color-line));
		background: var(--color-danger-soft);
		color: var(--color-danger);
		padding: 8px 12px;
	}
	.alarm.ringing svg {
		animation: ring 0.9s ease-in-out infinite;
	}
	.alarm.calm {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-grass);
	}
	@keyframes ring {
		20% {
			transform: rotate(-14deg);
		}
		40% {
			transform: rotate(12deg);
		}
		60% {
			transform: rotate(0);
		}
	}
	.atxt {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.atxt b {
		font-size: 13px;
		font-weight: 800;
	}
	.atxt span {
		font-size: 11px;
		color: var(--color-muted);
	}
	.top {
		display: flex;
		min-height: 46px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px 10px;
	}
	.top :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.hint {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.result {
		font-size: 12.5px;
		font-weight: 800;
		color: var(--color-amber);
	}
	.result.good {
		color: var(--color-grass);
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		padding: 7px 13px;
	}
	.ghost:hover {
		border-color: var(--color-ink);
		color: var(--color-ink);
	}

	.floor {
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 10px 10px;
	}
	.flabel {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-bottom: 7px;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.dmg {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.dmg .track {
		position: relative;
		width: 90px;
		height: 7px;
		overflow: hidden;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.dmg .fill {
		position: absolute;
		inset: 0 auto 0 0;
		background: var(--color-danger);
		transition: width 0.4s ease;
	}
	.rack {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 6px;
	}
	.unit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.unit :global(.server) {
		width: 100%;
		max-width: 46px;
		padding: 5px;
		gap: 4px;
		border-radius: 8px;
		border-width: 1.5px;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.unit :global(.server .slot) {
		height: 8px;
		padding: 0 4px;
	}
	.unit.hit :global(.server) {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.unit.unknown :global(.server) {
		border-color: var(--color-amber);
		animation: doubt 1.2s ease-in-out infinite;
	}
	.unit.cut :global(.server) {
		border-color: var(--color-faint);
		opacity: 0.6;
	}
	.unit.clean :global(.server) {
		border-color: var(--color-amber);
	}
	.unit.back :global(.server) {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	@keyframes doubt {
		50% {
			opacity: 0.55;
		}
	}
	.ulabel {
		min-height: 1.2em;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.unit.hit .ulabel {
		color: var(--color-danger);
	}
	.unit.back .ulabel {
		color: var(--color-grass);
	}
	.unit.unknown .ulabel,
	.unit.clean .ulabel {
		color: var(--color-amber);
	}

	.plan {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.plabel {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.plan ol {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.plan li {
		display: flex;
		min-width: 58px;
		min-height: 30px;
		flex: 1 1 auto;
		align-items: center;
		gap: 4px;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 5px;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.plan li.filled {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.num {
		display: grid;
		flex: none;
		place-items: center;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: var(--color-paper);
		color: var(--color-faint);
		font-size: 9px;
	}
	.filled .num {
		background: var(--color-grass);
		color: #fff;
	}

	.deck {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
		text-align: left;
		transition:
			border-color 0.2s,
			opacity 0.2s,
			transform 0.15s;
	}
	.card:enabled:hover {
		border-color: var(--color-brand);
	}
	.card:enabled:active {
		transform: translateY(1px);
	}
	.card b {
		font-size: 12.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.card span {
		font-size: 10.5px;
		line-height: 1.3;
		color: var(--color-muted);
	}
	.card:disabled {
		opacity: 0.5;
	}
	.card.used {
		opacity: 0.3;
	}
	.card.shake {
		border-color: var(--color-danger);
		animation: shake 0.4s ease;
	}
	@keyframes shake {
		25% {
			transform: translateX(-4px);
		}
		50% {
			transform: translateX(4px);
		}
		75% {
			transform: translateX(-2px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.alarm.ringing svg,
		.unit.unknown :global(.server),
		.card.shake {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
		}
		.card b {
			font-size: 13.5px;
		}
		.card span {
			font-size: 11.5px;
		}
		.plan li {
			font-size: 11px;
		}
	}
</style>
