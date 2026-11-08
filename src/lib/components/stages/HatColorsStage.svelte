<script lang="ts">
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { Hat, HatColorsText, HatScenarioId } from '$lib/chapters/security/hat-colors/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as HatColorsText);

	// The stories, in order, with the right answer and the hat each one wears.
	const stories: { id: HatScenarioId; legal: boolean; hat: Hat }[] = [
		{ id: 'lab', legal: true, hat: 'white' },
		{ id: 'wifi', legal: false, hat: 'gray' },
		{ id: 'pentest', legal: true, hat: 'white' },
		{ id: 'extort', legal: false, hat: 'black' },
		{ id: 'warn', legal: false, hat: 'gray' },
		{ id: 'bounty', legal: true, hat: 'white' }
	];

	let idx = $state(0);
	let answer = $state<boolean | null>(null);
	let results = $state<boolean[]>([]); // right or wrong, per story answered
	let completed = false;

	const story = $derived(idx < stories.length ? stories[idx] : null);
	const finished = $derived(idx >= stories.length);
	const score = $derived(results.filter(Boolean).length);

	function pick(legal: boolean) {
		if (!story || answer !== null) return;
		answer = legal;
		results.push(legal === story.legal);
		onstate?.(story.id);
		if (idx === stories.length - 1 && !completed) {
			completed = true;
			oncomplete?.();
		}
	}
	function next() {
		idx += 1;
		answer = null;
	}
	function again() {
		idx = 0;
		answer = null;
		results = [];
	}

	const hatFill: Record<Hat, string> = {
		white: '#f7f4ee',
		gray: '#9aa3ab',
		black: '#1d2630'
	};
</script>

{#snippet hat(kind: Hat, size: number)}
	<svg width={size} height={size * 0.62} viewBox="0 0 64 40" fill="none" aria-hidden="true">
		<path
			d="M20 25c-1-8 1-17 5-19 3-1.5 5 1.5 7 1.5s4-3 7-1.5c4 2 6 11 5 19Z"
			fill={hatFill[kind]}
			stroke="var(--color-muted)"
			stroke-width="2"
			stroke-linejoin="round"
		/>
		<path
			d="M4 25c6 6 18 8 28 8s22-2 28-8c-6 1-16 2-28 2S10 26 4 25Z"
			fill={hatFill[kind]}
			stroke="var(--color-muted)"
			stroke-width="2"
			stroke-linejoin="round"
		/>
		<path d="M20.5 22c7 1.5 16 1.5 23 0" stroke="var(--color-amber)" stroke-width="2.4" />
	</svg>
{/snippet}

<div class="wrap">
	<!-- one dot per story -->
	<div class="dots" aria-hidden="true">
		{#each stories as s, i (s.id)}
			<span
				class="d"
				class:on={i === idx}
				class:ok={results[i] === true}
				class:bad={results[i] === false}
			></span>
		{/each}
	</div>

	{#if story}
		<p class="prog">
			{tx.progress.replace('{n}', String(idx + 1)).replace('{total}', String(stories.length))}
		</p>
		{#key story.id}
			<article class="card pop">
				<span class="who">{tx.scenarios[story.id].who}</span>
				<p class="story">{tx.scenarios[story.id].story}</p>
			</article>
		{/key}

		{#if answer === null}
			<p class="ask">{tx.askLabel}</p>
			<div class="pick">
				<button type="button" class="choice yes" onclick={() => pick(true)}>{tx.legalBtn}</button>
				<button type="button" class="choice no" onclick={() => pick(false)}>{tx.illegalBtn}</button>
			</div>
		{:else}
			<div class="reveal pop">
				<div class="hatbox">
					{@render hat(story.hat, 58)}
					<span class="hname">{tx.hats[story.hat]}</span>
				</div>
				<div class="verdict">
					<span class="vt" class:legal={story.legal}
						>{story.legal ? tx.legalTag : tx.illegalTag}</span
					>
					<span class="rt" class:right={answer === story.legal}
						>{answer === story.legal ? tx.rightTag : tx.wrongTag}</span
					>
					<p class="why">{tx.scenarios[story.id].why}</p>
				</div>
			</div>
			{#if idx < stories.length - 1}
				<CallToActionButton onclick={next}>
					{tx.nextBtn}
				</CallToActionButton>
			{:else}
				<button type="button" class="ghost" onclick={next}>{tx.nextBtn}</button>
			{/if}
		{/if}
	{:else if finished}
		<div class="end pop">
			<div class="hats">
				{@render hat('white', 50)}
				{@render hat('gray', 50)}
				{@render hat('black', 50)}
			</div>
			<p class="score">
				{tx.scoreLine.replace('{n}', String(score)).replace('{total}', String(stories.length))}
			</p>
			<p class="doneline">{tx.doneLine}</p>
		</div>
		<button type="button" class="ghost" onclick={again}>{tx.again}</button>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 360px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		overflow-y: auto;
	}
	.dots {
		display: flex;
		gap: 6px;
	}
	.d {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.d.on {
		background: var(--color-brand);
	}
	.d.ok {
		background: var(--color-grass);
	}
	.d.bad {
		background: var(--color-danger);
	}
	.prog {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.card {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 5px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.07);
	}
	.who {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-brand);
	}
	.story {
		font-family: var(--font-display);
		font-size: 15px;
		line-height: 1.35;
		color: var(--color-ink);
	}
	.ask {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.pick {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
	}
	.choice {
		border-radius: 12px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 11px 8px;
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s,
			transform 0.15s;
	}
	.choice:active {
		transform: translateY(1px);
	}
	.choice.yes:hover {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
	}
	.choice.no:hover {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
	}
	.reveal {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 12px;
		border-radius: 14px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 10px 12px;
	}
	.hatbox {
		display: flex;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 2px;
	}
	.hname {
		font-size: 10px;
		font-weight: 800;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.verdict {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 5px;
	}
	.vt,
	.rt {
		border-radius: 999px;
		font-size: 9.5px;
		font-weight: 800;
		padding: 2px 8px;
	}
	.vt {
		background: var(--color-danger);
		color: #fff;
	}
	.vt.legal {
		background: var(--color-grass);
	}
	.rt {
		background: var(--color-amber-soft);
		color: var(--color-amber);
	}
	.rt.right {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.why {
		width: 100%;
		font-size: 11.5px;
		line-height: 1.4;
		color: var(--color-muted);
	}
	.ghost {
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		padding: 7px 14px;
	}
	.ghost:hover {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.wrap :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}
	.end {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 14px;
	}
	.hats {
		display: flex;
		gap: 10px;
	}
	.score {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.doneline {
		text-align: center;
		font-family: var(--font-display);
		font-size: 16px;
		line-height: 1.35;
		color: var(--color-ink);
	}
	.pop {
		animation: popin 0.28s ease;
	}
	@keyframes popin {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 12px;
		}
		.story {
			font-size: 17px;
		}
		.why {
			font-size: 12.5px;
		}
		.wrap :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
	}
</style>
