<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import Server from '$lib/components/Server.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';

	import type { ServerlessText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate,
		beat = 0,
		onshow
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		beat?: number;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as ServerlessText);

	// the architecture narrates along with Nim, one view per beat
	const lastBeat = $derived(beat >= tx.intro.length - 1);
	const view = $derived(
		lastBeat ? 'demo' : (['always', 'flow', 'sandbox'][Math.min(beat, 2)] as string)
	);
	$effect(() => {
		void beat;
		onshow?.(true);
	});

	// a packet rides the flow over and over while Nim explains it
	let hop = $state(-1);
	$effect(() => {
		if (view !== 'flow' && view !== 'sandbox') {
			hop = -1;
			return;
		}
		hop = 0;
		const iv = setInterval(() => (hop = (hop + 1) % 6), 850);
		return () => clearInterval(iv);
	});

	// the hands-on bit, only on the final beat
	let fnState = $state<'sleep' | 'wake' | 'run'>('sleep');
	let resFly = $state(false);
	let calls = $state(0);
	let zeroSeen = false;
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function call() {
		if (fnState !== 'sleep') return;
		fnState = 'wake';
		timers.push(setTimeout(() => (fnState = 'run'), 350));
		timers.push(
			setTimeout(() => {
				resFly = true;
				timers.push(setTimeout(() => (resFly = false), 600));
				fnState = 'sleep';
				calls += 1;
				if (calls === 1) onstate?.('invoked');
				else if (!zeroSeen) {
					zeroSeen = true;
					onstate?.('zero');
				}
				if (calls >= 2 && !done) {
					done = true;
					oncomplete?.();
				}
			}, 1500)
		);
	}
	const note = $derived(
		!lastBeat ? ' ' : fnState !== 'sleep' ? tx.noteRun : calls > 0 ? tx.noteZero : tx.noteIdle
	);
	const phonePhase = $derived(fnState !== 'sleep' ? 'loading' : calls > 0 ? 'loaded' : 'idle') as
		| 'idle'
		| 'loading'
		| 'loaded';

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet stepIcon(i: number)}
	{#if i === 0}
		<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" stroke-width="1.9" />
			<path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" />
		</svg>
	{:else if i === 1}
		<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M4 21V7l8-4 8 4v14M4 12h16M10 21v-5h4v5"
				stroke="currentColor"
				stroke-width="1.9"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if i === 2}
		<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<rect
				x="4"
				y="4"
				width="16"
				height="16"
				rx="3"
				stroke="currentColor"
				stroke-width="1.9"
				stroke-dasharray="none"
			/>
			<circle cx="12" cy="12" r="2.2" fill="currentColor" />
		</svg>
	{:else if i === 3}
		<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M11 3 5 13h5l-2 8 7-11h-5l3-7Z"
				stroke="currentColor"
				stroke-width="1.9"
				stroke-linejoin="round"
			/>
		</svg>
	{:else}
		<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.9" />
			<path d="M8.5 12h7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" />
		</svg>
	{/if}
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="panel">
		{#key view}
			{#if view === 'always'}
				<!-- the wasteful way, a server on around the clock -->
				<div class="always">
					<div class="srvwrap">
						<Server />
					</div>
					<b>{tx.alwaysName}</b>
					<span class="meter24"><i></i>{tx.alwaysTag}</span>
				</div>
			{:else if view === 'flow' || view === 'sandbox'}
				<!-- the serverless flow, five stops, a request riding it on loop -->
				<div class="flow">
					<div class="frail"></div>
					{#if hop >= 0 && hop < 5}
						<span class="fpkt" style="left:calc(8% + {hop} * 21%)"></span>
					{/if}
					<div class="steps">
						{#each tx.archSteps as s, i (s)}
							{@const on = hop === i}
							<div
								class="step"
								class:on
								style="--c:{i === 2 ? '#dd9e36' : i === 3 ? '#3a9c64' : '#5e6b76'}"
							>
								<span class="sic" class:lit={on}>{@render stepIcon(i)}</span>
								<span class="stxt">{s}</span>
							</div>
						{/each}
					</div>
					{#if view === 'sandbox'}
						<div class="vendors">
							{#each tx.behindItems as b, i (b)}
								<span class="vchip" style="animation-delay:{i * 0.15}s">{b}</span>
							{/each}
						</div>
					{/if}
				</div>
			{:else}
				<!-- your turn, a request from a phone wakes the function like any service -->
				<div class="svc">
					<div class="actor">
						<div class="shrink"><Browser phase={phonePhase} /></div>
						<span class="alabel">{tx.userLabel}</span>
					</div>
					<div class="svcrail">
						{#if fnState !== 'sleep'}
							<span class="flychip req">{tx.reqTag}</span>
						{/if}
						{#if resFly}
							<span class="flychip res">{tx.resTag}</span>
						{/if}
					</div>
					<div class="fnwrap">
						<div class="fn" class:awake={fnState !== 'sleep'} class:working={fnState === 'run'}>
							{#if fnState === 'sleep'}<span class="zzz">z z z</span>{:else}<span class="spark"
									>⚡</span
								>{/if}
							<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M11 3 5 13h5l-2 8 7-11h-5l3-7Z"
									stroke="currentColor"
									stroke-width="1.9"
									stroke-linejoin="round"
								/>
							</svg>
							<b>{tx.fnLabel}</b>
							<span class="stag"
								>{fnState === 'sleep'
									? tx.sleepTag
									: fnState === 'wake'
										? tx.wakeTag
										: tx.runTag}</span
							>
						</div>
						<span class="mnum">{tx.callsLabel.replace('{n}', String(calls))}</span>
					</div>
				</div>
			{/if}
		{/key}
	</div>

	<p class="note">{note}</p>

	{#if lastBeat}
		<CallToActionButton onclick={call} disabled={fnState !== 'sleep'}>
			{tx.send}
		</CallToActionButton>
	{/if}
</div>

<style>
	.panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: min(94vw, 372px);
		min-height: 196px;
		border-radius: 18px;
		border: 1px solid #e8e2d8;
		background: #fff;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.07);
		padding: 14px 10px;
	}

	/* beat 0, the always-on server */
	.always {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.srvwrap :global(.server) {
		width: 72px;
		padding: 9px;
		border-radius: 12px;
		gap: 5px;
		border-width: 1.5px;
	}
	.srvwrap :global(.server .slot) {
		height: 10px;
		border-radius: 3px;
	}
	.always b {
		font-size: 11.5px;
		font-weight: 800;
		color: #16212b;
	}
	.meter24 {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1px solid #eecac4;
		background: #fbeae7;
		color: #b8392c;
		font-size: 10px;
		font-weight: 700;
		padding: 3px 11px;
	}
	.meter24 i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #d3584a;
		animation: blink 0.9s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}

	/* the flow */
	.flow {
		position: relative;
		width: 100%;
	}
	.frail {
		position: absolute;
		top: 22px;
		left: 8%;
		right: 8%;
		border-top: 2px solid #e3ded5;
	}
	.fpkt {
		position: absolute;
		top: 22px;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: #2e6fe0;
		border: 2px solid #fff;
		transform: translate(-50%, -50%);
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.25);
		transition: left 0.7s ease;
		z-index: 2;
	}
	.steps {
		position: relative;
		display: flex;
		justify-content: space-between;
		z-index: 1;
	}
	.step {
		display: flex;
		width: 19%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.sic {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 13px;
		border: 1.5px solid #e8e2d8;
		background: #fff;
		color: #8a949d;
		transition: all 0.3s ease;
	}
	.sic.lit {
		border-color: var(--c, #2e6fe0);
		color: var(--c, #2e6fe0);
		transform: scale(1.1);
		box-shadow: 0 6px 16px color-mix(in srgb, var(--c, #2e6fe0) 25%, transparent);
	}
	.stxt {
		font-size: 7.5px;
		font-weight: 700;
		color: #8a949d;
		text-align: center;
		line-height: 1.2;
	}
	.step.on .stxt {
		color: #16212b;
	}
	.vendors {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 5px;
		margin-top: 11px;
	}
	.vchip {
		border-radius: 999px;
		border: 1px solid #ecd9b6;
		background: #fbf1de;
		color: #8a6a25;
		font-size: 9px;
		font-weight: 700;
		padding: 3px 10px;
		animation: popin 0.3s ease backwards;
	}
	@keyframes popin {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* the demo, phone asks, function answers */
	.svc {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		width: 100%;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.alabel {
		font-size: 10px;
		font-weight: 600;
		color: #5e6b76;
		white-space: nowrap;
	}
	.shrink {
		width: 92px;
		height: 146px;
		overflow: visible;
	}
	.shrink > :global(.phone) {
		transform: scale(0.58);
		transform-origin: top left;
	}
	.svcrail {
		position: relative;
		flex: 1;
		max-width: 96px;
		height: 2px;
		margin-bottom: 18px;
		border-radius: 2px;
		background: #e8e2d8;
	}
	.flychip {
		position: absolute;
		top: -10px;
		border-radius: 999px;
		color: #fff;
		font-size: 8px;
		font-weight: 800;
		padding: 2px 8px;
		white-space: nowrap;
	}
	.flychip.req {
		background: #2e6fe0;
		animation: reqgo 0.6s ease forwards;
	}
	.flychip.res {
		background: #3a9c64;
		animation: resgo 0.6s ease forwards;
	}
	@keyframes reqgo {
		from {
			left: -4%;
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		to {
			left: 52%;
			opacity: 1;
		}
	}
	@keyframes resgo {
		from {
			left: 52%;
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		to {
			left: -4%;
			opacity: 1;
		}
	}
	.fnwrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		margin-bottom: 14px;
	}
	.fn {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 16px;
		border: 1.5px solid #e0d9cd;
		background: #faf9f6;
		color: #b9c0c7;
		padding: 11px 26px;
		transition: all 0.25s ease;
	}
	.fn.awake {
		border-color: #dd9e36;
		background: #fbf1de;
		color: #c9881f;
		box-shadow: 0 8px 20px rgba(221, 158, 54, 0.22);
	}
	.fn.working {
		border-color: #3a9c64;
		background: #ecf6f0;
		color: #2f7d54;
		box-shadow: 0 8px 20px rgba(58, 156, 100, 0.2);
	}
	.fn b {
		font-size: 11.5px;
		font-weight: 800;
		color: inherit;
	}
	.stag {
		font-size: 8.5px;
		font-weight: 700;
		color: inherit;
		opacity: 0.8;
	}
	.zzz {
		position: absolute;
		top: -10px;
		right: 4px;
		font-size: 10px;
		font-weight: 800;
		color: #b9c0c7;
		animation: floaty 2s ease-in-out infinite;
	}
	.spark {
		position: absolute;
		top: -12px;
		right: 2px;
		font-size: 13px;
		animation: popin 0.25s ease;
	}
	@keyframes floaty {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-3px);
		}
	}
	.mnum {
		font-size: 9.5px;
		font-weight: 700;
		color: #5e6b76;
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}
	.note {
		min-height: 1.3em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	:global(.dark) .panel {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .always b {
		color: var(--color-ink);
	}
	:global(.dark) .meter24 {
		border-color: color-mix(in srgb, var(--color-danger) 40%, transparent);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	:global(.dark) .frail {
		border-color: var(--color-line);
	}
	:global(.dark) .fpkt {
		border-color: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .sic {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-faint);
	}
	:global(.dark) .stxt {
		color: var(--color-faint);
	}
	:global(.dark) .step.on .stxt {
		color: var(--color-ink);
	}
	:global(.dark) .vchip {
		border-color: color-mix(in srgb, var(--color-amber) 40%, transparent);
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	:global(.dark) .alabel {
		color: var(--color-muted);
	}
	:global(.dark) .svcrail {
		background: var(--color-line);
	}
	:global(.dark) .fn {
		border-color: var(--color-line);
		background: var(--color-paper);
		color: var(--color-faint);
	}
	:global(.dark) .fn.awake {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		color: var(--color-amber);
		box-shadow: none;
	}
	:global(.dark) .fn.working {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
		box-shadow: none;
	}
	:global(.dark) .zzz {
		color: var(--color-faint);
	}
	:global(.dark) .mnum {
		color: var(--color-muted);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		.zzz,
		.spark,
		.vchip,
		.meter24 i {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.panel {
			width: 560px;
			min-height: 240px;
			padding: 18px 16px;
		}
		.sic {
			width: 52px;
			height: 52px;
		}
		.sic svg {
			width: 22px;
			height: 22px;
		}
		.stxt {
			font-size: 9.5px;
		}
		.frail,
		.fpkt {
			top: 28px;
		}
		.vchip {
			font-size: 11px;
		}
		.fn b {
			font-size: 14px;
		}
		.stag {
			font-size: 10.5px;
		}
		.mnum {
			font-size: 11.5px;
		}
		.shrink {
			width: 114px;
			height: 180px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.72);
		}
		.svcrail {
			max-width: 150px;
		}
		.flychip {
			font-size: 10px;
		}
		.alabel {
			font-size: 12px;
		}
		.note {
			font-size: 14px;
		}
		.always b {
			font-size: 14px;
		}
		.meter24 {
			font-size: 12px;
		}
	}
</style>
