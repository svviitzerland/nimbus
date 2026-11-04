<!--
	The small office network every MikroTik Lab lesson keeps building on. The router drawing is
	the same box as router-intro (MikroTik nimbus, ether1 to ether5), with the ISP above it, the
	office laptops below it on a switch (ether2), and optionally a WiFi access point (ether3) and
	the far server on the internet. A packet can travel across it.
-->
<script lang="ts">
	import {
		AP_X,
		ISP,
		LAPTOP_Y,
		NET,
		PORTS,
		RIG_H,
		RIG_W,
		RY,
		SWITCH_Y,
		laptopXs,
		portC,
		portX,
		type RigLaptop,
		type RigPacket
	} from './ros';

	let {
		identity = 'nimbus',
		isp,
		server,
		serverTone = 'idle',
		laptops = [],
		ap,
		glow = [],
		gateway,
		packet,
		mark,
		pluggable = false,
		onlaptop
	}: {
		identity?: string;
		isp: string;
		server?: string;
		serverTone?: 'idle' | 'ok' | 'bad';
		laptops?: RigLaptop[];
		ap?: { label: string; on: boolean; sub?: string };
		glow?: string[];
		gateway?: string;
		packet?: RigPacket | null;
		/** A small cross drawn where traffic got stopped. */
		mark?: { x: number; y: number } | null;
		pluggable?: boolean;
		onlaptop?: (i: number) => void;
	} = $props();

	const xs = $derived(laptopXs(laptops.length, !!ap));
	const anyPlugged = $derived(laptops.some((l) => l.plugged !== false));
	const running = $derived(
		new Set(['ether1', ...(anyPlugged ? ['ether2'] : []), ...(ap ? ['ether3'] : [])])
	);
	// extra room on the left so the SWITCH label sits clear of the first port light
	const swL = $derived(Math.max(4, Math.min(...xs, portC('ether2')) - 44));
	const swR = $derived(Math.max(...xs, portC('ether2')) + 22);
	const label = $derived(
		`MikroTik ${identity}, ` + laptops.map((l) => `${l.name} ${l.ip ?? ''}`).join(', ')
	);
	const pressKey = (e: KeyboardEvent, i: number) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onlaptop?.(i);
		}
	};
</script>

