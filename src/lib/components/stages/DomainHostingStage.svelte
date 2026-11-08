<script lang="ts">
	import { onDestroy } from 'svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DomainHostingText, HostKind, Tld } from '$lib/chapters/web/domain-hosting/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DomainHostingText);

	const TLDS: Tld[] = ['com', 'id', 'dev'];
	// Names someone else already rented, so a search can come back taken.
	const TAKEN = new Set([
		'kopi.com',
		'warta.com',
		'google.com',
		'google.id',
		'google.dev',
		'shop.com',
		'shop.id',
		'cloud.com',
		'cloud.dev',
		'nim.com'
	]);
	const HOSTS: HostKind[] = ['shared', 'vps', 'cloud'];
	const IPS: Record<HostKind, string> = {
		shared: '203.0.113.24',
		vps: '203.0.113.57',
		cloud: '198.51.100.8'
	};

	let act = $state(0);

	// act 1, rent a name
	let query = $state('nimbus');
	let searched = $state('nimbus');
	let domain = $state('');
	function clean(s: string) {
		return s
			.toLowerCase()
			.split('.')[0]
			.replace(/[^a-z0-9-]/g, '')
			.slice(0, 20);
	}
	const results = $derived(
		searched
			? TLDS.map((t) => ({
					tld: t,
					name: `${searched}.${t}`,
					taken: TAKEN.has(`${searched}.${t}`)
				}))
			: []
	);
	function doSearch() {
		const n = clean(query);
		if (!n) return;
		query = n;
		searched = n;
		if (TAKEN.has(`${n}.com`) || TAKEN.has(`${n}.id`)) onstate?.('taken');
	}
	function rent(name: string) {
		if (domain) return;
		domain = name;
		onstate?.('bought');
	}

	// act 2, pick a host
	let host = $state<HostKind | ''>('');
	function pickHost(h: HostKind) {
		host = h;
		onstate?.(h);
	}
	const ip = $derived(host ? IPS[host] : '');

	// act 3, connect them
	let record = $state('');
	let savedIp = $state('');
	let saveNote = $state<'' | 'ok' | 'bad'>('');
	function save() {
		const v = record.trim();
		if (!v) return;
		if (v === ip) {
			savedIp = v;
			saveNote = 'ok';
			onstate?.('connected');
		} else {
			saveNote = 'bad';
			onstate?.('wrongip');
		}
	}
	function copyIp() {
		record = ip;
		saveNote = '';
	}

	let view = $state<'idle' | 'loading' | 'fail' | 'ok'>('idle');
	let finished = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	function openSite() {
		if (view === 'loading') return;
		clearTimeout(timer);
		view = 'loading';
		const quick =
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
		timer = setTimeout(
			() => {
				if (savedIp && savedIp === ip) {
					view = 'ok';
					onstate?.('live');
					if (!finished) {
						finished = true;
						oncomplete?.();
					}
				} else {
					view = 'fail';
					onstate?.('unreachable');
				}
			},
			quick ? 150 : 1000
		);
	}

	onDestroy(() => clearTimeout(timer));
</script>

