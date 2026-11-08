<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import DbTable from './database/DbTable.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SqlText, SqlMissionId, SqlColumn } from '$lib/chapters/web/sql/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as SqlText);

	// ---- The blocks the learner snaps together ----
	type WhereId = 'none' | 'cheap' | 'out' | 'shirt';
	type OrderId = 'none' | 'priceAsc' | 'priceDesc' | 'nameAsc';
	const COLS: SqlColumn[] = ['name', 'category', 'price', 'stock'];
	const WHERES: WhereId[] = ['none', 'cheap', 'out', 'shirt'];
	const ORDERS: OrderId[] = ['none', 'priceAsc', 'priceDesc', 'nameAsc'];

	// An empty pick means the star, every column.
	const picked = new SvelteSet<SqlColumn>();
	let where = $state<WhereId>('none');
	let order = $state<OrderId>('none');

	function toggleCol(c: SqlColumn | '*') {
		if (c === '*') picked.clear();
		else if (picked.has(c)) picked.delete(c);
		else picked.add(c);
		dirty = true;
	}
	function setWhere(w: WhereId) {
		where = w;
		dirty = true;
	}
	function setOrder(o: OrderId) {
		order = o;
		dirty = true;
	}

	const LIMIT = 50000;
	function whereCode(w: WhereId) {
		const c = tx.columns;
		if (w === 'cheap') return `${c.price} < ${LIMIT}`;
		if (w === 'out') return `${c.stock} = 0`;
		if (w === 'shirt') return `${c.category} = '${tx.shirtCategory}'`;
		return '';
	}
	function orderCode(o: OrderId) {
		const c = tx.columns;
		if (o === 'priceAsc') return `${c.price} ASC`;
		if (o === 'priceDesc') return `${c.price} DESC`;
		if (o === 'nameAsc') return `${c.name} ASC`;
		return '';
	}
	function orderHint(o: OrderId) {
		if (o === 'priceAsc') return tx.cheapFirst;
		if (o === 'priceDesc') return tx.priceyFirst;
		if (o === 'nameAsc') return tx.alphabetical;
		return '';
	}

	const chosen = $derived(COLS.filter((c) => picked.has(c)));
	// The query, one clause per line, the way people usually write it.
	const lines = $derived.by(() => {
		const sel = chosen.length ? chosen.map((c) => tx.columns[c]).join(', ') : '*';
		const out: { kw: string; rest: string }[] = [
			{ kw: 'SELECT', rest: sel },
			{ kw: 'FROM', rest: tx.tableName }
		];
		if (where !== 'none') out.push({ kw: 'WHERE', rest: whereCode(where) });
		if (order !== 'none') out.push({ kw: 'ORDER BY', rest: orderCode(order) });
		return out;
	});

	// ---- A tiny query evaluator over the in memory table ----
	type Row = { id: number; name: string; category: string; price: number; stock: number };
	const table = $derived<Row[]>(tx.products.map((p, i) => ({ id: i + 1, ...p })));

	type Ran = { cols: ('id' | SqlColumn)[]; rows: Row[]; where: WhereId; order: OrderId };
	let ran = $state<Ran | null>(null);
	let dirty = $state(false);

	function evaluate(): Ran {
		let rows = table.filter((r) => {
			if (where === 'cheap') return r.price < LIMIT;
			if (where === 'out') return r.stock === 0;
			if (where === 'shirt') return r.category === tx.shirtCategory;
			return true;
		});
		if (order !== 'none') {
			rows = [...rows].sort((a, b) => {
				if (order === 'priceAsc') return a.price - b.price;
				if (order === 'priceDesc') return b.price - a.price;
				return a.name.localeCompare(b.name);
			});
		}
		const cols: Ran['cols'] = chosen.length ? [...chosen] : ['id', ...COLS];
		return { cols, rows, where, order };
	}

	// ---- Missions, checked against what was actually run ----
	const MISSIONS: SqlMissionId[] = ['all', 'pick', 'out', 'cheap'];
	const solved = new SvelteSet<SqlMissionId>();
	let finished = false;

	function fits(m: SqlMissionId, r: Ran): boolean {
		const star = r.cols.includes('id');
		const hasName = star || r.cols.includes('name');
		if (m === 'all') return star && r.where === 'none';
		if (m === 'pick')
			return (
				r.where === 'none' &&
				r.cols.length === 2 &&
				r.cols.includes('name') &&
				r.cols.includes('price')
			);
		if (m === 'out') return r.where === 'out' && hasName;
		return r.where === 'cheap' && r.order === 'priceAsc' && hasName;
	}

	function run() {
		const r = evaluate();
		ran = r;
		dirty = false;
		const matched = MISSIONS.filter((m) => fits(m, r));
		const fresh = matched.filter((m) => !solved.has(m));
		fresh.forEach((m) => solved.add(m));
		if (solved.size === MISSIONS.length && !finished) {
			finished = true;
			onstate?.('done');
			oncomplete?.();
			return;
		}
		if (fresh.length) onstate?.(fresh[fresh.length - 1]);
		else if (!matched.length) onstate?.('miss');
	}

	const resultCols = $derived(ran ? ran.cols.map((c) => (c === 'id' ? 'id' : tx.columns[c])) : []);
	const resultRows = $derived(
		ran ? ran.rows.map((row) => ran!.cols.map((c) => (c === 'id' ? row.id : row[c]))) : []
	);
	const resultNum = $derived(
		ran ? ran.cols.map((c) => c === 'price' || c === 'stock' || c === 'id') : []
	);
	const resultWidths = $derived(
		ran
			? ran.cols
					.map((c) => (c === 'id' ? '0.45fr' : c === 'name' ? '1.5fr' : '1fr'))
					.map((w) => `minmax(0, ${w})`)
					.join(' ')
			: ''
	);
	const allDone = $derived(solved.size === MISSIONS.length);
