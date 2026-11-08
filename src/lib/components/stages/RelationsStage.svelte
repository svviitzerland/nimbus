<script lang="ts">
	import { onDestroy } from 'svelte';
	import DbTable, { type Tone } from './database/DbTable.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { RelationsText } from '$lib/chapters/web/relations/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as RelationsText);

	// order id, customer id, product id. Bima orders twice, so one customer has many orders.
	const ORDERS: [number, number, number][] = [
		[1, 2, 1],
		[2, 1, 3],
		[3, 3, 2],
		[4, 2, 3]
	];

	type Key = 'customer' | 'product';
	type Target = 'customers' | 'products';
	let pending = $state<Key | null>(null);
	let linked = $state<Record<Key, boolean>>({ customer: false, product: false });
	let focus = $state<number | null>(null); // index into ORDERS
	let joined = $state(false);
	let nudge = $state('');
	let followed = false;
	let shake = $state(false);
	let shakeTimer: ReturnType<typeof setTimeout> | undefined;
	onDestroy(() => clearTimeout(shakeTimer));

	const bothLinked = $derived(linked.customer && linked.product);
	const TONE: Record<Key, Tone> = { customer: 'brand', product: 'amber' };

	function pickKey(j: number) {
		nudge = '';
		const k: Key | null = j === 1 ? 'customer' : j === 2 ? 'product' : null;
		if (!k || linked[k]) return;
		pending = pending === k ? null : k;
	}

	function pickTarget(t: Target, j: number) {
		if (!pending) {
			const anyLeft = !linked.customer || !linked.product;
			nudge = anyLeft ? tx.hintKeyFirst : '';
			return;
		}
		const right = j === 0 && (pending === 'customer') === (t === 'customers');
		if (right) {
			linked[pending] = true;
			onstate?.(pending);
			pending = null;
		} else {
			onstate?.('wrong');
			shake = false;
			clearTimeout(shakeTimer);
			requestShake();
		}
	}
	function requestShake() {
		shake = true;
		shakeTimer = setTimeout(() => (shake = false), 450);
	}

	function follow(i: number) {
		if (!bothLinked) return;
		focus = focus === i ? null : i;
		if (!followed && focus !== null) {
			followed = true;
			if (!joined) onstate?.('follow');
		}
	}

	let finished = false;
	function join() {
		joined = true;
		focus = null;
		onstate?.('joined');
		if (!finished) {
			finished = true;
			oncomplete?.();
		}
	}

	const hint = $derived(
		nudge
			? nudge
			: pending
				? tx.hintPickTarget.replace(
						'{key}',
						pending === 'customer' ? tx.customerKey : tx.productKey
					)
				: !bothLinked
					? tx.hintPickKey
					: joined
						? tx.hintJoined
						: tx.hintFollow
	);

	// Order rows, each key column coloured once it is linked.
	const orderRows = $derived(ORDERS.map((o) => [...o]));
	function orderColTone(j: number): Tone {
		if (j === 1) return linked.customer || pending === 'customer' ? TONE.customer : '';
		if (j === 2) return linked.product || pending === 'product' ? TONE.product : '';
		return '';
	}
	function orderRowTone(i: number): Tone {
		if (focus === null) return '';
		return focus === i ? 'grass' : 'dim';
	}
	const customerRows = $derived(tx.customers.map((n, i) => [i + 1, n]));
	const productRows = $derived(tx.products.map((n, i) => [i + 1, n]));
	function targetRowTone(t: Target, i: number): Tone {
		if (focus === null) return '';
		const o = ORDERS[focus];
		const want = t === 'customers' ? o[1] : o[2];
		if (want !== i + 1) return 'dim';
		return t === 'customers' ? 'brand' : 'amber';
	}
	function targetColTone(t: Target, j: number): Tone {
		if (j !== 0) return '';
		if (t === 'customers' && linked.customer) return TONE.customer;
		if (t === 'products' && linked.product) return TONE.product;
		return '';
	}

	const joinedRows = $derived(
		ORDERS.map(([o, c, p]) => [o, tx.customers[c - 1], tx.products[p - 1]])
	);
	const sql = $derived([
		{ kw: 'SELECT', rest: `${tx.customersTable}.${tx.nameCol}, ${tx.productsTable}.${tx.nameCol}` },
		{ kw: 'FROM', rest: tx.ordersTable },
		{
			kw: 'JOIN',
			rest: `${tx.customersTable} ON ${tx.ordersTable}.${tx.customerKey} = ${tx.customersTable}.${tx.idCol}`
		},
		{
			kw: 'JOIN',
			rest: `${tx.productsTable} ON ${tx.ordersTable}.${tx.productKey} = ${tx.productsTable}.${tx.idCol}`
		}
	]);
</script>

