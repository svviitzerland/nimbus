<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ExperimentText } from '$lib/chapters/types';
	let {
		text,
		done = [],
		children
	}: { text: ExperimentText; done?: boolean[]; children: Snippet } = $props();
	let hint = $state(false);
</script>

<div class="lab-bench">
	<header class="mission">
		<div>
			<span class="eyebrow">{text.labLabel}</span>
			<h2>{text.goal}</h2>
		</div>
		<button type="button" aria-expanded={hint} onclick={() => (hint = !hint)}
			>{text.hintLabel}</button
		>
	</header>
	{#if hint}<p class="hint">{text.hint}</p>{/if}
	<ol aria-label={text.goal}>
		{#each text.tasks as task, i (task)}<li class:done={done[i]}>
				<span aria-hidden="true">{done[i] ? '✓' : i + 1}</span>{task}
			</li>{/each}
	</ol>
	{@render children()}
	<p class="scope">{text.scope}</p>
</div>

<style>
	.lab-bench {
		width: min(100%, 760px);
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding-block: 8px 16px;
	}
	.mission {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
	}
	.eyebrow {
		color: var(--color-brand);
		font-size: 11px;
		font-weight: 700;
	}
	h2 {
		margin: 3px 0 0;
		font-family: var(--font-display);
		font-size: 23px;
		line-height: 1.2;
		color: var(--color-ink);
	}
	button {
		min-height: 44px;
		flex: none;
		color: var(--color-brand);
		font-size: 13px;
	}
	ol {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 18px;
		list-style: none;
		padding: 0;
		margin: 0;
		font-size: 12px;
		color: var(--color-muted);
	}
	li {
		display: flex;
		gap: 7px;
		align-items: center;
	}
	li span {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border: 1px solid var(--color-line);
		border-radius: 50%;
		font-size: 11px;
	}
	li.done {
		color: var(--color-grass);
	}
	li.done span {
		background: color-mix(in srgb, var(--color-grass) 12%, transparent);
		border-color: currentColor;
	}
	.hint {
		margin: 0;
		padding: 12px 16px;
		background: var(--color-brand-soft);
		border-radius: 14px;
		font-size: 13px;
		line-height: 1.6;
		color: var(--color-ink);
	}
	.scope {
		margin: 0;
		font-size: 11px;
		color: var(--color-muted);
		line-height: 1.5;
	}
	.lab-bench :global(.lab-card) {
		border: 1px solid var(--color-line);
		border-radius: 20px;
		padding: 18px;
		background: var(--color-card);
		min-width: 0;
	}
	.lab-bench :global(.lab-actions) {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		align-items: center;
	}
	.lab-bench :global(.lab-button) {
		min-height: 44px;
		padding: 10px 16px;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 13px;
		font-weight: 600;
	}
	.lab-bench :global(.lab-button.primary) {
		background: var(--color-brand);
		border-color: var(--color-brand);
		color: white;
	}
	.lab-bench :global(.lab-button:disabled) {
		opacity: 0.45;
		cursor: not-allowed;
	}
	.lab-bench :global(.lab-button[aria-pressed='true']) {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}
	.lab-bench :global(.lab-grid) {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.lab-bench :global(.lab-code) {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		margin: 10px 0 0;
		padding: 14px;
		border-radius: 12px;
		background: var(--color-paper);
		color: var(--color-ink);
		font: 12px/1.65 monospace;
	}
	.lab-bench :global(.lab-label) {
		display: flex;
		flex-direction: column;
		gap: 8px;
		color: var(--color-muted);
		font-size: 12px;
	}
	.lab-bench :global(.lab-input) {
		width: 100%;
		min-width: 0;
		min-height: 44px;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		padding: 10px;
		background: var(--color-paper);
		color: var(--color-ink);
	}
	.lab-bench :global(.lab-caption) {
		margin: 8px 0;
		font-size: 13px;
		line-height: 1.6;
		color: var(--color-muted);
	}
	.lab-bench :global(.lab-status) {
		font-size: 15px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.lab-bench :global(.lab-check) {
		display: flex;
		gap: 10px;
		align-items: center;
		font-size: 13px;
		color: var(--color-ink);
		min-height: 44px;
	}
	@media (max-width: 600px) {
		.lab-bench :global(.lab-grid) {
			grid-template-columns: 1fr;
		}
		h2 {
			font-size: 21px;
		}
	}
</style>
