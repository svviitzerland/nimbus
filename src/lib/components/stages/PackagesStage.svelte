<script lang="ts">
	// A guided terminal lab. On the left a package shop (the Ubuntu archive), on the right the
	// nimbus.com server. Nim narrates while the terminal types apt update (a fresh list flies
	// over), apt install nginx (a box travels across and lands in the rack), a failing install
	// without sudo, and nginx -v. On the last beat the learner types sudo apt install htop.
	import { untrack } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { PackagesText } from '$lib/chapters/linux/packages/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type Cmd, type Ln } from './linux/shell.svelte';
	import { dir, myDir, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as PackagesText);

	const SCRIPT: string[][] = [
		[],
		[],
		['sudo apt update'],
		['sudo apt install nginx'],
		['apt install htop'],
		['nginx -v'],
		[],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = 'sudo apt install htop';

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	// The shop's shelves. Each package, its version, and what it brings along.
	type Pkg = { ver: string; deps: string[]; size: string };
	const SHOP: Record<string, Pkg> = {
		nginx: { ver: '1.24.0-2ubuntu7', deps: ['nginx-common'], size: '552 kB' },
		htop: { ver: '3.3.0-4build1', deps: [], size: '171 kB' },
		git: { ver: '1:2.43.0-1ubuntu7', deps: ['git-man'], size: '4,780 kB' },
		tree: { ver: '2.1.1-2ubuntu3', deps: [], size: '47.9 kB' }
	};
	const SHELF = ['nginx', 'htop', 'git', 'tree'];

	let installed = $state<string[]>([]);
	let arriving = $state<string | null>(null);
	let fresh = $state(false);
	let locked = $state(false);
	let quiet = false;
	const say = (t: string) => {
		if (!quiet && live) onstate?.(t);
	};

	const line = (text: string, tone: Ln['tone'] = 'out'): Ln => ({ tone, text });

	function noRoot(sh: LinuxShell) {
		sh.err('E: Could not open lock file /var/lib/dpkg/lock-frontend (13: Permission denied)');
		sh.err('E: Unable to acquire the dpkg frontend lock, are you root?');
		sh.hint(tx.hintSudo);
		locked = true;
		say('needSudo');
	}

	function apt(c: Cmd, sh: LinuxShell) {
		const [sub, ...rest] = c.args;
		const names = rest.filter((a) => !a.startsWith('-'));
		if (sub === 'update') {
			if (!c.sudo) return noRoot(sh);
			locked = false;
			sh.play(
				[
					line('Hit:1 http://archive.ubuntu.com/ubuntu noble InRelease'),
					300,
					line('Get:2 http://archive.ubuntu.com/ubuntu noble-updates InRelease [126 kB]'),
					400,
					line('Get:3 http://security.ubuntu.com/ubuntu noble-security InRelease [126 kB]'),
					400,
					line('Fetched 252 kB in 1s (310 kB/s)'),
					line('Reading package lists... Done'),
					line('All packages are up to date.', 'ok')
				],
				() => {
					fresh = true;
					say('updated');
				}
			);
			return;
		}
		if (sub === 'install' || sub === 'remove') {
			if (!names.length) {
				sh.err(`E: No packages given to ${sub}`);
				sh.hint(tx.hintApt);
				say('error');
				return;
			}
			if (!c.sudo) return noRoot(sh);
			locked = false;
			const name = names[0];
			const pkg = SHOP[name];
			if (!pkg) {
				sh.out('Reading package lists... Done');
				sh.err(`E: Unable to locate package ${name}`);
				sh.hint(tx.hintApt);
				say('noPackage');
				return;
			}
			if (sub === 'remove') {
				if (!installed.includes(name)) {
					sh.out(`Package '${name}' is not installed, so not removed`);
					return;
				}
				sh.play([line(`Removing ${name} (${pkg.ver}) ...`), 500], () => {
					installed = installed.filter((n) => n !== name);
					say('removed');
				});
				return;
			}
			if (installed.includes(name)) {
				sh.out('Reading package lists... Done');
				sh.out(`${name} is already the newest version (${pkg.ver}).`);
				say('already');
				return;
			}
			const all = [name, ...pkg.deps];
			arriving = name;
			sh.play(
				[
					line('Reading package lists... Done'),
					line('Building dependency tree... Done'),
					line('The following NEW packages will be installed'),
					line('  ' + all.join(' ')),
					300,
					...all.map((n, i) =>
						line(`Get:${i + 1} http://archive.ubuntu.com/ubuntu noble/main amd64 ${n} ${pkg.ver}`)
					),
					700,
					...all.map((n) => line(`Unpacking ${n} (${pkg.ver}) ...`)),
					500,
					...all.map((n) => line(`Setting up ${n} (${pkg.ver}) ...`)),
					300
				],
				() => {
					arriving = null;
					installed = [...installed, name];
					say(name === 'htop' ? 'installed' : 'other');
				}
			);
			return;
		}
		sh.out('apt 2.7.14 (amd64)');
		sh.hint(tx.hintApt);
		say('error');
	}

	function handler(c: Cmd, sh: LinuxShell) {
		if (c.name === 'apt' || c.name === 'apt-get') {
			apt(c, sh);
			return true;
		}
		if (SHOP[c.name]) {
			if (!installed.includes(c.name)) {
				sh.err(`Command '${c.name}' not found, but can be installed with`);
				sh.out(`sudo apt install ${c.name}`);
				say('notInstalled');
				return true;
			}
			if (c.name === 'nginx' && c.args.includes('-v'))
				sh.out('nginx version: nginx/1.24.0 (Ubuntu)');
			else if (c.name === 'htop') {
				sh.pre('  PID USER   CPU%  MEM%  COMMAND');
				sh.pre('  812 www     0.7   1.2  nginx');
				sh.pre(' 1440 nim     0.3   0.4  bash');
			} else sh.out(`${c.name} ${SHOP[c.name].ver}`);
			say('ran');
			return true;
		}
		return false;
	}

	function makeFs(): FNode {
		return dir({ home: dir({ nim: myDir() }), tmp: dir({}, { mode: 0o777 }) });
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: say,
		handler,
		commands: ['apt', 'apt-get', ...SHELF]
	});
	shell.speed = 55;

	function direct(sc: number) {
		installed = [];
		arriving = null;
		fresh = false;
		locked = false;
		shell.reset(makeFs());
		quiet = true;
		shell.quick(SCRIPT.slice(0, sc).flat());
		quiet = false;
		if (sc !== 4) locked = false;
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

	// ---- Drawing ----
	const BOX: Record<string, { x: number; y: number }> = {
		nginx: { x: 44, y: 88 },
		htop: { x: 104, y: 88 },
		git: { x: 44, y: 146 },
		tree: { x: 104, y: 146 }
	};
	/** The rack slot a package lands in, in the order it was installed. */
	const slotY = (k: number) => 62 + k * 34;
	const RACK_X = 290;

	let reduced = $state(false);
	$effect(() => {
		if (typeof matchMedia !== 'undefined')
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	/** A box travelling from the shop shelf to its slot in the rack, in a gentle arc. */
	function travel(
		_n: Element,
		o: { from: { x: number; y: number }; to: { x: number; y: number } }
	) {
		return {
			duration: reduced ? 0 : 2200,
			easing: cubicInOut,
			css: (t: number) => {
				const x = o.from.x + (o.to.x - o.from.x) * t;
				const y = o.from.y + (o.to.y - o.from.y) * t - Math.sin(Math.PI * t) * 60;
				return `transform: translate(${x}px, ${y}px)`;
			}
		};
	}
	const focusShop = $derived(scene === 1);
</script>

{#snippet pkgBox(name: string, small = false)}
	<rect x="-22" y="-15" width="44" height="30" rx="4" class="box" class:small />
	<path d="M-22 -6 H22" class="tape" />
	<text y="10" class="box-label">{name}</text>
{/snippet}

{#snippet scene_(i: number)}
	<svg viewBox="0 0 360 230" class="art-svg" aria-hidden="true">
		<!-- the road between the shop and the server -->
		<path d="M150 128 C190 108 210 108 236 128" class="road" />
		<text x="193" y="102" class="mini">{tx.netLabel}</text>

		<!-- the shop -->
		<g class="shop" class:focus={focusShop}>
			<rect x="12" y="46" width="124" height="140" rx="10" class="wall" />
			{#each [0, 1, 2, 3, 4, 5] as k (k)}
				<rect
					x={12 + k * 20.66}
					y="32"
					width="20.66"
					height="18"
					class="awning"
					class:alt={k % 2 === 1}
				/>
			{/each}
			<path d="M20 120 H128 M20 178 H128" class="shelf" />
			{#each SHELF as name (name)}
				<g
					transform="translate({BOX[name].x} {BOX[name].y})"
					class="stock"
					class:hot={(focusShop && name === 'nginx') || arriving === name}
				>
					{@render pkgBox(name)}
				</g>
			{/each}
			<text x="74" y="206" class="label">{tx.storeLabel}</text>
		</g>

		<!-- the server rack -->
		<g class="rack" class:locked>
			<rect x="236" y="40" width="108" height="146" rx="10" class="frame" />
			{#each [0, 1, 2, 3] as k (k)}
				<rect x="246" y={slotY(k) - 15} width="88" height="30" rx="5" class="unit" />
				<circle cx="256" cy={slotY(k)} r="2.6" class="led" class:on={k < installed.length} />
			{/each}
			{#each installed as name, k (name)}
				<g
					transform="translate({RACK_X + 8} {slotY(k)})"
					class="landed"
					in:fade={{ duration: 200 }}
				>
					{@render pkgBox(name)}
				</g>
			{/each}
			{#if fresh}
				<g transform="translate(330 30)" in:fade={{ duration: 300 }} class="list">
					<rect x="-10" y="-12" width="20" height="24" rx="2" />
					<path d="M-5 -5 H5 M-5 0 H5 M-5 5 H2" />
				</g>
			{/if}
			{#if locked}
				<g transform="translate(290 112)" in:fade={{ duration: 250 }} class="lock">
					<rect x="-16" y="-6" width="32" height="24" rx="5" />
					<path d="M-9 -6 V-12 A9 9 0 0 1 9 -12 V-6" />
				</g>
			{/if}
			<text x="290" y="206" class="label">{tx.serverLabel}</text>
		</g>

		<!-- a box on its way -->
		{#if arriving}
			<g
				class="flying"
				in:travel={{
					from: BOX[arriving],
					to: { x: RACK_X + 8, y: slotY(installed.length) }
				}}
				style="transform: translate({RACK_X + 8}px, {slotY(installed.length)}px)"
			>
				{@render pkgBox(arriving)}
			</g>
		{/if}
	</svg>
	{#if i === 6}
		<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
	{/if}
{/snippet}

<GuidedLab
	{tx}
	{shell}
	active={scene}
	{live}
	tryCmd={TRY}
	onselect={(i) => (peek = i)}
	art={scene_}
/>

<style>
	.art-svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 34vh;
	}
	.road {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.mini {
		fill: var(--color-faint);
		font-size: 10px;
		font-weight: 600;
		text-anchor: middle;
	}
	.label {
		fill: var(--color-muted);
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.wall {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.4s;
	}
	.shop.focus .wall {
		stroke: var(--color-brand);
	}
	.awning {
		fill: var(--color-brand);
		opacity: 0.85;
	}
	.awning.alt {
		fill: var(--color-card);
		opacity: 1;
	}
	.shelf {
		stroke: var(--color-amber);
		stroke-width: 3;
		opacity: 0.6;
	}
	.box {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.tape {
		stroke: var(--color-amber);
		stroke-width: 1.2;
		opacity: 0.6;
	}
	.box-label {
		fill: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.stock {
		transition: opacity 0.4s;
	}
	.stock.hot .box {
		stroke: var(--color-brand);
		stroke-width: 2.4;
	}
	.frame {
		fill: var(--color-ink);
		opacity: 0.9;
	}
	.unit {
		fill: var(--color-card);
		opacity: 0.12;
	}
	.led {
		fill: var(--color-faint);
	}
	.led.on {
		fill: var(--color-grass);
	}
	.list rect {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.list path {
		stroke: var(--color-brand);
		stroke-width: 1.3;
	}
	.lock rect {
		fill: var(--color-danger);
	}
	.lock path {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 3;
	}
	.rule {
		margin: 4px 0 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.wall,
		.stock {
			transition: none;
		}
	}
</style>
