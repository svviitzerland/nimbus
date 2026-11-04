<script lang="ts">
	// Guided first MikroTik lesson. The terminal names the router, lists its physical ports, and
	// gives ether2 an address by itself while Nim explains, and the office drawing follows (the
	// name on the box, glowing ports, the gateway address). The learner's part is one print.
	import type { StageProps } from '$lib/chapters/types';
	import type { RouterIntroText } from '$lib/chapters/netlab/router-intro/types';
	import RosLab from './routerlab/RosLab.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import { isCmd, toLn, unknownLines, type Act, type Ln } from './routerlab/lab';
	import { PORTS, pad } from './routerlab/ros';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RouterIntroText);
	const live = $derived(beat >= tx.intro.length - 1);

	let identity = $state('MikroTik');
	let gateway = $state<string | undefined>(undefined);
	let lit = $state<string[]>([]);

	const portsTable = () => [
		'Flags: R - RUNNING',
		` #   ${pad('NAME', 8)}${pad('TYPE', 7)}MTU`,
		...PORTS.map((p, i) => ` ${i} ${i < 2 ? 'R' : ' '} ${pad(p, 8)}${pad('ether', 7)}1500`)
	];
	const addrTable = () => [
		'Flags: D - DYNAMIC',
		` #   ${pad('ADDRESS', 17)}${pad('NETWORK', 14)}INTERFACE`,
		` 0 D ${pad('10.20.30.2/24', 17)}${pad('10.20.30.0', 14)}ether1`,
		` 1   ${pad('192.168.88.1/24', 17)}${pad('192.168.88.0', 14)}ether2`
	];

	const scripts = $derived<Act[][]>([
		[],
		[{ cmd: '/system identity print', out: ['  name: MikroTik'] }],
		[
			{ cmd: '/system identity set name=nimbus', key: 'name' },
			{ cmd: '/system identity print', out: ['  name: nimbus'] }
		],
		[{ cmd: '/interface print', key: 'ports', out: [...portsTable(), tx.hintRunning] }],
		[],
		[{ cmd: '/ip address add address=192.168.88.1/24 interface=ether2', key: 'addr' }],
		[],
		[]
	]);

	function onreset() {
		identity = 'MikroTik';
		gateway = undefined;
		lit = [];
	}
	function onact(key: string) {
		if (key === 'name') identity = 'nimbus';
		if (key === 'addr') gateway = '192.168.88.1';
	}

	const glow = $derived(
		lit.length ? lit : beat === 3 ? PORTS : beat === 4 || beat === 5 ? ['ether2'] : []
	);

	function onrun(line: string): Ln[] {
		if (isCmd(line, '/ip address print')) {
			lit = ['ether1', 'ether2'];
			onstate?.('addrPrint');
			return [...addrTable(), tx.hintDynamic].map(toLn);
		}
		if (isCmd(line, '/interface print')) {
			lit = PORTS;
			onstate?.('interfaces');
			return portsTable().map(toLn);
		}
		if (isCmd(line, '/system identity print')) {
			onstate?.('identity');
			return [{ tone: 'tbl', text: `  name: ${identity}` }];
		}
		onstate?.('error');
		return unknownLines(line, '/ip address print', tx);
	}
</script>

<RosLab
	steps={tx.steps}
	{beat}
	{scripts}
	{identity}
	{live}
	suggestion="/ip address print"
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
		<OfficeRig {identity} isp={tx.ispLabel} laptops={[{ name: tx.laptopLabel }]} {glow} {gateway} />
	{/snippet}
</RosLab>
