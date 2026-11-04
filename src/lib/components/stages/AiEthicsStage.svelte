<script lang="ts">
	// A guided "watch" stage. A phone sends a message along a line to a chatbot provider, where it
	// may be kept, read, or trained on. Above the road stands a big billboard, and each message is
	// put up on it for the billboard test. A public news question is stamped "send it" and flies
	// off, a CV gets its phone number and address swapped out first, and a friend's secret is
	// stamped "keep it out" and never leaves. The only optional play, on the last beat, replays the
	// test for a message the learner taps.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { AiEthicsMsgId, AiEthicsText } from '$lib/chapters/ai/ai-ethics/types';
	import { phaseAt, sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as AiEthicsText);

	type Scene = 'where' | 'stored' | 'billboard' | 'news' | 'cv' | 'friend' | 'recap' | 'try';
	const SCENES: Scene[] = ['where', 'stored', 'billboard', 'news', 'cv', 'friend', 'recap', 'try'];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];
	type Verdict = 'send' | 'clean' | 'keep';
	const VERDICT: Record<AiEthicsMsgId, Verdict> = { news: 'send', cv: 'clean', friend: 'keep' };

	let peek = $state<number | null>(null);
	let picked = $state<AiEthicsMsgId | null>(null);
	let run = $state(0);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, picked, run]);
	const t = $derived(clock.t);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	// ---- which message is on the billboard ----
	const msgId = $derived<AiEthicsMsgId | null>(
		scene === 'news' || scene === 'cv' || scene === 'friend'
			? scene
			: scene === 'try'
				? picked
				: null
	);
	const msg = $derived(msgId ? tx.messages.find((m) => m.id === msgId) : undefined);
	const verdict = $derived<Verdict | null>(msgId ? VERDICT[msgId] : null);

	const flagged = $derived(!!msg && t > 700);
	const stamped = $derived(!!msg && t > 1300);
	const cleaned = $derived(verdict === 'clean' && t > 2000);
	const blocked = $derived(verdict === 'keep' && t > 1900);
	const ruleBoard = $derived(
		scene === 'billboard' || scene === 'recap' || (scene === 'try' && !msg)
	);

	// ---- the envelope on the line ----
	const FROM = 80;
	const TO = 256;
	const env = $derived.by((): { x: number; show: boolean } => {
		if (scene === 'where') {
			const { ph, p } = phaseAt(
				[
					{ ph: 'wait', ms: 700 },
					{ ph: 'go', ms: 1600 },
					{ ph: 'rest', ms: 700 }
				],
				t
			);
			if (ph === 'wait') return { x: FROM, show: true };
			if (ph === 'go') return { x: FROM + (TO - FROM) * p, show: true };
			return { x: TO, show: false };
		}
		if (!verdict || verdict === 'keep') return { x: FROM, show: false };
		const start = verdict === 'send' ? 1900 : 2600;
		if (t < start) return { x: FROM, show: t > 1300 };
		const p = Math.min(1, (t - start) / 1300);
		return { x: FROM + (TO - FROM) * p, show: p < 1 };
	});
	const arrived = $derived(
		!!verdict && verdict !== 'keep' && t > (verdict === 'send' ? 3200 : 3900)
	);

	// what may happen over there, lit one by one on the second beat
	const fatesOn = $derived(
		scene === 'stored' ? Math.max(0, Math.min(3, Math.floor((t - 300) / 600) + 1)) : 0
	);
	const FATES = [130, 180, 230];

	// centred a little high on the board, so the verdict stamp in the lower right never covers a line
	const top = $derived(msg ? 76 - (msg.lines.length * 18) / 2 + 6 : 0);
	const STAMP_CLASS: Record<Verdict, string> = { send: 'go', clean: 'mid', keep: 'stop' };

	function pick(id: AiEthicsMsgId) {
		picked = id;
		run += 1;
		onstate?.(id);
	}
</script>

