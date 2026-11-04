<script lang="ts">
	// A guided "watch" stage for embeddings. Words start as a loose jumble of letters, get their
	// numbers, then glide onto a map of meaning where similar words settle side by side. Lines
	// show near and far, a search pin drops among the animals, and the neighbourhoods turn into
	// supermarket aisles. The only optional play is dropping a few new words on the last beat.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { EmbedRegion, EmbedWord, EmbeddingsText } from '$lib/chapters/ai/embeddings/types';
	import { sceneClock } from './webship/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as EmbeddingsText);

	type Scene = 'letters' | 'numbers' | 'settle' | 'near' | 'search' | 'remember' | 'many' | 'try';
	const SCENES: Scene[] = [
		'letters',
		'numbers',
		'settle',
		'near',
		'search',
		'remember',
		'many',
		'try'
	];
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7];

	type Spot = { x: number; y: number; r: EmbedRegion };
	const SPOT: Record<EmbedWord, Spot> = {
		cat: { x: 72, y: 70, r: 'animals' },
		kitten: { x: 96, y: 96, r: 'animals' },
		dog: { x: 118, y: 58, r: 'animals' },
		rabbit: { x: 52, y: 106, r: 'animals' },
		puppy: { x: 136, y: 90, r: 'animals' },
		king: { x: 252, y: 58, r: 'royals' },
		prince: { x: 300, y: 84, r: 'royals' },
		palace: { x: 242, y: 104, r: 'royals' },
		queen: { x: 300, y: 42, r: 'royals' },
		rice: { x: 64, y: 206, r: 'food' },
		bread: { x: 112, y: 222, r: 'food' },
		soup: { x: 50, y: 246, r: 'food' },
		noodles: { x: 96, y: 262, r: 'food' },
		server: { x: 252, y: 200, r: 'tech' },
		cloud: { x: 302, y: 216, r: 'tech' },
		website: { x: 252, y: 246, r: 'tech' },
		nimbus: { x: 300, y: 262, r: 'tech' }
	};
	const BASE: EmbedWord[] = [
		'cat',
		'kitten',
		'dog',
		'rabbit',
		'king',
		'prince',
		'palace',
		'rice',
		'bread',
		'soup',
		'server',
		'cloud',
		'website'
	];
	const NEW: EmbedWord[] = ['puppy', 'queen', 'noodles', 'nimbus'];
	const REGIONS: { id: EmbedRegion; x: number; y: number; rx: number; ry: number; c: string }[] = [
		{ id: 'animals', x: 94, y: 80, rx: 76, ry: 50, c: 'grass' },
		{ id: 'royals', x: 272, y: 72, rx: 66, ry: 50, c: 'amber' },
		{ id: 'food', x: 82, y: 234, rx: 66, ry: 46, c: 'danger' },
		{ id: 'tech', x: 276, y: 230, rx: 66, ry: 46, c: 'brand' }
	];
	// where the loose words float before they have numbers, a tidy jumble in the middle
	const JUMBLE: Partial<Record<EmbedWord, [number, number]>> = {
		cat: [96, 96],
		kitten: [214, 228],
		dog: [256, 120],
		rabbit: [120, 176],
		king: [196, 72],
		prince: [76, 214],
		palace: [292, 178],
		rice: [254, 64],
		bread: [178, 150],
		soup: [292, 248],
		server: [118, 254],
		cloud: [66, 140],
		website: [222, 190]
	};
	const QUERY = { x: 84, y: 84 };

	let peek = $state<number | null>(null);
	let dropped = $state(0);

	const active = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const scene = $derived(SCENES[active]);
	const clock = sceneClock(() => scene);
	const t = $derived(clock.t);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		void beat;
		peek = null;
	});

	const placed = $derived(active >= 2);
	const words = $derived<EmbedWord[]>(scene === 'try' ? [...BASE, ...NEW.slice(0, dropped)] : BASE);
	const pos = (w: EmbedWord) => {
		if (!placed && JUMBLE[w]) {
			const [x, y] = JUMBLE[w]!;
			return { x, y };
		}
		return SPOT[w];
	};
	const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
		Math.hypot(a.x - b.x, a.y - b.y);
	const nearest = (p: { x: number; y: number }, pool: EmbedWord[], n: number) =>
		[...pool].sort((a, b) => dist(SPOT[a], p) - dist(SPOT[b], p)).slice(0, n);

	// which words are in focus on each scene
	const focus = $derived.by<EmbedWord[] | null>(() => {
		if (scene === 'letters') return ['cat', 'dog', 'server'];
		if (scene === 'numbers') return ['cat', 'dog', 'server'];
		if (scene === 'near') return ['cat', 'kitten', 'dog', 'rabbit', 'server'];
		if (scene === 'search' && t > 1400) return nearest(QUERY, BASE, 3);
		if (scene === 'many') return ['cat'];
		if (scene === 'try' && dropped > 0) {
			const w = NEW[dropped - 1];
			return [w, ...nearest(SPOT[w], BASE, 2)];
		}
		return null;
	});
	const dim = (w: EmbedWord) => focus !== null && !focus.includes(w);

	// the two numbers of a word, read straight off its spot on the map
	const vec = (w: EmbedWord) => {
		const s = SPOT[w];
		return [(s.x / 360).toFixed(2), (1 - s.y / 300).toFixed(2)];
	};
	const vecShown = (k: number) => scene === 'numbers' && t > 500 + k * 700;

	// lines between words
	type Link = { a: { x: number; y: number }; b: { x: number; y: number }; far: boolean; k: number };
	const links = $derived.by<Link[]>(() => {
		if (scene === 'near') {
			const cat = SPOT.cat;
			const out: Link[] = (['kitten', 'dog', 'rabbit'] as EmbedWord[]).map((w, k) => ({
				a: cat,
				b: SPOT[w],
				far: false,
				k
			}));
			if (t > 1800 || clock.reduced) out.push({ a: cat, b: SPOT.server, far: true, k: 3 });
			return out;
		}
		if (scene === 'search' && t > 1400) {
			return nearest(QUERY, BASE, 3).map((w, k) => ({ a: QUERY, b: SPOT[w], far: false, k }));
		}
		if (scene === 'try' && dropped > 0) {
			const w = NEW[dropped - 1];
			return nearest(SPOT[w], BASE, 2).map((n, k) => ({ a: SPOT[w], b: SPOT[n], far: false, k }));
		}
		return [];
	});
	const farMid = $derived({
		x: (SPOT.cat.x + SPOT.server.x) / 2,
		y: (SPOT.cat.y + SPOT.server.y) / 2
	});

	const showRegions = $derived(scene === 'remember' || scene === 'many' || scene === 'try');
	const pinDown = $derived(scene === 'search' && t > 600);

	// a long, made up list of numbers for the real size scene
	const MANY = Array.from(
		{ length: 9 },
		(_, k) => (((Math.sin(k * 12.9898) * 43758.5453) % 1) + 1) % 1
	);
	const manyShown = $derived(scene === 'many' ? Math.min(MANY.length, Math.floor(t / 260)) : 0);

	const labelW = (s: string) => s.length * 6.6 + 16;

	function drop() {
		if (dropped >= NEW.length) {
			dropped = 0;
			return;
		}
		const w = NEW[dropped];
		dropped += 1;
		onstate?.(w);
	}
