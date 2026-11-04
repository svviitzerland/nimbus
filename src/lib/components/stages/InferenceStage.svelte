<script lang="ts">
	// A guided "watch" stage. Nim narrates and the picture follows the beats by itself. On top,
	// labelled emails fly into a pair of racks while a long training bar fills slowly. Out comes a
	// frozen model file that lands on a server. Below, a phone asks it questions and the answers
	// come back in a blink, then a stream of them. The only optional play is on the last beat,
	// tapping an email to ask the model yourself.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { InferenceText } from '$lib/chapters/ai/inference/types';
	import { runSeq, prefersReducedMotion } from './webguide/seq';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as InferenceText);

	// Eight beats, seven scenes (the memory beat and the side fact share one).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 5, 6];
	const DAYS = 34; // how long the big model in the story keeps the computers busy

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let ex = $state(-1); // the training example in flight, -1 before training starts
	let progress = $state(0); // 0 to 1, the training bar
	let qi = $state(0); // which question is being asked
	let phase = $state<'idle' | 'ask' | 'answer'>('idle');
	let answered = $state(0);
	let saidAsk = false;

	const sceneFromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(peek ?? sceneFromBeat);
	const trained = $derived(scene >= 2);
	const topDim = $derived(scene >= 3 && scene !== 5);
	const bottomDim = $derived(scene === 1 || scene === 5);

	// ---- a tiny spam filter, it counts which words show up in spam and which in normal mail ----
	const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];
	const counts = $derived.by(() => {
		const c = new Map<string, number>();
		for (const e of tx.examples) {
			for (const w of words(e.text)) c.set(w, (c.get(w) ?? 0) + (e.spam ? 1 : -1));
		}
		return c;
	});
	const isSpam = (s: string) => words(s).reduce((sum, w) => sum + (counts.get(w) ?? 0), 0) > 0;

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		reduced = prefersReducedMotion();
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	// Training plays on its scene, one example after another, then starts over after a pause.
	$effect(() => {
		const sc = scene;
		const total = tx.examples.length;
		if (sc === 0) {
			ex = -1;
			progress = 0;
			return;
		}
		if (sc !== 1 || reduced) {
			ex = total - 1;
			progress = 1;
			return;
		}
		const steps: [number, () => void][] = [[700, () => ((ex = -1), (progress = 0))]];
		for (let k = 0; k < total; k++) {
			steps.push([k === total - 1 ? 3000 : 560, () => ((ex = k), (progress = (k + 1) / total))]);
		}
		return runSeq(steps, true);
	});

	// One question at a time on the inference scene, a steady stream on the scale scene.
	$effect(() => {
		const sc = scene;
		if (sc === 3 && !reduced) {
			let k = 0;
			return runSeq(
				[
					[700, () => ((qi = k % tx.questions.length), (phase = 'ask'))],
					[2200, () => (phase = 'answer')],
					[500, () => ((phase = 'idle'), (k += 1))]
				],
				true
			);
		}
		if (sc === 3) {
			qi = 0;
			phase = 'answer';
			return;
		}
		if (sc === 4) {
			answered = 0;
			if (reduced) {
				answered = 1_000_000;
				return;
			}
			const t = setInterval(() => (answered += 2_000 + Math.floor(Math.random() * 600)), 60);
			return () => clearInterval(t);
		}
		if (sc !== 6) phase = 'idle';
	});

	let askTimer: ReturnType<typeof setTimeout> | undefined;
	function ask(k: number) {
		clearTimeout(askTimer);
		qi = k;
		if (reduced) phase = 'answer';
		else {
			phase = 'ask';
			askTimer = setTimeout(() => (phase = 'answer'), 650);
		}
		if (!saidAsk) {
			saidAsk = true;
			onstate?.('ask');
		}
	}
	$effect(() => () => clearTimeout(askTimer));

	const question = $derived(tx.questions[qi] ?? '');
	const verdict = $derived(isSpam(question));
	const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, tx.sep);
	const current = $derived(ex >= 0 ? tx.examples[ex] : null);
