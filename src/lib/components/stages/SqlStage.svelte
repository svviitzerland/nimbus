<script lang="ts">
	// A guided "watch" stage for SQL. The products table fills itself in, then a question in plain
	// words appears, its query types itself, and the database checks the rows one by one so the
	// matching ones light up by themselves. The last scene lets the learner ask another question,
	// which is optional.
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { SqlColumn, SqlProduct, SqlQuestionId, SqlText } from '$lib/chapters/web/sql/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as SqlText);

	// Which scene each beat shows (ten beats, eight scenes).
	const SCENE_OF_BEAT = [0, 0, 1, 2, 3, 4, 5, 6, 6, 7];
	const GROUP_SCENE = 5;
	const REMEMBER = 6;
	const TRY = 7;
	const COLS: SqlColumn[] = ['name', 'price', 'stock'];
	type Question = {
		id: SqlQuestionId;
		cols: SqlColumn[] | null;
		test: ((p: SqlProduct) => boolean) | null;
		sort: boolean;
	};
	const QUESTIONS: Question[] = [
		{ id: 'all', cols: null, test: null, sort: false },
		{ id: 'pick', cols: ['name', 'price'], test: null, sort: false },
		{ id: 'out', cols: ['name', 'price'], test: (p) => p.stock === 0, sort: false },
		{ id: 'cheap', cols: ['name', 'price'], test: (p) => p.price < 50000, sort: true }
	];
	// The aggregation question runs on the orders table and is not part of the try it cycle.
	const GROUP_Q: Question = { id: 'group', cols: null, test: null, sort: true };
	const ALL_Q = [...QUESTIONS, GROUP_Q];
	const Q_OF_SCENE = [-1, 0, 1, 2, 3, 4, 3];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let played = $state(0); // the question picked on the try it scene

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const qi = $derived(scene === TRY ? played : Q_OF_SCENE[scene]);
	const q = $derived(qi >= 0 ? ALL_Q[qi] : null);
	const grouping = $derived(q?.id === 'group');

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

	type Line = { text: string; kw: string; tag: keyof SqlText['clauseTags'] };
	const lines = $derived.by<Line[]>(() => {
		if (!q) return [];
		const c = tx.columns;
		if (q.id === 'group') {
			const oc = tx.orderColumns;
			return [
				{ text: `${oc.city}, COUNT(*), SUM(${oc.total})`, kw: 'SELECT', tag: 'select' },
				{ text: tx.ordersTable, kw: 'FROM', tag: 'from' },
				{ text: `${oc.city};`, kw: 'GROUP BY', tag: 'where' }
			];
		}
		const out: Line[] = [
			{
				text: q.cols ? q.cols.map((k) => c[k]).join(', ') : '*',
				kw: 'SELECT',
				tag: 'select'
			},
			{ text: tx.tableName, kw: 'FROM', tag: 'from' }
		];
		if (q.id === 'out') out.push({ text: `${c.stock} = 0`, kw: 'WHERE', tag: 'where' });
		if (q.id === 'cheap') {
			out.push({ text: `${c.price} < 50000`, kw: 'WHERE', tag: 'where' });
			out.push({ text: c.price, kw: 'ORDER BY', tag: 'order' });
		}
		out[out.length - 1] = { ...out[out.length - 1], text: out[out.length - 1].text + ';' };
		return out;
	});
	const fullLength = $derived(lines.reduce((s, l) => s + l.kw.length + 1 + l.text.length, 0));

	let typed = $state(0); // characters of the query written so far
	let checked = $state(0); // rows the database has looked at
	let sorted = $state(false);
	let rowsShown = $state(6); // rows of the table drawn so far, on the first scene

	// One little script per scene. The table fills in, or the query types itself and then the
	// rows are checked one at a time, and finally sorted when the query asks for it.
	$effect(() => {
		const sc = scene;
		const question = q;
		const total = fullLength;
		const n = question?.id === 'group' ? tx.orders.length : tx.products.length;
		if (reduced) {
			rowsShown = n;
			typed = total;
			checked = n;
			sorted = true;
			return;
		}
		let t: ReturnType<typeof setTimeout>;
		if (sc === 0 || !question) {
			rowsShown = 0;
			typed = 0;
			checked = 0;
			sorted = false;
			const grow = () => {
				rowsShown += 1;
				if (rowsShown < n) t = setTimeout(grow, 420);
			};
			t = setTimeout(grow, 500);
			return () => clearTimeout(t);
		}
		rowsShown = n;
		typed = 0;
		checked = 0;
		sorted = false;
		// The remember scene keeps the finished query on screen instead of typing it again.
		if (sc === REMEMBER) {
			typed = total;
			checked = n;
			sorted = true;
			return;
		}
		const scan = () => {
			checked += 1;
			if (checked < n) t = setTimeout(scan, question.test || question.id === 'group' ? 360 : 110);
			else if (question.sort) t = setTimeout(() => (sorted = true), 700);
		};
		const type = () => {
			typed += 1;
			if (typed < total) t = setTimeout(type, 42);
			else t = setTimeout(scan, 550);
		};
		t = setTimeout(type, 450);
		return () => clearTimeout(t);
	});

	/** How much of each query line is written so far. */
	const shownLines = $derived.by(() => {
		let left = typed;
		return lines.map((l) => {
			const full = l.kw.length + 1 + l.text.length;
			const take = Math.max(0, Math.min(full, left));
			left -= full;
			const kw = l.kw.slice(0, take);
			const rest = take > l.kw.length + 1 ? l.text.slice(0, take - l.kw.length - 1) : '';
			return { kw, rest, gap: take > l.kw.length, started: take > 0, done: take === full };
		});
	});
	const typing = $derived(q !== null && typed < fullLength);
	const rowCount = $derived(grouping ? tx.orders.length : tx.products.length);
	const scanning = $derived(q !== null && !typing && checked < rowCount);

	const passes = (p: SqlProduct) => !q || !q.test || q.test(p);
	const rows = $derived.by(() => {
		const all = tx.products.map((p, i) => ({ ...p, i }));
		if (!q || !sorted || !q.sort) return all;
		const keep = all.filter((r) => passes(r)).sort((a, b) => a.price - b.price);
		return [...keep, ...all.filter((r) => !passes(r))];
	});
	const colOn = (c: SqlColumn) => !q || !q.cols || checked === 0 || q.cols.includes(c);
	const answered = $derived(q !== null && checked >= rowCount);

	// The orders table, its cities in order of first appearance, and the grouped answer.
	const cities = $derived([...new Set(tx.orders.map((o) => o.city))]);
	const groupOf = (city: string) => cities.indexOf(city);
	const orderRows = $derived.by(() => {
		const all = tx.orders.map((o, i) => ({ ...o, i }));
		if (!sorted) return all;
		return [...all].sort((a, b) => groupOf(a.city) - groupOf(b.city) || a.i - b.i);
	});
	const summary = $derived(
		cities.map((city) => {
			const rows = tx.orders.filter((o) => o.city === city);
			return { city, count: rows.length, sum: rows.reduce((t, o) => t + o.total, 0) };
		})
	);
	const backCount = $derived(
		grouping ? cities.length : tx.products.filter((p) => passes(p)).length
	);

	function another() {
		played = (played + 1) % QUESTIONS.length;
		onstate?.(QUESTIONS[played].id);
	}
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === TRY}
					<button type="button" class="try" onclick={another}>{tx.another}</button>
				{/if}

				{#if q}
					<div class="ask" in:fade={{ duration: 250 }}>
						<span class="ask-label">{tx.questionLabel}</span>
						{#key q.id}
							<span class="ask-text" in:fade={{ duration: 300 }}>{tx.questions[q.id]}</span>
						{/key}
					</div>
					<div class="editor">
						<div class="bar">
							<i></i><i></i><i></i>
							<span>{tx.fileName}</span>
						</div>
						<div class="code">
							{#each shownLines as l, k (k)}
								<div class="line" class:blank={!l.started}>
									<span class="src"
										><span class="kw">{l.kw}</span>{l.gap
											? ' '
											: ''}{l.rest}{#if typing && l.started && !l.done}<span class="caret"
											></span>{/if}</span
									>
									{#if s === REMEMBER}
										<span class="clause" in:fade={{ duration: 300, delay: k * 250 }}
											>{tx.clauseTags[lines[k].tag]}</span
										>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				{#if grouping}
					<div class="table-card">
						<p class="table-name">{tx.ordersTable}</p>
						<table>
							<thead>
								<tr>
									<th>{tx.orderColumns.city}</th>
									<th class="num">{tx.orderColumns.total}</th>
								</tr>
							</thead>
							<tbody>
								{#each orderRows as r (r.i)}
									<tr
										animate:flip={{ duration: reduced ? 0 : 500 }}
										class="g{groupOf(r.city)}"
										class:looking={scanning && r.i === checked}
										class:piled={r.i < checked}
									>
										<td><span class="pile"></span>{r.city}</td>
										<td class="num">{r.total}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="table-card result" class:show={answered && sorted}>
						<p class="table-name">{tx.resultLabel}</p>
						<table>
							<thead>
								<tr>
									<th>{tx.orderColumns.city}</th>
									<th class="num">COUNT(*)</th>
									<th class="num">SUM({tx.orderColumns.total})</th>
								</tr>
							</thead>
							<tbody>
								{#each summary as g, k (g.city)}
									<tr class="g{k} piled">
										<td><span class="pile"></span>{g.city}</td>
										<td class="num">{g.count}</td>
										<td class="num">{g.sum}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="table-card">
						<p class="table-name">{tx.tableName}</p>
						<table>
							<thead>
								<tr>
									{#each COLS as c (c)}
										<th class:dim={!colOn(c)} class:num={c !== 'name'}>{tx.columns[c]}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each rows as r (r.name)}
									<tr
										animate:flip={{ duration: reduced ? 0 : 500 }}
										class:hidden={r.i >= rowsShown}
										class:looking={scanning && r.i === checked}
										class:lit={q !== null && r.i < checked && passes(r)}
										class:out={q !== null && r.i < checked && !passes(r)}
									>
										<td class:dim={!colOn('name')}>{r.name}</td>
										<td class="num" class:dim={!colOn('price')}>{r.price}</td>
										<td class="num" class:dim={!colOn('stock')} class:zero={r.stock === 0}
											>{r.stock}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
						<p class="back" class:show={answered}>
							{tx.rowsBack.replace('{n}', String(backCount))}
						</p>
					</div>
				{/if}

				{#if s === REMEMBER}
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
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: stretch;
		gap: 10px;
	}
	.try {
		align-self: center;
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

	.ask {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		text-align: center;
	}
	.ask-label {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.ask-text {
		font-size: 15px;
		font-weight: 600;
		color: var(--color-ink);
	}

	.editor {
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 7px 12px;
	}
	.bar i {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.bar span {
		margin-left: 6px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.code {
		padding: 10px 14px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		line-height: 1.7;
		min-height: 3.4em;
	}
	.line {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.line.blank {
		display: none;
	}
	.src {
		white-space: pre-wrap;
		word-break: break-word;
		color: var(--color-ink);
	}
	.kw {
		font-weight: 700;
		color: var(--color-brand);
	}
	.caret {
		display: inline-block;
		height: 1em;
		width: 2px;
		margin-left: 1px;
		vertical-align: -2px;
		background: var(--color-brand);
		animation: blink 0.9s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	.clause {
		flex: none;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 1px 9px;
		font-family: var(--font-sans, inherit);
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
	}

	.table-card {
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 12px 8px;
	}
	.table-name {
		margin: 0 0 6px 4px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 13px;
	}
	th {
		border-bottom: 1.5px solid var(--color-line);
		padding: 4px 8px 6px;
		text-align: left;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-faint);
		transition: opacity 0.4s;
	}
	td {
		border-bottom: 1px solid var(--color-line);
		padding: 6px 8px;
		color: var(--color-ink);
		transition:
			opacity 0.4s,
			color 0.3s;
	}
	tr:last-child td {
		border-bottom: none;
	}
	.num {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	.zero {
		color: var(--color-danger);
		font-weight: 700;
	}
	.dim {
		opacity: 0.18;
	}
	tbody tr {
		transition:
			background 0.35s,
			opacity 0.4s,
			transform 0.4s;
	}
	tbody tr.hidden {
		opacity: 0;
		transform: translateY(6px);
	}
	tbody tr.looking {
		background: var(--color-amber-soft);
	}
	tbody tr.lit {
		background: var(--color-brand-soft);
	}
	tbody tr.out {
		opacity: 0.32;
	}
	/* the aggregation scene, each city gets its own pile colour */
	tbody tr.piled.g0 {
		background: var(--color-brand-soft);
	}
	tbody tr.piled.g1 {
		background: var(--color-grass-soft);
	}
	tbody tr.piled.g2 {
		background: var(--color-amber-soft);
	}
	.pile {
		display: inline-block;
		width: 8px;
		height: 8px;
		margin-right: 7px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.3s;
	}
	tr.piled.g0 .pile {
		background: var(--color-brand);
	}
	tr.piled.g1 .pile {
		background: var(--color-grass);
	}
	tr.piled.g2 .pile {
		background: var(--color-amber);
	}
	.result {
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.result.show {
		opacity: 1;
		transform: none;
	}
	.result td {
		font-weight: 700;
	}
	.back {
		margin: 6px 0 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-grass);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.back.show {
		opacity: 1;
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
		.code {
			font-size: 12.5px;
		}
		table {
			font-size: 12.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		tbody tr,
		td,
		th,
		.back {
			transition: none;
		}
		.caret {
			animation: none;
		}
	}
</style>
