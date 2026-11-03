<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { lang, t } from '$lib/i18n';
	import { getChapter } from '$lib/chapters';
	import { progress } from '$lib/progress.svelte';
	import { path } from '$lib/path.svelte';
	import { parseRef, trackSequence, type Track, type TrackItem } from '$lib/tracks';
	import TrackPicker from './TrackPicker.svelte';
	// NOTE: lesson locking is temporarily disabled (see the menu list below), so `globalIndexOf`
	// and `progress.isUnlocked` are not imported for now.

	let menuOpen = $state(false);
	// The menu shows the chosen track. "Change track" swaps the list for the track picker.
	let picking = $state(false);
	$effect(() => {
		if (!menuOpen) picking = false;
	});

	const curChapter = $derived(page.params.chapter);
	const curLesson = $derived(page.params.lesson);
	const track = $derived(path.track);
	const seq = $derived(trackSequence(track));
	const doneN = $derived(seq.filter((r) => progress.isDone(r.chapterId, r.lessonId)).length);
	const pct = $derived(seq.length ? Math.round((doneN / seq.length) * 100) : 0);

	/** A track item resolved for display: a playable lesson, or a planned one. */
	function view(it: TrackItem) {
		if (typeof it !== 'string') return { soon: true as const, title: it.title[$lang] };
		const r = parseRef(it);
		if (!r) return null;
		const l = getChapter(r.chapterId)!.lessons.find((x) => x.id === r.lessonId)!;
		return { soon: false as const, ...r, title: l.text[$lang].title, section: l.section };
	}
	function switchTrack(tr: Track) {
		path.setTrack(tr.id);
		picking = false;
		const r = path.firstOpen(tr);
		if (r) go(r.chapterId, r.lessonId, true);
	}

	function go(chapterId: string, lessonId: string, unlocked: boolean) {
		if (!unlocked) return;
		menuOpen = false;
		if (chapterId === curChapter && lessonId === curLesson) return;
		goto(`/${chapterId}/${lessonId}`);
	}
	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') menuOpen = false;
	}
</script>

<svelte:window onkeydown={onKey} />

<button
	type="button"
	onclick={() => (menuOpen = true)}
	aria-label={$t.lessons}
	class="header-btn flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink backdrop-blur transition-colors"
>
	<svg
		width="17"
		height="17"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2.2"
		stroke-linecap="round"
		aria-hidden="true"
	>
		<path d="M4 7h16M4 12h16M4 17h16" />
	</svg>
</button>