</script>

{#snippet envelope(x: number, y: number, w: number, cls: string)}
	<g transform="translate({x} {y})" class={cls}>
		<rect width={w} height={w * 0.66} rx="2.5" />
		<path d="M1.5 2 L{w / 2} {w * 0.36} L{w - 1.5} 2" />
	</g>
{/snippet}

{#snippet rack(x: number, busy: boolean)}
	<g transform="translate({x} 10)">
		<rect class="rack" width="44" height="78" rx="5" />
		{#each [0, 1, 2, 3] as u (u)}
			<rect class="unit" x="5" y={6 + u * 18} width="34" height="13" rx="2" />
			<circle
				class="led"
				class:busy
				cx="33"
				cy={12.5 + u * 18}
				r="2"
				style="animation-delay:{u * 0.17 + x / 900}s"
			/>
		{/each}
	</g>
{/snippet}

{#snippet modelFile(x: number, y: number)}
	<g transform="translate({x} {y})" class="file">
		<path d="M0 0 H18 L26 8 V34 H0 Z" />
		<path d="M18 0 V8 H26" class="fold" />
		{#each [0, 1, 2] as r (r)}
			<line x1="5" y1={15 + r * 6} x2="21" y2={15 + r * 6} />
		{/each}
	</g>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(i: number)}
			<div class="visual">
				{#if i === 6}
					<div class="chips" in:fade={{ duration: 250 }}>
						<span class="hint">{tx.askHint}</span>
						{#each tx.questions as q, k (k)}
							<button
								type="button"
								class="chip"
								class:on={qi === k && phase !== 'idle'}
								onclick={() => ask(k)}>{q}</button
							>
						{/each}
					</div>
				{/if}

				<!-- training, on top -->
				<section class="half" class:dim={topDim} class:hot={scene === 1}>
					<p class="cap">{tx.trainTitle}</p>
					<svg viewBox="0 0 320 96" class="pic" aria-hidden="true">
						<!-- the pile of labelled emails -->
						{@render envelope(30, 56, 34, 'env pile')}
						{@render envelope(36, 48, 34, 'env pile')}
						{@render envelope(42, 40, 34, 'env pile')}
						{#if scene === 1 && ex >= 0 && !reduced}
							{#key ex}
								<g class="flight">
									{@render envelope(0, 0, 26, current?.spam ? 'env spam' : 'env ham')}
								</g>
							{/key}
						{/if}
						{@render rack(196, scene === 1)}
						{@render rack(250, scene === 1)}
						{#if trained}
							<g class="popout">{@render modelFile(146, 50)}</g>
						{/if}
					</svg>
					<div class="meta">
						<span class="reading">
							{#if current && scene === 1}
								{tx.reading
									.replace('{n}', String(ex + 1))
									.replace('{total}', String(tx.examples.length))}
								<em class="tag" class:spam={current.spam}
									>{current.spam ? tx.spamTag : tx.hamTag}</em
								>
							{:else}
								&nbsp;
							{/if}
						</span>
						<span class="day">{tx.day.replace('{n}', String(Math.round(progress * DAYS)))}</span>
					</div>
					<div class="bar"><span style="width:{progress * 100}%"></span></div>
				</section>

				<!-- inference, below -->
				<section
					class="half"
					class:dim={bottomDim}
					class:hot={scene === 3 || scene === 4 || scene === 6}
				>
					<p class="cap">{tx.inferTitle}</p>
					<svg viewBox="0 0 320 100" class="pic" aria-hidden="true">
						<!-- the phone -->
						<g transform="translate(24 10)">
							<rect class="phone" width="36" height="70" rx="7" />
							<rect class="screen" x="4" y="8" width="28" height="52" rx="3" />
							<circle class="phone-dot" cx="18" cy="65" r="1.6" />
						</g>
						<text class="lbl" x="42" y="95">{tx.you}</text>

						<!-- the server with the frozen model on it -->
						<g transform="translate(250 6)">
							<rect class="rack" width="46" height="76" rx="5" />
							{#each [0, 1, 2] as u (u)}
								<rect class="unit" x="5" y={7 + u * 23} width="36" height="16" rx="2" />
								<circle class="led on" cx="35" cy={15 + u * 23} r="2" />
							{/each}
						</g>
						<text class="lbl" x="273" y="95">{tx.server}</text>
						{#if trained}
							<g class="arrive">{@render modelFile(208, 20)}</g>
							<text class="lbl small" x="221" y="66">{tx.modelFile}</text>
							<text class="lbl frozen" x="221" y="77">{tx.frozen}</text>
						{/if}

						<!-- the wire between them -->
						<line class="wire" x1="62" y1="44" x2="204" y2="44" />

						{#if scene === 4 && !reduced}
							{#each Array.from({ length: 8 }, (_, k) => k) as k (k)}
								<circle
									class="stream out"
									cx="62"
									cy="40"
									r="2.6"
									style="animation-delay:{k * 0.11}s"
								/>
								<circle
									class="stream back"
									cx="204"
									cy="49"
									r="2.6"
									style="animation-delay:{k * 0.11 + 0.05}s"
								/>
							{/each}
						{:else if phase === 'ask'}
							<g class="ask">{@render envelope(0, 0, 18, 'env q')}</g>
						{:else if phase === 'answer'}
							<g class="answer" class:spam={verdict}>
								<circle cx="0" cy="0" r="6" />
							</g>
						{/if}
					</svg>
					<div class="meta">
						{#if scene === 4}
							<span class="count">{tx.answered.replace('{n}', fmt(answered))}</span>
							<span class="day">{tx.fast}</span>
						{:else if (scene === 3 || scene === 6) && phase !== 'idle'}
							<span class="q">{question}</span>
							{#if phase === 'answer'}
								<span class="ans" class:spam={verdict} in:fade={{ duration: 200 }}
									>{verdict ? tx.spam : tx.ham} <small>{tx.fast}</small></span
								>
							{/if}
						{:else}
							<span>&nbsp;</span>
						{/if}
					</div>
				</section>

				{#if i === 5}
					<div class="compare" in:fade={{ duration: 300 }}>
						<div class="crow">
							<span class="cname">{tx.longBar}</span>
							<span class="cbar"><span class="long"></span></span>
							<span class="ctime">{tx.longTime}</span>
						</div>
						<div class="crow">
							<span class="cname">{tx.shortBar}</span>
							<span class="cbar"><span class="short"></span></span>
							<span class="ctime">{tx.shortTime}</span>
						</div>
						<p class="rule">{tx.rule}</p>
					</div>
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
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.hint {
		width: 100%;
		text-align: center;
		font-size: 12px;
		color: var(--color-faint);
	}
	.chip {
		border: 1.5px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 5px 12px;
		font-size: 12.5px;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover,
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.half {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px 12px 12px;
		transition:
			opacity 0.4s,
			border-color 0.4s;
	}
	.half.dim {
		opacity: 0.45;
	}
	.half.hot {
		border-color: var(--color-brand);
	}
	.cap {
		margin: 0 0 4px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.pic {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.meta {
		display: flex;
		min-height: 20px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 4px 10px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.reading {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.tag {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 1px 8px;
		font-size: 11px;
		font-style: normal;
		font-weight: 700;
		color: var(--color-grass);
	}
	.tag.spam {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.day {
		font-variant-numeric: tabular-nums;
		color: var(--color-faint);
	}
	.bar {
		margin-top: 6px;
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--color-brand);
		transition: width 0.5s ease;
	}

	/* drawings */
	.env :global(rect) {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.4;
	}
	.env :global(path) {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 1.2;
	}
	.env.spam :global(rect) {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.env.ham :global(rect) {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.env.q :global(rect) {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.flight {
		animation: fly 0.56s ease-in both;
	}
	@keyframes fly {
		from {
			opacity: 0;
			transform: translate(70px, 36px);
		}
		25% {
			opacity: 1;
		}
		to {
			opacity: 0.2;
			transform: translate(210px, 30px);
		}
	}
	.rack {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.unit {
		fill: var(--color-card);
		opacity: 0.16;
	}
	.led {
		fill: var(--color-faint);
	}
	.led.on {
		fill: var(--color-grass);
	}
	.led.busy {
		fill: var(--color-grass);
		animation: blink 0.5s steps(2) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0.2;
		}
	}
	.file path {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.file .fold {
		fill: none;
	}
	.file line {
		stroke: var(--color-brand);
		stroke-width: 1.5;
		opacity: 0.6;
	}
	.popout {
		animation: pop 0.5s ease both;
	}
	.arrive {
		animation: arrive 0.8s ease both 0.3s;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes arrive {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.phone {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.screen {
		fill: var(--color-card);
	}
	.phone-dot {
		fill: var(--color-card);
	}
	.lbl {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.lbl.small {
		font-size: 9.5px;
	}
	.lbl.frozen {
		font-size: 9px;
		fill: var(--color-brand);
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.ask {
		animation: ask 0.65s ease-in-out both;
	}
	@keyframes ask {
		from {
			transform: translate(64px, 38px);
		}
		to {
			transform: translate(186px, 38px);
		}
	}
	.answer {
		animation: back 0.45s ease-out both;
	}
	.answer circle {
		fill: var(--color-grass);
	}
	.answer.spam circle {
		fill: var(--color-danger);
	}
	@keyframes back {
		from {
			transform: translate(200px, 44px);
		}
		to {
			transform: translate(66px, 44px);
		}
	}
	.stream {
		opacity: 0;
		animation: go 0.9s linear infinite;
	}
	.stream.out {
		fill: var(--color-brand);
	}
	.stream.back {
		fill: var(--color-grass);
		animation-name: come;
	}
	@keyframes go {
		0% {
			opacity: 1;
			transform: none;
		}
		100% {
			opacity: 1;
			transform: translateX(142px);
		}
	}
	@keyframes come {
		0% {
			opacity: 1;
			transform: none;
		}
		100% {
			opacity: 1;
			transform: translateX(-142px);
		}
	}
	.q {
		color: var(--color-ink);
	}
	.ans {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 2px 10px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.ans.spam {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.ans small {
		margin-left: 4px;
		font-weight: 500;
		opacity: 0.8;
	}
	.count {
		font-weight: 700;
		font-variant-numeric: tabular-nums;
		color: var(--color-ink);
	}
	.compare {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 12px 14px;
	}
	.crow {
		display: grid;
		grid-template-columns: 86px 1fr auto;
		align-items: center;
		gap: 8px;
		font-size: 12px;
		color: var(--color-muted);
	}
	.cname {
		font-weight: 600;
	}
	.cbar {
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
	}
	.cbar span {
		display: block;
		height: 100%;
		border-radius: 999px;
	}
	.long {
		width: 100%;
		background: var(--color-brand);
		animation: grow 2.4s ease both;
	}
	.short {
		width: 2%;
		background: var(--color-grass);
	}
	@keyframes grow {
		from {
			width: 0;
		}
	}
	.ctime {
		font-weight: 700;
		color: var(--color-ink);
	}
	.rule {
		margin: 4px 0 0;
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
		.flight,
		.popout,
		.arrive,
		.ask,
		.answer,
		.stream,
		.long,
		.led.busy {
			animation: none;
		}
		.answer {
			transform: translate(66px, 44px);
		}
		.half,
		.bar span {
			transition: none;
		}
	}
</style>
