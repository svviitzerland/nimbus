<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RouterQueueText } from '$lib/chapters/netlab/router-queue/types';
	import Missions from './routerlab/Missions.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import RosTerminal from './routerlab/RosTerminal.svelte';
	import { RosShell, type Ctx } from './routerlab/shell.svelte';
	import {
		cmd,
		fmtRate,
		menu,
		pad,
		parseAddr,
		parseLimit,
		type Mission,
		type RigLaptop
	} from './routerlab/ros';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as RouterQueueText);
	const live = $derived(beat >= tx.intro.length - 1);

	// ---- The office line and who wants what ----
	const LINE = 20; // Mbps from the ISP
	const USERS = [
		// Sari is on a video call, Budi pulls a huge download over many connections, Dewi browses
		{ key: 'sari', ip: '192.168.88.254', want: 3, need: 3, weight: 1 },
		{ key: 'budi', ip: '192.168.88.253', want: 99, need: 4, weight: 8 },
		{ key: 'dewi', ip: '192.168.88.252', want: 4, need: 2, weight: 1 }
	];
	type Queue = { name: string; ip: string; limit: number; bytes: number };
	let queues = $state<Queue[]>([]);
	const limitOf = (ip: string) => queues.find((q) => q.ip === ip)?.limit ?? Infinity;

	/** Weighted fair share (what TCP roughly does), each user capped by demand and max-limit. */
	const alloc = $derived.by(() => {
		const caps = USERS.map((u) => Math.min(u.want, limitOf(u.ip)));
		const got = USERS.map(() => 0);
		let left = LINE;
		let open = USERS.map((_, i) => i);
		for (let round = 0; round < 4 && open.length; round++) {
			const w = open.reduce((s, i) => s + USERS[i].weight, 0);
			const level = left / w;
			const capped = open.filter((i) => caps[i] <= USERS[i].weight * level);
			if (!capped.length) {
				open.forEach((i) => (got[i] = USERS[i].weight * level));
				break;
			}
			capped.forEach((i) => {
				got[i] = caps[i];
				left -= caps[i];
			});
			open = open.filter((i) => !capped.includes(i));
		}
		return got;
	});
	const fair = $derived(USERS.every((u, i) => alloc[i] >= u.need - 0.01));

	// a little live wobble so the bars feel like real traffic
	let wobble = $state([1, 1, 1]);
	$effect(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
		const t = setInterval(() => {
			wobble = wobble.map(() => 0.94 + Math.random() * 0.1);
			queues.forEach((q) => {
				const i = USERS.findIndex((u) => u.ip === q.ip);
				q.bytes += alloc[i] * 0.075;
			});
		}, 700);
		return () => clearInterval(t);
	});
	const shown = $derived(alloc.map((a, i) => Math.min(a * wobble[i], LINE)));

	const statusOf = (i: number) => {
		const ok = alloc[i] >= USERS[i].need - 0.01;
		if (i === 0) return ok ? tx.status.smooth : tx.status.choppy;
		if (i === 2) return ok ? tx.status.fine : tx.status.slow;
		return tx.status.downloading;
	};
	const rigLaps = $derived<RigLaptop[]>(
		USERS.map((u, i) => ({
			name: tx.users[i].name,
			ip: `${fmtRate(shown[i])}bps`,
			tone: i === 1 ? 'idle' : alloc[i] >= u.need - 0.01 ? 'ok' : 'bad'
		}))
	);

	// ---- Missions ----
	const ORDER = ['torch', 'queue', 'fair', 'stats'] as const;
	type MId = (typeof ORDER)[number];
	let done = $state<Record<MId, boolean>>({
		torch: false,
		queue: false,
		fair: false,
		stats: false
	});
	let finished = false;
	function tick(id: MId, token: string) {
		done[id] = true;
		if (!finished && ORDER.every((m) => done[m])) {
			finished = true;
			onstate?.('done');
			oncomplete?.();
			return;
		}
		onstate?.(token);
	}
	/** After any queue change, see how the office feels and let Nim react. */
	function judge(changedIp: string) {
		const budi = USERS[1];
		if (changedIp !== budi.ip) {
			return onstate?.(alloc[1] > 14 ? 'wrongUser' : 'tuned');
		}
		if (alloc[1] < budi.need - 0.01) return onstate?.('tooHarsh');
		if (!done.queue) {
			done.queue = true;
		}
		if (fair) {
			if (!done.fair) return tick('fair', 'fair');
			return onstate?.('tuned');
		}
		onstate?.('notYet');
	}

	// ---- RouterOS ----
	const ROOT = menu({
		queue: menu({
			simple: menu({
				add: cmd('q.add'),
				set: cmd('q.set'),
				remove: cmd('q.remove'),
				print: cmd('q.print')
			})
		}),
		tool: menu({ torch: cmd('torch') }),
		ip: menu({ 'dhcp-server': menu({ lease: menu({ print: cmd('lease.print') }) }) }),
		system: menu({ identity: menu({ print: cmd('id.print') }) })
	});
	const shell = new RosShell(
		ROOT,
		() => tx,
		(c) => exec(c),
		(t) => onstate?.(t ?? 'error')
	);
	$effect(() => () => shell.destroy());

	function findQueue(c: Ctx): number {
		const w = c.rest[0]?.w;
		if (!w) return -1;
		const m = /^\[find name="?([^"\]]+)"?\]$/.exec(w);
		const name = m ? m[1] : w;
		const n = Number(name);
		if (Number.isInteger(n) && queues[n]) return n;
		return queues.findIndex((q) => q.name === name);
	}
	function readLimit(v: string | undefined): number | null {
		const l = v ? parseLimit(v) : null;
		if (!l || l.down <= 0) {
			shell.fail('invalid value for argument max-limit', tx.hintLimit);
			return null;
		}
		return Math.min(l.down, LINE);
	}

	function exec(c: Ctx) {
		const { id } = c;
		if (id === 'id.print') {
			if (shell.bare(c)) shell.out(`  name: ${shell.identity}`);
			return;
		}
		if (id === 'lease.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` #   ${pad('ADDRESS', 16)}${pad('HOST-NAME', 13)}STATUS`);
			USERS.forEach((u, i) =>
				shell.tbl(` ${i} D ${pad(u.ip, 16)}${pad(u.key + '-laptop', 13)}bound`)
			);
			return;
		}
		if (id === 'torch') {
			const a = shell.readArgs(c.args, ['interface', 'src-address', 'port']);
			if (!a) return;
			if (!a.interface) return shell.fail('failure: interface not specified', tx.hintTorch);
			if (a.interface !== 'ether2') {
				shell.tbl(` ${pad('SRC-ADDRESS', 17)}${pad('TX', 9)}RX`);
				shell.tbl(` ${pad('10.20.30.2', 17)}${pad('1.1Mbps', 9)}${fmtRate(LINE)}bps`);
				shell.hint(tx.hintTorch);
				return;
			}
			shell.tbl(` ${pad('DST-ADDRESS', 17)}${pad('TX', 10)}RX`);
			USERS.map((u, i) => ({ u, r: alloc[i] }))
				.sort((x, y) => y.r - x.r)
				.forEach(({ u, r }) =>
					shell.tbl(` ${pad(u.ip, 17)}${pad(fmtRate(r) + 'bps', 10)}${fmtRate(r / 12)}bps`)
				);
			if (!done.torch) tick('torch', 'torch');
			return;
		}
		if (id === 'q.print') {
			const stats = c.rest[0]?.w.toLowerCase() === 'stats';
			if (c.rest.length > (stats ? 1 : 0) || c.args.length) {
				const x = c.rest[stats ? 1 : 0] ?? c.args[0];
				return shell.fail(`expected end of command (line 1 column ${x.col})`);
			}
			if (!queues.length) {
				shell.hint(tx.hintNoQueue);
				return onstate?.('noQueue');
			}
			if (stats) {
				shell.tbl(` # ${pad('NAME', 6)}${pad('RATE', 12)}BYTES`);
				queues.forEach((q, i) => {
					const r = alloc[USERS.findIndex((u) => u.ip === q.ip)];
					shell.tbl(
						` ${i} ${pad(q.name, 6)}${pad(fmtRate(r) + 'bps', 12)}${Math.round(q.bytes)} MiB`
					);
				});
				shell.hint(tx.hintStats);
				if (!done.stats) tick('stats', 'stats');
				return;
			}
			shell.tbl(` # ${pad('NAME', 6)}${pad('TARGET', 19)}MAX-LIMIT`);
			queues.forEach((q, i) =>
				shell.tbl(` ${i} ${pad(q.name, 6)}${pad(q.ip + '/32', 19)}${q.limit}M/${q.limit}M`)
			);
			return;
		}
		if (id === 'q.add') {
			const a = shell.readArgs(c.args, ['name', 'target', 'max-limit', 'comment']);
			if (!a) return;
			const miss = ['target', 'max-limit'].filter((k) => !a[k]);
			if (miss.length)
				return shell.fail(
					`failure: ${miss[0]} not specified`,
					tx.hintNeeds.replace('{keys}', miss.join(', '))
				);
			const p = parseAddr(a.target);
			const user = p && USERS.find((u) => u.ip === p.ip);
			if (!p || !user) return shell.fail('input does not match any value of target', tx.hintTarget);
			const limit = readLimit(a['max-limit']);
			if (limit === null) return;
			const name = a.name ?? `queue${queues.length + 1}`;
			if (queues.some((q) => q.ip === user.ip || q.name === name))
				return shell.fail('failure: already have such queue', tx.hintExists);
			queues = [...queues, { name, ip: user.ip, limit, bytes: 0 }];
			return judge(user.ip);
		}
		if (id === 'q.set') {
			const i = findQueue(c);
			if (i < 0) return shell.fail('no such item', tx.hintNoQueue);
			const a = shell.readArgs(c.args, ['max-limit', 'target', 'name']);
			if (!a) return;
			if (a['max-limit']) {
				const limit = readLimit(a['max-limit']);
				if (limit === null) return;
				queues[i].limit = limit;
			}
			return judge(queues[i].ip);
		}
		if (id === 'q.remove') {
			const i = findQueue(c);
			if (i < 0) return shell.fail('no such item', tx.hintNoQueue);
			const ip = queues[i].ip;
			queues = queues.filter((_, k) => k !== i);
			return judge(ip);
		}
	}

	// ---- User cards ----
	const queueOf = (i: number) => queues.find((q) => q.ip === USERS[i].ip);
	function addFor(i: number) {
		if (!live || shell.typing) return;
		const u = USERS[i];
		shell.typeFor(
			`/queue simple add name=${u.key} target=${u.ip}/32 max-limit=${i === 1 ? 10 : 5}M/${i === 1 ? 10 : 5}M`
		);
	}
	let drag = $state<Record<string, number>>({});
	function slide(i: number, v: number) {
		drag[USERS[i].key] = v;
	}
	function commit(i: number) {
		const q = queueOf(i);
		const v = drag[USERS[i].key];
		if (!q || v === undefined || shell.typing) return;
		delete drag[USERS[i].key];
		shell.run(`/queue simple set ${q.name} max-limit=${v}M/${v}M`);
	}

	function help(m: MId) {
		if (m === 'torch') return shell.typeFor('/tool torch interface=ether2');
		if (m === 'queue' || m === 'fair') {
			const q = queueOf(1);
			if (!q) return addFor(1);
			return shell.typeFor(`/queue simple set ${q.name} max-limit=10M/10M`);
		}
		shell.typeFor('/queue simple print stats');
	}
	const items = $derived<Mission[]>(
		ORDER.map((m, i) => ({ label: tx.missions[i], done: done[m], help: () => help(m) }))
	);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={!live || shell.typing}
	/>

	<div class="users">
		<div class="line">{tx.lineLabel.replace('{n}', String(LINE))}</div>
		{#each USERS as u, i (u.key)}
			{@const q = queueOf(i)}
			{@const ok = i === 1 || alloc[i] >= u.need - 0.01}
			<div class="user">
				<div class="top">
					<span class="who">{tx.users[i].name}</span>
					<span class="doing">{tx.users[i].doing}</span>
					<span class="st" class:bad={!ok}>{statusOf(i)}</span>
				</div>
				<div class="bar">
					<span class="fill k{i}" class:bad={!ok} style="width:{(shown[i] / LINE) * 100}%"></span>
					{#if q}
						<span class="cap" style="left:{(q.limit / LINE) * 100}%"></span>
					{/if}
					<span class="rate">{fmtRate(shown[i])}bps</span>
				</div>
				<div class="ctl">
					{#if q}
						<input
							type="range"
							min="1"
							max={LINE}
							step="1"
							value={drag[u.key] ?? q.limit}
							disabled={!live || shell.typing}
							aria-label={tx.limitLabel.replace('{name}', tx.users[i].name)}
							oninput={(e) => slide(i, Number(e.currentTarget.value))}
							onchange={() => commit(i)}
						/>
						<span class="lim">max {drag[u.key] ?? q.limit}M</span>
					{:else}
						<span class="lim free">{tx.unlimited}</span>
						<button
							type="button"
							class="chip"
							disabled={!live || shell.typing}
							onclick={() => addFor(i)}>{tx.addQueue}</button
						>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<OfficeRig identity={shell.identity} isp={tx.ispLabel} laptops={rigLaps} />

	<RosTerminal {shell} {live} inputLabel={tx.inputLabel} short />
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: min(94vw, 400px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}
	.users {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		border-radius: 12px;
		padding: 8px 10px 10px;
	}
	.line {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.user {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.top {
		display: flex;
		align-items: baseline;
		gap: 6px;
		font-size: 12px;
	}
	.who {
		font-weight: 800;
		color: var(--color-ink);
	}
	.doing {
		flex: 1;
		min-width: 0;
		color: var(--color-muted);
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.st {
		font-size: 11px;
		font-weight: 750;
		color: var(--color-grass);
	}
	.st.bad {
		color: var(--color-danger);
	}
	.bar {
		position: relative;
		height: 14px;
		border-radius: 7px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		overflow: hidden;
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 7px;
		transition: width 0.6s ease;
	}
	.fill.k0 {
		background: var(--color-grass);
	}
	.fill.k1 {
		background: var(--color-brand);
	}
	.fill.k2 {
		background: var(--color-amber);
	}
	.fill.bad {
		background: var(--color-danger);
	}
	.cap {
		position: absolute;
		top: -1px;
		bottom: -1px;
		width: 2px;
		margin-left: -1px;
		background: var(--color-ink);
	}
	.rate {
		position: absolute;
		right: 6px;
		top: 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		font-weight: 800;
		line-height: 14px;
		color: var(--color-ink);
	}
	.ctl {
		display: flex;
		align-items: center;
		gap: 8px;
		min-height: 24px;
	}
	.ctl input {
		flex: 1;
		min-width: 0;
		accent-color: var(--color-brand);
	}
	.lim {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-ink);
		min-width: 56px;
		text-align: right;
	}
	.lim.free {
		flex: 1;
		text-align: left;
		color: var(--color-faint);
		font-family: inherit;
	}
	.chip {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		font-size: 11px;
		font-weight: 700;
		padding: 3px 10px;
	}
	.chip:hover:not(:disabled) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.chip:disabled {
		opacity: 0.5;
	}
	@media (prefers-reduced-motion: reduce) {
		.fill {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
	}
</style>
