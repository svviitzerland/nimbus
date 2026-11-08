<script lang="ts">
	import { onDestroy } from 'svelte';
	import Server from '$lib/components/Server.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { BackupPlace, BackupText } from '$lib/chapters/devops/backup/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as BackupText);

	let act = $state(0);
	let act2Open = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];
	let ticker: ReturnType<typeof setInterval> | undefined;
	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

	// ---- Act 1, one busy day at nimbus.com ----
	// orders placed in each hour from midnight, quiet at night and busy in the afternoon
	const PER_HOUR = [1, 0, 0, 0, 1, 1, 2, 3, 4, 5, 6, 6, 7, 6, 5, 5, 6];
	const CRASH = 16 * 60 + 40; // the disk dies at twenty to five
	const SPAN = 17 * 60; // the timeline shows midnight to five

	function ordersAt(t: number) {
		const h = Math.floor(t / 60);
		let n = 0;
		for (let i = 0; i < h; i++) n += PER_HOUR[i] ?? 0;
		return n + Math.floor(((PER_HOUR[h] ?? 0) * (t % 60)) / 60);
	}
	const clock = (t: number) =>
		`${String(Math.floor(t / 60)).padStart(2, '0')}.${String(t % 60).padStart(2, '0')}`;

	let schedule = $state<'daily' | 'hourly'>('daily');
	let phase = $state<'idle' | 'running' | 'live' | 'dead' | 'restored'>('idle');
	let t = $state(0);
	const lastBackup = $derived(schedule === 'daily' ? 0 : Math.floor(t / 60) * 60);
	const shown = $derived(
		phase === 'restored' ? ordersAt(lastBackup) : phase === 'dead' ? 0 : ordersAt(t)
	);
	const lost = $derived(ordersAt(CRASH) - ordersAt(lastBackup));
	const ticks = $derived.by(() => {
		if (phase === 'idle') return [];
		if (schedule === 'daily') return [0];
		const out: number[] = [];
		for (let m = 0; m <= t; m += 60) out.push(m);
		return out;
	});

	function run() {
		if (phase === 'running') return;
		t = 0;
		phase = 'running';
		clearInterval(ticker);
		ticker = setInterval(() => {
			t = Math.min(CRASH, t + 20);
			if (t >= CRASH) {
				clearInterval(ticker);
				phase = 'live';
			}
		}, 45);
	}
	function crash() {
		phase = 'dead';
	}
	function restore() {
		phase = 'restored';
		onstate?.(schedule);
		if (schedule === 'hourly') act2Open = true;
	}
	function setSchedule(s: 'daily' | 'hourly') {
		if (phase === 'running' || phase === 'live' || phase === 'dead') return;
		schedule = s;
		phase = 'idle';
		t = 0;
	}

	const note1 = $derived.by(() => {
		if (phase === 'running') return tx.noteRunning;
		if (phase === 'live') return tx.noteLive;
		if (phase === 'dead') return tx.noteDead;
		if (phase === 'restored') return schedule === 'daily' ? tx.noteDaily : tx.noteHourly;
		return tx.noteIdle;
	});

	// ---- Act 2, where the copies live ----
	const KIND: Record<BackupPlace, string> = {
		original: 'disk',
		disk2: 'disk',
		nas: 'nas',
		cloud: 'object'
	};
	const ONSITE: BackupPlace[] = ['original', 'disk2', 'nas'];
	let picks = $state<BackupPlace[]>([]);
	let burning = $state(false);
	let fireResult = $state<'' | 'lost' | 'safe'>('');
	let ruleSaid = false;
	let done = false;

	const copies = $derived(1 + picks.length);
	const kinds = $derived(new Set(['original', ...picks].map((p) => KIND[p as BackupPlace])).size);
	const offsite = $derived(picks.includes('cloud'));
	const ruleMet = $derived(copies >= 3 && kinds >= 2 && offsite);

	function toggle(p: BackupPlace) {
		if (burning || fireResult) return;
		if (picks.includes(p)) picks = picks.filter((x) => x !== p);
		else if (picks.length < 2) picks = [...picks, p];
		if (ruleMet && !ruleSaid) {
			ruleSaid = true;
			onstate?.('rule');
		}
	}
	function fire() {
		if (burning || picks.length < 2) return;
		burning = true;
		at(1100, () => {
			burning = false;
			fireResult = offsite ? 'safe' : 'lost';
			onstate?.(offsite ? 'fireSafe' : 'fireLost');
			if (offsite && !done) {
				done = true;
				oncomplete?.();
			}
		});
	}
	function reset() {
		fireResult = '';
		picks = [];
	}
	const gone = (p: BackupPlace) => fireResult !== '' && ONSITE.includes(p);

	const note2 = $derived(
		fireResult === 'safe' ? tx.noteSafe : fireResult === 'lost' ? tx.noteLost : tx.pickHint
	);

	onDestroy(() => {
		timers.forEach(clearTimeout);
		clearInterval(ticker);
	});
