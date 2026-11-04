<script lang="ts">
	// The story of secret keys, told as a short illustrated tale that follows Nim's beats. Caesar's
	// sliding letters, Enigma with a framed photo of Alan Turing, a road where a shared key gets
	// copied by an eavesdropper, the padlock that fixes it, RSA primes, and Clifford Cocks. Every
	// scene plays by itself. The only optional play is switching the road mode on the last beat.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Padlock from './crypto/Padlock.svelte';
	import Key from './crypto/Key.svelte';
	import Person from './crypto/Person.svelte';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';
	import type { StageProps } from '$lib/chapters/types';
	import type { KeysMode, KeysText } from '$lib/chapters/security/keys/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as KeysText);

	// Watch first, play optional, so the stage is visible from the start and Next never locks.
	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	type Scene = 'caesar' | 'sym' | 'enigma' | 'road' | 'split' | 'rule' | 'rsa' | 'cocks';
	const SCENES: Scene[] = [
		'caesar',
		'sym',
		'enigma',
		'road',
		'split',
		'road',
		'rule',
		'rsa',
		'cocks',
		'road'
	];
	const sceneOf = (s: number): Scene => SCENES[Math.min(s, SCENES.length - 1)];

	// the optional switch on the last beat
	let choice = $state<KeysMode>('padlock');
	let runId = $state(0);
	function pick(m: KeysMode) {
		choice = m;
		runId += 1;
		onstate?.(m);
	}
	const mode = $derived<KeysMode>(step === 3 ? 'shared' : step === 5 ? 'padlock' : choice);

	// road scene state
	const YOU = 44;
	const FRIEND = 316;
	const MID = 180;
	type Item = 'key' | 'padlock' | 'box' | null;
	let item = $state<Item>(null);
	let pos = $state(YOU);
	let snap = $state(true);
	let snoopHas = $state<'key' | 'padlock' | null>(null);
	let tag = $state('');
	let tagBad = $state(false);
	let snoopRead = $state(false);
	let friendKey = $state(false);
	let shut = $state(false);
	let friendOpen = $state(false);

	function reset() {
		item = null;
		snap = true;
		snoopHas = null;
		tag = '';
		tagBad = false;
		snoopRead = false;
		friendKey = false;
		shut = false;
		friendOpen = false;
	}

	function sharedSeq(): SeqStep[] {
		return [
			[
				120,
				() => {
					reset();
					item = 'key';
					pos = YOU;
				}
			],
			[1400, () => ((snap = false), (pos = MID))],
			[
				1300,
				() => {
					snoopHas = 'key';
					tag = tx.tags.copiedKey;
					tagBad = true;
				}
			],
			[1400, () => (pos = FRIEND)],
			[
				900,
				() => {
					friendKey = true;
					snap = true;
					item = 'box';
					shut = true;
					pos = YOU;
				}
			],
			[120, () => (snap = false)],
			[1400, () => (pos = MID)],
			[
				1700,
				() => {
					snoopRead = true;
					tag = tx.tags.read;
				}
			],
			[1400, () => (pos = FRIEND)],
			[3200, () => (friendOpen = true)]
		];
	}
	function padlockSeq(): SeqStep[] {
		return [
			[
				120,
				() => {
					reset();
					item = 'padlock';
					pos = FRIEND;
				}
			],
			[1400, () => ((snap = false), (pos = MID))],
			[
				1300,
				() => {
					snoopHas = 'padlock';
					tag = tx.tags.copiedLock;
				}
			],
			[1400, () => (pos = YOU)],
			[1000, () => (item = 'box')],
			[1100, () => (shut = true)],
			[1400, () => (pos = MID)],
			[
				1700,
				() => {
					tag = tx.tags.stuck;
					tagBad = false;
				}
			],
			[1400, () => (pos = FRIEND)],
			[3200, () => (friendOpen = true)]
		];
	}
	function roadStill(m: KeysMode) {
		reset();
		item = 'box';
		shut = true;
		pos = FRIEND;
		friendOpen = true;
		if (m === 'shared') {
			snoopHas = 'key';
			friendKey = true;
			snoopRead = true;
			tag = tx.tags.read;
			tagBad = true;
		} else {
			snoopHas = 'padlock';
			tag = tx.tags.stuck;
		}
	}

	// the small loops of the other scenes
	let symShut = $state(false);
	let symSide = $state<0 | 1>(0);
	let ruleOpen = $state(true);
	let ruleKey = $state(false);
	const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
	let trial = $state(0);

	function play(sc: Scene, m: KeysMode, still: boolean): (() => void) | undefined {
		if (sc === 'road') {
			if (still) {
				roadStill(m);
				return;
			}
			return runSeq(m === 'shared' ? sharedSeq() : padlockSeq(), true);
		}
		if (sc === 'sym') {
			if (still) {
				symShut = true;
				symSide = 0;
				return;
			}
			return runSeq(
				[
					[1200, () => ((symSide = 0), (symShut = false))],
					[1800, () => (symShut = true)],
					[1200, () => (symSide = 1)],
					[1800, () => (symShut = false)]
				],
				true
			);
		}
		if (sc === 'rule') {
			if (still) {
				ruleOpen = false;
				ruleKey = false;
				return;
			}
			return runSeq(
				[
					[1300, () => ((ruleOpen = true), (ruleKey = false))],
					[1800, () => (ruleOpen = false)],
					[900, () => (ruleKey = true)],
					[1800, () => (ruleOpen = true)]
				],
				true
			);
		}
		if (sc === 'rsa') {
			if (still) {
				trial = PRIMES.length - 1;
				return;
			}
			return runSeq(
				PRIMES.map((_, k): SeqStep => [k === PRIMES.length - 1 ? 3600 : 420, () => (trial = k)]),
				true
			);
		}
		return;
	}

	$effect(() => {
		const sc = sceneOf(step);
		const m = mode;
		const still = reduce;
		void runId;
		return untrack(() => play(sc, m, still));
	});

	const found = $derived(trial === PRIMES.length - 1);
	const CAESAR = [
		['H', 'K'],
		['E', 'H'],
		['L', 'O'],
		['L', 'O'],
		['O', 'R']
	];
	// Split a caption into two lines at the space nearest its middle, so a long one stays inside
	// the picture at the right edge.
	function twoLines(str: string): string[] {
		if (str.length <= 18) return [str];
		const mid = str.length / 2;
		let best = -1;
		for (let k = 0; k < str.length; k++)
			if (str[k] === ' ' && (best < 0 || Math.abs(k - mid) < Math.abs(best - mid))) best = k;
		return best < 0 ? [str] : [str.slice(0, best), str.slice(best + 1)];
	}
