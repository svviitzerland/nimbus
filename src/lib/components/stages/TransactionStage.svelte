<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { TransactionText } from '$lib/chapters/web/transaction/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as TransactionText);

	const START = { adi: 120000, bima: 85000 };
	const TOTAL = START.adi + START.bima;
	const AMOUNT = 50000;

	let adi = $state(START.adi);
	let bima = $state(START.bima);
	let useTx = $state(false);
	let running = $state(false);
	let server = $state<'idle' | 'busy' | 'down' | 'back'>('idle');
	let flash = $state<{ adi: '' | 'down' | 'up'; bima: '' | 'down' | 'up' }>({ adi: '', bima: '' });

	type Kind = 'kw' | 'stmt' | 'crash' | 'ok' | 'undo';
	type Line = { kind: Kind; kw: string; rest: string };
	let log = $state<Line[]>([]);
	let current = $state(-1);

	const seen = new SvelteSet<string>();
	let finished = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	onDestroy(() => timers.forEach(clearTimeout));

	const fmt = (n: number) => `${tx.currency} ${n.toLocaleString(tx.locale)}`;
	const total = $derived(adi + bima);
	const lost = $derived(TOTAL - total);

	function update(sign: '-' | '+', who: string): Line {
		return {
			kind: 'stmt',
			kw: 'UPDATE',
			rest: `${tx.tableName} SET ${tx.balanceCol} = ${tx.balanceCol} ${sign} ${AMOUNT} WHERE ${tx.nameCol} = '${who}';`
		};
	}

	type Step = { line: Line; act?: () => void; wait: number };

	function play(crash: boolean) {
		if (running) return;
		running = true;
		// Every run starts from the same balances, so each result is easy to compare.
		adi = START.adi;
		bima = START.bima;
		flash = { adi: '', bima: '' };
		log = [];
		current = -1;
		server = 'busy';
		const withTx = useTx;
		const steps: Step[] = [];
		if (withTx) steps.push({ line: { kind: 'kw', kw: 'BEGIN;', rest: '' }, wait: 650 });
		steps.push({
			line: update('-', tx.sender),
			act: () => {
				adi -= AMOUNT;
				flash.adi = 'down';
			},
			wait: 900
		});
		if (crash) {
			steps.push({
				line: { kind: 'crash', kw: '', rest: tx.crashLine },
				act: () => (server = 'down'),
				wait: 1500
			});
			if (withTx)
				steps.push({
					line: { kind: 'undo', kw: 'ROLLBACK;', rest: '' },
					act: () => {
						server = 'back';
						adi += AMOUNT;
						flash.adi = 'up';
					},
					wait: 900
				});
		} else {
			steps.push({
				line: update('+', tx.receiver),
				act: () => {
					bima += AMOUNT;
					flash.bima = 'up';
				},
				wait: 900
			});
			if (withTx) steps.push({ line: { kind: 'ok', kw: 'COMMIT;', rest: '' }, wait: 700 });
		}

		let t = 250;
		steps.forEach((s, i) => {
			timers.push(
				setTimeout(() => {
					flash = { adi: '', bima: '' };
					log = [...log, s.line];
					current = i;
					s.act?.();
				}, t)
			);
			t += s.wait;
		});
		timers.push(
			setTimeout(() => {
				running = false;
				current = -1;
				if (server === 'down') server = 'back';
				else if (server === 'busy') server = 'idle';
				const token = crash ? (withTx ? 'rollback' : 'vanish') : withTx ? 'commit' : 'ok';
				seen.add(token);
				onstate?.(token);
				if (seen.has('vanish') && seen.has('rollback') && !finished) {
					finished = true;
					oncomplete?.();
				}
			}, t)
		);
	}

	const sendLabel = $derived(
		tx.sendBtn.replace('{amount}', fmt(AMOUNT)).replace('{who}', tx.receiver)
	);
</script>

