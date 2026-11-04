<script lang="ts">
	// Guided hotspot lesson. Next to the office drawing sits a guest phone. The terminal runs the
	// hotspot wizard (the access point on ether3 lights up and the phone lands on the login page),
	// prints a one hour voucher, the guest logs in by themselves, and when the hour runs out
	// (fast forwarded) the phone is sent back to the login page. The learner prints the vouchers.
	import type { StageProps } from '$lib/chapters/types';
	import type { RouterHotspotText } from '$lib/chapters/netlab/router-hotspot/types';
	import RosLab from './routerlab/RosLab.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import { isCmd, toLn, unknownLines, type Act, type Ln } from './routerlab/lab';
	import { pad } from './routerlab/ros';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RouterHotspotText);
	const live = $derived(beat >= tx.intro.length - 1);

	type Phone = 'search' | 'login' | 'typing' | 'online' | 'expired';
	let setup = $state(false);
	let voucher = $state(false);
	let phone = $state<Phone>('search');
	let left = $state(3600); // seconds on the voucher
	let timer: ReturnType<typeof setInterval> | undefined;
	let pause: ReturnType<typeof setTimeout> | undefined;
	function stopClock() {
		clearInterval(timer);
		clearTimeout(pause);
	}
	$effect(() => stopClock);

	const clock = (s: number) => {
		const m = Math.floor(s / 60);
		const r = s % 60;
		return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
	};

	const scripts = $derived<Act[][]>([
		[],
		[],
		[],
		[
			{
				cmd: '/ip hotspot setup',
				key: 'setup',
				out: [
					'hotspot interface: ether3',
					'local address of network: 10.5.50.1/24',
					'masquerade network: yes',
					'address pool of network: 10.5.50.2-10.5.50.254',
					'dns name: wifi.nimbus.com',
					tx.hintSetup
				]
			}
		],
		[
			{
				cmd: '/ip hotspot user add name=kopi42 password=1234 limit-uptime=1h',
				key: 'voucher',
				out: [tx.hintVoucher]
			}
		],
		[
			{ key: 'login', wait: 2400 },
			{
				cmd: '/ip hotspot active print',
				out: [
					` #   ${pad('USER', 8)}${pad('ADDRESS', 13)}${pad('UPTIME', 8)}SESSION-TIME-LEFT`,
					` 0   ${pad('kopi42', 8)}${pad('10.5.50.254', 13)}${pad('12s', 8)}59m48s`
				]
			}
		],
		[{ key: 'expire' }],
		[],
		[],
		[]
	]);

	function onreset() {
		stopClock();
		setup = false;
		voucher = false;
		phone = 'search';
		left = 3600;
	}
	function onact(key: string, instant: boolean) {
		if (key === 'setup') {
			setup = true;
			phone = 'login';
		}
		if (key === 'voucher') voucher = true;
		if (key === 'login') {
			left = 3600;
			if (instant) {
				phone = 'online';
				return;
			}
			phone = 'typing';
			pause = setTimeout(() => (phone = 'online'), 1300);
		}
		if (key === 'expire') {
			if (instant) {
				left = 0;
				phone = 'expired';
				return;
			}
			// fast forward the hour in about three seconds
			pause = setTimeout(() => {
				timer = setInterval(() => {
					left = Math.max(0, left - 97);
					if (left === 0) {
						clearInterval(timer);
						pause = setTimeout(() => (phone = 'expired'), 500);
					}
				}, 80);
			}, 700);
		}
	}

	function onrun(line: string): Ln[] {
		if (isCmd(line, '/ip hotspot user print')) {
			onstate?.('users');
			return [
				'Flags: X - DISABLED, D - DYNAMIC',
				` #   ${pad('NAME', 9)}${pad('LIMIT-UPTIME', 14)}UPTIME`,
				` 0   ${pad('kopi42', 9)}${pad('1h', 14)}1h`
			].map(toLn);
		}
		if (isCmd(line, '/ip hotspot active print')) {
			onstate?.('active');
			return [
				` #   ${pad('USER', 8)}${pad('ADDRESS', 13)}${pad('UPTIME', 8)}SESSION-TIME-LEFT`
			].map(toLn);
		}
		onstate?.('error');
		return unknownLines(line, '/ip hotspot user print', tx);
	}

	const showCreds = $derived(phone === 'typing' || phone === 'online');
</script>