</script>

{#snippet place(p: BackupPlace)}
	<button
		type="button"
		class="place"
		class:on={p === 'original' || picks.includes(p)}
		class:fixed={p === 'original'}
		class:gone={gone(p) && (p === 'original' || picks.includes(p))}
		disabled={p === 'original' || burning || fireResult !== ''}
		aria-pressed={p === 'original' || picks.includes(p)}
		onclick={() => toggle(p)}
	>
		<span class="pname">{tx.places[p]}</span>
		<span class="pkind">{tx.kinds[p]}</span>
		{#if p === 'original'}<span class="ptag">{tx.originalTag}</span>{/if}
	</button>
{/snippet}

<div class="wrap">
	<div class="tabs" role="tablist">
		{#each tx.acts as a, i (i)}
			<button
				type="button"
				role="tab"
				aria-selected={act === i}
				class:on={act === i}
				disabled={i === 1 && !act2Open}
				onclick={() => (act = i)}>{a}</button
			>
		{/each}
	</div>

	{#if act === 0}
		<div class="sched">
			<span class="slabel">{tx.scheduleLabel}</span>
			<div class="chips">
				<button
					type="button"
					class="chip"
					class:on={schedule === 'daily'}
					disabled={phase === 'running' || phase === 'live' || phase === 'dead'}
					onclick={() => setSchedule('daily')}>{tx.daily}</button
				>
				<button
					type="button"
					class="chip"
					class:on={schedule === 'hourly'}
					disabled={phase === 'running' || phase === 'live' || phase === 'dead'}
					onclick={() => setSchedule('hourly')}>{tx.hourly}</button
				>
			</div>
		</div>

		<div class="acts">
			{#if phase === 'idle'}
				<button type="button" class="cta" onclick={run}>{tx.runBtn}</button>
			{:else if phase === 'running'}
				<button type="button" class="cta" disabled>{tx.runBtn}</button>
			{:else if phase === 'live'}
				<button type="button" class="danger" onclick={crash}>{tx.crashBtn}</button>
			{:else if phase === 'dead'}
				<button type="button" class="cta" onclick={restore}>{tx.restoreBtn}</button>
			{:else}
				<button type="button" class="line" onclick={run}>{tx.againBtn}</button>
				{#if act2Open}
					<button type="button" class="cta" onclick={() => (act = 1)}>{tx.nextAct}</button>
				{/if}
			{/if}
		</div>

		<div class="clock">{clock(phase === 'idle' ? 0 : t)}</div>

		<div class="duo">
			<div class="actor" class:dead={phase === 'dead'}>
				<Server active={phase !== 'dead'} />
				<span class="aname">{tx.dbLabel}</span>
				<span class="count">{phase === 'dead' ? '?' : shown}</span>
				<span class="asub">{tx.ordersLabel}</span>
			</div>
			<span class="link" class:flow={phase === 'restored'}></span>
			<div class="actor">
				<div class="drive">
					<svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<rect
							x="3"
							y="6"
							width="18"
							height="12"
							rx="2.5"
							stroke="currentColor"
							stroke-width="1.7"
						/>
						<circle cx="16.5" cy="12" r="1.4" fill="currentColor" />
						<path d="M6.5 12h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
					</svg>
				</div>
				<span class="aname">{tx.backupLabel}</span>
				<span class="asub"
					>{phase === 'idle' ? tx.noCopy : tx.lastCopy.replace('{t}', clock(lastBackup))}</span
				>
			</div>
		</div>

		<!-- the day as a bar, backups as ticks, the lost stretch in red -->
		<div class="timeline" aria-hidden="true">
			<span class="fill" style="width:{(Math.min(t, CRASH) / SPAN) * 100}%"></span>
			{#if phase === 'restored'}
				<span
					class="lostbar"
					style="left:{(lastBackup / SPAN) * 100}%;width:{((CRASH - lastBackup) / SPAN) * 100}%"
				></span>
			{/if}
			{#each ticks as m (m)}
				<span class="tick" style="left:{(m / SPAN) * 100}%"></span>
			{/each}
			{#if phase === 'dead' || phase === 'restored'}
				<span class="crash" style="left:{(CRASH / SPAN) * 100}%">×</span>
			{/if}
		</div>
		<div class="tlabels"><span>00.00</span><span>17.00</span></div>

		{#if phase === 'restored'}
			<div class="tags">
				<span class="tag ok">{tx.backTag.replace('{n}', String(ordersAt(lastBackup)))}</span>
				<span class="tag bad">{tx.lostTag.replace('{n}', String(lost))}</span>
			</div>
		{/if}

		<p class="note">{note1}</p>
	{:else}
		<div class="acts">
			{#if fireResult}
				<button type="button" class="line" onclick={reset}>{tx.resetBtn}</button>
			{:else}
				<button type="button" class="danger" disabled={burning || picks.length < 2} onclick={fire}
					>{tx.fireBtn}</button
				>
			{/if}
		</div>

		<div class="checks">
			<span class:ok={copies >= 3}>{tx.checkCopies.replace('{n}', String(copies))}</span>
			<span class:ok={kinds >= 2}>{tx.checkKinds.replace('{n}', String(kinds))}</span>
			<span class:ok={offsite}>{tx.checkOff}</span>
		</div>

		<div class="sites">
			<div class="site" class:burning class:burnt={fireResult !== ''}>
				<div class="shead">
					<b>{tx.siteLabel}</b><span>{tx.siteSub}</span>
					{#if burning || fireResult}<span class="firetag">{tx.fireTag}</span>{/if}
				</div>
				<div class="places">
					{@render place('original')}
					{@render place('disk2')}
					{@render place('nas')}
				</div>
			</div>
			<div class="site off" class:saved={fireResult === 'safe'}>
				<div class="shead"><b>{tx.offLabel}</b><span>{tx.offSub}</span></div>
				<div class="places">
					{@render place('cloud')}
				</div>
			</div>
		</div>

		<p class="note">{note2}</p>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 11px;
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
	.tabs button:disabled {
		opacity: 0.4;
	}
	.sched {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.slabel {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		gap: 5px;
	}
	.chip {
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 11px;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.chip:disabled {
		opacity: 0.55;
	}
	.acts {
		display: flex;
		min-height: 38px;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.cta,
	.danger,
	.line {
		border-radius: 11px;
		padding: 9px 18px;
		font-size: 12.5px;
		font-weight: 700;
	}
	.cta {
		background: var(--btn-primary);
		color: #fff;
	}
	.danger {
		background: var(--color-danger);
		color: #fff;
	}
	.line {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
	}
	.cta:disabled,
	.danger:disabled {
		opacity: 0.45;
	}

	.clock {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 22px;
		font-weight: 800;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.duo {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 10px;
	}
	.actor {
		display: flex;
		width: 118px;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		text-align: center;
		transition: opacity 0.3s ease;
	}
	.actor :global(.server) {
		width: 62px;
		gap: 5px;
		padding: 7px;
	}
	.actor :global(.server .slot) {
		height: 10px;
	}
	.actor.dead :global(.server) {
		border-color: var(--color-danger);
		opacity: 0.55;
	}
	.drive {
		display: flex;
		width: 62px;
		height: 62px;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-brand);
	}
	.aname {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.asub {
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.count {
		font-size: 20px;
		font-weight: 800;
		color: var(--color-ink);
		font-variant-numeric: tabular-nums;
	}
	.actor.dead .count {
		color: var(--color-danger);
	}
	.link {
		margin-top: 30px;
		width: 36px;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.link.flow {
		background: var(--color-grass);
	}

	.timeline {
		position: relative;
		width: 100%;
		height: 12px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.fill {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-grass) 35%, transparent);
	}
	.lostbar {
		position: absolute;
		top: 0;
		bottom: 0;
		border-radius: 999px;
		background: var(--color-danger);
		opacity: 0.75;
	}
	.tick {
		position: absolute;
		top: -4px;
		width: 3px;
		height: 18px;
		border-radius: 2px;
		background: var(--color-brand);
		transform: translateX(-50%);
	}
	.crash {
		position: absolute;
		top: -18px;
		transform: translateX(-50%);
		font-size: 13px;
		font-weight: 800;
		color: var(--color-danger);
	}
	.tlabels {
		display: flex;
		width: 100%;
		justify-content: space-between;
		margin-top: -7px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.tag {
		border-radius: 999px;
		padding: 2px 10px;
		font-size: 11px;
		font-weight: 800;
		animation: pop 0.3s ease both;
	}
	.tag.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.tag.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}

	.checks {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.checks span {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 10px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-faint);
		transition: all 0.2s ease;
	}
	.checks span.ok {
		border-color: color-mix(in srgb, var(--color-grass) 50%, var(--color-line));
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.checks span.ok::before {
		content: '✓ ';
	}
	.sites {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 10px;
	}
	.site {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 7px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 10px 10px;
		transition:
			background 0.3s ease,
			border-color 0.3s ease;
	}
	.site.burning {
		border-color: var(--color-danger);
		animation: flicker 0.35s ease-in-out infinite;
	}
	.site.burnt {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.site.saved {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	@keyframes flicker {
		50% {
			background: var(--color-danger-soft);
		}
	}
	.shead {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 6px;
	}
	.shead b {
		font-size: 12px;
		color: var(--color-ink);
	}
	.shead span {
		font-size: 10px;
		color: var(--color-faint);
	}
	.shead .firetag {
		margin-left: auto;
		border-radius: 999px;
		background: var(--color-danger);
		padding: 1px 8px;
		font-size: 9.5px;
		font-weight: 800;
		color: #fff;
	}
	.places {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.place {
		position: relative;
		display: flex;
		min-width: 102px;
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		gap: 1px;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		padding: 7px 9px;
		text-align: left;
		transition:
			border-color 0.2s ease,
			opacity 0.3s ease;
	}
	.place.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.place.fixed {
		opacity: 1;
	}
	.place.gone {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		opacity: 0.6;
	}
	.place.gone .pname {
		text-decoration: line-through;
	}
	.pname {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.pkind {
		font-size: 9.5px;
		color: var(--color-muted);
	}
	.ptag {
		position: absolute;
		top: 6px;
		right: 7px;
		font-size: 8.5px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-brand);
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
		.site.burning,
		.tag {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		.note {
			font-size: 13.5px;
			max-width: 440px;
		}
		.clock {
			font-size: 26px;
		}
	}
</style>
