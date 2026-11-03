<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { VisionText } from '$lib/chapters/ai/vision/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as VisionText);

	const N = 10;
	const GOAL = 3;
	const OBJECTS = ['line', 'cross', 'box', 'ring'] as const;
	type Obj = (typeof OBJECTS)[number];

	let px = $state<boolean[]>(Array(N * N).fill(false));
	const at = (g: boolean[], r: number, c: number) =>
		r >= 0 && r < N && c >= 0 && c < N && g[r * N + c];

	// ---- layer 1, every filled pixel checks its neighbours for edges ----
	type Cell = { h: boolean; v: boolean; d1: boolean; d2: boolean; orth: number; diag: number };
	const cells = $derived(
		px.map((on, k): Cell | null => {
			if (!on) return null;
			const r = Math.floor(k / N);
			const c = k % N;
			const L = at(px, r, c - 1);
			const R = at(px, r, c + 1);
			const U = at(px, r - 1, c);
			const D = at(px, r + 1, c);
			const UR = at(px, r - 1, c + 1);
			const DL = at(px, r + 1, c - 1);
			const UL = at(px, r - 1, c - 1);
			const DR = at(px, r + 1, c + 1);
			return {
				h: L || R,
				v: U || D,
				d1: UR || DL,
				d2: UL || DR,
				orth: +L + +R + +U + +D,
				diag: +UR + +DL + +UL + +DR
			};
		})
	);
	const edgeOn = (c: Cell | null, k: number) =>
		!!c && (k === 0 ? c.h : k === 1 ? c.v : k === 2 ? c.d1 : c.d2);

	// ---- layer 2, edges combine into shape parts ----
	// empty pixels that cannot reach the border are walled in by a closed loop
	const inside = $derived.by(() => {
		const seen = Array(N * N).fill(false);
		const queue: number[] = [];
		for (let k = 0; k < N * N; k++) {
			const r = Math.floor(k / N);
			const c = k % N;
			if ((r === 0 || c === 0 || r === N - 1 || c === N - 1) && !px[k]) {
				seen[k] = true;
				queue.push(k);
			}
		}
		while (queue.length) {
			const k = queue.pop()!;
			const r = Math.floor(k / N);
			const c = k % N;
			for (const [dr, dc] of [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			]) {
				const rr = r + dr;
				const cc = c + dc;
				if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
				const j = rr * N + cc;
				if (!seen[j] && !px[j]) {
					seen[j] = true;
					queue.push(j);
				}
			}
		}
		return px.map((on, k) => !on && !seen[k]);
	});

	const parts = $derived.by(() => {
		let straight = 0;
		let slant = 0;
		let corners = 0;
		let crossing = 0;
		let linked = 0;
		for (const c of cells) {
			if (!c) continue;
			if (c.orth + c.diag > 0) linked++;
			if (c.h || c.v) straight++;
			if ((c.d1 || c.d2) && !c.h && !c.v) slant++;
			if (c.orth === 2 && c.h && c.v) corners++;
			if ((c.orth >= 3 && c.diag === 0) || (c.diag >= 3 && c.orth === 0)) crossing++;
		}
		const loop = inside.some(Boolean);
		return { straight, slant, corners, crossing, loop, linked };
	});
	const count = $derived(px.filter(Boolean).length);

	// how strongly each shape part chip glows, 0 to 1
	const partGlow = $derived([
		Math.min(1, parts.straight / 8),
		Math.min(1, parts.slant / 4),
		Math.min(1, parts.corners / 4),
		parts.crossing ? 1 : 0,
		parts.loop ? 1 : 0
	]);
	const partValue = $derived([
		String(parts.straight),
		String(parts.slant),
		String(parts.corners),
		String(parts.crossing),
		parts.loop ? '✓' : '0'
	]);

	// ---- layer 3, shape parts vote on an object ----
	const scores = $derived.by((): number[] => {
		if (count < 3) return [0, 0, 0, 0];
		const p = parts;
		const round = p.slant + Math.max(0, p.corners - 4);
		const share = p.linked / count;
		const raw = p.loop
			? [0.2, 0.2, 3 - Math.min(2.8, round * 0.7), 0.2 + Math.min(2.8, round * 0.7)]
			: p.crossing
				? [0.5, 3, 0.2, 0.2]
				: [0.2 + 2.8 * share, 0.2, 0.2, 0.2];
		const sum = raw.reduce((a, b) => a + b, 0);
		return raw.map((v) => v / sum);
	});
	const best = $derived.by(() => {
		let k = 0;
		for (let i = 1; i < 4; i++) if (scores[i] > scores[k]) k = i;
		return scores[k] >= 0.5 ? k : -1;
	});
	const guessText = $derived(best < 0 ? tx.unsure : tx.guess.replace('{x}', tx.objects[best]));

	// ---- drawing with a finger, mouse, or keyboard ----
	let gridEl = $state<HTMLDivElement>();
	let painting = false;
	let paintValue = true;
	let changed = false;

	function cellAt(ev: PointerEvent) {
		if (!gridEl) return -1;
		const rect = gridEl.getBoundingClientRect();
		const c = Math.floor(((ev.clientX - rect.left) / rect.width) * N);
		const r = Math.floor(((ev.clientY - rect.top) / rect.height) * N);
		if (r < 0 || r >= N || c < 0 || c >= N) return -1;
		return r * N + c;
	}
	function paint(k: number, v: boolean) {
		if (k < 0 || px[k] === v) return;
		px = px.map((p, i) => (i === k ? v : p));
		changed = true;
	}
	function down(ev: PointerEvent) {
		const k = cellAt(ev);
		if (k < 0) return;
		ev.preventDefault();
		painting = true;
		paintValue = !px[k];
		changed = false;
		gridEl?.setPointerCapture(ev.pointerId);
		paint(k, paintValue);
	}
	function move(ev: PointerEvent) {
		if (!painting) return;
		paint(cellAt(ev), paintValue);
	}
	function up() {
		if (!painting) return;
		painting = false;
		if (changed) judge();
	}
	function keyCell(ev: KeyboardEvent, k: number) {
		if (ev.key !== 'Enter' && ev.key !== ' ') return;
		ev.preventDefault();
		paint(k, !px[k]);
		judge();
	}

	// ---- what Nim says after each stroke ----
	const seen = new SvelteSet<Obj>();
	let saidDraw = false;
	let saidLoop = false;
	let completed = false;

	function judge() {
		if (count === 0) return;
		if (best >= 0 && !seen.has(OBJECTS[best])) {
			seen.add(OBJECTS[best]);
			if (seen.size >= GOAL && !completed) {
				completed = true;
				onstate?.('done');
				oncomplete?.();
			} else onstate?.(OBJECTS[best]);
			if (parts.loop) saidLoop = true;
			saidDraw = true;
			return;
		}
		if (parts.loop && !saidLoop) {
			saidLoop = true;
			onstate?.('loop');
		} else if (!saidDraw) {
			saidDraw = true;
			onstate?.('draw');
		}
	}
	function clear() {
		if (count === 0) return;
		px = Array(N * N).fill(false);
		onstate?.('clear');
	}

	const glow = (a: number, tone = 'brand') =>
		`color-mix(in srgb, var(--color-${tone}) ${Math.round(a * 100)}%, var(--color-card))`;