{#if menuOpen}
	<div
		class="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
		transition:fade={{ duration: 180 }}
		onclick={() => (menuOpen = false)}
		role="presentation"
	></div>

	<aside
		class="fixed inset-y-0 left-0 z-50 flex w-[84%] max-w-[330px] flex-col bg-paper shadow-2xl"
		transition:fly={{ x: -360, duration: 260 }}
		aria-label={$t.lessons}
	>
		<!-- header with overall progress -->
		<div class="px-5 pt-[max(1.1rem,env(safe-area-inset-top))] pb-4">
			<div class="flex items-center justify-between">
				<p class="font-display text-lg font-semibold text-ink">
					{picking ? $t.tracks : $t.termTrack.replace('{name}', track.title[$lang])}
				</p>
				<button
					type="button"
					onclick={() => (menuOpen = false)}
					aria-label="Close"
					class="header-btn -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-faint transition-colors hover:text-ink"
				>
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.4"
						stroke-linecap="round"
						aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" /></svg
					>
				</button>
			</div>
			<div class="mt-3 flex items-center gap-2.5">
				<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
					<div
						class="h-full rounded-full bg-brand transition-all duration-500"
						style="width:{pct}%"
					></div>
				</div>
				<span class="text-[11px] font-semibold text-faint tabular-nums">{doneN}/{seq.length}</span>
			</div>
			<button
				type="button"
				onclick={() => (picking = !picking)}
				class="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[12px] font-semibold text-muted transition-colors hover:text-ink"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.4"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
					><path d={picking ? 'M15 6l-6 6 6 6' : 'M7 7h11l-3 3M17 17H6l3 3'} /></svg
				>
				{picking ? $t.back : $t.changeTrack}
			</button>
		</div>

		{#if picking}
			<div class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
				<TrackPicker compact onpick={switchTrack} current={track.id} />
			</div>
		{:else}
			<nav class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
				{#each track.groups as g, gi (gi)}
					{@const items = g.items.map(view).filter((v) => v !== null)}
					{@const gDone = items.filter(
						(v) => !v.soon && progress.isDone(v.chapterId, v.lessonId)
					).length}
					{@const gReady = items.filter((v) => !v.soon).length}
					<section class="mb-2">
						<!-- group header (a chapter in General, a topic group in the other tracks) -->
						<div class="flex items-center gap-2.5 py-1.5">
							<span
								class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
								style="background: color-mix(in srgb, {track.color} 14%, transparent); color: {track.color};"
							>
								{#if g.number}
									{g.number}
								{:else}
									<svg
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="currentColor"
										aria-hidden="true"
										><path
											d={g.basecamp
												? 'M12 4l9 15H3Z'
												: 'M12 3.5l2.6 5.2 5.8.85-4.2 4.1 1 5.75L12 21.7l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85Z'}
										/></svg
									>
								{/if}
							</span>
							<span class="flex-1 font-display text-sm font-semibold text-ink"
								>{g.title[$lang]}</span
							>
							<span class="text-[11px] text-faint tabular-nums">{gDone}/{gReady}</span>
						</div>
						{#if g.basecamp && (gi === 0 || !track.groups[gi - 1].basecamp)}
							<p class="-mt-1 mb-1 pl-8.5 text-[11px] text-faint">{$t.basecampNote}</p>
						{/if}

						<!-- lessons, indented under a guide line -->
						<div class="ml-3 border-l border-line pl-3">
							{#each items as v, i (i)}
								{#if v.soon}
									<div
										class="my-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] leading-snug text-faint"
									>
										<span class="flex h-4 w-4 shrink-0 items-center justify-center">
											<span class="h-1.5 w-1.5 rounded-full bg-faint/60"></span>
										</span>
										<span class="min-w-0 flex-1">{v.title}</span>
										<span
											class="shrink-0 rounded-full bg-line px-1.5 py-px text-[9.5px] font-bold tracking-wide uppercase"
											>{$t.trackSoon}</span
										>
									</div>
								{:else}
									{@const ch = { id: v.chapterId }}
									{@const l = {
										id: v.lessonId,
										section: track.id === 'general' ? v.section : undefined
									}}
									{@const prev = i > 0 ? items[i - 1] : null}
									{@const isDoneL = progress.isDone(ch.id, l.id)}
									<!-- Lesson locking temporarily disabled so any lesson is reachable without
							     finishing the previous one. To restore sequential unlocking, re-add the
							     globalIndexOf import and set unlocked via
							     progress.isUnlocked(globalIndexOf(ch.id, l.id)) instead of true. -->
									{@const unlocked = true}
									{@const current = ch.id === curChapter && l.id === curLesson}
									{@const newSection =
										l.section && l.section !== (prev && !prev.soon ? prev.section : undefined)}
									{#if newSection}
										<div
											class="mt-2 mb-0.5 flex items-center gap-1.5 pl-0.5 text-[10.5px] font-bold tracking-wider text-faint uppercase"
										>
											<svg
												width="11"
												height="11"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												stroke-width="2.4"
												stroke-linecap="round"
												aria-hidden="true"><path d="M7 4v7a4 4 0 0 0 4 4h7" /></svg
											>
											{l.section}
										</div>
									{/if}
									<div class={l.section ? 'ml-1.5 border-l border-line pl-2.5' : ''}>
										<button
											type="button"
											onclick={() => go(ch.id, l.id, unlocked)}
											disabled={!unlocked && !current}
											aria-current={current ? 'page' : undefined}
											title={unlocked ? undefined : $t.locked}
											class="my-0.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] leading-snug transition-colors {current
												? 'bg-brand-soft font-semibold text-brand'
												: isDoneL
													? 'text-muted hover:bg-card'
													: unlocked
														? 'text-ink hover:bg-card'
														: 'cursor-not-allowed text-faint'}"
										>
											<span class="flex h-4 w-4 shrink-0 items-center justify-center">
												{#if current}
													<svg
														width="9"
														height="9"
														viewBox="0 0 24 24"
														fill="currentColor"
														aria-hidden="true"><path d="M7 5l12 7-12 7Z" /></svg
													>
												{:else if isDoneL}
													<svg
														class="text-grass"
														width="14"
														height="14"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="3"
														stroke-linecap="round"
														stroke-linejoin="round"
														aria-hidden="true"><path d="M5 13l4 4L19 7" /></svg
													>
												{:else if unlocked}
													<span class="h-2.5 w-2.5 rounded-full border-[1.5px] border-faint/70"
													></span>
												{:else}
													<svg
														width="12"
														height="12"
														viewBox="0 0 24 24"
														fill="none"
														stroke="currentColor"
														stroke-width="2"
														stroke-linecap="round"
														stroke-linejoin="round"
														aria-hidden="true"
														class="opacity-70"
														><rect x="5" y="11" width="14" height="9" rx="2" /><path
															d="M8 11V8a4 4 0 0 1 8 0v3"
														/></svg
													>
												{/if}
											</span>
											<span class="truncate">{v.title}</span>
										</button>
									</div>
								{/if}
							{/each}
						</div>
					</section>
				{/each}
			</nav>
		{/if}
	</aside>
{/if}

<style>
	.header-btn {
		background: var(--header-btn-bg);
	}
	.header-btn:hover {
		background: var(--header-btn-hover);
	}
</style>
