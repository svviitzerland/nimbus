<script lang="ts">
	// A real laptop, opened up. It starts whole (screen and keyboard, nothing else to see), then
	// the screws come out and the keyboard deck lifts away, and the parts are there inside, each in
	// the place it really sits. After that each beat lights up one part and a small animation shows
	// it at work, while the Guide panel explains it. On the last beat the learner may tap any part
	// to look at it again, nothing is required.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { HardwareText } from '$lib/chapters/basics/hardware/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as HardwareText);

	type Part = 'screen' | 'keyboard' | 'board' | 'cpu' | 'ram' | 'storage' | 'gpu' | 'battery';
	type Focus =
		| 'closed'
		| 'open'
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
		'closed',
		'open',
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
		closed: EVERY,
		open: EVERY,
		all: EVERY,
		board: ['board'],
		cpu: ['cpu'],
		ram: ['ram'],
		storage: ['storage'],
		flow: ['storage', 'ram', 'cpu'],
		memo: ['ram', 'storage', 'screen', 'battery'],
		gpu: ['gpu', 'screen'],
		power: ['battery', 'board'],
		io: ['keyboard', 'screen']
	};
	// which step a tap on a part opens
	const STEP_OF: Record<Part, number> = {
		board: 2,
		cpu: 3,
		ram: 4,
		storage: 5,
		gpu: 8,
		battery: 9,
		keyboard: 10,
		screen: 10
	};

	const last = $derived(FOCUS.length - 1);
	const fromBeat = $derived(Math.min(beat, last));
	let peek = $state<number | null>(null);
	let peekBeat = -1;
	const active = $derived(peek !== null && peekBeat === beat ? peek : fromBeat);
	const focus = $derived(FOCUS[active] ?? 'closed');
	const canPeek = $derived(beat >= tx.intro.length - 1);
	const lit = (p: Part) => LIT[focus].includes(p);
	const showLabel = (p: Part) => focus !== 'closed' && focus !== 'open' && lit(p);
	// the keyboard deck covers the inside while the laptop is whole, and again for typing
	const covered = $derived(focus === 'closed' || focus === 'io');

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
		const t = setInterval(() => (typed = typed >= len + 3 ? 0 : typed + 1), 560);
		return () => clearInterval(t);
	});
	const COLS = 13;
	const pressed = $derived(
		focus === 'io' && typed > 0 && typed <= tx.typed.length
			? 14 + ((tx.typed.charCodeAt(typed - 1) * 7) % 36)
			: -1
	);
	const keyX = (k: number) => 50 + (k % COLS) * 20 + 8.5;
	const keyY = (k: number) => 204 + Math.floor(k / COLS) * 18.5 + 7;

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
	// five rows of keys plus a short bottom row with the space bar
	const KEYS = Array.from({ length: COLS * 5 }, (_, k) => k);
	const TRACES = [
		'M60 222 H150 V238 H166',
		'M210 240 H218',
		'M210 256 H218',
		'M254 244 H262 V226',
		'M188 270 V280',
		'M281 262 V256 H254',
		'M60 292 H170',
		'M180 300 V270'
	];
	const SCREWS = [
		[42, 200],
		[318, 200],
		[42, 408],
		[318, 408]
	];
	const BLADES = [0, 1, 2, 3, 4, 5, 6];
</script>

