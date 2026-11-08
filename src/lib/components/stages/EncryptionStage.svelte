<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Browser from '../Browser.svelte';
	import Server from '$lib/components/Server.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';

	import type { EncryptionText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as EncryptionText);

	let mode = $state<'' | 'plain' | 'locked'>('');
	let stage2 = $state(false); // past the snooper
	let landed = $state(false);
	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function send(m: 'plain' | 'locked') {
		mode = m;
		stage2 = false;
		landed = false;
		timers.forEach(clearTimeout);
		timers = [];
		timers.push(setTimeout(() => (stage2 = true), 1000));
		timers.push(
			setTimeout(() => {
				landed = true;
				onstate?.(m === 'plain' ? 'plain' : 'encrypted');
				tried.add(m);
				if (tried.size === 2 && !done) {
					done = true;
					oncomplete?.();
				}
			}, 2000)
		);
	}

	const note = $derived(
		!mode || !landed ? (mode ? ' ' : tx.noteIdle) : mode === 'plain' ? tx.notePlain : tx.noteLocked
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="scene">
		<!-- you -->
		<div class="actor">
			<div class="shrink"><Browser phase={mode ? 'loaded' : 'idle'} /></div>
			<span class="alabel">{tx.youLabel}</span>
		</div>

		<!-- the road, with someone listening in the middle -->
		<div class="road">
			<div class="wire"></div>
			<div
				class="snoop"
				class:happy={mode === 'plain' && stage2}
				class:confused={mode === 'locked' && stage2}
			>
				<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle cx="12" cy="8" r="4" fill="#8a949d" />
					<path d="M4 21a8 8 0 0 1 16 0Z" fill="#8a949d" />
				</svg>
				<span class="slabel">{tx.snooperLabel}</span>
				{#if stage2 && mode}
					<span class="stag" class:bad={mode === 'plain'}>
						{mode === 'plain' ? `${tx.message} ${tx.readTag}` : tx.scrambledTag}
					</span>
				{/if}
			</div>
			{#if mode && !landed}
				{#key mode + String(stage2)}
					<div class="msg" class:half={stage2} class:lockedm={mode === 'locked'}>
						{#if mode === 'locked'}
							<svg width="8" height="8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect
									x="5"
									y="10.5"
									width="14"
									height="9.5"
									rx="2.5"
									stroke="#fff"
									stroke-width="2.4"
								/>
								<path
									d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"
									stroke="#fff"
									stroke-width="2.4"
									stroke-linecap="round"
								/>
							</svg>
						{/if}
						{mode === 'plain' ? tx.message : tx.cipher}
					</div>
				{/key}
			{/if}
		</div>

		<!-- the server holding the key -->
		<div class="actor">
			<div class="srvwrap" class:got={landed}>
				<Server slots={2} active={landed} />
				{#if landed}
					<span class="opened" class:safe={mode === 'locked'}>{tx.message}</span>
				{/if}
			</div>
			<span class="alabel">
				<svg
					width="9"
					height="9"
					viewBox="0 0 24 24"
					fill="none"
					aria-hidden="true"
					style="display:inline"
				>
					<circle cx="8" cy="8" r="4.5" stroke="#dd9e36" stroke-width="2.5" />
					<path
						d="M11 11.5 20 20m-3.5.5V17"
						stroke="#dd9e36"
						stroke-width="2.5"
						stroke-linecap="round"
					/>
				</svg>
				{tx.serverLabel}
			</span>
		</div>
	</div>

	<p class="note">{note}</p>

	<div class="acts">
		<div class="btn-wrap" class:tried={tried.has('plain')}>
			<CallToActionButton onclick={() => send('plain')} disabled={mode !== '' && !landed}>
				{tx.sendPlain}
			</CallToActionButton>
		</div>
		<div class="btn-wrap" class:tried={tried.has('locked')}>
			<CallToActionButton onclick={() => send('locked')} disabled={mode !== '' && !landed}>
				{tx.sendLocked}
			</CallToActionButton>
		</div>
	</div>
</div>

<style>
	.scene {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		width: min(94vw, 380px);
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.alabel {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 10px;
		font-weight: 600;
		color: #5e6b76;
		white-space: nowrap;
	}
	.shrink {
		width: 98px;
		height: 156px;
		overflow: visible;
	}
	.shrink > :global(.phone) {
		max-width: none;
		transform: scale(0.62);
		transform-origin: top left;
	}
	.road {
		position: relative;
		flex: 1;
		height: 120px;
		margin-bottom: 22px;
	}
	.wire {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		border-top: 2px solid #e3ded5;
	}
	.snoop {
		position: absolute;
		top: calc(50% + 10px);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		line-height: 1;
		transition: transform 0.2s ease;
	}
	.snoop.happy {
		transform: translateX(-50%) scale(1.12);
	}
	.slabel {
		font-size: 8.5px;
		font-weight: 700;
		color: #8a949d;
		white-space: nowrap;
	}
	.stag {
		border-radius: 999px;
		background: #eef0f2;
		color: #5e6b76;
		font-size: 8px;
		font-weight: 800;
		padding: 2px 7px;
		white-space: nowrap;
		animation: popin 0.25s ease;
	}
	.stag.bad {
		background: #d3584a;
		color: #fff;
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
	.msg {
		position: absolute;
		top: calc(50% - 24px);
		left: 0;
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 999px;
		background: #fff;
		border: 1.5px solid #d3584a;
		color: #b8392c;
		font-size: 9px;
		font-weight: 800;
		padding: 3px 9px;
		white-space: nowrap;
		animation: half1 1s linear forwards;
		z-index: 2;
	}
	.msg.lockedm {
		background: #16212b;
		border-color: #16212b;
		color: #fff;
	}
	.msg.half {
		animation: half2 1s linear forwards;
	}
	@keyframes half1 {
		from {
			left: -2%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			left: 38%;
			opacity: 1;
		}
	}
	@keyframes half2 {
		from {
			left: 38%;
		}
		to {
			left: 86%;
			opacity: 1;
		}
	}
	.srvwrap {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.srvwrap.got :global(.server) {
		border-color: var(--color-grass);
		border-width: 1.5px;
	}
	.srvwrap :global(.server) {
		width: 70px;
		padding: 7px;
		border-radius: 10px;
		gap: 4px;
		border-width: 1.5px;
	}
	.srvwrap :global(.server .slot) {
		height: 9px;
		border-radius: 3px;
	}
	.opened {
		border-radius: 6px;
		background: #f0f9f3;
		border: 1px solid #cde6d7;
		color: #2f7d54;
		font-size: 8px;
		font-weight: 800;
		text-align: center;
		padding: 2px 3px;
		animation: popin 0.3s ease;
	}
	.note {
		min-height: 1.4em;
		max-width: 330px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 16px;
	}
	.btn-wrap {
		position: relative;
	}
	.btn-wrap.tried :global(.cta)::after {
		content: ' ✓';
		color: #8fd6ae;
	}

	:global(.dark) .alabel {
		color: var(--color-muted);
	}
	:global(.dark) .wire {
		border-color: var(--color-line);
	}
	:global(.dark) .snoop svg circle,
	:global(.dark) .snoop svg path {
		fill: var(--color-faint);
	}
	:global(.dark) .slabel {
		color: var(--color-faint);
	}
	:global(.dark) .stag {
		background: var(--color-paper);
		color: var(--color-muted);
	}
	:global(.dark) .msg {
		background: var(--color-card);
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	:global(.dark) .msg.lockedm {
		background: var(--color-brand);
		border-color: var(--color-brand);
		color: #fff;
	}
	:global(.dark) .opened {
		background: color-mix(in srgb, var(--color-grass) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-grass) 25%, transparent);
		color: var(--color-grass);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.msg,
		.stag,
		.opened {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 560px;
			gap: 10px;
		}
		.shrink {
			width: 123px;
			height: 195px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.78);
		}
		.msg {
			font-size: 11px;
		}
		.stag {
			font-size: 9.5px;
		}
		.slabel {
			font-size: 10.5px;
		}
		.srvwrap :global(.server) {
			width: 92px;
		}
		.opened {
			font-size: 10px;
		}
		.alabel {
			font-size: 12px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
