<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RouterNatText } from '$lib/chapters/netlab/router-nat/types';
	import Missions from './routerlab/Missions.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import RosTerminal from './routerlab/RosTerminal.svelte';
	import { RosShell, type Ctx } from './routerlab/shell.svelte';
	import {
		ISP,
		LAPTOP_Y,
		NET,
		PORTS,
		RY,
		SWITCH_Y,
		cmd,
		laptopXs,
		menu,
		pad,
		portC,
		type Mission,
		type RigLaptop,
		type RigPacket
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
	const tx = $derived(text as RouterNatText);
	const live = $derived(beat >= tx.intro.length - 1);

	// ---- The office from router-ip, every laptop already has a lease ----
	const PUBLIC = '10.20.30.2';
	const SITE = '104.21.5.9';
	const LAPS = [
		{ name: 'Sari', ip: '192.168.88.254' },
		{ name: 'Budi', ip: '192.168.88.253' },
		{ name: 'Dewi', ip: '192.168.88.252' }
	];
	let tones = $state<RigLaptop['tone'][]>(['idle', 'idle', 'idle']);
	const rigLaps = $derived<RigLaptop[]>(LAPS.map((l, i) => ({ ...l, tone: tones[i] })));

	type Rule = { chain: string; action: string; out?: string; src?: string; to?: string };
	let rules = $state<Rule[]>([]);
	const natOn = $derived(
		rules.some(
			(r) =>
				r.chain === 'srcnat' &&
				r.out === 'ether1' &&
				(r.action === 'masquerade' || (r.action === 'src-nat' && r.to === PUBLIC))
		)
	);
	type Conn = { from: string; port: number };
	let conns = $state<Conn[]>([]);

	// ---- Missions ----
	const ORDER = ['fail', 'rule', 'load', 'table'] as const;
	type MId = (typeof ORDER)[number];
	let done = $state<Record<MId, boolean>>({ fail: false, rule: false, load: false, table: false });
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

	// ---- The packet trip ----
	let packet = $state<RigPacket | null>(null);
	let mark = $state<{ x: number; y: number } | null>(null);
	let serverTone = $state<'idle' | 'ok' | 'bad'>('idle');
	let glow = $state<string[]>([]);
	let busy = $state(false);
	let who = $state(0);
	let caption = $state('');
	let captionOk = $state(false);
	let tripId = 0;
	const reduced =
		typeof window !== 'undefined' &&
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
	const wait = (ms: number) => new Promise((r) => setTimeout(r, reduced ? 40 : ms));
	$effect(() => () => {
		tripId++;
	});

	async function open() {
		if (!live || busy) return;
		const id = ++tripId;
		const i = who;
		const lx = laptopXs(3)[i];
		const me = LAPS[i];
		busy = true;
		mark = null;
		serverTone = 'idle';
		tones[i] = 'wait';
		const from = tx.tagFrom;
		const to = tx.tagTo;
		const step = async (x: number, y: number, label: string, tone: RigPacket['tone'], ms = 560) => {
			if (id !== tripId) throw new Error('stale');
			packet = { x, y, label, tone };
			await wait(ms);
			if (id !== tripId) throw new Error('stale');
		};
		const R = { x: (portC('ether1') + portC('ether2')) / 2, y: RY + 34 };
		try {
			await step(lx, LAPTOP_Y - 8, from.replace('{ip}', me.ip), 'go', 420);
			await step(lx, SWITCH_Y - 6, from.replace('{ip}', me.ip), 'go');
			glow = ['ether2'];
			await step(R.x, R.y, from.replace('{ip}', me.ip), 'go', 640);
			if (!natOn) {
				glow = ['ether1'];
				await step(ISP.x + 6, ISP.y + 32, from.replace('{ip}', me.ip), 'go', 640);
				await step(ISP.x + 6, ISP.y + 32, tx.tagDropped, 'bad', 700);
				mark = { x: ISP.x + 30, y: ISP.y - 10 };
				packet = null;
				tones[i] = 'bad';
				caption = tx.capFail.replace('{name}', me.name);
				captionOk = false;
				if (!done.fail) tick('fail', 'noNet');
				else onstate?.('noNetAgain');
				return;
			}
			// the router swaps the sender for its own public address and notes it down
			const port = 51234 + conns.length * 7;
			await step(R.x, R.y, from.replace('{ip}', PUBLIC), 'ok', 760);
			conns = [...conns, { from: me.ip, port }];
			glow = ['ether1'];
			await step(ISP.x + 6, ISP.y + 32, from.replace('{ip}', PUBLIC), 'ok');
			await step(NET.x - 30, 34, from.replace('{ip}', PUBLIC), 'ok', 520);
			serverTone = 'ok';
			await step(NET.x - 30, 34, to.replace('{ip}', PUBLIC), 'ok', 420);
			await step(ISP.x + 6, ISP.y + 32, to.replace('{ip}', PUBLIC), 'ok');
			await step(R.x, R.y, to.replace('{ip}', PUBLIC), 'ok', 520);
			glow = ['ether2'];
			await step(R.x, R.y, to.replace('{ip}', me.ip), 'ok', 760);
			await step(lx, SWITCH_Y - 6, to.replace('{ip}', me.ip), 'ok');
			await step(lx, LAPTOP_Y - 8, to.replace('{ip}', me.ip), 'ok', 360);
			packet = null;
			tones[i] = 'ok';
			caption = tx.capOk.replace('{name}', me.name);
			captionOk = true;
			if (!done.load) tick('load', 'loaded');
			else onstate?.('shared');
		} catch {
			return;
		} finally {
			if (id === tripId) {
				busy = false;
				glow = [];
				who = (i + 1) % LAPS.length;
			}
		}
	}

	// ---- RouterOS ----
	const ROOT = menu({
		interface: menu({ print: cmd('if.print') }),
		ip: menu({
			address: menu({ print: cmd('addr.print') }),
			'dhcp-server': menu({ lease: menu({ print: cmd('lease.print') }) }),
			firewall: menu({
				nat: menu({ add: cmd('nat.add'), print: cmd('nat.print'), remove: cmd('nat.remove') }),
				connection: menu({ print: cmd('conn.print') })
			})
		}),
		system: menu({ identity: menu({ print: cmd('id.print') }) })
	});
	const shell = new RosShell(
		ROOT,
		() => tx,
		(c) => exec(c),
		(t) => onstate?.(t ?? 'error')
	);
	$effect(() => () => shell.destroy());

	function printRules() {
		shell.tbl('Flags: X - disabled, I - invalid; D - dynamic');
		rules.forEach((r, i) => {
			const bits = [`chain=${r.chain}`, `action=${r.action}`];
			if (r.to) bits.push(`to-addresses=${r.to}`);
			if (r.src) bits.push(`src-address=${r.src}`);
			if (r.out) bits.push(`out-interface=${r.out}`);
			shell.tbl(` ${i}    ${bits.join(' ')}`);
		});
	}

	function exec(c: Ctx) {
		const { id } = c;
		if (id === 'id.print') {
			if (shell.bare(c)) shell.out(`  name: ${shell.identity}`);
			return;
		}
		if (id === 'if.print') {
			if (!shell.bare(c)) return;
			shell.tbl('Flags: R - RUNNING');
			shell.tbl(` #   ${pad('NAME', 8)}${pad('TYPE', 7)}MTU`);
			PORTS.forEach((p, i) =>
				shell.tbl(` ${i} ${i < 2 ? 'R' : ' '} ${pad(p, 8)}${pad('ether', 7)}1500`)
			);
			return;
		}
		if (id === 'addr.print') {
			if (!shell.bare(c)) return;
			shell.tbl('Flags: D - DYNAMIC');
			shell.tbl(` #   ${pad('ADDRESS', 17)}${pad('NETWORK', 14)}INTERFACE`);
			shell.tbl(` 0 D ${pad(PUBLIC + '/24', 17)}${pad('10.20.30.0', 14)}ether1`);
			shell.tbl(` 1   ${pad('192.168.88.1/24', 17)}${pad('192.168.88.0', 14)}ether2`);
			glow = ['ether1', 'ether2'];
			return;
		}
		if (id === 'lease.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` #   ${pad('ADDRESS', 16)}${pad('HOST-NAME', 13)}STATUS`);
			LAPS.forEach((l, i) =>
				shell.tbl(` ${i} D ${pad(l.ip, 16)}${pad(l.name.toLowerCase() + '-laptop', 13)}bound`)
			);
			return;
		}
		if (id === 'nat.print') {
			if (shell.bare(c)) printRules();
			return;
		}
		if (id === 'nat.remove') {
			const n = Number(c.rest[0]?.w ?? c.args.find((a) => a.k === 'numbers')?.v);
			if (!Number.isInteger(n) || !rules[n]) return shell.fail('no such item');
			rules = rules.filter((_, i) => i !== n);
			return;
		}
		if (id === 'conn.print') {
			if (!shell.bare(c)) return;
			shell.tbl('Flags: S - SEEN-REPLY, A - ASSURED, C - CONFIRMED, s - SRCNAT');
			shell.tbl(
				` #     ${pad('PROTOCOL', 9)}${pad('SRC-ADDRESS', 22)}${pad('DST-ADDRESS', 17)}TCP-STATE`
			);
			conns.forEach((k, i) =>
				shell.tbl(
					` ${i} SACs ${pad('tcp', 9)}${pad(`${k.from}:${k.port}`, 22)}${pad(SITE + ':443', 17)}established`
				)
			);
			if (!conns.length) {
				shell.hint(tx.hintNoConn);
				return onstate?.('noConn');
			}
			shell.hint(tx.hintSrcnat.replace('{ip}', PUBLIC));
			if (!done.table) tick('table', 'conntrack');
			return;
		}
		if (id === 'nat.add') {
			const a = shell.readArgs(c.args, [
				'chain',
				'action',
				'out-interface',
				'src-address',
				'to-addresses',
				'comment'
			]);
			if (!a) return;
			const miss = ['chain', 'action'].filter((k) => !a[k]);
			if (miss.length)
				return shell.fail(
					`failure: ${miss[0]} not specified`,
					tx.hintNeeds.replace('{keys}', miss.join(', '))
				);
			const chain = a.chain.toLowerCase();
			const action = a.action.toLowerCase();
			const out = a['out-interface']?.toLowerCase();
			if (!['srcnat', 'dstnat'].includes(chain))
				return shell.fail('input does not match any value of chain', tx.hintChain);
			if (!['masquerade', 'src-nat', 'dst-nat', 'accept', 'redirect', 'netmap'].includes(action))
				return shell.fail('input does not match any value of action', tx.hintAction);
			if (out && !PORTS.includes(out))
				return shell.fail('input does not match any value of out-interface', tx.hintOut);
			if (action === 'src-nat' && !a['to-addresses'])
				return shell.fail('failure: to-addresses not specified', tx.hintAction);
			rules = [...rules, { chain, action, out, src: a['src-address'], to: a['to-addresses'] }];
			if (chain !== 'srcnat') {
				shell.hint(tx.hintChain);
				return onstate?.('wrongChain');
			}
			if (out !== 'ether1') {
				shell.hint(tx.hintOut);
				return onstate?.('wrongOut');
			}
			if (action !== 'masquerade' && !(action === 'src-nat' && a['to-addresses'] === PUBLIC)) {
				shell.hint(tx.hintAction);
				return onstate?.('wrongAction');
			}
			shell.hint(tx.hintTryAgain);
			if (!done.rule) tick('rule', action === 'masquerade' ? 'masq' : 'srcnat');
			return;
		}
	}

	function help(m: MId) {
		if (m === 'fail' || m === 'load') return open();
		if (m === 'rule')
			return shell.typeFor(
				'/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade'
			);
		shell.typeFor('/ip firewall connection print');
	}
	const items = $derived<Mission[]>(
		ORDER.map((m, i) => ({ label: tx.missions[i], done: done[m], help: () => help(m) }))
	);
	const btnLabel = $derived(busy ? tx.busy : tx.openBtn.replace('{name}', LAPS[who].name));
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={!live || shell.typing || busy}
	/>

	<button type="button" class="go" disabled={!live || busy} onclick={open}>
		<svg viewBox="0 0 16 16" aria-hidden="true"
			><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.6" /><path
				d="M2 8h12M8 2c2.2 2.4 2.2 9.6 0 12M8 2c-2.2 2.4-2.2 9.6 0 12"
				fill="none"
				stroke="currentColor"
				stroke-width="1.3"
			/></svg
		>
		{btnLabel}
	</button>

	<div class="rigbox">
		<OfficeRig
			identity={shell.identity}
			isp={tx.ispLabel}
			server={tx.serverLabel}
			{serverTone}
			laptops={rigLaps}
			{glow}
			{packet}
			{mark}
		/>
		<p class="cap" class:ok={captionOk}>
			{caption || tx.capIdle}
		</p>
	</div>

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
	.go {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-radius: 999px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand);
		color: #fff;
		font-size: 13px;
		font-weight: 750;
		padding: 8px 16px;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}
	.go svg {
		width: 15px;
		height: 15px;
	}
	.go:hover:not(:disabled) {
		transform: translateY(-1px);
	}
	.go:disabled {
		opacity: 0.55;
	}
	.rigbox {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.cap {
		margin: 0;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		text-align: center;
	}
	.cap.ok {
		color: var(--color-grass);
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.go {
			transition: none;
		}
	}
</style>