<svg class="rig" viewBox="0 0 {RIG_W} {RIG_H}" role="img" aria-label={label}>
	<!-- the far server on the internet, reached through the ISP -->
	{#if server}
		<path d="M92 31C150 31 200 25 254 25" class="wire" />
		<g class="srv {serverTone}">
			<rect x={NET.x - 20} y="6" width="40" height="38" rx="5" class="dev" />
			{#each [0, 1, 2] as k (k)}
				<rect x={NET.x - 14} y={11 + k * 11} width="28" height="7" rx="2" class="bay" />
				<circle cx={NET.x + 9} cy={14.5 + k * 11} r="1.6" class="bled" />
			{/each}
			<text x={NET.x} y="56" class="dlab" text-anchor="middle">{server}</text>
		</g>
	{/if}

	<!-- the ISP and its cable into ether1 -->
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
		d="M164 {RY + 38}C164 {RY - 10} {ISP.x} {RY - 6} {ISP.x} 44"
		class="cable isp"
		class:hot={glow.includes('ether1')}
	/>

	<!-- office side, ether2 to a switch and the laptops -->
	{#if laptops.length}
		<path
			d="M{portC('ether2')} {RY + 40}V{SWITCH_Y}"
			class="cable lan"
			class:off={!anyPlugged}
			class:hot={glow.includes('ether2')}
		/>
		{#each laptops as l, i (i)}
			{#if l.plugged !== false}
				<path d="M{xs[i]} {SWITCH_Y + 12}V{LAPTOP_Y}" class="cable thin" />
			{/if}
		{/each}
		<rect x={swL} y={SWITCH_Y} width={swR - swL} height="12" rx="3" class="body" />
		{#each laptops as l, i (i)}
			<circle
				cx={xs[i]}
				cy={SWITCH_Y + 6}
				r="2"
				class="led"
				class:on={l.plugged !== false}
				style="animation-delay:{i * 0.41}s"
			/>
		{/each}
		<text x={swL + 6} y={SWITCH_Y + 8.5} class="tiny">SWITCH</text>
	{/if}
	{#if ap}
		<path
			d="M{portC('ether3')} {RY + 40}C{portC('ether3')} {SWITCH_Y} {AP_X} {SWITCH_Y -
				14} {AP_X} {LAPTOP_Y + 8}"
			class="cable lan"
			class:hot={glow.includes('ether3')}
		/>
		<g class="ap" class:on={ap.on}>
			<path d="M{AP_X - 12} {LAPTOP_Y + 8}l-4 -12M{AP_X + 12} {LAPTOP_Y + 8}l4 -12" class="ant" />
			<rect x={AP_X - 22} y={LAPTOP_Y + 8} width="44" height="16" rx="5" class="dev" />
			<circle cx={AP_X} cy={LAPTOP_Y + 16} r="2.4" class="apled" />
			{#if ap.on}
				<path
					d="M{AP_X - 9} {LAPTOP_Y - 2}a12 12 0 0 1 18 0M{AP_X - 5} {LAPTOP_Y + 2}a6 6 0 0 1 10 0"
					class="waves"
				/>
			{/if}
			<text x={AP_X} y={LAPTOP_Y + 40} class="dname" text-anchor="middle">{ap.label}</text>
			{#if ap.sub}<text x={AP_X} y={LAPTOP_Y + 52} class="ip" text-anchor="middle">{ap.sub}</text
				>{/if}
		</g>
	{/if}

	{#each laptops as l, i (i)}
		{@const x = xs[i]}
		{@const tone = l.tone ?? 'idle'}
		<g class="lap {tone}" class:unplugged={l.plugged === false} class:press={pluggable}>
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
			<text {x} y={LAPTOP_Y + 60} class="ip" class:none={!l.ip} text-anchor="middle"
				>{l.ip ?? '0.0.0.0'}</text
			>
			{#if pluggable}
				<rect
					x={x - 34}
					y={LAPTOP_Y - 4}
					width="68"
					height="68"
					rx="8"
					class="hit"
					role="button"
					tabindex="0"
					aria-label={l.name}
					onclick={() => onlaptop?.(i)}
					onkeydown={(e) => pressKey(e, i)}
				/>
			{/if}
		</g>
	{/each}

	<!-- the router body (same drawing as router-intro) -->
	<rect x="14" y={RY} width="312" height="70" rx="10" class="body" />
	<text x="30" y={RY + 28} class="brand">MikroTik</text>
	<text x="30" y={RY + 45} class="ident" class:named={identity === 'nimbus'}>{identity}</text>
	<circle cx="33" cy={RY + 58} r="2.6" class="pwr" />
	<text x="40" y={RY + 61} class="tiny">PWR</text>
	{#each PORTS as p, i (p)}
		{@const x = portX(i)}
		{#if glow.includes(p)}
			<rect x={x - 3} y={RY + 10} width="34" height="42" rx="5" class="halo" />
		{/if}
		<circle
			cx={x + 14}
			cy={RY + 17}
			r="2.6"
			class="led"
			class:on={running.has(p)}
			style="animation-delay:{i * 0.37}s"
		/>
		<path d="M{x} {RY + 24}h28v24h-8v-4h-12v4h-8z" class="hole" />
		{#if running.has(p)}
			<rect x={x + 4} y={RY + 27} width="20" height="14" rx="1.5" class="plug" />
		{/if}
		<text x={x + 14} y={RY + 62} class="plab" class:lit={glow.includes(p)} text-anchor="middle"
			>{p}</text
		>
	{/each}
	{#if gateway}
		<!-- with the access point cable running down on the right, the address moves left of ether2 -->
		<text
			x={ap ? portC('ether2') - 7 : portC('ether2') + 7}
			y={RY + 86}
			text-anchor={ap ? 'end' : 'start'}
			class="gw">{gateway}</text
		>
	{/if}

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
		max-width: 380px;
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
	.cable.lan {
		stroke: var(--color-amber);
	}
	.cable.thin {
		stroke: var(--color-amber);
		stroke-width: 2.5;
	}
	.cable.off {
		opacity: 0.35;
	}
	.cable.hot {
		filter: drop-shadow(0 0 3px rgba(91, 211, 138, 0.9));
	}
	.body {
		fill: #262b31;
		stroke: #3a4149;
		stroke-width: 1.5;
	}
	.brand {
		font-size: 14px;
		font-weight: 800;
		fill: #f2f4f6;
		letter-spacing: 0.01em;
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
		fill: rgba(111, 211, 154, 0.14);
		stroke: #6fd39a;
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
		font-size: 7.5px;
		font-weight: 700;
		fill: #8d9aa6;
	}
	.plab.lit {
		fill: #6fd39a;
	}
	.gw,
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
	.lap {
		transition: opacity 0.3s ease;
	}
	.lap.unplugged {
		opacity: 0.45;
	}
	.hit {
		fill: transparent;
		cursor: pointer;
		outline: none;
	}
	.lap.press:hover .dev,
	.lap.press:focus-within .dev {
		stroke: var(--color-brand);
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
	.ant {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2.2;
		stroke-linecap: round;
	}
	.apled {
		fill: var(--color-faint);
	}
	.ap.on .apled {
		fill: var(--color-grass);
	}
	.waves {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.8;
		stroke-linecap: round;
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
		transition: transform 0.55s ease-in-out;
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
