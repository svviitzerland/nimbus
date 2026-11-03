<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { LinuxFilesText } from '$lib/chapters/linux/linux-files/types';
	import LinuxTerminal from './linux/LinuxTerminal.svelte';
	import Missions from './linux/Missions.svelte';
	import { LinuxShell, type ShellEvent } from './linux/shell.svelte';
	import { dir, file, lookup, mine, myDir, type FNode } from './linux/fs';

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
	const tx = $derived(text as LinuxFilesText);

	// The tree shows from the second beat on, and lights up the branches each beat talks about.
	const TRUNK_BEAT = 1;
	const BRANCH_BEAT = 2;
	const live = $derived(beat >= tx.intro.length - 1);
	$effect(() => {
		onshow?.(beat >= TRUNK_BEAT);
	});
	const focus = $derived(
		beat === TRUNK_BEAT ? ['/'] : beat === BRANCH_BEAT ? ['/home', '/etc', '/var'] : []
	);

	// ---- The server's file system ----
	const exe = (name: string) => file([`(${name} program)`], { mode: 0o755, size: 142312 });
	function makeFs(): FNode {
		return dir({
			bin: dir({ bash: exe('bash'), cat: exe('cat'), ls: exe('ls') }),
			etc: dir({
				hostname: file(['nimbus']),
				'os-release': file([
					'PRETTY_NAME="Ubuntu 24.04.1 LTS"',
					'NAME="Ubuntu"',
					'VERSION_ID="24.04"'
				]),
				passwd: file([
					'root:x:0:0:root:/root:/bin/bash',
					'nim:x:1000:1000:Nim:/home/nim:/bin/bash'
				]),
				shadow: file(['root:*:20000:0:99999:7:::'], { mode: 0o640, group: 'shadow' })
			}),
			home: dir({
				nim: myDir({
					'notes.txt': mine([
						'nimbus.com went down last night, find out why.',
						'Sam says servers keep a diary in /var/log'
					])
				})
			}),
			root: dir({ '.bashrc': file(['# root only']) }, { mode: 0o700 }),
			tmp: dir({}, { mode: 0o777 }),
			usr: dir({ bin: dir({ node: exe('node'), python3: exe('python3') }) }),
			var: dir({
				log: dir({
					syslog: file(['Nov  3 03:07:51 nimbus kernel, disk full'], {
						owner: 'syslog',
						group: 'adm',
						mode: 0o640
					}),
					nimbus: dir({
						'access.log': file([
							'203.0.113.7 GET / 200',
							'198.51.100.4 GET /pricing 200',
							'203.0.113.9 POST /upload 200'
						]),
						'error.log': file([
							'[2026-11-02 23:58:12] INFO  nimbus.com started on port 80',
							'[2026-11-03 02:14:40] WARN  disk 92% full',
							'[2026-11-03 03:02:09] WARN  disk 99% full',
							'[2026-11-03 03:07:51] ERROR cannot save upload, No space left on device',
							'[2026-11-03 03:07:51] ERROR nimbus.com stopped'
						])
					})
				}),
				www: dir({ nimbus: dir({ 'index.html': file(['<h1>nimbus.com</h1>']) }) })
			})
		});
	}

	// ---- Missions ----
	type MId = 'pwd' | 'root' | 'varlog' | 'read';
	const ORDER: MId[] = ['pwd', 'root', 'varlog', 'read'];
	const TOKEN: Record<MId, string> = { pwd: 'pwd', root: 'root', varlog: 'varlog', read: 'found' };
	const LOG = '/var/log/nimbus';
	let done = $state<Record<MId, boolean>>({ pwd: false, root: false, varlog: false, read: false });
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
		} else onstate?.(TOKEN[m]);
		return true;
	}

	let visited = $state<string[]>(['/home/nim']);
	const seen: string[] = [];
	function once(token: string) {
		if (seen.includes(token)) return false;
		seen.push(token);
		onstate?.(token);
		return true;
	}

	function onevent(e: ShellEvent) {
		if (e.type === 'pwd') return complete('pwd');
		if (e.type === 'ls' && e.path === '/') return complete('root');
		if (e.type === 'cd') {
			if (!visited.includes(e.path)) visited = [...visited, e.path];
			if (e.path === LOG) return complete('varlog');
			if (e.path === '/etc') return once('etc');
			return false;
		}
		if (e.type === 'read') {
			if (e.path === `${LOG}/error.log`) return complete('read');
			if (e.path === `${LOG}/access.log`) return once('access');
			if (e.path === '/home/nim/notes.txt') return once('notes');
			if (e.path === '/etc/hostname') return once('hostname');
			return false;
		}
		if (e.type === 'denied' && e.path === '/root') {
			onstate?.('rootHome');
			return true;
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

	const help: Record<MId, () => string> = {
		pwd: () => 'pwd',
		root: () => (shell.cwd === '/' ? 'ls' : 'ls /'),
		varlog: () => `cd ${LOG}`,
		read: () => (shell.cwd === LOG ? 'cat error.log' : `cat ${LOG}/error.log`)
	};
	const items = $derived(
		ORDER.map((m, i) => ({
			label: tx.missions[i],
			done: done[m],
			help: () => shell.typeFor(help[m]())
		}))
	);

	// ---- The tree, always open along the path you are standing on ----
	type Row = { path: string; name: string; depth: number; kind: 'dir' | 'file'; note?: string };
	const rows = $derived.by(() => {
		const out: Row[] = [{ path: '/', name: '/', depth: 0, kind: 'dir' }];
		const cwd = shell.cwd;
		const walk = (abs: string, n: FNode, depth: number) => {
			const kids = Object.keys(n.kids ?? {}).sort();
			for (const k of kids) {
				const kid = n.kids![k];
				const p = abs === '/' ? `/${k}` : `${abs}/${k}`;
				if (k.startsWith('.')) continue;
				if (kid.kind === 'file') continue;
				out.push({ path: p, name: k, depth, kind: 'dir', note: depth === 1 ? tx.dirNotes[k] : '' });
				if (cwd === p || cwd.startsWith(p + '/')) walk(p, kid, depth + 1);
			}
			if (abs === cwd)
				for (const k of kids)
					if (n.kids![k].kind === 'file' && !k.startsWith('.'))
						out.push({ path: abs === '/' ? `/${k}` : `${abs}/${k}`, name: k, depth, kind: 'file' });
		};
		walk('/', shell.fs, 1);
		return out;
	});

	function tap(r: Row) {
		if (!live || shell.typing || shell.busy) return;
		if (r.kind === 'dir') shell.typeFor(`cd ${r.path}`);
		else shell.typeFor(`cat ${r.name}`);
	}
	const canRead = (p: string) => {
		const n = lookup(shell.fs, p);
		return !!n && (n.mode & 0o004) !== 0;
	};
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={!live || shell.typing || shell.busy}
	/>

	<div class="tree" aria-label={tx.treeLabel}>
		<div class="thead">
			<span>{tx.treeLabel}</span>
			<span class="where">{shell.cwd}</span>
		</div>
		<ul>
			{#each rows as r (r.path)}
				{@const here = r.path === shell.cwd}
				<li style="--d:{r.depth}">
					<button
						type="button"
						class="row"
						class:here
						class:file={r.kind === 'file'}
						class:seen={visited.includes(r.path)}
						class:focus={focus.includes(r.path)}
						class:locked={r.kind === 'dir' && !canRead(r.path)}
						disabled={!live}
						onclick={() => tap(r)}
					>
						{#if r.kind === 'dir'}
							<svg viewBox="0 0 20 16" aria-hidden="true" class="ico"
								><path
									d="M1 3.5A1.5 1.5 0 0 1 2.5 2h4.2l1.6 1.6h8.2A1.5 1.5 0 0 1 18 5.1v8.4A1.5 1.5 0 0 1 16.5 15h-14A1.5 1.5 0 0 1 1 13.5z"
								/></svg
							>
						{:else}
							<svg viewBox="0 0 16 18" aria-hidden="true" class="ico doc"
								><path d="M3 1h7l4 4v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" /></svg
							>
						{/if}
						<span class="name">{r.name}</span>
						{#if r.note}<span class="note">{r.note}</span>{/if}
						{#if here}<span class="pin">{tx.hereLabel}</span>{/if}
					</button>
				</li>
			{/each}
		</ul>
	</div>

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
	.tree {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 8px 6px;
	}
	.thead {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
		padding: 0 4px 4px;
	}
	.where {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-transform: none;
		letter-spacing: 0;
		color: var(--color-brand);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		padding-left: calc(var(--d) * 14px);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 7px;
		width: 100%;
		min-height: 24px;
		border: 1px solid transparent;
		border-radius: 7px;
		background: transparent;
		padding: 1px 6px;
		text-align: left;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 12px;
		color: var(--color-ink);
		transition:
			background 0.2s ease,
			border-color 0.2s ease;
	}
	.row:hover:not(:disabled) {
		background: var(--color-brand-soft);
	}
	.row:disabled {
		cursor: default;
	}
	.ico {
		flex: none;
		width: 15px;
		height: 13px;
		fill: #f5c14e;
		stroke: #dca12f;
		stroke-width: 1;
	}
	.ico.doc {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.locked .ico {
		fill: var(--color-line);
		stroke: var(--color-faint);
	}
	.name {
		font-weight: 700;
	}
	.file .name {
		font-weight: 500;
		color: var(--color-muted);
	}
	.seen:not(.here) .name {
		color: var(--color-brand);
	}
	.note {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: var(--font-sans, inherit);
		font-size: 11px;
		color: var(--color-faint);
	}
	.pin {
		margin-left: auto;
		flex: none;
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		font-family: var(--font-sans, inherit);
		font-size: 10px;
		font-weight: 800;
		padding: 1px 8px;
	}
	.here {
		background: var(--color-grass-soft);
		border-color: var(--color-grass);
	}
	.focus {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		animation: glow 1.6s ease-in-out infinite;
	}
	@keyframes glow {
		50% {
			border-color: transparent;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.focus {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
	}
</style>
