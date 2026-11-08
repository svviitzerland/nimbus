<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Laptop from '$lib/components/Laptop.svelte';
	import Server from '$lib/components/Server.svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { DeployHost, DeploySiteText } from '$lib/chapters/web/deploy-site/types';

	type Line = { text: string; tone?: 'cmd' | 'out' | 'ok' | 'muted' };

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as DeploySiteText);

	const hostIds: DeployHost[] = ['platform', 'vps'];
	let host = $state<DeployHost>('platform');
	let phase = $state<'idle' | 'pushing' | 'building' | 'vps' | 'live'>('idle');
	let draft = $state<string | null>(null); // null means the suggested headline
	let live = $state<string | null>(null); // null means the old headline
	const headline = $derived(draft ?? tx.newHeadline);
	const shown = $derived(live ?? tx.startHeadline);
	let vpsDone = $state(0);
	let fresh = $state(false); // the phone just got the new version
	let lines = $state<Line[]>([]);
	const deployedWith = new SvelteSet<DeployHost>();
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const busy = $derived(phase === 'pushing' || phase === 'building' || phase === 'vps');

	// Real tool output stays in English, the way it looks on a real machine.
	const pushLog: Line[] = [
		{ text: 'git push', tone: 'cmd' },
		{ text: 'To github.com:you/nimbus.git' },
		{ text: '   3f2a1c0..9b7e4d1  main -> main', tone: 'muted' }
	];
	const platformLog: Line[] = [
		{ text: 'New commit on main, starting build' },
		{ text: 'npm run build', tone: 'cmd' },
		{ text: 'Build finished in 14s', tone: 'muted' },
		{ text: 'Live at https://nimbus.com', tone: 'ok' }
	];
	const vpsLog: Line[][] = [
		[
			{ text: 'ssh you@nimbus.com', tone: 'cmd' },
			{ text: 'Welcome to Ubuntu 24.04 LTS', tone: 'muted' }
		],
		[
			{ text: 'git pull', tone: 'cmd' },
			{ text: 'Updating 3f2a1c0..9b7e4d1', tone: 'muted' }
		],
		[
			{ text: 'npm run build', tone: 'cmd' },
			{ text: 'Build finished in 12s', tone: 'muted' }
		],
		[
			{ text: 'sudo systemctl reload nginx', tone: 'cmd' },
			{ text: 'Live at https://nimbus.com', tone: 'ok' }
		]
	];

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	// Print a group of lines one by one, then run `after`.
	function print(group: Line[], after?: () => void) {
		const gap = reduced() ? 60 : 450;
		group.forEach((l, i) => {
			timers.push(setTimeout(() => (lines = [...lines, l]), gap * (i + 1)));
		});
		if (after) timers.push(setTimeout(after, gap * (group.length + 1)));
	}

	function push() {
		if (busy || !headline.trim()) return;
		clearTimers();
		lines = [];
		fresh = false;
		vpsDone = 0;
		phase = 'pushing';
		print(pushLog, () => {
			if (host === 'platform') {
				phase = 'building';
				print(platformLog, goLive);
			} else {
				phase = 'vps';
				onstate?.('vpsWait');
			}
		});
	}

	let stepping = $state(false);
	function vpsStep(i: number) {
		if (phase !== 'vps' || i !== vpsDone || stepping) return;
		stepping = true;
		print(vpsLog[i], () => {
			stepping = false;
			vpsDone = i + 1;
			if (vpsDone === vpsLog.length) goLive();
		});
	}

	function goLive() {
		live = headline.trim();
		phase = 'live';
		fresh = true;
		deployedWith.add(host);
		onstate?.(deployedWith.size === 2 ? 'both' : host);
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}

	const note = $derived(
		phase === 'idle'
			? tx.idleNote
			: phase === 'pushing' || phase === 'building'
				? tx.buildingNote
				: phase === 'vps'
					? tx.vpsNote
					: tx.liveNote
	);

	onDestroy(clearTimers);
</script>

