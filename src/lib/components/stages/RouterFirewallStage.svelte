<script lang="ts">
	// Guided firewall lesson. Packets loop through the office by themselves, Sari's game going out
	// to the game server and Winbox logins knocking on the router. As the terminal adds each
	// filter rule, the drawing reacts (the game gets dropped at the router, only Budi reaches
	// Winbox) and a small rule list lights up the rule that matched. The learner prints the list.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RouterFirewallText } from '$lib/chapters/netlab/router-firewall/types';
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
		portC,
		type RigLaptop,
		type RigPacket
	} from './routerlab/ros';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RouterFirewallText);
	const live = $derived(beat >= tx.intro.length - 1);

	const GAME = '45.33.10.8';
	const LAPS = [
		{ name: 'Sari', ip: '192.168.88.254' },
		{ name: 'Budi', ip: '192.168.88.253' }
	];
	const XS = laptopXs(2);
	const R = { x: (portC('ether1') + portC('ether2')) / 2, y: RY + 34 };
	const STOP = { x: R.x, y: RY - 4 };

	let gameRule = $state(false);
	let adminRules = $state(false);
	const ruleCount = $derived(adminRules ? 3 : gameRule ? 1 : 0);

	let packet = $state<RigPacket | null>(null);
	let mark = $state<{ x: number; y: number } | null>(null);
	let glow = $state<string[]>([]);
	let serverTone = $state<'idle' | 'ok' | 'bad'>('idle');
	let tones = $state<RigLaptop['tone'][]>(['ok', 'ok']);
	let hit = $state<{ i: number; tone: 'ok' | 'bad' | 'skip' } | null>(null);
	const laptops = $derived<RigLaptop[]>(LAPS.map((l, i) => ({ ...l, tone: tones[i] })));

	function clearScene() {
		packet = null;
		mark = null;
		glow = [];
		serverTone = 'idle';
		hit = null;
		tones = ['ok', 'ok'];
	}
	const at = (x: number, y: number, label: string, tone: RigPacket['tone']) =>
		(packet = { x, y, label, tone });

	function toRouter(i: number, label: string): SeqStep[] {
		const lx = XS[i];
		return [
			[500, () => (clearScene(), (tones[i] = 'wait'), at(lx, LAPTOP_Y - 8, label, 'go'))],
			[600, () => at(lx, SWITCH_Y - 6, label, 'go')],
			[800, () => ((glow = ['ether2']), at(R.x, R.y, label, 'go'))]
		];
	}
	function gameTrip(blocked: boolean): SeqStep[] {
		const go = toRouter(0, tx.tagGame);
		if (blocked)
			return [
				...go,
				[
					1500,
					() => ((hit = { i: 0, tone: 'bad' }), at(R.x, R.y, tx.tagGame, 'bad'), (mark = STOP))
				],
				[1000, () => ((packet = null), (tones[0] = 'bad'))]
			];
		return [
			...go,
			[650, () => ((glow = ['ether1']), at(ISP.x + 6, ISP.y + 32, tx.tagGame, 'go'))],
			[700, () => at(NET.x - 30, 34, tx.tagGame, 'go')],
			[1000, () => ((serverTone = 'ok'), (packet = null), (tones[0] = 'ok'))]
		];
	}
	function winboxTrip(i: number, outcome: 'open' | 'drop' | 'accept'): SeqStep[] {
		const go = toRouter(i, tx.tagWinbox);
		if (outcome === 'drop')
			return [
				...go,
				[700, () => (hit = { i: 1, tone: 'skip' })],
				[
					1500,
					() => ((hit = { i: 2, tone: 'bad' }), at(R.x, R.y, tx.tagWinbox, 'bad'), (mark = STOP))
				],
				[900, () => ((packet = null), (tones[i] = 'bad'))]
			];
		return [
			...go,
			[
				1500,
				() => {
					if (outcome === 'accept') hit = { i: 1, tone: 'ok' };
					at(R.x, R.y, tx.tagWinbox, 'ok');
				}
			],
			[900, () => ((packet = null), (tones[i] = 'ok'))]
		];
	}

	// Everything moves by itself, and the loop is rebuilt whenever a rule is added.
	const mode = $derived(`${gameRule}|${adminRules}`);
	$effect(() => {
		void mode;
		return untrack(() => animate());
	});
	function animate() {
		clearScene();
		if (prefersReducedMotion()) {
			if (gameRule) tones[0] = 'bad';
			return;
		}
		return runSeq(
			[
				...gameTrip(gameRule),
				...winboxTrip(0, adminRules ? 'drop' : 'open'),
				...(adminRules ? winboxTrip(1, 'accept') : [])
			],
			true
		);
	}

	const filterTable = () => [
		'Flags: X - DISABLED, I - INVALID; D - DYNAMIC',
		` 0    chain=forward action=drop src-address=${LAPS[0].ip} dst-address=${GAME}`,
		` 1    chain=input action=accept protocol=tcp src-address=${LAPS[1].ip} dst-port=8291`,
		' 2    chain=input action=drop protocol=tcp dst-port=8291'
	];

	const scripts = $derived<Act[][]>([
		[],
		[],
		[],
		[
			{
				cmd: `/ip firewall filter add chain=forward src-address=${LAPS[0].ip} dst-address=${GAME} action=drop`,
				key: 'game'
			}
		],
		[],
		[
			{
				cmd: `/ip firewall filter add chain=input src-address=${LAPS[1].ip} protocol=tcp dst-port=8291 action=accept`
			},
			{
				cmd: '/ip firewall filter add chain=input protocol=tcp dst-port=8291 action=drop',
				key: 'admin'
			}
		],
		[],
		[],
		[]
	]);

	function onreset() {
		gameRule = false;
		adminRules = false;
	}
	function onact(key: string) {
		if (key === 'game') gameRule = true;
		if (key === 'admin') adminRules = true;
	}

	function onrun(line: string): Ln[] {
		if (isCmd(line, '/ip firewall filter print')) {
			onstate?.('filterPrint');
			return [...filterTable(), tx.hintOrder].map(toLn);
		}
		onstate?.('error');
		return unknownLines(line, '/ip firewall filter print', tx);
	}
</script>

<RosLab
	steps={tx.steps}
	{beat}
	{scripts}
	{live}
	suggestion="/ip firewall filter print"
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
			server={tx.gameLabel}
			{serverTone}
			{laptops}
			{glow}
			{packet}
			{mark}
			gateway="192.168.88.1"
		/>
	{/snippet}
	{#snippet extra()}
		{#if ruleCount}
			<div class="rules" aria-label={tx.rulesLabel}>
				<span class="head">{tx.rulesLabel}</span>
				<ol>
					{#each tx.rules.slice(0, ruleCount) as r, i (i)}
						<li class={hit?.i === i ? hit.tone : ''}>
							<span class="n">{i}</span>{r}
						</li>
					{/each}
				</ol>
			</div>
		{/if}
	{/snippet}
</RosLab>

<style>
	.rules {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 8px 10px;
	}
	.head {
		display: block;
		margin-bottom: 4px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-muted);
	}
	ol {
		display: flex;
		flex-direction: column;
		gap: 3px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 8px;
		padding: 3px 6px;
		font-size: 12.5px;
		color: var(--color-ink);
		transition: background 0.25s;
	}
	li.ok {
		background: var(--color-grass-soft);
	}
	li.bad {
		background: var(--color-danger-soft);
	}
	li.skip {
		background: var(--color-paper);
	}
	.n {
		display: inline-grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-paper);
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	@media (prefers-reduced-motion: reduce) {
		li {
			transition: none;
		}
	}
</style>
