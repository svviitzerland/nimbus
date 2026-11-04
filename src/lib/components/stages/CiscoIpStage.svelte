<script lang="ts">
	import { untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiscoIpText } from '$lib/chapters/netlab/cisco-ip/types';
	import LabGuide from './ciscolab/LabGuide.svelte';
	import CiscoRig, {
		LAPTOP_Y,
		ROUTER_C,
		SWITCH_Y,
		lapXs,
		type Lap,
		type Pkt
	} from './ciscolab/CiscoRig.svelte';
	import { IosShell, type Run } from './ciscolab/shell.svelte';
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
		onlock?: (v: boolean) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as CiscoIpText);
	const live = $derived(beat >= tx.intro.length - 1);
	let done = $state(false);

	// Beats: 0 the dark port, 1 an address for Gi0/1, 2 no shutdown, 3 the "no" trick,
	// 4 laptops asking, 5 excluded addresses, 6 the pool (laptops get leases), 7 the pool trick,
	// 8 the binding list, 9 your turn (ping Dewi).
	const ASK_BEAT = 4;
	const POOL_BEAT = 6;
	const SCRIPTS: string[][] = [
		['show ip interface brief'],
		['configure terminal', 'interface g0/1', 'ip address 192.168.88.1 255.255.255.0'],
		['no shutdown', 'exit'],
		[],
		[],
		['ip dhcp excluded-address 192.168.88.1 192.168.88.10'],
		[
			'ip dhcp pool OFFICE',
			'network 192.168.88.0 255.255.255.0',
			'default-router 192.168.88.1',
			'dns-server 8.8.8.8',
			'end'
		],
		[],
		['show ip dhcp binding'],
		[]
	];
	const LAPS = [
		{ name: 'Sari', mac: '0050.b6a1.0011' },
		{ name: 'Budi', mac: '0050.b6a1.0012' },
		{ name: 'Dewi', mac: '0050.b6a1.0013' }
	];

	function onrun(r: Run) {
		if (!live || r.id !== 'ping') return;
		const target = r.vals[r.vals.length - 1];
		const hit = shell.bindings.find((b) => b.ip === target);
		if (hit?.name === 'Dewi' && !done) {
			done = true;
			onstate?.('task');
		} else onstate?.(hit ? 'pingOther' : 'pingMiss');
	}
	const shell = new IosShell({
		dev: 'router',
		cfg: officeRouter(1),
		text: () => tx,
		onrun,
		onerror: (t) => {
			if (live) onstate?.(nimToken(t, tx.reactions));
		}
	});

	// ---- laptops asking the router for an address (DHCP) ----
	const anim = new Anim();
	let packet = $state<Pkt | null>(null);
	const leaseAll = () => {
		for (const l of LAPS) shell.lease(l.name, l.mac);
		packet = null;
	};
	function settled(b: number, instant: boolean) {
		if (b !== POOL_BEAT) return;
		if (instant) return leaseAll();
		const xs = lapXs(3);
		anim.play(async (wait) => {
			for (let i = 0; i < LAPS.length; i++) {
				const x = xs[i];
				packet = { x, y: LAPTOP_Y - 8, label: tx.tagAsk, tone: 'go' };
				await wait(380);
				packet = { x, y: SWITCH_Y - 8, label: tx.tagAsk, tone: 'go' };
				await wait(640);
				packet = { x: ROUTER_C.x, y: ROUTER_C.y + 22, label: tx.tagAsk, tone: 'go' };
				await wait(700);
				const got = shell.lease(LAPS[i].name, LAPS[i].mac);
				const tag = got?.ip ?? '';
				packet = { x: ROUTER_C.x, y: ROUTER_C.y + 22, label: tag, tone: 'ok' };
				await wait(520);
				packet = { x, y: SWITCH_Y - 8, label: tag, tone: 'ok' };
				await wait(640);
				packet = { x, y: LAPTOP_Y - 8, label: tag, tone: 'ok' };
				await wait(420);
				packet = null;
				await wait(200);
			}
		}, leaseAll);
	}

	const director = new Director(
		shell,
		SCRIPTS,
		() => {
			shell.reset(officeRouter(1));
			packet = null;
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
			i.name !== 'GigabitEthernet0/2' && i.ip ? { tag: i.ip, tone: 'ok' as const } : undefined
		)
	);
	const laptops = $derived<Lap[]>(
		LAPS.map((l) => {
			const b = shell.bindings.find((x) => x.name === l.name);
			return {
				name: l.name,
				ip: b?.ip,
				tone: b ? 'ok' : beat >= ASK_BEAT ? 'wait' : 'idle'
			};
		})
	);
	const lanUp = $derived(shell.isUp('GigabitEthernet0/1'));
	const caption = $derived(
		!lanUp
			? tx.capDark
			: shell.bindings.length
				? tx.capLeased
				: beat >= ASK_BEAT
					? tx.capWaiting
					: tx.capLit
	);
	const glow = $derived(beat >= 1 && beat <= 2 ? ['GigabitEthernet0/1'] : []);
</script>

<LabGuide
	steps={tx.steps}
	active={beat}
	{shell}
	{live}
	inputLabel={tx.inputLabel}
	{done}
	doneNote={tx.doneNote}
>
	{#snippet art()}
		<div class="rigbox">
			<CiscoRig hostname={shell.cfg.hostname} isp={tx.ispLabel} {ports} {laptops} {glow} {packet} />
			<p class="cap" class:ok={shell.bindings.length > 0} class:warn={!lanUp}>{caption}</p>
		</div>
	{/snippet}
</LabGuide>

<style>
	.rigbox {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.cap {
		margin: 0;
		font-size: 12px;
		font-weight: 650;
		color: var(--color-muted);
		text-align: center;
	}
	.cap.ok {
		color: var(--color-grass);
	}
	.cap.warn {
		color: var(--color-amber);
	}
</style>