{#snippet check()}
	<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"
		><path
			d="M3.5 8.5l3 3 6-6.5"
			fill="none"
			stroke="currentColor"
			stroke-width="2.2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/></svg
	>
{/snippet}

<div class="wrap">
	<ol class="acts">
		{#each tx.acts as a, i (i)}
			<li class:on={act === i} class:done={act > i}>
				<span class="num"
					>{#if act > i}{@render check()}{:else}{i + 1}{/if}</span
				>
				{a}
			</li>
		{/each}
	</ol>

	<!-- the action for this act, kept up top -->
	<div class="btns">
		{#if act === 0 && domain}
			<button type="button" class="cta" onclick={() => (act = 1)}>{tx.toHost}</button>
		{:else if act === 1 && host}
			<button type="button" class="cta" onclick={() => (act = 2)}>{tx.toConnect}</button>
		{:else if act === 2}
			<button type="button" class="cta" onclick={openSite} disabled={view === 'loading'}>
				{tx.open.replace('{domain}', domain)}
			</button>
		{/if}
	</div>

	{#if act === 0}
		<div class="card reg">
			<div class="head">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16M4 9.5c0 1.4 1.1 2.5 2.5 2.5S9 10.9 9 9.5c0 1.4 1.1 2.5 2.5 2.5h1c1.4 0 2.5-1.1 2.5-2.5 0 1.4 1.1 2.5 2.5 2.5S20 10.9 20 9.5M5.5 12v8h13v-8"
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linejoin="round"
					/>
				</svg>
				<span><b>{tx.registrarLabel}</b><small>{tx.registrarSub}</small></span>
			</div>
			<form
				class="search"
				onsubmit={(e) => {
					e.preventDefault();
					doSearch();
				}}
			>
				<input
					type="text"
					bind:value={query}
					aria-label={tx.searchLabel}
					placeholder={tx.searchLabel}
					spellcheck="false"
					autocapitalize="off"
					autocomplete="off"
					disabled={!!domain}
				/>
				<button type="submit" class="ghost" disabled={!!domain}>{tx.search}</button>
			</form>
			<ul class="results">
				{#each results as r (r.name)}
					<li class:taken={r.taken} class:mine={domain === r.name}>
						<span class="dn">{r.name}</span>
						<span class="meta">
							<span class="pill {r.taken ? 'bad' : 'good'}"
								>{r.taken ? tx.taken : tx.available}</span
							>
							{#if !r.taken}
								<span class="price">{tx.perYear.replace('{price}', tx.prices[r.tld])}</span>
							{/if}
						</span>
						{#if domain === r.name}
							<span class="own">{@render check()} {tx.owned}</span>
						{:else}
							<button
								type="button"
								class="ghost sm"
								disabled={r.taken || !!domain}
								onclick={() => rent(r.name)}>{tx.buy}</button
							>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	{:else if act === 1}
		<div class="hosts">
			{#each HOSTS as h (h)}
				{@const hh = tx.hosts[h]}
				<div class="card host" class:sel={host === h}>
					<div class="hrow">
						<div class="mini" class:many={h === 'shared'}>
							<Server slots={h === 'cloud' ? 2 : 3} active={host === h} />
							{#if h === 'cloud'}<Server slots={2} active={host === h} />{/if}
						</div>
						<div class="hinfo">
							<b>{hh.name}</b>
							<small>{hh.sub}</small>
							<span class="hprice">{hh.price}</span>
						</div>
					</div>
					<ul class="pts">
						{#each hh.points as p (p)}<li>{p}</li>{/each}
					</ul>
					{#if host === h}
						<span class="ipchip">{tx.ipLabel} <b>{IPS[h]}</b></span>
					{:else}
						<button type="button" class="ghost sm" onclick={() => pickHost(h)}>{tx.pick}</button>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<div class="scene">
			<div class="actor">
				<div class="phone" class:good={view === 'ok'} class:bad={view === 'fail'}>
					<div class="addr">
						<span class="led {view === 'ok' ? 'good' : view === 'fail' ? 'bad' : ''}"></span>
						<span class="url">{domain}</span>
					</div>
					<div class="screen">
						{#if view === 'loading'}
							<span class="spin" aria-hidden="true"></span>
						{:else if view === 'fail'}
							<div class="shot">
								<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
									<path
										d="M9 9.5h.01M15 9.5h.01M8.5 16c1.8-1.6 5.2-1.6 7 0"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
									/>
								</svg>
								<span>{tx.unreachable}</span>
							</div>
						{:else if view === 'ok'}
							<div class="shot ok">
								<b>{tx.siteTitle}</b>
								<i class="bar"></i><i class="bar s"></i>
								<span>{tx.siteSub.replace('{ip}', ip)}</span>
							</div>
						{/if}
					</div>
				</div>
				<span class="alabel">{tx.youLabel}</span>
			</div>
			<div class="actor">
				<div class="mini big">
					<Server active={view === 'ok'} />
				</div>
				<span class="alabel">{host ? tx.hosts[host].name : ''}</span>
				<button type="button" class="ipchip tap" onclick={copyIp} title={tx.copyHint}>
					<b>{ip}</b>
				</button>
				<small class="hint">{tx.copyHint}</small>
			</div>
		</div>

		<div class="card dns">
			<p class="cap">{tx.dnsTitle.replace('{domain}', domain)}</p>
			<form
				class="rec"
				onsubmit={(e) => {
					e.preventDefault();
					save();
				}}
			>
				<div class="cell">
					<span>{tx.recordType}</span>
					<b class="fixed">A</b>
				</div>
				<div class="cell">
					<span>{tx.recordName}</span>
					<b class="fixed">@</b>
				</div>
				<label class="cell grow">
					<span>{tx.recordValue}</span>
					<input
						type="text"
						inputmode="decimal"
						bind:value={record}
						placeholder={tx.valuePlaceholder}
						spellcheck="false"
						autocomplete="off"
						oninput={() => (saveNote = '')}
					/>
				</label>
				<button type="submit" class="ghost save">{tx.save}</button>
			</form>
			{#if saveNote}
				<p class="snote {saveNote}">
					{saveNote === 'ok' ? tx.saved : tx.wrong}
				</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 620px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.acts li {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 10px 3px 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.acts li.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.num {
		display: inline-grid;
		place-items: center;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: var(--color-line);
		color: var(--color-muted);
		font-size: 9.5px;
		font-weight: 800;
	}
	.acts li.on .num {
		background: var(--color-brand);
		color: #fff;
	}
	.acts li.done .num {
		background: var(--color-grass);
		color: #fff;
	}
	.btns {
		display: flex;
		min-height: 42px;
		align-items: center;
		justify-content: center;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 20px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.14);
		transition:
			filter 0.2s ease,
			opacity 0.2s ease;
		animation: rise 0.3s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled {
		opacity: 0.55;
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 600;
		transition: border-color 0.2s ease;
	}
	.ghost:enabled:hover {
		border-color: var(--color-ink);
	}
	.ghost:disabled {
		opacity: 0.45;
	}
	.ghost.sm {
		padding: 4px 10px;
		font-size: 11.5px;
	}

	.card {
		width: 100%;
		max-width: 440px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 9px;
		margin-bottom: 10px;
		color: var(--color-brand);
	}
	.head span {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.head b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.head small {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.search {
		display: flex;
		gap: 6px;
		margin-bottom: 10px;
	}
	.search input,
	.rec input {
		flex: 1;
		min-width: 0;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 6px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
	}
	.search input:focus,
	.rec input:focus {
		border-color: var(--color-brand);
		outline: none;
		box-shadow: none;
	}
	.results {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.results li {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-template-areas:
			'dn act'
			'meta act';
		align-items: center;
		column-gap: 8px;
		row-gap: 2px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		padding: 7px 10px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.results li.mine {
		border-color: transparent;
		background: var(--color-grass-soft);
	}
	.dn {
		grid-area: dn;
		min-width: 0;
		overflow-wrap: anywhere;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.results li.taken .dn {
		color: var(--color-faint);
		text-decoration: line-through;
	}
	.meta {
		grid-area: meta;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.pill {
		border-radius: 999px;
		padding: 1px 7px;
		font-size: 10px;
		font-weight: 700;
	}
	.pill.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pill.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.price {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.results li > button,
	.own {
		grid-area: act;
	}
	.own {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-grass);
	}

	.hosts {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr;
		gap: 8px;
	}
	.host {
		display: flex;
		max-width: none;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
		transition: border-color 0.2s ease;
	}
	.host.sel {
		border-color: var(--color-brand);
	}
	.hrow {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.mini {
		display: flex;
		gap: 3px;
	}
	.mini :global(.server) {
		width: 38px;
		gap: 3px;
		padding: 4px;
		border-radius: 7px;
		box-shadow: none;
	}
	.mini :global(.server .slot) {
		height: 7px;
		padding: 0 3px;
	}
	.mini :global(.server .dot) {
		width: 4px;
		height: 4px;
	}
	.mini.big :global(.server) {
		width: 70px;
		gap: 6px;
		padding: 8px;
		border-radius: 10px;
	}
	.mini.big :global(.server .slot) {
		height: 12px;
	}
	.mini.big :global(.server .dot) {
		width: 6px;
		height: 6px;
	}
	.hinfo {
		display: flex;
		flex-direction: column;
		line-height: 1.25;
	}
	.hinfo b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.hinfo small {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.hprice {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.pts {
		margin: 0;
		padding-left: 16px;
		font-size: 11.5px;
		line-height: 1.45;
		color: var(--color-muted);
	}
	.ipchip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		background: var(--color-brand-soft);
		color: var(--color-brand);
		padding: 3px 10px;
		font-size: 11px;
		font-weight: 600;
	}
	.ipchip b {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.ipchip.tap {
		border: 1px solid transparent;
		transition: border-color 0.2s ease;
	}
	.ipchip.tap:hover {
		border-color: var(--color-brand);
	}

	.scene {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 26px;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
	}
	.actor .mini.big {
		margin-top: 18px;
	}
	.alabel {
		min-height: 1.2em;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.hint {
		max-width: 120px;
		text-align: center;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.phone {
		width: 132px;
		border-radius: 20px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.08);
		transition: border-color 0.3s ease;
	}
	.phone.good {
		border-color: var(--color-grass);
	}
	.phone.bad {
		border-color: var(--color-danger);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid var(--color-line);
		padding: 4px 6px 6px;
	}
	.led {
		flex: none;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.good {
		background: var(--color-grass);
	}
	.led.bad {
		background: var(--color-danger);
	}
	.url {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 9px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.screen {
		display: flex;
		height: 110px;
		align-items: center;
		justify-content: center;
		border-radius: 0 0 13px 13px;
		background: var(--color-paper);
		padding: 6px;
	}
	.spin {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 2.5px solid var(--color-line);
		border-top-color: var(--color-brand);
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.shot {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		text-align: center;
		font-size: 9.5px;
		line-height: 1.3;
		color: var(--color-danger);
		animation: rise 0.35s ease;
	}
	.shot.ok {
		color: var(--color-muted);
	}
	.shot b {
		font-family: var(--font-display);
		font-size: 12px;
		color: var(--color-ink);
	}
	.shot .bar {
		display: block;
		width: 80%;
		height: 6px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.shot .bar.s {
		width: 55%;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	.cap {
		margin: 0 0 8px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
		overflow-wrap: anywhere;
	}
	.rec {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 8px;
	}
	.cell {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.cell.grow {
		flex: 1;
		min-width: 130px;
	}
	.cell > span {
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.fixed {
		display: inline-grid;
		min-width: 34px;
		place-items: center;
		border-radius: 9px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 6px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		color: var(--color-ink);
	}
	.save {
		padding: 7px 14px;
	}
	.snote {
		margin: 8px 0 0;
		font-size: 12px;
		font-weight: 600;
	}
	.snote.ok {
		color: var(--color-grass);
	}
	.snote.bad {
		color: var(--color-danger);
	}

	:global(.dark) .cta {
		box-shadow: none;
		color: var(--color-ink);
	}
	:global(.dark) .phone {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.spin {
			animation: none;
		}
		.cta,
		.shot {
			animation-duration: 0.01s;
		}
		.results li,
		.host,
		.ghost,
		.ipchip.tap,
		.phone {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.hosts {
			grid-template-columns: repeat(3, 1fr);
		}
		.cta {
			font-size: 14px;
			padding: 11px 24px;
		}
		.scene {
			gap: 48px;
		}
	}
</style>
