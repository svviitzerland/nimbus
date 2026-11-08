<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SubnetText } from '$lib/chapters/network/subnet/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as SubnetText);

	const MIN = 24;
	const MAX = 30;
	// Devices each plan needs, and the /number that fits them best.
	const NEEDS = [50, 12, 200];
	const ANSWERS = [26, 28, 24];
	const TOKENS = ['m1', 'm2', 'done'];

	let prefix = $state(MIN);
	let mission = $state(0);
	let finished = $state(false);
	let verdict = $state<'' | 'ok' | 'small' | 'waste'>('');
	let selCell = $state(0); // the address the learner last tapped, its room is highlighted
	let sawSplit = false;
	let sawTiny = false;
	let completed = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const size = $derived(2 ** (32 - prefix));
	const rooms = $derived(256 / size);
	const usable = $derived(size - 2);
	const selRoom = $derived(Math.floor(selCell / size));
	const first = $derived(selRoom * size);
	const last = $derived(first + size - 1);
	const mask = $derived(`255.255.255.${256 - size}`);
	const ip = (n: number) => `192.168.1.${n}`;

	function setPrefix(p: number) {
		const v = Math.max(MIN, Math.min(MAX, p));
		if (v === prefix) return;
		prefix = v;
		if (verdict !== 'ok') verdict = '';
		if (v === MAX && !sawTiny) {
			sawTiny = true;
			sawSplit = true;
			onstate?.('tiny');
		} else if (v > MIN && !sawSplit) {
			sawSplit = true;
			onstate?.('split');
		}
	}

	function check() {
		if (finished || verdict === 'ok') return;
		const need = NEEDS[mission];
		if (usable < need) {
			verdict = 'small';
			onstate?.('small');
			return;
		}
		if (prefix < ANSWERS[mission]) {
			verdict = 'waste';
			onstate?.('waste');
			return;
		}
		verdict = 'ok';
		onstate?.(TOKENS[mission]);
		if (mission === NEEDS.length - 1) {
			finished = true;
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
			return;
		}
		timer = setTimeout(() => {
			mission += 1;
			verdict = '';
		}, 1400);
	}

	// Neighbouring rooms never share a colour, even when several rooms sit on one row.
	function tone(room: number) {
		if (size >= 16) return room % 4;
		const row = Math.floor((room * size) / 16);
		return (room + row) % 4;
	}

	const statusText = $derived(
		verdict === 'ok'
			? tx.status.ok
			: verdict === 'small'
				? tx.status.small.replace('{need}', String(NEEDS[mission])).replace('{fit}', String(usable))
				: verdict === 'waste'
					? tx.status.waste
					: ''
	);

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

