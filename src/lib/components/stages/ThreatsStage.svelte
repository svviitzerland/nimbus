<script lang="ts">
	// Guided threat modeling. One house stands for nimbus.com (front door is the login, the window
	// is old software, the back gate is a partner login, the key under the pot is the backup).
	// A burglar skips the big lock and tries the other spots, the owner walks the same round with
	// a magnifier, and the Target story of 2013 plays out through the back gate to the registers.
	// On the last beat the learner may tap a spot to read its threat and fix.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { StageProps } from '$lib/chapters/types';
	import type { ThreatSpot, ThreatsText } from '$lib/chapters/security/threats/types';
	import GuideWrap from './secbasics/GuideWrap.svelte';
	import { startGuided } from './secbasics/guided.svelte';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ThreatsText);
	startGuided(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const last = $derived(tx.steps.length - 1);
	let peek = $state<number | null>(null);
	let picked = $state<ThreatSpot | null>(null);
	$effect(() => {
		void beat;
		peek = null;
		picked = null;
	});
	const active = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	type Scene =
		| 'burglar'
		| 'model'
		| 'questions'
		| 'map'
		| 'target1'
		| 'target2'
		| 'ingat'
		| 'stride'
		| 'try';
	const SCENES: Scene[] = [
		'burglar',
		'model',
		'questions',
		'map',
		'target1',
		'target2',
		'ingat',
		'stride',
		'try'
	];
	const scene = $derived(SCENES[active] ?? 'burglar');

	const SPOTS: ThreatSpot[] = ['door', 'window', 'gate', 'pot'];
	const AT: Record<ThreatSpot, { x: number; y: number; stand: number }> = {
		door: { x: 210, y: 200, stand: 252 },
		window: { x: 156, y: 146, stand: 156 },
		gate: { x: 378, y: 214, stand: 344 },
		pot: { x: 70, y: 214, stand: 106 }
	};
	const LABEL_Y: Record<ThreatSpot, number> = { door: 160, window: 116, gate: 180, pot: 186 };

	let who = $state<ThreatSpot>('door');
	let seen = $state<ThreatSpot[]>([]);
	let ticks = $state(0);
	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	function round(list: ThreatSpot[], ms: number, mark: boolean): SeqStep[] {
		return list.map(
			(sp, k): SeqStep => [
				ms,
				() => {
					who = sp;
					if (mark) seen = k === 0 ? [sp] : [...seen, sp];
				}
			]
		);
	}

	function play(sc: Scene, still: boolean) {
		seen = [];
		ticks = 0;
		who = 'door';
		if (sc === 'burglar' || sc === 'model') {
			if (still) {
				who = 'gate';
				seen = sc === 'model' ? [...SPOTS] : [];
				return;
			}
			return runSeq(round(['door', 'window', 'gate', 'pot'], 1700, sc === 'model'), true);
		}
		if (sc === 'questions') {
			if (still) {
				ticks = 4;
				return;
			}
			return runSeq(
				[0, 1, 2, 3, 4].map((n): SeqStep => [n === 4 ? 2600 : 1100, () => (ticks = n)]),
				true
			);
		}
		if (sc === 'target1') {
			if (still) {
				who = 'gate';
				return;
			}
			return runSeq(
				[
					[1500, () => (who = 'door')],
					[3600, () => (who = 'gate')]
				],
				true
			);
		}
		if (sc === 'target2') who = 'gate';
	}

	$effect(() => {
		const sc = scene;
		const still = reduce;
		return untrack(() => play(sc, still));
	});

	function pick(sp: ThreatSpot) {
		peek = null;
		picked = sp;
		onstate?.(sp);
	}

	type Ring = 'none' | 'look' | 'weak' | 'strong' | 'pick';
	function ringOf(sp: ThreatSpot): Ring {
		if (scene === 'burglar') return who === sp ? 'look' : 'none';
		if (scene === 'model') return seen.includes(sp) ? 'look' : 'none';
		if (scene === 'target1' || scene === 'target2') return sp === 'gate' ? 'weak' : 'none';
		if (scene === 'ingat') return sp === 'door' ? 'strong' : sp === 'gate' ? 'weak' : 'look';
		if (scene === 'try') return picked === sp ? 'pick' : 'look';
		return 'none';
	}
	const figure = $derived(
		scene === 'burglar' || scene === 'target1' || scene === 'target2'
			? 'burglar'
			: scene === 'model' || scene === 'questions'
				? 'owner'
				: null
	);
	const standX = $derived(AT[who].stand);
	const STRIDE = ['S', 'T', 'R', 'I', 'D', 'E'];
</script>

{#snippet spotRing(sp: ThreatSpot)}
	<circle cx={AT[sp].x} cy={AT[sp].y} r="27" class="ring {ringOf(sp)}" />
{/snippet}

{#snippet visual(s: number)}
	{@const sc = SCENES[s] ?? 'burglar'}
	<div class="vis">
		<div class="slot">
			{#if sc === 'target1' || sc === 'target2'}
				<p class="news" in:fade={{ duration: 240 }}>
					<span class="news-tag">{tx.news.tag}</span>
					<span class="news-head">{tx.news.head}</span>
				</p>
			{:else if sc === 'try'}
				{#if picked}
					{#key picked}
						<div class="info" in:fade={{ duration: 200 }}>
							<b>{tx.spots[picked].name}</b>
							<span><em>{tx.threatLabel}.</em> {tx.spots[picked].threat}</span>
							<span><em>{tx.fixLabel}.</em> {tx.spots[picked].fix}</span>
						</div>
					{/key}
				{:else}
					<p class="hint">{tx.tapHint}</p>
				{/if}
			{/if}
		</div>

		<svg viewBox="0 0 420 272" class="scene" role="img" aria-label={tx.title}>
			<line x1="8" y1="236" x2="412" y2="236" class="ground" />

			<!-- the house -->
			<polygon points="96,104 210,40 324,104" class="roof" />
			<rect x="110" y="104" width="200" height="132" class="wall" />
			<rect x="132" y="126" width="48" height="40" rx="3" class="win" />
			<line x1="156" y1="126" x2="156" y2="166" class="frame" />
			<line x1="132" y1="146" x2="180" y2="146" class="frame" />
			<rect x="244" y="126" width="48" height="40" rx="3" class="win" />
			<line x1="268" y1="126" x2="268" y2="166" class="frame" />
			<line x1="244" y1="146" x2="292" y2="146" class="frame" />
			<rect x="190" y="168" width="40" height="68" rx="3" class="door" />
			<g class="padlock">
				<path d="M204 194 v-5 a6 6 0 0 1 12 0 v5" />
				<rect x="200" y="193" width="20" height="16" rx="3" />
			</g>

			<!-- the cash registers, inside, for the Target story -->
			{#if sc === 'target2'}
				<g class="register">
					<rect x="248" y="190" width="44" height="30" rx="4" />
					<rect x="254" y="195" width="32" height="9" rx="2" class="reg-screen" />
					<text x="270" y="232" class="reg-label">{tx.registerLabel}</text>
				</g>
				<path d="M378 210 C 350 170, 310 170, 292 200" class="trail" />
				{#each [0, 1, 2] as k (k)}
					<g transform="translate(272 188)">
						<g class="card" style="animation-delay:{k * 0.8}s">
							<rect x="-9" y="-6" width="18" height="12" rx="2" />
							<line x1="-9" y1="-2" x2="9" y2="-2" />
						</g>
					</g>
				{/each}
				<text x="240" y="62" class="cards-label">{tx.cardsLabel}</text>
			{/if}

			<!-- the fence and the back gate -->
			{#each [330, 346, 400, 412] as x (x)}
				<rect x={x - 3} y="196" width="6" height="40" rx="2" class="post" />
			{/each}
			<line x1="327" y1="208" x2="360" y2="208" class="rail" />
			<line x1="396" y1="208" x2="414" y2="208" class="rail" />
			<rect x="360" y="192" width="36" height="44" rx="3" class="gate" />
			<line x1="360" y1="214" x2="396" y2="214" class="frame" />

			<!-- the flower pot and the key under it -->
			<path d="M80 172 q-6 -14 4 -22" class="stem" />
			<circle cx="84" cy="146" r="7" class="petal" />
			<circle cx="84" cy="146" r="3" class="petal-mid" />
			<path d="M54 202 H90 L85 236 H59 Z" class="pot" />
			<g class="key">
				<circle cx="94" cy="232" r="3.2" />
				<line x1="97" y1="232" x2="106" y2="232" />
			</g>

			<!-- the spots -->
			{#each SPOTS as sp (sp)}
				{#if sc === 'try'}
					<g
						class="tap"
						role="button"
						tabindex="0"
						aria-label={tx.spots[sp].name}
						onclick={() => pick(sp)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								pick(sp);
							}
						}}
					>
						{@render spotRing(sp)}
					</g>
				{:else}
					{@render spotRing(sp)}
				{/if}
			{/each}

			<!-- the nimbus.com meaning of each spot -->
			{#if sc === 'map'}
				{#each SPOTS as sp, k (sp)}
					{@const w = tx.spots[sp].place.length * 6 + 16}
					<g class="place" style="animation-delay:{k * 0.5}s">
						<rect
							x={Math.min(Math.max(AT[sp].x - w / 2, 4), 416 - w)}
							y={LABEL_Y[sp] - 12}
							width={w}
							height="17"
							rx="8.5"
						/>
						<text x={Math.min(Math.max(AT[sp].x, 4 + w / 2), 416 - w / 2)} y={LABEL_Y[sp]}
							>{tx.spots[sp].place}</text
						>
					</g>
				{/each}
			{/if}

			<!-- the clipboard with the four questions -->
			{#if sc === 'questions'}
				<g class="clip">
					<rect x="340" y="20" width="66" height="84" rx="7" class="clip-board" />
					<rect x="360" y="15" width="26" height="9" rx="3" class="clip-top" />
					{#each [0, 1, 2, 3] as k (k)}
						<rect x="348" y={34 + k * 17} width="10" height="10" rx="2.5" class="box" />
						{#if ticks > k}
							<path d="M350 {39 + k * 17} l2.5 2.5 l4.5 -5" class="tick" />
						{/if}
						<rect x="364" y={37 + k * 17} width="34" height="4" rx="2" class="line" />
					{/each}
				</g>
			{/if}

			<!-- the person walking around -->
			{#if figure}
				<g class="walker {figure}" style="transform: translate({standX}px, 236px)">
					<circle cx="0" cy="-38" r="8" class="head" />
					{#if figure === 'burglar'}
						<rect x="-8" y="-41" width="16" height="4.5" rx="2" class="mask" />
					{/if}
					<path d="M-10 0 V-18 a10 10 0 0 1 20 0 V0 Z" class="body" />
					{#if figure === 'owner'}
						<circle cx="16" cy="-24" r="6" class="glass" />
						<line x1="11" y1="-19" x2="6" y2="-13" class="glass-h" />
					{/if}
				</g>
			{/if}

			<!-- STRIDE -->
			{#if sc === 'stride'}
				{#each STRIDE as l, k (k)}
					<g class="letter" style="animation-delay:{k * 0.25}s">
						<rect x={104 + k * 36} y="244" width="28" height="24" rx="7" />
						<text x={118 + k * 36} y="261">{l}</text>
					</g>
				{/each}
			{/if}
		</svg>
	</div>
{/snippet}

<GuideWrap steps={tx.steps} {active} onselect={(k) => (peek = k)} {visual} />

<style>
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.slot {
		display: flex;
		min-height: 56px;
		width: 100%;
		align-items: center;
		justify-content: center;
	}
	.news,
	.info {
		margin: 0;
		max-width: 360px;
		border-left: 3px solid var(--color-danger);
		border-radius: 6px;
		background: var(--color-card);
		padding: 6px 12px;
		box-shadow: 0 6px 16px rgba(22, 40, 60, 0.08);
		line-height: 1.35;
	}
	.info {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-left-color: var(--color-brand);
		font-size: 12.5px;
		color: var(--color-muted);
	}
	.info b {
		font-family: var(--font-display);
		font-size: 14px;
		color: var(--color-ink);
	}
	.info em {
		font-style: normal;
		font-weight: 700;
		color: var(--color-ink);
	}
	.news-tag {
		display: block;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-danger);
	}
	.news-head {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.hint {
		margin: 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.scene {
		width: 100%;
		max-width: 420px;
		height: auto;
		overflow: visible;
	}

	.ground {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.roof {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.wall {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.win {
		fill: var(--color-brand-soft);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.frame {
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.door {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.padlock path {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2.4;
	}
	.padlock rect {
		fill: var(--color-amber);
		stroke: var(--color-ink);
		stroke-width: 1.5;
	}
	.post {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.rail {
		stroke: var(--color-amber);
		stroke-width: 3;
	}
	.gate {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.stem {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.petal {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 1.5;
	}
	.petal-mid {
		fill: var(--color-amber);
	}
	.pot {
		fill: var(--color-amber);
		opacity: 0.85;
	}
	.key circle,
	.key line {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 1.8;
		stroke-linecap: round;
	}

	.ring {
		fill: transparent;
		stroke: transparent;
		stroke-width: 3;
		transition:
			stroke 0.35s,
			fill 0.35s;
	}
	.ring.look {
		stroke: var(--color-amber);
		fill: color-mix(in srgb, var(--color-amber) 10%, transparent);
	}
	.ring.weak {
		stroke: var(--color-danger);
		fill: color-mix(in srgb, var(--color-danger) 10%, transparent);
	}
	.ring.strong {
		stroke: var(--color-grass);
	}
	.ring.pick {
		stroke: var(--color-brand);
		fill: color-mix(in srgb, var(--color-brand) 12%, transparent);
	}
	.tap {
		cursor: pointer;
		outline: none;
	}
	.tap:hover .ring,
	.tap:focus-visible .ring {
		stroke: var(--color-brand);
	}

	.place rect {
		fill: var(--color-brand);
	}
	.place text {
		font-size: 9.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: #fff;
	}
	.clip-board {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.8;
	}
	.clip-top {
		fill: var(--color-muted);
	}
	.box {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.4;
	}
	.line {
		fill: var(--color-line);
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.register rect {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.8;
	}
	.register .reg-screen {
		fill: var(--color-grass-soft);
		stroke-width: 1;
	}
	.reg-label {
		font-size: 9px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.trail {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.card rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 1.4;
	}
	.card line {
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.card {
		opacity: 0;
	}
	.cards-label {
		font-size: 11px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-danger);
	}

	.walker {
		transition: transform 1.1s cubic-bezier(0.45, 0, 0.3, 1);
	}
	.walker .head {
		fill: var(--color-amber-soft);
		stroke: var(--color-ink);
		stroke-width: 1.8;
	}
	.walker .body {
		fill: var(--color-ink);
	}
	.walker .mask {
		fill: var(--color-ink);
	}
	.walker.owner .body {
		fill: var(--color-brand);
	}
	.glass {
		fill: var(--color-brand-soft);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.glass-h {
		stroke: var(--color-ink);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.letter rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.letter text {
		font-family: var(--font-display);
		font-size: 14px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-brand);
	}

	@media (prefers-reduced-motion: no-preference) {
		.place,
		.letter {
			animation: rise 0.5s ease both;
		}
		.card {
			animation: fly 2.4s ease-in infinite;
		}
		.trail {
			stroke-dasharray: 160;
			animation: draw 3s ease-in-out infinite;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card {
			opacity: 0.8;
		}
		.walker,
		.ring {
			transition: none;
		}
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
	@keyframes fly {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		100% {
			transform: translate(-40px, -110px);
			opacity: 0;
		}
	}
	@keyframes draw {
		0% {
			stroke-dashoffset: 160;
		}
		50%,
		100% {
			stroke-dashoffset: 0;
		}
	}
</style>
