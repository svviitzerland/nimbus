<script lang="ts">
	// Bits and bytes as a guided story. The picture follows Nim's beats by itself (a switch
	// blinking, a byte filling up, the letters of nimbus, a photo made of dots, boxes growing
	// from byte to GB). The last scene lets the learner flip the switches, which is optional.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { BinaryText } from '$lib/chapters/basics/binary/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as BinaryText);

	/** Beat index to scene index (the two [ingat] beats and the [fyi] keep the scene before). */
	const STEP_OF_BEAT = [0, 1, 1, 2, 3, 3, 4, 5, 5, 6];
	const WORD = 'nimbus';
	const VALUES = [128, 64, 32, 16, 8, 4, 2, 1];
	const bitsOf = (c: string) => VALUES.map((v) => (c.charCodeAt(0) & v ? 1 : 0));
	const N_BITS = bitsOf('n');
	/** A few patterns the byte scene cycles through, just to show the switches are free. */
	const PATTERNS = ['10110010', '01101110', '11100101', '00111100', '01010101'].map((p) =>
		[...p].map(Number)
	);
	/** Box sizes in px for byte, KB, MB, GB. */
	const BOX = [12, 28, 58, 100];

	let peek = $state<number | null>(null);
	const step = $derived(peek ?? STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)]);
	let reduced = $state(false);

	// a new beat always brings the story back from a peek
	$effect(() => {
		void beat;
		peek = null;
	});

	// guided lesson, nothing to unlock, visible while Nim narrates
	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof window !== 'undefined' && window.matchMedia) {
			reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// one slow clock drives the self playing scenes, restarted whenever the scene changes
	let tick = $state(0);
	$effect(() => {
		void step;
		if (reduced) {
			tick = 99;
			return;
		}
		tick = 0;
		const t = setInterval(() => (tick += 1), 520);
		return () => clearInterval(t);
	});

	const lit = $derived(reduced ? true : tick % 4 < 2);
	const pattern = $derived(reduced ? N_BITS : PATTERNS[Math.floor(tick / 3) % PATTERNS.length]);
	const letterBits = $derived(N_BITS.map((b, i) => (tick > i ? b : 0)));
	const rows = $derived(Math.min(WORD.length, Math.floor(tick / 2) + 1));
	const boxes = $derived(Math.min(BOX.length, Math.floor(tick / 2) + 1));

	// the optional play scene, starting from the letter n
	let mine = $state<number[]>([...N_BITS]);
	let flipped = false;
	let foundLetter = false;
	const myNum = $derived(mine.reduce((s, b, i) => s + (b ? VALUES[i] : 0), 0));
	const myLetter = $derived(myNum >= 97 && myNum <= 122 ? String.fromCharCode(myNum) : null);

	function flip(i: number) {
		mine[i] = mine[i] ? 0 : 1;
		const sum = mine.reduce((s, b, k) => s + (b ? VALUES[k] : 0), 0);
		const isNew = sum >= 97 && sum <= 122 && sum !== 110;
		if (isNew && !foundLetter) {
			foundLetter = true;
			flipped = true;
			onstate?.('letter');
		} else if (!flipped) {
			flipped = true;
			onstate?.('flip');
		}
	}

	/** A tiny photo, 12 by 8 dots, a sun over green hills. */
	const W = 12;
	const H = 8;
	const CELL = 14;
	function dot(x: number, y: number) {
		const hill = 5 + Math.round(Math.sin((x + 1) / 2.2) * 1.2);
		if (y >= hill)
			return y >= 7
				? 'var(--color-grass)'
				: 'color-mix(in srgb, var(--color-grass) 70%, var(--color-card))';
		if ((x - 8.5) ** 2 + (y - 2) ** 2 < 3) return 'var(--color-amber)';
		return y < 3
			? 'color-mix(in srgb, var(--color-brand) 45%, var(--color-card))'
			: 'color-mix(in srgb, var(--color-brand) 25%, var(--color-card))';
	}
	const PICKED = { x: 8, y: 2 };
	const RGB = [
		{ c: 'var(--color-danger)', v: 0.95 },
		{ c: 'var(--color-grass)', v: 0.7 },
		{ c: 'var(--color-brand)', v: 0.2 }
	];
	const fill = (s: string, map: Record<string, string | number>) =>
		Object.entries(map).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), s);