</script>

<div class="wrap">
	<div class="missions">
		<p class="cap">{tx.missionsLabel}</p>
		<ul>
			{#each MISSIONS as m (m)}
				<li class:ok={solved.has(m)}>
					<span class="dot" aria-hidden="true">
						{#if solved.has(m)}
							<svg viewBox="0 0 16 16"
								><path
									d="M3.5 8.5l3 3 6-6.5"
									fill="none"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/></svg
							>
						{/if}
					</span>
					<span>{tx.missions[m]}</span>
				</li>
			{/each}
		</ul>
	</div>

	<div class="blocks">
		<div class="brow">
			<p class="blabel"><b>SELECT</b> {tx.selectLabel}</p>
			<div class="chips" role="group" aria-label={`SELECT ${tx.selectLabel}`}>
				<button
					type="button"
					class="chip"
					class:on={chosen.length === 0}
					aria-pressed={chosen.length === 0}
					onclick={() => toggleCol('*')}><code>*</code> {tx.allColumns}</button
				>
				{#each COLS as c (c)}
					<button
						type="button"
						class="chip"
						class:on={picked.has(c)}
						aria-pressed={picked.has(c)}
						onclick={() => toggleCol(c)}><code>{tx.columns[c]}</code></button
					>
				{/each}
			</div>
		</div>
		<div class="brow">
			<p class="blabel"><b>WHERE</b> {tx.whereLabel}</p>
			<div class="chips" role="group" aria-label={`WHERE ${tx.whereLabel}`}>
				{#each WHERES as w (w)}
					<button
						type="button"
						class="chip"
						class:on={where === w}
						aria-pressed={where === w}
						onclick={() => setWhere(w)}
						>{#if w === 'none'}{tx.noFilter}{:else}<code>{whereCode(w)}</code>{/if}</button
					>
				{/each}
			</div>
		</div>
		<div class="brow">
			<p class="blabel"><b>ORDER BY</b> {tx.orderLabel}</p>
			<div class="chips" role="group" aria-label={`ORDER BY ${tx.orderLabel}`}>
				{#each ORDERS as o (o)}
					<button
						type="button"
						class="chip"
						class:on={order === o}
						aria-pressed={order === o}
						onclick={() => setOrder(o)}
						>{#if o === 'none'}{tx.noOrder}{:else}<code>{orderCode(o)}</code>
							<small>{orderHint(o)}</small>{/if}</button
					>
				{/each}
			</div>
		</div>
	</div>

	<div class="query">
		<div class="qbar">
			<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
			<span class="fname">{tx.queryLabel}</span>
		</div>
		<pre class="code">{#each lines as l, i (i)}<span class="kw">{l.kw}</span> {l.rest}{i ===
				lines.length - 1
					? ';\n'
					: '\n'}{/each}</pre>
	</div>

	<button type="button" class="run" class:pulse={!ran || dirty} onclick={run}>{tx.run}</button>

	{#if ran}
		<div class="result" class:stale={dirty}>
			<p class="cap">
				{tx.resultLabel}, {tx.rowsCount.replace('{n}', String(ran.rows.length))}
			</p>
			<DbTable
				name={tx.tableName}
				cols={resultCols}
				rows={resultRows}
				num={resultNum}
				widths={resultWidths}
				empty={tx.emptyResult}
			/>
		</div>
	{/if}

	{#if allDone}
		<p class="win" role="status">{tx.allDone}</p>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 560px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 8px;
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

	/* ---- Missions ---- */
	.missions {
		width: 100%;
	}
	.missions ul {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.missions li {
		display: flex;
		align-items: center;
		gap: 7px;
		min-width: 0;
		padding: 6px 9px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 12px;
		line-height: 1.3;
		transition:
			background 0.25s ease,
			color 0.25s ease;
	}
	.missions li.ok {
		border-color: transparent;
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.dot {
		flex: none;
		display: grid;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
	}
	.ok .dot {
		border-color: var(--color-grass);
		background: var(--color-grass);
		color: #fff;
	}
	.dot svg {
		width: 11px;
		height: 11px;
	}

	/* ---- Blocks ---- */
	.blocks {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
		padding: 10px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.blabel {
		margin: 0 0 5px;
		font-size: 11px;
		color: var(--color-faint);
	}
	.blabel b {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-brand);
		margin-right: 4px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
	}
	.chip {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		padding: 5px 10px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 12px;
		font-weight: 600;
		line-height: 1.25;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			transform 0.15s ease;
	}
	.chip:hover {
		border-color: var(--color-brand);
	}
	.chip:active {
		transform: scale(0.96);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.chip code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
	}
	.chip small {
		font-size: 10px;
		font-weight: 500;
		color: var(--color-faint);
	}

	/* ---- The query itself ---- */
	.query {
		width: 100%;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		overflow: hidden;
	}
	.qbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 11px;
		color: var(--color-muted);
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.fname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
	}
	.code {
		margin: 0;
		padding: 9px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12.5px;
		line-height: 1.55;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--color-ink);
	}
	.kw {
		color: var(--color-brand);
		font-weight: 700;
	}

	.run {
		border-radius: 12px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 600;
		transition: filter 0.2s ease;
	}
	.run:hover {
		filter: brightness(1.15);
	}
	.run.pulse {
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

	.result {
		width: 100%;
		transition: opacity 0.25s ease;
	}
	.result.stale {
		opacity: 0.45;
	}

	.win {
		margin: 0;
		padding: 6px 14px;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 12.5px;
		font-weight: 700;
	}

	@media (min-width: 768px) {
		.missions li {
			font-size: 13px;
		}
		.chip {
			font-size: 13px;
		}
		.chip code {
			font-size: 12.5px;
		}
		.code {
			font-size: 13.5px;
		}
		.run {
			font-size: 14px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.chip,
		.missions li,
		.result {
			transition: none;
		}
		.run.pulse {
			animation: none;
		}
	}
</style>
