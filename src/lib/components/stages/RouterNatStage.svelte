<script lang="ts">
	// Guided NAT lesson. First a packet from Sari leaves with her private address and the ISP
	// throws it away. Then the terminal adds the masquerade rule and the packets loop through
	// the office by themselves, their sender label swapped to the public address at the router.
	// The learner's part is printing the NAT rule.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RouterNatText } from '$lib/chapters/netlab/router-nat/types';
	import RosLab from './routerlab/RosLab.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import { isCmd, toLn, unknownLines, type Act, type Ln } from './routerlab/lab';
	import {
		ISP,
		LAPTOP_Y,
		NET,
		RY,
		SWITCH_Y,
		laptopXs,
		pad,
		portC,
		type RigLaptop,
		type RigPacket
	} from './routerlab/ros';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RouterNatText);
	const live = $derived(beat >= tx.intro.length - 1);

	const PUBLIC = '10.20.30.2';
	const SITE = '104.21.5.9';
	const LAPS = [
		{ name: 'Sari', ip: '192.168.88.254' },
		{ name: 'Budi', ip: '192.168.88.253' },
		{ name: 'Dewi', ip: '192.168.88.252' }
	];
	const XS = laptopXs(3);
	const R = { x: (portC('ether1') + portC('ether2')) / 2, y: RY + 34 };

	let natOn = $state(false);
	let packet = $state<RigPacket | null>(null);
	let mark = $state<{ x: number; y: number } | null>(null);
	let glow = $state<string[]>([]);
	let serverTone = $state<'idle' | 'ok' | 'bad'>('idle');
	let tones = $state<RigLaptop['tone'][]>(['ok', 'ok', 'ok']);
	const laptops = $derived<RigLaptop[]>(LAPS.map((l, i) => ({ ...l, tone: tones[i] })));

	function clearScene() {
		packet = null;
		mark = null;
		glow = [];
		serverTone = 'idle';
		tones = ['ok', 'ok', 'ok'];
	}

	const from = (ip: string) => tx.tagFrom.replace('{ip}', ip);
	const to = (ip: string) => tx.tagTo.replace('{ip}', ip);
	const at = (x: number, y: number, label: string, tone: RigPacket['tone']) =>
		(packet = { x, y, label, tone });

	function lostTrip(): SeqStep[] {
		const lx = XS[0];
		const me = LAPS[0].ip;
		return [
			[600, () => (clearScene(), (tones[0] = 'wait'), at(lx, LAPTOP_Y - 8, from(me), 'go'))],
			[650, () => at(lx, SWITCH_Y - 6, from(me), 'go')],
			[750, () => ((glow = ['ether2']), at(R.x, R.y, from(me), 'go'))],
			[800, () => ((glow = ['ether1']), at(ISP.x + 6, ISP.y + 32, from(me), 'go'))],
			[
				1300,
				() => (
					at(ISP.x + 6, ISP.y + 32, tx.tagDropped, 'bad'),
					(mark = { x: ISP.x + 30, y: ISP.y - 10 })
				)
			],
			[1600, () => ((packet = null), (glow = []), (tones[0] = 'bad'))]
		];
	}
	function goodTrip(i: number): SeqStep[] {
		const lx = XS[i];
		const me = LAPS[i].ip;
		return [
			[500, () => (clearScene(), (tones[i] = 'wait'), at(lx, LAPTOP_Y - 8, from(me), 'go'))],
			[600, () => at(lx, SWITCH_Y - 6, from(me), 'go')],
			[750, () => ((glow = ['ether2']), at(R.x, R.y, from(me), 'go'))],
			[950, () => at(R.x, R.y, from(PUBLIC), 'ok')],
			[650, () => ((glow = ['ether1']), at(ISP.x + 6, ISP.y + 32, from(PUBLIC), 'ok'))],
			[650, () => at(NET.x - 30, 34, from(PUBLIC), 'ok')],
			[600, () => ((serverTone = 'ok'), at(NET.x - 30, 34, to(PUBLIC), 'ok'))],
			[600, () => at(ISP.x + 6, ISP.y + 32, to(PUBLIC), 'ok')],
			[650, () => at(R.x, R.y, to(PUBLIC), 'ok')],
			[950, () => ((glow = ['ether2']), at(R.x, R.y, to(me), 'ok'))],
			[600, () => at(lx, SWITCH_Y - 6, to(me), 'ok')],
			[500, () => at(lx, LAPTOP_Y - 8, to(me), 'ok')],
			[900, () => ((packet = null), (glow = []), (tones[i] = 'ok'))]
		];
	}

	// The packets move by themselves, lost before the rule, through the router after it.
	const mode = $derived(beat === 2 ? 'lost' : natOn && beat >= 4 ? 'nat' : 'none');
	$effect(() => {
		const m = mode;
		return untrack(() => animate(m));
	});
	function animate(m: string) {
		clearScene();
		if (m === 'none') return;
		if (prefersReducedMotion()) {
			if (m === 'lost') {
				at(ISP.x + 6, ISP.y + 32, tx.tagDropped, 'bad');
				mark = { x: ISP.x + 30, y: ISP.y - 10 };
				tones[0] = 'bad';
			} else {
				at(R.x, R.y, from(PUBLIC), 'ok');
				serverTone = 'ok';
			}
			return;
		}
		return runSeq(m === 'lost' ? lostTrip() : [0, 1, 2].flatMap(goodTrip), true);
	}

	const addrTable = () => [
		'Flags: D - DYNAMIC',
		` #   ${pad('ADDRESS', 17)}${pad('NETWORK', 14)}INTERFACE`,
		` 0 D ${pad(PUBLIC + '/24', 17)}${pad('10.20.30.0', 14)}ether1`,
		` 1   ${pad('192.168.88.1/24', 17)}${pad('192.168.88.0', 14)}ether2`
	];
	const natTable = () => [
		'Flags: X - DISABLED, I - INVALID; D - DYNAMIC',
		' 0    chain=srcnat action=masquerade out-interface=ether1'
	];
	const connTable = () => [
		'Flags: S - SEEN-REPLY, A - ASSURED, C - CONFIRMED, s - SRCNAT',
		` #     ${pad('PROTOCOL', 9)}${pad('SRC-ADDRESS', 22)}${pad('DST-ADDRESS', 17)}TCP-STATE`,
		...LAPS.map(
			(l, i) =>
				` ${i} SACs ${pad('tcp', 9)}${pad(`${l.ip}:${51234 + i * 7}`, 22)}${pad(SITE + ':443', 17)}established`
		)
	];

	const scripts = $derived<Act[][]>([
		[],
		[{ cmd: '/ip address print', out: [...addrTable(), tx.hintPublic] }],
		[],
		[
			{
				cmd: '/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade',
				key: 'nat'
			}
		],
		[],
		[{ cmd: '/ip firewall connection print', out: [...connTable(), tx.hintSrcnat] }],
		[],
		[],
		[]
	]);

	function onreset() {
		natOn = false;
	}
	function onact(key: string) {
		if (key === 'nat') natOn = true;
	}

	function onrun(line: string): Ln[] {
		if (isCmd(line, '/ip firewall nat print')) {
			onstate?.('natPrint');
			return natTable().map(toLn);
		}
		if (isCmd(line, '/ip firewall connection print')) {
			onstate?.('conntrack');
			return [...connTable(), tx.hintSrcnat].map(toLn);
		}
		onstate?.('error');
		return unknownLines(line, '/ip firewall nat print', tx);
	}
</script>

<RosLab
	steps={tx.steps}
	{beat}
	{scripts}
	{live}
	suggestion="/ip firewall nat print"
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
		<OfficeRig
			isp={tx.ispLabel}
			server={tx.serverLabel}
			{serverTone}
			{laptops}
			{glow}
			{packet}
			{mark}
			gateway="192.168.88.1"
		/>
	{/snippet}
</RosLab>
