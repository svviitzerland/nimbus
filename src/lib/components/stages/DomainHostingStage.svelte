<script lang="ts">
	// A guided domains and hosting lesson, told as a short animated story. The registrar hands
	// over the name, the host switches on with its IP, the phone fails to find the site, DNS gets
	// an A record, and the phone finds its way. On the last beat the learner may point the record
	// at a wrong IP to watch the phone get lost.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DomainHostingText, HostKind } from '$lib/chapters/web/domain-hosting/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DomainHostingText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	const IP = '203.0.113.10';
	const WRONG_IP = '198.51.100.7';

	// Where the little packet can be, in svg units.
	const SPOTS = {
		ph: [114, 236],
		dns: [288, 236],
		host: [352, 120],
		wrong: [230, 104]
	} as const;
	type Spot = keyof typeof SPOTS;
	type Screen = 'blank' | 'loading' | 'error' | 'site';

	let pos = $state<Spot>('ph');
	let packetOn = $state(false);
	let snap = $state(true);
	let screen = $state<Screen>('blank');
	let glow = $state<'dns' | 'host' | 'wrong' | null>(null);
	let wrong = $state(false);
	let runId = $state(0);

	const KINDS: HostKind[] = ['shared', 'vps', 'cloud'];
	let kind = $state<HostKind>('shared');

	function at(p: Spot, on = true) {
		snap = false;
		pos = p;
		packetOn = on;
	}
	/** Phone asks DNS where the name lives, then comes back with (or without) an answer. */
	function askDns(): SeqStep[] {
		return [
			[
				80,
				() => {
					snap = true;
					pos = 'ph';
					packetOn = false;
					screen = 'loading';
					glow = null;
				}
			],
			[1100, () => at('dns')],
			[700, () => (glow = 'dns')],
			[1100, () => at('ph')]
		];
	}
	/** Then knocks on whatever door the answer pointed at. */
	function visit(to: 'host' | 'wrong', end: Screen, done?: () => void): SeqStep[] {
		return [
			[1250, () => at(to)],
			[600, () => (glow = to)],
			[1250, () => at('ph')],
			[
				2800,
				() => {
					packetOn = false;
					screen = end;
					glow = null;
					done?.();
				}
			]
		];
	}

	function play(s: number, w: boolean, still: boolean): (() => void) | undefined {
		packetOn = false;
		snap = true;
		glow = null;
		if (s === 3) {
			screen = 'blank';
			if (still) {
				kind = 'vps';
				return;
			}
			let n = 0;
			kind = KINDS[0];
			const t = setInterval(() => {
				n = (n + 1) % KINDS.length;
				kind = KINDS[n];
			}, 2300);
			return () => clearInterval(t);
		}
		if (s < 4) {
			screen = 'blank';
			return;
		}
		if (s === 4) {
			if (still) {
				screen = 'error';
				return;
			}
			return runSeq(
				[
					...askDns(),
					[
						2600,
						() => {
							packetOn = false;
							screen = 'error';
							glow = null;
						}
					]
				],
				true
			);
		}
		if (s === 5) {
			screen = 'blank';
			return;
		}
		if (s === 6) {
			if (still) {
				screen = 'site';
				return;
			}
			return runSeq([...askDns(), ...visit('host', 'site')], true);
		}
		if (s === last && runId > 0) {
			const token = w ? 'wrongip' : 'fixed';
			if (still) {
				screen = w ? 'error' : 'site';
				onstate?.(token);
				return;
			}
			return runSeq([
				...askDns(),
				...visit(w ? 'wrong' : 'host', w ? 'error' : 'site', () => onstate?.(token))
			]);
		}
		screen = 'site';
	}

	$effect(() => {
		const s = step;
		const w = wrong;
		const still = reduce;
		void runId;
		return untrack(() => play(s, w, still));
	});

	function toggleWrong() {
		wrong = !wrong;
		runId += 1;
	}

	const shopOn = $derived(step >= 1);
	const hostOn = $derived(step >= 2);
	const phoneOn = $derived(step >= 4);
	const record = $derived(step >= 5);
	const isWrong = $derived(step === last && wrong);
	const hostName = $derived(step === 3 ? tx.hostKinds[kind] : tx.hostLabel);

	/** Breaks a short line into two for the tiny phone screen. */
	function wrap(s: string, max = 13): string[] {
		if (s.length <= max) return [s];
		const words = s.split(' ');
		const out: string[] = [''];
		for (const w of words) {
			const cur = out[out.length - 1];
			if (cur && (cur + ' ' + w).length > max) out.push(w);
			else out[out.length - 1] = cur ? cur + ' ' + w : w;
		}
		return out.slice(0, 3);
	}
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<button type="button" class="toggle" class:bad={wrong} onclick={toggleWrong}>
				{wrong ? tx.fixIt : tx.breakIt}
			</button>
		{/if}

		<svg
			viewBox="0 0 460 312"
			class="scene"
			role="img"
			aria-label="{tx.shopLabel}, {tx.hostLabel}, {tx.dnsLabel}"
		>
			<!-- links drawn by the A record -->
			{#if record}
				<path
					d="M133 150Q250 160 300 206"
					pathLength="1"
					class="link"
					class:draw={step === 5 && !reduce}
				/>
				{#if isWrong}
					<path d="M330 206Q300 130 264 96" class="link bad" />
				{:else}
					<path
						d="M375 206L375 154"
						pathLength="1"
						class="link"
						class:draw={step === 5 && !reduce}
					/>
				{/if}
			{/if}

			<!-- the registrar shop -->
			<g class="shop" class:dim={!shopOn}>
				<rect x="20" y="40" width="130" height="68" rx="4" class="wall" />
				{#each [0, 1, 2, 3, 4] as n (n)}
					<rect x={20 + n * 26} y="24" width="26" height="18" class={n % 2 ? 'awn b' : 'awn a'} />
				{/each}
				<rect x="32" y="54" width="44" height="30" rx="3" class="glass" />
				<rect x="96" y="62" width="34" height="46" rx="3" class="door" />
				<circle cx="124" cy="86" r="2" class="knob" />
				<text x="85" y="124" text-anchor="middle" class="cap-svg">{tx.shopLabel}</text>
			</g>
			{#if shopOn}
				<g class="tag" class:pop={step === 1 && !reduce} transform="translate(85 150)">
					<rect x="-48" y="-13" width="96" height="26" rx="13" class="tag-body" />
					<text y="4.5" text-anchor="middle" class="tag-text">nimbus.com</text>
				</g>
				<text x="85" y="178" text-anchor="middle" class="price">{tx.price}</text>
			{/if}

			<!-- the wrong door, only when the record points somewhere else -->
			{#if isWrong}
				<g class="lot" class:glow={glow === 'wrong'}>
					<rect x="200" y="44" width="60" height="52" rx="4" class="lot-wall" />
					<text x="230" y="78" text-anchor="middle" class="lot-q">?</text>
					<text x="230" y="36" text-anchor="middle" class="ip bad">{WRONG_IP}</text>
				</g>
			{/if}

			<!-- the host, a little data centre -->
			<g class="host" class:dim={!hostOn}>
				{#if step === 3 && kind === 'cloud'}
					<path
						d="M300 120a26 26 0 0 1 4-50a40 40 0 0 1 74-26a30 30 0 0 1 58 22a26 26 0 0 1 2 54z"
						class="cloud"
					/>
				{/if}
				<rect
					x="312"
					y="14"
					width="126"
					height="104"
					rx="8"
					class="wall"
					class:glow={glow === 'host'}
				/>
				{#each [26, 56, 86] as y, n (y)}
					<rect
						x="324"
						{y}
						width="102"
						height="22"
						rx="4"
						class="unit"
						class:mine={step === 3 && kind === 'vps' && n === 1}
						class:faded={step === 3 && kind === 'vps' && n !== 1}
					/>
					<circle cx="334" cy={y + 11} r="3.2" class="led" class:on={hostOn} />
					{#if step === 3 && kind === 'shared'}
						{#each [0, 1, 2, 3] as k (k)}
							<rect x={350 + k * 18} y={y + 6} width="12" height="10" rx="2" class="site s{k}" />
						{/each}
					{:else}
						<line x1="350" y1={y + 11} x2="414" y2={y + 11} class="vent" />
					{/if}
				{/each}
				<text x="375" y="134" text-anchor="middle" class="cap-svg">{hostName}</text>
				{#if hostOn}
					<text x="375" y="149" text-anchor="middle" class="ip">{IP}</text>
				{/if}
			</g>

			<!-- DNS, the phone book -->
			{#if phoneOn}
				<g class="card" class:glow={glow === 'dns'}>
					<rect x="290" y="206" width="150" height="66" rx="10" class="card-body" />
					<text x="302" y="222" class="card-title">{tx.dnsLabel}</text>
					{#if record}
						<text x="434" y="222" text-anchor="end" class="card-sub">{tx.recordLabel}</text>
						<text x="302" y="242" class="card-name">nimbus.com</text>
						<path d="M304 252l6 5-6 5" class="arrow" class:bad={isWrong} />
						<text x="316" y="262" class="card-ip" class:bad={isWrong}
							>{isWrong ? WRONG_IP : IP}</text
						>
					{:else}
						<text x="302" y="250" class="card-sub">{tx.noRecord}</text>
						<text x="428" y="258" text-anchor="end" class="card-q">?</text>
					{/if}
				</g>
			{/if}

			<!-- the friend's phone -->
			<g class="phone" class:dim={!phoneOn}>
				<rect x="40" y="196" width="72" height="110" rx="12" class="phone-body" />
				<rect x="46" y="208" width="60" height="88" rx="4" class="phone-screen" />
				<rect x="50" y="212" width="52" height="10" rx="5" class="bar-addr" />
				<text x="76" y="219.5" text-anchor="middle" class="tiny">nimbus.com</text>
				{#if phoneOn && screen === 'loading'}
					<g class="loading">
						<circle cx="66" cy="254" r="2.6" />
						<circle cx="76" cy="254" r="2.6" />
						<circle cx="86" cy="254" r="2.6" />
					</g>
				{:else if phoneOn && screen === 'error'}
					<circle cx="76" cy="244" r="9" class="err-ring" />
					<path d="M72 240l8 8M80 240l-8 8" class="err-x" />
					<text x="76" y="268" text-anchor="middle" class="tiny err">
						{#each wrap(tx.phone.cannot) as l, k (k)}<tspan x="76" dy={k ? 8 : 0}>{l}</tspan>{/each}
					</text>
				{:else if phoneOn && screen === 'site'}
					<g class="site-page">
						<path d="M66 252a7 7 0 0 1-1-13.6A9 9 0 0 1 82 236a6.5 6.5 0 0 1 3.6 16z" class="nim" />
						<text x="76" y="266" text-anchor="middle" class="tiny strong">
							{#each wrap(tx.phone.welcome) as l, k (k)}<tspan x="76" dy={k ? 8 : 0}>{l}</tspan
								>{/each}
						</text>
						<rect x="56" y="282" width="40" height="5" rx="2.5" class="bar" />
					</g>
				{/if}
			</g>

			<!-- the packet travelling between them -->
			<g
				class="packet"
				class:snap
				class:off={!packetOn}
				style="transform: translate({SPOTS[pos][0]}px, {SPOTS[pos][1]}px)"
			>
				<circle r="6" />
			</g>
		</svg>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
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
	.toggle {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-danger);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.toggle:hover {
		border-color: var(--color-danger);
	}
	.toggle.bad {
		color: var(--color-grass);
	}
	.toggle.bad:hover {
		border-color: var(--color-grass);
	}

	/* ---- svg parts ---- */
	.dim {
		opacity: 0.32;
	}
	.shop,
	.host,
	.phone {
		transition: opacity 0.6s ease;
	}
	.wall {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.wall.glow {
		stroke: var(--color-grass);
		stroke-width: 2.5;
	}
	.awn.a {
		fill: var(--color-brand);
	}
	.awn.b {
		fill: var(--color-brand-soft);
	}
	.glass {
		fill: var(--color-brand-soft);
		stroke: var(--color-line);
	}
	.door {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.knob {
		fill: var(--color-faint);
	}
	.cap-svg {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.tag-body {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.tag-text {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-brand);
	}
	.tag.pop {
		animation: pop 0.7s cubic-bezier(0.2, 0.8, 0.2, 1.3) both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translate(85px, 90px) scale(0.6);
		}
		to {
			opacity: 1;
			transform: translate(85px, 150px) scale(1);
		}
	}
	.price {
		font-size: 10px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
		transition: opacity 0.4s;
	}
	.unit.mine {
		stroke: var(--color-brand);
		stroke-width: 2;
		fill: var(--color-brand-soft);
	}
	.unit.faded {
		opacity: 0.35;
	}
	.led {
		fill: var(--color-faint);
	}
	.led.on {
		fill: var(--color-grass);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.site.s0 {
		fill: var(--color-brand);
	}
	.site.s1 {
		fill: var(--color-grass);
	}
	.site.s2 {
		fill: var(--color-amber);
	}
	.site.s3 {
		fill: var(--color-faint);
	}
	.cloud {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
		animation: fadein 0.5s ease;
	}
	.ip {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-grass);
		animation: fadein 0.6s ease;
	}
	.ip.bad {
		fill: var(--color-danger);
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
	}

	.lot-wall {
		fill: var(--color-paper);
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.lot.glow .lot-wall {
		stroke-width: 3;
	}
	.lot-q {
		font-size: 22px;
		font-weight: 800;
		fill: var(--color-danger);
	}

	.card-body {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.card.glow .card-body {
		stroke: var(--color-brand);
		stroke-width: 2.5;
	}
	.card-title {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.1em;
		fill: var(--color-brand);
	}
	.card-sub {
		font-size: 9px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.card-q {
		font-size: 24px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.card-name {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.card-ip {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.card-ip.bad {
		fill: var(--color-danger);
	}
	.arrow {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.arrow.bad {
		stroke: var(--color-danger);
	}

	.link {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.2;
		stroke-linecap: round;
		opacity: 0.7;
	}
	.link.bad {
		stroke: var(--color-danger);
	}
	.link.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.4s 0.3s ease forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	.phone-body {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.phone-screen {
		fill: var(--color-paper);
	}
	.bar-addr {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 0.8;
	}
	.tiny {
		font-size: 6.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.tiny.err {
		fill: var(--color-danger);
	}
	.tiny.strong {
		font-weight: 800;
		fill: var(--color-ink);
	}
	.err-ring {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 1.4;
	}
	.err-x {
		stroke: var(--color-danger);
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.nim {
		fill: var(--color-brand);
	}
	.bar {
		fill: var(--color-line);
	}
	.site-page {
		animation: fadein 0.5s ease;
	}
	.loading circle {
		fill: var(--color-brand);
		animation: dot 1s ease-in-out infinite;
	}
	.loading circle:nth-child(2) {
		animation-delay: 0.15s;
	}
	.loading circle:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes dot {
		50% {
			opacity: 0.25;
		}
	}

	.packet {
		transition:
			transform 1.1s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.35s ease;
	}
	.packet circle {
		fill: var(--color-brand);
		stroke: var(--color-card);
		stroke-width: 2;
	}
	.packet.snap {
		transition: none;
	}
	.packet.off {
		opacity: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.shop,
		.host,
		.phone,
		.packet,
		.unit,
		.wall,
		.card-body,
		.toggle {
			transition: none;
		}
		.tag.pop,
		.cloud,
		.ip,
		.site-page,
		.loading circle,
		.link.draw {
			animation: none;
		}
		.link.draw {
			stroke-dashoffset: 0;
		}
	}
</style>
