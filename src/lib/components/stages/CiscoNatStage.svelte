<script lang="ts">
	import { untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiscoNatText } from '$lib/chapters/netlab/cisco-nat/types';
	import LabGuide from './ciscolab/LabGuide.svelte';
	import CiscoRig, {
		ISP,
		LAPTOP_Y,
		NET,
		ROUTER_C,
		SWITCH_Y,
		lapXs,
		type Lap,
		type Pkt
	} from './ciscolab/CiscoRig.svelte';
	import { IosShell, type Run, type Trans } from './ciscolab/shell.svelte';
	import { Director } from './ciscolab/director';
	import { Anim } from './ciscolab/anim';
	import { officeRouter } from './ciscolab/ios';
	import { nimToken, portLooks } from './ciscolab/look';

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
	const tx = $derived(text as CiscoNatText);
	const live = $derived(beat >= tx.intro.length - 1);
	let done = $state(false);

	// Beats: 0 a packet gets lost, 1 the NAT idea, 2 inside and outside, 3 the access list,
	// 4 the wildcard trick, 5 the overload rule, 6 everyone opens nimbus.com, 7 the translation
	// table, 8 MikroTik and the cloud, 9 your turn.
	const FAIL_BEAT = 0;
	const BROWSE_BEAT = 6;
	const SCRIPTS: string[][] = [
		[],
		[],
		[
			'configure terminal',
			'interface g0/1',
			'ip nat inside',
			'interface g0/0',
			'ip nat outside',
			'exit'
		],
		['access-list 1 permit 192.168.88.0 0.0.0.255'],
		[],
		['ip nat inside source list 1 interface g0/0 overload', 'end'],
		[],
		['show ip nat translations'],
		[],
		[]
	];
	const PUBLIC = '10.20.30.2';
	const SITE = '104.21.5.9';
	const LAPS = [
		{ name: 'Sari', mac: '0050.b6a1.0011', port: 51234 },
		{ name: 'Budi', mac: '0050.b6a1.0012', port: 51877 },
		{ name: 'Dewi', mac: '0050.b6a1.0013', port: 52410 }
	];

	function onrun(r: Run) {
		if (!live) return;
		if (r.id === 'show.nat' && !done) {
			done = true;
			onstate?.('task');
		} else if (r.id === 'clear.nat') onstate?.('cleared');
	}
	const shell = new IosShell({
		dev: 'router',
		cfg: officeRouter(2),
		text: () => tx,
		onrun,
		onerror: (t) => {
			if (live) onstate?.(nimToken(t, tx.reactions));
		}
	});
	const leaseAll = () => {
		for (const l of LAPS) shell.lease(l.name, l.mac);
	};
	leaseAll();
	const ipOf = (i: number) => shell.bindings.find((b) => b.name === LAPS[i].name)?.ip ?? '';

	// ---- packets ----
	const anim = new Anim();
	let packet = $state<Pkt | null>(null);
	let mark = $state<{ x: number; y: number } | null>(null);
	let tones = $state<Lap['tone'][]>(['idle', 'idle', 'idle']);
	let serverTone = $state<'idle' | 'ok' | 'bad'>('idle');

	function entry(i: number): Trans {
		return {
			proto: 'tcp',
			inGlobal: `${PUBLIC}:${LAPS[i].port}`,
			inLocal: `${ipOf(i)}:${LAPS[i].port}`,
			outLocal: `${SITE}:443`,
			outGlobal: `${SITE}:443`
		};
	}
	const failEnd = () => {
		packet = null;
		mark = { x: ISP.x + 30, y: ISP.y - 10 };
		tones = ['bad', 'idle', 'idle'];
	};
	const browseEnd = () => {
		packet = null;
		mark = null;
		tones = ['ok', 'ok', 'ok'];
		serverTone = 'ok';
		shell.trans = LAPS.map((_, i) => entry(i));
	};

	function settled(b: number, instant: boolean) {
		if (b === FAIL_BEAT) {
			if (instant) return failEnd();
			const x = lapXs(3)[0];
			const tag = tx.tagFrom.replace('{ip}', ipOf(0));
			anim.play(async (wait) => {
				tones = ['wait', 'idle', 'idle'];
				packet = { x, y: LAPTOP_Y - 8, label: tag };
				await wait(500);
				packet = { x, y: SWITCH_Y - 8, label: tag };
				await wait(650);
				packet = { ...ROUTER_C, label: tag };
				await wait(750);
				packet = { x: ISP.x + 6, y: ISP.y + 32, label: tag };
				await wait(800);
				packet = { x: ISP.x + 6, y: ISP.y + 32, label: tx.tagDropped, tone: 'bad' };
				await wait(900);
			}, failEnd);
		}
		if (b === BROWSE_BEAT) {
			if (instant) return browseEnd();
			const xs = lapXs(3);
			anim.play(async (wait) => {
				mark = null;
				shell.trans = [];
				for (let i = 0; i < LAPS.length; i++) {
					const x = xs[i];
					const mine = tx.tagFrom.replace('{ip}', ipOf(i));
					const pub = tx.tagFrom.replace('{ip}', PUBLIC);
					tones[i] = 'wait';
					packet = { x, y: LAPTOP_Y - 8, label: mine };
					await wait(380);
					packet = { x, y: SWITCH_Y - 8, label: mine };
					await wait(560);
					packet = { ...ROUTER_C, label: mine };
					await wait(620);
					packet = { ...ROUTER_C, label: pub, tone: 'ok' };
					shell.trans = [...shell.trans, entry(i)];
					await wait(760);
					packet = { x: ISP.x + 6, y: ISP.y + 32, label: pub, tone: 'ok' };
					await wait(560);
					packet = { x: NET.x - 30, y: 34, label: pub, tone: 'ok' };
					serverTone = 'ok';
					await wait(560);
					const back = tx.tagTo.replace('{ip}', ipOf(i));
					packet = { ...ROUTER_C, label: back, tone: 'ok' };
					await wait(700);
					packet = { x, y: LAPTOP_Y - 8, label: back, tone: 'ok' };
					await wait(520);
					tones[i] = 'ok';
					packet = null;
					await wait(200);
				}
			}, browseEnd);
		}
	}

	const director = new Director(
		shell,
		SCRIPTS,
		() => {
			shell.reset(officeRouter(2));
			leaseAll();
			packet = null;
			mark = null;
			tones = ['idle', 'idle', 'idle'];
			serverTone = 'idle';
			done = false;
		},
		settled
	);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		const b = beat;
		untrack(() => {
			anim.cancel();
			director.go(b);
		});
	});
	$effect(() => () => {
		anim.stop();
		shell.destroy();
	});

	const ports = $derived(
		portLooks(shell.cfg, (i) =>
			i.nat
				? {
						tag: i.nat === 'inside' ? tx.insideTag : tx.outsideTag,
						tone: i.nat === 'inside' ? 'ok' : 'warn'
					}
				: undefined
		)
	);
	const laptops = $derived<Lap[]>(
		LAPS.map((l, i) => ({ name: l.name, ip: ipOf(i), tone: tones[i] }))
	);
	const rows = $derived(
		shell.trans.map((t) => ({
			who: shell.bindings.find((b) => t.inLocal.startsWith(b.ip + ':'))?.name ?? '',
			local: t.inLocal,
			global: t.inGlobal
		}))
	);
