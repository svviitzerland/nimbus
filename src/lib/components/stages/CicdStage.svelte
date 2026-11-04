<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CicdText } from '$lib/chapters/compute/types';

	let {
		text,
		oncomplete,
		onstate,
		onshow,
		beat = 0
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
		beat?: number;
	} = $props();
	const tx = $derived(text as CicdText);

	type St = 'idle' | 'run' | 'pass' | 'fail';
	type Line = { type: 'cmd' | 'dim' | 'ok' | 'fail'; text: string };
	let build = $state<St>('idle');
	let test = $state<St>('idle');
	let deploy = $state<St>('idle');
	let live = $state<'idle' | 'updated' | 'blocked'>('idle');
	let version = $state(1);
	let running = $state(false);
	let lastNote = $state<string | null>(null);
	let lines = $state<Line[]>([]);
	let goodTried = false;
	let badTried = false;
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let consoleEl: HTMLDivElement | undefined;

	const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
	const clearTimers = () => {
		timers.forEach(clearTimeout);
		timers = [];
	};
	const log = (type: Line['type'], text: string) => (lines = [...lines, { type, text }]);

	$effect(() => {
		onshow?.(beat >= 1);
	});
	// keep the console scrolled to the newest line
	$effect(() => {
		void lines.length;
		if (consoleEl) consoleEl.scrollTop = consoleEl.scrollHeight;
	});

	function ship(kind: 'good' | 'bad') {
		if (running) return;
		clearTimers();
		running = true;
		lastNote = null;
		build = 'idle';
		test = 'idle';
		deploy = 'idle';
		live = 'idle';
		lines = [];
		log('cmd', '$ git push origin main');
		log('dim', 'pipeline triggered');

		at(120, () => {
			build = 'run';
			log('cmd', '$ npm run build');
		});
		at(640, () => {
			build = 'pass';
			log('ok', 'build passed in 2.1s');
			test = 'run';
			log('cmd', '$ npm test');
		});
		at(880, () => log('ok', '  checkout ok'));

		if (kind === 'good') {
			at(1080, () => log('ok', '  payment ok'));
			at(1240, () => {
				test = 'pass';
				log('ok', '2 of 2 tests passed');
				deploy = 'run';
				log('cmd', '$ deploy to production');
			});
			at(1820, () => {
				deploy = 'pass';
				log('ok', `deployed v${version + 1}`);
			});
			at(2080, () => {
				live = 'updated';
				version += 1;
				log('ok', `production is live on v${version}`);
				finish('good');
			});
		} else {
			at(1120, () => {
				test = 'fail';
				log('fail', '  payment ok FAILED');
				log('fail', 'TypeError: price is undefined');
				log('fail', '1 of 2 tests failed');
				live = 'blocked';
			});
			at(1480, () => {
				log('fail', 'pipeline stopped, deploy skipped');
				log('dim', `production unchanged, still v${version}`);
			});
			at(1820, () => finish('bad'));
		}
	}

	function finish(kind: 'good' | 'bad') {
		running = false;
		if (kind === 'good') {
			goodTried = true;
			lastNote = tx.goodNote;
		} else {
			badTried = true;
			lastNote = tx.badNote;
		}
		onstate?.(kind === 'good' ? 'pass' : 'caught');
		if (goodTried && badTried && !done) {
			done = true;
			oncomplete?.();
			onstate?.('both');
		}
	}

	onDestroy(clearTimers);
</script>

