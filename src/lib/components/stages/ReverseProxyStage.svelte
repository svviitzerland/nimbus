<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { ReverseProxyText } from '$lib/chapters/traffic/types';
	import Server from '$lib/components/Server.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ReverseProxyText);

	// One stable colour per backend, shared by the button, the packet, and the rack.
	const COLORS: Record<string, string> = { web: '#2e6fe0', api: '#3a9c64', static: '#dd9e36' };
	// Horizontal centre of each rack inside the mechanism (three evenly spaced columns).
	const LANES = ['17%', '50%', '83%'];

	type Flight = { id: number; lane: string; backend: string; path: string; phase: 'in' | 'out' };
	let flights = $state<Flight[]>([]);
	const routed = new SvelteSet<string>();
	let busy = $state(false);
	let touched = $state(false); // dims the "tap me" pulse once the learner has tried
	let active = $state<string | null>(null); // backend the proxy is forwarding to right now
	let loading = $state(false); // phone is waiting for the response
	let current = $state<{ path: string; kind: string } | null>(null); // what the phone shows
	let uid = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];
	let done = false;

	function send(i: number) {
		if (busy) return;
		const r = tx.routes[i];
		touched = true;
		busy = true;
		active = null;
		loading = true;
		const id = ++uid;
		flights = [...flights, { id, lane: LANES[i], backend: r.backend, path: r.path, phase: 'in' }];
		timers.push(
			setTimeout(() => {
				flights = flights.map((f) => (f.id === id ? { ...f, phase: 'out' } : f));
				active = r.backend;
			}, 560)
		);
		timers.push(
			setTimeout(() => {
				flights = flights.filter((f) => f.id !== id);
				routed.add(r.backend);
				active = null;
				busy = false;
				loading = false;
				current = { path: r.path, kind: r.kind };
				onstate?.(r.backend);
				if (routed.size >= 2 && !done) {
					done = true;
					oncomplete?.();
				}
			}, 1380)
		);
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="flex h-full w-full flex-col items-center justify-center gap-4">
	<!-- The action, kept obvious and up top, clear of Nim -->
	<div class="flex flex-col items-center gap-2">
		<p class="text-[11px] font-semibold text-faint md:text-[13px]">{tx.promptLabel}</p>
		<div class="flex flex-wrap items-center justify-center gap-2">
			{#each tx.routes as route, i (route.path)}
				<button
					type="button"
					onclick={() => send(i)}
					disabled={busy}
					class="req-btn"
					class:pulse={!touched}
					style="--c:{COLORS[route.backend]}"
				>
					<span class="dot"></span>
					<span class="lbl">{route.btn}</span>
					<span class="path">{route.path}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Phone (the result you actually get) beside the mechanism (how it gets there) -->
	<div class="flex flex-col items-center justify-center gap-4 md:flex-row md:items-start md:gap-6">
		<!-- the phone: one address, different results -->
		<div class="flex flex-col items-center gap-1.5">
			<div class="phone">
				<div class="screen">
					<div class="addr">
						<span class="led" class:on={!!current && !loading}></span>
						<span class="url">{tx.publicAddr}{current ? current.path : ''}</span>
					</div>
					<div class="view">
						{#if loading}
							<div class="spinner"></div>
						{:else if !current}
							<div class="idle">{tx.idleHint}</div>
						{:else if current.kind === 'page'}
							<div class="sk page">
								<div class="hero"></div>
								<div class="bar w60"></div>
								<div class="bar w80"></div>
								<div class="bar w45"></div>
								<div class="cards"><span></span><span></span></div>
							</div>
						{:else if current.kind === 'json'}
							<div class="sk json">
								<div class="ln"><span class="br">{'{'}</span></div>
								<div class="ln pad"><span class="k">"nama"</span><span class="v w40"></span></div>
								<div class="ln pad"><span class="k">"id"</span><span class="v w20"></span></div>
								<div class="ln pad"><span class="k">"aktif"</span><span class="v w16"></span></div>
								<div class="ln"><span class="br">&#125;</span></div>
							</div>
						{:else}
							<div class="sk img">
								{#each [0, 1, 2, 3] as n (n)}
									<div class="ph">
										<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
											<rect
												x="3"
												y="5"
												width="18"
												height="14"
												rx="2"
												stroke="#c9881f"
												stroke-width="1.4"
											/>
											<circle cx="8.5" cy="10" r="1.6" fill="#dd9e36" />
											<path
												d="M5 17l4.5-4 3 2.5L16 12l3 3.5"
												stroke="#dd9e36"
												stroke-width="1.4"
												fill="none"
											/>
										</svg>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
			<span class="text-xs font-semibold text-muted md:text-sm">{tx.youLabel}</span>
		</div>

		<!-- the mechanism: proxy out front, three hidden servers behind -->
		<div class="mech">
			<svg class="rails" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
				{#each tx.routes as route, i (route.backend)}
					<line
						x1="50"
						y1="30"
						x2={[17, 50, 83][i]}
						y2="70"
						stroke={routed.has(route.backend) ? COLORS[route.backend] : '#e3ddd3'}
						stroke-width="1.5"
						stroke-linecap="round"
						vector-effect="non-scaling-stroke"
						opacity={routed.has(route.backend) ? '0.9' : '0.65'}
					/>
				{/each}
			</svg>

			<div class="proxy" class:busy>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M5 21V9a7 7 0 0 1 14 0v12Z" fill="#eaf1fc" stroke="#2e6fe0" stroke-width="1.6" />
					<circle cx="15" cy="13" r="1.1" fill="#2e6fe0" />
				</svg>
				<div class="text-[11px] font-bold text-ink md:text-[13.5px]">{tx.proxyLabel}</div>
				<div class="addr-chip">{tx.publicAddr}</div>
				<div class="text-[9px] text-faint md:text-[10.5px]">{tx.proxySub}</div>
			</div>

			{#each tx.routes as route, i (route.backend)}
				<div class="rackwrap" style="left:{LANES[i]}">
					<div
						class="server-wrap"
						class:lit={routed.has(route.backend)}
						class:hot={active === route.backend}
						style="--c:{COLORS[route.backend]}"
					>
						<Server slots={3} active={routed.has(route.backend)} />
					</div>
					<span
						class="rlabel"
						style={routed.has(route.backend) ? `color:${COLORS[route.backend]}` : ''}
						>{route.label}</span
					>
				</div>
			{/each}

			{#each flights as f (f.id)}
				<div
					class="packet"
					class:out={f.phase === 'out'}
					style="--lx:{f.lane}; background:{COLORS[f.backend]}"
				>
					{f.path}
				</div>
			{/each}
		</div>
	</div>

	<p class="h-5 text-sm font-semibold text-grass">
		{#if routed.size > 0}✓ {tx.routedNote.replace('{n}', String(routed.size))}{/if}
	</p>
</div>

<style>
	/* request buttons */
	.req-btn {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 12px;
		border: 1px solid #e8e2d8;
		background: #fff;
		padding: 7px 12px;
		font-weight: 600;
		color: #16212b;
		transition:
			transform 0.15s ease,
			box-shadow 0.2s ease,
			filter 0.2s ease;
		box-shadow: 0 2px 6px rgba(22, 40, 60, 0.05);
	}
	.req-btn:disabled {
		opacity: 0.5;
	}
	.req-btn:enabled:hover {
		filter: brightness(1.04);
	}
	.req-btn:enabled:active {
		transform: translateY(1px);
	}
	.req-btn .dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--c);
		flex: none;
	}
	.req-btn .lbl {
		font-size: 13px;
	}
	.req-btn .path {
		font-family: ui-monospace, monospace;
		font-size: 11px;
		color: #8a949d;
	}
	.req-btn.pulse {
		animation: pulse 1.8s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 2px 6px rgba(22, 40, 60, 0.05);
		}
		50% {
			box-shadow: 0 0 0 4px color-mix(in srgb, var(--c) 18%, transparent);
		}
	}

	/* phone, in the Foundation style */
	.phone {
		width: 156px;
		border-radius: 24px;
		background: #fff;
		border: 1px solid #e8e2d8;
		padding: 9px;
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.screen {
		height: 196px;
		border-radius: 16px;
		background: #f7f6f2;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}
	.addr {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 7px 9px;
		background: #fff;
		border-bottom: 1px solid #efeae1;
	}
	.led {
		flex: none;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #cfd6dd;
		transition: background 0.3s;
	}
	.led.on {
		background: #3a9c64;
	}
	.url {
		font-family: ui-monospace, monospace;
		font-size: 9.5px;
		color: #5e6b76;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.view {
		position: relative;
		flex: 1;
		padding: 10px;
	}
	.idle {
		display: flex;
		height: 100%;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: #b3bcc4;
		font-size: 11px;
		padding: 0 8px;
	}
	.spinner {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 24px;
		height: 24px;
		margin: -12px;
		border: 3px solid #e7e1d7;
		border-top-color: #2e6fe0;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.sk > * {
		opacity: 0;
		animation: rise 0.35s ease forwards;
	}
	.sk > *:nth-child(2) {
		animation-delay: 0.06s;
	}
	.sk > *:nth-child(3) {
		animation-delay: 0.12s;
	}
	.sk > *:nth-child(4) {
		animation-delay: 0.18s;
	}
	.sk > *:nth-child(5) {
		animation-delay: 0.24s;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	/* page skeleton */
	.page {
		display: flex;
		flex-direction: column;
		gap: 7px;
	}
	.hero {
		height: 42px;
		border-radius: 8px;
		background: linear-gradient(120deg, #eaf1fc, #dbe8fb);
	}
	.bar {
		height: 8px;
		border-radius: 5px;
		background: #dfe7f3;
	}
	.bar.w60 {
		width: 60%;
	}
	.bar.w80 {
		width: 80%;
	}
	.bar.w45 {
		width: 45%;
	}
	.cards {
		display: flex;
		gap: 7px;
		margin-top: 2px;
	}
	.cards span {
		flex: 1;
		height: 30px;
		border-radius: 7px;
		background: #e7eefb;
	}
	/* json skeleton */
	.json {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-family: ui-monospace, monospace;
		font-size: 11px;
	}
	.json .ln {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.json .pad {
		padding-left: 12px;
	}
	.json .br {
		color: #3a9c64;
		font-weight: 700;
	}
	.json .k {
		color: #3a9c64;
		font-size: 10px;
	}
	.json .v {
		height: 8px;
		border-radius: 4px;
		background: #d6ecdf;
	}
	.json .v.w40 {
		width: 40px;
	}
	.json .v.w20 {
		width: 22px;
	}
	.json .v.w16 {
		width: 16px;
	}
	/* image skeleton */
	.img {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 7px;
	}
	.img .ph {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		border-radius: 8px;
		background: #fbf1de;
		border: 1px solid #f0e2c4;
	}
	.img .ph svg {
		width: 22px;
		height: 22px;
	}

	/* mechanism */
	.mech {
		position: relative;
		width: 300px;
		max-width: 92vw;
		height: 188px;
		/* vertical anchors, kept in one place so the flying packet always lands on a rack */
		--rack-y: 110px;
		--pkt-mid: 28px;
		--pkt-end: 104px;
	}
	.rails {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}
	.proxy {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1px;
		width: 150px;
		border-radius: 16px;
		border: 1.5px solid #cdddf6;
		background: #fff;
		padding: 9px 12px;
		text-align: center;
		box-shadow: 0 12px 28px rgba(46, 111, 224, 0.14);
		transition: box-shadow 0.3s ease;
	}
	.proxy.busy {
		box-shadow: 0 12px 30px rgba(46, 111, 224, 0.3);
	}
	.addr-chip {
		border-radius: 999px;
		background: #eaf1fc;
		padding: 1px 8px;
		font-family: ui-monospace, monospace;
		font-size: 10px;
		font-weight: 700;
		color: #2e6fe0;
	}
	.rackwrap {
		position: absolute;
		top: var(--rack-y);
		transform: translateX(-50%);
		z-index: 2;
		display: flex;
		width: 80px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.server-wrap {
		opacity: 0.5;
		transition:
			opacity 0.3s ease,
			transform 0.3s ease;
	}
	.server-wrap.hot {
		opacity: 1;
		transform: translateY(-3px);
	}
	.server-wrap.lit {
		opacity: 1;
	}
	.server-wrap.lit :global(.server) {
		border-color: var(--c);
		box-shadow: 0 6px 16px color-mix(in srgb, var(--c) 22%, transparent);
	}
	.server-wrap.lit :global(.dot) {
		background: var(--c);
	}
	.server-wrap :global(.server) {
		width: 74px;
		gap: 5px;
		border-radius: 11px;
		padding: 8px;
		box-shadow: 0 8px 18px rgba(22, 40, 60, 0.07);
		transition:
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}
	.server-wrap :global(.slot) {
		height: 13px;
		padding: 0 5px;
	}
	.server-wrap :global(.dot) {
		width: 5px;
		height: 5px;
	}
	.rlabel {
		font-size: 10px;
		font-weight: 600;
		line-height: 1.15;
		text-align: center;
		color: #5e6b76;
		transition: color 0.3s ease;
	}
	.packet {
		position: absolute;
		top: 0;
		left: 50%;
		z-index: 3;
		transform: translate(-50%, -50%);
		padding: 3px 9px;
		border-radius: 999px;
		color: #fff;
		font-family: ui-monospace, monospace;
		font-size: 10px;
		font-weight: 700;
		white-space: nowrap;
		box-shadow: 0 3px 9px rgba(22, 40, 60, 0.2);
		animation: pkt-in 0.56s ease forwards;
	}
	.packet.out {
		animation: pkt-out 0.8s ease forwards;
	}
	@keyframes pkt-in {
		from {
			top: -20px;
			left: 50%;
			opacity: 0;
		}
		35% {
			opacity: 1;
		}
		to {
			top: var(--pkt-mid);
			left: 50%;
			opacity: 1;
		}
	}
	@keyframes pkt-out {
		from {
			top: var(--pkt-mid);
			left: 50%;
			opacity: 1;
		}
		to {
			top: var(--pkt-end);
			left: var(--lx);
			opacity: 0;
		}
	}
	/* ---- Dark mode ---- */
	:global(.dark) .req-btn {
		background: var(--color-card);
		border-color: var(--color-line);
		color: var(--color-ink);
		box-shadow: none;
	}
	:global(.dark) .req-btn .path {
		color: var(--color-faint);
	}
	:global(.dark) .phone {
		background: var(--color-card);
		border-color: var(--color-line);
		box-shadow: none;
	}
	:global(.dark) .screen {
		background: #1e2835;
	}
	:global(.dark) .addr {
		background: var(--color-card);
		border-bottom-color: var(--color-line);
	}
	:global(.dark) .led {
		background: var(--color-faint);
	}
	:global(.dark) .url {
		color: var(--color-muted);
	}
	:global(.dark) .idle {
		color: var(--color-faint);
	}
	:global(.dark) .spinner {
		border-color: #2c3746;
	}
	:global(.dark) .hero {
		background: linear-gradient(120deg, #1a2d4a, #2e6fe0);
	}
	:global(.dark) .bar {
		background: #2c3746;
	}
	:global(.dark) .cards span {
		background: #1a2d4a;
	}
	:global(.dark) .json .v {
		background: var(--color-grass-soft);
	}
	:global(.dark) .img .ph {
		background: var(--color-amber-soft);
		border-color: #3d3522;
	}
	:global(.dark) .proxy {
		background: var(--color-card);
		border-color: #3a5a80;
		box-shadow: none;
	}
	:global(.dark) .addr-chip {
		background: var(--color-brand-soft);
	}
	:global(.dark) .proxy svg path[fill='#eaf1fc'] {
		fill: var(--color-brand-soft);
	}
	:global(.dark) .rails line {
		stroke: var(--color-line);
	}
	:global(.dark) .server-wrap :global(.server) {
		box-shadow: none;
	}
	:global(.dark) .rlabel {
		color: var(--color-muted);
	}
	:global(.dark) .packet {
		box-shadow: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.req-btn.pulse,
		.packet {
			animation-duration: 0.01s;
		}
	}

	/* Desktop has room to spare, so the whole scene scales up and spreads out. */
	@media (min-width: 768px) {
		.req-btn {
			padding: 9px 16px;
		}
		.req-btn .lbl {
			font-size: 15px;
		}
		.req-btn .path {
			font-size: 12px;
		}
		.phone {
			width: 216px;
			padding: 11px;
			border-radius: 28px;
		}
		.screen {
			height: 280px;
		}
		.addr {
			padding: 9px 12px;
		}
		.url {
			font-size: 11px;
		}
		.view {
			padding: 14px;
		}
		.hero {
			height: 58px;
		}
		.bar {
			height: 10px;
		}
		.cards span {
			height: 42px;
		}
		.json {
			font-size: 13px;
			gap: 9px;
		}
		.img .ph {
			height: 70px;
		}
		.img .ph svg {
			width: 28px;
			height: 28px;
		}
		.mech {
			width: 470px;
			height: 264px;
			--rack-y: 162px;
			--pkt-mid: 40px;
			--pkt-end: 152px;
		}
		.proxy {
			width: 200px;
			padding: 13px 16px;
			gap: 2px;
		}
		.proxy svg {
			width: 24px;
			height: 24px;
		}
		.addr-chip {
			font-size: 11.5px;
			padding: 2px 10px;
		}
		.rackwrap {
			width: 116px;
		}
		.server-wrap :global(.server) {
			width: 100px;
			padding: 11px;
			gap: 7px;
			border-radius: 13px;
		}
		.server-wrap :global(.slot) {
			height: 16px;
		}
		.server-wrap :global(.dot) {
			width: 6px;
			height: 6px;
		}
		.rlabel {
			font-size: 13px;
		}
	}
</style>
