<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import WorldMap from '../WorldMap.svelte';
	import Plane from '../Plane.svelte';
	import type { LessonText, FailoverText } from '$lib/chapters/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as FailoverText);

	const FLAT_W = 960;
	const FLAT_H = 373.33;
	const fx = (lon: number) => ((lon + 180) / 360) * FLAT_W;
	const fy = (lat: number) => ((84 - lat) / 140) * FLAT_H;

	const PRIMARY = { key: 'virginia', lon: -77.5, lat: 39 };
	const STANDBY = { key: 'singapore', lon: 103.8, lat: 1.35 };
	const pAt = { x: fx(PRIMARY.lon), y: fy(PRIMARY.lat) };
	const sAt = { x: fx(STANDBY.lon), y: fy(STANDBY.lat) };

	type Phase = 'normal' | 'down' | 'failing' | 'failed-over';
	let standby = $state(false);
	let phase = $state<Phase>('normal');
	let striking = $state(false);
	let strikeKey = $state(0);
	let showMissile = $state(false);
	let showBoom = $state(false);
	let fired = false;
	let t1: ReturnType<typeof setTimeout> | undefined;
	let t2: ReturnType<typeof setTimeout> | undefined;
	let tB: ReturnType<typeof setTimeout> | undefined;
	let tR: ReturnType<typeof setTimeout> | undefined;

	const primaryDown = $derived(phase !== 'normal');
	const browser = $derived<'loaded' | 'loading' | 'offline'>(
		phase === 'failing' ? 'loading' : phase === 'down' ? 'offline' : 'loaded'
	);

	function toggleStandby() {
		if (phase !== 'normal' || striking) return;
		standby = !standby;
	}
	function kill() {
		if (phase !== 'normal' || striking) return;
		strikeKey += 1;
		striking = true;
		showMissile = true; // a jet streaks in toward the primary region
		t1 = setTimeout(() => {
			showMissile = false;
			showBoom = true; // then the strike lands and explodes
			tB = setTimeout(() => (showBoom = false), 800);
			if (standby) {
				phase = 'failing';
				t2 = setTimeout(() => {
					phase = 'failed-over';
					onstate?.('failover');
					if (!fired) {
						fired = true;
						oncomplete?.();
					}
				}, 1200);
			} else {
				phase = 'down';
				onstate?.('spof');
			}
		}, 850);
		tR = setTimeout(
			() => {
				phase = 'normal';
				striking = false;
			},
			standby ? 5000 : 3400
		);
	}

	const standbyStatus = $derived(
		!standby
			? `+ ${tx.standbyLabel}`
			: phase === 'failed-over'
				? `${tx.standbyLabel}, ${tx.serving}`
				: phase === 'failing'
					? tx.failingOver
					: `${tx.standbyLabel}, ${tx.standbyState}`
	);
	const standbyColor = $derived(
		!standby
			? '#a9c8e8'
			: phase === 'failed-over'
				? '#2f9e44'
				: phase === 'failing'
					? '#dd9e36'
					: '#8a949d'
	);

	onDestroy(() => {
		clearTimeout(t1);
		clearTimeout(t2);
		clearTimeout(tB);
		clearTimeout(tR);
	});
</script>

