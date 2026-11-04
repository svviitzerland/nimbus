<script lang="ts">
	// Guided sniffing lesson. A café scene, Sari's laptop, the café WiFi box, the nimbus.com
	// server, and a snooper at the next table. Sari's login flies out by itself while Nim talks,
	// and a copy drifts to the snooper, whose screen shows either her password (HTTP) or noise
	// (HTTPS). On the man in the middle beat the path bends through the snooper's laptop. The only
	// optional play, on the last beat, is switching between HTTP and HTTPS.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { SniffingText, SniffMode } from '$lib/chapters/security/sniffing/types';
	import { guided } from './attacks2/guided.svelte';
	import { sceneClock } from './attacks2/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as SniffingText);

	const g = guided({
		beat: () => beat,
		last: () => tx.steps.length - 1,
		onshow: (v) => onshow?.(v),
		oncomplete: () => oncomplete?.()
	});
	const step = $derived(g.step);
	const last = $derived(tx.steps.length - 1);

	const MODES: SniffMode[] = ['http', 'https'];
	let pick = $state<SniffMode>('http');
	function choose(m: SniffMode) {
		pick = m;
		onstate?.(m);
	}

	const clock = sceneClock(() => [step, pick]);

	type Pt = { x: number; y: number };
	const YOU: Pt = { x: 92, y: 96 };
	const ROUTER: Pt = { x: 230, y: 60 };
	const SERVER: Pt = { x: 400, y: 84 };
	const SNOOP: Pt = { x: 230, y: 172 };

	/** What each beat shows, the mode on the wire and whether the snooper sits in the middle. */
	const scene = $derived.by(() => {
		const s = step;
		if (s === 0) return { mode: null, mitm: false, flow: false };
		if (s === 1) return { mode: null, mitm: false, flow: true };
		if (s === 2 || s === 6) return { mode: 'http' as SniffMode, mitm: false, flow: true };
		if (s === 4) return { mode: 'https' as SniffMode, mitm: true, flow: true };
		if (s === last) return { mode: pick, mitm: false, flow: true };
		return { mode: 'https' as SniffMode, mitm: false, flow: true };
	});
	const secure = $derived(scene.mode === 'https');

	const HOP = 1150;
	const path = $derived(scene.mitm ? [YOU, SNOOP, ROUTER, SERVER] : [YOU, ROUTER, SERVER]);
	const period = $derived(path.length * HOP + 1400);
	/** Which waypoint the packet is heading to, 0 means parked at the start. */
	const hop = $derived.by(() => {
		if (!scene.flow) return 0;
		if (clock.reduced) return 1;
		const t = clock.t % period;
		return Math.min(path.length, Math.floor(t / HOP));
	});
	const pkt = $derived(path[Math.min(hop, path.length - 1)]);
	const pktOn = $derived(scene.flow && hop >= 1 && hop < path.length);
	const snapPkt = $derived(hop === 0);
	// The copy that drifts down to the snooper while the real packet heads to the server.
	const ghostHop = $derived(scene.mitm ? -1 : path.length - 1);
	const ghostOn = $derived(scene.flow && !scene.mitm && hop === ghostHop);
	const ghostAt = $derived(hop >= ghostHop ? SNOOP : ROUTER);
	const caught = $derived(scene.flow && (clock.reduced || clock.t > (scene.mitm ? 1 : 2) * HOP));

	const HTTP_LINES = ['POST /login', 'user=sari', 'pass=kopi123'];
	const NOISE_LINES = ['nimbus.com', '8f#Qx!2kLw9@', 'zT7%p0mVr$1c'];
	const lines = $derived(secure ? NOISE_LINES : HTTP_LINES);
	const who = $derived(step === 4 ? tx.twinLabel : step === 6 ? tx.engineerLabel : tx.snooperLabel);
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="pick" role="group" aria-label={tx.pickLabel}>
				<span class="cap">{tx.pickLabel}</span>
				<div class="chips">
					{#each MODES as m (m)}
						<button
							type="button"
							class="chip {m}"
							class:on={pick === m}
							aria-pressed={pick === m}
							onclick={() => choose(m)}>{tx.modes[m]}</button
						>
					{/each}
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 460 272" class="scene" role="img" aria-label={tx.steps[i].title}>
			<!-- radio waves around the café WiFi -->
			<g class="waves" class:still={clock.reduced}>
				{#each [0, 1, 2] as n (n)}
					<circle cx={ROUTER.x} cy={ROUTER.y} r="34" style="animation-delay:{n * 1.1}s" />
				{/each}
			</g>

			<!-- cable from the café out to the internet and nimbus.com -->
			<path d="M262 62 C320 62 340 84 378 84" class="cable" />

			<!-- the man in the middle detour -->
			{#if i === 4}
				<path d="M110 120 Q170 172 196 178" class="detour" />
				<!-- stops under the WiFi label instead of running through it -->
				<path d="M230 150 L230 96" class="detour" />
			{/if}

			<!-- café WiFi box -->
			<g class="router" class:dim={i === 4}>
				<line x1="214" y1="50" x2="208" y2="34" class="ant" />
				<line x1="246" y1="50" x2="252" y2="34" class="ant" />
				<rect x="200" y="50" width="60" height="22" rx="6" class="box" />
				<circle cx="214" cy="61" r="2.6" class="led" />
				<circle cx="224" cy="61" r="2.6" class="led" />
				<text x="230" y="90" text-anchor="middle" class="lbl">{tx.routerLabel}</text>
			</g>

			<!-- Sari's laptop -->
			<rect x="14" y="108" width="156" height="104" rx="9" class="shell" />
			<rect x="21" y="115" width="142" height="90" rx="4" class="screen" />
			<rect x="28" y="121" width="128" height="15" rx="7.5" class="addr" />
			{#if secure}
				<g transform="translate(35 124.5)" class="lock" class:ring={i === 5}>
					<rect x="0" y="3" width="7" height="5.5" rx="1" />
					<path d="M1.5 3V2a2 2 0 0 1 4 0v1" />
				</g>
				<text x="46" y="131.5" class="url">nimbus.com</text>
			{:else if scene.mode === 'http'}
				<text x="35" y="131.5" class="warn">{tx.notSecure}</text>
				<text x="82" y="131.5" class="url">nimbus.com</text>
			{:else}
				<text x="35" y="131.5" class="url">nimbus.com</text>
			{/if}
			{#if i === 5}
				<circle cx="38.5" cy="128.5" r="9" class="halo" />
			{/if}
			<rect x="36" y="144" width="112" height="13" rx="3" class="field" />
			<text x="41" y="153.5" class="fieldT">sari</text>
			<rect x="36" y="161" width="112" height="13" rx="3" class="field" />
			<text x="41" y="171" class="fieldT">&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</text>
			<rect x="36" y="180" width="48" height="16" rx="8" class="btn" />
			<text x="60" y="191" text-anchor="middle" class="btnT">{tx.loginBtn}</text>
			<path d="M4 214H180L172 223H12Z" class="base" />
			<text x="92" y="240" text-anchor="middle" class="lbl">{tx.youLabel}</text>

			<!-- nimbus.com server -->
			<rect x="378" y="44" width="72" height="116" rx="9" class="shell" />
			{#each [54, 88, 122] as y (y)}
				<rect x="385" {y} width="58" height="28" rx="4" class="unit" />
				<circle cx="395" cy={y + 14} r="3.2" class="led" />
				<line x1="406" y1={y + 10} x2="434" y2={y + 10} class="vent" />
				<line x1="406" y1={y + 18} x2="428" y2={y + 18} class="vent" />
			{/each}
			<text x="414" y="178" text-anchor="middle" class="lbl">{tx.serverLabel}</text>

			<!-- the snooper's laptop at the next table -->
			<g class="snoop" class:mid={i === 4} class:kind={i === 6}>
				<rect x="176" y="150" width="108" height="78" rx="8" class="shell" />
				<rect x="182" y="156" width="96" height="66" rx="4" class="screen dark" />
				<text x="188" y="168" class="sTitle">{tx.snoop.title}</text>
				{#if scene.flow}
					<circle cx="270" cy="165" r="2.6" class="rec" class:still={clock.reduced} />
				{/if}
				{#if !scene.flow}
					<text x="188" y="186" class="sMuted">{tx.snoop.waiting}</text>
				{:else if !scene.mode}
					<text x="188" y="186" class="sMuted">{tx.snoop.recording}</text>
					{#if caught}
						<rect x="188" y="194" width="58" height="5" rx="2.5" class="sBar" />
						<rect x="188" y="204" width="40" height="5" rx="2.5" class="sBar" />
					{/if}
				{:else if caught}
					{#each lines as l, n (n)}
						<text
							x="188"
							y={182 + n * 11}
							class="sLine"
							class:bad={!secure && n === 2}
							class:noise={secure && n > 0}>{l}</text
						>
					{/each}
					<text x="188" y="217" class="sTag" class:ok={secure}>
						{secure ? tx.snoop.noise : tx.snoop.readable}
					</text>
				{/if}
				<path d="M168 230H292L286 238H174Z" class="base" />
				<text x="230" y="256" text-anchor="middle" class="lbl" class:hl={i === 4}>{who}</text>
			</g>

			<!-- the copy that drifts to the snooper -->
			<g
				class="pkt ghost"
				class:off={!ghostOn}
				class:snap={!ghostOn}
				style="transform: translate({ghostAt.x}px, {ghostAt.y}px)"
			>
				{@render letter(secure)}
			</g>

			<!-- the login itself -->
			<g
				class="pkt"
				class:off={!pktOn}
				class:snap={snapPkt}
				style="transform: translate({pkt.x}px, {pkt.y}px)"
			>
				{@render letter(secure)}
			</g>
		</svg>

		{#if i === 5}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

{#snippet letter(sealed: boolean)}
	{#if sealed}
		<rect x="-17" y="-11" width="34" height="22" rx="4" class="env" />
		<path d="M-16 -10L0 1L16 -10" class="flap" />
		<g transform="translate(-4 -2)" class="lock">
			<rect x="0" y="3" width="8" height="6" rx="1" />
			<path d="M1.6 3V2a2.4 2.4 0 0 1 4.8 0v1" />
		</g>
	{:else}
		<rect x="-17" y="-11" width="34" height="22" rx="3" class="card" />
		<line x1="-12" y1="-4" x2="6" y2="-4" class="ink" />
		<line x1="-12" y1="1" x2="10" y2="1" class="ink" />
		<line x1="-12" y1="6" x2="2" y2="6" class="ink" />
	{/if}
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={g.select} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.pick {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chips {
		display: flex;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}
	.chip.http.on {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.chip.https.on {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.rule {
		margin: 0;
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 5px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
	}

	/* ---- svg parts ---- */
	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.screen {
		fill: var(--color-paper);
	}
	.screen.dark {
		fill: var(--color-ink);
	}
	.base {
		fill: var(--color-line);
	}
	.addr,
	.field {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.url {
		font-size: 8px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.warn {
		font-size: 7.5px;
		font-weight: 800;
		fill: var(--color-danger);
	}
	.fieldT {
		font-size: 8px;
		fill: var(--color-ink);
	}
	.btn {
		fill: var(--color-brand);
	}
	.btnT {
		font-size: 7.5px;
		font-weight: 700;
		fill: #fff;
	}
	.lbl {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.lbl.hl {
		fill: var(--color-danger);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-grass);
	}
	.box {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.ant {
		stroke: var(--color-faint);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.router {
		transition: opacity 0.4s;
	}
	.router.dim {
		opacity: 0.5;
	}
	.cable {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.detour {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0.45;
	}
	.waves circle {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.5;
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: wave 3.3s ease-out infinite;
	}
	.waves.still circle {
		animation: none;
		opacity: 0.18;
	}
	@keyframes wave {
		0% {
			transform: scale(0.5);
			opacity: 0.45;
		}
		100% {
			transform: scale(2.2);
			opacity: 0;
		}
	}
	.halo {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.lock rect {
		fill: var(--color-grass);
	}
	.lock path {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.3;
	}

	/* the snooper's screen */
	.snoop {
		transition: transform 0.6s ease;
	}
	.sTitle {
		font-size: 7.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.sMuted {
		font-size: 8px;
		fill: var(--color-faint);
	}
	.sBar {
		fill: var(--color-faint);
		opacity: 0.5;
	}
	.sLine {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 8px;
		fill: var(--color-paper);
	}
	.sLine.bad {
		fill: var(--color-danger);
		font-weight: 700;
	}
	.sLine.noise {
		fill: var(--color-faint);
	}
	.sTag {
		font-size: 7px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-danger);
	}
	.sTag.ok {
		fill: var(--color-grass);
	}
	.rec {
		fill: var(--color-danger);
		animation: rec 1.2s ease-in-out infinite;
	}
	.rec.still {
		animation: none;
	}
	@keyframes rec {
		50% {
			opacity: 0.2;
		}
	}

	/* the flying login */
	.pkt {
		transition:
			transform 1.05s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.35s ease;
	}
	.pkt.snap {
		transition: opacity 0.35s ease;
	}
	.pkt.off {
		opacity: 0;
	}
	.ghost {
		opacity: 0.7;
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.ink {
		stroke: var(--color-danger);
		stroke-width: 1.6;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.env {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 1.5;
	}
	.flap {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.2;
		opacity: 0.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.pkt,
		.snoop,
		.router,
		.chip {
			transition: none;
		}
		.waves circle,
		.rec {
			animation: none;
		}
	}
</style>