<div class="wrap">
	<!-- the plan to solve, with its check button -->
	<div class="mission" class:ok={verdict === 'ok'} class:bad={verdict === 'small'}>
		{#if finished}
			<span class="mlabel">✓ {tx.allDone}</span>
		{:else}
			<span class="mlabel"
				>{tx.missionLabel
					.replace('{n}', String(mission + 1))
					.replace('{total}', String(NEEDS.length))}</span
			>
			<p class="mtext">{tx.missions[mission]}</p>
			<div class="mrow">
				<button type="button" class="check" onclick={check} disabled={verdict === 'ok'}
					>{tx.checkBtn}</button
				>
				{#if statusText}
					<span class="status {verdict}">{statusText}</span>
				{/if}
			</div>
		{/if}
	</div>

	<!-- the address with its slash, and the slider that moves it -->
	<div class="cidr">
		<span class="net">192.168.1.0</span><span class="slash">/{prefix}</span>
	</div>
	<div class="slider">
		<button
			type="button"
			class="step"
			aria-label={tx.smaller}
			disabled={prefix === MIN}
			onclick={() => setPrefix(prefix - 1)}
			><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"
				><path d="M3 7h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg
			></button
		>
		<input
			type="range"
			min={MIN}
			max={MAX}
			step="1"
			value={prefix}
			aria-label="CIDR"
			oninput={(e) => setPrefix(Number((e.currentTarget as HTMLInputElement).value))}
		/>
		<button
			type="button"
			class="step"
			aria-label={tx.bigger}
			disabled={prefix === MAX}
			onclick={() => setPrefix(prefix + 1)}
			><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"
				><path
					d="M3 7h8M7 3v8"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
				/></svg
			></button
		>
	</div>

	<!-- 32 bits, the locked ones name the room, the free ones number the devices -->
	<div class="bits" aria-hidden="true">
		{#each [0, 1, 2, 3] as g (g)}
			<span class="octet">
				{#each { length: 8 }, b (b)}
					<i class:lock={g * 8 + b < prefix}>{g * 8 + b < prefix ? 1 : 0}</i>
				{/each}
			</span>
		{/each}
	</div>
	<div class="bitlegend">
		<span class="lk">{tx.locked.replace('{n}', String(prefix))}</span>
		<span class="fr">{tx.free.replace('{n}', String(32 - prefix))}</span>
	</div>
	<p class="mask">{tx.maskLabel} <code>{mask}</code></p>

	<!-- the three numbers that matter -->
	<div class="stats">
		<div><b>{rooms}</b><span>{tx.roomsLabel}</span></div>
		<div><b>{size}</b><span>{tx.sizeLabel}</span></div>
		<div class:hot={verdict === 'small'}><b>{usable}</b><span>{tx.usableLabel}</span></div>
	</div>

	<!-- the hall, 256 addresses, coloured by room -->
	<div class="hall">
		<span class="hlabel">{tx.hallLabel}</span>
		<div class="grid" role="group" aria-label={tx.tapHint}>
			{#each { length: 256 }, i (i)}
				{@const room = Math.floor(i / size)}
				{@const pos = i % size}
				<button
					type="button"
					class="c t{tone(room)}"
					class:res={pos === 0 || pos === size - 1}
					class:sel={room === selRoom}
					style="transition-delay:{i * 1.4}ms"
					aria-label={ip(i)}
					onclick={() => (selCell = i)}
				></button>
			{/each}
		</div>
		<div class="legend">
			<span><i class="sw use"></i>{tx.legendUse}</span>
			<span><i class="sw res"></i>{tx.legendRes}</span>
			<span class="tap">{tx.tapHint}</span>
		</div>
	</div>

	<!-- what is inside the room that is highlighted -->
	<div class="info">
		<b class="ititle t{tone(selRoom)}"
			>{tx.roomTitle.replace('{n}', String(selRoom + 1)).replace('{total}', String(rooms))}</b
		>
		<div class="irow">
			<span>{tx.rangeLabel}</span><code
				>{tx.range.replace('{a}', ip(first)).replace('{b}', ip(last))}</code
			>
		</div>
		<div class="irow">
			<span>{tx.nameLabel}</span><code>{ip(first)}/{prefix}</code>
		</div>
		<div class="irow">
			<span>{tx.devicesLabel}</span><code
				>{tx.range.replace('{a}', ip(first + 1)).replace('{b}', ip(last - 1))}</code
			>
		</div>
		<div class="irow">
			<span>{tx.shoutLabel}</span><code>{ip(last)}</code>
		</div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 9px;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 12px;
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}

	.mission {
		display: flex;
		width: min(94vw, 360px);
		flex-direction: column;
		gap: 5px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 14px;
		transition: border-color 0.3s;
	}
	.mission.ok {
		border-color: var(--color-grass);
	}
	.mission.bad {
		border-color: var(--color-danger);
	}
	.mlabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.mtext {
		font-size: 13px;
		font-weight: 600;
		line-height: 1.35;
		color: var(--color-ink);
	}
	.mrow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
	}
	.check {
		border-radius: 10px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 7px 14px;
		font-size: 12px;
		font-weight: 700;
		transition: filter 0.2s;
	}
	.check:enabled:hover {
		filter: brightness(1.15);
	}
	.check:disabled {
		opacity: 0.45;
	}
	.status {
		flex: 1;
		min-width: 140px;
		font-size: 11px;
		font-weight: 700;
		line-height: 1.3;
	}
	.status.ok {
		color: var(--color-grass);
	}
	.status.small {
		color: var(--color-danger);
	}
	.status.waste {
		color: var(--color-amber);
	}

	.cidr {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 22px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.slash {
		color: var(--color-brand);
	}
	.slider {
		display: flex;
		width: min(90vw, 320px);
		align-items: center;
		gap: 10px;
	}
	.slider input {
		flex: 1;
		accent-color: var(--color-brand);
		cursor: pointer;
	}
	.step {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		flex: none;
		border-radius: 50%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 18px;
		font-weight: 700;
		line-height: 1;
	}
	.step:disabled {
		opacity: 0.35;
	}

	.bits {
		display: flex;
		gap: 5px;
	}
	.octet {
		display: flex;
		gap: 1.5px;
	}
	.bits i {
		display: grid;
		place-items: center;
		width: 8px;
		height: 15px;
		border-radius: 2.5px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 7.5px;
		font-style: normal;
		font-weight: 800;
		transition:
			background 0.25s,
			color 0.25s;
	}
	.bits i.lock {
		background: var(--color-brand);
		color: #fff;
	}
	.bitlegend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 4px 14px;
		font-size: 10.5px;
		font-weight: 700;
	}
	.lk {
		color: var(--color-brand);
	}
	.fr {
		color: var(--color-grass);
	}
	.mask {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.mask code {
		color: var(--color-muted);
		font-weight: 700;
	}

	.stats {
		display: grid;
		width: min(94vw, 340px);
		grid-template-columns: repeat(3, 1fr);
		gap: 6px;
	}
	.stats div {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 4px;
		transition: border-color 0.3s;
	}
	.stats div.hot {
		border-color: var(--color-danger);
	}
	.stats b {
		font-family: var(--font-display, serif);
		font-size: 20px;
		font-weight: 600;
		line-height: 1.1;
		color: var(--color-ink);
	}
	.stats span {
		text-align: center;
		font-size: 9.5px;
		font-weight: 700;
		line-height: 1.2;
		color: var(--color-faint);
	}

	.hall {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.hlabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.grid {
		display: grid;
		width: min(84vw, 272px);
		grid-template-columns: repeat(16, 1fr);
		gap: 2px;
	}
	.c {
		--t: var(--color-brand);
		aspect-ratio: 1;
		border-radius: 3px;
		background: color-mix(in srgb, var(--t) 38%, var(--color-card));
		transition: background 0.35s ease;
		cursor: pointer;
	}
	.c.sel {
		background: color-mix(in srgb, var(--t) 88%, var(--color-card));
	}
	.c.res {
		background: color-mix(in srgb, var(--t) 12%, var(--color-card));
		box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--t) 40%, transparent);
	}
	.c.res.sel {
		background: color-mix(in srgb, var(--t) 25%, var(--color-card));
		box-shadow: inset 0 0 0 1.5px var(--t);
	}
	.t1 {
		--t: var(--color-grass);
	}
	.t2 {
		--t: var(--color-amber);
	}
	.t3 {
		--t: var(--color-muted);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 4px 12px;
		font-size: 10px;
		color: var(--color-muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.sw {
		width: 10px;
		height: 10px;
		border-radius: 3px;
	}
	.sw.use {
		background: color-mix(in srgb, var(--color-brand) 88%, var(--color-card));
	}
	.sw.res {
		background: color-mix(in srgb, var(--color-brand) 25%, var(--color-card));
		box-shadow: inset 0 0 0 1.5px var(--color-brand);
	}
	.tap {
		color: var(--color-faint);
	}

	.info {
		display: flex;
		width: min(94vw, 320px);
		flex-direction: column;
		gap: 3px;
		border-radius: 13px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.ititle {
		--t: var(--color-brand);
		font-size: 12px;
		font-weight: 800;
		color: var(--t);
	}
	.irow {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 10.5px;
	}
	.irow span {
		font-weight: 700;
		color: var(--color-faint);
	}
	.irow code {
		text-align: right;
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.c,
		.bits i {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.mission {
			width: 440px;
		}
		.mtext {
			font-size: 14px;
		}
		.cidr {
			font-size: 26px;
		}
		.bits i {
			width: 10px;
			height: 17px;
			font-size: 8.5px;
		}
		.grid {
			width: 300px;
		}
		.irow {
			font-size: 11.5px;
		}
	}
</style>