{#snippet stamp(v: Verdict, x: number, y: number, small: boolean)}
	<g transform="translate({x} {y}) rotate(-8)"
		><g class="pop">
			<rect
				x={small ? -44 : -56}
				y={small ? -12 : -15}
				width={small ? 88 : 112}
				height={small ? 24 : 30}
				rx="6"
				class="stamp {STAMP_CLASS[v]}"
			/>
			<text y={small ? 4 : 5} text-anchor="middle" class="stamptext {STAMP_CLASS[v]}" class:small
				>{tx.verdicts[v]}</text
			>
		</g></g
	>
{/snippet}

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<div class="picks">
				{#each tx.messages as m (m.id)}
					<button type="button" class="act" class:on={picked === m.id} onclick={() => pick(m.id)}
						>{m.label}</button
					>
				{/each}
			</div>
		{/if}
		<svg viewBox="0 0 360 330" class="pic" role="img" aria-label={tx.picture}>
			<!-- the road and the billboard -->
			<path d="M0 200 H360" class="ground" />
			<g class="board" class:faded={scene === 'where' || scene === 'stored'}>
				<rect x="96" y="146" width="8" height="54" class="post" />
				<rect x="256" y="146" width="8" height="54" class="post" />
				<rect x="28" y="12" width="304" height="138" rx="6" class="frame" />
				<rect x="36" y="20" width="288" height="122" rx="3" class="face" />

				{#if msg}
					{#key msgId}
						<g class="fadein">
							{#each msg.lines as line, k (k)}
								<text x="48" y={top + k * 18} class="msg"
									>{#each line as seg, j (j)}<tspan
											class:secret={seg.secret && flagged && !cleaned}
											class:removed={seg.secret && cleaned}
											>{seg.secret && cleaned ? tx.removed : seg.t}</tspan
										>{/each}</text
								>
							{/each}
						</g>
					{/key}
					{#if stamped && verdict}
						{@render stamp(verdict, 262, 124, false)}
					{/if}
				{:else if ruleBoard}
					<text x="180" y="66" text-anchor="middle" class="ask">{tx.billboardAsk}</text>
					{#if scene !== 'billboard'}
						{@render stamp('send', 90, 106, true)}
						{@render stamp('clean', 180, 106, true)}
						{@render stamp('keep', 270, 106, true)}
					{/if}
				{:else}
					{#each [50, 70, 90, 110] as y (y)}
						<rect x="48" {y} width={y === 110 ? 150 : 250} height="7" rx="3.5" class="blank" />
					{/each}
				{/if}
			</g>

			<!-- the line from you to the provider -->
			<path d="M78 262 H282" class="wire" class:cut={blocked} />
			{#if blocked}
				<g transform="translate(104 262)"
					><g class="pop">
						<circle r="9" class="blockdot" />
						<path d="M-3.5 -3.5 L3.5 3.5 M3.5 -3.5 L-3.5 3.5" class="blockx" />
					</g></g
				>
			{/if}
			{#if env.show}
				<g transform="translate({env.x} 254)">
					<rect width="22" height="16" rx="3" class="envbody" />
					<path d="M1 2 L11 9 L21 2" class="envflap" />
				</g>
			{/if}

			<!-- you -->
			<text x="52" y="214" text-anchor="middle" class="label">{tx.youLabel}</text>
			<rect x="26" y="220" width="52" height="98" rx="10" class="phone" />
			<rect x="31" y="228" width="42" height="82" rx="6" class="screen" />
			{#each [244, 254, 264] as y (y)}
				<rect x="36" {y} width={y === 264 ? 20 : 32} height="5" rx="2.5" class="chatline" />
			{/each}

			<!-- the chatbot provider -->
			<g class:glow={arrived}>
				<text x="309" y="214" text-anchor="middle" class="label">{tx.providerLabel}</text>
				<rect x="282" y="220" width="54" height="98" rx="8" class="rack" />
				{#each [230, 252, 274, 296] as y (y)}
					<rect x="288" {y} width="42" height="14" rx="3" class="unit" />
					<circle cx="322" cy={y + 7} r="2.2" class="led" />
				{/each}
			</g>

			<!-- what may happen over there -->
			<g class="fates" class:dim={scene !== 'stored'}>
				{#each FATES as x, k (x)}
					<g transform="translate({x} 292)" class="fate" class:on={k < fatesOn}>
						{#if k === 0}
							<rect x="-9" y="-6" width="18" height="12" rx="2" class="ico" />
							<path d="M-10 -10 H10 V-6 H-10 Z" class="ico" />
						{:else if k === 1}
							<path d="M-11 0 Q0 -10 11 0 Q0 10 -11 0 Z" class="ico" />
							<circle r="3.2" class="icofill" />
						{:else}
							<path d="M-11 -4 L0 -9 L11 -4 L0 1 Z" class="ico" />
							<path d="M-6 -1.5 V4 Q0 8 6 4 V-1.5" class="ico" />
						{/if}
						<text y="22" text-anchor="middle" class="small">{tx.fates[k]}</text>
					</g>
				{/each}
			</g>
		</svg>
		{#if scene === 'billboard'}
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
		max-width: 440px;
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
	.picks {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
	}
	.act {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.act.on {
		background: var(--color-brand-soft);
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-grass);
	}
	.ground {
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.board {
		transition: opacity 0.4s;
	}
	.board.faded {
		opacity: 0.35;
	}
	.post {
		fill: var(--color-faint);
	}
	.frame {
		fill: var(--color-ink);
	}
	.face {
		fill: var(--color-card);
	}
	.blank {
		fill: var(--color-line);
	}
	.msg {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 600;
	}
	.msg tspan {
		transition: fill 0.3s;
	}
	.msg tspan.secret {
		fill: var(--color-danger);
		font-weight: 800;
	}
	.msg tspan.removed {
		fill: var(--color-faint);
		font-style: italic;
	}
	.ask {
		fill: var(--color-ink);
		font-family: var(--font-display);
		font-size: 17px;
		font-weight: 600;
	}
	.stamp {
		fill: var(--color-card);
		stroke-width: 2.2;
	}
	.stamp.go {
		stroke: var(--color-grass);
		fill: var(--color-grass-soft);
	}
	.stamp.mid {
		stroke: var(--color-amber);
		fill: var(--color-amber-soft);
	}
	.stamp.stop {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.stamptext {
		font-size: 12px;
		font-weight: 800;
	}
	.stamptext.small {
		font-size: 9.5px;
	}
	.stamptext.go {
		fill: var(--color-grass);
	}
	.stamptext.mid {
		fill: var(--color-amber);
	}
	.stamptext.stop {
		fill: var(--color-danger);
	}
	.label {
		fill: var(--color-muted);
		font-size: 9.5px;
		font-weight: 700;
	}
	.small {
		fill: var(--color-muted);
		font-size: 8.5px;
		font-weight: 700;
	}
	.wire {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2.5;
		stroke-linecap: round;
		transition: stroke 0.3s;
	}
	.wire.cut {
		stroke: var(--color-line);
	}
	.blockdot {
		fill: var(--color-danger);
	}
	.blockx {
		stroke: var(--color-card);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.envbody {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.envflap {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 1.3;
		stroke-linejoin: round;
	}
	.phone {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.screen {
		fill: var(--color-paper);
	}
	.chatline {
		fill: var(--color-brand);
		opacity: 0.6;
	}
	.rack {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition: stroke 0.3s;
	}
	.glow .rack {
		stroke: var(--color-grass);
	}
	.unit {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.fates {
		transition: opacity 0.4s;
	}
	.fates.dim {
		opacity: 0.35;
	}
	.fate {
		opacity: 0.45;
		transition: opacity 0.4s;
	}
	.fates.dim .fate,
	.fate.on {
		opacity: 1;
	}
	.ico {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.fate.on .ico {
		stroke: var(--color-brand);
	}
	.icofill {
		fill: var(--color-muted);
	}
	.fate.on .icofill {
		fill: var(--color-brand);
	}
	.fadein {
		animation: fadein 0.4s ease both;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
	}
	.pop {
		animation: pop 0.35s cubic-bezier(0.3, 1.4, 0.5, 1) both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(1.4);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.board,
		.wire,
		.rack,
		.fates,
		.fate,
		.msg tspan {
			transition: none;
		}
		.pop,
		.fadein {
			animation: none;
		}
	}
</style>
