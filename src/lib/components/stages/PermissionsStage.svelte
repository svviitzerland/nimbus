<script lang="ts">
	// A guided terminal lab. A file card shows nine permission switches (owner, group, others
	// times read, write, run). Nim narrates while the terminal types ls -l, a failing ./backup.sh,
	// chmod u+x, chmod 755 and a sudo cat, and the switches flip by themselves as each command
	// runs. On the last beat the learner types one command, chmod 700 backup.sh.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { PermissionsText } from '$lib/chapters/linux/permissions/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type ShellEvent } from './linux/shell.svelte';
	import { dir, file, lookup, mine, modeStr, myDir, octal, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as PermissionsText);

	const SCRIPT: string[][] = [
		[],
		['ls -l backup.sh'],
		[],
		['./backup.sh'],
		['chmod u+x backup.sh', './backup.sh'],
		['chmod 755 backup.sh', 'ls -l backup.sh'],
		[],
		['cat /etc/nimbus.conf', 'sudo cat /etc/nimbus.conf'],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = 'chmod 700 backup.sh';
	const SCRIPT_PATH = '/home/nim/backup.sh';
	const CONF_PATH = '/etc/nimbus.conf';

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	function makeFs(): FNode {
		return dir({
			etc: dir({ 'nimbus.conf': file(['db_password=n1mbus-s3cret'], { mode: 0o600 }) }),
			home: dir({
				nim: myDir({
					'backup.sh': mine(['#!/bin/bash', 'echo "Backup done, nimbus.com is safe"']),
					'notes.txt': mine(['remember to back up tonight'])
				})
			}),
			tmp: dir({}, { mode: 0o777 })
		});
	}

	// What the card shows, driven by what the commands did.
	let focus = $state(SCRIPT_PATH);
	let result = $state<'denied' | 'ran' | null>(null);
	let boss = $state(false);
	let quiet = false;
	const say = (t: string) => {
		if (!quiet && live) onstate?.(t);
	};

	function onevent(e: ShellEvent) {
		if (e.type === 'chmod') {
			focus = e.path;
			result = null;
			boss = false;
			if (e.mode === 0o700) say('locked');
			else if (e.mode & 0o002) say('risky');
			else say('chmod');
			return true;
		}
		if (e.type === 'exec') {
			focus = e.path;
			result = 'ran';
			boss = false;
			say('ran');
			return true;
		}
		if (e.type === 'denied') {
			if (lookup(shell.fs, e.path)) focus = e.path;
			result = 'denied';
			boss = false;
			return false;
		}
		if (e.type === 'read') {
			focus = e.path;
			result = null;
			boss = e.sudo;
			if (e.sudo) say('sudo');
			return e.sudo;
		}
		return false;
	}

	const shell = new LinuxShell({ fs: makeFs(), text: () => tx, react: say, onevent });
	shell.speed = 55;

	function direct(sc: number) {
		shell.reset(makeFs());
		quiet = true;
		shell.quick(SCRIPT.slice(0, sc).flat());
		quiet = false;
		focus = sc === 7 || sc === 8 ? CONF_PATH : SCRIPT_PATH;
		if (sc >= LAST || SCRIPT[sc].length) {
			result = null;
			boss = false;
		}
		shell.typeSeq(SCRIPT[sc]);
	}

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		return () => shell.destroy();
	});
	$effect(() => {
		void beat;
		peek = null;
	});
	$effect(() => {
		const sc = scene;
		untrack(() => direct(sc));
	});

	// On the "three times three" beat a soft highlight walks over the columns, then the rows.
	let walk = $state(-1);
	$effect(() => {
		if (scene !== 2) {
			walk = -1;
			return;
		}
		if (typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches)
			return;
		walk = 0;
		const t = setInterval(() => (walk = (walk + 1) % 7), 1300);
		return () => clearInterval(t);
	});

	const node = $derived(lookup(shell.fs, focus));
	const name = $derived(focus.slice(focus.lastIndexOf('/') + 1));
	const mode = $derived(node?.mode ?? 0);
	const letters = $derived(node ? modeStr(node).slice(1) : '---------');
	const SHIFT = [6, 3, 0];
	const BIT = [4, 2, 1];
	const on = (row: number, col: number) => ((mode >> SHIFT[row]) & BIT[col]) !== 0;
	const digit = (row: number) => (mode >> SHIFT[row]) & 7;
	const showDigits = $derived(scene >= 5);
	const colLit = (c: number) => walk === c;
	const rowLit = (r: number) => walk === r + 3;
</script>