</script>

{#snippet dir(k: number)}
	<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
		{#if k === 0}
			<line x1="1" y1="6" x2="11" y2="6" />
		{:else if k === 1}
			<line x1="6" y1="1" x2="6" y2="11" />
		{:else if k === 2}
			<line x1="1.5" y1="10.5" x2="10.5" y2="1.5" />
		{:else}
			<line x1="1.5" y1="1.5" x2="10.5" y2="10.5" />
		{/if}
	</svg>
{/snippet}

<div class="stage">
	<div class="top">
		<div class="goal" aria-live="polite">
			{#each OBJECTS as o, k (o)}
				<span class="chip" class:got={seen.has(o)}>{tx.objects[k]}</span>
			{/each}
			<span class="gcount">{tx.goal.replace('{n}', String(Math.min(GOAL, seen.size)))}</span>
		</div>
		<button type="button" class="clear" onclick={clear} disabled={count === 0}>{tx.clear}</button>
	</div>

	<div class="board">
		<div class="drawwrap">
			<div
				class="grid"
				bind:this={gridEl}
				role="group"
				aria-label={tx.canvasLabel}
				onpointerdown={down}
				onpointermove={move}
				onpointerup={up}
				onpointercancel={up}
			>
				{#each px as on, k (k)}
					<button
						type="button"
						class="px"
						class:on
						class:in={inside[k]}
						aria-pressed={on}
						aria-label={`${Math.floor(k / N) + 1}, ${(k % N) + 1}`}
						onkeydown={(ev) => keyCell(ev, k)}
					></button>
				{/each}
			</div>
			<span class="hint">{count === 0 ? tx.drawHint : guessText}</span>
		</div>

		<div class="layers">
			<section>
				<h3>{tx.layer1}</h3>
				<div class="maps">
					{#each [0, 1, 2, 3] as e (e)}
						<div class="map">
							<svg class="mini" viewBox="0 0 {N} {N}" aria-hidden="true">
								{#each cells as c, k (k)}
									<rect
										x={k % N}
										y={Math.floor(k / N)}
										width="0.92"
										height="0.92"
										rx="0.15"
										fill={edgeOn(c, e) ? 'var(--color-brand)' : 'var(--color-line)'}
										opacity={edgeOn(c, e) ? 1 : 0.55}
									/>
								{/each}
							</svg>
							<span class="mlabel">{@render dir(e)}{tx.edges[e]}</span>
						</div>
					{/each}
				</div>
			</section>

			<section>
				<h3>{tx.layer2}</h3>
				<div class="parts">
					{#each tx.parts as p, k (k)}
						<span
							class="part"
							class:lit={partGlow[k] > 0}
							style="background:{glow(partGlow[k] * 0.35, k === 4 ? 'amber' : 'brand')}"
						>
							{p}
							<b>{partValue[k]}</b>
						</span>
					{/each}
				</div>
			</section>

			<section>
				<h3>{tx.layer3}</h3>
				<div class="votes">
					{#each OBJECTS as o, k (o)}
						<div class="vote" class:win={best === k}>
							<span class="vname">{tx.objects[k]}</span>
							<span class="vtrack"
								><span class="vfill" style="width:{Math.round(scores[k] * 100)}%"></span></span
							>
							<span class="vpct">{Math.round(scores[k] * 100)}%</span>
						</div>
					{/each}
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		overflow-y: auto;
	}
	.top {
		display: flex;
		width: 100%;
		max-width: 560px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.goal {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border-radius: 99px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 10px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-faint);
		transition:
			background 0.25s ease,
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.chip.got {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.gcount {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.clear {
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 12px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.clear:disabled {
		opacity: 0.45;
	}

	.board {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
		gap: 14px 22px;
	}
	.drawwrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.grid {
		display: grid;
		width: min(220px, 62vw);
		aspect-ratio: 1;
		grid-template-columns: repeat(10, 1fr);
		gap: 2px;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-line);
		padding: 2px;
		touch-action: none;
		user-select: none;
		cursor: crosshair;
	}
	.px {
		border-radius: 3px;
		background: var(--color-card);
		transition: background 0.12s ease;
		outline: none;
	}
	.px.in {
		background: var(--color-amber-soft);
	}
	.px.on {
		background: var(--color-ink);
	}
	.px:focus-visible {
		box-shadow: inset 0 0 0 2px var(--color-brand);
	}
	.hint {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.layers {
		display: flex;
		width: 100%;
		max-width: 300px;
		flex-direction: column;
		gap: 10px;
	}
	h3 {
		margin-bottom: 5px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.maps {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
	}
	.map {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.mini {
		width: 100%;
		max-width: 62px;
		height: auto;
	}
	.mini rect {
		transition: fill 0.15s ease;
	}
	.mlabel {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 10px;
		color: var(--color-muted);
	}
	.mlabel :global(line) {
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.parts {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.part {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 8px;
		border: 1.5px solid var(--color-line);
		padding: 3px 8px;
		font-size: 11.5px;
		color: var(--color-faint);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.part.lit {
		color: var(--color-ink);
	}
	.part b {
		font-variant-numeric: tabular-nums;
	}
	.votes {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.vote {
		display: grid;
		grid-template-columns: 54px 1fr 34px;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.vote.win {
		font-weight: 700;
		color: var(--color-ink);
	}
	.vtrack {
		height: 8px;
		overflow: hidden;
		border-radius: 99px;
		background: var(--color-line);
	}
	.vfill {
		display: block;
		height: 100%;
		border-radius: 99px;
		background: var(--color-faint);
		transition: width 0.25s ease;
	}
	.vote.win .vfill {
		background: var(--color-grass);
	}
	.vpct {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.px,
		.mini rect,
		.part,
		.vfill {
			transition: none;
		}
	}
</style>
