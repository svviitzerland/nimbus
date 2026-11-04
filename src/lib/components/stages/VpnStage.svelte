<script lang="ts">
	// Guided VPN lesson. A cafe on the left, the office on the right, a stranger on the same WiFi
	// below. Nim's beats bring in one part at a time (the open road, the tunnel, the lock, the
	// door opening). On the last beat an optional switch turns the VPN off and on.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { VpnText } from '$lib/chapters/network/vpn/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as VpnText);

	// beat -> panel step (the last beats keep the rule of thumb on screen)
	const STEP_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 6];
	const last = $derived(beat >= tx.intro.length - 1);

	let vpnOn = $state(true);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});

	const step = $derived(
		peek ?? (last ? (vpnOn ? 6 : 2) : STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)])
	);

	// What the picture shows for each step
	const tunnel = $derived(step >= 3);
	const packet = $derived<'none' | 'open' | 'locked'>(
		step === 0 || step === 3 ? 'none' : step >= 4 ? 'locked' : 'open'
	);
	const doorOpen = $derived(step >= 5);
	const snoop = $derived<'idle' | 'plain' | 'noise'>(
		step === 2 ? 'plain' : step >= 4 ? 'noise' : 'idle'
	);
	const focus = $derived(step === 0 ? 'you' : step === 1 || step === 5 ? 'door' : '');

	function toggle() {
		vpnOn = !vpnOn;
		peek = null;
		onstate?.(vpnOn ? 'on' : 'off');
	}

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
	});
</script>

