<script lang="ts">
	// A guided "watch" stage for LLMs. One phone tells the whole story by itself. A chat reply
	// types word by word, the keyboard suggests the next word, a sentence falls apart into tokens
	// with their numbers, then the model shows its top guesses as bars, picks one, adds it, and
	// guesses again. The temperature scene flattens and sharpens the bars. The only optional
	// play is rolling a new ending on the last beat.
	import { fade, scale } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { Guess, LlmText } from '$lib/chapters/ai/llm/types';
	import { phaseAt, sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as LlmText);

	type Scene = 'chat' | 'next' | 'tokens' | 'guess' | 'loop' | 'temp' | 'remember' | 'try';
	const SCENES: Scene[] = ['chat', 'next', 'tokens', 'guess', 'loop', 'temp', 'remember', 'try'];
	// nine beats, eight scenes (the fyi beat keeps the remember picture)
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];

	type Step = { opts: Guess[]; pick: number };

	let peek = $state<number | null>(null);
	let rolls = $state(0);
	let rolled = $state<Step[] | null>(null);

	const active = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, rolls]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const startWords = $derived(tx.start.split(' '));
	const lastStart = $derived(startWords[startWords.length - 1]);
	const optsAfter = (w: string): Guess[] => tx.table[w.toLowerCase()] ?? [['.', 100]];

	/** The steps for a known list of picks (the loop scene always takes these). */
	const loopSteps = $derived.by<Step[]>(() => {
		const out: Step[] = [];
		let last = lastStart;
		for (const w of tx.path) {
			const opts = optsAfter(last);
			out.push({
				opts,
				pick: Math.max(
					0,
					opts.findIndex((o) => o[0] === w)
				)
			});
			last = w;
		}
		return out;
	});

	/** A random walk through the table, weighted by the bars, until a full stop. */
	function rollSteps(): Step[] {
		const out: Step[] = [];
		let last = lastStart;
		for (let i = 0; i < 7 && last !== '.'; i++) {
			const opts = optsAfter(last);
			let r = Math.random() * opts.reduce((a, o) => a + o[1], 0);
			let k = 0;
			for (; k < opts.length - 1; k++) {
				r -= opts[k][1];
				if (r < 0) break;
			}
			out.push({ opts, pick: k });
			last = opts[k][0];
		}
		if (last !== '.') out.push({ opts: [['.', 100]], pick: 0 });
		return out;
	}

	function roll() {
		const steps = rollSteps();
		rolled = steps;
		rolls += 1;
		onstate?.(steps.some((s) => s.pick > 0) ? 'surprise' : 'roll');
	}

	// one step of the loop, bars grow, the pick lights up, then it lands in the sentence
	const STEP = 2200;
	const GROW = 700;
	const PICK = 1000;
	const LAND = 1600;
	const HOLD = 2600;

	const run = $derived<Step[]>(
		scene === 'loop'
			? loopSteps
			: scene === 'try'
				? (rolled ?? loopSteps)
				: scene === 'guess' || scene === 'temp'
					? [{ opts: optsAfter(lastStart), pick: -1 }]
					: []
	);
	const play = $derived.by(() => {
		const steps = run;
		if (!steps.length) return { k: 0, grow: 1, chosen: -1, added: [] as string[] };
		const span = steps.length * STEP;
		const x = scene === 'loop' && t < 1e8 ? t % (span + HOLD) : t;
		const k = Math.min(steps.length - 1, Math.floor(x / STEP));
		const local = x - k * STEP;
		const added: string[] = [];
		steps.forEach((s, i) => {
			if (s.pick >= 0 && (i < k || (i === k && local >= LAND))) added.push(s.opts[s.pick][0]);
		});
		return {
			k,
			grow: Math.min(1, local / GROW),
			chosen: local >= PICK ? steps[k].pick : -1,
			added
		};
	});

	// 0 is cold, 1 is hot, the temperature scene swings slowly between them
	const heat = $derived.by(() => {
		if (scene !== 'temp') return null;
		const { ph, p } = phaseAt(
			[
				{ ph: 'cold', ms: 2600 },
				{ ph: 'up', ms: 1400 },
				{ ph: 'hot', ms: 2600 },
				{ ph: 'down', ms: 1400 }
			],
			t
		);
		return ph === 'cold' ? 0 : ph === 'hot' ? 1 : ph === 'up' ? p : 1 - p;
	});
	const soften = (opts: Guess[], temp: number) => {
		const w = opts.map((o) => Math.pow(o[1], 1 / temp));
		const sum = w.reduce((a, v) => a + v, 0);
		return w.map((v) => (v / sum) * 100);
	};
	const bars = $derived.by(() => {
		const s = run[play.k];
		if (!s) return [];
		let pct = s.opts.map((o) => o[1]);
		if (heat !== null) {
			const c = soften(s.opts, 0.45);
			const h = soften(s.opts, 2.6);
			pct = c.map((v, i) => v + (h[i] - v) * heat);
		}
		return s.opts.map((o, i) => ({ word: o[0], pct: pct[i], chosen: i === play.chosen }));
	});

	// the words on screen for the writing scenes
	const words = $derived(
		scene === 'remember' ? [...startWords, ...tx.path] : [...startWords, ...play.added]
	);

	// the chat scene, the question pops in, the AI thinks, then the reply types word by word
	const replyWords = $derived([...startWords, ...tx.path]);
	const chat = $derived.by(() => {
		const n = replyWords.length;
		const cycle = 1700 + n * 320 + 3200;
		const x = t < 1e8 ? t % cycle : 1e9;
		return {
			asked: x > 300,
			thinking: x > 900 && x < 1700,
			shown: x < 1700 ? 0 : Math.min(n, Math.floor((x - 1700) / 320) + 1)
		};
	});
	const joinWords = (ws: string[]) => ws.join(' ').replace(/ \./g, '.');

	// the tokens scene, a plain sentence, then words, then pieces, then numbers
	const tokenPhase = $derived(t < 1000 ? 0 : t < 2200 ? 1 : t < 3400 ? 2 : 3);
	const pieceCount = $derived(tx.tokenWords.reduce((a, w) => a + w.length, 0));
	const tokenId = (s: string) => {
		let h = 7;
		for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 49999;
		return 100 + h;
	};
	const TINTS = ['brand', 'amber', 'grass'];

	const showBars = $derived(
		scene === 'guess' || scene === 'loop' || scene === 'temp' || scene === 'try'
	);
	const showKeys = $derived(scene === 'next' || scene === 'remember');
	const suggestOn = (k: number) => scene === 'remember' || t > 600 + k * 300;
	const suggestPick = $derived(scene === 'remember' || t > 2200);
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={roll}>{tx.rollBtn}</button>
		{/if}

		<div class="phone" role="img" aria-label={tx.picture}>
			<div class="notch"></div>
			<div class="bar">
				<span class="dot"></span>
				<span>{tx.chatTitle}</span>
			</div>

			<div class="screen">
				{#if scene === 'chat'}
					<div class="thread">
						{#if chat.asked}
							<div class="msg you" in:fade={{ duration: 250 }}>
								<span class="who">{tx.you}</span>
								<p>{tx.chatAsk}</p>
							</div>
						{/if}
						{#if chat.thinking}
							<div class="msg ai typing" aria-hidden="true"><i></i><i></i><i></i></div>
						{:else if chat.shown > 0}
							<div class="msg ai">
								<span class="who">{tx.ai}</span>
								<p>
									{#each replyWords.slice(0, chat.shown) as w, k (k)}<span
											class="word"
											in:fade={{ duration: clock.reduced ? 0 : 260 }}
											>{w === '.' ? '' : k === 0 ? '' : ' '}{w}</span
										>{/each}
								</p>
							</div>
						{/if}
					</div>
				{:else if scene === 'tokens'}
					<div class="tokens">
						{#if tokenPhase === 0}
							<p class="plain" in:fade={{ duration: 250 }}>
								{joinWords(tx.tokenWords.map((w) => w.join('')))}
							</p>
						{:else}
							<div class="chips">
								{#each tx.tokenWords as w, wi (wi)}
									<span class="word-group" class:split={tokenPhase >= 2}>
										{#if tokenPhase === 1}
											<span
												class="chip tint-{TINTS[wi % 3]}"
												in:scale={{ duration: 300, start: 0.8 }}><span>{w.join('')}</span></span
											>
										{:else}
											{#each w as piece, pi (pi)}
												<span
													class="chip tint-{TINTS[(wi + pi) % 3]}"
													in:scale={{ duration: 300, start: 0.8 }}
												>
													<span>{piece}</span>
													{#if tokenPhase >= 3}
														<small in:fade={{ duration: 300, delay: (wi + pi) * 90 }}
															>{tokenId(piece)}</small
														>
													{/if}
												</span>
											{/each}
										{/if}
									</span>
								{/each}
							</div>
							{#if tokenPhase >= 2}
								<p class="count" in:fade={{ duration: 300 }}>
									{tx.tokensCount.replace('{n}', String(pieceCount))}
								</p>
							{/if}
							{#if tokenPhase >= 3}
								<p class="note" in:fade={{ duration: 300 }}>{tx.idsNote}</p>
							{/if}
						{/if}
					</div>
				{:else}
					<div class="writing">
						<div class="sentence">
							{#each words as w, k (k)}
								<span
									class="chip"
									class:fresh={k >= startWords.length}
									in:scale={{ duration: clock.reduced ? 0 : 320, start: 0.6 }}>{w}</span
								>
							{/each}
							{#if scene !== 'remember'}<span class="caret"></span>{/if}
						</div>
					</div>

					{#if showBars}
						<div class="guesses">
							<p class="label">{tx.nextLabel}</p>
							{#key `${play.k}-${rolls}`}
								<ul in:fade={{ duration: 220 }}>
									{#each bars as b (b.word)}
										<li class:chosen={b.chosen}>
											<span class="w">{b.word}</span>
											<span class="track">
												<span class="fill" style="width:{Math.min(100, b.pct) * play.grow}%"></span>
											</span>
											<span class="pct">{Math.round(b.pct)}%</span>
										</li>
									{/each}
								</ul>
							{/key}
							{#if heat !== null}
								<div class="thermo">
									<span>{tx.cold}</span>
									<span class="rail"><span class="knob" style="left:{heat * 100}%"></span></span>
									<span>{tx.hot}</span>
								</div>
								<p class="thermo-label">{tx.tempLabel}</p>
							{/if}
						</div>
					{/if}
				{/if}
			</div>

			{#if showKeys}
				<div class="keyboard">
					<div class="suggest">
						{#each tx.suggestions as s, k (s)}
							<span class:on={suggestOn(k)} class:pick={k === 0 && suggestPick}>{s}</span>
						{/each}
					</div>
					{#each [10, 9, 7] as n, r (r)}
						<div class="keys">
							{#each Array.from({ length: n }, (_, k) => k) as k (k)}<i></i>{/each}
						</div>
					{/each}
				</div>
			{/if}
		</div>

		{#if scene === 'remember'}
			<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
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
		max-width: 340px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition: transform 0.15s;
	}
	.act:hover {
		transform: translateY(-1px);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}

	/* the phone */
	/* real phone proportions (about 1 wide to 2 tall), not a squat box */
	.phone {
		position: relative;
		display: flex;
		width: min(100%, 260px);
		min-height: 480px;
		flex-direction: column;
		border: 2px solid var(--color-line);
		border-radius: 34px;
		background: var(--color-card);
		padding: 26px 14px 14px;
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.08);
	}
	.notch {
		position: absolute;
		top: 10px;
		left: 50%;
		height: 6px;
		width: 60px;
		transform: translateX(-50%);
		border-radius: 999px;
		background: var(--color-line);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 7px;
		border-bottom: 1px solid var(--color-line);
		padding: 2px 4px 10px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.dot {
		height: 9px;
		width: 9px;
		border-radius: 999px;
		background: var(--color-brand);
	}
	.screen {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 12px;
		padding: 14px 4px 4px;
	}

	/* chat scene */
	.thread {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.msg {
		max-width: 86%;
		border-radius: 16px;
		padding: 8px 12px;
		font-size: 13.5px;
		line-height: 1.5;
	}
	.msg p {
		margin: 0;
		color: var(--color-ink);
	}
	.who {
		display: block;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.msg.you {
		align-self: flex-end;
		border-bottom-right-radius: 4px;
		background: var(--color-brand-soft);
	}
	.msg.ai {
		align-self: flex-start;
		border-bottom-left-radius: 4px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.typing {
		display: flex;
		gap: 4px;
		padding: 12px 14px;
	}
	.typing i {
		height: 7px;
		width: 7px;
		border-radius: 999px;
		background: var(--color-faint);
		animation: hop 1s ease-in-out infinite;
	}
	.typing i:nth-child(2) {
		animation-delay: 0.15s;
	}
	.typing i:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes hop {
		50% {
			transform: translateY(-3px);
			opacity: 0.5;
		}
	}

	/* tokens scene */
	.tokens {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-top: 30px;
	}
	.plain {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px 10px;
	}
	.word-group {
		display: inline-flex;
		gap: 0;
		transition: gap 0.4s;
	}
	.word-group.split {
		gap: 3px;
	}
	.chips .chip {
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		border-radius: 9px;
		padding: 5px 9px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.chips .chip small {
		font-size: 10px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.tint-brand {
		background: var(--color-brand-soft);
	}
	.tint-amber {
		background: var(--color-amber-soft);
	}
	.tint-grass {
		background: var(--color-grass-soft);
	}
	.count {
		margin: 4px 0 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.note {
		margin: 0;
		max-width: 220px;
		text-align: center;
		font-size: 12px;
		line-height: 1.5;
		color: var(--color-muted);
	}

	/* the sentence being written */
	.writing {
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-paper);
		padding: 10px;
	}
	.sentence {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 5px;
		min-height: 30px;
	}
	.sentence .chip {
		border-radius: 8px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 3px 8px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.sentence .chip.fresh {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.caret {
		height: 18px;
		width: 2px;
		background: var(--color-brand);
		animation: blink 0.9s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	/* the guess bars */
	.guesses {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.label {
		margin: 0 0 2px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: 64px 1fr 36px;
		align-items: center;
		gap: 8px;
		border-radius: 8px;
		padding: 3px 4px;
		transition: background 0.3s;
	}
	li.chosen {
		background: var(--color-brand-soft);
	}
	.w {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.track {
		height: 10px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--color-faint);
		transition:
			width 0.25s linear,
			background 0.3s;
	}
	li.chosen .fill {
		background: var(--color-brand);
	}
	.pct {
		text-align: right;
		font-size: 12px;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--color-muted);
	}
	.thermo {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.rail {
		position: relative;
		height: 6px;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--color-brand), var(--color-amber), var(--color-danger));
	}
	.knob {
		position: absolute;
		top: 50%;
		height: 16px;
		width: 16px;
		transform: translate(-50%, -50%);
		border: 2px solid var(--color-ink);
		border-radius: 999px;
		background: var(--color-card);
	}
	.thermo-label {
		margin: 0;
		text-align: center;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}

	/* keyboard */
	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-top: 10px;
		border-radius: 14px;
		background: var(--color-paper);
		padding: 8px 6px;
	}
	.suggest {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		margin-bottom: 3px;
	}
	.suggest span {
		border-radius: 8px;
		padding: 5px 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		opacity: 0;
		transform: translateY(4px);
		transition:
			opacity 0.35s,
			transform 0.35s,
			background 0.3s;
	}
	.suggest span.on {
		opacity: 1;
		transform: none;
	}
	.suggest span.pick {
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.keys {
		display: flex;
		justify-content: center;
		gap: 4px;
	}
	.keys i {
		height: 20px;
		width: 22px;
		border-radius: 5px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.phone {
			width: min(100%, 236px);
			min-height: 420px;
		}
		.keys i {
			width: 18px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.typing i,
		.caret {
			animation: none;
		}
		.fill,
		.suggest span,
		.word-group,
		li,
		.act {
			transition: none;
		}
	}
</style>
