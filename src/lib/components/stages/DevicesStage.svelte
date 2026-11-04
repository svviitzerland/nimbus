<script lang="ts">
	// Guided: the chain that carries the internet from the street to every desk. The provider's
	// cable enters, then modem, router, switch, with cables to the PCs and an access point that
	// sends WiFi to a phone. Each beat lights one box; on the last beat a box can be unplugged.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DevicePart, DevicesText } from '$lib/chapters/network/devices/types';
	import Guide from '$lib/components/Guide.svelte';
	import Thing from './netguide/Thing.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DevicesText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	const last = $derived(tx.intro.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const isLast = $derived(beat >= last);
	const TRY = 7;

	// the one optional interaction, unplug a box
	let pulled = $state<DevicePart | null>(null);
	const TOKENS: Record<DevicePart, string> = {
		modem: 'noModem',
		router: 'noRouter',
		switch: 'noSwitch',
		ap: 'noAp'
	};
	function toggle(p: DevicePart) {
		if (!isLast) return;
		peek = null;
		if (pulled === p) {
			pulled = null;
			onstate?.('fixed');
		} else {
			pulled = p;
			onstate?.(TOKENS[p]);
		}
	}
	type Status = 'online' | 'local' | 'offline';
	function statusOf(dev: 'pc' | 'phone', p: DevicePart | null): Status {
		if (!p) return 'online';
		if (p === 'switch') return 'offline';
		if (p === 'ap') return dev === 'phone' ? 'offline' : 'online';
		return 'local';
	}

	const BOXES: { part: DevicePart; x: number; y: number; step: number }[] = [
		{ part: 'modem', x: 92, y: 112, step: 1 },
		{ part: 'router', x: 182, y: 112, step: 2 },
		{ part: 'switch', x: 278, y: 112, step: 3 },
		{ part: 'ap', x: 278, y: 222, step: 4 }
	];
	const ENDS = [
		{ dev: 'pc' as const, x: 398, y: 64, n: 1 },
		{ dev: 'pc' as const, x: 398, y: 162, n: 2 },
		{ dev: 'phone' as const, x: 398, y: 236, n: 0 }
	];
	const arc = (d: number) =>
		`M ${300 + d} ${222 - d * 0.55} Q ${300 + d * 1.4} 222 ${300 + d} ${222 + d * 0.55}`;
</script>

