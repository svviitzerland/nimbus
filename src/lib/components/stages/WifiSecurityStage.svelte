<script lang="ts">
	// Guided WiFi security lesson. A house with a router whose radio waves spill through the
	// walls to a stranger outside. Each beat changes the lock on the router (none, WPA2, WPA3)
	// and the stranger's screen shows what he gets. On the last beat an optional picker lets the
	// learner switch the lock themselves.
	import { onMount } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { WifiSecurityText } from '$lib/chapters/network/wifi-security/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as WifiSecurityText);

	type Mode = 'open' | 'wpa2' | 'wpa3';
	const MODES: Mode[] = ['open', 'wpa2', 'wpa3'];
	const STEP_OF_MODE: Record<Mode, number> = { open: 2, wpa2: 3, wpa3: 4 };
	const STEP_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 6];
	const last = $derived(beat >= tx.intro.length - 1);

	let picked = $state<Mode | null>(null);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});

	const step = $derived(
		peek ??
			(last && picked
				? STEP_OF_MODE[picked]
				: STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)])
	);
	const mode = $derived<Mode | null>(
		step === 2 ? 'open' : step === 3 ? 'wpa2' : step >= 4 ? 'wpa3' : null
	);
	const lines = $derived(
		step === 0 ? tx.snoop.idle : step === 1 ? tx.snoop.listen : tx.snoop[mode ?? 'wpa3']
	);
	const tone = $derived(mode === 'open' ? 'bad' : mode === 'wpa2' ? 'mid' : mode ? 'good' : '');

	function pick(m: Mode) {
		picked = m;
		peek = null;
		onstate?.(m);
	}

	onMount(() => {
		onshow?.(true);
		oncomplete?.();
	});
</script>