<div class="flex h-full w-full flex-col gap-4 md:flex-row">
	<div
		class="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-line"
		style="background:#f1f6fc;"
	>
		<svg
			viewBox="0 0 {FLAT_W} {FLAT_H}"
			class="h-full w-full"
			preserveAspectRatio="xMidYMid meet"
			role="img"
			aria-label="map"
		>
			<rect width={FLAT_W} height={FLAT_H} fill="#f1f6fc" />
			<WorldMap />

			<!-- standby region -->
			<g
				class="pin"
				role="button"
				tabindex="0"
				aria-label={tx.regions[STANDBY.key]}
				onclick={toggleStandby}
				onkeydown={(e) => e.key === 'Enter' && toggleStandby()}
			>
				<circle
					cx={sAt.x}
					cy={sAt.y}
					r="6.5"
					fill={standbyColor}
					stroke="#fff"
					stroke-width="2"
					opacity={standby ? 1 : 0.7}
				/>
				<text
					x={sAt.x}
					y={sAt.y - 12}
					text-anchor="middle"
					fill="#16212b"
					font-size="12.5"
					font-weight="700">{tx.regions[STANDBY.key]}</text
				>
				<text
					x={sAt.x}
					y={sAt.y + 18}
					text-anchor="middle"
					fill="#5e6b76"
					font-size="10.5"
					font-weight="600">{standbyStatus}</text
				>
			</g>

			<!-- primary region -->
			<g>
				{#if !primaryDown}
					<circle cx={pAt.x} cy={pAt.y} r="13" fill="#2f9e44" opacity="0.18" class="pulse" />
				{/if}
				<circle
					cx={pAt.x}
					cy={pAt.y}
					r="6.5"
					fill={primaryDown ? '#e03131' : '#2f9e44'}
					stroke="#fff"
					stroke-width="2"
				/>
				<text
					x={pAt.x}
					y={pAt.y - 12}
					text-anchor="middle"
					fill="#16212b"
					font-size="12.5"
					font-weight="700">{tx.regions[PRIMARY.key]}</text
				>
				<text
					x={pAt.x}
					y={pAt.y + 18}
					text-anchor="middle"
					fill="#5e6b76"
					font-size="10.5"
					font-weight="600"
				>
					{tx.primaryLabel}, {primaryDown ? tx.statusDown : tx.serving}
				</text>
			</g>

			<!-- a jet streaks in toward the primary region, then the explosion (both in map coords) -->
			{#key strikeKey}
				{#if showMissile}
					<g transform="translate({pAt.x} {pAt.y})"><g class="incoming"><Plane /></g></g>
				{/if}
				{#if showBoom}
					<g transform="translate({pAt.x} {pAt.y})">
						<g class="boomg">
							<g stroke="#ff7a1a" stroke-width="4" stroke-linecap="round">
								<line x1="10" y1="0" x2="26" y2="0" />
								<line x1="7.1" y1="7.1" x2="18.4" y2="18.4" />
								<line x1="0" y1="10" x2="0" y2="26" />
								<line x1="-7.1" y1="7.1" x2="-18.4" y2="18.4" />
								<line x1="-10" y1="0" x2="-26" y2="0" />
								<line x1="-7.1" y1="-7.1" x2="-18.4" y2="-18.4" />
								<line x1="0" y1="-10" x2="0" y2="-26" />
								<line x1="7.1" y1="-7.1" x2="18.4" y2="-18.4" />
							</g>
							<circle r="13" fill="#ff9e2c" />
							<circle r="7" fill="#ffe08a" />
						</g>
					</g>
				{/if}
			{/key}
		</svg>

		<!-- controls -->
		<div
			class="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3"
		>
			<p class="text-[11px] text-faint">{tx.addHint}</p>
			<button
				type="button"
				onclick={kill}
				disabled={phase !== 'normal' || striking}
				class="pointer-events-auto shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all hover:brightness-125 disabled:cursor-not-allowed disabled:opacity-40"
				style="background: var(--btn-primary);"
			>
				{tx.kill}
			</button>
		</div>
	</div>

	<!-- Phone + readout, desktop only. Small screens hide it so the map gets the whole space. -->
	<div
		class="hidden shrink-0 items-center justify-center gap-4 md:flex md:w-[200px] md:flex-col md:justify-center"
	>
		<Browser phase={browser} />
		<div class="w-[150px] rounded-2xl border border-line bg-card p-4 text-center md:w-full">
			<p
				class="text-lg font-bold {phase === 'down'
					? 'text-danger'
					: phase === 'failing'
						? 'text-amber'
						: 'text-grass'}"
			>
				{phase === 'down' ? tx.statusDown : phase === 'failing' ? tx.failingOver : tx.statusUp}
			</p>
		</div>
	</div>
</div>

<style>
	.pin {
		cursor: pointer;
		outline: none;
	}
	.pin:focus,
	.pin:focus-visible {
		outline: none;
	}
	.pin:hover circle[stroke] {
		stroke-width: 3;
	}
	.pulse {
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 2s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 0.18;
		}
		50% {
			transform: scale(1.8);
			opacity: 0.04;
		}
	}
	.incoming {
		animation: incoming 0.8s cubic-bezier(0.3, 0, 0.5, 1) forwards;
	}
	@keyframes incoming {
		0% {
			transform: translate(-230px, -180px);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		100% {
			transform: translate(0, 0);
			opacity: 1;
		}
	}
	.boomg {
		transform-box: fill-box;
		transform-origin: center;
		animation: boomg 0.7s ease-out forwards;
	}
	@keyframes boomg {
		0% {
			transform: scale(0.3);
			opacity: 1;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}
</style>
