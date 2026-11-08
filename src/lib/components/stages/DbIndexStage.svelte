<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { DbIndexText } from '$lib/chapters/web/db-index/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as DbIndexText);

	const SIZES = [1_000, 100_000, 1_000_000, 100_000_000];
	const TOKENS = ['small', 'mid', 'big', 'huge'];
	// How long each lane takes on screen. The scan grows with the table, the index barely moves.
	const SCAN_MS = [1100, 2400, 3800, 5600];
	const INDEX_MS = 900;
	// Where Sari's row happens to sit in the table.
	const SPOT = 0.73;

	let sizeIdx = $state(0);
	const size = $derived(SIZES[sizeIdx]);
	const scanTotal = $derived(Math.round(size * SPOT));
	const hops = $derived(Math.ceil(Math.log2(size)));

	let running = $state(false);
	let scanP = $state(0); // 0..1
	let indexP = $state(0); // 0..1
	let ranSize = $state<number | null>(null);
	const raced = new SvelteSet<number>();
	let finished = false;
	let raf = 0;

	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	function race() {
		if (running) return;
		running = true;
		ranSize = null;
		scanP = 0;
		indexP = 0;
		const i = sizeIdx;
		if (reduced() || typeof requestAnimationFrame === 'undefined') {
			scanP = 1;
			indexP = 1;
			end(i);
			return;
		}
		const t0 = performance.now();
		const tick = (now: number) => {
			const t = now - t0;
			scanP = Math.min(1, t / SCAN_MS[i]);
			indexP = Math.min(1, t / INDEX_MS);
			if (scanP < 1 || indexP < 1) raf = requestAnimationFrame(tick);
			else end(i);
		};
		raf = requestAnimationFrame(tick);
	}

	function end(i: number) {
		running = false;
		ranSize = i;
		raced.add(i);
		onstate?.(TOKENS[i]);
		if (raced.size >= 2 && !finished) {
			finished = true;
			oncomplete?.();
		}
	}

	onDestroy(() => {
		if (raf && typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(raf);
	});

	function onSize() {
		if (running) return;
		scanP = 0;
		indexP = 0;
		ranSize = null;
	}

	const fmt = (n: number) => n.toLocaleString(tx.locale);

	// The scan reads rows at an even pace, so its counter simply follows the progress.
	const scanChecked = $derived(Math.round(scanTotal * scanP));
	const scanDone = $derived(scanP >= 1);

	// The index halves a window around Sari's spot, one hop at a time.
	const hopNow = $derived(Math.min(hops, Math.floor(indexP * hops)));
	const bracket = $derived.by(() => {
		let lo = 0;
		let hi = 1;
		for (let k = 0; k < hopNow; k++) {
			const mid = (lo + hi) / 2;
			if (SPOT < mid) hi = mid;
			else lo = mid;
		}
		return { lo, hi };
	});
	const indexDone = $derived(indexP >= 1);

	const note = $derived.by(() => {
		if (ranSize === null) return tx.idle;
		if (ranSize === 0) return tx.tie;
		const ratio = Math.round(
			Math.round(SIZES[ranSize] * SPOT) / Math.ceil(Math.log2(SIZES[ranSize]))
		);
		return tx.fasterBy.replace('{x}', fmt(ratio));
	});
</script>

<div class="wrap">
	<pre class="code"><span class="kw">SELECT</span> * <span class="kw">FROM</span> {tx.tableName}
<span class="kw">WHERE</span> {tx.emailCol} = <span class="str">'{tx.target}'</span>;</pre>

	<div class="size">
		<label for="dbi-size">{tx.sizeLabel}</label>
		<b>{tx.sizes[sizeIdx]}</b>
		<input
			id="dbi-size"
			type="range"
			min="0"
			max="3"
			step="1"
			bind:value={sizeIdx}
			oninput={onSize}
			disabled={running}
			aria-valuetext={tx.sizes[sizeIdx]}
		/>
		<div class="ticks" aria-hidden="true">
			{#each tx.sizes as s, i (i)}
				<span class:on={i === sizeIdx} class:seen={raced.has(i)}>{s}</span>
			{/each}
		</div>
	</div>

	<button
		type="button"
		class="race"
		class:pulse={!running && ranSize === null}
		onclick={race}
		disabled={running}>{raced.size ? tx.againBtn : tx.raceBtn}</button
	>

	<div class="lane">
		<div class="lhead">
			<span class="lname">{tx.scanLane}</span>
			<span class="lsub">{tx.scanSub}</span>
		</div>
		<div class="strip">
			<span class="fill" style="width:{scanP * SPOT * 100}%"></span>
			{#if scanP > 0 && !scanDone}
				<span class="cursor" style="left:{scanP * SPOT * 100}%"></span>
			{/if}
			<span class="target" class:hit={scanDone} style="left:{SPOT * 100}%"></span>
		</div>
		<div class="lfoot">
			<span class="count">{tx.checked.replace('{n}', fmt(scanChecked))}</span>
			{#if scanDone}<span class="found">{tx.foundTag}</span>{/if}
		</div>
	</div>

	<div class="lane">
		<div class="lhead">
			<span class="lname">{tx.indexLane}</span>
			<span class="lsub">{tx.indexSub}</span>
		</div>
		<div class="strip">
			<span
				class="win"
				class:live={indexP > 0}
				style="left:{bracket.lo * 100}%;width:{Math.max(0.6, (bracket.hi - bracket.lo) * 100)}%"
			></span>
			<span class="target" class:hit={indexDone} style="left:{SPOT * 100}%"></span>
		</div>
		<div class="lfoot">
			<span class="count">{tx.checked.replace('{n}', fmt(hopNow))}</span>
			{#if indexDone}<span class="found">{tx.foundTag}</span>{/if}
		</div>
	</div>

	<p class="note" role="status">{note}</p>
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
	.code {
		width: 100%;
		margin: 0;
		padding: 9px 12px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.55;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--color-ink);
	}
	.kw {
		color: var(--color-brand);
		font-weight: 700;
	}
	.str {
		color: var(--color-grass);
	}

	.size {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: baseline;
		row-gap: 4px;
		width: 100%;
	}
	.size label {
		font-size: 12px;
		color: var(--color-muted);
	}
	.size b {
		font-size: 14px;
		color: var(--color-ink);
	}
	.size input {
		grid-column: 1 / -1;
		width: 100%;
		accent-color: var(--color-brand);
	}
	.ticks {
		grid-column: 1 / -1;
		display: flex;
		justify-content: space-between;
		font-size: 10px;
		color: var(--color-faint);
	}
	.ticks span.seen {
		color: var(--color-grass);
	}
	.ticks span.on {
		color: var(--color-brand);
		font-weight: 700;
	}

	.race {
		border-radius: 12px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 600;
		transition: opacity 0.2s ease;
	}
	.race:disabled {
		opacity: 0.5;
	}
	.race.pulse {
		animation: nudge 1.8s ease-in-out infinite;
	}
	@keyframes nudge {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 5px rgba(46, 111, 224, 0.22);
		}
	}

	.lane {
		width: 100%;
		padding: 10px 12px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 6px 18px rgba(22, 40, 60, 0.06);
	}
	.lhead {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 8px;
		margin-bottom: 7px;
	}
	.lname {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.lsub {
		font-size: 11px;
		color: var(--color-faint);
	}
	/* the table as a strip of thin rows */
	.strip {
		position: relative;
		height: 24px;
		border-radius: 6px;
		border: 1px solid var(--color-line);
		background: repeating-linear-gradient(
			90deg,
			var(--color-line) 0 1px,
			var(--color-paper) 1px 5px
		);
		overflow: hidden;
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		background: color-mix(in srgb, var(--color-amber) 30%, transparent);
	}
	.cursor {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		background: var(--color-amber);
	}
	.win {
		position: absolute;
		top: 0;
		bottom: 0;
		opacity: 0;
		background: color-mix(in srgb, var(--color-brand) 22%, transparent);
		border-left: 2px solid var(--color-brand);
		border-right: 2px solid var(--color-brand);
		transition:
			left 0.12s ease,
			width 0.12s ease;
	}
	.win.live {
		opacity: 1;
	}
	.target {
		position: absolute;
		top: 50%;
		width: 10px;
		height: 10px;
		margin: -5px 0 0 -5px;
		border-radius: 50%;
		border: 2px solid var(--color-grass);
		background: var(--color-card);
		transition:
			background 0.2s ease,
			transform 0.2s ease;
	}
	.target.hit {
		background: var(--color-grass);
		transform: scale(1.25);
	}
	.lfoot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 6px;
		min-height: 20px;
	}
	.count {
		font-size: 12px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--color-muted);
	}
	.found {
		padding: 2px 9px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 11px;
		font-weight: 700;
	}

	.note {
		margin: 0;
		min-height: 1.4em;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}

	@media (min-width: 768px) {
		.code {
			font-size: 13px;
		}
		.ticks {
			font-size: 11px;
		}
		.lname {
			font-size: 14px;
		}
		.lsub,
		.count {
			font-size: 12.5px;
		}
		.strip {
			height: 30px;
		}
		.race {
			font-size: 14px;
		}
		.note {
			font-size: 14px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.race.pulse {
			animation: none;
		}
		.win,
		.target {
			transition: none;
		}
	}
</style>
