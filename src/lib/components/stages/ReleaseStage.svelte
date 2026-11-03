<script lang="ts">
	import { onDestroy } from 'svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ReleaseText } from '$lib/chapters/devops/release/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as ReleaseText);

	const USERS = 20;
	// canary users are picked spread out over the crowd, not the first row
	const ORDER = [7, 14, 2, 18, 11, 4, 16, 0, 9, 19, 5, 12, 1, 17, 8, 3, 15, 10, 6, 13];
	const STEPS = [0, 5, 25, 50, 100];

	let mode = $state(0);
	let timers: ReturnType<typeof setTimeout>[] = [];
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	// all at once: three servers that each run v1 or v2
	let fleet = $state<number[]>([1, 1, 1]);
	let busy = $state(false);
	// blue green: which environment takes the traffic
	let onGreen = $state(false);
	// canary: index into STEPS
	let step = $state(0);

	let flipBackDone = false;
	let canaryBackDone = false;
	let done = false;

	const onV2 = $derived.by(() => {
		const v2 = new Array(USERS).fill(false);
		let k: number;
		if (mode === 0) k = Math.round((USERS * fleet.filter((v) => v === 2).length) / fleet.length);
		else if (mode === 1) k = onGreen ? USERS : 0;
		else k = Math.round((USERS * STEPS[step]) / 100);
		for (let i = 0; i < k; i++) v2[ORDER[i]] = true;
		return v2;
	});
	const hurt = $derived(onV2.filter(Boolean).length);

	function pick(i: number) {
		if (busy) return;
		mode = i;
	}

	function deployAll() {
		if (busy) return;
		busy = true;
		fleet.forEach((_, i) => at(250 * (i + 1), () => (fleet[i] = 2)));
		at(900, () => {
			busy = false;
			onstate?.('bigbang');
		});
	}
	function rollbackAll() {
		if (busy) return;
		busy = true;
		// redeploying is slow, server by server, and users suffer the whole time
		fleet.forEach((_, i) => at(1100 * (i + 1), () => (fleet[i] = 1)));
		at(1100 * fleet.length + 200, () => {
			busy = false;
			onstate?.('slowBack');
		});
	}
	function flip() {
		onGreen = !onGreen;
		if (onGreen) onstate?.('flipped');
		else {
			flipBackDone = true;
			finish('flipBack');
		}
	}
	function slide(v: number) {
		const before = step;
		step = v;
		if (v === 0 && before > 0) {
			canaryBackDone = true;
			finish('canaryBack');
		} else if (v > 0 && v !== before) onstate?.(STEPS[v] <= 5 ? 'canary' : 'canaryBig');
	}
	function finish(token: string) {
		if (flipBackDone && canaryBackDone) {
			onstate?.('both');
			if (!done) {
				done = true;
				oncomplete?.();
			}
		} else onstate?.(token);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet phone(bad: boolean, v2: boolean)}
	<span class="user" class:bad class:v2>
		<svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
			<rect x="1" y="1" width="12" height="20" rx="3" class="case" />
			{#if bad}
				<path d="M4.5 8.5l5 5M9.5 8.5l-5 5" class="mark" />
			{:else}
				<path d="M4 11.5l2 2 4-4.5" class="mark" />
			{/if}
		</svg>
	</span>
{/snippet}

<div class="wrap">
	<div class="tabs" role="tablist">
		{#each tx.modes as m, i (i)}
			<button
				type="button"
				role="tab"
				aria-selected={mode === i}
				class:on={mode === i}
				disabled={busy}
				onclick={() => pick(i)}>{m}</button
			>
		{/each}
	</div>

	<!-- the controls for the chosen strategy -->
	<div class="ctrl">
		{#if mode === 0}
			{#if fleet.every((v) => v === 1)}
				<button type="button" class="cta" disabled={busy} onclick={deployAll}
					>{tx.deployAllBtn}</button
				>
			{:else}
				<button type="button" class="line" disabled={busy} onclick={rollbackAll}
					>{busy ? tx.rollingBack : tx.rollbackBtn}</button
				>
			{/if}
		{:else if mode === 1}
			<button type="button" class={onGreen ? 'line' : 'cta'} onclick={flip}
				>{onGreen ? tx.switchToBlue : tx.switchToGreen}</button
			>
		{:else}
			<div class="canary">
				<b>{tx.canaryLabel.replace('{n}', String(STEPS[step]))}</b>
				<input
					type="range"
					min="0"
					max={STEPS.length - 1}
					step="1"
					value={step}
					aria-label={tx.canaryLabel.replace('{n}', String(STEPS[step]))}
					oninput={(e) => slide(+(e.currentTarget as HTMLInputElement).value)}
				/>
				<div class="ticks" aria-hidden="true">
					{#each STEPS as s (s)}<span class:on={STEPS[step] === s}>{s}%</span>{/each}
				</div>
				{#if step > 0}
					<button type="button" class="line small" onclick={() => slide(0)}>{tx.canaryBack}</button>
				{/if}
			</div>
		{/if}
	</div>

	<!-- the crowd of users -->
	<div class="crowd">
		{#each onV2 as v2, i (i)}
			{@render phone(v2, v2)}
		{/each}
	</div>
	<p class="status" class:bad={hurt > 0}>
		{hurt > 0 ? tx.usersLabel.replace('{n}', String(hurt)) : tx.allOk}
	</p>

	<div class="lb">{tx.lbLabel}</div>

	<!-- the servers behind it -->
	{#if mode === 0}
		<div class="fleet">
			{#each fleet as v, i (i)}
				<div class="srv" class:v2={v === 2}>
					<Server active slots={2} />
					<span class="ver">v{v}</span>
				</div>
			{/each}
		</div>
	{:else if mode === 1}
		<div class="envs">
			<div class="env blue" class:live={!onGreen}>
				<span class="ename">{tx.blueLabel}</span>
				<div class="pair"><Server active slots={2} /><Server active slots={2} /></div>
				{#if !onGreen}<span class="ltag">{tx.liveTag}</span>{/if}
			</div>
			<div class="env green" class:live={onGreen}>
				<span class="ename">{tx.greenLabel}</span>
				<div class="pair"><Server active slots={2} /><Server active slots={2} /></div>
				{#if onGreen}<span class="ltag">{tx.liveTag}</span>{/if}
			</div>
		</div>
	{:else}
		<div class="envs">
			<div class="env blue live">
				<span class="ename">v1</span>
				<div class="pair"><Server active slots={2} /><Server active slots={2} /></div>
				<span class="share">{100 - STEPS[step]}%</span>
			</div>
			<div class="env canaryenv" class:live={step > 0}>
				<span class="ename">v2</span>
				<div class="pair"><Server active={step > 0} slots={2} /></div>
				<span class="share">{STEPS[step]}%</span>
			</div>
		</div>
	{/if}

	<p class="bug">{tx.bugNote}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.tabs {
		display: flex;
		gap: 3px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.tabs button {
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tabs button.on {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.tabs button:disabled:not(.on) {
		opacity: 0.45;
	}
	.ctrl {
		display: flex;
		min-height: 40px;
		width: 100%;
		justify-content: center;
	}
	.cta {
		border-radius: 11px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 9px 18px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.line {
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 8px 16px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.line.small {
		padding: 5px 12px;
		font-size: 11.5px;
	}
	.cta:disabled,
	.line:disabled {
		opacity: 0.6;
	}
	.canary {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.canary b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.canary input {
		width: 100%;
		accent-color: var(--color-amber);
	}
	.ticks {
		display: flex;
		width: 100%;
		justify-content: space-between;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.ticks .on {
		color: var(--color-amber);
	}

	.crowd {
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		gap: 5px 6px;
	}
	.user {
		display: flex;
		justify-content: center;
	}
	.case {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 1.5;
		transition: stroke 0.3s ease;
	}
	.mark {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.user.bad .case {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.user.bad .mark {
		stroke: var(--color-danger);
	}
	.user.bad {
		animation: shake 0.4s ease;
	}
	@keyframes shake {
		25% {
			transform: translateX(-2px);
		}
		75% {
			transform: translateX(2px);
		}
	}
	.status {
		margin: 0;
		font-size: 12px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.status.bad {
		color: var(--color-danger);
	}
	.lb {
		border-radius: 10px;
		border: 1.5px solid var(--color-brand);
		background: var(--color-brand-soft);
		padding: 5px 14px;
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-brand);
	}

	.fleet {
		display: flex;
		gap: 12px;
	}
	.srv {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.srv :global(.server),
	.pair :global(.server) {
		width: 46px;
		gap: 4px;
		padding: 5px;
		border-radius: 8px;
		transition: border-color 0.3s ease;
	}
	.srv :global(.server .slot),
	.pair :global(.server .slot) {
		height: 8px;
	}
	.ver {
		border-radius: 6px;
		background: var(--color-paper);
		padding: 0 7px;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.srv.v2 :global(.server) {
		border-color: var(--color-danger);
	}
	.srv.v2 .ver {
		background: var(--color-danger);
		color: #fff;
	}
	.envs {
		display: flex;
		gap: 10px;
	}
	.env {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		border-radius: 13px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 10px 8px;
		opacity: 0.55;
		transition:
			opacity 0.3s ease,
			border-color 0.3s ease;
	}
	.env.live {
		opacity: 1;
	}
	.env.blue.live {
		border-color: var(--color-brand);
	}
	.env.green.live {
		border-color: var(--color-grass);
	}
	.env.canaryenv.live {
		border-color: var(--color-amber);
	}
	.ename {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.env.blue .ename {
		color: var(--color-brand);
	}
	.env.green .ename {
		color: var(--color-grass);
	}
	.pair {
		display: flex;
		gap: 5px;
	}
	.ltag,
	.share {
		position: absolute;
		top: -9px;
		right: -6px;
		border-radius: 999px;
		background: var(--color-ink);
		padding: 1px 7px;
		font-size: 9.5px;
		font-weight: 800;
		color: var(--color-paper);
	}
	.bug {
		margin: 0;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.user.bad {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
		.crowd {
			gap: 7px 10px;
		}
		.status {
			font-size: 13px;
		}
	}
</style>
