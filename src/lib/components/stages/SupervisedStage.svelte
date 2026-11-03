<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SupervisedText } from '$lib/chapters/ai/supervised/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as SupervisedText);

	// One pile of songs. x is tempo, y is energy (both 0 to 10), g is the tag people gave it
	// (0 chill, 1 dance, 2 rock). The unsupervised side never looks at g.
	const SONGS = [
		{ x: 1.5, y: 2, g: 0 },
		{ x: 2.5, y: 1.4, g: 0 },
		{ x: 2, y: 3, g: 0 },
		{ x: 3, y: 2.4, g: 0 },
		{ x: 1.2, y: 1.2, g: 0 },
		{ x: 2.8, y: 3.2, g: 0 },
		{ x: 7.5, y: 7, g: 1 },
		{ x: 8.5, y: 8, g: 1 },
		{ x: 8.8, y: 6.8, g: 1 },
		{ x: 7.2, y: 8.2, g: 1 },
		{ x: 8, y: 6.2, g: 1 },
		{ x: 9.2, y: 7.8, g: 1 },
		{ x: 4, y: 8.5, g: 2 },
		{ x: 5, y: 9, g: 2 },
		{ x: 4.6, y: 7.6, g: 2 },
		{ x: 3.6, y: 7.8, g: 2 },
		{ x: 5.4, y: 8, g: 2 },
		{ x: 4.2, y: 9.3, g: 2 }
	];
	// where the searching rings start, deliberately in the middle so you can watch them travel
	const STARTS = [
		{ x: 3, y: 5 },
		{ x: 7, y: 5 },
		{ x: 5, y: 2.5 },
		{ x: 5, y: 8 }
	];
	const COLORS = [
		'var(--color-brand)',
		'var(--color-grass)',
		'var(--color-amber)',
		'var(--color-danger)'
	];

	// chart frame, SVG viewBox 220 x 196
	const L = 30;
	const R = 212;
	const T = 10;
	const B = 160;
	const sx = (v: number) => L + (v / 10) * (R - L);
	const sy = (v: number) => B - (v / 10) * (B - T);
	const d2 = (a: { x: number; y: number }, b: { x: number; y: number }) =>
		(a.x - b.x) ** 2 + (a.y - b.y) ** 2;

	let mode = $state<'sup' | 'unsup'>('sup');
	let didSup = false;
	let didUnsup = false;
	let saidUnsupMode = false;
	let completed = false;
	function check() {
		if (didSup && didUnsup && !completed) {
			completed = true;
			oncomplete?.();
		}
	}

	function setMode(m: 'sup' | 'unsup') {
		mode = m;
		if (m === 'unsup' && !saidUnsupMode) {
			saidUnsupMode = true;
			onstate?.('unsup_mode');
		}
	}

	// ---- supervised: a new song takes the most common tag of its three nearest songs ----
	let svg = $state<SVGSVGElement>();
	let drop = $state<{ x: number; y: number; g: number; near: number[] } | null>(null);
	function tag(p: { x: number; y: number }) {
		const near = SONGS.map((s, i) => ({ i, d: d2(s, p) }))
			.sort((a, b) => a.d - b.d)
			.slice(0, 3)
			.map((n) => n.i);
		const votes = [0, 0, 0];
		for (const i of near) votes[SONGS[i].g]++;
		const top = Math.max(...votes);
		// a three way tie goes to the very closest song
		const g = top === 1 ? SONGS[near[0]].g : votes.indexOf(top);
		return { g, near };
	}
	function place(e: MouseEvent) {
		if (mode !== 'sup' || !svg) return;
		const box = svg.getBoundingClientRect();
		const px = ((e.clientX - box.left) / box.width) * 220;
		const py = ((e.clientY - box.top) / box.height) * 196;
		if (px < L - 4 || px > R + 4 || py < T - 4 || py > B + 4) return;
		const p = {
			x: Math.max(0, Math.min(10, ((px - L) / (R - L)) * 10)),
			y: Math.max(0, Math.min(10, ((B - py) / (B - T)) * 10))
		};
		drop = { ...p, ...tag(p) };
		onstate?.('sup_guess');
		didSup = true;
		check();
	}

	// ---- unsupervised: k means, rings grab their closest songs then move to the middle ----
	let k = $state(3);
	let centres = $state<{ x: number; y: number }[]>([]);
	let assign = $state<number[] | null>(null);
	let rounds = $state(0);
	let running = $state(false);
	let settled = $state(false);
	let timer: ReturnType<typeof setInterval> | undefined;

	function nearestCentre(s: { x: number; y: number }, cs: { x: number; y: number }[]) {
		let best = 0;
		for (let i = 1; i < cs.length; i++) if (d2(s, cs[i]) < d2(s, cs[best])) best = i;
		return best;
	}
	function assignStep() {
		const next = SONGS.map((s) => nearestCentre(s, centres));
		const same = assign !== null && next.every((v, i) => v === assign![i]);
		assign = next;
		return same;
	}
	function moveStep() {
		centres = centres.map((c, i) => {
			const mine = SONGS.filter((_, j) => assign![j] === i);
			if (mine.length === 0) return c;
			return {
				x: mine.reduce((s, p) => s + p.x, 0) / mine.length,
				y: mine.reduce((s, p) => s + p.y, 0) / mine.length
			};
		});
	}
	function finish() {
		clearInterval(timer);
		timer = undefined;
		running = false;
		settled = true;
		// three groups that match the tags people gave, in some order
		const matches =
			k === 3 &&
			[0, 1, 2].every((g) => {
				const ids = SONGS.map((s, j) => (s.g === g ? assign![j] : -1)).filter((v) => v >= 0);
				return ids.every((v) => v === ids[0]);
			});
		onstate?.(matches ? 'found3' : 'foundk');
		didUnsup = true;
		check();
	}
	function find() {
		if (running) return;
		clearInterval(timer);
		centres = STARTS.slice(0, k).map((c) => ({ ...c }));
		assign = null;
		rounds = 0;
		settled = false;
		running = true;
		onstate?.('unsup_go');
		const reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			for (let r = 0; r < 30; r++) {
				rounds++;
				if (assignStep()) break;
				moveStep();
			}
			finish();
			return;
		}
		let half = 0;
		timer = setInterval(() => {
			if (half % 2 === 0) {
				rounds++;
				if (assignStep() || rounds > 30) {
					finish();
					return;
				}
			} else moveStep();
			half++;
		}, 650);
	}
	function pickK(n: number) {
		if (running) return;
		k = n;
		centres = [];
		assign = null;
		settled = false;
		rounds = 0;
	}

	function reset() {
		clearInterval(timer);
		timer = undefined;
		running = false;
		drop = null;
		pickK(3);
	}

	onDestroy(() => clearInterval(timer));

	const songColor = (i: number) => {
		if (mode === 'sup') return COLORS[SONGS[i].g];
		if (assign) return COLORS[assign[i]];
		return 'var(--color-faint)';
	};
