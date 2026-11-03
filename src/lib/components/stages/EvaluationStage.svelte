<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { EvaluationText } from '$lib/chapters/ai/evaluation/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as EvaluationText);

	// Twenty patients, the risk score the model gave each one, and the truth.
	// Only three are really sick, and one healthy person scores high (real tests are never perfect).
	const SICK = [52, 74, 91];
	const HEALTHY = [4, 9, 13, 17, 21, 26, 30, 33, 38, 42, 45, 48, 57, 61, 66, 69, 80];
	type Patient = { score: number; sick: boolean; row: number };

	// ---- number line (SVG viewBox 220 x 92, from y 22) ----
	const L = 14;
	const R = 206;
	const AXIS = 86;
	const sx = (v: number) => L + (v / 100) * (R - L);

	// stack people that would overlap into rows above the line
	const PATIENTS: Patient[] = (() => {
		const all = [
			...SICK.map((score) => ({ score, sick: true })),
			...HEALTHY.map((score) => ({ score, sick: false }))
		].sort((a, b) => a.score - b.score);
		const lastX: number[] = [];
		return all.map((p) => {
			const x = sx(p.score);
			let row = lastX.findIndex((lx) => x - lx >= 10);
			if (row === -1) row = lastX.length;
			lastX[row] = x;
			return { ...p, row };
		});
	})();
	const rowY = (row: number) => AXIS - 14 - row * 22;

	let lazy = $state(false);
	let th = $state(50);

	type Outcome = 'caught' | 'missed' | 'fa' | 'cleared';
	const outcome = (p: Patient): Outcome => {
		const flagged = !lazy && p.score >= th;
		if (p.sick) return flagged ? 'caught' : 'missed';
		return flagged ? 'fa' : 'cleared';
	};
	const counts = $derived.by(() => {
		const c: Record<Outcome, number> = { caught: 0, missed: 0, fa: 0, cleared: 0 };
		for (const p of PATIENTS) c[outcome(p)]++;
		return c;
	});
	const accuracy = $derived(Math.round(((counts.caught + counts.cleared) / PATIENTS.length) * 100));

	const said = new Set<string>();
	let completed = false;
	function say(token: string) {
		if (said.has(token)) return;
		said.add(token);
		const caughtAll = said.has('catch_all') || said.has('low');
		const missedOne = said.has('miss') || said.has('best_acc');
		if (!completed && said.has('lazy') && caughtAll && missedOne) {
			completed = true;
			onstate?.('done');
			oncomplete?.();
			return;
		}
		onstate?.(token);
	}

	function setMode(isLazy: boolean) {
		if (lazy === isLazy) return;
		lazy = isLazy;
		if (isLazy) say('lazy');
	}

	function slide(v: number) {
		th = v;
		if (lazy) return;
		if (counts.caught === SICK.length) say(v < 30 ? 'low' : 'catch_all');
		else if (accuracy >= 90) say('best_acc');
		else say('miss');
	}

	const ticks = [0, 25, 50, 75, 100];
	const cards: { key: Outcome; label: () => string }[] = [
		{ key: 'caught', label: () => tx.caught },
		{ key: 'missed', label: () => tx.missed },
		{ key: 'fa', label: () => tx.falseAlarm },
		{ key: 'cleared', label: () => tx.cleared }
	];
</script>

