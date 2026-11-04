<script lang="ts">
	// Guided DHCP lesson. Three laptops sit on the switch with no address, give up on 169.254,
	// and once the terminal has built the pool, the network info, and the server, they ask again
	// and get their addresses one by one. The learner's part is printing the lease list.
	import type { StageProps } from '$lib/chapters/types';
	import type { RouterIpText } from '$lib/chapters/netlab/router-ip/types';
	import RosLab from './routerlab/RosLab.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import { isCmd, toLn, unknownLines, type Act, type Ln } from './routerlab/lab';
	import { pad, type RigLaptop } from './routerlab/ros';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RouterIpText);
	const live = $derived(beat >= tx.intro.length - 1);

	const LAPS = [
		{ name: 'Sari', ip: '192.168.88.254', apipa: '169.254.31.7', mac: '3C:22:FB:1A:07:5E' },
		{ name: 'Budi', ip: '192.168.88.253', apipa: '169.254.140.2', mac: '58:11:22:9B:3D:41' },
		{ name: 'Dewi', ip: '192.168.88.252', apipa: '169.254.77.19', mac: 'A4:83:E7:52:C0:1F' }
	];

	let got = $state(0); // laptops that already have their lease
	let asking = $state(false);
	let timers: ReturnType<typeof setTimeout>[] = [];
	$effect(() => () => timers.forEach(clearTimeout));

	const laptops = $derived<RigLaptop[]>(
		LAPS.map((l, i) =>
			i < got
				? { name: l.name, ip: l.ip, tone: 'ok' }
				: asking
					? { name: l.name, tone: 'wait' }
					: beat >= 1
						? { name: l.name, ip: l.apipa, tone: 'bad' }
						: { name: l.name, tone: 'idle' }
		)
	);

	const leaseTable = () => [
		'Flags: D - DYNAMIC',
		` #   ${pad('ADDRESS', 16)}${pad('MAC-ADDRESS', 19)}${pad('HOST-NAME', 13)}STATUS`,
		...LAPS.map(
			(l, i) =>
				` ${i} D ${pad(l.ip, 16)}${pad(l.mac, 19)}${pad(l.name.toLowerCase() + '-laptop', 13)}bound`
		)
	];

	const scripts = $derived<Act[][]>([
		[],
		[],
		[],
		[{ cmd: '/ip pool add name=office ranges=192.168.88.10-192.168.88.254' }],
		[
			{
				cmd: '/ip dhcp-server network add address=192.168.88.0/24 gateway=192.168.88.1 dns-server=8.8.8.8'
			}
		],
		[
			{
				cmd: '/ip dhcp-server add name=dhcp1 interface=ether2 address-pool=office disabled=no',
				key: 'server',
				wait: 2600
			},
			{
				cmd: '/ip dhcp-server print',
				out: [
					`Flags: X - DISABLED`,
					` #   ${pad('NAME', 7)}${pad('INTERFACE', 11)}ADDRESS-POOL`,
					` 0   ${pad('dhcp1', 7)}${pad('ether2', 11)}office`
				]
			}
		],
		[],
		[],
		[]
	]);

	function onreset() {
		timers.forEach(clearTimeout);
		timers = [];
		got = 0;
		asking = false;
	}
	function onact(key: string, instant: boolean) {
		if (key !== 'server') return;
		if (instant) {
			got = LAPS.length;
			return;
		}
		asking = true;
		LAPS.forEach((_, i) => timers.push(setTimeout(() => (got = i + 1), 700 + i * 650)));
	}

	const glow = $derived(beat === 5 && got < LAPS.length ? ['ether2'] : []);

	function onrun(line: string): Ln[] {
		if (isCmd(line, '/ip dhcp-server lease print')) {
			onstate?.('leases');
			return [...leaseTable(), tx.hintBound].map(toLn);
		}
		if (isCmd(line, '/ip pool print')) {
			onstate?.('pool');
			return [
				` #   ${pad('NAME', 8)}RANGES`,
				` 0   ${pad('office', 8)}192.168.88.10-192.168.88.254`
			].map(toLn);
		}
		onstate?.('error');
		return unknownLines(line, '/ip dhcp-server lease print', tx);
	}
</script>

<RosLab
	steps={tx.steps}
	{beat}
	{scripts}
	{live}
	suggestion="/ip dhcp-server lease print"
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
		<OfficeRig isp={tx.ispLabel} {laptops} {glow} gateway="192.168.88.1" />
	{/snippet}
</RosLab>