</script>

<LabGuide
	steps={tx.steps}
	active={beat}
	{shell}
	{live}
	inputLabel={tx.inputLabel}
	{done}
	doneNote={tx.doneNote}
	termHeight={150}
>
	{#snippet art()}
		<CiscoRig
			hostname={shell.cfg.hostname}
			isp={tx.ispLabel}
			server="nimbus.com"
			{serverTone}
			{ports}
			{laptops}
			{packet}
			{mark}
		/>
		<div class="table" aria-label={tx.tableTitle}>
			<div class="thead">
				<span>{tx.tableTitle}</span>
			</div>
			<div class="row head">
				<span></span><span>{tx.thLocal}</span><span></span><span>{tx.thGlobal}</span>
			</div>
			{#each rows as r (r.local)}
				<div class="row">
					<b>{r.who}</b><code>{r.local}</code>
					<svg viewBox="0 0 20 10" aria-hidden="true"><path d="M1 5h16M13 1l4 4-4 4" /></svg>
					<code class="pub">{r.global}</code>
				</div>
			{:else}
				<p class="empty">{tx.tableEmpty}</p>
			{/each}
		</div>
	{/snippet}
</LabGuide>

<style>
	.table {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 7px 10px;
	}
	.thead {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
		padding-bottom: 3px;
	}
	.row {
		display: grid;
		grid-template-columns: 38px minmax(0, 1fr) 18px minmax(0, 1fr);
		align-items: center;
		gap: 6px;
		min-height: 22px;
		font-size: 11px;
		animation: in 0.35s ease;
	}
	.row.head {
		min-height: 16px;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-faint);
		animation: none;
	}
	.row b {
		color: var(--color-ink);
		font-weight: 750;
	}
	.row code {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--color-muted);
	}
	.row code.pub {
		color: var(--color-grass);
		font-weight: 700;
	}
	.row svg {
		width: 18px;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.empty {
		margin: 2px 0;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	@keyframes in {
		from {
			opacity: 0;
			transform: translateY(-3px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.row {
			animation: none;
		}
	}
</style>
