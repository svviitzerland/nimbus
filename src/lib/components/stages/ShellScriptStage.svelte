<script lang="ts">
	// A guided terminal lab. Nim does the nightly backup by hand once, then shows the same steps
	// written into backup.sh, a script. The script card writes itself, its special lines light
	// up, it gets its run switch with chmod +x, and ./backup.sh runs it line by line while a new
	// box lands on the backups shelf. On the last beat the learner types ./backup.sh for the
	// next night.
	import { untrack } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { ShellScriptText } from '$lib/chapters/linux/shell-script/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type Cmd, type ShellEvent } from './linux/shell.svelte';
	import { addDays, dir, file, lookup, mine, myDir, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as ShellScriptText);

	const BY_HAND = [
		'mkdir -p ~/backups',
		'tar -czf ~/backups/nimbus-$(date +%F).tar.gz /var/www/nimbus'
	];
	const SCRIPT: string[][] = [
		BY_HAND,
		['cat backup.sh'],
		[],
		[],
		['chmod +x backup.sh'],
		['./backup.sh'],
		[],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = './backup.sh';
	const FILE = '/home/nim/backup.sh';
	const FIRST_NIGHT = '2026-11-02';
	const TONIGHT = '2026-11-03';

	const BODY = [
		'#!/bin/bash',
		'DAY=$(date +%F)',
		'mkdir -p ~/backups',
		'tar -czf ~/backups/nimbus-$DAY.tar.gz /var/www/nimbus',
		'echo "Backup done for $DAY"'
	];

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	function makeFs(): FNode {
		return dir({
			home: dir({ nim: myDir({ 'backup.sh': mine(BODY) }) }),
			var: dir({
				www: dir({
					nimbus: dir({
						'index.html': file(['<h1>nimbus.com</h1>']),
						'style.css': file(['body { margin: 0 }'])
					})
				})
			}),
			tmp: dir({}, { mode: 0o777 })
		});
	}

	let runLine = $state(-1);
	let runTimer: ReturnType<typeof setInterval> | undefined;
	let quiet = false;
	const say = (t: string) => {
		if (!quiet && live) onstate?.(t);
	};

	/** Light the script's lines one by one, like bash reading it top to bottom. */
	function animateRun() {
		clearInterval(runTimer);
		if (
			quiet ||
			(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
		) {
			runLine = -1;
			return;
		}
		runLine = 0;
		runTimer = setInterval(() => {
			runLine += 1;
			if (runLine >= BODY.length) {
				clearInterval(runTimer);
				runLine = -1;
			}
		}, 520);
	}

	function onevent(e: ShellEvent) {
		if (e.type === 'exec' && e.path === FILE) {
			animateRun();
			say(e.direct ? 'ran' : 'bashRun');
			return true;
		}
		if (e.type === 'chmod') {
			say(e.mode & 0o100 ? 'chmod' : 'chmodOff');
			return true;
		}
		if (e.type === 'read' && e.path === FILE) {
			say('read');
			return true;
		}
		if (e.type === 'denied' && e.path === FILE) {
			say('runDenied');
			return true;
		}
		return false;
	}

	/** On the learner's turn every run is the next night, so each one makes a new box. */
	function handler(c: Cmd, sh: LinuxShell) {
		const runs =
			c.name === './backup.sh' ||
			c.name === FILE ||
			c.name === '~/backup.sh' ||
			((c.name === 'bash' || c.name === 'sh') && c.args[0]?.endsWith('backup.sh'));
		if (runs && !quiet && live) {
			sh.date = addDays(sh.date, 1);
			sh.hint(tx.nightLine.replace('{day}', sh.date));
		}
		return false;
	}

	const shell = new LinuxShell({ fs: makeFs(), text: () => tx, react: say, onevent, handler });
	shell.speed = 50;

	function direct(sc: number) {
		clearInterval(runTimer);
		runLine = -1;
		shell.reset(makeFs(), '/home/nim', FIRST_NIGHT);
		quiet = true;
		if (sc > 0) {
			shell.quick(BY_HAND);
			shell.date = TONIGHT;
			shell.quick(SCRIPT.slice(1, sc).flat());
		}
		quiet = false;
		shell.typeSeq(SCRIPT[sc]);
	}

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		return () => {
			clearInterval(runTimer);
			shell.destroy();
		};
	});
	$effect(() => {
		void beat;
		peek = null;
	});
	$effect(() => {
		const sc = scene;
		untrack(() => direct(sc));
	});

	// The script card writes itself on the beat that introduces it.
	let shown = $state(BODY.length);
	$effect(() => {
		if (
			scene !== 1 ||
			(typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
		) {
			shown = BODY.length;
			return;
		}
		shown = 0;
		const t = setInterval(() => {
			shown += 1;
			if (shown >= BODY.length) clearInterval(t);
		}, 650);
		return () => clearInterval(t);
	});

	const script = $derived(lookup(shell.fs, FILE));
	const runnable = $derived(!!script && (script.mode & 0o100) !== 0);
	const lines = $derived(script?.body ?? BODY);
	const backups = $derived.by(() => {
		const d = lookup(shell.fs, '/home/nim/backups');
		return Object.keys(d?.kids ?? {})
			.sort()
			.slice(-4);
	});
	const dayOf = (name: string) => /(\d{2})-(\d{2})\.tar/.exec(name)?.slice(1).join('/') ?? name;
	const hot = (k: number) => runLine === k || (scene === 2 && k === 0) || (scene === 3 && k === 1);
	const showCard = $derived(scene >= 1);
</script>

{#snippet art(i: number)}
	<div class="wrap">
		{#if showCard}
			<div class="paper" in:fade={{ duration: 300 }}>
				<div class="paper-head">
					<span class="fname">backup.sh</span>
					{#if runnable}
						<span class="badge" in:fade={{ duration: 300 }}>{tx.runnableChip}</span>
					{/if}
				</div>
				<div class="code">
					{#each lines as l, k (k)}
						<div class="ln" class:hot={hot(k)} class:hidden={k >= shown}>
							<span class="num">{k + 1}</span><span class="src">{l}</span>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<p class="by-hand" in:fade={{ duration: 300 }}>{tx.byHand}</p>
		{/if}

		<div class="shelf-row">
			<span class="shelf-label">~/backups</span>
			<div class="shelf">
				{#each backups as b (b)}
					<span class="box" in:fly={{ y: -16, duration: 450 }}>
						<svg viewBox="0 0 30 24" aria-hidden="true">
							<rect x="1" y="1" width="28" height="22" rx="3" />
							<path d="M1 8 H29" />
						</svg>
						<em>{dayOf(b)}</em>
					</span>
				{:else}
					<span class="empty">{tx.emptyShelf}</span>
				{/each}
			</div>
		</div>
		{#if i === 6}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<GuidedLab {tx} {shell} active={scene} {live} tryCmd={TRY} onselect={(i) => (peek = i)} {art} />

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.by-hand {
		margin: 6px 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.paper {
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-paper);
		padding: 8px 10px;
	}
	.paper-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 4px;
	}
	.fname {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.badge {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 2px 9px;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		overflow-x: auto;
	}
	.ln {
		display: flex;
		gap: 10px;
		border-radius: 6px;
		padding: 2px 6px;
		transition:
			background 0.3s,
			opacity 0.4s,
			transform 0.4s;
	}
	.ln.hidden {
		opacity: 0;
		transform: translateY(5px);
	}
	.ln.hot {
		background: var(--color-brand-soft);
	}
	.num {
		width: 10px;
		flex: none;
		text-align: right;
		color: var(--color-faint);
	}
	.src {
		white-space: pre;
		color: var(--color-ink);
	}
	.shelf-row {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.shelf-label {
		flex: none;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.shelf {
		display: flex;
		min-height: 52px;
		flex: 1;
		align-items: flex-end;
		gap: 8px;
		border-bottom: 3px solid color-mix(in srgb, var(--color-amber) 55%, transparent);
		padding: 0 6px 4px;
	}
	.box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.box svg {
		height: 24px;
		width: 30px;
	}
	.box rect {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.box path {
		stroke: var(--color-amber);
		stroke-width: 1.2;
	}
	.box em {
		font-size: 10.5px;
		font-style: normal;
		font-weight: 700;
		color: var(--color-muted);
	}
	.empty {
		font-size: 12px;
		color: var(--color-faint);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.ln {
			transition: none;
		}
	}
</style>
