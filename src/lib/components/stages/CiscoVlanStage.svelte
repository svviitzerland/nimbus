<script lang="ts">
	import { untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiscoVlanText } from '$lib/chapters/netlab/cisco-vlan/types';
	import LabGuide from './ciscolab/LabGuide.svelte';
	import { IosShell, type Run } from './ciscolab/shell.svelte';
	import { Director } from './ciscolab/director';
	import { Anim } from './ciscolab/anim';
	import { officeSwitch, type Cfg } from './ciscolab/ios';
	import { nimToken } from './ciscolab/look';

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
	const tx = $derived(text as CiscoVlanText);
	const live = $derived(beat >= tx.intro.length - 1);
	let done = $state(false);

	// Beats: 0 one big room (a guest broadcast reaches everyone), 1 the VLAN idea, 2 create the
	// VLANs, 3 staff ports, 4 the guest port, 5 the access and trunk trick, 6 the trunk to the
	// router, 7 the broadcast again, 8 elsewhere, 9 your turn (a new laptop on Fa0/4).
	const SHOUT_BEATS = [0, 7];
	const SCRIPTS: string[][] = [
		[],
		[],
		['configure terminal', 'vlan 10', 'name STAFF', 'vlan 20', 'name GUEST', 'exit'],
		['interface range fa0/1-3', 'switchport mode access', 'switchport access vlan 10'],
		['interface fa0/8', 'switchport mode access', 'switchport access vlan 20'],
		[],
		['interface g0/1', 'switchport mode trunk', 'end'],
		['show vlan brief'],
		[],
		[]
	];

	// ---- the drawing ----
	const FA = Array.from({ length: 8 }, (_, i) => `FastEthernet0/${i + 1}`);
	const UP = 'GigabitEthernet0/1';
	const px = (i: number) => 40 + i * 30; // left edge of Fa0/(i+1)
	const GX = 300; // left edge of Gi0/1
	const PY = 114;
	type Dev = { id: string; port: string; x: number; kind: 'lap' | 'ap' };
	const DEVS: Dev[] = [
		{ id: 'Sari', port: FA[0], x: 42, kind: 'lap' },
		{ id: 'Budi', port: FA[1], x: 102, kind: 'lap' },
		{ id: 'Dewi', port: FA[2], x: 162, kind: 'lap' },
		{ id: 'new', port: FA[3], x: 222, kind: 'lap' },
		{ id: 'ap', port: FA[7], x: 304, kind: 'ap' }
	];
	const portCx = (name: string) => (name === UP ? GX + 11 : px(FA.indexOf(name)) + 11);
	const devs = $derived(DEVS.filter((d) => d.id !== 'new' || live));

	function fresh(): Cfg {
		const c = officeSwitch();
		for (const i of c.ifaces)
			if ([FA[0], FA[1], FA[2], FA[3], FA[7], UP].includes(i.name)) i.cable = true;
		return c;
	}

	function onrun(r: Run) {
		if (!live || r.id !== 'if.vlan') return;
		const p = shell.iface(FA[3]);
		if (p?.vlan === 10 && !done) {
			done = true;
			onstate?.('task');
		} else if (shell.ifs.includes(FA[3]) && p?.vlan !== 10) onstate?.('wrongVlan');
	}
	const shell = new IosShell({
		dev: 'switch',
		cfg: fresh(),
		text: () => tx,
		onrun,
		onerror: (t) => {
			if (live) onstate?.(nimToken(t, tx.reactions));
		}
	});

	const vlanOf = (name: string) => shell.iface(name)?.vlan ?? 1;
	const isTrunk = (name: string) => shell.iface(name)?.swMode === 'trunk';
	const tone = (name: string) => {
		if (isTrunk(name)) return 'trunk';
		const v = vlanOf(name);
		return v === 10 ? 'staff' : v === 20 ? 'guest' : 'plain';
	};

	// ---- a guest shouting (a broadcast) ----
	const anim = new Anim();
	type Dot = { x: number; y: number; k: number };
	let dots = $state<Dot[]>([]);
	let heard = $state<string[]>([]);
	const ap = DEVS[4];
	function hearers() {
		const v = vlanOf(ap.port);
		return devs
			.filter((d) => d.id !== 'ap' && !isTrunk(d.port) && vlanOf(d.port) === v)
			.map((d) => d.id);
	}
	const routerHears = () => !isTrunk(UP) && vlanOf(UP) === vlanOf(ap.port);
	const shoutEnd = () => {
		dots = [];
		heard = hearers();
	};
	function shout(instant: boolean) {
		if (instant) return shoutEnd();
		anim.play(async (wait) => {
			heard = [];
			dots = [{ x: ap.x, y: 196, k: 0 }];
			await wait(80);
			dots = [{ x: portCx(ap.port), y: PY + 8, k: 0 }];
			await wait(700);
			const to = hearers();
			const out = devs.filter((d) => to.includes(d.id));
			dots = out.map((d, k) => ({ x: portCx(d.port), y: PY + 8, k: k + 1 }));
			await wait(80);
			dots = out.map((d, k) => ({ x: d.x, y: 196, k: k + 1 }));
			await wait(800);
		}, shoutEnd);
	}

	const director = new Director(
		shell,
		SCRIPTS,
		() => {
			shell.reset(fresh());
			dots = [];
			heard = [];
			done = false;
		},
		(b, instant) => {
			if (SHOUT_BEATS.includes(b)) shout(instant);
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

	const showHeard = $derived(SHOUT_BEATS.includes(beat));
	const vlansMade = $derived(shell.cfg.vlans);
	const devName = (d: Dev) => (d.id === 'ap' ? tx.apLabel : d.id === 'new' ? tx.newLabel : d.id);
	const label = $derived(devs.map((d) => `${devName(d)} ${tone(d.port)}`).join(', '));
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
		<div class="legend">
			<span class="chip plain">VLAN 1 default</span>
			{#each vlansMade as v (v.id)}
				<span class="chip" class:staff={v.id === 10} class:guest={v.id === 20}
					>VLAN {v.id} {v.name}</span
				>
			{/each}
		</div>
		<svg class="sw" viewBox="0 0 360 262" role="img" aria-label={label}>
			<!-- the router up top, joined by the uplink -->
			<rect x="252" y="12" width="96" height="34" rx="6" class="rbody" />
			<text x="262" y="27" class="rbrand">cisco</text>
			<text x="262" y="39" class="rname">nimbus</text>
			{#if showHeard && routerHears() && heard.length}
				<text x="302" y="62" class="heard" text-anchor="end">{tx.heard}</text>
			{/if}
			{#if isTrunk(UP)}
				<path d="M308 46V{PY}" class="cab staff" />
				<path d="M314 46V{PY}" class="cab guest" />
				<rect x="322" y="68" width="34" height="13" rx="6.5" class="tagbg" />
				<text x="339" y="77.5" class="tagtx" text-anchor="middle">802.1Q</text>
			{:else}
				<path d="M311 46V{PY}" class="cab plain" />
			{/if}

			<!-- the switch -->
			<rect x="16" y="92" width="328" height="58" rx="7" class="body" />
			<text x="26" y="106" class="brand">cisco</text>
			<text x="60" y="106" class="model">Catalyst 2960</text>
			<text x="200" y="106" class="host">{shell.cfg.hostname}</text>
			{#each FA as p, i (p)}
				<rect x={px(i)} y={PY} width="22" height="18" rx="2" class="port {tone(p)}" />
				<text x={px(i) + 11} y="144" class="plab" text-anchor="middle">Fa0/{i + 1}</text>
			{/each}
			<rect x={GX} y={PY} width="22" height="18" rx="2" class="port {tone(UP)}" />
			<text x={GX + 11} y="144" class="plab" text-anchor="middle">Gi0/1</text>

			<!-- cables and devices -->
			{#each devs as d (d.id)}
				{@const cx = portCx(d.port)}
				<!-- the cable leaves from the bottom edge of the switch, below the port names -->
				<path d="M{cx} 150C{cx} 172 {d.x} 170 {d.x} 196" class="cab {tone(d.port)}" />
				<g class="dev" class:heard={showHeard && heard.includes(d.id)} class:fresh={d.id === 'new'}>
					{#if d.kind === 'lap'}
						<rect x={d.x - 22} y="196" width="44" height="26" rx="3" class="lap" />
						<rect x={d.x - 18} y="200" width="36" height="18" rx="1.5" class="scr" />
						<path d="M{d.x - 27} 222h54l-4 4h-46z" class="lap" />
					{:else}
						<path d="M{d.x - 10} 202l-3 -10M{d.x + 10} 202l3 -10" class="ant" />
						<rect x={d.x - 20} y="202" width="40" height="16" rx="5" class="lap" />
						<circle cx={d.x} cy="210" r="2.4" class="apled" />
						<path d="M{d.x - 8} 190a11 11 0 0 1 16 0" class="waves" />
					{/if}
					<text x={d.x} y="240" class="dname" text-anchor="middle">{devName(d)}</text>
					{#if showHeard && heard.includes(d.id)}
						<text x={d.x} y="252" class="heard" text-anchor="middle">{tx.heard}</text>
					{/if}
				</g>
			{/each}

			{#each dots as dot (dot.k)}
				<circle class="dot" r="5" style="transform: translate({dot.x}px, {dot.y}px)" />
			{/each}
		</svg>
	{/snippet}
</LabGuide>

<style>
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border-radius: 999px;
		padding: 2px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		font-weight: 700;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		color: var(--color-muted);
		animation: pop 0.3s ease;
	}
	.chip.staff {
		background: var(--color-brand-soft);
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	.chip.guest {
		background: var(--color-amber-soft);
		border-color: var(--color-amber);
		color: var(--color-amber);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
	}
	.sw {
		width: 100%;
		max-width: 410px;
		height: auto;
		overflow: visible;
	}
	.rbody,
	.body {
		fill: #22303b;
		stroke: #384957;
		stroke-width: 1.5;
	}
	.rbrand,
	.brand {
		font-size: 11px;
		font-weight: 800;
		fill: #f2f4f6;
	}
	.rname,
	.host {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9.5px;
		fill: #6fd39a;
	}
	.model {
		font-size: 9px;
		font-weight: 700;
		fill: #8d9aa6;
	}
	.port {
		stroke-width: 2;
		transition:
			fill 0.4s ease,
			stroke 0.4s ease;
	}
	.port.plain {
		fill: #0d1013;
		stroke: #5a636c;
	}
	.port.staff {
		fill: #16304f;
		stroke: var(--color-brand);
	}
	.port.guest {
		fill: #3a2d12;
		stroke: var(--color-amber);
	}
	.port.trunk {
		fill: #0d1013;
		stroke: var(--color-grass);
	}
	.plab {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 7.5px;
		font-weight: 700;
		fill: #8d9aa6;
	}
	.cab {
		fill: none;
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke 0.4s ease;
	}
	.cab.plain {
		stroke: var(--color-faint);
	}
	.cab.staff {
		stroke: var(--color-brand);
	}
	.cab.guest {
		stroke: var(--color-amber);
	}
	.cab.trunk {
		stroke: var(--color-grass);
	}
	.lap {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.scr {
		fill: var(--color-brand-soft);
		transition: fill 0.3s ease;
	}
	.dev.heard .scr {
		fill: var(--color-amber-soft);
	}
	.dev.heard .lap {
		stroke: var(--color-amber);
	}
	.dev.fresh {
		animation: pop 0.4s ease;
	}
	.ant {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.apled {
		fill: var(--color-grass);
	}
	.waves {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.dname {
		font-size: 10px;
		font-weight: 750;
		fill: var(--color-ink);
	}
	.heard {
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-amber);
	}
	.tagbg {
		fill: var(--color-ink);
	}
	.tagtx {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8px;
		font-weight: 700;
		fill: var(--color-paper);
	}
	.dot {
		fill: var(--color-amber);
		stroke: var(--color-card);
		stroke-width: 1.5;
		transition: transform 0.7s ease-in-out;
	}
	@media (prefers-reduced-motion: reduce) {
		.chip,
		.dev.fresh {
			animation: none;
		}
		.dot,
		.port,
		.cab {
			transition: none;
		}
	}
</style>
