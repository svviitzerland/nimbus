<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import { lang, t } from '$lib/i18n';
	import { getChapter } from '$lib/chapters';
	import { progress } from '$lib/progress.svelte';
	import { path } from '$lib/path.svelte';
	import type { LessonRef } from '$lib/tracks';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const chapter = $derived(getChapter(data.chapterId)!);
	const lesson = $derived(chapter.lessons[data.index]);
	const Stage = $derived(lesson.stage);
	const text = $derived(lesson.text[$lang]);
	// "Next" both paginates the narrative beats and, on the last beat, advances the lesson.
	let beat = $state(0);
	let reaction = $state<string | null>(null);
	let reactionToken = $state<string | null>(null);
	// Which lesson reported its step as done. Keyed by lesson (not a plain flag) because a guided
	// stage calls oncomplete() as it mounts, which runs before the reset effect below; a flag
	// would be wiped right after it was set and Next would stay locked.
	let completedFor = $state<string | null>(null);
	const completed = $derived(completedFor === data.lessonId);
	// A stage can lock Next (during an intro animation) and ask to be shown on an early beat.
	let locked = $state(false);
	let shown = $state(false);
	// reset when the lesson (URL) changes
	$effect(() => {
		void data.lessonId;
		beat = 0;
		reaction = null;
		reactionToken = null;
		// coming back from a detour lands on the beat the learner left from
		untrack(() => {
			path.adoptVariant({ chapterId: data.chapterId, lessonId: data.lessonId });
			const resume = path.takeResumeBeat();
			if (resume !== null) beat = Math.min(resume, text.intro.length - 1);
		});
	});

	const here = $derived<LessonRef>({ chapterId: data.chapterId, lessonId: data.lessonId });
	// A detour is live while the learner is somewhere other than the lesson they jumped from.
	const detour = $derived(
		path.detour &&
			!(
				path.detour.from.chapterId === data.chapterId && path.detour.from.lessonId === data.lessonId
			)
			? path.detour
			: null
	);
	const detourTitle = $derived.by(() => {
		if (!detour) return '';
		const c = getChapter(detour.from.chapterId);
		return c?.lessons.find((l) => l.id === detour.from.lessonId)?.text[$lang].title ?? '';
	});
	// Every track walks its own playlist (Dari Nol included). A lesson outside the chosen track,
	// reached from the menu of another track, falls back to the classic chapter order.
	const inTrack = $derived(path.includes(here));
	const group = $derived(inTrack ? path.groupOf(here) : undefined);
	const go = (r: LessonRef) => goto(`/${r.chapterId}/${r.lessonId}`);

	function jump(ref: LessonRef) {
		path.startDetour(here, beat);
		go(ref);
	}
	function returnFromDetour() {
		const back = path.endDetour();
		if (back) go(back);
	}

	const isLastBeat = $derived(beat >= text.intro.length - 1);
	const isLastLesson = $derived(
		inTrack && !detour ? path.next(here) === 'end' : data.index === data.total - 1
	);
	const canNext = $derived(!((isLastBeat && !completed) || locked));
	const final = $derived(isLastLesson && isLastBeat);
	const canBack = $derived(beat > 0 || (inTrack ? path.prev(here) !== undefined : data.index > 0));
	const message = $derived(reaction ?? text.intro[Math.min(beat, text.intro.length - 1)]);
	// "Your turn": on the last beat, before the step is finished, the stage is what matters, so
	// Nim steps out (on phones, after a brief moderator-style peek). This also covers reactions:
	// each one pops in, is readable, then tucks away so a stage you play with repeatedly stays
	// clear. Once the step is complete, Nim stays put with the wrap-up and the Next button.
	const aside = $derived(isLastBeat && !completed);
	// Stage stays locked + dimmed while Nim is still narrating; it unlocks on the last beat,
	// the one that invites interaction, or earlier if the stage asks to be shown (an intro).
	const stageActive = $derived(isLastBeat || shown);
	// Nim's face: a reaction mood if one is showing, else this beat's mood, else the lesson default.
	const currentMood = $derived(
		(reactionToken ? lesson.reactionMood?.[reactionToken] : undefined) ??
			lesson.moods?.[Math.min(beat, (lesson.moods?.length ?? 1) - 1)] ??
			lesson.mood
	);

	function onComplete() {
		completedFor = data.lessonId;
	}
	function onLock(v: boolean) {
		locked = v;
	}
	function onShow(v: boolean) {
		shown = v;
	}
	function onState(s: string) {
		reactionToken = s;
		reaction = text.reactions[s] ?? null;
	}
	function next() {
		reaction = null;
		reactionToken = null;
		if (beat < text.intro.length - 1) {
			beat += 1;
			return;
		}
		// finishing the last beat completes the lesson (Next is locked until the step is done),
		// which unlocks the next lesson in the menu and persists to localStorage
		progress.markDone(data.chapterId, data.lessonId);
		shown = false;
		locked = false;
		// finishing a detour lesson brings the learner straight back to where they jumped from
		if (detour) return returnFromDetour();
		if (inTrack) {
			const n = path.next(here);
			if (n === 'end') goto(`/${chapter.id}/done?track=${path.track.id}`);
			else if (n) go(n);
			return;
		}
		if (isLastLesson) goto(`/${chapter.id}/done`);
		else goto(`/${chapter.id}/${chapter.lessons[data.index + 1].id}`);
	}
	function back() {
		reaction = null;
		reactionToken = null;
		if (beat > 0) {
			beat -= 1;
			return;
		}
		shown = false;
		locked = false;
		if (inTrack) {
			const p = path.prev(here);
			if (p) go(p);
			return;
		}
		if (data.index > 0) goto(`/${chapter.id}/${chapter.lessons[data.index - 1].id}`);
	}
	function onKey(e: KeyboardEvent) {
		if (e.code !== 'Space') return;
		// Don't hijack the space bar when the learner is typing into a field or focused on a
		// control (e.g. typing "cd documents" in the CLI lesson, where a space is part of the input).
		const el = e.target as HTMLElement | null;
		const tag = el?.tagName;
		if (
			tag === 'INPUT' ||
			tag === 'TEXTAREA' ||
			tag === 'SELECT' ||
			tag === 'BUTTON' ||
			el?.isContentEditable
		)
			return;
		e.preventDefault();
		if (canNext) next();
	}
