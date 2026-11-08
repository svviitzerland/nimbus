<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';

	import type { MonitoringText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as MonitoringText);

	let surging = $state(false);
	let alarm = $state(false);
	let tick = $state(0);
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// gentle wobble so the dashboard feels alive
	$effect(() => {
		const iv = setInterval(() => (tick = tick + 1), 700);
		return () => clearInterval(iv);
	});
	const wob = $derived([0, 3, -2, 4, -3, 1][tick % 6]);
	const cpu = $derived(Math.min(96, (surging ? 88 : 34) + wob));
	const traffic = $derived(Math.min(98, (surging ? 90 : 40) + wob));
	const errs = $derived(surging ? 6 : 0);

	$effect(() => {
		if (surging && cpu > 80 && !alarm) {
			alarm = true;
			onstate?.('alarm');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		}
	});

	function surge() {
		surging = true;
	}
	function calm() {
		surging = false;
		alarm = false;
	}

	function color(v: number, danger: number) {
		return v > danger ? '#d3584a' : v > danger * 0.75 ? '#dd9e36' : '#3a9c64';
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-3">
	<!-- the dashboard, three live health numbers -->
	<div class="dash" class:ringing={alarm}>
		<div class="metric">
			<span class="mname">{tx.cpuLabel}</span>
			<span class="track"
				><i style="width:{cpu}%; background:{color(cpu, 80)}"></i><em style="left:80%"></em></span
			>
			<span class="mval" style="color:{color(cpu, 80)}">{cpu}%</span>
		</div>
		<div class="metric">
			<span class="mname">{tx.trafficLabel}</span>
			<span class="track"><i style="width:{traffic}%; background:#2e6fe0"></i></span>
			<span class="mval" style="color:#2e6fe0">{traffic}%</span>
		</div>
		<div class="metric">
			<span class="mname">{tx.errorsLabel}</span>
			<span class="track"
				><i style="width:{errs * 8}%; background:{errs ? '#d3584a' : '#3a9c64'}"></i></span
			>
			<span class="mval" style="color:{errs ? '#b8392c' : '#2f7d54'}">{errs}</span>
		</div>
		<div class="rule" class:hot={alarm}>
			<svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M12 3a6 6 0 0 0-6 6v4l-1.7 3.2c-.3.6.1 1.3.8 1.3h13.8c.7 0 1.1-.7.8-1.3L18 13V9a6 6 0 0 0-6-6ZM10 20a2 2 0 0 0 4 0"
					stroke="currentColor"
					stroke-width="1.9"
					stroke-linejoin="round"
				/>
			</svg>
			{tx.ruleLabel}
		</div>
	</div>

	<!-- the alarm reaching your pocket -->
	{#if alarm}
		<div class="notif">
			<span class="ntag">{tx.alarmTag}</span>
			{tx.notifText}
		</div>
	{:else}
		<div class="okpill"><i></i>{tx.statusOk}</div>
	{/if}

	<p class="note">{alarm ? tx.noteAlarm : tx.noteIdle}</p>

	<div class="acts">
		{#if !surging}
			<CallToActionButton onclick={surge}>
				{tx.surge}
			</CallToActionButton>
		{:else}
			<button type="button" class="line" onclick={calm}>{tx.again}</button>
		{/if}
	</div>
</div>

<style>
	.dash {
		display: flex;
		flex-direction: column;
		gap: 9px;
		width: min(94vw, 340px);
		border-radius: 16px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 14px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.06);
		transition: box-shadow 0.3s ease;
	}
	.dash.ringing {
		animation: ring 0.5s ease-in-out 4;
		box-shadow: 0 0 0 5px rgba(211, 88, 74, 0.16);
	}
	@keyframes ring {
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}
	.metric {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.mname {
		flex: none;
		width: 42px;
		font-size: 10px;
		font-weight: 800;
		color: #5e6b76;
	}
	.track {
		position: relative;
		flex: 1;
		height: 9px;
		border-radius: 999px;
		background: #f1ede5;
		overflow: hidden;
	}
	.track i {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		transition:
			width 0.6s ease,
			background 0.3s ease;
	}
	.track em {
		position: absolute;
		top: -1px;
		bottom: -1px;
		width: 2px;
		background: rgba(22, 33, 43, 0.35);
	}
	.mval {
		flex: none;
		width: 34px;
		text-align: right;
		font-size: 11px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
		transition: color 0.3s ease;
	}
	.rule {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		border: 1px solid #f1ede5;
		background: #faf9f6;
		color: #5e6b76;
		font-size: 10px;
		font-weight: 700;
		padding: 6px 9px;
		transition: all 0.25s ease;
	}
	.rule.hot {
		border-color: #eecac4;
		background: #fbeae7;
		color: #b8392c;
	}
	.notif {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 13px;
		background: #16212b;
		color: #fff;
		font-size: 11px;
		font-weight: 700;
		padding: 9px 13px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.3);
		animation: drop 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2);
	}
	.ntag {
		border-radius: 999px;
		background: #d3584a;
		font-size: 8.5px;
		font-weight: 800;
		padding: 2px 8px;
		animation: blink 0.8s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.5;
		}
	}
	@keyframes drop {
		from {
			transform: translateY(-10px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	.okpill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		font-weight: 700;
		color: #2f7d54;
	}
	.okpill i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #3a9c64;
	}
	.note {
		min-height: 1.3em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.acts {
		display: flex;
	}
	.line {
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
		padding: 11px 20px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:hover {
		border-color: #16212b;
	}
	:global(.dark) .dash {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .mname {
		color: var(--color-muted);
	}
	:global(.dark) .track {
		background: var(--color-line);
	}
	:global(.dark) .track em {
		background: rgba(255, 255, 255, 0.3);
	}
	:global(.dark) .rule {
		border-color: var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
	}
	:global(.dark) .rule.hot {
		border-color: color-mix(in srgb, var(--color-danger) 30%, transparent);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	:global(.dark) .notif {
		background: var(--color-brand);
		box-shadow: none;
	}
	:global(.dark) .okpill {
		color: var(--color-grass);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .line {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	:global(.dark) .line:hover {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.notif,
		.ntag,
		.dash.ringing {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.dash {
			width: 440px;
			padding: 18px;
			gap: 12px;
		}
		.mname {
			width: 56px;
			font-size: 12px;
		}
		.track {
			height: 11px;
		}
		.mval {
			font-size: 13px;
			width: 42px;
		}
		.rule {
			font-size: 12px;
			padding: 8px 12px;
		}
		.notif {
			font-size: 13px;
			padding: 11px 16px;
		}
		.okpill {
			font-size: 14px;
		}
		.note {
			font-size: 14px;
		}
	}
</style>
