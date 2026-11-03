<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Server from '$lib/components/Server.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { HardenDoor, HardeningText } from '$lib/chapters/security/hardening/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as HardeningText);

	const doors: HardenDoor[] = ['update', 'telnet', 'db', 'sshkey', 'root', 'default'];

	let scanned = $state(false);
	let scanning = $state(false);
	const fixed = new SvelteSet<HardenDoor>();
	let webOpen = $state(true);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// Ten points for a server that boots at all, fifteen for every door that is shut.
	const score = $derived(scanned ? 10 + fixed.size * 15 : 0);
	const allFixed = $derived(fixed.size === doors.length);
	const tone = $derived(score >= 85 ? 'good' : score >= 50 ? 'mid' : 'bad');

	function scan() {
		if (scanned || scanning) return;
		scanning = true;
		timers.push(
			setTimeout(() => {
				scanning = false;
				scanned = true;
				onstate?.('scan');
			}, 1200)
		);
	}

	function fix(d: HardenDoor) {
		if (!scanned || fixed.has(d)) return;
		fixed.add(d);
		onstate?.(d);
		checkDone();
	}

	function toggleWeb() {
		if (!scanned) return;
		webOpen = !webOpen;
		if (!webOpen) onstate?.('web');
		else checkDone();
	}

	function checkDone() {
		if (completed || fixed.size !== doors.length || !webOpen) return;
		completed = true;
		// Let the last fix speak first, then Nim sums it up.
		timers.push(
			setTimeout(() => {
				onstate?.('done');
				oncomplete?.();
			}, 2600)
		);
	}

	const hint = $derived(!scanned ? tx.hintIdle : allFixed && webOpen ? tx.hintDone : tx.hintScan);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<div class="top">
		{#if !scanned}
			<CallToActionButton onclick={scan} disabled={scanning}>
				{#snippet children()}{tx.scanBtn}{/snippet}
			</CallToActionButton>
		{:else}
			<div class="meter {tone}">
				<div class="mhead">
					<span>{tx.scoreLabel}</span>
					<b>{score}</b>
				</div>
				<div class="track"><span class="fill" style="width:{score}%"></span></div>
			</div>
		{/if}
	</div>
	<p class="hint">{hint}</p>

	<div class="box" class:scanning>
		<div class="head">
			<div class="srv"><Server slots={2} active={webOpen} /></div>
			<div class="htxt">
				<b>{tx.serverLabel}</b>
				<span class="site" class:down={!webOpen}>{webOpen ? tx.siteUp : tx.siteDown}</span>
			</div>
			{#if scanning}<span class="beam" aria-hidden="true"></span>{/if}
		</div>

		<ul class="rows">
			{#each doors as d, i (d)}
				{@const shut = fixed.has(d)}
				<li
					class="row"
					class:open={scanned && !shut}
					class:shut
					style="--d:{i * 90}ms"
					class:reveal={scanned}
				>
					<span class="lock" aria-hidden="true">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<rect
								x="5"
								y="10.5"
								width="14"
								height="10"
								rx="2.2"
								stroke="currentColor"
								stroke-width="1.9"
							/>
							<path
								d={shut ? 'M8 10.5V8a4 4 0 0 1 8 0v2.5' : 'M8 10.5V8a4 4 0 0 1 7.6-1.7'}
								stroke="currentColor"
								stroke-width="1.9"
								stroke-linecap="round"
							/>
						</svg>
					</span>
					<span class="rtxt">
						<b>{tx.doors[d].name}</b>
						<span>{!scanned ? '?' : shut ? tx.doors[d].done : tx.doors[d].risk}</span>
					</span>
					{#if scanned && !shut}
						<button type="button" class="fix" onclick={() => fix(d)}>{tx.doors[d].fix}</button>
					{:else if shut}
						<span class="tag ok">{tx.closedTag}</span>
					{/if}
				</li>
			{/each}
			<li class="row web" class:off={!webOpen}>
				<span class="lock" aria-hidden="true">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
						<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.9" />
						<path
							d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5s-1.2 6.1-3.6 8.5c-2.4-2.4-3.6-5.2-3.6-8.5s1.2-6.1 3.6-8.5Z"
							stroke="currentColor"
							stroke-width="1.6"
						/>
					</svg>
				</span>
				<span class="rtxt">
					<b>{tx.web.name} <span class="tag need">{tx.neededTag}</span></b>
					<span>{webOpen ? tx.web.note : tx.web.closedNote}</span>
				</span>
				<button type="button" class="ghost" onclick={toggleWeb} disabled={!scanned}
					>{webOpen ? tx.web.close : tx.web.reopen}</button
				>
			</li>
		</ul>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 380px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		overflow-y: auto;
	}
	.top {
		display: flex;
		width: 100%;
		min-height: 48px;
		align-items: center;
		justify-content: center;
	}
	.top :global(.cta) {
		padding: 10px 20px;
		font-size: 13px;
	}
	.meter {
		width: 100%;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 12px;
		--tone: var(--color-danger);
	}
	.meter.mid {
		--tone: var(--color-amber);
	}
	.meter.good {
		--tone: var(--color-grass);
	}
	.mhead {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.mhead b {
		font-size: 20px;
		font-weight: 800;
		color: var(--tone);
		font-variant-numeric: tabular-nums;
	}
	.track {
		margin-top: 4px;
		height: 8px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--tone);
		transition:
			width 0.5s ease,
			background 0.3s ease;
	}
	.hint {
		min-height: 1.4em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	.box {
		width: 100%;
		border-radius: 16px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 10px;
	}
	.head {
		position: relative;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 2px 8px;
		overflow: hidden;
	}
	.srv :global(.server) {
		width: 46px;
		padding: 6px;
		gap: 5px;
		border-radius: 9px;
	}
	.srv :global(.server .slot) {
		height: 9px;
	}
	.htxt {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.htxt b {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.site {
		align-self: flex-start;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 10px;
		font-weight: 800;
		padding: 1px 8px;
	}
	.site.down {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.beam {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--color-brand) 22%, transparent),
			transparent
		);
		animation: sweep 0.6s linear infinite;
	}
	@keyframes sweep {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}

	.rows {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 9px;
		border-radius: 11px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 9px;
		color: var(--color-faint);
		transition:
			border-color 0.25s,
			background 0.25s,
			color 0.25s;
	}
	.row.reveal {
		animation: flip 0.35s ease both;
		animation-delay: var(--d);
	}
	@keyframes flip {
		from {
			opacity: 0.3;
			transform: translateX(-6px);
		}
	}
	.row.open {
		border-color: color-mix(in srgb, var(--color-danger) 45%, var(--color-line));
		color: var(--color-danger);
	}
	.row.shut {
		color: var(--color-grass);
	}
	.row.web {
		color: var(--color-brand);
	}
	.row.web.off {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.lock {
		display: grid;
		flex: none;
		place-items: center;
	}
	.rtxt {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 1px;
	}
	.rtxt b {
		font-size: 12px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.rtxt > span {
		font-size: 10.5px;
		line-height: 1.3;
		color: var(--color-muted);
	}
	.tag {
		flex: none;
		border-radius: 999px;
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 8px;
	}
	.tag.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.tag.need {
		background: var(--color-brand-soft);
		color: var(--color-brand);
		vertical-align: 1px;
	}
	.fix,
	.ghost {
		flex: none;
		border-radius: 9px;
		font-size: 11px;
		font-weight: 800;
		padding: 6px 11px;
		transition:
			filter 0.2s,
			border-color 0.2s;
	}
	.fix {
		background: var(--color-danger);
		color: #fff;
	}
	.fix:hover {
		filter: brightness(1.08);
	}
	.ghost {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
	}
	.ghost:enabled:hover {
		border-color: var(--color-ink);
		color: var(--color-ink);
	}
	.ghost:disabled {
		opacity: 0.45;
	}

	@media (prefers-reduced-motion: reduce) {
		.row.reveal,
		.beam {
			animation: none;
		}
		.fill {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
		}
		.rtxt b {
			font-size: 13px;
		}
		.rtxt > span {
			font-size: 11.5px;
		}
		.hint {
			font-size: 13px;
		}
	}
</style>
