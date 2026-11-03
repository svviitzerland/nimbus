<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Terminal from '$lib/components/Terminal.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { RuntimeText, FeatureId } from '$lib/chapters/basics/runtime/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as RuntimeText);

	type Line = { text: string; tone?: 'cmd' | 'out' | 'ok' | 'muted' };
	const FEATURES: FeatureId[] = ['login', 'payments', 'charts'];
	// Real packages, with a newer major version that (in this story) changes how they are called.
	const LIBS: Record<FeatureId, { lib: string; old: string; next: string; err: string }> = {
		login: {
			lib: 'passport',
			old: '0.6.0',
			next: '0.7.0',
			err: 'TypeError: passport.authenticate is not a function'
		},
		payments: {
			lib: 'stripe',
			old: '14.25.0',
			next: '16.0.0',
			err: 'TypeError: stripe.charges.create is not a function'
		},
		charts: {
			lib: 'chart.js',
			old: '3.9.1',
			next: '4.4.0',
			err: 'TypeError: chart.render is not a function'
		}
	};
	const BASE_LINES = 40; // the shop's own glue code

	let step = $state(0);
	let hasRuntime = $state(false);
	let busy = $state(false);
	let app = $state<'off' | 'up' | 'down'>('off');
	const choice = $state<Record<FeatureId, 'scratch' | 'lib' | null>>({
		login: null,
		payments: null,
		charts: null
	});
	let updated = $state(false);
	let broken = $state<FeatureId | null>(null);
	let pinned = $state(false);
	let term = $state<Line[]>([]);
	let timers: ReturnType<typeof setTimeout>[] = [];
	const said = new SvelteSet<string>();
	let completed = false;

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function later(fn: () => void, ms: number) {
		timers.push(setTimeout(fn, reduced() ? Math.min(ms, 200) : ms));
	}
	function log(...lines: Line[]) {
		term = [...term, ...lines].slice(-5);
	}

	// ---- Step 1, the runtime ----
	function runApp() {
		if (busy) return;
		log({ text: 'node app.js', tone: 'cmd' });
		if (!hasRuntime) {
			log({ text: 'zsh: command not found: node' });
			onstate?.('noRuntime');
			return;
		}
		log({ text: 'Shop running at http://localhost:3000', tone: 'ok' });
		app = 'up';
		onstate?.('runtime');
		step = 1;
	}
	function installRuntime() {
		if (busy || hasRuntime) return;
		busy = true;
		log({ text: tx.installing, tone: 'muted' });
		later(() => {
			busy = false;
			hasRuntime = true;
			log({ text: tx.installed, tone: 'ok' });
		}, 900);
	}

	// ---- Step 2, libraries or writing it yourself ----
	const allChosen = $derived(FEATURES.every((f) => choice[f] !== null));
	const libCount = $derived(FEATURES.filter((f) => choice[f] === 'lib').length);
	const days = $derived(
		FEATURES.reduce((s, f) => s + (choice[f] === 'scratch' ? tx.features[f].days : 0), 0)
	);
	const ownLines = $derived(
		FEATURES.reduce((s, f) => s + (choice[f] === 'scratch' ? tx.features[f].lines : 0), BASE_LINES)
	);

	function choose(f: FeatureId, kind: 'scratch' | 'lib') {
		if (step !== 1 || choice[f] === kind) return;
		const firstTime = !allChosen;
		choice[f] = kind;
		if (kind === 'lib') {
			log(
				{ text: `npm install ${LIBS[f].lib}`, tone: 'cmd' },
				{ text: 'added 1 package in 2s', tone: 'ok' }
			);
		}
		if (firstTime && allChosen && !said.has('built')) {
			said.add('built');
			onstate?.('built');
		} else if (!said.has(kind === 'lib' ? 'library' : 'scratch')) {
			said.add(kind === 'lib' ? 'library' : 'scratch');
			onstate?.(kind === 'lib' ? 'library' : 'scratch');
		}
	}

	// ---- Step 3, everything updates at once ----
	function updateAll() {
		if (busy || updated) return;
		const libs = FEATURES.filter((f) => choice[f] === 'lib');
		const victim = (['charts', 'payments', 'login'] as FeatureId[]).find(
			(f) => choice[f] === 'lib'
		);
		if (!victim) return;
		busy = true;
		updated = true;
		log(
			{ text: `npm install ${libs.map((f) => LIBS[f].lib + '@latest').join(' ')}`, tone: 'cmd' },
			{ text: `changed ${libs.length} package${libs.length > 1 ? 's' : ''} in 3s`, tone: 'ok' }
		);
		later(() => {
			log({ text: 'node app.js', tone: 'cmd' }, { text: LIBS[victim].err });
			broken = victim;
			app = 'down';
			busy = false;
			onstate?.('broke');
		}, 900);
	}
	function pin() {
		if (busy || !broken || pinned) return;
		const b = LIBS[broken];
		log(
			{ text: `npm install ${b.lib}@${b.old}`, tone: 'cmd' },
			{ text: 'node app.js', tone: 'cmd' },
			{ text: tx.runningAgain, tone: 'ok' }
		);
		pinned = true;
		app = 'up';
		onstate?.('pinned');
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}

	function versionOf(f: FeatureId) {
		const l = LIBS[f];
		if (!updated) return l.old;
		if (pinned && broken === f) return l.old;
		return l.next;
	}

	const appText = $derived(app === 'up' ? tx.appUp : app === 'down' ? tx.appDown : tx.appOff);

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<ol class="steps">
		{#each tx.steps as s, i (i)}
			<li class:cur={step === i} class:done={step > i || (i === 2 && pinned)}>
				<span>{i + 1}</span>{s}
			</li>
		{/each}
	</ol>

	<div class="acts">
		{#if step === 0}
			<button type="button" class="cta" onclick={runApp} disabled={busy}>{tx.runBtn}</button>
			<button type="button" class="line-btn" onclick={installRuntime} disabled={busy || hasRuntime}
				>{tx.installBtn}</button
			>
		{:else if step === 1}
			<div class="features">
				{#each FEATURES as f (f)}
					<div class="feat">
						<b>{tx.features[f].name}</b>
						<div class="pick">
							<button
								type="button"
								class="opt"
								class:on={choice[f] === 'scratch'}
								onclick={() => choose(f, 'scratch')}
								>{tx.scratchBtn.replace('{n}', String(tx.features[f].days))}</button
							>
							<button
								type="button"
								class="opt mono"
								class:on={choice[f] === 'lib'}
								onclick={() => choose(f, 'lib')}>{tx.libBtn.replace('{lib}', LIBS[f].lib)}</button
							>
						</div>
					</div>
				{/each}
			</div>
			<p class="tally">
				{days ? tx.daysLabel.replace('{n}', String(days)) : tx.secondsLabel}
				<span>{tx.linesLabel.replace('{n}', String(ownLines))}</span>
			</p>
			{#if allChosen}
				{#if libCount > 0}
					<button type="button" class="cta" onclick={() => (step = 2)}>{tx.toUpdate}</button>
				{:else}
					<p class="need">{tx.needLib}</p>
				{/if}
			{/if}
		{:else}
			<button type="button" class="cta" onclick={updateAll} disabled={busy || updated}
				>{tx.updateBtn}</button
			>
			{#if broken && !pinned}
				<button type="button" class="line-btn warn" onclick={pin}
					>{tx.pinBtn.replace('{lib}', LIBS[broken].lib).replace('{v}', LIBS[broken].old)}</button
				>
			{/if}
		{/if}
	</div>

	<!-- The stack, from your code at the top down to the hardware -->
	<div class="stack">
		<div class="layer code">
			<span class="lname">{tx.layers.code}</span>
			<span class="lbody">
				<span class="app {app}"><i></i>{tx.appName}, {appText}</span>
				{#each FEATURES.filter((f) => choice[f] === 'scratch') as f (f)}
					<span class="chip own">{tx.features[f].name}, {tx.wroteChip}</span>
				{/each}
			</span>
		</div>
		<div class="layer libs">
			<span class="lname">{tx.layers.libs}</span>
			<span class="lbody">
				{#each FEATURES.filter((f) => choice[f] === 'lib') as f (f)}
					<span
						class="chip lib"
						class:bad={broken === f && !pinned}
						class:pinned={broken === f && pinned}>{LIBS[f].lib} {versionOf(f)}</span
					>
				{:else}
					<span class="muted">{tx.noLibs}</span>
				{/each}
			</span>
		</div>
		<div class="layer rt" class:missing={!hasRuntime}>
			<span class="lname">{tx.layers.runtime}</span>
			<span class="lbody">
				{#if hasRuntime}
					<span class="chip rtchip">Node.js 22</span>
				{:else}
					<span class="muted">Node.js, {tx.notInstalled}</span>
				{/if}
			</span>
		</div>
		<div class="layer os">
			<span class="lname">{tx.layers.os}</span>
			<span class="lbody"><span class="muted">{tx.osNote}</span></span>
		</div>
		<div class="layer hw">
			<span class="lname">{tx.layers.hw}</span>
			<span class="lbody"><span class="muted">{tx.hwNote}</span></span>
		</div>
	</div>

	{#if term.length}
		<div class="term"><Terminal host="nimbus" prompt="$ " lines={term} /></div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 520px);
		max-width: 100%;
		max-height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 6px;
	}
	.steps {
		display: flex;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 4px 10px 4px 4px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		font-size: 12px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.steps li span {
		display: grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-paper);
		font-size: 10.5px;
	}
	.steps li.cur {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.steps li.cur span {
		background: var(--color-brand);
		color: #fff;
	}
	.steps li.done {
		color: var(--color-grass);
	}
	.steps li.done span {
		background: var(--color-grass);
		color: #fff;
	}

	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		width: 100%;
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 18px;
		font-size: 13px;
		font-weight: 600;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.line-btn {
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		padding: 9px 16px;
		font-size: 13px;
		font-weight: 600;
	}
	.line-btn:enabled:hover {
		border-color: var(--color-ink);
	}
	.line-btn.warn {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.cta:disabled,
	.line-btn:disabled {
		opacity: 0.5;
	}

	.features {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
	}
	.feat {
		display: flex;
		flex-direction: column;
		gap: 5px;
		padding: 8px 10px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.feat b {
		font-size: 13px;
		color: var(--color-ink);
	}
	.pick {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}
	.opt {
		padding: 7px 6px;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 600;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.opt.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
	}
	.opt:hover {
		border-color: var(--color-brand);
	}
	.opt.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.tally {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.tally span {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.need {
		margin: 0;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-amber);
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
	}
	.layer {
		display: grid;
		grid-template-columns: 112px 1fr;
		align-items: center;
		gap: 10px;
		min-height: 38px;
		padding: 6px 10px;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		transition: opacity 0.3s ease;
	}
	.layer.code {
		border-color: color-mix(in srgb, var(--color-brand) 40%, var(--color-line));
	}
	.layer.libs {
		background: color-mix(in srgb, var(--color-brand-soft) 50%, var(--color-card));
	}
	.layer.rt {
		background: var(--color-brand-soft);
	}
	.layer.rt.missing {
		opacity: 0.55;
		background: var(--color-card);
	}
	.layer.os,
	.layer.hw {
		background: var(--color-paper);
	}
	.lname {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.lbody {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		min-width: 0;
	}
	.muted {
		font-size: 12px;
		color: var(--color-faint);
	}
	.app {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.app i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-faint);
	}
	.app.up {
		color: var(--color-grass);
	}
	.app.up i {
		background: var(--color-grass);
	}
	.app.down {
		color: var(--color-danger);
	}
	.app.down i {
		background: var(--color-danger);
	}
	.chip {
		padding: 2px 8px;
		border-radius: 999px;
		font-size: 11.5px;
		font-weight: 600;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		animation: pop 0.25s ease;
	}
	.chip.lib,
	.chip.rtchip {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		color: var(--color-brand);
	}
	.chip.own {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	.chip.lib.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.chip.lib.pinned {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	@keyframes pop {
		from {
			transform: scale(0.85);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.term {
		width: 100%;
		font-size: 12px;
	}

	@media (max-width: 400px) {
		.layer {
			grid-template-columns: 1fr;
			gap: 3px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.chip {
			animation: none;
		}
		.layer,
		.opt {
			transition: none;
		}
	}
</style>