<div class="wrap">
	<p class="hint" class:warn={!!nudge} role="status">{hint}</p>

	<div class="orders">
		<DbTable
			name={tx.ordersTable}
			cols={[tx.idCol, tx.customerKey, tx.productKey]}
			rows={orderRows}
			widths="minmax(0, 0.5fr) minmax(0, 1fr) minmax(0, 1fr)"
			num={[true, true, true]}
			colTone={orderColTone}
			rowTone={orderRowTone}
			onheader={bothLinked ? undefined : pickKey}
			onrow={bothLinked ? follow : undefined}
			headerLabel={tx.headerHint}
		/>
	</div>

	<div class="pills">
		<span class="pill" class:on={linked.customer} style="--tone:var(--color-brand)">
			<code>{tx.customerKey}</code>
			<svg viewBox="0 0 20 10" aria-hidden="true"
				><path
					d="M1 5h16M13 1.5 17 5l-4 3.5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
			<code>{linked.customer ? `${tx.customersTable}.${tx.idCol}` : tx.notLinked}</code>
		</span>
		<span class="pill" class:on={linked.product} style="--tone:var(--color-amber)">
			<code>{tx.productKey}</code>
			<svg viewBox="0 0 20 10" aria-hidden="true"
				><path
					d="M1 5h16M13 1.5 17 5l-4 3.5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
					stroke-linejoin="round"
				/></svg
			>
			<code>{linked.product ? `${tx.productsTable}.${tx.idCol}` : tx.notLinked}</code>
		</span>
	</div>

	<div class="targets" class:shake class:ready={!!pending}>
		<DbTable
			name={tx.customersTable}
			cols={[tx.idCol, tx.nameCol]}
			rows={customerRows}
			widths="minmax(0, 0.55fr) minmax(0, 1.45fr)"
			num={[true, false]}
			colTone={(j) => targetColTone('customers', j)}
			rowTone={(i) => targetRowTone('customers', i)}
			onheader={bothLinked ? undefined : (j) => pickTarget('customers', j)}
			headerLabel={tx.headerHint}
		/>
		<DbTable
			name={tx.productsTable}
			cols={[tx.idCol, tx.nameCol]}
			rows={productRows}
			widths="minmax(0, 0.55fr) minmax(0, 1.45fr)"
			num={[true, false]}
			colTone={(j) => targetColTone('products', j)}
			rowTone={(i) => targetRowTone('products', i)}
			onheader={bothLinked ? undefined : (j) => pickTarget('products', j)}
			headerLabel={tx.headerHint}
		/>
	</div>

	{#if bothLinked && !joined}
		<button type="button" class="join" onclick={join}>{tx.joinBtn}</button>
	{/if}

	{#if joined}
		<div class="joined">
			<pre class="code">{#each sql as l, i (i)}<span class="kw">{l.kw}</span> {l.rest}{i ===
					sql.length - 1
						? ';\n'
						: '\n'}{/each}</pre>
			<DbTable
				name={tx.joinedTitle}
				cols={tx.joinedCols}
				rows={joinedRows}
				widths="minmax(0, 0.6fr) minmax(0, 1fr) minmax(0, 1.4fr)"
				num={[true, false, false]}
				colTone={(j) => (j === 1 ? 'brand' : j === 2 ? 'amber' : '')}
			/>
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 460px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 8px;
	}
	.hint {
		margin: 0;
		min-height: 1.4em;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
		transition: color 0.2s ease;
	}
	.hint.warn {
		color: var(--color-amber);
	}
	.orders {
		width: min(100%, 300px);
	}

	.pills {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 4px 10px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-faint);
		font-size: 11px;
		transition:
			color 0.25s ease,
			border-color 0.25s ease;
	}
	.pill.on {
		color: var(--tone);
		border-color: var(--tone);
	}
	.pill code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
	}
	.pill svg {
		width: 16px;
		height: 8px;
		flex: none;
	}

	.targets {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		width: 100%;
		border-radius: 14px;
		transition: box-shadow 0.25s ease;
	}
	.targets.ready {
		box-shadow: 0 0 0 4px var(--color-brand-soft);
	}
	.targets.shake {
		animation: shake 0.4s ease;
	}
	@keyframes shake {
		25% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
	}

	.join {
		border-radius: 12px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 10px 20px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 700;
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

	.joined {
		display: flex;
		flex-direction: column;
		gap: 8px;
		width: 100%;
	}
	.code {
		margin: 0;
		padding: 9px 12px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		line-height: 1.55;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		color: var(--color-ink);
	}
	.kw {
		color: var(--color-brand);
		font-weight: 700;
	}
	.joined :global(.row.body) {
		animation: rowin 0.4s ease both;
	}
	.joined :global(.row.body:nth-of-type(3)) {
		animation-delay: 0.15s;
	}
	.joined :global(.row.body:nth-of-type(4)) {
		animation-delay: 0.3s;
	}
	.joined :global(.row.body:nth-of-type(5)) {
		animation-delay: 0.45s;
	}
	.joined :global(.row.body:nth-of-type(6)) {
		animation-delay: 0.6s;
	}
	@keyframes rowin {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	@media (min-width: 768px) {
		.hint {
			font-size: 14px;
		}
		.pill {
			font-size: 12px;
		}
		.code {
			font-size: 12.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.targets.shake,
		.join,
		.joined :global(.row.body) {
			animation: none;
		}
		.pill,
		.targets {
			transition: none;
		}
	}
</style>