<div class="wrap">
	<div class="pipe">
		<div class="node commit"><span class="ndot"></span>{tx.commitLabel}</div>
		<span class="arr" aria-hidden="true">›</span>

		<!-- CI: build and test -->
		<div class="gwrap">
			<span class="glabel ci">CI</span>
			<div class="group ci">
				<div class="stage {build}">
					<span class="sicon" aria-hidden="true">
						{#if build === 'pass'}✓{:else if build === 'fail'}✕{:else if build === 'run'}<span
								class="sp"
							></span>{/if}
					</span>
					<span class="slabel">{tx.buildLabel}</span>
				</div>
				<span class="arr" aria-hidden="true">›</span>
				<div class="stage {test}">
					<span class="sicon" aria-hidden="true">
						{#if test === 'pass'}✓{:else if test === 'fail'}✕{:else if test === 'run'}<span
								class="sp"
							></span>{/if}
					</span>
					<span class="slabel">{tx.testLabel}</span>
				</div>
			</div>
			<span class="gsub">{tx.ciSub}</span>
		</div>

		<span class="arr" aria-hidden="true">›</span>

		<!-- CD: deploy -->
		<div class="gwrap">
			<span class="glabel cd">CD</span>
			<div class="group cd">
				<div class="stage {deploy}">
					<span class="sicon" aria-hidden="true">
						{#if deploy === 'pass'}✓{:else if deploy === 'fail'}✕{:else if deploy === 'run'}<span
								class="sp"
							></span>{/if}
					</span>
					<span class="slabel">{tx.deployLabel}</span>
				</div>
			</div>
			<span class="gsub">{tx.cdSub}</span>
		</div>

		<span class="arr" aria-hidden="true">›</span>
		<div class="node live {live}">
			<span class="lname">{tx.liveLabel}</span>
			<span class="ver">v{version}</span>
			{#if live === 'blocked'}<span class="safe">{tx.safeNote}</span>{/if}
		</div>
	</div>

	<!-- the pipeline's console -->
	<div class="term">
		<div class="tbar">
			<span class="tdot"></span><span class="tdot"></span><span class="tdot"></span>
			<span class="ttitle">pipeline</span>
		</div>
		<div class="console" bind:this={consoleEl}>
			{#if lines.length === 0}
				<div class="line dim">$ waiting for a change…</div>
			{:else}
				{#each lines as l, i (i)}
					<div class="line {l.type}">{l.text}</div>
				{/each}
			{/if}
			{#if running}<div class="line cmd cur">▋</div>{/if}
		</div>
	</div>

	<div class="btns">
		<button type="button" class="sbtn good" disabled={running} onclick={() => ship('good')}>
			{tx.goodBtn}
		</button>
		<button type="button" class="sbtn bad" disabled={running} onclick={() => ship('bad')}>
			{tx.badBtn}
		</button>
	</div>

	<p class="note" class:hint={!lastNote}>{lastNote ?? tx.tryBothHint}</p>
</div>

<style>
	.wrap {
		display: flex;
		width: min(96vw, 480px);
		height: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 13px;
	}

	.pipe {
		display: flex;
		width: 100%;
		flex-wrap: wrap;
		align-items: flex-start;
		justify-content: center;
		gap: 4px 3px;
	}
	.arr {
		margin-top: 12px;
		color: #c2bcae;
		font-size: 15px;
		font-weight: 800;
	}
	.node {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		margin-top: 7px;
		border-radius: 10px;
		border: 1px solid #e4ddd0;
		background: #fff;
		padding: 8px 11px;
		font-size: 11px;
		font-weight: 800;
		color: #2b3640;
	}
	.commit {
		flex-direction: row;
		gap: 6px;
	}
	.ndot {
		height: 9px;
		width: 9px;
		border-radius: 50%;
		background: #2e6fe0;
	}
	.live {
		min-width: 64px;
	}
	.lname {
		font-size: 11px;
	}
	.ver {
		border-radius: 5px;
		background: #f1ece2;
		padding: 1px 6px;
		font-size: 10px;
		font-weight: 800;
		color: #8a949d;
		font-variant-numeric: tabular-nums;
		transition:
			background 0.3s,
			color 0.3s;
	}
	.live.updated {
		border-color: #b9e0c8;
		background: #f1f8f3;
	}
	.live.updated .ver {
		background: #2f8a57;
		color: #fff;
	}
	.live.blocked {
		border-color: #eab3aa;
		background: #fdf3f1;
	}
	.safe {
		margin-top: 1px;
		font-size: 9px;
		font-weight: 800;
		color: #d3584a;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* CI / CD groups */
	.gwrap {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.glabel {
		border-radius: 6px;
		padding: 1px 9px;
		font-size: 10px;
		font-weight: 900;
		letter-spacing: 0.06em;
	}
	.glabel.ci {
		background: #eaf1fc;
		color: #2e6fe0;
	}
	.glabel.cd {
		background: #eaf6ee;
		color: #2f8a57;
	}
	.group {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 11px;
		border: 1.5px solid #e3e7ee;
		padding: 6px;
	}
	.group.ci {
		border-color: #c7d7f2;
	}
	.group.cd {
		border-color: #bfe0cd;
	}
	.gsub {
		max-width: 120px;
		text-align: center;
		font-size: 8.5px;
		font-weight: 700;
		line-height: 1.2;
		color: #9aa3ae;
	}

	.stage {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		min-width: 52px;
		border-radius: 8px;
		border: 1px solid #e6e0d6;
		background: #fff;
		padding: 7px 8px;
		transition:
			border-color 0.25s,
			background 0.25s;
	}
	.stage .sicon {
		display: inline-flex;
		height: 18px;
		width: 18px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #ece6dc;
		font-size: 11px;
		font-weight: 900;
		color: #fff;
	}
	.slabel {
		font-size: 10.5px;
		font-weight: 800;
		color: #6b7682;
	}
	.stage.run {
		border-color: #f0d49a;
		background: #fff7e8;
	}
	.stage.run .sicon {
		background: #e7a93a;
	}
	.stage.run .slabel {
		color: #b9802a;
	}
	.stage.pass {
		border-color: #b9e0c8;
		background: #f1f8f3;
	}
	.stage.pass .sicon {
		background: #2f8a57;
	}
	.stage.pass .slabel {
		color: #2f7d54;
	}
	.stage.fail {
		border-color: #eab3aa;
		background: #fdf3f1;
	}
	.stage.fail .sicon {
		background: #d3584a;
	}
	.stage.fail .slabel {
		color: #c4503f;
	}
	.sp {
		height: 11px;
		width: 11px;
		border: 2px solid rgba(255, 255, 255, 0.55);
		border-top-color: #fff;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* console */
	.term {
		width: 100%;
		overflow: hidden;
		border-radius: 11px;
		border: 1px solid #20303f;
		background: #1b2530;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.14);
	}
	.tbar {
		display: flex;
		align-items: center;
		gap: 5px;
		border-bottom: 1px solid #2a3a49;
		background: #16212b;
		padding: 6px 10px;
	}
	.tdot {
		height: 7px;
		width: 7px;
		border-radius: 50%;
		background: #3a4a5a;
	}
	.ttitle {
		margin-left: 4px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: #6b7d8f;
	}
	.console {
		height: 132px;
		overflow-y: auto;
		padding: 9px 12px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		line-height: 1.65;
	}
	.line {
		white-space: pre-wrap;
		word-break: break-word;
	}
	.line.cmd {
		color: #d6deea;
	}
	.line.dim {
		color: #6b7d8f;
	}
	.line.ok {
		color: #6cc08a;
	}
	.line.fail {
		color: #ef8b80;
	}
	.cur {
		animation: blink 1s step-end infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	.btns {
		display: flex;
		width: 100%;
		max-width: 360px;
		gap: 9px;
	}
	.sbtn {
		flex: 1;
		border-radius: 11px;
		padding: 11px 8px;
		font-size: 12.5px;
		font-weight: 800;
		color: #fff;
		transition:
			filter 0.15s,
			transform 0.08s,
			opacity 0.15s;
	}
	.sbtn:enabled:hover {
		filter: brightness(1.07);
	}
	.sbtn:enabled:active {
		transform: translateY(1px);
	}
	.sbtn:disabled {
		opacity: 0.5;
	}
	.sbtn.good {
		background: #2f8a57;
	}
	.sbtn.bad {
		background: #d3584a;
	}

	.note {
		margin: 0;
		min-height: 30px;
		max-width: 360px;
		text-align: center;
		font-size: 12px;
		line-height: 1.45;
		color: #4a5663;
	}
	.note.hint {
		color: #9aa3ae;
	}

	/* ---- Dark mode ---- */
	:global(.dark) .node {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-ink);
	}
	:global(.dark) .ver {
		background: var(--color-line);
		color: var(--color-faint);
	}
	:global(.dark) .live.updated {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	:global(.dark) .live.blocked {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	:global(.dark) .glabel.ci {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	:global(.dark) .glabel.cd {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	:global(.dark) .group {
		border-color: var(--color-line);
	}
	:global(.dark) .group.ci {
		border-color: var(--color-brand-soft);
	}
	:global(.dark) .group.cd {
		border-color: var(--color-grass-soft);
	}
	:global(.dark) .gsub {
		color: var(--color-faint);
	}
	:global(.dark) .stage {
		border-color: var(--color-line);
		background: var(--color-card);
	}
	:global(.dark) .stage .sicon {
		background: var(--color-line);
	}
	:global(.dark) .slabel {
		color: var(--color-muted);
	}
	:global(.dark) .stage.run {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
	}
	:global(.dark) .stage.run .slabel {
		color: var(--color-amber);
	}
	:global(.dark) .stage.pass {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	:global(.dark) .stage.pass .slabel {
		color: var(--color-grass);
	}
	:global(.dark) .stage.fail {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	:global(.dark) .stage.fail .slabel {
		color: var(--color-danger);
	}
	:global(.dark) .arr {
		color: var(--color-muted);
	}
	:global(.dark) .note {
		color: var(--color-muted);
	}
	:global(.dark) .note.hint {
		color: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.sp {
			animation-duration: 1.4s;
		}
		.cur {
			animation: none;
		}
	}
</style>
