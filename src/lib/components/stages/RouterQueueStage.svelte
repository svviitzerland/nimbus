<script lang="ts">
	// Guided bandwidth lesson. Under the office drawing, three bars show how the 20 Mbps line is
	// shared. Budi's download hogs it and Sari's call turns red, torch finds him, and once the
	// terminal adds his queue the bars settle into a fair share by themselves. The learner's part
	// is printing the queue.
	import type { StageProps } from '$lib/chapters/types';
	import type { RouterQueueText } from '$lib/chapters/netlab/router-queue/types';
	import RosLab from './routerlab/RosLab.svelte';
	import OfficeRig from './routerlab/OfficeRig.svelte';
	import { isCmd, toLn, unknownLines, type Act, type Ln } from './routerlab/lab';
	import { pad, type RigLaptop } from './routerlab/ros';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RouterQueueText);
	const live = $derived(beat >= tx.intro.length - 1);

	const LINE = 20;
	const PEOPLE = [
		{ name: 'Sari', ip: '192.168.88.254', need: 3 },
		{ name: 'Dewi', ip: '192.168.88.252', need: 2 },
		{ name: 'Budi', ip: '192.168.88.253', need: 0 }
	];

	let queued = $state(false);
	let found = $state(false);

	// Mbps each person gets right now, in PEOPLE order
	const rates = $derived(queued ? [3, 2, 10] : [1.4, 1.6, 17]);
	const okFor = (i: number) => rates[i] >= PEOPLE[i].need;
	const laptops = $derived<RigLaptop[]>(
		[0, 2, 1].map((i) => ({
			name: PEOPLE[i].name,
			ip: PEOPLE[i].ip,
			tone: i === 2 ? (queued ? 'ok' : 'wait') : okFor(i) ? 'ok' : 'bad'
		}))
	);

	const torchTable = () => [
		` ${pad('SRC-ADDRESS', 17)}${pad('TX-RATE', 10)}RX-RATE`,
		...[2, 0, 1].map(
			(i) =>
				` ${pad(PEOPLE[i].ip, 17)}${pad(i === 2 ? (queued ? '0.8Mbps' : '0.9Mbps') : '0.4Mbps', 10)}${rates[i].toFixed(1)}Mbps`
		)
	];

	const scripts = $derived<Act[][]>([
		[],
		[],
		[{ cmd: '/tool torch interface=ether2', key: 'torch', out: [...torchTable(), tx.hintBudi] }],
		[],
		[
			{
				cmd: '/queue simple add name=budi target=192.168.88.253/32 max-limit=5M/10M',
				key: 'queue'
			}
		],
		[],
		[],
		[],
		[]
	]);

	function onreset() {
		queued = false;
		found = false;
	}
	function onact(key: string) {
		if (key === 'torch') found = true;
		if (key === 'queue') queued = true;
	}

	function onrun(line: string): Ln[] {
		if (isCmd(line, '/queue simple print')) {
			onstate?.('queuePrint');
			return [
				'Flags: X - DISABLED, I - INVALID; D - DYNAMIC',
				' 0    name="budi" target=192.168.88.253/32 max-limit=5M/10M'
			].map(toLn);
		}
		if (isCmd(line, '/tool torch')) {
			onstate?.('torch');
			return torchTable().map(toLn);
		}
		onstate?.('error');
		return unknownLines(line, '/queue simple print', tx);
	}
</script>

<RosLab
	steps={tx.steps}
	{beat}
	{scripts}
	{live}
	suggestion="/queue simple print"
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
			{laptops}
			glow={beat === 2 ? ['ether2'] : beat === 1 ? ['ether1'] : []}
			gateway="192.168.88.1"
		/>
	{/snippet}
	{#snippet extra()}
		<div class="line" aria-label={tx.lineLabel}>
			<span class="head">{tx.lineLabel}</span>
			{#each [2, 0, 1] as i (i)}
				{@const p = PEOPLE[i]}
				{@const tone = i === 2 ? (queued ? 'capped' : 'hog') : okFor(i) ? 'ok' : 'bad'}
				<div class="row" class:spot={found && i === 2 && !queued}>
					<span class="who">{p.name}<small>{tx.roles[i]}</small></span>
					<span class="track">
						<span class="fill {tone}" style="width:{(rates[i] / LINE) * 100}%"></span>
						{#if i === 2 && queued}<span class="cap" style="left:50%"></span>{/if}
					</span>
					<span class="val">{rates[i] < 2 ? rates[i].toFixed(1) : rates[i]}M</span>
				</div>
			{/each}
		</div>
	{/snippet}
</RosLab>

<style>
	.line {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 8px 12px 10px;
	}
	.head {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-muted);
	}
	.row {
		display: grid;
		grid-template-columns: 92px 1fr 40px;
		align-items: center;
		gap: 8px;
		border-radius: 8px;
		padding: 2px 4px;
		transition: background 0.3s;
	}
	.row.spot {
		background: var(--color-amber-soft);
	}
	.who {
		display: flex;
		flex-direction: column;
		font-size: 12.5px;
		font-weight: 750;
		line-height: 1.15;
		color: var(--color-ink);
	}
	.who small {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.track {
		position: relative;
		height: 10px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		transition: width 1.1s ease;
	}
	.fill.ok {
		background: var(--color-grass);
	}
	.fill.bad {
		background: var(--color-danger);
	}
	.fill.hog {
		background: var(--color-amber);
	}
	.fill.capped {
		background: var(--color-brand);
	}
	.cap {
		position: absolute;
		top: -4px;
		bottom: -4px;
		width: 2px;
		border-radius: 2px;
		background: var(--color-ink);
	}
	.val {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 700;
		text-align: right;
		color: var(--color-ink);
	}
	@media (prefers-reduced-motion: reduce) {
		.fill,
		.row {
			transition: none;
		}
	}
</style>
