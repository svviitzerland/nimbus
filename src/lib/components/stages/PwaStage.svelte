<script lang="ts">
	import { onDestroy } from 'svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import ActSteps from './shipit/ActSteps.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { PwaText } from '$lib/chapters/web/pwa/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as PwaText);

	// step 0 plain site, 1 add the PWA pieces, 2 install, 3 offline test, 4 done
	let step = $state(0);
	let online = $state(true);
	let manifest = $state(false);
	let worker = $state(false);
	let view = $state<'browser' | 'home' | 'app'>('browser');
	let cached = $state(0); // how many files the service worker has saved so far
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const files = ['index.html', 'style.css', 'app.js', 'logo.svg'];
	const doneSteps = $derived([step > 0, step > 1, step > 2, step > 3]);

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function plainOff() {
		online = false;
		onstate?.('plainOffline');
	}
	function plainOn() {
		online = true;
		step = 1;
	}
	function addManifest() {
		manifest = true;
		onstate?.('manifest');
		if (worker) step = 2;
	}
	function addWorker() {
		worker = true;
		onstate?.('worker');
		const gap = reduced() ? 60 : 380;
		files.forEach((_, i) => timers.push(setTimeout(() => (cached = i + 1), gap * (i + 1))));
		if (manifest) step = 2;
	}
	function install() {
		view = 'home';
		step = 3;
		onstate?.('installed');
	}
	function cutAgain() {
		online = false;
	}
	function openApp() {
		view = 'app';
		step = 4;
		onstate?.('offlineApp');
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}

	const note = $derived.by(() => {
		if (step === 0) return online ? tx.notes.plain : tx.notes.plainOffline;
		if (step === 1) return tx.notes.addPieces;
		if (step === 2) return tx.notes.install;
		if (step === 3) return online ? tx.notes.goOffline : tx.notes.openApp;
		return tx.notes.done;
	});
	const plainBroken = $derived(step === 0 && !online);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet cloud(w: number)}
	<svg width={w} height={(w * 2) / 3} viewBox="0 0 120 80" aria-hidden="true">
		<path
			d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z"
			fill="var(--color-brand)"
		/>
		<circle cx="50" cy="44" r="5" fill="#fff" />
		<circle cx="72" cy="44" r="5" fill="#fff" />
		<path d="M53 56q8 6 16 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet site()}
	<div class="site">
		{@render cloud(44)}
		<b>nimbus.com</b>
		<span>{tx.pageTagline}</span>
		<i class="ln"></i>
		<i class="ln short"></i>
	</div>
{/snippet}

