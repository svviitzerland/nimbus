<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { PredictText } from '$lib/chapters/ai/predict/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as PredictText);

	// ---- shared chart frame (SVG viewBox 220 x 184) ----
	const L = 30;
	const R = 212;
	const T = 10;
	const B = 150;
	type Dom = { x0: number; x1: number; y0: number; y1: number };
	const sx = (d: Dom, v: number) => L + ((v - d.x0) / (d.x1 - d.x0)) * (R - L);
	const sy = (d: Dom, v: number) => B - ((v - d.y0) / (d.y1 - d.y0)) * (B - T);
	const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

	// Turn a pointer position into chart values.
	function toData(e: MouseEvent | PointerEvent, svg: SVGSVGElement, d: Dom) {
		const box = svg.getBoundingClientRect();
		const px = ((e.clientX - box.left) / box.width) * 220;
		const py = ((e.clientY - box.top) / box.height) * 184;
		return {
			x: clamp(d.x0 + ((px - L) / (R - L)) * (d.x1 - d.x0), d.x0, d.x1),
			y: clamp(d.y0 + ((B - py) / (B - T)) * (d.y1 - d.y0), d.y0, d.y1),
			inside: px >= L - 4 && px <= R + 4 && py >= T - 4 && py <= B + 4
		};
	}

	let tab = $state<'reg' | 'cls'>('reg');
	let askedReg = false;
	let askedCls = false;
	let completed = false;
	function asked(which: 'reg' | 'cls') {
		if (which === 'reg') askedReg = true;
		else askedCls = true;
		if (askedReg && askedCls && !completed) {
			completed = true;
			onstate?.('both');
			oncomplete?.();
			return true;
		}
		return false;
	}

	// ---- regression: fit a straight line through the houses ----
	const RD: Dom = { x0: 20, x1: 200, y0: 0, y1: 1500 };
	const HOUSES = [
		{ x: 36, y: 280 },
		{ x: 60, y: 390 },
		{ x: 90, y: 640 },
		{ x: 120, y: 790 },
		{ x: 160, y: 1100 }
	];
	let houses = $state(HOUSES.map((h) => ({ ...h })));
	let size = $state(110);
	let saidRegAdd = false;
	let saidRegAsk = false;
	let regSvg = $state<SVGSVGElement>();

	// Least squares, the line with the smallest total squared miss.
	const line = $derived.by(() => {
		const n = houses.length;
		if (n < 2) return null;
		const mx = houses.reduce((s, p) => s + p.x, 0) / n;
		const my = houses.reduce((s, p) => s + p.y, 0) / n;
		let num = 0;
		let den = 0;
		for (const p of houses) {
			num += (p.x - mx) * (p.y - my);
			den += (p.x - mx) ** 2;
		}
		if (den === 0) return null;
		const slope = num / den;
		return { slope, icept: my - slope * mx };
	});
	const at = (x: number) => (line ? line.slope * x + line.icept : 0);
	const price = $derived(Math.max(0, Math.round(at(size) / 10) * 10));
	const clipY = (v: number) => clamp(v, RD.y0, RD.y1);

	function addHouse(e: MouseEvent) {
		if (!regSvg) return;
		const p = toData(e, regSvg, RD);
		if (!p.inside) return;
		houses = [...houses.slice(-13), { x: Math.round(p.x), y: Math.round(p.y / 10) * 10 }];
		if (!saidRegAdd) onstate?.('reg_add');
		saidRegAdd = true;
	}
	function ask(v: number) {
		size = v;
		if (!line) return;
		if (asked('reg')) return;
		if (!saidRegAsk) onstate?.('reg_ask');
		saidRegAsk = true;
	}

	// ---- classification: the three nearest known emails vote ----
	type Mail = { x: number; y: number; spam: boolean };
	const CD: Dom = { x0: 0, x1: 10, y0: 0, y1: 10 };
	const MAILS: Mail[] = [
		{ x: 1, y: 1, spam: false },
		{ x: 2, y: 0.4, spam: false },
		{ x: 0.5, y: 2.2, spam: false },
		{ x: 3, y: 2, spam: false },
		{ x: 1.4, y: 3.4, spam: false },
		{ x: 4.2, y: 1, spam: false },
		{ x: 8, y: 7, spam: true },
		{ x: 7, y: 9, spam: true },
		{ x: 9, y: 8, spam: true },
		{ x: 6, y: 6.5, spam: true },
		{ x: 9.2, y: 5, spam: true },
		{ x: 5.4, y: 8.4, spam: true }
	];
	let mails = $state(MAILS.map((m) => ({ ...m })));
	let addSpam = $state(true);
	let probe = $state({ x: 4.5, y: 3.5 });
	let dragging = $state(false);
	let saidClsAdd = false;
	let saidClsAsk = false;
	let saidFlip = false;
	let clsSvg = $state<SVGSVGElement>();

	function vote(x: number, y: number) {
		const near = mails
			.map((m) => ({ m, d: (m.x - x) ** 2 + (m.y - y) ** 2 }))
			.sort((a, b) => a.d - b.d)
			.slice(0, 3);
		const spam = near.filter((n) => n.m.spam).length;
		return { spam: spam * 2 > near.length, near: near.map((n) => n.m) };
	}
	const verdict = $derived(vote(probe.x, probe.y));

	// shade the chart in a coarse grid so you can see the border between the groups
	const CELLS = 20;
	const shade = $derived.by(() => {
		const out: { x: number; y: number; spam: boolean }[] = [];
		for (let i = 0; i < CELLS; i++)
			for (let j = 0; j < CELLS; j++) {
				const x = ((i + 0.5) / CELLS) * 10;
				const y = ((j + 0.5) / CELLS) * 10;
				out.push({ x: i, y: j, spam: vote(x, y).spam });
			}
		return out;
	});
	const cw = (R - L) / CELLS;
	const ch = (B - T) / CELLS;

	function addMail(e: MouseEvent) {
		if (!clsSvg || dragging) return;
		const p = toData(e, clsSvg, CD);
		if (!p.inside) return;
		mails = [...mails.slice(-23), { x: p.x, y: p.y, spam: addSpam }];
		if (!saidClsAdd) onstate?.('cls_add');
		saidClsAdd = true;
	}

	function moveProbe(x: number, y: number) {
		const was = verdict.spam;
		probe = { x: clamp(x, 0, 10), y: clamp(y, 0, 10) };
		const flipped = vote(probe.x, probe.y).spam !== was;
		if (asked('cls')) return;
		if (flipped && !saidFlip) {
			saidFlip = true;
			onstate?.('cls_flip');
		} else if (!saidClsAsk) {
			saidClsAsk = true;
			onstate?.('cls_ask');
		}
	}
	function grab(e: PointerEvent) {
		e.stopPropagation();
		dragging = true;
		(e.currentTarget as Element).setPointerCapture(e.pointerId);
	}
	function drag(e: PointerEvent) {
		if (!dragging || !clsSvg) return;
		const p = toData(e, clsSvg, CD);
		moveProbe(p.x, p.y);
	}
	function drop(e: PointerEvent) {
		if (!dragging) return;
		(e.currentTarget as Element).releasePointerCapture(e.pointerId);
		// let the click that follows this release pass without adding a point
		setTimeout(() => (dragging = false), 0);
	}
	function probeKey(e: KeyboardEvent) {
		const step = 0.5;
		const moves: Record<string, [number, number]> = {
			ArrowLeft: [-step, 0],
			ArrowRight: [step, 0],
			ArrowUp: [0, step],
			ArrowDown: [0, -step]
		};
		const m = moves[e.key];
		if (!m) return;
		e.preventDefault();
		moveProbe(probe.x + m[0], probe.y + m[1]);
	}

	function clearReg() {
		houses = HOUSES.map((h) => ({ ...h }));
	}
	function clearCls() {
		mails = MAILS.map((m) => ({ ...m }));
	}

	const ticksReg = [50, 100, 150, 200];
	const ticksCls = [0, 5, 10];
