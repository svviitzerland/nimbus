<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Terminal from '$lib/components/Terminal.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { LogsText } from '$lib/chapters/devops/logs/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as LogsText);

	// ---- twenty web servers, four recent log lines each ----
	type Level = 'INFO' | 'WARN' | 'ERROR';
	type Log = { at: number; host: string; level: Level; msg: string };
	const SERVERS = Array.from({ length: 20 }, (_, i) => `web-${String(i + 1).padStart(2, '0')}`);
	const BAD = 'web-14';
	const POOL = [
		'GET / 200 8ms',
		'GET /products 200 14ms',
		'POST /cart 200 21ms',
		'GET /img/logo.png 304 3ms',
		'GET /products/42 200 11ms',
		'POST /checkout 200 142ms',
		'GET /search?q=shoes 200 37ms',
		'POST /login 200 64ms'
	];
	const LOGS: Log[] = (() => {
		const out: Log[] = [];
		SERVERS.forEach((host, s) => {
			for (let k = 0; k < 4; k++) {
				// spread the lines over two minutes, starting at 14.01.00
				const at = 60 + ((s * 7 + k * 31) % 120);
				let level: Level = 'INFO';
				let msg = POOL[(s * 3 + k) % POOL.length];
				if (host === BAD && k === 2) {
					level = 'ERROR';
					msg = 'POST /checkout 500 payment API timeout after 30s';
				} else if (host === 'web-05' && k === 1) {
					level = 'WARN';
					msg = 'slow query on orders table 820ms';
				} else if (host === 'web-17' && k === 3) {
					level = 'WARN';
					msg = 'disk 81% full';
				}
				out.push({ at, host, level, msg });
			}
		});
		return out.sort((a, b) => a.at - b.at);
	})();
	const stamp = (sec: number) =>
		`14:${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
	const lineOf = (l: Log) => `${stamp(l.at)} ${l.host} ${l.level} ${l.msg}`;

	let mode = $state(0);

	// ---- by hand, one login per server ----
	const opened = new SvelteSet<string>();
	let current = $state<string | null>(null);
	let handFound = $state(false);
	const MIN_PER_LOGIN = 2;

	function login(host: string) {
		current = host;
		const first = !opened.has(host);
		opened.add(host);
		if (host === BAD && !handFound) {
			handFound = true;
			onstate?.('handFound');
		} else if (first && opened.size === 3 && !handFound) onstate?.('peek');
	}
	const termLines = $derived(
		current
			? [
					{ text: `ssh ${current}`, tone: 'cmd' as const },
					{ text: 'tail /var/log/nimbus/app.log', tone: 'cmd' as const },
					...LOGS.filter((l) => l.host === current).map((l) => ({
						text: lineOf(l),
						tone: 'out' as const
					}))
				]
			: []
	);

	// ---- one central log for everyone ----
	let query = $state('');
	let searched = false;
	let found = $state(false);
	let done = false;
	const results = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return LOGS;
		return LOGS.filter((l) => lineOf(l).toLowerCase().includes(q));
	});
	const shownResults = $derived(results.slice(-8));

	function typed() {
		if (!searched && query.trim() && results.length < LOGS.length) {
			searched = true;
			onstate?.('search');
		}
	}
	function quick(q: string) {
		query = q;
		typed();
	}
	function inspect(l: Log) {
		if (l.level !== 'ERROR' || found) return;
		found = true;
		onstate?.('found');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}

	const note = $derived.by(() => {
		if (found) return tx.noteFound;
		if (mode === 0) return handFound ? tx.noteHandFound : tx.noteHand;
		return tx.noteCentral;
	});
</script>

<div class="wrap">
	<div class="ticket">
		<span class="tlabel">{tx.ticketLabel}</span>
		<span class="ttext">{tx.ticket}</span>
	</div>

	<div class="tabs" role="tablist">
		{#each tx.modes as m, i (i)}
			<button
				type="button"
				role="tab"
				aria-selected={mode === i}
				class:on={mode === i}
				onclick={() => (mode = i)}>{m}</button
			>
		{/each}
	</div>

	{#if mode === 0}
		<div class="fleet">
			<div class="fhead">
				<b>{tx.fleetLabel}</b>
				<span class="cost"
					>{tx.loginsTag
						.replace('{n}', String(opened.size))
						.replace('{m}', String(opened.size * MIN_PER_LOGIN))}</span
				>
			</div>
			<div class="grid">
				{#each SERVERS as host (host)}
					<button
						type="button"
						class="srv"
						class:seen={opened.has(host)}
						class:cur={current === host}
						class:bad={(handFound || found) && host === BAD}
						onclick={() => login(host)}
					>
						<span class="leds"><i></i><i></i></span>
						<span class="sname">{host}</span>
					</button>
				{/each}
			</div>
		</div>
		{#if current}
			<div class="term"><Terminal host={current} prompt="$" lines={termLines} /></div>
		{:else}
			<p class="hint">{tx.pickServer}</p>
		{/if}
	{:else}
		<div class="search">
			<label class="slabel" for="logq">{tx.searchLabel}</label>
			<input
				id="logq"
				type="text"
				autocomplete="off"
				spellcheck="false"
				placeholder={tx.searchPlaceholder}
				bind:value={query}
				oninput={typed}
			/>
			<div class="quick">
				<span>{tx.quickLabel}</span>
				{#each ['ERROR', 'checkout', '500'] as q (q)}
					<button type="button" class="qchip" onclick={() => quick(q)}>{q}</button>
				{/each}
			</div>
		</div>

		<div class="results">
			<div class="rhead">
				<span
					>{tx.resultsTag
						.replace('{n}', String(results.length))
						.replace('{t}', String(LOGS.length))}</span
				>
				{#if results.length > 0 && results.length < LOGS.length}<span class="tap">{tx.tapHint}</span
					>{/if}
			</div>
			{#if shownResults.length === 0}
				<p class="empty">{tx.noResults}</p>
			{:else}
				{#each shownResults as l (l.host + l.at + l.msg)}
					<button
						type="button"
						class="row {l.level.toLowerCase()}"
						class:hit={found && l.level === 'ERROR'}
						onclick={() => inspect(l)}
					>
						<span class="ts">{stamp(l.at)}</span>
						<span class="host">{l.host}</span>
						<span class="lvl">{l.level}</span>
						<span class="msg">{l.msg}</span>
					</button>
				{/each}
			{/if}
		</div>
		{#if found}
			<span class="foundtag">{tx.foundTag}</span>
		{/if}
	{/if}

	<p class="note">{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 410px);
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.ticket {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 2px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
	}
	.tlabel {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-amber);
	}
	.ttext {
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.tabs {
		display: flex;
		gap: 4px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px;
	}
	.tabs button {
		border-radius: 9px;
		padding: 6px 14px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.tabs button.on {
		background: var(--color-ink);
		color: var(--color-paper);
	}

	.fleet {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 7px;
	}
	.fhead {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.fhead b {
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.cost {
		border-radius: 999px;
		background: var(--color-amber-soft);
		padding: 2px 9px;
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-amber);
		font-variant-numeric: tabular-nums;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 5px;
	}
	.srv {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 2px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.leds {
		display: flex;
		gap: 3px;
	}
	.leds i {
		width: 14px;
		height: 4px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.srv.seen .leds i {
		background: var(--color-grass);
	}
	.srv.cur {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.srv.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.srv.bad .leds i {
		background: var(--color-danger);
	}
	.sname {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.term {
		width: 100%;
		font-size: 10.5px;
	}
	.hint {
		font-size: 11.5px;
		color: var(--color-faint);
	}

	.search {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 5px;
	}
	.slabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.search input {
		width: 100%;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 11px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		color: var(--color-ink);
	}
	.search input:focus {
		border-color: var(--color-brand);
		outline: none;
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-brand) 15%, transparent);
	}
	.quick {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 5px;
	}
	.quick span {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.qchip {
		border-radius: 7px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 2px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.results {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 2px;
		overflow: hidden;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px;
	}
	.rhead {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 4px;
		padding: 0 4px 4px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.rhead .tap {
		color: var(--color-brand);
	}
	.row {
		display: grid;
		grid-template-columns: auto auto auto 1fr;
		gap: 6px;
		align-items: baseline;
		border-radius: 6px;
		padding: 3px 5px;
		text-align: left;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		color: var(--color-muted);
		transition: background 0.15s ease;
	}
	.row:hover {
		background: var(--color-paper);
	}
	.ts {
		color: var(--color-faint);
	}
	.host {
		font-weight: 700;
		color: var(--color-ink);
	}
	.lvl {
		font-weight: 800;
		color: var(--color-grass);
	}
	.row.warn .lvl {
		color: var(--color-amber);
	}
	.row.error .lvl,
	.row.error .msg {
		color: var(--color-danger);
	}
	.row.hit {
		background: var(--color-danger-soft);
	}
	.msg {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.empty {
		padding: 8px;
		text-align: center;
		font-size: 11px;
		color: var(--color-faint);
	}
	.foundtag {
		border-radius: 999px;
		background: var(--color-danger);
		padding: 2px 11px;
		font-size: 11px;
		font-weight: 800;
		color: #fff;
		animation: pop 0.3s ease both;
	}
	.note {
		min-height: 1.4em;
		max-width: 360px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	@keyframes pop {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.foundtag {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
		}
		.row {
			font-size: 11px;
		}
		.sname {
			font-size: 10.5px;
		}
		.note {
			font-size: 13.5px;
			max-width: 440px;
		}
	}
</style>