<div class="wrap">
	<p class="tryrow" class:show={isLast} aria-hidden={!isLast}>{tx.unplugHint}</p>

	<Guide steps={tx.steps} {active} onselect={(k) => (peek = k)}>
		{#snippet visual(s)}
			{@const play = s === TRY}
			{@const p = play ? pulled : null}
			<svg viewBox="0 0 460 300" class="art" role="img" aria-label={tx.title}>
				<!-- the building wall and the provider's cable coming through it -->
				<line class="wall" x1="40" y1="28" x2="40" y2="292" />
				<text class="lbl start" x="4" y="96">{tx.internetLabel}</text>
				<line class="isp" class:hi={s === 0} x1="0" y1="112" x2="78" y2="112" />

				<!-- cables inside -->
				<g class="cables" class:hi={s === 0}>
					<line x1="106" y1="112" x2="158" y2="112" />
					<line x1="206" y1="112" x2="250" y2="112" />
					<polyline points="306,112 340,112 340,64 376,64" />
					<polyline points="340,112 340,162 376,162" />
					<line x1="278" y1="120" x2="278" y2="214" />
				</g>

				<!-- the radio waves from the access point to the phone -->
				<g class="waves" class:on={p !== 'ap' && p !== 'switch'} class:hi={s === 4}>
					{#each [0, 18, 36] as d, k (d)}
						<path d={arc(d + 8)} style="animation-delay: {k * 0.35}s" />
					{/each}
				</g>

				<!-- the four boxes -->
				{#each BOXES as b (b.part)}
					{@const isOff = p === b.part}
					<g
						class="box"
						class:pulled={isOff}
						class:tap={play}
						role="button"
						tabindex={play ? 0 : -1}
						aria-label={tx.parts[b.part].name}
						onclick={() => toggle(b.part)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								toggle(b.part);
							}
						}}
					>
						<rect class="hit" x={b.x - 36} y={b.y - 34} width="72" height="62" rx="12" />
						<Thing
							kind={b.part}
							x={b.x}
							y={b.y}
							s={1.05}
							hi={s === b.step || s === 5}
							dim={(s >= 1 && s <= 4 && s !== b.step) || isOff}
							off={isOff}
						/>
						<text
							class="name"
							class:hi={s === b.step}
							x={b.x}
							y={b.part === 'ap' ? b.y + 26 : b.y - 30}>{tx.parts[b.part].name}</text
						>
					</g>
				{/each}

				<!-- the memory words, one under each box -->
				<g class="memos" class:show={s === 5}>
					{#each BOXES as b (b.part)}
						{@const w = tx.parts[b.part].memo.length * 6.6 + 18}
						<g class="memo">
							<rect
								x={b.x - w / 2}
								y={b.part === 'ap' ? b.y + 34 : b.y + 22}
								width={w}
								height="19"
								rx="9.5"
							/>
							<text x={b.x} y={b.part === 'ap' ? b.y + 47 : b.y + 35}>{tx.parts[b.part].memo}</text>
						</g>
					{/each}
				</g>

				<!-- the PCs and the phone -->
				{#each ENDS as e (e.n)}
					{@const st = statusOf(e.dev, p)}
					<Thing
						kind={e.dev}
						x={e.x}
						y={e.y}
						dim={s >= 1 && s <= 3 ? false : s === 4 && e.dev === 'pc'}
						off={st === 'offline'}
					/>
					{#if play}
						<g class="status {st}">
							<rect x={e.x - 40} y={e.y + 24} width="80" height="19" rx="9.5" />
							<text x={e.x} y={e.y + 37}>{tx.status[st]}</text>
						</g>
					{:else}
						<text class="lbl" x={e.x} y={e.y + 36}
							>{e.dev === 'pc' ? tx.pcLabel.replace('{n}', String(e.n)) : tx.phoneLabel}</text
						>
					{/if}
				{/each}

				<!-- at home, all four live in one case -->
				<g class="home" class:show={s === 6}>
					<rect x="52" y="54" width="268" height="206" rx="22" />
					<text x="186" y="282">{tx.homeBoxLabel}</text>
				</g>

				<!-- data flowing in from the street -->
				{#if !p}
					<circle class="pkt a" r="4.5" />
					<circle class="pkt b" r="4.5" />
				{/if}
			</svg>
		{/snippet}
	</Guide>
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			padding-bottom: 1rem;
		}
	}
	.tryrow {
		display: flex;
		min-height: 40px;
		align-items: center;
		margin: 0;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.3s ease;
	}
	.tryrow.show {
		visibility: visible;
		opacity: 1;
	}
	.art {
		width: 100%;
		max-width: 480px;
		height: auto;
		overflow: visible;
	}
	.wall {
		stroke: var(--color-line);
		stroke-width: 6;
		stroke-linecap: round;
	}
	.lbl {
		fill: var(--color-faint);
		font-size: 11.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.lbl.start {
		text-anchor: start;
	}
	.isp {
		stroke: var(--color-amber);
		stroke-width: 4;
		stroke-linecap: round;
		transition: stroke-width 0.3s;
	}
	.isp.hi {
		stroke-width: 6;
	}
	.cables line,
	.cables polyline {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linejoin: round;
		opacity: 0.6;
		transition: stroke 0.3s;
	}
	.cables.hi line,
	.cables.hi polyline {
		stroke: var(--color-brand);
		opacity: 0.8;
	}
	.waves path {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linecap: round;
		opacity: 0;
	}
	.waves.on path {
		opacity: 0.6;
		animation: wave 1.8s ease-in-out infinite;
	}
	.waves.on.hi path {
		stroke: var(--color-brand);
	}
	@keyframes wave {
		0%,
		100% {
			opacity: 0.15;
		}
		50% {
			opacity: 0.85;
		}
	}
	.hit {
		fill: transparent;
		stroke: none;
	}
	.box {
		outline: none;
	}
	.box.tap {
		cursor: pointer;
	}
	.box.tap:hover .hit,
	.box.tap:focus-visible .hit {
		fill: var(--color-brand-soft);
	}
	.box.pulled .hit {
		fill: var(--color-danger-soft);
	}
	.name {
		fill: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		transition: fill 0.3s;
	}
	.name.hi {
		fill: var(--color-brand);
	}
	.memos {
		opacity: 0;
		transition: opacity 0.5s ease;
	}
	.memos.show {
		opacity: 1;
	}
	.memo rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.2;
	}
	.memo text {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.status rect {
		stroke-width: 1.2;
	}
	.status text {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.status.online rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.status.online text {
		fill: var(--color-grass);
	}
	.status.local rect {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.status.local text {
		fill: var(--color-amber);
	}
	.status.offline rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.status.offline text {
		fill: var(--color-danger);
	}
	.home {
		opacity: 0;
		transition: opacity 0.6s ease;
	}
	.home.show {
		opacity: 1;
	}
	.home rect {
		fill: color-mix(in srgb, var(--color-amber) 7%, transparent);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.home text {
		fill: var(--color-amber);
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
	}
	.pkt {
		fill: var(--color-amber);
		opacity: 0;
	}
	.pkt.a {
		animation: to-pc 4.2s ease-in-out infinite;
	}
	.pkt.b {
		animation: to-ap 4.2s ease-in-out 2.1s infinite;
	}
	@keyframes to-pc {
		0% {
			transform: translate(0px, 112px);
			opacity: 0;
		}
		6%,
		94% {
			opacity: 1;
		}
		22% {
			transform: translate(92px, 112px);
		}
		44% {
			transform: translate(182px, 112px);
		}
		64% {
			transform: translate(278px, 112px);
		}
		74% {
			transform: translate(340px, 112px);
		}
		84% {
			transform: translate(340px, 64px);
		}
		100% {
			transform: translate(376px, 64px);
			opacity: 0;
		}
	}
	@keyframes to-ap {
		0% {
			transform: translate(0px, 112px);
			opacity: 0;
		}
		6%,
		94% {
			opacity: 1;
		}
		22% {
			transform: translate(92px, 112px);
		}
		44% {
			transform: translate(182px, 112px);
		}
		64% {
			transform: translate(278px, 112px);
		}
		100% {
			transform: translate(278px, 214px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tryrow,
		.memos,
		.home,
		.name,
		.isp,
		.cables line,
		.cables polyline {
			transition: none;
		}
		.waves.on path {
			animation: none;
		}
		.pkt {
			animation: none !important;
			opacity: 0 !important;
		}
	}
</style>
