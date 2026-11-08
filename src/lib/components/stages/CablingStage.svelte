<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CablingText } from '$lib/chapters/network/cabling/types';
	import DeviceIcon from './netbasics/DeviceIcon.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CablingText);

	type Cable = 'copper' | 'fibre';
	const DIST = [10, 50, 100, 300, 5000, 60000]; // metres
	const distText = (m: number) => (m >= 1000 ? `${m / 1000} km` : `${m} m`);
	const LIMIT = 0.2; // below this the far end cannot read the signal

	let cable = $state<Cable>('copper');
	let step = $state(0);
	const metres = $derived(DIST[step]);

	// How much of the signal survives the trip. Copper fades within metres, light within tens of km.
	const signalFor = (c: Cable, m: number) =>
		c === 'copper' ? Math.exp(-m / 75) : Math.exp(-m / 150000);

	// ---- One send ----
	type Shot = { cable: Cable; m: number; s: number; n: number };
	let shot = $state<Shot | null>(null);
	let arrived = $state(false);
	let n = 0;
	let timer: ReturnType<typeof setTimeout> | undefined;
	const seen = { copperFail: false, fibreFar: false };
	let completed = false;

	function send() {
		clearTimeout(timer);
		arrived = false;
		const s = signalFor(cable, metres);
		shot = { cable, m: metres, s, n: ++n };
		const sent = shot;
		timer = setTimeout(() => {
			arrived = true;
			const ok = sent.s >= LIMIT;
			const token =
				sent.cable === 'copper'
					? ok
						? 'copperOk'
						: 'copperFail'
					: sent.m > 100
						? 'fibreFar'
						: 'fibreOk';
			onstate?.(token);
			if (token === 'copperFail') seen.copperFail = true;
			if (token === 'fibreFar') seen.fibreFar = true;
			if (seen.copperFail && seen.fibreFar && !completed) {
				completed = true;
				oncomplete?.();
			}
		}, 1400);
	}

	// ---- The wave drawn along the cable ----
	const X0 = 34;
	const X1 = 266;
	const MID = 38;
	const rand = (i: number) => {
		const v = Math.sin(i * 12.9898) * 43758.5453;
		return v - Math.floor(v) - 0.5;
	};
	function wavePath(c: Cable, s: number) {
		const pts: string[] = [];
		const len = X1 - X0;
		for (let x = 0; x <= len; x += 2) {
			const t = x / len;
			const amp = 15 * Math.pow(s, t);
			let y: number;
			if (c === 'copper') {
				const sq = Math.sin(x * 0.32);
				const shaped = Math.sign(sq) * Math.pow(Math.abs(sq), 0.35);
				const noise = 16 * t * (1 - s) * rand(x);
				y = MID + amp * shaped + noise;
			} else {
				// crisp on and off pulses of light
				const on = Math.floor(x / 10) % 3 !== 2;
				y = MID - (on ? amp : 0);
			}
			pts.push(`${(X0 + x).toFixed(1)} ${y.toFixed(1)}`);
		}
		return 'M' + pts.join(' L');
	}

	const ok = $derived(shot ? shot.s >= LIMIT : false);
	const note = $derived(
		!shot || !arrived
			? tx.idleNote
			: ok
				? tx.okNote.replace('{t}', shot.cable === 'copper' ? tx.times.copper : tx.times.fibre)
				: tx.failNote
	);

	onDestroy(() => clearTimeout(timer));
</script>

