<!--
	What is DDoS. A pretend botnet floods nimbus.com, the learner grows the botnet with a slider
	and switches on a rate limit and a CDN shield until real visitors get in even at its biggest.
	All numbers are a small made up model, nothing is sent anywhere.
-->
<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DdosText } from '$lib/chapters/security/ddos/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DdosText);

	// The tiny model. Every bot fires 100 requests a second, or 5 once rate limited.
	// Real visitors add 200. The lone server copes with 1,000, the CDN edge with 100,000.
	const SIZES = [10, 100, 1000, 10000];
	const REAL = 200;
	const ORIGIN = 1000;
	const EDGE = 100000;

	let sizeIdx = $state(1);
	let flooding = $state(false);
	let rate = $state(false);
	let cdn = $state(false);
	let completed = false;

	const bots = $derived(SIZES[sizeIdx]);
	const total = $derived(flooding ? bots * (rate ? 5 : 100) + REAL : REAL);
	const served = $derived(Math.min(100, Math.round(((cdn ? EDGE : ORIGIN) / total) * 100)));
	const status = $derived<'up' | 'slow' | 'down'>(
		served >= 90 ? 'up' : served >= 40 ? 'slow' : 'down'
	);
	const fmt = (n: number) => n.toLocaleString(tx.numberLocale);

	function react(kind: 'start' | 'rate' | 'cdn' | 'size') {
		if (!flooding) return;
		if (sizeIdx === SIZES.length - 1 && rate && cdn) {
			onstate?.('saved');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
			return;
		}
		const up = status === 'up';
		if (kind === 'start') onstate?.(up ? 'holding' : 'flood');
		else if (kind === 'rate' && rate) onstate?.(up ? 'rateWin' : 'rateLose');
		else if (kind === 'cdn' && cdn) onstate?.(up ? 'cdnWin' : 'cdnLose');
		else onstate?.(up ? 'holding' : 'down');
	}

	function toggleFlood() {
		flooding = !flooding;
		if (flooding) react('start');
	}
	function toggleRate() {
		rate = !rate;
		react('rate');
	}
	function toggleCdn() {
		cdn = !cdn;
		react('cdn');
	}
	function setSize(i: number) {
		if (i === sizeIdx) return;
		sizeIdx = i;
		react('size');
	}

	// Dots in the lane, placed by a fixed pattern so the server and browser agree.
	const REDS = Array.from({ length: 14 }, (_, i) => ({
		x: 8 + ((i * 37) % 84),
		delay: -((i * 0.53) % 1.6),
		dur: 1.3 + ((i * 7) % 5) * 0.12
	}));
	const GREENS = [
		{ x: 16, delay: -0.2 },
		{ x: 50, delay: -0.9 },
		{ x: 82, delay: -1.5 }
	];
	const redCount = $derived(flooding ? [3, 6, 10, 14][sizeIdx] : 0);
</script>