{#snippet scene(_: number)}
	<svg viewBox="0 0 360 252" class="w-full max-w-[460px]" role="img" aria-label={tx.title}>
		<!-- radio waves from the router, passing through the walls -->
		<g class="waves {tone}">
			{#each [0, 1, 2] as k (k)}
				<circle cx="78" cy="170" r="250" style="animation-delay:{k * 1.3}s" />
			{/each}
		</g>

		<!-- the house -->
		<path d="M6 80 L112 22 L218 80" class="roof" />
		<rect x="18" y="78" width="188" height="140" rx="4" class="wall" />
		<text x="112" y="66" text-anchor="middle" class="lbl">{tx.homeLabel}</text>

		<!-- guest room -->
		<g class="guest" class:show={step === 5}>
			<rect x="28" y="88" width="72" height="54" rx="8" />
			<text x="64" y="102" text-anchor="middle" class="sm g">{tx.guestLabel}</text>
			<rect x="57" y="108" width="14" height="24" rx="3" class="dev" />
		</g>

		<!-- TV on the wall -->
		<g transform="translate(130 92)">
			<rect width="56" height="34" rx="3" class="dev" />
			<rect x="4" y="4" width="48" height="26" rx="1.5" class="scr" />
			<text x="28" y="48" text-anchor="middle" class="sm">{tx.tvLabel}</text>
		</g>
		<!-- laptop on a table -->
		<g transform="translate(136 160)">
			<rect x="3" y="0" width="38" height="24" rx="3" class="dev" />
			<rect x="6" y="3" width="32" height="18" rx="1.5" class="scr" />
			<path d="M0 26 h44 l-3 4 h-38 z" class="dev" />
			<rect x="-6" y="31" width="56" height="4" rx="2" class="table" />
			<text x="22" y="49" text-anchor="middle" class="sm">{tx.laptopLabel}</text>
		</g>
		{#if step === 5}
			<line x1="110" y1="92" x2="110" y2="146" class="divider" />
		{/if}

		<!-- router -->
		<g transform="translate(56 160)">
			<line x1="8" y1="2" x2="4" y2="-14" class="ant" />
			<line x1="36" y1="2" x2="40" y2="-14" class="ant" />
			<rect x="0" y="2" width="44" height="16" rx="4" class="router" />
			<circle cx="10" cy="10" r="2" class="led" />
			<circle cx="18" cy="10" r="2" class="led" />
			<text x="22" y="34" text-anchor="middle" class="sm">{tx.routerLabel}</text>
		</g>
		<!-- the lock badge on the router -->
		{#if mode}
			<g transform="translate(78 136)">
				<rect x="-28" y="-11" width="56" height="20" rx="10" class="badge {tone}" />
				{#if mode !== 'open'}
					<rect x="-20" y="-3" width="9" height="7" rx="1.5" class="lockb {tone}" />
					<path d="M-18.5 -3 v-2.5 a3 3 0 0 1 6 0 v2.5" class="locks {tone}" />
				{/if}
				<text x={mode === 'open' ? 0 : 5} y="3.5" text-anchor="middle" class="bt {tone}"
					>{tx.modes[mode]}</text
				>
			</g>
		{/if}

		<!-- the stranger outside -->
		<g transform="translate(276 168)" class="snooper" class:on={step >= 1}>
			<circle cx="14" cy="8" r="8" class="person" />
			<path d="M0 40 q0 -19 14 -19 q14 0 14 19 z" class="person" />
			<rect x="30" y="22" width="30" height="18" rx="2" class="dev" />
			<line x1="56" y1="22" x2="62" y2="8" class="ant" />
		</g>
		<text x="306" y="228" text-anchor="middle" class="sm">{tx.snooperLabel}</text>
		<g transform="translate(226 80)">
			<rect width="128" height="54" rx="10" class="screen {tone}" />
			<path d="M60 54 l8 10 l8 -10" class="screen {tone}" />
			<text x="12" y="22" class="mono {tone}">{lines[0]}</text>
			<text x="12" y="40" class="mono sub">{lines[1]}</text>
		</g>

		<!-- the safer scale -->
		{#if step >= 2}
			<g transform="translate(24 232)">
				{#each MODES as m, k (m)}
					<g transform="translate({k * 62} 0)" class="pill" class:cur={mode === m || step === 6}>
						<rect width="54" height="16" rx="8" class="pr {m}" />
						<text x="27" y="11.5" text-anchor="middle" class="pt {m}">{tx.modes[m]}</text>
					</g>
				{/each}
				<path d="M0 -6 h170 l-5 -3 m5 3 l-5 3" class="arrow" />
				<text x="170" y="-11" text-anchor="end" class="sm">{tx.saferLabel}</text>
			</g>
		{/if}
	</svg>
{/snippet}

<div class="flex w-full flex-col items-center gap-3 pb-28 md:pb-0">
	{#if last}
		<div class="picker" role="group" aria-label={tx.pickLabel}>
			{#each MODES as m (m)}
				<button
					type="button"
					class:on={picked === m}
					aria-pressed={picked === m}
					onclick={() => pick(m)}>{tx.modes[m]}</button
				>
			{/each}
		</div>
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
	.sm.g {
		fill: var(--color-grass);
		font-weight: 700;
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace !important;
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.mono.bad {
		fill: var(--color-danger);
	}
	.mono.mid {
		fill: var(--color-amber);
	}
	.mono.good {
		fill: var(--color-grass);
	}
	.mono.sub {
		font-weight: 400;
		fill: var(--color-muted);
	}
	.waves circle {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		vector-effect: non-scaling-stroke;
		transform-box: fill-box;
		transform-origin: center;
		opacity: 0;
		animation: wave 3.9s ease-out infinite;
	}
	.waves.bad circle {
		stroke: var(--color-danger);
	}
	.waves.mid circle {
		stroke: var(--color-amber);
	}
	.waves.good circle {
		stroke: var(--color-grass);
	}
	@keyframes wave {
		0% {
			transform: scale(0.04);
			opacity: 0.55;
		}
		100% {
			transform: scale(1);
			opacity: 0;
		}
	}
	.roof {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.wall {
		fill: var(--color-card);
		fill-opacity: 0.82;
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.guest {
		opacity: 0;
		transition: opacity 0.5s;
	}
	.guest.show {
		opacity: 1;
	}
	.guest > rect:first-child {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.4;
	}
	.divider {
		stroke: var(--color-grass);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.dev {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.scr {
		fill: var(--color-brand-soft);
	}
	.table {
		fill: var(--color-amber);
		opacity: 0.55;
	}
	.router {
		fill: var(--color-ink);
	}
	.ant {
		stroke: var(--color-ink);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.led {
		fill: var(--color-grass);
	}
	.badge {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.badge.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.badge.mid {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.badge.good {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.bt {
		font-size: 10px;
		font-weight: 800;
	}
	.bt.bad,
	.lockb.bad {
		fill: var(--color-danger);
	}
	.bt.mid,
	.lockb.mid {
		fill: var(--color-amber);
	}
	.bt.good,
	.lockb.good {
		fill: var(--color-grass);
	}
	.locks {
		fill: none;
		stroke-width: 1.5;
	}
	.locks.mid {
		stroke: var(--color-amber);
	}
	.locks.good {
		stroke: var(--color-grass);
	}
	.person {
		fill: var(--color-faint);
	}
	.snooper {
		opacity: 0.55;
		transition: opacity 0.4s;
	}
	.snooper.on {
		opacity: 1;
	}
	.screen {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.4;
		transition: stroke 0.3s;
	}
	.screen.bad {
		stroke: var(--color-danger);
	}
	.screen.mid {
		stroke: var(--color-amber);
	}
	.screen.good {
		stroke: var(--color-grass);
	}
	.pill {
		opacity: 0.45;
		transition: opacity 0.3s;
	}
	.pill.cur {
		opacity: 1;
	}
	.pr.open {
		fill: var(--color-danger-soft);
	}
	.pr.wpa2 {
		fill: var(--color-amber-soft);
	}
	.pr.wpa3 {
		fill: var(--color-grass-soft);
	}
	.pt {
		font-size: 9px;
		font-weight: 800;
	}
	.pt.open {
		fill: var(--color-danger);
	}
	.pt.wpa2 {
		fill: var(--color-amber);
	}
	.pt.wpa3 {
		fill: var(--color-grass);
	}
	.arrow {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.2;
		stroke-linecap: round;
	}
	.picker {
		display: inline-flex;
		gap: 4px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 4px;
	}
	.picker button {
		border-radius: 999px;
		padding: 6px 16px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.picker button.on {
		background: var(--btn-primary);
		color: #fff;
	}
	@media (prefers-reduced-motion: reduce) {
		.waves circle {
			animation: none;
			opacity: 0.25;
		}
		.waves circle:nth-child(1) {
			transform: scale(0.3);
		}
		.waves circle:nth-child(2) {
			transform: scale(0.6);
		}
		.waves circle:nth-child(3) {
			transform: scale(0.9);
		}
		.guest,
		.snooper,
		.pill {
			transition: none;
		}
	}
</style>
