<!--
	The office every Cisco Lab lesson builds on, drawn around a Cisco 2911 router named nimbus:
	the ISP above it on GigabitEthernet0/0, the office switch and laptops below on
	GigabitEthernet0/1, and optionally the far server on the internet and an eavesdropper on the
	LAN. Port lights follow the real interface state, and a packet can travel across it.
-->
<script module lang="ts">
	export const RIG_W = 340;
	export const RIG_H = 264;
	export const RY = 72; // top of the router body
	export const PORTS = ['GigabitEthernet0/0', 'GigabitEthernet0/1', 'GigabitEthernet0/2'];
	export const portX = (i: number) => 156 + i * 40; // left edge of a port hole
	export const portC = (name: string) => portX(PORTS.indexOf(name)) + 14;
	export const ISP = { x: 60, y: 31 };
	export const NET = { x: 274, y: 25 };
	export const SWITCH_Y = 166;
	export const LAPTOP_Y = 198;
	/** Centres of the office laptops under the switch. */
	export function lapXs(n: number, spy = false): number[] {
		const [a, b] = spy ? [52, 200] : [60, 280];
		if (n <= 1) return [spy ? 120 : 170];
		return Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
	}
	export const SPY_X = 284;
	export const ROUTER_C = { x: 196, y: RY + 34 };

	export type PortLook = {
		state: 'up' | 'down' | 'admin';
		tag?: string;
		tone?: 'ok' | 'warn' | 'brand';
	};
	export type Lap = { name: string; ip?: string; tone?: 'ok' | 'bad' | 'wait' | 'idle' };
	export type Pkt = { x: number; y: number; label: string; tone?: 'ok' | 'bad' | 'go' };
</script>

<script lang="ts">
	let {
		hostname = 'nimbus',
		isp,
		server,
		serverTone = 'idle',
		ports,
		laptops = [],
		spy,
		glow = [],
		packet,
		mark
	}: {
		hostname?: string;
		isp: string;
		server?: string;
		serverTone?: 'idle' | 'ok' | 'bad';
		ports: Record<string, PortLook>;
		laptops?: Lap[];
		spy?: { label: string; on: boolean };
		glow?: string[];
		packet?: Pkt | null;
		mark?: { x: number; y: number } | null;
	} = $props();

	const xs = $derived(lapXs(laptops.length, !!spy));
	const lanUp = $derived(ports['GigabitEthernet0/1']?.state === 'up');
	// a little extra room on the left so the SWITCH label sits clear of the first port light
	const swL = $derived(Math.min(...xs, portC('GigabitEthernet0/1'), spy ? SPY_X : 999) - 46);
	const swR = $derived(Math.max(...xs, portC('GigabitEthernet0/1'), spy ? SPY_X : 0) + 24);
	const label = $derived(
		`Cisco ${hostname}, ` + laptops.map((l) => `${l.name} ${l.ip ?? ''}`).join(', ')
	);
	const shortName = (n: string) => n.replace('GigabitEthernet', 'G');
</script>

