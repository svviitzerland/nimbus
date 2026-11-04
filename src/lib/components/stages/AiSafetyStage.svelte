<script lang="ts">
	// A guided "watch" stage in two parts. First the Nimbus helper answers about the free plan,
	// one sentence true and one made up, and the real help page catches the made up one. Then the
	// helper is asked to summarise a review that hides an order in white text, the order hijacks
	// it, and three layers of defense stop it. The only optional play, on the last beat, switches
	// the defenses off and on.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { AiSafetyText } from '$lib/chapters/ai/ai-safety/types';
	import { sceneClock, wrap } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as AiSafetyText);

	type Scene = 'sure' | 'made' | 'check' | 'remember' | 'inject' | 'hidden' | 'layers' | 'try';
	const SCENES: Scene[] = [
		'sure',
		'made',
		'check',
		'remember',
		'inject',
		'hidden',
		'layers',
		'try'
	];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 6, 7];

	let peek = $state<number | null>(null);
	let defenses = $state(true);

	const fromBeat = $derived(SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const active = $derived(peek ?? fromBeat);
	const scene = $derived(SCENES[active]);
	const part2 = $derived(active >= 4);
	const clock = sceneClock(() => [scene, defenses]);
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

	// ---- the layers ----
	const shieldsUp = $derived(
		scene === 'layers'
			? Math.max(0, Math.min(3, Math.floor((t - 400) / 700) + 1))
			: scene === 'try' && defenses
				? 3
				: 0
	);
	const revealed = $derived(
		(scene === 'hidden' && t > 1300) || scene === 'layers' || scene === 'try'
	);
	const scanning = $derived(scene === 'hidden' && t < 1300 && !clock.reduced);

	// ---- the chat ----
	type Tone = 'plain' | 'warn' | 'bad' | 'good';
	type Bub = {
		who: 'you' | 'bot';
		text: string;
		typing?: boolean;
		attach?: string;
		tone?: Tone;
		mark?: 'ok' | 'no';
	};
	const bubbles = $derived.by((): Bub[] => {
		const out: Bub[] = [];
		if (!part2) {
			if (scene === 'sure' && t < 300) return out;
			out.push({ who: 'you', text: tx.question });
			if (scene === 'sure' && t < 1600) {
				out.push({ who: 'bot', text: '', typing: true });
				return out;
			}
			const okMark = scene === 'remember' || (scene === 'check' && t > 900);
			const noMark = scene === 'remember' || (scene === 'check' && t > 1900);
			out.push({ who: 'bot', text: tx.claimTrue, mark: okMark ? 'ok' : undefined });
			if (scene === 'sure' && t < 2400) return out;
			out.push({
				who: 'bot',
				text: tx.claimFake,
				tone: noMark ? 'bad' : scene === 'made' ? 'warn' : 'plain',
				mark: noMark ? 'no' : undefined
			});
			return out;
		}
		out.push({ who: 'you', text: tx.ask, attach: tx.fileName });
		const wait =
			scene === 'inject' ? Infinity : scene === 'hidden' ? 2000 : scene === 'layers' ? 2700 : 1400;
		if (t < wait) {
			if (scene !== 'inject' || t > 600) out.push({ who: 'bot', text: '', typing: true });
			return out;
		}
		const safe = scene === 'layers' || (scene === 'try' && defenses);
		out.push({
			who: 'bot',
			text: safe ? tx.safeReply : tx.hijacked,
			tone: safe ? 'good' : 'bad'
		});
		return out;
	});

	const laid = $derived.by(() => {
		let y = 46;
		return bubbles.map((b) => {
			const lines = b.typing ? [] : wrap(b.text, 32);
			const longest = Math.max(...lines.map((l) => l.length), 0);
			const w = b.typing ? 44 : Math.min(172, longest * 4.25 + 18);
			const h = b.typing ? 22 : lines.length * 10.5 + 10 + (b.attach ? 20 : 0);
			const x = b.who === 'you' ? 204 - w : 16;
			const out = { ...b, lines, x, y, w, h };
			y += h + 8;
			return out;
		});
	});

	// ---- the document on the right ----
	const src1 = $derived(wrap(tx.sourceLines[0], 25));
	const src2 = $derived(wrap(tx.sourceLines[1], 25));
	const src2Y = $derived(64 + src1.length * 10 + 10);
	const okLit = $derived(scene === 'remember' || (scene === 'check' && t > 900));
	const noLit = $derived(scene === 'remember' || (scene === 'check' && t > 1900));

	const reviewLines = $derived(wrap(tx.review, 25));
	const hiddenLines = $derived(wrap(tx.hidden, 25));
	const hiddenY = $derived(64 + reviewLines.length * 10 + 14);

	const SHIELDS = [244, 288, 332];

	function toggle() {
		defenses = !defenses;
		onstate?.(defenses ? 'on' : 'off');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={toggle}>
				{defenses ? tx.offBtn : tx.onBtn}
			</button>
		{/if}
		<svg viewBox="0 0 360 330" class="pic" role="img" aria-label={tx.picture}>
			<!-- the chat window -->
			<rect x="8" y="8" width="206" height="316" rx="14" class="window" />
			<path d="M8 36 H214" class="sep" />
			<circle cx="22" cy="22" r="3.5" class="online" />
			<text x="31" y="25.5" class="botname">{tx.botName}</text>

			{#each laid as b, k (k + b.who + b.text)}
				<g class="pop">
					<rect
						x={b.x}
						y={b.y}
						width={b.w}
						height={b.h}
						rx="8"
						class="bub {b.who}"
						class:warn={b.tone === 'warn'}
						class:bad={b.tone === 'bad'}
						class:good={b.tone === 'good'}
					/>
					{#if b.typing}
						{#each [0, 1, 2] as d (d)}
							<circle
								cx={b.x + 13 + d * 9}
								cy={b.y + 11}
								r="2.4"
								class="dot"
								style="animation-delay:{d * 0.18}s"
							/>
						{/each}
					{:else}
						{#if b.attach}
							<rect x={b.x + 6} y={b.y + 6} width="74" height="15" rx="4" class="attach" />
							<path d="M{b.x + 11} {b.y + 9} h5 l3 3 v6 h-8 Z" class="attachicon" />
							<text x={b.x + 24} y={b.y + 16.5} class="attachtext">{b.attach}</text>
						{/if}
						{#each b.lines as l, j (j)}
							<text x={b.x + 8} y={b.y + 15 + j * 10.5 + (b.attach ? 20 : 0)} class="bt {b.who}"
								>{l}</text
							>
						{/each}
					{/if}
					{#if b.mark}
						<g transform="translate({b.x + b.w + 10} {b.y + 12})"
							><g class="pop">
								<circle r="7" class="mark {b.mark}" />
								{#if b.mark === 'ok'}
									<path d="M-3.2 0.2 L-0.8 2.6 L3.4 -2.4" class="markline" />
								{:else}
									<path d="M-2.8 -2.8 L2.8 2.8 M2.8 -2.8 L-2.8 2.8" class="markline" />
								{/if}
							</g></g
						>
					{/if}
				</g>
			{/each}

			<!-- the document -->
			{#if !part2}
				<g class="doc" class:faded={scene === 'sure' || scene === 'made'}>
					<path d="M222 26 H342 L354 38 V230 H222 Z" class="paper" />
					<path d="M342 26 V38 H354" class="fold" />
					<text x="230" y="46" class="doctitle">{tx.sourceTitle}</text>
					<path d="M230 52 H346" class="sep" />
					{#if okLit}
						<rect x="226" y="56" width="124" height={src1.length * 10 + 6} rx="4" class="hl ok" />
					{/if}
					{#each src1 as l, k (k)}
						<text x="230" y={66 + k * 10} class="doctext">{l}</text>
					{/each}
					{#if noLit}
						<rect
							x="226"
							y={src2Y - 8}
							width="124"
							height={src2.length * 10 + 6}
							rx="4"
							class="hl no"
						/>
					{/if}
					{#each src2 as l, k (k)}
						<text x="230" y={src2Y + 2 + k * 10} class="doctext">{l}</text>
					{/each}
				</g>
				{#if scene === 'remember'}
					<g transform="translate(288 276) rotate(-8)"
						><g class="pop">
							<rect x="-58" y="-16" width="116" height="32" rx="6" class="stamp" />
							<text y="5" text-anchor="middle" class="stamptext">{tx.memo}</text>
						</g></g
					>
				{/if}
			{:else}
				{#if shieldsUp > 0}
					<rect x="217" y="21" width="142" height="215" rx="10" class="fence pop" />
				{/if}
				<g class="doc">
					<path d="M222 26 H342 L354 38 V230 H222 Z" class="paper" />
					<path d="M342 26 V38 H354" class="fold" />
					<text x="230" y="46" class="doctitle">{tx.fileName}</text>
					<path d="M230 52 H346" class="sep" />
					{#each reviewLines as l, k (k)}
						<text x="230" y={66 + k * 10} class="doctext">{l}</text>
					{/each}
					{#if revealed}
						<rect
							x="226"
							y={hiddenY - 8}
							width="124"
							height={hiddenLines.length * 10 + 6}
							rx="4"
							class="hl no pop"
						/>
						<text x="350" y={hiddenY - 12} text-anchor="end" class="hiddentag">{tx.hiddenTag}</text>
					{/if}
					{#each hiddenLines as l, k (k)}
						<text x="230" y={hiddenY + 2 + k * 10} class="hiddentext" class:shown={revealed}
							>{l}</text
						>
					{/each}
					{#if scanning}
						<rect x="224" y={40 + (t / 1300) * 180} width="128" height="12" class="scan" />
					{/if}
				</g>
				{#each SHIELDS as cx, k (cx)}
					{@const on = k < shieldsUp}
					<g transform="translate({cx} 262)" class="shield" class:on>
						<path d="M0 -16 L13 -11 V0 Q13 11 0 17 Q-13 11 -13 0 V-11 Z" class="shieldbody" />
						{#if on}
							<path d="M-4.5 0 L-1.2 3.4 L5 -3.6" class="shieldtick" />
						{/if}
						{#each wrap(tx.shields[k], 7) as l, j (j)}
							<text y={31 + j * 9.5} text-anchor="middle" class="shieldlabel">{l}</text>
						{/each}
					</g>
				{/each}
			{/if}
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
	.window {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.sep {
		stroke: var(--color-line);
		stroke-width: 1;
	}
	.online {
		fill: var(--color-grass);
	}
	.botname {
		fill: var(--color-ink);
		font-size: 10px;
		font-weight: 800;
	}
	.bub {
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.bub.you {
		fill: var(--color-brand);
	}
	.bub.bot {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.bub.bot.warn {
		stroke: var(--color-amber);
		stroke-width: 2;
		animation: throb 1.4s ease-in-out infinite;
	}
	.bub.bot.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 1.6;
	}
	.bub.bot.good {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.6;
	}
	@keyframes throb {
		50% {
			stroke-width: 3.5;
		}
	}
	.bt {
		font-size: 8px;
	}
	.bt.you {
		fill: var(--color-card);
		font-weight: 600;
	}
	.bt.bot {
		fill: var(--color-ink);
	}
	.dot {
		fill: var(--color-faint);
		animation: hop 1s ease-in-out infinite;
	}
	@keyframes hop {
		30% {
			transform: translateY(-2.5px);
		}
	}
	.attach {
		fill: var(--color-card);
		opacity: 0.9;
	}
	.attachicon {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.1;
		stroke-linejoin: round;
	}
	.attachtext {
		fill: var(--color-brand);
		font-size: 7.5px;
		font-weight: 700;
	}
	.mark.ok {
		fill: var(--color-grass);
	}
	.mark.no {
		fill: var(--color-danger);
	}
	.markline {
		fill: none;
		stroke: var(--color-card);
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.doc {
		transition: opacity 0.4s;
	}
	.doc.faded {
		opacity: 0.25;
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.fold {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
		stroke-linejoin: round;
	}
	.doctitle {
		fill: var(--color-brand);
		font-size: 8.5px;
		font-weight: 800;
	}
	.doctext {
		fill: var(--color-ink);
		font-size: 7.5px;
	}
	.hl.ok {
		fill: var(--color-grass-soft);
	}
	.hl.no {
		fill: var(--color-danger-soft);
	}
	.hiddentext {
		fill: var(--color-card);
		font-size: 7.5px;
		transition: fill 0.4s;
	}
	.hiddentext.shown {
		fill: var(--color-danger);
		font-weight: 700;
	}
	.hiddentag {
		fill: var(--color-danger);
		font-size: 7px;
		font-weight: 800;
	}
	.scan {
		fill: var(--color-brand);
		opacity: 0.18;
	}
	.fence {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.shield {
		opacity: 0.45;
		transition: opacity 0.4s;
	}
	.shield.on {
		opacity: 1;
	}
	.shieldbody {
		fill: var(--color-paper);
		stroke: var(--color-faint);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}
	.shield.on .shieldbody {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		animation: pop 0.4s ease both;
	}
	.shieldtick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.shieldlabel {
		fill: var(--color-muted);
		font-size: 7.5px;
		font-weight: 700;
	}
	.stamp {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.stamptext {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
	}
	.pop {
		animation: pop 0.4s ease both;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(4px);
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
		.bub,
		.doc,
		.hiddentext,
		.shield {
			transition: none;
		}
		.pop,
		.dot,
		.bub.bot.warn,
		.shield.on .shieldbody {
			animation: none;
		}
	}
</style>
