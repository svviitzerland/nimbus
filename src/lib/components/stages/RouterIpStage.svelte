<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RouterIpText } from '$lib/chapters/netlab/router-ip/types';
	import Missions from './routerlab/Missions.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import RosTerminal from './routerlab/RosTerminal.svelte';
	import { RosShell, type Ctx } from './routerlab/shell.svelte';
	import {
		cmd,
		intToIp,
		ipToInt,
		menu,
		pad,
		parseAddr,
		parseRange,
		PORTS,
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
	const tx = $derived(text as RouterIpText);
	const live = $derived(beat >= tx.intro.length - 1);

	// ---- The office, carried over from router-intro (ether2 is 192.168.88.1/24) ----
	type Lap = {
		name: string;
		host: string;
		mac: string;
		plugged: boolean;
		state: 'idle' | 'asking' | 'apipa' | 'bound';
		ip?: string;
	};
	let laps = $state<Lap[]>([
		{ name: 'Sari', host: 'sari-laptop', mac: '3C:22:FB:10:2A:01', plugged: false, state: 'idle' },
		{ name: 'Budi', host: 'budi-pc', mac: 'A4:83:E7:5C:19:B2', plugged: false, state: 'idle' },
		{ name: 'Dewi', host: 'dewi-mac', mac: 'F0:18:98:6D:44:C3', plugged: false, state: 'idle' }
	]);
	type Pool = { name: string; from: number; to: number };
	let pools = $state<Pool[]>([]);
	type Net = { address: string; gateway: string; dns: string };
	let nets = $state<Net[]>([]);
	type Server = { name: string; iface: string; pool: string; disabled: boolean; lease: string };
	let servers = $state<Server[]>([]);
	let glow = $state<string[]>([]);

	const active = $derived(
		servers.find((s) => !s.disabled && s.iface === 'ether2' && pools.some((p) => p.name === s.pool))
	);
	const rigLaps = $derived<RigLaptop[]>(
		laps.map((l) => ({
			name: l.name,
			plugged: l.plugged,
			ip: l.state === 'bound' || l.state === 'apipa' ? l.ip : undefined,
			tone:
				l.state === 'bound'
					? 'ok'
					: l.state === 'apipa'
						? 'bad'
						: l.state === 'asking'
							? 'wait'
							: 'idle'
		}))
	);
	const anyBound = $derived(laps.some((l) => l.state === 'bound'));

	// ---- Missions ----
	const ORDER = ['plug', 'pool', 'network', 'server', 'leases'] as const;
	type MId = (typeof ORDER)[number];
	let done = $state<Record<MId, boolean>>({
		plug: false,
		pool: false,
		network: false,
		server: false,
		leases: false
	});
	let finished = false;
	/** Tick missions; Nim says `token` unless this was the last one. */
	function tick(ids: MId[], token: string) {
		for (const id of ids) done[id] = true;
		if (ORDER.every((m) => done[m])) {
			if (!finished) {
				finished = true;
				onstate?.('done');
				oncomplete?.();
				return;
			}
		}
		onstate?.(token);
	}

	// ---- DHCP, in tiny steps with timers ----
	const timers: ReturnType<typeof setTimeout>[] = [];
	const later = (ms: number, f: () => void) => timers.push(setTimeout(f, ms));
	$effect(() => () => timers.forEach(clearTimeout));

	function nextFree(): string | undefined {
		const p = pools.find((x) => x.name === active?.pool);
		if (!p) return undefined;
		const used = new Set(laps.filter((l) => l.state === 'bound').map((l) => l.ip));
		// RouterOS hands out from the top of the range first
		for (let n = p.to; n >= p.from; n--) if (!used.has(intToIp(n))) return intToIp(n);
		return undefined;
	}
	function ask(i: number) {
		const l = laps[i];
		if (!l.plugged || l.state === 'bound') return;
		laps[i].state = 'asking';
		glow = ['ether2'];
		later(active ? 900 : 1600, () => {
			if (active) {
				const ip = nextFree();
				if (ip) {
					laps[i].state = 'bound';
					laps[i].ip = ip;
					if (!done.plug) tick(['plug'], 'gotIp');
					else if (!pendingServerReaction) onstate?.('gotIp');
					return;
				}
			}
			laps[i].state = 'apipa';
			laps[i].ip = `169.254.${37 + i * 41}.${12 + i * 7}`;
			shell.hint(tx.hintApipa);
			if (!done.plug) tick(['plug'], 'noIp');
		});
	}
	let pendingServerReaction = false;
	function plug(i: number) {
		if (!live || laps[i].plugged) return;
		laps[i].plugged = true;
		ask(i);
	}
	function serverUp() {
		// every waiting laptop asks again and now gets an answer
		pendingServerReaction = true;
		laps.forEach((l, i) => {
			if (l.plugged && l.state !== 'bound') ask(i);
		});
		later(1200, () => (pendingServerReaction = false));
	}

	// ---- RouterOS ----
	const ROOT = menu({
		interface: menu({ print: cmd('if.print') }),
		ip: menu({
			address: menu({ print: cmd('addr.print') }),
			pool: menu({ add: cmd('pool.add'), print: cmd('pool.print') }),
			'dhcp-server': menu({
				add: cmd('srv.add'),
				print: cmd('srv.print'),
				enable: cmd('srv.enable'),
				setup: cmd('srv.setup'),
				network: menu({ add: cmd('net.add'), print: cmd('net.print') }),
				lease: menu({ print: cmd('lease.print') })
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

	const OFFICE = parseAddr('192.168.88.0/24')!;
	const inOffice = (n: number) => n > ipToInt('192.168.88.0') && n < ipToInt('192.168.88.255');

	function needs(a: Record<string, string>, keys: string[]) {
		const miss = keys.filter((k) => !a[k]);
		if (!miss.length) return true;
		shell.fail(
			`failure: ${miss[0]} not specified`,
			tx.hintNeeds.replace('{keys}', miss.join(', '))
		);
		return false;
	}
	function checkRange(v: string) {
		const r = parseRange(v);
		if (!r) return 'bad';
		if (!inOffice(r.from) || !inOffice(r.to) || ipToInt('192.168.88.1') >= r.from) {
			if (ipToInt('192.168.88.1') >= r.from && inOffice(r.to)) return 'gw';
			return 'out';
		}
		return null;
	}
	function addPool(name: string, ranges: string) {
		const bad = checkRange(ranges);
		if (bad === 'bad') {
			shell.fail('invalid value for argument ranges', tx.hintPoolRange, 'poolBad');
			return false;
		}
		if (bad) {
			shell.err(
				bad === 'gw'
					? 'warning: range includes 192.168.88.1 (the router itself)'
					: 'warning: range is outside 192.168.88.0/24'
			);
			shell.hint(tx.hintPoolRange);
			onstate?.('poolBad');
			return false;
		}
		const r = parseRange(ranges)!;
		pools = [...pools.filter((p) => p.name !== name), { name, ...r }];
		return true;
	}
	function addNet(address: string, gateway: string, dns: string) {
		const p = parseAddr(address);
		if (!p || p.network !== OFFICE.network || p.prefix !== 24) {
			shell.fail('invalid value for argument address', tx.hintPoolRange, 'error');
			return false;
		}
		if (gateway !== '192.168.88.1') {
			shell.fail(`warning: gateway ${gateway} is not this router`, tx.hintGateway, 'gatewayBad');
			return false;
		}
		nets = [{ address: `${p.network}/24`, gateway, dns }];
		return true;
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
			const run = new Set(['ether1', ...(laps.some((l) => l.plugged) ? ['ether2'] : [])]);
			PORTS.forEach((p, i) =>
				shell.tbl(` ${i} ${run.has(p) ? 'R' : ' '} ${pad(p, 8)}${pad('ether', 7)}1500`)
			);
			return;
		}
		if (id === 'addr.print') {
			if (!shell.bare(c)) return;
			shell.tbl('Flags: D - DYNAMIC');
			shell.tbl(` #   ${pad('ADDRESS', 17)}${pad('NETWORK', 14)}INTERFACE`);
			shell.tbl(` 0 D ${pad('10.20.30.2/24', 17)}${pad('10.20.30.0', 14)}ether1`);
			shell.tbl(` 1   ${pad('192.168.88.1/24', 17)}${pad('192.168.88.0', 14)}ether2`);
			glow = ['ether2'];
			return;
		}
		if (id === 'pool.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` # ${pad('NAME', 12)}RANGES`);
			pools.forEach((p, i) =>
				shell.tbl(` ${i} ${pad(p.name, 12)}${intToIp(p.from)}-${intToIp(p.to)}`)
			);
			return;
		}
		if (id === 'pool.add') {
			const a = shell.readArgs(c.args, ['name', 'ranges', 'comment']);
			if (!a || !needs(a, ['name', 'ranges'])) return;
			if (addPool(a.name, a.ranges)) tick(['pool'], 'pool');
			return;
		}
		if (id === 'net.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` # ${pad('ADDRESS', 17)}${pad('GATEWAY', 14)}DNS-SERVER`);
			nets.forEach((n, i) => shell.tbl(` ${i} ${pad(n.address, 17)}${pad(n.gateway, 14)}${n.dns}`));
			return;
		}
		if (id === 'net.add') {
			const a = shell.readArgs(c.args, ['address', 'gateway', 'dns-server', 'comment']);
			if (!a || !needs(a, ['address', 'gateway'])) return;
			if (addNet(a.address, a.gateway, a['dns-server'] ?? '192.168.88.1'))
				tick(['network'], 'network');
			return;
		}
		if (id === 'srv.print') {
			if (!shell.bare(c)) return;
			shell.tbl('Flags: X - DISABLED');
			shell.tbl(
				` #   ${pad('NAME', 8)}${pad('INTERFACE', 11)}${pad('ADDRESS-POOL', 14)}LEASE-TIME`
			);
			servers.forEach((s, i) =>
				shell.tbl(
					` ${i} ${s.disabled ? 'X' : ' '} ${pad(s.name, 8)}${pad(s.iface, 11)}${pad(s.pool, 14)}${s.lease}`
				)
			);
			return;
		}
		if (id === 'srv.add') {
			const a = shell.readArgs(c.args, [
				'name',
				'interface',
				'address-pool',
				'disabled',
				'lease-time'
			]);
			if (!a || !needs(a, ['interface'])) return;
			const iface = a.interface.toLowerCase();
			if (!PORTS.includes(iface))
				return shell.fail('input does not match any value of interface', tx.hintIface);
			const pool = a['address-pool'] ?? 'static-only';
			if (pool !== 'static-only' && !pools.some((p) => p.name === pool))
				return shell.fail('input does not match any value of address-pool', tx.hintNoPool);
			const name = a.name ?? `dhcp${servers.length + 1}`;
			const disabled = (a.disabled ?? 'yes') !== 'no';
			servers = [
				...servers.filter((s) => s.name !== name),
				{ name, iface, pool, disabled, lease: a['lease-time'] ?? '30m' }
			];
			glow = [iface];
			if (iface !== 'ether2') {
				shell.hint(tx.hintIface);
				return onstate?.('wrongPort');
			}
			if (pool === 'static-only') {
				shell.hint(tx.hintNoPool);
				return onstate?.('noPool');
			}
			if (disabled) {
				shell.hint(tx.hintDisabled);
				return onstate?.('disabled');
			}
			serverUp();
			tick(['server'], 'server');
			return;
		}
		if (id === 'srv.enable') {
			const target = c.rest[0]?.w ?? c.args.find((x) => x.k === 'numbers')?.v;
			const s = servers.find((x, i) => x.name === target || String(i) === target);
			if (!s) return shell.fail('no such item');
			s.disabled = false;
			servers = [...servers];
			if (s.iface === 'ether2' && pools.some((p) => p.name === s.pool)) {
				serverUp();
				tick(['server'], 'server');
			}
			return;
		}
		if (id === 'srv.setup') {
			if (!shell.bare(c)) return;
			shell.hint(tx.hintWizard);
			shell.ask(
				[
					{
						label: 'dhcp server interface',
						def: 'ether2',
						check: (v) => (v === 'ether2' ? null : tx.hintIface)
					},
					{
						label: 'dhcp address space',
						def: '192.168.88.0/24',
						check: (v) => (parseAddr(v)?.network === OFFICE.network ? null : tx.hintPoolRange)
					},
					{
						label: 'gateway for dhcp network',
						def: '192.168.88.1',
						check: (v) => (v === '192.168.88.1' ? null : tx.hintGateway)
					},
					{
						label: 'addresses to give out',
						def: '192.168.88.10-192.168.88.254',
						check: (v) => (checkRange(v) ? tx.hintPoolRange : null)
					},
					{ label: 'dns servers', def: '8.8.8.8' },
					{ label: 'lease time', def: '30m' }
				],
				([iface, space, gw, range, dns, lease]) => {
					addPool('dhcp_pool0', range);
					addNet(space, gw, dns);
					servers = [
						...servers.filter((s) => s.name !== 'dhcp1'),
						{ name: 'dhcp1', iface, pool: 'dhcp_pool0', disabled: false, lease }
					];
					shell.add('ok', 'dhcp1 created and running on ' + iface);
					glow = ['ether2'];
					serverUp();
					tick(['pool', 'network', 'server'], 'wizard');
				}
			);
			return;
		}
		if (id === 'lease.print') {
			if (!shell.bare(c)) return;
			const bound = laps.filter((l) => l.state === 'bound');
			shell.tbl('Flags: D - DYNAMIC');
			shell.tbl(
				` #   ${pad('ADDRESS', 16)}${pad('MAC-ADDRESS', 19)}${pad('HOST-NAME', 13)}${pad('SERVER', 8)}STATUS`
			);
			bound.forEach((l, i) => {
				const srv = servers.find((s) => !s.disabled)?.name ?? 'dhcp1';
				shell.tbl(
					` ${i} D ${pad(l.ip!, 16)}${pad(l.mac, 19)}${pad(l.host, 13)}${pad(srv, 8)}bound`
				);
			});
			if (!bound.length) {
				shell.hint(tx.hintNoLease);
				return onstate?.('noLease');
			}
			shell.hint(tx.hintBound);
			tick(['leases'], 'leases');
			return;
		}
	}

	const MCMD: Partial<Record<MId, string>> = {
		pool: '/ip pool add name=office ranges=192.168.88.10-192.168.88.254',
		network:
			'/ip dhcp-server network add address=192.168.88.0/24 gateway=192.168.88.1 dns-server=8.8.8.8',
		server: '/ip dhcp-server add name=dhcp1 interface=ether2 address-pool=office disabled=no',
		leases: '/ip dhcp-server lease print'
	};
	function help(m: MId) {
		if (m === 'plug') return plug(laps.findIndex((l) => !l.plugged));
		let line = MCMD[m]!;
		// keep the help consistent with a pool the learner already made under another name
		if (m === 'server' && pools.length && !pools.some((p) => p.name === 'office'))
			line = line.replace('address-pool=office', `address-pool=${pools[0].name}`);
		shell.typeFor(line);
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

	<div class="rigbox">
		<OfficeRig
			identity={shell.identity}
			isp={tx.ispLabel}
			laptops={rigLaps}
			{glow}
			gateway="192.168.88.1"
			pluggable={live}
			onlaptop={plug}
		/>
		<p class="cap" class:ok={anyBound}>{anyBound ? tx.gotCaption : tx.plugCaption}</p>
	</div>

	<RosTerminal {shell} {live} inputLabel={tx.inputLabel} />
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
</style>