</script>

{#snippet note(x: number, y: number, color: string, big: boolean)}
	<g transform="translate({sx(x)} {sy(y)}) scale({big ? 1.4 : 1})" class="note">
		<line x1="2.6" y1="1.6" x2="2.6" y2="-6.5" style="stroke:{color}" />
		<path d="M2.6 -6.5 q3 1 3.6 3.6" style="stroke:{color}" class="flag" />
		<ellipse cx="0" cy="2" rx="3.2" ry="2.5" transform="rotate(-20 0 2)" style="fill:{color}" />
	</g>
{/snippet}

<div class="stage">
	<div class="tabs" role="tablist">
		<button
			type="button"
			role="tab"
			aria-selected={mode === 'sup'}
			class:on={mode === 'sup'}
			onclick={() => setMode('sup')}>{tx.modeSup}</button
		>
		<button
			type="button"
			role="tab"
			aria-selected={mode === 'unsup'}
			class:on={mode === 'unsup'}
			onclick={() => setMode('unsup')}>{tx.modeUnsup}</button
		>
	</div>

	<div class="control">
		{#if mode === 'sup'}
			{#if drop}
				<p class="answer" style="color:{COLORS[drop.g]}">
					{tx.supAnswer.replace('{label}', tx.genres[drop.g])}
				</p>
			{/if}
			<p class="hint">{tx.supHint}</p>
		{:else}
			<div class="krow">
				<span class="klabel">{tx.groups}</span>
				{#each [2, 3, 4] as n (n)}
					<button
						type="button"
						class="kbtn"
						class:on={k === n}
						disabled={running}
						aria-pressed={k === n}
						onclick={() => pickK(n)}>{n}</button
					>
				{/each}
				<CallToActionButton onclick={find} disabled={running}>{tx.findBtn}</CallToActionButton>
			</div>
			<p class="hint">
				{running
					? tx.round.replace('{n}', String(rounds))
					: settled
						? tx.found.replace('{k}', String(k)).replace('{n}', String(rounds))
						: tx.unsupHint}
			</p>
		{/if}
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<svg
		bind:this={svg}
		class="chart"
		class:tap={mode === 'sup'}
		viewBox="0 0 220 196"
		role="img"
		aria-label={tx.title}
		onclick={place}
	>
		<rect x={L} y={T} width={R - L} height={B - T} class="frame" />
		<text class="axis" x={(L + R) / 2} y="178">{tx.xAxis}</text>
		<text class="axis" transform="translate(14 {(T + B) / 2}) rotate(-90)">{tx.yAxis}</text>

		{#if mode === 'sup' && drop}
			{#each drop.near as i (i)}
				<line
					class="vote"
					x1={sx(drop.x)}
					y1={sy(drop.y)}
					x2={sx(SONGS[i].x)}
					y2={sy(SONGS[i].y)}
				/>
			{/each}
		{/if}

		{#each SONGS as s, i (i)}
			{@render note(s.x, s.y, songColor(i), false)}
		{/each}

		{#if mode === 'sup' && drop}
			<circle
				class="new ring"
				cx={sx(drop.x)}
				cy={sy(drop.y)}
				r="11"
				style="stroke:{COLORS[drop.g]}"
			/>
			{@render note(drop.x, drop.y, COLORS[drop.g], true)}
		{/if}

		{#if mode === 'unsup'}
			{#each centres as c, i (i)}
				<g class="centre" style="transform:translate({sx(c.x)}px, {sy(c.y)}px)">
					<circle r="12" style="stroke:{COLORS[i]}" class="ring" />
					<path d="M-4 0 H4 M0 -4 V4" style="stroke:{COLORS[i]}" />
				</g>
			{/each}
		{/if}
	</svg>

	<div class="legend">
		{#if mode === 'sup'}
			{#each tx.genres as g, i (i)}
				<span><i style="background:{COLORS[i]}"></i>{g}</span>
			{/each}
		{:else if settled}
			{#each centres as _, i (i)}
				<span
					><i style="background:{COLORS[i]}"></i>{tx.groupName.replace('{n}', String(i + 1))}</span
				>
			{/each}
		{/if}
		{#if (mode === 'sup' && drop) || (mode === 'unsup' && (settled || assign))}
			<button type="button" class="ghost" onclick={reset}>{tx.reset}</button>
		{/if}
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 8px;
	}
	.tabs {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		background: var(--color-paper);
		border: 1.5px solid var(--color-line);
		padding: 3px;
	}
	.tabs button {
		border-radius: 9px;
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.tabs button.on {
		background: var(--color-card);
		color: var(--color-ink);
		box-shadow: 0 1px 4px rgba(22, 40, 60, 0.1);
	}
	.control {
		display: flex;
		min-height: 72px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.answer {
		font-size: 14px;
		font-weight: 700;
		text-align: center;
	}
	.hint {
		font-size: 12px;
		color: var(--color-faint);
		text-align: center;
	}
	.krow {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.krow :global(.cta) {
		margin-left: 6px;
		padding: 9px 16px;
		font-size: 13px;
	}
	.klabel {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.kbtn {
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.kbtn.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.kbtn:disabled {
		opacity: 0.5;
	}

	.chart {
		width: 100%;
		max-width: 360px;
		height: auto;
		overflow: visible;
		user-select: none;
	}
	.chart.tap {
		cursor: crosshair;
	}
	.frame {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.axis {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.note line,
	.note .flag {
		fill: none;
		stroke-width: 1.3;
		stroke-linecap: round;
	}
	.note ellipse,
	.note line {
		transition:
			fill 0.35s ease,
			stroke 0.35s ease;
	}
	.vote {
		stroke: var(--color-ink);
		stroke-opacity: 0.3;
		stroke-width: 1.2;
	}
	.ring {
		fill: none;
		stroke-width: 2;
	}
	.ring.new {
		stroke-opacity: 0.5;
	}
	.centre {
		transition: transform 0.55s cubic-bezier(0.3, 0.7, 0.2, 1);
	}
	.centre path {
		stroke-width: 2;
		stroke-linecap: round;
	}
	.centre .ring {
		fill: var(--color-card);
		fill-opacity: 0.4;
	}

	.legend {
		display: flex;
		min-height: 28px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 12px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.legend i {
		width: 10px;
		height: 10px;
		border-radius: 50%;
	}
	.ghost {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 4px 6px;
	}
	.ghost:hover {
		color: var(--color-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		.centre,
		.note ellipse,
		.note line {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.chart {
			max-width: 440px;
		}
	}
</style>
