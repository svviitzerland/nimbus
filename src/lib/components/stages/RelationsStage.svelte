<script lang="ts">
	// A guided "watch" stage for relations. Customers and products sit in their own tables, then
	// the orders table arrives with copied names (the problem), the id columns light up as primary
	// keys, the copied names turn into numbers (foreign keys), and lines draw themselves from each
	// order to the rows it points at. A JOIN then reads the lines back as plain sentences. The only
	// optional play is renaming one customer and watching every order follow.
	import { fade, fly } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RelationsText } from '$lib/chapters/web/relations/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as RelationsText);

	// Which scene each beat shows (nine beats, eight scenes).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];
	/** Each order as [customer id, product id], ids start at 1. */
	const ORDERS: [number, number][] = [
		[1, 3],
		[2, 1],
		[1, 2],
		[3, 3]
	];

	// Card geometry in SVG units.
	const TOP = { y: 6, w: 148 };
	const CUST_X = 6;
	const PROD_X = 206;
	const ORD = { x: 80, y: 168, w: 200 };
	const TITLE_H = 22;
	const HEAD_H = 18;
	const ROW_H = 22;
	const rowY = (top: number, k: number) => top + TITLE_H + HEAD_H + ROW_H * k;
	const rowMid = (top: number, k: number) => rowY(top, k) + ROW_H / 2;
	// Column x offsets inside the orders card.
	const OC = { id: 0, cust: 40, prod: 120, end: 200 };

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let renamed = $state(false);
	let focus = $state(-1); // the order being followed right now

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const showOrders = $derived(scene >= 1);
	const copied = $derived(scene === 1);
	const pkOn = $derived(scene === 2 || scene === 6);
	const fkOn = $derived(scene === 3 || scene === 6);
	const linesOn = $derived(scene >= 4);
	const joinOn = $derived(scene === 5 || scene === 7);
	const customerNames = $derived(
		tx.customers.map((n, i) => (i === 1 && renamed && scene === 7 ? tx.newName : n))
	);

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

	// On the relation scene the orders take turns, each one lighting up its two lines.
	$effect(() => {
		const sc = scene;
		if (sc !== 4 || reduced) {
			focus = -1;
			return;
		}
		focus = -1;
		let k = 0;
		const t = setInterval(() => {
			focus = k % (ORDERS.length + 1) === ORDERS.length ? -1 : k % (ORDERS.length + 1);
			k += 1;
		}, 1500);
		return () => clearInterval(t);
	});

	const custLine = (j: number) => {
		const oy = rowMid(ORD.y, j);
		const cy = rowMid(TOP.y, ORDERS[j][0] - 1);
		const x1 = CUST_X + TOP.w;
		return `M${x1} ${cy} C${x1 + 26} ${cy} ${ORD.x - 34} ${oy} ${ORD.x} ${oy}`;
	};
	const prodLine = (j: number) => {
		const oy = rowMid(ORD.y, j);
		const py = rowMid(TOP.y, ORDERS[j][1] - 1);
		const x1 = PROD_X;
		const x2 = ORD.x + ORD.w;
		return `M${x1} ${py} C${x1 - 26} ${py} ${x2 + 34} ${oy} ${x2} ${oy}`;
	};
	const custHot = (k: number) => focus >= 0 && ORDERS[focus][0] === k + 1;
	const prodHot = (k: number) => focus >= 0 && ORDERS[focus][1] === k + 1;
	/** The first order of a customer is fine, later copies of the same name are the problem. */
	const isRepeat = (j: number) => ORDERS.slice(0, j).some((o) => o[0] === ORDERS[j][0]);

	function toggleRename() {
		renamed = !renamed;
		onstate?.(renamed ? 'rename' : 'back');
	}
</script>

