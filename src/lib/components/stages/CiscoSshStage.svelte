<script lang="ts">
	import { untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiscoSshText } from '$lib/chapters/netlab/cisco-ssh/types';
	import LabGuide from './ciscolab/LabGuide.svelte';
	import CiscoRig, {
		LAPTOP_Y,
		ROUTER_C,
		SWITCH_Y,
		lapXs,
		type Pkt
	} from './ciscolab/CiscoRig.svelte';
	import { IosShell, type Run } from './ciscolab/shell.svelte';
	import { Director } from './ciscolab/director';
	import { Anim } from './ciscolab/anim';
	import { officeRouter, type Cfg } from './ciscolab/ios';
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
	const tx = $derived(text as CiscoSshText);
	const live = $derived(beat >= tx.intro.length - 1);
	let done = $state(false);

	// Beats: 0 how the login is set up today (Telnet), 1 someone listens in, 2 postcard and
	// envelope, 3 enable secret, 4 domain name and keys, 5 a user account, 6 the vty lines,
	// 7 Budi logs in with SSH, 8 more hardening, 9 your turn (save it).
	const SCRIPTS: string[][] = [
		['show running-config | section line vty'],
		[],
		[],
		['configure terminal', 'enable secret Nimbus2026'],
		['ip domain-name nimbus.com', 'crypto key generate rsa', '2048'],
		['username budi secret Budi2026'],
		['line vty 0 4', 'transport input ssh', 'login local', 'end'],
		['show ip ssh'],
		[],
		[]
	];
	const LOGIN_BEATS = [1, 7];

	function start(): Cfg {
		const c = officeRouter(3);
		c.vty = { pass: 'cisco', login: 'line', transport: ['telnet'] };
		return c;
	}
	function onrun(r: Run) {
		if (!live) return;
		if (r.id === 'saved' && !done) {
			done = true;
			onstate?.('task');
		} else if (r.id === 'reloaded') onstate?.('reloaded');
	}
	const shell = new IosShell({
		dev: 'router',
		cfg: start(),
		text: () => tx,
		onrun,
		onerror: (t) => {
			if (live) onstate?.(nimToken(t, tx.reactions));
		}
	});

	// ---- Budi logs in, someone on the network listens ----
	const anim = new Anim();
	let packet = $state<Pkt | null>(null);
	let spying = $state(false);
	let capture = $state<'telnet' | 'ssh' | null>(null);
	const sshOnly = () => {
		const t = shell.cfg.vty.transport;
		return !!t && t.includes('ssh') && !t.includes('telnet') && !!shell.cfg.rsa;
	};
	const loginEnd = () => {
		packet = null;
		spying = false;
		capture = sshOnly() ? 'ssh' : 'telnet';
	};
	function login(instant: boolean) {
		if (instant) return loginEnd();
		const x = lapXs(1, true)[0];
		const how = sshOnly() ? 'ssh' : 'telnet';
		const tag = how === 'ssh' ? 'SSH 22' : 'Telnet 23';
		const tone: Pkt['tone'] = how === 'ssh' ? 'ok' : 'bad';
		anim.play(async (wait) => {
			capture = null;
			spying = true;
			for (let k = 0; k < 2; k++) {
				packet = { x, y: LAPTOP_Y - 8, label: tag, tone };
				await wait(420);
				packet = { x, y: SWITCH_Y - 8, label: tag, tone };
				await wait(600);
				if (k === 0) capture = how;
				packet = { ...ROUTER_C, y: ROUTER_C.y + 20, label: tag, tone };
				await wait(700);
			}
		}, loginEnd);
	}

	const director = new Director(
		shell,
		SCRIPTS,
		() => {
			shell.reset(start());
			packet = null;
			spying = false;
			capture = null;
			done = false;
		},
		(b, instant) => {
			if (LOGIN_BEATS.includes(b)) login(instant);
		}
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

	const ports = $derived(portLooks(shell.cfg));
	const laptops = $derived([{ name: 'Budi', ip: '192.168.88.12', tone: 'idle' as const }]);
	const TELNET = [
		'User Access Verification',
		'Password: cisco',
		'nimbus>enable',
		'nimbus#show running-config'
	];
	const SSH = [
		'SSH-2.0-Cisco-1.25',
		'8f 3a c1 07 e2 9b 44 d0 1c 5e a7 72 0b f9 36 8d',
		'c4 61 2e 9a f0 13 b8 57 6d a2 e9 04 7c 3f 91 5b',
		'1e 88 d7 40 b5 6a 23 fe 9c 07 4d e1 a8 32 65 c0'
	];
	const lines = $derived(capture === 'ssh' ? SSH : capture === 'telnet' ? TELNET : []);
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
			{ports}
			{laptops}
			spy={{ label: tx.spyLabel, on: spying || !!capture }}
			{packet}
		/>
		<div class="cap" class:safe={capture === 'ssh'} class:open={capture === 'telnet'}>
			<div class="chead">
				<svg viewBox="0 0 20 12" aria-hidden="true"
					><path d="M1 6q9 -9 18 0q-9 9 -18 0z" /><circle cx="10" cy="6" r="2.4" /></svg
				>
				<span>{tx.captureTitle}</span>
				{#if capture}
					<span class="verdict">{capture === 'ssh' ? tx.captureSafe : tx.captureOpen}</span>
				{/if}
			</div>
			{#each lines as l, i (i)}
				<code class:pw={capture === 'telnet' && i === 1}>{l}</code>
			{:else}
				<p class="empty">{tx.captureEmpty}</p>
			{/each}
		</div>
	{/snippet}
</LabGuide>

<style>
	.cap {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 7px 10px;
		transition: border-color 0.3s ease;
	}
	.cap.open {
		border-color: var(--color-danger);
	}
	.cap.safe {
		border-color: var(--color-grass);
	}
	.chead {
		display: flex;
		align-items: center;
		gap: 7px;
		padding-bottom: 4px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chead svg {
		width: 18px;
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.verdict {
		margin-left: auto;
		letter-spacing: 0.02em;
		text-transform: none;
		font-size: 11px;
	}
	.cap.open .verdict {
		color: var(--color-danger);
	}
	.cap.safe .verdict {
		color: var(--color-grass);
	}
	code {
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 11px;
		line-height: 1.6;
		color: var(--color-muted);
		animation: in 0.3s ease;
	}
	.cap.safe code {
		color: var(--color-faint);
	}
	code.pw {
		color: var(--color-danger);
		font-weight: 800;
	}
	.empty {
		margin: 2px 0;
		font-size: 11.5px;
		color: var(--color-faint);
	}
	@keyframes in {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		code {
			animation: none;
		}
	}
</style>