<div class="stage">
	<div class="seg" role="radiogroup">
		<button
			type="button"
			role="radio"
			aria-checked={!lazy}
			class:on={!lazy}
			onclick={() => setMode(false)}>{tx.modeReal}</button
		>
		<button
			type="button"
			role="radio"
			aria-checked={lazy}
			class:on={lazy}
			onclick={() => setMode(true)}>{tx.modeLazy}</button
		>
	</div>

	<div class="control">
		{#if lazy}
			<p class="note">{tx.lazyNote}</p>
		{:else}
			<label for="eval-th">{tx.threshold.replace('{n}', String(th))}</label>
			<input
				id="eval-th"
				type="range"
				min="0"
				max="100"
				step="1"
				value={th}
				aria-label={tx.thresholdAria}
				oninput={(e) => slide(Number((e.currentTarget as HTMLInputElement).value))}
			/>
		{/if}
	</div>

	<svg class="chart" viewBox="0 22 220 92" role="img" aria-label={tx.chartLabel}>
		{#if !lazy}
			<rect x={sx(th)} y="24" width={Math.max(0, R - sx(th))} height={AXIS - 24} class="zone" />
			<text class="zonelabel" x={R - 2} y="32">{tx.flagged}</text>
			<line class="thline" x1={sx(th)} y1="24" x2={sx(th)} y2={AXIS + 4} />
		{/if}
		<line class="axisline" x1={L} y1={AXIS} x2={R} y2={AXIS} />
		{#each ticks as t (t)}
			<line class="axisline" x1={sx(t)} y1={AXIS} x2={sx(t)} y2={AXIS + 3} />
			<text class="tick" x={sx(t)} y={AXIS + 12}>{t}</text>
		{/each}
		<text class="axis" x={(L + R) / 2} y="110">{tx.axis}</text>

		{#each PATIENTS as p (p.score)}
			{@const o = outcome(p)}
			<g
				class="person {o}"
				class:sick={p.sick}
				transform="translate({sx(p.score)} {rowY(p.row)})"
				role="img"
				aria-label={tx.patient
					.replace('{score}', String(p.score))
					.replace('{truth}', p.sick ? tx.sick : tx.healthy)}
			>
				<circle class="ring" r="9" cy="1" />
				<circle class="head" cy="-3.2" r="2.6" />
				<path class="body" d="M-4.2 6.5 Q-4.2 0.6 0 0.6 Q4.2 0.6 4.2 6.5 Z" />
			</g>
		{/each}
	</svg>

	<div class="legend">
		<span><i class="sw sick"></i>{tx.sick}</span>
		<span><i class="sw healthy"></i>{tx.healthy}</span>
	</div>

	<div class="result">
		<div class="acc">
			<b>{accuracy}%</b>
			<span>{tx.accuracy}</span>
		</div>
		<div class="cards">
			{#each cards as c (c.key)}
				<div class="card {c.key}">
					<b>{counts[c.key]}</b>
					<span>{c.label()}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-width: 360px;
		margin: 0 auto;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 8px;
	}
	.seg {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		background: var(--color-paper);
		border: 1.5px solid var(--color-line);
		padding: 3px;
	}
	.seg button {
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.seg button.on {
		background: var(--color-card);
		color: var(--color-ink);
		box-shadow: 0 1px 4px rgba(22, 40, 60, 0.1);
	}
	.control {
		display: flex;
		width: 100%;
		min-height: 44px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
	}
	.control label {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.control input {
		width: 100%;
		accent-color: var(--color-amber);
	}
	.note {
		font-size: 12px;
		color: var(--color-faint);
		text-align: center;
	}

	.chart {
		width: 100%;
		height: auto;
		overflow: visible;
		user-select: none;
	}
	.zone {
		fill: var(--color-amber-soft);
	}
	.zonelabel {
		font-size: 8px;
		font-weight: 600;
		fill: var(--color-amber);
		text-anchor: end;
	}
	.thline {
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.axisline {
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.tick {
		font-size: 8px;
		fill: var(--color-faint);
		text-anchor: middle;
	}
	.axis {
		font-size: 9px;
		font-weight: 600;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.person .head,
	.person .body {
		fill: var(--color-muted);
		transition: fill 0.2s ease;
	}
	.person.sick .head,
	.person.sick .body {
		fill: var(--color-danger);
	}
	.ring {
		fill: none;
		stroke: transparent;
		stroke-width: 1.6;
		transition: stroke 0.2s ease;
	}
	.person.caught .ring {
		stroke: var(--color-grass);
		fill: var(--color-grass-soft);
	}
	.person.missed .ring {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.person.fa .ring {
		stroke: var(--color-amber);
		fill: var(--color-card);
	}

	.legend {
		display: flex;
		gap: 14px;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.sw {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}
	.sw.sick {
		background: var(--color-danger);
	}
	.sw.healthy {
		background: var(--color-muted);
	}

	.result {
		display: flex;
		width: 100%;
		align-items: stretch;
		gap: 8px;
	}
	.acc {
		display: flex;
		min-width: 84px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px;
	}
	.acc b {
		font-family: var(--font-display, inherit);
		font-size: 24px;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.acc span {
		font-size: 11px;
		color: var(--color-faint);
	}
	.cards {
		display: grid;
		flex: 1;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.card {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 8px;
		font-size: 11px;
		line-height: 1.2;
		color: var(--color-muted);
	}
	.card b {
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}
	.card.caught {
		border-color: var(--color-grass);
	}
	.card.caught b {
		color: var(--color-grass);
	}
	.card.missed {
		border-color: var(--color-danger);
	}
	.card.missed b {
		color: var(--color-danger);
	}
	.card.fa {
		border-color: var(--color-amber);
	}
	.card.fa b {
		color: var(--color-amber);
	}
	.card.cleared b {
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.person .head,
		.person .body,
		.ring {
			transition: none;
		}
	}
</style>
