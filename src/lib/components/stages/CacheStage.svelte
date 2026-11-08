<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CacheText } from '$lib/chapters/web/cache/types';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as CacheText);

	// What each hop costs, in milliseconds. The database is the slow part.
	const APP_MS = 20;
	const REDIS_MS = 2;
	const DB_MS = 800;

	let cacheOn = $state(false);
	// Prices the database holds right now (a sale lowers one), indexed like tx.products.
	let dbPrice = $state<(number | null)[]>([null, null, null]);
	const priceInDb = (i: number) => dbPrice[i] ?? tx.products[i].price;
	// Redis keeps product id -> the price it was given when it was cached.
	const redis = new SvelteMap<number, number>();
	// Products whose key was cleared after a sale, so the next miss shows the fresh price.
	const cleared = new SvelteSet<number>();

	type Hop = '' | 'app' | 'redis' | 'db' | 'back';
	let hop = $state<Hop>('');
	let busy = $state(false);
	let screen = $state<{ i: number; price: number; stale: boolean } | null>(null);
	let lastOpened = $state<number | null>(null);

	type Visit = {
		n: number;
		i: number;
		kind: 'hit' | 'miss' | 'direct';
		ms: number;
		stale: boolean;
	};
	let visits = $state<Visit[]>([]);
	let count = 0;
	let finished = false;
	let saleDone = $state(false);

	let timers: ReturnType<typeof setTimeout>[] = [];
	onDestroy(() => timers.forEach(clearTimeout));
	const reduced = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

	const jitter = (n: number) => Math.round(Math.random() * n);

	function open(i: number) {
		if (busy) return;
		busy = true;
		screen = null;
		lastOpened = i;
		const fast = reduced();
		const step = (ms: number) => (fast ? 0 : ms);

		const cached = cacheOn && redis.has(i);
		const kind: Visit['kind'] = !cacheOn ? 'direct' : cached ? 'hit' : 'miss';
		const plan: [Hop, number][] = [['app', step(160)]];
		if (cacheOn) plan.push(['redis', step(140)]);
		if (!cached) plan.push(['db', step(DB_MS)]);
		plan.push(['back', step(160)]);

		let t = 0;
		for (const [h, d] of plan) {
			timers.push(setTimeout(() => (hop = h), t));
			t += d;
		}
		timers.push(
			setTimeout(() => {
				const fresh = priceInDb(i);
				if (kind === 'miss') redis.set(i, fresh);
				const shown = kind === 'hit' ? (redis.get(i) ?? fresh) : fresh;
				const stale = shown !== fresh;
				screen = { i, price: shown, stale };
				hop = '';
				busy = false;
				const ms =
					kind === 'hit'
						? APP_MS + REDIS_MS + jitter(3)
						: APP_MS + (kind === 'miss' ? REDIS_MS : 0) + DB_MS + jitter(40);
				visits = [{ n: ++count, i, kind, ms, stale }, ...visits].slice(0, 4);

				if (stale) onstate?.('stale');
				else if (kind === 'miss' && cleared.has(i)) {
					cleared.delete(i);
					onstate?.('fresh');
				} else if (kind === 'direct') onstate?.('slow');
				else onstate?.(kind);

				if (kind === 'hit' && !finished) {
					finished = true;
					oncomplete?.();
				}
			}, t)
		);
	}

	function sale() {
		if (busy || lastOpened === null) return;
		const i = lastOpened;
		dbPrice[i] = Math.round((tx.products[i].price * 0.7) / 1000) * 1000;
		saleDone = true;
	}

	function clearKey(i: number) {
		redis.delete(i);
		cleared.add(i);
	}

	const keyOf = (i: number) => `${tx.keyPrefix}${i + 1}`;
	const fmt = (n: number) => `${tx.currency} ${n.toLocaleString(tx.locale)}`;
	const staleKeys = $derived(
		[...redis.entries()].filter(([i, p]) => p !== priceInDb(i)).map(([i]) => i)
	);
	const canSale = $derived(finished && !saleDone && lastOpened !== null);
</script>

