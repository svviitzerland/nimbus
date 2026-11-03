<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { TrainingText } from '$lib/chapters/ai/training/types';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as TrainingText);

	type Kind = 'apple' | 'orange';
	// tone goes from red (0) to orange (1), size from small (0) to big (1). The model sees only these.
	type Fruit = { tone: number; size: number; truth: Kind };
	type Placed = Fruit & { label: Kind; byModel: boolean };
	const KINDS: Kind[] = ['apple', 'orange'];

	const EXAMPLES: Fruit[] = [
		{ tone: 0.1, size: 0.35, truth: 'apple' },
		{ tone: 0.8, size: 0.75, truth: 'orange' },
		{ tone: 0.9, size: 0.6, truth: 'orange' },
		{ tone: 0.25, size: 0.45, truth: 'apple' },
		{ tone: 0.7, size: 0.9, truth: 'orange' },
		{ tone: 0.05, size: 0.5, truth: 'apple' }
	];
	const NEW: Fruit[] = [
		{ tone: 0.15, size: 0.4, truth: 'apple' },
		{ tone: 0.85, size: 0.8, truth: 'orange' },
		{ tone: 0.35, size: 0.55, truth: 'apple' },
		{ tone: 0.6, size: 0.65, truth: 'orange' },
		{ tone: 0.2, size: 0.6, truth: 'apple' }
	];

	let placed = $state<Placed[]>([]);
	let phase = $state<'label' | 'training' | 'trained'>('label');
	let model = $state<Record<Kind, { tone: number; size: number }> | null>(null);
	let sent = $state(0);
	let last = $state<{ label: Kind; sure: number; ok: boolean } | null>(null);
	let missed = $state(false);
	let saidLabel = false;
	let saidRight = false;
	let completed = false;
	let timer: ReturnType<typeof setTimeout> | undefined;

	const taught = $derived(placed.filter((p) => !p.byModel).length);
	const current = $derived(
		phase === 'label'
			? EXAMPLES[taught]
			: phase === 'trained' && sent < NEW.length
				? NEW[sent]
				: null
	);
	const inBasket = (k: Kind) => placed.filter((p) => p.label === k);

	function label(k: Kind) {
		if (phase !== 'label' || taught >= EXAMPLES.length) return;
		placed = [...placed, { ...EXAMPLES[taught], label: k, byModel: false }];
		if (taught === EXAMPLES.length) onstate?.('ready');
		else if (!saidLabel) onstate?.('label');
		saidLabel = true;
	}

	// Training, the whole of it. Average the examples in each basket.
	function learn() {
		const avg = (k: Kind) => {
			const xs = placed.filter((p) => p.label === k);
			if (xs.length === 0) return { tone: k === 'apple' ? 0 : 1, size: 0.5 };
			return {
				tone: xs.reduce((s, p) => s + p.tone, 0) / xs.length,
				size: xs.reduce((s, p) => s + p.size, 0) / xs.length
			};
		};
		return { apple: avg('apple'), orange: avg('orange') };
	}

	function train() {
		if (phase !== 'label' || taught < EXAMPLES.length) return;
		phase = 'training';
		const reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		timer = setTimeout(
			() => {
				model = learn();
				phase = 'trained';
				onstate?.('trained');
			},
			reduced ? 0 : 1300
		);
	}

	// Prediction. Whichever average the new fruit sits closer to wins.
	function sendNext() {
		if (!model || sent >= NEW.length) return;
		const f = NEW[sent];
		const d = (k: Kind) => Math.hypot(f.tone - model![k].tone, f.size - model![k].size);
		const da = d('apple');
		const dor = d('orange');
		const guess: Kind = da <= dor ? 'apple' : 'orange';
		const sure = Math.round((Math.max(da, dor) / (da + dor || 1)) * 100);
		placed = [...placed, { ...f, label: guess, byModel: true }];
		sent++;
		last = { label: guess, sure, ok: guess === f.truth };
		if (!last.ok) {
			missed = true;
			onstate?.('wrong');
		} else if (sent === NEW.length) {
			onstate?.('done');
		} else if (!saidRight) {
			saidRight = true;
			onstate?.('right');
		}
		if (sent === NEW.length && !completed) {
			completed = true;
			oncomplete?.();
		}
	}

	function reset() {
		clearTimeout(timer);
		placed = [];
		phase = 'label';
		model = null;
		sent = 0;
		last = null;
		missed = false;
	}

	onDestroy(() => clearTimeout(timer));

	const nameOf = (k: Kind) => (k === 'apple' ? tx.apple : tx.orange);
	const tint = (tone: number) =>
		`color-mix(in srgb, var(--color-amber) ${Math.round(tone * 100)}%, var(--color-danger))`;
	const radius = (size: number) => 9 + size * 13;