<div class="flex h-full w-full flex-col items-center gap-3">
	<!-- controls up top -->
	<div class="controls">
		<div class="seg" role="radiogroup" aria-label={tx.copper.name + ' / ' + tx.fibre.name}>
			{#each ['copper', 'fibre'] as const as c (c)}
				<button
					type="button"
					role="radio"
					aria-checked={cable === c}
					class="opt {c}"
					class:on={cable === c}
					onclick={() => (cable = c)}
				>
					<b>{tx[c].name}</b>
					<span>{tx[c].sub}</span>
				</button>
			{/each}
		</div>

		<label class="dist">
			<span class="dlabel">{tx.distLabel}</span>
			<span class="dval"><b>{distText(metres)}</b> {tx.places[step]}</span>
			<input type="range" min="0" max={DIST.length - 1} step="1" bind:value={step} />
		</label>

		<button type="button" class="cta" onclick={send}>{tx.sendBtn}</button>
	</div>

	<!-- the cable, the two ends, and the signal travelling along it -->
	<div class="scene">
		<svg viewBox="0 0 300 78" class="wire" aria-hidden="true">
			{#if shot}
				{#key shot.n}
					<path d={wavePath(shot.cable, shot.s)} class="wave {shot.cable}" />
					<rect x={X0} y="0" width={X1 - X0 + 6} height="66" class="cover" />
				{/key}
			{/if}
			<line x1={X0} y1={MID} x2={X1} y2={MID} class="cable {cable}" />
			<text x="150" y="74" class="len">{distText(metres)}</text>
		</svg>
		<div class="endA">
			<span class="ic"><DeviceIcon kind="laptop" size={30} /></span>
			<span class="nm">{tx.youLabel}</span>
		</div>
		<div class="endB" class:bad={arrived && !ok} class:good={arrived && ok}>
			<span class="ic"><DeviceIcon kind="server" size={30} /></span>
			<span class="nm">{tx.farLabel}</span>
		</div>
		<span class="file">{tx.fileLabel}</span>
	</div>

	<!-- what is left when it arrives -->
	<div class="meter" class:show={arrived}>
		<span class="mlabel">{tx.signalLabel}</span>
		<div class="track">
			<span
				class="fill"
				class:bad={!ok}
				style="width:{arrived && shot ? Math.max(shot.s * 100, 1.5) : 0}%"
			></span>
			<span class="limit" style="left:{LIMIT * 100}%"><i>{tx.limitLabel}</i></span>
		</div>
	</div>

	<p class="note" class:bad={arrived && !ok} class:good={arrived && ok}>{note}</p>
</div>

<style>
	.controls {
		display: flex;
		width: min(94vw, 360px);
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.seg {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.opt {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 8px;
		line-height: 1.2;
		color: var(--color-muted);
		transition: border-color 0.2s ease;
	}
	.opt b {
		font-size: 12.5px;
		font-weight: 800;
	}
	.opt span {
		font-size: 9.5px;
		font-weight: 600;
	}
	.opt.copper.on {
		border-color: var(--color-amber);
		color: var(--color-ink);
	}
	.opt.fibre.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.dist {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 2px;
	}
	.dlabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.dval {
		font-size: 12px;
		color: var(--color-muted);
	}
	.dval b {
		color: var(--color-ink);
		font-weight: 800;
	}
	.dist input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 22px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.16);
		transition: filter 0.2s ease;
	}
	.cta:hover {
		filter: brightness(1.18);
	}

	.scene {
		position: relative;
		width: min(94vw, 360px);
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 26px 0 4px;
	}
	.wire {
		display: block;
		width: 100%;
		height: auto;
	}
	.cable {
		opacity: 0.7;
		stroke-width: 3;
		stroke-linecap: round;
	}
	.cable.copper {
		stroke: color-mix(in srgb, var(--color-amber) 45%, var(--color-line));
	}
	.cable.fibre {
		stroke: color-mix(in srgb, var(--color-brand) 35%, var(--color-line));
		stroke-width: 2;
	}
	.wave {
		fill: none;
		stroke-width: 1.8;
		stroke-linejoin: round;
	}
	.wave.copper {
		stroke: var(--color-amber);
	}
	.wave.fibre {
		stroke: var(--color-brand);
	}
	.cover {
		fill: var(--color-card);
		transform-box: fill-box;
		transform-origin: right center;
		animation: reveal 1.3s linear forwards;
	}
	@keyframes reveal {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
	.len {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 800;
		text-anchor: middle;
	}
	.endA,
	.endB {
		position: absolute;
		top: 46px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		background: var(--color-card);
		padding: 2px;
	}
	.endA {
		left: 2px;
	}
	.endB {
		right: 2px;
		border-radius: 10px;
		transition: box-shadow 0.3s ease;
	}
	.endB.good {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-grass) 35%, transparent);
	}
	.endB.bad {
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 35%, transparent);
	}
	.ic {
		line-height: 0;
		color: var(--color-ink);
	}
	.nm {
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.file {
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 1px 9px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}

	.meter {
		display: flex;
		width: min(94vw, 360px);
		flex-direction: column;
		gap: 4px;
		opacity: 0.35;
		transition: opacity 0.3s ease;
	}
	.meter.show {
		opacity: 1;
	}
	.mlabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.track {
		position: relative;
		height: 10px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: var(--color-grass);
		transition: width 0.5s ease;
	}
	.fill.bad {
		background: var(--color-danger);
	}
	.limit {
		position: absolute;
		top: -3px;
		bottom: -3px;
		width: 2px;
		background: var(--color-ink);
	}
	.limit i {
		position: absolute;
		top: 15px;
		left: 50%;
		transform: translateX(-50%);
		font-style: normal;
		font-size: 9px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}

	.note {
		min-height: 1.4em;
		max-width: 340px;
		margin-top: 8px;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.note.good {
		color: var(--color-grass);
	}
	.note.bad {
		color: var(--color-danger);
	}

	@media (prefers-reduced-motion: reduce) {
		.cover {
			animation-duration: 0.01s;
		}
		.fill {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.controls,
		.scene,
		.meter {
			width: 460px;
		}
		.opt b {
			font-size: 13.5px;
		}
		.dval {
			font-size: 13.5px;
		}
		.nm {
			font-size: 11px;
		}
		.note {
			font-size: 14px;
			max-width: 460px;
		}
	}
</style>
