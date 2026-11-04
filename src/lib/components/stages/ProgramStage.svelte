<script lang="ts">
	// A guided "watch" stage. Nim narrates, and the picture follows the beats by itself. First a
	// tea recipe writes itself next to a little kitchen (an algorithm), then it turns into code (a
	// program), then Nim follows it line by line. After that the recipe becomes a flowchart that
	// draws its three building blocks one at a time. The only optional play is on the last beat,
	// swapping two lines to watch the computer follow the wrong order anyway.
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Nim from '$lib/components/Nim.svelte';
	import type { Mood, StageProps } from '$lib/chapters/types';
	import type { ProgramText, TeaStepId } from '$lib/chapters/basics/program/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as ProgramText);

	// Which scene each beat shows (ten beats, eight scenes).
	const SCENE_OF_BEAT = [0, 0, 1, 2, 3, 4, 5, 6, 6, 7];
	const RIGHT: TeaStepId[] = ['cup', 'bag', 'boil', 'pour', 'stir'];
	const SWAPPED: TeaStepId[] = ['pour', 'bag', 'boil', 'cup', 'stir'];
	// The recipe as Python. Real code, so it is shown as is.
	const CODE = [
		'take("cup")',
		'put("teabag", "cup")',
		'if not water.is_hot:',
		'    boil("water")',
		'pour("water", "cup")',
		'add("sugar")',
		'while not tea.is_sweet:',
		'    stir()'
	];
	const CODE_LINES: Record<TeaStepId, number[]> = {
		cup: [0],
		bag: [1],
		boil: [2, 3],
		pour: [4],
		stir: [5, 6, 7]
	};
	// Where Nim floats while doing each step (x in kitchen units, 0 to 320).
	const STATION: Record<TeaStepId, number> = {
		cup: 55,
		bag: 113,
		boil: 252,
		pour: 205,
		stir: 172
	};

	let peek = $state<number | null>(null);
	let swapped = $state(false);
	let reduced = $state(false);
	let shown = $state(5); // recipe lines written so far
	let ran = $state(0); // lines Nim has finished
	let cur = $state(-1); // line running right now

	const sceneFromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(peek ?? sceneFromBeat);
	const kitchenView = $derived(scene <= 2 || scene === 7);
	const order = $derived(scene === 7 && swapped ? SWAPPED : RIGHT);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	// The recipe writes itself, one line at a time, on the first scene.
	$effect(() => {
		if (scene !== 0 || reduced) {
			shown = 5;
			return;
		}
		shown = 0;
		const t = setInterval(() => {
			shown += 1;
			if (shown >= 5) clearInterval(t);
		}, 750);
		return () => clearInterval(t);
	});

	// Nim follows the steps in a gentle loop on the "following" and "try it" scenes.
	$effect(() => {
		const sc = scene;
		void swapped;
		if (sc !== 2 && sc !== 7) {
			ran = 0;
			cur = -1;
			return;
		}
		if (reduced) {
			ran = 5;
			cur = -1;
			return;
		}
		ran = 0;
		cur = -1;
		let i = 0;
		let t: ReturnType<typeof setTimeout>;
		const tick = () => {
			if (i < 5) {
				cur = i;
				ran = i + 1;
				i += 1;
				t = setTimeout(tick, 1300);
				return;
			}
			cur = -1;
			t = setTimeout(() => {
				i = 0;
				ran = 0;
				t = setTimeout(tick, 800);
			}, 2600);
		};
		t = setTimeout(tick, 800);
		return () => clearTimeout(t);
	});

	type Kitchen = {
		cup: boolean;
		bagIn: boolean;
		bagTable: boolean;
		hot: boolean;
		water: 'none' | 'cold' | 'hot';
		spilled: boolean;
		sugar: boolean;
	};
	/** Do exactly what the first n lines say, nothing more. */
	function simulate(steps: TeaStepId[], n: number): Kitchen {
		const k: Kitchen = {
			cup: false,
			bagIn: false,
			bagTable: false,
			hot: false,
			water: 'none',
			spilled: false,
			sugar: false
		};
		for (const s of steps.slice(0, n)) {
			if (s === 'cup') k.cup = true;
			else if (s === 'bag') {
				if (k.cup) k.bagIn = true;
				else k.bagTable = true;
			} else if (s === 'boil') k.hot = true;
			else if (s === 'pour') {
				if (k.cup) k.water = k.hot ? 'hot' : 'cold';
				else k.spilled = true;
			} else if (s === 'stir' && k.cup) k.sugar = true;
		}
		return k;
	}
	const k = $derived(simulate(order, ran));
	const doing = $derived<TeaStepId | null>(cur >= 0 ? order[cur] : null);
	const finished = $derived(ran >= 5 && cur < 0);
	const good = $derived(finished && !k.spilled);
	const nimX = $derived(doing ? STATION[doing] : 160);
	const nimMood = $derived<Mood>(
		doing ? 'thinking' : finished ? (good ? 'excited' : 'surprised') : 'calm'
	);
	const caption = $derived(
		doing
			? tx.result.working.replace('{n}', String(cur + 1))
			: finished
				? good
					? tx.result.tea
					: tx.result.spill
				: tx.result.idle
	);
	const liquid = $derived(k.water === 'none' ? '' : k.bagIn && k.water === 'hot' ? 'tea' : 'water');
	const hotLines = $derived(doing && scene === 2 ? CODE_LINES[doing] : []);

	function toggleSwap() {
		swapped = !swapped;
		onstate?.(swapped ? 'spill' : 'fixed');
	}

	// Flowchart colours, one per building block.
	const SEQ = 'var(--color-brand)';
	const CHO = 'var(--color-amber)';
	const REP = 'var(--color-grass)';
	const BLOCKS = [
		['sequence', SEQ, 3],
		['choice', CHO, 4],
		['repetition', REP, 5]
	] as const;
	const seqOn = $derived(scene === 3 || scene === 6);
	const choOn = $derived(scene === 4 || scene === 6);
	const repOn = $derived(scene === 5 || scene === 6);
