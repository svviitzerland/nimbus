<script lang="ts">
	// The crossroads at the end of Dari Nol. The learner taps a branch (a topic track) to hear what
	// it covers, then steps into it. The pick becomes their track, so Next, Back, and the menu
	// follow that branch from then on.
	import { goto } from '$app/navigation';
	import { lang } from '$lib/i18n';
	import { path } from '$lib/path.svelte';
	import { progress } from '$lib/progress.svelte';
	import type { Track } from '$lib/tracks';
	import type { StageProps } from '$lib/chapters/types';
	import type { CrossroadsText } from '$lib/chapters/capstone/types';
	import TrackPicker from '../TrackPicker.svelte';
	import CallToActionButton from '../CallToActionButton.svelte';

	let { text, oncomplete, onstate }: StageProps = $props();
	const tx = $derived(text as CrossroadsText);

	let picked = $state<Track | null>(null);
	let done = false;

	function pick(track: Track) {
		picked = track;
		onstate?.(track.id);
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
	function enter() {
		if (!picked) return;
		progress.markDone('capstone', 'crossroads');
		path.cancelDetour();
		path.setTrack(picked.id);
		goto(path.entryUrl(picked));
	}
</script>

<div
	class="flex h-full w-full flex-col items-center justify-center-safe gap-4 overflow-y-auto pb-28 md:pb-6"
>
	<div class="w-full max-w-2xl">
		<TrackPicker topicsOnly onpick={pick} selected={picked?.id} />
	</div>
	{#if picked}
		<CallToActionButton onclick={enter}>
			{tx.enter.replace('{name}', picked.title[$lang])}
		</CallToActionButton>
	{:else}
		<p class="text-[12.5px] text-faint">{tx.hint}</p>
	{/if}
</div>