<div class="wrap">
	<ActSteps names={tx.steps} current={Math.min(step, 3)} done={doneSteps} />

	<!-- the one or two actions for this step -->
	<div class="btns">
		{#if step === 0}
			{#if online}
				<CallToActionButton onclick={plainOff}>
					{tx.offBtn}
				</CallToActionButton>
			{:else}
				<CallToActionButton onclick={plainOn}>
					{tx.onBtn}
				</CallToActionButton>
			{/if}
		{:else if step === 1}
			<button type="button" class="piece" disabled={manifest} onclick={addManifest}>
				{manifest ? '✓ ' : ''}{tx.manifestBtn}
			</button>
			<button type="button" class="piece" disabled={worker} onclick={addWorker}>
				{worker ? '✓ ' : ''}{tx.workerBtn}
			</button>
		{:else if step === 2}
			<CallToActionButton onclick={install}>
				{tx.installBtn}
			</CallToActionButton>
		{:else if step === 3}
			{#if online}
				<CallToActionButton onclick={cutAgain}>
					{tx.offAgainBtn}
				</CallToActionButton>
			{:else}
				<CallToActionButton onclick={openApp}>
					{tx.openAppBtn}
				</CallToActionButton>
			{/if}
		{/if}
	</div>

	<div class="scene">
		<!-- the phone -->
		<div class="phone">
			<div class="status">
				<span class="time">9:41</span>
				<span class="net" class:off={!online}>
					<svg width="12" height="10" viewBox="0 0 24 20" fill="none" aria-hidden="true">
						<path
							d="M2 7a15 15 0 0 1 20 0M5.5 10.5a10 10 0 0 1 13 0M9 14a5 5 0 0 1 6 0"
							stroke="currentColor"
							stroke-width="2.4"
							stroke-linecap="round"
						/>
						<circle cx="12" cy="17.5" r="1.6" fill="currentColor" />
						{#if !online}
							<path
								d="M3 1 21 19"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
							/>
						{/if}
					</svg>
					{online ? tx.internetOn : tx.internetOff}
				</span>
			</div>

			<div class="screen">
				{#if view === 'browser'}
					<div class="addr"><span class="lock"></span>nimbus.com</div>
					<div class="body">
						{#if plainBroken}
							<div class="broken pop">
								<svg width="40" height="30" viewBox="0 0 120 80" aria-hidden="true">
									<path
										d="M30 70a22 22 0 0 1-3-43.8A28 28 0 0 1 81 20a20 20 0 0 1 11 50z"
										fill="var(--color-line)"
									/>
									<path
										d="M40 20 85 72"
										stroke="var(--color-danger)"
										stroke-width="6"
										stroke-linecap="round"
									/>
								</svg>
								<b>{tx.noInternet}</b>
							</div>
						{:else}
							{@render site()}
						{/if}
						{#if manifest && step === 2}
							<div class="banner pop">
								{@render cloud(18)}
								<span>{tx.installBanner}</span>
							</div>
						{/if}
					</div>
				{:else if view === 'home'}
					<div class="home pop">
						{#each [0, 1, 2, 3, 4, 5, 6] as i (i)}
							<span class="icon"><i></i></span>
						{/each}
						<span class="icon nim pop">
							<i>{@render cloud(26)}</i>
							<small>{tx.appName}</small>
						</span>
					</div>
				{:else}
					<div class="body full pop">
						{@render site()}
						<span class="cachetag">{tx.fromCache}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- the cache the service worker fills -->
		<div class="cache" class:on={worker}>
			<p class="clabel">{tx.cacheLabel}</p>
			{#if cached === 0}
				<p class="empty">{tx.cacheEmpty}</p>
			{:else}
				<ul>
					{#each files.slice(0, cached) as f (f)}
						<li class="pop" class:served={view === 'app'}>{f}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	<p class="note" class:ok={step === 4} class:bad={plainBroken}>{note}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 400px);
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.btns {
		display: flex;
		min-height: 46px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.piece {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 14px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
		transition: border-color 0.2s;
	}
	.piece:enabled:hover {
		border-color: var(--color-brand);
	}
	.piece:disabled {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}

	.scene {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 14px;
	}
	.phone {
		flex: none;
		width: 150px;
		border-radius: 26px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.status {
		display: flex;
		justify-content: space-between;
		padding: 0 6px 5px;
		font-size: 9px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.net {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		color: var(--color-grass);
	}
	.net.off {
		color: var(--color-danger);
	}
	.screen {
		position: relative;
		display: flex;
		height: 220px;
		flex-direction: column;
		overflow: hidden;
		border-radius: 18px;
		background: var(--color-paper);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 10px;
		font-size: 9.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.lock {
		width: 6px;
		height: 6px;
		border-radius: 2px;
		background: var(--color-faint);
	}
	.body {
		position: relative;
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.site {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		text-align: center;
	}
	.site b {
		font-family: 'Fraunces', serif;
		font-size: 14px;
		color: var(--color-ink);
	}
	.site span {
		font-size: 9.5px;
		color: var(--color-muted);
	}
	.ln {
		width: 80px;
		height: 5px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.ln.short {
		width: 54px;
	}
	.broken {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.broken b {
		font-size: 11px;
		color: var(--color-muted);
	}
	.banner {
		position: absolute;
		right: 8px;
		bottom: 8px;
		left: 8px;
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 8px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 6px 14px rgba(22, 40, 60, 0.12);
	}
	.home {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		align-content: start;
		gap: 12px 8px;
		padding: 18px 12px;
	}
	.icon {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.icon i {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 9px;
		background: var(--color-line);
	}
	.icon.nim i {
		background: var(--color-card);
		border: 1.5px solid var(--color-brand);
		box-shadow: 0 0 0 4px var(--color-brand-soft);
	}
	.icon small {
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.body.full {
		padding-top: 10px;
	}
	.cachetag {
		position: absolute;
		top: 8px;
		right: 8px;
		border-radius: 999px;
		background: var(--color-grass);
		padding: 1px 7px;
		font-size: 8.5px;
		font-weight: 800;
		color: #fff;
	}

	.cache {
		width: 140px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 10px;
		opacity: 0.55;
		transition:
			opacity 0.3s,
			border-color 0.3s;
	}
	.cache.on {
		opacity: 1;
		border-color: var(--color-brand);
	}
	.clabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.empty {
		margin-top: 5px;
		font-size: 11px;
		color: var(--color-faint);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-top: 6px;
	}
	li {
		border-radius: 7px;
		background: var(--color-brand-soft);
		padding: 3px 7px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		color: var(--color-ink);
		transition: background 0.3s;
	}
	li.served {
		background: var(--color-grass-soft);
	}
	.note {
		min-height: 1.4em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.note.ok {
		color: var(--color-grass);
	}
	.note.bad {
		color: var(--color-danger);
	}
	.pop {
		animation: pop 0.35s ease;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (max-width: 360px) {
		.scene {
			flex-direction: column;
		}
		.cache {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		.phone {
			width: 176px;
		}
		.screen {
			height: 260px;
		}
		.cache {
			width: 170px;
		}
		.note {
			font-size: 13.5px;
		}
	}
</style>
