<script lang="ts">
	// A guided "watch" stage. A pile of past support replies, a language model with a big frozen
	// part and a small tuned part, and the nimbus.com support chat. The beats play the story by
	// themselves, the general model answers vaguely, the good examples flow into the small tuned
	// part, the same question gets the nimbus tone, then one bad example slips in and its habit
	// shows up in every answer. The only optional play is pulling the bad example in or out.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { FineTuningText } from '$lib/chapters/ai/fine-tuning/types';
	import { sceneClock, wrap } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as FineTuningText);

	type Scene =
		| 'general'
		| 'examples'
		| 'tune'
		| 'tuned'
		| 'remember'
		| 'bad'
		| 'habit'
		| 'facts'
		| 'try';
	const SCENES: Scene[] = [
		'general',
		'examples',
		'tune',
		'tuned',
		'remember',
		'bad',
		'habit',
		'facts',
		'try'
	];
	const SCENE_OF_BEAT = [0, 0, 1, 2, 3, 4, 5, 6, 7, 8];

	let peek = $state<number | null>(null);
	let withBad = $state(true);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, withBad]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	// does the pile hold the bad example, and has the model learned from it
	const badInPile = $derived(
		scene === 'bad' || scene === 'habit' || scene === 'facts' || (scene === 'try' && withBad)
	);
	const learnedBad = $derived(
		scene === 'habit' || scene === 'facts' || (scene === 'try' && withBad && t > 1500)
	);
	const tuned = $derived(active >= 3 || (scene === 'tune' && t > 4200));

	// how many good cards are in the pile
	const goodCards = $derived(
		scene === 'general'
			? 0
			: scene === 'examples'
				? Math.max(0, Math.min(3, Math.floor((t - 300) / 700) + 1))
				: 3
	);
	const showAdapter = $derived(active >= 2);
	const adapterFill = $derived(scene === 'tune' ? Math.min(1, t / 4200) : 1);
	const badFill = $derived(
		scene === 'bad' ? Math.max(0, Math.min(1, (t - 1400) / 2200)) : learnedBad ? 1 : 0
	);
	const retuning = $derived(scene === 'try' && t < 1500);
	const round = $derived(scene === 'tune' ? Math.min(3, Math.floor(t / 1400) + 1) : 3);
	const flowing = $derived(
		!clock.reduced &&
			((scene === 'tune' && t < 4200) || (scene === 'bad' && t > 900 && t < 3600) || retuning)
	);

	// the chat, which reply and when it starts typing
	const replyKind = $derived<'general' | 'good'>(
		scene === 'general' || scene === 'examples' || scene === 'tune' ? 'general' : 'good'
	);
	const typeFrom = $derived(
		scene === 'general'
			? 1000
			: scene === 'tuned'
				? 500
				: scene === 'habit'
					? 300
					: scene === 'try'
						? 1600
						: -1
	);
	const shown = $derived(typeFrom < 0 ? 1e9 : Math.max(0, Math.floor((t - typeFrom) / 24)));
	const askShown = $derived(scene !== 'general' || t > 300);
	const replyLines = $derived(wrap(replyKind === 'general' ? tx.general : tx.good, 50));
	const habitLines = $derived(learnedBad ? wrap(tx.habit, 50) : []);
	const qLines = $derived(wrap(tx.question, 34));

	// reveal the reply character by character across its lines, without reflowing
	function reveal(lines: string[], n: number): string[] {
		const out: string[] = [];
		let left = n;
		for (const l of lines) {
			if (left <= 0) break;
			out.push(l.slice(0, left));
			left -= l.length + 1;
		}
		return out;
	}
	const allLines = $derived([...replyLines, ...habitLines]);
	const visible = $derived(reveal(allLines, shown));
	const typing = $derived(typeFrom >= 0 && shown < allLines.join(' ').length && !clock.reduced);
	const replyH = $derived(allLines.length * 13 + 14);

	const LIT: Record<Scene, string[]> = {
		general: ['model', 'chat'],
		examples: ['pile'],
		tune: ['pile', 'model'],
		tuned: ['model', 'chat'],
		remember: ['model', 'chat', 'pile'],
		bad: ['pile', 'model'],
		habit: ['model', 'chat'],
		facts: ['model', 'chat'],
		try: ['pile', 'model', 'chat']
	};
	const lit = (k: string) => LIT[scene].includes(k);

	const COLS = [0, 1, 2, 3, 4, 5];
	const ROWS = [0, 1, 2];

	function toggle() {
		withBad = !withBad;
		onstate?.(withBad ? 'bad_in' : 'bad_out');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={toggle}>
				{withBad ? tx.removeBad : tx.addBad}
			</button>
		{/if}
		<svg viewBox="0 0 360 380" class="pic" role="img" aria-label={tx.picture}>
			<!-- the pile of past replies -->
			<g class="part" class:dim={!lit('pile')}>
				<text x="10" y="14" class="label">{tx.examplesLabel}</text>
				{#if goodCards === 0}
					<rect x="8" y="24" width="144" height="150" rx="10" class="empty" />
				{/if}
				{#each tx.examples as ex, k (k)}
					{@const bad = k === tx.examples.length - 1}
					{#if (bad && badInPile) || (!bad && k < goodCards)}
						<g transform="translate(8 {24 + k * 40})">
							<g class="card-in" class:still={clock.reduced}>
								<rect width="144" height="36" rx="7" class="card" class:badcard={bad} />
								<rect width="4" height="36" rx="2" class={bad ? 'edge-bad' : 'edge-good'} />
								<text x="11" y="13" class="cq">{ex.q}</text>
								{#each wrap(ex.a, 34).slice(0, 2) as l, j (j)}
									<text x="11" y={23 + j * 9} class="ca">{l}</text>
								{/each}
							</g>
						</g>
					{/if}
				{/each}
			</g>

			<!-- examples flowing into the tuned part -->
			{#if flowing}
				{#each [0, 1, 2] as k (k)}
					<rect
						x="-5"
						y="-4"
						width="10"
						height="8"
						rx="2"
						class="flow"
						class:badflow={scene === 'bad' || (scene === 'try' && withBad)}
					>
						<animateMotion
							dur="1.4s"
							begin="{k * 0.45}s"
							repeatCount="indefinite"
							path={scene === 'bad'
								? 'M152 160 C 172 160 176 130 200 130'
								: 'M152 84 C 176 84 176 130 200 130'}
						/>
					</rect>
				{/each}
			{/if}

			<!-- the model, frozen base and small tuned part -->
			<g class="part" class:dim={!lit('model')}>
				<text x="266" y="14" text-anchor="middle" class="label">{tx.modelLabel}</text>
				{#if scene === 'remember'}
					<text x="266" y="186" text-anchor="middle" class="memo">{tx.memo}</text>
				{/if}
				<rect x="182" y="22" width="168" height="134" rx="14" class="model" />
				{#each ROWS as r (r)}
					{#each COLS as c (c)}
						<rect x={194 + c * 25} y={34 + r * 22} width="20" height="16" rx="4" class="weight" />
					{/each}
				{/each}
				<g transform="translate(200 108)" class="snow">
					<path d="M0 -5 V5 M-4.3 -2.5 L4.3 2.5 M-4.3 2.5 L4.3 -2.5" />
				</g>
				<text x="210" y="111" class="small">{tx.frozenLabel}</text>
				{#if showAdapter}
					<g class="adapter-in" class:still={clock.reduced}>
						<rect x="194" y="120" width="144" height="14" rx="7" class="adapter" />
						<rect
							x="194"
							y="120"
							width={144 * adapterFill}
							height="14"
							rx="7"
							class="fill"
							class:pulse={retuning}
						/>
						{#if badFill > 0}
							<rect
								x={338 - 40 * badFill}
								y="120"
								width={40 * badFill}
								height="14"
								rx="7"
								class="badfill"
							/>
						{/if}
						<text x="200" y="147" class="small amber">{tx.adapterLabel}</text>
					</g>
				{/if}
				{#if (scene === 'tune' && !tuned) || retuning}
					<text x="266" y="172" text-anchor="middle" class="round">
						{tx.round.replace('{n}', String(scene === 'tune' ? round : 3))}
					</text>
				{/if}
			</g>

			<!-- the support chat -->
			<g class="part" class:dim={!lit('chat')}>
				<rect x="8" y="196" width="344" height="178" rx="14" class="window" />
				<path d="M8 222 H352" class="sep" />
				<circle cx="24" cy="209" r="4" class="logo" />
				<text x="34" y="213" class="title">{tx.chatTitle}</text>
				{#if askShown}
					<g class="bubble-in" class:still={clock.reduced}>
						<rect
							x={344 - 16 - Math.max(...qLines.map((l) => l.length)) * 5.1}
							y="230"
							width={16 + Math.max(...qLines.map((l) => l.length)) * 5.1}
							height={qLines.length * 13 + 10}
							rx="9"
							class="ask"
						/>
						{#each qLines as l, k (k)}
							<text x="336" y={244 + k * 13} text-anchor="end" class="asktext">{l}</text>
						{/each}
					</g>
				{/if}
				{#if typeFrom < 0 || t > typeFrom}
					{@const y0 = 242 + qLines.length * 13}
					<text x="18" y={y0} class="tag" class:good={replyKind === 'good'}>
						{replyKind === 'good' ? tx.tunedTag : tx.generalTag}
					</text>
					<rect
						x="16"
						y={y0 + 5}
						width="300"
						height={replyH}
						rx="9"
						class="reply"
						class:goodreply={replyKind === 'good'}
					/>
					{#each visible as l, k (k)}
						<text x="26" y={y0 + 20 + k * 13} class="replytext" class:habit={k >= replyLines.length}
							>{l}</text
						>
					{/each}
					{#if typing}
						<rect
							x={26 + (visible[visible.length - 1]?.length ?? 0) * 4.75}
							y={y0 + 12 + Math.max(0, visible.length - 1) * 13}
							width="5"
							height="10"
							class="caret"
						/>
					{/if}
				{/if}
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
	.pic {
		display: block;
		width: 100%;
		height: auto;
		max-height: 62vh;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
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
		opacity: 0.35;
	}
	.label {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}
	.small {
		fill: var(--color-muted);
		font-size: 8.5px;
		font-weight: 700;
	}
	.small.amber {
		fill: var(--color-amber);
	}
	.memo {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
	}
	.empty {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.card.badcard {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.edge-good {
		fill: var(--color-grass);
	}
	.edge-bad {
		fill: var(--color-danger);
	}
	.cq {
		fill: var(--color-ink);
		font-size: 8.5px;
		font-weight: 800;
	}
	.ca {
		fill: var(--color-muted);
		font-size: 7px;
		font-weight: 600;
	}
	.card-in,
	.adapter-in,
	.bubble-in {
		animation: rise 0.45s ease both;
	}
	.still {
		animation: none;
	}
	@keyframes rise {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
		to {
			transform: none;
			opacity: 1;
		}
	}
	.flow {
		fill: var(--color-grass);
	}
	.flow.badflow {
		fill: var(--color-danger);
	}
	.model {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.8;
	}
	.weight {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-opacity: 0.35;
	}
	.snow path {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.adapter {
		fill: var(--color-card);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.fill {
		fill: var(--color-amber);
		transition: width 0.2s linear;
	}
	.fill.pulse {
		animation: pulse 0.7s ease-in-out infinite;
	}
	@keyframes pulse {
		50% {
			opacity: 0.45;
		}
	}
	.badfill {
		fill: var(--color-danger);
	}
	.round {
		fill: var(--color-amber);
		font-size: 10px;
		font-weight: 800;
	}
	.window {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.sep {
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.logo {
		fill: var(--color-brand);
	}
	.title {
		fill: var(--color-ink);
		font-size: 9.5px;
		font-weight: 800;
	}
	.ask {
		fill: var(--color-brand);
	}
	.asktext {
		fill: var(--color-card);
		font-size: 9px;
		font-weight: 700;
	}
	.tag {
		fill: var(--color-faint);
		font-size: 8px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.tag.good {
		fill: var(--color-grass);
	}
	.reply {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.reply.goodreply {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-opacity: 0.5;
	}
	.replytext {
		fill: var(--color-ink);
		font-size: 9px;
		font-weight: 600;
	}
	.replytext.habit {
		fill: var(--color-danger);
		font-weight: 800;
	}
	.caret {
		fill: var(--color-brand);
		animation: blink 0.8s step-end infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.fill {
			transition: none;
		}
		.card-in,
		.adapter-in,
		.bubble-in,
		.fill.pulse,
		.caret {
			animation: none;
		}
	}
</style>
