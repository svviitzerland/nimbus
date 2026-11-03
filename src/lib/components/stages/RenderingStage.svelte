<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Browser from '$lib/components/Browser.svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { RenderingText, RenderMode } from '$lib/chapters/web/rendering/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as RenderingText);

	type StepKey = keyof RenderingText['steps'];
	type Phone = 'idle' | 'loading' | 'loaded';
	type Packet = { dir: 'up' | 'down'; label: string; dur: number } | null;
	type Ev = {
		t: number;
		step: StepKey;
		phone: Phone;
		busy?: boolean;
		packet?: Packet;
		paint?: boolean;
	};

	// Each timeline is in seconds on a slow phone. A fast phone runs the same steps quicker.
	const PLANS: Record<RenderMode, Ev[]> = {
		csr: [
			{ t: 0, step: 'ask', phone: 'idle', packet: { dir: 'up', label: 'GET', dur: 0.4 } },
			{
				t: 0.4,
				step: 'emptyHtml',
				phone: 'idle',
				packet: { dir: 'down', label: 'HTML', dur: 0.4 }
			},
			{
				t: 0.8,
				step: 'downloadJs',
				phone: 'loading',
				packet: { dir: 'down', label: 'JS', dur: 2 }
			},
			{ t: 2.8, step: 'jsBuilds', phone: 'loading' },
			{ t: 3.6, step: 'ready', phone: 'loaded', paint: true }
		],
		ssr: [
			{ t: 0, step: 'ask', phone: 'idle', packet: { dir: 'up', label: 'GET', dur: 0.4 } },
			{ t: 0.4, step: 'serverBuilds', phone: 'idle', busy: true },
			{ t: 1.1, step: 'fullHtml', phone: 'idle', packet: { dir: 'down', label: 'HTML', dur: 0.5 } },
			{ t: 1.6, step: 'hydrate', phone: 'loaded', paint: true },
			{ t: 2.4, step: 'ready', phone: 'loaded' }
		],
		ssg: [
			{ t: 0, step: 'ask', phone: 'idle', packet: { dir: 'up', label: 'GET', dur: 0.25 } },
			{
				t: 0.25,
				step: 'prebuilt',
				phone: 'idle',
				packet: { dir: 'down', label: 'HTML', dur: 0.3 }
			},
			{ t: 0.55, step: 'ready', phone: 'loaded', paint: true }
		]
	};
	const ORDER: RenderMode[] = ['csr', 'ssr', 'ssg'];

	let slow = $state(true);
	let playing = $state<RenderMode | null>(null);
	let shown = $state<RenderMode | null>(null);
	let step = $state<StepKey | null>(null);
	let phone = $state<Phone>('idle');
	let busy = $state(false);
	let packet = $state<Packet>(null);
	let packetKey = $state(0);
	let clock = $state(0);
	let scores = $state<Record<RenderMode, number | null>>({ csr: null, ssr: null, ssg: null });
	let lastSlow = $state<Record<RenderMode, boolean>>({ csr: true, ssr: true, ssg: true });

	const tried = new SvelteSet<RenderMode>();
	let saidAll = false;
	let saidFast = false;
	let finished = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let ticker: ReturnType<typeof setInterval> | undefined;

	function stop() {
		timers.forEach(clearTimeout);
		timers = [];
		if (ticker) clearInterval(ticker);
		ticker = undefined;
	}

	function play(mode: RenderMode) {
		stop();
		const k = slow ? 1 : 0.35;
		const plan = PLANS[mode];
		const end = plan[plan.length - 1].t * k;
		const wasSlow = slow;
		playing = mode;
		shown = mode;
		clock = 0;
		const started = Date.now();
		ticker = setInterval(() => {
			clock = Math.min(end, (Date.now() - started) / 1000);
		}, 50);
		for (const ev of plan) {
			timers.push(
				setTimeout(
					() => {
						step = ev.step;
						phone = ev.phone;
						busy = !!ev.busy;
						if (ev.packet) {
							packet = { ...ev.packet, dur: ev.packet.dur * k };
							packetKey += 1;
						} else packet = null;
						if (ev.paint) {
							scores[mode] = Math.round(ev.t * k * 10) / 10;
							lastSlow[mode] = wasSlow;
						}
					},
					ev.t * k * 1000
				)
			);
		}
		timers.push(
			setTimeout(
				() => {
					stop();
					clock = end;
					playing = null;
					packet = null;
					busy = false;
					finishRun(mode, wasSlow);
				},
				end * 1000 + 250
			)
		);
	}

	function finishRun(mode: RenderMode, wasSlow: boolean) {
		const firstTry = !tried.has(mode);
		tried.add(mode);
		if (!wasSlow && !saidFast) {
			saidFast = true;
			onstate?.('fast');
		} else onstate?.(mode);
		if (firstTry && tried.size === ORDER.length && !finished) {
			finished = true;
			oncomplete?.();
		}
		// Once all three are on the board, Nim points at the scoreboard after a moment.
		if (tried.size === ORDER.length && !saidAll) {
			timers.push(
				setTimeout(() => {
					saidAll = true;
					onstate?.('all');
				}, 5000)
			);
		}
	}

	const fmt = (s: number) => tx.firstPaint.replace('{s}', s.toFixed(1));
	const maxScore = 3.6;

	onDestroy(stop);
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<div class="modes">
		{#each ORDER as m (m)}
			<button
				type="button"
				class="mode"
				class:on={shown === m}
				disabled={playing !== null}
				onclick={() => play(m)}
			>
				<b>{tx.modes[m].label}</b>
				<span>{tx.modes[m].sub}</span>
			</button>
		{/each}
	</div>

	<label class="switch">
		<input type="checkbox" bind:checked={slow} disabled={playing !== null} />
		<span class="track"><span class="knob"></span></span>
		{tx.slow}
	</label>

	<div class="scene">
		<div class="actor">
			<div class="phonewrap"><Browser phase={phone} /></div>
			<span class="alabel">{tx.youLabel}</span>
			<span class="clock" class:run={playing !== null}>{fmt(clock)}</span>
		</div>

		<div class="wire">
			<span class="line"></span>
			{#if packet}
				{#key packetKey}
					<span
						class="pkt"
						class:down={packet.dir === 'down'}
						class:js={packet.label === 'JS'}
						style="animation-duration:{packet.dur}s">{packet.label}</span
					>
				{/key}
			{/if}
		</div>

		<div class="actor">
			<Server active={busy || (playing !== null && step === 'prebuilt')} />
			<span class="alabel">{tx.serverLabel}</span>
			{#if shown === 'ssg'}
				<span class="shelf"><i></i><i></i><i></i>{tx.shelfLabel}</span>
			{/if}
		</div>
	</div>

	<p class="caption">{step ? tx.steps[step] : tx.idle}</p>

	<div class="score">
		<b>{tx.scoreLabel}</b>
		{#each ORDER as m (m)}
			<div class="srow">
				<span class="sl">{tx.modes[m].label}</span>
				<span class="sbar">
					{#if scores[m] !== null}
						<i class={m} style="width:{Math.max(4, ((scores[m] ?? 0) / maxScore) * 100)}%"></i>
					{/if}
				</span>
				<span class="sv">
					{#if scores[m] !== null}
						{fmt(scores[m] ?? 0)}{#if !lastSlow[m]}<em>{tx.fastTag}</em>{/if}
					{:else}
						{tx.notYet}
					{/if}
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.modes {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
		width: min(94vw, 400px);
	}
	.mode {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 8px 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.mode b {
		font-size: 14px;
	}
	.mode span {
		font-size: 10.5px;
		line-height: 1.25;
		color: var(--color-muted);
		text-align: center;
	}
	.mode:enabled:hover {
		border-color: var(--color-brand);
	}
	.mode.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.mode:disabled {
		opacity: 0.6;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		cursor: pointer;
	}
	.switch input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
	}
	.track {
		position: relative;
		width: 32px;
		height: 18px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(22, 40, 60, 0.2);
		transition: transform 0.2s ease;
	}
	.switch input:checked + .track {
		background: var(--color-amber);
	}
	.switch input:checked + .track .knob {
		transform: translateX(14px);
	}
	.switch input:focus-visible + .track {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	.scene {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		width: min(94vw, 400px);
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		min-width: 0;
	}
	.phonewrap {
		width: 140px;
	}
	.phonewrap :global(.phone) {
		width: 140px;
	}
	.phonewrap :global(.screen) {
		height: 190px;
	}
	.alabel {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.clock {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		font-variant-numeric: tabular-nums;
	}
	.clock.run {
		color: var(--color-amber);
	}
	.shelf {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		max-width: 110px;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-grass);
		text-align: center;
	}
	.shelf i {
		width: 7px;
		height: 9px;
		border-radius: 2px;
		background: var(--color-grass-soft);
		border: 1px solid var(--color-grass);
	}
	.wire {
		position: relative;
		flex: 1;
		min-width: 50px;
		max-width: 110px;
		height: 30px;
		align-self: center;
		margin-bottom: 40px;
	}
	.line {
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 2px;
		background: var(--color-line);
		border-radius: 1px;
	}
	.pkt {
		position: absolute;
		top: 50%;
		left: 0;
		padding: 2px 6px;
		border-radius: 6px;
		background: var(--color-brand);
		color: #fff;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		transform: translate(0, -50%);
		animation-name: up;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
	.pkt.down {
		animation-name: down;
	}
	.pkt.js {
		background: var(--color-amber);
		padding: 4px 12px;
	}
	@keyframes up {
		from {
			left: 0;
			transform: translate(0, -50%);
		}
		to {
			left: 100%;
			transform: translate(-100%, -50%);
		}
	}
	@keyframes down {
		from {
			left: 100%;
			transform: translate(-100%, -50%);
		}
		to {
			left: 0;
			transform: translate(0, -50%);
		}
	}
	.caption {
		margin: 0;
		min-height: 1.4em;
		max-width: min(94vw, 400px);
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.score {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: min(94vw, 400px);
		padding: 9px 12px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.score b {
		font-size: 11px;
		color: var(--color-faint);
	}
	.srow {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 11.5px;
	}
	.sl {
		width: 32px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.sbar {
		flex: 1;
		height: 8px;
		border-radius: 4px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.sbar i {
		display: block;
		height: 100%;
		border-radius: 4px;
		transition: width 0.4s ease;
	}
	.sbar i.csr {
		background: var(--color-danger);
	}
	.sbar i.ssr {
		background: var(--color-amber);
	}
	.sbar i.ssg {
		background: var(--color-grass);
	}
	.sv {
		min-width: 70px;
		text-align: right;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.sv em {
		display: block;
		font-style: normal;
		font-size: 9.5px;
		color: var(--color-amber);
	}
	@media (prefers-reduced-motion: reduce) {
		.pkt {
			animation: none;
			left: 50%;
			transform: translate(-50%, -50%);
		}
		.mode,
		.track,
		.knob,
		.sbar i {
			transition: none;
		}
	}
</style>
