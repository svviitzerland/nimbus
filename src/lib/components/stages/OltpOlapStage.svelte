<script lang="ts">
	// A guided "watch" stage for OLTP and OLAP. A small map sits on top, shoppers on their phones
	// send orders into the app database (a server rack), and later a data warehouse appears on the
	// right with the nightly ETL lane between them. Under the map a card changes per scene, the
	// orders feed, the big question scanning millions of rows, the chart, row versus column
	// storage, the warehouse sources, the ETL steps, and finally the two sides next to each other.
	// Everything moves by itself, nothing has to be clicked.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { OltpOlapOrder, OltpOlapText } from '$lib/chapters/web/oltp-olap/types';

	let { text, oncomplete, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as OltpOlapText);

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	const last = $derived(tx.panels.length - 1);
	const scene = $derived(peek ?? Math.min(beat, last));

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	// A steady clock for the scenes that play in small steps. It starts over on every scene.
	let tick = $state(0);
	$effect(() => {
		void scene;
		tick = 0;
		if (reduced) {
			tick = 99;
			return;
		}
		const t = setInterval(() => (tick += 1), 650);
		return () => clearInterval(t);
	});

	// The live orders feed on the first two scenes, the newest order on top.
	type FeedRow = OltpOlapOrder & { key: number };
	let feed = $state<FeedRow[]>([]);
	let count = $state(1204);
	$effect(() => {
		const sc = scene;
		const base = tx.orders;
		feed = [...base].reverse().map((o, k) => ({ ...o, key: k }));
		count = 1204;
		if (reduced || sc > 1) return;
		let next = base[base.length - 1].id + 1;
		let key = base.length;
		const t = setInterval(() => {
			const src = base[next % base.length];
			feed = [{ ...src, id: next, key }, ...feed].slice(0, 4);
			next += 1;
			key += 1;
			count += 1;
		}, 1300);
		return () => clearInterval(t);
	});

	const num = $derived(new Intl.NumberFormat(tx.locale));
	const rp = (thousands: number) => `Rp ${num.format(thousands * 1000)}`;

	// The big question on the app database, counting up through the rows it has to read.
	const BIG = 4800000;
	const scanned = $derived(Math.min(1, (tick % 11) / 8));

	// Sales per month for the chart, only the shape matters.
	const SALES = [310, 280, 360, 420, 390, 470];
	const MAX = Math.max(...SALES);

	// Row versus column storage. Each scene first reads one order, then adds up every total.
	const short = (o: OltpOlapOrder) => o.item.split(' ').pop() ?? o.item;
	type Cell = { v: string; row: number; col: number };
	const blocks = $derived.by<Cell[][]>(() => {
		const o = tx.orders;
		const cell = (r: number, c: number): Cell => ({
			v: c === 0 ? String(o[r].id) : c === 1 ? short(o[r]) : String(o[r].total),
			row: r,
			col: c
		});
		if (scene === 5) return [0, 1, 2].map((c) => o.map((_, r) => cell(r, c)));
		return o.map((_, r) => [0, 1, 2].map((c) => cell(r, c)));
	});
	const columnar = $derived(scene === 5);
	const PICK = 1; // order 5013
	const plans = $derived(
		columnar ? { one: [0, 1, 2], sum: [2] } : { one: [PICK], sum: [0, 1, 2, 3] }
	);
	const readPhase = $derived.by(() => {
		const oneEnd = plans.one.length + 4;
		const cycle = oneEnd + plans.sum.length + 5;
		const t = reduced ? oneEnd + plans.sum.length + 1 : tick % cycle;
		const sum = t >= oneEnd;
		const local = sum ? t - oneEnd : t;
		const list = sum ? plans.sum : plans.one;
		const n = Math.max(0, Math.min(list.length, local));
		return { sum, opened: list.slice(0, n), done: local > list.length, count: list.length };
	});
	const wanted = (c: Cell) => (readPhase.sum ? c.col === 2 : c.row === PICK);
	const sumTotal = $derived(tx.orders.reduce((s, o) => s + o.total, 0));

	// Map state per scene
	const busy = $derived(scene === 2);
	const showWarehouse = $derived(scene >= 3);
	const night = $derived(scene === 7);
	const phones = [10, 56, 102];
	const DOT_PATHS = ['M32 29 C62 29 66 70 92 72', 'M32 75 H92', 'M32 121 C62 121 66 80 92 78'];
	const sideCards = $derived([tx.oltp, tx.olap]);
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				<div class="map" class:night>
					<svg viewBox="0 0 360 156" class="scene" aria-hidden="true">
						<!-- shoppers on their phones -->
						{#each phones as y, k (k)}
							<g transform="translate(8 {y})">
								<rect width="24" height="38" rx="5" class="phone" />
								<rect x="3" y="5" width="18" height="26" rx="2" class="screen" />
								{#if busy}
									<path d="M12 13 A5 5 0 1 1 7 18" class="spin" class:still={reduced} />
								{:else}
									<rect x="6" y="20" width="12" height="6" rx="2" class="buy" />
								{/if}
							</g>
						{/each}
						<text x="20" y="152" class="lbl">{tx.shoppers}</text>

						<!-- orders flying into the app database -->
						{#if !reduced && s <= 7}
							{#key busy}
								{#each DOT_PATHS as d, k (k)}
									<circle r="3.4" class="order" class:slow={busy}>
										<animateMotion
											dur="{busy ? 3.6 : 1.5}s"
											begin="{k * 0.45}s"
											repeatCount="indefinite"
											path={d}
										/>
									</circle>
								{/each}
							{/key}
						{/if}

						<!-- the app database, a server rack -->
						<g transform="translate(92 44)" class="rack" class:hot={busy}>
							<rect width="56" height="62" rx="6" class="rack-body" />
							{#each [0, 1, 2] as k (k)}
								<rect x="7" y={8 + k * 18} width="42" height="12" rx="3" class="slot" />
								<circle cx="41" cy={14 + k * 18} r="2.4" class="led" />
							{/each}
						</g>
						{#if busy}
							<g transform="translate(120 34)" in:fade={{ duration: 250 }}>
								<rect x="-22" y="-9" width="44" height="18" rx="9" class="busy" />
								<text y="4" class="busy-text">{tx.busy}</text>
							</g>
						{/if}
						<text x="120" y="124" class="lbl">{tx.appDb}</text>

						<!-- the analyst asking the big question -->
						{#if s === 2 || s === 3}
							<g in:fade={{ duration: 300 }}>
								{#if s === 2}
									<path d="M182 32 L150 54" class="ask bad" />
								{:else}
									<path d="M210 24 L258 46" class="ask good" />
								{/if}
								<g transform="translate(176 4)">
									<rect width="34" height="22" rx="3" class="laptop" />
									<rect x="3" y="3" width="28" height="15" rx="1.5" class="laptop-screen" />
									{#each [0, 1, 2] as k (k)}
										<rect
											x={7 + k * 8}
											y={14 - (k + 1) * 3}
											width="5"
											height={(k + 1) * 3}
											class="mini-bar"
										/>
									{/each}
									<rect x="-4" y="22" width="42" height="4" rx="2" class="laptop" />
								</g>
							</g>
						{/if}

						<!-- the ETL lane between the two -->
						<path d="M152 75 H254" class="lane" class:on={showWarehouse} />
						{#if night}
							<g in:fade={{ duration: 300 }}>
								<path d="M206 30 a10 10 0 1 0 8 14 a8 8 0 1 1 -8 -14 z" class="moon" />
								<text x="203" y="62" class="clock">{tx.clock}</text>
								<text x="203" y="94" class="etl">{tx.etl}</text>
								{#if !reduced}
									{#each [0, 1, 2] as k (k)}
										<rect x="-4" y="-4" width="8" height="8" rx="2" class="packet">
											<animateMotion
												dur="1.8s"
												begin="{k * 0.6}s"
												repeatCount="indefinite"
												path="M152 75 H254"
											/>
										</rect>
									{/each}
								{/if}
							</g>
						{/if}

						<!-- other sources feeding the warehouse -->
						{#if s === 6}
							<g in:fade={{ duration: 300 }}>
								{#each [{ y: 4, name: tx.sources[1] }, { y: 100, name: tx.sources[2] }] as src (src.name)}
									<path d="M222 {src.y + 10} L262 {src.y < 75 ? 50 : 100}" class="feed" />
									<g transform="translate(196 {src.y})">
										<ellipse cx="13" cy="3" rx="13" ry="4" class="cyl" />
										<rect y="3" width="26" height="14" class="cyl" />
										<ellipse cx="13" cy="17" rx="13" ry="4" class="cyl" />
										<ellipse cx="13" cy="3" rx="13" ry="4" class="cyl-top" />
									</g>
									<text x="209" y={src.y + 34} class="lbl small">{src.name}</text>
								{/each}
							</g>
						{/if}

						<!-- the warehouse -->
						<g transform="translate(258 30)" class="house" class:shown={showWarehouse}>
							<path d="M0 24 L47 2 L94 24 Z" class="roof" />
							<rect x="5" y="24" width="84" height="62" class="wall" />
							{#each [0, 1] as k (k)}
								<rect x="13" y={34 + k * 16} width="22" height="8" rx="1.5" class="shelf" />
								<rect x="59" y={34 + k * 16} width="22" height="8" rx="1.5" class="shelf" />
							{/each}
							<rect x="37" y="58" width="20" height="28" rx="2" class="door" />
						</g>
						<text x="305" y="134" class="lbl" class:faint={!showWarehouse}>
							{scene >= 6 ? tx.warehouse : tx.analytics}
						</text>
					</svg>
				</div>

				<!-- the detail card under the map -->
				<div class="card">
					{#if s <= 1}
						<div class="head">
							<span class="mono">{tx.ordersTable}</span>
							<span class="count">{tx.ordersToday} <b>{num.format(count)}</b></span>
						</div>
						<table>
							<thead>
								<tr>
									<th>{tx.columns.id}</th>
									<th>{tx.columns.item}</th>
									<th class="num">{tx.columns.total}</th>
								</tr>
							</thead>
							<tbody>
								{#each feed as r, k (r.key)}
									<tr class="fresh" class:top={k === 0}>
										<td class="mono">{r.id}</td>
										<td>
											{r.item}
											{#if s === 1 && k === 0}
												<span class="tag" in:fade={{ duration: 200 }}>{tx.writeTag}</span>
											{/if}
										</td>
										<td class="num">{rp(r.total)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{:else if s === 2 || s === 3}
						<p class="label">{tx.questionLabel}</p>
						<p class="question">{tx.question}</p>
						{#if s === 2}
							<div class="scan">
								<div class="track"><div class="fill" style="width:{scanned * 100}%"></div></div>
								<p class="reading">
									{tx.reading.replace('{n}', num.format(Math.round(scanned * BIG)))}
								</p>
							</div>
							<p class="note bad"><span class="dot"></span>{tx.slowNote}</p>
						{:else}
							<div class="chart">
								{#each SALES as v, k (k)}
									<div class="col">
										<div
											class="bar"
											style="height:{(v / MAX) * 100}%; animation-delay:{k * 120}ms"
										></div>
										<span>{tx.months[k]}</span>
									</div>
								{/each}
							</div>
							<p class="note good">{tx.answerNote}</p>
						{/if}
					{:else if s === 4 || s === 5}
						<div class="head">
							<span class="store">{columnar ? tx.colStore : tx.rowStore}</span>
							{#key readPhase.sum}
								<span class="task" in:fade={{ duration: 200 }}
									>{readPhase.sum ? tx.readSum : tx.readOne}</span
								>
							{/key}
						</div>
						<div class="blocks">
							{#each blocks as b, k (k)}
								{@const open = readPhase.opened.includes(k)}
								<div class="block" class:open>
									<span class="bl">{tx.blockLabel} {k + 1}</span>
									<div class="cells">
										{#each b as c (c.row + '-' + c.col)}
											<span class="cell c{c.col}" class:want={open && wanted(c)}>{c.v}</span>
										{/each}
									</div>
								</div>
							{/each}
						</div>
						<p
							class="opened"
							class:hide={readPhase.opened.length === 0}
							class:good={readPhase.done && readPhase.count === 1}
							class:bad={readPhase.done && readPhase.count > 1}
						>
							{tx.opened.replace('{n}', String(readPhase.opened.length))}
							{#if readPhase.done && readPhase.sum}
								<b>{rp(sumTotal)}</b>
							{/if}
						</p>
					{:else if s === 6}
						<div class="sources">
							{#each tx.sources as src, k (src)}
								<span class="src" class:on={reduced || tick % 5 >= k + 1}>{src}</span>
							{/each}
						</div>
						<div class="arrow" aria-hidden="true">
							<svg viewBox="0 0 20 24"><path d="M10 2 V20 M4 14 L10 20 L16 14" /></svg>
						</div>
						<div class="wh">
							<b>{tx.warehouse}</b>
							<span>{tx.warehouseNote}</span>
						</div>
					{:else if s === 7}
						<div class="steps">
							{#each tx.etlSteps as st, k (st.key)}
								<div class="step" class:on={reduced || tick % 5 >= k + 1}>
									<b>{st.key}</b>
									<div>
										<span class="name">{st.name}</span>
										<span class="say">{st.say}</span>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="sides">
							{#each sideCards as side, k (side.name)}
								<div class="side" class:olap={k === 1} in:fade={{ duration: 250, delay: k * 150 }}>
									<b class="nm">{side.name}</b>
									<span class="full">{side.full}</span>
									<span class="like">{side.like}</span>
									{#if s === 8}
										<ul>
											{#each side.points as p (p)}<li>{p}</li>{/each}
										</ul>
									{:else}
										<span class="exl">{tx.examplesLabel}</span>
										<div class="chips">
											{#each side.examples as e (e)}<span>{e}</span>{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		min-width: 0;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
	}

	/* the map */
	.map {
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 8px 10px 4px;
		transition: background 0.5s;
	}
	.map.night {
		background: color-mix(in srgb, var(--color-brand) 7%, var(--color-card));
	}
	.scene {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.phone {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.screen {
		fill: var(--color-card);
	}
	.buy {
		fill: var(--color-brand);
	}
	.spin {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
		transform-box: fill-box;
		transform-origin: center;
		animation: spin 1s linear infinite;
	}
	.spin.still {
		animation: none;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.order {
		fill: var(--color-brand);
	}
	.order.slow {
		fill: var(--color-amber);
	}
	.rack-body {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.slot {
		fill: var(--color-faint);
		opacity: 0.35;
	}
	.led {
		fill: var(--color-grass);
		transition: fill 0.3s;
	}
	.rack.hot .led {
		fill: var(--color-amber);
	}
	.busy {
		fill: var(--color-amber-soft);
	}
	.busy-text {
		fill: var(--color-amber);
		font-size: 10.5px;
		font-weight: 800;
		text-anchor: middle;
	}
	.lbl {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		transition: opacity 0.4s;
	}
	.lbl.small {
		font-size: 10px;
	}
	.lbl.end {
		text-anchor: end;
	}
	.lbl.faint {
		opacity: 0.25;
	}
	.ask {
		fill: none;
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.ask.bad {
		stroke: var(--color-amber);
	}
	.ask.good {
		stroke: var(--color-grass);
	}
	.laptop {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.laptop-screen {
		fill: var(--color-card);
	}
	.mini-bar {
		fill: var(--color-brand);
	}
	.lane {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.lane.on {
		opacity: 1;
	}
	.moon {
		fill: var(--color-amber);
	}
	.clock,
	.etl {
		fill: var(--color-brand);
		font-size: 10.5px;
		font-weight: 800;
		text-anchor: middle;
	}
	.etl {
		font-size: 11px;
		letter-spacing: 0.06em;
	}
	.packet {
		fill: var(--color-brand);
	}
	.feed {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.cyl {
		fill: var(--color-paper);
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.cyl-top {
		fill: var(--color-brand-soft);
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.house {
		opacity: 0.15;
		transition: opacity 0.5s;
	}
	.house.shown {
		opacity: 1;
	}
	.roof {
		fill: var(--color-brand);
	}
	.wall {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.shelf {
		fill: var(--color-brand-soft);
		stroke: color-mix(in srgb, var(--color-brand) 40%, transparent);
	}
	.door {
		fill: var(--color-ink);
		opacity: 0.75;
	}

	/* the detail card */
	.card {
		min-height: 196px;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 12px;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 4px 10px;
		margin: 0 2px 6px;
	}
	.mono {
		font-family: var(--font-mono, ui-monospace, monospace);
	}
	.head .mono {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.count {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.count b {
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	th {
		border-bottom: 1.5px solid var(--color-line);
		padding: 4px 6px 6px;
		text-align: left;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	td {
		border-bottom: 1px solid var(--color-line);
		padding: 6px;
		color: var(--color-ink);
	}
	tr:last-child td {
		border-bottom: none;
	}
	td.mono {
		font-size: 12px;
		color: var(--color-muted);
	}
	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.fresh {
		animation: drop 0.45s ease-out both;
	}
	.fresh.top {
		background: var(--color-brand-soft);
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	.tag {
		margin-left: 4px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 1px 7px;
		font-size: 10.5px;
		font-weight: 800;
		white-space: nowrap;
		color: var(--color-grass);
	}
	.label {
		margin: 0 2px 2px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.question {
		margin: 0 2px 10px;
		font-size: 15px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.scan {
		margin: 4px 2px 10px;
	}
	.track {
		height: 10px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
		box-shadow: inset 0 0 0 1px var(--color-line);
	}
	.fill {
		height: 100%;
		border-radius: 999px;
		background: var(--color-amber);
		transition: width 0.6s linear;
	}
	.reading {
		margin: 6px 0 0;
		font-size: 12.5px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--color-muted);
	}
	.note {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0 2px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.note.bad {
		color: var(--color-amber);
	}
	.note.good {
		color: var(--color-grass);
	}
	.dot {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--color-amber);
		animation: pulse 1s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.3;
		}
	}
	.chart {
		display: flex;
		height: 92px;
		align-items: flex-end;
		gap: 8px;
		margin: 0 2px 8px;
	}
	.col {
		display: flex;
		height: 100%;
		flex: 1;
		flex-direction: column;
		justify-content: flex-end;
		align-items: center;
		gap: 4px;
	}
	.bar {
		width: 100%;
		max-width: 34px;
		border-radius: 6px 6px 2px 2px;
		background: var(--color-brand);
		transform-origin: bottom;
		animation: rise 0.7s cubic-bezier(0.3, 0.7, 0.3, 1) both;
	}
	@keyframes rise {
		from {
			transform: scaleY(0);
		}
	}
	.col span {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
	}

	/* storage blocks */
	.store {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.task {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.blocks {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.block {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1.5px solid var(--color-line);
		border-radius: 10px;
		padding: 4px 8px;
		transition:
			background 0.3s,
			border-color 0.3s;
	}
	.block.open {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.bl {
		flex: none;
		width: 46px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.cells {
		display: flex;
		min-width: 0;
		flex-wrap: wrap;
		gap: 4px;
	}
	.cell {
		min-width: 40px;
		border-radius: 6px;
		background: var(--color-paper);
		padding: 2px 6px;
		text-align: center;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11.5px;
		color: var(--color-muted);
		box-shadow: inset 0 0 0 1px var(--color-line);
		transition:
			background 0.3s,
			color 0.3s;
	}
	.cell.c2 {
		color: var(--color-ink);
	}
	.cell.want {
		background: var(--color-brand);
		color: var(--color-card);
		box-shadow: none;
		font-weight: 700;
	}
	.opened {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin: 8px 0 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.opened.hide {
		visibility: hidden;
	}
	.opened.good {
		color: var(--color-grass);
	}
	.opened.bad {
		color: var(--color-amber);
	}
	.opened b {
		color: var(--color-ink);
	}

	/* warehouse sources */
	.sources {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 8px;
	}
	.src {
		border: 1.5px solid var(--color-line);
		border-radius: 10px;
		padding: 6px 12px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-faint);
		transition:
			background 0.3s,
			border-color 0.3s,
			color 0.3s;
	}
	.src.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.arrow {
		display: flex;
		justify-content: center;
		margin: 8px 0;
	}
	.arrow svg {
		height: 26px;
		width: 22px;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.wh {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 12px;
		background: var(--color-brand-soft);
		padding: 12px;
		text-align: center;
	}
	.wh b {
		font-size: 15px;
		color: var(--color-brand);
	}
	.wh span {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}

	/* ETL steps */
	.steps {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding-top: 4px;
	}
	.step {
		display: flex;
		align-items: center;
		gap: 12px;
		border: 1.5px solid var(--color-line);
		border-radius: 12px;
		padding: 8px 10px;
		opacity: 0.5;
		transition:
			opacity 0.3s,
			border-color 0.3s,
			background 0.3s;
	}
	.step.on {
		opacity: 1;
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.step b {
		display: grid;
		height: 30px;
		width: 30px;
		flex: none;
		place-items: center;
		border-radius: 999px;
		background: var(--color-brand);
		font-size: 14px;
		color: var(--color-card);
	}
	.step div {
		display: flex;
		flex-direction: column;
	}
	.name {
		font-size: 13.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.say {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	/* the two sides */
	.sides {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 8px;
	}
	.side {
		--c: var(--color-brand);
		--soft: var(--color-brand-soft);
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-radius: 12px;
		background: var(--soft);
		padding: 10px 12px;
	}
	.side.olap {
		--c: var(--color-grass);
		--soft: var(--color-grass-soft);
	}
	.nm {
		font-size: 17px;
		font-weight: 800;
		color: var(--c);
	}
	.full {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.like {
		margin-top: 2px;
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.side ul {
		margin: 6px 0 0;
		padding-left: 16px;
		font-size: 12px;
		line-height: 1.55;
		color: var(--color-ink);
	}
	.exl {
		margin-top: 8px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 4px;
	}
	.chips span {
		border-radius: 999px;
		background: var(--color-card);
		padding: 2px 8px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--c);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		table {
			font-size: 12px;
		}
		th,
		td {
			padding-left: 4px;
			padding-right: 4px;
		}
		.question {
			font-size: 14px;
		}
		.card {
			min-height: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fresh,
		.bar,
		.dot,
		.block,
		.cell,
		.step,
		.src,
		.fill,
		.house,
		.lane,
		.map {
			transition: none;
			animation: none;
		}
	}
</style>