<div class="wrap">
	<!-- the controls, up top -->
	<div class="controls">
		<label class="field">
			<span class="lbl">{tx.headlineLabel}</span>
			<input
				type="text"
				maxlength="36"
				value={headline}
				disabled={busy}
				oninput={(e) => (draft = e.currentTarget.value)}
			/>
		</label>
		<div class="hostrow" role="group" aria-label={tx.hostLabel}>
			{#each hostIds as h (h)}
				<button
					type="button"
					class="host"
					class:on={host === h}
					aria-pressed={host === h}
					disabled={busy}
					onclick={() => (host = h)}
				>
					<b>{tx.hosts[h].name}</b>
					<small>{tx.hosts[h].sub}</small>
				</button>
			{/each}
		</div>
		{#if phase === 'vps'}
			<p class="hint">{tx.vpsHint}</p>
			<div class="steps">
				{#each tx.vpsSteps as step, i (i)}
					<button
						type="button"
						class="step"
						class:done={vpsDone > i}
						class:next={vpsDone === i}
						disabled={vpsDone !== i || stepping}
						onclick={() => vpsStep(i)}
					>
						<span class="n">{vpsDone > i ? '✓' : i + 1}</span>{step}
					</button>
				{/each}
			</div>
		{:else}
			<CallToActionButton onclick={push} disabled={busy || !headline.trim()}>
				{tx.pushBtn}
			</CallToActionButton>
		{/if}
	</div>

	<!-- laptop, host, and the phone that opens nimbus.com -->
	<div class="scene">
		<div class="actor">
			<div class="lap"><Laptop led={phase === 'pushing' ? 'warn' : 'ok'} /></div>
			<span class="alabel">{tx.laptopLabel}</span>
		</div>
		<span class="link" class:lit={phase === 'pushing'}></span>
		<div class="actor">
			<div class="srv" class:work={phase === 'building' || stepping}>
				<Server active={phase !== 'idle'} />
			</div>
			<span class="alabel">{tx.serverLabel}</span>
			<span class="asub">{tx.hosts[host].name}</span>
		</div>
		<span class="link" class:lit={phase === 'live'}></span>
		<div class="actor">
			<div class="phone" class:fresh>
				<div class="addr"><span class="led" class:on={live !== null}></span>nimbus.com</div>
				<div class="page">
					{#key shown}
						<p class="h pop">{shown}</p>
					{/key}
					<span class="bar"></span>
					<span class="bar short"></span>
					{#if fresh}
						<span class="upd pop">{tx.updated}</span>
					{/if}
				</div>
			</div>
			<span class="alabel">{tx.phoneLabel}</span>
		</div>
	</div>

	<p class="note" class:ok={phase === 'live'}>{note}</p>
	{#if phase === 'live'}
		<details class="certificate">
			<summary>{tx.certLabel}</summary>
			<code>https://nimbus.com</code>
			<p>{tx.certNote}</p>
		</details>
	{/if}

	<div class="term">
		<Terminal host="nimbus" prompt="$" lines={lines.slice(-6)} cursor={busy} />
	</div>
</div>

<style>
	.certificate {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		padding: 10px 12px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.certificate summary {
		cursor: pointer;
		color: var(--color-ink);
		font-weight: 650;
	}
	.certificate code {
		display: block;
		margin: 8px 0;
		color: var(--color-grass);
	}
	.wrap {
		display: flex;
		width: min(94vw, 420px);
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.controls {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 9px;
	}
	.field {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.lbl,
	.hint {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.field input {
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 11px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		outline: none;
	}
	.field input:focus {
		border-color: var(--color-brand);
	}
	.field input:disabled {
		opacity: 0.6;
	}
	.hostrow {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.host {
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 8px;
		line-height: 1.25;
		transition: border-color 0.2s;
	}
	.host.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.host b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.host small {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.host:disabled {
		opacity: 0.6;
	}
	.steps {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.step {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 10px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 7px 9px;
		text-align: left;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.step.next {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.step.done {
		color: var(--color-grass);
	}
	.n {
		display: inline-grid;
		flex: none;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-line);
		font-size: 10px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.step.next .n {
		background: var(--color-brand);
		color: #fff;
	}
	.step.done .n {
		background: var(--color-grass);
		color: #fff;
	}

	.scene {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		gap: 4px;
	}
	.actor {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		min-width: 0;
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-ink);
		text-align: center;
	}
	.asub {
		margin-top: -4px;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.lap {
		width: 92px;
		height: 74px;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}
	.lap :global(.laptop) {
		transform: scale(0.68);
		transform-origin: top center;
	}
	.srv :global(.server) {
		width: 54px;
		padding: 6px;
		border-radius: 10px;
	}
	.srv :global(.server .slot) {
		height: 8px;
	}
	.srv.work {
		animation: hum 0.6s ease-in-out infinite;
	}
	@keyframes hum {
		50% {
			transform: translateY(-2px);
		}
	}
	.link {
		position: relative;
		flex: 1;
		min-width: 14px;
		height: 3px;
		border-radius: 2px;
		background: var(--color-line);
		overflow: hidden;
	}
	.link.lit::after {
		content: '';
		position: absolute;
		inset: 0;
		width: 40%;
		border-radius: 2px;
		background: var(--color-brand);
		animation: run 0.8s linear infinite;
	}
	@keyframes run {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(250%);
		}
	}
	.phone {
		width: 96px;
		border-radius: 18px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 6px;
		box-shadow: 0 10px 22px rgba(22, 40, 60, 0.08);
		transition: border-color 0.3s;
	}
	.phone.fresh {
		border-color: var(--color-grass);
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 4px;
		border-radius: 7px;
		background: var(--color-paper);
		padding: 3px 5px;
		font-size: 8.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.led {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.led.on {
		background: var(--color-grass);
	}
	.page {
		position: relative;
		display: flex;
		min-height: 104px;
		flex-direction: column;
		gap: 5px;
		padding: 8px 3px 4px;
	}
	.h {
		font-family: 'Fraunces', serif;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.2;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.bar {
		height: 5px;
		border-radius: 3px;
		background: var(--color-line);
	}
	.bar.short {
		width: 65%;
	}
	.upd {
		position: absolute;
		bottom: 2px;
		left: 3px;
		border-radius: 999px;
		background: var(--color-grass);
		padding: 1px 6px;
		font-size: 8px;
		font-weight: 800;
		color: #fff;
	}
	.note {
		min-height: 1.4em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.note.ok {
		color: var(--color-grass);
	}
	.term {
		width: 100%;
	}
	.term :global(.body) {
		min-height: 150px;
		font-size: 12px;
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
	@media (prefers-reduced-motion: reduce) {
		.pop,
		.srv.work,
		.link.lit::after {
			animation: none;
		}
		.link.lit {
			background: var(--color-brand);
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 500px;
		}
		.lap {
			width: 132px;
			height: 104px;
		}
		.lap :global(.laptop) {
			transform: none;
		}
		.phone {
			width: 120px;
		}
		.h {
			font-size: 14px;
		}
		.alabel {
			font-size: 12px;
		}
		.term :global(.body) {
			font-size: 13px;
		}
	}
</style>
