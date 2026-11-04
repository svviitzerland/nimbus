<script lang="ts">
	// A guided "watch" stage. One picture with four actors in a U shape, the laptop, GitHub, the
	// host server, and a phone. Each beat plays one part of the trip by itself (a little package
	// carries the commit), then the whole chain loops. The only optional play is on the last beat,
	// pushing a new headline and following it to the phone.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { DeploySiteText } from '$lib/chapters/web/deploy-site/types';
	import { phaseAt, sceneClock, wrap, type Beat } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as DeploySiteText);

	type Scene =
		| 'laptop'
		| 'server'
		| 'push'
		| 'build'
		| 'live'
		| 'remember'
		| 'hosts'
		| 'cicd'
		| 'try';
	const SCENES: Scene[] = [
		'laptop',
		'server',
		'push',
		'build',
		'live',
		'remember',
		'hosts',
		'cicd',
		'try'
	];
	type Ph =
		| 'atL'
		| 'toR'
		| 'atR'
		| 'toT'
		| 'testing'
		| 'toS'
		| 'atS'
		| 'building'
		| 'built'
		| 'toP'
		| 'live';

	const PUSH: Beat<Ph>[] = [
		{ ph: 'atL', ms: 700 },
		{ ph: 'toR', ms: 1100 },
		{ ph: 'atR', ms: 2000 }
	];
	const BUILD: Beat<Ph>[] = [
		{ ph: 'atR', ms: 600 },
		{ ph: 'toS', ms: 1100 },
		{ ph: 'building', ms: 2200 },
		{ ph: 'built', ms: 1600 }
	];
	const LIVE: Beat<Ph>[] = [
		{ ph: 'atS', ms: 700 },
		{ ph: 'toP', ms: 1100 },
		{ ph: 'live', ms: 3000 }
	];
	const FULL: Beat<Ph>[] = [
		{ ph: 'atL', ms: 700 },
		{ ph: 'toR', ms: 1100 },
		{ ph: 'atR', ms: 400 },
		{ ph: 'toS', ms: 1100 },
		{ ph: 'building', ms: 1800 },
		{ ph: 'toP', ms: 1100 },
		{ ph: 'live', ms: 2800 }
	];
	const TESTED: Beat<Ph>[] = [
		{ ph: 'atL', ms: 700 },
		{ ph: 'toR', ms: 1100 },
		{ ph: 'toT', ms: 900 },
		{ ph: 'testing', ms: 1100 },
		{ ph: 'toS', ms: 900 },
		{ ph: 'building', ms: 1600 },
		{ ph: 'toP', ms: 1100 },
		{ ph: 'live', ms: 2800 }
	];

	// where the package sits in each phase (viewBox units)
	const L = [80, 190];
	const R = [80, 68];
	const T = [183, 68];
	const S = [280, 76];
	const P = [280, 232];
	const POS: Record<Ph, number[]> = {
		atL: L,
		toR: R,
		atR: R,
		toT: T,
		testing: T,
		toS: S,
		atS: S,
		building: S,
		built: S,
		toP: P,
		live: P
	};
	const MOVING: Ph[] = ['toR', 'toT', 'toS', 'toP'];
	const SHOWN: Ph[] = ['atL', 'toR', 'toT', 'testing', 'toS', 'atS', 'toP'];

	let peek = $state<number | null>(null);
	let pushes = $state(0);
	let from = $state(1);
	let to = $state(1);

	const fromBeat = $derived(Math.min(beat, SCENES.length - 1));
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, pushes]);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const seq = $derived<Beat<Ph>[] | null>(
		scene === 'push'
			? PUSH
			: scene === 'build'
				? BUILD
				: scene === 'live'
					? LIVE
					: scene === 'remember'
						? FULL
						: scene === 'cicd'
							? TESTED
							: scene === 'try' && pushes > 0
								? FULL
								: null
	);
	const now = $derived(seq ? phaseAt(seq, clock.t, scene !== 'try') : { ph: 'live' as Ph, p: 1 });
	const ph = $derived(now.ph);
	const busy = $derived(scene === 'try' && pushes > 0 && ph !== 'live');
	const pos = $derived(POS[ph]);
	const pkgOn = $derived(seq !== null && SHOWN.includes(ph));

	// the laptop dozes off every few seconds on the first scene
	const asleep = $derived(scene === 'laptop' && (clock.reduced || clock.t % 6000 > 2600));

	// the hosts scene swaps between a platform and a VPS every few seconds
	const hostT = $derived(clock.reduced ? 0 : clock.t % 9000);
	const vps = $derived(scene === 'hosts' && (clock.reduced || hostT >= 4500));
	const typedCmds = $derived(clock.reduced ? 4 : Math.min(4, Math.floor((hostT - 4500) / 700) + 1));
	const gearSpin = $derived(
		ph === 'building' ? !clock.reduced : scene === 'hosts' && !vps && !clock.reduced
	);
	const barP = $derived(ph === 'building' ? now.p : ph === 'built' ? 1 : 0);

	// which headline is where
	const H = $derived(tx.headlines);
	const oldIdx = $derived(scene === 'try' ? from : 0);
	const newIdx = $derived(scene === 'try' ? to : 1);
	const phoneLive = $derived(
		scene === 'try' ? pushes === 0 || ph === 'live' : ph === 'live' && seq !== null
	);
	const phoneHeadline = $derived(H[phoneLive ? newIdx : oldIdx] ?? '');
	const phoneText = $derived(asleep ? tx.unreachable : phoneHeadline);
	const laptopHeadline = $derived(H[scene === 'laptop' || scene === 'server' ? 0 : newIdx] ?? '');
	// a new commit dot shows up on GitHub once the package has arrived there
	const arrived = $derived(seq !== null && ph !== 'atL' && ph !== 'toR');
	const commits = $derived(
		scene === 'try'
			? 3 + pushes - (pushes > 0 && !arrived ? 1 : 0)
			: scene === 'build' || scene === 'live'
				? 4
				: 3 + (arrived ? 1 : 0)
	);
	const testOk = $derived(
		scene === 'cicd' && (ph === 'testing' ? now.p > 0.5 : !['atL', 'toR', 'toT'].includes(ph))
	);

	const LIT: Record<Scene, string[]> = {
		laptop: ['laptop', 'phone'],
		server: ['host'],
		push: ['laptop', 'repo', 'push'],
		build: ['repo', 'host', 'build'],
		live: ['host', 'phone', 'live'],
		remember: ['laptop', 'repo', 'host', 'phone', 'push', 'build', 'live'],
		hosts: ['host'],
		cicd: ['laptop', 'repo', 'host', 'phone', 'push', 'build', 'live'],
		try: ['laptop', 'repo', 'host', 'phone', 'push', 'build', 'live']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	function pushAgain() {
		if (busy) return;
		from = to;
		to = (to % (H.length - 1)) + 1;
		pushes += 1;
		onstate?.('push');
	}

	const GEAR = Array.from({ length: 8 }, (_, k) => k * 45);
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={pushAgain} disabled={busy}>
				{busy ? tx.pushing : tx.pushBtn}
			</button>
		{/if}
		<svg viewBox="0 0 360 334" class="pic" role="img" aria-label={tx.picture}>
			<!-- arrows -->
			<path d="M80 188 V116" class="arrow" class:on={lit('push')} />
			<path d="M144 68 H222" class="arrow" class:on={lit('build')} />
			<path d="M280 126 V160" class="arrow" class:on={lit('live')} />
			<path d="M80 116 l-5 8 M80 116 l5 8" class="arrow" class:on={lit('push')} />
			<path d="M222 68 l-8 -5 M222 68 l-8 5" class="arrow" class:on={lit('build')} />
			<path d="M280 160 l-5 -8 M280 160 l5 -8" class="arrow" class:on={lit('live')} />
			<text x="88" y="156" class="aw" class:on={lit('push')}>{tx.arrows.push}</text>
			{#if scene !== 'cicd'}
				<text x="183" y="58" text-anchor="middle" class="aw" class:on={lit('build')}
					>{tx.arrows.build}</text
				>
			{/if}
			<text x="288" y="148" class="aw" class:on={lit('live')}>{tx.arrows.live}</text>

			<!-- the old way, the laptop serving the phone straight away -->
			{#if scene === 'laptop'}
				<path d="M150 236 H{asleep ? 184 : 234}" class="direct" class:off={asleep} />
				{#if asleep}
					<path d="M200 230 l10 10 M210 230 l-10 10" class="cut" />
				{/if}
			{/if}

			<!-- test checkpoint -->
			{#if scene === 'cicd'}
				<text x="183" y="48" text-anchor="middle" class="aw on">{tx.arrows.tests}</text>
				<circle cx="183" cy="68" r="11" class="check" class:ok={testOk} />
				{#if testOk}
					<path d="M178 68 l4 4 l7 -8" class="tick" />
				{/if}
			{/if}

			<!-- GitHub repository -->
			<g class="actor" class:dim={!lit('repo')}>
				<rect x="20" y="26" width="120" height="84" rx="12" class="card" />
				<circle cx="38" cy="44" r="6" class="mark" />
				<text x="50" y="48" class="title">{tx.labels.repo}</text>
				<line x1="34" y1="80" x2="126" y2="80" class="history" />
				{#each Array.from({ length: Math.min(commits, 5) }, (_, k) => k) as k (k)}
					<circle
						cx={40 + k * 20}
						cy="80"
						r="5"
						class="commit"
						class:fresh={k === Math.min(commits, 5) - 1 && commits > 3}
					/>
				{/each}
			</g>

			<!-- host server rack -->
			<g class="actor" class:dim={!lit('host')}>
				<!-- one centred header, so the extra words never sit on top of the name -->
				{#if scene === 'hosts'}
					<text x="280" y="16" text-anchor="middle" class="hostkind"
						>{vps ? tx.hosts.vps : tx.hosts.platform}</text
					>
				{:else}
					<text x="280" y="16" text-anchor="middle" class="label"
						>{tx.labels.host}{#if scene === 'server'}<tspan class="always" dx="6"
								>{tx.alwaysOn}</tspan
							>{/if}</text
					>
				{/if}
				<rect x="226" y="24" width="108" height="98" rx="10" class="rack" />
				{#if vps}
					<rect x="232" y="30" width="96" height="86" rx="6" class="term" />
					{#each tx.vpsCommands.slice(0, Math.max(0, typedCmds)) as c, k (k)}
						<text x="238" y={46 + k * 18} class="cmd">{c}</text>
					{/each}
				{:else}
					{#each [32, 60, 88] as y, k (y)}
						<rect x="234" {y} width="92" height="24" rx="5" class="unit" />
						<line x1="242" y1={y + 12} x2="282" y2={y + 12} class="slot" />
						{#if k === 2 && barP > 0}
							<rect x="242" y={y + 9} width={40 * barP} height="6" rx="3" class="bar" />
						{/if}
						<circle cx="314" cy={y + 12} r="3" class="led" class:blink={!clock.reduced} />
					{/each}
				{/if}
				{#if !vps && (ph === 'building' || ph === 'built' || (scene === 'hosts' && !vps))}
					<g transform="translate(330 116)">
						<circle r="15" class="gearbg" />
						<g class:spin={gearSpin}>
							{#each GEAR as a (a)}
								<rect
									x="-2.5"
									y="-10"
									width="5"
									height="5"
									rx="1"
									class="gear"
									transform="rotate({a})"
								/>
							{/each}
							<circle r="6.5" class="gear" />
							<circle r="2.5" class="gearhole" />
						</g>
					</g>
				{/if}
			</g>

			<!-- laptop -->
			<g class="actor" class:dim={!lit('laptop')}>
				<rect x="24" y="196" width="112" height="72" rx="7" class="bezel" />
				<rect x="30" y="202" width="100" height="60" rx="3" class="display" class:dark={asleep} />
				{#if asleep}
					<text x="80" y="236" text-anchor="middle" class="zz">z z</text>
				{:else}
					<text x="36" y="216" class="code">&lt;h1&gt;</text>
					<text x="42" y="232" class="code ink">{laptopHeadline}</text>
					<text x="36" y="248" class="code">&lt;/h1&gt;</text>
				{/if}
				<path d="M14 268 H146 L140 278 H20 Z" class="base" />
				<text x="80" y="296" text-anchor="middle" class="label">{tx.labels.laptop}</text>
			</g>

			<!-- phone -->
			<g class="actor" class:dim={!lit('phone')}>
				<rect x="241" y="158" width="78" height="150" rx="14" class="phone" />
				<rect x="247" y="170" width="66" height="128" rx="5" class="screen" />
				<rect x="251" y="176" width="58" height="11" rx="5.5" class="addr" />
				<text x="280" y="184" text-anchor="middle" class="url">nimbus.com</text>
				{#if asleep}
					<circle cx="280" cy="226" r="11" class="sad" />
					<path d="M275 221 l10 10 M285 221 l-10 10" class="cut" />
					<text x="280" y="258" text-anchor="middle" class="small">{tx.unreachable}</text>
				{:else}
					{#each wrap(phoneText, 11) as line, k (k)}
						<text
							x="280"
							y={218 + k * 13}
							text-anchor="middle"
							class="head"
							class:fresh={phoneLive && scene !== 'laptop' && scene !== 'server'}>{line}</text
						>
					{/each}
					<rect x="254" y="250" width="52" height="4" rx="2" class="lines" />
					<rect x="254" y="258" width="40" height="4" rx="2" class="lines" />
					{#if phoneLive && seq !== null}
						<rect x="252" y="274" width="56" height="14" rx="7" class="tag" />
						<text x="280" y="284" text-anchor="middle" class="tagtext">{tx.updated}</text>
					{/if}
				{/if}
				<text x="280" y="326" text-anchor="middle" class="label">{tx.labels.phone}</text>
			</g>

			<!-- the package carrying the commit -->
			<g
				class="pkg"
				class:move={MOVING.includes(ph)}
				class:hide={!pkgOn}
				style="transform: translate({pos[0]}px, {pos[1]}px)"
			>
				<rect x="-9" y="-9" width="18" height="18" rx="5" class="box" />
				<path d="M-4 0 H4 M0 -4 V4" class="boxmark" />
			</g>
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
	.act:disabled {
		opacity: 0.6;
	}
	.rule {
		margin: 0;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.actor {
		transition: opacity 0.4s;
	}
	.actor.dim {
		opacity: 0.35;
	}
	.arrow {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
		transition: stroke 0.4s;
	}
	.arrow.on {
		stroke: var(--color-faint);
	}
	.aw {
		fill: var(--color-faint);
		font-size: 10.5px;
		font-weight: 700;
		opacity: 0.5;
	}
	.aw.on {
		opacity: 1;
		fill: var(--color-brand);
	}
	.direct {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.direct.off {
		stroke: var(--color-faint);
	}
	.cut {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.check {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 2;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.check.ok {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.card,
	.rack,
	.phone,
	.bezel {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.rack {
		fill: var(--color-paper);
	}
	.mark {
		fill: var(--color-ink);
	}
	.title {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 700;
	}
	.label {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
	}
	.always {
		fill: var(--color-grass);
		font-size: 10px;
		font-weight: 700;
	}
	.hostkind {
		fill: var(--color-brand);
		font-size: 11px;
		font-weight: 700;
	}
	.history {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.commit {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 2;
	}
	.commit.fresh {
		fill: var(--color-brand);
		stroke: var(--color-brand);
		animation: pop 0.4s ease both;
		transform-box: fill-box;
		transform-origin: center;
	}
	@keyframes pop {
		from {
			transform: scale(0.2);
		}
		to {
			transform: scale(1);
		}
	}
	.unit {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.slot {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.bar {
		fill: var(--color-brand);
	}
	.led {
		fill: var(--color-grass);
	}
	.led.blink {
		animation: blink 1.8s ease-in-out infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.3;
		}
	}
	.term {
		fill: var(--color-ink);
	}
	.cmd {
		fill: var(--color-paper);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 8.5px;
	}
	.gearbg {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.gear {
		fill: var(--color-amber);
	}
	.gearhole {
		fill: var(--color-card);
	}
	.spin {
		animation: spin 2.4s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.display {
		fill: var(--color-paper);
		transition: fill 0.5s;
	}
	.display.dark {
		fill: var(--color-ink);
	}
	.zz {
		fill: var(--color-faint);
		font-size: 13px;
		font-weight: 700;
	}
	.code {
		fill: var(--color-faint);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 8.5px;
	}
	.code.ink {
		fill: var(--color-ink);
		font-weight: 700;
	}
	.base {
		fill: var(--color-line);
	}
	.screen {
		fill: var(--color-paper);
	}
	.addr {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.url {
		fill: var(--color-muted);
		font-size: 7px;
		font-weight: 600;
	}
	.head {
		fill: var(--color-ink);
		font-size: 10.5px;
		font-weight: 800;
	}
	.head.fresh {
		fill: var(--color-brand);
	}
	.lines {
		fill: var(--color-line);
	}
	.small {
		fill: var(--color-muted);
		font-size: 8.5px;
		font-weight: 600;
	}
	.sad {
		fill: var(--color-danger-soft);
	}
	.tag {
		fill: var(--color-grass-soft);
	}
	.tagtext {
		fill: var(--color-grass);
		font-size: 7.5px;
		font-weight: 700;
	}
	.pkg {
		transition: opacity 0.3s;
	}
	.pkg.move {
		transition:
			transform 1s cubic-bezier(0.4, 0, 0.3, 1),
			opacity 0.3s;
	}
	.pkg.hide {
		opacity: 0;
	}
	.box {
		fill: var(--color-brand);
	}
	.boxmark {
		stroke: var(--color-card);
		stroke-width: 2;
		stroke-linecap: round;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pkg,
		.pkg.move,
		.actor,
		.display {
			transition: none;
		}
		.spin,
		.led.blink,
		.commit.fresh {
			animation: none;
		}
	}
</style>
