<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { NetworkText } from '$lib/chapters/networking/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as NetworkText);

	let flight = $state<'' | 'web' | 'attack'>('');
	let webOk = $state(false);
	let blocked = $state(false);
	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function run(kind: 'web' | 'attack') {
		flight = kind;
		webOk = false;
		blocked = false;
		timers.forEach(clearTimeout);
		timers = [];
		timers.push(
			setTimeout(() => {
				if (kind === 'web') webOk = true;
				else blocked = true;
				flight = '';
				onstate?.(kind === 'web' ? 'web' : 'blocked');
				tried.add(kind);
				if (tried.size === 2 && !done) {
					done = true;
					oncomplete?.();
				}
			}, 1100)
		);
	}

	const note = $derived(blocked ? tx.noteBlocked : webOk ? tx.noteWeb : tx.noteIdle);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet person(size: number, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="12" cy="8" r="4" fill={color} />
		<path d="M4 21a8 8 0 0 1 16 0Z" fill={color} />
	</svg>
{/snippet}

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<div class="scene">
		<!-- the internet outside the fence -->
		<div class="net">
			{@render person(14, '#dd9e36')}
			<span>{tx.internetLabel}</span>
		</div>

		<!-- two travel lanes, each aligned over its room -->
		<div class="lanes">
			<div class="lane">
				{#if flight === 'web'}<span class="trav">{@render person(13, '#dd9e36')}</span>{/if}
			</div>
			<div class="lane">
				{#if flight === 'attack'}<span class="trav">{@render person(13, '#d3584a')}</span>{/if}
				{#if blocked}<span class="deny">×</span>{/if}
			</div>
		</div>

		<!-- the fenced VPC with its two rooms -->
		<div class="vpc">
			<div class="vhead">
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<rect
						x="3.5"
						y="3.5"
						width="17"
						height="17"
						rx="3.5"
						stroke="#5e6b76"
						stroke-width="2"
						stroke-dasharray="none"
					/>
				</svg>
				<b>{tx.vpcLabel}</b>
				<span>{tx.vpcSub}</span>
			</div>
			<div class="rooms">
				<div class="room pub" class:hot={webOk || flight === 'web'}>
					<span class="gate"></span>
					<div class="rhead">
						<b>{tx.publicLabel}</b>
						<span>{tx.publicSub}</span>
					</div>
					<div class="box">
						<div class="slot">
							<span class="dot" style="background:#2e6fe0"></span><span class="bar"></span>
						</div>
						<div class="slot">
							<span class="dot" style="background:#2e6fe0"></span><span class="bar"></span>
						</div>
						<div class="slot">
							<span class="dot" style="background:#2e6fe0"></span><span class="bar"></span>
						</div>
					</div>
					<span class="blabel">{tx.webLabel}</span>
				</div>

				<div class="bridge" class:hot={webOk}>
					<span class="bdot"></span><span class="bdot"></span><span class="bdot"></span>
				</div>

				<div class="room priv" class:shield={blocked}>
					<span class="lockchip">
						<svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<rect
								x="5"
								y="10.5"
								width="14"
								height="9.5"
								rx="2.5"
								stroke="#fff"
								stroke-width="2.6"
							/>
							<path
								d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3"
								stroke="#fff"
								stroke-width="2.6"
								stroke-linecap="round"
							/>
						</svg>
					</span>
					<div class="rhead">
						<b>{tx.privateLabel}</b>
						<span>{tx.privateSub}</span>
					</div>
					<div class="box db">
						<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<ellipse cx="12" cy="5.5" rx="8" ry="3" stroke="#3a9c64" stroke-width="1.8" />
							<path
								d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"
								stroke="#3a9c64"
								stroke-width="1.8"
							/>
						</svg>
					</div>
					<span class="blabel">{tx.dbLabel}</span>
				</div>
			</div>
		</div>
	</div>

	<p class="note">{note}</p>

	<div class="acts">
		<button
			type="button"
			class="cta"
			class:dim={tried.has('web')}
			onclick={() => run('web')}
			disabled={flight !== ''}>{tx.visitSite}</button
		>
		<button
			type="button"
			class="line"
			class:dim={tried.has('attack')}
			onclick={() => run('attack')}
			disabled={flight !== ''}>{tx.attackDb}</button
		>
	</div>
</div>

<style>
	.scene {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(94vw, 364px);
	}
	.net {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1px solid #ecd9b6;
		background: #fbf1de;
		color: #8a6a25;
		font-size: 11px;
		font-weight: 700;
		padding: 4px 13px;
	}
	/* the lanes mirror the rooms grid so each line lands on its room */
	.lanes {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		height: 42px;
		padding: 0 14px;
		box-sizing: border-box;
	}
	.lane {
		position: relative;
	}
	.lane::before {
		content: '';
		position: absolute;
		top: 3px;
		bottom: 0;
		left: 50%;
		border-left: 2px solid #dcd6cb;
		transform: translateX(-50%);
	}
	.trav {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		line-height: 0;
		z-index: 2;
		animation: descend 1.05s ease-in forwards;
	}
	@keyframes descend {
		from {
			top: -6px;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			top: 34px;
			opacity: 1;
		}
	}
	.deny {
		position: absolute;
		bottom: -9px;
		left: 50%;
		transform: translate(-50%, 0);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: #d3584a;
		border: 2px solid #fff;
		color: #fff;
		font-size: 14px;
		font-weight: 800;
		z-index: 3;
		box-shadow: 0 4px 10px rgba(211, 88, 74, 0.4);
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: translate(-50%, 0) scale(0.4);
			opacity: 0;
		}
		to {
			transform: translate(-50%, 0) scale(1);
			opacity: 1;
		}
	}

	.vpc {
		width: 100%;
		border-radius: 20px;
		border: 1.5px solid #b9c6d6;
		background: #fff;
		padding: 12px 14px 16px;
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.07);
	}
	.vhead {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 10px;
	}
	.vhead b {
		font-size: 12.5px;
		font-weight: 800;
		color: #16212b;
	}
	.vhead span {
		font-size: 9.5px;
		color: #8a949d;
	}
	.rooms {
		display: grid;
		grid-template-columns: 1fr 14px 1fr;
		align-items: stretch;
	}
	.room {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 7px;
		border-radius: 14px;
		border: 1.5px solid #cdddf6;
		background: #f4f8fe;
		padding: 13px 10px 11px;
		transition: box-shadow 0.3s ease;
	}
	.room.pub.hot {
		box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.13);
	}
	.room.priv {
		border-color: #cde6d7;
		background: #f0f9f3;
	}
	.room.priv.shield {
		box-shadow: 0 0 0 4px rgba(211, 88, 74, 0.16);
	}
	/* the public room has an actual gate arch on its roof */
	.gate {
		position: absolute;
		top: -9px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 11px;
		border: 2.5px solid #2e6fe0;
		border-bottom: none;
		border-radius: 9px 9px 0 0;
		background: #fff;
	}
	.lockchip {
		position: absolute;
		top: -9px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #8a949d;
		border: 2px solid #fff;
	}
	.rhead {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.2;
		text-align: center;
	}
	.rhead b {
		font-size: 10.5px;
		font-weight: 800;
		color: #16212b;
	}
	.rhead span {
		font-size: 8px;
		color: #8a949d;
	}
	.box {
		display: flex;
		width: 66px;
		flex-direction: column;
		gap: 4px;
		border-radius: 10px;
		border: 1.5px solid #cdddf6;
		background: #fff;
		padding: 7px;
		align-items: center;
		justify-content: center;
		min-height: 46px;
		box-shadow: 0 5px 12px rgba(22, 40, 60, 0.06);
	}
	.box.db {
		border-color: #cde6d7;
	}
	.slot {
		display: flex;
		width: 100%;
		height: 9px;
		align-items: center;
		gap: 3px;
		border-radius: 3px;
		border: 1px solid #ece6dc;
		background: #f4f1ea;
		padding: 0 4px;
	}
	.dot {
		flex: none;
		width: 4px;
		height: 4px;
		border-radius: 50%;
	}
	.bar {
		flex: 1;
		height: 2.5px;
		border-radius: 2px;
		background: #e3ddd3;
	}
	.blabel {
		font-size: 9px;
		font-weight: 700;
		color: #5e6b76;
	}
	/* the only path to the database runs inside, room to room */
	.bridge {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		align-self: center;
	}
	.bdot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: #dcd6cb;
		transition: background 0.3s ease;
	}
	.bridge.hot .bdot {
		background: #3a9c64;
		animation: bblink 0.6s ease-in-out 3;
	}
	.bridge.hot .bdot:nth-child(2) {
		animation-delay: 0.15s;
	}
	.bridge.hot .bdot:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes bblink {
		50% {
			opacity: 0.25;
		}
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: #6a7681;
		margin-top: 2px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta {
		border-radius: 12px;
		background: #16212b;
		color: #fff;
		padding: 11px 18px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line {
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		color: #16212b;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.line:enabled:hover {
		border-color: #16212b;
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.55;
	}
	.dim::after {
		content: ' ✓';
		color: #3a9c64;
	}

	:global(.dark) .net {
		border-color: color-mix(in srgb, var(--color-amber) 50%, transparent);
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	:global(.dark) .lane::before {
		border-color: var(--color-line);
	}
	:global(.dark) .vpc {
		border-color: var(--color-line);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .vhead b {
		color: var(--color-ink);
	}
	:global(.dark) .vhead span {
		color: var(--color-faint);
	}
	:global(.dark) .room {
		border-color: color-mix(in srgb, var(--color-brand) 25%, transparent);
		background: color-mix(in srgb, var(--color-brand) 10%, transparent);
	}
	:global(.dark) .room.priv {
		border-color: color-mix(in srgb, var(--color-grass) 25%, transparent);
		background: color-mix(in srgb, var(--color-grass) 10%, transparent);
	}
	:global(.dark) .gate {
		background: var(--color-card);
	}
	:global(.dark) .lockchip {
		background: var(--color-faint);
		border-color: var(--color-card);
	}
	:global(.dark) .rhead b {
		color: var(--color-ink);
	}
	:global(.dark) .rhead span {
		color: var(--color-faint);
	}
	:global(.dark) .box {
		border-color: color-mix(in srgb, var(--color-brand) 25%, transparent);
		background: var(--color-card);
		box-shadow: none;
	}
	:global(.dark) .box.db {
		border-color: color-mix(in srgb, var(--color-grass) 25%, transparent);
	}
	:global(.dark) .slot {
		border-color: var(--color-line);
		background: var(--color-paper);
	}
	:global(.dark) .bar {
		background: color-mix(in srgb, var(--color-line) 50%, transparent);
	}
	:global(.dark) .blabel {
		color: var(--color-muted);
	}
	:global(.dark) .bdot {
		background: var(--color-faint);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .cta {
		background: var(--color-brand);
		box-shadow: none;
	}
	:global(.dark) .line {
		border-color: var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	:global(.dark) .line:enabled:hover {
		border-color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.trav,
		.deny,
		.bridge.hot .bdot {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.scene {
			width: 520px;
		}
		.net {
			font-size: 13px;
			padding: 5px 16px;
		}
		.lanes {
			height: 52px;
			gap: 26px;
			padding: 0 18px;
		}
		.vpc {
			padding: 16px 18px 20px;
		}
		.vhead b {
			font-size: 15px;
		}
		.vhead span {
			font-size: 11.5px;
		}
		.rooms {
			grid-template-columns: 1fr 22px 1fr;
		}
		.room {
			padding: 17px 14px 14px;
			gap: 9px;
		}
		.rhead b {
			font-size: 13px;
		}
		.rhead span {
			font-size: 10px;
		}
		.box {
			width: 84px;
			min-height: 58px;
		}
		.slot {
			height: 11px;
		}
		.blabel {
			font-size: 11px;
		}
		.gate {
			width: 38px;
			height: 13px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
		.cta,
		.line {
			font-size: 14px;
			padding: 12px 22px;
		}
	}
</style>
