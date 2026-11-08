<script lang="ts">
	import { untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiscoIntroText } from '$lib/chapters/netlab/cisco-intro/types';
	import LabGuide from './ciscolab/LabGuide.svelte';
	import CiscoRig from './ciscolab/CiscoRig.svelte';
	import { IosShell, type Run } from './ciscolab/shell.svelte';
	import { Director } from './ciscolab/director';
	import { MODE_SUFFIX, officeRouter, type Mode } from './ciscolab/ios';
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
	const tx = $derived(text as CiscoIntroText);
	const live = $derived(beat >= tx.intro.length - 1);
	let done = $state(false);

	// Beats (see id.ts and en.ts): 0 Cisco, 1 physical ports, 2 logical ports, 3 user mode,
	// 4 enable, 5 config and hostname, 6 the three prompts, 7 saving, 8 MikroTik, 9 your turn.
	const PORTS_BEAT = 1;
	const LOGICAL_BEAT = 2;
	const SAVE_BEAT = 7;
	const SCRIPTS: string[][] = [
		[],
		[],
		[],
		['show ip interface brief'],
		['enable'],
		['configure terminal', 'hostname nimbus'],
		['end'],
		['copy running-config startup-config', ''],
		[],
		[]
	];

	function onrun(r: Run) {
		if (!live) return;
		if (r.id === 'reloaded') return onstate?.('reloaded');
		if (r.id === 'show.run' && !done) {
			done = true;
			onstate?.('task');
		}
	}
	const shell = new IosShell({
		dev: 'router',
		cfg: officeRouter(0),
		mode: 'user',
		saved: false,
		text: () => tx,
		onrun,
		onerror: (t) => {
			if (live) onstate?.(nimToken(t, tx.reactions));
		}
	});
	const director = new Director(shell, SCRIPTS, () => {
		shell.reset(officeRouter(0), 'user', false);
		done = false;
	});

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		const b = beat;
		untrack(() => director.go(b));
	});
	$effect(() => () => shell.destroy());

	const ports = $derived(
		portLooks(shell.cfg, (i) =>
			i.ip && beat >= 3 ? { tag: i.ip, tone: 'ok' as const } : undefined
		)
	);
	const glow = $derived(
		beat === PORTS_BEAT
			? ['GigabitEthernet0/0', 'GigabitEthernet0/1']
			: beat === LOGICAL_BEAT
				? ['GigabitEthernet0/0', 'GigabitEthernet0/1', 'GigabitEthernet0/2']
				: []
	);
	const caption = $derived(
		beat === PORTS_BEAT ? tx.portsCaption : beat === LOGICAL_BEAT ? tx.logicalCaption : ''
	);

	// the mode ladder, one rung per prompt
	const RUNGS = $derived<{ mode: Mode; label: string }[]>([
		{ mode: 'user', label: tx.modes.look },
		{ mode: 'priv', label: tx.modes.boss },
		{ mode: 'config', label: tx.modes.change },
		{ mode: 'if', label: tx.modes.port }
	]);
	const rungOf = (m: Mode) => (m === 'user' ? 0 : m === 'priv' ? 1 : m === 'config' ? 2 : 3);
	const at = $derived(rungOf(shell.mode));
	const laptops = [
		{ name: 'Sari', ip: '' },
		{ name: 'Budi', ip: '' },
		{ name: 'Dewi', ip: '' }
	];
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
		<div class="ladder" aria-label={RUNGS.map((r) => r.label).join(', ')}>
			{#each RUNGS as r, i (r.mode)}
				<div class="rung" class:on={i === at} class:past={i < at} class:pulse={beat === 6}>
					<code>{shell.cfg.hostname}{MODE_SUFFIX[r.mode]}</code>
					<span>{r.label}</span>
				</div>
			{/each}
		</div>

		<div class="rigbox">
			<CiscoRig hostname={shell.cfg.hostname} isp={tx.ispLabel} {ports} {laptops} {glow} />
			{#if caption}<p class="cap" class:warn={beat === LOGICAL_BEAT}>{caption}</p>{/if}
		</div>

		{#if beat >= SAVE_BEAT}
			<div class="mem">
				<div class="box">
					<b>{tx.ramTitle}</b>
					<span>{tx.ramSub}</span>
				</div>
				<svg class="arrow" viewBox="0 0 40 16" aria-hidden="true"
					><path d="M2 8h32M28 3l6 5-6 5" /></svg
				>
				<div class="box" class:ok={!shell.dirty}>
					<b>{tx.nvramTitle}</b>
					<span>{tx.nvramSub}</span>
				</div>
				<span class="badge" class:ok={!shell.dirty}>{shell.dirty ? tx.unsaved : tx.saved}</span>
			</div>
		{/if}
	{/snippet}
</LabGuide>

<style>
	.ladder {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 5px;
		width: 100%;
	}
	.rung {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		min-width: 0;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-card);
		padding: 6px 4px;
		transition:
			border-color 0.3s ease,
			background 0.3s ease,
			transform 0.3s ease;
	}
	/* the full prompt always shows, it wraps instead of being cut off */
	.rung code {
		max-width: 100%;
		overflow-wrap: anywhere;
		text-align: center;
		line-height: 1.25;
		font-size: 10px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.rung span {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.rung.past {
		background: var(--color-paper);
	}
	.rung.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		transform: translateY(-2px);
	}
	.rung.on code,
	.rung.on span {
		color: var(--color-brand);
	}
	.rung.pulse {
		border-color: var(--color-grass);
	}
	/* on a phone the four prompts sit two by two, so each has room for its whole name */
	@media (max-width: 560px) {
		.ladder {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
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
	.cap.warn {
		color: var(--color-amber);
	}
	.mem {
		position: relative;
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 6px;
	}
	.box {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-card);
		padding: 6px 4px;
		transition: border-color 0.3s ease;
	}
	.box b {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--color-ink);
	}
	.box span {
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.box.ok {
		border-color: var(--color-grass);
	}
	.arrow {
		width: 34px;
		flex: none;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.badge {
		position: absolute;
		top: -9px;
		right: 6px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 9.5px;
		font-weight: 800;
		padding: 1px 8px;
	}
	.badge.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	@media (prefers-reduced-motion: reduce) {
		.rung {
			transition: none;
		}
	}
</style>
