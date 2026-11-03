<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { RouterHotspotText } from '$lib/chapters/netlab/router-hotspot/types';
	import Missions from './routerlab/Missions.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import RosTerminal from './routerlab/RosTerminal.svelte';
	import { RosShell, type Ctx } from './routerlab/shell.svelte';
	import { PORTS, cmd, menu, pad, parseAddr, parseRange, type Mission } from './routerlab/ros';

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
	const tx = $derived(text as RouterHotspotText);
	const live = $derived(beat >= tx.intro.length - 1);

	// ---- Router state ----
	type Hotspot = { iface: string; address: string; pool: string; dnsName: string };
	let hotspot = $state<Hotspot | null>(null);
	type Voucher = { name: string; pass: string; limit: number | null; used: number };
	let vouchers = $state<Voucher[]>([]);
	let glow = $state<string[]>([]);

	// ---- Missions ----
	const ORDER = ['setup', 'voucher', 'login', 'active'] as const;
	type MId = (typeof ORDER)[number];
	let done = $state<Record<MId, boolean>>({
		setup: false,
		voucher: false,
		login: false,
		active: false
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

	// ---- The guest phone ----
	type PhoneState = 'off' | 'joining' | 'noNet' | 'login' | 'online';
	let phone = $state<PhoneState>('off');
	let user = $state('');
	let pass = $state('');
	let loginMsg = $state<'' | 'bad' | 'used' | 'expired'>('');
	let session = $state<{ name: string; start: number; left: number } | null>(null);
	let now = $state(0); // seconds since the session started, on a fake clock
	const phoneIp = $derived(
		hotspot ? (parseRange(hotspot.pool) ? hotspot.pool.split('-')[1] : '10.5.50.254') : ''
	);
	const timers: ReturnType<typeof setTimeout>[] = [];
	$effect(() => () => timers.forEach(clearTimeout));

	function join() {
		if (!live || phone === 'joining') return;
		phone = 'joining';
		glow = ['ether3'];
		timers.push(
			setTimeout(() => {
				if (hotspot) {
					phone = 'login';
					onstate?.('portal');
				} else {
					phone = 'noNet';
					onstate?.('noHotspot');
				}
			}, 900)
		);
	}
	function login(e: Event) {
		e.preventDefault();
		if (!live || phone !== 'login') return;
		const v = vouchers.find((x) => x.name === user.trim() && x.pass === pass);
		if (!v) {
			loginMsg = 'bad';
			return onstate?.('badLogin');
		}
		if (v.limit !== null && v.used >= v.limit) {
			loginMsg = 'used';
			return onstate?.('usedUp');
		}
		loginMsg = '';
		session = { name: v.name, start: v.used, left: v.limit === null ? Infinity : v.limit - v.used };
		now = 0;
		phone = 'online';
		if (!done.login) tick('login', v.limit === null ? 'onlineNoLimit' : 'online');
		else onstate?.('online');
	}
	// the session clock runs for real while the phone is online
	$effect(() => {
		if (phone !== 'online') return;
		const t = setInterval(() => {
			now += 1;
			if (session && now >= session.left) endSession();
		}, 1000);
		return () => clearInterval(t);
	});
	function endSession() {
		if (!session) return;
		const v = vouchers.find((x) => x.name === session!.name);
		if (v) v.used += Math.min(now, session.left);
		session = null;
		phone = 'login';
		loginMsg = 'expired';
		pass = '';
	}
	function skipHour() {
		if (!session) return;
		if (session.left === Infinity) {
			now += 3600;
			return onstate?.('neverEnds');
		}
		now = session.left;
		endSession();
		onstate?.('expired');
	}
	const left = $derived(session ? Math.max(0, session.left - now) : 0);
	const clock = (s: number) => {
		if (s === Infinity) return '∞';
		const m = Math.floor(s / 60);
		const r = Math.floor(s % 60);
		return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
	};
	const ros = (s: number) => {
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const r = Math.floor(s % 60);
		return `${h ? h + 'h' : ''}${m ? m + 'm' : ''}${r}s`;
	};

	// ---- RouterOS ----
	const ROOT = menu({
		interface: menu({ print: cmd('if.print') }),
		ip: menu({
			hotspot: menu({
				setup: cmd('hs.setup'),
				print: cmd('hs.print'),
				user: menu({ add: cmd('u.add'), print: cmd('u.print'), remove: cmd('u.remove') }),
				active: menu({ print: cmd('a.print') })
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

	function parseUptime(v: string): number | null {
		const r = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(v.trim());
		if (!r || !v.trim()) return null;
		const s = Number(r[1] ?? 0) * 3600 + Number(r[2] ?? 0) * 60 + Number(r[3] ?? 0);
		return s > 0 ? s : null;
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
				shell.tbl(` ${i} ${i < 3 ? 'R' : ' '} ${pad(p, 8)}${pad('ether', 7)}1500`)
			);
			glow = ['ether3'];
			return;
		}
		if (id === 'hs.setup') {
			if (!shell.bare(c)) return;
			if (hotspot) return shell.fail('failure: hotspot already set up on ' + hotspot.iface);
			shell.hint(tx.hintWizard);
			shell.ask(
				[
					{
						label: 'hotspot interface',
						def: 'ether1',
						check: (v) => (v === 'ether3' ? null : tx.hintIface)
					},
					{
						label: 'local address of network',
						def: '10.5.50.1/24',
						check: (v) => (parseAddr(v) && v.includes('/') ? null : tx.hintWizard)
					},
					{ label: 'masquerade network', def: 'yes' },
					{
						label: 'address pool of network',
						def: '10.5.50.2-10.5.50.254',
						check: (v) => (parseRange(v) ? null : tx.hintWizard)
					},
					{ label: 'select certificate', def: 'none' },
					{ label: 'dns servers', def: '8.8.8.8' },
					{ label: 'dns name', def: 'wifi.nimbus.com' }
				],
				([iface, address, , pool, , , dnsName]) => {
					hotspot = { iface, address, pool, dnsName };
					glow = ['ether3'];
					shell.add('ok', `hotspot1 is running on ${iface}`);
					if (phone === 'noNet') phone = 'off';
					tick('setup', 'setup');
				}
			);
			return;
		}
		if (id === 'hs.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` # ${pad('NAME', 10)}${pad('INTERFACE', 11)}${pad('ADDRESS-POOL', 14)}PROFILE`);
			if (hotspot)
				shell.tbl(
					` 0 ${pad('hotspot1', 10)}${pad(hotspot.iface, 11)}${pad('hs-pool-3', 14)}hsprof1`
				);
			else shell.hint(tx.hintNoHotspot);
			return;
		}
		if (id === 'u.add') {
			const a = shell.readArgs(c.args, ['name', 'password', 'limit-uptime', 'profile', 'server']);
			if (!a) return;
			const miss = ['name', 'password'].filter((k) => !a[k]);
			if (miss.length)
				return shell.fail(
					`failure: ${miss[0]} not specified`,
					tx.hintNeeds.replace('{keys}', miss.join(', '))
				);
			if (vouchers.some((v) => v.name === a.name))
				return shell.fail('failure: already have user with this name');
			let limit: number | null = null;
			if (a['limit-uptime'] !== undefined) {
				limit = parseUptime(a['limit-uptime']);
				if (limit === null)
					return shell.fail('invalid value for argument limit-uptime', tx.hintUptime);
			}
			vouchers = [...vouchers, { name: a.name, pass: a.password, limit, used: 0 }];
			shell.hint(tx.hintVoucher.replace('{user}', a.name).replace('{pass}', a.password));
			if (limit === null) {
				shell.hint(tx.hintUptime);
				return onstate?.('noLimit');
			}
			if (!done.voucher) tick('voucher', limit === 3600 ? 'voucher' : 'otherLimit');
			return;
		}
		if (id === 'u.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` # ${pad('NAME', 10)}${pad('PASSWORD', 10)}${pad('LIMIT-UPTIME', 14)}UPTIME`);
			vouchers.forEach((v, i) =>
				shell.tbl(
					` ${i} ${pad(v.name, 10)}${pad(v.pass, 10)}${pad(v.limit === null ? '' : ros(v.limit), 14)}${ros(v.used + (session?.name === v.name ? now : 0))}`
				)
			);
			return;
		}
		if (id === 'u.remove') {
			const w = c.rest[0]?.w;
			const i = vouchers.findIndex((v, k) => v.name === w || String(k) === w);
			if (i < 0) return shell.fail('no such item');
			vouchers = vouchers.filter((_, k) => k !== i);
			return;
		}
		if (id === 'a.print') {
			if (!shell.bare(c)) return;
			shell.tbl(` # ${pad('USER', 9)}${pad('ADDRESS', 13)}${pad('UPTIME', 9)}SESSION-TIME-LEFT`);
			if (!session) {
				shell.hint(tx.hintNoActive);
				return onstate?.('noActive');
			}
			shell.tbl(
				` 0 ${pad(session.name, 9)}${pad(phoneIp, 13)}${pad(ros(now), 9)}${session.left === Infinity ? '' : ros(left)}`
			);
			glow = ['ether3'];
			if (!done.active) tick('active', 'active');
			return;
		}
	}

	function help(m: MId) {
		if (m === 'setup') {
			if (shell.wizard) {
				const q = shell.wizard.qs[shell.wizard.i];
				return shell.typeFor(q.label === 'hotspot interface' ? 'ether3' : q.def);
			}
			return shell.typeFor('/ip hotspot setup');
		}
		if (m === 'voucher')
			return shell.typeFor('/ip hotspot user add name=kopi42 password=1234 limit-uptime=1h');
		if (m === 'login') {
			if (phone === 'off' || phone === 'noNet') return join();
			const v = vouchers.find((x) => x.limit === null || x.used < x.limit) ?? vouchers[0];
			if (v && phone === 'login') {
				user = v.name;
				pass = v.pass;
			}
			return;
		}
		shell.typeFor('/ip hotspot active print');
	}
	const items = $derived<Mission[]>(
		ORDER.map((m, i) => ({ label: tx.missions[i], done: done[m], help: () => help(m) }))
	);
	const busy = $derived(!live || shell.typing);
</script>

<div class="wrap">
	<Missions
		label={tx.missionsLabel}
		{items}
		hintBtn={tx.hintBtn}
		doneNote={tx.doneNote}
		disabled={busy}
	/>

	<div class="phone" aria-live="polite">
		<div class="pbar">
			<span class="wifi" class:on={phone !== 'off'}>
				<svg viewBox="0 0 16 12" aria-hidden="true"
					><path d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7a6 6 0 0 1 8 0M6.5 9.5a2.4 2.4 0 0 1 3 0" /></svg
				>
				{phone === 'off' ? '' : tx.wifiName}
			</span>
			{#if phone === 'online'}<span class="clock">{clock(left)}</span>{/if}
		</div>
		<div class="pscreen">
			{#if phone === 'off'}
				<button type="button" class="pbtn" disabled={busy} onclick={join}
					>{tx.phone.joinBtn.replace('{wifi}', tx.wifiName)}</button
				>
			{:else if phone === 'joining'}
				<p class="pnote">{tx.phone.joining}</p>
			{:else if phone === 'noNet'}
				<p class="pnote bad">{tx.phone.noNet}</p>
				<button type="button" class="pbtn ghost" disabled={busy} onclick={join}
					>{tx.phone.retry}</button
				>
			{:else if phone === 'login'}
				<div class="url">{hotspot?.dnsName ?? 'wifi.nimbus.com'}/login</div>
				<form class="portal" onsubmit={login}>
					<strong>{tx.phone.loginTitle}</strong>
					<span class="psub">{tx.phone.loginSub}</span>
					<input
						bind:value={user}
						placeholder={tx.phone.user}
						aria-label={tx.phone.user}
						autocapitalize="off"
						autocomplete="off"
						spellcheck="false"
						disabled={!live}
					/>
					<input
						bind:value={pass}
						type="password"
						placeholder={tx.phone.pass}
						aria-label={tx.phone.pass}
						autocomplete="off"
						disabled={!live}
					/>
					{#if loginMsg}<span class="perr">{tx.phone[loginMsg]}</span>{/if}
					<button type="submit" class="pbtn" disabled={!live}>{tx.phone.loginBtn}</button>
				</form>
			{:else if phone === 'online' && session}
				<div class="url">wifi.nimbus.com/status</div>
				<p class="pok">{tx.phone.welcome.replace('{user}', session.name)}</p>
				<p class="pleft">{tx.phone.left} <b>{clock(left)}</b></p>
				<p class="psite">{tx.phone.siteOk}</p>
				<button type="button" class="pbtn ghost" disabled={!live} onclick={skipHour}
					>{tx.phone.skip}</button
				>
			{/if}
		</div>
	</div>

	<OfficeRig
		identity={shell.identity}
		isp={tx.ispLabel}
		laptops={[
			{ name: 'Sari', ip: '192.168.88.254', tone: 'ok' },
			{ name: 'Budi', ip: '192.168.88.253', tone: 'ok' }
		]}
		ap={{ label: tx.apLabel, on: !!hotspot, sub: hotspot ? hotspot.address : undefined }}
		{glow}
	/>

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

	/* ---- The guest phone ---- */
	.phone {
		width: 210px;
		max-width: 100%;
		border-radius: 26px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 9px 12px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.pbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 6px 6px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.wifi {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		color: var(--color-faint);
	}
	.wifi.on {
		color: var(--color-brand);
	}
	.wifi svg {
		width: 14px;
		height: 11px;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.clock {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		color: var(--color-grass);
	}
	.pscreen {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 7px;
		min-height: 170px;
		border-radius: 16px;
		background: var(--color-paper);
		padding: 10px;
		text-align: center;
	}
	.url {
		align-self: center;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		color: var(--color-muted);
		background: var(--color-card);
		border: 1px solid var(--color-line);
		border-radius: 999px;
		padding: 2px 9px;
	}
	.portal {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.portal strong {
		font-size: 13px;
		color: var(--color-ink);
	}
	.psub {
		font-size: 10.5px;
		color: var(--color-muted);
	}
	.portal input {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 8px;
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 12px;
		padding: 5px 8px;
	}
	.pbtn {
		border-radius: 999px;
		border: 1px solid var(--color-brand);
		background: var(--color-brand);
		color: #fff;
		font-size: 12px;
		font-weight: 750;
		padding: 6px 12px;
	}
	.pbtn.ghost {
		background: var(--color-card);
		color: var(--color-brand);
	}
	.pbtn:disabled {
		opacity: 0.55;
	}
	.pnote {
		margin: 0;
		font-size: 12px;
		font-weight: 650;
		color: var(--color-muted);
	}
	.pnote.bad,
	.perr {
		color: var(--color-danger);
		font-size: 11px;
		font-weight: 700;
	}
	.pok {
		margin: 0;
		font-size: 13px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.pleft,
	.psite {
		margin: 0;
		font-size: 11.5px;
		color: var(--color-ink);
	}
	.pleft b {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	.psite {
		color: var(--color-muted);
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 12px;
		}
	}
</style>