{#snippet label(p: Part, x: number, y: number, say?: string, kind?: string)}
	{#if showLabel(p) || kind}
		{@const word = say ?? tx.labels[p]}
		{@const w = word.length * 6.6 + 16}
		<g class="pill {kind ?? ''}">
			<rect x={x - w / 2} y={y - 9} width={w} height="18" rx="9" />
			<text {x} {y} dy="0.35em" text-anchor="middle">{word}</text>
		</g>
	{/if}
{/snippet}

{#snippet laptop(_i: number)}
	<svg viewBox="0 0 360 430" class="laptop" role="img" aria-label={tx.picture}>
		<!-- the screen (the lid), opened all the way back so we look at it from above -->
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
			<rect x="40" y="8" width="280" height="172" rx="12" class="lid" />
			<circle cx="180" cy="14" r="2" class="cam" />
			<rect x="52" y="20" width="256" height="148" rx="4" class="display" class:dark={off} />
			{#if !off && focus !== 'io'}
				<g class:paint={focus === 'gpu'}>
					<circle cx="270" cy="52" r="13" class="sun" />
					<path
						d="M52 146 Q100 104 150 134 Q200 108 250 138 Q280 124 308 132 V168 H52 Z"
						class="hill"
					/>
					<path d="M52 168 V152 Q120 128 180 150 Q240 134 308 152 V168 Z" class="hill2" />
				</g>
			{/if}
			{#if focus === 'io'}
				<text x="76" y="96" class="typed">{tx.typed.slice(0, typed)}</text>
				<rect
					x={76 + typed * 11.6}
					y="80"
					width="2.5"
					height="21"
					class="caret"
					class:blink={!reduced}
				/>
			{/if}
			{#if off}
				<text x="180" y="98" text-anchor="middle" class="offtag">{tx.powerOff}</text>
			{/if}
			{@render label('screen', 180, 36)}
		</g>
		<rect x="60" y="180" width="240" height="8" rx="3" class="hinge" />

		<!-- the body, and the inside of it -->
		<rect x="30" y="188" width="300" height="232" rx="14" class="shell" />
		<rect x="40" y="196" width="280" height="216" rx="8" class="tray" />

		<!-- motherboard and its traces -->
		<g
			class="part"
			class:faded={!lit('board')}
			class:tappable={canPeek && !covered}
			role="button"
			tabindex={canPeek && !covered ? 0 : -1}
			aria-label={tx.labels.board}
			onclick={() => tap('board')}
			onkeydown={(e) => key(e, 'board')}
		>
			<rect x="48" y="202" width="264" height="98" rx="8" class="board" />
			{#each TRACES as d (d)}
				<path {d} class="trace" class:hot={focus === 'board' || focus === 'power'} />
			{/each}
			<!-- ports on the side of the board -->
			<rect x="44" y="232" width="8" height="12" rx="2" class="port" />
			<rect x="44" y="252" width="8" height="8" rx="2" class="port" />
			<rect x="308" y="236" width="8" height="12" rx="2" class="port" />
			{@render label('board', 100, 290)}
		</g>
		{#if focus === 'board' && !reduced}
			{#each TRACES as d, k (d)}
				<circle r="2.8" class="car">
					<animateMotion
						dur="{2 + (k % 3) * 0.6}s"
						begin="{k * 0.3}s"
						repeatCount="indefinite"
						path={d}
					/>
				</circle>
			{/each}
		{/if}

		<!-- the fan and its copper heat pipe, they keep the CPU cool -->
		<g class="part" class:dim={!lit('cpu')}>
			<path d="M118 243 H168" class="pipe" />
			<path d="M118 257 H168" class="pipe" />
			<circle cx="92" cy="250" r="29" class="fanbox" />
			<g class="fan" class:fast={focus === 'cpu' || focus === 'flow'} class:stop={off}>
				{#each BLADES as b (b)}
					<path
						d="M92 250 Q100 232 92 225 Q84 236 92 250 Z"
						class="blade"
						transform="rotate({(b * 360) / BLADES.length} 92 250)"
					/>
				{/each}
				<circle cx="92" cy="250" r="5" class="hub" />
			</g>
		</g>

		<!-- CPU -->
		<g
			class="part"
			class:dim={!lit('cpu')}
			class:tappable={canPeek && !covered}
			role="button"
			tabindex={canPeek && !covered ? 0 : -1}
			aria-label={tx.labels.cpu}
			onclick={() => tap('cpu')}
			onkeydown={(e) => key(e, 'cpu')}
		>
			{#if focus === 'cpu' || focus === 'flow'}
				<rect x="160" y="220" width="56" height="56" rx="9" class="halo" class:pulse={!reduced} />
			{/if}
			<rect x="166" y="226" width="44" height="44" rx="5" class="chip" />
			<rect
				x="174"
				y="234"
				width="28"
				height="28"
				rx="3"
				class="die"
				class:busy={focus === 'cpu'}
			/>
			<text x="188" y="248" dy="0.35em" text-anchor="middle" class="chiptext">CPU</text>
			{@render label('cpu', 188, 214)}
		</g>

		<!-- GPU -->
		<g
			class="part"
			class:dim={!lit('gpu')}
			class:tappable={canPeek && !covered}
			role="button"
			tabindex={canPeek && !covered ? 0 : -1}
			aria-label={tx.labels.gpu}
			onclick={() => tap('gpu')}
			onkeydown={(e) => key(e, 'gpu')}
		>
			<rect x="218" y="230" width="36" height="36" rx="4" class="chip" />
			<rect
				x="224"
				y="236"
				width="24"
				height="24"
				rx="3"
				class="die"
				class:busy={focus === 'gpu'}
			/>
			<text x="236" y="248" dy="0.35em" text-anchor="middle" class="chiptext small">GPU</text>
			{@render label('gpu', 236, 220)}
		</g>
		<!-- the display cable, from the board up through the hinge into the screen -->
		<path d="M236 230 V208 H180 V184" class="cable" class:hot={focus === 'gpu'} />

		<!-- RAM, two sticks lying flat like in a real laptop -->
		<g
			class="part"
			class:dim={!lit('ram')}
			class:tappable={canPeek && !covered}
			role="button"
			tabindex={canPeek && !covered ? 0 : -1}
			aria-label={tx.labels.ram}
			onclick={() => tap('ram')}
			onkeydown={(e) => key(e, 'ram')}
		>
			{#each [210, 232] as y, s (y)}
				<rect x="262" {y} width="44" height="16" rx="2" class="stick" />
				{#each [0, 1, 2, 3] as c (c)}
					<rect
						x={265 + c * 10}
						y={y + 3}
						width="8"
						height="10"
						rx="1.5"
						class="mem"
						class:empty={off}
						class:seq={focus === 'ram' && !reduced}
						style="animation-delay:{(s * 4 + c) * 0.18}s"
					/>
				{/each}
			{/each}
			{#if off}
				{@render label('ram', 284, 260, tx.cleared, 'warn')}
			{:else}
				{@render label('ram', 284, 260)}
			{/if}
		</g>

		<!-- a small wifi card, just so the board looks like the real thing -->
		<rect x="270" y="268" width="24" height="18" rx="2" class="wifi" />

		<!-- storage, an SSD stick -->
		<g
			class="part"
			class:dim={!lit('storage')}
			class:tappable={canPeek && !covered}
			role="button"
			tabindex={canPeek && !covered ? 0 : -1}
			aria-label={tx.labels.storage}
			onclick={() => tap('storage')}
			onkeydown={(e) => key(e, 'storage')}
		>
			<rect x="170" y="280" width="86" height="14" rx="3" class="stick" />
			{#each [0, 1, 2] as c (c)}
				<rect
					x={176 + c * 24}
					y="283"
					width="20"
					height="8"
					rx="1.5"
					class="mem keep"
					class:seq={focus === 'storage' && !reduced}
					style="animation-delay:{c * 0.5}s"
				/>
			{/each}
			<rect x="249" y="283" width="4" height="8" rx="1" class="pin" />
			{#if off}
				{@render label('storage', 140, 287, tx.kept, 'ok')}
			{:else}
				{@render label('storage', 140, 287)}
			{/if}
		</g>

		<!-- battery under the palm rest, with a speaker on each side -->
		<rect x="42" y="316" width="10" height="76" rx="4" class="speaker" />
		<rect x="308" y="316" width="10" height="76" rx="4" class="speaker" />
		<g
			class="part"
			class:dim={!lit('battery')}
			class:tappable={canPeek && !covered}
			role="button"
			tabindex={canPeek && !covered ? 0 : -1}
			aria-label={tx.labels.battery}
			onclick={() => tap('battery')}
			onkeydown={(e) => key(e, 'battery')}
		>
			<rect x="172" y="298" width="16" height="14" rx="2" class="port" />
			<rect x="58" y="310" width="244" height="90" rx="8" class="pack" />
			{#each [0, 1, 2] as c (c)}
				<rect x={66 + c * 78} y="318" width="72" height="74" rx="6" class="cell" />
				<rect
					x={66 + c * 78}
					y="318"
					width="72"
					height="74"
					rx="6"
					class="charge"
					class:low={off}
					class:flow={focus === 'power' && !reduced}
					style="animation-delay:{c * 0.4}s"
				/>
			{/each}
			{@render label('battery', 180, 355)}
		</g>

		<!-- moving data, each little packet is a piece of work travelling between parts -->
		{#if !reduced}
			{#if focus === 'flow'}
				<rect x="-6" y="-5" width="12" height="10" rx="2" class="packet">
					<animateMotion dur="3s" repeatCount="indefinite" path="M256 287 H284 V226 L210 248" />
				</rect>
			{:else if focus === 'power'}
				{#each [0, 1, 2] as k (k)}
					<circle r="3.2" class="spark">
						<animateMotion
							dur="1.8s"
							begin="{k * 0.6}s"
							repeatCount="indefinite"
							path="M180 340 V300 V270"
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
							path="M236 230 V208 H180 V150"
						/>
					</circle>
				{/each}
			{/if}
		{/if}

		<!-- the keyboard deck (top case). It sits on top while the laptop is whole, then the
		     screws come out and it lifts away so we can see inside. -->
		<g
			class="deck"
			class:lifted={!covered}
			aria-hidden={!covered}
			role="button"
			tabindex={canPeek && covered ? 0 : -1}
			aria-label={tx.labels.keyboard}
			onclick={() => covered && tap('keyboard')}
			onkeydown={(e) => covered && key(e, 'keyboard')}
		>
			<rect x="30" y="188" width="300" height="232" rx="14" class="topcase" />
			<rect x="46" y="200" width="268" height="114" rx="6" class="well" />
			{#each KEYS as k (k)}
				<rect
					x={50 + (k % COLS) * 20}
					y={204 + Math.floor(k / COLS) * 18.5}
					width="17"
					height="14"
					rx="2.5"
					class="key"
					class:down={k === pressed}
				/>
			{/each}
			<rect x="50" y="296.5" width="37" height="14" rx="2.5" class="key" />
			<rect x="90" y="296.5" width="157" height="14" rx="2.5" class="key" />
			<rect x="250" y="296.5" width="57" height="14" rx="2.5" class="key" />
			<rect x="128" y="328" width="104" height="72" rx="8" class="pad" />
			{@render label('keyboard', 180, 196)}
		</g>
		{#if focus === 'io' && pressed >= 0 && !reduced}
			{#key typed}
				<circle r="3.4" class="packet">
					<animateMotion
						dur="0.5s"
						fill="freeze"
						path="M{keyX(pressed)} {keyY(pressed)} L180 184 V110"
					/>
				</circle>
			{/key}
		{/if}
		{#each SCREWS as [x, y], k (k)}
			<g class="screw" class:out={!covered} style="transition-delay:{covered ? 0 : k * 0.08}s">
				<circle cx={x} cy={y} r="4" />
				<path d="M{x - 2.2} {y} H{x + 2.2} M{x} {y - 2.2} V{y + 2.2}" />
			</g>
		{/each}
	</svg>
{/snippet}

<div class="wrap">
	<Guide {steps} {active} visual={laptop} onselect={canPeek ? select : undefined} />
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
	}
	.laptop {
		width: 100%;
		max-width: 400px;
		max-height: min(60vh, 520px);
		overflow: visible;
	}
	@media (max-width: 767px) {
		.laptop {
			max-height: 44vh;
		}
	}
	.part {
		transition: opacity 0.4s ease;
		outline: none;
	}
	.part.dim {
		opacity: 0.25;
	}
	.part.faded {
		opacity: 0.6;
	}
	.part.tappable {
		cursor: pointer;
	}
	.part.tappable:hover,
	.part.tappable:focus-visible {
		opacity: 1;
		filter: drop-shadow(0 0 6px color-mix(in srgb, var(--color-brand) 45%, transparent));
	}
	.lid {
		fill: #2b3742;
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.cam {
		fill: #56636f;
	}
	.hinge {
		fill: var(--color-muted);
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.tray {
		fill: color-mix(in srgb, var(--color-ink) 7%, var(--color-card));
	}
	.display {
		fill: var(--color-brand-soft);
		transition: fill 0.5s ease;
	}
	.display.dark {
		fill: #141d26;
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
	.board {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.trace {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.2;
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
	.pipe {
		stroke: #c98a4b;
		stroke-width: 5;
		stroke-linecap: round;
	}
	.fanbox {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.blade {
		fill: color-mix(in srgb, var(--color-muted) 55%, var(--color-card));
	}
	.hub {
		fill: var(--color-muted);
	}
	.fan {
		transform-box: fill-box;
		transform-origin: center;
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
		font-size: 9.5px;
		font-weight: 800;
		letter-spacing: 0.05em;
		fill: var(--color-card);
	}
	.chiptext.small {
		font-size: 8.5px;
	}
	.halo {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		opacity: 0.5;
	}
	.stick {
		fill: var(--color-grass);
		opacity: 0.9;
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
	.wifi {
		fill: var(--color-faint);
	}
	.speaker {
		fill: var(--color-line);
	}
	.pack {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.cell {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.charge {
		fill: var(--color-grass);
		opacity: 0.7;
		transition: opacity 0.4s ease;
	}
	.charge.low {
		opacity: 0.12;
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
	.pill rect {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 1.2;
	}
	.pill text {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.pill.warn rect {
		stroke: var(--color-danger);
	}
	.pill.warn text {
		fill: var(--color-danger);
	}
	.pill.ok rect {
		stroke: var(--color-grass);
	}
	.pill.ok text {
		fill: var(--color-grass);
	}

	/* the keyboard deck and its screws */
	.deck {
		transform-box: fill-box;
		transform-origin: 50% 0%;
		outline: none;
		transition:
			transform 0.7s cubic-bezier(0.5, 0, 0.3, 1),
			opacity 0.45s ease;
	}
	.deck.lifted {
		transform: translate(70px, -36px) rotate(9deg) scale(1.04);
		opacity: 0;
		pointer-events: none;
		transition:
			transform 1s cubic-bezier(0.5, 0, 0.3, 1) 0.5s,
			opacity 0.5s ease 0.9s;
	}
	.topcase {
		fill: #e9edf1;
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.well {
		fill: #d6dde4;
	}
	.key {
		fill: #fbfcfd;
		transition: fill 0.15s ease;
	}
	.key.down {
		fill: var(--color-brand);
	}
	.pad {
		fill: #dfe5eb;
		stroke: #c6cfd8;
		stroke-width: 1;
	}
	.screw {
		transform-box: fill-box;
		transform-origin: center;
		transition:
			transform 0.45s ease,
			opacity 0.45s ease;
	}
	.screw circle {
		fill: #b8c2cc;
		stroke: #8a96a2;
		stroke-width: 1;
	}
	.screw path {
		stroke: #5f6b77;
		stroke-width: 1.2;
		stroke-linecap: round;
	}
	.screw.out {
		transform: translateY(-12px) rotate(200deg);
		opacity: 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		.fan {
			animation: spin 2.4s linear infinite;
		}
		.fan.fast {
			animation-duration: 0.6s;
		}
		.fan.stop {
			animation-play-state: paused;
		}
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
		.key,
		.deck,
		.deck.lifted,
		.screw {
			transition: none;
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
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
