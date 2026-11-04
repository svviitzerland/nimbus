<script lang="ts">
	// Guided MAC and ARP lesson. The office room assembles itself beat by beat (devices, their IP
	// addresses, their MAC name tags), then the laptop asks the room who owns the printer IP,
	// the printer answers, and the print job goes straight to its name tag. One optional
	// question on the last beat shows what silence looks like.
	import { onDestroy, onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Device from '$lib/components/stages/addressing/Device.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { MacText } from '$lib/chapters/network/mac/types';

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
	const tx = $derived(text as MacText);

	type Kind = 'laptop' | 'printer' | 'tv' | 'phone';
	type Dev = {
		key: 'you' | 'printer' | 'tv' | 'phone';
		kind: Kind;
		ip: string;
		mac: string;
		x: number;
		y: number;
	};
	const DEVS: Dev[] = [
		{ key: 'phone', kind: 'phone', ip: '192.168.1.40', mac: 'F0:18:98:6D:2A:04', x: 170, y: 58 },
		{
			key: 'printer',
			kind: 'printer',
			ip: '192.168.1.20',
			mac: '00:1B:A9:4C:22:10',
			x: 64,
			y: 112
		},
		{ key: 'tv', kind: 'tv', ip: '192.168.1.30', mac: 'A4:77:33:9E:51:C2', x: 276, y: 112 },
		{ key: 'you', kind: 'laptop', ip: '192.168.1.10', mac: '3C:22:FB:1A:0B:7E', x: 170, y: 214 }
	];
	const PRINTER = DEVS[1];
	const YOU = DEVS[3];
	const GHOST = '192.168.1.99';
	const LAST = $derived(tx.intro.length - 1);

	let still = $state(false);
	let t = $state(0); // a slow tick for the scenes that loop
	let peek = $state<number | null>(null);
	let ghost = $state<'idle' | 'shout' | 'silent'>('idle');
	let timers: ReturnType<typeof setTimeout>[] = [];

	onMount(() => {
		still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		onshow?.(true);
		oncomplete?.();
	});

	$effect(() => {
		void beat;
		peek = null;
		t = 0;
		if (still) return;
		const id = setInterval(() => (t += 1), 1900);
		return () => clearInterval(id);
	});

	onDestroy(() => timers.forEach(clearTimeout));

	function askGhost() {
		if (ghost !== 'idle') return;
		ghost = 'shout';
		const k = still ? 0.3 : 1;
		timers.push(
			setTimeout(() => {
				ghost = 'silent';
				onstate?.('nobody');
			}, 1800 * k),
			setTimeout(() => (ghost = 'idle'), 4200 * k)
		);
	}

	const fill = (s: string, ip: string) => s.replace('{ip}', ip);
</script>

<div class="wrap">
	{#if beat >= LAST}
		<div class="play" in:fade={{ duration: 200 }}>
			<button type="button" class="ask" disabled={ghost !== 'idle'} onclick={askGhost}>
				{fill(tx.ghostBtn, GHOST)}
			</button>
		</div>
	{/if}

	<Guide steps={tx.steps} active={peek ?? beat} onselect={(k) => (peek = k)}>
		{#snippet visual(i)}
			<div class="scene">
				{#if i === 3}
					{@render memory()}
				{:else}
					{@render room(i)}
				{/if}
				{#if i >= 5 && i !== 3}
					<div class="table" in:fade={{ duration: 300 }}>
						<p class="t-title">{tx.tableTitle}</p>
						<div class="row head"><span>{tx.ipHead}</span><span>{tx.macHead}</span></div>
						<div class="row"><span>{PRINTER.ip}</span><span>{PRINTER.mac}</span></div>
					</div>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

{#snippet room(i: number)}
	{@const showIp = i >= 1}
	{@const showMac = i >= 2}
	{@const shouting = i === 4 || (i === LAST && ghost === 'shout')}
	{@const askIp = i === LAST ? GHOST : PRINTER.ip}
	<svg viewBox="0 0 340 290" class="svg" role="img" aria-label={tx.roomLabel}>
		<rect x="6" y="6" width="328" height="278" rx="22" class="floor" />
		<text x="22" y="26" class="room-label">{tx.roomLabel}</text>

		{#if shouting && !still}
			{#each [0, 1, 2] as k (k)}
				<circle
					cx={YOU.x}
					cy={YOU.y}
					r="150"
					class="ring"
					style="transform-origin:{YOU.x}px {YOU.y}px; animation-delay:{k * 0.55}s"
				/>
			{/each}
		{/if}

		{#if i === 5 && !still}
			<circle r="5" class="dot reply">
				<animateMotion
					dur="1.9s"
					repeatCount="indefinite"
					path="M{PRINTER.x} {PRINTER.y} L{YOU.x} {YOU.y}"
				/>
			</circle>
		{/if}
		{#if i === 6}
			<line x1={YOU.x} y1={YOU.y} x2={PRINTER.x} y2={PRINTER.y} class="track" />
			{#if !still}
				<rect width="12" height="9" x="-6" y="-4.5" rx="2" class="job">
					<animateMotion
						dur="1.9s"
						repeatCount="indefinite"
						path="M{YOU.x} {YOU.y} L{PRINTER.x} {PRINTER.y}"
					/>
				</rect>
			{/if}
		{/if}

		{#each DEVS as d (d.key)}
			{@const lit =
				(d.key === 'printer' && i >= 5 && i <= 7) || (d.key === 'you' && (i === 4 || i === 6))}
			{@const quiet = (i === 5 || i === 6) && (d.key === 'tv' || d.key === 'phone')}
			<g class="dev" class:quiet>
				<g transform="translate({d.x - 25} {d.y - 22})">
					<Device
						kind={d.kind}
						size={50}
						tone={lit ? 'var(--color-grass)' : 'var(--color-brand)'}
					/>
				</g>
				<text x={d.x} y={d.y + 31} class="name">{tx.names[d.key]}</text>
				{#if showIp}
					<text x={d.x} y={d.y + 44} class="ip" class:hot={i === 1} in:fade={{ duration: 300 }}
						>{d.ip}</text
					>
				{/if}
				{#if showMac}
					<g in:fade={{ duration: 300 }} class:swing={i === 2 && !still}>
						<rect x={d.x - 46} y={d.y + 49} width="92" height="15" rx="5" class="tag" />
						<circle cx={d.x - 39} cy={d.y + 56.5} r="1.8" class="hole" />
						<text x={d.x + 3} y={d.y + 59.5} class="mac">{d.mac}</text>
					</g>
				{/if}
			</g>
		{/each}

		{#if shouting}
			<g in:fade={{ duration: 200 }}>
				<rect x={YOU.x - 78} y={YOU.y - 62} width="156" height="22" rx="11" class="bubble" />
				<text x={YOU.x} y={YOU.y - 47} class="bubble-t">{fill(tx.shout, askIp)}</text>
			</g>
		{/if}
		{#if i === LAST && ghost === 'silent'}
			<g in:fade={{ duration: 200 }}>
				<rect x={YOU.x - 70} y={YOU.y - 62} width="140" height="22" rx="11" class="bubble mute" />
				<text x={YOU.x} y={YOU.y - 47} class="bubble-t">{tx.silence}</text>
			</g>
		{/if}
		{#if i === 5}
			<g in:fade={{ duration: 200 }}>
				<rect
					x={PRINTER.x - 38}
					y={PRINTER.y - 52}
					width="76"
					height="20"
					rx="10"
					class="bubble ok"
				/>
				<text x={PRINTER.x} y={PRINTER.y - 38} class="bubble-t">{tx.itsMe}</text>
			</g>
		{/if}
		{#if i >= 6 && i <= 7}
			<g in:fade={{ duration: 300 }}>
				<rect
					x={PRINTER.x - 30}
					y={PRINTER.y - 50}
					width="60"
					height="18"
					rx="9"
					class="bubble ok"
				/>
				<text x={PRINTER.x} y={PRINTER.y - 37} class="bubble-t">{tx.printed}</text>
			</g>
		{/if}
	</svg>
{/snippet}

{#snippet memory()}
	{@const phone = DEVS[0]}
	{@const away = t % 2 === 1}
	<svg viewBox="0 0 340 290" class="svg" role="img" aria-label={tx.steps[3].title}>
		<rect x="6" y="40" width="156" height="200" rx="20" class="floor" class:here={!away} />
		<rect x="178" y="40" width="156" height="200" rx="20" class="floor" class:here={away} />
		<text x="84" y="64" class="zone">{tx.officeLabel}</text>
		<text x="256" y="64" class="zone">{tx.cafeLabel}</text>
		<g class="walker" style="transform: translateX({away ? 172 : 0}px)">
			<g transform="translate(55 104)">
				<Device kind="phone" size={58} />
			</g>
			<text x="84" y="170" class="ip hot">{away ? '10.0.0.7' : phone.ip}</text>
			<rect x="38" y="180" width="92" height="15" rx="5" class="tag" />
			<circle cx="45" cy="187.5" r="1.8" class="hole" />
			<text x="87" y="190.5" class="mac">{phone.mac}</text>
		</g>
	</svg>
{/snippet}

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 14px;
		padding: 8px 16px 112px;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-bottom: 24px;
		}
	}
	.play {
		display: flex;
		justify-content: center;
	}
	.ask {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.06);
	}
	.ask:disabled {
		opacity: 0.55;
	}
	.scene {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.svg {
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.floor {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.6s,
			fill 0.6s;
	}
	.floor.here {
		stroke: var(--color-brand);
	}
	.room-label,
	.zone {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.zone {
		text-anchor: middle;
	}
	.name {
		text-anchor: middle;
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.ip {
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9.5px;
		fill: var(--color-muted);
	}
	.ip.hot {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.tag {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1;
	}
	.hole {
		fill: var(--color-amber);
	}
	.mac {
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 7.6px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.dev {
		transition: opacity 0.5s;
	}
	.dev.quiet {
		opacity: 0.4;
	}
	.swing {
		animation: swing 1.6s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: top left;
	}
	@keyframes swing {
		0%,
		100% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(-3deg);
		}
	}
	.ring {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.4;
		animation: ring 1.8s ease-out infinite;
	}
	@keyframes ring {
		from {
			transform: scale(0.08);
			opacity: 0.7;
		}
		to {
			transform: scale(1);
			opacity: 0;
		}
	}
	.dot.reply {
		fill: var(--color-grass);
	}
	.track {
		stroke: var(--color-grass);
		stroke-width: 1.5;
		opacity: 0.35;
	}
	.job {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 1.5;
	}
	.bubble {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.bubble.ok {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.bubble.mute {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.bubble-t {
		text-anchor: middle;
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.walker {
		transition: transform 1.3s cubic-bezier(0.45, 0, 0.2, 1);
	}
	.table {
		width: 100%;
		max-width: 300px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 14px;
		font-size: 12px;
	}
	.t-title {
		margin: 0 0 6px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1.4fr;
		gap: 8px;
		font-family: var(--font-mono, ui-monospace, monospace);
		color: var(--color-ink);
	}
	.row.head {
		font-family: inherit;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	@media (prefers-reduced-motion: reduce) {
		.walker,
		.floor,
		.dev {
			transition: none;
		}
		.swing,
		.ring {
			animation: none;
		}
	}
</style>