</script>

{#snippet road()}
	<svg
		viewBox="0 0 360 230"
		class="art"
		role="img"
		aria-label="{tx.youLabel}, {tx.friendLabel}, {tx.snooperLabel}"
	>
		<line x1="66" y1="64" x2="294" y2="64" class="road" />
		<line x1={MID} y1="68" x2={MID} y2="128" class="tap" />

		<Person x={YOU} y={70} label={tx.youLabel} />
		<Person x={FRIEND} y={70} label={tx.friendLabel} tone="var(--color-grass)" />
		<Person x={MID} y={164} label={tx.snooperLabel} sneaky />

		<!-- what each side holds -->
		{#if mode === 'shared'}
			<Key x={YOU + 2} y={22} />
			{#if friendKey}<g in:fade={{ duration: 200 }}><Key x={FRIEND - 2} y={22} /></g>{/if}
		{:else}
			<Key x={FRIEND - 2} y={22} tone="var(--color-grass)" />
			<text x={FRIEND} y="10" class="tiny">{tx.privateKey}</text>
		{/if}

		<!-- the eavesdropper's copy and what came of it -->
		{#if snoopHas === 'key'}
			<g in:fade={{ duration: 200 }}><Key x={MID + 40} y={150} /></g>
		{:else if snoopHas === 'padlock'}
			<g in:fade={{ duration: 200 }}><Padlock x={MID + 40} y={150} open /></g>
		{/if}
		{#if tag}
			<text x={MID - 30} y="142" class="tag" class:bad={tagBad} text-anchor="end">{tag}</text>
		{/if}
		{#if snoopRead}
			<g in:fade={{ duration: 200 }}>
				<rect x={MID + 12} y="96" width="84" height="22" rx="6" class="note bad" />
				<text x={MID + 54} y="111" class="note-text">{tx.message}</text>
			</g>
		{/if}
		{#if friendOpen}
			<g in:fade={{ duration: 200 }}>
				<rect x={FRIEND - 120} y="8" width="84" height="22" rx="6" class="note" />
				<text x={FRIEND - 78} y="23" class="note-text">{tx.message}</text>
			</g>
		{/if}

		<!-- the thing travelling down the road -->
		{#if item}
			<g class="mover" class:snap={snap || reduce} style="transform: translate({pos}px, 50px)">
				{#if item === 'key'}
					<Key x={0} y={0} />
				{:else if item === 'padlock'}
					<Padlock x={0} y={0} open />
				{:else}
					<rect x="-18" y="-10" width="36" height="24" rx="4" class="box" />
					<line x1="-18" y1="-2" x2="18" y2="-2" class="box-line" />
					<Padlock
						x={0}
						y={0}
						size={0.75}
						open={!shut || friendOpen}
						tone={mode === 'shared' ? 'var(--color-amber)' : 'var(--color-brand)'}
					/>
				{/if}
			</g>
		{/if}
	</svg>
{/snippet}

{#snippet visual(i: number)}
	{@const sc = sceneOf(i)}
	<div class="vis">
		{#if i === last}
			<div class="modes" role="group" aria-label={tx.modes.label}>
				<span class="cap">{tx.modes.label}</span>
				<div class="chips">
					<button
						type="button"
						class="chip"
						class:on={choice === 'shared'}
						onclick={() => pick('shared')}>{tx.modes.shared}</button
					>
					<button
						type="button"
						class="chip"
						class:on={choice === 'padlock'}
						onclick={() => pick('padlock')}>{tx.modes.padlock}</button
					>
				</div>
			</div>
		{/if}

		{#key sc === 'road' ? 'road' : i}
			<div class="scene" in:fade={{ duration: reduce ? 0 : 260 }}>
				{#if sc === 'caesar'}
					<svg viewBox="0 0 360 230" class="art" role="img" aria-label="HELLO, KHOOR">
						<rect x="56" y="30" width="248" height="170" rx="10" class="parch" />
						<text x="180" y="60" class="year">A → D, B → E</text>
						{#each CAESAR as [a, b], k (k)}
							<text x={100 + k * 40} y="104" class="big">{a}</text>
							<text x={100 + k * 40} y="132" class="shift">+3</text>
							<text
								x={100 + k * 40}
								y="172"
								class="big brand reveal"
								style="animation-delay:{k * 0.45}s">{b}</text
							>
						{/each}
					</svg>
				{:else if sc === 'sym'}
					<svg viewBox="0 0 360 230" class="art" role="img" aria-label={tx.sharedKey}>
						<Person x={50} y={120} label={tx.youLabel} />
						<Person x={310} y={120} label={tx.friendLabel} tone="var(--color-grass)" />
						<circle cx="100" cy="92" r="20" class="halo" class:on={symSide === 0} />
						<circle cx="260" cy="92" r="20" class="halo" class:on={symSide === 1} />
						<Key x={100} y={92} />
						<Key x={260} y={92} />
						<rect x="148" y="104" width="64" height="44" rx="6" class="box" />
						<line x1="148" y1="118" x2="212" y2="118" class="box-line" />
						<Padlock x={180} y={124} open={!symShut} tone="var(--color-amber)" />
						<text x="180" y="190" class="caption">{tx.sharedKey}</text>
					</svg>
				{:else if sc === 'enigma'}
					<div class="with-photo">
						<!-- the real machine (public domain photo), next to the man who helped break it -->
						<figure class="frame wide">
							<img
								src="/images/people/enigma.jpg"
								alt={tx.enigma.alt}
								width="500"
								height="667"
								loading="lazy"
								decoding="async"
							/>
							<figcaption>{tx.enigma.caption}</figcaption>
						</figure>
						<figure class="frame">
							<img
								src="/images/people/alan-turing.jpg"
								alt={tx.turing.alt}
								width="500"
								height="681"
								loading="lazy"
								decoding="async"
							/>
							<figcaption>{tx.turing.caption}</figcaption>
						</figure>
					</div>
				{:else if sc === 'road'}
					{@render road()}
				{:else if sc === 'split'}
					<svg
						viewBox="0 0 360 230"
						class="art"
						role="img"
						aria-label="{tx.publicKey}, {tx.privateKey}"
					>
						<text x="180" y="40" class="year">1976</text>
						<g class="whole"><Key x={180} y={110} size={1.6} /></g>
						<g class="half left"><Padlock x={110} y={110} size={1.8} open /></g>
						<g class="half right"><Key x={250} y={110} size={1.6} tone="var(--color-grass)" /></g>
						<text x="110" y="170" class="caption">{tx.publicKey}</text>
						<text x="250" y="170" class="caption">{tx.privateKey}</text>
					</svg>
				{:else if sc === 'rule'}
					<svg
						viewBox="0 0 360 230"
						class="art"
						role="img"
						aria-label="{tx.rule.anyone}, {tx.rule.only}"
					>
						<Person x={40} y={110} tone="var(--color-brand)" />
						<Person x={78} y={124} tone="var(--color-amber)" />
						<Person x={116} y={110} tone="var(--color-muted)" />
						<Padlock x={190} y={112} size={2.6} open={ruleOpen} />
						<g class="slide" class:near={ruleKey && !reduce}>
							<Key x={300} y={124} size={1.7} tone="var(--color-grass)" />
						</g>
						<text x="78" y="186" class="caption">{tx.rule.anyone}</text>
						<text x="296" y="186" class="caption">
							{#each twoLines(tx.rule.only) as ln, k (k)}
								<tspan x="296" dy={k ? 15 : 0}>{ln}</tspan>
							{/each}
						</text>
					</svg>
				{:else if sc === 'rsa'}
					<svg viewBox="0 0 360 230" class="art" role="img" aria-label="61 × 53 = 3233">
						<text x="180" y="62" class="big mono">61 × 53 = 3233</text>
						<text x="180" y="86" class="caption good">{tx.rsa.easy}</text>
						<line x1="80" y1="108" x2="280" y2="108" class="ln faint" />
						<text x="180" y="150" class="big mono">
							3233 ÷ {PRIMES[trial]}
							<tspan class={found ? 'good' : 'bad'}>{found ? '= 61 ✓' : '✗'}</tspan>
						</text>
						<text x="180" y="176" class="caption"
							>{tx.rsa.tries.replace('{n}', String(trial + 1))}</text
						>
						<text x="180" y="204" class="caption warn">{tx.rsa.hard}</text>
					</svg>
				{:else}
					<svg viewBox="0 0 360 230" class="art" role="img" aria-label="1973, 1997">
						<path d="M120 62 H160 L170 72 H240 V156 H120 Z" class="folder" />
						<g transform="rotate(-10 180 112)">
							<rect x="134" y="98" width="92" height="28" rx="4" class="stamp" />
							<text x="180" y="117" class="stamp-text">{tx.secret}</text>
						</g>
						<line x1="70" y1="196" x2="290" y2="196" class="road" />
						<line x1="70" y1="196" x2="290" y2="196" class="road lit" />
						<circle cx="70" cy="196" r="6" class="dot" />
						<circle cx="290" cy="196" r="6" class="dot" />
						<text x="70" y="220" class="year small">1973</text>
						<text x="290" y="220" class="year small">1997</text>
						<Padlock x={180} y={186} size={0.8} tone="var(--color-danger)" />
					</svg>
				{/if}
			</div>
		{/key}
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
		display: flex;
		width: 100%;
		justify-content: center;
	}
	.art {
		width: 100%;
		max-width: 420px;
		height: auto;
		overflow: visible;
	}
	.with-photo {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	.frame {
		margin: 0;
		width: 100px;
		flex: none;
		transform: rotate(2.5deg);
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		padding: 5px 5px 6px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.12);
	}
	.frame.wide {
		width: 150px;
		transform: rotate(-2deg);
	}
	.frame img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 3px;
		filter: grayscale(0.15);
	}
	figcaption {
		margin-top: 4px;
		font-size: 9.5px;
		line-height: 1.3;
		text-align: center;
		color: var(--color-muted);
	}
	@media (max-width: 767px) {
		.frame {
			width: 80px;
		}
		.frame.wide {
			width: 116px;
		}
	}

	.modes {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover {
		border-color: var(--color-brand);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}

	/* drawing */
	.road {
		stroke: var(--color-line);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.road.lit {
		stroke: var(--color-danger);
		opacity: 0.35;
	}
	.tap {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.ln {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.ln.faint {
		stroke: var(--color-line);
	}
	.mover {
		transition: transform 1.3s ease-in-out;
	}
	.mover.snap {
		transition: none;
	}
	.box {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.box-line {
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.note {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.5;
	}
	.note.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.note-text {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-ink);
		text-anchor: middle;
	}
	.tag {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.tag.bad {
		fill: var(--color-danger);
	}
	.tiny {
		font-size: 9.5px;
		font-weight: 700;
		fill: var(--color-grass);
		text-anchor: middle;
	}
	.caption {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.caption.good,
	.good {
		fill: var(--color-grass);
	}
	.bad {
		fill: var(--color-danger);
	}
	.caption.warn {
		fill: var(--color-amber);
	}
	.year {
		font-size: 14px;
		font-weight: 700;
		fill: var(--color-faint);
		text-anchor: middle;
		font-family: var(--font-mono, ui-monospace, monospace);
	}
	.year.small {
		font-size: 12px;
	}
	.parch {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.big {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 26px;
		font-weight: 700;
		fill: var(--color-ink);
		text-anchor: middle;
	}
	.big.mono {
		font-size: 22px;
	}
	.big.brand {
		fill: var(--color-brand);
	}
	.shift {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-amber);
		text-anchor: middle;
	}
	.halo {
		fill: var(--color-amber-soft);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.halo.on {
		opacity: 1;
	}
	.slide {
		transition: transform 0.8s ease;
	}
	.slide.near {
		transform: translateX(-58px);
	}
	.folder {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.stamp {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2.5;
	}
	.stamp-text {
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.12em;
		fill: var(--color-danger);
		text-anchor: middle;
	}
	.dot {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}

	@media (prefers-reduced-motion: no-preference) {
		.reveal {
			opacity: 0;
			animation: reveal 5s ease infinite;
		}
		.whole {
			animation: whole 5s ease-in-out infinite;
		}
		.half.left {
			animation: left 5s ease-in-out infinite;
		}
		.half.right {
			animation: right 5s ease-in-out infinite;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.whole {
			opacity: 0;
		}
		.halo,
		.slide {
			transition: none;
		}
	}
	@keyframes reveal {
		0%,
		10% {
			opacity: 0;
		}
		25%,
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes lamp {
		0%,
		70%,
		100% {
			fill: var(--color-line);
		}
		80% {
			fill: var(--color-amber);
		}
	}
	@keyframes whole {
		0%,
		25% {
			opacity: 1;
		}
		40%,
		90% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
	@keyframes left {
		0%,
		25% {
			opacity: 0;
			transform: translateX(70px);
		}
		45%,
		90% {
			opacity: 1;
			transform: translateX(0);
		}
		100% {
			opacity: 0;
			transform: translateX(70px);
		}
	}
	@keyframes right {
		0%,
		25% {
			opacity: 0;
			transform: translateX(-70px);
		}
		45%,
		90% {
			opacity: 1;
			transform: translateX(0);
		}
		100% {
			opacity: 0;
			transform: translateX(-70px);
		}
	}
</style>
