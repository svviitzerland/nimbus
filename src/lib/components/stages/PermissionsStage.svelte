<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { PermissionsText } from '$lib/chapters/linux/permissions/types';
	import LinuxTerminal from './linux/LinuxTerminal.svelte';
	import Missions from './linux/Missions.svelte';
	import { LinuxShell, type ShellEvent } from './linux/shell.svelte';
	import { basename, dir, file, lookup, mine, myDir, octal, type FNode } from './linux/fs';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as PermissionsText);

	// The card shows from the beat about r, w, and x; the beat about owner, group, and others
	// lights up its rows.
	const LETTERS_BEAT = 1;
	const PEOPLE_BEAT = 2;
	const live = $derived(beat >= tx.intro.length - 1);
	$effect(() => {
		onshow?.(beat >= LETTERS_BEAT);
	});

	const SCRIPT = '/home/nim/backup.sh';
	const CONF = '/etc/nimbus/app.conf';
	function makeFs(): FNode {
		return dir({
			etc: dir({
				nimbus: dir({
					'app.conf': file(
						['# nimbus.com settings', 'port = 80', 'db_user = nimbus', 'db_password = Cl0udy!Sky'],
						{ mode: 0o640 }
					)
				}),
				shadow: file(['root:*:20000:0:99999:7:::'], { mode: 0o640, group: 'shadow' })
			}),
			home: dir({
				nim: myDir({
					'backup.sh': mine([
						'#!/bin/bash',
						'echo "Packing up /var/www/nimbus ..."',
						'echo "Backup saved, 3 files"'
					]),
					'notes.txt': mine(['Remember to back up nimbus.com every night'])
				})
			}),
			root: dir({}, { mode: 0o700 }),
			tmp: dir({}, { mode: 0o777 }),
			var: dir({ www: dir({ nimbus: dir({ 'index.html': file(['<h1>nimbus.com</h1>']) }) }) })
		});
	}

	// ---- Missions ----
	type MId = 'listed' | 'ran' | 'sudo' | 'undo';
	const ORDER: MId[] = ['listed', 'ran', 'sudo', 'undo'];
	let done = $state<Record<MId, boolean>>({ listed: false, ran: false, sudo: false, undo: false });
	let finished = false;
	function complete(m: MId) {
		if (done[m]) return false;
		done[m] = true;
		if (ORDER.every((x) => done[x])) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
			}
		} else onstate?.(m);
		return true;
	}

	// The file shown in the card follows whatever you last touched.
	let focus = $state(SCRIPT);
	let riskyPath = $state('');
	const say = (t: string) => {
		onstate?.(t);
		return true;
	};
	const isFile = (p: string) => lookup(shell.fs, p)?.kind === 'file';

	function onevent(e: ShellEvent) {
		if ('path' in e && isFile(e.path)) focus = e.path;
		switch (e.type) {
			case 'ls':
				if (e.long && (e.path === '/home/nim' || e.path === SCRIPT)) return complete('listed');
				return false;
			case 'denied':
				if (e.path === SCRIPT) return say('runDenied');
				if (e.path === CONF) return say('confDenied');
				return false;
			case 'exec':
				if (e.path !== SCRIPT) return false;
				if (e.direct) return complete('ran');
				return say('bashTrick');
			case 'read':
				if (e.path === CONF && e.sudo) return complete('sudo');
				return false;
			case 'notOwner':
				return say('notOwner');
			case 'rmroot':
				return say('rmrf');
			case 'chmod': {
				const open = (e.mode & 0o002) !== 0;
				if (e.mode === 0o777) {
					riskyPath = e.path;
					return say('risky');
				}
				if (riskyPath === e.path && !open) return complete('undo');
				if (open) return say('othersWrite');
				if (e.path === SCRIPT && e.mode & 0o100 && !(e.prev & 0o100)) return say('chmodX');
				return say('chmod');
			}
		}
		return false;
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: (t) => onstate?.(t),
		onevent
	});
	$effect(() => () => shell.destroy());

	const script = $derived(lookup(shell.fs, SCRIPT));
	const help: Record<MId, () => string> = {
		listed: () => (shell.cwd === '/home/nim' ? 'ls -l' : 'ls -l ~'),
		ran: () => {
			const ready = script && script.mode & 0o100;
			if (shell.cwd !== '/home/nim') return ready ? '~/backup.sh' : 'chmod u+x ~/backup.sh';
			return ready ? './backup.sh' : 'chmod u+x backup.sh';
		},
		sudo: () => `sudo cat ${CONF}`,
		undo: () => (riskyPath ? `chmod 755 ${tidy(riskyPath)}` : 'chmod 777 backup.sh')
	};
	const items = $derived(
		ORDER.map((m, i) => ({
			label: tx.missions[i],
			done: done[m],
			help: () => shell.typeFor(help[m]())
		}))
	);
	/** A path as short as it can be from where you stand. */
	function tidy(p: string) {
		if (p.startsWith(shell.cwd + '/')) return p.slice(shell.cwd.length + 1);
		if (p.startsWith('/home/nim/')) return '~/' + p.slice('/home/nim/'.length);
		return p;
	}

	// ---- The permission card ----
	const node = $derived(lookup(shell.fs, focus));
	const WHO = ['u', 'g', 'o'] as const;
	const WHAT = ['r', 'w', 'x'] as const;
	const ROWS = [0, 1, 2];
	const bit = (row: number, col: number) => 1 << (8 - (row * 3 + col));
	const on = (row: number, col: number) => !!node && (node.mode & bit(row, col)) !== 0;
	function flip(row: number, col: number) {
		if (!live || !node || shell.typing || shell.busy) return;
		const sign = on(row, col) ? '-' : '+';
		const pre = node.owner === 'nim' ? '' : 'sudo ';
		shell.typeFor(`${pre}chmod ${WHO[row]}${sign}${WHAT[col]} ${tidy(focus)}`);
	}
	const digits = $derived(node ? octal(node.mode) : '000');
	const who = $derived([
		`${tx.ownerLabel} (${node?.owner ?? ''})`,
		`${tx.groupLabel} (${node?.group ?? ''})`,
		tx.othersLabel
	]);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={!live || shell.typing || shell.busy}
	/>

	{#if node}
		<div class="card" class:danger={(node.mode & 0o002) !== 0}>
			<div class="chead">
				<span class="fname">{basename(focus)}</span>
				<span class="mode"
					><span class="kind">-</span>{#each ROWS as r (r)}<span class="triad t{r}"
							>{#each WHAT as l, c (c)}{on(r, c) ? l : '-'}{/each}</span
						>{/each}</span
				>
				<span class="oct">{digits}</span>
			</div>
			<div class="grid" role="group" aria-label={tx.cardLabel}>
				<span></span>
				{#each tx.permLabels as p (p)}<span class="colh">{p}</span>{/each}
				{#each ROWS as r (r)}
					<span class="rowh" class:lit={beat === PEOPLE_BEAT}>{who[r]}</span>
					{#each WHAT as l, c (c)}
						<button
							type="button"
							class="cell"
							class:on={on(r, c)}
							class:bad={r === 2 && c === 1 && on(r, c)}
							disabled={!live}
							aria-pressed={on(r, c)}
							aria-label="{who[r]} {tx.permLabels[c]}"
							onclick={() => flip(r, c)}>{on(r, c) ? l : '-'}</button
						>
					{/each}
				{/each}
			</div>
			<p class="cap">{(node.mode & 0o002) !== 0 ? tx.dangerNote : tx.cardNote}</p>
		</div>
	{/if}

	<LinuxTerminal {shell} {live} inputLabel={tx.inputLabel} short />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 420px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}
	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 10px 12px 8px;
		transition: border-color 0.3s ease;
	}
	.card.danger {
		border-color: var(--color-danger);
	}
	.chead {
		display: flex;
		align-items: baseline;
		gap: 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		margin-bottom: 8px;
	}
	.fname {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mode {
		margin-left: auto;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.04em;
	}
	.kind {
		color: var(--color-faint);
	}
	.t0 {
		color: var(--color-brand);
	}
	.t1 {
		color: var(--color-amber);
	}
	.t2 {
		color: var(--color-grass);
	}
	.oct {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
		border: 1px solid var(--color-line);
		border-radius: 6px;
		padding: 0 6px;
	}
	.grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) repeat(3, 52px);
		gap: 5px;
		align-items: center;
	}
	.colh {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
		text-align: center;
	}
	.rowh {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
		border-radius: 6px;
		padding: 2px 4px;
		transition: background 0.3s ease;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.rowh.lit {
		background: var(--color-amber-soft);
	}
	.cell {
		height: 30px;
		border-radius: 8px;
		border: 1.5px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-faint);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 14px;
		font-weight: 800;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}
	.cell.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.cell.bad {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.cell:hover:not(:disabled) {
		border-color: var(--color-brand);
	}
	.cell:disabled {
		cursor: default;
	}
	.cap {
		margin: 8px 0 0;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.danger .cap {
		color: var(--color-danger);
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		.grid {
			grid-template-columns: minmax(0, 1fr) repeat(3, 64px);
		}
	}
</style>
