<script lang="ts">
	// A laptop taken apart (an exploded view), following Nim's beats. Each beat lights up one
	// part and a small animation shows it at work, while the Guide panel explains it. On the last
	// beat the learner may tap any part to look at it again, nothing is required.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HardwareText } from '$lib/chapters/basics/hardware/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HardwareText);

	type Part = 'screen' | 'keyboard' | 'board' | 'cpu' | 'ram' | 'storage' | 'gpu' | 'battery';
	type Focus =
		| 'whole'
		| 'board'
		| 'cpu'
		| 'ram'
		| 'storage'
		| 'flow'
		| 'memo'
		| 'gpu'
		| 'power'
		| 'io'
		| 'all';
	const FOCUS: Focus[] = [
		'whole',
		'board',
		'cpu',
		'ram',
		'storage',
		'flow',
		'memo',
		'gpu',
		'power',
		'io',
		'all'
	];
	const EVERY: Part[] = ['screen', 'keyboard', 'board', 'cpu', 'ram', 'storage', 'gpu', 'battery'];
	const LIT: Record<Focus, Part[]> = {
		whole: EVERY,
		all: EVERY,
		board: ['board'],
		cpu: ['cpu'],
		ram: ['ram'],
		storage: ['storage'],
		flow: ['storage', 'ram', 'cpu'],
		memo: ['ram', 'storage', 'screen', 'battery'],
		gpu: ['gpu', 'screen'],
		power: ['battery', 'board'],
		io: ['keyboard', 'screen', 'cpu']
	};
	// which step a tap on a part opens
	const STEP_OF: Record<Part, number> = {
		board: 1,
		cpu: 2,
		ram: 3,
		storage: 4,
		gpu: 7,
		battery: 8,
		keyboard: 9,
		screen: 9
	};

	const last = $derived(FOCUS.length - 1);
	const fromBeat = $derived(Math.min(beat, last));
	let peek = $state<number | null>(null);
	let peekBeat = -1;
	const active = $derived(peek !== null && peekBeat === beat ? peek : fromBeat);
	const focus = $derived(FOCUS[active] ?? 'whole');
	const canPeek = $derived(beat >= tx.intro.length - 1);
	const lit = (p: Part) => LIT[focus].includes(p);
	const showLabel = (p: Part) => focus !== 'whole' && lit(p);

	let reduced = $state(false);
	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof window !== 'undefined' && window.matchMedia) {
			reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// the memory trick, power goes off and on again so you can see who forgets
	let blackout = $state(true);
	$effect(() => {
		if (focus !== 'memo' || reduced) return;
		blackout = false;
		const t = setInterval(() => (blackout = !blackout), 2600);
		return () => clearInterval(t);
	});
	const off = $derived(focus === 'memo' && (reduced || blackout));

	// input and output, letters typed one by one appear on the screen
	let typed = $state(0);
	$effect(() => {
		if (focus !== 'io') return;
		if (reduced) {
			typed = tx.typed.length;
			return;
		}
		typed = 0;
		const len = tx.typed.length;
		const t = setInterval(() => (typed = typed >= len + 3 ? 0 : typed + 1), 520);
		return () => clearInterval(t);
	});
	const pressed = $derived(
		focus === 'io' && typed > 0 && typed <= tx.typed.length
			? (tx.typed.charCodeAt(typed - 1) * 7) % 24
			: -1
	);

	function select(i: number) {
		if (!canPeek) return;
		peek = i;
		peekBeat = beat;
		onstate?.('peek');
	}
	function tap(p: Part) {
		select(STEP_OF[p]);
	}
	function key(e: KeyboardEvent, p: Part) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			tap(p);
		}
	}

	const steps = $derived(tx.steps);
	const KEYS = Array.from({ length: 36 }, (_, k) => k);
	const TRACES = [
		'M118 252 H150',
		'M206 256 H236',
		'M206 272 H236',
		'M165 310 V292',
		'M178 236 V218 H310 V244',
		'M277 318 V306 H192 V292'
	];
</script>