</script>

{#snippet picture(_i: number)}
	<div class="visual">
		{#if scene === 'try'}
			<button type="button" class="act" onclick={drop}>
				{dropped >= NEW.length ? tx.againBtn : tx.dropBtn}
			</button>
		{/if}

		<svg viewBox="0 0 360 300" class="map" role="img" aria-label={tx.mapLabel}>
			<rect x="1" y="1" width="358" height="298" rx="18" class="paper" />
			{#each [75, 150, 225] as gy (gy)}
				<line x1="12" x2="348" y1={gy} y2={gy} class="grid" class:show={placed} />
			{/each}
			{#each [90, 180, 270] as gx (gx)}
				<line y1="12" y2="288" x1={gx} x2={gx} class="grid" class:show={placed} />
			{/each}

			{#if showRegions}
				{#each REGIONS as r (r.id)}
					<g in:fade={{ duration: clock.reduced ? 0 : 500 }}>
						<ellipse cx={r.x} cy={r.y} rx={r.rx} ry={r.ry} class="region {r.c}" />
						{#if scene === 'remember'}
							<g transform="translate({r.x} {r.y - r.ry - 2})">
								<rect
									x={-labelW(tx.regions[r.id]) / 2}
									y="-9"
									width={labelW(tx.regions[r.id])}
									height="18"
									rx="5"
									class="sign {r.c}"
								/>
								<text y="4" text-anchor="middle" class="sign-text">{tx.regions[r.id]}</text>
							</g>
						{/if}
					</g>
				{/each}
			{/if}

			{#each links as l (`${scene}-${l.k}-${dropped}`)}
				<line
					x1={l.a.x}
					y1={l.a.y}
					x2={l.b.x}
					y2={l.b.y}
					class="link"
					class:far={l.far}
					style="--d:{l.k * 0.25}s"
				/>
			{/each}
			{#if scene === 'near' && links.some((l) => l.far)}
				<g transform="translate({farMid.x} {farMid.y})" in:fade={{ duration: 300 }}>
					<rect x="-18" y="-9" width="36" height="18" rx="9" class="far-tag" />
					<text y="4" text-anchor="middle" class="far-text">{tx.far}</text>
				</g>
			{/if}

			{#if scene === 'search'}
				<g
					class="pin"
					class:down={pinDown || clock.reduced}
					style="--px:{QUERY.x}px; --py:{QUERY.y}px"
				>
					{#if pinDown || clock.reduced}
						<circle r="20" class="ring" />
					{/if}
					<circle r="6" class="pin-dot" />
					<g transform="translate(0 -18)">
						<rect
							x={-labelW(tx.query) / 2}
							y="-10"
							width={labelW(tx.query)}
							height="20"
							rx="10"
							class="pin-tag"
						/>
						<text y="4" text-anchor="middle" class="pin-text">{tx.query}</text>
					</g>
				</g>
			{/if}

			{#each words as w, k (w)}
				{@const p = pos(w)}
				<g
					class="word"
					class:dim={dim(w)}
					class:new={NEW.includes(w)}
					class:still={clock.reduced}
					style="transform:translate({p.x}px, {p.y}px); transition-delay:{scene === 'settle' &&
					!clock.reduced
						? k * 110
						: 0}ms"
				>
					<circle r="3.5" class="dot {SPOT[w].r}" class:hide={!placed} />
					<g transform="translate(0 {placed ? -12 : 0})" class="lbl">
						<rect
							x={-labelW(tx.words[w]) / 2}
							y="-10"
							width={labelW(tx.words[w])}
							height="20"
							rx="6"
							class="pill"
						/>
						<text y="4" text-anchor="middle" class="w">{tx.words[w]}</text>
					</g>
					{#if scene === 'numbers' && focus?.includes(w)}
						{@const v = vec(w)}
						{#if vecShown(focus?.indexOf(w) ?? 0)}
							<g transform="translate(0 22)" in:fade={{ duration: 300 }}>
								<rect x="-38" y="-10" width="76" height="20" rx="6" class="vec-pill" />
								<text y="4" text-anchor="middle" class="vec">[{v[0]}, {v[1]}]</text>
							</g>
						{/if}
					{/if}
				</g>
			{/each}
		</svg>

		{#if scene === 'many'}
			<div class="many" in:fade={{ duration: 300 }}>
				<p class="many-label">{tx.manyLabel.replace('{word}', tx.words.cat)}</p>
				<p class="nums">
					[{#each MANY.slice(0, manyShown) as n, k (k)}<span in:fade={{ duration: 200 }}
							>{k ? ', ' : ''}{n.toFixed(2)}</span
						>{/each}{manyShown >= MANY.length ? ', ...' : ''}]
				</p>
				<p class="many-count">{tx.manyCount.replace('{n}', '768')}</p>
			</div>
		{/if}

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
		max-width: 440px;
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
	.map {
		display: block;
		width: 100%;
		height: auto;
		max-height: 58vh;
		overflow: visible;
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.grid {
		stroke: var(--color-line);
		stroke-width: 1;
		opacity: 0;
		transition: opacity 0.6s;
	}
	.grid.show {
		opacity: 0.7;
	}

	.region {
		stroke-width: 1.5;
	}
	.region.grass {
		fill: var(--color-grass-soft);
		stroke: color-mix(in srgb, var(--color-grass) 35%, transparent);
	}
	.region.amber {
		fill: var(--color-amber-soft);
		stroke: color-mix(in srgb, var(--color-amber) 35%, transparent);
	}
	.region.danger {
		fill: var(--color-danger-soft);
		stroke: color-mix(in srgb, var(--color-danger) 35%, transparent);
	}
	.region.brand {
		fill: var(--color-brand-soft);
		stroke: color-mix(in srgb, var(--color-brand) 35%, transparent);
	}
	.sign.grass {
		fill: var(--color-grass);
	}
	.sign.amber {
		fill: var(--color-amber);
	}
	.sign.danger {
		fill: var(--color-danger);
	}
	.sign.brand {
		fill: var(--color-brand);
	}
	.sign-text {
		fill: var(--color-card);
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}

	.word {
		transition:
			transform 1.1s cubic-bezier(0.3, 0.8, 0.3, 1),
			opacity 0.4s;
	}
	.word.still {
		transition: none;
	}
	.word.dim {
		opacity: 0.28;
	}
	.word.new {
		animation: drop 0.9s cubic-bezier(0.3, 0.8, 0.3, 1);
	}
	@keyframes drop {
		from {
			transform: translate(180px, -20px);
			opacity: 0;
		}
	}
	.lbl {
		transition: transform 1.1s;
	}
	.pill {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.word.new .pill {
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.w {
		fill: var(--color-ink);
		font-size: 11.5px;
		font-weight: 600;
	}
	.dot {
		transition: opacity 0.4s;
	}
	.dot.hide {
		opacity: 0;
	}
	.dot.animals {
		fill: var(--color-grass);
	}
	.dot.royals {
		fill: var(--color-amber);
	}
	.dot.food {
		fill: var(--color-danger);
	}
	.dot.tech {
		fill: var(--color-brand);
	}
	.vec-pill {
		fill: var(--color-brand-soft);
	}
	.vec {
		fill: var(--color-brand);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 10.5px;
		font-weight: 700;
	}

	.link {
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
		animation: grow 0.6s ease-out both;
		animation-delay: var(--d);
	}
	.link.far {
		stroke: var(--color-faint);
		stroke-width: 1.5;
	}
	@keyframes grow {
		from {
			opacity: 0;
		}
	}
	.far-tag {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.far-text {
		fill: var(--color-muted);
		font-size: 10.5px;
		font-weight: 700;
	}

	.pin {
		transform: translate(var(--px), -30px);
		opacity: 0;
		transition:
			transform 0.7s cubic-bezier(0.3, 1.4, 0.5, 1),
			opacity 0.3s;
	}
	.pin.down {
		transform: translate(var(--px), var(--py));
		opacity: 1;
	}
	.pin-dot {
		fill: var(--color-brand);
	}
	.ring {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.5;
		transform-origin: 0 0;
		animation: ring 1.8s ease-out infinite;
	}
	@keyframes ring {
		from {
			transform: scale(0.3);
			opacity: 0.9;
		}
		to {
			transform: scale(1.8);
			opacity: 0;
		}
	}
	.pin-tag {
		fill: var(--color-brand);
	}
	.pin-text {
		fill: var(--color-card);
		font-size: 11px;
		font-weight: 700;
	}

	.many {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 10px 14px;
		text-align: center;
	}
	.many-label {
		margin: 0;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.nums {
		margin: 4px 0;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-brand);
		word-break: break-word;
	}
	.many-count {
		margin: 0;
		font-size: 12px;
		color: var(--color-muted);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.word,
		.lbl,
		.grid,
		.dot,
		.pin,
		.act {
			transition: none;
		}
		.word.new,
		.link,
		.ring {
			animation: none;
		}
	}
</style>