</script>

<div class="stage">
	<div class="tabs" role="tablist">
		<button
			type="button"
			role="tab"
			aria-selected={tab === 'reg'}
			class:on={tab === 'reg'}
			onclick={() => (tab = 'reg')}>{tx.tabReg}</button
		>
		<button
			type="button"
			role="tab"
			aria-selected={tab === 'cls'}
			class:on={tab === 'cls'}
			onclick={() => (tab = 'cls')}>{tx.tabCls}</button
		>
	</div>

	<div class="panels">
		<!-- regression -->
		<section class="panel" class:hide={tab !== 'reg'}>
			<header>
				<h3>{tx.regTitle}</h3>
				<span class="kind num">{tx.regKind}</span>
			</header>
			<div class="control">
				<input
					type="range"
					min="20"
					max="200"
					step="5"
					value={size}
					disabled={!line}
					aria-label={tx.askSize}
					oninput={(e) => ask(Number((e.currentTarget as HTMLInputElement).value))}
				/>
				<button type="button" class="ghost" onclick={clearReg}>{tx.clear}</button>
			</div>
			<p class="answer">
				{line
					? tx.regAnswer.replace('{size}', String(size)).replace('{price}', String(price))
					: tx.regNeed}
			</p>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
			<svg
				bind:this={regSvg}
				class="chart tap"
				viewBox="0 0 220 184"
				role="img"
				aria-label={tx.regTitle}
				onclick={addHouse}
			>
				<rect x={L} y={T} width={R - L} height={B - T} class="frame" />
				{#each ticksReg as t (t)}
					<text class="tick" x={sx(RD, t)} y={B + 12}>{t}</text>
				{/each}
				<text class="axis" x={(L + R) / 2} y="180">{tx.regX}</text>
				<text class="axis" transform="translate(12 {(T + B) / 2}) rotate(-90)">{tx.regY}</text>
				{#if line}
					<line
						class="fit"
						x1={sx(RD, RD.x0)}
						y1={sy(RD, clipY(at(RD.x0)))}
						x2={sx(RD, RD.x1)}
						y2={sy(RD, clipY(at(RD.x1)))}
					/>
					<!-- the question, up to the line and across to the price -->
					<line
						class="guide"
						x1={sx(RD, size)}
						y1={B}
						x2={sx(RD, size)}
						y2={sy(RD, clipY(price))}
					/>
					<line
						class="guide"
						x1={L}
						y1={sy(RD, clipY(price))}
						x2={sx(RD, size)}
						y2={sy(RD, clipY(price))}
					/>
				{/if}
				{#each houses as h, i (i)}
					<g transform="translate({sx(RD, h.x)} {sy(RD, h.y)})" class="house">
						<path d="M-5 0.5 L0 -4.5 L5 0.5 V5 H-5 Z" />
					</g>
				{/each}
				{#if line}
					<circle class="askdot" cx={sx(RD, size)} cy={sy(RD, clipY(price))} r="5" />
				{/if}
			</svg>
			<p class="hint">{tx.regHint}</p>
		</section>

		<!-- classification -->
		<section class="panel" class:hide={tab !== 'cls'}>
			<header>
				<h3>{tx.clsTitle}</h3>
				<span class="kind grp">{tx.clsKind}</span>
			</header>
			<div class="control">
				<span class="addas">{tx.addAs}</span>
				<div class="seg">
					<button type="button" class:on={addSpam} class="spam" onclick={() => (addSpam = true)}
						>{tx.spam}</button
					>
					<button type="button" class:on={!addSpam} class="ham" onclick={() => (addSpam = false)}
						>{tx.ham}</button
					>
				</div>
				<button type="button" class="ghost" onclick={clearCls}>{tx.clear}</button>
			</div>
			<p class="answer" class:spam={verdict.spam} class:ham={!verdict.spam}>
				{tx.clsAnswer.replace('{label}', verdict.spam ? tx.spam : tx.ham)}
			</p>
			<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
			<svg
				bind:this={clsSvg}
				class="chart tap"
				viewBox="0 0 220 184"
				role="img"
				aria-label={tx.clsTitle}
				onclick={addMail}
			>
				{#each shade as c (c.x * CELLS + c.y)}
					<rect
						x={L + c.x * cw}
						y={B - (c.y + 1) * ch}
						width={cw + 0.3}
						height={ch + 0.3}
						class="cell"
						class:spam={c.spam}
					/>
				{/each}
				<rect x={L} y={T} width={R - L} height={B - T} class="frame clear" />
				{#each ticksCls as t (t)}
					<text class="tick" x={sx(CD, t)} y={B + 12}>{t}</text>
				{/each}
				<text class="axis" x={(L + R) / 2} y="180">{tx.clsX}</text>
				<text class="axis" transform="translate(12 {(T + B) / 2}) rotate(-90)">{tx.clsY}</text>
				{#each verdict.near as m, i (i)}
					<line
						class="vote"
						x1={sx(CD, probe.x)}
						y1={sy(CD, probe.y)}
						x2={sx(CD, m.x)}
						y2={sy(CD, m.y)}
					/>
				{/each}
				{#each mails as m, i (i)}
					<g transform="translate({sx(CD, m.x)} {sy(CD, m.y)})" class="mail" class:spam={m.spam}>
						<rect x="-5.5" y="-4" width="11" height="8" rx="1.5" />
						<path d="M-5 -3.3 L0 0.6 L5 -3.3" />
					</g>
				{/each}
				<g
					class="probe"
					class:spam={verdict.spam}
					class:grab={dragging}
					transform="translate({sx(CD, probe.x)} {sy(CD, probe.y)})"
					role="slider"
					tabindex="0"
					aria-label={tx.newEmail}
					aria-valuetext={verdict.spam ? tx.spam : tx.ham}
					aria-valuenow={Math.round(probe.x)}
					onpointerdown={grab}
					onpointermove={drag}
					onpointerup={drop}
					onpointercancel={drop}
					onclick={(e) => e.stopPropagation()}
					onkeydown={probeKey}
				>
					<circle r="15" class="halo" />
					<rect x="-8" y="-6" width="16" height="12" rx="2" />
					<text y="4">?</text>
				</g>
			</svg>
			<p class="hint">{tx.clsHint}</p>
		</section>
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
	.panels {
		display: flex;
		width: 100%;
		max-width: 360px;
		flex-direction: column;
		gap: 16px;
	}
	.panel {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.panel.hide {
		display: none;
	}
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	h3 {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.kind {
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 10.5px;
		font-weight: 700;
	}
	.kind.num {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.kind.grp {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.control {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 34px;
	}
	.control input {
		flex: 1;
		min-width: 0;
		accent-color: var(--color-brand);
	}
	.addas {
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.seg {
		display: flex;
		gap: 4px;
	}
	.seg button {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 10px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.seg .spam.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.seg .ham.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
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
	.answer {
		min-height: 20px;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--color-brand);
		text-align: center;
	}
	.answer.spam {
		color: var(--color-danger);
	}
	.answer.ham {
		color: var(--color-grass);
	}
	.hint {
		font-size: 11.5px;
		color: var(--color-faint);
		text-align: center;
	}

	.chart {
		width: 100%;
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
	.frame.clear {
		fill: none;
	}
	.tick {
		font-size: 8.5px;
		fill: var(--color-faint);
		text-anchor: middle;
	}
	.axis {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.fit {
		stroke: var(--color-brand);
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	.guide {
		stroke: var(--color-brand);
		stroke-opacity: 0.35;
		stroke-width: 1.2;
	}
	.house path {
		fill: var(--color-ink);
		fill-opacity: 0.75;
	}
	.askdot {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 2.4;
	}

	.cell {
		fill: var(--color-grass-soft);
		transition: fill 0.25s ease;
	}
	.cell.spam {
		fill: var(--color-danger-soft);
	}
	.mail rect {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 1.4;
	}
	.mail path {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.1;
	}
	.mail.spam rect,
	.mail.spam path {
		stroke: var(--color-danger);
	}
	.vote {
		stroke: var(--color-ink);
		stroke-opacity: 0.3;
		stroke-width: 1.2;
		pointer-events: none;
	}
	.probe {
		cursor: grab;
		outline: none;
		touch-action: none;
	}
	.probe.grab {
		cursor: grabbing;
	}
	.probe .halo {
		fill: var(--color-ink);
		fill-opacity: 0.06;
	}
	.probe:focus-visible .halo {
		fill-opacity: 0.16;
	}
	.probe rect {
		fill: var(--color-grass);
		stroke: var(--color-card);
		stroke-width: 1.5;
	}
	.probe.spam rect {
		fill: var(--color-danger);
	}
	.probe text {
		font-size: 10px;
		font-weight: 800;
		fill: #fff;
		text-anchor: middle;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.cell {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.tabs {
			display: none;
		}
		.panels {
			max-width: 760px;
			flex-direction: row;
			gap: 28px;
		}
		.panel,
		.panel.hide {
			display: flex;
			flex: 1;
			min-width: 0;
		}
	}
</style>