</script>

{#snippet fruit(f: { tone: number; size: number }, kind: Kind | null, box: number)}
	{@const r = radius(f.size)}
	{@const s = r / 20}
	<svg width={box} height={box} viewBox="0 0 60 60" class="fruit" aria-hidden="true">
		{#if kind === 'apple'}
			<g transform="translate(30 32) scale({s}) translate(-30 -32)">
				<path d="M30 18 q1 -6 4 -9" class="stem" />
				<path d="M32 14 q7 -8 14 -5 q-4 8 -14 5Z" class="leaf" />
				<path
					d="M30 18 C22 12 10 16 10 30 C10 44 20 52 30 50 C40 52 50 44 50 30 C50 16 38 12 30 18Z"
					style="fill:{tint(f.tone)}"
					class="skin"
				/>
			</g>
		{:else if kind === 'orange'}
			<circle cx="30" cy="31" {r} style="fill:{tint(f.tone)}" class="skin" />
			<circle cx="30" cy={31 - r + 3} r="1.6" class="navel" />
			<circle cx={30 - r * 0.4} cy={31 - r * 0.1} r="0.9" class="pore" />
			<circle cx={30 + r * 0.35} cy={31 + r * 0.3} r="0.9" class="pore" />
			<circle cx={30 + r * 0.1} cy={31 - r * 0.45} r="0.9" class="pore" />
		{:else}
			<circle cx="30" cy="31" {r} style="fill:{tint(f.tone)}" class="skin avg" />
		{/if}
	</svg>
{/snippet}

<div class="stage">
	<!-- the belt: the fruit on its way, and what to do with it -->
	<div class="belt">
		{#if phase === 'label' && current}
			<div class="now">{@render fruit(current, current.truth, 78)}</div>
			<span class="hint">{tx.labelHint.replace('{n}', String(taught))}</span>
		{:else if phase === 'label'}
			<CallToActionButton onclick={train}>{tx.trainBtn}</CallToActionButton>
			<span class="hint">{tx.readyHint}</span>
		{:else if phase === 'training'}
			<div class="study"><span class="fill"></span></div>
			<span class="hint">{tx.training}</span>
		{:else if current}
			<div class="now">{@render fruit(current, current.truth, 78)}</div>
			<CallToActionButton onclick={sendNext}>{tx.nextBtn}</CallToActionButton>
			<span class="hint">
				{#if last}
					<b class:bad={!last.ok}
						>{tx.guess.replace('{label}', nameOf(last.label)).replace('{n}', String(last.sure))}</b
					>
				{/if}
				{tx.sorted.replace('{n}', String(sent))}
			</span>
		{:else}
			<span class="hint">
				{#if last}
					<b class:bad={!last.ok}
						>{tx.guess.replace('{label}', nameOf(last.label)).replace('{n}', String(last.sure))}</b
					>
				{/if}
				{tx.doneNote}
			</span>
			<button type="button" class="ghost" onclick={reset}>{tx.reset}</button>
		{/if}
	</div>

	<!-- the two baskets, which are also the buttons while you label -->
	<div class="baskets">
		{#each KINDS as k (k)}
			<button
				type="button"
				class="basket"
				class:live={phase === 'label' && !!current}
				disabled={!(phase === 'label' && current)}
				aria-label={tx.basket.replace('{label}', nameOf(k))}
				onclick={() => label(k)}
			>
				<span class="bname">{nameOf(k)}</span>
				<span class="pile">
					{#each inBasket(k) as p, i (i)}
						<span class="item" class:model={p.byModel}>
							{@render fruit(p, p.truth, 30)}
							{#if missed && p.label !== p.truth && !p.byModel}
								<span class="dot" aria-hidden="true"></span>
							{/if}
							{#if p.byModel}
								<span class="tick" class:bad={p.label !== p.truth} aria-hidden="true"
									>{p.label === p.truth ? '✓' : '✗'}</span
								>
							{/if}
						</span>
					{/each}
				</span>
			</button>
		{/each}
	</div>
	<div class="legend">
		<span><i class="sw you"></i>{tx.byYou}</span>
		<span><i class="sw mod"></i>{tx.byModel}</span>
	</div>

	<!-- the model itself, just two averages -->
	<div class="learned">
		<span class="cap">{tx.learnedTitle}</span>
		{#if model}
			<div class="avgs">
				{#each KINDS as k (k)}
					<div class="avg">
						{@render fruit(model[k], null, 54)}
						<span>{tx.avg.replace('{label}', nameOf(k))}</span>
					</div>
				{/each}
			</div>
			<span class="sub">{tx.sees}</span>
		{:else}
			<span class="sub">{tx.notYet}</span>
		{/if}
	</div>

	{#if phase !== 'label' || taught > 0}
		{#if phase !== 'trained' || current}
			<button type="button" class="ghost" onclick={reset}>{tx.reset}</button>
		{/if}
	{/if}
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding-bottom: 8px;
	}
	.belt {
		display: flex;
		min-height: 150px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
	}
	.belt :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.now {
		animation: roll 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes roll {
		from {
			transform: translateX(-40px);
			opacity: 0;
		}
	}
	.hint {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		font-size: 12px;
		color: var(--color-faint);
		text-align: center;
	}
	.hint b {
		font-size: 13px;
		color: var(--color-grass);
	}
	.hint b.bad {
		color: var(--color-danger);
	}
	.study {
		width: 160px;
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-line);
	}
	.fill {
		display: block;
		height: 100%;
		width: 100%;
		border-radius: inherit;
		background: var(--color-brand);
		transform-origin: left;
		animation: study 1.3s ease-in-out both;
	}
	@keyframes study {
		from {
			transform: scaleX(0);
		}
	}

	.baskets {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		width: 100%;
		max-width: 340px;
	}
	.basket {
		display: flex;
		min-height: 104px;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 6px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.basket:disabled {
		cursor: default;
	}
	.basket.live {
		border-color: var(--color-brand);
	}
	.basket.live:hover {
		background: var(--color-brand-soft);
	}
	.bname {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-ink);
		text-transform: capitalize;
	}
	.pile {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 2px;
	}
	.item {
		position: relative;
		line-height: 0;
		border-radius: 50%;
		animation: drop 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.item.model {
		background: var(--color-brand-soft);
	}
	@keyframes drop {
		from {
			transform: translateY(-14px);
			opacity: 0;
		}
	}
	.dot {
		position: absolute;
		top: 0;
		right: 0;
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--color-danger);
		border: 1.5px solid var(--color-card);
	}
	.tick {
		position: absolute;
		top: -4px;
		right: -4px;
		display: grid;
		place-items: center;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		font-size: 8px;
		font-weight: 800;
		line-height: 1;
		color: #fff;
		background: var(--color-grass);
	}
	.tick.bad {
		background: var(--color-danger);
	}
	.legend {
		display: flex;
		gap: 14px;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.legend span {
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.sw {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1.5px solid var(--color-line);
	}
	.sw.mod {
		background: var(--color-brand-soft);
		border-color: var(--color-brand-soft);
	}

	.learned {
		display: flex;
		width: 100%;
		max-width: 340px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		border-radius: 14px;
		background: var(--color-paper);
		border: 1.5px solid var(--color-line);
		padding: 8px;
	}
	.cap {
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		letter-spacing: 0.02em;
	}
	.avgs {
		display: flex;
		gap: 28px;
	}
	.avg {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-muted);
		animation: drop 0.4s ease both;
	}
	.sub {
		font-size: 11px;
		color: var(--color-faint);
		text-align: center;
	}
	.ghost {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-muted);
		padding: 6px 8px;
	}
	.ghost:hover {
		color: var(--color-ink);
	}

	.fruit {
		display: block;
		overflow: visible;
	}
	.skin {
		stroke: color-mix(in srgb, var(--color-ink) 30%, transparent);
		stroke-width: 1.2;
	}
	.skin.avg {
		stroke: var(--color-ink);
		stroke-opacity: 0.35;
	}
	.stem {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.leaf {
		fill: var(--color-grass);
	}
	.navel {
		fill: color-mix(in srgb, var(--color-grass) 70%, var(--color-ink));
	}
	.pore {
		fill: color-mix(in srgb, var(--color-ink) 22%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.now,
		.item,
		.avg,
		.fill {
			animation: none;
		}
		.basket {
			transition: none;
		}
	}

	@media (min-width: 768px) {
		.baskets,
		.learned {
			max-width: 400px;
		}
	}
</style>