{#snippet label(p: Part, x: number, y: number, anchor: 'start' | 'middle' | 'end' = 'start')}
	{#if showLabel(p)}
		<text {x} {y} text-anchor={anchor} class="label">{tx.labels[p]}</text>
	{/if}
{/snippet}

{#snippet laptop(_i: number)}
	<svg viewBox="0 0 360 410" class="laptop" role="img" aria-label={tx.picture}>
		<!-- the guide lines of the exploded view -->
		{#each [[126, 142], [192, 210], [338, 356]] as [a, b] (a)}
			<line x1="76" y1={a} x2="76" y2={b} class="guideline" />
			<line x1="284" y1={a} x2="284" y2={b} class="guideline" />
		{/each}

		<!-- display cable from the GPU to the screen, and the keyboard cable -->
		<path
			d="M62 252 H50 V70 H70"
			class="cable"
			class:hot={focus === 'gpu' || (focus === 'io' && typed > 0)}
		/>
		<path d="M178 192 V236" class="cable" class:hot={focus === 'io'} />

		<!-- screen -->
		<g
			class="part"
			class:dim={!lit('screen')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.screen}
			onclick={() => tap('screen')}
			onkeydown={(e) => key(e, 'screen')}
		>
			<rect x="70" y="8" width="220" height="118" rx="10" class="bd" />
			<rect x="80" y="18" width="200" height="96" rx="4" class="display" class:dark={off} />
			{#if !off && focus !== 'io'}
				<g class:paint={focus === 'gpu'}>
					<circle cx="246" cy="44" r="12" class="sun" />
					<path d="M80 100 Q120 64 160 92 Q200 70 240 96 Q262 84 280 90 V114 H80 Z" class="hill" />
					<path d="M80 114 V104 Q130 86 180 106 Q230 92 280 108 V114 Z" class="hill2" />
				</g>
			{/if}
			{#if focus === 'io'}
				<text x="96" y="74" class="typed">{tx.typed.slice(0, typed)}</text>
				<rect
					x={96 + typed * 11.4}
					y="58"
					width="2.5"
					height="20"
					class="caret"
					class:blink={!reduced}
				/>
			{/if}
			{#if off}
				<text x="180" y="72" text-anchor="middle" class="offtag">{tx.powerOff}</text>
			{/if}
			{@render label('screen', 296, 22)}
		</g>

		<!-- keyboard -->
		<g
			class="part"
			class:dim={!lit('keyboard')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.keyboard}
			onclick={() => tap('keyboard')}
			onkeydown={(e) => key(e, 'keyboard')}
		>
			<rect x="60" y="142" width="240" height="50" rx="8" class="bd" />
			{#each KEYS as k (k)}
				<rect
					x={70 + (k % 12) * 18.6}
					y={150 + Math.floor(k / 12) * 13}
					width="15"
					height="10"
					rx="2"
					class="key"
					class:down={k === pressed}
				/>
			{/each}
			{@render label('keyboard', 304, 171)}
		</g>

		<!-- motherboard and its traces -->
		<g
			class="part"
			class:faded={!lit('board')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.board}
			onclick={() => tap('board')}
			onkeydown={(e) => key(e, 'board')}
		>
			<rect x="40" y="210" width="280" height="128" rx="12" class="board" />
			{#each TRACES as d (d)}
				<path {d} class="trace" class:hot={focus === 'board' || focus === 'power'} />
			{/each}
			<rect x="304" y="244" width="12" height="10" rx="2" class="port" />
			<rect x="304" y="262" width="12" height="10" rx="2" class="port" />
			<rect x="270" y="318" width="14" height="10" rx="2" class="port" />
			{@render label('board', 312, 332, 'end')}
		</g>
		{#if focus === 'board' && !reduced}
			{#each TRACES as d, k (d)}
				<circle r="3" class="car">
					<animateMotion
						dur="{2.2 + (k % 3) * 0.6}s"
						begin="{k * 0.35}s"
						repeatCount="indefinite"
						path={d}
					/>
				</circle>
			{/each}
		{/if}

		<!-- GPU -->
		<g
			class="part"
			class:dim={!lit('gpu')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.gpu}
			onclick={() => tap('gpu')}
			onkeydown={(e) => key(e, 'gpu')}
		>
			<rect x="62" y="228" width="56" height="48" rx="4" class="chip" />
			<rect x="74" y="238" width="32" height="28" rx="3" class="die" class:busy={focus === 'gpu'} />
			<text x="90" y="256" text-anchor="middle" class="chiptext">GPU</text>
		</g>

		<!-- CPU -->
		<g
			class="part"
			class:dim={!lit('cpu')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.cpu}
			onclick={() => tap('cpu')}
			onkeydown={(e) => key(e, 'cpu')}
		>
			{#if focus === 'cpu' || focus === 'flow' || focus === 'io'}
				<rect x="144" y="230" width="68" height="68" rx="9" class="halo" class:pulse={!reduced} />
			{/if}
			<rect x="150" y="236" width="56" height="56" rx="5" class="chip" />
			<rect
				x="160"
				y="246"
				width="36"
				height="36"
				rx="3"
				class="die"
				class:busy={focus === 'cpu'}
			/>
			<text x="178" y="268" text-anchor="middle" class="chiptext">CPU</text>
		</g>

		<!-- RAM -->
		<g
			class="part"
			class:dim={!lit('ram')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.ram}
			onclick={() => tap('ram')}
			onkeydown={(e) => key(e, 'ram')}
		>
			{#each [236, 256] as x, s (x)}
				<rect {x} y="226" width="14" height="72" rx="2" class="stick" />
				{#each [0, 1, 2, 3] as c (c)}
					<rect
						x={x + 3}
						y={231 + c * 16}
						width="8"
						height="12"
						rx="1.5"
						class="mem"
						class:empty={off}
						class:seq={focus === 'ram' && !reduced}
						style="animation-delay:{(s * 4 + c) * 0.18}s"
					/>
				{/each}
			{/each}
			{#if off}
				<text x="253" y="222" text-anchor="middle" class="tag warn">{tx.cleared}</text>
			{:else}
				{@render label('ram', 287, 274, 'middle')}
			{/if}
		</g>

		<!-- storage, an SSD stick -->
		<g
			class="part"
			class:dim={!lit('storage')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.storage}
			onclick={() => tap('storage')}
			onkeydown={(e) => key(e, 'storage')}
		>
			<rect x="66" y="310" width="110" height="18" rx="3" class="stick" />
			{#each [0, 1, 2] as c (c)}
				<rect
					x={74 + c * 30}
					y="313"
					width="24"
					height="12"
					rx="1.5"
					class="mem keep"
					class:seq={focus === 'storage' && !reduced}
					style="animation-delay:{c * 0.5}s"
				/>
			{/each}
			<rect x="168" y="313" width="5" height="12" rx="1" class="pin" />
			{#if off}
				<text x="66" y="304" class="tag ok">{tx.kept}</text>
			{:else}
				{@render label('storage', 66, 304)}
			{/if}
		</g>

		<!-- battery -->
		<g
			class="part"
			class:dim={!lit('battery')}
			class:tappable={canPeek}
			role="button"
			tabindex={canPeek ? 0 : -1}
			aria-label={tx.labels.battery}
			onclick={() => tap('battery')}
			onkeydown={(e) => key(e, 'battery')}
		>
			<rect x="70" y="356" width="220" height="44" rx="8" class="bd" />
			{#each [0, 1, 2] as c (c)}
				<rect x={80 + c * 68} y="363" width="62" height="30" rx="5" class="cell" />
				<rect
					x={80 + c * 68}
					y="363"
					width="62"
					height="30"
					rx="5"
					class="charge"
					class:low={off}
					class:flow={focus === 'power' && !reduced}
					style="animation-delay:{c * 0.4}s"
				/>
			{/each}
			{@render label('battery', 296, 382)}
		</g>

		<!-- moving data, each little packet is a piece of work travelling between parts -->
		{#if !reduced}
			{#if focus === 'flow'}
				<rect x="-6" y="-5" width="12" height="10" rx="2" class="packet">
					<animateMotion dur="3s" repeatCount="indefinite" path="M176 319 H243 V262 H206" />
				</rect>
			{:else if focus === 'power'}
				{#each [0, 1, 2] as k (k)}
					<circle r="3.2" class="spark">
						<animateMotion
							dur="1.8s"
							begin="{k * 0.6}s"
							repeatCount="indefinite"
							path="M277 356 V306 H192 V292"
						/>
					</circle>
				{/each}
			{:else if focus === 'gpu'}
				{#each [0, 1] as k (k)}
					<circle r="3.2" class="packet">
						<animateMotion
							dur="1.6s"
							begin="{k * 0.8}s"
							repeatCount="indefinite"
							path="M62 252 H50 V70 H70"
						/>
					</circle>
				{/each}
			{:else if focus === 'io' && typed > 0 && typed <= tx.typed.length}
				{#key typed}
					<circle r="3.2" class="packet">
						<animateMotion dur="0.5s" fill="freeze" path="M178 192 V236" />
					</circle>
				{/key}
			{/if}
		{/if}
	</svg>
{/snippet}

<div class="wrap">
	<Guide {steps} {active} visual={laptop} onselect={canPeek ? select : undefined} />
</div>

<style>
	.wrap {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: flex-start;
		overflow-y: auto;
		padding-bottom: 7rem;
	}
	@media (min-width: 768px) {
		.wrap {
			align-items: center;
			padding-bottom: 1rem;
		}
	}
	.laptop {
		width: 100%;
		max-width: 400px;
		max-height: min(64vh, 520px);
	}
	@media (max-width: 767px) {
		.laptop {
			max-height: 46vh;
		}
	}
	.part {
		transition: opacity 0.4s ease;
		outline: none;
	}
	.part.dim {
		opacity: 0.28;
	}
	.part.faded {
		opacity: 0.55;
	}
	.part.tappable {
		cursor: pointer;
	}
	.part.tappable:hover,
	.part.tappable:focus-visible {
		opacity: 1;
		filter: drop-shadow(0 0 6px color-mix(in srgb, var(--color-brand) 45%, transparent));
	}
	.guideline {
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bd {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.display {
		fill: var(--color-brand-soft);
		transition: fill 0.5s ease;
	}
	.display.dark {
		fill: #1d2a36;
	}
	.sun {
		fill: var(--color-amber);
	}
	.hill {
		fill: var(--color-grass);
		opacity: 0.55;
	}
	.hill2 {
		fill: var(--color-grass);
	}
	.typed {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 19px;
		fill: var(--color-ink);
	}
	.caret {
		fill: var(--color-brand);
	}
	.offtag {
		font-size: 12px;
		font-weight: 700;
		fill: #c9d3dc;
	}
	.key {
		fill: var(--color-line);
		transition: fill 0.15s ease;
	}
	.key.down {
		fill: var(--color-brand);
	}
	.board {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.trace {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		opacity: 0.45;
		transition: opacity 0.4s ease;
	}
	.trace.hot {
		opacity: 1;
	}
	.port {
		fill: var(--color-muted);
	}
	.car {
		fill: var(--color-amber);
	}
	.chip {
		fill: var(--color-muted);
	}
	.die {
		fill: var(--color-faint);
		transition: fill 0.4s ease;
	}
	.die.busy {
		fill: var(--color-brand);
	}
	.chiptext {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		fill: var(--color-card);
	}
	.halo {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		opacity: 0.5;
	}
	.stick {
		fill: var(--color-grass);
		opacity: 0.85;
	}
	.mem {
		fill: var(--color-brand);
		transition: fill 0.4s ease;
	}
	.mem.keep {
		fill: var(--color-amber);
	}
	.mem.empty {
		fill: var(--color-card);
	}
	.pin {
		fill: var(--color-amber);
	}
	.cell {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.charge {
		fill: var(--color-grass);
		opacity: 0.75;
		transition: opacity 0.4s ease;
	}
	.charge.low {
		opacity: 0.15;
	}
	.packet {
		fill: var(--color-brand);
	}
	.spark {
		fill: var(--color-amber);
	}
	.cable {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
		transition: stroke 0.4s ease;
	}
	.cable.hot {
		stroke: var(--color-brand);
	}
	.label {
		font-size: 11.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.tag {
		font-size: 11px;
		font-weight: 800;
	}
	.tag.warn {
		fill: var(--color-danger);
	}
	.tag.ok {
		fill: var(--color-grass);
	}

	@media (prefers-reduced-motion: no-preference) {
		.paint .sun {
			animation: paint 4s ease infinite;
		}
		.paint .hill {
			animation: paint 4s ease 0.5s infinite;
		}
		.paint .hill2 {
			animation: paint 4s ease 1s infinite;
		}
		.pulse {
			transform-box: fill-box;
			transform-origin: center;
			animation: pulse 1.6s ease-out infinite;
		}
		.seq {
			animation: seq 2.4s ease-in-out infinite;
		}
		.flow {
			animation: seq 1.8s ease-in-out infinite;
		}
		.blink {
			animation: blink 1s steps(1) infinite;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.trace,
		.display,
		.mem,
		.die,
		.charge,
		.cable,
		.key {
			transition: none;
		}
	}
	@keyframes paint {
		0% {
			opacity: 0;
		}
		20%,
		90% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
	@keyframes pulse {
		0% {
			transform: scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: scale(1.18);
			opacity: 0;
		}
	}
	@keyframes seq {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.35;
		}
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}
</style>