<RosLab
	steps={tx.steps}
	{beat}
	{scripts}
	{live}
	suggestion="/ip hotspot user print"
	inputLabel={tx.inputLabel}
	tryLabel={tx.tryLabel}
	termHint={tx.termHint}
	{onrun}
	{onact}
	{onreset}
	{onshow}
	{oncomplete}
>
	{#snippet art()}
		<div class="row">
			<div class="rig">
				<OfficeRig
					isp={tx.ispLabel}
					laptops={[
						{ name: 'Sari', ip: '192.168.88.254', tone: 'ok' },
						{ name: 'Budi', ip: '192.168.88.253', tone: 'ok' }
					]}
					ap={{ label: tx.apLabel, on: setup, sub: setup ? '10.5.50.1' : undefined }}
					glow={beat === 1 || beat === 3 ? ['ether3'] : []}
					gateway="192.168.88.1"
				/>
			</div>
			<div class="phone" aria-live="polite">
				<div class="pbar">
					<svg viewBox="0 0 16 12" aria-hidden="true" class:on={setup}
						><path
							d="M1.5 4.5a9.5 9.5 0 0 1 13 0M4 7a6 6 0 0 1 8 0M6.5 9.5a2.4 2.4 0 0 1 3 0"
						/></svg
					>
					<span>{setup ? tx.wifiName : ''}</span>
				</div>
				<div class="screen">
					{#if phone === 'search'}
						<p class="note">{tx.phone.searching}</p>
					{:else if phone === 'online'}
						<p class="ok">{tx.phone.welcome.replace('{user}', 'kopi42')}</p>
						<p class="small">{tx.phone.left}</p>
						<p class="clock">{clock(left)}</p>
						<p class="small good">{tx.phone.siteOk}</p>
					{:else}
						<strong>{tx.phone.loginTitle}</strong>
						{#if phone === 'expired'}
							<span class="bad">{tx.phone.expired}</span>
						{:else}
							<span class="small">{tx.phone.loginSub}</span>
						{/if}
						<span class="field" aria-label={tx.phone.user}
							>{showCreds ? 'kopi42' : tx.phone.user}</span
						>
						<span class="field" aria-label={tx.phone.pass}
							>{showCreds ? '••••' : tx.phone.pass}</span
						>
						<span class="btn" class:press={phone === 'typing'}>{tx.phone.loginBtn}</span>
						{#if voucher && phone === 'login'}<span class="slip">kopi42, 1234</span>{/if}
					{/if}
				</div>
			</div>
		</div>
	{/snippet}
</RosLab>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
	}
	.rig {
		flex: 1;
		min-width: 0;
	}
	.phone {
		flex: none;
		width: 112px;
		border: 2px solid var(--color-ink);
		border-radius: 18px;
		background: var(--color-card);
		padding: 6px 6px 10px;
		box-shadow: 0 10px 22px rgba(22, 40, 60, 0.1);
	}
	.pbar {
		display: flex;
		align-items: center;
		gap: 4px;
		height: 14px;
		padding: 0 4px;
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.pbar svg {
		width: 11px;
		height: 9px;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.pbar svg.on {
		stroke: var(--color-brand);
	}
	/* a 112px wide phone about twice as tall as it is wide, like a real one */
	.screen {
		display: flex;
		min-height: 186px;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		border-radius: 10px;
		background: var(--color-paper);
		padding: 8px 7px;
		text-align: center;
		font-size: 10px;
		line-height: 1.3;
		color: var(--color-ink);
	}
	.screen p {
		margin: 0;
	}
	strong {
		font-size: 10.5px;
	}
	.note,
	.small {
		color: var(--color-muted);
		font-size: 9.5px;
	}
	.good,
	.ok {
		color: var(--color-grass);
		font-weight: 700;
	}
	.bad {
		color: var(--color-danger);
		font-size: 9.5px;
		font-weight: 700;
	}
	.clock {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		font-weight: 800;
	}
	.field {
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		padding: 3px 5px;
		text-align: left;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		color: var(--color-faint);
	}
	.btn {
		border-radius: 6px;
		background: var(--color-brand);
		padding: 3px 0;
		font-size: 9.5px;
		font-weight: 700;
		color: #fff;
		transition: transform 0.2s;
	}
	.btn.press {
		transform: scale(0.94);
	}
	.slip {
		align-self: center;
		border: 1px solid var(--color-amber);
		border-radius: 4px;
		background: var(--color-amber-soft);
		padding: 1px 5px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9px;
		font-weight: 700;
	}
	@media (prefers-reduced-motion: reduce) {
		.btn {
			transition: none;
		}
	}
</style>
