<script lang="ts">
	// A guided terminal lab. Nim narrates, and the terminal types pwd, ls, cd and cat by itself
	// while a folder tree follows along (a pin marks where you stand, listed folders light up, the
	// opened file glows). On the last beat the learner types one command, cd ~, to fly home.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { LinuxFilesText } from '$lib/chapters/linux/linux-files/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type ShellEvent } from './linux/shell.svelte';
	import { dir, file, mine, myDir, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as LinuxFilesText);

	// What the terminal types on each beat. Earlier beats are replayed at once.
	const SCRIPT: string[][] = [
		[],
		[],
		['pwd'],
		['ls /'],
		['cd /var/log/nimbus'],
		['ls', 'cat error.log'],
		[],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = 'cd ~';

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	const exe = (name: string) => file([`(${name} program)`], { mode: 0o755, size: 142312 });
	function makeFs(): FNode {
		return dir({
			bin: dir({ bash: exe('bash'), cat: exe('cat'), ls: exe('ls') }),
			etc: dir({
				hostname: file(['nimbus']),
				'os-release': file(['PRETTY_NAME="Ubuntu 24.04.1 LTS"', 'NAME="Ubuntu"'])
			}),
			home: dir({
				nim: myDir({
					'notes.txt': mine(['nimbus.com went down last night, find out why.'])
				})
			}),
			root: dir({ '.bashrc': file(['# root only']) }, { mode: 0o700 }),
			tmp: dir({}, { mode: 0o777 }),
			usr: dir({ bin: dir({ python3: exe('python3') }) }),
			var: dir({
				log: dir({
					nimbus: dir({
						'access.log': file(['203.0.113.7 GET / 200', '198.51.100.4 GET /pricing 200']),
						'error.log': file([
							'[2026-11-02 23:58:12] INFO  nimbus.com started',
							'[2026-11-03 02:14:40] WARN  disk 92% full',
							'[2026-11-03 03:07:51] ERROR No space left on device',
							'[2026-11-03 03:07:51] ERROR nimbus.com stopped'
						])
					})
				})
			})
		});
	}

	// What the tree remembers from the commands so far.
	let listed = $state<string | null>(null);
	let opened = $state<string | null>(null);
	let quiet = false;
	const say = (t: string) => {
		if (!quiet && live) onstate?.(t);
	};

	function onevent(e: ShellEvent) {
		if (e.type === 'ls') {
			listed = e.path;
			say('looked');
			return true;
		}
		if (e.type === 'read') {
			opened = e.path;
			say('read');
			return true;
		}
		if (e.type === 'pwd') {
			say('pwd');
			return true;
		}
		if (e.type === 'cd') {
			say(e.path === '/home/nim' ? 'home' : 'moved');
			return true;
		}
		if (e.type === 'denied' && e.path === '/root') {
			say('rootHome');
			return true;
		}
		return false;
	}

	const shell = new LinuxShell({ fs: makeFs(), text: () => tx, react: say, onevent });
	shell.speed = 55;

	function direct(sc: number) {
		listed = null;
		opened = null;
		shell.reset(makeFs());
		quiet = true;
		shell.quick(SCRIPT.slice(0, sc).flat());
		quiet = false;
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

	// ---- The tree, drawn with fixed spots ----
	type Spot = { path: string; name: string; x: number; y: number; kind: 'dir' | 'file' };
	const SPOTS: Spot[] = [
		{ path: '/', name: '/', x: 180, y: 26, kind: 'dir' },
		{ path: '/bin', name: 'bin', x: 34, y: 88, kind: 'dir' },
		{ path: '/etc', name: 'etc', x: 92, y: 88, kind: 'dir' },
		{ path: '/home', name: 'home', x: 150, y: 88, kind: 'dir' },
		{ path: '/root', name: 'root', x: 208, y: 88, kind: 'dir' },
		{ path: '/usr', name: 'usr', x: 266, y: 88, kind: 'dir' },
		{ path: '/var', name: 'var', x: 324, y: 88, kind: 'dir' },
		{ path: '/home/nim', name: 'nim', x: 150, y: 146, kind: 'dir' },
		{ path: '/home/nim/notes.txt', name: 'notes.txt', x: 150, y: 202, kind: 'file' },
		{ path: '/var/log', name: 'log', x: 324, y: 146, kind: 'dir' },
		{ path: '/var/log/nimbus', name: 'nimbus', x: 324, y: 202, kind: 'dir' },
		{ path: '/var/log/nimbus/error.log', name: 'error.log', x: 324, y: 258, kind: 'file' }
	];
	const parentOf = (p: string) => (p.lastIndexOf('/') <= 0 ? '/' : p.slice(0, p.lastIndexOf('/')));
	const byPath = new Map(SPOTS.map((s) => [s.path, s]));

	/** The deepest drawn folder on the way to where you stand. */
	const here = $derived.by(() => {
		let p = shell.cwd;
		while (!byPath.has(p)) p = parentOf(p);
		return byPath.get(p)!;
	});
	const onRoute = (p: string) => p === '/' || here.path === p || here.path.startsWith(p + '/');
	const isListed = (s: Spot) => listed !== null && s.path !== '/' && parentOf(s.path) === listed;

	function edge(s: Spot) {
		const p = byPath.get(parentOf(s.path))!;
		const mid = (p.y + s.y) / 2;
		return `M${p.x} ${p.y + 12} V${mid} H${s.x} V${s.y - 13}`;
	}
</script>

{#snippet tree(i: number)}
	<svg viewBox="0 0 360 290" class="tree" aria-hidden="true">
		{#each SPOTS.slice(1) as s (s.path)}
			<path d={edge(s)} class="edge" class:route={onRoute(s.path) && s.kind === 'dir'} />
		{/each}
		{#each SPOTS as s (s.path)}
			<g
				class="node {s.kind}"
				class:route={s.kind === 'dir' && onRoute(s.path)}
				class:top={i === 1 && s.path === '/'}
				class:lit={isListed(s)}
				class:open={opened === s.path}
				transform="translate({s.x} {s.y})"
			>
				{#if s.kind === 'dir'}
					<path d="M-15 -10 H-5 L-2 -6 H15 V11 H-15 Z" class="shape" />
				{:else}
					<path d="M-10 -12 H5 L10 -7 V12 H-10 Z" class="shape" />
					<path d="M-5 -2 H5 M-5 3 H5 M-5 8 H2" class="lines" />
				{/if}
				<text y="25">{s.name}</text>
			</g>
		{/each}
		<g class="pin" style="transform: translate({here.x}px, {here.y - 22}px)">
			<path d="M0 0 C-7 -8 -9 -12 -9 -16 A9 9 0 0 1 9 -16 C9 -12 7 -8 0 0 Z" />
			<circle cy="-16" r="3.4" class="pin-dot" />
		</g>
	</svg>
	<div class="where">
		<span class="here">{tx.hereLabel}</span>
		<code>{shell.cwd}</code>
	</div>
	{#if i === 6}
		<div class="cheats" in:fade={{ duration: 300 }}>
			{#each tx.cheats as c (c.cmd)}
				<span><code>{c.cmd}</code>{c.means}</span>
			{/each}
		</div>
	{/if}
{/snippet}

<GuidedLab
	{tx}
	{shell}
	active={scene}
	{live}
	tryCmd={TRY}
	onselect={(i) => (peek = i)}
	art={tree}
/>

<style>
	.tree {
		display: block;
		width: 100%;
		height: auto;
		max-height: 34vh;
	}
	.edge {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.6;
		transition: stroke 0.5s;
	}
	.edge.route {
		stroke: var(--color-brand);
	}
	.node .shape {
		fill: var(--color-paper);
		stroke: var(--color-faint);
		stroke-width: 1.5;
		stroke-linejoin: round;
		transition:
			fill 0.5s,
			stroke 0.5s;
	}
	.node .lines {
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.node text {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 600;
		text-anchor: middle;
	}
	.node.route .shape {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.node.route text {
		fill: var(--color-ink);
	}
	.node.top .shape {
		fill: var(--color-brand);
	}
	.node.lit .shape {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		animation: glow 1.6s ease-in-out 2;
	}
	.node.open .shape {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.node.open .lines {
		stroke: var(--color-amber);
	}
	@keyframes glow {
		50% {
			stroke-width: 3;
		}
	}
	.pin {
		transition: transform 0.9s cubic-bezier(0.3, 0.7, 0.3, 1);
	}
	.pin path {
		fill: var(--color-brand);
	}
	.pin-dot {
		fill: var(--color-card);
	}
	.where {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 2px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.here {
		font-weight: 700;
	}
	.where code,
	.cheats code {
		border-radius: 6px;
		background: var(--color-paper);
		padding: 1px 7px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-weight: 700;
		color: var(--color-ink);
	}
	.cheats {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px 12px;
		margin-top: 8px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-grass);
	}
	.cheats span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	@media (prefers-reduced-motion: reduce) {
		.pin,
		.edge,
		.node .shape {
			transition: none;
		}
		.node.lit .shape {
			animation: none;
		}
	}
</style>
