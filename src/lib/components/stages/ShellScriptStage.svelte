<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { ShellScriptText } from '$lib/chapters/linux/shell-script/types';
	import LinuxTerminal from './linux/LinuxTerminal.svelte';
	import Missions from './linux/Missions.svelte';
	import { LinuxShell, type Cmd, type ShellEvent } from './linux/shell.svelte';
	import { addDays, dir, file, lookup, mine, myDir, weekday, type FNode } from './linux/fs';

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
	const tx = $derived(text as ShellScriptText);

	// The script editor peeks in on the beat that explains what a script is.
	const SCRIPT_BEAT = 1;
	const live = $derived(beat >= tx.intro.length - 1);
	$effect(() => {
		onshow?.(beat >= SCRIPT_BEAT);
	});
	$effect(() => {
		if (beat === SCRIPT_BEAT || beat === SCRIPT_BEAT + 1) tab = 'nano';
		else if (live && !opened) tab = 'term';
	});

	const HOME = '/home/nim';
	const SCRIPT = `${HOME}/backup.sh`;
	const BACKUPS = `${HOME}/backups`;
	function makeFs(): FNode {
		return dir({
			home: dir({
				nim: myDir({
					'notes.txt': mine([
						'Every night, back up nimbus.com',
						'1. mkdir -p ~/backups',
						'2. tar -czf ~/backups/nimbus-DATE.tar.gz /var/www/nimbus',
						'3. ls ~/backups'
					])
				})
			}),
			tmp: dir({}, { mode: 0o777 }),
			var: dir({
				www: dir({
					nimbus: dir({
						'index.html': file(Array(40).fill('<p>nimbus.com</p>')),
						'style.css': file(Array(60).fill('body { margin: 0 }')),
						uploads: dir({ 'logo.png': file([], { size: 18342 }) })
					})
				})
			})
		});
	}

	// ---- The five lines of the script, and the rules for their order ----
	const L = [
		'#!/bin/bash',
		'DAY=$(date +%F)',
		'mkdir -p ~/backups',
		'tar -czf ~/backups/nimbus-$DAY.tar.gz /var/www/nimbus',
		'echo "Backup $DAY done"'
	];
	const POOL_ORDER = [3, 0, 4, 1, 2];
	let lines = $state<number[]>([]);
	const pool = $derived(POOL_ORDER.filter((i) => !lines.includes(i)));
	/** Returns the first broken rule, or '' when the order works. */
	function problem(ls: number[]): '' | 'shebang' | 'day' | 'mkdir' {
		const at = (i: number) => ls.indexOf(i);
		if (at(0) !== 0) return 'shebang';
		if (at(1) > at(3) || at(1) > at(4)) return 'day';
		if (at(2) > at(3)) return 'mkdir';
		return '';
	}
	const issue = $derived(lines.length === L.length ? problem(lines) : '');
	let savedOk = $state(false);

	// ---- Missions ----
	type MId = 'hand' | 'write' | 'exec' | 'run';
	const ORDER: MId[] = ['hand', 'write', 'exec', 'run'];
	let done = $state<Record<MId, boolean>>({ hand: false, write: false, exec: false, run: false });
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
	const say = (t: string) => {
		onstate?.(t);
		return true;
	};

	let tab = $state<'term' | 'nano'>('term');
	let opened = false;
	let runs = 0;

	function onevent(e: ShellEvent) {
		if (e.type === 'write' && e.cmd === 'tar' && e.path.startsWith(BACKUPS + '/')) {
			if (e.path.endsWith('nimbus-.tar.gz')) return say('emptyDay');
			if (!scriptRunning) {
				if (!complete('hand')) return say('handAgain');
				return true;
			}
			return false;
		}
		if (e.type === 'write' && e.cmd === 'mkdir' && e.path === BACKUPS && !scriptRunning)
			return say('mkdir');
		if (e.type === 'chmod' && e.path === SCRIPT && e.mode & 0o100) {
			if (!complete('exec')) return say('chmod');
			return true;
		}
		if (e.type === 'exec' && e.path === SCRIPT) {
			if (!savedOk) return say('brokenRun');
			runs += 1;
			if (!e.direct) return say('bashRun');
			if (!complete('run')) return say(runs > 1 ? 'again' : 'ran');
			return true;
		}
		if (e.type === 'denied' && e.path === SCRIPT) return say('runDenied');
		return false;
	}

	// Know when a line comes from inside the script rather than from the learner.
	let scriptRunning = false;
	function handler(c: Cmd, sh: LinuxShell): boolean {
		if (c.name === 'nano' || c.name === 'vim' || c.name === 'vi') {
			const t = c.args[0];
			if (!t || sh.abs(t) !== SCRIPT) {
				sh.hint(tx.hintNano);
				return true;
			}
			openEditor();
			return true;
		}
		if ((c.name.includes('/') || c.name === 'bash' || c.name === 'sh') && !c.script) {
			scriptRunning = true;
			try {
				if (c.name.includes('/')) sh.script(c.name, c.sudo, true);
				else if (c.args[0]) sh.script(c.args[0], c.sudo, false);
				else sh.hint(tx.termHint);
			} finally {
				scriptRunning = false;
			}
			return true;
		}
		return false;
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: (t) => onstate?.(t),
		handler,
		onevent,
		commands: ['nano']
	});
	$effect(() => () => shell.destroy());

	// ---- The editor ----
	function openEditor() {
		opened = true;
		tab = 'nano';
	}
	function place(i: number) {
		if (!live) return;
		lines = [...lines, i];
	}
	function unplace(i: number) {
		if (!live) return;
		lines = lines.filter((x) => x !== i);
	}
	function save() {
		if (!live || lines.length !== L.length) return;
		const existing = lookup(shell.fs, SCRIPT);
		const body = lines.map((i) => L[i]);
		if (existing) existing.body = body;
		else shell.put(SCRIPT, mine(body));
		shell.add('muted', `[ Wrote ${body.length} lines ]`);
		const bad = problem(lines);
		savedOk = !bad;
		tab = 'term';
		if (bad) say('order');
		else if (!complete('write')) say('saved');
	}
	/** Help for the editor mission places the next right line, then saves. */
	function helpWrite() {
		if (tab !== 'nano') return openEditor();
		if (lines.length === L.length && !issue) return save();
		const right = [0, 1, 2, 3, 4];
		if (!lines.every((x, i) => x === right[i])) {
			lines = [];
			return;
		}
		place(right[lines.length]);
	}

	// ---- Missions help ----
	const archive = () => `~/backups/nimbus-${shell.date}.tar.gz`;
	const help: Record<MId, () => void> = {
		hand: () =>
			shell.typeFor(
				lookup(shell.fs, BACKUPS) ? `tar -czf ${archive()} /var/www/nimbus` : 'mkdir -p ~/backups'
			),
		write: helpWrite,
		exec: () => {
			tab = 'term';
			shell.typeFor(shell.cwd === HOME ? 'chmod +x backup.sh' : 'chmod +x ~/backup.sh');
		},
		run: () => {
			tab = 'term';
			shell.typeFor(shell.cwd === HOME ? './backup.sh' : '~/backup.sh');
		}
	};
	const items = $derived(
		ORDER.map((m, i) => ({ label: tx.missions[i], done: done[m], help: help[m] }))
	);

	// ---- The backups folder and the calendar ----
	const archives = $derived(
		Object.keys(lookup(shell.fs, BACKUPS)?.kids ?? {})
			.filter((k) => k.endsWith('.tar.gz'))
			.sort()
	);
	const dayLabel = $derived.by(() => {
		return `${tx.days[weekday(shell.date)]} ${Number(shell.date.slice(8))}`;
	});
	function nextDay() {
		if (!live || shell.busy || shell.typing) return;
		shell.date = addDays(shell.date, 1);
		shell.add('muted', tx.nightLine.replace('{day}', dayLabel));
		say(done.run ? 'nextDay' : 'nextDayHand');
	}
	const busy = $derived(!live || shell.typing || shell.busy);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={busy}
	/>

	<div class="shelf">
		<div class="shead">
			<span class="sname">~/backups</span>
			<span class="day">{dayLabel}</span>
			<button type="button" class="next" disabled={busy} onclick={nextDay}>{tx.nextDayBtn}</button>
		</div>
		{#if archives.length}
			<div class="arcs">
				{#each archives as a (a)}<span class="arc" class:bad={a === 'nimbus-.tar.gz'}>{a}</span
					>{/each}
			</div>
		{:else}
			<p class="empty">{tx.emptyShelf}</p>
		{/if}
	</div>

	<div class="tabs" role="tablist">
		<button
			type="button"
			role="tab"
			aria-selected={tab === 'term'}
			class:on={tab === 'term'}
			onclick={() => (tab = 'term')}>{tx.termTab}</button
		>
		<button
			type="button"
			role="tab"
			aria-selected={tab === 'nano'}
			class:on={tab === 'nano'}
			onclick={() => (tab = 'nano')}>nano backup.sh</button
		>
	</div>

	{#if tab === 'term'}
		<LinuxTerminal {shell} {live} inputLabel={tx.inputLabel} short />
	{:else}
		<div class="nano">
			<div class="nbar">
				<span>GNU nano 7.2</span>
				<span>backup.sh</span>
			</div>
			<ol class="file">
				{#each lines as i, n (i)}
					<li>
						<span class="ln">{n + 1}</span>
						<button type="button" class="code" disabled={!live} onclick={() => unplace(i)}
							>{L[i]}</button
						>
					</li>
				{/each}
				{#if !lines.length}<li class="blank">{tx.editorEmpty}</li>{/if}
			</ol>
			{#if issue}<p class="issue">{tx.orderNotes[issue]}</p>{/if}
			<div class="pool">
				<span class="plab">{tx.poolLabel}</span>
				{#each pool as i (i)}
					<button type="button" class="pchip" disabled={!live} onclick={() => place(i)}
						>{L[i]}</button
					>
				{/each}
			</div>
			<div class="nfoot">
				<button
					type="button"
					class="save"
					disabled={!live || lines.length !== L.length}
					onclick={save}>{tx.saveBtn}</button
				>
				<span class="keys">{tx.editorHint}</span>
			</div>
		</div>
	{/if}
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
	.shelf {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 10px;
	}
	.shead {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.sname {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.day {
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.next {
		margin-left: auto;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 11px;
		font-weight: 800;
		padding: 3px 10px;
	}
	.next:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.next:disabled {
		opacity: 0.5;
	}
	.arcs {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		margin-top: 6px;
	}
	.arc {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-grass);
		background: var(--color-grass-soft);
		border-radius: 6px;
		padding: 2px 6px;
	}
	.arc.bad {
		color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.empty {
		margin: 5px 0 0;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.tabs {
		display: flex;
		gap: 4px;
		width: 100%;
		padding: 3px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
	}
	.tabs button {
		flex: 1;
		border: none;
		border-radius: 999px;
		background: transparent;
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 800;
		padding: 5px 8px;
	}
	.tabs button.on {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.nano {
		width: 100%;
		border-radius: 13px;
		overflow: hidden;
		background: #0f2030;
		border: 1px solid #1d3547;
		box-shadow: 0 14px 32px rgba(15, 32, 48, 0.28);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: #d2e2ee;
	}
	.nbar {
		display: flex;
		justify-content: space-between;
		padding: 4px 12px;
		background: #d2e2ee;
		color: #0f2030;
		font-size: 11px;
		font-weight: 700;
	}
	.file {
		list-style: none;
		margin: 0;
		padding: 8px 8px 4px;
		min-height: 110px;
	}
	.file li {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}
	.ln {
		flex: none;
		width: 14px;
		text-align: right;
		font-size: 10.5px;
		color: #4f6a7e;
	}
	.code {
		flex: 1;
		min-width: 0;
		border: 1px solid transparent;
		border-radius: 5px;
		background: transparent;
		color: #eaf1f6;
		font: inherit;
		font-size: 11.5px;
		text-align: left;
		padding: 1px 4px;
		white-space: pre-wrap;
		word-break: break-all;
	}
	.code:hover:not(:disabled) {
		border-color: #ff9d92;
	}
	.blank {
		font-size: 11.5px;
		color: #6b8496;
		font-style: italic;
		padding: 2px 4px;
	}
	.issue {
		margin: 0 12px 6px;
		font-size: 11px;
		color: #e0b65b;
	}
	.pool {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		padding: 8px 10px;
		border-top: 1px solid #1d3547;
		background: #132637;
	}
	.plab {
		width: 100%;
		font-family: var(--font-sans, inherit);
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: #6b8496;
	}
	.pchip {
		max-width: 100%;
		border-radius: 6px;
		border: 1px solid #2a4a62;
		background: #0f2030;
		color: #6fd39a;
		font: inherit;
		font-size: 11px;
		padding: 3px 7px;
		text-align: left;
		word-break: break-all;
	}
	.pchip:hover:not(:disabled) {
		border-color: #6fd39a;
	}
	.nfoot {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 7px 10px;
		border-top: 1px solid #1d3547;
	}
	.save {
		flex: none;
		border-radius: 999px;
		border: none;
		background: #5bbd84;
		color: #0f2030;
		font-family: var(--font-sans, inherit);
		font-size: 11.5px;
		font-weight: 800;
		padding: 4px 12px;
	}
	.save:disabled {
		opacity: 0.4;
	}
	.keys {
		font-size: 10.5px;
		color: #6b8496;
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
	}
</style>
