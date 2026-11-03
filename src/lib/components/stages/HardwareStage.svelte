<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { HardwareText } from '$lib/chapters/basics/hardware/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as HardwareText);

	// stored: the game only lives in storage. loading: it travels into RAM.
	// loaded: it sits in RAM. running: the CPU plays it. off: the plug is pulled.
	// back: power returned, RAM starts empty again.
	type Phase = 'stored' | 'loading' | 'loaded' | 'running' | 'off' | 'back';
	let phase = $state<Phase>('stored');
	let steps = $state(0);
	let done = false;
	let loadTimer: ReturnType<typeof setTimeout> | undefined;
	let stepTimer: ReturnType<typeof setInterval> | undefined;

	const powered = $derived(phase !== 'off');
	const inRam = $derived(phase === 'loading' || phase === 'loaded' || phase === 'running');
	const cpuState = $derived(
		phase === 'off' ? tx.cpuOff : phase === 'running' ? tx.cpuBusy : tx.cpuIdle
	);
	const note = $derived(
		{
			stored: tx.notes.idle,
			loading: tx.notes.loading,
			loaded: tx.notes.loaded,
			running: tx.notes.running,
			off: tx.notes.off,
			back: tx.notes.back
		}[phase]
	);
	const stepText = $derived(tx.steps.replace('{n}', steps.toLocaleString(tx.locale)));

	function stopSteps() {
		clearInterval(stepTimer);
		stepTimer = undefined;
	}

	function act() {
		if (phase === 'stored' || phase === 'back') {
			phase = 'loading';
			clearTimeout(loadTimer);
			loadTimer = setTimeout(() => {
				phase = 'loaded';
				onstate?.('load');
			}, 1500);
		} else if (phase === 'loaded') {
			phase = 'running';
			steps = 0;
			onstate?.('run');
			// three billion steps a second, counted in tenths of a second
			stepTimer = setInterval(() => (steps += 300_000_000), 100);
		} else if (phase === 'running') {
			stopSteps();
			phase = 'off';
			onstate?.('unplug');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		} else if (phase === 'off') {
			phase = 'back';
			steps = 0;
			onstate?.('power');
		}
	}

	const btn = $derived(
		phase === 'loaded'
			? tx.runBtn
			: phase === 'running'
				? tx.unplugBtn
				: phase === 'off'
					? tx.powerBtn
					: tx.loadBtn
	);

	onDestroy(() => {
		clearTimeout(loadTimer);
		stopSteps();
	});
</script>

