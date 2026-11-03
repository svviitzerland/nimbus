<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiaCardId, CiaLetter, CiaText } from '$lib/chapters/security/cia/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as CiaText);

	// The deck, dealt in this order. Each card has exactly one right letter.
	const deck: { id: CiaCardId; answer: CiaLetter }[] = [
		{ id: 'yahoo', answer: 'c' },
		{ id: 'ap', answer: 'i' },
		{ id: 'dyn', answer: 'a' },
		{ id: 'price', answer: 'i' },
		{ id: 'laptop', answer: 'c' },
		{ id: 'power', answer: 'a' }
	];
	const letters: CiaLetter[] = ['c', 'i', 'a'];

	let idx = $state(0);
	let sorted = $state<Record<CiaLetter, CiaCardId[]>>({ c: [], i: [], a: [] });
	let missOn = $state<CiaLetter | null>(null);
	let landed = $state<CiaLetter | null>(null);
	let busy = $state(false);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const card = $derived(idx < deck.length ? deck[idx] : null);
	const finished = $derived(idx >= deck.length);

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}

	function drop(letter: CiaLetter) {
		if (!card || busy) return;
		if (letter !== card.answer) {
			missOn = letter;
			onstate?.('miss');
			timers.push(setTimeout(() => (missOn = null), 900));
			return;
		}
		busy = true;
		missOn = null;
		landed = letter;
		const id = card.id;
		onstate?.(id);
		timers.push(
			setTimeout(
				() => {
					sorted[letter].push(id);
					idx += 1;
					busy = false;
					landed = null;
					if (idx >= deck.length && !completed) {
						completed = true;
						oncomplete?.();
					}
				},
				reduced() ? 60 : 420
			)
		);
	}

	function again() {
		timers.forEach(clearTimeout);
		timers = [];
		sorted = { c: [], i: [], a: [] };
		idx = 0;
		busy = false;
		landed = null;
		missOn = null;
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

<div class="wrap">
	<!-- the three letters, these are the buttons -->
	<div class="buckets">
		{#each letters as l (l)}
			<button
				type="button"
				class="bucket"
				class:miss={missOn === l}
				class:hit={landed === l}
				disabled={finished}
				onclick={() => drop(l)}
			>
				<span class="letter">{l.toUpperCase()}</span>
				<span class="bname">{tx.buckets[l].name}</span>
				<span class="bsub">{tx.buckets[l].sub}</span>
				<span class="pile">
					{#each sorted[l] as s (s)}
						<span class="dot pop" title={tx.cards[s].tag}></span>
					{/each}
				</span>
				{#if missOn === l}
					<span class="misstag">{tx.missTag}</span>
				{/if}
			</button>
		{/each}
	</div>

	<p class="hint">
		{finished
			? tx.allDone
			: `${tx.pickHint} ${tx.progress.replace('{n}', String(idx)).replace('{total}', String(deck.length))}`}
	</p>

	<!-- the deck of news clippings -->
	<div class="deck">
		{#if card}
			{#each [1, 2].slice(0, Math.min(2, deck.length - idx - 1)) as k (k)}
				<div
					class="under"
					style="transform: translateY({k * 5}px) scale({1 - k * 0.04})"
				></div>
			{/each}
			{#key card.id}
				<article class="clip" class:fly={landed !== null} class:shake={missOn !== null}>
					<span class="tag" class:own={tx.cards[card.id].tag === 'nimbus.com'}
						>{tx.cards[card.id].tag}</span
					>
					<p class="head">{tx.cards[card.id].head}</p>
					<span class="lines"><i></i><i></i><i class="short"></i></span>
				</article>
			{/key}
		{:else}
			<div class="summary pop">
				{#each letters as l (l)}
					<div class="srow">
						<span class="sl">{l.toUpperCase()}</span>
						<span class="stags">
							{#each sorted[l] as s (s)}
								<span class="stag">{tx.cards[s].tag}</span>
							{/each}
						</span>
					</div>
				{/each}
			</div>
			<button type="button" class="again" onclick={again}>{tx.again}</button>
		{/if}
	</div>
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 420px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		overflow-y: auto;
	}
	.buckets {
		display: grid;
		width: 100%;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 8px;
	}
	.bucket {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		border-radius: 14px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 4px 9px;
		transition:
			border-color 0.2s,
			background 0.2s,
			transform 0.15s;
	}
	.bucket:enabled:hover {
		border-color: var(--color-brand);
	}
	.bucket:active {
		transform: translateY(1px);
	}
	.bucket.miss {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.bucket.hit {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.letter {
		font-family: var(--font-display);
		font-size: 28px;
		line-height: 1;
		color: var(--color-ink);
	}
	.bname {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.bsub {
		min-height: 2.4em;
		text-align: center;
		font-size: 9px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--color-faint);
	}
	.pile {
		display: flex;
		min-height: 8px;
		gap: 3px;
	}
	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.misstag {
		position: absolute;
		top: -9px;
		border-radius: 999px;
		background: var(--color-danger);
		color: #fff;
		font-size: 9px;
		font-weight: 800;
		padding: 1px 7px;
		white-space: nowrap;
	}
	.hint {
		min-height: 2.6em;
		max-width: 340px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.deck {
		position: relative;
		display: flex;
		width: 100%;
		max-width: 300px;
		min-height: 150px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.under {
		position: absolute;
		inset: 0 0 auto;
		height: 128px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		opacity: 0.7;
	}
	.clip {
		position: relative;
		z-index: 1;
		display: flex;
		width: 100%;
		height: 128px;
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
		animation: deal 0.3s ease;
	}
	.clip.fly {
		animation: fly 0.42s ease forwards;
	}
	.clip.shake {
		animation: shake 0.35s ease;
	}
	.tag {
		align-self: flex-start;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		color: var(--color-muted);
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 8px;
	}
	.tag.own {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.head {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.3;
		color: var(--color-ink);
	}
	.lines {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-top: auto;
	}
	.lines i {
		height: 4px;
		border-radius: 4px;
		background: var(--color-line);
	}
	.lines i.short {
		width: 60%;
	}
	.summary {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
	}
	.srow {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.sl {
		width: 18px;
		font-family: var(--font-display);
		font-size: 18px;
		color: var(--color-grass);
	}
	.stags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.stag {
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 9.5px;
		font-weight: 700;
		padding: 2px 7px;
	}
	.again {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		padding: 6px 14px;
	}
	.again:hover {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.4);
			opacity: 0;
		}
	}
	@keyframes deal {
		from {
			transform: translateY(12px);
			opacity: 0;
		}
	}
	@keyframes fly {
		to {
			transform: translateY(-120px) scale(0.3);
			opacity: 0;
		}
	}
	@keyframes shake {
		25% {
			transform: translateX(-6px);
		}
		50% {
			transform: translateX(6px);
		}
		75% {
			transform: translateX(-3px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.clip,
		.clip.fly,
		.clip.shake,
		.pop {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 480px;
			gap: 16px;
		}
		.letter {
			font-size: 34px;
		}
		.bname {
			font-size: 12px;
		}
		.bsub {
			font-size: 10.5px;
		}
		.hint {
			max-width: 440px;
			font-size: 14px;
		}
		.deck {
			max-width: 340px;
		}
		.head {
			font-size: 17px;
		}
	}
</style>
