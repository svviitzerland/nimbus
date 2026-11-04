<script lang="ts">
	// A guided "watch" stage for RAG. The nimbus.com help chat gets a refund question. First the
	// bot answers from memory and gets it wrong (a hallucination), then it searches the shelf of
	// nimbus.com documents, every page gets a match score, the refund policy wins and slides into
	// the prompt, and the bot answers again, correctly and with its source. The only optional
	// play is editing the refund policy on the last beat and watching the bot look it up again.
	import { fade, fly, scale } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RagDocId, RagText } from '$lib/chapters/ai/rag/types';
	import { sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RagText);

	type Scene =
		| 'ask'
		| 'memory'
		| 'check'
		| 'search'
		| 'chunks'
		| 'paste'
		| 'answer'
		| 'remember'
		| 'try';
	const SCENES: Scene[] = [
		'ask',
		'memory',
		'check',
		'search',
		'chunks',
		'paste',
		'answer',
		'remember',
		'try'
	];
	// ten beats, nine scenes (the fyi beat keeps the remember picture)
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8];
	const SHELF: RagDocId[] = ['pricing', 'contact', 'refund', 'about'];
	const MATCH: Record<RagDocId, number> = { pricing: 27, contact: 38, refund: 91, about: 12 };
	const WIN: RagDocId = 'refund';
	// the chunking scene, every page cut into chunks, each with its numbers (its embedding) and a
	// spot on the map of meanings inside the vector database
	const CHUNKS: { doc: RagDocId; n: number; vec: string; x: number; y: number }[] = [
		{ doc: 'pricing', n: 1, vec: '0.20, 0.91', x: 52, y: 34 },
		{ doc: 'pricing', n: 2, vec: '0.25, 0.84', x: 84, y: 56 },
		{ doc: 'contact', n: 1, vec: '0.11, 0.33', x: 134, y: 92 },
		{ doc: 'refund', n: 1, vec: '0.81, 0.12', x: 206, y: 38 },
		{ doc: 'refund', n: 2, vec: '0.77, 0.18', x: 228, y: 74 },
		{ doc: 'about', n: 1, vec: '0.05, 0.48', x: 40, y: 94 }
	];
	const Q = { x: 262, y: 52 };

	let peek = $state<number | null>(null);
	let days = $state(14);
	let edits = $state(0);

	const active = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => [scene, edits]);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const fill = (s: string) => s.replace('{days}', String(days));
	const retrying = $derived(scene === 'try' && edits > 0);

	type Bot = 'none' | 'typing' | 'searching' | 'wrong' | 'right';
	const bot = $derived.by<Bot>(() => {
		switch (scene) {
			case 'ask':
				return t > 1300 ? 'typing' : 'none';
			case 'memory':
				return t < 1000 ? 'typing' : 'wrong';
			case 'check':
				return 'wrong';
			case 'search':
			case 'chunks':
				return 'searching';
			case 'paste':
				return 'typing';
			case 'answer':
				return t < 1000 ? 'typing' : 'right';
			case 'remember':
				return 'right';
			case 'try':
				return !retrying ? 'right' : t < 1700 ? 'searching' : t < 2500 ? 'typing' : 'right';
		}
	});
	const asked = $derived(scene !== 'ask' || t > 400);
	const stamp = $derived(scene === 'check' && t > 600);

	// the shelf, locked while the bot answers from memory, then scanned one page at a time
	const locked = $derived(scene === 'ask' || scene === 'memory' || scene === 'check');
	const scanned = $derived.by(() => {
		if (locked) return 0;
		if (scene === 'search') return Math.max(0, Math.min(5, Math.floor((t - 300) / 550)));
		if (retrying) return Math.max(0, Math.min(5, Math.floor((t - 150) / 330)));
		return 5;
	});
	const scanning = $derived(!locked && scanned < SHELF.length);
	const won = $derived(!locked && scanned > SHELF.length);
	const peeked = $derived(scene === 'check' && t > 1200);
	const docLit = (d: RagDocId) =>
		(d === WIN && (won || peeked)) || (scanning && SHELF[scanned] === d);
	const docDim = (d: RagDocId) => (locked && !(peeked && d === WIN)) || (won && d !== WIN);

	const showReads = $derived(
		(scene === 'paste' && t > 500) ||
			scene === 'answer' ||
			scene === 'remember' ||
			(scene === 'try' && (!retrying || t > 1700))
	);
	const cut = (k: number) => scene === 'chunks' && t > 300 + k * 220;
	const vecOn = (k: number) => scene === 'chunks' && t > 1900 + k * 160;
	const mapOn = $derived(scene === 'chunks' && t > 3200);
	const dotOn = (k: number) => scene === 'chunks' && t > 3400 + k * 140;
	const qOn = $derived(scene === 'chunks' && t > 4600);
	const nearOn = $derived(scene === 'chunks' && t > 5400);
	const answer = $derived(fill(days > 20 ? tx.answerYes : tx.answerNo));

	function edit() {
		days = days === 14 ? 30 : 14;
		edits += 1;
		onstate?.(days === 30 ? 'longer' : 'shorter');
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={edit}>
				{tx.editBtn.replace('{days}', String(days === 14 ? 30 : 14))}
			</button>
		{/if}

		<div class="pic" role="img" aria-label={tx.picture}>
			<!-- the help chat -->
			<div class="window">
				<div class="bar">
					<span class="logo"></span>
					<span>{tx.appTitle}</span>
				</div>
				<div class="thread">
					{#if asked}
						<div class="msg you" in:fade={{ duration: clock.reduced ? 0 : 250 }}>
							<span class="who">{tx.you}</span>
							<p>{tx.question}</p>
						</div>
					{/if}
					{#if bot !== 'none'}
						<div class="msg ai" in:fade={{ duration: clock.reduced ? 0 : 250 }}>
							<span class="who">{tx.ai}</span>
							{#if bot === 'typing'}
								<div class="typing" aria-hidden="true"><i></i><i></i><i></i></div>
							{:else if bot === 'searching'}
								<p class="status"><span class="glass"></span>{tx.searching}</p>
							{:else if bot === 'wrong'}
								<p in:fade={{ duration: clock.reduced ? 0 : 300 }}>{tx.wrongAnswer}</p>
								<span class="src mem">{tx.fromMemory}</span>
								{#if stamp}
									<span class="stamp" in:scale={{ duration: clock.reduced ? 0 : 300, start: 0.6 }}
										>{tx.madeUp}</span
									>
								{/if}
							{:else}
								{#key answer}
									<p in:fade={{ duration: clock.reduced ? 0 : 300 }}>{answer}</p>
								{/key}
								<span class="src ok">{tx.source.replace('{doc}', tx.docs[WIN].title)}</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- what the model reads, the question plus the page it found -->
			{#if showReads}
				<div class="reads" in:fade={{ duration: clock.reduced ? 0 : 300 }}>
					<p class="label">{tx.readsTitle}</p>
					<p class="q">{tx.question}</p>
					<div class="attached" in:fly={{ y: clock.reduced ? 0 : 40, duration: 600 }}>
						<span class="mini-doc"></span>
						<div>
							<b>{tx.docs[WIN].title}</b>
							{#key days}
								<p in:fade={{ duration: 300 }}>{fill(tx.docs[WIN].body)}</p>
							{/key}
						</div>
					</div>
				</div>
			{/if}

			<!-- the shelf of documents. Compact once the prompt box is up, and left out on the
			     memory beat (the two books take its place), so the picture fits without scrolling -->
			{#if scene === 'chunks'}
				<div class="vdb">
					<p class="label">{tx.chunkTitle}</p>
					<div class="chunks">
						{#each CHUNKS as c, k (k)}
							<div
								class="chunk tint-{c.doc}"
								class:on={cut(k)}
								class:near={nearOn && c.doc === WIN}
							>
								<b>{tx.docs[c.doc].title} {c.n}</b>
								<code class:on={vecOn(k)}>[{c.vec}, …]</code>
							</div>
						{/each}
					</div>
					<div class="map" class:on={mapOn}>
						<p class="label">{tx.dbTitle}</p>
						<svg viewBox="0 0 300 120" aria-hidden="true">
							<rect x="1" y="1" width="298" height="118" rx="12" class="map-bg" />
							{#if nearOn}
								{#each CHUNKS.filter((c) => c.doc === WIN) as c (c.n)}
									<line x1={Q.x} y1={Q.y} x2={c.x} y2={c.y} class="link" />
								{/each}
							{/if}
							{#each CHUNKS as c, k (k)}
								<g
									class="dot tint-{c.doc}"
									class:on={dotOn(k)}
									class:near={nearOn && c.doc === WIN}
								>
									<circle cx={c.x} cy={c.y} r="7" />
									<text x={c.x} y={c.y + 19}>{tx.docs[c.doc].title} {c.n}</text>
								</g>
							{/each}
							{#if qOn}
								<g class="q-dot" in:scale={{ duration: clock.reduced ? 0 : 300, start: 0.4 }}>
									<circle cx={Q.x} cy={Q.y} r="8" />
									<text x={Q.x} y={Q.y - 14}>{tx.questionDot}</text>
								</g>
							{/if}
						</svg>
					</div>
				</div>
			{:else if scene !== 'remember'}
				<div class="shelf" class:locked class:compact={showReads}>
					<p class="label">{tx.shelfTitle}</p>
					<div class="docs">
						{#each SHELF as d, k (d)}
							<div class="doc" class:lit={docLit(d)} class:dim={docDim(d)}>
								<div class="paper">
									<span class="title">{tx.docs[d].title}</span>
									{#if peeked && d === WIN}
										<span class="body" in:fade={{ duration: 300 }}>{fill(tx.docs[d].body)}</span>
									{:else}
										<i></i><i></i><i class="short"></i>
									{/if}
								</div>
								<span class="match" class:show={!locked && k < scanned} class:win={d === WIN}>
									{tx.match.replace('{n}', String(MATCH[d]))}
								</span>
							</div>
						{/each}
					</div>
					{#if locked}
						<p class="unseen">{tx.unseen}</p>
					{/if}
				</div>
			{/if}
		</div>

		{#if scene === 'remember'}
			<div class="books" in:fade={{ duration: 300 }}>
				<figure>
					<svg viewBox="0 0 80 64" width="80" height="64" aria-hidden="true">
						<rect x="18" y="10" width="40" height="48" rx="4" class="cover" />
						<rect x="22" y="10" width="4" height="48" class="spine" />
						<circle cx="60" cy="14" r="10" class="badge bad" />
						<path d="M56 10 l8 8 M64 10 l-8 8" class="mark" />
					</svg>
					<figcaption>{tx.closedBook}</figcaption>
				</figure>
				<figure>
					<svg viewBox="0 0 80 64" width="80" height="64" aria-hidden="true">
						<path d="M8 16 Q24 10 40 16 V58 Q24 52 8 58 Z" class="page" />
						<path d="M72 16 Q56 10 40 16 V58 Q56 52 72 58 Z" class="page" />
						<path d="M14 26 H34 M14 34 H34 M46 26 H66 M46 34 H62" class="ink" />
						<circle cx="66" cy="12" r="10" class="badge good" />
						<path d="M61 12 l4 4 l6 -7" class="mark" />
					</svg>
					<figcaption>{tx.openBook}</figcaption>
				</figure>
			</div>
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
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.pic {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 8px;
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
	.label {
		margin: 0 0 6px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}

	/* chat */
	.window {
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		box-shadow: 0 12px 30px rgba(22, 40, 60, 0.08);
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 8px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.logo {
		height: 12px;
		width: 18px;
		border-radius: 999px;
		background: var(--color-brand);
	}
	.thread {
		display: flex;
		min-height: 150px;
		flex-direction: column;
		gap: 10px;
		padding: 12px;
	}
	.msg {
		position: relative;
		max-width: 88%;
		border-radius: 16px;
		padding: 8px 12px;
		font-size: 13px;
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
		border: 1px solid var(--color-line);
		border-bottom-left-radius: 4px;
		background: var(--color-paper);
	}
	.src {
		display: inline-block;
		margin-top: 6px;
		border-radius: 999px;
		padding: 1px 9px;
		font-size: 10.5px;
		font-weight: 700;
	}
	.src.mem {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.src.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.stamp {
		position: absolute;
		right: -8px;
		top: -10px;
		border: 2px solid var(--color-danger);
		border-radius: 8px;
		background: var(--color-card);
		padding: 1px 8px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-danger);
		transform: rotate(6deg);
	}
	.msg p.status {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: 600;
		color: var(--color-brand);
	}
	.glass {
		position: relative;
		height: 12px;
		width: 12px;
		border: 2px solid var(--color-brand);
		border-radius: 999px;
		animation: wobble 1.2s ease-in-out infinite;
	}
	.glass::after {
		content: '';
		position: absolute;
		right: -5px;
		bottom: -5px;
		height: 2px;
		width: 6px;
		transform: rotate(45deg);
		background: var(--color-brand);
	}
	@keyframes wobble {
		50% {
			transform: translateX(3px);
		}
	}
	.typing {
		display: flex;
		gap: 4px;
		padding: 6px 2px;
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

	/* what the model reads */
	.reads {
		border: 1.5px solid var(--color-brand);
		border-radius: 14px;
		background: var(--color-card);
		padding: 8px 12px;
	}
	.reads .q {
		margin: 0 0 6px;
		font-size: 12.5px;
		color: var(--color-ink);
	}
	.attached {
		display: flex;
		gap: 10px;
		border-radius: 10px;
		background: var(--color-grass-soft);
		padding: 8px 10px;
		font-size: 12px;
		line-height: 1.45;
		color: var(--color-ink);
	}
	.attached p {
		margin: 2px 0 0;
		color: var(--color-muted);
	}
	.mini-doc {
		flex: none;
		height: 26px;
		width: 20px;
		border: 1.5px solid var(--color-grass);
		border-radius: 3px;
		background: var(--color-card);
	}

	/* shelf */
	.shelf {
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-paper);
		padding: 10px 12px;
	}
	.docs {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
	}
	.doc {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 4px;
		transition:
			opacity 0.4s,
			transform 0.4s;
	}
	.shelf.compact .paper {
		flex: 1;
		min-height: 0;
	}
	.shelf.compact .paper i {
		display: none;
	}
	.doc.dim {
		opacity: 0.4;
	}
	.doc.lit {
		transform: translateY(-4px);
	}
	.paper {
		display: flex;
		min-height: 78px;
		flex-direction: column;
		gap: 4px;
		border: 1.5px solid var(--color-line);
		border-radius: 6px 14px 6px 6px;
		background: var(--color-card);
		padding: 7px;
		transition:
			border-color 0.3s,
			box-shadow 0.3s;
	}
	.doc.lit .paper {
		border-color: var(--color-grass);
		box-shadow: 0 6px 16px rgba(58, 156, 100, 0.18);
	}
	.title {
		font-size: 10.5px;
		font-weight: 800;
		line-height: 1.25;
		color: var(--color-ink);
	}
	.body {
		font-size: 9.5px;
		line-height: 1.35;
		color: var(--color-muted);
	}
	.paper i {
		display: block;
		height: 4px;
		border-radius: 999px;
		background: var(--color-line);
	}
	.paper i.short {
		width: 60%;
	}
	.match {
		text-align: center;
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.match.show {
		opacity: 1;
	}
	.match.win {
		color: var(--color-grass);
	}
	.unseen {
		margin: 8px 0 0;
		text-align: center;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-amber);
	}

	/* the chunking scene */
	.vdb {
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-paper);
		padding: 10px 12px;
	}
	.chunks {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 6px;
	}
	.chunk {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border: 1.5px solid var(--color-line);
		border-radius: 8px;
		background: var(--color-card);
		padding: 5px 7px;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.35s,
			transform 0.35s,
			border-color 0.3s;
	}
	.chunk.on {
		opacity: 1;
		transform: none;
	}
	.chunk.near {
		border-color: var(--color-grass);
		box-shadow: 0 4px 12px rgba(58, 156, 100, 0.18);
	}
	.chunk b {
		font-size: 10.5px;
		line-height: 1.25;
		color: var(--color-ink);
	}
	.chunk code {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9.5px;
		color: var(--color-brand);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.chunk code.on {
		opacity: 1;
	}
	.chunk.tint-refund {
		border-left: 4px solid var(--color-grass);
	}
	.chunk.tint-pricing {
		border-left: 4px solid var(--color-amber);
	}
	.chunk.tint-contact,
	.chunk.tint-about {
		border-left: 4px solid var(--color-faint);
	}
	.map {
		margin-top: 10px;
		opacity: 0;
		transition: opacity 0.4s;
	}
	.map.on {
		opacity: 1;
	}
	.map svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.map-bg {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.dot {
		opacity: 0;
		transition: opacity 0.3s;
	}
	.dot.on {
		opacity: 1;
	}
	.dot circle {
		stroke: var(--color-card);
		stroke-width: 2;
	}
	.dot.tint-refund circle {
		fill: var(--color-grass);
	}
	.dot.tint-pricing circle {
		fill: var(--color-amber);
	}
	.dot.tint-contact circle,
	.dot.tint-about circle {
		fill: var(--color-faint);
	}
	.dot.near circle {
		stroke: var(--color-grass);
		stroke-width: 3;
		r: 9;
	}
	.dot text,
	.q-dot text {
		font-size: 9px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.dot.near text {
		fill: var(--color-grass);
	}
	.q-dot circle {
		fill: var(--color-brand);
		stroke: var(--color-card);
		stroke-width: 2;
	}
	.q-dot text {
		fill: var(--color-brand);
		font-weight: 800;
	}
	.link {
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
	}

	/* the two books */
	.books {
		display: flex;
		justify-content: center;
		gap: 28px;
	}
	figure {
		display: flex;
		margin: 0;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	figcaption {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.cover {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.spine {
		fill: var(--color-amber);
	}
	.page {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.ink {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.5;
		stroke-linecap: round;
	}
	.badge.bad {
		fill: var(--color-danger);
	}
	.badge.good {
		fill: var(--color-grass);
	}
	.mark {
		fill: none;
		stroke: var(--color-card);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.docs {
			gap: 6px;
		}
		.paper {
			min-height: 70px;
			padding: 6px;
		}
		.title {
			font-size: 10px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.typing i,
		.glass {
			animation: none;
		}
		.doc,
		.paper,
		.match,
		.act,
		.chunk,
		.chunk code,
		.map,
		.dot {
			transition: none;
		}
	}
</style>
