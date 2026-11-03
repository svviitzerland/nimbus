<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { PackagesText } from '$lib/chapters/linux/packages/types';
	import Server from '$lib/components/Server.svelte';
	import LinuxTerminal from './linux/LinuxTerminal.svelte';
	import Missions from './linux/Missions.svelte';
	import { LinuxShell, type Cmd, type Ln } from './linux/shell.svelte';
	import { closest, dir, file, myDir, mine, type FNode } from './linux/fs';

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
	const tx = $derived(text as PackagesText);

	// The store and the server show from the beat that introduces packages.
	const STORE_BEAT = 1;
	const live = $derived(beat >= tx.intro.length - 1);
	$effect(() => {
		onshow?.(beat >= STORE_BEAT);
	});

	// ---- The Ubuntu package store ----
	type Pkg = { name: string; ver: string; deps: string[]; kb: number; about: string };
	const STORE: Pkg[] = [
		{
			name: 'nginx',
			ver: '1.24.0-2ubuntu7',
			deps: ['nginx-common'],
			kb: 552,
			about: 'small, powerful, scalable web/proxy server'
		},
		{
			name: 'git',
			ver: '1:2.43.0-1ubuntu7',
			deps: ['git-man', 'liberror-perl'],
			kb: 4806,
			about: 'fast, scalable, distributed revision control system'
		},
		{
			name: 'htop',
			ver: '3.3.0-4build1',
			deps: [],
			kb: 171,
			about: 'interactive processes viewer'
		},
		{
			name: 'curl',
			ver: '8.5.0-2ubuntu10',
			deps: [],
			kb: 227,
			about: 'command line tool for transferring data with URL syntax'
		},
		{
			name: 'python3',
			ver: '3.12.3-0ubuntu2',
			deps: [],
			kb: 23,
			about: 'interactive high level object oriented language'
		}
	];
	const byName = (n: string) => STORE.find((p) => p.name === n);
	let installed = $state<string[]>(['curl', 'python3']);
	let flying = $state('');
	let refreshed = $state(false);
	const hasNginx = $derived(installed.includes('nginx'));

	function makeFs(): FNode {
		return dir({
			etc: dir({ hostname: file(['nimbus']) }),
			home: dir({ nim: myDir({ 'notes.txt': mine(['Install a web server for nimbus.com']) }) }),
			tmp: dir({}, { mode: 0o777 }),
			usr: dir({
				bin: dir({ curl: file([], { mode: 0o755 }), python3: file([], { mode: 0o755 }) })
			}),
			var: dir({ log: dir({}) })
		});
	}

	// ---- Missions ----
	type MId = 'updated' | 'installed' | 'version' | 'opened';
	const ORDER: MId[] = ['updated', 'installed', 'version', 'opened'];
	let done = $state<Record<MId, boolean>>({
		updated: false,
		installed: false,
		version: false,
		opened: false
	});
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

	// ---- apt and friends ----
	const line = (text: string, tone: Ln['tone'] = 'out'): Ln => ({ tone, text });
	function needRoot(sh: LinuxShell, lock: string) {
		sh.err(`E: Could not open lock file ${lock} - open (13: Permission denied)`);
		sh.err(
			lock.includes('dpkg')
				? 'E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), are you root?'
				: 'E: Unable to lock directory /var/lib/apt/lists/'
		);
		sh.hint(tx.hintSudo);
		onstate?.('needSudo');
	}
	function notInstalled(sh: LinuxShell, name: string) {
		sh.out(`Command '${name}' not found, but can be installed with:`);
		sh.out(`sudo apt install ${name}`);
		onstate?.('notInstalled');
	}

	function apt(c: Cmd, sh: LinuxShell) {
		const [sub, ...rest] = c.args;
		const names = rest.filter((a) => !a.startsWith('-'));
		const yes = rest.some((a) => a === '-y' || a === '--yes');
		if (!sub) {
			sh.out('apt 2.7.14 (amd64)');
			sh.out('Usage: apt [options] command');
			sh.hint(tx.hintApt);
			return;
		}
		if (sub === 'update') {
			if (!c.sudo) return needRoot(sh, '/var/lib/apt/lists/lock');
			refreshed = false;
			sh.play(
				[
					line('Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease'),
					300,
					line('Get:2 http://archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]'),
					300,
					line('Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]'),
					400,
					line('Fetched 252 kB in 1s (310 kB/s)'),
					line('Reading package lists... Done'),
					line('Building dependency tree... Done'),
					line('All packages are up to date.', 'ok')
				],
				() => {
					refreshed = true;
					complete('updated');
				}
			);
			return;
		}
		if (sub === 'upgrade') {
			if (!c.sudo) return needRoot(sh, '/var/lib/dpkg/lock-frontend');
			sh.out('Reading package lists... Done');
			sh.out('Calculating upgrade... Done');
			sh.out('0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.');
			onstate?.('upgrade');
			return;
		}
		if (sub === 'search') {
			const q = names[0] ?? '';
			sh.out('Sorting... Done');
			sh.out('Full Text Search... Done');
			for (const p of STORE.filter((p) => p.name.includes(q) || p.about.includes(q))) {
				sh.segs([{ text: p.name, tone: 'ok' }, { text: `/noble ${p.ver} amd64` }]);
				sh.out(`  ${p.about}`);
			}
			return;
		}
		if (sub === 'list') {
			sh.out('Listing... Done');
			for (const n of installed)
				sh.segs([
					{ text: n, tone: 'ok' },
					{ text: `/noble,now ${byName(n)?.ver} amd64 [installed]` }
				]);
			return;
		}
		if (sub === 'install' || sub === 'remove' || sub === 'purge') {
			if (!c.sudo) return needRoot(sh, '/var/lib/dpkg/lock-frontend');
			if (!names.length) {
				sh.err(`E: No packages found`);
				sh.hint(tx.hintApt);
				onstate?.('error');
				return;
			}
			const name = names[0].toLowerCase();
			const pkg = byName(name);
			if (!pkg) {
				sh.out('Reading package lists... Done');
				sh.err(`E: Unable to locate package ${names[0]}`);
				const near = closest(
					STORE.map((p) => p.name),
					name
				);
				sh.hint(near ? tx.didYouMean.replace('{word}', near) : tx.hintApt);
				onstate?.('noPackage');
				return;
			}
			return sub === 'install' ? install(sh, pkg, yes) : uninstall(sh, pkg);
		}
		sh.err(`E: Invalid operation ${sub}`);
		sh.hint(tx.hintApt);
		onstate?.('error');
	}

	function install(sh: LinuxShell, pkg: Pkg, yes: boolean) {
		sh.out('Reading package lists... Done');
		sh.out('Building dependency tree... Done');
		if (installed.includes(pkg.name)) {
			sh.out(`${pkg.name} is already the newest version (${pkg.ver}).`);
			sh.out('0 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.');
			onstate?.('already');
			return;
		}
		const all = [pkg.name, ...pkg.deps];
		sh.out('The following NEW packages will be installed:');
		sh.out(`  ${all.join(' ')}`);
		sh.out(`0 upgraded, ${all.length} newly installed, 0 to remove and 0 not upgraded.`);
		sh.out(`Need to get ${pkg.kb} kB of archives.`);
		sh.out(
			`After this operation, ${(pkg.kb * 3).toLocaleString('en')} kB of additional disk space will be used.`
		);
		const go = () => {
			flying = pkg.name;
			sh.play(
				[
					...all.map((n, i) =>
						line(`Get:${i + 1} http://archive.ubuntu.com/ubuntu noble/main amd64 ${n} ${pkg.ver}`)
					),
					600,
					line(`Fetched ${pkg.kb} kB in 1s (${pkg.kb * 2} kB/s)`),
					...all.map((n) => line(`Unpacking ${n} (${pkg.ver}) ...`)),
					500,
					...all.map((n) => line(`Setting up ${n} (${pkg.ver}) ...`)),
					...(pkg.name === 'nginx'
						? [
								line(
									'Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /usr/lib/systemd/system/nginx.service.'
								)
							]
						: []),
					300,
					line('Processing triggers for man-db (2.12.0-4build2) ...')
				],
				() => {
					flying = '';
					installed = [...installed, pkg.name];
					sh.put(`/usr/bin/${pkg.name}`, file([], { mode: 0o755 }));
					if (pkg.name === 'nginx') {
						sh.put(
							'/etc/nginx',
							dir({ 'nginx.conf': file(['user www-data;', 'worker_processes auto;']) })
						);
						sh.put(
							'/var/www',
							dir({
								html: dir({ 'index.nginx-debian.html': file(['<h1>Welcome to nginx!</h1>']) })
							})
						);
						complete('installed');
					} else onstate?.('other');
				}
			);
		};
		if (yes) return go();
		sh.ask('Do you want to continue? [Y/n]', (ok) => {
			if (ok) go();
			else {
				sh.out('Abort.');
				onstate?.('abort');
			}
		});
	}

	function uninstall(sh: LinuxShell, pkg: Pkg) {
		sh.out('Reading package lists... Done');
		if (!installed.includes(pkg.name)) {
			sh.out(`Package '${pkg.name}' is not installed, so not removed`);
			return;
		}
		sh.play(
			[
				line(`Removing ${pkg.name} (${pkg.ver}) ...`),
				400,
				line('Processing triggers for man-db (2.12.0-4build2) ...')
			],
			() => {
				installed = installed.filter((n) => n !== pkg.name);
				sh.remove(`/usr/bin/${pkg.name}`);
				onstate?.(pkg.name === 'nginx' ? 'removed' : 'removedOther');
			}
		);
	}

	const VERSION: Record<string, string> = {
		nginx: 'nginx version: nginx/1.24.0 (Ubuntu)',
		git: 'git version 2.43.0',
		htop: 'htop 3.3.0',
		curl: 'curl 8.5.0 (x86_64-pc-linux-gnu)',
		python3: 'Python 3.12.3'
	};

	function handler(c: Cmd, sh: LinuxShell): boolean {
		if (c.name === 'apt' || c.name === 'apt-get') {
			apt(c, sh);
			return true;
		}
		const pkg = byName(c.name);
		if (pkg) {
			if (!installed.includes(pkg.name)) {
				notInstalled(sh, pkg.name);
				return true;
			}
			if (pkg.name === 'curl') return curl(c, sh);
			if (c.args.some((a) => /^-(v|V|-version)$/.test(a))) {
				sh.out(VERSION[pkg.name]);
				if (pkg.name === 'nginx') complete('version');
				return true;
			}
			if (pkg.name === 'htop') {
				sh.pre('  CPU[||||        12.0%]   Tasks: 31, 1 running');
				sh.pre('  Mem[||||||   412M/1.95G]   Load average: 0.08');
				return true;
			}
			if (pkg.name === 'python3') {
				sh.out('Python 3.12.3 (main) on linux');
				return true;
			}
			sh.hint(tx.hintVersion.replace('{name}', pkg.name));
			return true;
		}
		return false;
	}

	function curl(c: Cmd, sh: LinuxShell) {
		const url = c.args.find((a) => !a.startsWith('-')) ?? '';
		if (!/^(https?:\/\/)?(localhost|127\.0\.0\.1|nimbus\.com)\/?$/.test(url)) {
			sh.err(
				url
					? `curl: (6) Could not resolve host: ${url}`
					: "curl: try 'curl --help' for more information"
			);
			sh.hint(tx.hintCurl);
			return true;
		}
		if (!hasNginx) {
			sh.err(
				`curl: (7) Failed to connect to ${url.replace(/^https?:\/\//, '').replace(/\/$/, '')} port 80 after 0 ms: Couldn't connect to server`
			);
			onstate?.('offline');
			return true;
		}
		for (const l of [
			'<!DOCTYPE html>',
			'<html>',
			'<head><title>Welcome to nginx!</title></head>',
			'<body>',
			'<h1>Welcome to nginx!</h1>',
			'<p>If you see this page, the nginx web server is successfully installed and working.</p>',
			'</body>',
			'</html>'
		])
			sh.out(l);
		view = 'page';
		complete('opened');
		return true;
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: (t) => onstate?.(t),
		handler,
		commands: ['apt', 'apt-get', 'nginx', 'git', 'htop', 'curl', 'python3']
	});
	$effect(() => () => shell.destroy());

	const help: Record<MId, () => string> = {
		updated: () => 'sudo apt update',
		installed: () => 'sudo apt install nginx',
		version: () => 'nginx -v',
		opened: () => 'curl localhost'
	};
	const items = $derived(
		ORDER.map((m, i) => ({
			label: tx.missions[i],
			done: done[m],
			help: () => (m === 'opened' ? openSite() : shell.typeFor(shell.pending ? 'Y' : help[m]()))
		}))
	);

	// ---- The browser on your laptop ----
	let view = $state<'idle' | 'loading' | 'offline' | 'page'>('idle');
	function openSite() {
		if (!live || view === 'loading') return;
		view = 'loading';
		shell.after(500, () => {
			if (hasNginx) {
				view = 'page';
				complete('opened');
			} else {
				view = 'offline';
				onstate?.('offline');
			}
		});
	}
	$effect(() => {
		if (!hasNginx && view === 'page') view = 'offline';
	});
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={!live || shell.typing || shell.busy}
	/>

	<div class="scene">
		<div class="store" class:fresh={refreshed}>
			<div class="lab">{tx.storeLabel}</div>
			<div class="sub">archive.ubuntu.com</div>
			<div class="tiles">
				{#each STORE as p (p.name)}
					<span
						class="tile"
						class:have={installed.includes(p.name)}
						class:fly={flying === p.name}
						class:star={p.name === 'nginx' && !installed.includes('nginx')}>{p.name}</span
					>
				{/each}
			</div>
		</div>
		<div class="pipe" class:busy={!!flying} aria-hidden="true">
			<span class="box"></span>
		</div>
		<div class="srv">
			<Server slots={3} active={hasNginx} />
			<div class="lab">{tx.serverLabel}</div>
			<div class="have-list">
				{#each installed as n (n)}<span class:new={n === 'nginx'}>{n}</span>{/each}
			</div>
		</div>
	</div>

	<div class="browser">
		<div class="bbar">
			<span class="dots"><i></i><i></i><i></i></span>
			<span class="url">nimbus.com</span>
			<button type="button" class="open" disabled={!live || view === 'loading'} onclick={openSite}
				>{view === 'idle' ? tx.openBtn : tx.reloadBtn}</button
			>
		</div>
		<div class="bbody">
			{#if view === 'page'}
				<div class="ngx">
					<h3>Welcome to nginx!</h3>
					<p>If you see this page, the nginx web server is successfully installed and working.</p>
				</div>
			{:else if view === 'offline'}
				<p class="off"><b>{tx.offlineTitle}</b><br />{tx.offlineSub}</p>
			{:else if view === 'loading'}
				<span class="spin" aria-hidden="true"></span>
			{:else}
				<p class="idle">{tx.browserIdle}</p>
			{/if}
		</div>
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
	.scene {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 40px auto;
		align-items: center;
		gap: 6px;
		width: 100%;
	}
	.store {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 9px;
		transition: border-color 0.4s ease;
	}
	.store.fresh {
		border-color: var(--color-grass);
	}
	.lab {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.sub {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		color: var(--color-faint);
		margin-bottom: 6px;
	}
	.tiles {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.tile {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
		border-radius: 6px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-muted);
		padding: 2px 6px;
	}
	.tile.have {
		color: var(--color-faint);
		opacity: 0.6;
	}
	.tile.star {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.tile.fly {
		background: var(--color-brand);
		color: #fff;
	}
	.pipe {
		position: relative;
		height: 4px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.pipe .box {
		position: absolute;
		top: -5px;
		left: 0;
		width: 14px;
		height: 14px;
		border-radius: 3px;
		background: var(--color-brand);
		opacity: 0;
	}
	.pipe.busy .box {
		animation: ship 0.9s ease-in-out infinite;
	}
	@keyframes ship {
		0% {
			left: 0;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 14px);
			opacity: 0;
		}
	}
	.srv {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		width: 104px;
	}
	.srv :global(.server) {
		width: 70px;
		padding: 7px;
		gap: 5px;
	}
	.srv :global(.slot) {
		height: 12px;
	}
	.have-list {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 3px;
	}
	.have-list span {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.have-list span.new {
		color: var(--color-grass);
	}
	.browser {
		width: 100%;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		overflow: hidden;
	}
	.bbar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
	}
	.dots {
		display: inline-flex;
		gap: 4px;
	}
	.dots i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.url {
		flex: 1;
		min-width: 0;
		border-radius: 999px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		font-size: 11px;
		color: var(--color-muted);
		padding: 2px 10px;
	}
	.open {
		flex: none;
		border-radius: 999px;
		border: none;
		background: var(--color-brand);
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		padding: 4px 11px;
	}
	.open:disabled {
		opacity: 0.5;
	}
	.bbody {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 74px;
		padding: 8px 12px;
		text-align: center;
	}
	.ngx {
		text-align: left;
		font-family: Tahoma, Verdana, Arial, sans-serif;
		color: #111;
		background: #fff;
		border-radius: 6px;
		padding: 6px 10px;
		width: 100%;
	}
	.ngx h3 {
		margin: 0 0 3px;
		font-size: 15px;
	}
	.ngx p {
		margin: 0;
		font-size: 11px;
	}
	.off {
		margin: 0;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.off b {
		color: var(--color-ink);
	}
	.idle {
		margin: 0;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	.spin {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 3px solid var(--color-line);
		border-top-color: var(--color-brand);
		animation: spin 0.8s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pipe.busy .box,
		.spin {
			animation: none;
		}
		.pipe.busy .box {
			opacity: 1;
			left: calc(50% - 7px);
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
	}
</style>