{#snippet smallTable(x: number, name: string, values: string[], hot: (k: number) => boolean)}
	<g class="card">
		<rect {x} y={TOP.y} width={TOP.w} height={TITLE_H + HEAD_H + ROW_H * 3} rx="10" class="body" />
		<text x={x + 10} y={TOP.y + 15} class="tname">{name}</text>
		<rect
			x={x + 1}
			y={TOP.y + TITLE_H}
			width="34"
			height={HEAD_H + ROW_H * 3 - 1}
			class="pk"
			class:on={pkOn}
		/>
		<text x={x + 10} y={TOP.y + TITLE_H + 13} class="head">{tx.idCol}</text>
		<text x={x + 44} y={TOP.y + TITLE_H + 13} class="head">{tx.nameCol}</text>
		<line x1={x} x2={x + TOP.w} y1={rowY(TOP.y, 0)} y2={rowY(TOP.y, 0)} class="rule-line" />
		{#each values as v, k (k)}
			<rect
				x={x + 1}
				y={rowY(TOP.y, k)}
				width={TOP.w - 2}
				height={ROW_H}
				class="row"
				class:hot={hot(k)}
			/>
			<text x={x + 14} y={rowMid(TOP.y, k) + 4} class="cell idn" class:key={pkOn}>{k + 1}</text>
			{#key v}
				<text x={x + 44} y={rowMid(TOP.y, k) + 4} class="cell" class:fresh={v === tx.newName}
					>{v}</text
				>
			{/key}
		{/each}
	</g>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 7}
					<button type="button" class="try" onclick={toggleRename}>
						{renamed
							? tx.renameBack
							: tx.rename.replace('{from}', tx.customers[1]).replace('{to}', tx.newName)}
					</button>
				{/if}

				<svg viewBox="0 0 360 302" class="map" class:short={joinOn} aria-hidden="true">
					<!-- relation lines sit behind the cards -->
					{#if linesOn}
						{#each ORDERS as _, j (j)}
							<path
								d={custLine(j)}
								pathLength="1"
								class="link cust"
								class:draw={s === 4 && !reduced}
								class:hot={focus === j}
								class:quiet={focus >= 0 && focus !== j}
								style="animation-delay:{j * 0.25}s"
							/>
							<path
								d={prodLine(j)}
								pathLength="1"
								class="link prod"
								class:draw={s === 4 && !reduced}
								class:hot={focus === j}
								class:quiet={focus >= 0 && focus !== j}
								style="animation-delay:{0.5 + j * 0.25}s"
							/>
						{/each}
					{/if}

					{@render smallTable(CUST_X, tx.customersTable, customerNames, custHot)}
					{@render smallTable(PROD_X, tx.productsTable, tx.products, prodHot)}

					{#if showOrders}
						<g class="card" in:fly={{ y: 10, duration: reduced ? 0 : 500 }}>
							<rect
								x={ORD.x}
								y={ORD.y}
								width={ORD.w}
								height={TITLE_H + HEAD_H + ROW_H * ORDERS.length}
								rx="10"
								class="body"
							/>
							<text x={ORD.x + 10} y={ORD.y + 15} class="tname">{tx.ordersTable}</text>
							<rect
								x={ORD.x + 1}
								y={ORD.y + TITLE_H}
								width={OC.cust - 1}
								height={HEAD_H + ROW_H * ORDERS.length - 1}
								class="pk"
								class:on={pkOn}
							/>
							{#if !copied}
								<rect
									x={ORD.x + OC.cust}
									y={ORD.y + TITLE_H}
									width={OC.prod - OC.cust}
									height={HEAD_H + ROW_H * ORDERS.length - 1}
									class="fk cust"
									class:on={fkOn}
								/>
								<rect
									x={ORD.x + OC.prod}
									y={ORD.y + TITLE_H}
									width={OC.end - OC.prod - 1}
									height={HEAD_H + ROW_H * ORDERS.length - 1}
									class="fk prod"
									class:on={fkOn}
								/>
							{/if}
							<text x={ORD.x + 10} y={ORD.y + TITLE_H + 13} class="head">{tx.idCol}</text>
							<text x={ORD.x + OC.cust + 8} y={ORD.y + TITLE_H + 13} class="head"
								>{copied ? tx.copiedCustomer : tx.customerKey}</text
							>
							<text x={ORD.x + OC.prod + 8} y={ORD.y + TITLE_H + 13} class="head"
								>{copied ? tx.copiedProduct : tx.productKey}</text
							>
							<line
								x1={ORD.x}
								x2={ORD.x + ORD.w}
								y1={rowY(ORD.y, 0)}
								y2={rowY(ORD.y, 0)}
								class="rule-line"
							/>
							{#each ORDERS as [c, p], j (j)}
								<rect
									x={ORD.x + 1}
									y={rowY(ORD.y, j)}
									width={ORD.w - 2}
									height={ROW_H}
									class="row"
									class:hot={focus === j}
								/>
								<text x={ORD.x + 14} y={rowMid(ORD.y, j) + 4} class="cell idn" class:key={pkOn}
									>{j + 1}</text
								>
								{#if copied}
									<rect
										x={ORD.x + OC.cust + 4}
										y={rowY(ORD.y, j) + 3}
										width={OC.prod - OC.cust - 8}
										height={ROW_H - 6}
										rx="5"
										class="dup"
										class:on={isRepeat(j)}
									/>
									<text x={ORD.x + OC.cust + 8} y={rowMid(ORD.y, j) + 4} class="cell"
										>{tx.customers[c - 1]}</text
									>
									<text x={ORD.x + OC.prod + 8} y={rowMid(ORD.y, j) + 4} class="cell"
										>{tx.products[p - 1]}</text
									>
								{:else}
									<text
										x={ORD.x + OC.cust + 30}
										y={rowMid(ORD.y, j) + 4}
										class="cell idn cust"
										class:key={fkOn || focus === j}>{c}</text
									>
									<text
										x={ORD.x + OC.prod + 30}
										y={rowMid(ORD.y, j) + 4}
										class="cell idn prod"
										class:key={fkOn || focus === j}>{p}</text
									>
								{/if}
							{/each}
						</g>
						{#if linesOn}
							{#each ORDERS as _, j (j)}
								<circle cx={ORD.x} cy={rowMid(ORD.y, j)} r="3" class="dot cust" />
								<circle cx={ORD.x + ORD.w} cy={rowMid(ORD.y, j)} r="3" class="dot prod" />
							{/each}
							{#each [0, 1, 2] as k (k)}
								<circle cx={CUST_X + TOP.w} cy={rowMid(TOP.y, k)} r="3" class="dot cust" />
								<circle cx={PROD_X} cy={rowMid(TOP.y, k)} r="3" class="dot prod" />
							{/each}
						{/if}
					{/if}
				</svg>

				{#if joinOn}
					<div class="join" in:fade={{ duration: 300 }}>
						<p class="join-title">{tx.joinTitle}</p>
						<ol>
							{#each ORDERS as [c, p], j (j)}
								<li
									in:fly={{ y: 6, duration: reduced ? 0 : 350, delay: reduced ? 0 : 300 + j * 380 }}
								>
									<span class="num">{j + 1}</span>
									{#key customerNames[c - 1]}
										<span class:flash={renamed && c === 2 && s === 7}
											>{tx.bought
												.replace('{who}', customerNames[c - 1])
												.replace('{what}', tx.products[p - 1])}</span
										>
									{/key}
								</li>
							{/each}
						</ol>
					</div>
				{/if}

				{#if s === 6}
					<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
				{/if}
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
		align-items: flex-start;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.try {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.try:hover {
		transform: translateY(-1px);
	}
	.map {
		display: block;
		width: 100%;
		max-height: 54vh;
	}
	.map.short {
		max-height: 40vh;
	}

	/* cards */
	.body {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.tname {
		fill: var(--color-muted);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11px;
		font-weight: 700;
	}
	.head {
		fill: var(--color-faint);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9.5px;
		font-weight: 700;
	}
	.rule-line {
		stroke: var(--color-line);
		stroke-width: 1;
	}
	.row {
		fill: transparent;
		transition: fill 0.35s;
	}
	.row.hot {
		fill: var(--color-brand-soft);
	}
	.cell {
		fill: var(--color-ink);
		font-size: 11.5px;
	}
	.cell.fresh {
		fill: var(--color-grass);
		font-weight: 700;
	}
	.idn {
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-weight: 700;
		fill: var(--color-muted);
		transition: fill 0.35s;
	}
	.idn.key {
		fill: var(--color-amber);
	}
	.idn.cust.key {
		fill: var(--color-brand);
	}
	.idn.prod.key {
		fill: var(--color-grass);
	}
	.pk,
	.fk {
		fill: transparent;
		transition: fill 0.4s;
	}
	.pk.on {
		fill: var(--color-amber-soft);
	}
	.fk.cust.on {
		fill: var(--color-brand-soft);
	}
	.fk.prod.on {
		fill: var(--color-grass-soft);
	}
	.dup {
		fill: transparent;
		transition: fill 0.4s;
	}
	.dup.on {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1;
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.45;
		}
	}

	/* relation lines */
	.link {
		fill: none;
		stroke-width: 1.6;
		opacity: 0.7;
		transition:
			opacity 0.35s,
			stroke-width 0.35s;
	}
	.link.cust {
		stroke: var(--color-brand);
	}
	.link.prod {
		stroke: var(--color-grass);
	}
	.link.hot {
		stroke-width: 2.6;
		opacity: 1;
	}
	.link.quiet {
		opacity: 0.18;
	}
	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.9s ease forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.dot.cust {
		fill: var(--color-brand);
	}
	.dot.prod {
		fill: var(--color-grass);
	}

	/* joined answer */
	.join {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 14px;
	}
	.join-title {
		margin: 0 0 6px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 3px 0;
		font-size: 13.5px;
		color: var(--color-ink);
	}
	.num {
		display: inline-grid;
		height: 20px;
		width: 20px;
		flex: none;
		place-items: center;
		border-radius: 999px;
		background: var(--color-paper);
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.flash {
		color: var(--color-grass);
		font-weight: 700;
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.row,
		.link,
		.idn,
		.pk,
		.fk {
			transition: none;
		}
		.dup.on {
			animation: none;
		}
		.draw {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