{#snippet phone()}
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="7" y="3" width="10" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8" />
		<path d="M11 18h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
	</svg>
{/snippet}
{#snippet bot(i: number)}
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		{#if i % 2 === 0}
			<!-- a security camera -->
			<rect x="3" y="7" width="13" height="8" rx="2" stroke="currentColor" stroke-width="1.8" />
			<path d="M16 9.5l5-2.5v8l-5-2.5" stroke="currentColor" stroke-width="1.8" />
			<path d="M8 15v4H5" stroke="currentColor" stroke-width="1.8" />
		{:else}
			<!-- a home router -->
			<rect x="3" y="12" width="18" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
			<path d="M7 12V6M17 12V6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
			<circle cx="7.5" cy="15.5" r="1" fill="currentColor" />
		{/if}
	</svg>
{/snippet}

<div class="wrap">
	<!-- controls up top -->
	<div class="btns">
		{#if flooding}
			<button type="button" class="ghost" onclick={toggleFlood}>{tx.stopBtn}</button>
		{:else}
			<CallToActionButton onclick={toggleFlood}>
				{tx.startBtn}
			</CallToActionButton>
		{/if}
	</div>
	<div class="toggles">
		<button
			type="button"
			class="switch"
			class:on={rate}
			role="switch"
			aria-checked={rate}
			onclick={toggleRate}
		>
			<span class="knob"></span>{tx.rateToggle}<span class="sstate">{rate ? tx.on : tx.off}</span>
		</button>
		<button
			type="button"
			class="switch"
			class:on={cdn}
			role="switch"
			aria-checked={cdn}
			onclick={toggleCdn}
		>
			<span class="knob"></span>{tx.cdnToggle}<span class="sstate">{cdn ? tx.on : tx.off}</span>
		</button>
	</div>
	<label class="slider">
		<span class="slabel">{tx.sizeLabel}</span>
		<input
			type="range"
			min="0"
			max={SIZES.length - 1}
			step="1"
			value={sizeIdx}
			oninput={(e) => setSize(Number(e.currentTarget.value))}
			aria-valuetext={tx.botsLabel.replace('{n}', fmt(bots))}
		/>
		<span class="ticks">
			{#each SIZES as s, i (s)}<span class:on={i === sizeIdx}>{fmt(s)}</span>{/each}
		</span>
	</label>

	<!-- who is knocking -->
	<div class="sources">
		<div class="group real">
			<span class="icons">{@render phone()}{@render phone()}{@render phone()}</span>
			<span class="glabel">{tx.visitorsLabel}</span>
		</div>
		<div class="group bots" class:idle={!flooding}>
			<span class="icons">{@render bot(0)}{@render bot(1)}{@render bot(2)}{@render bot(3)}</span>
			<span class="glabel">{tx.botsLabel.replace('{n}', fmt(bots))}</span>
		</div>
	</div>

	<!-- the road down to the server -->
	<div class="lane" class:shielded={cdn}>
		{#each GREENS as g, i (i)}
			<span
				class="dot green"
				class:turned={status === 'down'}
				style="left:{g.x}%; animation-delay:{g.delay}s"
			></span>
		{/each}
		{#each REDS.slice(0, redCount) as r, i (i)}
			<span
				class="dot red"
				class:thin={rate}
				class:short={cdn}
				style="left:{r.x}%; animation-delay:{r.delay}s; animation-duration:{r.dur}s"
			></span>
		{/each}
		{#if cdn}
			<div class="shield pop">
				<span>{tx.cdnLabel}</span>
			</div>
		{/if}
	</div>

	<!-- the server and how it is doing -->
	<div class="target">
		<Server slots={3} active={status !== 'down'} />
		<div class="readout">
			<p class="sname">
				{tx.serverLabel}
				<span class="chip {status}">{tx.states[status]}</span>
			</p>
			{#if flooding}
				<p class="rps">{tx.rps.replace('{n}', fmt(total))}</p>
				<p class="served">{tx.served.replace('{n}', String(served))}</p>
			{:else}
				<p class="served">{tx.calm}</p>
			{/if}
			<div class="meter">
				<span class="fill {status}" style="width:{served}%"></span>
			</div>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 360px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.btns {
		display: flex;
		min-height: 44px;
		align-items: center;
		justify-content: center;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		padding: 8px 14px;
	}
	.ghost:hover {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.toggles {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 11px 4px 4px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		transition: border-color 0.2s;
	}
	.knob {
		position: relative;
		width: 30px;
		height: 18px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.knob::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		transition: transform 0.2s;
	}
	.switch.on {
		border-color: var(--color-grass);
	}
	.switch.on .knob {
		background: var(--color-grass);
	}
	.switch.on .knob::after {
		transform: translateX(12px);
	}
	.sstate {
		font-size: 10px;
		color: var(--color-faint);
	}
	.switch.on .sstate {
		color: var(--color-grass);
	}
	.slider {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 2px;
	}
	.slabel {
		text-align: center;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.slider input {
		width: 100%;
		accent-color: var(--color-danger);
	}
	.ticks {
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.ticks .on {
		color: var(--color-danger);
		font-weight: 800;
	}
	.sources {
		display: flex;
		width: 100%;
		justify-content: space-between;
		gap: 8px;
	}
	.group {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 4px;
		transition: opacity 0.3s;
	}
	.group .icons {
		display: flex;
		gap: 2px;
	}
	.real .icons {
		color: var(--color-grass);
	}
	.bots .icons {
		color: var(--color-danger);
	}
	.bots.idle {
		opacity: 0.45;
	}
	.glabel {
		text-align: center;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.lane {
		position: relative;
		width: 100%;
		height: 110px;
		overflow: hidden;
		border-radius: 12px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.dot {
		position: absolute;
		top: -8px;
		width: 8px;
		height: 8px;
		margin-left: -4px;
		border-radius: 50%;
		animation: fall 1.6s linear infinite;
	}
	.green {
		background: var(--color-grass);
		z-index: 1;
		transition: opacity 0.3s;
	}
	.green.turned {
		animation-name: turned;
	}
	.red {
		background: var(--color-danger);
	}
	.red.thin {
		width: 5px;
		height: 5px;
		margin-left: -2.5px;
		opacity: 0.55;
	}
	.red.short {
		animation-name: blocked;
	}
	@keyframes fall {
		to {
			transform: translateY(124px);
		}
	}
	@keyframes blocked {
		70% {
			transform: translateY(44px);
			opacity: 1;
		}
		to {
			transform: translateY(48px);
			opacity: 0;
		}
	}
	@keyframes turned {
		70% {
			transform: translateY(96px);
			opacity: 1;
		}
		to {
			transform: translateY(70px);
			opacity: 0;
		}
	}
	.shield {
		position: absolute;
		left: 6px;
		right: 6px;
		top: 42px;
		display: flex;
		height: 18px;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		background: var(--color-brand-soft);
		border: 1px solid var(--color-brand);
	}
	.shield span {
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.target {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 12px;
	}
	.target :global(.server) {
		flex: none;
		width: 70px;
	}
	.readout {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 3px;
	}
	.sname {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.chip {
		border-radius: 999px;
		padding: 1px 8px;
		font-size: 10px;
		font-weight: 800;
	}
	.chip.up {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.chip.slow {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.chip.down {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.rps,
	.served {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.meter {
		height: 7px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		transition: width 0.4s ease;
	}
	.fill.up {
		background: var(--color-grass);
	}
	.fill.slow {
		background: var(--color-amber);
	}
	.fill.down {
		background: var(--color-danger);
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.95);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
			top: 30%;
		}
		.red.short {
			top: 15%;
		}
		.green.turned {
			opacity: 0.25;
		}
		.pop {
			animation-duration: 0.01s;
		}
		.fill,
		.knob,
		.knob::after {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 420px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.glabel {
			font-size: 11px;
		}
	}
</style>
