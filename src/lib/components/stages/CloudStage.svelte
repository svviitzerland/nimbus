<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '../Browser.svelte';
	import Server from '../Server.svelte';
	import type { CloudText, LessonText } from '$lib/chapters/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CloudText);

	let open = $state<'home' | 'cloud' | null>(null);
	let explored = $state({ home: false, cloud: false });
	let preview = $state<'idle' | 'loading' | 'loaded' | 'offline'>('idle');

	// the home server flickers offline during a power cut; the link and house react to it
	const down = $derived(open === 'home' && preview === 'offline');
	const live = $derived(preview === 'loaded');
	const linkColor = $derived(open === 'cloud' ? '#2e6fe0' : '#3a9c64');

	let timers: ReturnType<typeof setTimeout>[] = [];
	let loop: ReturnType<typeof setInterval> | undefined;
	function clearAll() {
		timers.forEach(clearTimeout);
		timers = [];
		if (loop) {
			clearInterval(loop);
			loop = undefined;
		}
	}

	function pick(which: 'home' | 'cloud') {
		const fresh = !explored[which];
		const wasBoth = explored.home && explored.cloud;
		open = which;
		explored = { ...explored, [which]: true };

		clearAll();
		preview = 'loading';
		if (which === 'cloud') {
			// cloud: loads quickly and stays online
			timers.push(setTimeout(() => (preview = 'loaded'), 650));
		} else {
			// on-premise: loads, then keeps flickering offline (power cuts)
			timers.push(
				setTimeout(() => {
					preview = 'loaded';
					loop = setInterval(() => {
						preview = preview === 'loaded' ? 'offline' : 'loaded';
					}, 1100);
				}, 650)
			);
		}

		// the side you just opened speaks first, then the wrap up once both are seen
		if (fresh) onstate?.(which);
		if (explored.home && explored.cloud && !wasBoth) {
			onstate?.('both');
			oncomplete?.();
		}
	}

	onDestroy(clearAll);
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- picker: choose where your server lives -->
	<div
		class="grid w-full max-w-md grid-cols-2 gap-1.5 rounded-2xl border border-line bg-card p-1.5"
		class:invite={!open}
	>
		<button onclick={() => pick('home')} class="seg {open === 'home' ? 'on-amber' : 'off'}">
			<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
				><g fill="currentColor"
					><path d="M12 4.4 20.4 11H3.6Z" /><rect
						x="6"
						y="10.6"
						width="12"
						height="9.4"
						rx="1.4"
					/></g
				></svg
			>
			<span>{tx.homeTitle}</span>
		</button>
		<button onclick={() => pick('cloud')} class="seg {open === 'cloud' ? 'on-brand' : 'off'}">
			<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
				><path
					d="M7 18.5a4.2 4.2 0 0 1 .5-8.4 5.2 5.2 0 0 1 10-1A3.7 3.7 0 0 1 17 18.5Z"
					fill="currentColor"
				/></svg
			>
			<span>{tx.cloudTitle}</span>
		</button>
	</div>

	<!-- the staged scene: your device, the connection, and the chosen server -->
	<div class="scene" data-mode={open ?? 'idle'}>
		<div class="actor">
			<Browser phase={preview} offlineText={tx.offline} />
		</div>

		<!-- the connection, a stream of packets while the link is up -->
		<div
			class="beam relative h-12 max-w-[150px] min-w-[22px] flex-1 self-center"
			style="--c:{linkColor}"
		>
			<div class="rail" class:broken={down}></div>
			{#if open && live && !down}
				<span class="dot" style="animation-delay:0s"></span>
				<span class="dot" style="animation-delay:0.4s"></span>
				<span class="dot" style="animation-delay:0.8s"></span>
			{/if}
		</div>

		<!-- the server location, the hero illustration -->
		<div class="actor flex w-[112px] flex-col items-center gap-1.5">
			{#if open === 'cloud'}
				<svg class="hero cloud" viewBox="0 0 120 104" width="112" height="97" aria-hidden="true">
					<defs>
						<filter id="cl-sh" x="-40%" y="-40%" width="180%" height="200%">
							<feDropShadow
								dx="0"
								dy="4"
								stdDeviation="3.5"
								flood-color="#9cb6d8"
								flood-opacity="0.45"
							/>
						</filter>
					</defs>
					<ellipse cx="58" cy="60" rx="52" ry="44" fill="#eaf2fe" />
					<ellipse cx="58" cy="97" rx="46" ry="6" fill="#16283c" opacity="0.08" />

					<!-- left tower -->
					<rect x="22" y="52" width="22" height="40" rx="3" fill="#3f6391" />
					{#each [0, 1, 2] as c (c)}
						{#each [0, 1, 2, 3] as r (r)}
							<rect
								x={26 + c * 6}
								y={58 + r * 8}
								width="3.6"
								height="5"
								rx="0.7"
								fill={(c + r) % 3 === 0 ? '#27425f' : '#7ee0ae'}
							/>
						{/each}
					{/each}

					<!-- main tower -->
					<rect x="46" y="24" width="32" height="68" rx="3" fill="#345580" />
					<rect x="46" y="24" width="32" height="6" rx="3" fill="#456a98" />
					<rect x="52" y="18" width="8" height="6" rx="1" fill="#c7d3e2" />
					<rect x="64" y="16" width="9" height="8" rx="1" fill="#c7d3e2" />
					{#each [0, 1, 2, 3] as c (c)}
						{#each [0, 1, 2, 3, 4, 5] as r (r)}
							{@const lit = (c * 2 + r) % 4 !== 0}
							<rect
								x={50 + c * 7}
								y={34 + r * 8}
								width="4"
								height="5.4"
								rx="0.7"
								fill={lit ? (r % 2 ? '#8fd3ff' : '#7ee0ae') : '#26415f'}
								class:winblink={lit && (c + r) % 5 === 0}
							/>
						{/each}
					{/each}
					<rect x="56" y="84" width="12" height="8" rx="1" fill="#1f3958" />

					<!-- right tower -->
					<rect x="80" y="58" width="18" height="34" rx="3" fill="#4a6f9e" />
					{#each [0, 1] as c (c)}
						{#each [0, 1, 2] as r (r)}
							<rect
								x={84 + c * 7}
								y={64 + r * 8}
								width="3.6"
								height="5"
								rx="0.7"
								fill={(c + r) % 2 ? '#8fd3ff' : '#27425f'}
							/>
						{/each}
					{/each}

					<!-- the cloud beside it, the metaphor for all these buildings -->
					<g class="dc-cloud" fill="#ffffff" filter="url(#cl-sh)">
						<ellipse cx="92" cy="22" rx="9" ry="7" />
						<ellipse cx="102" cy="18" rx="11" ry="8.5" />
						<ellipse cx="110" cy="23" rx="6.5" ry="5.5" />
						<rect x="86" y="19" width="26" height="9" rx="4.5" />
					</g>
				</svg>
				<span class="text-xs font-bold tracking-wide text-brand">{tx.cloudTerm}</span>
			{:else if open === 'home'}
				<svg
					class="hero home"
					class:down
					viewBox="0 0 120 104"
					width="110"
					height="95"
					aria-hidden="true"
				>
					<ellipse cx="58" cy="95" rx="40" ry="6" fill="#16283c" opacity="0.08" />
					<g class="building">
						<path
							d="M26 55 58 28 90 55Z"
							fill="#e0934a"
							stroke="#c47e38"
							stroke-width="2"
							stroke-linejoin="round"
						/>
						<rect x="73" y="35" width="8" height="15" rx="1.5" fill="#c47e38" />
						<rect
							x="32"
							y="53"
							width="52"
							height="40"
							rx="3"
							fill="#fff7ea"
							stroke="#d9b384"
							stroke-width="2"
						/>
						<rect x="39" y="73" width="12" height="20" rx="1.5" fill="#cf9e69" />
						<circle cx="48" cy="83" r="1.1" fill="#8a5d31" />
						<rect
							x="58"
							y="60"
							width="20"
							height="18"
							rx="2"
							fill={down ? '#2b2f36' : '#d6f0e0'}
							stroke="#d9b384"
							stroke-width="1.5"
							class="window"
						/>
						{#each [63, 70] as ly (ly)}
							<rect
								x="61"
								y={ly}
								width="14"
								height="3.4"
								rx="1"
								fill={down ? '#3a3f48' : '#ffffff'}
							/>
							<circle cx="64" cy={ly + 1.7} r="1.1" fill={down ? '#565c66' : '#3a9c64'} />
						{/each}
					</g>
					<g transform="translate(24 66)">
						<rect
							x="-7"
							y="-7"
							width="14"
							height="14"
							rx="3"
							fill={down ? '#fbe9e6' : '#fbf1de'}
							stroke={down ? '#d3584a' : '#dd9e36'}
							stroke-width="2"
						/>
						{#if down}
							<path
								d="M-2.4 -2.4 2.4 2.4M2.4 -2.4 -2.4 2.4"
								stroke="#d3584a"
								stroke-width="2"
								stroke-linecap="round"
							/>
						{:else}
							<path d="M1 -3.8 -2.8 0.8 0.2 0.8 -1 4 3 -0.6 -0.6 -0.6Z" fill="#dd9e36" />
						{/if}
					</g>
					{#if down}<path
							class="spark"
							d="M60 8 53 18 H57.5 L55 24 63 13.5 H58 Z"
							fill="#d3584a"
							stroke="#fff"
							stroke-width="0.8"
							stroke-linejoin="round"
						/>{/if}
				</svg>
				<span class="text-xs font-bold tracking-wide text-amber">{tx.onpremTerm}</span>
			{:else}
				<Server slots={2} />
				<span class="text-xs font-semibold text-faint">&nbsp;</span>
			{/if}
		</div>
	</div>

	<!-- what that choice means -->
	{#if open}
		{#key open}
			<ul class="flex w-full max-w-sm flex-col gap-1.5">
				{#each open === 'cloud' ? tx.cloudPoints : tx.homePoints as p, i (p)}
					<li
						class="point flex items-start gap-2 text-[13px] leading-snug text-muted"
						style="animation-delay:{i * 0.07}s"
					>
						{#if open === 'cloud'}
							<span class="mt-0.5 shrink-0 text-grass">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
								>
							</span>
						{:else}
							<span class="mt-0.5 shrink-0 text-danger">
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" /></svg
								>
							</span>
						{/if}
						{p}
					</li>
				{/each}
			</ul>
		{/key}
	{/if}
</div>

<style>
	.seg {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		border-radius: 12px;
		padding: 10px 8px;
		font-size: 13px;
		font-weight: 600;
		line-height: 1.1;
		transition: all 0.18s ease;
	}
	.seg.off {
		color: var(--color-faint);
	}
	.seg.off:hover {
		color: var(--color-ink);
		background: var(--color-paper);
	}
	.seg.on-amber {
		background: var(--color-amber-soft);
		color: var(--color-amber);
		box-shadow:
			inset 0 0 0 1.5px var(--color-amber),
			0 4px 12px rgba(221, 158, 54, 0.18);
	}
	.seg.on-brand {
		background: var(--color-brand-soft);
		color: var(--color-brand);
		box-shadow:
			inset 0 0 0 1.5px var(--color-brand),
			0 4px 12px rgba(46, 111, 224, 0.18);
	}
	.invite {
		animation: invite 2.4s ease-in-out infinite;
	}
	@keyframes invite {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 5px rgba(46, 111, 224, 0.1);
		}
	}

	.scene {
		position: relative;
		display: flex;
		width: 100%;
		max-width: 42rem;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		overflow: hidden;
		border-radius: 1.5rem;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 0.85rem 0.5rem;
		transition: background 0.45s ease;
	}
	.scene[data-mode='cloud'] {
		background: linear-gradient(180deg, #eef5ff 0%, #ffffff 78%);
	}
	.scene[data-mode='home'] {
		background: linear-gradient(180deg, #fdf4e6 0%, #ffffff 78%);
	}
	.actor {
		position: relative;
		z-index: 1;
		flex: none;
	}

	.rail {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 2.5px;
		transform: translateY(-50%);
		border-radius: 3px;
		background: var(--color-line);
		transition: background 0.25s ease;
	}
	.rail.broken {
		background: #f1c6bf;
	}
	.dot {
		position: absolute;
		top: 50%;
		left: 0;
		height: 8px;
		width: 8px;
		border-radius: 50%;
		background: var(--c);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 16%, transparent);
		animation: stream 1.2s linear infinite;
	}
	@keyframes stream {
		0% {
			left: 0%;
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.5);
		}
		14% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		86% {
			opacity: 1;
		}
		100% {
			left: 100%;
			opacity: 0;
			transform: translate(-50%, -50%) scale(0.5);
		}
	}

	.dc-cloud {
		animation: float 4s ease-in-out infinite;
		transform-box: fill-box;
		transform-origin: center;
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}
	.hero.home {
		transition:
			opacity 0.25s ease,
			filter 0.25s ease;
	}
	.hero.home.down {
		opacity: 0.55;
		filter: grayscale(0.45);
	}
	.spark {
		animation: spark 0.5s ease-in-out infinite alternate;
	}
	@keyframes spark {
		from {
			opacity: 0.4;
		}
		to {
			opacity: 1;
		}
	}
	.winblink {
		animation: blink 1.8s ease-in-out infinite;
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	.point {
		opacity: 0;
		animation: rise 0.35s ease forwards;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.invite,
		.dot,
		.winblink,
		.point,
		.dc-cloud,
		.spark {
			animation-duration: 0.01s;
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .scene[data-mode='cloud'] {
		background: linear-gradient(180deg, #142a44 0%, #1b2533 78%);
	}
	:global(.dark) .scene[data-mode='home'] {
		background: linear-gradient(180deg, #2a2418 0%, #1b2533 78%);
	}
	:global(.dark) .rail.broken {
		background: #5a3a35;
	}
</style>