<svg class="rig" viewBox="0 0 {RIG_W} {RIG_H}" role="img" aria-label={label}>
	{#if server}
		<path d="M92 31C150 31 200 25 254 25" class="wire" />
		<g class="srv {serverTone}">
			<rect x={NET.x - 20} y="6" width="40" height="38" rx="5" class="dev" />
			{#each [0, 1, 2] as k (k)}
				<rect x={NET.x - 14} y={11 + k * 11} width="28" height="7" rx="2" class="bay" />
				<circle cx={NET.x + 9} cy={14.5 + k * 11} r="1.6" class="bled" />
			{/each}
			<text x={NET.x} y="57" class="dlab" text-anchor="middle">{server}</text>
		</g>
	{/if}

	<!-- the ISP and its cable into GigabitEthernet0/0 -->
	<g>
		<rect x={ISP.x - 32} y="18" width="64" height="26" rx="8" class="dev" />
		<circle cx={ISP.x - 14} cy={ISP.y} r="7" fill="none" class="devline" stroke-width="1.4" />
		<ellipse
			cx={ISP.x - 14}
			cy={ISP.y}
			rx="3"
			ry="7"
			fill="none"
			class="devline"
			stroke-width="1.2"
		/>
		<path d="M{ISP.x - 21} {ISP.y}h14" class="devline" stroke-width="1.2" />
		<text x={ISP.x + 12} y={ISP.y + 4} class="dtxt" text-anchor="middle">{isp}</text>
	</g>
	<path
		d="M{portC(PORTS[0])} {RY + 40}C{portC(PORTS[0])} {RY - 10} {ISP.x} {RY - 6} {ISP.x} 44"
		class="cable isp"
		class:hot={glow.includes(PORTS[0])}
	/>

	<!-- office side, GigabitEthernet0/1 to the switch and the laptops -->
	{#if laptops.length || spy}
		<path
			d="M{portC(PORTS[1])} {RY + 40}V{SWITCH_Y}"
			class="cable lan"
			class:off={!lanUp}
			class:hot={glow.includes(PORTS[1])}
		/>
		{#each laptops as _, i (i)}
			<path d="M{xs[i]} {SWITCH_Y + 12}V{LAPTOP_Y}" class="cable thin" />
		{/each}
		{#if spy}<path d="M{SPY_X} {SWITCH_Y + 12}V{LAPTOP_Y}" class="cable thin spyc" />{/if}
		<rect x={swL} y={SWITCH_Y} width={swR - swL} height="12" rx="3" class="swbody" />
		{#each laptops as _, i (i)}
			<circle
				cx={xs[i]}
				cy={SWITCH_Y + 6}
				r="2"
				class="led on"
				style="animation-delay:{i * 0.41}s"
			/>
		{/each}
		<text x={swL + 6} y={SWITCH_Y + 8.5} class="tiny">SWITCH</text>
	{/if}

	{#each laptops as l, i (i)}
		{@const x = xs[i]}
		{@const tone = l.tone ?? 'idle'}
		<g class="lap {tone}">
			<rect x={x - 26} y={LAPTOP_Y} width="52" height="30" rx="3.5" class="dev" />
			<rect x={x - 22} y={LAPTOP_Y + 4} width="44" height="22" rx="1.5" class="scr" />
			{#if tone === 'wait'}
				<path
					d="M{x} {LAPTOP_Y + 10}a5 5 0 1 1 -5 5"
					class="spin"
					style="transform-origin:{x}px {LAPTOP_Y + 15}px"
				/>
			{:else if tone === 'ok'}
				<path d="M{x - 5} {LAPTOP_Y + 15}l3.5 3.5 6.5 -7" class="tick" />
			{:else if tone === 'bad'}
				<path d="M{x - 4} {LAPTOP_Y + 11}l8 8M{x + 4} {LAPTOP_Y + 11}l-8 8" class="cross" />
			{/if}
			<path d="M{x - 32} {LAPTOP_Y + 30}h64l-5 5h-54z" class="dev" />
			<text {x} y={LAPTOP_Y + 48} class="dname" text-anchor="middle">{l.name}</text>
			{#if l.ip !== ''}
				<text {x} y={LAPTOP_Y + 60} class="ip" class:none={!l.ip} text-anchor="middle"
					>{l.ip ?? '0.0.0.0'}</text
				>
			{/if}
		</g>
	{/each}

	{#if spy}
		<g class="spy" class:on={spy.on}>
			<rect x={SPY_X - 24} y={LAPTOP_Y} width="48" height="30" rx="3.5" class="dev" />
			<rect x={SPY_X - 20} y={LAPTOP_Y + 4} width="40" height="22" rx="1.5" class="spyscr" />
			<path d="M{SPY_X - 10} {LAPTOP_Y + 15}q10 -8 20 0q-10 8 -20 0z" class="eye" />
			<circle cx={SPY_X} cy={LAPTOP_Y + 15} r="2.6" class="pupil" />
			<path d="M{SPY_X - 30} {LAPTOP_Y + 30}h60l-5 5h-50z" class="dev" />
			<text x={SPY_X} y={LAPTOP_Y + 48} class="dname" text-anchor="middle">{spy.label}</text>
		</g>
	{/if}

	<!-- the router body, a Cisco 2911 seen from the front -->
	<rect x="14" y={RY} width="312" height="70" rx="8" class="body" />
	<path
		d="M30 {RY + 14}v6M35 {RY + 11}v9M40 {RY + 14}v6M45 {RY + 11}v9M50 {RY + 14}v6"
		class="bars"
	/>
	<text x="30" y={RY + 33} class="brand">cisco</text>
	<text x="74" y={RY + 33} class="model">2911</text>
	<text x="30" y={RY + 50} class="ident" class:named={hostname === 'nimbus'}>{hostname}</text>
	<circle cx="33" cy={RY + 60} r="2.6" class="pwr" />
	<text x="40" y={RY + 63} class="tiny">SYS</text>
	{#each PORTS as p, i (p)}
		{@const x = portX(i)}
		{@const look = ports[p] ?? { state: 'admin' }}
		{#if glow.includes(p)}
			<rect x={x - 4} y={RY + 8} width="36" height="46" rx="5" class="halo" />
		{/if}
		<circle
			cx={x + 14}
			cy={RY + 16}
			r="2.6"
			class="led"
			class:on={look.state === 'up'}
			style="animation-delay:{i * 0.37}s"
		/>
		<path d="M{x} {RY + 23}h28v24h-8v-4h-12v4h-8z" class="hole" />
		{#if p !== 'GigabitEthernet0/2'}
			<rect x={x + 4} y={RY + 26} width="20" height="14" rx="1.5" class="plug" />
		{/if}
		<text x={x + 14} y={RY + 62} class="plab" class:lit={glow.includes(p)} text-anchor="middle"
			>{shortName(p)}</text
		>
		{#if look.tag}
			<!-- neighbouring ports are only 40 apart, so the first tag grows to the left of its port
			     and the second to the right, and two addresses never sit on top of each other -->
			{@const w = look.tag.length * 5.2 + 10}
			{@const tx0 = i === 0 ? x + 26 - w : i === 1 ? x + 2 : x + 14 - w / 2}
			<g class="ptag {look.tone ?? 'brand'}">
				<rect x={tx0} y={RY + 74} width={w} height="13" rx="6.5" />
				<text x={tx0 + w / 2} y={RY + 83.5} text-anchor="middle">{look.tag}</text>
			</g>
		{/if}
	{/each}
	<!-- the console port, light blue like the real one -->
	<rect x="283" y={RY + 26} width="22" height="16" rx="2" class="con" />
	<text x="294" y={RY + 62} class="plab" text-anchor="middle">CON</text>

	{#if mark}
		<g class="mark">
			<circle cx={mark.x} cy={mark.y} r="9" />
			<path d="M{mark.x - 4} {mark.y - 4}l8 8M{mark.x + 4} {mark.y - 4}l-8 8" />
		</g>
	{/if}
	{#if packet}
		<g class="pkt {packet.tone ?? 'go'}" style="transform: translate({packet.x}px, {packet.y}px)">
			<rect x="-9" y="-6.5" width="18" height="13" rx="2.5" />
			<path d="M-9 -5.5l9 6 9 -6" />
			{#if packet.label}
				<rect
					x={-packet.label.length * 2.7 - 5}
					y="-22"
					width={packet.label.length * 5.4 + 10}
					height="13"
					rx="6.5"
					class="tagbg"
				/>
				<text y="-12.5" class="tag" text-anchor="middle">{packet.label}</text>
			{/if}
		</g>
	{/if}
</svg>

<style>
	.rig {
		width: 100%;
		max-width: 390px;
		height: auto;
		overflow: visible;
	}
	.dev {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.devline {
		stroke: var(--color-brand);
	}
	.scr {
		fill: var(--color-brand-soft);
		transition: fill 0.3s ease;
	}
	.dtxt {
		font-size: 11px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.dlab {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.wire {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2.5;
	}
	.bay {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.bled {
		fill: var(--color-faint);
	}
	.srv.ok .bled {
		fill: var(--color-grass);
	}
	.srv.bad .bled {
		fill: var(--color-danger);
	}
	.cable {
		fill: none;
		stroke-width: 4;
		stroke-linecap: round;
		transition:
			filter 0.3s ease,
			opacity 0.3s ease;
	}
	.cable.isp {
		stroke: var(--color-brand);
	}
	.cable.lan,
	.cable.thin {
		stroke: var(--color-amber);
	}
	.cable.thin {
		stroke-width: 2.5;
	}
	.cable.spyc {
		stroke: var(--color-danger);
		opacity: 0.6;
	}
	.cable.off {
		opacity: 0.35;
	}
	.cable.hot {
		filter: drop-shadow(0 0 3px rgba(91, 211, 138, 0.9));
	}
	.swbody {
		fill: #2a3540;
		stroke: #3c4955;
		stroke-width: 1.2;
	}
	.body {
		fill: #22303b;
		stroke: #384957;
		stroke-width: 1.5;
	}
	.bars {
		stroke: #6fc2f0;
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.brand {
		font-size: 14px;
		font-weight: 800;
		fill: #f2f4f6;
	}
	.model {
		font-size: 10px;
		font-weight: 700;
		fill: #8d9aa6;
	}
	.ident {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		fill: #8d9aa6;
	}
	.ident.named {
		fill: #6fd39a;
	}
	.pwr {
		fill: #5bbd84;
	}
	.tiny {
		font-size: 7px;
		font-weight: 700;
		fill: #8d9aa6;
		letter-spacing: 0.06em;
	}
	.hole {
		fill: #0d1013;
		stroke: #4a525b;
		stroke-width: 1;
	}
	.plug {
		fill: #d6dde3;
	}
	.con {
		fill: #7fb8dc;
		stroke: #4a7c9c;
	}
	.led {
		fill: #4a5058;
	}
	.led.on {
		fill: #6fd39a;
		animation: link 1.3s steps(2) infinite;
	}
	@keyframes link {
		50% {
			fill: #2f7d54;
		}
	}
	.halo {
		fill: rgba(111, 194, 240, 0.14);
		stroke: #6fc2f0;
		stroke-width: 2;
		animation: glow 1.6s ease-in-out infinite;
	}
	@keyframes glow {
		0%,
		100% {
			opacity: 0.55;
		}
		50% {
			opacity: 1;
		}
	}
	.plab {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8px;
		font-weight: 700;
		fill: #8d9aa6;
	}
	.plab.lit {
		fill: #6fc2f0;
	}
	.ptag rect {
		fill: var(--color-brand);
	}
	.ptag.ok rect {
		fill: var(--color-grass);
	}
	.ptag.warn rect {
		fill: var(--color-amber);
	}
	.ptag text {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8.5px;
		font-weight: 700;
		fill: #fff;
	}
	.ip {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.ip.none {
		fill: var(--color-faint);
	}
	.dname {
		font-size: 10px;
		font-weight: 750;
		fill: var(--color-ink);
	}
	.lap.ok .scr {
		fill: var(--color-grass-soft);
	}
	.lap.bad .scr {
		fill: var(--color-danger-soft);
	}
	.lap.wait .scr {
		fill: var(--color-amber-soft);
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.cross {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.spin {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
		transform-box: view-box;
		animation: spin 0.9s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.spyscr {
		fill: var(--color-danger-soft);
	}
	.eye {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.4;
	}
	.pupil {
		fill: var(--color-danger);
	}
	.spy {
		opacity: 0.55;
		transition: opacity 0.3s ease;
	}
	.spy.on {
		opacity: 1;
	}
	.mark circle {
		fill: var(--color-danger);
	}
	.mark path {
		stroke: #fff;
		stroke-width: 2;
		stroke-linecap: round;
	}
	.pkt {
		transition: transform 0.6s ease-in-out;
	}
	.pkt > rect:first-child {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.pkt > path {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.3;
	}
	.pkt.ok > rect:first-child,
	.pkt.ok > path {
		stroke: var(--color-grass);
	}
	.pkt.bad > rect:first-child,
	.pkt.bad > path {
		stroke: var(--color-danger);
	}
	.tagbg {
		fill: var(--color-ink);
	}
	.tag {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8.5px;
		font-weight: 700;
		fill: var(--color-paper);
	}
	@media (prefers-reduced-motion: reduce) {
		.led.on,
		.halo,
		.spin {
			animation: none;
		}
		.pkt {
			transition: none;
		}
	}
</style>