<div class="wrap">
	<div class="controls">
		<button
			type="button"
			class="switch"
			class:on={useTx}
			role="switch"
			aria-checked={useTx}
			disabled={running}
			onclick={() => (useTx = !useTx)}
		>
			<span class="track" aria-hidden="true"><span class="knob"></span></span>
			<span class="slabel">{tx.txLabel}</span>
			<b>{useTx ? tx.txOn : tx.txOff}</b>
		</button>
		<div class="acts">
			<button type="button" class="cta" disabled={running} onclick={() => play(false)}
				>{sendLabel}</button
			>
			<button type="button" class="crash" disabled={running} onclick={() => play(true)}
				>{tx.crashBtn}</button
			>
		</div>
	</div>

	<div class="scene">
		<div class="acct" class:down={flash.adi === 'down'} class:up={flash.adi === 'up'}>
			<span class="who">{tx.accountOf.replace('{who}', tx.sender)}</span>
			<b class="bal">{fmt(adi)}</b>
		</div>
		<div class="srv" class:down={server === 'down'}>
			<Server active={server === 'busy' || server === 'back'} />
			<span class="slabel2">{tx.serverLabel}</span>
			{#if server === 'down'}
				<span class="tag bad">{tx.crashedTag}</span>
			{:else if server === 'back'}
				<span class="tag good">{tx.backTag}</span>
			{/if}
		</div>
		<div class="acct" class:down={flash.bima === 'down'} class:up={flash.bima === 'up'}>
			<span class="who">{tx.accountOf.replace('{who}', tx.receiver)}</span>
			<b class="bal">{fmt(bima)}</b>
		</div>
	</div>

	<div class="total" class:lost={lost > 0}>
		<span>{tx.totalLabel}</span>
		<b>{fmt(total)}</b>
		<em>{lost > 0 ? tx.totalLost.replace('{amount}', fmt(lost)) : tx.totalOk}</em>
	</div>

	<div class="log">
		<p class="cap">{tx.logLabel}</p>
		<div class="lines">
			{#each log as l, i (i)}
				<div class="line {l.kind}" class:cur={i === current}>
					{#if l.kind === 'crash'}
						<svg viewBox="0 0 16 16" aria-hidden="true"
							><path d="M9 1 3 9h4l-1 6 6-8H8z" fill="currentColor" /></svg
						>
						<span>{l.rest}</span>
					{:else}
						<code><b>{l.kw}</b> {l.rest}</code>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 480px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 8px;
	}

	/* ---- Controls up top ---- */
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 13px;
		color: var(--color-ink);
	}
	.switch b {
		min-width: 3.5em;
		text-align: left;
		color: var(--color-faint);
	}
	.switch.on b {
		color: var(--color-grass);
	}
	.track {
		position: relative;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(22, 40, 60, 0.25);
		transition: transform 0.2s ease;
	}
	.switch.on .track {
		background: var(--color-grass);
	}
	.switch.on .knob {
		transform: translateX(14px);
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta,
	.crash {
		border-radius: 12px;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
	}
	.cta {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.crash {
		border: 1px solid var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.cta:enabled:hover,
	.crash:enabled:hover {
		filter: brightness(1.1);
	}
	.cta:disabled,
	.crash:disabled,
	.switch:disabled {
		opacity: 0.5;
	}

	/* ---- Accounts and the server ---- */
	.scene {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		width: 100%;
	}
	.acct {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		min-width: 0;
		padding: 10px 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 6px 18px rgba(22, 40, 60, 0.06);
		transition:
			background 0.3s ease,
			border-color 0.3s ease;
	}
	.acct.down {
		background: var(--color-danger-soft);
		border-color: var(--color-danger);
	}
	.acct.up {
		background: var(--color-grass-soft);
		border-color: var(--color-grass);
	}
	.who {
		font-size: 11px;
		color: var(--color-muted);
		text-align: center;
	}
	.bal {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.srv {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		transition: filter 0.3s ease;
	}
	.srv :global(.server) {
		width: 58px;
		padding: 7px;
		gap: 6px;
		border-radius: 10px;
	}
	.srv :global(.server .slot) {
		height: 9px;
	}
	.srv.down :global(.server) {
		border-color: var(--color-danger);
		animation: shake 0.35s ease 2;
	}
	.srv.down {
		filter: grayscale(0.7);
	}
	@keyframes shake {
		25% {
			transform: translateX(-3px);
		}
		75% {
			transform: translateX(3px);
		}
	}
	.slabel2 {
		font-size: 10px;
		color: var(--color-muted);
		text-align: center;
		max-width: 80px;
		line-height: 1.2;
	}
	.tag {
		position: absolute;
		top: -12px;
		left: 50%;
		transform: translateX(-50%);
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 10px;
		font-weight: 700;
		white-space: nowrap;
		color: #fff;
	}
	.tag.bad {
		background: var(--color-danger);
	}
	.tag.good {
		background: var(--color-grass);
	}

	/* ---- Total ---- */
	.total {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: center;
		gap: 4px 10px;
		width: 100%;
		padding: 8px 12px;
		border-radius: 12px;
		background: var(--color-grass-soft);
		color: var(--color-ink);
		font-size: 12px;
		transition: background 0.3s ease;
	}
	.total b {
		font-size: 14px;
		font-variant-numeric: tabular-nums;
	}
	.total em {
		font-style: normal;
		font-weight: 700;
		color: var(--color-grass);
	}
	.total.lost {
		background: var(--color-danger-soft);
	}
	.total.lost em {
		color: var(--color-danger);
	}

	/* ---- The log of statements ---- */
	.log {
		width: 100%;
	}
	.cap {
		margin: 0 0 6px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.lines {
		min-height: 64px;
		padding: 8px 10px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
	}
	.line {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 3px 6px;
		border-radius: 6px;
		font-size: 11.5px;
		line-height: 1.45;
		color: var(--color-ink);
		animation: linein 0.25s ease both;
		transition: background 0.2s ease;
	}
	.line code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		overflow-wrap: anywhere;
	}
	.line b {
		color: var(--color-brand);
	}
	.line.cur {
		background: var(--color-brand-soft);
	}
	.line.crash {
		background: var(--color-danger-soft);
		color: var(--color-danger);
		font-weight: 700;
	}
	.line.crash svg {
		width: 13px;
		height: 13px;
		flex: none;
	}
	.line.undo b {
		color: var(--color-amber);
	}
	.line.ok b {
		color: var(--color-grass);
	}
	@keyframes linein {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}

	@media (min-width: 768px) {
		.who {
			font-size: 12px;
		}
		.bal,
		.total b {
			font-size: 16px;
		}
		.line {
			font-size: 12.5px;
		}
		.srv :global(.server) {
			width: 70px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.line,
		.srv.down :global(.server) {
			animation: none;
		}
		.acct,
		.track,
		.knob,
		.total {
			transition: none;
		}
	}
</style>
