<script lang="ts">
	// Guided "watch" stage. First a flag on a hill (the game, the flag text, the permission sign),
	// then a tiny harmless CTF puzzle, a note in the Caesar cipher, that solves itself letter by
	// letter following Nim's beats. Two alphabet strips show the slide, the letter being decoded
	// lights up on both, and the captured flag goes up the pole. The only optional play, on the
	// last beat, is a new note and a slider to find its slide.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CtfText } from '$lib/chapters/security/ctf/types';
	import { sceneClock } from './shipit/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as CtfText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));
	const live = $derived(beat >= tx.intro.length - 1 && peek === null);

	const ABC = 'abcdefghijklmnopqrstuvwxyz';
	const slide = (s: string, n: number) =>
		[...s]
			.map((ch) => {
				const k = ABC.indexOf(ch);
				return k < 0 ? ch : ABC[(((k + n) % 26) + 26) % 26];
			})
			.join('');

	const FLAG1 = 'nimbus{salad}';
	const KEY1 = 3;
	const FLAG2 = 'nimbus{cloud}';
	const KEY2 = 7;
	const NOTE1 = slide(FLAG1, KEY1);
	const NOTE2 = slide(FLAG2, KEY2);

	let userShift = $state(0);
	let solvedOnce = false;
	function onShift(e: Event) {
		userShift = Number((e.currentTarget as HTMLInputElement).value);
		if (userShift === KEY2 && !solvedOnce) {
			solvedOnce = true;
			onstate?.('solved');
		} else if (userShift !== KEY2) {
			solvedOnce = false;
		}
	}

	const clock = sceneClock(() => step);
	const t = $derived(clock.t);

	const puzzle = $derived(step >= 3);
	const second = $derived(step === last);
	const note = $derived(second ? NOTE2 : NOTE1);
	const key = $derived(second ? (live ? userShift : KEY2) : KEY1);
	/** How many letters of the note are decoded so far. */
	const solved = $derived.by(() => {
		if (second) return note.length;
		if (step === 3) return 0;
		if (step === 4) return Math.max(0, Math.min(note.length, Math.floor((t - 500) / 650) + 1));
		return note.length;
	});
	const plain = $derived(slide(note, -key));
	const current = $derived(step === 4 && solved > 0 && solved <= note.length ? solved - 1 : -1);
	const captured = $derived(second ? key === KEY2 : step >= 5);
	const flagText = $derived(second ? FLAG2 : FLAG1);

	// Geometry, 13 boxes for the note and 26 cells per alphabet strip.
	const BOX = 26;
	const bx = (k: number) => 200 - (note.length * BOX) / 2 + k * BOX;
	const CELL = 14;
	const cx = (j: number) => 18 + j * CELL;
	/** Strip cells to light up, the plain letter on top and its slid partner below. */
	const lit = $derived.by(() => {
		if (current >= 0) {
			const j = ABC.indexOf(plain[current]);
			return j;
		}
		if (step === 3) return 0;
		return -1;
	});
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if live}
			<label class="slider">
				<span>{tx.shiftLabel.replace('{n}', String(userShift))}</span>
				<input type="range" min="0" max="25" value={userShift} oninput={onShift} />
			</label>
		{/if}
		<svg viewBox="0 0 400 300" class="scene" role="img" aria-label={tx.steps[i].title}>
			{#if !puzzle}
				<!-- the game, a flag on a hill -->
				<g in:fade={{ duration: 300 }}>
					<path d="M20 290Q200 170 380 290Z" class="hill" />
					<line x1="200" y1="60" x2="200" y2="232" class="pole" />
					<circle cx="200" cy="58" r="5" class="knob" />
					<g class="wave">
						<path d="M202 66h128l-16 30l16 30h-128Z" class="pennant" />
						{#if i >= 1}
							<text x="258" y="101" text-anchor="middle" class="ftext" in:fade={{ duration: 400 }}
								>{'nimbus{...}'}</text
							>
						{/if}
					</g>
					{#if i === 2}
						<g in:fade={{ duration: 400 }}>
							<line x1="96" y1="196" x2="96" y2="250" class="post" />
							<rect x="30" y="166" width="132" height="34" rx="6" class="sign" />
							<text x="96" y="188" text-anchor="middle" class="signT">{tx.sign}</text>
						</g>
					{/if}
				</g>
			{:else}
				<!-- the note and its decoding -->
				<text x="200" y="16" text-anchor="middle" class="cap">{tx.noteLabel}</text>
				{#each [...note] as ch, k (k)}
					<rect
						x={bx(k) + 1}
						y="24"
						width={BOX - 2}
						height="28"
						rx="5"
						class="box"
						class:cur={k === current}
					/>
					<text x={bx(k) + BOX / 2} y="44" text-anchor="middle" class="ch">{ch}</text>
					<rect
						x={bx(k) + 1}
						y="74"
						width={BOX - 2}
						height="28"
						rx="5"
						class="box plain"
						class:done={k < solved}
						class:good={captured}
					/>
					{#if k < solved}
						{#key `${k}-${key}`}
							<text
								x={bx(k) + BOX / 2}
								y="94"
								text-anchor="middle"
								class="ch out"
								class:good={captured}
								in:fade={{ duration: 250 }}>{plain[k]}</text
							>
						{/key}
					{/if}
				{/each}
				{#if current >= 0}
					<path d="M{bx(current) + BOX / 2} 55v15" class="arrow" />
					<path d="M{bx(current) + BOX / 2 - 4} 66l4 5l4 -5" class="arrow" />
				{/if}

				<text x="200" y="134" text-anchor="middle" class="cap"
					>{tx.stripCap.replace('{n}', String(key))}</text
				>
				{#each [...ABC] as a, j (j)}
					<rect
						x={cx(j)}
						y="142"
						width={CELL - 1}
						height="20"
						rx="3"
						class="cell"
						class:hl={j === lit}
					/>
					<text x={cx(j) + CELL / 2 - 0.5} y="156" text-anchor="middle" class="sch">{a}</text>
					<rect
						x={cx(j)}
						y="165"
						width={CELL - 1}
						height="20"
						rx="3"
						class="cell low"
						class:hl={j === lit}
					/>
					<text x={cx(j) + CELL / 2 - 0.5} y="179" text-anchor="middle" class="sch low"
						>{ABC[(j + key) % 26]}</text
					>
				{/each}

				<!-- the captured flag -->
				<line x1="80" y1="204" x2="80" y2="292" class="pole" />
				<circle cx="80" cy="202" r="4" class="knob" />
				{#if captured}
					{#key flagText}
						<g class="raise">
							<path d="M82 208h200l-14 22l14 22h-200Z" class="pennant good" />
							<text x="176" y="235" text-anchor="middle" class="ftext big">{flagText}</text>
						</g>
					{/key}
				{/if}
			{/if}
		</svg>
		{#if step === 3}
			<!-- the man behind the cipher (public domain photo of a Roman bust) -->
			<figure class="bust">
				<img
					src="/images/people/julius-caesar.jpg"
					alt={tx.caesar.alt}
					width="500"
					height="906"
					loading="lazy"
					decoding="async"
				/>
				<figcaption>{tx.caesar.caption}</figcaption>
			</figure>
		{/if}
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		justify-content: center;
		overflow-x: hidden;
		padding: 0 4px 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.bust {
		margin: 0;
		width: 92px;
		transform: rotate(-2deg);
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		padding: 5px 5px 6px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.12);
	}
	.bust img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 3px;
	}
	.bust figcaption {
		margin-top: 4px;
		font-size: 9.5px;
		line-height: 1.3;
		text-align: center;
		color: var(--color-muted);
	}
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		display: block;
		width: 100%;
		max-width: 430px;
		height: auto;
	}
	.slider {
		display: flex;
		width: min(100%, 340px);
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 8px 16px 10px;
		font-size: 13.5px;
		font-weight: 700;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.slider input {
		width: 100%;
		accent-color: var(--color-brand);
	}
	.hill {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.pole {
		stroke: var(--color-faint);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.post {
		stroke: var(--color-line);
		stroke-width: 5;
		stroke-linecap: round;
	}
	.knob {
		fill: var(--color-amber);
	}
	.pennant {
		fill: var(--color-danger);
	}
	.pennant.good {
		fill: var(--color-grass);
	}
	.wave {
		transform-box: fill-box;
		transform-origin: left center;
		animation: wave 2.6s ease-in-out infinite alternate;
	}
	.ftext {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.ftext.big {
		font-size: 15px;
	}
	.sign {
		fill: var(--color-card);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.signT {
		font-size: 11.5px;
		font-weight: 800;
		fill: var(--color-grass);
	}
	.cap {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.box {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.25s,
			fill 0.25s;
	}
	.box.cur {
		stroke: var(--color-brand);
		stroke-width: 2.5;
	}
	.box.plain {
		fill: var(--color-paper);
	}
	.box.plain.done {
		fill: var(--color-brand-soft);
	}
	.box.plain.good {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.ch {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.ch.out {
		fill: var(--color-brand);
	}
	.ch.out.good {
		fill: var(--color-grass);
	}
	.arrow {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.cell {
		fill: var(--color-card);
		stroke: var(--color-line);
		transition: fill 0.25s;
	}
	.cell.low {
		fill: var(--color-paper);
	}
	.cell.hl {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
	}
	.sch {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.sch.low {
		fill: var(--color-brand);
	}
	.raise {
		animation: raise 0.8s ease-out both;
	}
	@keyframes wave {
		from {
			transform: skewY(-2deg);
		}
		to {
			transform: skewY(2deg);
		}
	}
	@keyframes raise {
		from {
			transform: translateY(40px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.wave,
		.raise {
			animation: none;
		}
		.box,
		.cell {
			transition: none;
		}
	}
</style>