</script>

<svelte:head>
	<title>Nimbus: {text.title}</title>
</svelte:head>

<svelte:window onkeydown={onKey} />

<main class="relative flex min-h-0 flex-1 flex-col">
	<!-- Title band (in normal flow, never overlaps the stage) -->
	<div class="shrink-0 px-4 pt-3 pb-1 text-center">
		{#if detour}
			<button
				type="button"
				onclick={returnFromDetour}
				class="mb-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[12px] font-semibold text-ink shadow-sm transition-colors hover:border-brand hover:text-brand"
			>
				<svg
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.6"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg
				>
				<span class="truncate">{$t.backTo.replace('{title}', detourTitle)}</span>
			</button>
		{/if}
		<p class="text-[11px] font-semibold tracking-widest text-faint uppercase">
			{group && path.track.id === 'general'
				? `${$t.chapter} ${group.index + 1}: ${group.group.title[$lang]}`
				: inTrack
					? $t.termTrack.replace('{name}', path.track.title[$lang])
					: chapter.unnumbered
						? chapter.title[$lang]
						: `${$t.chapter} ${chapter.number}: ${chapter.title[$lang]}`}
		</p>
		<h1 class="mt-1 font-display text-2xl font-medium text-ink md:text-[1.9rem]">{text.title}</h1>
	</div>

	<!-- Stage. Sits between the title and Nim's dock and scrolls if a stage is taller than the room left. -->
	<section
		class="flex min-h-0 flex-1 items-start justify-center overflow-x-hidden overflow-y-auto px-4 pt-2 pb-3 md:px-8 md:pt-4 md:pb-4"
	>
		{#key data.lessonId}
			<div class="stage-in h-full w-full">
				<div
					class="flex h-full w-full items-start justify-center transition-opacity duration-300 {stageActive
						? ''
						: 'pointer-events-none opacity-40 select-none'}"
				>
					<Stage
						{text}
						{beat}
						oncomplete={onComplete}
						onstate={onState}
						onlock={onLock}
						onshow={onShow}
					/>
				</div>
			</div>
		{/key}
	</section>

	<!-- Nim's dialogue dock: in the normal flow under the stage, so it never covers the stage.
	     Safe-area padding keeps it clear of the phone's home bar. -->
	<div class="shrink-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:pb-5">
		<SpeechBubble
			nim={message}
			mood={currentMood}
			{canNext}
			{canBack}
			{final}
			{aside}
			step={Math.min(beat, text.intro.length - 1)}
			steps={text.intro.length}
			onnext={next}
			onback={back}
			onjump={jump}
		/>
	</div>
</main>

<style>
	:global(.stage-in) {
		animation: stage-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes stage-in {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.985);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