{#snippet card(i: number)}
	<div class="card" class:shake={result === 'denied' && i !== LAST}>
		<div class="head">
			<svg viewBox="0 0 24 28" class="icon" aria-hidden="true">
				<path d="M2 2 H15 L22 9 V26 H2 Z" />
				<path d="M15 2 V9 H22" class="fold" />
			</svg>
			<div class="meta">
				<strong>{name}</strong>
				<span>{tx.ownedBy.replace('{owner}', node?.owner ?? 'root')}</span>
			</div>
			{#if boss}
				<span class="chip boss" in:fade={{ duration: 250 }}>{tx.bossChip}</span>
			{:else if result === 'denied'}
				<span class="chip bad" in:fade={{ duration: 250 }}>{tx.deniedChip}</span>
			{:else if result === 'ran'}
				<span class="chip good" in:fade={{ duration: 250 }}>{tx.ranChip}</span>
			{/if}
		</div>

		<p class="letters" class:glow={i === 1} aria-label={letters}>
			{#each letters.split('') as l, k (k)}
				<span class="g{Math.floor(k / 3)}" class:off={l === '-'}>{l}</span>
			{/each}
		</p>

		<div class="grid" role="img" aria-label={`${name} ${letters}`}>
			<span></span>
			{#each tx.permLabels as p, c (c)}
				<span class="col" class:lit={colLit(c)}>{p}</span>
			{/each}
			<span class="col">{showDigits ? tx.sumLabel : ''}</span>
			{#each tx.rowLabels as r, row (row)}
				<span class="row g{row}" class:lit={rowLit(row)}>{r}</span>
				{#each BIT as b, c (b)}
					<span class="cell" class:lit={colLit(c) || rowLit(row)}>
						<i class="switch" class:on={on(row, c)}><b></b></i>
					</span>
				{/each}
				<span class="digit">
					{#if showDigits}<em in:fade={{ duration: 300 }}>{digit(row)}</em>{/if}
				</span>
			{/each}
		</div>

		{#if i === 6}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
		{:else if i === 8}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.sudoRule}</p>
		{:else if showDigits}
			<p class="octal">chmod <b>{octal(mode)}</b> {name}</p>
		{/if}
	</div>
{/snippet}

<GuidedLab
	{tx}
	{shell}
	active={scene}
	{live}
	tryCmd={TRY}
	onselect={(i) => (peek = i)}
	art={card}
/>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 4px 6px 2px;
	}
	.card.shake {
		animation: shake 0.45s ease 0.2s;
	}
	@keyframes shake {
		25% {
			transform: translateX(-5px);
		}
		75% {
			transform: translateX(5px);
		}
	}
	.head {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.icon {
		height: 30px;
		width: 26px;
		flex: none;
	}
	.icon path {
		fill: var(--color-paper);
		stroke: var(--color-muted);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.icon .fold {
		fill: none;
	}
	.meta {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
	}
	.meta strong {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 14px;
		color: var(--color-ink);
	}
	.meta span {
		font-size: 12px;
		color: var(--color-muted);
	}
	.chip {
		flex: none;
		border-radius: 999px;
		padding: 3px 10px;
		font-size: 11.5px;
		font-weight: 700;
	}
	.chip.bad {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.chip.good {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.chip.boss {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.letters {
		margin: 0;
		text-align: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 22px;
		font-weight: 700;
		letter-spacing: 0.12em;
	}
	.letters span {
		transition: opacity 0.4s;
	}
	.letters .off {
		opacity: 0.35;
	}
	.letters.glow {
		animation: pulse 1.6s ease-in-out 2;
	}
	@keyframes pulse {
		50% {
			transform: scale(1.06);
		}
	}
	.g0 {
		color: var(--color-brand);
	}
	.g1 {
		color: var(--color-grass);
	}
	.g2 {
		color: var(--color-amber);
	}
	.grid {
		display: grid;
		grid-template-columns: auto repeat(3, minmax(0, 1fr)) 44px;
		align-items: center;
		gap: 6px 4px;
	}
	.col {
		text-align: center;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-muted);
		border-radius: 8px;
		padding: 2px 0;
		transition: background 0.4s;
	}
	.row {
		padding: 4px 8px 4px 0;
		font-size: 12.5px;
		font-weight: 700;
		border-radius: 8px;
		transition: background 0.4s;
	}
	.cell {
		display: flex;
		justify-content: center;
		border-radius: 10px;
		padding: 5px 0;
		transition: background 0.4s;
	}
	.lit {
		background: var(--color-brand-soft);
	}
	.switch {
		position: relative;
		display: block;
		height: 20px;
		width: 36px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.35s;
	}
	.switch b {
		position: absolute;
		top: 3px;
		left: 3px;
		height: 14px;
		width: 14px;
		border-radius: 999px;
		background: var(--color-card);
		box-shadow: 0 1px 3px rgba(15, 32, 48, 0.25);
		transition: transform 0.35s cubic-bezier(0.3, 0.7, 0.3, 1);
	}
	.switch.on {
		background: var(--color-grass);
	}
	.switch.on b {
		transform: translateX(16px);
	}
	.digit {
		text-align: center;
	}
	.digit em {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 18px;
		font-style: normal;
		font-weight: 800;
		color: var(--color-ink);
	}
	.rule,
	.octal {
		margin: 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
	}
	.rule {
		color: var(--color-grass);
	}
	.octal {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: var(--color-muted);
	}
	.octal b {
		color: var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.card.shake,
		.letters.glow {
			animation: none;
		}
		.switch,
		.switch b,
		.cell,
		.row,
		.col {
			transition: none;
		}
	}
</style>
