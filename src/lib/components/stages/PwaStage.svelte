<script lang="ts">
	// A guided "watch" stage. One phone, the nimbus.com server, and the internet line between
	// them. The beats play the story by themselves, a plain site loads, the internet drops and it
	// fails, a manifest appears and the phone offers to install, a service worker fills the cache,
	// the icon lands on the home screen, and the app opens with no internet. The only optional
	// play is an internet switch on the last beat.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { PwaText } from '$lib/chapters/web/pwa/types';
	import { sceneClock, wrap } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as PwaText);

	type Scene =
		| 'plain'
		| 'offline'
		| 'pwa'
		| 'manifest'
		| 'worker'
		| 'install'
		| 'offlineApp'
		| 'remember'
		| 'try';
	const SCENES: Scene[] = [
		'plain',
		'offline',
		'pwa',
		'manifest',
		'worker',
		'install',
		'offlineApp',
		'remember',
		'try'
	];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
	type Screen = 'site' | 'noNet' | 'home' | 'app';

	let peek = $state<number | null>(null);
	let online = $state(true);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, online]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const net = $derived(
		scene === 'offline'
			? t < 1800
			: scene === 'offlineApp' || scene === 'remember'
				? false
				: scene === 'try'
					? online
					: true
	);
	const screen = $derived<Screen>(
		scene === 'plain' || scene === 'manifest' || scene === 'worker'
			? 'site'
			: scene === 'offline'
				? net
					? 'site'
					: 'noNet'
				: scene === 'pwa'
					? 'home'
					: scene === 'install'
						? t < 1600
							? 'site'
							: 'home'
						: scene === 'offlineApp'
							? t < 1500
								? 'home'
								: 'app'
							: 'app'
	);
	const banner = $derived((scene === 'manifest' && t > 2200) || (scene === 'install' && t < 1600));
	const pressed = $derived(scene === 'install' && t > 800 && t < 1600);
	const iconOn = $derived(active >= 5 || scene === 'pwa');
	const tapIcon = $derived(scene === 'offlineApp' && screen === 'home' && t > 700);

	// pieces appear once the story has introduced them
	const hasManifest = $derived(active >= 3 && scene !== 'try');
	const hasWorker = $derived(active >= 4);
	const manifestLines = $derived(
		scene === 'manifest' ? Math.max(0, Math.min(5, Math.floor((t - 300) / 350) + 1)) : 5
	);
	const cached = $derived(
		scene === 'worker' ? Math.max(0, Math.min(3, Math.floor((t - 400) / 800))) : active > 4 ? 3 : 0
	);
	const fromCache = $derived(screen === 'app' && !net);
	const flowing = $derived(net && !clock.reduced && (screen === 'site' || screen === 'app'));

	const LIT: Record<Scene, string[]> = {
		plain: ['server', 'phone'],
		offline: ['server', 'phone'],
		pwa: ['phone'],
		manifest: ['manifest', 'phone'],
		worker: ['worker', 'cache', 'server', 'phone'],
		install: ['phone', 'manifest'],
		offlineApp: ['phone', 'worker', 'cache'],
		remember: ['manifest', 'worker', 'cache', 'phone'],
		try: ['phone', 'worker', 'cache', 'server']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	const MANIFEST = ['{', '"name": "nimbus",', '"icons": [...],', '"theme_color": ...', '}'];
	const FILES = [
		{ x: 22, label: 'html' },
		{ x: 50, label: 'css' },
		{ x: 78, label: 'png' }
	];
	const APPS = Array.from({ length: 11 }, (_, k) => k);

	function toggle() {
		online = !online;
		onstate?.(online ? 'online' : 'offline');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={toggle}>
				{online ? tx.offBtn : tx.onBtn}
			</button>
		{/if}
		<svg viewBox="0 0 360 330" class="pic" role="img" aria-label={tx.picture}>
			<!-- the internet line from the server to the phone -->
			<path d="M306 104 V146 H240" class="wire" class:off={!net} />
			{#if !net}
				<path d="M300 118 l12 12 M312 118 l-12 12" class="cut" />
			{/if}
			{#if flowing}
				{#each [0, 1, 2] as k (k)}
					<circle r="3" class="data">
						<animateMotion
							dur="1.8s"
							begin="{k * 0.6}s"
							repeatCount="indefinite"
							path="M306 104 V146 H240"
						/>
					</circle>
				{/each}
			{/if}

			<!-- server -->
			<g class="part" class:dim={!lit('server')}>
				<text x="306" y="18" text-anchor="middle" class="label">{tx.serverLabel}</text>
				<rect x="270" y="26" width="72" height="78" rx="9" class="rack" />
				{#each [34, 56, 78] as y (y)}
					<rect x="277" {y} width="58" height="18" rx="4" class="unit" />
					<circle cx="326" cy={y + 9} r="2.5" class="led" class:offled={!net} />
				{/each}
			</g>

			<!-- manifest, the ID card -->
			{#if hasManifest}
				<g class="part" class:dim={!lit('manifest')}>
					{#if scene === 'remember'}
						<text x="58" y="22" text-anchor="middle" class="memo">{tx.memo.manifest}</text>
					{/if}
					<rect x="6" y="30" width="104" height="96" rx="9" class="card" />
					<text x="14" y="46" class="file">manifest.json</text>
					{#each MANIFEST.slice(0, manifestLines) as line, k (k)}
						<text x={k === 0 || k === 4 ? 14 : 20} y={62 + k * 13} class="json">{line}</text>
					{/each}
				</g>
			{/if}

			<!-- cache box on the phone -->
			{#if active >= 4}
				<g class="part" class:dim={!lit('cache')}>
					<text x="58" y="234" text-anchor="middle" class="label">{tx.cacheLabel}</text>
					<path d="M10 244 V298 Q10 304 16 304 H100 Q106 304 106 298 V244" class="box" />
					{#each FILES.slice(0, cached) as f (f.label)}
						<g transform="translate({f.x} 262)">
							<g
								class="fly"
								class:still={clock.reduced || scene !== 'worker'}
								style="--dx:{306 - f.x}px; --dy:{60 - 262}px"
							>
								<path d="M0 0 H12 L18 6 V26 H0 Z" class="doc" />
								<text x="9" y="18" text-anchor="middle" class="ext">{f.label}</text>
							</g>
						</g>
					{/each}
					{#if fromCache}
						<path d="M106 274 H118" class="feed" />
					{/if}
				</g>
			{/if}

			<!-- phone -->
			<g class="part" class:dim={!lit('phone')}>
				<rect x="120" y="36" width="116" height="282" rx="20" class="phone" />
				<rect x="128" y="50" width="100" height="256" rx="12" class="screen" />
				<!-- status bar with wifi -->
				<g transform="translate(214 60)" class="wifi" class:off={!net}>
					<path d="M-7 -1 Q0 -7 7 -1" />
					<path d="M-4 2 Q0 -1 4 2" />
					<circle cx="0" cy="5" r="1.4" />
				</g>
				{#if !net}
					<path d="M206 54 L222 68" class="cut thin" />
				{/if}

				{#if screen === 'site'}
					<rect x="134" y="68" width="88" height="14" rx="7" class="addr" />
					<text x="178" y="78" text-anchor="middle" class="url">nimbus.com</text>
					<rect x="134" y="90" width="88" height="44" rx="6" class="hero" />
					<text x="142" y="116" class="brand">{tx.appName}</text>
					{#each wrap(tx.tagline, 16) as l, k (k)}
						<text x="136" y={152 + k * 12} class="tagline">{l}</text>
					{/each}
					{#each [180, 190, 200, 214, 224] as y (y)}
						<rect x="136" {y} width={y % 20 === 0 ? 70 : 82} height="4" rx="2" class="lines" />
					{/each}
				{:else if screen === 'noNet'}
					<path
						d="M158 150 Q150 150 150 141 Q150 132 160 133 Q163 122 176 123 Q188 123 191 134 Q202 133 202 142 Q202 150 194 150 Z"
						class="cloud"
					/>
					<path d="M170 132 l12 12 M182 132 l-12 12" class="cut" />
					{#each wrap(tx.noInternet, 14) as l, k (k)}
						<text x="178" y={176 + k * 13} text-anchor="middle" class="sad">{l}</text>
					{/each}
				{:else if screen === 'home'}
					{#each APPS as k (k)}
						<rect
							x={140 + (k % 3) * 28}
							y={84 + Math.floor(k / 3) * 36}
							width="20"
							height="20"
							rx="6"
							class="otherapp"
						/>
					{/each}
					{#if iconOn}
						<g
							class="nimicon"
							class:pulse={tapIcon && !clock.reduced}
							style="transform-origin:206px 202px"
						>
							<rect x="196" y="192" width="20" height="20" rx="6" class="appicon" />
							<circle cx="202" cy="204" r="3.2" class="puff" />
							<circle cx="206.5" cy="200.5" r="4.3" class="puff" />
							<circle cx="210.5" cy="204.5" r="2.8" class="puff" />
						</g>
						<text x="206" y="222" text-anchor="middle" class="iconname">{tx.appName}</text>
					{/if}
				{:else}
					<rect x="128" y="50" width="100" height="70" rx="12" class="hero full" />
					<text x="140" y="104" class="brand light">{tx.appName}</text>
					{#each wrap(tx.tagline, 16) as l, k (k)}
						<text x="136" y={140 + k * 12} class="tagline">{l}</text>
					{/each}
					{#each [168, 178, 188, 202, 212] as y (y)}
						<rect x="136" {y} width={y % 20 === 8 ? 70 : 82} height="4" rx="2" class="lines" />
					{/each}
					<rect x="140" y="270" width="76" height="16" rx="8" class="src" class:cache={fromCache} />
					<text x="178" y="281" text-anchor="middle" class="srctext" class:cache={fromCache}
						>{fromCache ? tx.fromCache : tx.fromServer}</text
					>
				{/if}

				{#if banner}
					<g class="banner">
						<rect x="132" y="250" width="92" height="48" rx="9" class="bannerbg" />
						<text x="140" y="266" class="ask">{tx.installAsk}</text>
						<rect x="176" y="274" width="42" height="17" rx="8.5" class="install" class:pressed />
						<text x="197" y="286" text-anchor="middle" class="installtext">{tx.installBtn}</text>
					</g>
				{/if}
			</g>

			<!-- service worker, the doorman on the line -->
			{#if hasWorker}
				<g class="part" class:dim={!lit('worker')}>
					{#if scene === 'remember'}
						<text x="268" y="174" text-anchor="middle" class="memo">{tx.memo.worker}</text>
					{/if}
					<g transform="translate(268 146)"
						><g class="guard" class:busy={fromCache}>
							<rect x="-9" y="-2" width="18" height="20" rx="6" class="coat" />
							<circle cx="0" cy="-9" r="6.5" class="head" />
							<path d="M-7 -13 H7 L5 -17 H-5 Z" class="cap" />
							<rect x="5" y="2" width="8" height="10" rx="2.5" class="pack" />
						</g></g
					>
					<text x="268" y={scene === 'remember' ? 188 : 180} text-anchor="middle" class="small"
						>{tx.workerLabel}</text
					>
				</g>
			{/if}
		</svg>
		{#if scene === 'remember'}
			<p class="rule">{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} {active} onselect={(i) => (peek = i)} visual={picture} />
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.pic {
		display: block;
		width: 100%;
		height: auto;
		max-height: 60vh;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.part {
		transition: opacity 0.4s;
	}
	.part.dim {
		opacity: 0.35;
	}
	.label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
	.small {
		fill: var(--color-muted);
		font-size: 9px;
		font-weight: 600;
	}
	.memo {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
	}
	.wire {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.5;
		stroke-linejoin: round;
		transition: stroke 0.4s;
	}
	.wire.off {
		stroke: var(--color-line);
	}
	.cut {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.cut.thin {
		stroke-width: 1.8;
	}
	.data {
		fill: var(--color-brand);
	}
	.rack {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.unit {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.led.offled {
		fill: var(--color-faint);
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.file {
		fill: var(--color-brand);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 8.5px;
		font-weight: 700;
	}
	.json {
		fill: var(--color-ink);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 7.2px;
	}
	.box {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.8;
	}
	.doc {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.2;
	}
	.ext {
		fill: var(--color-muted);
		font-size: 6.5px;
		font-weight: 700;
	}
	.fly {
		animation: fly 0.9s cubic-bezier(0.4, 0, 0.3, 1) both;
	}
	.fly.still {
		animation: none;
	}
	@keyframes fly {
		from {
			transform: translate(var(--dx), var(--dy));
			opacity: 0.3;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	.feed {
		stroke: var(--color-amber);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.phone {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.screen {
		fill: var(--color-paper);
	}
	.wifi path {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.6;
		stroke-linecap: round;
	}
	.wifi circle {
		fill: var(--color-ink);
	}
	.wifi.off path,
	.wifi.off circle {
		stroke: var(--color-faint);
		fill: none;
	}
	.wifi.off circle {
		fill: var(--color-faint);
	}
	.addr {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.url {
		fill: var(--color-muted);
		font-size: 8px;
		font-weight: 600;
	}
	.hero {
		fill: var(--color-brand-soft);
	}
	.hero.full {
		fill: var(--color-brand);
	}
	.brand {
		fill: var(--color-brand);
		font-size: 16px;
		font-weight: 800;
	}
	.brand.light {
		fill: var(--color-card);
	}
	.tagline {
		fill: var(--color-ink);
		font-size: 9.5px;
		font-weight: 700;
	}
	.lines {
		fill: var(--color-line);
	}
	.cloud {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 1.8;
	}
	.sad {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
	}
	.otherapp {
		fill: var(--color-line);
	}
	.appicon {
		fill: var(--color-brand);
	}
	.puff {
		fill: var(--color-card);
	}
	.nimicon {
		animation: pop 0.5s cubic-bezier(0.3, 1.4, 0.5, 1) both;
	}
	.nimicon.pulse {
		animation: tap 0.6s ease-in-out 2;
	}
	@keyframes pop {
		from {
			transform: scale(0.2);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes tap {
		50% {
			transform: scale(0.85);
		}
	}
	.iconname {
		fill: var(--color-ink);
		font-size: 7.5px;
		font-weight: 700;
	}
	.src {
		fill: var(--color-brand-soft);
	}
	.src.cache {
		fill: var(--color-amber-soft);
	}
	.srctext {
		fill: var(--color-brand);
		font-size: 8.5px;
		font-weight: 700;
	}
	.srctext.cache {
		fill: var(--color-amber);
	}
	.banner {
		animation: rise 0.45s ease both;
	}
	@keyframes rise {
		from {
			transform: translateY(20px);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	.bannerbg {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.ask {
		fill: var(--color-ink);
		font-size: 9px;
		font-weight: 700;
	}
	.install {
		fill: var(--color-brand);
		transition: fill 0.2s;
	}
	.install.pressed {
		fill: var(--color-grass);
	}
	.installtext {
		fill: var(--color-card);
		font-size: 8px;
		font-weight: 700;
	}
	.coat {
		fill: var(--color-brand);
	}
	.head {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.2;
	}
	.cap {
		fill: var(--color-ink);
	}
	.pack {
		fill: var(--color-amber);
	}
	.guard.busy {
		animation: nod 1.4s ease-in-out infinite;
	}
	@keyframes nod {
		50% {
			transform: translateY(-2px);
		}
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.wire,
		.install {
			transition: none;
		}
		.fly,
		.nimicon,
		.nimicon.pulse,
		.banner,
		.guard.busy {
			animation: none;
		}
	}
</style>