{#snippet gameChip(tag: string)}
	<span class="game">
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="2.5" y="7" width="19" height="11" rx="5" stroke="currentColor" stroke-width="2" />
			<path
				d="M7.5 10.5v4M5.5 12.5h4"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<circle cx="16" cy="11.3" r="1.2" fill="currentColor" />
			<circle cx="17.6" cy="14" r="1.2" fill="currentColor" />
		</svg>
		{tx.gameName}
		{#if tag}<em>{tag}</em>{/if}
	</span>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<button type="button" class="cta" onclick={act} disabled={phase === 'loading'}>{btn}</button>
	<p class="note">{note}</p>

	<div class="box" class:off={!powered}>
		<!-- the power cord and its light -->
		<div class="power">
			<span class="plug" class:pulled={!powered}>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0ZM12 17v4"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
			<span class="led" class:on={powered}></span>
			<span class="ptext">{powered ? tx.powerOn : tx.powerOff}</span>
		</div>

		<!-- CPU, the cook -->
		<div class="part cpu" class:busy={phase === 'running'}>
			<span class="icon">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="6"
						y="6"
						width="12"
						height="12"
						rx="2.5"
						stroke="currentColor"
						stroke-width="2"
					/>
					<rect x="9.5" y="9.5" width="5" height="5" rx="1" fill="currentColor" />
					<path
						d="M9 2.5v2.5M15 2.5v2.5M9 19v2.5M15 19v2.5M2.5 9h2.5M2.5 15h2.5M19 9h2.5M19 15h2.5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</span>
			<span class="names"><b>{tx.cpu.label}</b><span>{tx.cpu.sub}</span></span>
			<span class="spec">{tx.cpu.spec}</span>
			<div class="slot">
				<span class="state" class:hot={phase === 'running'}>{cpuState}</span>
				{#if phase === 'running'}
					<span class="count">{stepText}</span>
				{/if}
			</div>
		</div>

		<div class="flow" class:live={phase === 'running'}><i></i></div>

		<!-- RAM, the desk -->
		<div class="part ram" class:wiped={!powered}>
			<span class="icon">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="2.5"
						y="7"
						width="19"
						height="9"
						rx="1.5"
						stroke="currentColor"
						stroke-width="2"
					/>
					<path
						d="M6.5 10v3M10 10v3M14 10v3M17.5 10v3M5 16v2.5M19 16v2.5"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
					/>
				</svg>
			</span>
			<span class="names"><b>{tx.ram.label}</b><span>{tx.ram.sub}</span></span>
			<span class="spec">{tx.ram.spec}</span>
			<div class="slot">
				{#if inRam}
					<span class="arrive" class:loading={phase === 'loading'}>
						{@render gameChip(phase === 'loading' ? tx.loadingTag : '')}
						{#if phase === 'loading'}<span class="bar"><i></i></span>{/if}
					</span>
				{:else}
					<span class="empty">{tx.ramEmpty}</span>
				{/if}
			</div>
		</div>

		<div class="flow" class:live={phase === 'loading'}><i></i></div>

		<!-- storage, the cupboard -->
		<div class="part disk" class:kept={!powered}>
			<span class="icon">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="3"
						y="4"
						width="18"
						height="16"
						rx="2.5"
						stroke="currentColor"
						stroke-width="2"
					/>
					<path d="M3 13h18" stroke="currentColor" stroke-width="2" />
					<circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" />
				</svg>
			</span>
			<span class="names"><b>{tx.storage.label}</b><span>{tx.storage.sub}</span></span>
			<span class="spec">{tx.storage.spec}</span>
			<div class="slot files">
				{@render gameChip(!powered ? tx.keptTag : '')}
				{#each tx.otherFiles as f (f)}
					<span class="file">{f}</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 11px 20px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.5;
	}
	.note {
		min-height: 2.6em;
		max-width: 320px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	/* the opened laptop body holding the three parts */
	.box {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		width: min(92vw, 340px);
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 10px 12px 12px;
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.08);
		transition: background 0.4s ease;
	}
	.power {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 8px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.plug {
		display: inline-flex;
		color: var(--color-muted);
		transition:
			transform 0.4s ease,
			opacity 0.4s ease;
	}
	.plug.pulled {
		transform: translateY(-6px) rotate(-18deg);
		opacity: 0.45;
	}
	.led {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.led.on {
		background: var(--color-grass);
		box-shadow: 0 0 0 3px var(--color-grass-soft);
	}

	.part {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		column-gap: 9px;
		row-gap: 7px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 11px;
		transition:
			border-color 0.3s ease,
			opacity 0.4s ease;
	}
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 10px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.ram .icon {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.disk .icon {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.names {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
		min-width: 0;
	}
	.names b {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.names span {
		font-size: 10px;
		color: var(--color-faint);
	}
	.spec {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		padding: 2px 8px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.slot {
		grid-column: 1 / -1;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		min-height: 30px;
		border-radius: 9px;
		background: var(--color-paper);
		padding: 5px 7px;
	}

	.cpu.busy {
		border-color: var(--color-brand);
	}
	.cpu.busy .icon {
		animation: think 0.6s ease-in-out infinite;
	}
	@keyframes think {
		50% {
			transform: scale(1.1);
		}
	}
	.state {
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 2px 9px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.state.hot {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.count {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}

	.game {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 8px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand-soft);
		padding: 3px 8px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-brand);
		white-space: nowrap;
	}
	.game em {
		font-style: normal;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.arrive {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		animation: rise 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	.arrive.loading .game {
		opacity: 0.7;
	}
	@keyframes rise {
		from {
			transform: translateY(26px);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	.bar {
		position: relative;
		width: 60px;
		height: 6px;
		border-radius: 999px;
		background: var(--color-line);
		overflow: hidden;
	}
	.bar i {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: var(--color-grass);
		animation: fill 1.5s linear forwards;
	}
	@keyframes fill {
		from {
			width: 0;
		}
		to {
			width: 100%;
		}
	}
	.empty {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.ram.wiped .slot {
		animation: wipe 0.5s ease;
	}
	@keyframes wipe {
		0% {
			background: var(--color-danger-soft);
		}
		100% {
			background: var(--color-paper);
		}
	}
	.file {
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 8px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.disk.kept {
		border-color: var(--color-amber);
	}

	/* the short lane between two parts, lit while data moves upward */
	.flow {
		position: relative;
		align-self: center;
		width: 4px;
		height: 18px;
		margin: 2px 0;
		border-radius: 2px;
		background: var(--color-line);
		overflow: hidden;
	}
	.flow i {
		position: absolute;
		left: 0;
		right: 0;
		height: 8px;
		border-radius: 2px;
		background: var(--color-brand);
		opacity: 0;
	}
	.flow.live i {
		opacity: 1;
		animation: up 0.5s linear infinite;
	}
	@keyframes up {
		from {
			top: 100%;
		}
		to {
			top: -8px;
		}
	}

	/* no power, the box dims, CPU and RAM go dark, storage stays lit */
	.box.off .cpu,
	.box.off .ram {
		opacity: 0.5;
	}

	:global(.dark) .cta {
		color: var(--color-ink);
		box-shadow: none;
	}
	:global(.dark) .box {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.arrive,
		.cpu.busy .icon,
		.flow.live i,
		.ram.wiped .slot {
			animation: none;
		}
		.flow.live i {
			opacity: 1;
			top: 5px;
		}
		.plug {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.box {
			width: 400px;
			padding: 12px 14px 14px;
		}
		.names b {
			font-size: 14.5px;
		}
		.names span {
			font-size: 11.5px;
		}
		.spec,
		.state,
		.count {
			font-size: 11.5px;
		}
		.game,
		.file {
			font-size: 12px;
		}
		.note {
			font-size: 14px;
			max-width: 420px;
		}
		.cta {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
