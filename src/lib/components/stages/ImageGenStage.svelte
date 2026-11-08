<script lang="ts">
	import { SvelteSet, SvelteMap } from 'svelte/reactivity';

	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { ImageGenText } from '$lib/chapters/ai/image-gen/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: {
		text: LessonText;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
	} = $props();
	const tx = $derived(text as ImageGenText);

	const N = 16; // the canvas is N by N pixels
	const TOTAL = 10; // cleaning steps

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
			let t = a;
			t = Math.imul(t ^ (t >>> 15), t | 1);
			t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	let prompt = $state<number | null>(null);
	let seed = $state(7);
	let step = $state(0);
	let auto = $state(false);

	const look = $derived(LOOKS[seed % LOOKS.length]);
	const noise = $derived.by(() => {
		const r = rng(seed * 9973 + 11);
		return Array.from({ length: N * N }, () => {
			const tok = NOISE_TOKENS[Math.floor(r() * NOISE_TOKENS.length)];
			const p = 25 + Math.floor(r() * 70);
			return `color-mix(in srgb, var(--color-${tok}) ${p}%, var(--color-paper))`;
		});
	});

	// the role of every pixel in the finished picture
	const roles = $derived.by(() => {
		if (prompt === null) return null;
		const rows = PICTURES[prompt];
		return Array.from({ length: N * N }, (_, i) => {
			const row = rows[Math.floor(i / N)] ?? '';
			return row[i % N] ?? '.';
		});
	});
	const tokenOf = (role: string) => look[role] ?? BASE[role] ?? 'paper';

	// Early steps only know the rough layout, so each pixel takes the most common role of its block.
	const block = $derived(step <= 2 ? 8 : step <= 4 ? 4 : step <= 6 ? 2 : 1);
	const target = $derived.by(() => {
		const r = roles;
		if (!r) return null;
		const b = block;
		const out: string[] = new Array(N * N);
		for (let by = 0; by < N; by += b) {
			for (let bx = 0; bx < N; bx += b) {
				const tally = new SvelteMap<string, number>();
				for (let y = by; y < by + b; y++)
					for (let x = bx; x < bx + b; x++) {
						const k = r[y * N + x];
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
	});

	// how much of the picture shows through the noise, it rises quickly and then settles
	const clarity = $derived(
		prompt === null ? 0 : Math.round(100 * (1 - Math.pow(1 - step / TOTAL, 1.5)))
	);
	const cells = $derived(
		noise.map((n, i) =>
			target && clarity > 0
				? `color-mix(in srgb, var(--color-${tokenOf(target[i])}) ${clarity}%, ${n})`
				: n
		)
	);
	const phase = $derived(
		step >= TOTAL
			? tx.phase.done
			: step >= 7
				? tx.phase.details
				: step >= 3
					? tx.phase.shapes
					: tx.phase.noise
	);

	// ---- what the learner does ----
	let said = new SvelteSet<string>();
	let completed = false;
	function sayOnce(token: string) {
		if (said.has(token)) return;
		said.add(token);
		onstate?.(token);
	}

	function pickPrompt(i: number) {
		if (prompt === i) return;
		const had = prompt !== null && step > 0;
		prompt = i;
		if (had) onstate?.('reprompt');
		else sayOnce('prompt');
	}

	function reached() {
		if (step >= TOTAL) {
			sayOnce('clean');
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		} else if (step >= 7) sayOnce('details');
		else if (step >= 4) sayOnce('shapes');
		else if (step >= 1) sayOnce('step');
	}

	function cleanStep() {
		if (prompt === null || step >= TOTAL) return;
		step++;
		reached();
	}
	function scrub(v: number) {
		if (prompt === null) return;
		stopAuto();
		step = v;
		reached();
	}

	let timer: ReturnType<typeof setInterval> | undefined;
	function runAll() {
		if (prompt === null || auto) return;
		if (step >= TOTAL) step = 0;
		auto = true;
		timer = setInterval(() => {
			cleanStep();
			if (step >= TOTAL) stopAuto();
		}, 380);
	}
	function stopAuto() {
		clearInterval(timer);
		timer = undefined;
		auto = false;
	}

	function freshNoise() {
		seed = seed + 1 + Math.floor(Math.random() * 5);
		if (prompt !== null && step > 0) onstate?.('seed');
	}

	onDestroy(() => clearInterval(timer));
</script>

<div class="stage">
	<!-- the prompt box and the actions, up top -->
	<div class="promptbox" class:empty={prompt === null}>
		<span class="plabel">{tx.promptLabel}</span>
		<span class="ptext">{prompt === null ? tx.pickPrompt : tx.prompts[prompt]}</span>
	</div>
	<div class="chips">
		{#each tx.prompts as p, i (i)}
			<button
				type="button"
				class="chip"
				class:on={prompt === i}
				aria-pressed={prompt === i}
				onclick={() => pickPrompt(i)}>{p}</button
			>
		{/each}
	</div>

	<div class="acts">
		<CallToActionButton onclick={cleanStep} disabled={prompt === null || step >= TOTAL || auto}>
			{tx.stepBtn}
		</CallToActionButton>
		<button type="button" class="ghost" onclick={runAll} disabled={prompt === null || auto}>
			{tx.autoBtn}
		</button>
		<button type="button" class="ghost" onclick={freshNoise} disabled={auto}>{tx.seedBtn}</button>
	</div>

	<!-- the canvas -->
	<div class="frame">
		<div class="canvas" role="img" aria-label={`${tx.canvasLabel}, ${phase}`} style="--n:{N}">
			{#each cells as c, i (i)}
				<span style="background:{c}"></span>
			{/each}
		</div>
	</div>

	<p class="phase" class:done={step >= TOTAL}>{phase}</p>

	<!-- the step slider and the noise meter -->
	<div class="meter">
		<div class="mrow">
			<span>{tx.stepLabel.replace('{n}', String(step)).replace('{total}', String(TOTAL))}</span>
			<span class="nleft">{tx.noiseLabel.replace('{n}', String(100 - clarity))}</span>
		</div>
		<input
			type="range"
			min="0"
			max={TOTAL}
			step="1"
			value={step}
			disabled={prompt === null || auto}
			aria-label={tx.sliderLabel}
			oninput={(e) => scrub(Number((e.currentTarget as HTMLInputElement).value))}
		/>
		<div class="bar" aria-hidden="true">
			<span style="width:{100 - clarity}%"></span>
		</div>
	</div>
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-width: 420px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		margin: 0 auto;
	}
	.promptbox {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 8px;
		border-radius: 14px;
		border: 1.5px solid var(--color-brand);
		background: var(--color-card);
		padding: 8px 12px;
	}
	.promptbox.empty {
		border-color: var(--color-line);
	}
	.plabel {
		flex: none;
		border-radius: 7px;
		background: var(--color-brand-soft);
		padding: 2px 7px;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.ptext {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.promptbox.empty .ptext {
		color: var(--color-faint);
		font-weight: 500;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chip:hover {
		border-color: color-mix(in srgb, var(--color-brand) 40%, var(--color-line));
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.acts :global(.cta) {
		padding: 10px 16px;
		font-size: 13px;
	}
	.ghost {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.ghost:disabled {
		opacity: 0.5;
	}

	/* the pixel canvas */
	.frame {
		border-radius: 16px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.08);
	}
	.canvas {
		display: grid;
		width: min(68vw, 240px);
		aspect-ratio: 1;
		grid-template-columns: repeat(var(--n), 1fr);
		overflow: hidden;
		border-radius: 9px;
	}
	.canvas span {
		display: block;
		transition: background 0.35s ease;
	}
	.phase {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.phase.done {
		color: var(--color-grass);
	}

	/* meter */
	.meter {
		display: flex;
		width: min(80vw, 280px);
		flex-direction: column;
		gap: 4px;
	}
	.mrow {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
		font-variant-numeric: tabular-nums;
	}
	.nleft {
		color: var(--color-faint);
	}
	.meter input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.bar {
		height: 5px;
		border-radius: 99px;
		background: var(--color-line);
		overflow: hidden;
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: 99px;
		background: var(--color-amber);
		transition: width 0.35s ease;
	}

	@media (prefers-reduced-motion: reduce) {
		.canvas span,
		.bar span,
		.chip {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.canvas {
			width: 280px;
		}
	}
</style>