</script>

{#snippet box(cx: number, cy: number, w: number, label: string, color: string, on: boolean)}
	<g class="node" style="--c:{color}" class:on>
		<rect x={cx - w / 2} y={cy - 15} width={w} height="30" rx="8" />
		<text x={cx} y={cy + 4}>{label}</text>
	</g>
{/snippet}

{#snippet diamond(cx: number, cy: number, label: string, color: string, on: boolean)}
	<g class="node" style="--c:{color}" class:on>
		<path d="M{cx} {cy - 22} L{cx + 56} {cy} L{cx} {cy + 22} L{cx - 56} {cy} Z" />
		<text x={cx} y={cy + 4}>{label}</text>
	</g>
{/snippet}

{#snippet pill(cx: number, cy: number, label: string)}
	<g class="node pill">
		<rect x={cx - 42} y={cy - 12} width="84" height="24" rx="12" />
		<text x={cx} y={cy + 4}>{label}</text>
	</g>
{/snippet}

{#snippet kitchen()}
	<div class="kitchen">
		<div class="nim" style="left:{(nimX / 320) * 100}%">
			<Nim mood={nimMood} size={40} />
		</div>
		<svg viewBox="0 0 320 170" class="scene" aria-hidden="true">
			<rect x="0" y="0" width="320" height="128" class="wall" />
			<!-- shelf -->
			<rect x="26" y="70" width="64" height="4" rx="2" class="wood" />
			<rect x="34" y="74" width="3" height="8" class="wood" />
			<rect x="79" y="74" width="3" height="8" class="wood" />
			<!-- counter and cupboards -->
			<rect x="0" y="128" width="320" height="7" class="counter" />
			<rect x="6" y="135" width="308" height="35" class="cabinet" />
			<line x1="110" y1="135" x2="110" y2="170" class="seam" />
			<line x1="214" y1="135" x2="214" y2="170" class="seam" />
			<circle cx="100" cy="150" r="2" class="knob" />
			<circle cx="120" cy="150" r="2" class="knob" />
			<circle cx="224" cy="150" r="2" class="knob" />

			<!-- box of teabags -->
			<g transform="translate(98 104)">
				<rect width="32" height="24" rx="3" class="teabox" />
				<rect x="8" y="7" width="16" height="10" rx="2" class="teabox-label" />
			</g>

			<!-- stove and kettle -->
			<rect x="226" y="122" width="60" height="6" rx="2" class="stove" class:hot={k.hot} />
			<g transform="translate(236 86)">
				<path d="M4 36 L8 10 Q20 2 32 10 L36 36 Z" class="kettle" class:hot={k.hot} />
				<path d="M4 16 L-10 8" class="kettle-line" />
				<path d="M36 14 Q48 16 46 28" class="kettle-line" fill="none" />
				<rect x="15" y="2" width="10" height="4" rx="2" class="kettle" class:hot={k.hot} />
				{#if k.hot && !reduced}
					<g class="steam">
						<path d="M14 -4 Q10 -12 14 -20" />
						<path d="M24 -6 Q20 -14 24 -24" />
					</g>
				{/if}
			</g>

			<!-- water being poured -->
			{#if doing === 'pour'}
				<path d={k.cup ? 'M226 94 Q196 88 180 104' : 'M226 94 Q192 92 176 126'} class="stream" />
			{/if}

			<!-- what went wrong ends up on the counter -->
			{#if k.spilled}
				<ellipse cx="176" cy="128" rx="34" ry="4" class="puddle" transition:fade />
			{/if}
			{#if k.bagTable}
				<g transform="translate(150 118)" transition:fade>
					<rect width="10" height="10" rx="2" class="bag" />
					<path d="M5 0 L3 -7" class="string" />
				</g>
			{/if}

			<!-- the cup, on the shelf until a line takes it down -->
			<g class="cup" class:down={k.cup}>
				<g class:stir={doing === 'stir' && k.cup && !reduced}>
					{#if liquid}
						<path d="M2.5 8 H23.5 L22.2 22 H3.8 Z" class="drink {liquid}" />
					{/if}
					{#if k.bagIn}
						<rect x="13" y="10" width="8" height="9" rx="2" class="bag" />
						<path d="M17 10 L20 -4" class="string" />
					{/if}
					{#if doing === 'stir' && k.cup}
						<path d="M8 -8 L12 18" class="spoon" />
					{/if}
				</g>
				<path d="M0 2 H26 L24 24 H2 Z" class="cup-body" />
				<path d="M26 7 Q33 8 32 14 Q31 19 25 19" class="cup-handle" />
			</g>
		</svg>
		<p class="caption" class:good class:bad={finished && !good}>{caption}</p>
	</div>
{/snippet}

{#snippet recipeCard()}
	<div class="card">
		<p class="card-title">{scene === 1 || scene === 2 ? tx.programTitle : tx.recipeTitle}</p>
		{#if scene === 1 || scene === 2}
			<div class="code" in:fade={{ duration: 300 }}>
				{#each CODE as line, i (i)}
					<div
						class="code-line"
						class:hot={hotLines.includes(i)}
						in:fly={{ y: 6, duration: 300, delay: scene === 1 && !reduced ? i * 220 : 0 }}
					>
						<span class="ln">{i + 1}</span><span class="src">{line}</span>
					</div>
				{/each}
			</div>
		{:else}
			<ol class="steps">
				{#each order as id, i (id)}
					<li
						animate:flip={{ duration: reduced ? 0 : 450 }}
						class:hot={scene === 7 && cur === i}
						class:hidden={i >= shown}
					>
						<span class="num">{i + 1}</span>
						<span>{tx.steps[id]}</span>
					</li>
				{/each}
			</ol>
		{/if}
	</div>
{/snippet}

{#snippet flowchart()}
	<div class="flow-wrap">
		<svg viewBox="0 0 320 340" class="flow" aria-hidden="true">
			<defs>
				<marker
					id="program-flow-arrow"
					viewBox="0 0 10 10"
					refX="9"
					refY="5"
					markerWidth="6"
					markerHeight="6"
					orient="auto-start-reverse"
				>
					<path d="M0 0 L10 5 L0 10 Z" class="arrow-head" />
				</marker>
			</defs>

			<!-- the spine, top to bottom -->
			<path d="M135 32 V49" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
			<path d="M135 81 V95" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
			{#if scene === 3}
				<path
					d="M135 127 V201"
					pathLength="1"
					class="link draw"
					marker-end="url(#program-flow-arrow)"
				/>
			{:else}
				<path d="M135 127 V140" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
				<path d="M135 186 V201" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
				<path
					d="M191 164 H224"
					pathLength="1"
					class="link draw"
					class:tint={choOn}
					style="--c:{CHO}"
					marker-end="url(#program-flow-arrow)"
				/>
				<path
					d="M268 179 V218 H212"
					pathLength="1"
					class="link draw"
					class:tint={choOn}
					style="--c:{CHO}"
					marker-end="url(#program-flow-arrow)"
				/>
				<text x="143" y="198" class="edge" style="text-anchor:start">{tx.flow.yes}</text>
				<text x="207" y="157" class="edge">{tx.flow.no}</text>
			{/if}
			{#if scene <= 4}
				<path d="M135 233 V306" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
			{:else}
				<path d="M135 233 V246" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
				<path d="M135 292 V306" pathLength="1" class="link" marker-end="url(#program-flow-arrow)" />
				<path
					d="M191 270 H224"
					pathLength="1"
					class="link draw"
					class:tint={repOn}
					style="--c:{REP}"
					marker-end="url(#program-flow-arrow)"
				/>
				<path
					d="M268 255 V238 H139"
					pathLength="1"
					class="link draw loop"
					class:tint={repOn}
					style="--c:{REP}"
					marker-end="url(#program-flow-arrow)"
				/>
				<text x="143" y="303" class="edge" style="text-anchor:start">{tx.flow.yes}</text>
				<text x="207" y="263" class="edge">{tx.flow.no}</text>
			{/if}

			{@render pill(135, 20, tx.flow.start)}
			{@render box(135, 66, 150, tx.flow.cup, SEQ, seqOn)}
			{@render box(135, 112, 150, tx.flow.bag, SEQ, seqOn)}
			{#if scene >= 4}
				<g class="pop">{@render diamond(135, 164, tx.flow.hot, CHO, choOn)}</g>
				<g class="pop late">{@render box(268, 164, 84, tx.flow.boil, CHO, choOn)}</g>
			{/if}
			{@render box(135, 218, 150, tx.flow.pour, SEQ, seqOn)}
			{#if scene >= 5}
				<g class="pop">{@render diamond(135, 270, tx.flow.sweet, REP, repOn)}</g>
				<g class="pop late">{@render box(268, 270, 84, tx.flow.stir, REP, repOn)}</g>
			{/if}
			{@render pill(135, 320, tx.flow.done)}
		</svg>

		<div class="legend">
			{#each BLOCKS as [key, color, from] (key)}
				{#if scene >= from}
					<span class="chip" style="--c:{color}" in:fade={{ duration: 300 }}>
						<i></i>{tx.blocks[key].name}<em>{tx.blocks[key].word}</em>
					</span>
				{/if}
			{/each}
		</div>
		{#if scene === 6}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === 7}
					<button type="button" class="swap" onclick={toggleSwap}>
						{swapped ? tx.unswap : tx.swap}
					</button>
				{/if}
				{#if kitchenView}
					<div class="pair" in:fade={{ duration: 300 }}>
						{@render kitchen()}
						{@render recipeCard()}
					</div>
				{:else}
					<div in:fade={{ duration: 300 }}>{@render flowchart()}</div>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: flex-start;
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
	.pair {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 10px;
	}
	.swap {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.swap:hover {
		transform: translateY(-1px);
	}

	/* kitchen */
	.kitchen {
		position: relative;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 8px 8px 6px;
		overflow: hidden;
	}
	.scene {
		display: block;
		width: 100%;
		height: auto;
	}
	.nim {
		position: absolute;
		top: 8px;
		transform: translateX(-50%);
		transition: left 0.7s cubic-bezier(0.3, 0.7, 0.3, 1);
		z-index: 1;
	}
	.wall {
		fill: var(--color-paper);
	}
	.wood {
		fill: var(--color-amber);
		opacity: 0.55;
	}
	.counter {
		fill: var(--color-faint);
		opacity: 0.5;
	}
	.cabinet {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.seam {
		stroke: var(--color-line);
	}
	.knob {
		fill: var(--color-faint);
	}
	.teabox {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.5;
	}
	.teabox-label {
		fill: var(--color-grass);
		opacity: 0.5;
	}
	.stove {
		fill: var(--color-ink);
		opacity: 0.7;
		transition: fill 0.4s;
	}
	.stove.hot {
		fill: var(--color-danger);
	}
	.kettle {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
		transition: stroke 0.4s;
	}
	.kettle.hot {
		stroke: var(--color-danger);
	}
	.kettle-line {
		stroke: var(--color-muted);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.steam path {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		animation: rise 1.6s ease-in-out infinite;
	}
	.steam path:nth-child(2) {
		animation-delay: 0.5s;
	}
	@keyframes rise {
		0% {
			opacity: 0;
			transform: translateY(4px);
		}
		50% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
	.stream {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
		opacity: 0.75;
	}
	.puddle {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.cup {
		transform: translate(46px, 44px);
		transition: transform 0.8s cubic-bezier(0.3, 0.7, 0.3, 1);
	}
	.cup.down {
		transform: translate(160px, 104px);
	}
	.cup-body {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.cup-handle {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.drink.water {
		fill: var(--color-brand-soft);
	}
	.drink.tea {
		fill: var(--color-amber);
	}
	.bag {
		fill: var(--color-grass);
	}
	.string {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1;
	}
	.spoon {
		stroke: var(--color-muted);
		stroke-width: 2.5;
		stroke-linecap: round;
	}
	.stir {
		transform-origin: 13px 14px;
		animation: wiggle 0.5s ease-in-out infinite alternate;
	}
	@keyframes wiggle {
		from {
			transform: rotate(-6deg);
		}
		to {
			transform: rotate(6deg);
		}
	}
	.caption {
		margin: 4px 0 2px;
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.caption.good {
		color: var(--color-grass);
	}
	.caption.bad {
		color: var(--color-danger);
	}

	/* recipe card */
	.card {
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 12px 14px;
	}
	.card-title {
		margin: 0 0 8px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.steps {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.steps li {
		display: flex;
		align-items: center;
		gap: 10px;
		border-radius: 10px;
		padding: 5px 8px;
		font-size: 13.5px;
		color: var(--color-ink);
		transition:
			background 0.3s,
			opacity 0.4s,
			transform 0.4s;
	}
	.steps li.hidden {
		opacity: 0;
		transform: translateY(6px);
	}
	.steps li.hot {
		background: var(--color-brand-soft);
	}
	.num {
		display: inline-grid;
		height: 20px;
		width: 20px;
		flex: none;
		place-items: center;
		border-radius: 999px;
		background: var(--color-paper);
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.code {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12.5px;
	}
	.code-line {
		display: flex;
		gap: 12px;
		border-radius: 8px;
		padding: 2px 6px;
		transition: background 0.3s;
	}
	.code-line.hot {
		background: var(--color-brand-soft);
	}
	.ln {
		width: 12px;
		flex: none;
		text-align: right;
		color: var(--color-faint);
	}
	.src {
		white-space: pre;
		color: var(--color-ink);
	}

	/* flowchart */
	.flow-wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 12px 10px;
	}
	.flow {
		display: block;
		width: 100%;
		max-height: 52vh;
	}
	.node rect,
	.node path {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.node.on rect,
	.node.on path {
		fill: color-mix(in srgb, var(--c) 13%, var(--color-card));
		stroke: var(--c);
	}
	.node text {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 600;
		text-anchor: middle;
	}
	.pill rect {
		fill: var(--color-paper);
	}
	.link {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.6;
	}
	.link.tint {
		stroke: var(--c);
	}
	.arrow-head {
		fill: var(--color-faint);
	}
	.draw {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 0.9s ease forwards 0.3s;
	}
	.draw.loop {
		animation-delay: 0.9s;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.edge {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 600;
		text-anchor: middle;
	}
	.pop {
		animation: pop 0.5s ease both;
	}
	.pop.late {
		animation-delay: 0.6s;
	}
	@keyframes pop {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--c) 12%, transparent);
		padding: 4px 10px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.chip i {
		height: 8px;
		width: 8px;
		border-radius: 999px;
		background: var(--c);
	}
	.chip em {
		font-style: normal;
		font-weight: 600;
		color: var(--c);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.nim,
		.cup,
		.steps li {
			transition: none;
		}
		.draw {
			animation: none;
			stroke-dashoffset: 0;
		}
		.pop {
			animation: none;
		}
	}
</style>