</script>

{#snippet sw(on: boolean, digit = true)}
	<span class="sw-wrap">
		<span class="sw" class:on><span class="knob"></span></span>
		{#if digit}<span class="digit" class:on>{on ? 1 : 0}</span>{/if}
	</span>
{/snippet}

{#snippet visual(s: number)}
	<div class="scene" class:still={reduced}>
		{#if s === 0}
			<div class="one">
				<svg class="bulb" viewBox="0 0 80 110" aria-hidden="true">
					<circle cx="40" cy="42" r="38" class="glow" class:lit />
					<circle
						cx="40"
						cy="42"
						r="26"
						fill={lit ? 'var(--color-amber)' : 'var(--color-card)'}
						stroke={lit ? 'var(--color-amber)' : 'var(--color-line)'}
						stroke-width="3"
						class="glass"
					/>
					<rect x="28" y="70" width="24" height="8" rx="2" fill="var(--color-faint)" />
					<rect x="30" y="80" width="20" height="7" rx="2" fill="var(--color-faint)" />
					<rect x="34" y="89" width="12" height="6" rx="3" fill="var(--color-faint)" />
				</svg>
				<div class="big">
					<div class="plate">
						<span class="sw large" class:on={lit}><span class="knob"></span></span>
					</div>
					<span class="bigdigit" class:on={lit}>{lit ? 1 : 0}</span>
					<span class="word">{lit ? tx.on : tx.off}</span>
				</div>
			</div>
		{:else if s === 1}
			<div class="col">
				<span class="label">{tx.bitLabel}</span>
				<div class="bracket top"></div>
				<div class="row">
					{#each pattern as b, i (i)}{@render sw(b === 1)}{/each}
				</div>
				<div class="bracket"></div>
				<span class="pill">{tx.byteLabel}</span>
				<span class="trick">{tx.byteTrick}</span>
			</div>
		{:else if s === 2}
			<div class="col">
				<div class="key">n</div>
				<span class="small">{tx.keyLabel}</span>
				<svg class="down" viewBox="0 0 20 24" aria-hidden="true"
					><path d="M10 2v18M4 14l6 6 6-6" /></svg
				>
				<div class="row">
					{#each letterBits as b, i (i)}{@render sw(b === 1)}{/each}
				</div>
				<div class="result" class:show={tick > 8}>
					<span class="chip">{fill(tx.numberLabel, { n: 110 })}</span>
					<svg class="right" viewBox="0 0 24 20" aria-hidden="true"
						><path d="M2 10h18M14 4l6 6-6 6" /></svg
					>
					<span class="chip strong">{fill(tx.letterLabel, { c: 'n' })}</span>
				</div>
			</div>
		{:else if s === 3}
			<div class="col">
				<div class="words">
					{#each WORD as c, r (r)}
						<div class="wrow" class:show={r < rows}>
							<span class="key mini">{c}</span>
							<span class="cells">
								{#each bitsOf(c) as b, i (i)}<span class="cell" class:on={b === 1}></span>{/each}
							</span>
						</div>
					{/each}
				</div>
				<span class="note" class:show={rows >= WORD.length}
					>{fill(tx.wordNote, { b: WORD.length, n: WORD.length * 8 })}</span
				>
			</div>
		{:else if s === 4}
			<svg class="photo" viewBox="0 0 320 150" role="img" aria-label={tx.steps[4].title}>
				<rect
					x="2"
					y="12"
					width={W * CELL + 8}
					height={H * CELL + 8}
					rx="10"
					fill="var(--color-card)"
					stroke="var(--color-line)"
					stroke-width="1.5"
				/>
				{#each Array(H) as _, y (y)}
					{#each Array(W) as _, x (x)}
						<rect
							x={6 + x * CELL}
							y={16 + y * CELL}
							width={CELL - 1}
							height={CELL - 1}
							rx="2"
							fill={dot(x, y)}
						/>
					{/each}
				{/each}
				<rect
					x={6 + PICKED.x * CELL - 2}
					y={16 + PICKED.y * CELL - 2}
					width={CELL + 3}
					height={CELL + 3}
					rx="3"
					fill="none"
					stroke="var(--color-ink)"
					stroke-width="2"
					class="pick"
				/>
				<path
					d="M{6 + PICKED.x * CELL + CELL + 2} {16 + PICKED.y * CELL + 6} L196 40"
					stroke="var(--color-faint)"
					stroke-width="1.2"
					fill="none"
				/>
				<g class="callout">
					<rect
						x="196"
						y="18"
						width="120"
						height="104"
						rx="12"
						fill="var(--color-card)"
						stroke="var(--color-line)"
						stroke-width="1.5"
					/>
					<text x="208" y="38" class="t-head">{tx.dotNote}</text>
					{#each RGB as c, i (i)}
						<g transform="translate(208 {50 + i * 22})">
							<rect width="56" height="10" rx="5" fill="var(--color-line)" />
							<rect
								width={56 * c.v}
								height="10"
								rx="5"
								fill={c.c}
								class="bar"
								style="animation-delay:{i * 0.35}s"
							/>
							<text x="62" y="5" dy="0.35em" class="t-small">{tx.colors[i]}</text>
						</g>
					{/each}
					<text x="208" y="116" class="t-faint">3 × {tx.oneByte}</text>
				</g>
			</svg>
		{:else if s === 5}
			<div class="col">
				<div class="boxes">
					{#each tx.boxes as b, i (i)}
						<div class="bx" class:show={i < boxes} style="--s:{BOX[i]}px">
							<span class="unit">{b.unit}</span>
							<span class="box" style="width:{BOX[i]}px;height:{BOX[i]}px"></span>
							<span class="what">{b.what}</span>
						</div>
					{/each}
				</div>
				<span class="note show">{tx.boxNote}</span>
				<span class="trick">{tx.sizeTrick}</span>
			</div>
		{:else}
			<div class="col">
				<span class="label">{tx.playHint}</span>
				<div class="row">
					{#each mine as b, i (i)}
						<button
							type="button"
							class="flip"
							role="switch"
							aria-checked={b === 1}
							aria-label={fill(tx.flipLabel, { i: i + 1 })}
							onclick={() => flip(i)}>{@render sw(b === 1)}</button
						>
					{/each}
				</div>
				<div class="result show">
					<span class="chip">{fill(tx.numberLabel, { n: myNum })}</span>
					<svg class="right" viewBox="0 0 24 20" aria-hidden="true"
						><path d="M2 10h18M14 4l6 6-6 6" /></svg
					>
					{#if myLetter}
						<span class="chip strong">{fill(tx.letterLabel, { c: myLetter })}</span>
					{:else}
						<span class="chip">{tx.notLetter}</span>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/snippet}

<div
	class="flex h-full w-full items-start justify-center overflow-y-auto pb-28 md:items-center md:pb-4"
>
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.scene {
		display: flex;
		width: 100%;
		min-height: 290px;
		align-items: center;
		justify-content: center;
	}
	.col {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.row {
		display: flex;
		gap: 8px;
	}
	.label {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.small {
		font-size: 12px;
		color: var(--color-faint);
	}
	.pill {
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 4px 14px;
		font-size: 14px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.trick {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 3px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.bracket {
		width: calc(8 * 26px + 7 * 8px);
		height: 10px;
		border: 2px solid var(--color-line);
		border-top: none;
		border-radius: 0 0 10px 10px;
	}
	.bracket.top {
		border-top: 2px solid var(--color-line);
		border-bottom: none;
		border-radius: 10px 10px 0 0;
	}

	/* the switch, a little rocker with its digit underneath */
	.sw-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.sw {
		position: relative;
		display: block;
		width: 26px;
		height: 44px;
		border: 1.5px solid var(--color-line);
		border-radius: 13px;
		background: var(--color-card);
		transition:
			background 0.35s,
			border-color 0.35s;
	}
	.knob {
		position: absolute;
		left: 3px;
		top: 22px;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: var(--color-faint);
		transition:
			top 0.35s cubic-bezier(0.3, 0.8, 0.3, 1),
			background 0.35s;
	}
	.sw.on {
		border-color: var(--color-brand);
		background: var(--color-brand);
	}
	.sw.on .knob {
		top: 3px;
		background: var(--color-card);
	}
	.digit {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.digit.on {
		color: var(--color-brand);
	}

	/* scene 0, one switch and a bulb */
	.one {
		display: flex;
		align-items: center;
		gap: 36px;
	}
	.bulb {
		width: 96px;
	}
	.glow {
		fill: var(--color-amber);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.glow.lit {
		opacity: 0.18;
	}
	.glass {
		transition:
			fill 0.4s,
			stroke 0.4s;
	}
	.big {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.plate {
		border: 1.5px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 14px 18px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.sw.large {
		width: 44px;
		height: 76px;
		border-radius: 22px;
	}
	.sw.large .knob {
		left: 5px;
		top: 38px;
		width: 31px;
		height: 31px;
	}
	.sw.large.on .knob {
		top: 5px;
	}
	.bigdigit {
		font-family: var(--font-display);
		font-size: 40px;
		font-weight: 600;
		line-height: 1;
		color: var(--color-faint);
		transition: color 0.35s;
	}
	.bigdigit.on {
		color: var(--color-brand);
	}
	.word {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}

	/* scene 2, a key becomes a byte */
	.key {
		display: grid;
		width: 52px;
		height: 52px;
		place-items: center;
		border: 1.5px solid var(--color-line);
		border-bottom-width: 4px;
		border-radius: 12px;
		background: var(--color-card);
		font-family: var(--font-display);
		font-size: 24px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.key.mini {
		width: 30px;
		height: 30px;
		border-bottom-width: 3px;
		border-radius: 8px;
		font-size: 15px;
	}
	.down,
	.right {
		width: 18px;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.right {
		width: 20px;
	}
	.result {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 4px;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.5s,
			transform 0.5s;
	}
	.result.show {
		opacity: 1;
		transform: none;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 4px 12px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chip.strong {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}

	/* scene 3, nimbus byte by byte */
	.words {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.wrow {
		display: flex;
		align-items: center;
		gap: 10px;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.45s,
			transform 0.45s;
	}
	.wrow.show {
		opacity: 1;
		transform: none;
	}
	.cells {
		display: flex;
		gap: 4px;
	}
	.cell {
		width: 18px;
		height: 18px;
		border: 1.5px solid var(--color-line);
		border-radius: 5px;
		background: var(--color-card);
	}
	.cell.on {
		border-color: var(--color-brand);
		background: var(--color-brand);
	}
	.note {
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		opacity: 0;
		transition: opacity 0.5s;
	}
	.note.show {
		opacity: 1;
	}

	/* scene 4, a photo of dots */
	.photo {
		width: 100%;
		max-width: 420px;
	}
	.pick {
		animation: blink 2s ease-in-out infinite;
	}
	.bar {
		transform-box: fill-box;
		transform-origin: left center;
		animation: grow 0.8s cubic-bezier(0.3, 0.8, 0.3, 1) both;
	}
	.t-head {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.t-small {
		font-size: 11px;
		fill: var(--color-muted);
	}
	.t-faint {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-faint);
	}

	/* scene 5, growing boxes */
	.boxes {
		display: flex;
		align-items: flex-end;
		gap: 8px;
	}
	.bx {
		display: flex;
		width: max(68px, var(--s));
		flex-direction: column;
		align-items: center;
		gap: 6px;
		opacity: 0;
		transform: scale(0.6);
		transform-origin: bottom center;
		transition:
			opacity 0.5s,
			transform 0.6s cubic-bezier(0.3, 0.8, 0.3, 1.2);
	}
	.bx.show {
		opacity: 1;
		transform: none;
	}
	.unit {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.box {
		display: block;
		border: 2px solid var(--color-brand);
		border-radius: 8px;
		background: var(--color-brand-soft);
	}
	.what {
		min-height: 32px;
		text-align: center;
		font-size: 12px;
		line-height: 1.3;
		color: var(--color-muted);
	}

	/* scene 6, the optional play */
	.flip {
		border-radius: 12px;
		padding: 2px;
		cursor: pointer;
	}
	.flip:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	@keyframes blink {
		50% {
			opacity: 0.35;
		}
	}
	@keyframes grow {
		from {
			transform: scaleX(0);
		}
	}
	@media (max-width: 767px) {
		.scene {
			min-height: 250px;
		}
		.row {
			gap: 5px;
		}
		.bracket {
			width: calc(8 * 26px + 7 * 5px);
		}
		.one {
			gap: 24px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sw,
		.knob,
		.glow,
		.glass,
		.bigdigit,
		.result,
		.wrow,
		.note,
		.bx {
			transition: none;
		}
		.pick,
		.bar {
			animation: none;
		}
	}
</style>
