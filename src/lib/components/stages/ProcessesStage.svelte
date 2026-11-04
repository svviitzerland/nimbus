<script lang="ts">
	// A guided terminal lab about processes. A server rack with CPU and RAM meters sits next to a
	// list of what runs on it, every row a process with its PID chip. Nim types ps aux, then top
	// (the list sorts itself by hunger and report.py glows red), a polite kill it ignores, kill -9
	// that removes it, and a backup sent to the background with &. On the last beat a second
	// runaway script appears and the learner types kill 5150.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { ProcessesText } from '$lib/chapters/linux/processes/types';
	import GuidedLab from './linux/GuidedLab.svelte';
	import { LinuxShell, type Cmd } from './linux/shell.svelte';
	import { dir, file, mine, myDir, type FNode } from './linux/fs';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as ProcessesText);

	const SCRIPT: string[][] = [
		[],
		['ps aux'],
		['top'],
		['kill 4242'],
		['kill -9 4242'],
		['./backup.sh &', 'jobs'],
		[],
		[],
		[]
	];
	const LAST = SCRIPT.length - 1;
	const TRY = 'kill 5150';

	type Proc = {
		pid: number;
		user: string;
		name: string;
		cpu: number;
		mem: number;
		stuck?: boolean;
		ignored?: boolean;
		bg?: boolean;
	};
	const BASE: Proc[] = [
		{ pid: 1, user: 'root', name: 'systemd', cpu: 0, mem: 0.3 },
		{ pid: 812, user: 'root', name: 'sshd', cpu: 0, mem: 0.2 },
		{ pid: 990, user: 'www-data', name: 'nginx', cpu: 0.4, mem: 0.6 },
		{ pid: 1203, user: 'postgres', name: 'postgres', cpu: 1.2, mem: 4.1 },
		{ pid: 2210, user: 'nim', name: 'bash', cpu: 0, mem: 0.1 },
		{ pid: 4242, user: 'nim', name: 'report.py', cpu: 98.6, mem: 2.3, stuck: true }
	];
	// Only these show up in the picture, the rest live in ps and top.
	const HIDDEN = ['sshd', 'bash'];

	let peek = $state<number | null>(null);
	const scene = $derived(peek ?? Math.min(beat, LAST));
	const live = $derived(scene === LAST);

	let procs = $state<Proc[]>(BASE.map((p) => ({ ...p })));
	let sorted = $state(false);
	let job = $state(0); // job number of the backup in the background, 0 when none
	let quiet = false;
	const say = (t: string) => {
		if (!quiet && live) onstate?.(t);
	};

	const fmt = (n: number) => n.toFixed(1);
	const pad = (s: string, n: number) => s + ' '.repeat(Math.max(1, n - s.length));
	const padL = (s: string, n: number) => ' '.repeat(Math.max(0, n - s.length)) + s;

	function table(sh: LinuxShell, list: Proc[]) {
		sh.pre('USER         PID %CPU %MEM COMMAND', 'muted');
		for (const p of list) {
			const row = `${pad(p.user, 9)}${padL(String(p.pid), 6)} ${padL(fmt(p.cpu), 4)} ${padL(fmt(p.mem), 4)} ${p.name}`;
			sh.pre(row, p.cpu > 50 ? 'err' : 'out');
		}
	}

	function ps(c: Cmd, sh: LinuxShell) {
		const all = c.args.some((a) => /a|e/.test(a));
		table(sh, all ? procs : procs.filter((p) => p.user === 'nim'));
		say('listed');
	}

	function top(c: Cmd, sh: LinuxShell) {
		const cpu = Math.min(
			99.9,
			procs.reduce((s, p) => s + p.cpu, 0)
		);
		const mem = Math.min(99, 34 + procs.reduce((s, p) => s + p.mem, 0));
		if (c.name === 'htop') {
			const bar = (v: number) => '|'.repeat(Math.round(v / 6)).padEnd(17, ' ');
			sh.pre(`  CPU [${bar(cpu)}${padL(fmt(cpu), 5)}%]`, cpu > 50 ? 'err' : 'ok');
			sh.pre(`  Mem [${bar(mem)}${padL(fmt(mem), 5)}%]`, 'ok');
		} else {
			sh.pre(`top, ${procs.length} tasks, load average 0.98, 0.71, 0.40`);
			sh.pre(`%Cpu(s) ${fmt(cpu)} used    MiB Mem ${fmt(mem)}% used`, cpu > 50 ? 'err' : 'out');
		}
		table(
			sh,
			[...procs].sort((a, b) => b.cpu - a.cpu)
		);
		sh.hint(tx.hintTop);
		sorted = true;
		say('top');
	}

	function find(pid: number) {
		return procs.find((p) => p.pid === pid);
	}

	function stop(p: Proc, hard: boolean, c: Cmd, sh: LinuxShell) {
		if (p.pid === 1) {
			say('pid1');
			return;
		}
		if (p.user !== 'nim' && !c.sudo) {
			sh.err(`-bash: kill: (${p.pid}) - Operation not permitted`);
			sh.hint(tx.hintSudo);
			say('needSudo');
			return;
		}
		if (p.stuck && !hard) {
			p.ignored = true;
			say('ignored');
			return;
		}
		procs = procs.filter((x) => x.pid !== p.pid);
		if (p.bg) {
			sh.out(`[${job}]+  ${hard ? 'Killed' : 'Terminated'}              ./backup.sh`);
			job = 0;
		}
		say(hard ? 'killed9' : 'killed');
	}

	function kill(c: Cmd, sh: LinuxShell) {
		const hard = c.args.some((a) => /^-(9|KILL|SIGKILL)$/i.test(a));
		const ids = c.args.filter((a) => !a.startsWith('-'));
		if (!ids.length) {
			sh.err('kill: usage: kill [-9] pid');
			sh.hint(tx.hintKill);
			say('error');
			return;
		}
		for (const raw of ids) {
			const pid = raw.startsWith('%')
				? job && Number(raw.slice(1)) === job
					? 5101
					: -1
				: Number(raw);
			if (!Number.isInteger(pid)) {
				sh.err(`-bash: kill: ${raw}: arguments must be process or job IDs`);
				sh.hint(tx.hintKill);
				say('error');
				continue;
			}
			const p = find(pid);
			if (!p) {
				sh.err(`-bash: kill: (${raw}) - No such process`);
				say('noProcess');
				continue;
			}
			stop(p, hard, c, sh);
		}
	}

	function pkill(c: Cmd, sh: LinuxShell) {
		const hard = c.args.some((a) => /^-(9|KILL|SIGKILL)$/i.test(a));
		const name = c.args.find((a) => !a.startsWith('-'));
		const p = procs.find((x) => x.name === name);
		if (!p) {
			say('noProcess');
			return;
		}
		stop(p, hard, c, sh);
	}

	function backup(c: Cmd, sh: LinuxShell) {
		if (find(5101)) {
			sh.err('backup.sh is already running');
			return;
		}
		const back = c.args.includes('&') || c.line.trim().endsWith('&');
		const p: Proc = { pid: 5101, user: 'nim', name: 'backup.sh', cpu: 3.1, mem: 0.4, bg: back };
		procs = [...procs, p];
		if (back) {
			job = 1;
			sh.out('[1] 5101');
			say('background');
			return;
		}
		sh.play(
			[
				{ tone: 'out', text: 'backing up /var/www/nimbus ...' },
				1400,
				{ tone: 'ok', text: 'backup done, nimbus-2026-11-03.tar.gz' }
			],
			() => (procs = procs.filter((x) => x.pid !== 5101))
		);
	}

	function handler(c: Cmd, sh: LinuxShell) {
		const n = c.name;
		if (n === 'ps') ps(c, sh);
		else if (n === 'top' || n === 'htop') top(c, sh);
		else if (n === 'kill') kill(c, sh);
		else if (n === 'pkill') pkill(c, sh);
		else if (n === './backup.sh' || ((n === 'bash' || n === 'sh') && c.args[0] === 'backup.sh'))
			backup(c, sh);
		else if (n === 'jobs') {
			if (job) sh.out(`[${job}]+  Running                 ./backup.sh &`);
			say('jobs');
		} else if (n === 'fg') {
			const p = find(5101);
			if (!job || !p) {
				sh.err('-bash: fg: current: no such job');
				return true;
			}
			sh.out('./backup.sh');
			p.bg = false;
			job = 0;
			sh.play([1200, { tone: 'ok', text: 'backup done, nimbus-2026-11-03.tar.gz' }], () => {
				procs = procs.filter((x) => x.pid !== 5101);
			});
		} else return false;
		return true;
	}

	function makeFs(): FNode {
		return dir({
			home: dir({
				nim: myDir({
					'backup.sh': mine(['#!/bin/bash', 'tar -czf ~/nimbus.tar.gz /var/www/nimbus'], {
						mode: 0o755
					}),
					'report.py': mine(['while True:', '    crunch_numbers()'])
				})
			}),
			var: dir({ www: dir({ nimbus: dir({ 'index.html': file(['<h1>nimbus.com</h1>']) }) }) })
		});
	}

	const shell = new LinuxShell({
		fs: makeFs(),
		text: () => tx,
		react: say,
		handler,
		commands: ['ps', 'top', 'htop', 'kill', 'pkill', 'jobs', 'fg']
	});
	shell.speed = 55;

	function direct(sc: number) {
		procs = BASE.map((p) => ({ ...p }));
		sorted = false;
		job = 0;
		shell.reset(makeFs());
		quiet = true;
		shell.quick(SCRIPT.slice(0, sc).flat());
		if (sc === LAST)
			procs = [...procs, { pid: 5150, user: 'nim', name: 'thumbs.py', cpu: 97.2, mem: 1.8 }];
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

	const cpu = $derived(
		Math.min(
			100,
			procs.reduce((s, p) => s + p.cpu, 0)
		)
	);
	const ram = $derived(Math.min(100, 34 + procs.reduce((s, p) => s + p.mem, 0)));
	const tone = $derived(cpu > 70 ? 'hot' : cpu > 30 ? 'warm' : 'calm');
	const rows = $derived.by(() => {
		const list = procs.filter((p) => !HIDDEN.includes(p.name));
		return sorted ? [...list].sort((a, b) => b.cpu - a.cpu) : list;
	});
	const pidFocus = $derived(scene === 0 || scene === 1);
	const ROW = 30;
</script>

{#snippet art(i: number)}
	<svg viewBox="0 0 360 200" class="art-svg" aria-hidden="true">
		<!-- the server rack -->
		<rect x="14" y="20" width="96" height="116" rx="10" class="frame" />
		{#each [0, 1, 2] as k (k)}
			<rect x="23" y={31 + k * 34} width="78" height="26" rx="5" class="unit" />
		{/each}
		<circle cx="35" cy="78" r="5.5" class="lamp {tone}" />
		<circle cx="35" cy="44" r="2.4" class="led" />
		<circle cx="35" cy="112" r="2.4" class="led" />
		<text x="62" y="152" class="label">{tx.serverLabel}</text>

		<!-- CPU and RAM meters -->
		<text x="14" y="172" class="meter-t">{tx.cpuLabel}</text>
		<rect x="44" y="165" width="38" height="8" rx="4" class="track" />
		<rect x="44" y="165" width={Math.max(3, cpu * 0.38)} height="8" rx="4" class="fill {tone}" />
		<text x="113" y="172" class="pct">{Math.round(cpu)}%</text>
		<text x="14" y="190" class="meter-t">{tx.ramLabel}</text>
		<rect x="44" y="183" width="38" height="8" rx="4" class="track" />
		<rect x="44" y="183" width={ram * 0.38} height="8" rx="4" class="fill calm" />
		<text x="113" y="190" class="pct">{Math.round(ram)}%</text>

		<!-- the process list -->
		<text x="124" y="22" class="list-t">{tx.listTitle}</text>
		{#each rows as p, k (p.pid)}
			{@const hot = p.cpu > 50}
			<g
				class="row"
				style="transform: translate(0px, {k * ROW}px)"
				in:fade={{ duration: 300 }}
				out:fade={{ duration: 300 }}
			>
				<rect x="120" y="32" width="232" height="24" rx="7" class="row-bg" class:hot />
				<rect x="126" y="36" width="42" height="16" rx="8" class="chip" class:focus={pidFocus} />
				<text x="147" y="48" class="chip-t" class:focus={pidFocus}>{p.pid}</text>
				<text x="174" y="48.5" class="name">{p.name}</text>
				{#if p.bg || p.ignored}
					<rect x="238" y="37" width="47" height="14" rx="7" class="tag" class:stuck={p.ignored} />
					<text x="261.5" y="47" class="tag-t" class:stuck={p.ignored}
						>{p.ignored ? tx.stuckLabel : tx.bgLabel}</text
					>
				{/if}
				<rect x="290" y="41" width="28" height="6" rx="3" class="track" />
				<rect
					x="290"
					y="41"
					width={Math.max(2, (p.cpu / 100) * 28)}
					height="6"
					rx="3"
					class="fill"
					class:hot
					class:calm={!hot}
				/>
				<text x="348" y="48" class="pct" class:hot>{fmt(p.cpu)}</text>
			</g>
		{/each}
	</svg>
	{#if i === 6}
		<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
	{/if}
{/snippet}

<GuidedLab {tx} {shell} active={scene} {live} tryCmd={TRY} onselect={(i) => (peek = i)} {art} />

<style>
	.art-svg {
		display: block;
		width: 100%;
		height: auto;
		max-height: 32vh;
	}
	.frame {
		fill: var(--color-ink);
		opacity: 0.9;
	}
	.unit {
		fill: var(--color-card);
		opacity: 0.14;
	}
	.led {
		fill: var(--color-grass);
	}
	.lamp {
		transition: fill 0.4s;
	}
	.lamp.calm {
		fill: var(--color-grass);
	}
	.lamp.warm {
		fill: var(--color-amber);
	}
	.lamp.hot {
		fill: var(--color-danger);
		animation: pulse 0.9s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.45;
		}
	}
	.label {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.meter-t,
	.list-t {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
	.pct {
		fill: var(--color-muted);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		font-weight: 700;
		text-anchor: end;
	}
	.pct.hot {
		fill: var(--color-danger);
	}
	.track {
		fill: var(--color-line);
	}
	.fill {
		transition:
			width 0.6s cubic-bezier(0.3, 0.7, 0.3, 1),
			fill 0.4s;
	}
	.fill.calm {
		fill: var(--color-grass);
	}
	.fill.warm {
		fill: var(--color-amber);
	}
	.fill.hot {
		fill: var(--color-danger);
	}
	.row {
		transition: transform 0.6s cubic-bezier(0.3, 0.7, 0.3, 1);
	}
	.row-bg {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.row-bg.hot {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.chip {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.chip.focus {
		fill: var(--color-brand);
		stroke: var(--color-brand);
	}
	.chip-t {
		fill: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
		transition: fill 0.4s;
	}
	.chip-t.focus {
		fill: #fff;
	}
	.name {
		fill: var(--color-ink);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
	}
	.tag {
		fill: var(--color-brand-soft);
	}
	.tag.stuck {
		fill: var(--color-amber-soft);
	}
	.tag-t {
		fill: var(--color-brand);
		font-size: 8px;
		font-weight: 700;
		text-anchor: middle;
	}
	.tag-t.stuck {
		fill: var(--color-amber);
	}
	.rule {
		margin: 6px 0 0;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.lamp.hot {
			animation: none;
		}
		.row,
		.fill,
		.lamp,
		.chip,
		.row-bg {
			transition: none;
		}
	}
</style>
