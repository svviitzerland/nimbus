<script lang="ts">
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { lang, t, setLang } from '$lib/i18n';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Nim from '$lib/components/Nim.svelte';
	import ProgressDots from '$lib/components/ProgressDots.svelte';
	import TrackPicker from '$lib/components/TrackPicker.svelte';
	import { path } from '$lib/path.svelte';
	import type { Track } from '$lib/tracks';

	let beat = $state(0);
	// on a phone, Nim adds a cheeky note recommending a bigger screen, and sizing adapts
	let small = $state(false);
	$effect(() => {
		const mq = window.matchMedia('(max-width: 767px)');
		small = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (small = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});
	// The last welcome line asks where to start, and the track picker appears under it. On a phone
	// the "bigger screen" note slots in just before that question.
	const lines = $derived(
		small ? [...$t.welcome.slice(0, -1), $t.welcomeMobile, ...$t.welcome.slice(-1)] : $t.welcome
	);
	const shown = $derived(Math.min(beat, lines.length - 1));
	const isLast = $derived(beat >= lines.length - 1);

	function next() {
		if (!isLast) beat += 1;
	}
	function pick(track: Track) {
		path.setTrack(track.id);
		path.cancelDetour();
		const r = path.firstOpen(track);
		// The view transition in the root layout glides Nim from here to the lesson corner.
		if (r) goto(`/${r.chapterId}/${r.lessonId}`);
	}
	function onKey(e: KeyboardEvent) {
		if (e.code === 'Space' && !isLast) {
			e.preventDefault();
			next();
		}
	}
</script>

<svelte:head>
	<title
		>{$lang === 'id'
			? 'Nimbus, belajar teknologi sambil main'
			: 'Nimbus, learn tech by playing'}</title
	>
</svelte:head>

<svelte:window onkeydown={onKey} />

<div
	class="relative flex min-h-dvh flex-col overflow-x-hidden"
	style="background: radial-gradient(120% 90% at 75% 8%, var(--bg-grad-1) 0%, var(--bg-grad-2) 55%, var(--bg-grad-3) 100%);"
>
	<header
		class="z-20 flex shrink-0 items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] md:px-8"
	>
		<span class="font-display text-lg font-semibold tracking-tight">Nimbus</span>
		<div class="flex items-center gap-2">
			<ThemeToggle />
			<div
				class="flex items-center gap-0.5 rounded-full border border-line p-0.5 text-[11px] font-bold backdrop-blur"
				style="background: var(--header-btn-bg);"
			>
				<button
					onclick={() => setLang('id')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'id'
						? 'text-white'
						: 'text-faint hover:text-ink'}"
					style={$lang === 'id' ? 'background: var(--toggle-active);' : ''}
				>
					ID
				</button>
				<button
					onclick={() => setLang('en')}
					class="rounded-full px-2 py-0.5 transition-colors {$lang === 'en'
						? 'text-white'
						: 'text-faint hover:text-ink'}"
					style={$lang === 'en' ? 'background: var(--toggle-active);' : ''}
				>
					EN
				</button>
			</div>
		</div>
	</header>

	<main class="flex flex-1 flex-col items-center justify-center gap-1 px-4 pb-10 md:px-5">
		<!-- Nim, bobbing (glides to the lesson corner via the view transition) -->
		<div class="float shrink-0" style="view-transition-name: nim">
			<Nim
				mood={isLast ? 'excited' : 'happy'}
				size={isLast ? (small ? 96 : 120) : small ? 128 : 164}
			/>
		</div>

		<!-- speech cloud -->
		<div class="w-full max-w-md" style="filter: drop-shadow(0 16px 32px rgba(22,40,60,0.13));">
			<div class="relative rounded-[30px] bg-card">
				<!-- puffs: a little tail rising toward Nim, plus soft cloud edges -->
				<span class="absolute -top-3 left-1/2 h-9 w-9 -translate-x-1/2 rounded-full bg-card"></span>
				<span class="absolute -top-7 left-[41%] h-5 w-5 rounded-full bg-card"></span>
				<span class="absolute -top-10 left-[45%] h-3 w-3 rounded-full bg-card"></span>
				<span class="absolute -top-2 left-9 h-6 w-6 rounded-full bg-card"></span>
				<span class="absolute -top-2 right-11 h-5 w-5 rounded-full bg-card"></span>
				<span class="absolute -bottom-2.5 left-12 h-4 w-4 rounded-full bg-card"></span>
				<span class="absolute right-16 -bottom-2.5 h-3 w-3 rounded-full bg-card"></span>

				<div class="relative px-6 py-5 md:px-7 md:py-6">
					<p class="text-[11px] font-bold tracking-widest text-brand uppercase">Nim</p>
					{#key shown}
						<p
							in:fade={{ duration: 220 }}
							class="mt-1.5 min-h-[6.5rem] text-[15.5px] leading-relaxed text-ink/90 md:min-h-[5rem]"
						>
							{@html lines[shown]}
						</p>
					{/key}

					<div class="mt-3.5 flex items-center justify-between md:mt-4">
						<ProgressDots total={lines.length} current={beat} />
						<button
							onclick={next}
							class="{isLast
								? 'invisible'
								: ''} rounded-xl bg-brand px-7 py-2.5 text-sm font-semibold text-white shadow-[0_3px_0_rgba(28,74,160,0.5)] transition-all hover:brightness-110 active:translate-y-0.5 active:shadow-[0_1px_0_rgba(28,74,160,0.5)]"
						>
							{$t.next}
						</button>
					</div>
				</div>
			</div>
		</div>

		{#if isLast}
			<div class="mt-6 w-full max-w-2xl">
				<TrackPicker onpick={pick} current={path.chosen ? path.track.id : undefined} />
			</div>
		{/if}
	</main>

	<p
		class="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] text-faint {isLast
			? 'hidden'
			: ''}"
	>
		{#if $lang === 'id'}
			{small ? 'Ketuk Lanjut untuk mulai' : 'Tekan Spasi atau klik untuk lanjut'}
		{:else}
			{small ? 'Tap Next to begin' : 'Press Space or click to continue'}
		{/if}
	</p>
</div>

<style>
	.float {
		animation: float 3s ease-in-out infinite;
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-9px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.float {
			animation: none;
		}
	}
</style>
