<script lang="ts">
	import { onDestroy } from 'svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { WhatDevopsText } from '$lib/chapters/devops/what-devops/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as WhatDevopsText);

	// How many changes pile up in one release, per rhythm (year, quarter, month, week, day).
	const CHANGES = [240, 60, 20, 5, 1];
	const LAST = CHANGES.length - 1;

	let step = $state(0);
	let phase = $state<'idle' | 'fly' | 'down' | 'fixed'>('idle');
	let shippedAt = $state(-1);
	let triedYear = false;
	let triedDay = false;
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const changes = $derived(CHANGES[step]);
	// the box shrinks with the release, from a crate down to a tiny parcel
	const boxSize = $derived(30 + Math.round((Math.log(changes) / Math.log(240)) * 34));
	// the wall fades as releases get smaller and the two teams merge
	const wallLeft = $derived(1 - step / LAST);
	const busy = $derived(phase === 'fly' || phase === 'down');

	function changesText(n: number) {
		return n === 1 ? tx.changesOne : tx.changesTag.replace('{n}', String(n));
	}

	function ship() {
		if (busy) return;
		timers.forEach(clearTimeout);
		timers = [];
		const at = step;
		shippedAt = -1;
		phase = 'fly';
		// a bigger release takes longer to dig through before it is fixed
		const outage = 900 + Math.round((Math.log(CHANGES[at]) / Math.log(240)) * 1800);
		timers.push(
			setTimeout(() => {
				phase = 'down';
				shippedAt = at;
			}, 900)
		);
		timers.push(
			setTimeout(() => {
				phase = 'fixed';
				react(at);
			}, 900 + outage)
		);
	}

	function react(at: number) {
		if (at === 0) triedYear = true;
		if (at === LAST) triedDay = true;
		if (triedYear && triedDay && (at === 0 || at === LAST)) {
			onstate?.('both');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		} else onstate?.(at === 0 ? 'yearly' : at === LAST ? 'daily' : 'middle');
	}

	function slide(v: number) {
		step = v;
		if (!busy) phase = 'idle';
	}

	const note = $derived(
		shippedAt < 0
			? tx.noteIdle
			: shippedAt === LAST
				? tx.noteSmall
				: tx.noteBig.replace('{n}', String(CHANGES[shippedAt])).replace('{t}', tx.finds[shippedAt])
	);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<!-- the rhythm slider and the ship button sit on top -->
	<div class="ctrl">
		<div class="every">
			<span class="elabel">{tx.everyLabel}</span>
			<b class="evalue">{tx.cadences[step]}</b>
		</div>
		<input
			type="range"
			min="0"
			max={LAST}
			step="1"
			value={step}
			disabled={busy}
			aria-label={tx.everyLabel}
			oninput={(e) => slide(+(e.currentTarget as HTMLInputElement).value)}
		/>
		<div class="ticks" aria-hidden="true">
			{#each tx.cadences as c, i (i)}
				<span class:on={i === step}>{c}</span>
			{/each}
		</div>
		<button type="button" class="cta" disabled={busy} onclick={ship}>
			{phase === 'fixed' ? tx.againBtn : tx.shipBtn}
		</button>
	</div>

	<!-- Dev on the left, the wall, Ops and production on the right -->
	<div class="scene">
		<div class="team" class:merged={step === LAST}>
			{#if step === LAST}
				<span class="tlabel one">{tx.oneTeam}</span>
			{/if}
		</div>

		<div class="side dev">
			<svg width="46" height="34" viewBox="0 0 46 34" aria-hidden="true">
				<rect x="7" y="2" width="32" height="22" rx="3" class="lap" />
				<rect x="10" y="5" width="26" height="16" rx="1.5" class="scr" />
				<path d="M2 27h42l-3 5H5Z" class="lap" />
			</svg>
			<span class="slabel">{tx.devLabel}</span>
		</div>

		<div class="wall" style="opacity:{wallLeft}; transform: scaleY({0.25 + wallLeft * 0.75})">
			<i></i><i></i><i></i><i></i>
			<span class="wlabel">{tx.wallLabel}</span>
		</div>

		<div class="side ops">
			<div class="srv" class:down={phase === 'down'}>
				<Server active={phase !== 'down'} />
				{#if phase === 'down'}
					<span class="tag bad">{tx.downTag}</span>
				{:else if phase === 'fixed'}
					<span class="tag good">{tx.backTag}</span>
				{/if}
			</div>
			<span class="slabel">{tx.opsLabel}</span>
		</div>

		<!-- the release box itself -->
		{#key phase === 'fly' ? 'fly' : 'rest'}
			<div
				class="box"
				class:fly={phase === 'fly'}
				class:gone={phase === 'down' || phase === 'fixed'}
				style="width:{boxSize}px; height:{boxSize}px"
			></div>
		{/key}
		<span class="bcount">{changesText(changes)}</span>
	</div>

	<div class="stats">
		<div class="stat">
			<span>{tx.waitLabel}</span>
			<b>{tx.waits[step]}</b>
		</div>
		<div class="stat">
			<span>{tx.findLabel}</span>
			<b class:hot={step < 2} class:cool={step === LAST}>{tx.finds[step]}</b>
		</div>
	</div>

	<p class="note">{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 14px;
	}
	.ctrl {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.every {
		display: flex;
		align-items: baseline;
		gap: 6px;
	}
	.elabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.evalue {
		font-family: var(--font-display, inherit);
		font-size: 20px;
		font-weight: 600;
		color: var(--color-ink);
	}
	input[type='range'] {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.ticks {
		display: flex;
		width: 100%;
		justify-content: space-between;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.ticks span {
		width: 20%;
		text-align: center;
	}
	.ticks span:first-child {
		text-align: left;
	}
	.ticks span:last-child {
		text-align: right;
	}
	.ticks .on {
		color: var(--color-brand);
	}
	.cta {
		margin-top: 4px;
		border-radius: 12px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 700;
		transition: opacity 0.2s ease;
	}
	.cta:disabled {
		opacity: 0.5;
	}

	.scene {
		position: relative;
		display: flex;
		width: 100%;
		height: 130px;
		align-items: flex-end;
		justify-content: space-between;
		padding: 0 6px 18px;
	}
	.team {
		position: absolute;
		inset: 0 0 10px;
		border-radius: 16px;
		border: 1.5px solid transparent;
		transition:
			border-color 0.4s ease,
			background 0.4s ease;
	}
	.team.merged {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.tlabel.one {
		position: absolute;
		top: 6px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-grass);
		white-space: nowrap;
	}
	.side {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.lap {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.scr {
		fill: var(--color-brand-soft);
	}
	.slabel {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.srv {
		position: relative;
	}
	.srv :global(.server) {
		width: 54px;
		gap: 5px;
		padding: 6px;
		border-radius: 9px;
		transition: border-color 0.3s ease;
	}
	.srv :global(.server .slot) {
		height: 9px;
	}
	.srv.down :global(.server) {
		border-color: var(--color-danger);
	}
	.srv.down :global(.server .dot) {
		background: var(--color-danger);
	}
	.tag {
		position: absolute;
		top: -9px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 9.5px;
		font-weight: 800;
		color: #fff;
		white-space: nowrap;
	}
	.tag.bad {
		background: var(--color-danger);
		animation: pulse 0.9s ease-in-out infinite;
	}
	.tag.good {
		background: var(--color-grass);
	}
	@keyframes pulse {
		50% {
			opacity: 0.55;
		}
	}

	.wall {
		position: absolute;
		left: 50%;
		bottom: 18px;
		z-index: 1;
		display: flex;
		height: 96px;
		width: 14px;
		flex-direction: column;
		gap: 2px;
		margin-left: -7px;
		transform-origin: bottom;
		transition:
			opacity 0.4s ease,
			transform 0.4s ease;
	}
	.wall i {
		flex: 1;
		border-radius: 3px;
		background: var(--color-line);
		border: 1px solid var(--color-faint);
	}
	.wlabel {
		position: absolute;
		bottom: -16px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 9px;
		font-weight: 700;
		color: var(--color-faint);
		white-space: nowrap;
	}

	.box {
		position: absolute;
		left: 18%;
		bottom: 22px;
		z-index: 2;
		border-radius: 6px;
		background: var(--color-amber-soft);
		border: 1.5px solid var(--color-amber);
		box-shadow: inset 0 0 0 3px var(--color-card);
		transition:
			width 0.3s ease,
			height 0.3s ease;
	}
	.box.fly {
		animation: throw 0.9s ease-in-out forwards;
	}
	.box.gone {
		display: none;
	}
	@keyframes throw {
		0% {
			left: 18%;
			bottom: 22px;
		}
		50% {
			left: 44%;
			bottom: 108px;
		}
		100% {
			left: 70%;
			bottom: 30px;
			opacity: 0;
		}
	}
	.bcount {
		position: absolute;
		left: 18%;
		bottom: 0;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-amber);
		white-space: nowrap;
	}

	.stats {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}
	.stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
	}
	.stat span {
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.stat b {
		font-size: 14px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.stat b.hot {
		color: var(--color-danger);
	}
	.stat b.cool {
		color: var(--color-grass);
	}
	.note {
		min-height: 2.8em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		line-height: 1.4;
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.box.fly {
			animation-duration: 0.01s;
		}
		.tag.bad {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 18px;
		}
		.scene {
			height: 150px;
		}
		.ticks {
			font-size: 11px;
		}
		.stat b {
			font-size: 16px;
		}
		.note {
			font-size: 13.5px;
			max-width: 420px;
		}
	}
</style>