{#snippet scene(_: number)}
	<svg viewBox="0 0 360 250" class="w-full max-w-[460px]" role="img" aria-label={tx.title}>
		<!-- cafe -->
		<rect x="8" y="22" width="150" height="214" rx="18" class="cafe" />
		<text x="22" y="42" class="lbl">{tx.cafeLabel}</text>

		<!-- internet cloud -->
		<g class="cloud" transform="translate(205 52)">
			<path
				d="M-30 10 a14 14 0 0 1 6 -26 a18 18 0 0 1 32 -4 a14 14 0 0 1 22 14 a11 11 0 0 1 0 16 z"
			/>
			<text x="0" y="4" text-anchor="middle" class="sm">{tx.internetLabel}</text>
		</g>

		<!-- the road between cafe and office -->
		<line x1="100" y1="118" x2="252" y2="118" class="road" />

		<!-- tunnel -->
		<g class="tunnel" class:show={tunnel}>
			<rect x="96" y="103" width="160" height="30" rx="15" />
			<text x="176" y="97" text-anchor="middle" class="sm tun">{tx.tunnelLabel}</text>
		</g>

		<!-- you, the laptop at the cafe -->
		{#if focus === 'you'}<circle cx="66" cy="112" r="40" class="halo" />{/if}
		<g transform="translate(36 92)">
			<rect x="4" y="0" width="52" height="34" rx="4" class="lap" />
			<rect x="8" y="4" width="44" height="26" rx="2" class="scr" />
			<rect x="13" y="10" width="22" height="3" rx="1.5" class="ink2" />
			<rect x="13" y="16" width="30" height="3" rx="1.5" class="ink3" />
			<path d="M0 36 h60 l-4 5 h-52 z" class="lap" />
		</g>
		<text x="66" y="150" text-anchor="middle" class="lbl">{tx.youLabel}</text>
		<!-- coffee -->
		<g transform="translate(112 112)">
			<path d="M0 0 h14 l-2 14 h-10 z" class="cup" />
			<path d="M14 3 q6 0 4 6 q-1 3 -5 3" class="cuph" />
		</g>

		<!-- the stranger on the same WiFi -->
		<g transform="translate(46 176)">
			<circle cx="12" cy="8" r="7" class="person" />
			<path d="M0 34 q0 -16 12 -16 q12 0 12 16 z" class="person" />
			<rect x="26" y="20" width="22" height="14" rx="2" class="lap" />
		</g>
		<text x="22" y="226" class="sm">{tx.snooperLabel}</text>
		<g transform="translate(104 180)">
			<rect width="140" height="26" rx="8" class="peek {snoop}" />
			<text x="12" y="17" class="mono {snoop}">
				{snoop === 'plain' ? tx.peekPlain : snoop === 'noise' ? 'x7#q!9@k%2zr' : tx.peekIdle}
			</text>
		</g>
		{#if packet !== 'none' && snoop !== 'idle'}
			<line x1="140" y1="178" x2="150" y2="128" class="sight {snoop}" />
		{/if}

		<!-- office -->
		<rect x="252" y="40" width="98" height="170" rx="10" class="office" />
		<text x="301" y="60" text-anchor="middle" class="lbl">{tx.officeLabel}</text>
		<g transform="translate(286 92)">
			<rect width="42" height="72" rx="6" class="rack" />
			{#each [0, 1, 2] as s (s)}
				<rect x="6" y={8 + s * 21} width="30" height="15" rx="3" class="slot" />
				<circle cx="30" cy={15.5 + s * 21} r="2.2" class="led" class:on={doorOpen} />
			{/each}
		</g>
		<text x="307" y="182" text-anchor="middle" class="sm">{tx.serverLabel}</text>
		{#if focus === 'door'}<circle cx="252" cy="118" r="26" class="halo" />{/if}
		<rect x="247" y="102" width="10" height="32" rx="3" class="door" class:open={doorOpen} />
		<g transform="translate(252 230)">
			<rect x="-38" y="-13" width="76" height="20" rx="10" class="tag" class:ok={doorOpen} />
			<text y="1" text-anchor="middle" class="tagt" class:ok={doorOpen}
				>{doorOpen ? tx.doorOpen : tx.doorShut}</text
			>
		</g>

		<!-- the message travelling -->
		{#if packet !== 'none'}
			{#key packet + String(doorOpen)}
				<g class="pkt" class:through={doorOpen}>
					{#if packet === 'open'}
						<rect x="-11" y="-8" width="22" height="16" rx="2" class="env" />
						<path d="M-11 -8 l11 -7 l11 7" class="envflap" />
						<rect x="-6" y="-3" width="12" height="2" class="ink2" />
						<rect x="-6" y="2" width="9" height="2" class="ink2" />
					{:else}
						<rect x="-10" y="-6" width="20" height="15" rx="3" class="box" />
						<path d="M-5 -6 v-4 a5 5 0 0 1 10 0 v4" class="shackle" />
						<circle cx="0" cy="2" r="2" class="keyhole" />
					{/if}
				</g>
			{/key}
		{/if}
	</svg>
{/snippet}

<div class="flex w-full flex-col items-center gap-3 pb-28 md:pb-0">
	{#if last}
		<button type="button" class="switch" class:on={vpnOn} onclick={toggle} aria-pressed={vpnOn}>
			<span class="knob"></span>
			<span class="font-semibold">{tx.vpnLabel}</span>
			<span class="text-muted">{vpnOn ? tx.onLabel : tx.offLabel}</span>
		</button>
	{/if}
	<Guide steps={tx.steps} active={step} onselect={(i) => (peek = i)} visual={scene} />
</div>

<style>
	svg text {
		font-family: var(--font-sans);
	}
	.lbl {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.sm {
		font-size: 9.5px;
		fill: var(--color-muted);
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
		font-size: 10px;
		fill: var(--color-faint);
	}
	.mono.plain {
		fill: var(--color-danger);
		font-weight: 700;
	}
	.mono.noise {
		fill: var(--color-muted);
	}
	.cafe {
		fill: var(--color-amber-soft);
	}
	.cloud path {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.road {
		stroke: var(--color-line);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.tunnel rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.tunnel {
		opacity: 0;
		transition: opacity 0.6s;
	}
	.tunnel.show {
		opacity: 1;
	}
	.tun {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.halo {
		fill: var(--color-brand);
		opacity: 0.1;
	}
	.lap {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.6;
		stroke-linejoin: round;
	}
	.scr {
		fill: var(--color-brand-soft);
	}
	.ink2 {
		fill: var(--color-brand);
		opacity: 0.6;
	}
	.ink3 {
		fill: var(--color-faint);
		opacity: 0.5;
	}
	.cup {
		fill: var(--color-card);
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.cuph {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.6;
	}
	.person {
		fill: var(--color-faint);
	}
	.peek {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition: stroke 0.3s;
	}
	.peek.plain {
		stroke: var(--color-danger);
	}
	.sight {
		stroke-width: 1.5;
		stroke-linecap: round;
		stroke: var(--color-faint);
	}
	.sight.plain {
		stroke: var(--color-danger);
	}
	.office {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.rack {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.slot {
		fill: var(--color-paper);
		opacity: 0.18;
	}
	.led {
		fill: var(--color-faint);
		transition: fill 0.3s;
	}
	.led.on {
		fill: var(--color-grass);
	}
	.door {
		fill: var(--color-danger);
		transition:
			fill 0.4s,
			transform 0.4s;
		transform-box: fill-box;
		transform-origin: right center;
	}
	.door.open {
		fill: var(--color-grass);
		transform: scaleX(0.3);
	}
	.tag {
		fill: var(--color-danger-soft);
	}
	.tag.ok {
		fill: var(--color-grass-soft);
	}
	.tagt {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-danger);
	}
	.tagt.ok {
		fill: var(--color-grass);
	}
	.env {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.4;
	}
	.envflap {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 1.4;
		stroke-linejoin: round;
	}
	.box {
		fill: var(--color-brand);
	}
	.shackle {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.keyhole {
		fill: var(--color-card);
	}
	/* the message rides along the road, from the laptop toward the office door */
	.pkt {
		animation: ride 3.6s linear infinite;
	}
	.pkt.through {
		animation-name: ride-in;
	}
	@keyframes ride {
		0% {
			transform: translate(104px, 118px);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		75% {
			transform: translate(232px, 118px);
			opacity: 1;
		}
		100% {
			transform: translate(236px, 118px);
			opacity: 0;
		}
	}
	@keyframes ride-in {
		0% {
			transform: translate(104px, 118px);
			opacity: 0;
		}
		10% {
			opacity: 1;
		}
		80% {
			transform: translate(270px, 118px);
			opacity: 1;
		}
		100% {
			transform: translate(284px, 124px);
			opacity: 0;
		}
	}
	.switch {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 7px 16px 7px 8px;
		font-size: 14px;
		color: var(--color-ink);
	}
	.switch .knob {
		position: relative;
		width: 38px;
		height: 22px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.switch .knob::after {
		content: '';
		position: absolute;
		top: 3px;
		left: 3px;
		width: 16px;
		height: 16px;
		border-radius: 999px;
		background: var(--color-card);
		transition: transform 0.2s;
	}
	.switch.on .knob {
		background: var(--color-grass);
	}
	.switch.on .knob::after {
		transform: translateX(16px);
	}
	@media (prefers-reduced-motion: reduce) {
		.pkt,
		.pkt.through {
			animation: none;
			transform: translate(176px, 118px);
		}
		.tunnel,
		.door,
		.switch .knob,
		.switch .knob::after {
			transition: none;
		}
	}
</style>
