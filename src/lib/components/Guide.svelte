<script lang="ts">
	// The "watch" layout for explainer stages: a visual on the left that moves by itself, and a
	// calm side panel on the right that explains the part in focus. It follows Nim's beats (the
	// stage passes `active`), and a tap on a step is an optional shortcut, never a requirement.
	// On a phone the panel sits under the visual.
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	type Step = { title: string; body: string; tag?: string };
	let {
		steps,
		active,
		onselect,
		visual,
		accent = 'var(--color-brand)'
	}: {
		steps: Step[];
		/** The step in focus, usually derived from the current beat. */
		active: number;
		/** Optional, lets the learner peek at another step by tapping its dot. */
		onselect?: (i: number) => void;
		visual: Snippet<[number]>;
		accent?: string;
	} = $props();

	const i = $derived(Math.max(0, Math.min(active, steps.length - 1)));
	const step = $derived(steps[i]);
	const fadeDuration = () =>
		typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
			? 0
			: 180;
</script>

<div class="guide" style="--ac:{accent}">
	<div class="visual">{@render visual(i)}</div>
	<aside class="panel" aria-live="polite">
		{#key i}
			<div in:fade={{ duration: fadeDuration() }}>
				{#if step.tag}<span class="tag">{step.tag}</span>{/if}
				<h3>{step.title}</h3>
				<!-- Curated lesson markup, never learner input. -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				<p>{@html step.body}</p>
			</div>
		{/key}
		{#if steps.length > 1}
			<div class="dots" role="group" aria-label={step.title}>
				{#each steps as s, k (k)}
					<button
						type="button"
						aria-pressed={k === i}
						aria-label={s.title}
						title={s.title}
						class:on={k === i}
						disabled={!onselect}
						onclick={() => onselect?.(k)}><span></span></button
					>
				{/each}
			</div>
		{/if}
	</aside>
</div>

<style>
	.guide {
		display: grid;
		width: min(100%, 880px);
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		align-items: center;
		gap: 22px;
	}
	.visual {
		display: flex;
		min-width: 0;
		justify-content: center;
	}
	.panel {
		border: 1px solid var(--color-line);
		border-radius: 20px;
		background: var(--color-card);
		padding: 20px 22px 16px;
		box-shadow: 0 10px 28px rgba(22, 40, 60, 0.07);
	}
	.tag {
		display: inline-block;
		margin-bottom: 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ac) 13%, transparent);
		padding: 3px 10px;
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: var(--ac);
	}
	h3 {
		margin: 0;
		font-family: var(--font-display);
		font-size: 21px;
		font-weight: 600;
		color: var(--color-ink);
	}
	p {
		margin: 8px 0 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--color-muted);
	}
	.dots {
		display: flex;
		gap: 2px;
		flex-wrap: wrap;
		margin-top: 10px;
	}
	.dots button {
		height: 44px;
		width: 28px;
		display: grid;
		place-items: center;
	}
	.dots button span {
		height: 4px;
		width: 18px;
		border-radius: 999px;
		background: var(--color-line);
		transition:
			background 0.2s,
			width 0.2s;
	}
	.dots button.on span {
		width: 24px;
		background: var(--ac);
	}
	.dots button:disabled {
		cursor: default;
	}
	@media (max-width: 767px) {
		.guide {
			grid-template-columns: 1fr;
			gap: 14px;
		}
		.panel {
			padding: 16px 18px 14px;
		}
		h3 {
			font-size: 18px;
		}
		p {
			font-size: 13.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dots button {
			transition: none;
		}
	}
</style>
