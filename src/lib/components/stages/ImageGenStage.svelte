<script lang="ts">
	// A guided "watch" stage. An image generator app, a prompt bar on top and a 16 by 16 canvas
	// of coloured dots underneath. The beats play the story by themselves, a prompt is typed and a
	// picture appears, the canvas turns to static, a training photo gets noise sprinkled on, then
	// the noise cleans itself step by step (rough shapes first, details last) while the prompt
	// steers. The only optional play is picking another prompt on the last beat.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ImageGenText } from '$lib/chapters/ai/image-gen/types';
	import { sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ImageGenText);

	type Scene =
		| 'magic'
		| 'noise'
		| 'train'
		| 'shapes'
		| 'details'
		| 'prompt'
		| 'remember'
		| 'seed'
		| 'try';
	const SCENES: Scene[] = [
		'magic',
		'noise',
		'train',
		'shapes',
		'details',
		'prompt',
		'remember',
		'seed',
		'try'
	];

	let peek = $state<number | null>(null);
	let tryPrompt = $state(0);

	const fromBeat = $derived(Math.min(beat, SCENES.length - 1));
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, tryPrompt]);
	const t = $derived(clock.t);
	const live = $derived(t < 1e8);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const N = 16; // the canvas is N by N dots
	const TOTAL = 10; // cleaning steps
	const CELL = 15;
	const X0 = 60;
	const Y0 = 66;

	// ---- the finished pictures, one per prompt, drawn as pixel maps ----
	// Each letter is a colour role; the palette below turns roles into theme tokens.
	const PICTURES: string[][] = [
		[
			'................',
			'..........ss....',
			'.........ssss...',
			'..cc.....ssss...',
			'.cccc.....ss....',
			'cccccc..........',
			'.cccc...........',
			'......m.........',
			'.....mmm....m...',
			'....mwwmm..mmm..',
			'...mmmmmmmmwmmm.',
			'..mmmmmmmmmmmmmm',
			'.mmmmmmmmmmmmmmm',
			'gggggggggggggggg',
			'gggggggggggggggg',
			'gggggggggggggggg'
		],
		[
			'................',
			'...k........k...',
			'...kk......kk...',
			'...kkkkkkkkkk...',
			'..kkkkkkkkkkkk..',
			'..kkeekkkkeekk..',
			'..kkkkknnkkkkk..',
			'..kkkkkkkkkkkk..',
			'...kkkkkkkkkk...',
			'....kkkkkkkk....',
			'...kkkkkkkkkk..k',
			'..kkkkkkkkkkkk.k',
			'..kkkkkkkkkkkkkk',
			'..kkkkkkkkkkkk..',
			'gggggggggggggggg',
			'gggggggggggggggg'
		],
		[
			'................',
			'.ss.............',
			'.ss........cc...',
			'..........cccc..',
			'.......r........',
			'......rrr.......',
			'.....rrrrr......',
			'....rrrrrrr.....',
			'...rrrrrrrrr....',
			'....hhhhhhh.....',
			'....hbbhhhh.....',
			'....hbbhddh.....',
			'....hhhhddh.....',
			'....hhhhddh.....',
			'gggggggggggggggg',
			'gggggggggggggggg'
		]
	];
	// Roles to theme tokens. Each seed picks one of three looks, so fresh noise changes the result.
	const BASE: Record<string, string> = {
		c: 'card',
		s: 'amber',
		w: 'card',
		g: 'grass',
		e: 'ink',
		n: 'danger',
		h: 'amber-soft',
		b: 'brand',
		d: 'ink'
	};
	const LOOKS: Record<string, string>[] = [
		{ '.': 'brand-soft', m: 'muted', k: 'amber', r: 'danger' },
		{ '.': 'amber-soft', m: 'faint', k: 'muted', r: 'brand', s: 'danger' },
		{ '.': 'paper', m: 'ink', k: 'faint', r: 'grass', c: 'line' }
	];
	const NOISE_TOKENS = [
		'brand',
		'grass',
		'amber',
		'danger',
		'muted',
		'faint',
		'ink',
		'line',
		'card'
	];

	// a tiny seeded random generator, so the server and the browser draw the same noise
	function rng(seed: number) {
		let a = seed >>> 0;
		return () => {
			a = (a + 0x6d2b79f5) >>> 0;
			let r = a;
			r = Math.imul(r ^ (r >>> 15), r | 1);
			r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
			return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
		};
	}
	function noiseOf(seed: number): string[] {
		const r = rng(seed * 9973 + 11);
		return Array.from({ length: N * N }, () => {
			const tok = NOISE_TOKENS[Math.floor(r() * NOISE_TOKENS.length)];
			const p = 25 + Math.floor(r() * 70);
			return `color-mix(in srgb, var(--color-${tok}) ${p}%, var(--color-paper))`;
		});
	}
	// Early steps only know the rough layout, so each dot takes the most common role of its block.
	function targetOf(prompt: number, step: number): string[] {
		const rows = PICTURES[prompt];
		const b = step <= 2 ? 8 : step <= 4 ? 4 : step <= 6 ? 2 : 1;
		const out: string[] = new Array(N * N);
		for (let by = 0; by < N; by += b) {
			for (let bx = 0; bx < N; bx += b) {
				const tally = new Map<string, number>();
				for (let y = by; y < by + b; y++)
					for (let x = bx; x < bx + b; x++) {
						const k = rows[y][x];
						tally.set(k, (tally.get(k) ?? 0) + 1);
					}
				let best = '.';
				let most = -1;
				for (const [k, v] of tally)
					if (v > most) {
						best = k;
						most = v;
					}
				for (let y = by; y < by + b; y++) for (let x = bx; x < bx + b; x++) out[y * N + x] = best;
			}
		}
		return out;
	}
	function pixels(prompt: number, seed: number, step: number): string[] {
		const noise = noiseOf(seed);
		if (step <= 0) return noise;
		const look = LOOKS[seed % LOOKS.length];
		const target = targetOf(prompt, step);
		const clarity = Math.round(100 * (1 - Math.pow(1 - step / TOTAL, 1.5)));
		return noise.map(
			(n, i) =>
				`color-mix(in srgb, var(--color-${look[target[i]] ?? BASE[target[i]] ?? 'paper'}) ${clarity}%, ${n})`
		);
	}

	/** Counts steps from `a` to `b`, one every `ms`, then holds for `hold`, looping unless reduced. */
	function ramp(time: number, a: number, b: number, ms: number, hold: number, loop = true): number {
		const n = Math.abs(b - a);
		const x = loop && time < 1e8 ? time % (n * ms + hold) : time;
		const k = Math.max(0, Math.min(n, Math.floor(x / ms)));
		return a < b ? a + k : a - k;
	}

	const SEED = 9;
	const promptIdx = $derived(scene === 'train' ? 2 : scene === 'try' ? tryPrompt : 0);
	const seedCycle = $derived(live ? Math.floor(t / 4200) % 3 : 0);
	const seed = $derived(
		scene === 'noise' && live
			? SEED + Math.floor(t / 260)
			: scene === 'seed'
				? SEED + seedCycle
				: SEED
	);

	// how far the prompt is typed in the first scene, and when the picture starts
	const typed = $derived(scene === 'magic' ? Math.max(0, Math.floor((t - 200) / 45)) : 1e9);
	const pressed = $derived(scene === 'magic' && live && t > 1700 && t < 2000);
	const blank = $derived(scene === 'magic' && t < 2000);

	const step = $derived.by(() => {
		switch (scene) {
			case 'magic':
				return ramp(t - 2000, 0, TOTAL, 160, 0, false);
			case 'noise':
				return 0;
			case 'train': {
				if (!live) return 3;
				const x = t % 6200;
				return x < 1200 ? TOTAL : ramp(x - 1200, TOTAL, 0, 350, 1500, false);
			}
			case 'shapes':
				return ramp(t, 0, 6, 700, 2600);
			case 'details':
				return ramp(t, 6, TOTAL, 900, 2600);
			case 'prompt':
				return ramp(t, 0, TOTAL, 450, 2200);
			case 'seed':
				return live ? ramp(t % 4200, 0, TOTAL, 250, 0, false) : TOTAL;
			case 'try':
				return ramp(t, 0, TOTAL, 380, 0, false);
			default:
				return TOTAL;
		}
	});
	const cells = $derived(blank ? null : pixels(promptIdx, seed, step));

	const caption = $derived(
		scene === 'remember'
			? tx.memo
			: scene === 'train'
				? tx.trainCaption
				: scene === 'seed'
					? tx.seedLabel.replace('{n}', String(seed))
					: blank
						? ''
						: step === 0
							? tx.noiseCaption
							: step <= 6
								? tx.shapesCaption
								: tx.detailsCaption
	);
	const stepText = $derived(
		tx.stepLabel.replace('{n}', String(step)).replace('{total}', String(TOTAL))
	);
	const promptText = $derived(scene === 'train' ? '' : tx.prompts[promptIdx].slice(0, typed));
	const caret = $derived(scene === 'magic' && live && typed < tx.prompts[0].length);
	const steering = $derived(scene === 'prompt' && live && step < TOTAL);

	const LIT: Record<Scene, string[]> = {
		magic: ['prompt', 'canvas'],
		noise: ['canvas'],
		train: ['canvas'],
		shapes: ['canvas'],
		details: ['canvas'],
		prompt: ['prompt', 'canvas'],
		remember: ['canvas'],
		seed: ['canvas'],
		try: ['prompt', 'canvas']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	function pick(i: number) {
		if (i === tryPrompt) return;
		tryPrompt = i;
		onstate?.('reprompt');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<div class="chips" role="group" aria-label={tx.tryLabel}>
				{#each tx.prompts as p, k (k)}
					<button type="button" class="chip" class:on={k === tryPrompt} onclick={() => pick(k)}
						>{p}</button
					>
				{/each}
			</div>
		{/if}
		<svg viewBox="0 0 360 362" class="pic" role="img" aria-label={tx.picture}>
			<rect x="16" y="4" width="328" height="354" rx="16" class="app" />

			<!-- the prompt bar -->
			<g class="part" class:dim={!lit('prompt')}>
				<rect x="30" y="18" width="300" height="34" rx="17" class="bar" class:glow={steering} />
				<text x="46" y="39" class="ptext">{promptText}</text>
				{#if caret}
					<rect x={47 + promptText.length * 5.3} y="29" width="1.6" height="13" class="caret" />
				{/if}
				<rect x="250" y="23" width="74" height="24" rx="12" class="go" class:pressed />
				<text x="287" y="39" text-anchor="middle" class="gotext">{tx.generate}</text>
			</g>

			<!-- words steering into the canvas -->
			{#if steering}
				{#each [0, 1, 2, 3] as k (k)}
					<circle r="3" class="word">
						<animateMotion
							dur="1.2s"
							begin="{k * 0.3}s"
							repeatCount="indefinite"
							path="M{120 + k * 40} 52 V{140 + (k % 2) * 60}"
						/>
					</circle>
				{/each}
			{/if}

			<!-- the canvas -->
			<g class="part" class:dim={!lit('canvas')}>
				<rect
					x={X0 - 6}
					y={Y0 - 6}
					width={N * CELL + 12}
					height={N * CELL + 12}
					rx="8"
					class="frame"
				/>
				{#if cells}
					{#each cells as fill, i (i)}
						<rect
							x={X0 + (i % N) * CELL}
							y={Y0 + Math.floor(i / N) * CELL}
							width={CELL}
							height={CELL}
							style="fill:{fill}"
							class="px"
						/>
					{/each}
				{:else}
					<rect x={X0} y={Y0} width={N * CELL} height={N * CELL} class="empty" />
				{/if}

				{#if scene === 'remember'}
					<!-- the sculptor's chisel tapping at the corner -->
					<!-- tilted so the handle points out to the right, clear of the prompt bar above -->
					<g transform="translate(298 72) rotate(70)">
						<g class="chisel" class:tap={!clock.reduced}>
							<rect x="-3" y="-40" width="7" height="26" rx="2.5" class="handle" />
							<path d="M-2.5 -14 H3.5 V-4 L0.5 2 L-2.5 -4 Z" class="blade" />
						</g>
						{#if !clock.reduced}
							{#each [0, 1, 2] as k (k)}
								<rect
									x="-3"
									y="0"
									width="5"
									height="5"
									class="bit"
									style="--dx:{14 + k * 8}px; --dy:{-10 + k * 12}px; animation-delay:{k * 0.25}s"
								/>
							{/each}
						{/if}
					</g>
				{/if}

				<text x={X0} y="332" class="caption" class:memo={scene === 'remember'}>{caption}</text>
				{#if !blank && scene !== 'train'}
					<text x={X0 + N * CELL} y="332" text-anchor="end" class="steps">{stepText}</text>
				{/if}
				<rect x={X0} y="340" width={N * CELL} height="5" rx="2.5" class="track" />
				<rect
					x={X0}
					y="340"
					width={(N * CELL * (blank ? 0 : step)) / TOTAL}
					height="5"
					rx="2.5"
					class="progress"
					class:noisy={scene === 'train'}
				/>
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
		max-width: 420px;
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
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1.5px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 13px;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
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
		opacity: 0.4;
	}
	.app {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bar {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.bar.glow {
		stroke: var(--color-brand);
	}
	.ptext {
		fill: var(--color-ink);
		font-size: 10.5px;
		font-weight: 700;
	}
	.caret {
		fill: var(--color-brand);
	}
	.go {
		fill: var(--color-brand);
		transition: fill 0.2s;
	}
	.go.pressed {
		fill: var(--color-grass);
	}
	.gotext {
		fill: var(--color-card);
		font-size: 10px;
		font-weight: 800;
	}
	.word {
		fill: var(--color-brand);
		opacity: 0.8;
	}
	.frame {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.px {
		transition: fill 0.35s;
	}
	.empty {
		fill: var(--color-paper);
	}
	.chisel.tap {
		animation: tap 0.75s ease-in-out infinite;
	}
	@keyframes tap {
		50% {
			transform: translate(-3px, 4px);
		}
	}
	.handle {
		fill: var(--color-amber);
	}
	.blade {
		fill: var(--color-muted);
	}
	.bit {
		fill: var(--color-faint);
		animation: chip 0.75s ease-out infinite;
	}
	@keyframes chip {
		from {
			transform: none;
			opacity: 1;
		}
		to {
			transform: translate(var(--dx), var(--dy));
			opacity: 0;
		}
	}
	.caption {
		fill: var(--color-ink);
		font-size: 10.5px;
		font-weight: 700;
	}
	.caption.memo {
		fill: var(--color-grass);
		font-weight: 800;
	}
	.steps {
		fill: var(--color-muted);
		font-size: 9.5px;
		font-weight: 700;
	}
	.track {
		fill: var(--color-line);
	}
	.progress {
		fill: var(--color-grass);
		transition: width 0.3s;
	}
	.progress.noisy {
		fill: var(--color-amber);
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.bar,
		.go,
		.px,
		.progress {
			transition: none;
		}
		.chisel.tap,
		.bit {
			animation: none;
		}
	}
</style>
