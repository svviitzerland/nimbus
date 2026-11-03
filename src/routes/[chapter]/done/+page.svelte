<script lang="ts">
	import { goto } from '$app/navigation';
	import { lang, t } from '$lib/i18n';
	import { getChapter, getNextChapter } from '$lib/chapters';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Nim from '$lib/components/Nim.svelte';
	import TrackPicker from '$lib/components/TrackPicker.svelte';
	import { getTrack, type Track } from '$lib/tracks';
	import { path } from '$lib/path.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const chapter = $derived(getChapter(data.chapterId)!);
	const s = $derived(chapter.summary[$lang]);
	const next = $derived(getNextChapter(data.chapterId));

	// A finished topic track gets its own wrap up, with the other tracks to try next.
	const finished = $derived(getTrack(data.trackId));
	function pick(track: Track) {
		path.setTrack(track.id);
		const r = path.firstOpen(track);
		if (r) goto(`/${r.chapterId}/${r.lessonId}`);
	}

	function restart() {
		goto(`/${chapter.id}/${chapter.lessons[0].id}`);
	}
	function goNext() {
		if (next) goto(`/${next.id}/${next.lessons[0].id}`);
	}
</script>

<svelte:head>
	<title
		>Nimbus: {finished
			? $t.trackDoneTitle.replace('{name}', finished.title[$lang])
			: s.title}</title
	>
</svelte:head>

{#if finished}
	<main class="flex min-h-0 flex-1 flex-col overflow-y-auto">
		<div
			class="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-4 py-6 text-center md:px-6 md:py-8"
		>
			<div class="flex justify-center">
				<span style="view-transition-name: nim"><Nim mood="excited" size={68} /></span>
			</div>
			<h1 class="mt-2.5 font-display text-2xl font-medium text-ink md:mt-4 md:text-4xl">
				{$t.trackDoneTitle.replace('{name}', finished.title[$lang])}
			</h1>
			<p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted md:text-base">
				{$t.trackDoneSub}
			</p>
			<div class="mt-6">
				<TrackPicker onpick={pick} current={finished.id} />
			</div>
		</div>
	</main>
{:else}
	<main class="flex min-h-0 flex-1 flex-col overflow-y-auto">
		<div
			class="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-5 text-center md:px-6 md:py-8"
		>
			<div class="flex justify-center">
				<span style="view-transition-name: nim"><Nim mood="happy" size={68} /></span>
			</div>
			<h1 class="mt-2.5 font-display text-2xl font-medium text-ink md:mt-4 md:text-4xl">
				{s.title}
			</h1>
			<p class="mt-1 text-sm text-muted md:mt-2 md:text-base">{s.sub}</p>
			<ul
				class="mx-auto mt-3.5 max-w-sm space-y-2 rounded-2xl border border-line bg-card p-4 text-left md:mt-5 md:space-y-3 md:p-5"
			>
				{#each s.items as item (item)}
					<li class="flex gap-2.5 text-[12.5px] leading-snug md:text-sm">
						<span class="mt-px font-bold text-grass">✓</span><span class="text-muted"
							>{@html item}</span
						>
					</li>
				{/each}
			</ul>
			<p
				class="mx-auto mt-3.5 max-w-sm text-[12px] leading-relaxed text-faint md:mt-5 md:text-[13px]"
			>
				{@html s.nextNote}
			</p>
			{#if next}
				<div class="mt-4 flex flex-col items-center gap-2 md:mt-6 md:gap-3">
					<CallToActionButton onclick={goNext}>
						{next.unnumbered
							? next.title[$lang]
							: `${$t.chapter} ${next.number}: ${next.title[$lang]}`}
					</CallToActionButton>
					<button
						onclick={restart}
						class="text-xs text-faint transition-colors hover:text-ink md:text-[13px]"
						>{s.restart}</button
					>
				</div>
			{:else}
				<CallToActionButton onclick={restart}>
					{s.restart}
				</CallToActionButton>
			{/if}
		</div>
	</main>
{/if}