<div class="wrap">
	<div class="controls">
		<button
			type="button"
			class="switch"
			class:on={cacheOn}
			role="switch"
			aria-checked={cacheOn}
			disabled={busy}
			onclick={() => (cacheOn = !cacheOn)}
		>
			<span class="track" aria-hidden="true"><span class="knob"></span></span>
			<span>{tx.cacheLabel}</span>
			<b>{cacheOn ? tx.cacheOn : tx.cacheOff}</b>
		</button>
		<div class="acts">
			{#each tx.products as p, i (i)}
				<button type="button" class="open" disabled={busy} onclick={() => open(i)}
					>{tx.openBtn.replace('{name}', p.name)}</button
				>
			{/each}
		</div>
		{#if canSale}
			<button type="button" class="extra" onclick={sale}
				>{tx.saleBtn.replace('{name}', tx.products[lastOpened ?? 0].name)}</button
			>
		{/if}
		{#each staleKeys as i (i)}
			<button type="button" class="extra warn" disabled={busy} onclick={() => clearKey(i)}
				>{tx.clearBtn.replace('{key}', keyOf(i))}</button
			>
		{/each}
	</div>

	<div class="scene">
		<!-- you, on a phone -->
		<div class="actor">
			<div class="phone" class:lit={hop === 'back'}>
				<div class="addr">
					<span class="led" class:on={!!screen}></span>
					<span class="url"
						>nimbus.com{screen || lastOpened !== null
							? `/p/${(screen?.i ?? lastOpened ?? 0) + 1}`
							: ''}</span
					>
				</div>
				<div class="screen">
					{#if busy}
						<span class="spin" aria-label={tx.loading}></span>
					{:else if screen}
						<span class="pimg" aria-hidden="true"></span>
						<b class="pname">{tx.products[screen.i].name}</b>
						<span class="pprice" class:stale={screen.stale}>{fmt(screen.price)}</span>
						{#if screen.stale}<span class="stag">{tx.staleTag}</span>{/if}
					{:else}
						<span class="idle">{tx.idleScreen}</span>
					{/if}
				</div>
			</div>
			<span class="alabel">{tx.youLabel}</span>
		</div>

		<!-- the app server -->
		<div class="actor">
			<div class="srv" class:lit={hop === 'app' || hop === 'back'}>
				<Server active={hop !== ''} />
			</div>
			<span class="alabel">{tx.appLabel}</span>
		</div>

		<!-- redis above, the database below -->
		<div class="stores">
			<div class="box redis" class:off={!cacheOn} class:lit={hop === 'redis'}>
				<div class="bhead">
					<b>{tx.redisLabel}</b>
					<span>{tx.redisSub}</span>
				</div>
				<ul class="keys">
					{#each [...redis.entries()] as [i, p] (i)}
						<li class:stale={staleKeys.includes(i)}>
							<code>{keyOf(i)}</code>
							<span>{p.toLocaleString(tx.locale)}</span>
						</li>
					{:else}
						<li class="none">{tx.emptyCache}</li>
					{/each}
				</ul>
			</div>
			<div class="box db" class:lit={hop === 'db'}>
				<div class="bhead">
					<b>{tx.dbLabel}</b>
					<span>{tx.dbSub}</span>
				</div>
				<div class="disk" aria-hidden="true">
					<span class:spinning={hop === 'db'}></span>
				</div>
				{#if saleDone}<span class="dbnote">{tx.saleNote}</span>{/if}
			</div>
		</div>
	</div>

	<div class="visits">
		<p class="cap">{tx.visitsLabel}</p>
		{#each visits as v (v.n)}
			<div class="visit {v.kind}">
				<span class="vname">{tx.products[v.i].name}</span>
				<span class="vtag"
					>{v.kind === 'hit' ? tx.hitTag : v.kind === 'miss' ? tx.missTag : tx.directTag}</span
				>
				<span class="vbar"><i style="width:{Math.max(3, (v.ms / 860) * 100)}%"></i></span>
				<span class="vms">{v.ms} {tx.ms}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 500px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 8px;
	}

	/* ---- Controls ---- */
	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 12px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 13px;
		color: var(--color-ink);
	}
	.switch b {
		min-width: 3.2em;
		text-align: left;
		color: var(--color-faint);
	}
	.switch.on b {
		color: var(--color-grass);
	}
	.switch:disabled {
		opacity: 0.6;
	}
	.track {
		position: relative;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 3px rgba(22, 40, 60, 0.25);
		transition: transform 0.2s ease;
	}
	.switch.on .track {
		background: var(--color-grass);
	}
	.switch.on .knob {
		transform: translateX(14px);
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.open {
		border-radius: 11px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 8px 13px;
		font-size: 12.5px;
		font-weight: 600;
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
	}
	.open:enabled:hover {
		filter: brightness(1.15);
	}
	.open:disabled {
		opacity: 0.5;
	}
	.extra {
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 7px 12px;
		font-size: 12px;
		font-weight: 600;
	}
	.extra:hover {
		border-color: var(--color-ink);
	}
	.extra.warn {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}

	/* ---- Scene ---- */
	.scene {
		display: grid;
		grid-template-columns: auto auto minmax(0, 1fr);
		align-items: center;
		gap: 10px;
		width: 100%;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
		max-width: 90px;
		line-height: 1.2;
	}
	.phone {
		width: 112px;
		padding: 6px;
		border-radius: 20px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
		transition: box-shadow 0.2s ease;
	}
	.phone.lit {
		box-shadow: 0 0 0 4px var(--color-brand-soft);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 4px 6px;
		border-radius: 12px 12px 0 0;
		background: var(--color-paper);
		border-bottom: 1px solid var(--color-line);
	}
	.led {
		flex: none;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.on {
		background: var(--color-grass);
	}
	.url {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 8.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 3px;
		height: 120px;
		padding: 6px;
		border-radius: 0 0 12px 12px;
		background: var(--color-paper);
		text-align: center;
	}
	.idle {
		font-size: 10px;
		color: var(--color-faint);
	}
	.spin {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2px solid var(--color-line);
		border-top-color: var(--color-brand);
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.pimg {
		width: 54px;
		height: 38px;
		border-radius: 8px;
		background: var(--color-brand-soft);
	}
	.pname {
		font-size: 11px;
		color: var(--color-ink);
		line-height: 1.2;
	}
	.pprice {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.pprice.stale {
		color: var(--color-amber);
	}
	.stag {
		padding: 1px 6px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 9px;
		font-weight: 700;
	}

	.srv {
		border-radius: 12px;
		transition: box-shadow 0.2s ease;
	}
	.srv.lit {
		box-shadow: 0 0 0 4px var(--color-brand-soft);
	}
	.srv :global(.server) {
		width: 54px;
		padding: 6px;
		gap: 5px;
		border-radius: 10px;
	}
	.srv :global(.server .slot) {
		height: 8px;
	}

	.stores {
		display: flex;
		flex-direction: column;
		gap: 8px;
		min-width: 0;
	}
	.box {
		min-width: 0;
		padding: 7px 9px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		transition:
			box-shadow 0.2s ease,
			opacity 0.2s ease;
	}
	.box.lit {
		box-shadow: 0 0 0 4px var(--color-brand-soft);
		border-color: var(--color-brand);
	}
	.box.off {
		opacity: 0.4;
	}
	.bhead {
		display: flex;
		align-items: baseline;
		gap: 6px;
		margin-bottom: 4px;
	}
	.bhead b {
		font-size: 12px;
		color: var(--color-ink);
	}
	.redis .bhead b {
		color: var(--color-danger);
	}
	.bhead span {
		font-size: 10px;
		color: var(--color-faint);
	}
	.keys {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.keys li {
		display: flex;
		justify-content: space-between;
		gap: 6px;
		font-size: 10.5px;
		color: var(--color-ink);
	}
	.keys li code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-brand);
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.keys li span {
		font-variant-numeric: tabular-nums;
	}
	.keys li.stale span {
		color: var(--color-amber);
		font-weight: 700;
	}
	.keys li.none {
		color: var(--color-faint);
	}
	.disk {
		display: flex;
		justify-content: center;
		padding: 2px 0;
	}
	.disk span {
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 2px solid var(--color-line);
		border-top-color: var(--color-faint);
	}
	.disk span.spinning {
		border-top-color: var(--color-amber);
		animation: spin 0.5s linear infinite;
	}
	.dbnote {
		display: block;
		margin-top: 3px;
		font-size: 10px;
		color: var(--color-amber);
		text-align: center;
	}

	/* ---- Visits ---- */
	.visits {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		min-height: 40px;
	}
	.cap {
		margin: 0 0 2px;
		text-align: center;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.visit {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) auto minmax(0, 1fr) 4.5em;
		align-items: center;
		gap: 8px;
		padding: 5px 9px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 11.5px;
		animation: vin 0.3s ease both;
	}
	@keyframes vin {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
	}
	.vname {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--color-ink);
	}
	.vtag {
		padding: 1px 7px;
		border-radius: 999px;
		font-size: 10px;
		font-weight: 700;
		background: var(--color-paper);
		color: var(--color-muted);
	}
	.hit .vtag {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.miss .vtag {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.vbar {
		height: 6px;
		border-radius: 999px;
		background: var(--color-paper);
		overflow: hidden;
	}
	.vbar i {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--color-danger);
	}
	.hit .vbar i {
		background: var(--color-grass);
	}
	.vms {
		text-align: right;
		font-variant-numeric: tabular-nums;
		font-weight: 600;
		color: var(--color-ink);
	}

	@media (min-width: 768px) {
		.phone {
			width: 132px;
		}
		.screen {
			height: 140px;
		}
		.url {
			font-size: 9.5px;
		}
		.pname,
		.pprice {
			font-size: 12.5px;
		}
		.alabel {
			font-size: 11.5px;
		}
		.bhead b {
			font-size: 13px;
		}
		.keys li {
			font-size: 11.5px;
		}
		.visit {
			font-size: 12.5px;
		}
		.open {
			font-size: 13.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.spin,
		.disk span.spinning {
			animation-duration: 2s;
		}
		.visit {
			animation: none;
		}
		.track,
		.knob,
		.phone,
		.srv,
		.box {
			transition: none;
		}
	}
</style>
