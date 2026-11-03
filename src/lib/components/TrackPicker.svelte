<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { lang, t } from '$lib/i18n';
	import { tracks, trackCounts, trackSequence, type Track, type TrackId } from '$lib/tracks';
	import { progress } from '$lib/progress.svelte';

	let {
		onpick,
		current,
		selected,
		topicsOnly = false,
		compact = false
	}: {
		onpick: (track: Track) => void;
		/** The learner's current track, marked so a returning visitor can just continue. */
		current?: TrackId;
		/** A card picked but not started yet (highlighted, without the "your track" tag). */
		selected?: TrackId;
		/** Hide Dari Nol, for branching out once it is done. */
		topicsOnly?: boolean;
		/** Smaller cards for the side menu. */
		compact?: boolean;
	} = $props();

	const general = $derived(tracks[0]);
	const topics = $derived(tracks.slice(1));

	function doneIn(track: Track): number {
		return trackSequence(track).filter((r) => progress.isDone(r.chapterId, r.lessonId)).length;
	}
</script>

{#snippet icon(id: TrackId)}
	<svg
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		{#if id === 'general'}
			<path d="M5 20c0-6 3-9 7-9s7 3 7 9" /><path d="M12 11V4" /><path
				d="M12 7c0-2 2-3 4-3 0 2-2 3-4 3Z"
			/>
		{:else if id === 'network'}
			<circle cx="12" cy="5" r="2.2" /><circle cx="5" cy="18" r="2.2" /><circle
				cx="19"
				cy="18"
				r="2.2"
			/>
			<path d="M11 7l-5 9M13 7l5 9M7.2 18h9.6" />
		{:else if id === 'web'}
			<rect x="3" y="4.5" width="18" height="15" rx="2.5" /><path d="M3 9h18" />
			<path d="M9.5 13l-2 1.8 2 1.8M14.5 13l2 1.8-2 1.8" />
		{:else if id === 'cloud'}
			<path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.6 1.5A3.3 3.3 0 0 1 17.5 18Z" />
		{:else if id === 'security'}
			<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6Z" /><path d="M9 12l2 2 4-4" />
		{:else}
			<rect x="6" y="6" width="12" height="12" rx="3" /><path d="M10 10h4v4h-4Z" />
			<path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
		{/if}
	</svg>
{/snippet}

{#snippet card(track: Track, big: boolean, i: number)}
	{@const c = trackCounts(track)}
	{@const done = doneIn(track)}
	{@const isCurrent = current === track.id}
	<button
		type="button"
		class="track"
		class:big
		class:compact
		class:current={isCurrent || selected === track.id}
		disabled={track.soon}
		style="--tc:{track.color}"
		onclick={() => onpick(track)}
		in:fly={{ y: 12, duration: 320, delay: 60 * i, easing: cubicOut }}
	>
		<span class="badge">{@render icon(track.id)}</span>
		<span class="body">
			<span class="head">
				<span class="name">{track.title[$lang]}</span>
				{#if track.soon}
					<span class="pill muted">{$t.trackSoon}</span>
				{:else if isCurrent}
					<span class="pill">{$t.trackCurrent}</span>
				{:else if track.id === 'general'}
					<span class="pill">{$t.recommended}</span>
				{/if}
			</span>
			{#if !compact}
				<span class="tagline">{track.tagline[$lang]}</span>
			{/if}
			<span class="meta">
				{#if track.soon}
					{$t.trackSoonCount.replace('{n}', String(c.soon))}
				{:else if done > 0}
					<span class="bar"><span style="width:{Math.round((done / c.ready) * 100)}%"></span></span>
					<span class="tabular-nums">{done}/{c.ready}</span>
				{:else}
					{$t.trackReady.replace('{n}', String(c.ready))}{#if c.soon > 0}, {$t.trackSoonCount.replace(
							'{n}',
							String(c.soon)
						)}{/if}
				{/if}
			</span>
		</span>
	</button>
{/snippet}

<div class="picker" class:compact>
	{#if !topicsOnly}
		{@render card(general, !compact, 0)}
	{/if}
	<div class="grid">
		{#each topics as tr, i (tr.id)}
			{@render card(tr, false, i + 1)}
		{/each}
	</div>
</div>

<style>
	.picker {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 10px;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px;
	}
	.compact .grid {
		grid-template-columns: 1fr;
		gap: 6px;
	}
	.compact {
		gap: 6px;
	}
	.track {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		border: 1.5px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 14px;
		text-align: left;
		box-shadow: 0 6px 18px rgba(22, 40, 60, 0.06);
		transition:
			border-color 0.18s,
			transform 0.18s,
			box-shadow 0.18s;
		-webkit-tap-highlight-color: transparent;
	}
	.track:not(:disabled):hover {
		border-color: color-mix(in srgb, var(--tc) 55%, var(--color-line));
		transform: translateY(-2px);
		box-shadow: 0 12px 26px rgba(22, 40, 60, 0.1);
	}
	.track:not(:disabled):active {
		transform: translateY(0);
	}
	.track.current {
		border-color: var(--tc);
	}
	.track:disabled {
		cursor: not-allowed;
		opacity: 0.62;
	}
	.track.big {
		padding: 16px 18px;
	}
	.track.compact {
		align-items: center;
		border-radius: 14px;
		padding: 9px 11px;
		box-shadow: none;
	}
	.badge {
		display: flex;
		height: 38px;
		width: 38px;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		background: color-mix(in srgb, var(--tc) 14%, transparent);
		color: var(--tc);
	}
	.big .badge {
		height: 44px;
		width: 44px;
	}
	.compact .badge {
		height: 30px;
		width: 30px;
		border-radius: 9px;
	}
	.body {
		display: flex;
		min-width: 0;
		flex: 1;
		flex-direction: column;
		gap: 3px;
	}
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
	}
	.name {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.big .name {
		font-size: 18px;
	}
	.compact .name {
		font-size: 14px;
	}
	.pill {
		border-radius: 999px;
		background: color-mix(in srgb, var(--tc) 14%, transparent);
		padding: 2px 8px;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--tc);
	}
	.pill.muted {
		background: var(--color-line);
		color: var(--color-muted);
	}
	.tagline {
		font-size: 12.5px;
		line-height: 1.45;
		color: var(--color-muted);
	}
	.meta {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 2px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.bar {
		height: 5px;
		flex: 1;
		max-width: 120px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-line);
	}
	.bar span {
		display: block;
		height: 100%;
		border-radius: 999px;
		background: var(--tc);
	}
	@media (min-width: 640px) {
		.picker:not(.compact) .grid {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
		/* five topic cards, three on top and two wider ones below */
		.picker:not(.compact) .grid > :global(.track) {
			grid-column: span 2;
		}
		.picker:not(.compact) .grid > :global(.track:nth-child(n + 4)) {
			grid-column: span 3;
		}
	}
	@media (max-width: 520px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.track {
			transition: none;
		}
	}
</style>
