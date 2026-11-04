<script lang="ts">
	// Guided hashing. A kitchen blender sits on the left the whole time. Each beat plays by itself
	// on the right, a plain text database that leaks, a password dropping into the blender and a
	// real SHA256 jumble pouring out, the smoothie that cannot be unblended, a login that compares
	// jumbles, an attacker's lookup table finding a match, and salt making that table useless.
	// On the last beat the learner may type a password and watch the blender work.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HashingText } from '$lib/chapters/security/hashing/types';
	import GuideWrap from './secbasics/GuideWrap.svelte';
	import { startGuided } from './secbasics/guided.svelte';
	import { sha256 } from './secbasics/sha256';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HashingText);
	startGuided(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const last = $derived(tx.steps.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	type Scene =
		| 'store'
		| 'plain'
		| 'blend'
		| 'same'
		| 'ingat'
		| 'login'
		| 'lookup'
		| 'salt'
		| 'slow'
		| 'try';
	const SCENES: Scene[] = [
		'store',
		'plain',
		'blend',
		'same',
		'ingat',
		'login',
		'lookup',
		'salt',
		'slow',
		'try'
	];
	const scene = $derived(SCENES[active] ?? 'blend');

	type Phase = 'idle' | 'drop' | 'spin' | 'out';
	let phase = $state<Phase>('idle');
	let input = $state('');
	let scan = $state(-1);
	let salted = $state(false);
	let shake = $state(false);
	let mine = $state('');
	let told = false;
	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	/** One full blend, the note drops in, the blades spin, the jumble pours out. */
	function blend(pw: string, spinMs: number, hold: number): SeqStep[] {
		return [
			[
				800,
				() => {
					input = pw;
					phase = 'idle';
				}
			],
			[900, () => (phase = 'drop')],
			[spinMs, () => (phase = 'spin')],
			[hold, () => (phase = 'out')]
		];
	}

	function play(sc: Scene, ex: [string, string], still: boolean, typed: string) {
		scan = -1;
		salted = false;
		shake = false;
		input = ex[0];
		if (sc === 'store' || sc === 'plain') {
			phase = 'idle';
			return;
		}
		if (sc === 'try') {
			input = typed;
			if (!typed) {
				phase = 'idle';
				return;
			}
			if (still) {
				phase = 'out';
				return;
			}
			return runSeq([
				[520, () => (phase = 'spin')],
				[0, () => (phase = 'out')]
			]);
		}
		if (still || sc === 'ingat') {
			phase = 'out';
			if (sc === 'lookup') scan = 2;
			if (sc === 'salt') salted = true;
			return;
		}
		if (sc === 'lookup') {
			phase = 'out';
			return runSeq(
				[
					[900, () => (scan = -1)],
					[800, () => (scan = 0)],
					[800, () => (scan = 1)],
					[3400, () => (scan = 2)]
				],
				true
			);
		}
		if (sc === 'salt') {
			phase = 'out';
			return runSeq(
				[
					[
						2800,
						() => {
							salted = false;
							shake = false;
						}
					],
					[1300, () => (shake = true)],
					[
						3800,
						() => {
							shake = false;
							salted = true;
						}
					]
				],
				true
			);
		}
		if (sc === 'same')
			return runSeq([...blend(ex[0], 1300, 2800), ...blend(ex[1], 1300, 2800)], true);
		if (sc === 'slow') return runSeq(blend(ex[0], 3800, 2600), true);
		if (sc === 'login') return runSeq(blend(ex[0], 1200, 3200), true);
		return runSeq(blend(ex[0], 1600, 3200), true);
	}

	$effect(() => {
		const sc = scene;
		const ex = tx.examples;
		const still = reduce;
		const typed = sc === 'try' ? mine : '';
		return untrack(() => play(sc, ex, still, typed));
	});

	function onType() {
		if (!told && mine.length >= 4) {
			told = true;
			onstate?.('typed');
		}
	}

	const hash = $derived(input ? sha256(input) : '');
	const shown = $derived(input.length > 14 ? `${input.slice(0, 13)}…` : input);
	const cut = (h: string, n: number) => `${h.slice(0, n)}…`;

	const LOOK = ['password', 'qwerty', '123456', 'iloveyou'];
	const LOOK_HASH = LOOK.map((p) => sha256(p));
	const PLAIN = sha256('123456');
	const SALTS = ['x7Qa', 'pL2m'];
	const SALTED = SALTS.map((s) => sha256(s + '123456'));

	const spinning = $derived(phase === 'spin');
	const full = $derived(phase === 'spin' || phase === 'out');
	const hashCard = $derived(
		scene === 'blend' || scene === 'same' || scene === 'slow' || scene === 'try'
	);
</script>

{#snippet visual(s: number)}
	<div class="vis">
		{#if s === last}
			<label class="try">
				<span>{tx.tryLabel}</span>
				<input
					type="text"
					autocomplete="off"
					autocapitalize="off"
					spellcheck="false"
					maxlength="40"
					placeholder={tx.tryPlaceholder}
					bind:value={mine}
					oninput={onType}
				/>
			</label>
		{/if}

		<svg viewBox="0 0 400 236" class="scene" role="img" aria-label={tx.title}>
			<!-- the blender, always on the left -->
			<g class="blender" class:dim={scene === 'store' || scene === 'plain'}>
				<g transform="translate(80 22)">
					<g
						class="note"
						class:gone={phase === 'drop' || phase === 'spin'}
						class:move={phase === 'drop'}
						class:empty={!input}
					>
						<rect x="-54" y="-14" width="108" height="28" rx="8" class="note-card" />
						<text y="4" class="note-text">{shown || '…'}</text>
					</g>
				</g>

				<g class="jar" class:shaking={spinning && !reduce}>
					<rect x="40" y="48" width="80" height="9" rx="4" class="lid" />
					<path d="M44 57 H116 L108 150 H52 Z" class="glass" />
					<path
						d="M48 112 Q80 102 112 112 L108 150 H52 Z"
						class="juice"
						class:on={full}
						class:wobble={spinning && !reduce}
					/>
					<g transform="translate(80 140)">
						<g class="blades" class:spin={spinning && !reduce} class:slow={scene === 'slow'}>
							<ellipse rx="16" ry="2.6" class="blade" />
							<circle r="3" class="hub" />
						</g>
					</g>
				</g>
				<rect x="38" y="150" width="84" height="40" rx="9" class="base" />
				<circle cx="80" cy="170" r="7" class="knob" class:on={spinning} />

				{#if scene === 'salt'}
					<g transform="translate(140 64)">
						<g class="shaker" class:shake={shake && !reduce}>
							<rect x="-10" y="-14" width="20" height="26" rx="6" class="shaker-body" />
							<rect x="-8" y="-20" width="16" height="7" rx="3" class="shaker-cap" />
							<text y="4" class="shaker-s">S</text>
						</g>
						{#if shake || (reduce && salted)}
							{#each [0, 1, 2, 3] as k (k)}
								<circle
									cx={-14 - k * 4}
									cy={18 + k * 3}
									r="1.8"
									class="grain"
									style="animation-delay:{k * 0.18}s"
								/>
							{/each}
						{/if}
					</g>
				{/if}

				<path
					d="M124 170 H150 M144 164 L150 170 L144 176"
					class="arrow"
					class:on={phase === 'out'}
				/>
			</g>

			<!-- the right side follows the beat -->
			{#if scene === 'store' || scene === 'plain'}
				<text x="160" y="40" class="cap">{tx.dbTitle}</text>
				<rect
					x="160"
					y="50"
					width="236"
					height="104"
					rx="12"
					class="card"
					class:leak={scene === 'plain'}
				/>
				<text x="176" y="74" class="th">{tx.colUser}</text>
				<text x="262" y="74" class="th">{tx.colPassword}</text>
				<line x1="170" y1="84" x2="386" y2="84" class="rule" />
				{#each tx.users as u, k (u)}
					<text x="176" y={108 + k * 28} class="td">{u}</text>
					{#if scene === 'store'}
						<text x="262" y={108 + k * 28} class="td q">?</text>
					{:else}
						<text x="262" y={108 + k * 28} class="mono bad"
							>{k === 0 ? tx.examples[0] : '123456'}</text
						>
					{/if}
				{/each}
				{#if scene === 'plain'}
					<g transform="translate(330 172) rotate(-6)">
						<g class="stamp">
							<rect x="-46" y="-14" width="92" height="28" rx="6" />
							<text y="5">{tx.leakedTag}</text>
						</g>
					</g>
				{/if}
			{:else if hashCard}
				<rect x="160" y="52" width="236" height="86" rx="12" class="card" />
				<text x="176" y="74" class="th">{tx.hashLabel}</text>
				{#if phase === 'out' && hash}
					<text x="176" y="98" class="mono hash">{hash.slice(0, 32)}</text>
					<text x="176" y="116" class="mono hash">{hash.slice(32)}</text>
				{:else}
					<rect x="176" y="90" width="180" height="7" rx="3.5" class="bar" />
					<rect x="176" y="108" width="150" height="7" rx="3.5" class="bar" />
				{/if}
				{#if scene === 'slow'}
					<g class="pill amber">
						<rect x="160" y="152" width="140" height="24" rx="12" />
						<text x="230" y="168">bcrypt, {tx.slowTag}</text>
					</g>
				{/if}
			{:else if scene === 'ingat'}
				<path d="M226 68 Q190 14 132 40" class="back" />
				<path d="M140 32 L132 40 L142 46" class="back" />
				<g class="nope">
					<path d="M174 26 L194 46 M194 26 L174 46" />
				</g>
				<text x="184" y="68" class="cap center">{tx.noWayBack}</text>
				<path d="M236 72 H300 L290 172 H246 Z" class="glass" />
				<path d="M239 100 H297 L290 172 H246 Z" class="juice on" />
				<line x1="282" y1="54" x2="270" y2="150" class="straw" />
				<rect x="236" y="68" width="64" height="6" rx="3" class="rim" />
			{:else if scene === 'login'}
				<text x="160" y="56" class="cap">{tx.savedLabel}</text>
				<rect x="160" y="62" width="236" height="28" rx="9" class="card" />
				<text x="172" y="80" class="mono hash">{cut(sha256(tx.examples[0]), 30)}</text>
				<text x="160" y="118" class="cap">{tx.typedLabel}</text>
				<rect
					x="160"
					y="124"
					width="236"
					height="28"
					rx="9"
					class="card"
					class:ok={phase === 'out'}
				/>
				{#if phase === 'out'}
					<text x="172" y="142" class="mono hash">{cut(hash, 30)}</text>
					<g class="pill grass">
						<rect x="160" y="168" width="170" height="26" rx="13" />
						<path d="M174 181 l5 5 l9 -10" class="tick" />
						<text x="252" y="185">{tx.matchTag}</text>
					</g>
				{:else}
					<rect x="172" y="134" width="170" height="7" rx="3.5" class="bar" />
				{/if}
			{:else if scene === 'lookup'}
				<text x="160" y="24" class="cap">{tx.leakedHashLabel}</text>
				<rect x="160" y="30" width="236" height="26" rx="9" class="card leak" />
				<text x="172" y="47" class="mono bad">{cut(PLAIN, 30)}</text>
				<text x="160" y="80" class="cap">{tx.tableTitle}</text>
				{#each LOOK as p, k (p)}
					<g class="row" class:lit={scan === k} class:hit={scan === 2 && k === 2}>
						<rect x="160" y={88 + k * 26} width="236" height="22" rx="7" />
						<text x="172" y={103 + k * 26} class="mono">{p}</text>
						<text x="246" y={103 + k * 26} class="mono dim-t">{cut(LOOK_HASH[k], 22)}</text>
					</g>
				{/each}
				{#if scan === 2}
					<g class="pill danger">
						<rect x="160" y="200" width="150" height="26" rx="13" />
						<text x="235" y="217">123456, {tx.crackedTag}</text>
					</g>
				{/if}
			{:else if scene === 'salt'}
				{#each tx.users as u, k (u)}
					{@const y = 30 + k * 72}
					<text x="160" y={y + 14} class="td strong">{u}</text>
					<text x="206" y={y + 14} class="mono">123456</text>
					{#if salted}
						<g class="saltchip">
							<rect x="262" y={y + 1} width="76" height="18" rx="9" />
							<text x="300" y={y + 14}>{tx.saltLabel} {SALTS[k]}</text>
						</g>
					{/if}
					<rect
						x="160"
						y={y + 24}
						width="236"
						height="26"
						rx="9"
						class="card"
						class:leak={!salted}
						class:ok={salted}
					/>
					<text x="172" y={y + 41} class="mono" class:bad={!salted} class:good={salted}
						>{cut(salted ? SALTED[k] : PLAIN, 30)}</text
					>
				{/each}
				<g class="pill" class:danger={!salted} class:grass={salted}>
					<rect x="160" y="182" width="170" height="26" rx="13" />
					<text x="245" y="199">{salted ? tx.noMatchTag : tx.sameTag}</text>
				</g>
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
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 420px;
		height: auto;
		overflow: visible;
	}
	.try {
		display: flex;
		width: min(100%, 300px);
		flex-direction: column;
		gap: 4px;
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.try input {
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 9px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 14px;
		letter-spacing: normal;
		text-transform: none;
		color: var(--color-ink);
		outline: none;
	}
	.try input:focus {
		border-color: var(--color-brand);
	}

	/* the blender */
	.blender {
		transition: opacity 0.4s;
	}
	.blender.dim {
		opacity: 0.3;
	}
	.note {
		transition: opacity 0.4s;
	}
	.note.move {
		transition:
			transform 0.8s ease-in,
			opacity 0.8s ease-in;
	}
	.note.gone {
		opacity: 0;
		transform: translateY(70px) scale(0.5);
	}
	.note-card {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.note-text {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-brand);
	}
	.note.empty .note-text {
		fill: var(--color-faint);
	}
	.lid {
		fill: var(--color-muted);
	}
	.glass {
		fill: var(--color-brand-soft);
		fill-opacity: 0.55;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.juice {
		fill: var(--color-amber);
		opacity: 0;
		transition: opacity 0.5s;
	}
	.juice.on {
		opacity: 0.85;
	}
	.blade {
		fill: var(--color-muted);
	}
	.hub {
		fill: var(--color-ink);
	}
	.base {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.knob {
		fill: var(--color-card);
		transition: fill 0.3s;
	}
	.knob.on {
		fill: var(--color-grass);
	}
	.arrow {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: stroke 0.3s;
	}
	.arrow.on {
		stroke: var(--color-brand);
	}
	.shaker-body {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.6;
	}
	.shaker-cap {
		fill: var(--color-muted);
	}
	.shaker-s {
		font-size: 10px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.grain {
		fill: var(--color-amber);
	}

	/* the right side */
	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.3s,
			fill 0.3s;
	}
	.card.leak {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.card.ok {
		stroke: var(--color-grass);
		fill: var(--color-grass-soft);
	}
	.cap {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.cap.center {
		text-anchor: middle;
	}
	.th {
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.td {
		font-size: 12px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.td.strong {
		font-weight: 800;
	}
	.td.q {
		fill: var(--color-faint);
		font-size: 15px;
	}
	.rule {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.mono.hash {
		font-size: 9.4px;
		fill: var(--color-brand);
	}
	.mono.bad {
		fill: var(--color-danger);
	}
	.mono.good {
		fill: var(--color-grass);
	}
	.mono.dim-t {
		font-size: 9px;
		fill: var(--color-faint);
	}
	.bar {
		fill: var(--color-line);
	}
	.stamp rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.stamp text {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-anchor: middle;
		fill: var(--color-danger);
	}
	.pill text {
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.pill.amber rect {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.pill.amber text {
		fill: var(--color-ink);
	}
	.pill.grass rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.pill.grass text {
		fill: var(--color-grass);
	}
	.pill.danger rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.pill.danger text {
		fill: var(--color-danger);
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.back {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.nope path {
		stroke: var(--color-danger);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.straw {
		stroke: var(--color-danger);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.rim {
		fill: var(--color-line);
	}
	.row rect {
		fill: var(--color-card);
		stroke: var(--color-line);
		transition:
			fill 0.25s,
			stroke 0.25s;
	}
	.row.lit rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.row.hit rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.saltchip rect {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.saltchip text {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
	}

	@media (prefers-reduced-motion: no-preference) {
		.blades.spin {
			animation: blades 0.18s linear infinite;
		}
		.blades.spin.slow {
			animation-duration: 0.6s;
		}
		.jar.shaking {
			animation: jiggle 0.22s ease-in-out infinite alternate;
		}
		.juice.wobble {
			animation: wobble 0.5s ease-in-out infinite alternate;
		}
		.shaker.shake {
			animation: shake 0.3s ease-in-out infinite alternate;
		}
		.grain {
			animation: fall 0.9s ease-in infinite;
		}
		.stamp {
			animation: pop 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
		}
		.nope {
			animation: pulse 2.4s ease-in-out infinite;
		}
	}
	@keyframes blades {
		from {
			transform: scaleX(1);
		}
		50% {
			transform: scaleX(-1);
		}
		to {
			transform: scaleX(1);
		}
	}
	@keyframes jiggle {
		from {
			transform: translateX(-1px);
		}
		to {
			transform: translateX(1px);
		}
	}
	@keyframes wobble {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-3px);
		}
	}
	@keyframes shake {
		from {
			transform: rotate(-150deg);
		}
		to {
			transform: rotate(-120deg);
		}
	}
	@keyframes fall {
		from {
			transform: translate(0, 0);
			opacity: 1;
		}
		to {
			transform: translate(-10px, 30px);
			opacity: 0;
		}
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(1.4);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.4;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.blender,
		.note,
		.note.move,
		.juice,
		.knob,
		.arrow,
		.card,
		.row rect {
			transition: none;
		}
	}
</style>
